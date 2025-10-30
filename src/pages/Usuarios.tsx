import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUsuarios, deleteUsuario } from "../api/usuarios";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../types";

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const { token } = useAuth();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<User | null>(null);
    const [confirmName, setConfirmName] = useState("");
    const [toast, setToast] = useState<{ mensaje: string; tipo: "success" | "error" | "" }>({
        mensaje: "",
        tipo: "",
    });

    const cargarUsuarios = async () => {
        try {
            const data = await getUsuarios(token!);
            setUsuarios(data);
        } catch {
            setToast({ mensaje: "Error al cargar usuarios", tipo: "error" });
            setTimeout(() => setToast({ mensaje: "", tipo: "" }), 3000);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!usuarioSeleccionado) return;

        if (confirmName !== usuarioSeleccionado.nombre) {
            setToast({ mensaje: "El nombre no coincide. Eliminación cancelada.", tipo: "error" });
            setTimeout(() => setToast({ mensaje: "", tipo: "" }), 3000);
            return;
        }

        try {
            await deleteUsuario(usuarioSeleccionado.id!, token ?? undefined);
            setUsuarios((prev) => prev.filter((u) => u.id !== usuarioSeleccionado.id));
            setToast({ mensaje: "Usuario eliminado correctamente.", tipo: "success" });
        } catch {
            setToast({ mensaje: "Error al eliminar usuario", tipo: "error" });
        }

        setShowModal(false);
        setConfirmName("");
        setTimeout(() => setToast({ mensaje: "", tipo: "" }), 3000);
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

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
                <h2 className="text-3xl font-semibold">Gestión de usuarios</h2>
                <Link to="/register">
                    <button className="p-4 bg-green-600 text-white rounded-xl text-xl flex items-center justify-center gap-1.5 hover:bg-green-500 hover:cursor-pointer transition">
                        <p className="text-lg">Crear usuario</p> <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M6 7a5 5 0 1 1 10 0A5 5 0 0 1 6 7m-1.178 7.672C6.425 13.694 8.605 13 11 13q.671 0 1.316.07a1 1 0 0 1 .72 1.557A5.97 5.97 0 0 0 12 18c0 .92.207 1.79.575 2.567a1 1 0 0 1-.89 1.428L11 22c-2.229 0-4.335-.14-5.913-.558c-.785-.208-1.524-.506-2.084-.956C2.41 20.01 2 19.345 2 18.5c0-.787.358-1.523.844-2.139c.494-.625 1.177-1.2 1.978-1.69ZM18 14a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 0 1 1-1" /></g></svg>
                    </button>
                </Link>
            </div>

            <table className="w-full border border-zinc-700 text-sm text-left text-zinc-200 rounded-lg overflow-hidden shadow-md">
                <thead className="bg-zinc-800 text-zinc-100 uppercase text-xl">
                    <tr>
                        <th className="px-6 py-6">Usuario</th>
                        <th className="px-6 py-6">Rol</th>
                        <th className="px-6 py-6 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario, index) => (
                        <tr
                            key={usuario.id}
                            className={`${index % 2 === 0 ? "bg-zinc-900" : "bg-zinc-800"} hover:bg-zinc-700 transition-colors`}
                        >
                            <td className="px-6 py-6 font-medium text-lg text-zinc-100">{usuario.nombre}</td>
                            <td className="px-6 py-6 text-lg">
                                {usuario.rol === "ADMIN" ? "Administrador" : "Usuario"}
                            </td>
                            <td className="px-6 py-6 flex gap-4 justify-end items-center">
                                <button
                                    onClick={() => navigate(`/usuarios/${usuario.id}`, { state: { usuario } })}
                                    className="bg-indigo-600 hover:bg-indigo-500 hover:cursor-pointer text-white px-3 py-1.5 rounded-md text-xl transition flex items-center gap-1.5"
                                >
                                    <p className="text-lg">Editar</p> <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M11 2a5 5 0 1 0 0 10a5 5 0 0 0 0-10m0 11q.887.002 1.724.12a1 1 0 0 1 .539 1.726a6.98 6.98 0 0 0-2.21 6.022a1 1 0 0 1-1.012 1.123c-2.01-.04-3.89-.216-5.294-.646c-.702-.215-1.364-.517-1.866-.962C2.35 19.913 2 19.28 2 18.5c0-.787.358-1.523.844-2.139c.494-.625 1.177-1.2 1.978-1.69C6.425 13.695 8.605 13 11 13m10.212 1.034a2.5 2.5 0 0 1 0 3.535l-3.418 3.418a1.5 1.5 0 0 1-.848.424l-2.309.33a1 1 0 0 1-1.132-1.133l.33-2.308a1.5 1.5 0 0 1 .424-.849l3.418-3.418a2.5 2.5 0 0 1 3.535 0Z" /></g></svg>
                                </button>
                                <button
                                    onClick={() => {
                                        setUsuarioSeleccionado(usuario);
                                        setShowModal(true);
                                    }}
                                    className="bg-red-600 hover:bg-red-500 hover:cursor-pointer text-white px-3 py-1.5 rounded-md text-xl transition flex items-center gap-1.5"
                                >
                                    <p className="text-lg">Eliminar</p><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M11 2a5 5 0 1 0 0 10a5 5 0 0 0 0-10m0 11c-2.395 0-4.575.694-6.178 1.672c-.8.488-1.484 1.064-1.978 1.69C2.358 16.976 2 17.713 2 18.5c0 .845.411 1.511 1.003 1.986c.56.45 1.299.748 2.084.956C6.665 21.859 8.771 22 11 22q.346 0 .685-.005a1 1 0 0 0 .89-1.428A6 6 0 0 1 12 18c0-1.252.383-2.412 1.037-3.373a1 1 0 0 0-.72-1.557Q11.671 13 11 13m5.586 2.172a1 1 0 0 0-1.414 1.414L16.586 18l-1.414 1.414a1 1 0 1 0 1.414 1.414L18 19.414l1.414 1.414a1 1 0 1 0 1.414-1.414L19.414 18l1.414-1.414a1 1 0 0 0-1.414-1.414L18 16.586z" /></g></svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ✅ Modal de confirmación */}
            {showModal && usuarioSeleccionado && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 backdrop-blur-sm z-50 scale-115">
                    <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl w-96 text-center border border-zinc-700">
                        <h2 className="text-xl font-semibold mb-2">Confirmar eliminación</h2>
                        <p className="text-xs text-zinc-300 mb-4">
                            Escribe el nombre del usuario{" "}
                            <span className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded-md font-mono text-sm border border-zinc-700">
                                {usuarioSeleccionado.nombre}
                            </span>{" "}
                            para confirmar.
                        </p>

                        {/* ✅ manejamos submit en el form */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault(); // evita recargar la página
                                handleDeleteConfirm(); // ejecuta tu lógica de borrado
                            }}
                        >
                            <input
                                type="text"
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                                placeholder="Nombre del usuario"
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
                                {/* ✅ ya no lleva onClick, se activa con Enter o click */}
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
