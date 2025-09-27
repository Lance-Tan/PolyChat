import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import io from 'socket.io-client';

const languages = {
  'en': 'English',
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'it': 'Italiano',
  'pt': 'Português',
  'ru': 'Русский',
  'ja': '日本語',
  'ko': '한국어',
  'zh': '中文',
  'ar': 'العربية',
  'hi': 'हिन्दी'
};

function ChatRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('en');
  const [isConnected, setIsConnected] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Get user data from navigation state
    if (location.state) {
      setUsername(location.state.username || '');
      setLanguage(location.state.language || 'en');
    } else {
      // If no state, redirect to home
      navigate('/');
      return;
    }

    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      
      // Join the room
      newSocket.emit('join-room', {
        roomId,
        username: location.state.username,
        language: location.state.language
      });
    });

    newSocket.on('message-received', (data) => {
      setMessages(prev => [...prev, data]);
      setIsTranslating(false);
    });

    newSocket.on('user-joined', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        message: data.message,
        timestamp: new Date().toISOString()
      }]);
    });

    newSocket.on('user-left', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        message: data.message,
        timestamp: new Date().toISOString()
      }]);
    });

    newSocket.on('room-users', (userList) => {
      setUsers(userList);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, [roomId, location.state, navigate]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket && isConnected) {
      setIsTranslating(true);
      socket.emit('send-message', {
        roomId,
        message: newMessage.trim(),
        originalLanguage: language
      });
      setNewMessage('');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!location.state) {
    return null; // Will redirect to home
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Room: {roomId}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon />
            <Typography variant="body2">
              {users.length} user{users.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', p: 0 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Messages */}
          <Paper 
            sx={{ 
              flex: 1, 
              overflow: 'auto', 
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {!isConnected && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Connecting to server...
              </Alert>
            )}

            {isTranslating && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Translating message...
                </Typography>
              </Box>
            )}

            <List>
              {messages.map((msg) => (
                <ListItem key={msg.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  {msg.type === 'system' ? (
                    <Box sx={{ width: '100%', textAlign: 'center', py: 1 }}>
                      <Chip 
                        label={msg.message} 
                        size="small" 
                        color="info" 
                        variant="outlined"
                      />
                    </Box>
                  ) : (
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                          {msg.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="subtitle2" sx={{ mr: 1 }}>
                          {msg.username}
                        </Typography>
                        <Chip 
                          label={languages[msg.originalLanguage] || msg.originalLanguage}
                          size="small"
                          icon={<LanguageIcon />}
                          color="primary"
                          variant="outlined"
                        />
                        <Typography variant="caption" sx={{ ml: 'auto' }}>
                          {formatTime(msg.timestamp)}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mb: 0.5 }}>
                        {msg.message}
                      </Typography>
                      {msg.originalMessage && msg.originalMessage !== msg.message && (
                        <Box sx={{ mt: 0.5 }}>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ fontStyle: 'italic' }}
                          >
                            Original ({languages[msg.originalLanguage] || msg.originalLanguage}): {msg.originalMessage}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          </Paper>

          {/* Message Input */}
          <Paper sx={{ p: 2 }}>
            <form onSubmit={handleSendMessage}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={!isConnected}
                  variant="outlined"
                  size="small"
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!newMessage.trim() || !isConnected}
                  startIcon={<SendIcon />}
                >
                  Send
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>

        {/* Users Sidebar */}
        <Paper sx={{ width: 250, p: 2, ml: 2 }}>
          <Typography variant="h6" gutterBottom>
            <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Users ({users.length})
          </Typography>
          <List dense>
            {users.map((user, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={user.username}
                  secondary={
                    <Chip 
                      label={languages[user.language] || user.language}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </Box>
  );
}

export default ChatRoom;
