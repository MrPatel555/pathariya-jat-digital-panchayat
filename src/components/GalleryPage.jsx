import React, { useState, useEffect } from 'react';

function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // पेज खुलने पर स्क्रीन को सबसे ऊपर ले जाने के लिए
    window.scrollTo(0, 0);
  }, []);

  // 5 अलग-अलग सेक्शन और हर एक में 6 तस्वीरें
  const galleryCategories = [
    {
      title: "1. प्रशासनिक एवं विकास कार्य",
      icon: "fas fa-building",
      images: [
        { src: 'https://images.unsplash.com/photo-1593693397690-362cb9666cb2?w=800&fit=crop', title: 'ग्राम पंचायत भवन' },
        { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&fit=crop', title: 'ई-मित्र (CSC) केंद्र' },
        { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&fit=crop', title: 'मीटिंग हॉल (ग्राम सभा कक्ष)' },
        { src: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&fit=crop', title: 'पक्की सड़क एवं नाली' },
        { src: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&fit=crop', title: 'सोलर स्ट्रीट लाइट' },
        { src: 'https://images.unsplash.com/photo-1548503027-2c932bf52c3c?w=800&fit=crop', title: 'जल जीवन मिशन (पानी की टंकी)' }
      ]
    },
    {
      title: "2. शिक्षा एवं बाल विकास",
      icon: "fas fa-school",
      images: [
        { src: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?w=800&fit=crop', title: 'प्राथमिक विद्यालय' },
        { src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&fit=crop', title: 'स्मार्ट क्लासरूम' },
        { src: 'https://images.unsplash.com/photo-1577496642457-74f10bb5b5a1?w=800&fit=crop', title: 'आंगनवाड़ी केंद्र' },
        { src: 'https://images.unsplash.com/photo-1546410531-b4c6e94980ba?w=800&fit=crop', title: 'ई-लाइब्रेरी (पुस्तकालय)' },
        { src: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&fit=crop', title: 'स्कूल का खेल मैदान' },
        { src: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&fit=crop', title: 'विद्यालय के बच्चे' }
      ]
    },
    {
      title: "3. धार्मिक स्थल एवं संस्कृति",
      icon: "fas fa-om",
      images: [
        { src: 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?w=800&fit=crop', title: 'प्राचीन शिव मंदिर' },
        { src: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&fit=crop', title: 'गाँव की ऐतिहासिक चौपाल' },
        { src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&fit=crop', title: 'सांस्कृतिक पर्व' },
        { src: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=800&fit=crop', title: 'दीपावली / दीपदान' },
        { src: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&fit=crop', title: 'ग्राम्य मेला' },
        { src: 'https://images.unsplash.com/photo-1629813589886-cb2a543598ac?w=800&fit=crop', title: 'पारंपरिक लोक कला' }
      ]
    },
    {
      title: "4. प्राकृतिक सौंदर्य एवं कृषि",
      icon: "fas fa-leaf",
      images: [
        { src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&fit=crop', title: 'लहलहाते खेत' },
        { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&fit=crop', title: 'तालाब एवं जल संचयन' },
        { src: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&fit=crop', title: 'प्राकृतिक परिवेश' },
        { src: 'https://images.unsplash.com/photo-1592982537447-6f296317bc2d?w=800&fit=crop', title: 'आधुनिक कृषि (ट्रैक्टर)' },
        { src: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&fit=crop', title: 'गाँव की सुंदर पगडंडी' },
        { src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&fit=crop', title: 'फसल कटाई' }
      ]
    },
    {
      title: "5. जन-सहभागिता एवं आयोजन",
      icon: "fas fa-users",
      images: [
        { src: 'https://images.unsplash.com/photo-1533100523281-7cbdc8332155?w=800&fit=crop', title: 'ग्राम सभा की बैठक' },
        { src: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&fit=crop', title: 'निशुल्क स्वास्थ्य शिविर' },
        { src: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&fit=crop', title: 'क्रिकेट टूर्नामेंट' },
        { src: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&fit=crop', title: 'स्वच्छता अभियान' },
        { src: 'https://images.unsplash.com/photo-1541781216584-0a3ce57cbf89?w=800&fit=crop', title: 'महिला स्वयं सहायता समूह' },
        { src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&fit=crop', title: 'पुरस्कार एवं सम्मान समारोह' }
      ]
    }
  ];

  return (
    <div className="gallery-page" style={{ padding: '80px 24px', minHeight: '60vh', backgroundColor: '#FDFBF7' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-badge" style={{ display: 'inline-block', marginBottom: '16px', background: '#F0FDF4', color: '#064E3B', padding: '6px 16px', borderRadius: '30px', border: '1px solid #A7F3D0', fontWeight: 'bold' }}>
            <i className="fas fa-images"></i> संपूर्ण चित्र गैलरी
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', color: '#064E3B', marginBottom: '20px', fontWeight: '700' }}>
            ग्राम पंचायत <span style={{ color: '#D4AF37' }}>पथरिया जाट</span> की झलकियाँ
          </h1>
          <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            हमारे गाँव की अनमोल यादें, निरंतर हो रहे विकास कार्य, प्राकृतिक छटा और सांस्कृतिक धरोहरों का एक अद्भुत संग्रह। 
            यहाँ आप पथरिया जाट की हर एक खूबसूरत तस्वीर और गतिविधियों को देख सकते हैं।
          </p>
        </div>
        
        {/* Categorized Sections Loop */}
        {galleryCategories.map((category, catIdx) => (
          <div key={catIdx} style={{ marginBottom: '70px' }}>
            <h2 style={{ fontSize: '28px', color: '#1E293B', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '45px', height: '45px', background: '#F0FDF4', color: '#064E3B', borderRadius: '50%', fontSize: '20px' }}>
                <i className={category.icon}></i>
              </span>
              {category.title}
            </h2>
            
            <div className="gallery-page-grid">
              {category.images.map((img, imgIdx) => (
                <div 
                  key={imgIdx} 
                  className="gallery-item"
                  onClick={() => setSelectedImage(img)}
                  title="बड़ा देखने के लिए क्लिक करें"
                  style={{ gridColumn: 'span 1', gridRow: 'span 1' }}
                >
                  <img src={img.src} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="gallery-overlay">
                    <h3>{img.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
          <h3 style={{ color: '#fff', marginTop: '20px', fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            {selectedImage.title}
          </h3>
        </div>
      )}
    </div>
  );
}

export default GalleryPage;