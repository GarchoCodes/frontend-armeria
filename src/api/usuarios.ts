import type { User } from "../types";

const BASE_URL = "https://api-armeria.garchocodes.cloud/usuarios"; // ⚠️ cambia por tu dominio

// Mapea _id -> id si es necesario
function mapUser(raw: any): User {
    return {
        id: raw.id ?? raw._id,
        nombre: raw.nombre,
        rol: raw.rol,
    };
}

// Login
export async function loginUsuario(nombre: string, password: string) {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, password }),
    });
    if (!res.ok) throw new Error("Credenciales incorrectas");
    return res.json(); // { token, user }
}

// Registrar usuario (solo admin puede enviar token)
export async function registerUsuario(
    data: { nombre: string; password: string; rol?: string },
    token?: string
) {
    const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Error al registrar usuario: ${txt}`);
    }
    return res.json();
}

// Obtener todos los usuarios (solo admin)
export async function getUsuarios(token?: string) {
    const res = await fetch(BASE_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Error al obtener usuarios");
    const raw = await res.json();
    return Array.isArray(raw) ? raw.map(mapUser) : [];
}

// Actualizar usuario
export async function updateUsuario(
    id: string,
    data: { nombre: string; rol?: string },
    token?: string
) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar usuario");
    const raw = await res.json();
    return mapUser(raw);
}

// Borrar usuario
export async function deleteUsuario(id: string, token?: string) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Error al eliminar usuario");
    return;
}
