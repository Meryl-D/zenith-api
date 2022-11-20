# Zenith
A basic REST API project

Zenith is an app that lets you journal your travels and share them with other users.

 -  You can post places that you visited, with a picture, a description and a location.
 -  Your posts can be private (only you can see them) or public (all Zenith users can see and comment on them)
 -  You can comment on other users posts.
 
Zenith's database contains 3 collections

 - Users
 - Posts
 - Comments
    
## How to implement Zenith
    
	Simply fork or download the project. Then you can install dependancies with the following command

	  npm install

## WebSocket API documentation

WebSocket enables two-way communication between a client and a remote host. In Zenith WS is used to signal all users when a new post is posted, and to count all the comments under a post in real time.

Install WS npm package with the following command

      npm install ws
      
First, you will need to create a file ws.js. This is where the WebSocket server will accept connections from clients, it listens on port 3000 the same as the app. Once the WS server accepts the connection from the client, you can send a message, and listen for client messages.
 
 
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

Then in start.js, you will need to create the WS server. The HTTP server has already been created before, since the WS server listen on the same port as the HTTP server, you will only need to import the createWebSocketServer function and pass the const serve in its parameters.

	import { createWebSocketServer } from '../ws.js';

	const debug = createDebugger('projet:server')
	
	/**
	 * Get port from environment and store in Express.
	 */
	const port = normalizePort(process.env.PORT || "3000");
	app.set("port", port);
	
	/**
	 * Create HTTP server.
	 */
	const server = http.createServer(app);
	
	/**
 	* Create HTTP & WebSocket servers.
	 */
	createWebSocketServer(server);
	
Now that everything is implemented, you can broadcast messages from any routes. For example, in Zenith we notify every user when someone posts a new post.

	import { broadcastMessage } from '../ws.js';

	/* POST a new post */
	postsRouter.post('/', authenticate, checkResourceId, upload.single('picture'), async function (req, res, next) {
	/**
 		* ...
	 */
	 
  	 // Broadcast the new post to all connected users
     broadcastMessage({ username: postingUser.username, event: 'posted a new post' })
	});
