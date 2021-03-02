import WebSocket = require('ws');
import * as handler from './handlers/handler';
import * as dbtype from './types/server/database';
import * as error from './types/shared/error';
import * as message from './types/shared/message';
import * as request from './types/shared/request';
import * as server from './types/shared/server-payload';

interface WSSession {
    user: dbtype.User;
}

export const sessions = new Map<string, WSSession>();

export class MessageRouter {
    private readonly ws: WebSocket;
    private readonly sessionID: string;
    private authorized: boolean;
    private session: WSSession | null;

    constructor(ws: WebSocket, sessionID: string) {
        this.ws = ws;
        this.sessionID = sessionID;
        this.authorized = false;
        this.session = null;
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
        // Unauthorized requests
        switch (req.route) {
            case 'register':
                return handler.register(req as request.Register);
            case 'session-info':
                return this.sessionInfo(req as request.Session);
            case 'login':
                return this.login(req as request.Login);
        }

        // Authorized requests
        if (!this.authorized) {
            return new Promise((resolve, reject) => {
                reject('unauthorized');
            });
        }
        switch (req.route) {
            case 'task-list':
                return handler.taskList(req as request.TaskList, this.session!.user.id);
            case 'new-task':
                return handler.newTask(req as request.NewTask, this.session!.user.id);
            case 'archive-task':
                return handler.archiveTask(req as request.ArchiveTask);
            case 'update-task':
                return handler.updateTask(req as request.UpdateTask);
            default:
                return handler.unknown(req);
        }
    }

    private login(req: request.Login): Promise<boolean> {
        return handler.verify(req).then((user: dbtype.User | null): boolean => {
            if (user) {
                const newSession = {
                    user: user,
                };
                sessions.set(this.sessionID, newSession);
                this.authorized = true;
                this.session = newSession;
                return true;
            }
            return false;
        });
    }

    private sessionInfo(req: request.Session): Promise<server.Session> {
        return new Promise((resolve, reject) => {
            const session = sessions.get(this.sessionID);
            if (session) {
                resolve({
                    exists: true,
                    user: session.user,
                });
                this.authorized = true;
                this.session = session;
            } else {
                resolve({
                    exists: false,
                });
            }
        });
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
