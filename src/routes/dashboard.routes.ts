import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const controller = new DashboardController();

// All dashboard routes require auth
router.use(authMiddleware);

// GET /me – current user + accounts
router.get("/me", (req, res) => controller.me(req, res));

// GET /dashboard/summary – totals + recent transactions
router.get("/dashboard/summary", (req, res) => controller.summary(req, res));

export default router;
