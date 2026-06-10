# Deploy Frontend to Netlify

Quick guide to deploy DataMind frontend to Netlify.

## Prerequisites

- ✅ Backend deployed to Railway (or any hosting)
- ✅ Backend URL ready (e.g., `https://datamind-production.up.railway.app`)
- ✅ Netlify account (free tier works great!)

---

## Deployment Steps

### 1. Go to Netlify

Visit: https://app.netlify.com/

### 2. Import from GitHub

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Select your **Datamind** repository
4. Authorize Netlify to access your repo

### 3. Configure Build Settings

Netlify should auto-detect Next.js, but verify these settings:

**Build settings:**
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Functions directory:** (leave empty, handled by plugin)

### 4. Add Environment Variable

Click **"Add environment variables"** and add:

```
Key: NEXT_PUBLIC_API_URL
Value: https://your-backend-url.railway.app
```

**Important:** Replace with YOUR actual Railway backend URL!

### 5. Deploy!

Click **"Deploy site"**

Netlify will:
1. Install dependencies (`npm install`)
2. Build your Next.js app (`npm run build`)
3. Deploy to a temporary URL like `random-name-123456.netlify.app`

**First deploy takes ~3-5 minutes.**

---

## Post-Deployment

### Update Backend CORS

Your backend needs to allow requests from Netlify.

1. Go to **Railway** dashboard
2. Select your **backend** service
3. Go to **Variables**
4. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=https://your-site.netlify.app
   ```
   
   Or allow multiple origins (comma-separated):
   ```
   ALLOWED_ORIGINS=https://your-site.netlify.app,http://localhost:3000
   ```

5. Save and redeploy

### Custom Domain (Optional)

1. In Netlify: **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `datamind.yourdomain.com`)
4. Follow DNS instructions to point to Netlify

---

## Environment Variables Reference

Your frontend `.env.local` should have:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

On Netlify, this is set in the dashboard under **Site settings** → **Environment variables**.

---

## Troubleshooting

### "CORS policy" error
**Solution:** Add your Netlify URL to `ALLOWED_ORIGINS` in Railway backend

### "Failed to load resource: 401"
**Solution:** Login expired. Logout and login again.

### Build fails
**Solution:** Check Netlify build logs. Common issues:
- Missing environment variable
- Node version mismatch (should be 20)
- Syntax errors in code

### "API URL undefined"
**Solution:** Environment variable not set. Add `NEXT_PUBLIC_API_URL` in Netlify dashboard.

---

## Update Frontend

When you push to GitHub `main` branch:
- ✅ Netlify auto-deploys new version
- ✅ Takes 2-3 minutes
- ✅ Zero downtime

---

## Free Tier Limits

**Netlify Free:**
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ Automatic HTTPS
- ✅ Global CDN

Perfect for most projects! 🎉

---

## Testing Your Deployment

After deployment:

1. ✅ Visit your Netlify URL
2. ✅ Register a new account
3. ✅ Login
4. ✅ Add a database connection
5. ✅ Run a query
6. ✅ Test on mobile device

---

## Next Steps

1. **Custom domain** (optional)
2. **Set up analytics** (Netlify Analytics)
3. **Add monitoring** (Sentry, LogRocket)
4. **Enable Netlify Functions** for advanced features

---

Made with ❤️ by Adarsh Gupta
