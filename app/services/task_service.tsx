import type { Task } from "~/types/task";
import { request } from "./http_client";
import type { Api } from "~/types/api";

export const taskService = {
  getTasks: () => request<Api>(`/tasks`),
  createTask: (task: Task) =>
    request<Api>(`/tasks`, { method: "POST", body: JSON.stringify(task) }),
  updateTask: (task: Task) =>
    request<Api>(`/tasks`, { method: "PUT", body: JSON.stringify(task) }),
  deleteTask: (task: Task) =>
    request<Api>(`/tasks`, { method: "DELETE", body: JSON.stringify(task) }),
};
