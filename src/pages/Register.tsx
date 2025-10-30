import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { registerUsuario } from "../api/usuarios";
import type { Role } from "../types";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";


export default function Register() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nombre: "",
        password: "",
        rol: "USER" as Role,
    });
    const [showPassword, setShowPassword] = useState(false);

    const roles = [
        { value: "USER", label: "Usuario" },
        { value: "ADMIN", label: "Administrador" },
    ];

    const [mensaje, setMensaje] = useState<{ texto: string; tipo: "success" | "error" | "" }>({
        texto: "",
        tipo: "",
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await registerUsuario(
                {
                    nombre: form.nombre,
                    password: form.password,
                    rol: form.rol,
                },
                token ?? undefined
            );
            setMensaje({ texto: "Usuario creado correctamente", tipo: "success" });
            setTimeout(() => navigate("/usuarios"), 1500);
        } catch {
            setMensaje({ texto: "Error al crear usuario", tipo: "error" });
        }
    };

    return (
        <div className="flex flex-grow justify-center items-center">
            {mensaje.texto && (
                <div
                    className={`
                        absolute top-25 px-6 py-3 rounded-xl shadow-md text-white font-medium
                        transition-all duration-300 animate-fade-down
                        ${mensaje.tipo === "success" ? "bg-green-600" : "bg-red-600"}
                    `}
                >
                    {mensaje.texto}
                </div>
            )}
            <div className="bg-zinc-900 p-12 rounded-2xl shadow-xl w-100 border border-zinc-800">
                <h2 className="text-2xl font-semibold text-center mb-6 text-white">
                    Crear nuevo usuario
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <input
                        placeholder="Nombre de usuario"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        required
                        className="bg-zinc-800 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />

                    <div className="relative w-full">
                        <input
                            className="bg-zinc-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition w-full pr-12"
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 hover:cursor-pointer"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <Listbox value={form.rol} onChange={(rol) => setForm({ ...form, rol })}>
                        <div className="relative w-full">
                            <ListboxButton className="bg-zinc-800 text-white p-3 rounded-lg w-full flex justify-between items-center">
                                {roles.find(r => r.value === form.rol)?.label}
                                <span className="text-zinc-400">▼</span>
                            </ListboxButton>
                            <ListboxOptions className="absolute mt-2 bg-zinc-900 border border-zinc-700 rounded-lg w-full shadow-lg">
                                {roles.map((rol) => (
                                    <ListboxOption
                                        key={rol.value}
                                        value={rol.value}
                                        className={({ focus }) =>
                                            `p-3 cursor-pointer rounded-lg ${focus ? "bg-indigo-600 text-white" : "text-zinc-200"
                                            }`
                                        }
                                    >
                                        {rol.label}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </div>
                    </Listbox>

                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 hover:cursor-pointer text-white p-3 rounded-lg transition-colors font-medium"
                    >
                        Crear usuario
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/usuarios')}
                        className="bg-zinc-700 hover:bg-zinc-600 hover:cursor-pointer text-white p-3 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}
