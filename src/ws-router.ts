import WebSocket = require('ws');
import query = require('./database/query');

export class MessageRouter {
    private readonly ws: WebSocket;

    constructor(ws: WebSocket) {
        this.ws = ws;
    }

    public dispatch(message: string) {
        //log the received message and send it back to the client
        console.log('received: %s', message);
        this.response(message).then((response: string) => {
            this.ws.send(response);
        });
    }

    private response(message: string): Promise<string> {
        const request = JSON.parse(message);
        return new Promise((resolve, reject) => {
            if (request.type === 'user-list') {
                query(resolve);
            } else {
                resolve('empty');
            }
        });
    }
}
