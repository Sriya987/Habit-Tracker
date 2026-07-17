import type { Priority } from "./task";

export interface DashboardSummary {
  plannedTasks: number;
  completedTasks: number;
  remainingTasks: number;
  plannedPoints: number;
  earnedPoints: number;
  remainingPoints: number;
  completionRate: number;
}

export interface DashboardTask {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  points: number;
  completed: boolean;
  completedAt: string | null;
}

export interface TodayDashboardResponse {
  success: boolean;
  summary: DashboardSummary;
  todayTasks: DashboardTask[];
  completedToday: DashboardTask[];
  pendingToday: DashboardTask[];
}

export interface WeeklyData {
  date: string;
  plannedPoints: number;
  earnedPoints: number;
  completionPercentage: number | null;
}

export interface WeeklyDashboardResponse {
  success: boolean;
  weekly: WeeklyData[];
}

export interface MonthlyData {
  date: string;
  plannedPoints: number;
  earnedPoints: number;
  completionPercentage: number | null;
}

export interface MonthlyDashboardResponse {
  success: boolean;
  monthly: MonthlyData[];
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  threshold: number;
  graceDays: number;
}

export interface StreakDashboardResponse {
  success: boolean;
  streak: StreakData;
}