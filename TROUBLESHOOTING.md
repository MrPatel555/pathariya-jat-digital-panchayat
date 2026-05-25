# 🚨 Troubleshooting Guide

## Quick Fixes (सबसे common issues)

### Issue 1: Server Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Fix:**
```bash
# Windows PowerShell
netstat -ano | findstr :5000
# Copy the PID number and run:
taskkill /PID <PID_NUMBER> /F

# Then restart:
npm start
```

---

### Issue 2: CORS Error (Frontend can't connect to backend)

**Error in Browser Console:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Causes:**
- Backend server not running
- Wrong API URL
- Firewall blocking

**Fix:**
```bash
# 1. Check if backend is running
curl http://localhost:5000/api/health

# 2. Check if frontend API URL is correct
# In subscriptionManager.js, API_URL should be 'http://localhost:5000'

# 3. If still not working, restart both:
# Terminal 1 (Backend):
cd backend && npm start

# Terminal 2 (Frontend):
npm run dev
```

---

### Issue 3: Service Worker Not Registering

**Error:**
```
❌ Service Worker registration failed: NotSupportedError
```

**Causes:**
- Using non-HTTPS (but localhost OK)
- Browser doesn't support Service Workers
- Scope issue

**Fix:**
```javascript
// Check in browser console:
if ('serviceWorker' in navigator) {
  console.log('✅ Service Workers supported');
} else {
  console.log('❌ Service Workers NOT supported');
}

// Check browser:
// Chrome/Edge: Should work on localhost
// Firefox: Should work on localhost
// Safari: Limited support
```

---

### Issue 4: Notification Permission Not Showing

**Problem:**
```
PermissionModal दिख रहा है लेकिन permission prompt नहीं आ रहा
```

**Causes:**
- Browser already denied permission
- Browser extension blocking
- Localhost issue

**Fix:**
```bash
# 1. Clear browser data:
# Chrome/Edge: Settings → Privacy → Clear browsing data

# 2. Reset notification permissions:
# Chrome: chrome://settings/content/notifications
# Edge: edge://settings/content/notifications
# Delete the entry for localhost

# 3. Restart browser and try again

# 4. Check browser console for errors:
# F12 → Console tab
```

---

### Issue 5: Database Lock Error

**Error:**
```
Error: database is locked
```

**Causes:**
- Multiple processes accessing DB
- DB file corruption
- Disk full

**Fix:**
```bash
# 1. Stop all servers
# 2. Delete old database:
rm backend/panchayat.db

# 3. Restart backend:
npm start

# New database will be created automatically
```

---

### Issue 6: Notifications Not Sending

**Problem:**
```
API says "success" लेकिन notification नहीं मिल रहे
```

**Causes:**
- User hasn't granted permission
- Service Worker not registered
- Localhost vs live domain issue
- Browser notifications turned off in OS

**Fix:**
```javascript
// Check permission status:
Notification.permission
// Should return: "granted"

// Check Service Worker:
navigator.serviceWorker.getRegistrations()
// Should return array with 1 item

// Check in Settings:
// Android: Settings → Apps → Notifications
// iOS: Settings → Notifications
// Windows: Settings → System → Notifications
```

---

### Issue 7: Wrong Admin Password Error

**Error:**
```
{
  "error": "Unauthorized"
}
```

**Fix:**
```bash
# 1. Check default password:
# It's: admin123

# 2. To change password:
# Edit backend/.env file:
ADMIN_PASSWORD=your_new_password

# 3. Restart backend:
npm start
```

---

### Issue 8: Node Modules Installation Failed

**Error:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Fix:**
```bash
# 1. Delete node_modules:
rm -r backend/node_modules

# 2. Delete package-lock.json:
rm backend/package-lock.json

# 3. Clear npm cache:
npm cache clean --force

# 4. Try install again:
cd backend && npm install
```

---

## Advanced Debugging

### Enable Detailed Logging

**Backend:**
```bash
# Add this to backend/server.js before routes:
import morgan from 'morgan';
app.use(morgan('dev')); // Detailed request logging

npm install morgan
```

**Frontend:**
```javascript
// Add to subscriptionManager.js
const DEBUG = true;

if (DEBUG) {
  console.log('🔍 [DEBUG]', message);
}
```

### Check Service Worker Installation

```javascript
// Run in browser console:
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Registered Service Workers:', registrations);
  registrations.forEach(reg => {
    console.log('Scope:', reg.scope);
    console.log('Active:', reg.active);
    console.log('Installing:', reg.installing);
  });
});
```

### Check Notification Permission

```javascript
// Run in browser console:
console.log('Notification permission:', Notification.permission);
// Should output: granted, denied, or default
```

### Database Inspection

```bash
# Check database tables:
sqlite3 backend/panchayat.db

# Inside sqlite3:
.tables
SELECT COUNT(*) FROM subscriptions;
SELECT * FROM subscriptions LIMIT 10;
SELECT * FROM notifications_sent ORDER BY sent_at DESC LIMIT 5;
```

---

## Performance Issues

### If Server is Slow

```bash
# 1. Check CPU usage:
tasklist | findstr node

# 2. Check memory:
Get-Process node | Format-Table WS

# 3. Restart if too high:
npm start
```

### If Frontend is Slow

```javascript
// Add performance monitoring:
console.time('subscriptionManager');
await subscriptionManager.subscribeToPush();
console.timeEnd('subscriptionManager');
```

---

## Browser-Specific Issues

### Chrome/Edge
```
- Works: Service Workers ✅
- Works: Push Notifications ✅
- Works: Localhost ✅
- Need: HTTPS for production
```

### Firefox
```
- Works: Service Workers ✅
- Works: Push Notifications ✅
- Works: Localhost ✅
- Note: May need permissions.delegation.enabled = true
```

### Safari
```
- Limited: Service Workers (iOS)
- Limited: Push Notifications
- Workaround: Use Progressive Web App
```

---

## Network Issues

### API Timeout

```javascript
// Increase timeout in subscriptionManager:
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s

fetch(url, { signal: controller.signal });
```

### Slow Network

```javascript
// Add retry logic:
const retry = async (fn, retries = 3) => {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000));
      return retry(fn, retries - 1);
    }
    throw err;
  }
};
```

---

## Database Issues

### Corrupted Database

```bash
# Backup old database:
mv backend/panchayat.db backend/panchayat.db.backup

# Create new:
npm start
# Server will create new database

# If needed, restore backup:
mv backend/panchayat.db.backup backend/panchayat.db
```

### Foreign Key Constraint Error

```bash
# This shouldn't happen, but if it does:
# 1. Delete database
# 2. Restart server
# Tables will be recreated
```

---

## Getting Help

### 1. Check Logs First
```bash
# Backend logs show exactly what's happening
npm start
# Watch the console output
```

### 2. Check Browser Console
```
Press F12 → Console tab
Look for red error messages
```

### 3. Test API Directly
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/subscriptions-count
```

### 4. Check Files Exist
```bash
# Check all critical files:
ls -la src/utils/subscriptionManager.js
ls -la public/sw.js
ls -la backend/server.js
ls -la backend/panchayat.db
```

---

## Quick Checklist

- [ ] Node.js installed? (`node -v`)
- [ ] npm updated? (`npm -v`)
- [ ] Dependencies installed? (`npm install`)
- [ ] Backend dependencies installed? (`cd backend && npm install`)
- [ ] Port 5000 free? (`netstat -ano | findstr :5000`)
- [ ] Backend running? (`npm run server`)
- [ ] Frontend running? (`npm run dev`)
- [ ] Can reach API? (`curl http://localhost:5000/api/health`)
- [ ] Service Worker file exists? (`public/sw.js`)
- [ ] subscriptionManager file exists? (`src/utils/subscriptionManager.js`)

---

## Still Stuck?

1. **Check SYSTEM_ARCHITECTURE.md** - Understand the system
2. **Check API_TESTING_GUIDE.md** - Test each API endpoint
3. **Check backend/README.md** - Backend documentation
4. **Check NOTIFICATION_SETUP.md** - Step-by-step setup

---

Last Updated: May 9, 2024
