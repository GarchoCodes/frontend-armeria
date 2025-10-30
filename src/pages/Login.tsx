import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginUsuario } from "../api/usuarios";
import imgLogin from "../assets/login-armeria.jpg";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ nombre: "", password: "" });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const data = await loginUsuario(form.nombre, form.password);
            if (!data.token || !data.rol) throw new Error("Respuesta de login inválida");

            login({ token: data.token, rol: data.rol });
            navigate("/");
        } catch {
            setError("Usuario o contraseña incorrectos");
        }
    };

    const handleGuestLogin = () => {
        // Guarda un rol de invitado en el contexto sin necesidad de token
        login({ token: "", rol: "GUEST" });
        navigate("/"); // Redirige al inicio
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-zinc-900 rounded-2xl inset-shadow-sm inset-shadow-zinc-800 flex items-center">
                <div className="w-120 h-120">
                    <img src={imgLogin} alt="Imagen armeria login" className="rounded-s-2xl w-full h-full object-cover" />
                </div>
                <div className="flex flex-col items-center px-20">
                    <h2 className="text-3xl font-semibold">Iniciar sesión</h2>
                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col w-65 relative">
                        <input
                            className="bg-zinc-800 p-4 rounded-2xl inset-shadow-sm inset-shadow-zinc-900 w-full mb-3"
                            placeholder="Usuario"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            required
                        />

                        <div className="relative w-full my-3">
                            <input
                                className="bg-zinc-800 p-4 rounded-2xl inset-shadow-sm inset-shadow-zinc-900 w-full pr-12"
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

                        <div className={`transition-all duration-300 ms-1 ${error ? "opacity-100 relative" : "opacity-0 absolute pointer-events-none"}`}>
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>

                        <button type="submit" className="bg-zinc-50 text-zinc-900 p-3.5 my-3 rounded-2xl inset-shadow-sm inset-shadow-zinc-400 w-full hover:cursor-pointer hover:bg-zinc-200 transition-all">
                            Entrar
                        </button>
                        <button
                            type="button"
                            onClick={handleGuestLogin}
                            className="text-center bg-indigo-800 text-zinc-50 p-3.5 mt-3 rounded-2xl inset-shadow-sm inset-shadow-zinc-700 w-full hover:cursor-pointer hover:bg-indigo-600 transition-all"
                        >
                            Entrar como invitado
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
