import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { crearArma } from "../api/armas"; // Asume que tienes esta función
type TipoArma = "FUEGO" | "BLANCA" | "EXPLOSIVO";
type EstadoArma = "NUEVO" | "USADO";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";


export default function CrearArma() {
    const { token, role } = useAuth();
    const navigate = useNavigate();

    if (!role) return <p>No tienes permisos para crear armas.</p>;

    const [form, setForm] = useState({
        nombre: "",
        tipo: "FUEGO" as TipoArma,
        descripcion: "",
        estado: "NUEVO" as EstadoArma,
    });

    const tipos = [
        { value: "FUEGO", label: "Fuego" },
        { value: "BLANCA", label: "Blanca" },
        { value: "EXPLOSIVO", label: "Explosivo" },
    ];

    const estados = [
        { value: "NUEVO", label: "Nuevo" },
        { value: "USADO", label: "Usado" },
    ];

    const [mensaje, setMensaje] = useState<{ texto: string; tipo: "success" | "error" | "" }>({
        texto: "",
        tipo: "",
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await crearArma(form.nombre, form.tipo, form.estado, form.descripcion, token ?? undefined);
            setMensaje({ texto: "Arma creada correctamente", tipo: "success" });
            setTimeout(() => navigate("/"), 1500);
        } catch {
            setMensaje({ texto: "Error al crear el arma", tipo: "error" });

        }
    };

    return (
        <div className="flex justify-center items-center flex-grow">
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
            <div className="bg-zinc-900 p-8 rounded-2xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-white">Crear Arma</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Nombre del arma"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        className="p-3 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />

                    <Listbox value={form.tipo} onChange={(tipo) => setForm({ ...form, tipo })}>
                        <div className="relative w-full z-50">
                            <ListboxButton className="bg-zinc-800 text-white p-3 rounded-lg w-full flex justify-between items-center">
                                {tipos.find(t => t.value === form.tipo)?.label}
                                <span className="text-zinc-400">▼</span>
                            </ListboxButton>
                            <ListboxOptions className="absolute mt-2 bg-zinc-900 border border-zinc-700 rounded-lg w-full shadow-lg">
                                {tipos.map((tipo) => (
                                    <ListboxOption
                                        key={tipo.value}
                                        value={tipo.value}
                                        className={({ focus }) =>
                                            `p-3 cursor-pointer rounded-lg ${focus ? "bg-indigo-600 text-white" : "text-zinc-200"
                                            }`
                                        }
                                    >
                                        {tipo.label}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </div>
                    </Listbox>

                    <Listbox value={form.estado} onChange={(estado) => setForm({ ...form, estado })}>
                        <div className="relative w-full">
                            <ListboxButton className="bg-zinc-800 text-white p-3 rounded-lg w-full flex justify-between items-center">
                                {estados.find(es => es.value === form.estado)?.label}
                                <span className="text-zinc-400">▼</span>
                            </ListboxButton>
                            <ListboxOptions className="absolute mt-2 bg-zinc-900 border border-zinc-700 rounded-lg w-full shadow-lg">
                                {estados.map((estado) => (
                                    <ListboxOption
                                        key={estado.value}
                                        value={estado.value}
                                        className={({ focus }) =>
                                            `p-3 cursor-pointer rounded-lg ${focus ? "bg-indigo-600 text-white" : "text-zinc-200"
                                            }`
                                        }
                                    >
                                        {estado.label}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </div>
                    </Listbox>


                    <textarea
                        placeholder="Descripción"
                        value={form.descripcion}
                        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                        className="p-3 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />

                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 hover:cursor-pointer text-white p-3 rounded-lg transition-colors"
                    >
                        Crear arma
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="bg-zinc-700 hover:bg-zinc-600 hover:cursor-pointer text-white p-3 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}
