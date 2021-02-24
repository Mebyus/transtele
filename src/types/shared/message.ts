import * as error from './error';
import * as payload from './server-payload';

export interface Base {
    topic: string;
    payload?: any;
}

export interface Open extends Base {
    topic: 'connection-open';
}

export interface Session extends Base {
    topic: 'session-info';
    payload: payload.Session;
}

export interface Err extends Base {
    topic: 'error';
    payload: error.ServerSide | error.ClientSide;
}

export interface UpdateTask extends Base {
    topic: 'update-task';
    payload: payload.Task;
}

export interface ArchiveTask extends Base {
    topic: 'archive-task';
    payload: payload.ArchiveTask;
}

export interface NewTask extends Base {
    topic: 'new-task';
    payload: payload.Task;
}

export interface Verification extends Base {
    topic: 'login';
    payload: payload.Verification;
}

export interface TaskList extends Base {
    topic: 'task-list';
    payload: payload.TaskList;
}
