import { Router } from "express";
import { firewallController } from "../controllers";
import { authenticate, requireOrgAdmin } from "../middleware";

const router = Router();

router.use(authenticate, requireOrgAdmin);

router.get("/config", firewallController.getConfig);
router.get("/stats", firewallController.getStats);
router.get("/users", firewallController.getFirewallUsers);
router.put("/config", firewallController.updateConfig);
router.post("/blocked-ips", firewallController.blockIp);
router.delete("/blocked-ips/:ip", firewallController.unblockIp);
router.post("/blocked-users", firewallController.blockUser);
router.delete("/blocked-users/:userId", firewallController.unblockUser);

export default router;
