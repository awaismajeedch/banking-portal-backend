import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { TransactionController } from "../controllers/transanction.controller";

const router = Router();
const controller = new TransactionController();

// All transaction routes require auth
router.use(authMiddleware);

// Deposit into an account
router.post("/deposit", (req, res) => controller.deposit(req, res));

// Withdraw from an account
router.post("/withdraw", (req, res) => controller.withdraw(req, res));

// Transfer between accounts
router.post("/transfer", (req, res) => controller.transfer(req, res));

// Get transaction history for a given account
router.get("/:accountId", (req, res) => controller.list(req, res));

export default router;
