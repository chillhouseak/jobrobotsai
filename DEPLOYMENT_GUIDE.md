# JobRobots AI - Complete Vercel Deployment Guide

## Project Structure

```
jobrobotsai/
├── api/                    # Serverless Backend (Vercel Functions)
├── frontend/               # User App (Vercel Static)
├── admin-panel/           # Admin Dashboard (Vercel Static)
└── backend/               # Local development only
```

---

## STEP 1: Deploy Backend API

### Settings in Vercel Dashboard:

1. **New Project** → Import `chillhouseak/jobrobotsai`
2. **Root Directory:** `api` (click Edit → type `api`)
3. **Framework Preset:** Other
4. **Build Command:** Leave empty or `npm run build` (if exists)
5. **Output Directory:** `.` (default)

### Environment Variables:
```
MONGODB_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_super_secret_key_2024
GEMINI_API_KEY=your_gemini_key
ELEVENLABS_API_KEY=your_elevenlabs_key
```

### Result:
Your backend will be at: `https://jobrobots-ai-api.vercel.app`
API endpoints: `https://jobrobots-ai-api.vercel.app/api/*`

---

## STEP 2: Deploy Frontend

### Settings in Vercel Dashboard:

1. **New Project** → Import `chillhouseak/jobrobotsai`
2. **Root Directory:** `frontend` (click Edit → type `frontend`)
3. **Framework Preset:** Vite
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`

### Environment Variables:
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

### If using Root Import (not framework preset):
```
Build Command: cd frontend && npm install && npm run build
Output Directory: frontend/dist
```

---

## STEP 3: Deploy Admin Panel

### Settings in Vercel Dashboard:

1. **New Project** → Import `chillhouseak/jobrobotsai`
2. **Root Directory:** `admin-panel` (click Edit → type `admin-panel`)
3. **Framework Preset:** Vite
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`

### Environment Variables:
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

---

## File Configurations

### frontend/vercel.json
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### frontend/vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  },
  base: '/'
})
```

### frontend/src/services/api.js
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

### admin-panel/vercel.json
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### admin-panel/vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  },
  base: '/'
})
```

### admin-panel/.env (local development)
```
VITE_API_URL=http://localhost:5001/api
```

---

## Create Admin User

After deploying backend:

1. SSH into Vercel (if available) OR
2. Locally update `backend/.env` with production values
3. Run:
```bash
cd backend
npm run seed:admin
```

---

## Final Architecture

| Service | URL |
|---------|-----|
| Backend API | `https://jobrobots-ai-api.vercel.app` |
| User Frontend | `https://jobrobots-ai-frontend.vercel.app` |
| Admin Panel | `https://jobrobots-ai-admin.vercel.app` |

---

## Troubleshooting

### "Failed to load module script" error
- Ensure `base: '/'` in vite.config.js
- Ensure `vercel.json` has rewrites for SPA routing

### Blank screen
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Ensure API URL ends with `/api`

### API 404
- Verify backend is deployed and running
- Check API URL format: `https://your-api.vercel.app/api`
