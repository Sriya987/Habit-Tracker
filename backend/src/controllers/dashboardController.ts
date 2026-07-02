import { Response } from "express";
import Task from "../models/Task";
import { AuthRequest } from "../middleware/authMiddleware";

export const getTodayDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Today's date (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Tomorrow's date (00:00:00)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tasks = await Task.find({
      userId: req.userId,
      plannedDate: {
        $gte: today,
        $lt: tomorrow,
      },
    })
      .select(
        "_id title description priority points completed completedAt plannedDate"
      )
      .sort({
        createdAt: 1,
      });

    let plannedTasks = 0;
    let completedTasks = 0;

    let plannedPoints = 0;
    let earnedPoints = 0;

    const todayTasks = [];
    const completedToday = [];
    const pendingToday = [];

    for (const task of tasks) {
      plannedTasks++;
      plannedPoints += task.points;

      const taskData = {
        id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        points: task.points,
        completed: task.completed,
        completedAt: task.completedAt,
      };

      todayTasks.push(taskData);

      if (task.completed) {
        completedTasks++;
        earnedPoints += task.points;
        completedToday.push(taskData);
      } else {
        pendingToday.push(taskData);
      }
    }

    const remainingTasks = plannedTasks - completedTasks;
    const remainingPoints = plannedPoints - earnedPoints;

    const completionRate =
      plannedPoints === 0
        ? 0
        : Math.round((earnedPoints / plannedPoints) * 100);

    return res.status(200).json({
      success: true,

      summary: {
        plannedTasks,
        completedTasks,
        remainingTasks,

        plannedPoints,
        earnedPoints,
        remainingPoints,

        completionRate,
      },

      todayTasks,

      completedToday,

      pendingToday,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};