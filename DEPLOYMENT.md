# DataMind Deployment Guide

This guide covers deploying DataMind to various platforms.

## Quick Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend + Database)
**Best for:** Quick deployment with free tier
**Time:** ~15 minutes

### Option 2: DigitalOcean/AWS/Azure
**Best for:** Full control, production use
**Time:** ~30-60 minutes

### Option 3: Docker (Self-hosted)
**Best for:** Custom infrastructure
**Time:** ~20 minutes

---

## Prerequisites

- GitHub account (you already have the repo!)
- Groq API key: https://console.groq.com/
- PostgreSQL database (can use free tier from Railway/Render/Supabase)

---

## Option 1: Vercel + Railway (Recommended for Quick Start)

### Step 1: Deploy Backend to Railway

1. Go to https://railway.app/
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `Datamind` repository
5. Railway will detect Python and deploy automatically

6. **Add Environment Variables** in Railway dashboard:
   ```
   DATABASE_URL=<will be auto-filled when you add PostgreSQL>
   SECRET_KEY=<generate a random 32-character string>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   GROQ_API_KEY=<your groq API key>
   ALLOWED_ORIGINS=https://your-app-name.vercel.app
   ```

7. **Add PostgreSQL Database:**
   - In Railway, click **"New"** → **"Database"** → **"PostgreSQL"**
   - Railway will automatically set `DATABASE_URL` environment variable

8. **Set Start Command:**
   - Go to Settings → Deploy
   - Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Set root directory: `backend`

9. **Generate Domain:**
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Copy your backend URL (e.g., `https://datamind-backend.up.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com/
2. Click **"Add New Project"**
3. Import your `Datamind` GitHub repository
4. **Configure Project:**
   - Framework Preset: **Next.js**
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

5. **Add Environment Variable:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
   (Replace with your Railway backend URL from Step 1.9)

6. Click **Deploy**

7. **Your site is live!**
   - Vercel will give you a URL like `https://datamind-xyz.vercel.app`
   - Go back to Railway and update `ALLOWED_ORIGINS` to this URL

---

## Option 2: DigitalOcean/AWS/Azure

### Backend Deployment

1. **Create a Virtual Machine** (Ubuntu 22.04 recommended)

2. **SSH into your server:**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install dependencies:**
   ```bash
   apt update
   apt install -y python3-pip python3-venv postgresql nginx
   ```

4. **Clone your repository:**
   ```bash
   git clone https://github.com/AdarshXGupta07/Datamind.git
   cd Datamind/backend
   ```

5. **Set up Python environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

6. **Create `.env` file:**
   ```bash
   nano .env
   ```
   Add your environment variables (see `.env.example`)

7. **Set up PostgreSQL:**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE datamind;
   CREATE USER datamind_user WITH PASSWORD 'your-secure-password';
   GRANT ALL PRIVILEGES ON DATABASE datamind TO datamind_user;
   \q
   ```

8. **Run with Gunicorn + Uvicorn:**
   ```bash
   pip install gunicorn
   gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```

9. **Set up Nginx reverse proxy:**
   ```bash
   nano /etc/nginx/sites-available/datamind
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

   Enable and reload:
   ```bash
   ln -s /etc/nginx/sites-available/datamind /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx
   ```

10. **Set up SSL with Certbot:**
    ```bash
    apt install -y certbot python3-certbot-nginx
    certbot --nginx -d your-domain.com
    ```

### Frontend Deployment

You can still use Vercel for frontend (easiest), or build and serve with Nginx:

```bash
cd ~/Datamind/frontend
npm install
npm run build

# Serve with Nginx
cp -r .next/static /var/www/datamind/
cp -r .next/standalone /var/www/datamind/
```

---

## Option 3: Docker Deployment

### Create Dockerfiles

**backend/Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**frontend/Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

CMD ["node", "server.js"]
```

**docker-compose.yml (root directory):**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: datamind
      POSTGRES_USER: datamind
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://datamind:${DB_PASSWORD}@postgres:5432/datamind
      SECRET_KEY: ${SECRET_KEY}
      GROQ_API_KEY: ${GROQ_API_KEY}
      ALLOWED_ORIGINS: ${FRONTEND_URL}
    ports:
      - "8000:8000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: ${BACKEND_URL}
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Deploy with Docker:**
```bash
docker-compose up -d
```

---

## Environment Variables Checklist

### Backend (.env)
- [x] `DATABASE_URL` - PostgreSQL connection string
- [x] `SECRET_KEY` - Random 32+ character string for JWT
- [x] `ALGORITHM` - HS256
- [x] `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration (1440 = 24 hours)
- [x] `GROQ_API_KEY` - Get from https://console.groq.com/
- [x] `ALLOWED_ORIGINS` - Frontend URL (comma-separated for multiple)

### Frontend (.env.local)
- [x] `NEXT_PUBLIC_API_URL` - Backend URL

---

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test login
- [ ] Test adding a database connection
- [ ] Test running a query
- [ ] Test connection editing
- [ ] Test connection deletion
- [ ] Verify CORS is working
- [ ] Check browser console for errors
- [ ] Test on mobile device
- [ ] Set up monitoring (optional: Sentry, LogRocket)

---

## Troubleshooting

### "Failed to load resource: 401 Unauthorized"
- **Cause:** Token expired or invalid
- **Fix:** Logout and login again

### "CORS policy error"
- **Cause:** Frontend URL not in `ALLOWED_ORIGINS`
- **Fix:** Add your frontend URL to backend `.env` → `ALLOWED_ORIGINS`

### "Connection refused"
- **Cause:** Backend not running or wrong `NEXT_PUBLIC_API_URL`
- **Fix:** Check backend is running, verify URL in frontend env

### Database connection fails
- **Cause:** Wrong `DATABASE_URL` or PostgreSQL not running
- **Fix:** Verify PostgreSQL is running and credentials are correct

---

## Free Tier Limits

### Railway (Backend + Database)
- **Free tier:** $5/month credit
- **Limits:** Good for development, small projects
- **Upgrade:** $10/month for more resources

### Vercel (Frontend)
- **Free tier:** Unlimited hobby projects
- **Limits:** 100GB bandwidth/month, reasonable for most projects
- **Upgrade:** $20/month Pro plan

### Render (Alternative to Railway)
- **Free tier:** 750 hours/month
- **Database:** Free PostgreSQL with 1GB storage

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review logs in your deployment platform
3. Open an issue on GitHub: https://github.com/AdarshXGupta07/Datamind/issues

---

Made with ❤️ by Adarsh Gupta
