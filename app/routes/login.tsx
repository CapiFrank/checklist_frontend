import InputLabel from "~/components/input_label";
import type { Route } from "../+types/root";
import TextInput from "~/components/text_input";
import PrimaryButton from "../components/primary_button";
import Toggle from "~/components/toggle";
import { NavLink } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checklist" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Login() {
  return (
    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
      <form className="bg-white flex flex-col p-6 gap-3 min-w-md max-lg:min-w-[50%] shadow-lg rounded">
        <span className="text-xl uppercase font-bold text-center p-2">
          Inicio de sesión
        </span>
        <div className="flex flex-col">
          <InputLabel htmlFor="username">Usuario</InputLabel>
          <TextInput id="username" name="username" type="text" required />
        </div>
        <div className="flex flex-col">
          <InputLabel htmlFor="password">Contraseña</InputLabel>
          <TextInput id="password" name="password" type="password" required />
        </div>
        <div className="flex items-center">
          <Toggle id="remember" size="sm" />
          <InputLabel
            htmlFor="remember"
            className="ml-2 cursor-pointer hover:underline hover:text-blue-500 active:text-blue-800"
          >
            Recuérdame
          </InputLabel>
        </div>

        <PrimaryButton>Iniciar sesión</PrimaryButton>
        <a className="text-center hover:underline text-sm font-medium text-slate-700 hover:text-blue-500 active:text-blue-800 cursor-pointer">
          ¿Olvidaste tu contraseña?
        </a>
        <span className="text-center text-sm font-medium text-slate-700">
          Aún no eres miembro?
          <NavLink
            to="/register"
            className="ml-1 hover:underline text-blue-400 hover:text-blue-500 active:text-blue-800 cursor-pointer"
            viewTransition
          >
            Regístrate
          </NavLink>
        </span>
      </form>
    </div>
  );
}
