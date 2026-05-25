import React, { useState, useEffect } from 'react';

function BeforeAfter() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [comparisons, setComparisons] = useState(() => {
    const saved = localStorage.getItem('panchayat_before_after');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'ग्राम की मुख्य सड़क और जल निकासी', beforeImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop', afterImage: 'https://images.unsplash.com/photo-1584464457692-74768393e1af?w=600&h=400&fit=crop' },
      { id: 2, title: 'हर घर जल जीवन मिशन (पेयजल)', beforeImage: 'https://images.unsplash.com/photo-1616422285623-14e9e049ed67?w=600&h=400&fit=crop', afterImage: 'https://images.unsplash.com/photo-1548503027-2c932bf52c3c?w=600&h=400&fit=crop' },
      { id: 3, title: 'सार्वजनिक शौचालय (स्वच्छ भारत मिशन)', beforeImage: 'https://images.unsplash.com/photo-1510133744874-0968ee3a428e?w=600&h=400&fit=crop', afterImage: 'https://images.unsplash.com/photo-1628167810574-0f3fdebafeee?w=600&h=400&fit=crop' },
      { id: 4, title: 'स्मार्ट आंगनवाड़ी और स्कूल', beforeImage: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=600&h=400&fit=crop', afterImage: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=600&h=400&fit=crop' }
    ];
  });

  useEffect(() => {
    const fetchBeforeAfter = () => {
      const saved = localStorage.getItem('panchayat_before_after');
      if (saved) {
        setComparisons(JSON.parse(saved));
        setCurrentIndex(0); // डेटा बदलने पर स्लाइडर को पहले पर सेट करना
      }
    };
    window.addEventListener('storage', fetchBeforeAfter);
    return () => window.removeEventListener('storage', fetchBeforeAfter);
  }, []);

  return (
    <div className="before-after-section" style={{ padding: '80px 24px', backgroundColor: '#FDFBF7', borderTop: '1px solid rgba(212, 175, 55, 0.15)' }}>
      <div className="container" style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <div className="stats-title-wrap" style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="section-badge" style={{ display: 'inline-block', marginBottom: '16px', background: '#FEFCE8', color: '#D97706', padding: '6px 16px', borderRadius: '30px', border: '1px solid #FEF08A', fontWeight: 'bold' }}>
            <i className="fas fa-random"></i> बदलाव की तस्वीर
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 5vw, 36px)', color: '#064E3B', marginBottom: '16px', fontWeight: '700' }}>
            गाँव का विकास: <span style={{ color: '#D4AF37' }}>पहले और अब</span>
          </h2>
          <div className="underline" style={{ width: '100px', height: '4px', background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)', margin: '0 auto', borderRadius: '2px' }}></div>
          <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '700px', margin: '20px auto 0', lineHeight: '1.6' }}>
            ग्राम पंचायत पथरिया जाट में हुए प्रमुख विकास कार्यों का सीधा प्रभाव। देखिए कैसे हमारे गाँव की तस्वीर बदल रही है।
          </p>
        </div>

        {/* Single Slider Card */}
        {comparisons.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
            <div key={comparisons[currentIndex]?.id} style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', animation: 'fadeInUp 0.5s ease' }}>
              <div style={{ padding: '15px 30px', background: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)', color: '#fff', borderBottom: '4px solid #D4AF37', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => setCurrentIndex(prev => prev === 0 ? comparisons.length - 1 : prev - 1)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', transition: 'background 0.3s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} title="पिछला देखें">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '700', letterSpacing: '0.5px', textAlign: 'center' }}>{comparisons[currentIndex]?.title}</h3>
                <button onClick={() => setCurrentIndex(prev => prev === comparisons.length - 1 ? 0 : prev + 1)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', transition: 'background 0.3s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} title="अगला देखें">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' }}>
                {/* Before Image */}
                <div style={{ position: 'relative', borderRight: '1px solid #E2E8F0' }}>
                  <div style={{ position: 'absolute', top: '20px', left: '20px', background: '#DC2626', color: '#fff', padding: '6px 15px', borderRadius: '30px', fontSize: '14px', fontWeight: '700', zIndex: 2, boxShadow: '0 4px 10px rgba(220, 38, 38, 0.3)' }}>
                    <i className="fas fa-times-circle" style={{ marginRight: '6px' }}></i> पहले (Before)
                  </div>
                  <div style={{ height: '350px', overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setSelectedImage({ src: comparisons[currentIndex]?.beforeImage, title: `${comparisons[currentIndex]?.title} - पहले` })}>
                    <img src={comparisons[currentIndex]?.beforeImage} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%)', transition: 'transform 0.5s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                  </div>
                </div>
                {/* After Image */}
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '20px', right: '20px', background: '#059669', color: '#fff', padding: '6px 15px', borderRadius: '30px', fontSize: '14px', fontWeight: '700', zIndex: 2, boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)' }}>
                    <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i> अब (After)
                  </div>
                  <div style={{ height: '350px', overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setSelectedImage({ src: comparisons[currentIndex]?.afterImage, title: `${comparisons[currentIndex]?.title} - अब` })}>
                    <img src={comparisons[currentIndex]?.afterImage} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
            <p style={{ fontSize: '18px', color: '#64748B', margin: 0 }}>अभी कोई प्रोजेक्ट (बदलाव की तस्वीर) जोड़ा नहीं गया है।</p>
          </div>
        )}
      </div>

      {/* Lightbox / Popup Section */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 99999, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'zoom-out' }}>
          <span style={{ position: 'absolute', top: '20px', right: '40px', color: '#fff', fontSize: '50px', cursor: 'pointer', fontWeight: 'bold' }}>&times;</span>
          <img src={selectedImage.src} alt={selectedImage.title} style={{ maxWidth: '90%', maxHeight: '75vh', borderRadius: '10px', border: '5px solid #fff', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }} onClick={(e) => e.stopPropagation()} />
          {selectedImage.title && <h3 style={{ color: '#fff', marginTop: '20px', fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{selectedImage.title}</h3>}
        </div>
      )}
    </div>
  );
}

export default BeforeAfter;