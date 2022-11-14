import createDebugger from 'debug';
import { WebSocketServer } from 'ws';


const debug = createDebugger('express-api:messaging');

const clients = [];

export function createWebSocketServer(httpServer) {
    debug('Creating WebSocket server');
    const wss = new WebSocketServer({
        server: httpServer,
    });

    // Handle new client connections.
    wss.on('connection', function (ws) {
        debug('New WebSocket client connected');

        // Keep track of clients.
        clients.push(ws);

        ws.send('hello');

        // Listen for messages sent by clients.
        ws.on('message', (message) => {
            // Make sure the message is valid JSON.
            let parsedMessage;
            try {
                parsedMessage = JSON.parse(message);
            } catch (err) {
                // Send an error message to the client with "ws" if you want...
                return debug('Invalid JSON message received from client');
            }

            // Handle the message.
            onMessageReceived(ws, parsedMessage);
        });

        // Clean up disconnected clients.
        ws.on('close', () => {
            clients.splice(clients.indexOf(ws), 1);
            debug('WebSocket client disconnected');
        });
    });
}

export function broadcastMessage(message) {
    debug(
        `Broadcasting message to all connected clients: ${JSON.stringify(message)}`
    );
    clients.forEach((client) => {
        client.send(JSON.stringify(message));
    });
    // You can easily iterate over the "clients" array to send a message to all
    // connected clients.
}

function onMessageReceived(ws, message) {
    debug(`Received WebSocket message: ${JSON.stringify(message)}`);
    // Do something with message...
}
