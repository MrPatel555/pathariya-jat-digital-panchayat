import React, { useState, useEffect } from 'react';

function DevelopmentWorks() {
  const [devWorks, setDevWorks] = useState([
    { id: 1, title: 'पक्की सड़क एवं नाली निर्माण', description: 'ग्राम के मुख्य मार्ग से लेकर वार्ड क्र. 4 तक सीसी रोड और जल निकासी के लिए पक्की नाली का निर्माण कार्य सफलतापूर्वक पूर्ण किया गया।', badge: 'पूर्ण कार्य', image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop', badgeColor: '#059669' },
    { id: 2, title: 'हर घर नल जल योजना', description: 'जल जीवन मिशन के अंतर्गत पंचायत के सभी घरों में शुद्ध पेयजल पहुँचाने के लिए पाइपलाइन बिछाने का कार्य तेजी से प्रगति पर है।', badge: 'प्रगति पर', image: 'https://images.unsplash.com/photo-1548503027-2c932bf52c3c?w=600&h=400&fit=crop', badgeColor: '#D97706' },
    { id: 3, title: 'सोलर स्ट्रीट लाइट स्थापना', description: 'पर्यावरण संरक्षण और ऊर्जा बचत को ध्यान में रखते हुए पंचायत के प्रमुख चौराहों पर 50 से अधिक सोलर स्ट्रीट लाइटें लगाई गई हैं।', badge: 'पूर्ण कार्य', image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&h=400&fit=crop', badgeColor: '#059669' },
    { id: 4, title: 'पंचायत भवन का जीर्णोद्धार', description: 'ग्राम पंचायत भवन की मरम्मत, रंग-रोगन और आधुनिक सुविधाओं के साथ उन्नयन कार्य सफलतापूर्वक पूर्ण किया गया है।', badge: 'पूर्ण कार्य', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', badgeColor: '#059669' },
    { id: 5, title: 'सार्वजनिक शौचालय निर्माण', description: 'स्वच्छ भारत मिशन के तहत बस स्टैंड और प्रमुख बाज़ारों में ग्रामीणों की सुविधा हेतु शौचालयों का निर्माण कार्य जारी है।', badge: 'प्रगति पर', image: 'https://images.unsplash.com/photo-1628167810574-0f3fdebafeee?w=600&h=400&fit=crop', badgeColor: '#D97706' },
    { id: 6, title: 'स्मार्ट आंगनवाड़ी केंद्र', description: 'बच्चों के सर्वांगीण विकास के लिए आधुनिक सुविधाओं से युक्त डिजिटल और स्मार्ट आंगनवाड़ी केंद्र का प्रस्ताव स्वीकृत हो चुका है।', badge: 'प्रस्तावित', image: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=600&h=400&fit=crop', badgeColor: '#1E40AF' }
  ]);

  useEffect(() => {
    const fetchWorksData = () => {
      const saved = localStorage.getItem('panchayat_dev_works_data');
      if (saved) setDevWorks(JSON.parse(saved));
    };
    fetchWorksData();
    window.addEventListener('storage', fetchWorksData);
    return () => window.removeEventListener('storage', fetchWorksData);
  }, []);

  return (
    <div id="works" className="dev-works-section">
      <div className="dev-container">
        <div className="stats-title-wrap">
          <div className="section-badge">
            <i className="fas fa-seedling"></i> हमारी प्रगति
          </div>
          <h2>
            ग्राम पंचायत के <span>विकास कार्य</span>
          </h2>
          <div className="underline"></div>
          <p className="section-subtitle">
            गाँव की उन्नति और ग्रामीणों की सुविधा के लिए निरंतर किए जा रहे प्रमुख कार्य और परियोजनाएं।
          </p>
        </div>

        <div className="dev-grid">
          {devWorks.map((work, idx) => (
            <div key={idx} className="dev-card">
              <div className="dev-img-wrap">
                <img src={work.image} alt={work.title} />
                <div className="dev-badge" style={{ background: work.badgeColor || '#059669' }}>
                  {work.badge}
                </div>
              </div>
              <div className="dev-content">
                <h3>{work.title}</h3>
                <p>{work.description}</p>
                <a href={`#work-${idx + 1}`} className="dev-btn">
                  आगे बढ़ें <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DevelopmentWorks;
