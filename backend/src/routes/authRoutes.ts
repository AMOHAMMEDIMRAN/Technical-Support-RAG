import { Router } from "express";
import { authController } from "../controllers";
import { authenticate, loginValidation } from "../middleware";

const router = Router();

// Public routes
router.post("/login", loginValidation, authController.login);

// Protected routes
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, authController.updateProfile);
router.post("/change-password", authenticate, authController.changePassword);
router.post("/logout", authenticate, authController.logout);

export default router;
