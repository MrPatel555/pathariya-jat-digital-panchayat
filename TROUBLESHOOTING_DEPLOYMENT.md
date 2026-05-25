# 🆘 Troubleshooting Guide

Deployment ke doran jo common issues aate hain aur unke solutions.

---

## 🔴 Critical Issues

### ❌ "Cannot connect to backend"

**Symptoms**: 
- Network error in browser console
- API calls failing
- "Failed to fetch" error

**Solutions**:

1. **Check if Railway app is running**
   - Railway Dashboard → Deployments
   - Status: `Running` hona chahiye
   - Agar `Failed` hai → Logs check karo

2. **Check API URL**
   ```javascript
   // Browser console mein:
   console.log(import.meta.env.VITE_API_URL)
   ```
   Should show Railway URL, not localhost

3. **Check CORS**
   - Railway Dashboard → Variables
   - `CORS_ORIGIN` exact match karo Vercel URL se
   - ✅ Correct: `https://myapp.vercel.app`
   - ❌ Wrong: `myapp.vercel.app` (no https)

4. **Restart Railway app**
   - Railway Dashboard → Settings
   - "Redeploy" button
   - Wait for deployment complete

---

### ❌ "CORS error"

**Error message**:
```
Access to XMLHttpRequest at 'https://...' from origin 'https://...' 
has been blocked by CORS policy
```

**Solutions**:

1. **Check CORS_ORIGIN in Railway**
   ```
   Exact match karna chahiye:
   - Frontend: https://xyz.vercel.app
   - CORS_ORIGIN: https://xyz.vercel.app (bilkul same)
   ```

2. **Verify backend has CORS enabled**
   - Check [backend/server.js](backend/server.js#L40) line ~40
   - Should have CORS middleware configured

3. **Test with curl**
   ```bash
   curl -X GET https://your-railway-app.railway.app/health \
     -H "Origin: https://your-domain.vercel.app"
   ```

4. **Railway variables update**
   ```
   NODE_ENV = production
   CORS_ORIGIN = https://your-vercel-domain.vercel.app
   ```
   Then redeploy

---

### ❌ "Build failed on Vercel"

**Symptoms**:
- Red X on Vercel dashboard
- "Build failed" status
- Can't access site

**Solutions**:

1. **Check Vercel logs**
   - Vercel Dashboard → Deployments → Failed build → View logs
   - Look for error messages

2. **Common build errors**

   **Missing dependencies:**
   ```bash
   # Local mein test karo
   npm install
   npm run build
   
   # Check console for errors
   ```

   **Environment variable missing:**
   - Vercel → Settings → Environment Variables
   - Ensure `VITE_API_URL` is set

   **Import errors:**
   - Check all import paths correct hain
   - No relative path issues

3. **Rebuild locally**
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   npm run preview
   ```

4. **If still failing**
   ```bash
   git push (trigger new Vercel build)
   ```

---

### ❌ "Database errors"

**Error**: 
```
Cannot find module 'sqlite3'
Error: database disk image is malformed
```

**Solutions**:

1. **Install sqlite3 in backend**
   ```bash
   cd backend
   npm install sqlite3
   npm install
   ```

2. **Check database file**
   ```bash
   # Local mein check karo
   ls -la backend/panchayat.db
   
   # File exist karna chahiye
   ```

3. **Reset database**
   ```bash
   # Local mein
   rm backend/panchayat.db
   npm run server
   # New database create hoga
   ```

4. **Railway mein**
   - Railway provides `/tmp` directory (temporary)
   - Production mein PostgreSQL recommend karte hain
   - SQLite file-based, so persistent storage needed

---

## 🟡 Common Issues

### ⚠️ "Environment variables not loading"

**Symptoms**: 
- API URL showing localhost
- VAPID keys not found
- Settings not applying

**Solutions**:

1. **Check .env file**
   ```bash
   # Frontend
   cat .env.production
   
   # Backend
   cat backend/.env
   ```

2. **Recreate .env from .env.example**
   ```bash
   # Frontend
   cp .env.example .env.production
   # Edit .env.production with actual values
   
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with actual values
   ```

3. **Restart development server**
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```

4. **For production (Vercel/Railway)**
   - Vercel Dashboard → Environment Variables
   - Railway Dashboard → Variables
   - Check values are set correctly

---

### ⚠️ "Notifications not working"

**Symptoms**:
- Can't subscribe
- No notifications received
- Service worker error

**Solutions**:

1. **Check VAPID keys**
   ```bash
   # Backend
   cat backend/vapid-keys.json
   
   # Should show public and private keys
   ```

2. **Verify keys in environments**
   - Railway mein दोनों keys set होने चाहिए
   - Frontend को public key की जरूरत है

3. **Service Worker issue**
   - Browser DevTools → Application → Service Workers
   - Should be registered
   - If not: Check console errors

4. **Browser permissions**
   - Browser notification permission allow करना चाहिए
   - Check browser settings

5. **Test locally first**
   ```bash
   npm run dev
   npm run server
   # Test subscribe karo
   ```

---

### ⚠️ "Slow performance / Timeouts"

**Solutions**:

1. **Check Railway logs**
   - Look for slow queries
   - Memory usage check karo

2. **Check Vercel build time**
   - Should be < 60 seconds
   - Agar ज्यादा हो तो optimize करो

3. **Optimize build**
   - Remove unused dependencies
   - Code split करो
   - Images optimize करो

4. **Database optimization**
   - Indexes add करो
   - Query optimize करो
   - Connection pooling use करो

---

### ⚠️ "502 Bad Gateway"

**Symptoms**:
- Railway URL open करने पर blank page
- Network error

**Solutions**:

1. **Check Railway app status**
   - Railway Dashboard → Deployment status
   - Logs check करो

2. **Check server.js**
   - PORT 5000 set है?
   - Server listening on PORT?

3. **Restart Railway app**
   - Railway Dashboard → Redeploy

4. **Check logs**
   ```bash
   # Railway Logs
   - Look for crash messages
   - Check for memory issues
   ```

---

### ⚠️ "Static files not loading (CSS, images)"

**Symptoms**:
- Page loads but styled नहीं है
- Images दिख नहीं रहे
- 404 errors for static files

**Solutions**:

1. **Check Vercel build output**
   - dist/ folder exists?
   - Files में है?

2. **Check vite.config.js**
   ```javascript
   // Check public path
   build: {
     outDir: 'dist',
     // ...
   }
   ```

3. **Rebuild locally**
   ```bash
   npm run build
   npm run preview
   # Check if assets load
   ```

4. **Check imports**
   - Relative paths correct हैं?
   - asset paths सही हैं?

---

## 🟢 Verification Steps

### ✅ After deployment, verify:

1. **Frontend loads**
   ```
   Vercel URL open करो
   → Content visible है
   → No console errors
   ```

2. **API connectivity**
   ```javascript
   // Browser console:
   fetch(import.meta.env.VITE_API_URL + '/health')
     .then(r => r.json())
     .then(d => console.log('✅ API OK', d))
   ```

3. **Network tab**
   - F12 → Network tab
   - API calls show हो रहे हैं?
   - Status codes 200 हैं?

4. **No critical errors**
   - F12 → Console tab
   - कोई red errors नहीं?
   - Warnings ignore कर सकते हो

---

## 🔧 Debugging Commands

### Local Testing
```bash
# Frontend
npm run dev          # Run dev server
npm run build        # Test build
npm run preview      # Preview build

# Backend
npm run server       # Run backend
npm run dev          # Run with nodemon
```

### Check Logs
```bash
# Frontend build
npm run build 2>&1 | tee build.log

# Backend errors
npm run server 2>&1 | tee server.log
```

### Inspect Environment
```bash
# Check NODE_ENV
echo $NODE_ENV

# Check API URL
echo $VITE_API_URL

# List environment vars
env | grep VITE
env | grep VAPID
```

---

## 📊 Monitoring

### Daily Checks
- [ ] Visit production URL - loads properly?
- [ ] Check Railway logs - any errors?
- [ ] Check Vercel logs - any errors?
- [ ] Test API endpoints - responding?

### Weekly Checks
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Test all features
- [ ] Backup database

### Monthly Checks
- [ ] Security audit
- [ ] Dependency updates
- [ ] Performance optimization
- [ ] Rotate credentials

---

## 📞 Getting More Help

### Check Documentation
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs/)
- [Express.js Docs](https://expressjs.com/)
- [Vite Docs](https://vitejs.dev/)

### GitHub Issues
- Railway: https://github.com/railwayapp/
- Vercel: https://github.com/vercel/

### Error Code Reference
- **400**: Bad Request - Check request format
- **401**: Unauthorized - Check credentials
- **403**: Forbidden - Check permissions
- **404**: Not Found - Check URL
- **500**: Server Error - Check server logs
- **502**: Bad Gateway - Check backend status
- **503**: Service Unavailable - Check service status

---

## 📝 Template - Error Report

Jab issue report करो:

```
### Environment
- Platform: [Railway / Vercel]
- URL: [production-url]
- Browser: [Chrome/Firefox/etc]

### Error
- Error message: [exact message]
- Screenshot: [if applicable]

### Steps to reproduce
1. [step 1]
2. [step 2]
3. [step 3]

### Expected behavior
[what should happen]

### Actual behavior
[what is happening]

### Logs
[relevant logs]
```

---

**Last Updated**: May 2026
**Contributors**: Team
