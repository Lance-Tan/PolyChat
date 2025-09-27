import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import ChatRoom from './pages/ChatRoom';
import CreateRoom from './pages/CreateRoom';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/chat/:roomId" element={<ChatRoom />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
