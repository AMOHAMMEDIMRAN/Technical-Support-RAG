import { Router } from "express";
import { documentController } from "../controllers";
import {
  authenticate,
  requireOrganization,
  updateDocumentValidation,
  idValidation,
  paginationValidation,
} from "../middleware";
import { auditLogger } from "../middleware/auditLogger";
import { AuditAction } from "../types";

const router = Router();

// All routes require authentication and organization
router.use(authenticate);
router.use(requireOrganization);

// Get all documents (with access control)
router.get("/", paginationValidation, documentController.getDocuments);

// Upload document
// Note: Add multer middleware here in actual implementation
router.post(
  "/",
  auditLogger(AuditAction.UPLOAD, "document"),
  documentController.uploadDocument,
);

// Get specific document
router.get("/:id", idValidation, documentController.getDocument);

// Update document metadata and permissions
router.put(
  "/:id",
  idValidation,
  updateDocumentValidation,
  documentController.updateDocument,
);

// Delete document
router.delete("/:id", idValidation, documentController.deleteDocument);

// Download document
router.get("/:id/download", idValidation, documentController.downloadDocument);

export default router;
