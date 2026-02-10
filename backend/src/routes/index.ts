import { Router } from "express";
import authRoutes from "./authRoutes";
import organizationRoutes from "./organizationRoutes";
import userRoutes from "./userRoutes";
import chatRoutes from "./chatRoutes";
import documentRoutes from "./documentRoutes";
import auditRoutes from "./auditRoutes";

const router = Router();

// Health check
router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);
router.use("/users", userRoutes);
router.use("/chats", chatRoutes);
router.use("/documents", documentRoutes);
router.use("/audit-logs", auditRoutes);

export default router;
