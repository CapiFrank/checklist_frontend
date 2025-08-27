import {
  faAngleLeft,
  faAngleRight,
  faArrowRightFromBracket,
  faCircleUser,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputLabel from "./input_label";
import TextInput from "./text_input";
import { useTasks } from "~/contexts/task_context";
type NavbarProps = {
  onToggle: (value: boolean) => void;
  isOpen: boolean;
};
const Navbar = ({ onToggle, isOpen }: NavbarProps) => {
  const { setSearchTerm } = useTasks();
  return (
    <div className="w-full h-full flex justify-between">
      <button
        onClick={() => onToggle(!isOpen)}
        className="-translate-x-2 transition-all ease-in px-4 py-2 text-white hover:text-gray-300 active:text-gray-500 bg-slate-800 rounded-lg cursor-pointer"
      >
        <FontAwesomeIcon icon={isOpen ? faAngleLeft : faAngleRight} />
      </button>
      <div className="flex items-center gap-4">
        <InputLabel>Buscar:</InputLabel>
        <TextInput onChange={(event) => setSearchTerm(event.target.value)}></TextInput>
      </div>
      <div className="self-center flex h-full items-center">
        <div className="flex flex-col place-content-center cursor-pointer w-full px-4 h-full hover:bg-gray-200 active:bg-gray-300" title="Gestión del usuario">
          <FontAwesomeIcon icon={faCircleUser} id="user" className="text-2xl" />
          <InputLabel htmlFor="user" className="cursor-pointer">
            Usuario
          </InputLabel>
        </div>
        <div className="flex flex-col place-content-center cursor-pointer w-full px-6 h-full hover:bg-gray-200 active:bg-gray-300" title="Modifica las categorías">
          <FontAwesomeIcon icon={faGear} id="settings" className="text-2xl" />
          <InputLabel htmlFor="settings" className="cursor-pointer">
            Configurar
          </InputLabel>
        </div>
        <div className="flex flex-col place-content-center cursor-pointer w-full px-6 h-full hover:bg-gray-200 active:bg-gray-300" title="Cerrar sesión">
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            id="logout"
            className="text-2xl"
          />
          <InputLabel htmlFor="logout" className="cursor-pointer">
            Salir
          </InputLabel>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
