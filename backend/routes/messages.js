import express from 'express';
import { getDatabase } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Get messages for a booking
router.get('/:booking_id', async (req, res) => {
  try {
    const { booking_id } = req.params;
    const userId = req.user.userId;
    const db = await getDatabase();

    // Optimized query using index: user_id, booking_id, created_at DESC
    const messages = await db.all(
      'SELECT id, message, created_at FROM messages WHERE user_id = ? AND booking_id = ? ORDER BY created_at ASC LIMIT 100',
      userId, booking_id
    );

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Post a message
router.post('/:booking_id', async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { message } = req.body;
    const userId = req.user.userId;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message content required' });
    }

    const db = await getDatabase();
    const result = await db.run(
      'INSERT INTO messages (user_id, booking_id, message) VALUES (?, ?, ?)',
      userId, booking_id, message
    );

    res.json({
      id: result.lastID,
      message,
      booking_id,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error posting message:', error.message);
    res.status(500).json({ error: 'Failed to post message' });
  }
});

export default router;
