import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { deleteArma, getArmas, type Arma } from "../api/armas";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
    const { token, role } = useAuth();
    const [armas, setArmas] = useState<Arma[]>([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [armaSeleccionada, setArmaSeleccionada] = useState<Arma | null>(null);
    const [confirmName, setConfirmName] = useState("");
    const [toast, setToast] = useState<{ mensaje: string; tipo: "success" | "error" | "" }>({
        mensaje: "",
        tipo: "",
    });
    const navigate = useNavigate();

    const handleDeleteConfirm = async () => {
        if (!armaSeleccionada) return;

        if (confirmName !== armaSeleccionada.nombre) {
            setToast({ mensaje: "El nombre no coincide. Eliminación cancelada.", tipo: "error" });
            setTimeout(() => setToast({ mensaje: "", tipo: "" }), 3000);
            return;
        }

        try {
            await deleteArma(armaSeleccionada._id!, token ?? undefined);
            setArmas((prev) => prev.filter((arma) => arma._id !== armaSeleccionada._id));
            setToast({ mensaje: "Arma eliminada correctamente.", tipo: "success" });
        } catch {
            setToast({ mensaje: "Error al eliminar arma", tipo: "error" });
        }

        setShowModal(false);
        setConfirmName("");
        setTimeout(() => setToast({ mensaje: "", tipo: "" }), 3000);
    };

    useEffect(() => {
        getArmas(token ?? undefined)
            .then(setArmas)
            .catch(() => alert("Error al cargar armas"))
            .finally(() => setLoading(false));
    }, [token, role]);

    if (loading) return <Loader />;

    return (
        <div className="px-12 pb-12 flex flex-col relative">
            {/* ✅ Toast de mensajes */}
            {toast.mensaje && (
                <div
                    className={`fixed top-25 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl text-white shadow-lg transition-all duration-300 animate-fade-down z-50
                        ${toast.tipo === "success" ? "bg-green-600" : "bg-red-600"}`}
                >
                    {toast.mensaje}
                </div>
            )}

            <div className="flex items-center justify-between py-8">
                <h2 className="text-3xl font-semibold">Gestión de armas</h2>
                {role !== "GUEST" && <Link to="/crear-arma">
                    <button className="p-4 bg-green-600 text-white rounded-xl text-2xl flex items-center justify-center gap-1.5 hover:bg-green-500 hover:cursor-pointer transition">
                        <p className="text-lg">Crear arma</p> <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" /></svg>
                    </button>
                </Link>}
            </div>

            <table className="w-full border border-zinc-700 text-sm text-left text-zinc-200 rounded-lg overflow-hidden shadow-md">
                <thead className="bg-zinc-800 text-zinc-100 uppercase text-xl">
                    <tr>
                        <th className="px-6 py-6">Arma</th>
                        <th className="px-6 py-6">Tipo</th>
                        <th className="px-6 py-6">Estado</th>
                        <th className="px-6 py-6">Creador</th>
                        <th className="px-6 py-6">Rol</th>
                        <th className="px-6 py-6 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {armas.map((a, index) => (
                        <tr
                            key={a._id}
                            className={`${index % 2 === 0 ? "bg-zinc-900" : "bg-zinc-800"} hover:bg-zinc-700 transition-colors`}
                        >
                            <td className="px-6 py-6 font-medium text-lg text-zinc-100">{a.nombre}</td>
                            <td className="px-6 py-6 text-lg">
                                {a.tipo === "FUEGO" ? "Fuego" : a.tipo === "BLANCA" ? "Blanca" : "Explosiva"
                                }
                            </td>
                            <td className="px-6 py-6 text-lg">
                                {a.estado === "NUEVO" ? "Nuevo" : "Usado"}
                            </td>
                            <td className="px-6 py-6 font-medium text-lg text-zinc-100">{a.creadorId?.nombre!}</td>
                            <td className="px-6 py-6 text-lg">
                                {a.creadorId?.rol! === "ADMIN" ? "Administrador" : "Usuario"}
                            </td>
                            <td className="pe-6 py-6 flex gap-4 justify-end items-center">
                                <button
                                    onClick={() => navigate(`/arma/${a._id}`)}
                                    className="bg-green-600 hover:bg-green-500 hover:cursor-pointer text-white px-3 py-1.5 rounded-md text-xl transition flex items-center gap-1.5"
                                >
                                    <p className="text-lg">Detalles</p> <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M8 18h8v-2H8zm0-4h8v-2H8zm-2 8q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h8l6 6v12q0 .825-.587 1.413T18 22zm7-13h5l-5-5z" /></svg>
                                </button>
                                {role !== "GUEST" && <button
                                    onClick={() => navigate(`/editar-arma/${a._id}`, { state: { a } })}
                                    className="bg-indigo-600 hover:bg-indigo-500 hover:cursor-pointer text-white px-3 py-1.5 rounded-md text-xl transition flex items-center gap-1.5"
                                >
                                    <p className="text-lg">Editar</p> <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L368 46.1l97.9 97.9l24.4-24.4c21.9-21.9 21.9-57.3 0-79.2zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L432 177.9L334.1 80zM96 64c-53 0-96 43-96 96v256c0 53 43 96 96 96h256c53 0 96-43 96-96v-96c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32z" /></svg>
                                </button>}
                                {role !== "GUEST" && <button
                                    onClick={() => {
                                        setArmaSeleccionada(a);
                                        setShowModal(true);
                                    }}
                                    className="bg-red-600 hover:bg-red-500 hover:cursor-pointer text-white px-3 py-1.5 rounded-md text-xl transition flex items-center gap-1.5"
                                >
                                    <p className="text-lg">Eliminar</p> <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M2 5v10c0 .55.45 1 1 1h9c.55 0 1-.45 1-1V5zm3 9H4V7h1zm2 0H6V7h1zm2 0H8V7h1zm2 0h-1V7h1zm2.25-12H10V.75A.753.753 0 0 0 9.25 0h-3.5A.753.753 0 0 0 5 .75V2H1.75a.75.75 0 0 0-.75.75V4h13V2.75a.75.75 0 0 0-.75-.75M9 2H6v-.987h3z" /></svg>
                                </button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && armaSeleccionada && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 backdrop-blur-sm z-50 scale-115">
                    <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl w-96 text-center border border-zinc-700">
                        <h2 className="text-xl font-semibold mb-2">Confirmar eliminación</h2>
                        <p className="text-xs font-semibold text-zinc-300 mb-2.5">Asegurate de ser el creador del arma o tener permisos de administrador</p>
                        <p className="text-xs text-zinc-300 mb-4">
                            Escribe el nombre del arma{" "}
                            <span className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded-md font-mono text-sm border border-zinc-700">
                                {armaSeleccionada.nombre!}
                            </span>{" "}
                            para confirmar.
                        </p>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleDeleteConfirm();
                            }}
                        >
                            <input
                                type="text"
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                                placeholder="Nombre del arma"
                                className="w-full bg-zinc-800 text-white p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 hover:cursor-pointer transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 hover:cursor-pointer text-white transition"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

}
