import { Response } from "express";
import Task from "../models/Task";
import { AuthRequest } from "../middleware/authMiddleware";

export const createTask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      title,
      description,
      priority = "Medium",
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    let points = 20;

    switch (priority) {
      case "High":
        points = 30;
        break;
      case "Medium":
        points = 20;
        break;
      case "Low":
        points = 10;
        break;
    }

    const plannedDate = new Date();
    plannedDate.setHours(0, 0, 0, 0);

    const task = await Task.create({
      userId: req.userId,
      title,
      description,
      priority,
      plannedDate,
      points,
      completed: false,
      completedAt: null,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getTasks = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const tasks = await Task.find({
      userId: req.userId,
    }).sort({
      plannedDate: -1,
      createdAt: -1,
    });

    return res.json({
      success: true,
      tasks,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const { id } = req.params;

    const {
      title,
      description,
      priority,
    } = req.body;

    let points;

    if (priority) {
      switch (priority) {
        case "High":
          points = 30;
          break;

        case "Medium":
          points = 20;
          break;

        case "Low":
          points = 10;
          break;
      }
    }

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: req.userId,
      },
      {
        title,
        description,
        priority,
        points,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    return res.json({
      success: true,
      message: "Task updated successfully.",
      task: updatedTask,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    return res.json({
      success: true,
      message: "Task deleted successfully.",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};
export const completeTask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    // Toggle completion status
    task.completed = !task.completed;

    // Set completedAt only when completed
    task.completedAt = task.completed
      ? new Date()
      : null;

    await task.save();

    return res.status(200).json({
      success: true,
      message: task.completed
        ? "Task completed successfully."
        : "Task restored successfully.",
      task,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const carryForwardTasks = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Fetch yesterday's pending tasks
    const pendingTasks = await Task.find({
      userId: req.userId,
      plannedDate: {
        $gte: yesterday,
        $lt: today,
      },
      completed: false,
    });

    let carried = 0;
    let skipped = 0;

    for (const task of pendingTasks) {

      // Avoid duplicate tasks for today
      const alreadyExists = await Task.findOne({
        userId: req.userId,
        title: task.title,
        plannedDate: {
          $gte: today,
          $lt: tomorrow,
        },
      });

      if (alreadyExists) {
        skipped++;
        continue;
      }

      await Task.create({
        userId: task.userId,
        title: task.title,
        description: task.description,
        priority: task.priority,
        plannedDate: today,
        points: task.points,
        completed: false,
        completedAt: null,
      });
      task.carriedForward = true;

      await task.save();
      carried++;
    }

   return res.status(200).json({
    success: true,
    carriedTasks: carried,
    skippedTasks: skipped,
    message: `${carried} task(s) carried forward. ${skipped} already existed.`,
});

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};
export const checkCarryForward = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const pendingTasks = await Task.find({
      userId: req.userId,
      plannedDate: {
        $gte: yesterday,
        $lt: today,
      },
      completed: false,
carriedForward: false,
    })
      .select("_id title priority points")
      .sort({ priority: 1 });

    return res.status(200).json({
      success: true,
      available: pendingTasks.length > 0,
      count: pendingTasks.length,
      tasks: pendingTasks.map(task => ({
        id: task._id,
        title: task.title,
        priority: task.priority,
        points: task.points,
      })),
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};