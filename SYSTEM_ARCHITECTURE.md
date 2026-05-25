# Complete Notification System Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN BROWSER                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        Admin Dashboard (React)                      │   │
│  │  - Title input                                      │   │
│  │  - Message input                                    │   │
│  │  - Photo upload                                     │   │
│  │  - Admin password prompt                            │   │
│  │  - Subscriber count display                         │   │
│  │  - Notification history                             │   │
│  └────────────────────┬────────────────────────────────┘   │
└──────────────────────┼───────────────────────────────────┬──┘
                       │                                   │
                       │ POST /api/send-notification       │
                       │ + admin password                  │
                       │                                   │
                ┌──────▼────────────────────────────────────┐
                │    BACKEND SERVER (Node.js/Express)      │
                │      http://localhost:5000               │
                │  ┌────────────────────────────────────┐  │
                │  │  API Routes:                       │  │
                │  │  - /api/subscribe                  │  │
                │  │  - /api/subscriptions-count        │  │
                │  │  - /api/send-notification          │  │
                │  │  - /api/notifications              │  │
                │  │  - /api/unsubscribe                │  │
                │  └────────────────────────────────────┘  │
                │  ┌────────────────────────────────────┐  │
                │  │  SQLite Database                   │  │
                │  │  ├─ subscriptions table             │  │
                │  │  ├─ notifications_sent table        │  │
                │  │  └─ notification_delivery table     │  │
                │  └────────────────────────────────────┘  │
                └──────┬──────────────────────────────────┬─┘
                       │                                  │
        ┌──────────────┼──────────────┬────────────────┬──┘
        │              │              │                │
        │              │              │                │
┌───────▼──────┐ ┌─────▼────┐ ┌──────▼────┐ ┌────────▼──────┐
│   USER 1     │ │  USER 2  │ │  USER 3   │ │   USER N      │
│   (Mobile)   │ │ (Desktop)│ │(Tablet)   │ │  (Browser)    │
│  ┌────────┐  │ │┌────────┐│ │┌────────┐ │ │┌────────────┐ │
│  │Service │  │ ││Service ││ ││Service │ │ ││  Service   │ │
│  │Worker  │  │ ││Worker  ││ ││Worker  │ │ ││  Worker    │ │
│  └──────┬─┘  │ │└───┬────┘│ │└──┬─────┘ │ │└─────┬──────┘ │
│         │    │ │    │     │ │   │       │ │      │        │
│         │ (Subscribed & Listening)      │ │      │        │
│         ▼    │ │    ▼     │ │   ▼       │ │      ▼        │
│    Notification   Notification   Notification  Notification
│                                                             │
│    Browser open/closed - Notification still works!         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

### 1. USER SUBSCRIPTION FLOW

```
User visits website
        │
        ▼
PermissionModal shows up
        │
        ▼
User clicks ✔ checkbox
        │
        ▼
Browser requests notification permission
        │
        ▼
User clicks "Allow"
        │
        ▼
Service Worker registers
        │
        ▼
subscriptionManager.subscribeToPush()
        │
        ▼
POST /api/subscribe
        │
        ▼
Backend stores in DB
        │
        ▼
✅ User is now subscribed!
```

### 2. ADMIN NOTIFICATION SENDING FLOW

```
Admin fills form:
├─ Title
├─ Message
├─ Date (optional)
└─ Photo (optional)

Admin clicks "Send"
        │
        ▼
Admin password prompt
        │
        ▼
subscriptionManager.sendNotification()
        │
        ▼
POST /api/send-notification
        │
        ▼
Backend validates password
        │
        ▼
Get all active subscriptions from DB
        │
        ▼
For each subscription:
├─ Create delivery record
└─ Log notification sending

        ▼
Update notification stats
        │
        ▼
Return results to admin
        │
        ▼
Admin sees: ✅ Sent: 25, Failed: 0, Total: 25
```

### 3. USER RECEIVES NOTIFICATION FLOW

```
Notification in queue
        │
        ▼
Service Worker wakes up (even if browser closed!)
        │
        ▼
SW receives push notification
        │
        ▼
SW creates system notification
        │
        ▼
User sees notification in system tray
        │
        ▼
User clicks notification
        │
        ▼
Website opens
        │
        ▼
✅ User engaged with notification!
```

---

## 📦 Component Breakdown

### Frontend Components Updated:

#### 1. `/src/components/PermissionModal.jsx`
```
Purpose: Show user permission request on first visit
Changes:
- Removed OneSignal SDK
- Added subscriptionManager usage
- Shows loading state while subscribing
- Handles permission errors gracefully
```

#### 2. `/src/components/AdminDashboard.jsx`
```
Purpose: Admin panel for sending notifications
Changes:
- Added subscriptionManager import
- Added real-time subscriber count display
- Replaced OneSignal API with custom backend API
- Shows notification sending status with progress
- Displays successful/failed delivery count
```

### New Files Created:

#### 1. `/src/utils/subscriptionManager.js`
```
Purpose: Handle all notification subscription operations
Functions:
- registerServiceWorker()
- subscribeToPush()
- sendSubscriptionToServer()
- unsubscribe()
- isSubscribed()
- requestPermission()
- sendNotification() (admin)
- getSubscriptionCount()
- getNotificationHistory()
```

#### 2. `/public/sw.js`
```
Purpose: Service Worker for background notification handling
Listeners:
- 'push' event: Show notification when received
- 'notificationclick' event: Open website when clicked
- 'sync' event: Retry failed messages (future)
```

### Backend Files Created:

#### 1. `/backend/server.js`
```
Purpose: Main Express server with all APIs
- CORS enabled for frontend
- SQLite database setup
- 7 main API endpoints
- Graceful shutdown
```

#### 2. `/backend/panchayat.db`
```
Purpose: SQLite database (auto-created)
Tables:
- subscriptions: Store user subscription data
- notifications_sent: Store sent notifications
- notification_delivery: Track delivery status
```

---

## 🗄️ Database Schema

### subscriptions table
```sql
id TEXT PRIMARY KEY
endpoint TEXT UNIQUE (push endpoint)
auth TEXT (encryption key)
p256dh TEXT (encryption key)
device_name TEXT (user's device name)
browser_name TEXT (Chrome/Firefox/Safari/Edge)
user_agent TEXT (full user agent string)
subscribed_at DATETIME (when subscribed)
is_active INTEGER (1=active, 0=unsubscribed)
```

### notifications_sent table
```sql
id TEXT PRIMARY KEY
title TEXT (notification title)
message TEXT (notification message)
image_url TEXT (optional image)
sent_at DATETIME (when sent)
total_subscribers INTEGER (count at send time)
successful_sends INTEGER (delivered count)
failed_sends INTEGER (failed count)
```

### notification_delivery table
```sql
id TEXT PRIMARY KEY
notification_id TEXT (foreign key)
subscription_id TEXT (foreign key)
status TEXT (pending/sent/failed)
delivered_at DATETIME (when delivered)
error_message TEXT (if failed)
```

---

## 🔐 Security Features

1. **Admin Password Protection**
   - Required for sending notifications
   - Checked server-side
   - Can be changed in `.env` file

2. **HTTPS Ready**
   - Service Workers work better with HTTPS
   - Localhost HTTP works for development
   - Production should use HTTPS

3. **User Consent**
   - Browser permission required
   - Users can opt-out anytime
   - Data stored only after permission

4. **Database Integrity**
   - Foreign keys enforced
   - Data validation
   - Graceful error handling

---

## 🚀 Performance Considerations

1. **Database Queries**
   - Indexed endpoints for fast lookups
   - Batch operations for bulk sends
   - Async operations don't block UI

2. **Frontend Optimization**
   - Service Worker caches assets
   - Minimal payload transfer
   - Efficient state management

3. **Backend Scalability**
   - Lightweight Express server
   - SQLite suitable for < 100k subscriptions
   - Can migrate to PostgreSQL later

---

## 🎯 Future Enhancements

1. **Web Push Protocol (VAPID)**
   - Actual push notifications to devices
   - Works even with app closed
   - Requires HTTPS

2. **Analytics**
   - Detailed delivery reports
   - User engagement metrics
   - A/B testing support

3. **Multi-Admin**
   - Different roles and permissions
   - Audit logs
   - Admin activity tracking

4. **Advanced Notifications**
   - Rich media support
   - Actions/buttons in notifications
   - Tag-based targeting
   - Scheduled notifications

5. **Third-Party Integration**
   - SMS notifications (Twilio)
   - Email notifications (SendGrid)
   - WhatsApp notifications

---

## 📋 Deployment Checklist

- [ ] Change admin password in `.env`
- [ ] Enable HTTPS
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Setup database backups
- [ ] Configure logging
- [ ] Setup monitoring
- [ ] Set up CI/CD pipeline
- [ ] Load testing
- [ ] Security audit

---

## 🆘 Support & Debugging

### Server Logs
```bash
cd backend && npm start
# Watch console for connection logs and errors
```

### Database Inspection
```bash
sqlite3 backend/panchayat.db
SELECT * FROM subscriptions;
```

### API Testing
```bash
# See API_TESTING_GUIDE.md for detailed examples
curl http://localhost:5000/api/health
```

### Browser DevTools
- F12 → Application → Service Workers (check if registered)
- F12 → Application → Manifest (if using PWA)
- F12 → Console (for JavaScript errors)

---

## 📞 Key Contacts/Resources

- Express.js Docs: https://expressjs.com
- SQLite Docs: https://sqlite.org
- Web Push API: https://developer.mozilla.org/en-US/docs/Web/API/Push_API
- Service Workers: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

---

Created: May 9, 2024
System: Panchayat Digital Portal
Version: 1.0.0
