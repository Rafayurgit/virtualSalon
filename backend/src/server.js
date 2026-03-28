 
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import http from 'http';
import { initSocket } from './utils/socket.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  const server = http.createServer(app);
  // initialize socket.io
  const io = await initSocket(server);
  console.log('Socket.io initialized');
  
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
