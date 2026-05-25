import React, { useState } from 'react';

function MediaCoverage() {
  const [selectedNews, setSelectedNews] = useState(null);

  // यहाँ आप भविष्य में अपने असली न्यूज़ पेपर की कटिंग (Images) लगा सकते हैं
  const newsItems = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&h=800&fit=crop',
      title: 'पंचायत के विकास कार्यों की मीडिया में सराहना'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=800&fit=crop',
      title: 'पथरिया जाट में स्वच्छता अभियान ने पकड़ी रफ्तार'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?w=600&h=800&fit=crop',
      title: 'ई-ग्राम पंचायत पुरस्कार से सम्मानित सरपंच'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=800&fit=crop',
      title: 'जल जीवन मिशन की सफलता, घर-घर पहुंचा जल'
    }
  ];

  return (
    <div className="media-section" id="media" style={{ backgroundColor: '#FDFBF7', backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.05) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(6, 78, 59, 0.05) 0%, transparent 40%), url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23064e3b\' fill-opacity=\'0.04\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}>
      <div className="media-container">
        <div className="stats-title-wrap">
          <div className="section-badge" style={{ background: '#F0FDF4', color: '#064E3B', borderColor: '#A7F3D0' }}>
            <i className="fas fa-newspaper"></i> मीडिया कवरेज
          </div>
          <h2>
            समाचारों में <span>पथरिया जाट</span>
          </h2>
          <div className="underline"></div>
          <p className="section-subtitle">
            विभिन्न समाचार पत्रों और पत्रिकाओं में ग्राम पंचायत पथरिया जाट के विकास कार्यों और उपलब्धियों की झलकियाँ।
          </p>
        </div>

        <div className="media-grid">
          {newsItems.map((news) => (
            <div 
              key={news.id} 
              className="media-card"
              onClick={() => setSelectedNews(news)}
              title="पढ़ने के लिए क्लिक करें"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(6, 78, 59, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff'
              }}
            >
              <div className="media-img-wrap">
                <img src={news.image} alt={news.title} />
                <div className="media-overlay">
                  <i className="fas fa-search-plus"></i>
                </div>
              </div>
              <div className="media-content" style={{ 
                padding: '20px 15px', 
              background: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)', 
              borderTop: '4px solid #D4AF37',
                textAlign: 'center',
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <h4 style={{ margin: 0, color: '#ffffff', fontSize: '18px', fontWeight: '600', lineHeight: '1.5', textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
                  {news.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

        <div className="media-action" style={{ textAlign: 'center', marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
          <a href="#media-coverage-page" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            सभी समाचार देखें <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
          </a>
        </div>
      </div>

      {/* Lightbox / Popup */}
      {selectedNews && (
        <div className="lightbox-overlay" onClick={() => setSelectedNews(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: 99999, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'zoom-out' }}>
          <span style={{ position: 'absolute', top: '20px', right: '40px', color: '#fff', fontSize: '50px', cursor: 'pointer', fontWeight: 'bold' }}>&times;</span>
          <img src={selectedNews.image} alt={selectedNews.title} style={{ maxWidth: '90%', maxHeight: '80vh', borderRadius: '8px', border: '3px solid #fff' }} onClick={(e) => e.stopPropagation()} />
          <h3 style={{ color: '#fff', marginTop: '20px', fontSize: '1.5rem', fontWeight: '500' }}>{selectedNews.title}</h3>
        </div>
      )}
    </div>
  );
}

export default MediaCoverage;