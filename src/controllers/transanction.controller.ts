import { Response } from "express";
import { TransactionService } from "../services/transaction.service";
import { AuthRequest } from "../middleware/auth.middleware";

const transactionService = new TransactionService();

export class TransactionController {
  async deposit(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      const { accountId, amount, reference } = req.body;
      const parsedAmount = Number(amount);

      if (!accountId || isNaN(parsedAmount)) {
        return res.status(400).json({ error: "accountId and amount are required" });
      }

      const result = await transactionService.deposit(
        req.user.id,
        Number(accountId),
        parsedAmount,
        reference
      );

      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async withdraw(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      const { accountId, amount, reference } = req.body;
      const parsedAmount = Number(amount);

      if (!accountId || isNaN(parsedAmount)) {
        return res.status(400).json({ error: "accountId and amount are required" });
      }

      const result = await transactionService.withdraw(
        req.user.id,
        Number(accountId),
        parsedAmount,
        reference
      );

      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async transfer(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      const { fromAccountId, toAccountId, amount, reference } = req.body;
      const parsedAmount = Number(amount);

      if (!fromAccountId || !toAccountId || isNaN(parsedAmount)) {
        return res
          .status(400)
          .json({ error: "fromAccountId, toAccountId and amount are required" });
      }

      const result = await transactionService.transfer(
        req.user.id,
        Number(fromAccountId),
        Number(toAccountId),
        parsedAmount,
        reference
      );

      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      const accountId = Number(req.params.accountId);
      if (isNaN(accountId)) {
        return res.status(400).json({ error: "Invalid account id" });
      }

      const txns = await transactionService.getTransactionsForAccount(
        req.user.id,
        accountId
      );

      return res.json(txns);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
