import InputLabel from "~/components/input_label";
import type { Route } from "../+types/root";
import TextInput from "~/components/text_input";
import PrimaryButton from "../components/primary_button";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "~/contexts/auth_context";
import Swal from "sweetalert2";
import type { ValidationErrors } from "~/types/api";
import InputError from "~/components/input_error";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checklist" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const { register } = useAuth();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);
    const response = await register(form);
    if (response.status === 201) {
      Swal.fire({
        title: "Registro exitoso!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/", { viewTransition: true }); // navegar solo después de cerrar el modal
      });
      return;
    } else if (response.status === 422) {
      setGlobalError(response.error || null); // mensaje global
      setErrors(response.data || {}); // errores por campo
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
    <div className="bg-gray-200 w-screen h-screen flex items-center justify-center overflow-auto">
      <form
        className="bg-white grid grid-cols-2 p-6 gap-3 w-lg max-md:w-[75%] shadow-lg rounded"
        onSubmit={handleSubmit}
      >
        <span className="text-xl uppercase font-bold text-center p-2 col-span-2">
          Regístrate
        </span>
        <div className="flex flex-col">
          <InputLabel htmlFor="name">Nombres</InputLabel>
          <TextInput
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
          />
          {errors.name &&
            errors.name.map((error, index) => (
              <InputError key={`${error}${index}`} message={error} />
            ))}
        </div>
        <div className="flex flex-col">
          <InputLabel htmlFor="surname">Apellidos</InputLabel>
          <TextInput
            id="surname"
            name="surname"
            type="text"
            required
            value={form.surname}
            onChange={handleChange}
          />
          {errors.surname &&
            errors.surname.map((error, index) => (
              <InputError key={`${error}${index}`} message={error} />
            ))}
        </div>
        <div className="flex flex-col col-span-2">
          <InputLabel htmlFor="email">Correo</InputLabel>
          <TextInput
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
          />
          {errors.email &&
            errors.email.map((error, index) => (
              <InputError key={`${error}${index}`} message={error} />
            ))}
        </div>
        <div className="flex flex-col col-span-2">
          <InputLabel htmlFor="password">Contraseña</InputLabel>
          <TextInput
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
          />
          {errors.password &&
            errors.password.map((error, index) => (
              <InputError key={`${error}${index}`} message={error} />
            ))}
        </div>
        <div className="flex flex-col col-span-2">
          <InputLabel htmlFor="confirm_password">
            Confirmar Contraseña
          </InputLabel>
          <TextInput
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            required
            value={form.password_confirmation}
            onChange={handleChange}
          />
        </div>
        {globalError && <InputError message={globalError} />}

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
