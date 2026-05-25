import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import fs from 'fs';
import webpush from 'web-push';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const liveNotificationClients = new Set();

// Setup Web Push VAPID Keys
const keysPath = path.join(__dirname, 'vapid-keys.json');
let vapidKeys;

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  vapidKeys = { publicKey: process.env.VAPID_PUBLIC_KEY, privateKey: process.env.VAPID_PRIVATE_KEY };
} else if (fs.existsSync(keysPath)) {
  vapidKeys = JSON.parse(fs.readFileSync(keysPath, 'utf8'));
} else {
  vapidKeys = webpush.generateVAPIDKeys();
  fs.writeFileSync(keysPath, JSON.stringify(vapidKeys));
  console.log('✅ Auto-generated new VAPID keys and saved to vapid-keys.json');
}

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@panchayat.local',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
console.log('🔐 VAPID Keys configured');

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Database Setup
const dbPath = path.join(__dirname, 'panchayat.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('📊 Database connected:', dbPath);
  }
});

// Run database queries as promises
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      endpoint TEXT NOT NULL UNIQUE,
      auth TEXT NOT NULL,
      p256dh TEXT NOT NULL,
      client_id TEXT,
      device_name TEXT,
      browser_name TEXT,
      user_agent TEXT,
      subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active INTEGER DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS notifications_sent (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      image_url TEXT,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      total_subscribers INTEGER,
      successful_sends INTEGER DEFAULT 0,
      failed_sends INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS notification_delivery (
      id TEXT PRIMARY KEY,
      notification_id TEXT NOT NULL,
      subscription_id TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      delivered_at DATETIME,
      error_message TEXT,
      FOREIGN KEY (notification_id) REFERENCES notifications_sent(id),
      FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
    )
  `);

  db.run('ALTER TABLE subscriptions ADD COLUMN client_id TEXT', (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Migration error adding client_id:', err.message);
    }
  });

  db.run(`
    UPDATE subscriptions
    SET is_active = 0
    WHERE auth IS NULL OR auth = '' OR p256dh IS NULL OR p256dh = ''
  `);

  db.run(`
    UPDATE subscriptions
    SET is_active = 0
    WHERE (client_id IS NULL OR client_id = '')
      AND id NOT IN (
        SELECT id
        FROM subscriptions latest
        WHERE latest.user_agent = subscriptions.user_agent
          AND (latest.client_id IS NULL OR latest.client_id = '')
        ORDER BY datetime(latest.subscribed_at) DESC, latest.rowid DESC
        LIMIT 1
      )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      type TEXT,
      name TEXT,
      mobile TEXT,
      ward TEXT,
      category TEXT,
      date TEXT,
      time TEXT,
      status TEXT DEFAULT 'Pending',
      description TEXT,
      note TEXT,
      location_lat REAL,
      location_lng REAL,
      location_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Helper function to generate ID
const generateId = () => crypto.randomBytes(16).toString('hex');

const hasValidPushKeys = (subscription) => {
  return Boolean(
    subscription &&
    subscription.endpoint &&
    subscription.keys &&
    subscription.keys.auth &&
    subscription.keys.p256dh
  );
};

const shouldDeactivateSubscription = (error) => {
  return (
    error?.statusCode === 400 ||
    error?.statusCode === 401 ||
    error?.statusCode === 403 ||
    error?.statusCode === 404 ||
    error?.statusCode === 410 ||
    error?.message?.includes("must have 'auth' and 'p256dh' keys") ||
    error?.message?.includes("VAPID")
  );
};

const broadcastLiveNotification = (payload) => {
  const eventData = `data: ${JSON.stringify(payload)}\n\n`;

  for (const client of liveNotificationClients) {
    try {
      client.write(eventData);
    } catch (error) {
      liveNotificationClients.delete(client);
    }
  }
};

// API Routes

// 0. Get VAPID Public Key
app.get('/api/vapid-public-key', (req, res) => {
  res.send(vapidKeys.publicKey);
});

// 1. Register for notifications
app.post('/api/subscribe', async (req, res) => {
  try {
    const { subscription, deviceName, clientId } = req.body;
    
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription data' });
    }

    if (!hasValidPushKeys(subscription)) {
      return res.status(400).json({
        error: 'Invalid push subscription keys. Please allow notifications again.'
      });
    }

    const id = generateId();
    const userAgent = req.headers['user-agent'];
    
    // Extract browser name from user-agent
    let browserName = 'Unknown';
    if (userAgent.includes('Chrome')) browserName = 'Chrome';
    else if (userAgent.includes('Safari')) browserName = 'Safari';
    else if (userAgent.includes('Firefox')) browserName = 'Firefox';
    else if (userAgent.includes('Edge')) browserName = 'Edge';

    if (clientId) {
      await dbRun(
        'UPDATE subscriptions SET is_active = 0 WHERE client_id = ? AND endpoint != ?',
        [clientId, subscription.endpoint]
      );
    }

    await dbRun(`
      INSERT INTO subscriptions 
      (id, endpoint, auth, p256dh, client_id, device_name, browser_name, user_agent, is_active, subscribed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
      ON CONFLICT(endpoint) DO UPDATE SET
        auth = excluded.auth,
        p256dh = excluded.p256dh,
        client_id = excluded.client_id,
        device_name = excluded.device_name,
        browser_name = excluded.browser_name,
        user_agent = excluded.user_agent,
        is_active = 1,
        subscribed_at = CURRENT_TIMESTAMP
    `, [
      id,
      subscription.endpoint,
      subscription.keys.auth,
      subscription.keys.p256dh,
      clientId || null,
      deviceName || 'Desktop',
      browserName,
      userAgent
    ]);

    res.json({ 
      success: true, 
      message: 'Successfully subscribed to notifications',
      subscriptionId: id 
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Get all active subscriptions count
app.get('/api/subscriptions-count', async (req, res) => {
  try {
    const result = await dbGet('SELECT COUNT(*) as count FROM subscriptions WHERE is_active = 1');
    res.json({ count: result.count });
  } catch (error) {
    console.error('Count error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Get all active subscriptions (for admin only - add auth later)
app.get('/api/subscriptions', async (req, res) => {
  try {
    const subscriptions = await dbAll(`
      SELECT id, device_name, browser_name, subscribed_at 
      FROM subscriptions 
      WHERE is_active = 1
      ORDER BY subscribed_at DESC
    `);
    
    res.json({ subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Unsubscribe
app.post('/api/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body;
    
    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint required' });
    }

    await dbRun('UPDATE subscriptions SET is_active = 0 WHERE endpoint = ?', [endpoint]);

    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4.1 Live notification stream for browsers that are currently open
app.get('/api/live-notifications', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders?.();

  res.write(': connected\n\n');
  liveNotificationClients.add(res);

  req.on('close', () => {
    liveNotificationClients.delete(res);
  });
});

// 5. Send notification to all subscribers
app.post('/api/send-notification', async (req, res) => {
  try {
    const { title, message, imageUrl, adminPassword } = req.body;

    // Simple auth - replace with proper auth later
    const correctPassword = process.env.ADMIN_PASSWORD || 'admin123';
    if (adminPassword !== correctPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message required' });
    }

    // Get all active subscriptions
    const subscriptions = await dbAll(`
      SELECT * FROM subscriptions WHERE is_active = 1
    `);

    if (subscriptions.length === 0) {
      return res.json({ 
        success: true, 
        message: 'No active subscriptions',
        sent: 0,
        total: 0
      });
    }

    // Create notification record
    const notificationId = generateId();
    
    await dbRun(`
      INSERT INTO notifications_sent 
      (id, title, message, image_url, total_subscribers)
      VALUES (?, ?, ?, ?, ?)
    `, [notificationId, title, message, imageUrl, subscriptions.length]);

    // Send to each subscription
    let successCount = 0;
    let failCount = 0;

    for (const subscription of subscriptions) {
      try {
        console.log(`📤 Sending notification to: ${subscription.device_name} (${subscription.browser_name})`);
        
        // Create notification payload
        const payload = JSON.stringify({
          title: title,
          body: message,
          icon: imageUrl || '/images/logo.png',
          badge: '/images/logo.png',
          tag: 'panchayat-notification'
        });

        // Parse subscription object
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            auth: subscription.auth,
            p256dh: subscription.p256dh
          }
        };

        if (!hasValidPushKeys(pushSubscription)) {
          throw new Error("Invalid subscription: must have 'auth' and 'p256dh' keys");
        }

        // Send push notification using web-push library
        try {
          await webpush.sendNotification(pushSubscription, payload);
          console.log(`✅ Push sent to ${subscription.device_name}`);
          
          // Create delivery record
          const deliveryId = generateId();
          await dbRun(`
            INSERT INTO notification_delivery 
            (id, notification_id, subscription_id, status)
            VALUES (?, ?, ?, ?)
          `, [deliveryId, notificationId, subscription.id, 'sent']);
          
          successCount++;
        } catch (pushError) {
          console.error(`⚠️ Web push failed for ${subscription.device_name}:`, pushError.message);

          if (shouldDeactivateSubscription(pushError)) {
            await dbRun('UPDATE subscriptions SET is_active = 0 WHERE id = ?', [subscription.id]);
            console.warn(`Deactivated invalid subscription: ${subscription.id}`);
          }
          
          // Still log it as sent to database (browser might be offline)
          const deliveryId = generateId();
          await dbRun(`
            INSERT INTO notification_delivery 
            (id, notification_id, subscription_id, status, error_message)
            VALUES (?, ?, ?, ?, ?)
          `, [deliveryId, notificationId, subscription.id, 'failed', pushError.message]);
          
          failCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing subscription ${subscription.id}:`, error);
        if (shouldDeactivateSubscription(error)) {
          await dbRun('UPDATE subscriptions SET is_active = 0 WHERE id = ?', [subscription.id]);
          console.warn(`Deactivated invalid subscription: ${subscription.id}`);
        }
        failCount++;
      }
    }

    // Update notification record with counts
    await dbRun(`
      UPDATE notifications_sent 
      SET successful_sends = ?, failed_sends = ?
      WHERE id = ?
    `, [successCount, failCount, notificationId]);

    broadcastLiveNotification({
      notificationId,
      title,
      body: message,
      icon: imageUrl || '/images/logo.png',
      badge: '/images/logo.png',
      url: '/',
      sentAt: new Date().toISOString()
    });

    const responseBody = { 
      success: true,
      notificationId,
      message: 'Notification sent successfully',
      sent: successCount,
      failed: failCount,
      total: subscriptions.length
    };

    if (successCount === 0 && failCount > 0) {
      return res.status(200).json({
        ...responseBody,
        success: true,
        message: '⚠️ पुश नोटिफिकेशन पुराने टोकन के कारण फेल हुए। हालांकि, जो यूज़र अभी वेबसाइट पर ऑनलाइन (Live) हैं, उन्हें स्क्रीन पर नोटिफिकेशन मिल गया है। कृपया पेज को एक बार Refresh करें।'
      });
    }

    res.json(responseBody);
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 6. Get notification history
app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await dbAll(`
      SELECT * FROM notifications_sent 
      ORDER BY sent_at DESC 
      LIMIT 50
    `);

    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 7. Get notification details with delivery stats
app.get('/api/notifications/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await dbGet(`
      SELECT * FROM notifications_sent WHERE id = ?
    `, [id]);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const deliveries = await dbAll(`
      SELECT d.*, s.device_name, s.browser_name
      FROM notification_delivery d
      JOIN subscriptions s ON d.subscription_id = s.id
      WHERE d.notification_id = ?
    `, [id]);

    res.json({ notification, deliveries });
  } catch (error) {
    console.error('Get notification details error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 8. Submit a new application or suggestion
app.post('/api/applications', async (req, res) => {
  try {
    const { id, type, name, mobile, ward, category, date, time, status, description, note, location } = req.body;
    
    await dbRun(`
      INSERT INTO applications 
      (id, type, name, mobile, ward, category, date, time, status, description, note, location_lat, location_lng, location_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, type, name, mobile, ward, category, date, time, status || 'Pending', description, note || '', 
      location?.lat || null, 
      location?.lng || null, 
      location?.address || null
    ]);
    
    res.status(201).json({ success: true, message: 'Application submitted successfully', id });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 9. Track application status
app.get('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const application = await dbGet('SELECT * FROM applications WHERE id = ?', [id]);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 10. Get all applications (Admin view)
app.get('/api/applications', async (req, res) => {
  try {
    const applications = await dbAll('SELECT * FROM applications ORDER BY created_at DESC');
    res.json({ applications });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 11. Update application status (Admin)
app.put('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    await dbRun(
      'UPDATE applications SET status = ?, note = ? WHERE id = ?',
      [status, note, id]
    );
    res.json({ success: true, message: 'Application updated successfully' });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 12. Delete an application (Admin)
app.delete('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun('DELETE FROM applications WHERE id = ?', [id]);
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Panchayat Notification Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${dbPath}`);
  console.log(`🔐 Admin Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
  console.log(`\n📖 API Documentation: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) console.error('Database close error:', err);
    else console.log('\n✅ Database connection closed');
    process.exit(0);
  });
});

export default app;
