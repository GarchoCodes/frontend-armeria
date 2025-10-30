const BASE_URL = "https://api-armeria.garchocodes.cloud/armas"; // ⚠️ tu API

export interface Arma {
    _id: string;
    nombre: string;
    descripcion: string;
    tipo: "FUEGO" | "BLANCA" | "EXPLOSIVO";
    estado: "NUEVO" | "USADO";
    creadorId: {
        nombre: string,
        rol: string
    };
    createdAt: string;
    updatedAt: string;
}

// Obtener todas las armas
export async function getArmas(token?: string | null): Promise<Arma[]> {
    const res = await fetch(BASE_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Error al obtener armas");
    return res.json();
}

// Crear un arma
export async function crearArma(
    nombre: string,
    tipo: string,
    estado: string,
    descripcion?: string,
    token?: string
) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ nombre, tipo, estado, descripcion }),
    });
    if (!res.ok) throw new Error("Error al crear arma");
    return res.json();
}

// Obtener un arma por id
export async function getArma(id: string, token?: string) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Error al obtener el arma");
    return res.json();
}

// Actualizar un arma
export async function updateArma(
    id: string,
    data: { nombre?: string; tipo?: "FUEGO" | "BLANCA" | "EXPLOSIVO"; descripcion?: string; estado?: "NUEVO" | "USADO" },
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
    if (!res.ok) throw new Error("Error al actualizar el arma");
    return res.json();
}

// Eliminar un arma
export async function deleteArma(id: string, token?: string) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Error al eliminar el arma");
    return res.json();
}
