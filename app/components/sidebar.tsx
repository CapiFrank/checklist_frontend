import {
  faCalendar,
  faHouse,
  faStar,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTasks } from "~/contexts/task_context";

const Sidebar = () => {
  const { setSearchKey } = useTasks();
  return (
    <div className="h-full w-full flex flex-col relative">
      <nav className="flex flex-col gap-2">
        <span
          onClick={() => setSearchKey("")}
          className="hover:bg-slate-700 active:bg-slate-900 p-4 rounded flex gap-4 items-center cursor-pointer"
        >
          <FontAwesomeIcon icon={faHouse} />
          Inicio
        </span>
        <span
          onClick={() => setSearchKey("isMyDay")}
          className="hover:bg-slate-700 active:bg-slate-900 p-4 rounded flex gap-4 items-center cursor-pointer"
        >
          <FontAwesomeIcon icon={faSun} />
          Mi Día
        </span>
        <span
          onClick={() => setSearchKey("isImportant")}
          className="hover:bg-slate-700 active:bg-slate-900 p-4 rounded flex gap-4 items-center cursor-pointer"
        >
          <FontAwesomeIcon icon={faStar} />
          Importante
        </span>
        <span
          onClick={() => setSearchKey("isScheduled")}
          className="hover:bg-slate-700 active:bg-slate-900 p-4 rounded flex gap-4 items-center cursor-pointer"
        >
          <FontAwesomeIcon icon={faCalendar} />
          Planificado
        </span>
      </nav>
    </div>
  );
};

export default Sidebar;
