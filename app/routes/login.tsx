import InputLabel from "~/components/input_label";
import type { Route } from "../+types/root";
import TextInput from "~/components/text_input";
import PrimaryButton from "../components/primary_button";
import Toggle from "~/components/toggle";
import { useNavigate, NavLink } from "react-router";
import { useState } from "react";
import { useAuth } from "~/contexts/auth_context";
import Swal from "sweetalert2";
import InputError from "~/components/input_error";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checklist" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [globalError, setGlobalError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError(null);
    const response = await login(email, password);
    if (response.status === 200) {
      Swal.fire({
        title: "Inicio de sesión exitoso!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/tasks", { viewTransition: true }); // navegar solo después de cerrar el modal
      });
      return;
    } else if (response.status === 401) {
      setGlobalError(response.error || null);
    } else {
      setGlobalError("Ocurrió un error inesperado");
    }
    Swal.fire({
      title: "Ocurrió un error",
      icon: "error",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  return (
    <div className="bg-gray-200 w-screen h-screen flex items-center justify-center">
      <form
        className="bg-white flex flex-col p-6 gap-3 min-w-md max-lg:min-w-[50%] shadow-lg rounded"
        onSubmit={handleSubmit}
      >
        <span className="text-xl uppercase font-bold text-center p-2">
          Inicio de sesión
        </span>
        <div className="flex flex-col">
          <InputLabel htmlFor="email">Correo</InputLabel>
          <TextInput
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <InputLabel htmlFor="password">Contraseña</InputLabel>
          <TextInput
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {globalError && <InputError message={globalError} />}
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
