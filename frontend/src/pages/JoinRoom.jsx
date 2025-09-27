import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const JoinRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('en');

  // Pre-fill roomId if redirected from ChatRoom
  useEffect(() => {
    if (location.state?.roomId) {
      setRoomId(location.state.roomId);
    }
  }, [location.state]);

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

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!roomId.trim() || !username.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    navigate(`/chat/${roomId.trim().toUpperCase()}`, {
      state: {
        roomName: `Room ${roomId.trim().toUpperCase()}`,
        username: username.trim(),
        language: language,
        isCreator: false
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6 justify-center">Join Existing Room</h2>
          
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Room ID</span>
              </label>
              <input
                type="text"
                placeholder="Enter room code (e.g., ABC123)"
                className="input input-bordered"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                required
              />
              <label className="label">
                <span className="label-text-alt text-gray-500">Ask the room creator for the Room ID</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Your Username</span>
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="input input-bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Your Language</span>
              </label>
              <select
                className="select select-bordered"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="card-actions justify-end mt-6">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Join Room
              </button>
            </div>
          </form>

          <div className="divider">OR</div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Don't have a room code?
            </p>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate('/create-room')}
            >
              Create New Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
