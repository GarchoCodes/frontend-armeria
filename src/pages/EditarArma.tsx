import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArma, updateArma, type Arma } from "../api/armas";
import { useAuth } from "../hooks/useAuth";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

type TipoArma = "FUEGO" | "BLANCA" | "EXPLOSIVO";
type EstadoArma = "NUEVO" | "USADO";

export default function EditarArma() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [arma, setArma] = useState<Arma | null>(null);

    const tipos = [
        { value: "FUEGO", label: "Fuego" },
        { value: "BLANCA", label: "Blanca" },
        { value: "EXPLOSIVO", label: "Explosivo" },
    ];

    const estados = [
        { value: "NUEVO", label: "Nuevo" },
        { value: "USADO", label: "Usado" },
    ];

    const [form, setForm] = useState({
        nombre: "",
        tipo: "FUEGO" as TipoArma,
        descripcion: "",
        estado: "NUEVO" as EstadoArma,
    });

    useEffect(() => {
        if (!id) return;
        const fetchArma = async () => {
            try {
                const data = await getArma(id, token!);
                setArma(data);
            } catch {
                setArma(null);
            }
        };
        fetchArma();
    }, [id, token]);

    useEffect(() => {
        if (arma) {
            setForm({
                nombre: "",
                tipo: arma.tipo as TipoArma,
                descripcion: "",
                estado: arma.estado as EstadoArma,
            });
        }
    }, [arma]);

    const [mensaje, setMensaje] = useState<{ texto: string; tipo: "success" | "error" | "" }>({
        texto: "",
        tipo: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateArma(
                id!,
                {
                    nombre: form.nombre,
                    tipo: form.tipo as TipoArma,
                    descripcion: form.descripcion,
                    estado: form.estado as EstadoArma,
                },
                token!
            );
            setMensaje({ texto: "Arma actualizada correctamente", tipo: "success" });
            setTimeout(() => navigate("/"), 1500);
        } catch {
            setMensaje({ texto: "Error al actualizar el arma", tipo: "error" });

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
            <div className="bg-zinc-900 p-8 rounded-2xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-white">Editar Arma</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder={arma?.nombre}
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
                        placeholder={arma?.descripcion}
                        value={form.descripcion}
                        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                        className="p-3 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />

                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 hover:cursor-pointer text-white p-3 rounded-lg transition-colors"
                    >
                        Guardar cambios
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
