import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'nl', name: 'Dutch' },
    { code: 'sv', name: 'Swedish' },
    { code: 'da', name: 'Danish' },
    { code: 'no', name: 'Norwegian' },
    { code: 'fi', name: 'Finnish' },
    { code: 'pl', name: 'Polish' },
    { code: 'tr', name: 'Turkish' },
    { code: 'th', name: 'Thai' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ms', name: 'Malay' },
    { code: 'tl', name: 'Filipino' },
    { code: 'he', name: 'Hebrew' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'cs', name: 'Czech' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'ro', name: 'Romanian' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'hr', name: 'Croatian' },
    { code: 'sk', name: 'Slovak' },
    { code: 'sl', name: 'Slovenian' },
    { code: 'et', name: 'Estonian' },
    { code: 'lv', name: 'Latvian' },
    { code: 'lt', name: 'Lithuanian' },
    { code: 'el', name: 'Greek' },
    { code: 'is', name: 'Icelandic' },
    { code: 'ga', name: 'Irish' },
    { code: 'mt', name: 'Maltese' },
    { code: 'cy', name: 'Welsh' },
    { code: 'eu', name: 'Basque' },
    { code: 'ca', name: 'Catalan' },
    { code: 'gl', name: 'Galician' }
  ];

// Translations for "you" in different languages
const youTranslations = {
  'en': 'you', 'es': 'tú', 'fr': 'vous', 'de': 'du', 'it': 'tu',
  'pt': 'você', 'ru': 'ты', 'ja': 'あなた', 'ko': '당신', 'zh': '你',
  'ar': 'أنت', 'hi': 'आप', 'nl': 'jij', 'sv': 'du', 'da': 'du',
  'no': 'du', 'fi': 'sinä', 'pl': 'ty', 'tr': 'sen', 'th': 'คุณ',
  'vi': 'bạn', 'id': 'kamu', 'ms': 'awak', 'tl': 'ikaw', 'he': 'אתה',
  'uk': 'ти', 'cs': 'ty', 'hu': 'te', 'ro': 'tu', 'bg': 'ти',
  'hr': 'ti', 'sk': 'ty', 'sl': 'ti', 'et': 'sina', 'lv': 'tu',
  'lt': 'tu', 'el': 'εσύ', 'is': 'þú', 'ga': 'tú', 'mt': 'int',
  'cy': 'ti', 'eu': 'zu', 'ca': 'tu', 'gl': 'ti'
};

const getYouTranslation = (code) => {
  return youTranslations[code] || 'you';
};

  const getLanguageName = (code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      
      // Get user data from location state
      let userData = location.state;
      if (!userData) {
        // If no user data, redirect to join room page
        navigate('/join-room', { state: { roomId } });
        return;
      }

      setCurrentUser(userData);
      newSocket.emit('join-room', {
        roomId,
        username: userData.username,
        language: userData.language
      });
    });

    newSocket.on('message-received', (message) => {
      setMessages(prev => [...prev, message]);
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !currentUser) return;

    socket.emit('send-message', {
      roomId,
      message: newMessage.trim(),
      originalLanguage: currentUser.language
    });

    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getLanguageFlag = (code) => {
    const flagMap = {
      'en': '🇺🇸', 'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'it': '🇮🇹',
      'pt': '🇵🇹', 'ru': '🇷🇺', 'ja': '🇯🇵', 'ko': '🇰🇷', 'zh': '🇨🇳',
      'ar': '🇸🇦', 'hi': '🇮🇳', 'nl': '🇳🇱', 'sv': '🇸🇪', 'da': '🇩🇰',
      'no': '🇳🇴', 'fi': '🇫🇮', 'pl': '🇵🇱', 'tr': '🇹🇷', 'th': '🇹🇭',
      'vi': '🇻🇳', 'id': '🇮🇩', 'ms': '🇲🇾', 'tl': '🇵🇭', 'he': '🇮🇱',
      'uk': '🇺🇦', 'cs': '🇨🇿', 'hu': '🇭🇺', 'ro': '🇷🇴', 'bg': '🇧🇬',
      'hr': '🇭🇷', 'sk': '🇸🇰', 'sl': '🇸🇮', 'et': '🇪🇪', 'lv': '🇱🇻',
      'lt': '🇱🇹', 'el': '🇬🇷', 'is': '🇮🇸', 'ga': '🇮🇪', 'mt': '🇲🇹',
      'cy': '🇬🇧', 'eu': '🇪🇸', 'ca': '🇪🇸', 'gl': '🇪🇸'
    };
    return flagMap[code] || '🌐';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="navbar bg-white dark:bg-gray-800 shadow-lg rounded-lg mb-4">
          <div className="navbar-start">
            <button
              className="btn btn-ghost"
              onClick={() => navigate('/')}
            >
              ← Back
            </button>
          </div>
          <div className="navbar-center">
            <h1 className="text-xl font-bold">
              {location.state?.roomName || 'Chat Room'} - {roomId}
            </h1>
            <div className={`badge ${isConnected ? 'badge-success' : 'badge-error'} ml-2`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
          <div className="navbar-end">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {users.length} user{users.length !== 1 ? 's' : ''} online
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
          {/* Chat Messages */}
          <div className="lg:col-span-3">
            <div className="card bg-white dark:bg-gray-800 shadow-lg h-full">
              <div className="card-body p-4">
                <div className="h-full overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="chat">
                      {message.type === 'system' ? (
                        <div className="text-center">
                          <div className="badge badge-info">
                            {message.message}
                          </div>
                        </div>
                      ) : (
                        <div className={`chat-bubble ${
                          message.username === currentUser?.username 
                            ? 'chat-bubble-primary ml-auto' 
                            : 'chat-bubble-secondary'
                        }`}>
                          <div className="chat-header">
                            <span className="font-semibold">{message.username}</span>
                            <span className="text-xs opacity-70">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <div className="chat-content">
                            <p>{message.message}</p>
                            {message.originalMessage && message.originalMessage !== message.message && (
                              <div className="mt-2 p-2 bg-black bg-opacity-10 rounded text-sm">
                                <div className="flex items-center gap-2">
                                  <span>{getLanguageFlag(message.originalLanguage)}</span>
                                  <span className="text-xs opacity-70">
                                    Original ({getLanguageName(message.originalLanguage)})
                                  </span>
                                </div>
                                <p className="italic">{message.originalMessage}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="input input-bordered flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={!isConnected}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!isConnected || !newMessage.trim()}
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>

                    {/* Users List */}
                    <div className="lg:col-span-1">
            <div className="card bg-white dark:bg-gray-800 shadow-lg h-full">
              <div className="card-body p-4">
                <h3 className="card-title text-lg mb-4">Online Users</h3>
                <div className="space-y-2">
                  {users.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {user.username}
                          {user.username === currentUser?.username && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({getYouTranslation(currentUser.language)})
                            </span>
                          )}
                        </span>
                        <span className="text-sm">{getLanguageFlag(user.language)}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {getLanguageName(user.language)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
