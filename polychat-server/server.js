const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

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

// Libre Config
const LIBRETRANSLATE_URL = 'https://libretranslate.com';


const rooms = new Map();
const users = new Map();

// Translation function using LibreTranslate
async function translateText(text, targetLanguage, sourceLanguage = 'auto') {
  try {
    const response = await axios.post(`${LIBRETRANSLATE_URL}/translate`, {
      q: text,
      source: sourceLanguage,
      target: targetLanguage,
      format: 'text'
    });
    return response.data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room
  socket.on('join-room', async (data) => {
    const { roomId, username, language } = data;
    
    // Store user info
    users.set(socket.id, { username, language, roomId });
    
    // Add user to room
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);
    
    socket.join(roomId);
    
    // Notify room about new user
    socket.to(roomId).emit('user-joined', {
      username,
      language,
      message: `${username} joined the chat`
    });
    
    // Send current room users to the new user
    const roomUsers = Array.from(rooms.get(roomId)).map(id => users.get(id));
    socket.emit('room-users', roomUsers);
  });

  // Handle messages
  socket.on('send-message', async (data) => {
    const { roomId, message, originalLanguage } = data;
    const user = users.get(socket.id);
    
    if (!user) return;

    // Get all users in the room
    const roomUsers = Array.from(rooms.get(roomId) || []);
    
    // Send message to all users in the room with appropriate translations
    for (const userId of roomUsers) {
      const targetUser = users.get(userId);
      if (!targetUser) continue;

      let translatedMessage = message;
      
      // Translate message if target user speaks a different language
      if (targetUser.language !== originalLanguage) {
        translatedMessage = await translateText(message, targetUser.language, originalLanguage);
      }

      io.to(userId).emit('message-received', {
        id: Date.now() + Math.random(),
        username: user.username,
        message: translatedMessage,
        originalMessage: message,
        originalLanguage,
        targetLanguage: targetUser.language,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      const { roomId, username } = user;
      
      // Remove user from room
      if (rooms.has(roomId)) {
        rooms.get(roomId).delete(socket.id);
        
        // Notify room about user leaving
        socket.to(roomId).emit('user-left', {
          username,
          message: `${username} left the chat`
        });
      }
      
      users.delete(socket.id);
    }
    console.log('User disconnected:', socket.id);
  });
});

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PolyChat server is running' });
});

app.get('/api/rooms', (req, res) => {
  const roomList = Array.from(rooms.keys()).map(roomId => ({
    id: roomId,
    userCount: rooms.get(roomId).size
  }));
  res.json(roomList);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`PolyChat server running on port ${PORT}`);
});
