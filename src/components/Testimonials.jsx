import React, { useState, useEffect } from 'react';

function Testimonials() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [testimonials, setTestimonials] = useState(() => {
    const saved = localStorage.getItem('panchayat_testimonials_data');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'श्री रमेश कुशवाहा', role: 'किसान', category: 'कृषि एवं बुनियादी ढांचा', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1595841696650-6e9ea0fa3708?w=600&h=1000&fit=crop', message: 'सरपंच जी के प्रयासों से हमारे खेत तक पक्की सड़क बन गई है, जिससे अब फसल मंडी ले जाने में बहुत आसानी होती है.' },
      { id: 2, name: 'श्रीमती सुनीता देवी', role: 'गृहिणी', category: 'स्वास्थ्य एवं स्वच्छता', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=600&h=1000&fit=crop', message: 'जल जीवन मिशन के तहत अब हमारे घर में ही नल से साफ पानी आ रहा है। पंचायत का बहुत-बहुत धन्यवाद।' },
      { id: 3, name: 'श्री मोहन अहिरवार', role: 'मजदूर', category: 'रोजगार एवं आजीविका', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=600&h=1000&fit=crop', message: 'मनरेगा के तहत हमें गाँव में ही लगातार रोजगार मिल रहा है। अब काम के लिए शहर नहीं जाना पड़ता।' },
      { id: 4, name: 'रविन्द्र सिंह', role: 'युवा', category: 'शिक्षा एवं डिजिटल सशक्तिकरण', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&h=1000&fit=crop', message: 'गाँव में ई-लाइब्रेरी और वाई-फाई की सुविधा मिलने से हम युवाओं की पढ़ाई और प्रतियोगी परीक्षाओं की तैयारी में बहुत मदद मिल रही है।' },
      { id: 5, name: 'कमलेश पटेल', role: 'दुकानदार', category: 'ऊर्जा एवं पर्यावरण', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=1000&fit=crop', message: 'चौराहों पर सोलर स्ट्रीट लाइट लगने से अब रात में भी गाँव में पूरी रोशनी रहती है, जिससे व्यापार भी अच्छा चलता है।' },
      { id: 6, name: 'श्रीमती राधा बाई', role: 'स्वयं सहायता समूह', category: 'महिला सशक्तिकरण', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1541781216584-0a3ce57cbf89?w=600&h=1000&fit=crop', message: 'पंचायत की मदद से हमारे समूह को सिलाई मशीनें मिली हैं, जिससे हम सभी महिलाएं आत्मनिर्भर बन रही हैं।' },
      { id: 7, name: 'श्री वीरेंद्र लोधी', role: 'शिक्षक', category: 'शिक्षा एवं खेल', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1577496642457-74f10bb5b5a1?w=600&h=1000&fit=crop', message: 'स्मार्ट क्लासरूम और नए खेल मैदान से बच्चों में पढ़ाई और खेलों के प्रति बहुत उत्साह बढ़ा है।' },
      { id: 8, name: 'श्री आनंद ठाकुर', role: 'डेयरी संचालक', category: 'पशुपालन एवं कृषि', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=1000&fit=crop', message: 'पशु चिकित्सा शिविरों और उन्नत डेयरी मार्गदर्शन से हमारे दुग्ध उत्पादन में काफी वृद्धि हुई है।' }
    ];
  });

  useEffect(() => {
    const fetchTestimonials = () => {
      const saved = localStorage.getItem('panchayat_testimonials_data');
      if (saved) setTestimonials(JSON.parse(saved));
    };
    window.addEventListener('storage', fetchTestimonials);
    return () => window.removeEventListener('storage', fetchTestimonials);
  }, []);

  return (
    <div className="testimonials-section" id="testimonials">
      <div className="testimonials-container">
        
        <div className="stats-title-wrap">
          <div className="section-badge" style={{ background: '#FEFCE8', color: '#D97706', borderColor: '#FEF08A' }}>
            <i className="fas fa-comment-dots"></i> जनता की आवाज़
          </div>
          <h2>
            ग्रामीणों के <span>विचार</span>
          </h2>
          <div className="underline"></div>
          <p className="section-subtitle">
            ग्राम पंचायत पथरिया जाट में हुए विकास कार्यों पर हमारे ग्रामवासियों की प्रतिक्रियाएं और उनके अनुभव।
          </p>
        </div>

        {testimonials.length > 0 ? (
          <div className="testi-scroll-wrapper">
            <div className="testi-track">
              {/* लूप को दो बार चलाया गया है ताकि स्क्रॉल कभी खत्म न हो (Infinite Scroll) */}
              {[...testimonials, ...testimonials].map((item, idx) => (
                <div key={idx} className="testi-card" onClick={() => setSelectedVideo(item)} title="वीडियो प्ले करें">
                  
                  <div className="testi-video-wrap">
                    <img src={item.poster} alt={item.name} />
                    <div className="testi-overlay"></div>
                    <div className="testi-category">{item.category}</div>
                    <div className="testi-play-btn-wrap">
                      <div className="testi-play-btn">
                        <i className="fas fa-play"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="testi-content">
                    <p className="testi-msg">
                      <i className="fas fa-quote-left quote-icon-new"></i>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"{item.message}"
                    </p>
                    <div className="testi-user-info">
                      <div className="testi-avatar">{item.name.charAt(0)}</div>
                      <div>
                        <h4 className="testi-name">{item.name}</h4>
                        <span className="testi-role">{item.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
            <p style={{ fontSize: '18px', color: '#64748B', margin: 0 }}>अभी कोई वीडियो फीडबैक जोड़ा नहीं गया है।</p>
          </div>
        )}

        <div className="testi-action" style={{ textAlign: 'center', marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
          <a href="#testimonials-page" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            सभी वीडियो देखें <i className="fas fa-play-circle" style={{ marginLeft: '8px' }}></i>
          </a>
        </div>

      {/* Video Lightbox / Popup Section */}
      {selectedVideo && (
        <div 
          className="lightbox-overlay" 
          onClick={() => setSelectedVideo(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'zoom-out'
          }}
        >
          <span style={{ position: 'absolute', top: '20px', right: '40px', color: '#fff', fontSize: '50px', cursor: 'pointer', fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>&times;</span>
          <div style={{ width: '90%', maxWidth: '850px', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <video controls autoPlay style={{ width: '100%', display: 'block' }}>
              <source src={selectedVideo.videoSrc} type="video/mp4" />
              आपका ब्राउज़र वीडियो सपोर्ट नहीं करता।
            </video>
          </div>
          <h3 style={{ color: '#fff', marginTop: '20px', fontSize: '1.5rem', fontWeight: '500', letterSpacing: '1px' }}>
            {selectedVideo.name} - {selectedVideo.role}
          </h3>
        </div>
      )}
      </div>
    </div>
  );
}

export default Testimonials;