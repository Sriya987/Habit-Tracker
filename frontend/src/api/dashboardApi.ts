import api from "./axios";

import type {
  MonthlyDashboardResponse,
  StreakDashboardResponse,
  TodayDashboardResponse,
  WeeklyDashboardResponse,
} from "../types/dashboard";

export const getTodayDashboard =
  async (): Promise<TodayDashboardResponse> => {
    const response =
      await api.get<TodayDashboardResponse>(
        "/dashboard/today"
      );

    return response.data;
  };

export const getWeeklyDashboard =
  async (): Promise<WeeklyDashboardResponse> => {
    const response =
      await api.get<WeeklyDashboardResponse>(
        "/dashboard/weekly"
      );

    return response.data;
  };

export const getMonthlyDashboard =
  async (): Promise<MonthlyDashboardResponse> => {
    const response =
      await api.get<MonthlyDashboardResponse>(
        "/dashboard/monthly"
      );

    return response.data;
  };

export const getStreakDashboard =
  async (): Promise<StreakDashboardResponse> => {
    const response =
      await api.get<StreakDashboardResponse>(
        "/dashboard/streak"
      );

    return response.data;
  };