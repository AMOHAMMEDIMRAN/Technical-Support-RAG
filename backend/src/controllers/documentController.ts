import { Response } from "express";
import { Document } from "../models";
import { AuthRequest, DocumentAccessLevel, UserRole } from "../types";
import { catchAsync } from "../middleware";
import { getPaginationParams, getSkipValue, getPaginationMeta } from "../utils";
import { createAuditLog } from "../middleware/auditLogger";
import { AuditAction } from "../types";

export const uploadDocument = catchAsync(
  async (req: AuthRequest, res: Response) => {
    // This assumes multer middleware is used for file upload
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    const { accessLevel, allowedRoles, allowedUsers, metadata } = req.body;

    const document = await Document.create({
      organizationId: req.user!.organizationId,
      uploadedBy: req.user!.id,
      fileName: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      accessLevel: accessLevel || DocumentAccessLevel.PUBLIC,
      allowedRoles: allowedRoles ? JSON.parse(allowedRoles) : [],
      allowedUsers: allowedUsers ? JSON.parse(allowedUsers) : [],
      metadata: metadata ? JSON.parse(metadata) : {},
    });

    // Log audit
    await createAuditLog({
      organizationId: req.user!.organizationId!,
      userId: req.user!.id,
      action: AuditAction.UPLOAD,
      resource: "document",
      resourceId: document._id.toString(),
      details: { fileName: file.originalname, fileSize: file.size },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  },
);

export const getDocuments = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req.query);
    const { search, category } = req.query;

    const query: any = {
      organizationId: req.user!.organizationId,
    };

    // Access control filter
    query.$or = [
      { accessLevel: DocumentAccessLevel.PUBLIC },
      { allowedRoles: req.user!.role },
      { allowedUsers: req.user!.id },
      { uploadedBy: req.user!.id },
    ];

    if (search) {
      query.$and = [
        query.$or ? { $or: query.$or } : {},
        {
          $or: [
            { originalName: { $regex: search, $options: "i" } },
            { "metadata.description": { $regex: search, $options: "i" } },
            { "metadata.tags": { $regex: search, $options: "i" } },
          ],
        },
      ];
      delete query.$or;
    }

    if (category) {
      query["metadata.category"] = category;
    }

    const skip = getSkipValue(page!, limit!);
    const sortOptions: any = {};
    sortOptions[sortBy!] = sortOrder === "asc" ? 1 : -1;

    const [documents, total] = await Promise.all([
      Document.find(query)
        .populate("uploadedBy", "firstName lastName email")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit!),
      Document.countDocuments(query),
    ]);

    const pagination = getPaginationMeta(page!, limit!, total);

    return res.json({
      success: true,
      data: documents,
      pagination,
    });
  },
);

export const getDocument = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const document = await Document.findById(id).populate(
      "uploadedBy",
      "firstName lastName email",
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }

    // Check access
    const hasAccess =
      document.organizationId === req.user!.organizationId &&
      (document.accessLevel === DocumentAccessLevel.PUBLIC ||
        document.allowedRoles.includes(req.user!.role) ||
        document.allowedUsers.includes(req.user!.id) ||
        document.uploadedBy.toString() === req.user!.id ||
        req.user!.role === UserRole.SUPER_ADMIN ||
        req.user!.role === UserRole.CEO);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: "Access denied to this document",
      });
    }

    // Log audit
    await createAuditLog({
      organizationId: req.user!.organizationId!,
      userId: req.user!.id,
      action: AuditAction.READ,
      resource: "document",
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.json({
      success: true,
      data: document,
    });
  },
);

export const updateDocument = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { accessLevel, allowedRoles, allowedUsers, metadata } = req.body;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }

    // Only uploader or admin can update
    if (
      document.uploadedBy.toString() !== req.user!.id &&
      req.user!.role !== UserRole.CEO &&
      req.user!.role !== UserRole.SUPER_ADMIN
    ) {
      return res.status(403).json({
        success: false,
        error: "Only document uploader or admin can update",
      });
    }

    if (accessLevel) document.accessLevel = accessLevel;
    if (allowedRoles) document.allowedRoles = allowedRoles;
    if (allowedUsers) document.allowedUsers = allowedUsers;
    if (metadata) document.metadata = { ...document.metadata, ...metadata };

    await document.save();

    // Log audit
    await createAuditLog({
      organizationId: req.user!.organizationId!,
      userId: req.user!.id,
      action: AuditAction.UPDATE,
      resource: "document",
      resourceId: id,
      details: { accessLevel, allowedRoles, allowedUsers, metadata },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.json({
      success: true,
      message: "Document updated successfully",
      data: document,
    });
  },
);

export const deleteDocument = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }

    // Only uploader or admin can delete
    if (
      document.uploadedBy.toString() !== req.user!.id &&
      req.user!.role !== UserRole.CEO &&
      req.user!.role !== UserRole.SUPER_ADMIN
    ) {
      return res.status(403).json({
        success: false,
        error: "Only document uploader or admin can delete",
      });
    }

    // TODO: Delete actual file from filesystem
    // fs.unlinkSync(document.filePath);

    await Document.findByIdAndDelete(id);

    // Log audit
    await createAuditLog({
      organizationId: req.user!.organizationId!,
      userId: req.user!.id,
      action: AuditAction.DELETE,
      resource: "document",
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.json({
      success: true,
      message: "Document deleted successfully",
    });
  },
);

export const downloadDocument = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }

    // Check access (same as getDocument)
    const hasAccess =
      document.organizationId === req.user!.organizationId &&
      (document.accessLevel === DocumentAccessLevel.PUBLIC ||
        document.allowedRoles.includes(req.user!.role) ||
        document.allowedUsers.includes(req.user!.id) ||
        document.uploadedBy.toString() === req.user!.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: "Access denied to this document",
      });
    }

    // Log audit
    await createAuditLog({
      organizationId: req.user!.organizationId!,
      userId: req.user!.id,
      action: AuditAction.DOWNLOAD,
      resource: "document",
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    // Send file
    return res.download(document.filePath, document.originalName);
  },
);
