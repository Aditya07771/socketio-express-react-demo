import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const port = 3000;

const app = express();
const server = createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Server is running');
});

io.on('connection', (socket) => {
  console.log('A user connected');
  console.log(`Socket ID: ${socket.id}`);

  socket.emit('welcome', 'Welcome to the WebSocket server!');
  socket.broadcast.emit('welcome', `A new user has joined: ${socket.id}`);

  // Add this handler for the 'message' event
  socket.on('message', (data) => {
    console.log(`Message received from ${socket.id}: ${data}`);
    
    // You can emit the message back to all clients if needed
    io.emit('message', {
      id: socket.id,
      message: data,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});