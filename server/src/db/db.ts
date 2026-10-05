import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { config } from '../config.js';
import { User, AdvisoryRecord } from '../types/index.js';

const { Pool } = pg;

// We support PostgreSQL as the primary database (Replit / Cloud / Local)
// and an automatic persistent JSON file fallback if no PG server is reachable
let pool: pg.Pool | null = null;
let isPostgresActive = false;

// Fallback in-memory/file storage
const fallbackDataDir = path.resolve(process.cwd(), 'data');
const fallbackDbFile = path.join(fallbackDataDir, 'agri_database.json');

interface FallbackStore {
  users: User[];
  advisories: AdvisoryRecord[];
}

let memoryStore: FallbackStore = {
  users: [],
  advisories: []
};

function loadFallbackStore(): void {
  try {
    if (!fs.existsSync(fallbackDataDir)) {
      fs.mkdirSync(fallbackDataDir, { recursive: true });
    }
    if (fs.existsSync(fallbackDbFile)) {
      const data = fs.readFileSync(fallbackDbFile, 'utf-8');
      memoryStore = JSON.parse(data);
    } else {
      saveFallbackStore();
    }
  } catch (err) {
    console.error('[DB] Failed to load local database file, using clean state:', err);
  }
}

function saveFallbackStore(): void {
  try {
    if (!fs.existsSync(fallbackDataDir)) {
      fs.mkdirSync(fallbackDataDir, { recursive: true });
    }
    fs.writeFileSync(fallbackDbFile, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Failed to save local database file:', err);
  }
}

export async function initDb(): Promise<void> {
  loadFallbackStore();

  if (config.databaseUrl) {
    try {
      console.log('[DB] Connecting to PostgreSQL at configured DATABASE_URL...');
      pool = new Pool({
        connectionString: config.databaseUrl,
        ssl: config.databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false }
      });

      // Test connection
      const client = await pool.connect();
      console.log('[DB] PostgreSQL connected successfully.');
      client.release();

      // Create Tables
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS advisories (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
          farm_name VARCHAR(255),
          location VARCHAR(255) NOT NULL,
          crop VARCHAR(255) NOT NULL,
          farm_size NUMERIC,
          farm_size_unit VARCHAR(50),
          soil_type VARCHAR(100),
          growth_stage VARCHAR(100),
          farming_objective VARCHAR(255),
          input_payload JSONB NOT NULL,
          advisory_result JSONB NOT NULL,
          crop_suitability_score INTEGER DEFAULT 0,
          overall_risk_level VARCHAR(50) DEFAULT 'Moderate',
          status VARCHAR(50) DEFAULT 'completed',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_advisories_user_id ON advisories(user_id);
        CREATE INDEX IF NOT EXISTS idx_advisories_crop ON advisories(crop);
        CREATE INDEX IF NOT EXISTS idx_advisories_created_at ON advisories(created_at DESC);
      `);

      isPostgresActive = true;
      console.log('[DB] PostgreSQL tables and indexes ready.');
      return;
    } catch (err: any) {
      console.warn(`[DB] Notice: Could not connect to PostgreSQL (${err.message}). Using persistent local database adapter.`);
      isPostgresActive = false;
      pool = null;
    }
  } else {
    console.log('[DB] DATABASE_URL not set. Running with persistent local database adapter (PostgreSQL compatible).');
    isPostgresActive = false;
  }
}

export async function query(sqlText: string, params: any[] = []): Promise<{ rows: any[]; rowCount: number }> {
  if (isPostgresActive && pool) {
    const res = await pool.query(sqlText, params);
    return { rows: res.rows, rowCount: res.rowCount || 0 };
  }

  // Fallback SQL query handler supporting parameterized statements for the app's queries
  const cleanSql = sqlText.trim().replace(/\s+/g, ' ');

  // 1. SELECT user by email
  if (cleanSql.startsWith('SELECT * FROM users WHERE email = $1')) {
    const email = params[0]?.toLowerCase();
    const user = memoryStore.users.find(u => u.email.toLowerCase() === email);
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  // 2. SELECT user by id
  if (cleanSql.startsWith('SELECT id, name, email, created_at FROM users WHERE id = $1')) {
    const id = params[0];
    const user = memoryStore.users.find(u => u.id === id);
    if (user) {
      const { password_hash, ...safeUser } = user;
      return { rows: [safeUser], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 3. INSERT INTO users
  if (cleanSql.startsWith('INSERT INTO users')) {
    const [id, name, email, password_hash] = params;
    const newUser: User = {
      id,
      name,
      email: email.toLowerCase(),
      password_hash,
      created_at: new Date().toISOString()
    };
    memoryStore.users.push(newUser);
    saveFallbackStore();
    return { rows: [newUser], rowCount: 1 };
  }

  // 4. INSERT INTO advisories
  if (cleanSql.startsWith('INSERT INTO advisories')) {
    const [
      id, user_id, farm_name, location, crop, farm_size,
      farm_size_unit, soil_type, growth_stage, farming_objective,
      input_payload, advisory_result, crop_suitability_score,
      overall_risk_level, status
    ] = params;

    const newAdvisory: AdvisoryRecord = {
      id,
      user_id: user_id || null,
      farm_name: farm_name || undefined,
      location,
      crop,
      farm_size: farm_size ? Number(farm_size) : undefined,
      farm_size_unit,
      soil_type,
      growth_stage,
      farming_objective,
      input_payload: typeof input_payload === 'string' ? JSON.parse(input_payload) : input_payload,
      advisory_result: typeof advisory_result === 'string' ? JSON.parse(advisory_result) : advisory_result,
      crop_suitability_score: Number(crop_suitability_score) || 0,
      overall_risk_level: overall_risk_level || 'Moderate',
      status: status || 'completed',
      created_at: new Date().toISOString()
    };

    memoryStore.advisories.unshift(newAdvisory);
    saveFallbackStore();
    return { rows: [newAdvisory], rowCount: 1 };
  }

  // 5. SELECT advisories for user
  if (cleanSql.startsWith('SELECT * FROM advisories WHERE user_id = $1') || cleanSql.startsWith('SELECT id, farm_name, location, crop')) {
    const userId = params[0];
    let userRecords = memoryStore.advisories.filter(a => a.user_id === userId);
    return { rows: userRecords, rowCount: userRecords.length };
  }

  // 6. SELECT advisory by id
  if (cleanSql.startsWith('SELECT * FROM advisories WHERE id = $1')) {
    const id = params[0];
    const record = memoryStore.advisories.find(a => a.id === id);
    return { rows: record ? [record] : [], rowCount: record ? 1 : 0 };
  }

  // 7. DELETE advisory
  if (cleanSql.startsWith('DELETE FROM advisories WHERE id = $1')) {
    const id = params[0];
    const initialLen = memoryStore.advisories.length;
    memoryStore.advisories = memoryStore.advisories.filter(a => a.id !== id);
    saveFallbackStore();
    const count = initialLen - memoryStore.advisories.length;
    return { rows: [], rowCount: count };
  }

  // 8. Stats / counts
  if (cleanSql.includes('COUNT(*) as total')) {
    const userId = params[0];
    const list = userId ? memoryStore.advisories.filter(a => a.user_id === userId) : memoryStore.advisories;
    return { rows: [{ total: list.length }], rowCount: 1 };
  }

  return { rows: [], rowCount: 0 };
}

export function isDbPostgres(): boolean {
  return isPostgresActive;
}
