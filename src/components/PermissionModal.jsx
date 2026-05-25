import React, { useState, useEffect } from 'react';
import { subscriptionManager } from '../utils/subscriptionManager';

// Cross-browser storage utility - works on all browsers including Brave, private mode, etc.
const crossBrowserStorage = {
  set: (key, value) => {
    try {
      // Try localStorage first (standard)
      localStorage.setItem(key, value);
    } catch (e) {
      try {
        // Fallback to sessionStorage (works in more cases)
        sessionStorage.setItem(key, value);
      } catch (e2) {
        // Last resort: store in memory (will be lost on refresh but that's ok for this use case)
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
  }
};

function PermissionModal() {
  const [showModal, setShowModal] = useState(true); // By default show करेंगे
  const [isAgreed, setIsAgreed] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false); // ब्लॉक स्क्रीन दिखाने के लिए नई स्टेट
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if notification permission is already handled in this browser/session
    const checkPermissionStatus = async () => {
      try {
        // सभी browsers के लिए cross-browser storage का उपयोग करें
        const alreadyAsked = crossBrowserStorage.get('panchayat_notification_asked');
        
        if ('Notification' in window) {
          // अगर permission granted है
          if (Notification.permission === 'granted') {
            console.log('✅ Notifications already permitted - hiding modal');
            setShowModal(false);
            crossBrowserStorage.set('panchayat_notification_asked', 'true');
            try {
              await subscriptionManager.registerServiceWorker();
              await subscriptionManager.subscribeToPush('Desktop');
              console.log('Existing notification subscription refreshed');
            } catch (refreshError) {
              console.warn('Notification subscription refresh failed:', refreshError.message);
            }
            return;
          }
          
          // अगर permission denied है
          if (Notification.permission === 'denied') {
            console.log('⚠️ Notifications denied - hiding modal');
            setShowModal(false);
            crossBrowserStorage.set('panchayat_notification_asked', 'false');
            return;
          }
        }
        
        // अगर पहले से पूछ चुके हैं तो फिर से न पूछें (सभी browsers में काम करे)
        if (alreadyAsked === 'true' || alreadyAsked === 'false') {
          console.log('📝 Already asked for permission in this browser - hiding modal');
          setShowModal(false);
          return;
        }
        
        // नई permission लेनी है
        console.log('🔔 PermissionModal mounted - showing permission dialog');
        setShowModal(true);
      } catch (error) {
        console.error('❌ Error checking permission status:', error);
        setShowModal(true);
      }
    };

    checkPermissionStatus();
  }, []);

  // जैसे ही यूज़र टिक करेगा, तुरंत परमिशन मांग ली जाएगी (आवेदन फॉर्म की तरह)
  const handleCheckboxChange = async (e) => {
    const checked = e.target.checked;
    setIsAgreed(checked);

    if (checked) {
      setIsLoading(true);
      try {
        console.log('📝 Step 1: Registering Service Worker...');
        
        // पहले Service Worker register करें (यह जरूरी है)
        await subscriptionManager.registerServiceWorker();
        
        console.log('✅ Service Worker registered');
        console.log('📝 Step 2: Requesting notification permission...');
        
        // फिर notification permission मांगें
        const hasPermission = await subscriptionManager.requestPermission();
        
        console.log('📝 Permission result:', hasPermission);
        
        if (hasPermission) {
          console.log('📝 Step 3: Getting push subscription...');
          
          // फिर push subscription लें
          await subscriptionManager.subscribeToPush('Desktop');
          
          console.log('✅ Complete subscription flow finished!');
          // सभी browsers में काम करे के लिए cross-browser storage का उपयोग करें
          crossBrowserStorage.set('panchayat_notification_asked', 'true');
          setShowModal(false);
        } else {
          console.warn('❌ User denied permission');
          setIsBlocked(true);
          setIsAgreed(false);
        }
      } catch (error) {
        console.error('❌ Subscription error:', error);
        
        // Show actual error message to user
        let errorMsg = error.message || 'Unknown error occurred';
        
        alert("❌ नोटिफिकेशन सेटअप में समस्या:\n\n" + errorMsg + "\n\nकृपया पुनः प्रयास करें या ब्राउज़र को refresh करें।");
        setIsAgreed(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!showModal) return null;

  return (
    <>
      <style>
        {`
          .anim-hand {
            animation: moveHand 3.5s infinite ease-in-out;
          }
          .anim-tick {
            animation: checkTick 3.5s infinite;
          }
          .anim-allow {
            animation: allowHighlight 3.5s infinite;
          }

          @keyframes moveHand {
            0%, 100% { transform: translate(0px, 0px); }
            15% { transform: translate(-170px, -20px); } /* Checkbox की तरफ जाना */
            20% { transform: translate(-170px, -20px) scale(0.85); color: #059669; } /* Checkbox क्लिक करना */
            25% { transform: translate(-170px, -20px) scale(1); color: #1E293B; }
            45% { transform: translate(-15px, -90px); } /* Allow बटन की तरफ जाना */
            50% { transform: translate(-15px, -90px) scale(0.85); color: #059669; } /* Allow क्लिक करना */
            55% { transform: translate(-15px, -90px) scale(1); color: #1E293B; }
            80% { transform: translate(0px, 0px); } /* वापस लौटना */
          }

          @keyframes checkTick {
            0%, 19% { opacity: 0; transform: scale(0.5); }
            20%, 100% { opacity: 1; transform: scale(1); }
          }

          @keyframes allowHighlight {
            0%, 49% { background: #F1F5F9; color: #64748B; }
            50%, 100% { background: #059669; color: #fff; }
          }

          @keyframes pulse-border {
            0%, 100% { border-color: #CBD5E1; box-shadow: 0 4px 12px rgba(0,0,0,0.05); transform: scale(1); }
            50% { border-color: #059669; box-shadow: 0 8px 25px rgba(5,150,105,0.25); transform: scale(1.02); }
          }
        `}
      </style>

      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(2, 44, 34, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 999999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '500px',
          padding: '35px 30px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          animation: 'fadeInUp 0.4s ease',
          textAlign: 'center'
        }}>
          
          {isBlocked ? (
            // जब यूज़र ब्लॉक कर दे, तो यह सुंदर स्क्रीन दिखेगी
            <div style={{ animation: 'fadeInUp 0.3s ease' }}>
              {Notification.permission === 'denied' ? (
                // स्थिति 1: जब यूज़र ने सच में 'Block' कर दिया हो
                <>
                  <div style={{ width: '80px', height: '80px', background: '#FEF2F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#DC2626', fontSize: '35px', border: '2px solid #FCA5A5' }}>
                    <i className="fas fa-lock"></i>
                  </div>
                  <h2 style={{ color: '#DC2626', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                    आपने अनुमति ब्लॉक कर दी है!
                  </h2>
                  <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.6', marginBottom: '25px', padding: '0 10px' }}>
                    वेबसाइट में प्रवेश करने के लिए कृपया पहले इसे Unblock करें, फिर आगे बढ़ें:
                  </p>

                  <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '16px', textAlign: 'left', border: '1px solid #E2E8F0', marginBottom: '30px', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '15px' }}>
                      <span style={{ background: '#E2E8F0', color: '#334155', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', flexShrink: 0 }}>1</span>
                      <span style={{ fontSize: '14px', color: '#1E293B', fontWeight: '600', lineHeight: '1.5' }}>ऊपर ब्राउज़र के एड्रेस बार (URL) के बगल में ताले <strong style={{color: '#059669'}}>(🔒)</strong> या <strong style={{color: '#059669'}}>(ℹ️)</strong> पर क्लिक करें।</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '15px' }}>
                      <span style={{ background: '#E2E8F0', color: '#334155', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', flexShrink: 0 }}>2</span>
                      <span style={{ fontSize: '14px', color: '#1E293B', fontWeight: '600', lineHeight: '1.5' }}>वहाँ 'Permissions' या 'Site Settings' में जाकर <strong>Notifications</strong> को खोजें।</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ background: '#E2E8F0', color: '#334155', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', flexShrink: 0 }}>3</span>
                      <span style={{ fontSize: '14px', color: '#1E293B', fontWeight: '600', lineHeight: '1.5' }}>उसे <strong style={{color: '#059669'}}>'Allow'</strong> (चालू) करें।</span>
                    </div>
                  </div>

                  <button onClick={() => window.location.reload()} style={{ width: '100%', background: 'linear-gradient(135deg, #064E3B, #047857)', color: '#fff', border: 'none', padding: '18px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(6,78,59,0.3)', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    मैंने Unblock कर दिया है (आगे बढ़ें) <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                  </button>
                </>
              ) : (
                // स्थिति 2: जब यूज़र ने केवल पॉपअप को क्लोज किया हो (बिना Allow किए)
                <>
                  <div style={{ width: '80px', height: '80px', background: '#FFFBEB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#D97706', fontSize: '35px', border: '2px solid #FDE68A' }}>
                    <i className="fas fa-bell-slash"></i>
                  </div>
                  <h2 style={{ color: '#D97706', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                    आपने Allow नहीं किया है!
                  </h2>
                  <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.6', marginBottom: '25px', padding: '0 10px' }}>
                    वेबसाइट की महत्वपूर्ण सूचनाएं और अलर्ट्स प्राप्त करने के लिए कृपया ब्राउज़र द्वारा पूछे जाने पर <strong>'Allow'</strong> चुनें।
                  </p>
                  
                  <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px dashed #CBD5E1', marginBottom: '30px' }}>
                    <i className="fas fa-hand-pointer" style={{ fontSize: '35px', color: '#059669', marginBottom: '15px', display: 'block' }}></i>
                    <p style={{ fontSize: '14.5px', color: '#1E293B', fontWeight: '600', margin: 0, lineHeight: '1.5' }}>
                      कृपया नोटिफिकेशन पॉपअप में <br/><span style={{ color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: '6px', border: '1px solid #A7F3D0', display: 'inline-block', marginTop: '8px', fontSize: '15px' }}>Allow / अनुमति दें</span> <br/>पर क्लिक करें।
                    </p>
                  </div>

                  <button onClick={() => setIsBlocked(false)} style={{ width: '100%', background: 'linear-gradient(135deg, #064E3B, #047857)', color: '#fff', border: 'none', padding: '18px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(6,78,59,0.3)', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    फिर से प्रयास करें (Try Again) <i className="fas fa-redo" style={{ marginLeft: '8px' }}></i>
                  </button>
                </>
              )}
            </div>
          ) : (
            // नॉर्मल स्क्रीन (जब तक ब्लॉक न हो)
            <div style={{ animation: 'fadeInUp 0.3s ease' }}>
              {/* Animated Tutorial Box (हाथ से टिक करने का एनिमेशन) */}
              <div style={{
                width: '260px',
                height: '180px',
            background: '#F8FAFC',
            borderRadius: '16px',
            border: '2px solid #E2E8F0',
            margin: '0 auto 30px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.02), 0 15px 30px rgba(0,0,0,0.08)'
          }}>
            {/* Fake Browser Header */}
            <div style={{ background: '#E2E8F0', height: '24px', width: '100%', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FCA5A5' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FDE047' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#86EFAC' }}></div>
            </div>

            {/* Fake Notification Prompt */}
            <div style={{ background: '#fff', border: '1px solid #CBD5E1', borderRadius: '10px', margin: '15px auto', width: '85%', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '13px', color: '#334155', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fas fa-bell" style={{color: '#D4AF37'}}></i> पंचायत अलर्ट्स</div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '12px', padding: '5px 12px', background: '#F1F5F9', color: '#64748B', borderRadius: '6px' }}>Block</div>
                <div className="anim-allow" style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '6px', fontWeight: 'bold', transition: 'all 0.2s' }}>Allow</div>
              </div>
            </div>

            {/* Fake Checkbox area */}
            <div style={{ position: 'absolute', bottom: '25px', left: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '22px', height: '22px', border: '2px solid #059669', borderRadius: '6px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-check anim-tick" style={{ color: '#059669', fontSize: '14px' }}></i>
              </div>
              <div style={{ width: '60px', height: '8px', background: '#CBD5E1', borderRadius: '4px' }}></div>
            </div>

            {/* Hand Pointer Icon */}
            <i className="fas fa-hand-pointer anim-hand" style={{ position: 'absolute', bottom: '15px', right: '25px', fontSize: '32px', color: '#1E293B', filter: 'drop-shadow(0 5px 8px rgba(0,0,0,0.3))', zIndex: 10 }}></i>
          </div>
        
        <h2 style={{ color: '#064E3B', fontSize: '26px', fontWeight: '700', marginBottom: '12px' }}>
          महत्वपूर्ण सूचनाएं पाएं
        </h2>
        <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.6', marginBottom: '30px', padding: '0 10px' }}>
          ग्राम पंचायत पथरिया जाट की नवीनतम योजनाओं, विकास कार्यों और पंचायत के महत्वपूर्ण अलर्ट्स की जानकारी तुरंत प्राप्त करने के लिए नोटिफिकेशन अनुमति प्रदान करें।
        </p>

        <label style={{ display: 'flex', alignItems: 'center', gap: '15px', background: isAgreed ? '#ECFDF5' : '#F8FAFC', padding: '20px', borderRadius: '16px', border: isAgreed ? '2px solid #10B981' : '2px dashed #CBD5E1', cursor: isLoading ? 'not-allowed' : 'pointer', textAlign: 'left', transition: 'all 0.3s', boxShadow: isAgreed ? '0 8px 25px rgba(16, 185, 129, 0.2)' : 'none', animation: !isAgreed ? 'pulse-border 2s infinite' : 'none', margin: 0, opacity: isLoading ? 0.7 : 1 }}>
          <div style={{ position: 'relative', width: '28px', height: '28px', flexShrink: 0 }}>
            <input 
              type="checkbox" 
              checked={isAgreed} 
              onChange={handleCheckboxChange} 
              disabled={isLoading}
              style={{ width: '100%', height: '100%', cursor: isLoading ? 'not-allowed' : 'pointer', accentColor: '#10B981', margin: 0 }} 
            />
          </div>
          <span style={{ fontSize: '16px', color: isAgreed ? '#064E3B' : '#334155', fontWeight: isAgreed ? '700' : '600', lineHeight: '1.5', transition: 'color 0.3s' }}>
            {isLoading ? '⏳ सेटअप हो रहा है...' : <>प्रवेश के लिए यहाँ <span style={{color: '#059669'}}>टिक (✔)</span> करें और ऊपर <span style={{color: '#059669'}}>'Allow'</span> दबाएं</>}
          </span>
        </label>
            </div>
          )}
      </div>
    </div>
    </>
  );
}

export default PermissionModal;
