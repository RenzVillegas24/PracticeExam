# Customer Portal MVP - Setup & Deployment Guide

> **👉 NEW: See [QUICK_START.md](./QUICK_START.md) for a fast TL;DR or [RUN_GUIDE.md](./RUN_GUIDE.md) for detailed shell script documentation**

## Quick Start (Local Development)

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

### Option 1: Automated Setup & Run (Recommended)

```bash
# One-command setup and run
bash setup.sh && bash run.sh
```

This will:
1. Install all dependencies
2. Configure environment files
3. Start both backend and frontend
4. Open browser automatically (if supported)

### Option 2: Manual Setup

#### 1. Backend Setup

```bash
cd backend
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`.

#### 2. Frontend Setup (in a new terminal)

```bash
cd frontend
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`.

#### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### Demo Login Credentials

```
Email: test@example.com
Phone: 0123456789
```

### Available Scripts

- `bash setup.sh` - Install dependencies and configure environment
- `bash run.sh` - Start both backend and frontend services
- `bash stop.sh` - Stop all running services
- `bash stop.sh --clean` - Stop services and clean log files

---

## Project Structure

```
11.28.25_Practice/
├── backend/                      # Express.js API
│   ├── server.js                 # Main server file
│   ├── db/
│   │   └── database.js          # SQLite setup & queries
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── bookings.js          # Booking endpoints (ServiceM8 + mock)
│   │   └── messages.js          # Messaging endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── package.json
│   ├── .env.example
│   └── data/                    # SQLite database (auto-created)
│
├── frontend/                     # Next.js App
│   ├── app/
│   │   ├── layout.js            # Root layout
│   │   ├── page.js              # Login page
│   │   ├── bookings/
│   │   │   ├── page.js          # Bookings list
│   │   │   └── [id]/
│   │   │       └── page.js      # Booking details & messages
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   └── .env.example
│
├── TECH_NOTES.md                 # Technical documentation
├── README.md                     # This file
└── practice.md                   # Original requirements
```

---

## Features

✅ **User Authentication**
- Email + phone login
- JWT token-based sessions
- Secure token storage

✅ **Booking Management**
- View all customer bookings
- Access individual booking details
- ServiceM8 API integration with graceful fallback

✅ **Messaging System**
- Send messages related to bookings
- View message history
- Persistent message storage

✅ **Responsive Design**
- Works on desktop and mobile
- Clean, modern UI
- Accessible forms

---

## Environment Configuration

### Backend (.env)

```
PORT=5000
SERVICEM8_API_KEY=your_servicem8_api_key
SERVICEM8_BUSINESS_ID=your_business_id
JWT_SECRET=your_secret_key_change_in_production
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production, update:
- `NEXT_PUBLIC_API_URL` to your production API URL
- Backend environment variables with production credentials

---

## API Documentation

### Authentication Endpoints

**POST /api/auth/login**
```json
Request:
{
  "email": "test@example.com",
  "phone": "0123456789"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "email": "test@example.com" }
}
```

**GET /api/auth/verify**
```
Header: Authorization: Bearer <token>
Response: { "valid": true, "user": {...} }
```

### Booking Endpoints

**GET /api/bookings**
```
Header: Authorization: Bearer <token>
Response: { "bookings": [...] }
```

**GET /api/bookings/:id**
```
Header: Authorization: Bearer <token>
Response: {
  "booking": {
    "id": "BOOK001",
    "name": "Service Name",
    "status": "Completed",
    "description": "...",
    "attachments": [...]
  }
}
```

### Message Endpoints

**GET /api/messages/:booking_id**
```
Header: Authorization: Bearer <token>
Response: { "messages": [...] }
```

**POST /api/messages/:booking_id**
```
Header: Authorization: Bearer <token>
Request: { "message": "Your message here" }
Response: { "id": 1, "message": "...", "created_at": "..." }
```

---

## Running in Production

### Using Docker (Optional)

**Build & Run Backend**
```bash
cd backend
docker build -t customer-portal-api .
docker run -p 5000:5000 --env-file .env customer-portal-api
```

**Build & Run Frontend**
```bash
cd frontend
docker build -t customer-portal-web .
docker run -p 3000:3000 customer-portal-web
```

### Manual Deployment

#### Backend

```bash
# Build
npm install --production

# Start with PM2
npm install -g pm2
pm2 start server.js --name "portal-api"
```

#### Frontend

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## Troubleshooting

### Backend Issues

**Port 5000 already in use**
```bash
# Change PORT in .env
PORT=5001
```

**Database errors**
```bash
# Delete database and restart
rm backend/data/portal.db
npm run dev
```

**ServiceM8 API connection fails**
- Verify API credentials in `.env`
- Check internet connectivity
- System will use mock data as fallback

### Frontend Issues

**CORS errors**
- Ensure backend is running on correct port
- Check `NEXT_PUBLIC_API_URL` environment variable
- Backend has CORS enabled for localhost

**Auth token expires**
- Token lasts 24 hours
- Login again to get new token
- Production should implement refresh tokens

### General Issues

**"Failed to fetch" errors**
```bash
# Check if backend is running
curl http://localhost:5000/api/health
# Should return: {"status":"ok"}
```

**Database locked error**
- Close other processes using the database
- SQLite doesn't handle concurrent access well; for production use PostgreSQL

---

## Development Tips

### Add Test Data

Edit `backend/routes/auth.js` to add more mock users:
```javascript
const mockUsers = {
  'test@example.com': { phone: '0123456789', servicem8_id: 'CUST123' },
  'user@example.com': { phone: '9876543210', servicem8_id: 'CUST456' }
};
```

### Enable Debug Logging

Add to `backend/server.js`:
```javascript
app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Hot Reload

Both frontend and backend support hot reload:
- Backend: Uses `nodemon`
- Frontend: Next.js dev server auto-reloads

---

## Performance Optimization

### Database
- Add indexes on frequently queried columns
- Implement connection pooling for production

### API
- Cache booking data (5-minute TTL)
- Implement pagination for message lists
- Add gzip compression

### Frontend
- Code-split pages with dynamic imports
- Optimize images
- Implement service worker for offline capability

---

## Security Considerations

**Before Production:**

1. ✅ Change `JWT_SECRET` to a strong random string
2. ✅ Add HTTPS/SSL certificates
3. ✅ Implement rate limiting on auth endpoints
4. ✅ Add CSRF protection
5. ✅ Use secure HTTP-only cookies for tokens (not localStorage)
6. ✅ Validate and sanitize all user inputs
7. ✅ Add SQL injection protection (prepared statements - already implemented)
8. ✅ Set proper CORS policy for specific domains
9. ✅ Add logging and monitoring
10. ✅ Regular security audits and dependency updates

---

## Support & Documentation

- **TECH_NOTES.md** - Detailed technical documentation
- **API Endpoints** - See API Documentation section above
- **Database Schema** - See TECH_NOTES.md

---

## License

This project is provided as-is for evaluation purposes.

---

**Last Updated**: November 2025
**Status**: MVP Complete & Functional ✅
