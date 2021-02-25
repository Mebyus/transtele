export interface Login {
    login: string;
    password: string;
}

export interface NewUser {
    login: string;
    email: string;
    password: string;
    confirm: string;
}

export interface NewTask {
    name: string;
    description: string;
}

export interface ArchiveTask {
    id: number;
}

export interface UpdateTask extends NewTask {
    id: number;
    createdAt?: Date;
}
