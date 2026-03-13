import { Response } from "express";
import axios from "axios";
import { Chat } from "../models";
import { AuthRequest, ChatStatus } from "../types";
import { catchAsync } from "../middleware";
import { getPaginationParams, getSkipValue, getPaginationMeta } from "../utils";
import { createAuditLog } from "../middleware/auditLogger";
import { AuditAction } from "../types";

const RAG_API_BASE_URL =
  process.env.RAG_API_BASE_URL || "http://127.0.0.1:8000";
const RAG_API_TIMEOUT = parseInt(process.env.RAG_API_TIMEOUT || "30000", 10);

const ragClient = axios.create({
  baseURL: RAG_API_BASE_URL,
  timeout: RAG_API_TIMEOUT,
});

export const createChat = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { title, message } = req.body;

    const chat = await Chat.create({
      organizationId: req.user!.organizationId,
      userId: req.user!.id,
      title: title || "New Conversation",
      messages: [
        {
          role: "user",
          content: message,
          timestamp: new Date(),
        },
      ],
    });

    // Log audit
    await createAuditLog({
      organizationId: req.user!.organizationId!,
      userId: req.user!.id,
      action: AuditAction.CREATE,
      resource: "chat",
      resourceId: chat._id.toString(),
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.status(201).json({
      success: true,
      message: "Chat created successfully",
      data: chat,
    });
  },
);

export const getChats = catchAsync(async (req: AuthRequest, res: Response) => {
  const { page, limit, sortBy, sortOrder } = getPaginationParams(req.query);
  const { status } = req.query;

  const query: any = {
    userId: req.user!.id,
    organizationId: req.user!.organizationId,
  };

  if (status) query.status = status;

  const skip = getSkipValue(page!, limit!);
  const sortOptions: any = {};
  sortOptions[sortBy!] = sortOrder === "asc" ? 1 : -1;

  const [chats, total] = await Promise.all([
    Chat.find(query)
      .select("title status metadata createdAt updatedAt")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit!),
    Chat.countDocuments(query),
  ]);

  const pagination = getPaginationMeta(page!, limit!, total);

  res.json({
    success: true,
    data: chats,
    pagination,
  });
});

export const getChat = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const chat = await Chat.findOne({
    _id: id,
    userId: req.user!.id,
    organizationId: req.user!.organizationId,
  });

  if (!chat) {
    return res.status(404).json({
      success: false,
      error: "Chat not found",
    });
  }

  res.json({
    success: true,
    data: chat,
  });
});

export const sendMessage = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { message } = req.body;

    const chat = await Chat.findOne({
      _id: id,
      userId: req.user!.id,
      organizationId: req.user!.organizationId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: "Chat not found",
      });
    }

    // Add user message
    chat.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Call RAG/AI service for response
    let aiContent =
      "Sorry, I couldn't reach the AI service. Please try again shortly.";
    let aiMetadata: { sources?: string[]; confidence?: number } | undefined;

    try {
      const ragResponse = await ragClient.post("/ask", {
        question: message,
      });

      aiContent = ragResponse.data?.answer || aiContent;
      aiMetadata = {
        sources: ragResponse.data?.context,
        confidence: ragResponse.data?.confidence,
      };
    } catch (err) {
      console.error("RAG service error", err);
    }

    chat.messages.push({
      role: "assistant",
      content: aiContent,
      timestamp: new Date(),
      metadata: aiMetadata,
    });

    await chat.save();

    // Log audit
    await createAuditLog({
      organizationId: req.user!.organizationId!,
      userId: req.user!.id,
      action: AuditAction.CREATE,
      resource: "message",
      resourceId: chat._id.toString(),
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Message sent successfully",
      data: chat,
    });
  },
);

export const updateChat = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, status, metadata } = req.body;

    const chat = await Chat.findOne({
      _id: id,
      userId: req.user!.id,
      organizationId: req.user!.organizationId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: "Chat not found",
      });
    }

    if (title) chat.title = title;
    if (status) chat.status = status;
    if (metadata) chat.metadata = { ...chat.metadata, ...metadata };

    await chat.save();

    // Log audit
    await createAuditLog({
      organizationId: req.user!.organizationId!,
      userId: req.user!.id,
      action: AuditAction.UPDATE,
      resource: "chat",
      resourceId: id,
      details: { title, status, metadata },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Chat updated successfully",
      data: chat,
    });
  },
);

export const deleteChat = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const chat = await Chat.findOne({
      _id: id,
      userId: req.user!.id,
      organizationId: req.user!.organizationId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: "Chat not found",
      });
    }

    await Chat.findByIdAndDelete(id);

    // Log audit
    await createAuditLog({
      organizationId: req.user!.organizationId!,
      userId: req.user!.id,
      action: AuditAction.DELETE,
      resource: "chat",
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Chat deleted successfully",
    });
  },
);

export const archiveChat = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const chat = await Chat.findOne({
      _id: id,
      userId: req.user!.id,
      organizationId: req.user!.organizationId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: "Chat not found",
      });
    }

    chat.status = ChatStatus.ARCHIVED;
    await chat.save();

    res.json({
      success: true,
      message: "Chat archived successfully",
      data: chat,
    });
  },
);
