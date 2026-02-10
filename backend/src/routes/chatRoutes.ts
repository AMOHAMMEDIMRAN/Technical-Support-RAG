import { Router } from "express";
import { chatController } from "../controllers";
import {
  authenticate,
  requireOrganization,
  createChatValidation,
  sendMessageValidation,
  idValidation,
  paginationValidation,
} from "../middleware";
import { auditLogger } from "../middleware/auditLogger";
import { AuditAction } from "../types";

const router = Router();

// All routes require authentication and organization
router.use(authenticate);
router.use(requireOrganization);

// Get all chats for current user
router.get("/", paginationValidation, chatController.getChats);

// Create new chat
router.post(
  "/",
  createChatValidation,
  auditLogger(AuditAction.CREATE, "chat"),
  chatController.createChat,
);

// Get specific chat
router.get("/:id", idValidation, chatController.getChat);

// Send message in chat
router.post(
  "/:id/messages",
  idValidation,
  sendMessageValidation,
  chatController.sendMessage,
);

// Update chat
router.put("/:id", idValidation, chatController.updateChat);

// Delete chat
router.delete("/:id", idValidation, chatController.deleteChat);

// Archive chat
router.patch("/:id/archive", idValidation, chatController.archiveChat);

export default router;
