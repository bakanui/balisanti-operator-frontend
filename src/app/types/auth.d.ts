export interface User {
    id: number;
    email: string;
    name: string;
    id_role: number;
    nama_role: string;
    created_at: Date;
    updated_at: Date;
    id_dermaga: number;
    nama_dermaga: string;
}

export interface Authorisation {
    token: string;
    type: string;
}

export interface IAuth {
    status: string;
    user: User;
    authorisation: Authorisation;
}

export interface IOptions {
    value: string;
    label: string;
};

export interface IUsers {
    id: number;
    email: string;
    name: string;
    id_role: number;
    nama_role: string;
    nama_dermaga: string;
    id_dermaga: number;
}