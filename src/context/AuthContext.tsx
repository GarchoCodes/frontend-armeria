import { createContext, useState, useEffect, type ReactNode } from "react";
import type { Role } from "../types";

interface AuthContextType {
    token: string | null;
    role: Role;
    login: (data: { token: string; rol: Role }) => void;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    role: "GUEST",
    login: () => { },
    logout: () => { },
    loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<Role>("GUEST");
    const [loading, setLoading] = useState(true);

    // Cargar datos del localStorage al iniciar
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("rol") as Role | null;

        if (storedToken && storedRole) {
            setToken(storedToken);
            setRole(storedRole);
        }
        setLoading(false);
    }, []);

    const login = (data: { token: string; rol: Role }) => {
        setToken(data.token);
        setRole(data.rol);
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol!);
    };

    const logout = () => {
        setToken(null);
        setRole("GUEST");
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
    };

    return (
        <AuthContext.Provider value={{ token, role, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
