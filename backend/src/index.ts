import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config } from "./config";
import { initDatabase } from "./database";
import { firewallMiddleware } from "./firewall";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware";

const app: Application = express();

const isPrivateNetworkOrigin = (origin: string): boolean => {
  try {
    const parsed = new URL(origin);
    const hostname = parsed.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return true;
    }

    const ipv4Match = hostname.match(
      /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
    );
    if (!ipv4Match) {
      return false;
    }

    const octets = ipv4Match.slice(1).map((part) => Number(part));
    const [a, b, c, d] = octets;

    if (octets.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
      return false;
    }

    if (a === 10) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 169 && b === 254) return true;

    return false;
  } catch {
    return false;
  }
};

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
      } else if (
        config.cors.allowPrivateNetworkOrigins &&
        isPrivateNetworkOrigin(origin)
      ) {
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

// In-app firewall
app.use(firewallMiddleware);

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
const HOST = config.host;

app.listen(Number(PORT), HOST, () => {
  console.log("=".repeat(50));
  console.log(`🚀 Server running in ${config.nodeEnv} mode`);
  console.log(`📡 Listening on ${HOST}:${PORT}`);
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
