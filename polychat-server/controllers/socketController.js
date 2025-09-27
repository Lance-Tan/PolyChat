const roomService = require('../services/roomService');
const translationService = require('../services/translationService');

class SocketController {
  constructor(io) {
    this.io = io;
  }

  /**
   * Handle new socket connection
   * @param {Object} socket - Socket instance
   */
  handleConnection(socket) {
    console.log('User connected:', socket.id);

    // Handle joining a room
    socket.on('join-room', async (data) => {
      await this.handleJoinRoom(socket, data);
    });

    // Handle sending messages
    socket.on('send-message', async (data) => {
      await this.handleSendMessage(socket, data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });
  }

  /**
   * Handle user joining a room
   * @param {Object} socket - Socket instance
   * @param {Object} data - Join room data
   */
  async handleJoinRoom(socket, data) {
    const { roomId, username, language } = data;
    
    // Add user to room
    roomService.addUserToRoom(socket.id, roomId, username, language);
    
    // Join socket room
    socket.join(roomId);
    
    // Notify room about new user
    socket.to(roomId).emit('user-joined', {
      username,
      language,
      message: `${username} joined the chat`
    });
    
    // Send current room users to the new user
    const roomUsers = roomService.getRoomUsers(roomId);
    socket.emit('room-users', roomUsers);
  }

  /**
   * Handle sending messages
   * @param {Object} socket - Socket instance
   * @param {Object} data - Message data
   */
  async handleSendMessage(socket, data) {
    const { roomId, message, originalLanguage } = data;
    const user = roomService.getUser(socket.id);
    
    if (!user) return;

    // Get all users in the room
    const roomUsers = roomService.getRoomUsers(roomId);
    
    // Send message to all users in the room with appropriate translations
    for (const targetUser of roomUsers) {
      if (!targetUser) continue;

      let translatedMessage = message;
      
      // Translate message if target user speaks a different language
      if (targetUser.language !== originalLanguage) {
        translatedMessage = await translationService.translateText(
          message, 
          targetUser.language, 
          originalLanguage
        );
      }

      // Find the socket ID for this user
      const targetSocketId = this.findSocketIdByUser(targetUser);
      if (targetSocketId) {
        this.io.to(targetSocketId).emit('message-received', {
          id: Date.now() + Math.random(),
          username: user.username,
          message: translatedMessage,
          originalMessage: message,
          originalLanguage,
          targetLanguage: targetUser.language,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  /**
   * Handle user disconnection
   * @param {Object} socket - Socket instance
   */
  handleDisconnect(socket) {
    const user = roomService.removeUserFromRoom(socket.id);
    if (user) {
      const { roomId, username } = user;
      
      // Notify room about user leaving
      socket.to(roomId).emit('user-left', {
        username,
        message: `${username} left the chat`
      });
    }
    console.log('User disconnected:', socket.id);
  }

  /**
   * Find socket ID by user object
   * @param {Object} targetUser - Target user object
   * @returns {string|null} Socket ID or null
   */
  findSocketIdByUser(targetUser) {
    for (const [socketId, user] of roomService.users.entries()) {
      if (user.username === targetUser.username && 
          user.language === targetUser.language && 
          user.roomId === targetUser.roomId) {
        return socketId;
      }
    }
    return null;
  }
}

module.exports = SocketController;
