import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config.js';
import { initDb, isDbPostgres } from './db/db.js';
import { authRouter } from './routes/auth.js';
import { advisoryRouter } from './routes/advisory.js';

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  const start = Date.now();
  next();
  const duration = Date.now() - start;
  if (!req.path.startsWith('/api/health')) {
    console.log(`[HTTP] ${req.method} ${req.path} - ${duration}ms`);
  }
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    postgresActive: isDbPostgres(),
    geminiKeySet: Boolean(config.geminiApiKey),
    environment: config.nodeEnv
  });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/advisory', advisoryRouter);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected internal server error occurred.'
  });
});

// Bootstrap server
async function startServer() {
  try {
    await initDb();
    app.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(`🌿 Agriculture Crop Advisory Assistant Server Ready`);
      console.log(`📡 Port: ${config.port}`);
      console.log(`💾 PostgreSQL Mode: ${isDbPostgres() ? 'Connected (PostgreSQL)' : 'Local Persistent Database (PostgreSQL Compatible)'}`);
      console.log(`✨ Gemini AI: ${config.geminiApiKey ? 'Configured (@google/genai active)' : 'Agronomic Expert Rules Engine Active'}`);
      console.log(`🚀 API Base URL: http://localhost:${config.port}/api`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
