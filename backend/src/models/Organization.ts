import mongoose, { Schema } from "mongoose";
import { IOrganization, UserRole } from "../types";

const organizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      unique: true,
    },
    domain: {
      type: String,
      required: [true, "Domain is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    adminUserId: {
      type: String,
      ref: "User",
      required: true,
    },
    settings: {
      maxUsers: {
        type: Number,
        default: 50,
      },
      allowedRoles: {
        type: [String],
        enum: Object.values(UserRole),
        default: [
          UserRole.CEO,
          UserRole.MANAGER,
          UserRole.DEVELOPER,
          UserRole.SUPPORT,
          UserRole.HR,
          UserRole.FINANCE,
        ],
      },
      features: {
        type: [String],
        default: ["chat", "document-upload", "audit-logs"],
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes (domain is already indexed via unique: true)
organizationSchema.index({ adminUserId: 1 });
organizationSchema.index({ isActive: 1 });

export const Organization = mongoose.model<IOrganization>(
  "Organization",
  organizationSchema,
);
