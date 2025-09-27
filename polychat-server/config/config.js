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
    service: process.env.TRANSLATION_SERVICE || 'libre',
    libreTranslateUrl: process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com',
    googleApiKey: process.env.TRANSLATION_API_KEY,
    microsoftApiKey: process.env.MICROSOFT_TRANSLATOR_KEY
  },
  
  database: {
    // Future database configuration
    type: process.env.DB_TYPE || 'memory', // memory, mongodb, postgresql
    url: process.env.DATABASE_URL
  }
};

module.exports = config;
