import { Router } from "express";
import { userController } from "../controllers";
import {
  authenticate,
  requireOrgAdmin,
  requireOrganization,
  createUserValidation,
  updateUserValidation,
  idValidation,
  paginationValidation,
} from "../middleware";

const router = Router();

// All routes require authentication and organization
router.use(authenticate);
router.use(requireOrganization);

// Get all users (admins can see all in org, others see themselves)
router.get("/", paginationValidation, userController.getUsers);

// Create user (admin only)
router.post(
  "/",
  requireOrgAdmin,
  createUserValidation,
  userController.createUser,
);

// Get specific user
router.get("/:id", idValidation, userController.getUser);

// Update user
router.put(
  "/:id",
  idValidation,
  updateUserValidation,
  userController.updateUser,
);

// Delete user (admin only)
router.delete("/:id", idValidation, requireOrgAdmin, userController.deleteUser);

// Toggle user status (admin only)
router.patch(
  "/:id/toggle-status",
  idValidation,
  requireOrgAdmin,
  userController.toggleUserStatus,
);

export default router;
