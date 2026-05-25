import React from 'react';
import Gallery from './Gallery';

function VillageLocations() {
  const locations = [
    {
      image: 'https://images.unsplash.com/photo-1554224311-beee415c201f?w=400&h=400&fit=crop',
      label: 'ग्राम पंचायत भवन',
      description: 'पंचायत प्रशासन का मुख्यालय',
      link: '#',
      icon: 'fas fa-building'
    },
    {
      image: 'https://images.unsplash.com/photo-1427504494785-cdad14206e38?w=400&h=400&fit=crop',
      label: 'विद्यालय',
      description: 'शिक्षा केंद्र',
      link: '#',
      icon: 'fas fa-school'
    },
    {
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop',
      label: 'स्वास्थ्य केंद्र',
      description: 'चिकित्सा सेवाएं',
      link: '#',
      icon: 'fas fa-hospital'
    },
    {
      image: 'https://images.unsplash.com/photo-1518395577048-a1b5e1f03a16?w=400&h=400&fit=crop',
      label: 'मंदिर',
      description: 'धार्मिक स्थल',
      link: '#',
      icon: 'fas fa-gopuram'
    },
    {
      image: 'https://images.unsplash.com/photo-1577496642457-74f10bb5b5a1?w=400&h=400&fit=crop',
      label: 'आंगनवाड़ी केंद्र',
      description: 'बाल विकास कार्यक्रम',
      link: '#',
      icon: 'fas fa-child'
    },
    {
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
      label: 'बैंक / CSC',
      description: 'वित्तीय सेवाएं',
      link: '#',
      icon: 'fas fa-landmark'
    },
    {
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      label: 'तालाब / जल स्रोत',
      description: 'जल संचयन',
      link: '#',
      icon: 'fas fa-water'
    },
    {
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop',
      label: 'खेल मैदान',
      description: 'सामुदायिक खेल',
      link: '#',
      icon: 'fas fa-basketball'
    }
  ];

  return (
    <>
    <div id="facilities" className="village-locations-section">
      <div className="locations-header">
        <div className="locations-title-wrap">
          <div className="section-badge">
            <i className="fas fa-map-location-dot"></i> प्रमुख केंद्र एवं सुविधाएँ
          </div>
          <h2>
            हमारे गाँव के <span>प्रमुख स्थान</span>
          </h2>
          <p className="locations-intro">
            पथरिया जाट के महत्वपूर्ण सामुदायिक केंद्रों और सुविधाओं की सूची, जो गाँव के विकास और दैनिक जीवन में महत्वपूर्ण भूमिका निभाते हैं।
          </p>
          <div className="underline"></div>
        </div>
      </div>

      <div className="locations-container">
        <div className="locations-map-side">
          <div className="location-map-wrapper">
            <div className="map-decoration map-decoration-top"></div>
            <div className="location-map">
              <div className="map-placeholder">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21876.873602321106!2d78.76904959932187!3d23.809159870511117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3978d3cfb88e63f7%3A0x9697d89b3cbda42b!2sPatheriya%20Jat%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1777786904776!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Pathariya Jat Map">
                </iframe>
              </div>
            </div>
            <div className="map-decoration map-decoration-bottom"></div>
          </div>
        </div>

        <div className="locations-content-side">
          <div className="locations-grid">
            {locations.map((location, idx) => (
              <a key={idx} href={location.link} className="location-card">
                <div className="location-image">
                  <img src={location.image} alt={location.label} />
                  <div className="location-overlay"></div>
                </div>
                <div className="location-content">
                  <h3 className="location-label">{location.label}</h3>
                  <p className="location-description">{location.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
    <Gallery />
    </>
  );
}

export default VillageLocations;
