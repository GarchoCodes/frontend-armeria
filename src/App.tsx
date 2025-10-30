import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";

import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Usuarios from "./pages/Usuarios";
import EditarUsuario from "./pages/EditarUsuario";
import CrearArma from "./pages/CrearArma";
import { useEffect, useState, type JSX } from "react";
import EditarArma from "./pages/EditarArma";
import ArmaCard from "./components/ArmaCard";
import Loader from "./components/Loader";

function AppRoutes() {
  const { token, role, loading } = useAuth();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem("appLoaderLastShown");
    const now = new Date().getTime();

    if (!lastShown || now - parseInt(lastShown) > 7 * 24 * 60 * 60 * 1000) {
      // Mostrar loader si nunca se mostró o han pasado más de 7 días
      setShowLoader(true);
      localStorage.setItem("appLoaderLastShown", now.toString());

      // Ocultar loader después de 2.5s + 1s extra
      const timeout = setTimeout(() => {
        setShowLoader(false);
      }, 3500);

      return () => clearTimeout(timeout);
    }
  }, []);

  if (showLoader) return <Loader />;

  // 🔒 Componente para proteger rutas según login/rol
  const ProtectedRoute = ({
    children,
    roles,
  }: {
    children: JSX.Element;
    roles?: string[];
  }) => {
    // ⏳ Esperar a que cargue el contexto antes de redirigir
    if (loading) return <div>Cargando...</div>;

    if (!token) {
      return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(role!)) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <>
      {location.pathname !== "/login" && <Header />}
      <Routes>
        {/* 🌐 Rutas públicas */}
        <Route path="/" element={<Home />} />

        <Route path="/arma/:id" element={<ArmaCard />} />

        {/* Si ya estás logueado, evita volver a /login o /register */}
        <Route
          path="/login"
          element={
            token ? <Navigate to="/" replace /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Register />
            </ProtectedRoute>
          }
        />

        {/* 👤 Rutas de usuario */}
        <Route
          path="/crear-arma"
          element={
            <ProtectedRoute roles={["USER", "ADMIN"]}>
              <CrearArma />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editar-arma/:id"
          element={
            <ProtectedRoute roles={["USER", "ADMIN"]}>
              <EditarArma />
            </ProtectedRoute>
          }
        />

        {/* 🛠️ Rutas de administrador */}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Usuarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios/:id"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <EditarUsuario />
            </ProtectedRoute>
          }
        />

        {/* 🚫 Cualquier otra ruta */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </div>

  );
}
