import { Response } from "express";
import { DashboardService } from "../services/dashboard.service";
import { AuthRequest } from "../middleware/auth.middleware";

const dashboardService = new DashboardService();

export class DashboardController {
  async me(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const data = await dashboardService.getMe(req.user.id);
      return res.json(data);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async summary(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const data = await dashboardService.getSummary(req.user.id);
      return res.json(data);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
