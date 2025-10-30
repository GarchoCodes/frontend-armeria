import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArma } from "../api/armas";
import { ArrowLeft } from "lucide-react";

export default function ArmaCard() {
    const { id } = useParams<{ id: string }>();
    const [arma, setArma] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;

        const fetchArma = async () => {
            try {
                const data = await getArma(id);
                console.log(data)
                setArma(data);
            } catch {
                setError("No se pudo cargar el arma.");
            }
        };

        fetchArma();
    }, [id]);

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500 text-lg">
                {error}
            </div>
        );
    }

    if (!arma) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-400">
                Cargando arma...
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center flex-grow bg-zinc-950 text-white px-4">
            <div className="max-w-xl w-full bg-zinc-900/80 border border-zinc-800 shadow-2xl rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold mb-4 text-indigo-400">{arma.nombre}</h1>
                    <button
                        onClick={() => navigate("/")}
                        className="flex hover:cursor-pointer items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-all shadow-sm hover:shadow-md"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-sm font-medium">Volver</span>
                    </button>
                </div>

                <div className="space-y-3 text-sm text-zinc-300">
                    <p>
                        <span className="text-zinc-400 font-medium">Tipo:</span>{" "}
                        <span className="font-semibold text-white">
                            {arma.tipo === "FUEGO"
                                ? "Arma de fuego"
                                : arma.tipo === "BLANCA"
                                    ? "Arma blanca"
                                    : "Explosivo"}
                        </span>
                    </p>

                    <p>
                        <span className="text-zinc-400 font-medium">Estado:</span>{" "}
                        <span
                            className={`font-semibold ${arma.estado === "NUEVO" ? "text-green-400" : "text-yellow-400"
                                }`}
                        >
                            {arma.estado === "NUEVO" ? "Nuevo" : "Usado"}
                        </span>
                    </p>

                    <p>
                        <span className="text-zinc-400 font-medium">Descripción:</span>{" "}
                        <span className="text-zinc-200">{arma.descripcion || "Sin descripción"}</span>
                    </p>

                    <hr className="border-zinc-700 my-4" />

                    <div className="text-sm">
                        <p>
                            <span className="text-zinc-400 font-medium">Creador:</span>{" "}
                            <span className="text-white font-semibold">{arma.creadorId?.nombre || "Desconocido"}</span>
                        </p>
                        <p>
                            <span className="text-zinc-400 font-medium">Rol:</span>{" "}
                            <span className="text-indigo-300">{arma.creadorId?.rol === "ADMIN" ? "Administrador" : "Usuario"}</span>
                        </p>
                        <p>
                            <span className="text-zinc-400 font-medium">Creado el:</span>{" "}
                            <span className="text-zinc-300">
                                {arma.createdAt ? new Date(arma.createdAt).toLocaleString() : "Fecha no disponible"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
