# 🧪 Notification System - Testing Guide

## Quick API Tests

### 1️⃣ Health Check (सर्वर चल रहा है या नहीं?)

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-05-09T10:30:00.000Z"
}
```

---

### 2️⃣ Get Subscriber Count

```bash
curl http://localhost:5000/api/subscriptions-count
```

**Expected Response:**
```json
{
  "count": 0
}
```

*(शुरुआत में 0 होगा, जब users subscribe करेंगे तो बढ़ेगा)*

---

### 3️⃣ Subscribe करें (Fake Device)

```bash
curl -X POST http://localhost:5000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "subscription": {
      "endpoint": "https://fcm.googleapis.com/fcm/send/test123",
      "keys": {
        "auth": "fake_auth_key_12345",
        "p256dh": "fake_p256dh_key_67890"
      }
    },
    "deviceName": "Test Device - Desktop"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to notifications",
  "subscriptionId": "abc123def456..."
}
```

---

### 4️⃣ Check Subscription Count (फिर से)

```bash
curl http://localhost:5000/api/subscriptions-count
```

**Expected Response:**
```json
{
  "count": 1
}
```

---

### 5️⃣ List All Subscribers

```bash
curl http://localhost:5000/api/subscriptions
```

**Expected Response:**
```json
{
  "subscriptions": [
    {
      "id": "abc123def456...",
      "device_name": "Test Device - Desktop",
      "browser_name": "Unknown",
      "subscribed_at": "2024-05-09T10:30:00.000Z"
    }
  ]
}
```

---

### 6️⃣ Send Notification (सभी को)

```bash
curl -X POST http://localhost:5000/api/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "title": "टेस्ट नोटिफिकेशन",
    "message": "यह एक टेस्ट message है",
    "adminPassword": "admin123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "notificationId": "notif_abc123...",
  "message": "Notification sent successfully",
  "sent": 1,
  "failed": 0,
  "total": 1
}
```

---

### 7️⃣ Get Notification History

```bash
curl http://localhost:5000/api/notifications
```

**Expected Response:**
```json
{
  "notifications": [
    {
      "id": "notif_abc123...",
      "title": "टेस्ट नोटिफिकेशन",
      "message": "यह एक टेस्ट message है",
      "image_url": null,
      "sent_at": "2024-05-09T10:30:00.000Z",
      "total_subscribers": 1,
      "successful_sends": 1,
      "failed_sends": 0
    }
  ]
}
```

---

### 8️⃣ Get Notification Details (किसी notification की पूरी जानकारी)

```bash
curl http://localhost:5000/api/notifications/notif_abc123...
```

**Expected Response:**
```json
{
  "notification": {
    "id": "notif_abc123...",
    "title": "टेस्ट नोटिफिकेशन",
    ...
  },
  "deliveries": [
    {
      "id": "del_xyz...",
      "notification_id": "notif_abc123...",
      "subscription_id": "abc123def456...",
      "status": "sent",
      "device_name": "Test Device - Desktop",
      "browser_name": "Unknown",
      "delivered_at": null,
      "error_message": null
    }
  ]
}
```

---

### 9️⃣ Unsubscribe करें

```bash
curl -X POST http://localhost:5000/api/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "https://fcm.googleapis.com/fcm/send/test123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Unsubscribed successfully"
}
```

---

## 🔴 Error Responses

### Bad Request (Missing data)
```bash
curl -X POST http://localhost:5000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**
```json
{
  "error": "Invalid subscription data"
}
```

### Unauthorized (Wrong password)
```bash
curl -X POST http://localhost:5000/api/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "message": "Test",
    "adminPassword": "wrong_password"
  }'
```

**Response:**
```json
{
  "error": "Unauthorized"
}
```

### Not Found
```bash
curl http://localhost:5000/api/notifications/invalid_id
```

**Response:**
```json
{
  "error": "Notification not found"
}
```

---

## 📊 Test Sequence

यह order में करें:

1. Health Check करें ✅
2. Subscriber count check करें (0 होना चाहिए)
3. Fake device को subscribe करें
4. Subscriber count फिर से check करें (1 होना चाहिए)
5. Subscriber list देखें
6. Notification भेजें
7. Notification history देखें
8. Notification details देखें
9. Unsubscribe करें
10. Subscriber count फिर से check करें (0 होना चाहिए)

---

## 🔧 Using Postman (Advanced)

### Postman में import करने के लिए:

```json
{
  "info": {
    "name": "Panchayat Notifications API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/health"
      }
    },
    {
      "name": "Subscribe",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/subscribe",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"subscription\": {\"endpoint\": \"https://test.com\", \"keys\": {\"auth\": \"test\", \"p256dh\": \"test\"}}, \"deviceName\": \"Test\"}"
        }
      }
    }
  ]
}
```

---

## 💾 Database Inspection

### SQLite Database को देखें:

```bash
cd backend
sqlite3 panchayat.db
```

### Tables देखें:
```sql
SELECT * FROM subscriptions;
SELECT * FROM notifications_sent;
SELECT * FROM notification_delivery;
```

---

## 📱 Real Browser Testing

### Frontend से real test करने के लिए:

1. `npm run dev` से Vite dev server start करें
2. localhost:5173 खोलें
3. Permission modal आएगा
4. "Allow" दबाएं
5. AdminDashboard में जाएं
6. Notification भेजें
7. अगर browser खुला है तो notification दिखेगा
8. Browser बंद करें
9. Backend को notification भेजने दें - फिर भी काम करना चाहिए

---

## 🐛 Debugging

### Backend Console में देखें:

```
📤 Sending notification to: Test Device - Desktop (Unknown)
```

यह message आएगा जब notification भेजा जाए।

### Frontend Console में देखें:

```
✅ Service Worker registered: ...
✅ Push subscription successful
✅ Subscription sent to server: ...
```

यह messages आएंगे जब user permission दे।

---

## ✅ Success Checklist

- [ ] Server चल रहा है (localhost:5000)
- [ ] Health check काम कर रहा है
- [ ] Subscription count ठीक है
- [ ] Notification भेज सकते हैं
- [ ] Notification history दिख रही है
- [ ] Frontend से subscription register हो रहा है
- [ ] Admin dashboard में count दिख रहा है

---

🎉 सब कुछ काम कर रहा है तो आप Ready हो!
