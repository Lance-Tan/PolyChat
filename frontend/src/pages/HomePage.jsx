import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
            PolyChat
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Connect with people around the world through real-time multilingual chat
          </p>
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => navigate('/create-room')}
              className="btn btn-primary btn-lg"
            >
              Create Chat Room
            </button>
            <button
              onClick={() => navigate('/join-room')}
              className="btn btn-outline btn-lg"
            >
              Join Existing Room
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card bg-white dark:bg-gray-800 shadow-xl">
            <div className="card-body text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="card-title justify-center">Global Communication</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Chat with people from anywhere in the world, breaking down language barriers
              </p>
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-800 shadow-xl">
            <div className="card-body text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="card-title justify-center">Real-time Translation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Messages are automatically translated to your preferred language instantly
              </p>
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-800 shadow-xl">
            <div className="card-body text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="card-title justify-center">Private Rooms</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create secure chat rooms with unique IDs for private conversations
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Create or Join</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Create a new room or join an existing one with a room ID
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Set Language</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Choose your native language for automatic translation
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Start Chatting</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Send messages in your language and receive them in yours
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h4 className="font-semibold mb-2">Connect</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Build relationships across cultures and languages
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
