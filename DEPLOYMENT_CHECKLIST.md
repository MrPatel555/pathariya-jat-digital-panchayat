## 📋 Quick Deployment Checklist

Use this checklist to track your deployment progress!

---

### ✅ Pre-Deployment (Local Setup)

- [ ] **Node.js installed** - Check: `node -v`
- [ ] **Dependencies installed**
  - [ ] Frontend: `npm install`
  - [ ] Backend: `cd backend && npm install`
- [ ] **VAPID keys generated** - Check: `backend/vapid-keys.json` exists
- [ ] **Save VAPID keys** somewhere safe (password manager)
- [ ] **Local testing successful**
  - [ ] Backend runs: `npm run server`
  - [ ] Frontend runs: `npm run dev`
  - [ ] API calls work
- [ ] **`.env.local` and `backend/.env` files created**
- [ ] **`.gitignore` updated** - Check: `.env` is in there

---

### 🚂 Railway Setup

- [ ] **Railway account created** - https://railway.app/
- [ ] **GitHub repository created** - https://github.com/
- [ ] **Code pushed to GitHub**
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin <your-repo-url>
  git push -u origin main
  ```
- [ ] **Railway project created** from GitHub repo
- [ ] **Environment variables set in Railway:**
  - [ ] `PORT = 5000`
  - [ ] `NODE_ENV = production`
  - [ ] `VAPID_PUBLIC_KEY = <your-key>`
  - [ ] `VAPID_PRIVATE_KEY = <your-key>`
  - [ ] `VAPID_SUBJECT = mailto:admin@panchayat.local`
  - [ ] `ADMIN_PASSWORD = <secure-password>`
  - [ ] `CORS_ORIGIN = https://your-vercel-url.vercel.app` (update after Vercel deploy)
- [ ] **Railway deployment successful**
- [ ] **Railway URL saved**: `https://your-railway-app.railway.app`
- [ ] **Backend tested**: Visit Railway URL + `/health` in browser

---

### 🎯 Vercel Setup

- [ ] **Vercel account created** - https://vercel.com/
- [ ] **GitHub connected to Vercel**
- [ ] **Updated `.env.production`**:
  ```
  VITE_API_URL=https://your-railway-app.railway.app
  ```
- [ ] **Pushed to GitHub**:
  ```bash
  git add .env.production
  git commit -m "Add production config"
  git push
  ```
- [ ] **New project created in Vercel** from GitHub repo
- [ ] **Vercel environment variables set:**
  - [ ] `VITE_API_URL = https://your-railway-app.railway.app`
- [ ] **Vercel build successful** - Check in Deployments tab
- [ ] **Vercel URL saved**: `https://your-domain.vercel.app`

---

### 🔄 Final Configuration

- [ ] **Update Railway's CORS_ORIGIN**:
  - Go to Railway → Variables
  - Set `CORS_ORIGIN = https://your-domain.vercel.app`
  - Railway auto-redeploys
- [ ] **Test production setup**:
  - [ ] Open Vercel URL in browser
  - [ ] Check browser console - no errors
  - [ ] Network tab - API calls to Railway URL
  - [ ] API responses working (200 status)

---

### 🚀 Live Testing

- [ ] **Frontend loads** without errors
- [ ] **API endpoints working**:
  - [ ] GET requests working
  - [ ] POST requests working
  - [ ] CORS not blocking requests
- [ ] **Notifications working** (if applicable)
- [ ] **Database queries** working
- [ ] **Admin functions** working
- [ ] **Error handling** appropriate (no 500 errors)

---

### 📊 Monitoring Setup

- [ ] **Railway logs accessible** - Railway Dashboard → Logs
- [ ] **Vercel logs accessible** - Vercel Dashboard → Deployments → Logs
- [ ] **Error alerts setup** (optional)
- [ ] **Performance monitoring** (optional)

---

### 🔐 Security Checklist

- [ ] **VAPID keys NOT in GitHub** - Check `.gitignore`
- [ ] **`.env` files NOT in GitHub**
- [ ] **Production passwords NOT in code**
- [ ] **HTTPS used** (both Vercel & Railway provide)
- [ ] **CORS properly configured** (not `*` in production)
- [ ] **Admin password strong** (min 12 chars, mixed case, numbers, symbols)

---

## 🎯 URLs To Save

```
🚂 Railway Backend URL:
https://your-railway-app-abc123.railway.app

🎯 Vercel Frontend URL:
https://your-domain.vercel.app

🔑 GitHub Repository:
https://github.com/YOUR_USERNAME/repository-name
```

---

## 📱 Environment Variables Summary

### Railway (.env)
```
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-domain.vercel.app
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_SUBJECT=mailto:admin@panchayat.local
ADMIN_PASSWORD=strong_password
```

### Vercel (.env.production)
```
VITE_API_URL=https://your-railway-app.railway.app
```

---

## 🆘 Emergency Contacts

- **Railway Support**: https://railway.app/support
- **Vercel Support**: https://vercel.com/support
- **GitHub Support**: https://support.github.com/

---

## ✨ After Deployment

1. **Monitor logs regularly** for errors
2. **Update code** and push to GitHub → Auto-redeploy
3. **Keep dependencies updated** - monthly check
4. **Backup database** regularly (if using file-based SQLite)
5. **Test after each update** before going live

---

**Last Updated**: May 2026
**Status**: Ready for deployment ✅
