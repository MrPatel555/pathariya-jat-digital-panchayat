import React, { useState, useEffect } from 'react';

function PermissionGate({ children }) {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [notificationGranted, setNotificationGranted] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = () => {
    // Location permission check
    const locGranted = localStorage.getItem('panchayat_location_granted') === 'true';
    
    // Notification permission check
    const notifGranted = 'Notification' in window && Notification.permission === 'granted';
    
    setLocationGranted(locGranted);
    setNotificationGranted(notifGranted);
    
    if (locGranted && notifGranted) {
      setPermissionsGranted(true);
    }
  };

  const requestAllPermissions = async () => {
    setIsRequesting(true);
    
    try {
      // Step 1: Request Location
      console.log('📍 Step 1: Requesting Location Permission...');
      
      await new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              console.log('✅ Location permission granted:', pos.coords);
              localStorage.setItem('panchayat_location_granted', 'true');
              setLocationGranted(true);
              resolve();
            },
            (err) => {
              console.error('❌ Location permission denied:', err);
              reject(err);
            },
            { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
          );
        } else {
          reject(new Error('Geolocation not supported'));
        }
      });

      // Step 2: Request Notification
      console.log('🔔 Step 2: Requesting Notification Permission...');
      
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        console.log('🔔 Notification permission result:', permission);
        
        if (permission === 'granted') {
          setNotificationGranted(true);
          setPermissionsGranted(true);
        } else {
          throw new Error('Notification permission denied');
        }
      } else {
        throw new Error('Notifications not supported');
      }

      console.log('✅ All permissions granted! Website unlocked.');
    } catch (error) {
      console.error('❌ Permission error:', error);
      alert('❌ अनुमति प्राप्त नहीं हो सकी। कृपया पुनः प्रयास करें।\n\nError: ' + error.message);
    } finally {
      setIsRequesting(false);
    }
  };

  // अगर सभी permissions मिल गए तो main content दिखाएं
  if (permissionsGranted) {
    return <>{children}</>;
  }

  // अन्यथा Permission Gate दिखाएं
  return (
    <div style={styles.gateContainer}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .permission-icon {
            animation: pulse 2s ease-in-out infinite;
          }
        `}
      </style>

      <div style={styles.gateContent}>
        {/* लोगो */}
        <div style={{ textAlign: 'center', marginBottom: '30px', animation: 'slideIn 0.6s ease' }}>
          <div style={styles.logoCircle}>
            <div style={{ fontSize: '48px' }}>🛡️</div>
          </div>
        </div>

        {/* हेडिंग */}
        <h1 style={styles.heading}>
          पंचायत डिजिटल पोर्टल में स्वागत है!
        </h1>

        {/* डिस्क्रिप्शन */}
        <p style={styles.description}>
          आपकी सेवा में बेहतर अनुभव के लिए हमें निम्नलिखित अनुमतियों की आवश्यकता है:
        </p>

        {/* Permissions List */}
        <div style={styles.permissionsList}>
          {/* Location */}
          <div style={styles.permissionItem}>
            <div style={styles.permissionIconBox}>
              <span style={{ fontSize: '24px' }}>📍</span>
            </div>
            <div style={styles.permissionText}>
              <h3 style={styles.permissionTitle}>लाइव लोकेशन (GPS)</h3>
              <p style={styles.permissionDesc}>
                आपकी स्थिति को सत्यापित करने के लिए
              </p>
            </div>
            <div style={{
              ...styles.permissionStatus,
              backgroundColor: locationGranted ? '#10B981' : '#6B7280',
              color: '#fff'
            }}>
              {locationGranted ? '✓ मिल गई' : 'प्रतीक्षा'}
            </div>
          </div>

          {/* Notifications */}
          <div style={styles.permissionItem}>
            <div style={styles.permissionIconBox}>
              <span style={{ fontSize: '24px' }}>🔔</span>
            </div>
            <div style={styles.permissionText}>
              <h3 style={styles.permissionTitle}>पुश नोटिफिकेशन</h3>
              <p style={styles.permissionDesc}>
                महत्वपूर्ण अपडेट के लिए तत्काल सूचनाएं
              </p>
            </div>
            <div style={{
              ...styles.permissionStatus,
              backgroundColor: notificationGranted ? '#10B981' : '#6B7280',
              color: '#fff'
            }}>
              {notificationGranted ? '✓ मिल गई' : 'प्रतीक्षा'}
            </div>
          </div>
        </div>

        {/* Request Button */}
        <button
          onClick={requestAllPermissions}
          disabled={isRequesting}
          style={{
            ...styles.requestButton,
            opacity: isRequesting ? 0.7 : 1,
            cursor: isRequesting ? 'not-allowed' : 'pointer'
          }}
        >
          {isRequesting ? (
            <>
              <span style={{ marginRight: '10px', display: 'inline-block', animation: 'pulse 1s ease-in-out infinite' }}>⏳</span>
              अनुमति प्राप्त कर रहे हैं...
            </>
          ) : (
            <>
              <span style={{ marginRight: '10px' }}>🔓</span>
              सभी अनुमतियां दें & वेबसाइट खोलें
            </>
          )}
        </button>

        {/* Info Box */}
        <div style={styles.infoBox}>
          <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
            💡 <strong>नोट:</strong> ये अनुमतियां केवल आपकी सुरक्षा और बेहतर सेवा के लिए हैं। 
            हम आपकी निजी जानकारी किसी अन्य के साथ साझा नहीं करते।
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  gateContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 9999,
    overflow: 'auto'
  },

  gateContent: {
    background: '#fff',
    borderRadius: '16px',
    padding: '40px 30px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    animation: 'slideIn 0.6s ease'
  },

  logoCircle: {
    width: '80px',
    height: '80px',
    margin: '0 auto',
    background: 'linear-gradient(135deg, #D4AF37, #9A7B3E)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px'
  },

  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#022C22',
    margin: '20px 0 10px 0',
    lineHeight: '1.4'
  },

  description: {
    fontSize: '15px',
    color: '#666',
    margin: '10px 0 25px 0',
    lineHeight: '1.6'
  },

  permissionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    margin: '25px 0'
  },

  permissionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: '#F8FAFC',
    borderRadius: '10px',
    border: '1px solid #E2E8F0'
  },

  permissionIconBox: {
    fontSize: '28px',
    flexShrink: 0
  },

  permissionText: {
    flex: 1,
    textAlign: 'left'
  },

  permissionTitle: {
    fontSize: '15px',
    fontWeight: '600',
    margin: '0 0 5px 0',
    color: '#022C22'
  },

  permissionDesc: {
    fontSize: '12px',
    margin: 0,
    color: '#999'
  },

  permissionStatus: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: '6px',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },

  requestButton: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#022C22',
    background: 'linear-gradient(135deg, #D4AF37, #9A7B3E)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '20px',
    boxShadow: '0 8px 20px rgba(212, 175, 55, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  infoBox: {
    marginTop: '20px',
    padding: '12px',
    background: '#FFFBEB',
    border: '1px solid #FBBF24',
    borderRadius: '8px'
  }
};

export default PermissionGate;
