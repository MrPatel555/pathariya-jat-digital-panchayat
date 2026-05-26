import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables - MUST BE FIRST
const envPath = path.resolve(__dirname, '.env');
console.log(`📁 Looking for .env at: ${envPath}`);
console.log(`✓ .env exists: ${fs.existsSync(envPath)}`);

dotenv.config({ path: envPath });

// Debug: Log what was loaded
console.log(`✓ PORT: ${process.env.PORT || 'NOT SET'}`);
console.log(`✓ MONGODB_URI: ${process.env.MONGODB_URI ? 'SET' : 'NOT SET'}`);

// If dotenv didn't load, read manually
if (!process.env.MONGODB_URI && fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const idx = trimmed.indexOf('=');
    if (idx > 0) {
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      process.env[key] = val;
    }
  }
}

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import crypto from 'crypto';
import webpush from 'web-push';
import Subscription from './models/Subscription.js';
import NotificationSent from './models/NotificationSent.js';
import NotificationDelivery from './models/NotificationDelivery.js';
import Application from './models/Application.js';

const app = express();
const PORT = process.env.PORT || 5000;
const liveNotificationClients = new Set();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

console.log('\n=== MongoDB Configuration ===');
if (!MONGODB_URI) {
  console.error('❌ CRITICAL: MONGODB_URI is not set!');
  console.error('Environment variables loaded:', Object.keys(process.env).filter(k => k.includes('MONGO') || k.includes('PORT')));
  process.exit(1);
}

console.log('✅ MONGODB_URI is set');
console.log('🔐 Connecting to MongoDB Atlas...');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB Connected successfully');
    console.log('✅ Database: panchayatDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

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
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or Curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      process.env.CORS_ORIGIN,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
      'https://pathariya-jat-digital-panchayat.vercel.app'
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin) || origin.includes('vercel.app') || origin.includes('railway.app')) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(null, true); // Allow for debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 200
};

console.log('🔐 CORS allowed origins:', [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CORS_ORIGIN || 'Not set',
  'Vercel URLs (auto-detected)',
  'Railway URLs (auto-detected)'
]);

// Serve Frontend Static Files
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html') || filePath.endsWith('sw.js')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
  }));
  console.log('📁 Serving frontend from:', distPath);
}

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Origin: ${req.get('origin') || 'no-origin'}`);
  next();
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

// 0. Get VAPID Public Key - CORS enabled
app.options('/api/vapid-public-key', cors());
app.get('/api/vapid-public-key', cors(), (req, res) => {
  try {
    res.type('text/plain').send(vapidKeys.publicKey);
  } catch (error) {
    console.error('Error sending VAPID key:', error);
    res.status(500).json({ error: 'Failed to get VAPID key' });
  }
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
      await Subscription.updateMany(
        { clientId: clientId, endpoint: { $ne: subscription.endpoint } },
        { isActive: false }
      );
    }

    await Subscription.updateOne(
      { endpoint: subscription.endpoint },
      {
        $set: {
          _id: id,
          endpoint: subscription.endpoint,
          auth: subscription.keys.auth,
          p256dh: subscription.keys.p256dh,
          clientId: clientId || null,
          deviceName: deviceName || 'Desktop',
          browserName: browserName,
          userAgent: userAgent,
          isActive: true,
          subscribedAt: new Date()
        }
      },
      { upsert: true }
    );

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
    const count = await Subscription.countDocuments({ isActive: true });
    res.json({ count });
  } catch (error) {
    console.error('Count error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Get all active subscriptions (for admin only - add auth later)
app.get('/api/subscriptions', async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ isActive: true })
      .select('_id deviceName browserName subscribedAt')
      .sort({ subscribedAt: -1 });
    
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

    await Subscription.updateOne({ endpoint }, { isActive: false });

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
    const subscriptions = await Subscription.find({ isActive: true });

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
    
    const notificationRecord = new NotificationSent({
      _id: notificationId,
      title,
      message,
      imageUrl,
      sentAt: new Date(),
      totalSubscribers: subscriptions.length,
      successfulSends: 0,
      failedSends: 0
    });
    
    await notificationRecord.save();

    // Send to each subscription
    let successCount = 0;
    let failCount = 0;

    for (const subscription of subscriptions) {
      try {
        console.log(`📤 Sending notification to: ${subscription.deviceName} (${subscription.browserName})`);
        
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
          console.log(`✅ Push sent to ${subscription.deviceName}`);
          
          // Create delivery record
          const deliveryId = generateId();
          const deliveryRecord = new NotificationDelivery({
            _id: deliveryId,
            notificationId,
            subscriptionId: subscription._id,
            status: 'sent'
          });
          
          await deliveryRecord.save();
          successCount++;
        } catch (pushError) {
          console.error(`⚠️ Web push failed for ${subscription.deviceName}:`, pushError.message);

          if (shouldDeactivateSubscription(pushError)) {
            await Subscription.updateOne({ _id: subscription._id }, { isActive: false });
            console.warn(`Deactivated invalid subscription: ${subscription._id}`);
          }
          
          // Still log it as sent to database (browser might be offline)
          const deliveryId = generateId();
          const deliveryRecord = new NotificationDelivery({
            _id: deliveryId,
            notificationId,
            subscriptionId: subscription._id,
            status: 'failed',
            errorMessage: pushError.message
          });
          
          await deliveryRecord.save();
          failCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing subscription ${subscription._id}:`, error);
        if (shouldDeactivateSubscription(error)) {
          await Subscription.updateOne({ _id: subscription._id }, { isActive: false });
          console.warn(`Deactivated invalid subscription: ${subscription._id}`);
        }
        failCount++;
      }
    }

    // Update notification record with counts
    await NotificationSent.updateOne(
      { _id: notificationId },
      { successfulSends: successCount, failedSends: failCount }
    );

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
    const notifications = await NotificationSent.find({})
      .sort({ sentAt: -1 })
      .limit(50);

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

    const notification = await NotificationSent.findById(id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // SQLite JOIN ki tarah MongoDB Aggregation (Frontend admin panel format match karne ke liye)
    const deliveries = await NotificationDelivery.aggregate([
      { $match: { notificationId: id } },
      { $lookup: { from: 'subscriptions', localField: 'subscriptionId', foreignField: '_id', as: 'sub' } },
      { $unwind: { path: '$sub', preserveNullAndEmptyArrays: true } },
      { $addFields: { device_name: '$sub.deviceName', browser_name: '$sub.browserName', error_message: '$errorMessage' } },
      { $project: { sub: 0 } }
    ]);

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
    
    // Validation
    if (!id || !type || !name || !description) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['id', 'type', 'name', 'description']
      });
    }
    
    const application = new Application({
      _id: id,
      type,
      name,
      mobile: mobile || null,
      ward: ward || null,
      category: category || null,
      date: date || null,
      time: time || null,
      status: status || 'Pending',
      description,
      note: note || '',
      locationLat: location?.lat || null,
      locationLng: location?.lng || null,
      locationAddress: location?.address || null,
      createdAt: new Date()
    });
    
    await application.save();
    
    console.log(`✅ Application submitted: ${id} (${type})`);
    res.status(201).json({ 
      success: true, 
      message: 'आपका आवेदन सफलतापूर्वक सबमिट कर दिया गया है।',
      id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ 
      error: 'सर्वर से जुड़ने में समस्या हुई।',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 9. Track application status
app.get('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);
    
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
    const applications = await Application.find({}).sort({ createdAt: -1 });
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
    await Application.updateOne(
      { _id: id },
      { status, note }
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
    await Application.deleteOne({ _id: id });
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check with detailed info
app.get('/api/health', cors(), (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    server: {
      port: PORT,
      node_env: process.env.NODE_ENV || 'development',
      uptime: process.uptime()
    },
    cors: {
      origin_received: req.get('origin') || 'no-origin',
      cors_enabled: true
    },
    database: {
      type: 'MongoDB Atlas',
      connected: mongoose.connection.readyState === 1,
      uri: MONGODB_URI.substring(0, 50) + '...'
    },
    vapid: {
      configured: !!vapidKeys.publicKey,
      subject: process.env.VAPID_SUBJECT || 'Not configured'
    }
  });
});

// Serve index.html for all routes (React Router)
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Frontend not built. Run: npm run build' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Panchayat Server running on 0.0.0.0:${PORT}`);
  console.log(`🌐 Access URLs:`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Network: http://0.0.0.0:${PORT}`);
  console.log(`📊 Database: MongoDB Atlas (panchayatDB)`);
  console.log(`🔐 Admin Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api/health`);
  console.log(`🔗 CORS Origins configured for production deployment`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('\n✅ MongoDB connection closed');
  } catch (err) {
    console.error('MongoDB close error:', err);
  }
  process.exit(0);
});

export default app;
