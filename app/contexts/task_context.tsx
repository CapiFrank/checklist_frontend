import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Task } from "~/types/task";

type TaskStore = {
  tasks: Task[];
  filteredTasks: Task[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setSearchKey: (term: string) => void;
  selectedTask?: Task;
  setSelectedTask: (task?: Task) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  upsertTask: (task: Task) => void;
};

const TaskContext = createContext<TaskStore | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const allTasks: Task[] = [
    {
      id: "1",
      title: "Comprar materiales",
      note: "Ir a la ferretería y comprar clavos, martillo y madera",
      date: null,
      isImportant: false,
      isMyDay: false,
      isScheduled: false,
    },
    {
      id: "2",
      title: "Revisar correo",
      note: "Responder mensajes pendientes de clientes",
      date: null,
      isImportant: false,
      isMyDay: false,
      isScheduled: false,
    },
    {
      id: "3",
      title: "Plan de marketing",
      note: "Preparar la estrategia para la campaña en redes sociales",
      date: null,
      isImportant: false,
      isMyDay: false,
      isScheduled: true,
    },
    {
      id: "4",
      title: "Reunión con equipo",
      note: "Coordinar avances del proyecto y revisar pendientes",
      date: null,
      isImportant: false,
      isMyDay: true,
      isScheduled: false,
    },
    {
      id: "5",
      title: "Entrega de reporte",
      note: "Enviar informe semanal al jefe antes del viernes",
      date: null,
      isImportant: true,
      isMyDay: false,
      isScheduled: false,
    },
  ];
  const [tasks, setTasks] = useState<Task[]>(allTasks);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchKey, setSearchKey] = useState<string>("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesCategory = searchKey
        ? task[searchKey as keyof Task] === true
        : true;

      const matchesSearch = searchTerm
        ? Object.values(task).some((value) =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;

      return matchesCategory && matchesSearch;
    });
  }, [tasks, searchKey, searchTerm]);

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }, []);

  const upsertTask = useCallback((task: Task) => {
    setTasks((prev) => {
      const exists = prev.some((item) => item.id === task.id);

      if (exists) {
        return prev.map((item) => (item.id === task.id ? task : item));
      }

      const newId =
        prev.length > 0
          ? Math.max(...prev.map((t) => Number(t.id) || 0)) + 1
          : 1;

      const newTask: Task = {
        ...task,
        id: newId.toString(),
      };

      return [...prev, newTask];
    });

    setSelectedTask(undefined);
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);


  const value = useMemo<TaskStore>(
    () => ({
      tasks,
      filteredTasks,
      searchTerm,
      setSearchTerm,
      selectedTask,
      setSelectedTask,
      addTask,
      updateTask,
      deleteTask,
      setSearchKey,
      upsertTask,
    }),
    [
      tasks,
      filteredTasks,
      searchTerm,
      selectedTask,
      addTask,
      updateTask,
      deleteTask,
      updateTask,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// Hook personalizado
export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error("useTasks debe usarse dentro de <TaskProvider>.");
  }
  return ctx;
}
