import React, { useState, useEffect } from 'react';

function TestimonialsPage() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    // पेज खुलने पर स्क्रीन को सबसे ऊपर ले जाने के लिए
    window.scrollTo(0, 0);
  }, []);

  const [testimonials, setTestimonials] = useState(() => {
    const saved = localStorage.getItem('panchayat_testimonials_data');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'श्री रमेश कुशवाहा', role: 'किसान', category: 'कृषि एवं बुनियादी ढांचा', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1595841696650-6e9ea0fa3708?w=600&h=1000&fit=crop', message: 'सरपंच जी के प्रयासों से हमारे खेत तक पक्की सड़क बन गई है, जिससे अब फसल मंडी ले जाने में बहुत आसानी होती है.' },
      { id: 2, name: 'श्रीमती सुनीता देवी', role: 'गृहिणी', category: 'स्वास्थ्य एवं स्वच्छता', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=600&h=1000&fit=crop', message: 'जल जीवन मिशन के तहत अब हमारे घर में ही नल से साफ पानी आ रहा है। पंचायत का बहुत-बहुत धन्यवाद।' },
      { id: 3, name: 'श्री मोहन अहिरवार', role: 'मजदूर', category: 'रोजगार एवं आजीविका', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=600&h=1000&fit=crop', message: 'मनरेगा के तहत हमें गाँव में ही लगातार रोजगार मिल रहा है। अब काम के लिए शहर नहीं जाना पड़ता।' },
      { id: 4, name: 'रविन्द्र सिंह', role: 'युवा', category: 'शिक्षा एवं डिजिटल सशक्तिकरण', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&h=1000&fit=crop', message: 'गाँव में ई-लाइब्रेरी और वाई-फाई की सुविधा मिलने से हम युवाओं की पढ़ाई और प्रतियोगी परीक्षाओं की तैयारी में बहुत मदद मिल रही है।' },
      { id: 5, name: 'कमलेश पटेल', role: 'दुकानदार', category: 'ऊर्जा एवं पर्यावरण', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=1000&fit=crop', message: 'चौराहों पर सोलर स्ट्रीट लाइट लगने से अब रात में भी गाँव में पूरी रोशनी रहती है, जिससे व्यापार भी अच्छा चलता है।' }
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
    <div className="testimonials-page" style={{ backgroundColor: '#FDFBF7', paddingBottom: '80px' }}>
      <style>
        {`
          .v-card {
            position: relative;
            background: #000;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            border: 1px solid #E2E8F0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            display: flex;
            flex-direction: column;
            aspect-ratio: 9 / 16;
          }
          .v-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(6, 78, 59, 0.15);
            border-color: #A7F3D0;
          }
          .v-thumb {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 0;
          }
          .v-thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
          }
          .v-card:hover .v-thumb img {
            transform: scale(1.08);
          }
          .v-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.2);
            transition: background 0.3s ease;
          }
          .v-card:hover .v-overlay {
            background: rgba(0,0,0,0.4);
          }
          .v-play-btn {
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.25);
            backdrop-filter: blur(5px);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 22px;
            border: 2px solid rgba(255,255,255,0.5);
            transition: all 0.3s ease;
          }
          .v-card:hover .v-play-btn {
            background: #D4AF37;
            border-color: #D4AF37;
            transform: scale(1.1);
            box-shadow: 0 10px 20px rgba(212, 175, 55, 0.4);
          }
          .v-category {
            position: absolute;
            top: 15px;
            left: 15px;
            background: rgba(0,0,0,0.65);
            color: #fff;
            padding: 5px 14px;
            border-radius: 30px;
            font-size: 12px;
            font-weight: 600;
            backdrop-filter: blur(4px);
            z-index: 2;
            border: 1px solid rgba(255,255,255,0.15);
          }
          .v-content {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 30px 20px 20px;
            background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 60%, transparent 100%);
            z-index: 2;
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
        `}
      </style>

      {/* Hero Banner Section */}
      <div style={{ 
        width: '100%', 
        height: '380px', 
        backgroundImage: 'linear-gradient(rgba(2, 44, 34, 0.8), rgba(2, 44, 34, 0.95)), url("https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=1600&h=600&fit=crop")', 
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
          <i className="fas fa-video"></i> ग्राम पंचायत वीडियो गैलरी
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: '700', marginBottom: '15px', textShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
          जनता की <span style={{ color: '#D4AF37' }}>आवाज़</span>
        </h1>
        <p style={{ fontSize: '18px', maxWidth: '750px', lineHeight: '1.6', opacity: '0.9' }}>
          सुनिए उन लोगों की कहानी, जिनके जीवन में पंचायत के विकास कार्यों और सरकारी योजनाओं से एक सकारात्मक बदलाव आया है।
        </p>
      </div>

      <div className="container" style={{ maxWidth: '1400px', margin: '-50px auto 0', position: 'relative', zIndex: 10, padding: '0 24px' }}>
        {testimonials.length > 0 ? (
          <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '30px', justifyContent: 'center' }}>
            {testimonials.map((item, idx) => (
              <div key={idx} className="v-card" onClick={() => setSelectedVideo(item)} title="वीडियो प्ले करें">
                
                {/* Video Thumbnail Area */}
                <div className="v-thumb">
                  <img src={item.poster} alt={item.name} />
                  <div className="v-overlay"></div>
                </div>
                
                <div className="v-category">{item.category}</div>
                
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
                  <div className="v-play-btn">
                    <i className="fas fa-play" style={{ marginLeft: '4px' }}></i>
                  </div>
                </div>
                
                {/* Video Content Area */}
                <div className="v-content">
                  <p style={{ fontSize: '14.5px', color: '#E2E8F0', lineHeight: '1.6', fontStyle: 'italic', margin: 0 }}>
                    "{item.message}"
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '15px' }}>
                    {/* User Avatar */}
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #064E3B, #047857)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', border: '2px solid #D4AF37' }}>
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '15px', fontWeight: '700' }}>{item.name}</h4>
                      <span style={{ fontSize: '12px', color: '#D4AF37', fontWeight: '600' }}>{item.role}</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', marginTop: '30px' }}>
            <p style={{ fontSize: '18px', color: '#64748B', margin: 0 }}>अभी कोई वीडियो फीडबैक जोड़ा नहीं गया है।</p>
          </div>
        )}
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
  );
}

export default TestimonialsPage;