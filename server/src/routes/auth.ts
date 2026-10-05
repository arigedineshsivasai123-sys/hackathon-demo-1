import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { query } from '../db/db.js';
import { config } from '../config.js';
import { registerSchema, loginSchema, validateBody } from '../middleware/validate.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

export const authRouter = Router();

// Register
authRouter.post('/register', validateBody(registerSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const lowerEmail = email.toLowerCase().trim();

    // Check if user exists
    const existing = await query('SELECT * FROM users WHERE email = $1', [lowerEmail]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'An account with this email address already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = crypto.randomUUID();

    await query(
      'INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4)',
      [userId, name.trim(), lowerEmail, passwordHash]
    );

    const token = jwt.sign(
      { id: userId, email: lowerEmail, name: name.trim() },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account successfully registered.',
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: lowerEmail
      }
    });
  } catch (err: any) {
    console.error('[Auth Register Error]:', err);
    res.status(500).json({ error: 'Server error during registration. Please try again.' });
  }
});

// Login
authRouter.post('/login', validateBody(loginSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const lowerEmail = email.toLowerCase().trim();

    const result = await query('SELECT * FROM users WHERE email = $1', [lowerEmail]);
    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err: any) {
    console.error('[Auth Login Error]:', err);
    res.status(500).json({ error: 'Server error during login. Please try again.' });
  }
});

// Get current user
authRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = await query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user: result.rows[0] });
  } catch (err: any) {
    console.error('[Auth Me Error]:', err);
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
});

// Update Gemini API key dynamically
authRouter.post('/config/gemini-key', (req: AuthenticatedRequest, res: Response): void => {
  const { apiKey } = req.body;
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 10) {
    res.status(400).json({ error: 'A valid Gemini API key is required.' });
    return;
  }
  config.geminiApiKey = apiKey.trim();
  res.json({ message: 'Gemini API key updated successfully for this session.' });
});
