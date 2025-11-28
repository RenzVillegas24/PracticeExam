# Quick Reference - Shell Scripts

## TL;DR - Three Commands to Run Everything

```bash
# 1. Install dependencies (first time only)
bash setup.sh

# 2. Start services
bash run.sh

# 3. Open browser to http://localhost:3000
# When done, press Ctrl+C or in another terminal:
bash stop.sh
```

---

## Script Commands

### `bash setup.sh`
- **When:** First time setup, or when dependencies are missing
- **Does:** Installs Node packages for backend and frontend
- **Time:** ~2-3 minutes
- **Output:** Confirms Node version and that setup is complete

### `bash run.sh`
- **When:** Every time you want to start the application
- **Does:** Starts both backend (port 5000) and frontend (port 3000)
- **Time:** ~5-10 seconds to start
- **Stop:** Press `Ctrl+C` or run `bash stop.sh` in another terminal
- **Logs:** `backend.log` and `frontend.log`

### `bash stop.sh`
- **When:** You want to stop services
- **Does:** Gracefully shuts down both services
- **Options:** `bash stop.sh --clean` also removes log files

---

## Demo Login

```
Email: test@example.com
Phone: 0123456789
```

---

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |

---

## Troubleshooting Checklist

| Problem | Solution |
|---------|----------|
| "Port in use" | Run `bash stop.sh` |
| "Dependencies missing" | Run `bash setup.sh` |
| "Can't connect to backend" | Check `frontend/.env.local` has correct API URL |
| "Services won't start" | Check logs: `cat backend.log` and `cat frontend.log` |
| "Pages load but nothing displays" | Clear frontend cache: `cd frontend && rm -rf .next` |

---

## One-Liner Reference

```bash
# Full reset
bash stop.sh --clean && bash setup.sh && bash run.sh

# View all logs
tail -f *.log

# Kill all node processes
pkill -f "npm run dev"

# Check if ports are in use
lsof -i :3000
lsof -i :5000
```

---

## Notes

- First run: `setup.sh` → `run.sh` (takes ~5 minutes total)
- Subsequent runs: Just `run.sh`
- Frontend auto-reloads on file changes
- Backend auto-reloads on file changes
- Both services run in background when you use `run.sh`
- Press Ctrl+C in the terminal where you ran `run.sh` to stop both services

