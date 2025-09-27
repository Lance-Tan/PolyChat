const express = require('express');
const roomService = require('../services/roomService');

const router = express.Router();

/**
 * Health check endpoint
 * GET /api/health
 */
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PolyChat server is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Get all active rooms
 * GET /api/rooms
 */
router.get('/rooms', (req, res) => {
  try {
    const rooms = roomService.getAllRooms();
    res.json({
      success: true,
      rooms,
      totalRooms: rooms.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching rooms',
      error: error.message
    });
  }
});

/**
 * Get specific room info
 * GET /api/rooms/:roomId
 */
router.get('/rooms/:roomId', (req, res) => {
  try {
    const { roomId } = req.params;
    const userCount = roomService.getRoomUserCount(roomId);
    const exists = roomService.roomExists(roomId);
    
    res.json({
      success: true,
      room: {
        id: roomId,
        exists,
        userCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching room info',
      error: error.message
    });
  }
});

/**
 * Get server statistics
 * GET /api/stats
 */
router.get('/stats', (req, res) => {
  try {
    const rooms = roomService.getAllRooms();
    const totalUsers = rooms.reduce((sum, room) => sum + room.userCount, 0);
    
    res.json({
      success: true,
      stats: {
        totalRooms: rooms.length,
        totalUsers,
        activeRooms: rooms.filter(room => room.userCount > 0).length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching server stats',
      error: error.message
    });
  }
});

module.exports = router;
