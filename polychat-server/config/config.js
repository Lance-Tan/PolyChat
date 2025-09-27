require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT || 5000,
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  },
  
  translation: {
    service: 'libre',
    libreTranslateUrl: 'https://libretranslate.com',
  },
  
  database: {
    // Future database configuration
    type: process.env.DB_TYPE || 'memory', // memory, mongodb, postgresql
    url: process.env.DATABASE_URL
  }
};

module.exports = config;
