import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { updateUsuario } from "../api/usuarios";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

export default function EditarUsuario() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const location = useLocation();

    const usuario = location.state?.usuario as { nombre?: string; rol?: Role } | undefined;

    const [form, setForm] = useState<{ nombre: string; rol: Role }>({
        nombre: "",
        rol: usuario?.rol,
    });

    const roles = [
        { value: "USER", label: "Usuario" },
        { value: "ADMIN", label: "Administrador" },
    ];

    useEffect(() => {
        if (!usuario) {
            navigate("/usuarios");
        }
    }, [usuario, navigate]);

    const [mensaje, setMensaje] = useState<{ texto: string; tipo: "success" | "error" | "" }>({
        texto: "",
        tipo: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        try {
            await updateUsuario(id, form, token ?? undefined);
            setMensaje({ texto: "Usuario actualizado correctamente", tipo: "success" });

            setTimeout(() => navigate("/usuarios"), 1500);
        } catch {
            setMensaje({ texto: "Error al actualizar usuario", tipo: "error" });
        }

        setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
    };

    if (!usuario) return null;

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

            <div className="bg-zinc-900 flex flex-col justify-center items-center py-10 px-16 rounded-2xl shadow-xl border border-zinc-800 scale-130">
                <h2 className="text-xl font-semibold mb-8">Editar usuario</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-64">
                    <input
                        className="bg-zinc-800 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder={usuario.nombre}
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        required
                    />
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
                        className="bg-indigo-600 hover:bg-indigo-500 hover:cursor-pointer text-white p-3 rounded-lg transition-colors"
                    >
                        Guardar
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
