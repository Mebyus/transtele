export interface UnsavedUser {
    login: string;
    email: string;
    passwordHash: string;
}

export interface User extends UnsavedUser {
    id: number;
}

export interface UnsavedTask {
    name: string;
    description: string;
}

export interface Task extends UnsavedTask {
    id: number;
    createdAt: Date;
}
