export type Priority = "High" | "Medium" | "Low";

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description: string;
  priority: Priority;
  plannedDate: string;
  points: number;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: Priority;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: Priority;
}

export interface TasksResponse {
  success: boolean;
  tasks: Task[];
}

export interface TaskResponse {
  success: boolean;
  message?: string;
  task: Task;
}

export interface CarryForwardTask {
  id: string;
  title: string;
  priority: Priority;
  points: number;
}

export interface CarryForwardCheckResponse {
  success: boolean;
  available: boolean;
  count: number;
  tasks: CarryForwardTask[];
}

export interface CarryForwardResponse {
  success: boolean;
  message: string;
  carriedTasks: number;
  skippedTasks?: number;
}