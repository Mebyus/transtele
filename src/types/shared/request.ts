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
    message: payload.Login;
}

export interface TaskList extends Client {
    route: 'task-list';
}

export interface NewTask extends Client {
    route: 'new-task';
    message: payload.NewTask;
}

export interface ArchiveTask extends Client {
    route: 'archive-task';
    message: payload.ArchiveTask;
}

export interface UpdateTask extends Client {
    route: 'update-task';
    message: payload.UpdateTask;
}
