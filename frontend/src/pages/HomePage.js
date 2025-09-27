import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Chat as ChatIcon,
  Add as AddIcon,
  Language as LanguageIcon
} from '@mui/icons-material';

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

function HomePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('en');
  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = () => {
    if (username && roomId) {
      navigate(`/chat/${roomId}`, { 
        state: { username, language } 
      });
    }
  };

  const handleCreateRoom = () => {
    if (username) {
      navigate('/create-room', { 
        state: { username, language } 
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h2" component="h1" gutterBottom>
          PolyChat
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Connect with people around the world
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Chat in your native language while others see messages in theirs
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Join Room Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ChatIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Join a Room</Typography>
              </Box>
              
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
                label="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                margin="normal"
                placeholder="Enter room ID to join"
                required
              />
              
              <Button
                fullWidth
                variant="contained"
                onClick={handleJoinRoom}
                disabled={!username || !roomId}
                sx={{ mt: 2 }}
              >
                Join Room
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Create Room Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AddIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Create a Room</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" mb={2}>
                Create a new chat room and share the room ID with others
              </Typography>
              
              <Button
                fullWidth
                variant="outlined"
                onClick={handleCreateRoom}
                disabled={!username}
                startIcon={<LanguageIcon />}
                sx={{ mt: 2 }}
              >
                Create New Room
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Features */}
      <Box mt={6}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          How it works
        </Typography>
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent textAlign="center">
                <LanguageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Choose Your Language
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select your native language from our supported languages
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent textAlign="center">
                <ChatIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Chat Naturally
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Type messages in your language - others see them in theirs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent textAlign="center">
                <LanguageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Real-time Translation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Messages are automatically translated using LibreTranslate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default HomePage;
