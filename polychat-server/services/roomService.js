class RoomService {
  constructor() {
    this.rooms = new Map(); // roomId -> Set of user IDs
    this.users = new Map(); // socketId -> {username, language, roomId}
  }

  /**
   * Add user to a room
   * @param {string} socketId - Socket ID
   * @param {string} roomId - Room ID
   * @param {string} username - Username
   * @param {string} language - User's language
   */
  addUserToRoom(socketId, roomId, username, language) {
    // Store user info
    this.users.set(socketId, { username, language, roomId });
    
    // Add user to room
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId).add(socketId);
  }

  /**
   * Remove user from room
   * @param {string} socketId - Socket ID
   */
  removeUserFromRoom(socketId) {
    const user = this.users.get(socketId);
    if (!user) return null;

    const { roomId } = user;
    
    // Remove user from room
    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId).delete(socketId);
    }
    
    // Remove user from users map
    this.users.delete(socketId);
    
    return user;
  }

  /**
   * Get user info by socket ID
   * @param {string} socketId - Socket ID
   * @returns {Object|null} User info or null
   */
  getUser(socketId) {
    return this.users.get(socketId) || null;
  }

  /**
   * Get all users in a room
   * @param {string} roomId - Room ID
   * @returns {Array} Array of user objects
   */
  getRoomUsers(roomId) {
    const roomUserIds = Array.from(this.rooms.get(roomId) || []);
    return roomUserIds.map(id => this.users.get(id)).filter(Boolean);
  }

  /**
   * Get all rooms with user counts
   * @returns {Array} Array of room objects with user counts
   */
  getAllRooms() {
    const roomList = [];
    for (const [roomId, userIds] of this.rooms.entries()) {
      roomList.push({
        id: roomId,
        userCount: userIds.size
      });
    }
    return roomList;
  }

  /**
   * Check if room exists
   * @param {string} roomId - Room ID
   * @returns {boolean} True if room exists
   */
  roomExists(roomId) {
    return this.rooms.has(roomId);
  }

  /**
   * Get room user count
   * @param {string} roomId - Room ID
   * @returns {number} Number of users in room
   */
  getRoomUserCount(roomId) {
    return this.rooms.get(roomId)?.size || 0;
  }
}

module.exports = new RoomService();
