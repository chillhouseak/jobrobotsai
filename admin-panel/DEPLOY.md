# Deploying Admin Panel on Vercel

## Prerequisites
- Vercel account
- Backend deployed (Railway, Render, or Vercel Serverless Functions)

---

## Step 1: Deploy Backend

### Option A: Deploy on Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Set environment variables:
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key
   PORT=5001
   ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-admin.vercel.app
   GEMINI_API_KEY=...
   ELEVENLABS_API_KEY=...
   ```
4. Deploy

### Option B: Deploy on Render
1. Go to [render.com](https://render.com)
2. Create Web Service
3. Set environment variables same as above
4. Deploy

---

## Step 2: Deploy Admin Panel on Vercel

### Method 1: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to admin panel
cd admin-panel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Method 2: Using GitHub
1. Push admin-panel folder to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import project
4. Select the admin-panel repo
5. Framework: Vite
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Deploy

---

## Step 3: Configure Environment Variables

### On Vercel (Admin Panel)
Go to Settings > Environment Variables:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### On Backend (Railway/Render)
```
ALLOWED_ORIGINS=https://your-admin.vercel.app
```

---

## Step 4: Create Admin User

After deploying backend, SSH into it or use their shell and run:
```bash
npm run seed:admin
```

---

## URLs

| Service | Local | Production |
|---------|-------|------------|
| Backend API | http://localhost:5001 | https://your-backend.railway.app |
| User Panel | http://localhost:5173 | https://your-frontend.vercel.app |
| Admin Panel | http://localhost:3002 | https://your-admin.vercel.app |

---

## Troubleshooting

### CORS Error
- Make sure backend ALLOWED_ORIGINS includes your Vercel admin URL
- Wait a few minutes for changes to propagate

### API Not Found
- Make sure VITE_API_URL ends with `/api`
- Example: `https://api.jobrobots.ai/api`

### Login Not Working
- Check if backend is running
- Verify JWT_SECRET is the same
- Check browser console for errors
