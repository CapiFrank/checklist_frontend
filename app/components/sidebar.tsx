import {
  faCalendar,
  faCaretDown,
  faCaretRight,
  faCirclePlus,
  faHouse,
  faStar,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { usePage } from "~/contexts/page_context";
import { useTasks, type TaskCategory } from "~/contexts/task_context";
import CollapsiblePage from "./collapsible_page";

const Sidebar = () => {
  const {
    setSelectedCategory,
    selectedCategory,
    selectedPageId,
    setSelectedPageId,
  } = useTasks();
  const { isEditingMode, pages, createPage, loadPages } = usePage();
  useEffect(() => {
    loadPages();
  }, []);
  const handleClick = (category: TaskCategory | undefined) => {
    setSelectedCategory(category);
    setSelectedPageId("");
  };
  return (
    <div className="h-full w-full flex flex-col">
      <nav className="flex flex-col gap-2">
        <span
          onClick={() => handleClick(undefined)}
          className={`hover:bg-slate-700 active:bg-slate-900 ${!selectedCategory && !selectedPageId ? "bg-slate-900" : ""} p-4 rounded flex gap-4 items-center cursor-pointer`}
        >
          <FontAwesomeIcon icon={faHouse} />
          Inicio
        </span>
        <span
          onClick={() => handleClick("myDay")}
          className={`hover:bg-slate-700 active:bg-slate-900 ${selectedCategory === "myDay" ? "bg-slate-900" : ""} p-4 rounded flex gap-4 items-center cursor-pointer`}
        >
          <FontAwesomeIcon icon={faSun} />
          Mi Día
        </span>
        <span
          onClick={() => handleClick("important")}
          className={`hover:bg-slate-700 active:bg-slate-900 ${selectedCategory === "important" ? "bg-slate-900" : ""} p-4 rounded flex gap-4 items-center cursor-pointer`}
        >
          <FontAwesomeIcon icon={faStar} />
          Importante
        </span>
        <span
          onClick={() => handleClick("scheduled")}
          className={`hover:bg-slate-700 active:bg-slate-900 ${selectedCategory === "scheduled" ? "bg-slate-900" : ""} p-4 rounded flex gap-4 items-center cursor-pointer`}
        >
          <FontAwesomeIcon icon={faCalendar} />
          Planificado
        </span>
        <div className="flex flex-col max-h-72 gap-2 overflow-y-auto px-2">
          {pages.map((page) => (
            <CollapsiblePage key={page.id} page={page} />
          ))}
        </div>
        {isEditingMode && (
          <span
            onClick={() => createPage(null, "Nueva página")}
            className="hover:bg-slate-700 active:bg-slate-900 p-4 rounded flex gap-4 items-center cursor-pointer"
          >
            <FontAwesomeIcon icon={faCirclePlus} />
            Agregar Página
          </span>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
