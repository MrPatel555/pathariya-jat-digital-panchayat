# Panchayat Notification System - Backend Server

यह एक Node.js/Express server है जो सभी users को push notifications भेजता है।

## Setup Instructions (सेटअप करने के लिए)

### 1. Backend Dependencies Install करें

```bash
cd backend
npm install
```

यह command सभी जरूरी packages install करेगा:
- `express` - Web server
- `cors` - Cross-origin requests
- `better-sqlite3` - Database
- `web-push` - Push notifications

### 2. Environment Variables Set करें

`backend/.env` फाइल बनाएं और copy करें:

```bash
cp .env.example .env
```

फिर `backend/.env` को edit करें:

```
PORT=5000
ADMIN_PASSWORD=admin123
```

### 3. Server को Run करें

**Option 1: Direct (सीधे)**
```bash
cd backend
npm start
```

**Option 2: Development Mode (nodemon के साथ - auto reload)**
```bash
cd backend
npm run dev
```

**Option 3: Root directory से**
```bash
npm run server
```

### सफल होने पर Output:
```
✅ Panchayat Notification Server running on http://localhost:5000
📊 Database: C:\...\backend\panchayat.db
```

## API Endpoints

### 1. नोटिफिकेशन के लिए Subscribe करें
**POST** `/api/subscribe`

Body:
```json
{
  "subscription": {
    "endpoint": "https://...",
    "keys": {
      "auth": "...",
      "p256dh": "..."
    }
  },
  "deviceName": "My Phone"
}
```

Response:
```json
{
  "success": true,
  "subscriptionId": "abc123...",
  "message": "Successfully subscribed to notifications"
}
```

### 2. कुल Active Subscribers की संख्या
**GET** `/api/subscriptions-count`

Response:
```json
{
  "count": 25
}
```

### 3. सभी Subscriptions देखें (Admin)
**GET** `/api/subscriptions`

Response:
```json
{
  "subscriptions": [
    {
      "id": "abc123",
      "device_name": "Desktop",
      "browser_name": "Chrome",
      "subscribed_at": "2024-05-09T10:30:00"
    }
  ]
}
```

### 4. सभी को Notification भेजें (Admin Only)
**POST** `/api/send-notification`

Body:
```json
{
  "title": "नई योजना",
  "message": "पंचायत की नई योजना शुरू हो गई",
  "imageUrl": "https://...",
  "adminPassword": "admin123"
}
```

Response:
```json
{
  "success": true,
  "notificationId": "notif123",
  "message": "Notification sent successfully",
  "sent": 25,
  "failed": 0,
  "total": 25
}
```

### 5. Notification History देखें
**GET** `/api/notifications`

Response:
```json
{
  "notifications": [
    {
      "id": "notif123",
      "title": "नई योजना",
      "message": "पंचायत की नई योजना शुरू हो गई",
      "sent_at": "2024-05-09T10:30:00",
      "total_subscribers": 25,
      "successful_sends": 25,
      "failed_sends": 0
    }
  ]
}
```

### 6. Notification की Details देखें
**GET** `/api/notifications/:id`

Response:
```json
{
  "notification": {...},
  "deliveries": [
    {
      "id": "del123",
      "status": "sent",
      "device_name": "Desktop",
      "browser_name": "Chrome"
    }
  ]
}
```

### 7. Unsubscribe करें
**POST** `/api/unsubscribe`

Body:
```json
{
  "endpoint": "https://..."
}
```

## Database Schema

### `subscriptions` Table
```sql
id TEXT PRIMARY KEY
endpoint TEXT (unique)
auth TEXT
p256dh TEXT
device_name TEXT
browser_name TEXT
user_agent TEXT
subscribed_at DATETIME
is_active INTEGER (0 or 1)
```

### `notifications_sent` Table
```sql
id TEXT PRIMARY KEY
title TEXT
message TEXT
image_url TEXT
sent_at DATETIME
total_subscribers INTEGER
successful_sends INTEGER
failed_sends INTEGER
```

### `notification_delivery` Table
```sql
id TEXT PRIMARY KEY
notification_id TEXT (foreign key)
subscription_id TEXT (foreign key)
status TEXT ('pending', 'sent', 'failed')
delivered_at DATETIME
error_message TEXT
```

## Frontend Integration

Frontend automatically करता है:
1. Service Worker register करना
2. Notification permission लेना
3. Subscription को backend को भेजना

### Key Files:
- `/src/utils/subscriptionManager.js` - Frontend utility
- `/public/sw.js` - Service Worker
- `/src/components/PermissionModal.jsx` - User permission screen

## Troubleshooting

### Server start नहीं हो रहा?
```bash
# Port 5000 पहले से use हो रहा है तो:
netstat -ano | findstr :5000
# फिर उस process को kill करें
taskkill /PID <PID> /F
```

### Database issue?
```bash
# Database को reset करने के लिए पुरानी फाइल delete करें
rm backend/panchayat.db
```

### CORS Error?
सुनिश्चित करें कि frontend का URL सही है (default: http://localhost:5173)

## Production Deployment

Production के लिए:
1. `ADMIN_PASSWORD` को secure password में बदलें
2. HTTPS use करें
3. Database backup लें regularly
4. Logs को monitor करें

---

**Questions?** AdminDashboard में 'Notifications' section देखें।
