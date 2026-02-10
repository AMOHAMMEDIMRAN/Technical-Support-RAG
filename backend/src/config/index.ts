import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri:
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/tech-support-assistant",
  jwt: {
    secret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
  admin: {
    email: process.env.ADMIN_EMAIL || "admin123@gmail.com",
    password: process.env.ADMIN_PASSWORD || "admin123",
  },
  aiEngine: {
    url: process.env.AI_ENGINE_URL || "http://localhost:8000",
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760"), // 10MB default
    uploadPath: process.env.UPLOAD_PATH || "./uploads",
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:5173",
      "http://localhost:3000",
    ],
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  },
};
