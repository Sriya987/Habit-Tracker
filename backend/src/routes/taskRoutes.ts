import { Router } from "express";

import {
    createTask,
    getTasks,
} from "../controllers/taskController";

import {
    authenticate
} from "../middleware/authMiddleware";

import {
    updateTask,
    deleteTask,
    completeTask
} from "../controllers/taskController";

const router = Router();

router.post(
    "/",
    authenticate,
    createTask
);

router.get(
    "/",
    authenticate,
    getTasks
);

router.put(
    "/:id",
    authenticate,
    updateTask
);

router.delete(
    "/:id",
    authenticate,
    deleteTask
);

router.patch(
    "/:id/complete",
    authenticate,
    completeTask
);
export default router;