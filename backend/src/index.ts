import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config } from "./config";
import { initDatabase } from "./database";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware";

const app: Application = express();

// Initialize database
initDatabase().catch((error) => {
  console.error("Failed to initialize database:", error);
  process.exit(1);
});

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (config.cors.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

 
// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logger
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Root route
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Internal Technical Support Assistant API",
    version: "1.0.0",
    documentation: "/api/health",
  });
});

// API routes
app.use("/api", limiter, routes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(`🚀 Server running in ${config.nodeEnv} mode`);
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log("=".repeat(50));
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

export default app;
