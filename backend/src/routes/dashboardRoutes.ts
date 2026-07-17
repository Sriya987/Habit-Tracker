import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { getTodayDashboard,getWeeklyDashboard,getStreakDashboard,getMonthlyDashboard } from "../controllers/dashboardController";

const router = Router();

router.get(
  "/today",
  authenticate,
  getTodayDashboard
);

router.get(
  "/monthly",
  authenticate,
  getMonthlyDashboard
);

router.get(
  "/weekly",
  authenticate,
  getWeeklyDashboard
);

router.get(
  "/streak",
  authenticate,
  getStreakDashboard
);

export default router;