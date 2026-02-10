import { Router } from "express";
import { organizationController } from "../controllers";
import {
  authenticate,
  requireSuperAdmin,
  requireOrgAdmin,
  createOrganizationValidation,
  idValidation,
  paginationValidation,
} from "../middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create organization (authenticated user without org can create one)
router.post(
  "/",
  createOrganizationValidation,
  organizationController.createOrganization,
);

// Get my organization
router.get("/my-organization", organizationController.getMyOrganization);

// Get all organizations (super admin only)
router.get(
  "/",
  requireSuperAdmin,
  paginationValidation,
  organizationController.getAllOrganizations,
);

// Get specific organization
router.get("/:id", idValidation, organizationController.getOrganization);

// Update organization (org admin or super admin)
router.put(
  "/:id",
  idValidation,
  requireOrgAdmin,
  organizationController.updateOrganization,
);

// Delete organization (super admin only)
router.delete(
  "/:id",
  idValidation,
  requireSuperAdmin,
  organizationController.deleteOrganization,
);

export default router;
