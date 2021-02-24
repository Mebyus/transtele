export interface Login {
    login: string;
    password: string;
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
}
