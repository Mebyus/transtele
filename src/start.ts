import * as express from 'express';
import * as app from './app';
import * as wsRouter from './ws-router';
import debug = require('debug');
import http = require('http');
import WebSocket = require('ws');

const port = normalizePort(process.env.PORT || '3000');
app.default.set('port', port);

const server = http.createServer(app.default);

const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

server.on('upgrade', (req: express.Request, socket, head): void => {
    console.log('Starting upgrade. Session id:', req.sessionID);

    app.sessionParser(req, {} as any, (): void => {
        if (!req.sessionID) {
            socket.write('HTTP/1.1 401 Unauthorized\n\n');
            socket.destroy();
            return;
        }

        wss.handleUpgrade(req, socket, head, function (ws) {
            wss.emit('connection', ws, req);
        });
    });
});

wss.on('connection', (ws: WebSocket, req: express.Request): void => {
    const msgRouter = new wsRouter.MessageRouter(ws, req.sessionID);

    ws.on('message', msgRouter.dispatch.bind(msgRouter));
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): string | number | boolean {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(): void {
    const addr = server.address();
    if (addr) {
        const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }
}
