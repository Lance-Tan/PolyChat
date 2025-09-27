# PolyChat Backend Server

Organized Node.js backend for the PolyChat multilingual chat application.

## 📁 Project Structure

```
polychat-server/
├── config/
│   └── config.js          # Configuration settings
├── controllers/
│   └── socketController.js # Socket.IO event handling
├── routes/
│   └── api.js             # REST API routes
├── services/
│   ├── roomService.js     # Room and user management
│   └── translationService.js # Translation logic
├── server.js              # Main server file
├── package.json
└── README.md
```

## 🏗️ Architecture

### **Services** (`/services/`)
- **`roomService.js`**: Manages rooms and users in memory
- **`translationService.js`**: Handles LibreTranslate API calls

### **Controllers** (`/controllers/`)
- **`socketController.js`**: Handles all Socket.IO events and real-time communication

### **Routes** (`/routes/`)
- **`api.js`**: REST API endpoints for health checks, room info, and statistics

### **Config** (`/config/`)
- **`config.js`**: Centralized configuration management

## 🔌 API Endpoints

- `GET /api/health` - Server health check
- `GET /api/rooms` - List all active rooms
- `GET /api/rooms/:roomId` - Get specific room info
- `GET /api/stats` - Server statistics

## 🚀 Socket.IO Events

### Client → Server
- `join-room` - Join a chat room
- `send-message` - Send a message to the room

### Server → Client
- `user-joined` - User joined the room
- `user-left` - User left the room
- `message-received` - New message received
- `room-users` - Current users in the room

## 🌍 Translation Flow

1. User sends message in their language
2. Server identifies all users in the room
3. For each user with a different language:
   - Calls LibreTranslate API
   - Sends translated message to that user
4. Users see messages in their native language

## 🔧 Environment Variables

```env
PORT=5000
TRANSLATION_SERVICE=libre
LIBRETRANSLATE_URL=https://libretranslate.com
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Running the Server

```bash
npm start
# or for development
npm run dev
```

The server will start on `http://localhost:5000` with Socket.IO enabled for real-time communication.
