const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// Import organized modules
const SocketController = require('./controllers/socketController');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Socket.IO handling
const socketController = new SocketController(io);
io.on('connection', (socket) => {
  socketController.handleConnection(socket);
});

// Server startup
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 PolyChat server running on port ${PORT}`);
  console.log(`🌍 Translation service: LLM-based (LangChain)`);
  console.log(`📡 Socket.IO enabled for real-time communication`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}/api`);
});