# 📋 Environment Variables Reference

Copy-paste ready environment variables files के लिए examples.

---

## 🖥️ Frontend Environment (.env.production)

Vercel मे set करो या `.env.production` file में:

```bash
# Production API URL (Railway backend URL)
VITE_API_URL=https://your-railway-app-abc123.railway.app

# Optional: Debug mode
VITE_DEBUG=false

# Optional: App name
VITE_APP_NAME=Pathariya Panchayat

# Optional: Log level (error, warn, info, debug)
VITE_LOG_LEVEL=error
```

---

## 🚂 Backend Environment (Railway)

Railway Dashboard → Variables में add करो:

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration (Update with your Vercel URL)
CORS_ORIGIN=https://your-vercel-domain.vercel.app

# Web Push Notifications
VAPID_PUBLIC_KEY=BCk3xY...  # Copy from vapid-keys.json
VAPID_PRIVATE_KEY=aB2x...   # Copy from vapid-keys.json
VAPID_SUBJECT=mailto:admin@panchayat.local

# Admin Configuration
ADMIN_PASSWORD=YourSecurePassword@2024

# Optional: Database
DATABASE_URL=sqlite:./panchayat.db
```

---

## 🔄 Development Environment (Local)

### Frontend (.env.local)

```bash
# For local development
VITE_API_URL=http://localhost:5000
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

### Backend (backend/.env)

```bash
# Local development
PORT=5000
NODE_ENV=development
ADMIN_PASSWORD=admin123

# Web Push (generated in backend/vapid-keys.json)
VAPID_PUBLIC_KEY=<from-vapid-keys.json>
VAPID_PRIVATE_KEY=<from-vapid-keys.json>
VAPID_SUBJECT=mailto:admin@panchayat.local

# No CORS restriction for local development
CORS_ORIGIN=*
```

---

## 🔐 Getting VAPID Keys

```bash
cd backend

# Generate keys (one-time)
node -e "
const webpush = require('web-push');
const fs = require('fs');
const keys = webpush.generateVAPIDKeys();
fs.writeFileSync('vapid-keys.json', JSON.stringify(keys, null, 2));
console.log(JSON.stringify(keys, null, 2));
"
```

Output example:
```json
{
  "publicKey": "BCk3x...longstring...==",
  "privateKey": "aB2x...longstring...=="
}
```

---

## 📝 Environment Variables by Platform

### Vercel (.env.production)
```
VITE_API_URL = https://your-railway-url.railway.app
```

### Railway Variables
```
PORT = 5000
NODE_ENV = production
CORS_ORIGIN = https://your-vercel-url.vercel.app
VAPID_PUBLIC_KEY = BCk3x...
VAPID_PRIVATE_KEY = aB2x...
VAPID_SUBJECT = mailto:admin@panchayat.local
ADMIN_PASSWORD = SecurePassword@2024
```

### Local Development
```
VITE_API_URL = http://localhost:5000 (frontend)
PORT = 5000 (backend)
NODE_ENV = development
```

---

## 🎯 Quick Copy-Paste Templates

### Template 1: Railway Variables
```
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://REPLACE_WITH_VERCEL_URL.vercel.app
VAPID_PUBLIC_KEY=REPLACE_WITH_PUBLIC_KEY
VAPID_PRIVATE_KEY=REPLACE_WITH_PRIVATE_KEY
VAPID_SUBJECT=mailto:admin@panchayat.local
ADMIN_PASSWORD=REPLACE_WITH_STRONG_PASSWORD
```

### Template 2: Vercel Variables
```
VITE_API_URL=https://REPLACE_WITH_RAILWAY_URL.railway.app
```

### Template 3: Local Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000
VITE_DEBUG=true
```

### Template 4: Local Backend (backend/.env)
```
PORT=5000
NODE_ENV=development
ADMIN_PASSWORD=admin123
VAPID_PUBLIC_KEY=REPLACE_WITH_PUBLIC_KEY
VAPID_PRIVATE_KEY=REPLACE_WITH_PRIVATE_KEY
VAPID_SUBJECT=mailto:admin@panchayat.local
CORS_ORIGIN=*
```

---

## 🔄 How to Set Variables

### On Vercel
1. Project Dashboard → Settings
2. Environment Variables
3. Add Name and Value
4. Redeploy required

### On Railway
1. Railway App Dashboard
2. Variables tab
3. Add Key and Value
4. Auto-redeploys

### Locally
Create files:
- `.env.local` (frontend)
- `backend/.env` (backend)

---

## ⚠️ Important Notes

1. **Never commit** `.env` files to GitHub
2. **Use strong passwords** (12+ chars, mixed case, numbers, symbols)
3. **Store VAPID keys safely** (password manager)
4. **URLs must match exactly** (for CORS to work)
5. **HTTPS URLs in production** (http:// won't work on HTTPS sites)

---

## ✅ Verification

After setting environment variables:

```javascript
// Browser console (frontend)
console.log(import.meta.env.VITE_API_URL)
// Should show: https://your-railway-app.railway.app

// Check API connectivity
fetch(import.meta.env.VITE_API_URL + '/health')
  .then(r => r.json())
  .then(console.log)
```

---

## 📊 Reference Table

| Env | Variable | Frontend | Backend | Example |
|-----|----------|----------|---------|---------|
| Production | VITE_API_URL | ✅ | ❌ | https://app.railway.app |
| Production | CORS_ORIGIN | ❌ | ✅ | https://app.vercel.app |
| Production | PORT | ❌ | ✅ | 5000 |
| Production | NODE_ENV | ❌ | ✅ | production |
| Production | VAPID_PUBLIC_KEY | ❌ | ✅ | BCk3x... |
| Production | VAPID_PRIVATE_KEY | ❌ | ✅ | aB2x... |
| Dev | VITE_API_URL | ✅ | ❌ | http://localhost:5000 |
| Dev | CORS_ORIGIN | ❌ | ✅ | * |

---

## 🚀 Deployment Checklist

- [ ] VAPID keys generated (backend/vapid-keys.json)
- [ ] VAPID keys saved in password manager
- [ ] Railway variables set (all 7 variables)
- [ ] Vercel variables set (VITE_API_URL)
- [ ] URLs copied correctly (no typos)
- [ ] CORS_ORIGIN matches Vercel URL exactly
- [ ] Deployed and tested

---

## 🆘 Troubleshooting

### "VITE_API_URL is undefined"
→ Check Vercel environment variables section
→ Redeploy after adding variable

### "CORS error"
→ Check Railway CORS_ORIGIN exactly matches Vercel URL
→ Must include https://
→ No trailing slash

### "Can't connect to backend"
→ Check Railway app is running
→ Check Vercel is loading
→ Check network tab for 404/500 errors

---

**Last Updated**: May 2026
**Status**: Ready for use ✅
