import * as auth from '../auth/auth';
import * as task from '../database/task';
import * as dbtype from '../types/server/database';
import * as request from '../types/shared/request';

export function register(req: request.Register): Promise<any> {
    return auth.addUser(req.payload);
}

export function verify(req: request.Login): Promise<dbtype.User | null> {
    return auth.verify(req.payload.login, req.payload.password);
}

export function taskList(req: request.TaskList, userId: number): Promise<any> {
    return task.getByUserId(userId);
}

export function newTask(req: request.NewTask, userId: number): Promise<any> {
    return task.insert(req.payload, userId);
}

export function archiveTask(req: request.ArchiveTask): Promise<any> {
    return task.archive(req.payload.id);
}

export function updateTask(req: request.UpdateTask): Promise<any> {
    return task.update(req.payload as dbtype.Task);
}

export function unknown(req: request.Client): Promise<any> {
    return new Promise((resolve, reject) => {
        reject('unknown request route: ' + req.route);
    });
}
