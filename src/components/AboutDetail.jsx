import React, { useEffect, useState } from 'react';

function AboutDetail() {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // पेज खुलने पर स्क्रीन को सबसे ऊपर ले जाने के लिए
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id="about-detail" className="about-detail-page" style={{ backgroundColor: '#FDFBF7', paddingBottom: '80px' }}>
      
      {/* Hero Banner Section */}
      <div style={{ 
        width: '100%', 
        height: '400px', 
        backgroundImage: 'linear-gradient(rgba(2, 44, 34, 0.75), rgba(2, 44, 34, 0.85)), url("https://images.unsplash.com/photo-1593693397690-362cb9666cb2?w=1600&h=600&fit=crop")', 
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
          <i className="fas fa-landmark"></i> ऐतिहासिक एवं सांस्कृतिक धरोहर
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: '700', marginBottom: '15px', textShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
          ग्राम पंचायत <span style={{ color: '#D4AF37' }}>पथरिया जाट</span>
        </h1>
        <p style={{ fontSize: '18px', maxWidth: '700px', lineHeight: '1.6', opacity: '0.9' }}>
          प्रकृति की गोद में बसा, विकास और परंपरा का एक अद्भुत संगम।
        </p>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '-50px auto 0', position: 'relative', zIndex: 10, padding: '0 24px' }}>
        
        {/* Main Content & Image Collage Box */}
        <div style={{ background: '#ffffff', padding: '50px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center' }}>
            {/* Left Side: Text / Theory */}
            <div>
              <h2 style={{ fontSize: '32px', color: '#064E3B', marginBottom: '20px', fontWeight: '700' }}>हमारा विस्तृत परिचय</h2>
              <div style={{ fontSize: '16.5px', color: '#4B5563', lineHeight: '1.8', textAlign: 'justify' }}>
                <p style={{ marginBottom: '15px' }}>
                  <strong>पथरिया जाट</strong> मध्य प्रदेश के सागर जिले की एक प्रमुख और आदर्श ग्राम पंचायत है। यह गाँव अपनी हरियाली, उपजाऊ कृषि भूमि और मेहनती ग्रामीणों के लिए जाना जाता है। यहाँ मुख्य रूप से खेती और उससे जुड़े व्यवसाय होते हैं।
                </p>
                <p style={{ marginBottom: '15px' }}>
                  समय के साथ हमारे गाँव ने आधुनिकता को भी अपनाया है। आज यह एक <strong>'डिजिटल और स्मार्ट पंचायत'</strong> की ओर तेज़ी से बढ़ रहा है। गाँव में पक्की सड़कें, विद्युतीकरण, हर घर नल-जल योजना और उच्च स्तरीय शैक्षणिक सुविधाएं उपलब्ध हैं।
                </p>
                <p>
                  यहाँ सभी धर्मों और समुदायों के लोग आपसी प्रेम और भाईचारे के साथ रहते हैं। गाँव के ऐतिहासिक मंदिर, तालाब और चौपाल आज भी हमारी पुरानी संस्कृति और एकता की गवाही देते हैं।
                </p>
              </div>
            </div>
            
            {/* Right Side: Image Collage Frame */}
            <div style={{ position: 'relative', height: '420px', width: '100%' }}>
              {/* Decorative Background Accent */}
              <div style={{ position: 'absolute', top: '10%', right: '5%', bottom: '0', left: '15%', background: '#F0FDF4', borderRadius: '24px', border: '2px dashed #A7F3D0', zIndex: 0 }}></div>
              
              {/* Image 1 (Top Left) */}
              <img src="https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?w=400&h=500&fit=crop" alt="Village Culture" 
                   style={{ position: 'absolute', top: '0', left: '0', width: '65%', height: '280px', objectFit: 'cover', borderRadius: '16px', border: '8px solid #ffffff', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', cursor: 'zoom-in', zIndex: 2, transition: 'transform 0.4s' }} 
                   onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03) rotate(-2deg)'} 
                   onMouseOut={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                   onClick={() => setSelectedImage({ src: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?w=800&h=1000&fit=crop', title: 'गाँव की संस्कृति' })} title="बड़ा देखने के लिए क्लिक करें" />

              {/* Image 2 (Bottom Right) */}
              <img src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=500&fit=crop" alt="Village Development" 
                   style={{ position: 'absolute', bottom: '20px', right: '0', width: '60%', height: '260px', objectFit: 'cover', borderRadius: '16px', border: '8px solid #ffffff', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', cursor: 'zoom-in', zIndex: 3, transition: 'transform 0.4s' }} 
                   onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03) rotate(2deg)'} 
                   onMouseOut={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                   onClick={() => setSelectedImage({ src: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=1000&fit=crop', title: 'गाँव का विकास' })} title="बड़ा देखने के लिए क्लिक करें" />

              {/* Floating Badge */}
              <div style={{ position: 'absolute', top: '40%', right: '-15px', background: 'linear-gradient(135deg, #064E3B, #047857)', color: '#D4AF37', padding: '15px', borderRadius: '50%', width: '90px', height: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(6,78,59,0.3)', zIndex: 4, border: '4px solid #fff' }}>
                <i className="fas fa-award" style={{ fontSize: '24px', marginBottom: '4px' }}></i>
                <span style={{ fontSize: '11px', textAlign: 'center', lineHeight: '1.2', fontWeight: 'bold' }}>आदर्श<br/>पंचायत</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sarpanch Message Section */}
        <div style={{ marginTop: '60px', background: '#ffffff', borderRadius: '20px', padding: 'clamp(20px, 5vw, 40px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 250px', textAlign: 'center', margin: '0 auto' }}>
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" alt="Sarpanch" style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #F0FDF4', boxShadow: '0 10px 20px rgba(6,78,59,0.15)' }} />
            <h3 style={{ marginTop: '15px', fontSize: '22px', color: '#064E3B', fontWeight: '700' }}>श्रीमान रामसेवक पटेल</h3>
            <p style={{ color: '#D97706', fontWeight: '600', margin: 0 }}>सरपंच, ग्राम पंचायत</p>
          </div>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <i className="fas fa-quote-left" style={{ fontSize: '40px', color: '#D4AF37', opacity: '0.3', marginBottom: '15px' }}></i>
            <h2 style={{ fontSize: '28px', color: '#1E293B', marginBottom: '15px', fontWeight: '700' }}>सरपंच का संदेश</h2>
            <p style={{ fontSize: '16.5px', color: '#4B5563', lineHeight: '1.8', fontStyle: 'italic' }}>
              "मेरे प्यारे ग्रामवासियों, हमारा पथरिया जाट केवल एक गाँव नहीं, बल्कि एक परिवार है। पंचायत के प्रतिनिधि के रूप में मेरी हमेशा यही कोशिश रही है कि शासन की हर योजना का लाभ अंतिम छोर पर बैठे व्यक्ति तक पहुंचे। शिक्षा, स्वास्थ्य, और रोजगार हमारे मुख्य लक्ष्य हैं। आइए, हम सब मिलकर अपने गाँव को देश की सबसे स्वच्छ, सुंदर और आत्मनिर्भर पंचायत बनाएं।"
            </p>
          </div>
        </div>

        {/* Key Features Section */}
        <div style={{ marginTop: '80px' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: '#064E3B', marginBottom: '40px', fontWeight: '700', textAlign: 'center' }}>
            गाँव की <span style={{ color: '#D4AF37' }}>विशेषताएं</span>
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '25px' }}>
            <div style={{ background: '#F0FDF4', padding: '30px', borderRadius: '16px', border: '1px solid #A7F3D0', textAlign: 'center', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <i className="fas fa-seedling" style={{ fontSize: '40px', color: '#059669', marginBottom: '15px' }}></i>
              <h3 style={{ fontSize: '20px', color: '#064E3B', marginBottom: '10px', fontWeight: '700' }}>समृद्ध कृषि</h3>
              <p style={{ fontSize: '14.5px', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>गाँव की अधिकांश भूमि सिंचित है जहाँ आधुनिक तकनीकों से उन्नत खेती की जाती है।</p>
            </div>
            <div style={{ background: '#FEFCE8', padding: '30px', borderRadius: '16px', border: '1px solid #FEF08A', textAlign: 'center', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <i className="fas fa-laptop-house" style={{ fontSize: '40px', color: '#D97706', marginBottom: '15px' }}></i>
              <h3 style={{ fontSize: '20px', color: '#064E3B', marginBottom: '10px', fontWeight: '700' }}>ई-पंचायत</h3>
              <p style={{ fontSize: '14.5px', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>गाँव के सभी सरकारी काम और प्रमाण पत्र पंचायत भवन से ऑनलाइन बनाए जाते हैं।</p>
            </div>
            <div style={{ background: '#F5F3FF', padding: '30px', borderRadius: '16px', border: '1px solid #DDD6FE', textAlign: 'center', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <i className="fas fa-user-graduate" style={{ fontSize: '40px', color: '#7C3AED', marginBottom: '15px' }}></i>
              <h3 style={{ fontSize: '20px', color: '#064E3B', marginBottom: '10px', fontWeight: '700' }}>उत्कृष्ट शिक्षा</h3>
              <p style={{ fontSize: '14.5px', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>आधुनिक क्लासरूम और ई-लाइब्रेरी के साथ बच्चों के लिए बेहतरीन शिक्षा व्यवस्था।</p>
            </div>
            <div style={{ background: '#F0F9FF', padding: '30px', borderRadius: '16px', border: '1px solid #BAE6FD', textAlign: 'center', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <i className="fas fa-heartbeat" style={{ fontSize: '40px', color: '#0284C7', marginBottom: '15px' }}></i>
              <h3 style={{ fontSize: '20px', color: '#064E3B', marginBottom: '10px', fontWeight: '700' }}>स्वच्छता व स्वास्थ्य</h3>
              <p style={{ fontSize: '14.5px', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>100% खुले में शौच मुक्त (ODF) गाँव और नियमित स्वास्थ्य शिविरों का आयोजन।</p>
            </div>
          </div>
        </div>

        {/* Village Activities & Sports Section */}
        <div style={{ marginTop: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: '#064E3B', fontWeight: '700', marginBottom: '15px' }}>
              सामाजिक पहल एवं <span style={{ color: '#D4AF37' }}>सामुदायिक गतिविधियां</span>
            </h2>
            <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
              हमारे गाँव में निरंतर खेलकूद, पर्यावरण संरक्षण और महिला सशक्तिकरण जैसी विभिन्न गतिविधियों का आयोजन किया जाता है, जिससे समाज के हर वर्ग का सर्वांगीण विकास हो सके।
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '250px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'zoom-in' }} onClick={() => setSelectedImage({ src: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1200&h=800&fit=crop', title: 'ग्राम स्तरीय क्रिकेट टूर्नामेंट' })} title="बड़ा देखने के लिए क्लिक करें">
              <img src="https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&h=400&fit=crop" alt="Sports" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(2,44,34,0.9), transparent)', color: '#fff' }}>
                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>ग्राम स्तरीय क्रिकेट टूर्नामेंट</h4>
              </div>
            </div>
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '250px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'zoom-in' }} onClick={() => setSelectedImage({ src: 'https://images.unsplash.com/photo-1577496642457-74f10bb5b5a1?w=1200&h=800&fit=crop', title: 'महिला आजीविका कार्यशाला' })} title="बड़ा देखने के लिए क्लिक करें">
              <img src="https://images.unsplash.com/photo-1577496642457-74f10bb5b5a1?w=600&h=400&fit=crop" alt="Women Empowerment" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(2,44,34,0.9), transparent)', color: '#fff' }}>
                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>महिला आजीविका कार्यशाला</h4>
              </div>
            </div>
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '250px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'zoom-in' }} onClick={() => setSelectedImage({ src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=800&fit=crop', title: 'सामुदायिक वृक्षारोपण अभियान' })} title="बड़ा देखने के लिए क्लिक करें">
              <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop" alt="Plantation" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(2,44,34,0.9), transparent)', color: '#fff' }}>
                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>सामुदायिक वृक्षारोपण अभियान</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission Box */}
        <div style={{ marginTop: '80px', background: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)', borderRadius: '20px', padding: 'clamp(20px, 5vw, 50px)', color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 15px 30px rgba(6,78,59,0.2)' }}>
          <i className="fas fa-quote-left" style={{ position: 'absolute', top: '10px', right: '30px', fontSize: '140px', color: 'rgba(255,255,255,0.05)', transform: 'rotate(-10deg)' }}></i>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: '#D4AF37', marginBottom: '20px', fontWeight: '700' }}>हमारा विज़न और संकल्प</h2>
            <p style={{ fontSize: '18px', lineHeight: '1.8', maxWidth: '900px', margin: '0 auto', fontWeight: '400', opacity: '0.95' }}>
              "हमारा लक्ष्य पथरिया जाट को केवल भौतिक रूप से ही नहीं, बल्कि बौद्धिक और आर्थिक रूप से भी सशक्त बनाना है। हम एक ऐसे गाँव की कल्पना करते हैं जहाँ हर युवा के पास रोजगार हो, हर महिला आत्मनिर्भर हो और हर खेत हरा-भरा हो। आइए साथ मिलकर अपने गाँव को देश की सबसे आदर्श पंचायत बनाएं!"
            </p>
          </div>
        </div>

      {/* Lightbox / Popup Section */}
      {selectedImage && (
        <div 
          className="lightbox-overlay" 
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'zoom-out'
          }}
        >
          <span style={{ position: 'absolute', top: '20px', right: '40px', color: '#fff', fontSize: '50px', cursor: 'pointer', fontWeight: 'bold' }}>&times;</span>
          <img 
            src={selectedImage.src} 
            alt={selectedImage.title} 
            style={{ maxWidth: '90%', maxHeight: '75vh', borderRadius: '10px', border: '5px solid #fff', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }} 
            onClick={(e) => e.stopPropagation()} 
          />
          {selectedImage.title && (
            <h3 style={{ color: '#fff', marginTop: '20px', fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              {selectedImage.title}
            </h3>
          )}
        </div>
      )}

      </div>
    </div>
  );
}

export default AboutDetail;