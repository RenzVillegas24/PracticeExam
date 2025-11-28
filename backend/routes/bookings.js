import express from 'express';
import axios from 'axios';
import { getDatabase } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Middleware
router.use(authenticateToken);

// Fetch bookings
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = await getDatabase();
    
    const user = await db.get('SELECT servicem8_id FROM users WHERE id = ?', userId);

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

    try {
      const response = await axios.get(
        `https://api.servicem8.com/api_1.0/job.json?customer_id=${user.servicem8_id}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.SERVICEM8_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const bookings = response.data.map(job => ({
        id: job.id,
        name: job.name,
        status: job.status,
        date: job.created_date,
        description: job.description || 'No description'
      }));

      return res.json({ bookings });
    } catch (apiError) {
      console.log('ServiceM8 API failed, using mock data');
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
    const db = await getDatabase();

    const user = await db.get('SELECT servicem8_id FROM users WHERE id = ?', userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    try {
      const response = await axios.get(
        `https://api.servicem8.com/api_1.0/job/${id}.json`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.SERVICEM8_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const job = response.data;
      
      // Extract attachments from ServiceM8 API response
      const attachments = (job.attachments || []).map(att => ({
        id: att.id || Math.random().toString(36).substr(2, 9),
        name: att.name || 'attachment',
        url: `${process.env.API_URL || 'http://localhost:5000'}/attachments/${att.id}`
      }));
      
      return res.json({
        booking: {
          id: job.id,
          name: job.name,
          status: job.status,
          date: job.created_date,
          description: job.description,
          attachments
        }
      });
    } catch {
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

      return res.json({ booking: mockBooking });
    }
  } catch (error) {
    console.error('Error fetching booking details:', error.message);
    res.status(500).json({ error: 'Failed to fetch booking details' });
  }
});

export default router;
