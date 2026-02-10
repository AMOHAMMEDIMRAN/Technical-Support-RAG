import mongoose, { Schema } from "mongoose";
import { IChat, ChatStatus } from "../types";

const messageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      sources: [String],
      confidence: Number,
    },
  },
  { _id: false },
);

const chatSchema = new Schema<IChat>(
  {
    organizationId: {
      type: String,
      ref: "Organization",
      required: true,
      index: true,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: "New Conversation",
    },
    status: {
      type: String,
      enum: Object.values(ChatStatus),
      default: ChatStatus.ACTIVE,
    },
    messages: [messageSchema],
    metadata: {
      tags: {
        type: [String],
        default: [],
      },
      category: String,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for efficient queries
chatSchema.index({ organizationId: 1, userId: 1 });
chatSchema.index({ status: 1, updatedAt: -1 });
chatSchema.index({ "metadata.tags": 1 });

export const Chat = mongoose.model<IChat>("Chat", chatSchema);
