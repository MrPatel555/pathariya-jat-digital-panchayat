// Subscription Manager Utility
// यह यूटिलिटी नोटिफिकेशन subscriptions को manage करने के लिए है

// Get API URL from environment variables
const getApiUrl = () => {
  // In production (Vercel), use VITE_API_URL
  if (typeof window !== 'undefined' && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In development, use localhost
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  // Fallback
  return 'http://localhost:5000';
};

// Cross-browser storage utility - सभी browsers में काम करता है
const storageUtil = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      try {
        sessionStorage.setItem(key, value);
      } catch (e2) {
        window[`__storage_${key}`] = value;
      }
    }
  },
  get: (key) => {
    try {
      const val = localStorage.getItem(key);
      if (val) return val;
    } catch (e) {}
    try {
      const val = sessionStorage.getItem(key);
      if (val) return val;
    } catch (e2) {}
    return window[`__storage_${key}`] || null;
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
    try {
      sessionStorage.removeItem(key);
    } catch (e2) {}
    delete window[`__storage_${key}`];
  }
};

const getClientId = () => {
  const storageKey = 'panchayat_push_client_id';
  let clientId = storageUtil.get(storageKey);

  if (!clientId) {
    clientId = `client_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    storageUtil.set(storageKey, clientId);
  }

  return clientId;
};

export const subscriptionManager = {
  API_URL: getApiUrl(),

  // Service Worker को register करें
  async registerServiceWorker() {
    console.log('🔗 Using API URL:', this.API_URL);
    console.log('🌐 Environment VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('📍 Hostname:', window.location.hostname);
    
    if (!('serviceWorker' in navigator)) {
      console.error('❌ Service Workers not supported in this browser');
      throw new Error('Service Workers not supported');
    }

    try {
      console.log('📝 Attempting to register Service Worker from /sw.js');
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      console.log('✅ Service Worker registered successfully:', registration);
      console.log('  - Scope:', registration.scope);
      console.log('  - Active:', registration.active ? 'Yes' : 'No');
      console.log('  - Installing:', registration.installing ? 'Yes' : 'No');
      return registration;
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      console.error('  - Error name:', error.name);
      console.error('  - Error message:', error.message);
      console.error('  - Error stack:', error.stack);
      throw error;
    }
  },

  // Push Manager को subscribe करें
  async subscribeToPush(deviceName = 'Desktop') {
    try {
      // Service Worker को get करें (पहले ही registered होना चाहिए)
      let registration;
      
      try {
        registration = await navigator.serviceWorker.ready;
        console.log('✅ Using existing Service Worker registration');
      } catch (error) {
        console.warn('⚠️ Service Worker not ready, trying to register again');
        registration = await this.registerServiceWorker();
      }

      if (!registration) {
        throw new Error('Service Worker registration failed');
      }

      // Server से असली VAPID Public Key मंगाएं
      const keyResponse = await fetch(`${this.API_URL}/api/vapid-public-key`);
      const vapidPublicKey = await keyResponse.text();

      // अगर पहले से subscription है तो उसे हटा दें (ताकि नई Key के साथ फ्रेश बने)
      let subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        console.log('🔄 Cleaning up old subscription to sync new VAPID keys...');
        await subscription.unsubscribe();
        subscription = null;
      }

      // नया subscription बनाएं
      
      let subscriptionOptions = {
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      };

      // Try with VAPID key
      try {
        console.log('📝 Attempting subscription with VAPID key...');
        subscription = await registration.pushManager.subscribe(subscriptionOptions);
        console.log('✅ Subscription with VAPID successful');
      } catch (vapidError) {
        console.error('❌ VAPID subscription failed:', vapidError);
        throw new Error(`Push subscription failed: ${vapidError.message}`);
      }

      console.log('✅ Push subscription successful');

      // Subscription को server को भेजें
      await this.sendSubscriptionToServer(subscription, deviceName);

      return subscription;
    } catch (error) {
      console.error('❌ Push subscription failed:', error);
      throw error;
    }
  },

  // Subscription को server को भेजें
  async sendSubscriptionToServer(subscription, deviceName) {
    try {
      const response = await fetch(`${this.API_URL}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription: subscription,
          deviceName: deviceName || 'Desktop',
          clientId: getClientId()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      console.log('✅ Subscription sent to server:', data);
      storageUtil.set('panchayat_push_subscribed', 'true');
      storageUtil.set('panchayat_subscription_id', data.subscriptionId);

      return data;
    } catch (error) {
      console.error('❌ Error sending subscription to server:', error);
      throw error;
    }
  },

  // Unsubscribe करें
  async unsubscribe() {
    try {
      if (!('serviceWorker' in navigator)) return;

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Server को भेजें कि unsubscribe हो गए
        await fetch(`${this.API_URL}/api/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        });

        // Local से subscription हटाएं
        await subscription.unsubscribe();
        storageUtil.remove('panchayat_push_subscribed');
        console.log('✅ Unsubscribed from notifications');
      }
    } catch (error) {
      console.error('❌ Unsubscribe failed:', error);
    }
  },

  // Check if already subscribed
  async isSubscribed() {
    try {
      if (!('serviceWorker' in navigator)) return false;

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      return subscription !== null;
    } catch (error) {
      console.error('❌ Error checking subscription:', error);
      return false;
    }
  },

  // VAPID key को base64 से Uint8Array में convert करें
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  },

  // Request notification permission
  async requestPermission() {
    if (!('Notification' in window)) {
      console.error('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('❌ Error requesting notification permission:', error);
        return false;
      }
    }

    return false;
  },

  // Get subscription count from server
  async getSubscriptionCount() {
    try {
      const response = await fetch(`${this.API_URL}/api/subscriptions-count`);
      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error('❌ Error getting subscription count:', error);
      return 0;
    }
  },

  // Get all subscriptions (admin only)
  async getSubscriptions() {
    try {
      const response = await fetch(`${this.API_URL}/api/subscriptions`);
      const data = await response.json();
      return data.subscriptions;
    } catch (error) {
      console.error('❌ Error getting subscriptions:', error);
      return [];
    }
  },

  // Send notification from admin
  async sendNotification(title, message, imageUrl, adminPassword) {
    try {
      console.log('📤 Sending notification to server:', {
        title,
        messageLength: message.length,
        hasImage: !!imageUrl,
        apiUrl: this.API_URL
      });

      const response = await fetch(`${this.API_URL}/api/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          message,
          imageUrl,
          adminPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server returned ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Notification sent successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error sending notification:', error);
      
      // Better error messages for common issues
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Backend server से connection नहीं हो पा रहा है। क्या backend चल रहा है? (localhost:5000)');
      } else if (error.message.includes('Unauthorized')) {
        throw new Error('Admin password गलत है!');
      } else if (error.message.includes('network')) {
        throw new Error('Network error - Backend से connection नहीं हो रहा');
      }
      
      throw error;
    }
  },

  // Get notification history
  async getNotificationHistory() {
    try {
      const response = await fetch(`${this.API_URL}/api/notifications`);
      const data = await response.json();
      return data.notifications;
    } catch (error) {
      console.error('❌ Error getting notification history:', error);
      return [];
    }
  },

  // Get notification details
  async getNotificationDetails(notificationId) {
    try {
      const response = await fetch(`${this.API_URL}/api/notifications/${notificationId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error getting notification details:', error);
      return null;
    }
  },

  initLiveNotifications() {
    if (typeof window === 'undefined' || window.__panchayatLiveNotificationsStarted) {
      return;
    }

    if (!('EventSource' in window)) {
      console.warn('Live notifications are not supported in this browser');
      return;
    }

    window.__panchayatLiveNotificationsStarted = true;
    const events = new EventSource(`${this.API_URL}/api/live-notifications`);

    events.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (!('Notification' in window) || Notification.permission !== 'granted') {
          console.warn('Live notification received, but browser permission is not granted');
          return;
        }

        const showFallbackNotification = () => {
          new Notification(data.title || 'पंचायत पोर्टल', {
            body: data.body || 'नया अपडेट आया है',
            icon: data.icon || '/images/logo.png'
          });
        };

        if (navigator.serviceWorker?.ready) {
          navigator.serviceWorker.ready
            .then((registration) => {
              registration.showNotification(data.title || 'पंचायत पोर्टल', {
                body: data.body || 'नया अपडेट आया है',
                icon: data.icon || '/images/logo.png',
                badge: data.badge || '/images/logo.png',
                tag: data.notificationId || `panchayat-live-${Date.now()}`,
                renotify: true,
                data: { url: data.url || '/' }
              });
            })
            .catch(showFallbackNotification);
        } else {
          showFallbackNotification();
        }
      } catch (error) {
        console.error('Live notification parse/show error:', error);
      }
    };

    events.onerror = () => {
      console.warn('Live notification stream disconnected; browser will retry automatically');
    };
  }
};

export default subscriptionManager;
