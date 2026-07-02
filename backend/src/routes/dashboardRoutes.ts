import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { getTodayDashboard } from "../controllers/dashboardController";

const router = Router();

router.get(
  "/today",
  authenticate,
  getTodayDashboard
);

export default router;