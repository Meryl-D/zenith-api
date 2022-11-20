# Zenith
A basic REST API project

Zenith is an app that lets you journal your travels and share them with other users.

 -  You can post places that you visited, with a picture, a descrption and a location.
 -  Your posts can be private (only you can see them) or public (all Zenith users can see and comment on them)
 -  You can comment on other users posts.
 
Zenith's databse contains 3 collections

 - Users
 - Posts
 - Comments
    
## How to implement Zenith
    
      npm install

## WebSocket API documentation

WebSocket enables two-way communication between a client and a remote host. In Zenith WS is used to signal all users when a new post is posted, and to signal a user when there is a new comment under his post in real time.

Install WS npm package with the following command

      npm install ws
      
Then you will need to create a file ws.js. This is where the WebSocket server will accept connections from clients, it listens on port 3000 th same as the app. Once the WS server accepts commection from the client, you can send a message, and listen for client messages.
 
 
      import { WebSocketServer } from 'ws';
      // Create a WebSocket server that will accept connections on port 3000.
        const wss = new WebSocketServer({
        port: 3000
      });
      // Listen for client connections.
      wss.on('connection', function connection(ws) {
        // Listen for messages from the client once it has connected.
          ws.on('message', function incoming(message) {
          console.log('received: %s', message);
      });
        // Send something to the client.
        ws.send('something');
      });
