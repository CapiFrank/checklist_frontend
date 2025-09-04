import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import Swal from "sweetalert2";
import type { ApiResponse } from "~/services/http_client";
import { taskService } from "~/services/task_service";
import type { Task } from "~/types/task";

// Helpers --------------------------
export type TaskCategory = "important" | "myDay" | "scheduled";

interface TaskFilter {
  searchTerm?: string;
  category?: TaskCategory;
  pageId?: string;
}

const showAlert = (title: string, icon: "success" | "error") =>
  Swal.fire({
    title,
    icon,
    showConfirmButton: false,
    timer: 1500,
  });

const confirmDialog = async (title: string) =>
  Swal.fire({
    title,
    icon: "question",
    showConfirmButton: true,
    showCancelButton: true,
  });

const formatDate = (date: Date | string | null): string => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const matchesTask = (task: Task, filter: TaskFilter): boolean => {
  const { searchTerm, category, pageId } = filter;

  if (category) {
    const categoryMap: Record<TaskCategory, boolean | null> = {
      important: task.is_important,
      myDay: task.is_my_day,
      scheduled: task.is_scheduled,
    };
    if (!categoryMap[category]) return false;
  }

  if (pageId && task.page_id !== pageId) return false;

  if (searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();
    const values = Object.values(task).map((v) => v?.toString().toLowerCase());
    if (!values.some((val) => val?.includes(lowerSearch))) return false;
  }

  return true;
};

// Context --------------------------
type TaskStore = {
  tasks: Task[];
  filteredTasks: Task[];
  searchTerm: string;
  selectedCategory: TaskCategory | undefined;
  selectedPageId: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (term: TaskCategory | undefined) => void;
  setSelectedPageId: (term: string) => void;
  selectedTask?: Task;
  setSelectedTask: (task?: Task) => void;
  createTask: (task: Task) => Promise<ApiResponse>;
  updateTask: (task: Task) => Promise<ApiResponse>;
  deleteTask: (task: Task) => Promise<void>;
  upsertTask: (task: Task) => Promise<ApiResponse>;
  loadTasks: () => Promise<void>;
};

const TaskContext = createContext<TaskStore | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<
    TaskCategory | undefined
  >(undefined);
  const [selectedPageId, setSelectedPageId] = useState<string>("");

  const filteredTasks = useMemo(() => {
    if (!tasks?.length) return [];

    const filter: TaskFilter = { searchTerm, category: selectedCategory, pageId: selectedPageId };

    return tasks
      .filter((task) => matchesTask(task, filter))
      .map((task) => ({ ...task, date: formatDate(task.date) }));
  }, [tasks, searchTerm, selectedCategory, selectedPageId]);

  const loadTasks = useCallback(async () => {
    try {
      const response = await taskService.getTasks();
      if (response.status === 200 && response.data) {
        setTasks(response.data.data as Task[]);
      } else {
        showAlert("Ocurrió un error", "error");
      }
    } catch {
      showAlert("Ocurrió un error", "error");
    }
  }, []);

  const createTask = useCallback(async (task: Task) => {
    try {
      const response = await taskService.createTask(task);
      if (response.status === 201 && response.data) {
        setTasks((prev) => [...prev, response.data!.data as Task]);
      }
      return response;
    } catch (e) {
      showAlert("Ocurrió un error", "error");
      throw e;
    }
  }, []);

  const updateTask = useCallback(async (task: Task) => {
    try {
      const response = await taskService.updateTask(task);
      if (response.status === 200 && response.data) {
        const updated = response.data.data as Task;
        setTasks((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      }
      return response;
    } catch (e) {
      showAlert("Ocurrió un error", "error");
      throw e;
    }
  }, []);

  const upsertTask = useCallback(
    async (task: Task) => {
      const exists = !!task.id;
      const response = exists ? await updateTask(task) : await createTask(task);

      if ((exists && response.status === 200) || (!exists && response.status === 201)) {
        showAlert(`Tarea ${exists ? "actualizada" : "creada"} con éxito!`, "success");
      } else {
        showAlert("Ocurrió un error", "error");
      }

      setSelectedTask(undefined);
      return response;
    },
    [updateTask, createTask]
  );

  const deleteTask = useCallback(async (task: Task) => {
    const { isConfirmed } = await confirmDialog("Desea eliminar la tarea?");
    if (!isConfirmed) return;

    try {
      const response = await taskService.deleteTask(task);
      if (response.status === 200) {
        setTasks((prev) => prev.filter((item) => item.id !== task.id));
        showAlert("Tarea eliminada con éxito", "success");
      } else {
        showAlert("Ocurrió un error", "error");
      }
    } catch {
      showAlert("Ocurrió un error", "error");
    }
  }, []);

  const value = useMemo<TaskStore>(
    () => ({
      tasks,
      filteredTasks,
      selectedPageId,
      setSelectedPageId,
      selectedCategory,
      setSelectedCategory,
      selectedTask,
      setSelectedTask,
      createTask,
      updateTask,
      deleteTask,
      setSearchTerm,
      searchTerm,
      upsertTask,
      loadTasks,
    }),
    [
      tasks,
      filteredTasks,
      searchTerm,
      selectedTask,
      selectedCategory,
      selectedPageId,
      createTask,
      updateTask,
      deleteTask,
      upsertTask,
      loadTasks,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// Hook personalizado ----------------
export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error("useTasks debe usarse dentro de <TaskProvider>.");
  }
  return ctx;
}
