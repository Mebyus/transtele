import WebSocket = require('ws');
import * as handler from './handlers/handler';
import * as error from './types/shared/error';
import * as message from './types/shared/message';
import * as request from './types/shared/request';

export class MessageRouter {
    private readonly ws: WebSocket;

    constructor(ws: WebSocket) {
        this.ws = ws;
    }

    public dispatch(msg: string): void {
        let req: request.Client;
        try {
            req = JSON.parse(msg);
        } catch (e) {
            this.errorReply(e);
            return;
        }
        if (req.topic !== 'request') {
            console.log('Unknown message topic:', req.topic);
            return;
        }

        this.handleRequest(req)
            .then((payload: any): void => {
                this.reply(req.route, payload);
            })
            .catch((reason: any): void => {
                this.errorReply(reason);
            });
    }

    private handleRequest(req: request.Client): Promise<any> {
        switch (req.route) {
            case 'register':
                return handler.register(req as request.Register);
            case 'session-info':
            case 'login':
                return handler.verify(req as request.Login);
            case 'task-list':
                return handler.taskList(req as request.TaskList);
            case 'new-task':
                return handler.newTask(req as request.NewTask);
            case 'archive-task':
                return handler.archiveTask(req as request.ArchiveTask);
            case 'update-task':
                return handler.updateTask(req as request.UpdateTask);
            default:
                return handler.unknown(req);
        }
    }

    private errorReply(e: any): void {
        let cause = '';
        if (e) {
            cause = e.toString();
        }
        const serverSideError: error.ServerSide = {
            side: 'server',
            code: 1,
            cause: cause,
            description: '',
        };
        this.reply('error', serverSideError);
    }

    private reply(topic: string, payload: any): void {
        const resp: message.Base = {
            topic: topic,
            payload: payload,
        };
        this.ws.send(JSON.stringify(resp));
    }
}
