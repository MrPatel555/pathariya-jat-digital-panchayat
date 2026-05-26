import React, { useState, useEffect, useRef } from 'react';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function AavedanSujhav() {
  const [formType, setFormType] = useState('aavedan'); // 'aavedan' or 'sujhav'
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);
  
  // 1. Voice Typing States (बोलकर लिखना)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // 2. Audio Recording States (आवाज़ रिकॉर्ड करना)
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState(null);
  const [location, setLocation] = useState(null);
  
  // चेकबॉक्स (Permission) स्टेट
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  
  // सबमिशन और ट्रैकिंग स्टेट्स
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // लोडिंग स्टेट

  // स्टेटस चेक करने के लिए स्टेट्स
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [searchRefId, setSearchRefId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    // पेज खुलने पर स्क्रीन को सबसे ऊपर ले जाने के लिए
    window.scrollTo(0, 0);
  }, []);

  // रीयल-टाइम अपडेट और नोटिफिकेशन के लिए (API Polling)
  useEffect(() => {
    let interval;
    if (submittedData?.isTracking && submittedData?.refNumber) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_URL}/api/applications/${submittedData.refNumber}`);
          if (res.ok) {
            const updatedApp = await res.json();
            if (updatedApp && (updatedApp.status !== submittedData.status || updatedApp.note !== submittedData.note)) {
              setSubmittedData(prev => ({
                ...prev,
                status: updatedApp.status,
                note: updatedApp.note || ''
              }));
              
              if ('Notification' in window && Notification.permission === 'granted') {
                const title = "पंचायत अपडेट: " + updatedApp.id;
                const options = { 
                  body: `आपके फॉर्म की स्थिति '${updatedApp.status}' हो गई है।\nअधिकारी की टिप्पणी: ${updatedApp.note || 'कोई टिप्पणी नहीं'}`,
                  icon: '/logo.png' 
                };
                
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.register('/sw.js').then(reg => {
                    reg.showNotification(title, options);
                  }).catch(e => {
                    try { new Notification(title, options); } catch(err) {}
                  });
                } else {
                  try { new Notification(title, options); } catch(e) {}
                }
              }
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 10000); // हर 10 सेकंड में चेक करें
    }
    return () => clearInterval(interval);
  }, [submittedData]);

  // --- Checkbox Permission Logic - सिर्फ Location ---
  const handlePermissionChange = (e) => {
    const checked = e.target.checked;
    setIsCheckboxChecked(checked);
    console.log('✅ Permission checkbox:', checked);

    if (checked) {
      // लाइव लोकेशन परमिशन - Simple & Direct
      if ('geolocation' in navigator) {
        console.log('📍 Requesting location permission...');
        
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            // ✅ Location मिल गया
            const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            console.log('📍 ✅ Location obtained:', newLoc);
            
            try {
              // Address reverse-geocode करने की कोशिश
              console.log('🌐 Fetching address...');
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLoc.lat}&lon=${newLoc.lng}`);
              if (res.ok) {
                const data = await res.json();
                newLoc.address = data.display_name;
                console.log('✅ Address:', newLoc.address);
              }
            } catch (err) {
              console.warn('⚠️ Address not available, using coordinates');
              newLoc.address = `${newLoc.lat.toFixed(4)}, ${newLoc.lng.toFixed(4)}`;
            }
            
            console.log('📍 Final location:', newLoc);
            setLocation(newLoc);
          },
          (err) => {
            // Permission denied
            console.error('❌ Location permission error:', err);
            setIsCheckboxChecked(false);
            
            if (err.code === err.PERMISSION_DENIED) {
              alert("❌ आपने लोकेशन की अनुमति देने से मना कर दिया है। \n\n🔒 फॉर्म जमा करने के लिए:\n1. URL बार में 🔒 पर क्लिक करें\n2. Location को 'Allow' करें\n3. फिर से checkbox दबाएं");
            } else {
              alert("⚠️ लोकेशन प्राप्त नहीं हो सकी। कृपया Location चालू करें।");
            }
          },
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
        );
      } else {
        console.error('❌ Geolocation not available');
        setIsCheckboxChecked(false);
        alert("आपका ब्राउज़र लोकेशन सर्विस सपोर्ट नहीं करता है।");
      }
    } else {
      console.log('📍 Location cleared');
      setLocation(null);
    }
  };

  // --- Voice Typing Logic ---
  const handleVoiceTyping = (e) => {
    if (e) e.preventDefault();
    
    // Allow on HTTPS or localhost only
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    if (!isSecure) {
      alert("ब्राउज़र सुरक्षा: वॉइस टाइपिंग के लिए HTTPS (सुरक्षित कनेक्शन) आवश्यक है।");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("आपका ब्राउज़र वॉइस इनपुट सपोर्ट नहीं करता है। कृपया क्रोम (Chrome) का उपयोग करें।");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'hi-IN'; // हिंदी में टाइप करने के लिए
      recognition.interimResults = true;
      recognition.continuous = true;

      const startText = description;

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event) => {
        let transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setDescription(startText + (startText && transcript ? ' ' : '') + transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech error:', event.error);
        if (event.error === 'not-allowed') alert("माइक्रोफ़ोन (Mic) की परमिशन नहीं मिली है।");
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  // --- Audio Recording Logic ---
  const startRecording = async (e) => {
    if (e) e.preventDefault();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop()); // माइक बंद करें
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing mic:", err);
      alert("माइक्रोफ़ोन एक्सेस नहीं हो पा रहा है। कृपया परमिशन चेक करें।");
    }
  };

  const stopRecording = (e) => {
    if (e) e.preventDefault();
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    setAudioURL(null);
    audioChunksRef.current = [];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true); // सबमिट करते ही लोडिंग एनीमेशन शुरू करें
    
    const processSubmit = (liveLoc) => {
      // लोकेशन अनिवार्य है। अगर लोकेशन नहीं मिली तो फॉर्म सबमिट नहीं होगा।
      if (!liveLoc) {
        alert("लाइव लोकेशन प्राप्त नहीं हो सकी। कृपया चेकबॉक्स पर टिक करें और लोकेशन की अनुमति (Allow) दें।");
        setIsLoading(false); // एरर पर लोडिंग रोकें
        return;
      }

      // यहाँ आप API या Backend में फॉर्म डेटा (text, audio file, liveLoc) भेज सकते हैं
      console.log("Submitting form with location:", liveLoc);
      
      const successMsg = formType === 'aavedan' 
        ? "आपका आवेदन सफलतापूर्वक सबमिट कर दिया गया है। पंचायत सचिव जल्द ही आपसे संपर्क करेंगे।" 
        : "आपका बहुमूल्य सुझाव पंचायत को प्राप्त हो गया है। धन्यवाद!";

      // रेफरेंस नंबर और आज की तारीख जनरेट करना
      const newRefNum = 'PJ-' + Math.floor(100000 + Math.random() * 900000);
      const today = new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeNow = new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' });

      // डेटा को Backend (Database) में सेव करना
      const formData = new FormData(e.target);
      const newApp = {
        id: newRefNum,
        type: formType,
        name: formData.get('applicantName') || 'अज्ञात',
        mobile: formData.get('mobile') || 'जानकारी नहीं',
        ward: formData.get('ward') || 'जानकारी नहीं',
        category: formData.get('category') || 'other',
        date: today,
        time: timeNow,
        status: 'Pending',
        description: description,
        note: '',
        location: liveLoc
      };
      
      fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      })
      .then(res => {
        if (!res.ok) throw new Error("Server Error");
        setSubmittedData({ refNumber: newRefNum, date: today, time: timeNow, location: liveLoc, status: 'Pending', note: '' });
        setIsSubmitted(true); // सफलता वाली स्क्रीन (UI) दिखाएं
        setIsLoading(false); // सफलता पर लोडिंग रोकें
        
        // फॉर्म सबमिट होने पर सिस्टम का पुश नोटिफिकेशन भेजना
        const sendLocalNotification = () => {
          const title = "पंचायत पोर्टल";
          const options = { body: successMsg, icon: '/logo.png' };
          
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(reg => {
              reg.showNotification(title, options);
            }).catch(e => {
              try { new Notification(title, options); } catch(err) {}
            });
          } else {
            try { new Notification(title, options); } catch(e) {}
          }
        };

        if ('Notification' in window) {
          if (Notification.permission === 'granted') {
            sendLocalNotification();
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                sendLocalNotification();
              }
            });
          }
        }
      })
      .catch(err => {
        console.error("Submit Error:", err);
        alert("सर्वर से जुड़ने में समस्या हुई। कृपया सुनिश्चित करें कि Backend Server चल रहा है।");
        setIsLoading(false);
      });
    };

    // सबमिट करते समय बिलकुल ताज़ा (Live) लोकेशन कैप्चर करना
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLoc.lat}&lon=${newLoc.lng}`);
            const data = await res.json();
            newLoc.address = data.display_name;
          } catch (err) {
            newLoc.address = '';
          }
          setLocation(newLoc);
          processSubmit(newLoc);
        },
        async (err) => {
          // अगर अभी लोकेशन फेल हो जाए, तो पुरानी (Load Time) लोकेशन का इस्तेमाल करें
          if (location && !location.address) {
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`);
              const data = await res.json();
              location.address = data.display_name;
            } catch (error) {
              location.address = '';
            }
          }
          processSubmit(location);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setIsLoading(false);
      alert("आपका ब्राउज़र लोकेशन सर्विस सपोर्ट नहीं करता है।");
    }
  };

  // कॉपी करने का फंक्शन
  const copyToClipboard = () => {
    if (submittedData?.refNumber) {
      navigator.clipboard.writeText(submittedData.refNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // स्थिति (Status) खोजने का फंक्शन
  const handleSearchStatus = async (e) => {
    e.preventDefault();
    setSearchError('');
    setSearchResult(null);
    
    if (!searchRefId.trim()) {
      setSearchError('कृपया मान्य रेफरेंस नंबर दर्ज करें।');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/applications/${searchRefId.trim()}`);
      if (res.ok) {
        const found = await res.json();
        // फॉर्म की तरह ही पूरा पेज दिखाने के लिए डेटा सेट करें
        setSubmittedData({
          refNumber: found.id,
          date: found.date,
          time: found.time,
          status: found.status,
          note: found.note || '',
          isTracking: true // यह पहचानने के लिए कि यह पुराना फॉर्म है
        });
        setFormType(found.type);
        setIsSubmitted(true);
        setShowStatusModal(false);
        setSearchRefId('');
      } else {
        setSearchError('इस रेफरेंस नंबर से कोई रिकॉर्ड नहीं मिला। कृपया नंबर जांचें।');
      }
    } catch (err) {
      console.error(err);
      setSearchError('सर्वर से जुड़ने में समस्या हुई। कृपया सुनिश्चित करें कि Backend Server चल रहा है।');
    }
  };

  // स्टेटस और कलर्स को डायनामिक बनाने के लिए
  const currentStatus = submittedData?.status || 'Pending';
  const isUnderReview = currentStatus === 'Under Review' || currentStatus === 'In Progress' || currentStatus === 'Resolved';
  const isInProgress = currentStatus === 'In Progress' || currentStatus === 'Resolved';
  const isResolved = currentStatus === 'Resolved';

  return (
    <div id="aavedan" className="aavedan-page" style={{ backgroundColor: '#FDFBF7', paddingBottom: '80px', display: 'block', visibility: 'visible', width: '100%' }}>
      
      <style>
        {`
          @keyframes pulse-mic-aavedan {
            0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
            100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
          }
          @keyframes spin-loader-aavedan {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse-icon-aavedan {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {/* Hero Banner Section */}
      <div style={{ 
        width: '100%', 
        height: '350px', 
        backgroundImage: 'linear-gradient(rgba(2, 44, 34, 0.85), rgba(2, 44, 34, 0.95)), url("https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&h=600&fit=crop")', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <div className="section-badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.5)', padding: '8px 20px', borderRadius: '30px', marginBottom: '20px', backdropFilter: 'blur(5px)', fontWeight: 'bold' }}>
          <i className="fas fa-edit"></i> जन संवाद पोर्टल
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '700', marginBottom: '15px', textShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
          ऑनलाइन <span style={{ color: '#D4AF37' }}>आवेदन एवं सुझाव</span>
        </h1>
        <p style={{ fontSize: '17px', maxWidth: '700px', lineHeight: '1.6', opacity: '0.9' }}>
          ग्राम पंचायत पथरिया जाट के विकास में भागीदार बनें। अपनी समस्या, शिकायत या कोई महत्वपूर्ण सुझाव सीधे पंचायत प्रतिनिधियों तक पहुँचाएं।
        </p>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '-40px auto 0', position: 'relative', zIndex: 10, padding: '0 24px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '40px', alignItems: 'start' }}>
          
          {/* Left Side: Form Area */}
          <div style={{ background: '#ffffff', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0', display: 'block', visibility: 'visible' }}>
            
            {/* Form Toggle (आवेदन / सुझाव) */}
            <div style={{ display: 'flex', background: '#F8FAFC', borderRadius: '12px', padding: '6px', marginBottom: '30px', border: '1px solid #E2E8F0' }}>
              <button 
                type="button"
                onClick={() => setFormType('aavedan')}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '16px', cursor: 'pointer', transition: 'all 0.3s', background: formType === 'aavedan' ? 'linear-gradient(135deg, #064E3B 0%, #047857 100%)' : 'transparent', color: formType === 'aavedan' ? '#fff' : '#64748B', boxShadow: formType === 'aavedan' ? '0 4px 10px rgba(6,78,59,0.2)' : 'none' }}
              >
                <i className="fas fa-file-alt" style={{ marginRight: '6px' }}></i> आवेदन / शिकायत
              </button>
              <button 
                type="button"
                onClick={() => setFormType('sujhav')}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '16px', cursor: 'pointer', transition: 'all 0.3s', background: formType === 'sujhav' ? 'linear-gradient(135deg, #D97706 0%, #B45309 100%)' : 'transparent', color: formType === 'sujhav' ? '#fff' : '#64748B', boxShadow: formType === 'sujhav' ? '0 4px 10px rgba(217,119,6,0.2)' : 'none' }}
              >
                <i className="fas fa-lightbulb" style={{ marginRight: '6px' }}></i> अपना सुझाव दें
              </button>
            </div>

            {/* Conditional Rendering: या तो फॉर्म (लोडिंग के साथ) या सफलता/ट्रैकिंग स्क्रीन */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeInUp 0.5s ease' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>पूरा नाम *</label>
                    <input type="text" name="applicantName" required placeholder="अपना नाम लिखें" style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '15px', outline: 'none', transition: 'border 0.3s' }} onFocus={e => e.target.style.borderColor = '#D4AF37'} onBlur={e => e.target.style.borderColor = '#CBD5E1'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>मोबाइल नंबर</label>
                    <input type="tel" name="mobile" placeholder="10 अंकों का नंबर" maxLength="10" pattern="[6789][0-9]{9}" title="कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें (शुरुआत 6, 7, 8 या 9 से)" onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '15px', outline: 'none', transition: 'border 0.3s' }} onFocus={e => e.target.style.borderColor = '#D4AF37'} onBlur={e => e.target.style.borderColor = '#CBD5E1'} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>वार्ड / मोहल्ला</label>
                    <input type="text" name="ward" placeholder="उदा: वार्ड नं. 4" style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '15px', outline: 'none', transition: 'border 0.3s' }} onFocus={e => e.target.style.borderColor = '#D4AF37'} onBlur={e => e.target.style.borderColor = '#CBD5E1'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>विषय (श्रेणी)</label>
                    <select name="category" style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '15px', outline: 'none', backgroundColor: '#fff', cursor: 'pointer' }}>
                      <option value="">-- श्रेणी चुनें --</option>
                      <option value="water">जल आपूर्ति / नल जल</option>
                      <option value="electricity">बिजली / स्ट्रीट लाइट</option>
                      <option value="road">सड़क / नाली निर्माण</option>
                      <option value="cleanliness">साफ-सफाई / कचरा</option>
                      <option value="pension">पेंशन / आवास योजना</option>
                      <option value="other">अन्य</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>
                    {formType === 'aavedan' ? 'समस्या का पूरा विवरण' : 'सुझाव का विवरण'}
                  </label>
                  
                  <div style={{ position: 'relative' }}>
                    <textarea rows="5" placeholder={isListening ? 'बोलिए, मैं सुन रहा हूँ...' : 'यहाँ विस्तार से लिखें...'} value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '15px 50px 15px 15px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '15px', outline: 'none', resize: 'vertical', transition: 'border 0.3s' }} onFocus={e => e.target.style.borderColor = '#D4AF37'} onBlur={e => e.target.style.borderColor = '#CBD5E1'}></textarea>
                    
                    <button type="button" onClick={handleVoiceTyping} title="बोलकर टाइप करें" style={{ position: 'absolute', top: '10px', right: '10px', background: isListening ? '#DC2626' : '#F1F5F9', color: isListening ? '#fff' : '#64748B', width: '35px', height: '35px', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', animation: isListening ? 'pulse-mic-aavedan 1.5s infinite' : 'none' }}>
                      <i className={isListening ? "fas fa-microphone" : "fas fa-microphone-alt"}></i>
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>वॉइस मैसेज (यदि आप बोलकर बताना चाहें)</label>
                  {!audioURL ? (
                    <button type="button" onClick={isRecording ? stopRecording : startRecording} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '30px', border: isRecording ? '1px solid #DC2626' : '1px solid #064E3B', background: isRecording ? '#FEF2F2' : '#F0FDF4', color: isRecording ? '#DC2626' : '#064E3B', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' }}>
                      <i className={`fas fa-${isRecording ? 'stop-circle' : 'microphone'}`} style={{ animation: isRecording ? 'pulse-mic-aavedan 1.5s infinite' : 'none' }}></i> 
                      {isRecording ? 'रिकॉर्डिंग बंद करें' : 'बोलकर रिकॉर्ड करें'}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#F8FAFC', padding: '10px 15px', borderRadius: '10px', border: '1px solid #CBD5E1' }}>
                      <audio src={audioURL} controls style={{ height: '35px', flex: 1 }}></audio>
                      <button type="button" onClick={deleteRecording} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="रिकॉर्डिंग हटाएं">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  )}
                </div>

                {formType === 'aavedan' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>संबंधित फोटो / दस्तावेज़ (यदि हो)</label>
                    <div style={{ display: 'block', border: '2px dashed #CBD5E1', padding: '20px', borderRadius: '10px', textAlign: 'center', backgroundColor: '#F8FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => fileInputRef.current?.click()} onMouseOver={e => e.currentTarget.style.borderColor = '#D4AF37'} onMouseOut={e => e.currentTarget.style.borderColor = '#CBD5E1'}>
                      <i className="fas fa-cloud-upload-alt" style={{ fontSize: '30px', color: '#94A3B8', marginBottom: '10px' }}></i>
                      <p style={{ margin: 0, fontSize: '14px', color: fileName ? '#064E3B' : '#64748B', fontWeight: fileName ? 'bold' : 'normal' }}>{fileName ? fileName : 'क्लिक करें और फोटो या फाइल चुनें'}</p>
                      <input ref={fileInputRef} type="file" style={{ display: 'none' }} accept="image/*,.pdf,.doc,.docx" onChange={(e) => {
                        if (e.target.files[0]) {
                          setFileName(e.target.files[0].name);
                          setFileData(e.target.files[0]);
                        }
                      }} />
                    </div>
                  </div>
                )}

                {/* Permission Checkbox */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#F8FAFC', padding: '15px', borderRadius: '10px', border: '1px solid #CBD5E1', marginTop: '10px' }}>
                  <input 
                    type="checkbox" 
                    id="perm-checkbox" 
                    checked={isCheckboxChecked}
                    onChange={handlePermissionChange}
                    required
                    style={{ width: '18px', height: '18px', marginTop: '3px', cursor: 'pointer' }}
                  />
                  <label htmlFor="perm-checkbox" style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.5', cursor: 'pointer', margin: 0 }}>
                    मैं प्रमाणित करता/करती हूँ कि दी गई जानकारी सही है। साथ ही, सुरक्षा एवं पारदर्शिता हेतु मैं अपनी <b>लाइव लोकेशन (GPS)</b> और <b>नोटिफिकेशन</b> की अनुमति देता/देती हूँ। <span style={{color: '#DC2626'}}>*</span>
                  </label>
                </div>

                {/* लाइव लोकेशन इंडिकेटर */}
                {isCheckboxChecked && location && (
                  <div style={{ fontSize: '14px', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 12px', marginTop: '8px', background: '#ECFDF5', border: '2px solid #10B981', borderRadius: '8px', fontWeight: '600' }}>
                    <i className="fas fa-map-marker-alt" style={{ fontSize: '16px' }}></i>
                    <span>📍 लाइव लोकेशन संलग्न: <strong>{location.address && location.address.length > 0 ? location.address : `${location.lat.toFixed(4)}°, ${location.lng.toFixed(4)}°`}</strong></span>
                  </div>
                )}
                {isCheckboxChecked && !location && (
                  <div style={{ fontSize: '13px', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 12px', marginTop: '8px', background: '#FFFBEB', border: '2px solid #FBBF24', borderRadius: '8px', fontWeight: '500' }}>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>📍 लोकेशन प्राप्त कर रहे हैं... कृपया प्रतीक्षा करें</span>
                  </div>
                )}

                <button type="submit" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1, marginTop: '10px', background: 'linear-gradient(135deg, #D4AF37, #9A7B3E)', color: '#022C22', padding: '16px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: '700', cursor: isLoading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 20px rgba(212,175,55,0.3)', transition: 'all 0.3s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onMouseOver={e => !isLoading && (e.currentTarget.style.transform = 'translateY(-3px)')} onMouseOut={e => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}>
                  {isLoading ? 'प्रतीक्षा करें...' : (formType === 'aavedan' ? 'आवेदन दर्ज करें' : 'सुझाव भेजें')} 
                  <i className={isLoading ? "fas fa-spinner fa-spin" : "fas fa-paper-plane"}></i>
                </button>

              {/* स्टेटस चेक करने का लिंक (Forgot Password की तरह) */}
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <button type="button" onClick={() => setShowStatusModal(true)} style={{ background: 'transparent', border: 'none', color: '#064E3B', fontSize: '15px', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#D4AF37'} onMouseOut={e => e.target.style.color = '#064E3B'}>
                  <i className="fas fa-search"></i> अपने पहले के आवेदन की स्थिति (Status) देखें
                </button>
              </div>

              </form>
            ) : (
              <div style={{ textAlign: 'center', animation: 'fadeInUp 0.5s ease', padding: '20px 0' }}>
                <i className="fas fa-check-circle" style={{ fontSize: '60px', color: '#059669', marginBottom: '20px' }}></i>
                <h2 style={{ fontSize: '26px', color: '#064E3B', marginBottom: '10px', fontWeight: '700' }}>
                  {submittedData?.isTracking ? 'आपके आवेदन की स्थिति (Track Status)' : (formType === 'aavedan' ? 'आवेदन सफलतापूर्वक दर्ज हुआ!' : 'सुझाव सफलतापूर्वक भेजा गया!')}
                </h2>
                <p style={{ color: '#64748B', marginBottom: '30px', fontSize: '16px' }}>
                  {submittedData?.isTracking ? 'नीचे आपके द्वारा दर्ज किए गए फॉर्म की वर्तमान स्थिति (Live Status) दी गई है।' : 'पंचायत प्रतिनिधि जल्द ही इस पर संज्ञान लेंगे और आवश्यक कार्यवाही करेंगे।'}
                </p>
                
                {/* Reference Details Box */}
                <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px dashed #CBD5E1', marginBottom: '30px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748B', fontWeight: '600', fontSize: '15px' }}>रेफरेंस नंबर (Ref ID):</span>
                    <span style={{ color: '#1E293B', fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {submittedData?.refNumber}
                      <button type="button" onClick={copyToClipboard} title="कॉपी करें" style={{ background: 'transparent', border: 'none', color: isCopied ? '#059669' : '#64748B', cursor: 'pointer', transition: 'color 0.3s', fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                        <i className={isCopied ? "fas fa-check-circle" : "fas fa-copy"}></i>
                      </button>
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748B', fontWeight: '600', fontSize: '15px' }}>जमा करने की तिथि:</span>
                    <span style={{ color: '#1E293B', fontWeight: '700', fontSize: '16px', textAlign: 'right' }}>
                      {submittedData?.date}
                      {submittedData?.time && <><br /><span style={{ fontSize: '13.5px', color: '#64748B', fontWeight: '600' }}>{submittedData.time}</span></>}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B', fontWeight: '600', fontSize: '15px' }}>वर्तमान स्थिति:</span>
                    <span style={{ background: currentStatus === 'Resolved' ? '#D1FAE5' : (currentStatus === 'Pending' ? '#FEF3C7' : '#DBEAFE'), color: currentStatus === 'Resolved' ? '#059669' : (currentStatus === 'Pending' ? '#D97706' : '#2563EB'), padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: `1px solid ${currentStatus === 'Resolved' ? '#A7F3D0' : (currentStatus === 'Pending' ? '#FDE68A' : '#BFDBFE')}` }}>
                      {currentStatus === 'Pending' ? 'लंबित (Pending)' : currentStatus === 'Under Review' ? 'समीक्षा अधीन' : currentStatus === 'In Progress' ? 'कार्य प्रगति पर' : 'निराकृत (Resolved)'}
                    </span>
                  </div>
                </div>

                {/* Tracking Status Timeline */}
                <div style={{ position: 'relative', textAlign: 'left', background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
                  <h3 style={{ fontSize: '18px', color: '#1E293B', marginBottom: '25px', fontWeight: '700', display: 'flex', alignItems: 'center' }}><i className="fas fa-route" style={{ color: '#D4AF37', marginRight: '8px', fontSize: '20px' }}></i> लाइव ट्रैकिंग स्थिति</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '17px', top: '10px', bottom: '20px', width: '2px', background: '#E2E8F0', zIndex: 1 }}></div>
                    
                    <div style={{ display: 'flex', gap: '15px', position: 'relative', zIndex: 2 }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0, boxShadow: '0 0 0 4px #fff' }}><i className="fas fa-check"></i></div>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', color: '#064E3B', fontSize: '16px', fontWeight: '700' }}>दर्ज किया गया (Submitted)</h4>
                        <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>आपका फॉर्म सफलतापूर्वक प्राप्त हो गया है।</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px', position: 'relative', zIndex: 2 }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isUnderReview ? '#059669' : '#F8FAFC', border: isUnderReview ? 'none' : '2px solid #CBD5E1', color: isUnderReview ? '#fff' : '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0, boxShadow: '0 0 0 4px #fff' }}><i className="fas fa-search"></i></div>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', color: isUnderReview ? '#064E3B' : '#94A3B8', fontSize: '16px', fontWeight: isUnderReview ? '700' : '600' }}>समीक्षा अधीन (Under Review)</h4>
                        <p style={{ margin: 0, color: isUnderReview ? '#64748B' : '#94A3B8', fontSize: '14px' }}>संबंधित अधिकारी द्वारा जाँच की जा रही है।</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', position: 'relative', zIndex: 2 }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isInProgress ? '#059669' : '#F8FAFC', border: isInProgress ? 'none' : '2px solid #CBD5E1', color: isInProgress ? '#fff' : '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0, boxShadow: '0 0 0 4px #fff' }}><i className="fas fa-tools"></i></div>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', color: isInProgress ? '#064E3B' : '#94A3B8', fontSize: '16px', fontWeight: isInProgress ? '700' : '600' }}>कार्य प्रगति पर (In Progress)</h4>
                        <p style={{ margin: 0, color: isInProgress ? '#64748B' : '#94A3B8', fontSize: '14px' }}>इस विषय पर कार्यवाही शुरू हो चुकी है।</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', position: 'relative', zIndex: 2 }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isResolved ? '#059669' : '#F8FAFC', border: isResolved ? 'none' : '2px solid #CBD5E1', color: isResolved ? '#fff' : '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0, boxShadow: '0 0 0 4px #fff' }}><i className="fas fa-flag-checkered"></i></div>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', color: isResolved ? '#064E3B' : '#94A3B8', fontSize: '16px', fontWeight: isResolved ? '700' : '600' }}>निराकृत (Resolved)</h4>
                        <p style={{ margin: 0, color: isResolved ? '#64748B' : '#94A3B8', fontSize: '14px' }}>आवेदन/समस्या का पूर्ण समाधान कर दिया गया है।</p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Note Box */}
                  <div style={{ marginTop: '25px', background: '#F0F9FF', border: '1px solid #BAE6FD', borderLeft: '5px solid #0284C7', borderRadius: '12px', padding: '20px', textAlign: 'left', boxShadow: '0 4px 10px rgba(2, 132, 199, 0.05)' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#0369A1', fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fas fa-comment-dots"></i> अधिकारी की टिप्पणी (Admin Note)
                    </h4>
                    <p style={{ margin: 0, color: '#334155', fontSize: '14.5px', lineHeight: '1.6' }}>
                      {submittedData?.note ? submittedData.note : 'आपका फॉर्म सफलतापूर्वक प्राप्त कर लिया गया है। इसे संबंधित विभाग को समीक्षा के लिए भेज दिया गया है। कार्य की प्रगति या किसी भी कारणवश देरी होने पर पंचायत कार्यालय का संदेश यहीं प्रदर्शित होगा।'}
                    </p>
                  </div>
                </div>

                <button type="button" onClick={() => {setIsSubmitted(false); setSubmittedData(null); setIsCheckboxChecked(false); setLocation(null);}} style={{ marginTop: '40px', background: 'rgba(6, 78, 59, 0.1)', color: '#064E3B', padding: '14px 28px', borderRadius: '30px', border: '1px solid rgba(6, 78, 59, 0.2)', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s' }} onMouseOver={e => {e.currentTarget.style.background = '#064E3B'; e.currentTarget.style.color = '#fff';}} onMouseOut={e => {e.currentTarget.style.background = 'rgba(6, 78, 59, 0.1)'; e.currentTarget.style.color = '#064E3B';}}>
                  <i className="fas fa-redo-alt" style={{ marginRight: '8px' }}></i> नया आवेदन / सुझाव दर्ज करें
                </button>
              </div>
            )}
          </div>

          {/* Right Side: Information & Helplines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Instructions Card */}
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', borderTop: '4px solid #064E3B' }}>
              <h3 style={{ fontSize: '20px', color: '#064E3B', marginBottom: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-info-circle" style={{ color: '#D4AF37' }}></i> महत्वपूर्ण निर्देश
              </h3>
              <ul style={{ paddingLeft: '20px', color: '#4B5563', fontSize: '15px', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '10px' }}>आवेदन दर्ज करने के बाद आपको एक <strong>रेफरेंस नंबर (Reference ID)</strong> प्राप्त होगा।</li>
                <li style={{ marginBottom: '10px' }}>कृपया अपनी समस्या का सटीक और स्पष्ट विवरण लिखें ताकि जल्द समाधान हो सके।</li>
                <li style={{ marginBottom: '10px' }}>फर्जी या भ्रामक जानकारी दर्ज करने पर आवेदन निरस्त कर दिया जाएगा।</li>
                <li>आपातकालीन स्थिति में सीधा हेल्पलाइन नंबरों पर कॉल करें।</li>
              </ul>
            </div>

            {/* Important Helplines */}
            <div style={{ background: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(6,78,59,0.2)', color: '#fff' }}>
              <h3 style={{ fontSize: '20px', color: '#D4AF37', marginBottom: '20px', fontWeight: '700', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                <i className="fas fa-phone-alt"></i> आपातकालीन संपर्क
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#FCA5A5' }}>
                    <i className="fas fa-headset"></i>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>CM Helpline (म.प्र.)</h4>
                    <span style={{ fontSize: '22px', fontWeight: '700', color: '#FCA5A5' }}>181</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#86EFAC' }}>
                    <i className="fas fa-building"></i>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>पंचायत कार्यालय</h4>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#86EFAC' }}>07496 - 224XXX</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#FDE047' }}>
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>ईमेल समर्थन</h4>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#FDE047' }}>contact@pathariyajat.in</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Status Modal (स्थिति चेक करने का पॉपअप बॉक्स) */}
      {showStatusModal && (
        <div className="lightbox-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(5px)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
           <div style={{ background: '#fff', width: '100%', maxWidth: '600px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', animation: 'fadeInUp 0.3s ease' }}>
              
              {/* Modal Header */}
              <div style={{ background: 'linear-gradient(135deg, #064E3B, #047857)', padding: '20px 25px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fas fa-search" style={{ color: '#D4AF37' }}></i> आवेदन स्थिति (Track Status)</h3>
                 <button onClick={() => {setShowStatusModal(false); setSearchResult(null); setSearchRefId(''); setSearchError('');}} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '28px', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
              </div>
              
              {/* Modal Body */}
              <div style={{ padding: '25px', maxHeight: '75vh', overflowY: 'auto' }}>
                 <form onSubmit={handleSearchStatus} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input type="text" placeholder="अपना रेफरेंस नंबर दर्ज करें (उदा: PJ-123456)" value={searchRefId} onChange={(e) => setSearchRefId(e.target.value)} style={{ flex: 1, padding: '14px 15px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '15px', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#D4AF37'} onBlur={e => e.target.style.borderColor = '#CBD5E1'} />
                    <button type="submit" style={{ background: 'linear-gradient(135deg, #D4AF37, #9A7B3E)', color: '#022C22', border: 'none', padding: '0 25px', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(212,175,55,0.3)' }}>खोजें</button>
                 </form>
                 
                 {searchError && (
                   <div style={{ color: '#DC2626', background: '#FEF2F2', padding: '15px', borderRadius: '10px', marginBottom: '20px', fontSize: '14.5px', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <i className="fas fa-exclamation-circle"></i> {searchError}
                   </div>
                 )}

                 {searchResult && (
                   <div style={{ background: '#F0FDF4', padding: '20px', borderRadius: '10px', border: '1px solid #DCFCE7', color: '#059669' }}>
                     <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>✓ रिकॉर्ड मिल गया!</p>
                     <p style={{ margin: '5px 0', fontSize: '14px' }}>रेफरेंस: <strong>{searchResult.id}</strong></p>
                     <p style={{ margin: '5px 0', fontSize: '14px' }}>स्थिति: <strong>{searchResult.status}</strong></p>
                   </div>
                 )}
                 
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

export default AavedanSujhav;