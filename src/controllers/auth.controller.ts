import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { fullName, email, password } = req.body;
      const data = await authService.register(fullName, email, password);
      return res.status(201).json(data);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      return res.json(data);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(401).json({ error: "Missing token" });

      const data = await authService.refresh(refreshToken);
      return res.json(data);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
