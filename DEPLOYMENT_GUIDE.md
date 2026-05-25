# 🚀 Deployment Guide - Railway + Vercel

Yeh guide aapko apne Panchayat website ko **Railway** aur **Vercel** par live karne mein madad karega.

## 📋 Overview

- **Backend**: Node.js + Express → **Railway** par deploy
- **Frontend**: React + Vite → **Vercel** par deploy
- **Database**: SQLite (Railway par hosted)
- **Notifications**: Web Push VAPID keys (Environment variables se manage)

---

## 📌 Step 1: VAPID Keys Generate Karein

```bash
cd backend
node -e "const webpush = require('web-push'); const keys = webpush.generateVAPIDKeys(); console.log(JSON.stringify(keys, null, 2));"
```

Ye command se aapko yeh keys milenge:
```json
{
  "publicKey": "YOUR_PUBLIC_KEY",
  "privateKey": "YOUR_PRIVATE_KEY"
}
```

**Ye keys ko kahi safe jagah save karein** (password manager mein) - aapko inhe dono platforms par use karne hain.

---

## 🚂 Step 2: Railway Par Backend Deploy Karein

### 2.1 Railway Account Setup

1. **Railway.app** par account banain:
   - https://railway.app/ par jain
   - GitHub se sign up karein (recommended)

2. **GitHub par code push karein**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/pathariya-panchayat.git
   git push -u origin main
   ```

### 2.2 Railway Par Project Setup

1. Railway dashboard mein **New Project** → **Deploy from GitHub repo** select karein
2. Apna GitHub repository select karein
3. **Root directory**: Leave empty (ya `.` kar do)
4. **Build command**: `npm install && npm run build` (optional)
5. **Start command**: `npm run start`

### 2.3 Environment Variables (Railway Dashboard mein)

Railway dashboard → **Variables** section mein yeh add karein:

```
PORT = 5000
NODE_ENV = production
CORS_ORIGIN = https://your-domain.vercel.app

VAPID_PUBLIC_KEY = <paste-your-public-key>
VAPID_PRIVATE_KEY = <paste-your-private-key>
VAPID_SUBJECT = mailto:admin@panchayat.local

ADMIN_PASSWORD = your_secure_password_here
```

**CORS_ORIGIN** ko apne Vercel URL se update karenge baad mein.

### 2.4 Railway URL Note Karein

Railway deploy hone ke baad aapko ek URL milega:
```
https://your-railway-app-abc123.railway.app
```

Isko **save karein** - frontend mein isko use karenge.

---

## 🎯 Step 3: Vercel Par Frontend Deploy Karein

### 3.1 Vercel Account Setup

1. **Vercel.com** par account banain:
   - https://vercel.com/ par jain
   - GitHub se connect karein

### 3.2 Frontend Setup (Local mein)

Apke project root mein `.env.production` file banain:

```bash
# .env.production (project root mein)
VITE_API_URL=https://your-railway-app-abc123.railway.app
```

**Replace** `https://your-railway-app-abc123.railway.app` apne actual Railway URL se.

### 3.3 App.jsx mein API URL Update Karein

Find karein jahan localStorage se backend URL use ho raha hai:

```javascript
// Search for any hardcoded localhost:5000 references

// Replace karein:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Ya
const API_URL = window.__API_URL__ || 'http://localhost:5000';
```

### 3.4 Vercel Deploy

1. Railway URL complete hone ke baad, GitHub mein yeh changes push karein:
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

2. Vercel dashboard mein:
   - **New Project** → GitHub repo select karein
   - Framework: **Vite** (auto-detect hona chahiye)
   - Build command: `npm run build` ✓
   - Output directory: `dist` ✓
   - Install command: `npm install` ✓

3. **Environment Variables** section mein add karein:
   ```
   VITE_API_URL = https://your-railway-app-abc123.railway.app
   ```

4. **Deploy** button dab do

---

## 🔄 Step 4: Backend mein Vercel URL Update Karein

Vercel deploy hone ke baad, Vercel URL milega:
```
https://your-domain.vercel.app
```

Ab Railway dashboard mein jao → **Variables** → `CORS_ORIGIN` update karein:
```
CORS_ORIGIN = https://your-domain.vercel.app
```

Railway automatically redeploy hoga.

---

## 🧪 Step 5: Testing

### Local Testing (sabse pehle):
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
npm install
npm run dev
```

Test karein:
- [ ] Frontend load hota hai
- [ ] API calls work kar rahe hain
- [ ] Notifications subscribe ho rahe hain

### Production Testing:
1. Vercel URL open karein
2. Browser console check karein - errors na hon
3. Backend API calls work kar rahe hon check karein
4. Network tab mein API calls deko

---

## 📱 Common Issues & Solutions

### Issue 1: "CORS error"
**Solution**: Railway dashboard mein CORS_ORIGIN check karein - Vercel URL exactly match karna chahiye

### Issue 2: "Cannot find module 'dotenv'"
**Solution**: 
```bash
cd backend
npm install dotenv
```

### Issue 3: "Build fails on Vercel"
**Solution**: 
```bash
# Local mein build test karein
npm run build

# Agar fail ho to check karein:
# - All imports correct hain
# - Environment variables define hain
```

### Issue 4: "Database errors on production"
**Solution**: Railway mein `/tmp` directory use karein (persistent storage ke liye)
```javascript
// backend/server.js mein
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'panchayat.db');
```

### Issue 5: "Notifications not working"
**Solution**:
- VAPID keys dono platforms mein same hone chahiye
- Public key frontend mein chahiye
- Private key backend mein chahiye

---

## 🔐 Security Checklist

- [ ] VAPID keys safe rakhe hain (GitHub mein commit na karein)
- [ ] `.env` file `.gitignore` mein hai
- [ ] Production mein `NODE_ENV=production` set hai
- [ ] CORS_ORIGIN exact production URL hai
- [ ] Admin password strong hai
- [ ] HTTPS use ho raha hai (Vercel/Railway automatically provide karte hain)

---

## 📊 Monitoring

### Railway mein:
- Dashboard → **Logs** tab check karein
- Real-time error/success logs dekh sakte ho

### Vercel mein:
- Dashboard → **Deployments** tab
- **Logs** section mein build/runtime errors dekh sakte ho

---

## 🚀 Live Updates / Redeployment

### Naya code push karna ho:
```bash
git add .
git commit -m "Your message"
git push origin main
```

Railway aur Vercel automatically redeploy kar denge (GitHub integration se).

---

## 📞 Environment Variables Reference

| Variable | Railway | Vercel | Example |
|----------|---------|--------|---------|
| PORT | ✓ | - | 5000 |
| NODE_ENV | ✓ | - | production |
| CORS_ORIGIN | ✓ | - | https://xyz.vercel.app |
| VAPID_PUBLIC_KEY | ✓ | (frontend ko chahiye) | abc... |
| VAPID_PRIVATE_KEY | ✓ | - | xyz... |
| VITE_API_URL | - | ✓ | https://railway-url.app |

---

## ✅ Final Checklist

- [ ] GitHub repo setup
- [ ] VAPID keys generated
- [ ] Railway account created
- [ ] Vercel account created
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS properly setup
- [ ] Production testing done
- [ ] Monitoring setup

---

Agar kisi step mein problem ho to mujhe batao! 🎯
