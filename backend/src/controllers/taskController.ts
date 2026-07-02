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

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: req.userId,
        completed: false,
      },
      {
        completed: true,
        completedAt: new Date(),
      },
      {
        new: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or already completed.",
      });
    }

    return res.json({
      success: true,
      message: "Task completed successfully.",
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