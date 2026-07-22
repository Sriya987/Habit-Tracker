import { Response } from "express";
import Task from "../models/Task";
import { AuthRequest } from "../middleware/authMiddleware";
const getStartOfDay = (date: Date) => {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
};

const getEndOfDay = (date: Date) => {
  const result = new Date(date);

  result.setHours(23, 59, 59, 999);

  return result;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
export const getTodayDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Today's date (00:00:00)
    const today = getStartOfDay(new Date());

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

export const getMonthlyDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const today = getStartOfDay(
      new Date()
    );

    // 29 previous days + today
    // = 30 days
    const startDate = new Date(
      today
    );

    startDate.setDate(
      startDate.getDate() - 29
    );

    const endDate =
      getEndOfDay(today);

    // Fetch all tasks from the
    // rolling 30-day period
    const tasks = await Task.find({
      userId: req.userId,

      plannedDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const monthly = [];

    for (
      let index = 0;
      index < 30;
      index++
    ) {
      const currentDate =
        new Date(startDate);

      currentDate.setDate(
        startDate.getDate() +
          index
      );

      const dayStart =
        getStartOfDay(
          currentDate
        );

      const dayEnd =
        getEndOfDay(
          currentDate
        );

      const dayTasks =
        tasks.filter((task) => {
          const taskDate =
            new Date(
              task.plannedDate
            );

          return (
            taskDate >= dayStart &&
            taskDate <= dayEnd
          );
        });

      const plannedPoints =
        dayTasks.reduce(
          (
            total,
            task
          ) =>
            total +
            task.points,
          0
        );

      const earnedPoints =
        dayTasks
          .filter(
            (task) =>
              task.completed
          )
          .reduce(
            (
              total,
              task
            ) =>
              total +
              task.points,
            0
          );

      const completionPercentage =
        plannedPoints === 0
          ? 0
          : Math.round(
              (
                earnedPoints /
                plannedPoints
              ) * 100
            );

      monthly.push({
        date:
          formatDate(
            currentDate
          ),

        plannedPoints,

        earnedPoints,

        completionPercentage,
      });
    }

    return res.json({
      success: true,
      monthly,
    });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Internal Server Error",
      });
  }
};

export const getWeeklyDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const today = getStartOfDay(
      new Date()
    );

    // 6 days before today + today = 7 days
    const startDate = new Date(
      today
    );

    startDate.setDate(
      startDate.getDate() - 6
    );

    const endDate =
      getEndOfDay(today);

    // Fetch all tasks within the
    // last 7 days in one query
    const tasks = await Task.find({
      userId: req.userId,

      plannedDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const weekly = [];

    for (
      let index = 0;
      index < 7;
      index++
    ) {
      const currentDate =
        new Date(startDate);

      currentDate.setDate(
        startDate.getDate() +
          index
      );

      const dayStart =
        getStartOfDay(
          currentDate
        );

      const dayEnd =
        getEndOfDay(
          currentDate
        );

      const dayTasks =
        tasks.filter((task) => {
          const taskDate =
            new Date(
              task.plannedDate
            );

          return (
            taskDate >= dayStart &&
            taskDate <= dayEnd
          );
        });

      const plannedPoints =
        dayTasks.reduce(
          (
            total,
            task
          ) =>
            total +
            task.points,
          0
        );

      const earnedPoints =
        dayTasks
          .filter(
            (task) =>
              task.completed
          )
          .reduce(
            (
              total,
              task
            ) =>
              total +
              task.points,
            0
          );

      const completionPercentage =
        plannedPoints === 0
          ? 0
          : Math.round(
              (
                earnedPoints /
                plannedPoints
              ) * 100
            );

      weekly.push({
        date:
          formatDate(
            currentDate
          ),

        plannedPoints,

        earnedPoints,

        completionPercentage,
      });
    }

    return res.json({
      success: true,
      weekly,
    });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Internal Server Error",
      });
  }
};

export const getStreakDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const STREAK_THRESHOLD = 50;

    const tasks = await Task.find({
      userId: req.userId,
    }).sort({
      plannedDate: 1,
    });

    const dayMap = new Map<
      string,
      {
        plannedPoints: number;
        earnedPoints: number;
      }
    >();

    // Group tasks by date
    for (const task of tasks) {
      const key = task.plannedDate.toISOString().split("T")[0];

      if (!dayMap.has(key)) {
        dayMap.set(key, {
          plannedPoints: 0,
          earnedPoints: 0,
        });
      }

      const data = dayMap.get(key)!;

      data.plannedPoints += task.points;

      if (task.completed) {
        data.earnedPoints += task.points;
      }
    }

    // ---------- Current Streak ----------
    let currentStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 3650; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const key = date.toISOString().split("T")[0];

      const day = dayMap.get(key);

      // Missed day -> streak ends immediately
      if (!day) {
        break;
      }

      const percentage =
        (day.earnedPoints / day.plannedPoints) * 100;

      if (percentage >= STREAK_THRESHOLD) {
        currentStreak++;
      } else {
        break;
      }
    }

    // ---------- Longest Streak ----------
    let longestStreak = 0;
    let running = 0;

    if (dayMap.size > 0) {
      const dates = [...dayMap.keys()].sort();

      const start = new Date(dates[0]);
      const end = new Date(dates[dates.length - 1]);

      for (
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
      ) {
        const key = date.toISOString().split("T")[0];

        const day = dayMap.get(key);

        // Missing day breaks streak
        if (!day) {
          running = 0;
          continue;
        }

        const percentage =
          (day.earnedPoints / day.plannedPoints) * 100;

        if (percentage >= STREAK_THRESHOLD) {
          running++;
          longestStreak = Math.max(longestStreak, running);
        } else {
          running = 0;
        }
      }
    }

    return res.json({
      success: true,
      streak: {
        currentStreak,
        longestStreak,
        threshold: STREAK_THRESHOLD,
        graceDays: 0,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};