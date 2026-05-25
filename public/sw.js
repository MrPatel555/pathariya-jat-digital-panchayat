// Service Worker for Panchayat Notifications
// यह फाइल ब्राउज़र बंद होने के बाद भी नोटिफिकेशन प्राप्त करने के लिए है

console.log('🔧 Service Worker loaded');

self.addEventListener('push', function (event) {
  console.log('📨 Push notification received:', event);

  let notificationData = {
    title: 'पंचायत पोर्टल',
    body: 'नया अपडेट आ गया है',
    badge: undefined,
    icon: undefined
  };

  // अगर payload है तो उसे पार्स करें
  if (event.data) {
    try {
      notificationData = event.data.json();
      console.log('📨 Parsed notification data:', notificationData);
    } catch (e) {
      console.log('📨 Notification is text, not JSON');
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon || '/images/logo.png',
      badge: notificationData.badge || '/images/logo.png',
      tag: notificationData.tag || `panchayat-notification-${Date.now()}`,
      renotify: true,
      requireInteraction: false,
      data: {
        url: notificationData.url || '/',
        receivedAt: Date.now()
      }
    }).then(() => {
      console.log('✅ Notification shown successfully');
    }).catch(err => {
      console.error('❌ Error showing notification:', err);
    })
  );
});

// Notification click handler
self.addEventListener('notificationclick', function (event) {
  console.log('👆 Notification clicked');
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      // अगर विंडो पहले से खुली है तो उसे फोकस करें
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ('focus' in client) {
          console.log('👁️ Focusing existing window');
          return client.focus();
        }
      }
      // अगर खुली नहीं है तो नई खोलें
      if (clients.openWindow) {
        console.log('📂 Opening new window');
        return clients.openWindow('/');
      }
    })
  );
});

// Background sync for failed messages
self.addEventListener('sync', function (event) {
  if (event.tag === 'sync-notifications') {
    console.log('🔄 Syncing notifications');
    event.waitUntil(
      fetch('/api/health').then(response => {
        console.log('✅ Service worker sync - connection restored');
      }).catch(err => {
        console.log('❌ Service worker sync failed:', err);
      })
    );
  }
});

// Service worker install
self.addEventListener('install', function (event) {
  console.log('🔧 Service Worker installed');
  self.skipWaiting();
});

// Service worker activate
self.addEventListener('activate', function (event) {
  console.log('✅ Service Worker activated');
  event.waitUntil(clients.claim());
});

