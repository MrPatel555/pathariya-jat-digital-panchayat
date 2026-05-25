import React from 'react';

function LiveFeeds() {
  // योजनाएं (इन्हें आप अपने अनुसार बदल सकते हैं, बाद में इसे API से भी जोड़ा जा सकता है)
  const schemes = [
    "पीएम किसान सम्मान निधि योजना - ई-केवाईसी अपडेट शुरू",
    "मुख्यमंत्री लाडली बहना योजना - नई सूची जारी",
    "आयुष्मान भारत योजना - नए कार्ड हेतु पंजीकरण",
    "प्रधानमंत्री आवास योजना (ग्रामीण) - 2024-25 आवेदन",
    "मनरेगा (MGNREGA) - जॉब कार्ड नवीनीकरण चालू",
    "उज्ज्वला योजना 2.0 - मुफ्त गैस कनेक्शन",
    "पीएम विश्वकर्मा योजना - कारीगरों के लिए ऋण",
    "स्वच्छ भारत मिशन - व्यक्तिगत शौचालय अनुदान"
  ];

  return (
    <div className="live-feeds-section" id="live-feeds">
      <div className="feeds-container">
        <div className="stats-title-wrap">
          <div className="section-badge" style={{ background: '#F0FDF4', color: '#064E3B', borderColor: '#A7F3D0' }}>
            <i className="fas fa-rss"></i> लाइव अपडेट्स
          </div>
          <h2>
            नवीनतम सूचनाएं एवं <span>सोशल फीड्स</span>
          </h2>
          <div className="underline"></div>
          <p className="section-subtitle">
            गाँव के लिए महत्वपूर्ण सरकारी योजनाओं की लाइव जानकारी और पंचायत के सोशल मीडिया अपडेट्स।
          </p>
        </div>

        <div className="feeds-grid">
          
          {/* 1. Left Card: Google / Govt Schemes (Scrolling) */}
          <div className="feed-card">
            <div className="feed-header" style={{ background: 'linear-gradient(135deg, #064E3B, #047857)' }}>
              <h3><i className="fas fa-newspaper"></i> सरकारी योजनाएं (Live)</h3>
            </div>
            <div className="feed-body">
              <div className="scroll-content-up">
                {[...schemes, ...schemes].map((scheme, idx) => (
                  <div key={idx} className="feed-item">
                    <div className="feed-icon"><i className="fas fa-bell"></i></div>
                    <p>{scheme}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Middle Card: Facebook Live Feed */}
          <div className="feed-card">
            <div className="feed-header" style={{ background: 'linear-gradient(135deg, #1877F2, #0C4A6E)' }}>
              <h3><i className="fab fa-facebook"></i> फेसबुक फीड</h3>
            </div>
            <div className="feed-body fb-body">
              {/* आप "DigitalIndia" की जगह अपने फेसबुक पेज का नाम डाल सकते हैं */}
              <iframe 
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FDigitalIndia&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" 
                width="100%" 
                height="100%" 
                style={{ border: 'none', overflow: 'hidden' }} 
                scrolling="no" 
                frameBorder="0" 
                allowFullScreen={true} 
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Facebook Feed"
              ></iframe>
            </div>
          </div>

          {/* 3. Right Card: Instagram Live Feed */}
          <div className="feed-card">
            <div className="feed-header" style={{ background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F56040)' }}>
              <h3><i className="fab fa-instagram"></i> इंस्टाग्राम फीड</h3>
            </div>
            <div className="feed-body ig-body">
              {/* Instagram डायरेक्ट iframe को ब्लॉक करता है, इसलिए यहाँ एक फ्री Widget लगाया जाता है */}
              <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                <i className="fab fa-instagram" style={{ fontSize: '40px', color: '#E1306C', marginBottom: '15px' }}></i>
                <h4 style={{ color: '#1E293B', marginBottom: '10px' }}>Instagram Widget Area</h4>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6' }}>यहाँ आपका Instagram फीड अपने आप अपडेट होगा। (Elfsight या EmbedSocial का विजेट कोड यहाँ पेस्ट करें)</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LiveFeeds;