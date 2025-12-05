import { Response } from "express";
import { AccountService } from "../services/account.service";
import { AuthRequest } from "../middleware/auth.middleware";

const accountService = new AccountService();

export class AccountController {
  async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { type } = req.body;
      const account = await accountService.createAccount(req.user.id, type);
      return res.status(201).json(account);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const accounts = await accountService.getUserAccounts(req.user.id);
      return res.json(accounts);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const accountId = Number(req.params.id);
      if (isNaN(accountId)) {
        return res.status(400).json({ error: "Invalid account id" });
      }

      const account = await accountService.getAccountByIdForUser(
        accountId,
        req.user.id,
        req.user.role === "admin"
      );

      return res.json(account);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const accountId = Number(req.params.id);
      const { status } = req.body;

      if (!["active", "locked"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const account = await accountService.updateAccountStatus(
        accountId,
        status
      );

      return res.json(account);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
