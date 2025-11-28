# Customer Portal MVP - TECH_NOTES

## What Was Built

A full-stack **Customer Portal** proof-of-concept (POC) enabling customers to:

- **Authenticate** via email and phone number
- **View bookings** from their service provider
- **Access booking details** including descriptions and attachments
- **Send messages** related to specific bookings
- **Persist data** across sessions

### Technology Stack

- **Frontend**: Next.js 14 (App Router) with React 18
- **Backend**: Express.js with Node.js
- **Database**: SQLite3 (better-sqlite3)
- **Authentication**: JWT tokens
- **API Integration**: Axios for HTTP requests
- **Styling**: Inline CSS for rapid development

---

## Architecture & Design Decisions

### Backend Structure

```
backend/
├── server.js              # Main entry point
├── db/
│   └── database.js        # SQLite initialization and queries
├── routes/
│   ├── auth.js            # Login/verification endpoints
│   ├── bookings.js        # Booking retrieval (ServiceM8 + mocked)
│   └── messages.js        # Message CRUD operations
└── middleware/
    └── auth.js            # JWT authentication middleware
```

**Key Decisions:**
- Used JWT tokens for stateless authentication
- SQLite for simplicity (no external database setup required)
- Express middleware for request validation
- Axios for API calls to ServiceM8

### Frontend Structure

```
frontend/
├── app/
│   ├── layout.js          # Root layout with global styles
│   ├── page.js            # Login page
│   ├── bookings/
│   │   ├── page.js        # Bookings list view
│   │   └── [id]/
│   │       └── page.js    # Booking detail + messaging
└── package.json
```

**Key Decisions:**
- Used Next.js App Router for modern routing
- Client-side components for interactive features
- Inline CSS for self-contained, minimal styling
- LocalStorage for token persistence (dev convenience)
- Responsive grid layout for booking cards

---

## Assumptions Made

1. **Authentication**: Implemented a simple email + phone verification system rather than OAuth, as per requirements flexibility
2. **ServiceM8 API**: Real API calls attempted but fall back to mock data if credentials unavailable
3. **User Linking**: Assumed customers are mapped to ServiceM8 via a `servicem8_id` field
4. **Data Persistence**: Used SQLite for simplicity; in production would use PostgreSQL/MongoDB
5. **Sessions**: Token expiry set to 24 hours; refresh tokens not implemented for MVP
6. **Messages**: Simple text storage; could be extended with file attachments, read receipts
7. **Attachments**: Mocked in the UI; real implementation would fetch from ServiceM8 job files API
8. **UI Design**: Minimal but functional; prioritized core features over aesthetics

---

## How ServiceM8 API Was Integrated

The backend makes real API calls to ServiceM8:

```javascript
// GET /api/bookings - Fetches customer jobs
axios.get(
  `https://api.servicem8.com/api_1.0/job.json?customer_id=${servicem8_id}`,
  { headers: { Authorization: `Bearer ${process.env.SERVICEM8_API_KEY}` } }
)

// GET /api/bookings/:id - Fetches specific job details
axios.get(
  `https://api.servicem8.com/api_1.0/job/${id}.json`,
  { headers: { Authorization: `Bearer ${process.env.SERVICEM8_API_KEY}` } }
)
```

If the real API fails (missing credentials or network error), the system gracefully falls back to mock data, ensuring the POC remains functional for demonstration.

---

## Potential Improvements

### Short-term

1. **Authentication Enhancements**:
   - Implement refresh tokens for better security
   - Add password hashing for email-based login
   - Support OAuth/SSO integration

2. **Message Features**:
   - Add file upload/attachment support
   - Implement typing indicators
   - Add message read receipts
   - Enable admin responses from provider side

3. **UI/UX**:
   - Add loading skeletons for better perceived performance
   - Implement pagination for large booking lists
   - Add search/filter functionality
   - Mobile-responsive design refinement

4. **Data**:
   - Cache booking data to reduce API calls
   - Implement pagination for messages
   - Add soft deletes for audit trail

### Long-term

1. **Infrastructure**:
   - Move to PostgreSQL for production scalability
   - Implement Redis for session caching
   - Add API rate limiting and monitoring
   - Containerize with Docker

2. **Features**:
   - Real-time messaging with WebSockets
   - Payment integration
   - Booking cancellation/rescheduling
   - Customer ratings and reviews
   - Push notifications

3. **Operations**:
   - Comprehensive error handling and logging
   - Unit and integration tests
   - CI/CD pipeline
   - Analytics and monitoring

---

## How AI Assisted the Development

1. **Code Generation**: AI helped scaffold the project structure quickly, including boilerplate for Express routes and React components
2. **API Integration**: Provided guidance on ServiceM8 API endpoint structure and authentication patterns
3. **Component Design**: Generated responsive UI components with inline styling
4. **Error Handling**: Suggested graceful fallback patterns (mock data when real API fails)
5. **Best Practices**: Advised on JWT implementation, middleware patterns, and Next.js App Router conventions
6. **Documentation**: Helped create clear, structured documentation and comments

---

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- ServiceM8 API credentials (optional; mock data available)

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your ServiceM8 credentials (optional)
npm install
npm run dev  # Runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:3000
```

### Test the Application

1. Open http://localhost:3000 in browser
2. Login with demo credentials:
   - Email: `test@example.com`
   - Phone: `0123456789`
3. View mock bookings and send messages

### Environment Variables

**Backend (.env)**:
```
PORT=5000
SERVICEM8_API_KEY=your_api_key_here
SERVICEM8_BUSINESS_ID=your_business_id_here
JWT_SECRET=your_jwt_secret_here
```

**Frontend (.env.local)**:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Database Schema

```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  servicem8_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  created_at DATETIME,
  expires_at DATETIME,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Messages table
CREATE TABLE messages (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  booking_id TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
```

---

## API Endpoints Reference

### Authentication

- `POST /api/auth/login` - Login with email and phone
- `GET /api/auth/verify` - Verify token validity

### Bookings

- `GET /api/bookings` - List all bookings for user
- `GET /api/bookings/:id` - Get specific booking details

### Messages

- `GET /api/messages/:booking_id` - List messages for a booking
- `POST /api/messages/:booking_id` - Send a message

All protected endpoints require `Authorization: Bearer <token>` header.

---

## Deployment Checklist

- [ ] Set environment variables on production server
- [ ] Configure CORS for allowed frontend domains
- [ ] Enable HTTPS for all API calls
- [ ] Migrate to production-grade database (PostgreSQL)
- [ ] Set up error logging and monitoring
- [ ] Configure API rate limiting
- [ ] Run security audit on dependencies
- [ ] Set up automated backups for database
- [ ] Implement CI/CD pipeline
- [ ] Add comprehensive tests

---

## Notes

- The MVP prioritizes functionality over visual design; the UI is intentionally minimal but fully functional
- Mock data is used as a fallback to ensure the system works even without ServiceM8 credentials
- The project uses modern JavaScript (ES6+, async/await) for clarity
- Token expiration is 24 hours; for production, implement shorter expiry with refresh tokens
