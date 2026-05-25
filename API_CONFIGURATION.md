# API Configuration Guide

## 🔌 Frontend mein API URL Configure Karna

Apke React components mein API calls ke liye ek central configuration file banain.

### Option 1: Create `src/config/api.js`

```javascript
// src/config/api.js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Subscriptions
  SUBSCRIBE: `${API_URL}/subscribe`,
  UNSUBSCRIBE: `${API_URL}/unsubscribe`,
  GET_SUBSCRIPTIONS: `${API_URL}/subscriptions`,
  
  // Notifications
  SEND_NOTIFICATION: `${API_URL}/send-notification`,
  GET_NOTIFICATIONS: `${API_URL}/notifications`,
  
  // Events
  GET_EVENTS: `${API_URL}/events`,
  CREATE_EVENT: `${API_URL}/events`,
  
  // Other endpoints
  HEALTH: `${API_URL}/health`
};
```

### Option 2: Use in Components

```javascript
// Component mein use karo
import { API_ENDPOINTS } from '../config/api';

// Example: Subscribe to notifications
const response = await fetch(API_ENDPOINTS.SUBSCRIBE, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(subscriptionData)
});
```

### Option 3: Create API Service Class

```javascript
// src/services/ApiService.js
class ApiService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  subscribe(data) {
    return this.request('/subscribe', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  sendNotification(data) {
    return this.request('/send-notification', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

export default new ApiService();
```

### Option 4: Environment Specific

Create multiple `.env` files:

```
.env.local          # For local development
.env.production     # For production (Vercel)
```

**Example .env.production:**
```
VITE_API_URL=https://your-railway-app-abc123.railway.app
VITE_APP_NAME=Pathariya Panchayat
VITE_LOG_LEVEL=error
```

### Option 5: Global Configuration

`src/main.jsx` mein:

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Set global API URL
window.API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Log for debugging
console.log('🔗 API Base URL:', window.API_BASE_URL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

Phir components mein use karo:
```javascript
const response = await fetch(`${window.API_BASE_URL}/subscribe`, {...})
```

---

## 🔑 Environment Variables

### Development (.env.local)
```
VITE_API_URL=http://localhost:5000
VITE_DEBUG=true
```

### Production (.env.production)
```
VITE_API_URL=https://your-railway-app-abc123.railway.app
VITE_DEBUG=false
```

### Testing (.env.test)
```
VITE_API_URL=https://test-api.railway.app
VITE_DEBUG=true
```

---

## ✅ Verification

Vercel deploy ke baad check karo:

1. **Browser Console** mein check karo:
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   // Should show: https://your-railway-app-abc123.railway.app
   ```

2. **Network Tab** mein dekho - API calls ja rahe hain Railway par

3. **Response** check karo - 200 status code hona chahiye

---

## 🐛 Common Issues

### Issue: API_URL undefined hai
**Solution**: `.env.production` check karein, Vercel mein environment variable set karein

### Issue: CORS error aa raha hai
**Solution**: Railway ke CORS_ORIGIN mein apna Vercel URL exact match karo

### Issue: localhost ke baad bhi localhost:5000 hit ho raha hai
**Solution**: Build karke dist folder check karein - hardcoded localhost values ho sakte hain

---

## 🚀 Step-by-step Update Process

1. **Backend URL se Railway URL generate karein**
2. **Vercel mein `VITE_API_URL` environment variable set karein**
3. **Local mein `.env.production` file mein update karein**
4. **Components mein API calls update karein**
5. **Locally test karein**: `npm run build && npm run preview`
6. **Push to GitHub** → Vercel auto-redeploy
7. **Check Vercel logs** - API calls proper URL par ja rahe hon
