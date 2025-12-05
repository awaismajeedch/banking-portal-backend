import { Router } from "express";
import { AccountController } from "../controllers/account.controller";
import { authMiddleware, requireAdmin } from "../middleware/auth.middleware";

const router = Router();
const controller = new AccountController();

// All routes below require authentication
router.use(authMiddleware);

// Create a new account for logged-in user
router.post("/", (req, res) => controller.create(req, res));

// Get all accounts of logged-in user
router.get("/", (req, res) => controller.list(req, res));

// Get specific account (owner or admin)
router.get("/:id", (req, res) => controller.getById(req, res));

// Admin: update status (lock/unlock)
router.patch("/:id/status", requireAdmin, (req, res) =>
  controller.updateStatus(req, res)
);

export default router;
