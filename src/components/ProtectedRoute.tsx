// src/components/ProtectedRoute.tsx
import { type ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import type { Role } from "../types";
import Loader from "./Loader";

interface Props {
    children: ReactNode;
    roles: Role[];
}

export default function ProtectedRoute({ children, roles }: Props) {
    const { token, role, loading } = useContext(AuthContext);

    // Si no hay token y el rol no es GUEST, se redirige al login
    if (loading) return <Loader />
    if (!token) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(role)) return <Navigate to="/" replace />;

    return children;

}