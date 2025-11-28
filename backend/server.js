import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/database.js';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import messageRoutes from './routes/messages.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api/messages', messageRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
