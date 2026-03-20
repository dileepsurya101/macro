import dotenv from 'dotenv';
dotenv.config();

// Warn if required env vars are missing
const required = ['MONGODB_URI', 'OPENAI_API_KEY', 'OPENAI_API_BASE_URL', 'CLIENT_ORIGIN'];
required.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Warning: ${key} is not set in environment variables.`);
  }
});

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  openaiKey: process.env.OPENAI_API_KEY,
  openaiBaseUrl: process.env.OPENAI_API_BASE_URL,
  clientOrigin: process.env.CLIENT_ORIGIN,
};
