// polychat-server/config/config.js
require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT || 5000,
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  },

  translation: {
    // LLM-based translation service
    service: "langchain",

    // LangChain / OpenAI-compatible (UF Navigator) settings
    llm: {
      baseUrl: process.env.BASE_URL || "https://api.ai.it.ufl.edu",
      apiKey: process.env.API_KEY,
      model: process.env.MODEL || "mistral-7b-instruct",
      temperature: parseFloat(process.env.LLM_TEMPERATURE ?? "0.0"),
      systemPrompt: process.env.LLM_SYSTEM_PROMPT,
    },
  },

  database: {
    type: process.env.DB_TYPE || "memory", // memory, mongodb, postgresql (future)
    url: process.env.DATABASE_URL,
  },
};

module.exports = config;
