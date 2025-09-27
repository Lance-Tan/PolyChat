import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert
} from '@mui/material';
import { ArrowBack, ContentCopy } from '@mui/icons-material';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' }
];

function CreateRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('en');
  const [roomName, setRoomName] = useState('');
  const [generatedRoomId, setGeneratedRoomId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Get username and language from navigation state
    if (location.state) {
      setUsername(location.state.username || '');
      setLanguage(location.state.language || 'en');
    }
    
    // Generate a room ID
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedRoomId(roomId);
  }, [location.state]);

  const handleCreateRoom = () => {
    if (username && roomName) {
      navigate(`/chat/${generatedRoomId}`, {
        state: { 
          username, 
          language, 
          roomName,
          isCreator: true 
        }
      });
    }
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(generatedRoomId);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        Back to Home
      </Button>

      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom textAlign="center">
            Create New Room
          </Typography>

          {showSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Room ID copied to clipboard!
            </Alert>
          )}

          <TextField
            fullWidth
            label="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Your Language</InputLabel>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              label="Your Language"
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            margin="normal"
            placeholder="Give your room a friendly name"
          />

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Room ID: {generatedRoomId}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Share this ID with others so they can join your room
            </Typography>
            <Button
              startIcon={<ContentCopy />}
              onClick={handleCopyRoomId}
              variant="outlined"
              size="small"
            >
              Copy Room ID
            </Button>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleCreateRoom}
            disabled={!username}
            sx={{ mt: 3 }}
            size="large"
          >
            Create Room & Join Chat
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

export default CreateRoom;
