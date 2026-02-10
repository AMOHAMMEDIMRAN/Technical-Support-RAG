import mongoose, { Schema } from "mongoose";
import { IAuditLog, AuditAction } from "../types";

const auditLogSchema = new Schema<IAuditLog>(
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
    action: {
      type: String,
      enum: Object.values(AuditAction),
      required: true,
    },
    resource: {
      type: String,
      required: true,
      index: true,
    },
    resourceId: String,
    details: Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  },
);

// Compound indexes for complex queries
auditLogSchema.index({ organizationId: 1, timestamp: -1 });
auditLogSchema.index({ userId: 1, action: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, action: 1 });

// TTL index - auto-delete logs older than 90 days (optional)
// auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", auditLogSchema);
