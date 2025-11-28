# Running the Customer Portal MVP

This guide explains how to set up and run the Customer Portal application using the provided shell scripts.

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** - Comes with Node.js
- **bash** or **sh** shell - Most Unix-like systems (Linux, macOS, WSL)

Verify installation:
```bash
node --version
npm --version
bash --version
```

## Project Structure

```
11.28.25_Practice/
├── backend/                    # Express.js API server
│   ├── routes/                # API endpoints (auth, bookings, messages)
│   ├── db/                    # Database configuration
│   ├── middleware/            # Authentication middleware
│   ├── public/attachments/    # Sample invoice and receipt files
│   ├── package.json
│   └── server.js
├── frontend/                   # Next.js React application
│   ├── app/                   # App Router pages
│   ├── package.json
│   └── tailwind.config.js
├── setup.sh                   # Installation script
├── run.sh                     # Start services script
├── stop.sh                    # Stop services script
├── generate_documents.py      # Generate sample PDFs
└── README.md
```

## Quick Start (3 Steps)

### Step 1: Install Dependencies

Run this command once to install all required packages:

```bash
bash setup.sh
```

**What it does:**
- Checks if Node.js is installed
- Navigates to the `backend` folder and runs `npm install`
- Navigates to the `frontend` folder and runs `npm install`
- Installs Tailwind CSS, PostCSS, and other dependencies

**Output:**
```
Setting up dependencies...
Node: v18.x.x
Setting up backend
Created backend/.env
Setting up frontend
Created frontend/.env.local
Setup complete. Run:
  bash run.sh
Then open: http://localhost:3000
```

---

### Step 2: Start Services

Once setup is complete, start both the backend and frontend:

```bash
bash run.sh
```

**What it does:**
- Starts the Express.js backend server on port 5000
- Starts the Next.js frontend server on port 3000
- Both services run in the background
- Displays the running URLs and process IDs
- Logs output to `backend.log` and `frontend.log`

**Output:**
```
Starting services...
✓ Services started successfully
Frontend: http://localhost:3000 (PID: 12345)
Backend:  http://localhost:5000 (PID: 12346)
Press Ctrl+C to stop
```

**Access the Application:**
- **Frontend:** Open `http://localhost:3000` in your browser
- **Backend API:** Access at `http://localhost:5000/api`

---

### Step 3: Stop Services

When you're done, stop all services:

```bash
bash stop.sh
```

**What it does:**
- Finds and stops the frontend process (port 3000)
- Finds and stops the backend process (port 5000)
- Gracefully terminates services
- Displays confirmation messages

**Optional: Clean logs**
```bash
bash stop.sh --clean
```

This also removes the `backend.log` and `frontend.log` files.

---

## Shell Scripts Reference

### `setup.sh` - Initial Installation

**Purpose:** Install all dependencies and create environment files

**Usage:**
```bash
bash setup.sh
```

**What happens:**
1. Checks for Node.js installation
2. Creates `.env` file in backend (if it doesn't exist)
3. Installs backend dependencies via `npm install`
4. Creates `.env.local` file in frontend (if it doesn't exist)
5. Installs frontend dependencies via `npm install`

**Notes:**
- Only needs to be run once
- Safe to run again if you need to reinstall packages
- Environment files are created from `.env.example` files

---

### `run.sh` - Start Services

**Purpose:** Launch both backend and frontend services simultaneously

**Usage:**
```bash
bash run.sh
```

**What happens:**
1. Verifies dependencies are installed
2. Starts backend: `cd backend && npm run dev`
3. Starts frontend: `cd frontend && npm run dev`
4. Both run as background processes
5. Logs written to `backend.log` and `frontend.log`
6. Waits for both services to be ready
7. Displays URLs and instructions

**Environment Variables:**
- `NEXT_PUBLIC_API_URL` - Frontend uses this to connect to the backend
  - Default: `http://localhost:5000/api`
  - Can be customized in `frontend/.env.local`

**Monitoring:**
While services are running, you can check logs:
```bash
tail -f backend.log
tail -f frontend.log
```

**Stopping:**
Press `Ctrl+C` in the terminal where `run.sh` is running

---

### `stop.sh` - Stop Services

**Purpose:** Gracefully shut down all running services

**Usage:**
```bash
bash stop.sh
```

**What happens:**
1. Finds processes on port 3000 (frontend)
2. Finds processes on port 5000 (backend)
3. Sends SIGTERM signal to gracefully stop them
4. If needed, sends SIGKILL for force termination
5. Displays status for each service

**With cleanup:**
```bash
bash stop.sh --clean
```

This also deletes:
- `backend.log`
- `frontend.log`

**Manual alternative:**
If scripts don't work, you can manually stop services:
```bash
# Kill all npm processes
pkill -f "npm run dev"

# Or kill by port
lsof -ti:3000 | xargs kill -9  # Kill frontend
lsof -ti:5000 | xargs kill -9  # Kill backend
```

---

## Demo Login Credentials

Once the application is running, use these credentials to log in:

**Email:** `test@example.com`
**Phone:** `0123456789`

---

## Default Ports

| Service    | Port | URL                    |
|-----------|------|------------------------|
| Frontend   | 3000 | http://localhost:3000  |
| Backend    | 5000 | http://localhost:5000  |

**If ports are in use:**
- Next.js will automatically try ports 3001, 3002, etc.
- Express will not start if port 5000 is occupied
- Use `stop.sh` to free up ports

---

## Troubleshooting

### Issue: "Port 5000 is already in use"

**Solution:**
```bash
# Option 1: Use stop.sh to free ports
bash stop.sh

# Option 2: Manually kill the process
lsof -ti:5000 | xargs kill -9
```

### Issue: "Dependencies not installed"

**Solution:**
```bash
bash setup.sh
```

### Issue: Frontend can't connect to backend

**Check:**
1. Backend is running on port 5000
2. Frontend `.env.local` has correct API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
3. Both services are actually running:
   ```bash
   lsof -i :3000  # Check frontend
   lsof -i :5000  # Check backend
   ```

### Issue: Services start but pages don't load

**Solutions:**
1. Clear Next.js cache and rebuild:
   ```bash
   cd frontend && rm -rf .next && npm run build
   ```
2. Check browser console for errors (F12)
3. Check logs:
   ```bash
   tail -20 backend.log
   tail -20 frontend.log
   ```

### Issue: Node modules are missing

**Solution:**
```bash
bash setup.sh
# or manually:
cd backend && npm install
cd ../frontend && npm install
```

---

## Advanced Usage

### Running Services Individually

**Backend only:**
```bash
cd backend
npm run dev
```

**Frontend only:**
```bash
cd frontend
npm run dev
```

### Environment Configuration

**Backend (.env):**
```env
PORT=5000
API_URL=http://localhost:5000
SERVICEM8_API_KEY=your_api_key
JWT_SECRET=your_secret
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### View Logs in Real-time

```bash
# Backend logs
tail -f backend.log

# Frontend logs
tail -f frontend.log

# Both
tail -f *.log
```

### Clean Up Everything

```bash
# Stop services
bash stop.sh --clean

# Remove node_modules and cache
rm -rf backend/node_modules frontend/node_modules
rm -rf backend/.next frontend/.next

# Reinstall
bash setup.sh
```

---

## Building for Production

### Frontend Production Build

```bash
cd frontend
npm run build
npm run start  # Starts production server
```

### Backend Production

```bash
cd backend
npm run build  # If build script exists
NODE_ENV=production npm start
```

---

## Development Tips

### Hot Reloading

Both frontend and backend support hot reloading:
- **Frontend:** Changes to React files reload automatically
- **Backend:** Changes to Express routes reload automatically (with nodemon)

### Database

The application uses SQLite (better-sqlite3):
- Database file: `backend/database.db` (created automatically)
- No separate database setup needed
- Data persists between restarts

### Testing the API

Test endpoints with curl:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phone":"0123456789"}'

# Get bookings (replace TOKEN with actual token)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/bookings
```

---

## Summary

| Command | Purpose | First Run? |
|---------|---------|-----------|
| `bash setup.sh` | Install dependencies | ✅ Yes (once) |
| `bash run.sh` | Start both services | ✅ Every time |
| `bash stop.sh` | Stop services | As needed |
| `bash stop.sh --clean` | Stop & clean logs | As needed |

---

## Getting Help

If you encounter issues:

1. Check the logs: `cat backend.log` and `cat frontend.log`
2. Verify Node.js is installed: `node --version`
3. Ensure ports are free: `lsof -i :3000` and `lsof -i :5000`
4. Try a clean setup: `bash setup.sh` and `bash run.sh`

---

**Enjoy your Customer Portal MVP! 🚀**
