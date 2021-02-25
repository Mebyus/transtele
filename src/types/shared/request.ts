import * as payload from './client-payload';
import * as message from './message';

export interface Client extends message.Base {
    topic: 'request';
    route: string;
}

export interface Session extends Client {
    route: 'session-info';
}

export interface Login extends Client {
    route: 'login';
    payload: payload.Login;
}

export interface Register extends Client {
    route: 'register';
    payload: payload.NewUser;
}

export interface TaskList extends Client {
    route: 'task-list';
}

export interface NewTask extends Client {
    route: 'new-task';
    payload: payload.NewTask;
}

export interface ArchiveTask extends Client {
    route: 'archive-task';
    payload: payload.ArchiveTask;
}

export interface UpdateTask extends Client {
    route: 'update-task';
    payload: payload.UpdateTask;
}
