# Deploy JobRobots AI - Full Stack on Vercel

## Project Structure

```
jobrobots-ai/
├── frontend/          # User Panel (React + Vite)
├── admin-panel/       # Admin Panel (React + Vite)
├── api/              # Serverless API Routes
├── backend/          # Original Express Backend (keep for local dev)
└── vercel.json       # Vercel Configuration
```

---

## Deploy to Vercel

### Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import your `jobrobots-ai` repository
4. Vercel will auto-detect settings

### Step 2: Configure Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://your_connection_string` |
| `JWT_SECRET` | `your_secret_key_2024` |
| `GEMINI_API_KEY` | `your_gemini_api_key` |
| `ELEVENLABS_API_KEY` | `your_elevenlabs_key` (optional) |

### Step 3: Deploy

Click **Deploy** - Vercel will:
1. Build the frontend (`frontend/package.json`)
2. Set up serverless API routes (`api/` folder)

### Step 4: Get Your URL

After deployment, you'll get a URL like:
`https://jobrobots-ai-xxx.vercel.app`

---

## Frontend API Configuration

For frontend to work with the API, add environment variable:

**User Frontend (Vercel):**
```
VITE_API_URL=https://your-app.vercel.app/api
```

**Admin Panel (Vercel):**
```
VITE_API_URL=https://your-app.vercel.app/api
```

---

## Create Admin User

After deploying, SSH into Vercel or run locally:

1. Update `backend/.env` with your production values
2. Run:
```bash
cd backend
npm run seed:admin
```

---

## API Endpoints

After deployment, your API will be available at:
`https://your-app.vercel.app/api`

| Endpoint | Method | Description |
|---------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/auth/me` | GET | Get current user |
| `/api/auth/profile` | PUT | Update profile |
| `/api/admin/login` | POST | Admin login |
| `/api/admin/users` | GET | List users |
| `/api/admin/analytics` | GET | Get analytics |
| `/api/ai/answer` | POST | Generate answer |
| `/api/ai/cover-letter` | POST | Generate cover letter |
| `/api/webhooks/ipn` | POST | IPN webhook |

---

## Local Development

### Start Backend (Local)
```bash
cd backend
npm install
npm run dev
```

### Start Frontend (Local)
```bash
cd frontend
npm install
npm run dev
```

### Start Admin Panel (Local)
```bash
cd admin-panel
npm install
npm run dev
```

---

## Troubleshooting

### API 404 Errors
- Check that frontend's `VITE_API_URL` ends with `/api`
- Verify Vercel environment variables are set

### CORS Issues
- All API routes have `Access-Control-Allow-Origin: *`

### Login Not Working
- Clear browser cache
- Check JWT_SECRET is set correctly
- Verify MongoDB connection
