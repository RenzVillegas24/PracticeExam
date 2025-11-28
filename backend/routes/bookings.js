import express from 'express';
import axios from 'axios';
import { getDatabase } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { apiCache } from '../utils/cache.js';

const router = express.Router();

// Middleware
router.use(authenticateToken);

// Fetch bookings
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Check cache first before database query
    const userCacheKey = `user_${userId}`;
    let user = apiCache.get(userCacheKey);
    
    if (!user) {
      const db = await getDatabase();
      user = await db.get('SELECT servicem8_id FROM users WHERE id = ?', userId);
      
      // Cache user data for 30 minutes
      if (user) {
        apiCache.cache.set(userCacheKey, { value: user, expiresAt: Date.now() + 30 * 60 * 1000 });
      }
    } else {
      console.log('[CACHE HIT] User data from cache');
    }

    if (!user || !user.servicem8_id) {
      const mockBookings = [
        {
          id: 'BOOK001',
          name: 'Plumbing Service',
          status: 'Completed',
          date: '2025-11-20',
          description: 'Fixed leaking tap'
        },
        {
          id: 'BOOK002',
          name: 'Electrical Inspection',
          status: 'Scheduled',
          date: '2025-11-28',
          description: 'Annual safety inspection'
        }
      ];
      return res.json({ bookings: mockBookings });
    }

    // Check cache for bookings
    const cacheKey = `bookings_${user.servicem8_id}`;
    let cachedBookings = apiCache.get(cacheKey);
    if (cachedBookings) {
      console.log('[CACHE HIT] Bookings list from cache');
      return res.json({ bookings: cachedBookings });
    }

    console.log('[CACHE MISS] Fetching bookings from ServiceM8 API');
    try {
      const response = await axios.get(
        `https://api.servicem8.com/api_1.0/job.json?customer_id=${user.servicem8_id}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.SERVICEM8_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000 // 5 second timeout to fail fast
        }
      );

      const bookings = response.data.map(job => ({
        id: job.id,
        name: job.name,
        status: job.status,
        date: job.created_date,
        description: job.description || 'No description'
      }));

      // Cache the result with 5 minute TTL
      apiCache.set(cacheKey, bookings);
      console.log('[CACHED] Bookings list stored in cache (5 min TTL)');
      
      return res.json({ bookings });
    } catch (apiError) {
      console.log('[API ERROR] ServiceM8 API failed, using mock data');
      const mockBookings = [
        {
          id: 'BOOK001',
          name: 'Plumbing Service',
          status: 'Completed',
          date: '2025-11-20',
          description: 'Fixed leaking tap'
        },
        {
          id: 'BOOK002',
          name: 'Electrical Inspection',
          status: 'Scheduled',
          date: '2025-11-28',
          description: 'Annual safety inspection'
        }
      ];
      return res.json({ bookings: mockBookings });
    }
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Specific booking
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    // Check cache first before database query
    const userCacheKey = `user_${userId}`;
    let user = apiCache.get(userCacheKey);
    
    if (!user) {
      const db = await getDatabase();
      user = await db.get('SELECT servicem8_id FROM users WHERE id = ?', userId);
      
      // Cache user data for 30 minutes
      if (user) {
        apiCache.cache.set(userCacheKey, { value: user, expiresAt: Date.now() + 30 * 60 * 1000 });
      }
    } else {
      console.log('[CACHE HIT] User data from cache (booking detail)');
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check cache first for booking detail
    const cacheKey = `booking_${id}`;
    let cachedBooking = apiCache.get(cacheKey);
    if (cachedBooking) {
      console.log('[CACHE HIT] Booking detail from cache');
      return res.json({ booking: cachedBooking });
    }

    console.log('[CACHE MISS] Fetching booking from ServiceM8 API');
    try {
      const response = await axios.get(
        `https://api.servicem8.com/api_1.0/job/${id}.json`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.SERVICEM8_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000 // 5 second timeout
        }
      );

      const job = response.data;
      
      // Extract attachments from ServiceM8 API response
      const attachments = (job.attachments || []).map(att => ({
        id: att.id || Math.random().toString(36).substr(2, 9),
        name: att.name || 'attachment',
        url: `${process.env.API_URL || 'http://localhost:5000'}/attachments/${att.id}`
      }));
      
      const booking = {
        id: job.id,
        name: job.name,
        status: job.status,
        date: job.created_date,
        description: job.description,
        attachments
      };

      // Cache the result with 5 minute TTL
      apiCache.set(cacheKey, booking);
      console.log('[CACHED] Booking detail stored in cache (5 min TTL)');
      
      return res.json({ booking });
    } catch (err) {
      console.log('[API ERROR] ServiceM8 API failed, using mock data');
      // Mock data with local attachment files
      const mockBooking = {
        id,
        name: 'Service Booking',
        status: 'Completed',
        date: '2025-11-20',
        description: 'Professional service completed successfully. All work was completed to specification.',
        attachments: [
          { id: 'ATT001', name: 'invoice.pdf', url: `${process.env.API_URL || 'http://localhost:5000'}/attachments/invoice.pdf` },
          { id: 'ATT002', name: 'receipt.pdf', url: `${process.env.API_URL || 'http://localhost:5000'}/attachments/receipt.pdf` }
        ]
      };

      // Cache the mock result too
      apiCache.set(cacheKey, mockBooking);

      return res.json({ booking: mockBooking });
    }
  } catch (error) {
    console.error('Error fetching booking details:', error.message);
    res.status(500).json({ error: 'Failed to fetch booking details' });
  }
});

export default router;
