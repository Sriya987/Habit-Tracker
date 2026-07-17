import api from "./axios";

import type {
  CarryForwardCheckResponse,
  CarryForwardResponse,
  CreateTaskData,
  TaskResponse,
  TasksResponse,
  UpdateTaskData,
} from "../types/task";

export const getTasks = async (): Promise<TasksResponse> => {
  const response = await api.get<TasksResponse>(
    "/tasks"
  );

  return response.data;
};

export const createTask = async (
  data: CreateTaskData
): Promise<TaskResponse> => {
  const response = await api.post<TaskResponse>(
    "/tasks",
    data
  );

  return response.data;
};

export const updateTask = async (
  id: string,
  data: UpdateTaskData
): Promise<TaskResponse> => {
  const response = await api.put<TaskResponse>(
    `/tasks/${id}`,
    data
  );

  return response.data;
};

export const deleteTask = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(
    `/tasks/${id}`
  );

  return response.data;
};

export const completeTask = async (
  id: string
): Promise<TaskResponse> => {
  const response = await api.patch<TaskResponse>(
    `/tasks/${id}/complete`
  );

  return response.data;
};

export const checkCarryForward =
  async (): Promise<CarryForwardCheckResponse> => {
    const response =
      await api.get<CarryForwardCheckResponse>(
        "/tasks/carry-forward"
      );

    return response.data;
  };

export const carryForwardTasks =
  async (): Promise<CarryForwardResponse> => {
    const response =
      await api.post<CarryForwardResponse>(
        "/tasks/carry-forward"
      );

    return response.data;
  };