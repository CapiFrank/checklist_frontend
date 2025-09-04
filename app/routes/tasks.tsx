import Navbar from "../components/navbar";
import Sidebar from "~/components/sidebar";
import ToolPanel from "~/components/tool_panel";
import type { Route } from "../+types/root";
import Table from "~/components/table";
import { useEffect, useState } from "react";
import { useTasks } from "~/contexts/task_context";
import type { Task } from "~/types/task";
import Swal from "sweetalert2";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checklist" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const Tasks = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    filteredTasks,
    setSelectedTask,
    deleteTask,
    loadTasks,
    selectedCategory,
  } = useTasks();
  useEffect(() => {
    loadTasks();
  }, []);

  const columns = [
    { key: "title", label: "Titulo" },
    { key: "note", label: "Nota" },
    ...(selectedCategory === "scheduled"
      ? [{ key: "date", label: "Fecha" }]
      : []),
  ];

  const actions = [
    {
      label: "Editar",
      icon: "fa-solid fa-edit",
      onClick: (task: Task) => setSelectedTask(task),
    },
    {
      label: "Eliminar",
      icon: "fa-solid fa-square-minus",
      onClick: (task: Task) => deleteTask(task),
    },
  ];

  return (
    <div className="h-screen grid grid-cols-[14rem_1fr_12rem] grid-rows-[5rem_1fr]">
      <nav
        className={`bg-white shadow-lg z-20 transition-all duration-300 
        ${isSidebarOpen ? "col-start-2 col-span-2" : "col-start-1 col-span-3"}`}
      >
        <Navbar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
      </nav>

      {isSidebarOpen && (
        <aside
          className={`col-start-1 row-start-1 row-span-2 h-full bg-slate-800 text-white shadow-lg shadow-gray-950 
        transform transition-transform duration-300 ease-in-out z-30`}
        >
          <Sidebar />
        </aside>
      )}

      <main
        className={`row-start-2 p-4 transition-all duration-300 bg-slate-100 shadow-lg shadow-gray-400 z-10
        ${isSidebarOpen ? "col-start-2" : "col-start-1 col-span-2"}`}
      >
        <Table<Task>
          data={filteredTasks}
          columns={columns}
          actions={actions}
        ></Table>
      </main>
      <aside className="col-start-3 row-start-2 h-full bg-slate-300">
        <ToolPanel></ToolPanel>
      </aside>
    </div>
  );
};

export default Tasks;
