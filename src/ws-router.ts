import WebSocket = require('ws');
import * as auth from './auth/auth';
import * as task from './database/task';
import * as dbtype from './types/server/database';
import * as error from './types/shared/error';
import * as message from './types/shared/message';
import * as request from './types/shared/request';
// import query = require('./database/query');

export class MessageRouter {
    private readonly ws: WebSocket;

    constructor(ws: WebSocket) {
        this.ws = ws;
    }

    public dispatch(msg: string): void {
        const req: request.Client = JSON.parse(msg);
        if (req.topic !== 'request') {
            console.log('Unknown message topic:', req.topic);
            return;
        }

        let result: Promise<any>;
        switch (req.route) {
            case 'register':
                const regReq: request.Register = req as request.Register;
                result = auth.addUser(regReq.payload);
                break;
            case 'session-info':
            case 'login':
                const loginReq: request.Login = req as request.Login;
                result = auth.verify(loginReq.payload.login, loginReq.payload.password);
                break;
            case 'task-list':
                result = task.getByUserId(1); // need uder id here
                break;
            case 'new-task':
                const newReq: request.NewTask = req as request.NewTask;
                result = task.insert(newReq.payload, 1); // need uder id here
                break;
            case 'archive-task':
                const archiveReq: request.ArchiveTask = req as request.ArchiveTask;
                result = task.archive(archiveReq.payload.id);
                break;
            case 'update-task':
                const updateReq: request.UpdateTask = req as request.UpdateTask;
                result = task.update(updateReq.payload as dbtype.Task);
                break;
            default:
                console.log('Unknown request route:', req.route);
                return;
        }

        result
            .then((payload: any): void => {
                this.reply(req.route, payload);
            })
            .catch((reason: any): void => {
                console.log(reason);
                let cause = '';
                if (reason) {
                    cause = reason.toString();
                }
                const serverSideError: error.ServerSide = {
                    side: 'server',
                    code: 1,
                    cause: cause,
                    description: '',
                };
                this.reply('error', serverSideError);
            });
    }

    private reply(topic: string, payload: any): void {
        const resp: message.Base = {
            topic: topic,
            payload: payload,
        };
        this.ws.send(JSON.stringify(resp));
    }
}
