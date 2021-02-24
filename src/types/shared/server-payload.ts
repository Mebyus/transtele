import * as client from './client-payload';

export interface User {
    id: number;
    login: string;
    email: string;
}

export interface Task extends client.UpdateTask {
    createdAt: Date;
}

export interface TaskList {
    tasks: Task[];
}

export interface Verification {
    verified: boolean;
    user?: User;
}

export interface ArchiveTask extends client.ArchiveTask {}

export interface Session {
    exists: boolean;
    user?: User;
}
