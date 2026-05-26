# 🔧 Vercel + Railway Integration - Complete Setup Guide

## 📌 What Was Fixed

Your API connection issue was due to these problems:

1. ✅ **Backend not listening on all interfaces** - Railway needs `0.0.0.0`
2. ✅ **CORS not configured for Vercel domain** - Fixed to accept Vercel URLs
3. ✅ **Missing preflight handler** - Added OPTIONS method support
4. ✅ **Insufficient error messages** - Enhanced health check & error responses
5. ✅ **No request logging** - Added debugging middleware
6. ✅ **Environment variable documentation** - Clarified setup process

---

## ⚡ QUICK FIX - What You Need to Do NOW

### Step 1: Get Your Backend URL from Railway
1. Open Railway Dashboard (railway.app)
2. Select your Panchayat project
3. Go to **Settings** → **Domain**
4. Copy the URL (format: `https://your-project.railway.app`)

### Step 2: Configure Vercel Environment Variable
1. Open Vercel Dashboard (vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Look for `VITE_API_URL`
   - If it exists: UPDATE it
   - If missing: CREATE it

**Set the value to:**
```
https://your-railway-project.railway.app
```
(Replace with your actual Railway domain from Step 1)

### Step 3: Configure Railway Environment Variable
1. Go back to Railway Dashboard
2. Go to **Variables**
3. Find `CORS_ORIGIN`
   - Update it to your Vercel domain:
```
https://your-project.vercel.app
```

### Step 4: Trigger Redeployment
1. **Railway**: Go to **Deployments** → Click "Redeploy"
2. **Vercel**: Go to **Deployments** → Click "Redeploy"
3. Wait 2-3 minutes for both to complete

### Step 5: Test
1. Open your Vercel frontend URL
2. Try submitting a form
3. Should work without "Server connection problem" ✅

---

## 🔍 What Changed in Code

### Backend (`backend/server.js`)

**BEFORE:**
```javascript
app.listen(PORT, () => {  // Only localhost
  console.log(`Server running on localhost:${PORT}`);
});
```

**AFTER:**
```javascript
app.listen(PORT, '0.0.0.0', () => {  // All interfaces
  console.log(`Server running on 0.0.0.0:${PORT}`);
});
```

### CORS Configuration

**BEFORE:**
```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  // Static, didn't handle dynamic Vercel domains
};
```

**AFTER:**
```javascript
const corsOptions = {
  origin: function(origin, callback) {
    // Dynamically accepts:
    // - Localhost (dev)
    // - Vercel domains
    // - Railway domains
    // - Environment variable CORS_ORIGIN
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
};
```

### Error Handling

**BEFORE:**
```javascript
res.status(500).json({ error: error.message });  // Minimal info
```

**AFTER:**
```javascript
res.status(500).json({
  error: 'सर्वर से जुड़ने में समस्या हुई।',
  details: error.message,
  timestamp: new Date().toISOString()
});
```

### Health Check Endpoint

**ENHANCED** - Visit: `https://your-backend.railway.app/api/health`

Now returns:
```json
{
  "status": "OK",
  "server": {
    "port": 5000,
    "node_env": "production",
    "uptime": 1234.56
  },
  "cors": {
    "origin_received": "https://your-vercel-domain.vercel.app",
    "cors_enabled": true
  },
  "database": {
    "exists": true
  },
  "vapid": {
    "configured": true
  }
}
```

---

## 🌐 Environment Variables Checklist

### Railway Backend

**Variables to set in Railway Dashboard → Variables:**

- [ ] `PORT` = `5000`
- [ ] `NODE_ENV` = `production`
- [ ] `ADMIN_PASSWORD` = `your_secure_password`
- [ ] `CORS_ORIGIN` = `https://your-vercel-app.vercel.app`
- [ ] `VAPID_SUBJECT` = `mailto:admin@panchayat.local`
- [ ] `VAPID_PUBLIC_KEY` = (from previous setup)
- [ ] `VAPID_PRIVATE_KEY` = (from previous setup)

### Vercel Frontend

**Variables to set in Vercel Dashboard → Settings → Environment Variables:**

- [ ] `VITE_API_URL` = `https://your-railway-project.railway.app`

---

## 🧪 Testing the Integration

### Test 1: API Health Check
```
GET https://your-railway-backend.railway.app/api/health
```
Should return 200 with detailed status.

### Test 2: CORS Preflight
```bash
curl -X OPTIONS https://your-railway-backend.railway.app/api/applications \
  -H "Origin: https://your-vercel-app.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```
Should return 200 with CORS headers.

### Test 3: Form Submission from Frontend
1. Open Vercel frontend
2. Go to "आवेदन" or "सुझाव" form
3. Fill and submit
4. Should see success message without errors

### Test 4: Check Server Logs
**Railway Logs:**
- Go to **Logs** tab
- You should see:
  ```
  [timestamp] POST /api/applications - Origin: https://your-vercel-app.vercel.app
  ✅ Application submitted: PJ-XXXXXX (aavedan)
  ```

---

## 🚨 Troubleshooting

### "Failed to fetch" error
**Cause**: Backend URL incorrect or CORS not configured

**Fix**:
1. Check `VITE_API_URL` in Vercel is correct
2. Check `CORS_ORIGIN` in Railway is correct
3. Run health check endpoint

### CORS error in browser console
**Cause**: Frontend domain not in CORS_ORIGIN

**Fix**:
1. Copy exact Vercel domain (including https://)
2. Update CORS_ORIGIN in Railway to match
3. Redeploy Railway

### Database errors
**Cause**: SQLite database issues

**Fix**:
- Check Railway logs for errors
- Database auto-creates on first request
- If persistent, contact support

### Notification permission not showing
**Cause**: HTTPS required for Service Workers

**Fix**:
- Vercel provides HTTPS automatically
- Railway provides HTTPS automatically
- No action needed - should work

---

## 📋 Auto-Redeployment Workflow

1. You make changes locally
2. `git push` to GitHub `main` branch
3. GitHub webhook triggers Railway
4. GitHub webhook triggers Vercel
5. Both auto-build and deploy
6. No manual steps needed!

**Deployment time**: 2-3 minutes total

---

## 💡 Key Improvements Made

| Issue | Before | After |
|-------|--------|-------|
| **Server Listening** | localhost only | 0.0.0.0 (all interfaces) |
| **CORS Handling** | Static origin | Dynamic + multiple domains |
| **Preflight Support** | Missing | Fully supported |
| **Error Messages** | Minimal | Detailed + timestamp |
| **Debugging** | No logs | Request logging middleware |
| **Health Check** | Basic | Detailed diagnostic info |
| **Production Ready** | No | Yes ✅ |

---

## 🎯 Next Steps

1. ✅ Get your Railway backend URL
2. ✅ Set VITE_API_URL in Vercel
3. ✅ Set CORS_ORIGIN in Railway
4. ✅ Redeploy both services
5. ✅ Test from frontend
6. ✅ Celebrate! 🎉

**Your portal should now work seamlessly between Vercel and Railway!**
