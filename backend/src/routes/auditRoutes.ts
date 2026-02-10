import { Router } from "express";
import { auditController } from "../controllers";
import {
  authenticate,
  requireOrgAdmin,
  idValidation,
  paginationValidation,
} from "../middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get my audit logs
router.get("/my-logs", paginationValidation, auditController.getMyAuditLogs);

// Get audit statistics (admin only)
router.get("/stats", requireOrgAdmin, auditController.getAuditStats);

// Get all audit logs (admin only)
router.get(
  "/",
  requireOrgAdmin,
  paginationValidation,
  auditController.getAuditLogs,
);

// Get specific audit log
router.get("/:id", idValidation, auditController.getAuditLog);

export default router;
