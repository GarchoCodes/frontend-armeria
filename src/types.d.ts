export type Role = "ADMIN" | "USER" | "GUEST" | undefined;

export interface User {
    _id?: string;
    id?: string;
    nombre: string;
    rol: Role;
}

export interface AuthData {
    token: string;
    user: User;
}

export interface Arma {
    id: string;
    nombre: string;
    descripcion: string;
}
