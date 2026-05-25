import React, { useState, useEffect } from 'react';

function MediaCoveragePage() {
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    // पेज खुलने पर स्क्रीन को सबसे ऊपर ले जाने के लिए
    window.scrollTo(0, 0);
  }, []);

  // स्क्वायर (Square) न्यूज़ कटिंग (1:1 Ratio)
  const squareNews = [
    { id: 1, image: 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?w=600&h=600&fit=crop', title: 'ई-ग्राम पंचायत पुरस्कार से सम्मानित सरपंच' },
    { id: 2, image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&h=600&fit=crop', title: 'स्मार्ट स्कूल की पहल से बच्चों में शिक्षा के प्रति उत्साह' },
    { id: 3, image: 'https://images.unsplash.com/photo-1577496642457-74f10bb5b5a1?w=600&h=600&fit=crop', title: 'आंगनवाड़ी में बच्चों का स्वास्थ्य परीक्षण' },
    { id: 4, image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&h=600&fit=crop', title: 'ग्राम पंचायत में खेलकूद का आयोजन' },
    { id: 13, image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&h=600&fit=crop', title: 'स्वच्छता अभियान में महिलाओं की भागीदारी' },
    { id: 14, image: 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?w=600&h=600&fit=crop', title: 'गाँव में नई ई-लाइब्रेरी का उद्घाटन' }
  ];

  // चौड़ी (Wide) न्यूज़ कटिंग (16:9 Ratio)
  const wideNews = [
    { id: 5, image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&h=500&fit=crop', title: 'पथरिया जाट में स्वच्छता अभियान ने पकड़ी रफ्तार' },
    { id: 6, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&h=500&fit=crop', title: 'जल जीवन मिशन की सफलता, घर-घर पहुंचा जल' },
    { id: 7, image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=1000&h=500&fit=crop', title: 'सड़क निर्माण से ग्रामीणों को मिली बड़ी राहत' },
    { id: 8, image: 'https://images.unsplash.com/photo-1541888004555-5ce0d68f2378?w=1000&h=500&fit=crop', title: 'किसानों के लिए कृषि उपकरण वितरण' },
    { id: 17, image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&h=500&fit=crop', title: 'पंचायत ने किया 100% टीकाकरण का लक्ष्य पूरा' },
    { id: 18, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&h=500&fit=crop', title: 'नई पक्की सड़कों से गाँव का हुआ कायाकल्प' }
  ];

  // लंबी (Tall) न्यूज़ कटिंग (3:4 Ratio)
  const tallNews = [
    { id: 9, image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&h=800&fit=crop', title: 'पंचायत के विकास कार्यों की मीडिया में सराहना' },
    { id: 10, image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=800&fit=crop', title: 'सौर ऊर्जा से रोशन हुआ पथरिया जाट गाँव' },
    { id: 11, image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=800&fit=crop', title: 'सामुदायिक वृक्षारोपण से हरा-भरा हुआ गाँव' },
    { id: 12, image: 'https://images.unsplash.com/photo-1629813589886-cb2a543598ac?w=600&h=800&fit=crop', title: 'सांस्कृतिक कार्यक्रम में ग्रामीणों ने लिया बढ़-चढ़कर हिस्सा' },
    { id: 21, image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&h=800&fit=crop', title: 'हर घर तिरंगा अभियान की शानदार झलक' },
    { id: 22, image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=800&fit=crop', title: 'जल संरक्षण के लिए तालाब का गहरीकरण' }
  ];

  return (
    <div className="media-page" style={{ padding: '80px 24px', minHeight: '60vh', backgroundColor: '#FDFBF7' }}>
      <style>
        {`
          .m-card {
            position: relative;
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            border: 1px solid rgba(212, 175, 55, 0.3);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            width: 100%;
          }
          .square-card { aspect-ratio: 4 / 3; }
          .wide-card { aspect-ratio: 21 / 9; }
          .tall-card { aspect-ratio: 5 / 6; }
          
          .grid-section {
            display: grid;
            gap: 25px;
            margin-bottom: 60px;
          }
          /* Desktop */
          .grid-square { grid-template-columns: repeat(3, 1fr); }
          .grid-wide { grid-template-columns: repeat(2, 1fr); }
          .grid-tall { grid-template-columns: repeat(3, 1fr); }

          .m-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(6, 78, 59, 0.15);
            border-color: #D4AF37;
          }
          /* Tablet */
          @media (max-width: 992px) {
            .grid-square, .grid-tall {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          /* Mobile */
          @media (max-width: 650px) {
            .grid-square, .grid-wide, .grid-tall {
              grid-template-columns: 1fr;
            }
          }
          .m-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top;
            transition: transform 0.6s ease;
          }
          .m-card:hover .m-img {
            transform: scale(1.08);
          }
          .m-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(6, 78, 59, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .m-card:hover .m-overlay {
            opacity: 1;
          }
          .m-overlay i {
            color: #fff;
            font-size: 40px;
            transform: scale(0.5);
            transition: transform 0.3s ease;
          }
          .m-card:hover .m-overlay i {
            transform: scale(1);
          }
        `}
      </style>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div className="section-badge" style={{ display: 'inline-block', marginBottom: '16px', background: '#F0FDF4', color: '#064E3B', padding: '6px 16px', borderRadius: '30px', border: '1px solid #A7F3D0', fontWeight: 'bold' }}>
          <i className="fas fa-newspaper"></i> संपूर्ण मीडिया कवरेज
        </div>
        
        <h1 style={{ fontSize: 'clamp(26px, 5vw, 36px)', color: '#064E3B', marginBottom: '15px', fontWeight: '700' }}>
          समाचारों में <span style={{ color: '#D4AF37' }}>पथरिया जाट</span>
        </h1>
        <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.6' }}>
          विभिन्न समाचार पत्रों और पत्रिकाओं में ग्राम पंचायत पथरिया जाट के विकास कार्यों और उपलब्धियों की झलकियाँ।
        </p>
        
        {/* Section 1: Square News */}
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <h2 style={{ color: '#064E3B', fontSize: '24px', borderBottom: '3px solid #D4AF37', display: 'inline-block', paddingBottom: '8px', margin: 0 }}>
            स्क्वायर (Square) न्यूज़ कटिंग
          </h2>
        </div>
        <div className="grid-section grid-square">
          {squareNews.map((news) => (
            <div key={news.id} className="m-card square-card" onClick={() => setSelectedNews(news)}>
              <img src={news.image} alt={news.title} className="m-img" />
              <div className="m-overlay"><i className="fas fa-search-plus"></i></div>
            </div>
          ))}
        </div>

        {/* Section 2: Wide News */}
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <h2 style={{ color: '#064E3B', fontSize: '24px', borderBottom: '3px solid #D4AF37', display: 'inline-block', paddingBottom: '8px', margin: 0 }}>
            चौड़ी (Wide) न्यूज़ कटिंग
          </h2>
        </div>
        <div className="grid-section grid-wide">
          {wideNews.map((news) => (
            <div key={news.id} className="m-card wide-card" onClick={() => setSelectedNews(news)}>
              <img src={news.image} alt={news.title} className="m-img" />
              <div className="m-overlay"><i className="fas fa-search-plus"></i></div>
            </div>
          ))}
        </div>

        {/* Section 3: Tall News */}
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <h2 style={{ color: '#064E3B', fontSize: '24px', borderBottom: '3px solid #D4AF37', display: 'inline-block', paddingBottom: '8px', margin: 0 }}>
            लंबी (Tall) न्यूज़ कटिंग
          </h2>
        </div>
        <div className="grid-section grid-tall">
          {tallNews.map((news) => (
            <div key={news.id} className="m-card tall-card" onClick={() => setSelectedNews(news)}>
              <img src={news.image} alt={news.title} className="m-img" />
              <div className="m-overlay"><i className="fas fa-search-plus"></i></div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Popup */}
      {selectedNews && (
        <div className="lightbox-overlay" onClick={() => setSelectedNews(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: 99999, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'zoom-out' }}>
          <span style={{ position: 'absolute', top: '20px', right: '40px', color: '#fff', fontSize: '50px', cursor: 'pointer', fontWeight: 'bold' }}>&times;</span>
          <img src={selectedNews.image} alt={selectedNews.title} style={{ maxWidth: '90%', maxHeight: '80vh', borderRadius: '8px', border: '3px solid #fff' }} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

export default MediaCoveragePage;