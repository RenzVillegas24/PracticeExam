import express from 'express';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../db/database.js';

const router = express.Router();

const mockUsers = {
  'test@example.com': {
    phone: '0123456789',
    servicem8_id: 'CUST123'
  }
};

router.post('/login', async (req, res) => {
  const { email, phone } = req.body;

  if (!email || !phone) {
    return res.status(400).json({ error: 'Email and phone required' });
  }

  const user = mockUsers[email];
  if (!user || user.phone !== phone) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  try {
    const db = await getDatabase();
    
    let userRecord = await db.get('SELECT id FROM users WHERE email = ?', email);

    if (!userRecord) {
      const result = await db.run(
        'INSERT INTO users (email, phone, servicem8_id) VALUES (?, ?, ?)',
        email, phone, user.servicem8_id
      );
      userRecord = { id: result.lastID };
    }

    const token = jwt.sign(
      { userId: userRecord.id, email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '24h' }
    );

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.run(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
      userRecord.id, token, expiresAt.toISOString()
    );

    res.json({ token, user: { id: userRecord.id, email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
