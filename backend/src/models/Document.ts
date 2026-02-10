import mongoose, { Schema } from "mongoose";
import { IDocument, DocumentAccessLevel, UserRole } from "../types";

const documentSchema = new Schema<IDocument>(
  {
    organizationId: {
      type: String,
      ref: "Organization",
      required: true,
      index: true,
    },
    uploadedBy: {
      type: String,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    accessLevel: {
      type: String,
      enum: Object.values(DocumentAccessLevel),
      default: DocumentAccessLevel.PUBLIC,
    },
    allowedRoles: {
      type: [String],
      enum: Object.values(UserRole),
      default: [],
    },
    allowedUsers: {
      type: [String],
      ref: "User",
      default: [],
    },
    metadata: {
      description: String,
      tags: {
        type: [String],
        default: [],
      },
      category: String,
    },
    isProcessed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
documentSchema.index({ organizationId: 1, uploadedBy: 1 });
documentSchema.index({ accessLevel: 1 });
documentSchema.index({ "metadata.tags": 1 });
documentSchema.index({ isProcessed: 1 });

export const Document = mongoose.model<IDocument>("Document", documentSchema);
