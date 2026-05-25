import React, { useState, useEffect } from 'react';

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  const [galleryImages, setGalleryImages] = useState(() => {
    const saved = localStorage.getItem('panchayat_gallery_data');
    const defaultClasses = ['g-item-large', 'g-item-tall', 'g-item-wide', '', '', '', '', 'g-item-wide', '', ''];
    if (saved) {
      return JSON.parse(saved).map((img, i) => ({ ...img, className: defaultClasses[i % defaultClasses.length] || '' }));
    }
    return [
      { src: 'https://images.unsplash.com/photo-1593693397690-362cb9666cb2?w=800&h=800&fit=crop', title: 'ग्राम पंचायत भवन', className: 'g-item-large' },
      { src: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?w=400&h=800&fit=crop', title: 'प्राथमिक विद्यालय', className: 'g-item-tall' },
      { src: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=400&fit=crop', title: 'सामुदायिक स्वास्थ्य केंद्र', className: 'g-item-wide' },
      { src: 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?w=400&h=400&fit=crop', title: 'प्राचीन मंदिर', className: '' },
      { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', title: 'जल संचयन (तालाब)', className: '' },
      { src: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop', title: 'खेल का मैदान', className: '' },
      { src: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&h=400&fit=crop', title: 'गाँव की चौपाल', className: '' },
      { src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop', title: 'सांस्कृतिक कार्यक्रम', className: 'g-item-wide' },
      { src: 'https://images.unsplash.com/photo-1577496642457-74f10bb5b5a1?w=400&h=400&fit=crop', title: 'आंगनवाड़ी केंद्र', className: '' },
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop', title: 'ई-मित्र (CSC) केंद्र', className: '' }
    ];
  });

  useEffect(() => {
    const fetchGallery = () => {
      const saved = localStorage.getItem('panchayat_gallery_data');
      if (saved) {
        const defaultClasses = ['g-item-large', 'g-item-tall', 'g-item-wide', '', '', '', '', 'g-item-wide', '', ''];
        setGalleryImages(JSON.parse(saved).map((img, i) => ({ ...img, className: defaultClasses[i % defaultClasses.length] || '' })));
      }
    };
    window.addEventListener('storage', fetchGallery);
    return () => window.removeEventListener('storage', fetchGallery);
  }, []);

  return (
    <div 
      className="gallery-section" 
      id="gallery" 
      style={{ 
        backgroundColor: '#FDFBF7', 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='28' height='49' viewBox='0 0 28 49' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23064e3b' fill-opacity='0.035' fill-rule='evenodd'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.65V49h-2z'/%3E%3C/g%3E%3C/svg%3E")`,
        paddingBottom: '60px' 
      }}
    >
      <div className="gallery-container">
        
        <div className="stats-title-wrap">
          <div className="section-badge">
            <i className="fas fa-images"></i> चित्र गैलरी
          </div>
          <h2>
            गाँव की <span>झलकियाँ</span>
          </h2>
          <div className="underline"></div>
          <p className="section-subtitle">
            ग्राम पंचायत पथरिया जाट की कुछ खूबसूरत तस्वीरें और प्रमुख स्थलों के दृश्य।
          </p>
        </div>

        <div className="gallery-grid">
          {galleryImages.map((img, idx) => (
            <div 
              key={idx} 
              className={`gallery-item ${img.className}`}
              onClick={() => setSelectedImage(img)}
              title="बड़ा देखने के लिए क्लिक करें"
            >
              <img src={img.src} alt={img.title} />
              <div className="gallery-overlay">
                <h3>{img.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="gallery-action">
          <a href="#gallery-page" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            सभी तस्वीरें देखें <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
          </a>
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
          <h3 style={{ color: '#fff', marginTop: '20px', fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            {selectedImage.title}
          </h3>
        </div>
      )}
    </div>
  );
}

export default Gallery;