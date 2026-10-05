import dotenv from 'dotenv';
import path from 'path';

// Load .env from workspace root if present, or current directory
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  jwtSecret: process.env.JWT_SECRET || 'agri-advisory-jwt-secret-secure-key-2025',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
