export interface User {
    id: number;
    login: string;
    email: string;
    authorized: boolean;
    hasControl: boolean;
}

export interface Task {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
}
