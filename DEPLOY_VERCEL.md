# Deploy Both Frontend & Backend on Vercel

## Architecture
Since Vercel is optimized for Next.js/React frontends, here's the best approach:

### Option 1: Vercel (Frontend) + Railway (Backend) ✅ Recommended

**Backend on Railway:**
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Connect your `jobrobots-ai/backend` folder
4. Add Environment Variables:
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key
   PORT=5001
   ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-admin.vercel.app
   GEMINI_API_KEY=...
   ELEVENLABS_API_KEY=...
   ```
5. Deploy → Get your URL (e.g., `https://jobrobots-backend.up.railway.app`)

**Frontend (User Panel) on Vercel:**
1. Already deployed ✅

**Admin Panel on Vercel:**
```bash
cd admin-panel
npm install -g vercel
vercel --prod
```

**Set Admin Panel Environment Variable:**
```
VITE_API_URL=https://your-railway-url.up.railway.app/api
```

---

### Option 2: All on Vercel (Convert to Next.js)

If you want everything on Vercel, convert to Next.js with API routes.

---

## Quick Commands

```bash
# Deploy Admin Panel
cd admin-panel
vercel --prod

# Create admin user (after backend deploys)
cd backend
npm run seed:admin
```

---

## Environment Variables Summary

| Variable | Backend (Railway) | Frontend (Vercel) | Admin (Vercel) |
|----------|-------------------|-------------------|----------------|
| MONGO_URI | ✅ | - | - |
| JWT_SECRET | ✅ | - | - |
| ALLOWED_ORIGINS | ✅ | - | - |
| VITE_API_URL | - | ✅ | ✅ |
| GEMINI_API_KEY | ✅ | - | - |
| ELEVENLABS_API_KEY | ✅ | - | - |

---

## Files Ready for Deployment

- ✅ `admin-panel/vercel.json` - Admin Panel Vercel config
- ✅ `admin-panel/.env.example` - Environment template
- ✅ `backend/seed-admin.js` - Admin creation script
