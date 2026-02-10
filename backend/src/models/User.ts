import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, UserRole, UserStatus } from "../types";

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.DEVELOPER,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    organizationId: {
      type: String,
      ref: "Organization",
      index: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_: any, ret: any) => {
        delete ret.password;
        return ret;
      },
    },
  },
);

// Index for faster queries
userSchema.index({ email: 1, organizationId: 1 });
userSchema.index({ role: 1, status: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
