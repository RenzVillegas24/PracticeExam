import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './db/database.js';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import messageRoutes from './routes/messages.js';
import { apiCache } from './utils/cache.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Prevent browser HTTP caching for API responses
// We handle caching on client-side and server-side
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'no-store, must-revalidate, max-age=0');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  next();
});

// Serve static files (attachments)
app.use('/attachments', express.static(path.join(__dirname, 'public/attachments')));

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

    // Cache status endpoint (for monitoring)
    app.get('/api/cache/stats', (req, res) => {
      res.json({ 
        cacheStats: apiCache.getStats(),
        message: 'Cache stats for monitoring API performance'
      });
    });

    // Clear cache endpoint (for admin/debugging)
    app.post('/api/cache/clear', (req, res) => {
      apiCache.clear();
      res.json({ message: 'Cache cleared successfully' });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Cache stats available at http://localhost:${PORT}/api/cache/stats`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
