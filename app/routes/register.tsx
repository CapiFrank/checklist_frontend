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

export default function Register() {
  return (
    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
      <form className="bg-white grid grid-cols-2 p-6 gap-3 min-w-md max-md:min-w-[50%] shadow-lg rounded">
        <span className="text-xl uppercase font-bold text-center p-2 col-span-2">
          Regístrate
        </span>
        <div className="flex flex-col">
          <InputLabel htmlFor="name">Nombres</InputLabel>
          <TextInput id="name" name="name" type="text" required />
        </div>
        <div className="flex flex-col">
          <InputLabel htmlFor="surname">Apellidos</InputLabel>
          <TextInput id="surname" name="surname" type="text" required />
        </div>
        <div className="flex flex-col col-span-2">
          <InputLabel htmlFor="username">Usuario</InputLabel>
          <TextInput id="username" name="username" type="text" required />
        </div>
        <div className="flex flex-col col-span-2">
          <InputLabel htmlFor="password">Contraseña</InputLabel>
          <TextInput id="password" name="password" type="password" required />
        </div>
        <div className="flex flex-col col-span-2">
          <InputLabel htmlFor="confirm_password">
            Confirmar Contraseña
          </InputLabel>
          <TextInput
            id="confirm_password"
            name="confirm_password"
            type="password"
            required
          />
        </div>

        <PrimaryButton className="col-span-2" type="submit">
          Registrarse
        </PrimaryButton>
        <span className="text-center text-sm font-medium text-slate-700 col-span-2">
          Ya eres miembro?
          <NavLink
            to="/"
            className="ml-1 hover:underline text-blue-400 hover:text-blue-500 active:text-blue-800 cursor-pointer"
            viewTransition
          >
            Inicia sesión
          </NavLink>
        </span>
      </form>
    </div>
  );
}
