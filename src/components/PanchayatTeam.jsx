import React, { useState, useEffect } from 'react';

function PanchayatTeam() {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'श्रीमान रामसेवक पटेल', designation: 'सरपंच', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80', social: { facebook: '#', twitter: '#', whatsapp: 'https://wa.me/91' } },
    { id: 2, name: 'श्रीमान मोहन यादव', designation: 'उप-सरपंच', image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=500&q=80', social: { facebook: '#', twitter: '#', whatsapp: 'https://wa.me/91' } },
    { id: 3, name: 'श्रीमती गीता विश्वकर्मा', designation: 'सचिव', image: 'https://images.unsplash.com/photo-1611262588024-d12430b98925?w=500&q=80', social: { facebook: '#', twitter: '#', whatsapp: 'https://wa.me/91' } },
    { id: 4, name: 'श्रीमान सहायक सचिव', designation: 'सहायक सचिव', image: 'https://images.unsplash.com/photo-1542744095-291d1f67b221?w=500&q=80', social: { facebook: '#', twitter: '#', whatsapp: 'https://wa.me/91' } },
    { id: 5, name: 'श्रीमान सुरेश कुमार', designation: 'रोजगार सहायक', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80', social: { facebook: '#', twitter: '#', whatsapp: 'https://wa.me/91' } }
  ]);

  useEffect(() => {
    const fetchTeamData = () => {
      const saved = localStorage.getItem('panchayat_team_data_v2');
      if (saved) setTeamMembers(JSON.parse(saved));
    };
    fetchTeamData();
    window.addEventListener('storage', fetchTeamData);
    return () => window.removeEventListener('storage', fetchTeamData);
  }, []);

  return (
    <div className="panchayat-team-section">
      <div className="team-container">
        <div className="stats-title-wrap">
          <div className="section-badge">
            <i className="fas fa-users-cog"></i> पंचायत टीम
          </div>
          <h2>
            हमारे <span>प्रतिनिधि</span>
          </h2>
          <div className="underline"></div>
          <p className="section-subtitle">
            ग्राम पंचायत पथरिया जाट के विकास और प्रबंधन के लिए समर्पित हमारी टीम से मिलें।
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="team-card">
              <div className="team-image-wrap">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="team-content">
                <h3>{member.name}</h3>
                <p>{member.designation}</p>
                <div className="team-social-visible">
                  <a href={member.social?.facebook || '#'} target="_blank" rel="noopener noreferrer" title="Facebook"><i className="fab fa-facebook-f"></i></a>
                  <a href={member.social?.twitter || '#'} target="_blank" rel="noopener noreferrer" title="Twitter"><i className="fab fa-twitter"></i></a>
                  <a href={member.social?.whatsapp || '#'} target="_blank" rel="noopener noreferrer" title="WhatsApp"><i className="fab fa-whatsapp"></i></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PanchayatTeam;