import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function getRoleLabel(role: string): string {
    switch (role) {
        case "ADMIN":
            return "Administrador";
        case "USER":
            return "Usuario";
        case "GUEST":
            return "Invitado";
        default:
            return "Desconocido";
    }
}

export default function Header() {
    const { token, role, logout } = useAuth();

    const isLoggedIn = !!token;

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="pt-6 pb-3 px-12">
            <nav className="flex justify-between items-center">
                <div className="flex gap-8 items-center">
                    <Link to="/">Armas</Link>

                    {role === "ADMIN" && <Link to="/usuarios">Usuarios</Link>}
                </div>

                <div className="flex gap-8 items-center">
                    <p>Rol: <span className="font-bold">{getRoleLabel(role!)}</span></p>
                    {isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 p-2.5 rounded-lg inset-shadow-sm inset-shadow-zinc-950/75 hover:cursor-pointer hover:bg-red-400"
                        >
                            Cerrar sesión
                        </button>
                    )}
                    {!isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="bg-green-500 p-2.5 rounded-lg inset-shadow-sm inset-shadow-zinc-950/75 hover:cursor-pointer hover:bg-green-400"
                        >
                            Iniciar sesión
                        </button>
                    )}
                </div>

            </nav>
        </header >
    );
}
