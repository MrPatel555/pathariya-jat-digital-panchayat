import React, { useState, useEffect } from 'react';

function VillageEvents() {
  const [selectedEventImage, setSelectedEventImage] = useState(null);

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('panchayat_events_data');
    return saved ? JSON.parse(saved) : [
      { title: 'स्वतंत्रता दिवस समारोह', image: 'https://images.unsplash.com/photo-1629813589886-cb2a543598ac?w=600&h=400&fit=crop' },
      { title: 'दीपोत्सव एवं ग्राम मिलन', image: 'https://images.unsplash.com/photo-1541781216584-0a3ce57cbf89?w=600&h=400&fit=crop' },
      { title: 'होली मिलन समारोह', image: 'https://images.unsplash.com/photo-1553698884-257ebbb3b02e?w=600&h=400&fit=crop' },
      { title: 'वार्षिक खेलकूद प्रतियोगिता', image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&h=400&fit=crop' },
      { title: 'वृक्षारोपण महा-अभियान', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop' },
      { title: 'निशुल्क स्वास्थ्य जांच शिविर', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop' }
    ];
  });

  useEffect(() => {
    const fetchEventsData = () => {
      const saved = localStorage.getItem('panchayat_events_data');
      if (saved) setEvents(JSON.parse(saved));
    };
    fetchEventsData();
    window.addEventListener('storage', fetchEventsData);
    return () => window.removeEventListener('storage', fetchEventsData);
  }, []);

  return (
    <div className="events-section" id="events" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #E0F2FE 100%)' }}>
      <div className="events-container">
        <div className="stats-title-wrap">
          <div className="section-badge" style={{ background: '#FEF3C7', color: '#D97706', borderColor: '#FDE68A' }}>
            <i className="fas fa-calendar-alt"></i> उत्सव एवं कार्यक्रम
          </div>
          <h2>
            हमारी संस्कृति, <span>हमारी पहचान</span>
          </h2>
          <div className="underline"></div>
          <p className="section-subtitle">
            ग्राम पंचायत पथरिया जाट में मनाए जाने वाले प्रमुख त्योहारों, सांस्कृतिक कार्यक्रमों और सामुदायिक आयोजनों की झलकियाँ।
          </p>
        </div>

        <div className="events-grid">
          {events.map((event, idx) => (
            <div key={idx} className="event-card" style={{ animation: `fadeInUp 0.8s ease ${idx * 0.15}s both` }}>
              <div 
                className="event-img-wrap"
                onClick={() => setSelectedEventImage(event)}
                style={{ cursor: 'pointer' }}
                title="बड़ा देखने के लिए क्लिक करें"
              >
                <img src={event.image} alt={event.title} />
              </div>
              <div className="event-content" style={{ 
                padding: '20px', 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)',
                borderTop: '4px solid #D4AF37'
              }}>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '19px', letterSpacing: '0.5px' }}>{event.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Popup Section */}
      {selectedEventImage && (
        <div 
          className="lightbox-overlay" 
          onClick={() => setSelectedEventImage(null)}
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
            src={selectedEventImage.image} 
            alt={selectedEventImage.title} 
            style={{ maxWidth: '90%', maxHeight: '75vh', borderRadius: '10px', border: '5px solid #fff', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }} 
            onClick={(e) => e.stopPropagation()} 
          />
          <h3 style={{ color: '#fff', marginTop: '20px', fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            {selectedEventImage.title}
          </h3>
        </div>
      )}
    </div>
  );
}

export default VillageEvents;