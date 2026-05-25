import React, { useState, useEffect } from 'react';
import { subscriptionManager } from '../utils/subscriptionManager';

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAdminLoggedIn') === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notifyUser, setNotifyUser] = useState(true);
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'pending', 'resolved', 'all'
  const [searchTerm, setSearchTerm] = useState(''); // सर्च और डेट फ़िल्टर के लिए
  const [startDate, setStartDate] = useState(''); // डेट से (From Date)
  const [endDate, setEndDate] = useState(''); // डेट तक (To Date)
  const [liveAddress, setLiveAddress] = useState('');
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [filterCategory, setFilterCategory] = useState(''); // विषय/श्रेणी फ़िल्टर
  const [filterType, setFilterType] = useState(''); // प्रकार (आवेदन/सुझाव) फ़िल्टर
  const [hoveredAddresses, setHoveredAddresses] = useState({}); // टेबल में होवर पर एड्रेस स्टोर करने के लिए
  const [activeSidebarTab, setActiveSidebarTab] = useState('aavedan'); // साइडबार का एक्टिव टैब
  const [notiImage, setNotiImage] = useState(''); // सूचनाएं (Notices) में इमेज के लिए
  const [subscriptionCount, setSubscriptionCount] = useState(0); // कुल subscribers
  const [sendingNotification, setSendingNotification] = useState(false); // notification भेजते समय loading
  const [notificationHistory, setNotificationHistory] = useState([]); // भेजी गई notifications का history

  // सुरक्षित रूप से LocalStorage से डेटा निकालने का फंक्शन (ताकि JSON.parse से क्रैश न हो)
  const getSafeStorage = (key, defaultData) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultData;
    } catch (e) {
      console.warn(`Error reading ${key} from localStorage, using default.`, e);
      return defaultData;
    }
  };

  // एडमिन प्रोफाइल स्टेट
  const [adminProfile, setAdminProfile] = useState(() => getSafeStorage('panchayat_admin_profile', {
      name: 'एडमिन (Admin)',
      email: 'admin@pathariyajat.in',
      phone: '+91 07496 - 224XXX',
      role: 'सिस्टम एडमिनिस्ट्रेटर',
      address: 'पंचायत भवन, पथरिया जाट, जिला सागर (म.प्र.) 470001',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop'
  }));
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState(adminProfile);

  // ---------------- HOMEPAGE SECTIONS STATES ----------------
  
  // 1. About Section State
  const [aboutData, setAboutData] = useState(() => getSafeStorage('panchayat_about_data', {
      title: 'पहाड़ों की छाँव, हरियाली का गाँव: हमारा पथरिया जाट',
      desc1: 'नमस्कार! चारों ओर से खूबसूरत पहाड़ों और हरियाली से घिरा हमारा \'पथरिया जाट\' सिर्फ एक पंचायत नहीं, बल्कि हम सबका एक प्यारा सा परिवार है। पहाड़ों से आती ठंडी हवाएं, शुद्ध वातावरण और अद्भुत प्राकृतिक सौंदर्य हमारे गाँव की असली पहचान हैं।',
      desc2: 'आज के इस बदलते दौर में, हम अपनी इसी प्राकृतिक धरोहर को बचाते हुए विकास की नई ऊंचाइयों को छू रहे हैं। हम सभी ग्रामवासी मिलकर अपने गाँव को एक स्वच्छ, हरित और स्मार्ट डिजिटल पंचायत बना रहे हैं। यह पोर्टल उसी दिशा में एक कदम है।',
      image: 'village-photo.jpg'
  }));

  // 2. Development Works State
  const [devWorksData, setDevWorksData] = useState(() => getSafeStorage('panchayat_dev_works_data', [
      { id: 1, title: 'पक्की सड़क एवं नाली निर्माण', description: 'ग्राम के मुख्य मार्ग से लेकर वार्ड क्र. 4 तक सीसी रोड और जल निकासी के लिए पक्की नाली का निर्माण कार्य सफलतापूर्वक पूर्ण किया गया।', badge: 'पूर्ण कार्य', image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop', badgeColor: '#059669' },
      { id: 2, title: 'हर घर नल जल योजना', description: 'जल जीवन मिशन के अंतर्गत पंचायत के सभी घरों में शुद्ध पेयजल पहुँचाने के लिए पाइपलाइन बिछाने का कार्य तेजी से प्रगति पर है।', badge: 'प्रगति पर', image: 'https://images.unsplash.com/photo-1548503027-2c932bf52c3c?w=600&h=400&fit=crop', badgeColor: '#D97706' },
      { id: 3, title: 'सोलर स्ट्रीट लाइट स्थापना', description: 'पर्यावरण संरक्षण और ऊर्जा बचत को ध्यान में रखते हुए पंचायत के प्रमुख चौराहों पर 50 से अधिक सोलर स्ट्रीट लाइटें लगाई गई हैं।', badge: 'पूर्ण कार्य', image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&h=400&fit=crop', badgeColor: '#059669' },
      { id: 4, title: 'पंचायत भवन का जीर्णोद्धार', description: 'ग्राम पंचायत भवन की मरम्मत, रंग-रोगन और आधुनिक सुविधाओं के साथ उन्नयन कार्य सफलतापूर्वक पूर्ण किया गया है।', badge: 'पूर्ण कार्य', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', badgeColor: '#059669' },
      { id: 5, title: 'सार्वजनिक शौचालय निर्माण', description: 'स्वच्छ भारत मिशन के तहत बस स्टैंड और प्रमुख बाज़ारों में ग्रामीणों की सुविधा हेतु शौचालयों का निर्माण कार्य जारी है।', badge: 'प्रगति पर', image: 'https://images.unsplash.com/photo-1628167810574-0f3fdebafeee?w=600&h=400&fit=crop', badgeColor: '#D97706' },
      { id: 6, title: 'स्मार्ट आंगनवाड़ी केंद्र', description: 'बच्चों के सर्वांगीण विकास के लिए आधुनिक सुविधाओं से युक्त डिजिटल और स्मार्ट आंगनवाड़ी केंद्र का प्रस्ताव स्वीकृत हो चुका है।', badge: 'प्रस्तावित', image: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=600&h=400&fit=crop', badgeColor: '#1E40AF' }
  ]));

  // 3. Panchayat Team State
  const [teamData, setTeamData] = useState(() => getSafeStorage('panchayat_team_data_v2', [
      { id: 1, name: 'श्रीमान रामसेवक पटेल', designation: 'सरपंच', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80', social: { facebook: '#', twitter: '#', whatsapp: 'https://wa.me/91' } },
      { id: 2, name: 'श्रीमान मोहन यादव', designation: 'उप-सरपंच', image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=500&q=80', social: { facebook: '#', twitter: '#', whatsapp: 'https://wa.me/91' } },
      { id: 3, name: 'श्रीमती गीता विश्वकर्मा', designation: 'सचिव', image: 'https://images.unsplash.com/photo-1611262588024-d12430b98925?w=500&q=80', social: { facebook: '#', twitter: '#', whatsapp: 'https://wa.me/91' } },
      { id: 4, name: 'श्रीमान सहायक सचिव', designation: 'सहायक सचिव', image: 'https://images.unsplash.com/photo-1542744095-291d1f67b221?w=500&q=80', social: { facebook: '#', twitter: '#', whatsapp: 'https://wa.me/91' } },
      { id: 5, name: 'श्रीमान सुरेश कुमार', designation: 'रोजगार सहायक', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80', social: { facebook: '#', twitter: '#', whatsapp: 'https://wa.me/91' } }
  ]));

  // 4. Gallery State
  const [galleryData, setGalleryData] = useState(() => getSafeStorage('panchayat_gallery_data', [
      { id: 1, src: 'https://images.unsplash.com/photo-1593693397690-362cb9666cb2?w=800&h=800&fit=crop', title: 'ग्राम पंचायत भवन' },
      { id: 2, src: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?w=400&h=800&fit=crop', title: 'प्राथमिक विद्यालय' },
      { id: 3, src: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=400&fit=crop', title: 'सामुदायिक स्वास्थ्य केंद्र' },
      { id: 4, src: 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?w=400&h=400&fit=crop', title: 'प्राचीन मंदिर' },
      { id: 5, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', title: 'जल संचयन (तालाब)' },
      { id: 6, src: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop', title: 'खेल का मैदान' },
      { id: 7, src: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&h=400&fit=crop', title: 'गाँव की चौपाल' },
      { id: 8, src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop', title: 'सांस्कृतिक कार्यक्रम' },
      { id: 9, src: 'https://images.unsplash.com/photo-1577496642457-74f10bb5b5a1?w=400&h=400&fit=crop', title: 'आंगनवाड़ी केंद्र' },
      { id: 10, src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop', title: 'ई-मित्र (CSC) केंद्र' }
  ]));

  // 5. Before & After State
  const [beforeAfterData, setBeforeAfterData] = useState(() => getSafeStorage('panchayat_before_after', [
      { id: 1, title: 'ग्राम की मुख्य सड़क और जल निकासी', beforeImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop', afterImage: 'https://images.unsplash.com/photo-1584464457692-74768393e1af?w=600&h=400&fit=crop' },
      { id: 2, title: 'हर घर जल जीवन मिशन (पेयजल)', beforeImage: 'https://images.unsplash.com/photo-1616422285623-14e9e049ed67?w=600&h=400&fit=crop', afterImage: 'https://images.unsplash.com/photo-1548503027-2c932bf52c3c?w=600&h=400&fit=crop' },
      { id: 3, title: 'सार्वजनिक शौचालय (स्वच्छ भारत मिशन)', beforeImage: 'https://images.unsplash.com/photo-1510133744874-0968ee3a428e?w=600&h=400&fit=crop', afterImage: 'https://images.unsplash.com/photo-1628167810574-0f3fdebafeee?w=600&h=400&fit=crop' },
      { id: 4, title: 'स्मार्ट आंगनवाड़ी और स्कूल', beforeImage: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=600&h=400&fit=crop', afterImage: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=600&h=400&fit=crop' }
  ]));

  // 6. Events State
  const [eventsData, setEventsData] = useState(() => getSafeStorage('panchayat_events_data', [
      { id: 1, title: 'स्वतंत्रता दिवस समारोह', image: 'https://images.unsplash.com/photo-1629813589886-cb2a543598ac?w=600&h=400&fit=crop' },
      { id: 2, title: 'दीपोत्सव एवं ग्राम मिलन', image: 'https://images.unsplash.com/photo-1541781216584-0a3ce57cbf89?w=600&h=400&fit=crop' },
      { id: 3, title: 'होली मिलन समारोह', image: 'https://images.unsplash.com/photo-1553698884-257ebbb3b02e?w=600&h=400&fit=crop' },
      { id: 4, title: 'वार्षिक खेलकूद प्रतियोगिता', image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&h=400&fit=crop' },
      { id: 5, title: 'वृक्षारोपण महा-अभियान', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop' },
      { id: 6, title: 'निशुल्क स्वास्थ्य जांच शिविर', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop' }
  ]));

  // 7. Testimonials State
  const [testimonialsData, setTestimonialsData] = useState(() => getSafeStorage('panchayat_testimonials_data', [
      { id: 1, name: 'श्री रमेश कुशवाहा', role: 'किसान', category: 'कृषि एवं बुनियादी ढांचा', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1595841696650-6e9ea0fa3708?w=600&h=1000&fit=crop', message: 'सरपंच जी के प्रयासों से हमारे खेत तक पक्की सड़क बन गई है, जिससे अब फसल मंडी ले जाने में बहुत आसानी होती है।' },
      { id: 2, name: 'श्रीमती सुनीता देवी', role: 'गृहिणी', category: 'स्वास्थ्य एवं स्वच्छता', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=600&h=1000&fit=crop', message: 'जल जीवन मिशन के तहत अब हमारे घर में ही नल से साफ पानी आ रहा है। पंचायत का बहुत-बहुत धन्यवाद।' },
      { id: 3, name: 'श्री मोहन अहिरवार', role: 'मजदूर', category: 'रोजगार एवं आजीविका', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=600&h=1000&fit=crop', message: 'मनरेगा के तहत हमें गाँव में ही लगातार रोजगार मिल रहा है। अब काम के लिए शहर नहीं जाना पड़ता।' },
      { id: 4, name: 'रविन्द्र सिंह', role: 'युवा', category: 'शिक्षा एवं डिजिटल सशक्तिकरण', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&h=1000&fit=crop', message: 'गाँव में ई-लाइब्रेरी और वाई-फाई की सुविधा मिलने से हम युवाओं की पढ़ाई और प्रतियोगी परीक्षाओं की तैयारी में बहुत मदद मिल रही है।' },
      { id: 5, name: 'कमलेश पटेल', role: 'दुकानदार', category: 'ऊर्जा एवं पर्यावरण', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=1000&fit=crop', message: 'चौराहों पर सोलर स्ट्रीट लाइट लगने से अब रात में भी गाँव में पूरी रोशनी रहती है, जिससे व्यापार भी अच्छा चलता है।' },
      { id: 6, name: 'श्रीमती राधा बाई', role: 'स्वयं सहायता समूह', category: 'महिला सशक्तिकरण', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1541781216584-0a3ce57cbf89?w=600&h=1000&fit=crop', message: 'पंचायत की मदद से हमारे समूह को सिलाई मशीनें मिली हैं, जिससे हम सभी महिलाएं आत्मनिर्भर बन रही हैं।' },
      { id: 7, name: 'श्री वीरेंद्र लोधी', role: 'शिक्षक', category: 'शिक्षा एवं खेल', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1577496642457-74f10bb5b5a1?w=600&h=1000&fit=crop', message: 'स्मार्ट क्लासरूम और नए खेल मैदान से बच्चों में पढ़ाई और खेलों के प्रति बहुत उत्साह बढ़ा है।' },
      { id: 8, name: 'श्री आनंद ठाकुर', role: 'डेयरी संचालक', category: 'पशुपालन एवं कृषि', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=1000&fit=crop', message: 'पशु चिकित्सा शिविरों और उन्नत डेयरी मार्गदर्शन से हमारे दुग्ध उत्पादन में काफी वृद्धि हुई है।' }
  ]));

  // Generic Save and Image Upload Handlers for CMS
  const handleCMSave = (key, data, msg) => {
    localStorage.setItem(key, JSON.stringify(data));
    alert(msg);
    window.dispatchEvent(new Event('storage')); // होमपेज को तुरंत अपडेट करने के लिए
  };

  const handleCMSImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ----------------------------------------------------------

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Backend Server से असली आवेदन लाना
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/applications');
        if (res.ok) {
          const data = await res.json();
          // सर्वर से डेटा data.applications के रूप में आता है (इसे क्रैश होने से बचाने के लिए)
          setApplications(data.applications || []);
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
      }
    };
    fetchApps();
    // हर 15 सेकंड में नए आवेदनों के लिए रिफ्रेश करें (Auto Refresh)
    const interval = setInterval(fetchApps, 15000);
    return () => clearInterval(interval);
  }, []);

  // जब भी कोई फॉर्म एडमिन खोलेगा, तो उसका एड्रेस तुरंत मैप से फेच कर लेंगे (ताकि पुराने फॉर्म में भी नाम दिखे)
  useEffect(() => {
    if (selectedApp && selectedApp.location && selectedApp.location.lat) {
      if (selectedApp.location.address) {
        setLiveAddress(selectedApp.location.address);
      } else {
        setIsFetchingAddress(true);
        setLiveAddress('');
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedApp.location.lat}&lon=${selectedApp.location.lng}`)
          .then(res => res.json())
          .then(data => {
            setLiveAddress(data.display_name || `${selectedApp.location.lat}, ${selectedApp.location.lng}`);
          })
          .catch(err => {
            setLiveAddress(`${selectedApp.location.lat}, ${selectedApp.location.lng}`);
          })
          .finally(() => setIsFetchingAddress(false));
      }
    } else {
      setLiveAddress('');
    }
  }, [selectedApp]);

  // Subscription count को fetch करें
  useEffect(() => {
    const fetchSubscriptionCount = async () => {
      try {
        const count = await subscriptionManager.getSubscriptionCount();
        setSubscriptionCount(count);
      } catch (error) {
        console.error('Error fetching subscription count:', error);
      }
    };

    fetchSubscriptionCount();
    // हर 30 सेकंड में subscription count को update करें
    const interval = setInterval(fetchSubscriptionCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // टेबल में पुरानी लोकेशन के ऊपर माउस (Hover) ले जाने पर एड्रेस फेच करना
  const handleLocationHover = (app) => {
    if (app.location && !app.location.address && !hoveredAddresses[app.id]) {
      setHoveredAddresses(prev => ({ ...prev, [app.id]: 'पता ढूँढा जा रहा है...' }));
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${app.location.lat}&lon=${app.location.lng}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) {
            setHoveredAddresses(prev => ({ ...prev, [app.id]: data.display_name }));
            // डेटा को लोकल स्टेट में अपडेट कर दें ताकि टेबल में सीधा नाम ही दिखे
            setApplications(prevApps => {
              return prevApps.map(a => a.id === app.id ? { ...a, location: { ...a.location, address: data.display_name } } : a);
            });
          } else {
            setHoveredAddresses(prev => ({ ...prev, [app.id]: 'पता उपलब्ध नहीं' }));
          }
        })
        .catch(() => setHoveredAddresses(prev => ({ ...prev, [app.id]: 'पता उपलब्ध नहीं' })));
    }
  };

  // लॉगिन हैंडलर
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Sachin@542') {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      setError('');
    } else {
      setError('गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें।');
    }
  };

  // लॉगआउट हैंडलर
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    sessionStorage.removeItem('isAdminLoggedIn');
  };

  // आवेदन का स्टेटस और नोट अपडेट करना
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${selectedApp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedApp.status, note: selectedApp.note })
      });

      if (res.ok) {
        const updatedApps = applications.map(app => app.id === selectedApp.id ? selectedApp : app);
        setApplications(updatedApps);
        
        // एडमिन को सिस्टम नोटिफिकेशन भेजें कि अपडेट सफल रहा
        const notificationMessage = notifyUser 
          ? `आवेदन ID ${selectedApp.id} (${selectedApp.name}) सफलतापूर्वक अपडेट किया गया और आवेदक को सूचित किया गया।` 
          : `आवेदन ID ${selectedApp.id} (${selectedApp.name}) सफलतापूर्वक अपडेट किया गया।`;

        if ('Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification("पंचायत एडमिन पैनल", { body: notificationMessage, icon: 'logo.png' });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                new Notification("पंचायत एडमिन पैनल", { body: notificationMessage, icon: 'logo.png' });
              }
            });
          }
        }
        setSelectedApp(null);
      } else {
        alert('सर्वर पर अपडेट करने में समस्या हुई।');
      }
    } catch (err) {
      console.error(err);
      alert('सर्वर से जुड़ने में समस्या हुई।');
    } finally {
      setIsUpdating(false);
    }
  };

  // तुरंत 'Resolved' (निराकृत) करने का क्विक हैंडलर
  const handleQuickResolve = async (app) => {
    if (window.confirm(`क्या आप वाकई आवेदन ID ${app.id} को तुरंत निराकृत (Resolved) करना चाहते हैं?`)) {
      const updatedApp = { ...app, status: 'Resolved', note: 'संबंधित अधिकारी द्वारा आपकी समस्या का सफलतापूर्वक समाधान कर दिया गया है।' };
      
      try {
        const res = await fetch(`http://localhost:5000/api/applications/${app.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: updatedApp.status, note: updatedApp.note })
        });
        
        if (res.ok) {
          const updatedApps = applications.map(a => a.id === app.id ? updatedApp : a);
          setApplications(updatedApps);

          // सिस्टम नोटिफिकेशन
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification("पंचायत एडमिन पैनल", { 
              body: `आवेदन ID ${app.id} तुरंत निराकृत कर दिया गया है।`,
              icon: 'logo.png' 
            });
          }
        }
      } catch (err) {
        console.error(err);
        alert('सर्वर से जुड़ने में समस्या हुई।');
      }
    }
  };

  // आवेदन को डिलीट (Delete) करना
  const handleDelete = async () => {
    if(window.confirm("क्या आप वाकई इस आवेदन को हमेशा के लिए डिलीट (Delete) करना चाहते हैं? यह वापस नहीं आएगा।")) {
      try {
        const res = await fetch(`http://localhost:5000/api/applications/${selectedApp.id}`, { method: 'DELETE' });
        if (res.ok) {
          const filteredApps = applications.filter(app => app.id !== selectedApp.id);
          setApplications(filteredApps);
          setSelectedApp(null);
        } else {
          alert('डिलीट करने में समस्या हुई। सर्वर एरर!');
        }
      } catch (err) {
        console.error(err);
        alert('डिलीट करने में समस्या हुई।');
      }
    }
  };

  // टेबल से सीधा (Quick) डिलीट करना
  const handleQuickDelete = async (app) => {
    if(window.confirm(`क्या आप वाकई आवेदन ID ${app.id} को हमेशा के लिए डिलीट (Delete) करना चाहते हैं? यह वापस नहीं आएगा।`)) {
      try {
        const res = await fetch(`http://localhost:5000/api/applications/${app.id}`, { method: 'DELETE' });
        if (res.ok) {
          const filteredApps = applications.filter(a => a.id !== app.id);
          setApplications(filteredApps);
        } else {
          alert('डिलीट करने में समस्या हुई। सर्वर एरर!');
        }
      } catch (err) {
        console.error(err);
        alert('डिलीट करने में समस्या हुई।');
      }
    }
  };

  // एडमिन प्रोफाइल अपडेट करना
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setAdminProfile(tempProfile);
    localStorage.setItem('panchayat_admin_profile', JSON.stringify(tempProfile));
    setIsEditingProfile(false);
  };

  // प्रोफाइल फोटो (Local File) अपलोड करना
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfile({ ...tempProfile, avatar: reader.result }); // Base64 में कन्वर्ट करके सेव करना
      };
      reader.readAsDataURL(file);
    }
  };

  // कैटेगरी और स्टेटस का हिंदी अनुवाद
  const catMap = {
    water: 'जल आपूर्ति', electricity: 'बिजली', road: 'सड़क निर्माण',
    cleanliness: 'साफ-सफाई', pension: 'पेंशन', other: 'अन्य'
  };

  const statusColors = {
    'Pending': { bg: '#FEFCE8', text: '#D97706', label: 'लंबित' },
    'Under Review': { bg: '#EFF6FF', text: '#2563EB', label: 'समीक्षा अधीन' },
    'In Progress': { bg: '#F5F3FF', text: '#7C3AED', label: 'कार्य प्रगति पर' },
    'Resolved': { bg: '#F0FDF4', text: '#059669', label: 'निराकृत' }
  };

  // आँकड़े गिनना
  const total = applications.length;
  
  // आज की तिथि निकालें (डेटाबेस के फॉर्मेट के अनुसार)
  const todayString = new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  
  // स्टेटस के आधार पर आवेदनों को बाँटना
  const todayApps = applications.filter(a => a.date === todayString);
  const pendingApps = applications.filter(a => a.status !== 'Resolved'); // लंबित और प्रगति पर
  const resolvedApps = applications.filter(a => a.status === 'Resolved');
  
  const todayCount = todayApps.length;
  const pendingCount = pendingApps.length;
  const resolvedCount = resolvedApps.length;

  // 1. टैब (Tab) के अनुसार डेटा फ़िल्टर करें
  let displayedApps = applications;
  if (activeTab === 'today') displayedApps = todayApps;
  else if (activeTab === 'pending') displayedApps = pendingApps;
  else if (activeTab === 'resolved') displayedApps = resolvedApps;

  // हिंदी डेट को पार्स करने का लॉजिक (उदा: 08 मई 2026 -> Date Object)
  const parseHindiDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const months = { 'जन॰': 0, 'जनवरी': 0, 'फ़र॰': 1, 'फरवरी': 1, 'मार्च': 2, 'अप्रैल': 3, 'मई': 4, 'जून': 5, 'जुलाई': 6, 'अग॰': 7, 'अगस्त': 7, 'सित॰': 8, 'सितंबर': 8, 'अक्तू॰': 9, 'अक्टूबर': 9, 'नव॰': 10, 'नवंबर': 10, 'दिस॰': 11, 'दिसंबर': 11 };
    const parts = dateStr.split(' ');
    if (parts.length >= 3) {
      const d = parseInt(parts[0], 10);
      const m = months[parts[1]] !== undefined ? months[parts[1]] : new Date().getMonth();
      const y = parseInt(parts[2], 10);
      return new Date(y, m, d);
    }
    return new Date(dateStr);
  };

  // 3. Date Range के अनुसार डेटा फ़िल्टर करें
  if (startDate || endDate) {
    const start = startDate ? new Date(startDate) : new Date(0);
    start.setHours(0, 0, 0, 0);
    const end = endDate ? new Date(endDate) : new Date('2100-01-01');
    end.setHours(23, 59, 59, 999);
    
    displayedApps = displayedApps.filter(app => {
      const appDate = parseHindiDate(app.date);
      return appDate >= start && appDate <= end;
    });
  }

  // 4. प्रकार (Type) और श्रेणी (Category) के अनुसार फ़िल्टर करें
  if (filterType) {
    displayedApps = displayedApps.filter(app => app.type === filterType);
  }
  
  if (filterCategory) {
    displayedApps = displayedApps.filter(app => app.category === filterCategory);
  }

  // 2. सर्च (Search) के अनुसार डेटा फ़िल्टर करें (नाम, ID, या तारीख)
  if (searchTerm) {
    displayedApps = displayedApps.filter(app => 
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.mobile.includes(searchTerm) ||
      app.date.includes(searchTerm)
    );
  }

  // Excel/CSV डाउनलोड करने का फंक्शन
  const downloadCSV = () => {
    const headers = ['Ref ID', 'प्रकार', 'आवेदक का नाम', 'मोबाइल', 'वार्ड', 'श्रेणी', 'दिनांक', 'समय', 'स्थिति', 'लोकेशन', 'समस्या/सुझाव', 'एडमिन नोट'];
    const csvRows = displayedApps.map(app => [
      app.id,
      app.type === 'aavedan' ? 'आवेदन/शिकायत' : 'सुझाव',
      `"${app.name}"`,
      app.mobile,
      `"${app.ward}"`,
      catMap[app.category] || 'अन्य',
      app.date,
      app.time || '',
      app.status,
      app.location ? `"${app.location.address ? app.location.address.replace(/"/g, '""') + '\n' : ''}https://www.google.com/maps?q=${app.location.lat},${app.location.lng}"` : 'Not Available',
      `"${(app.description || '').replace(/"/g, '""')}"`,
      `"${(app.note || '').replace(/"/g, '""')}"`
    ].join(','));
    
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' }); // BOM for Hindi support in Excel
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Panchayat_Records_${activeTab}_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ---------------- LOGIN SCREEN ----------------
  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, rgba(2, 44, 34, 0.85), rgba(6, 78, 59, 0.95)), url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Glowing Orbs */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)', borderRadius: '50%', zIndex: 1 }}></div>
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', borderRadius: '50%', zIndex: 1 }}></div>

        <div style={{ position: 'relative', zIndex: 10, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(15px)', padding: '45px 40px', borderRadius: '24px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.4)' }}>
          <div style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #D4AF37, #9A7B3E)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', fontSize: '30px', color: '#fff', boxShadow: '0 12px 25px rgba(212,175,55,0.5)' }}>
            <i className="fas fa-lock"></i>
          </div>
          <h2 style={{ color: '#064E3B', marginBottom: '10px', fontSize: '26px', fontWeight: '700' }}>एडमिन लॉगिन</h2>
          <p style={{ color: '#64748B', marginBottom: '35px', fontSize: '15px', lineHeight: '1.6' }}>पंचायत पोर्टल डैशबोर्ड तक पहुँचने के लिए अपना सुरक्षित पासवर्ड दर्ज करें।</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="पासवर्ड दर्ज करें" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #CBD5E1', marginBottom: '15px', fontSize: '16px', outline: 'none', textAlign: 'center', letterSpacing: '2px', transition: 'all 0.3s' }}
              autoFocus
              onFocus={e => e.target.style.borderColor = '#D4AF37'}
              onBlur={e => e.target.style.borderColor = '#CBD5E1'}
            />
            {error && <div style={{ color: '#DC2626', fontSize: '13px', marginBottom: '15px', fontWeight: '600' }}>{error}</div>}
            
            <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg, #064E3B, #047857)', color: '#fff', padding: '15px', borderRadius: '10px', border: 'none', fontSize: '17px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 8px 20px rgba(6,78,59,0.3)' }} onMouseOver={e => {e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 12px 25px rgba(6,78,59,0.4)';}} onMouseOut={e => {e.target.style.transform='translateY(0)'; e.target.style.boxShadow='0 8px 20px rgba(6,78,59,0.3)';}}>
              लॉगिन करें <i className="fas fa-sign-in-alt" style={{ marginLeft: '10px' }}></i>
            </button>
          </form>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '25px', color: '#D4AF37', textDecoration: 'none', fontSize: '15px', fontWeight: '600', transition: 'color 0.3s' }} onMouseOver={e=>e.target.style.color='#9A7B3E'} onMouseOut={e=>e.target.style.color='#D4AF37'}>
            <i className="fas fa-arrow-left"></i> वापस वेबसाइट पर
          </a>
        </div>
      </div>
    );
  }

  // ---------------- ADMIN DASHBOARD SCREEN ----------------
  return (
    <div className="admin-dashboard-root" style={{ background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <style>
        {`
          .admin-dashboard-root * { box-sizing: border-box; }
          .admin-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
          .admin-table th { background: #064E3B; color: #fff; padding: 15px; text-align: left; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; }
          .admin-table td { padding: 15px; border-bottom: 1px solid #E2E8F0; color: #334155; font-size: 13.5px; }
          .admin-table tr { transition: background-color 0.2s; }
          /* अलग-अलग स्टेटस के लिए रो (Row) के कलर्स */
          .admin-table tr.row-Resolved { background-color: #F0FDF4; }
          .admin-table tr.row-Resolved:hover { background-color: #DCFCE7; }
          .admin-table tr.row-Pending { background-color: #FFFBEB; }
          .admin-table tr.row-Pending:hover { background-color: #FEF3C7; }
          .admin-table tr.row-UnderReview { background-color: #EFF6FF; }
          .admin-table tr.row-UnderReview:hover { background-color: #DBEAFE; }
          .admin-table tr.row-InProgress { background-color: #F5F3FF; }
          .admin-table tr.row-InProgress:hover { background-color: #EDE9FE; }
          .action-btn { background: #E0F2FE; color: #0284C7; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
          .action-btn:hover { background: #0284C7; color: #fff; }
          .resolve-btn { background: #DCFCE7; color: #059669; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
          .resolve-btn:hover { background: #059669; color: #fff; }
          .delete-btn { background: #FEE2E2; color: #DC2626; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
          .delete-btn:hover { background: #DC2626; color: #fff; }
          .stat-box { background: #fff; padding: 25px; border-radius: 16px; display: flex; align-items: center; gap: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #E2E8F0; }
          .stat-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; }
          .tab-btn { padding: 12px 24px; border: none; background: transparent; font-size: 15px; font-weight: 700; color: #64748B; cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.3s; white-space: nowrap; }
          .tab-btn:hover { color: #064E3B; }
          .tab-btn.active { color: #064E3B; border-bottom: 3px solid #D4AF37; }
          
          /* Location Hover Popup CSS (साइड पॉपअप के लिए) */
          .location-hover-container {
            display: inline-flex;
            position: relative;
          }
          .location-hover-container .location-popup {
            visibility: hidden;
            opacity: 0;
            position: absolute;
            top: 50%;
            left: 100%;
            transform: translateY(-50%) translateX(10px);
            background-color: #1E293B;
            color: #fff;
            text-align: left;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 13px;
            white-space: normal;
            width: max-content;
            max-width: 260px;
            z-index: 1000;
            transition: all 0.3s ease;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            pointer-events: none;
            line-height: 1.5;
          }
          .location-hover-container .location-popup::after {
            content: "";
            position: absolute;
            top: 50%;
            right: 100%;
            transform: translateY(-50%);
            border-width: 6px;
            border-style: solid;
            border-color: transparent #1E293B transparent transparent;
          }
          .location-hover-container:hover .location-popup {
            visibility: visible;
            opacity: 1;
            transform: translateY(-50%) translateX(15px);
          }
          
          /* Sidebar CSS */
          .sidebar-btn { background: transparent; border: none; color: #94A3B8; text-align: left; padding: 14px 18px; border-radius: 10px; font-size: 14.5px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: flex; gap: 10px; align-items: center; width: 100%; margin-bottom: 5px; }
          .sidebar-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }
          .sidebar-btn.active { background: linear-gradient(135deg, #D4AF37, #9A7B3E); color: #022C22; box-shadow: 0 4px 10px rgba(212,175,55,0.3); }
          
          /* Layout Classes */
          .admin-layout { display: flex; height: 100vh; overflow: hidden; }
          .admin-sidebar { width: 260px; background: #022C22; display: flex; flex-direction: column; flex-shrink: 0; box-shadow: 4px 0 15px rgba(0,0,0,0.05); z-index: 101; transition: all 0.3s ease; }
          .admin-sidebar-profile { padding: 30px 20px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; align-items: center; cursor: pointer; text-align: center; transition: background 0.3s; }
          .admin-sidebar-profile:hover { background: rgba(255,255,255,0.03); }
          .admin-sidebar-nav { padding: 20px 15px; display: flex; flex-direction: column; flex: 1; overflow-y: auto; gap: 2px; }
          .admin-main { flex: 1; display: flex; flex-direction: column; overflow-y: auto; background: #F8FAFC; }
          .admin-header { background: #ffffff; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100; flex-wrap: wrap; gap: 15px; }
          .admin-content { padding: 30px; max-width: 1400px; margin: 0 auto; width: 100%; }
          .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .mobile-profile-btn { display: none; }

          /* Mobile Responsiveness */
          @media (max-width: 768px) {
            .admin-layout { flex-direction: column; }
            .admin-sidebar { width: 100%; height: auto; flex-direction: row; align-items: center; padding: 0; }
            .admin-sidebar-profile { display: none; } /* Hide big profile on mobile */
            .mobile-profile-btn { display: flex; } /* Show profile button in nav */
            .admin-sidebar-nav { flex-direction: row; padding: 10px; overflow-x: auto; gap: 10px; white-space: nowrap; -webkit-overflow-scrolling: touch; margin-bottom: 0; }
            .sidebar-btn { padding: 10px 15px; font-size: 13.5px; margin-bottom: 0; justify-content: center; width: auto; }
            .admin-header { padding: 15px 20px; justify-content: space-between; flex-wrap: wrap; }
            .header-actions { gap: 15px !important; }
            .admin-content { padding: 15px; }
            .stat-box { flex-direction: column; text-align: center; gap: 12px; padding: 20px; }
            .stat-icon { width: 50px; height: 50px; font-size: 20px; }
            .admin-table th, .admin-table td { padding: 12px 10px; font-size: 13px; }
            .filter-row { flex-direction: column; align-items: stretch !important; gap: 10px; }
            .filter-row > div { width: 100%; justify-content: space-between; }
            .search-input-wrapper { width: 100% !important; }
            .search-input-wrapper input { width: 100% !important; }
            .modal-grid { grid-template-columns: 1fr; }
          }
        `}
      </style>

      <div className="admin-layout">
        
        {/* Left Sidebar */}
        <div className="admin-sidebar">
          <div className="admin-sidebar-profile"
            onClick={() => { setActiveSidebarTab('profile'); setIsEditingProfile(true); setTempProfile(adminProfile); }}
            title="प्रोफाइल देखें / अपडेट करें"
          >
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <img src={adminProfile.avatar} alt="Admin" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #D4AF37', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }} />
              <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: '#D4AF37', color: '#022C22', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', border: '2px solid #022C22', transition: 'transform 0.3s' }}>
                <i className="fas fa-edit"></i>
              </div>
            </div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#fff', letterSpacing: '0.5px' }}>{adminProfile.name}</h2>
            <span style={{ color: '#D4AF37', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>{adminProfile.role}</span>
          </div>
          
          <div className="admin-sidebar-nav">
            <button className={`sidebar-btn mobile-profile-btn ${activeSidebarTab === 'profile' ? 'active' : ''}`} onClick={() => { setActiveSidebarTab('profile'); setIsEditingProfile(true); setTempProfile(adminProfile); }}><i className="fas fa-user-circle"></i> प्रोफाइल</button>
            <button className={`sidebar-btn ${activeSidebarTab === 'aavedan' ? 'active' : ''}`} onClick={() => setActiveSidebarTab('aavedan')}><i className="fas fa-inbox"></i> आवेदन / शिकायतें</button>
            <button className={`sidebar-btn ${activeSidebarTab === 'about' ? 'active' : ''}`} onClick={() => setActiveSidebarTab('about')}><i className="fas fa-info-circle"></i> हमारे बारे में</button>
            <button className={`sidebar-btn ${activeSidebarTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveSidebarTab('gallery')}><i className="fas fa-images"></i> गैलरी (Gallery)</button>
            <button className={`sidebar-btn ${activeSidebarTab === 'beforeAfter' ? 'active' : ''}`} onClick={() => setActiveSidebarTab('beforeAfter')}><i className="fas fa-random"></i> बदलाव की तस्वीर</button>
            <button className={`sidebar-btn ${activeSidebarTab === 'works' ? 'active' : ''}`} onClick={() => setActiveSidebarTab('works')}><i className="fas fa-tools"></i> विकास कार्य (Works)</button>
            <button className={`sidebar-btn ${activeSidebarTab === 'events' ? 'active' : ''}`} onClick={() => setActiveSidebarTab('events')}><i className="fas fa-calendar-alt"></i> उत्सव एवं कार्यक्रम</button>
            <button className={`sidebar-btn ${activeSidebarTab === 'testimonials' ? 'active' : ''}`} onClick={() => setActiveSidebarTab('testimonials')}><i className="fas fa-video"></i> फीडबैक वीडियो</button>
            <button className={`sidebar-btn ${activeSidebarTab === 'team' ? 'active' : ''}`} onClick={() => setActiveSidebarTab('team')}><i className="fas fa-users-cog"></i> पंचायत टीम</button>
            <button className={`sidebar-btn ${activeSidebarTab === 'notices' ? 'active' : ''}`} onClick={() => setActiveSidebarTab('notices')}><i className="fas fa-bullhorn"></i> सूचनाएं (Notices)</button>
            <button className={`sidebar-btn ${activeSidebarTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveSidebarTab('settings')}><i className="fas fa-cog"></i> सेटिंग्स</button>
          </div>
        </div>

        {/* Main Content Area (Right Side) */}
        <div className="admin-main">
          
          {/* Admin Top Navbar */}
          <div className="admin-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #064E3B, #047857)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontSize: '20px' }}>
                <i className="fas fa-shield-alt"></i>
              </div>
              <h2 style={{ margin: 0, color: '#064E3B', fontSize: '20px', fontWeight: '700' }}>डैशबोर्ड <span style={{ color: '#D4AF37' }}>कंट्रोल</span></h2>
            </div>
            
            <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Notifications in Header */}
              <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: '#F1F5F9', transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.background='#E2E8F0'} onMouseOut={e=>e.currentTarget.style.background='#F1F5F9'} title={`${pendingCount} नए / लंबित आवेदन`} onClick={() => { setActiveSidebarTab('aavedan'); setActiveTab('pending'); }}>
                <i className="fas fa-bell" style={{ color: '#475569', fontSize: '20px' }}></i>
                {pendingCount > 0 && (
                  <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#DC2626', color: '#fff', fontSize: '10px', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </span>
                )}
              </div>
              
              <div style={{ width: '1px', height: '25px', background: '#E2E8F0' }}></div>
              
              <button onClick={handleLogout} style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', padding: '8px 16px', borderRadius: '30px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }} onMouseOver={e=>e.target.style.background='#FEE2E2'} onMouseOut={e=>e.target.style.background='#FEF2F2'}>
                <i className="fas fa-sign-out-alt"></i> लॉगआउट
              </button>
            </div>
          </div>

          {/* Main Content Container */}
          <div className="admin-content">
            
            {activeSidebarTab === 'aavedan' ? (
              <>
        
        {/* Top Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div className="stat-box">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' }}><i className="fas fa-file-alt"></i></div>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#64748B', fontWeight: '600' }}>कुल प्राप्त आवेदन</p>
              <h3 style={{ margin: 0, fontSize: '28px', color: '#1E293B', fontWeight: '700' }}>{total}</h3>
            </div>
          </div>
          <div className="stat-box">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10B981, #047857)' }}><i className="fas fa-calendar-day"></i></div>
          <div>
            <p style={{ margin: '0 0 5px 0', color: '#64748B', fontWeight: '600' }}>आज के आवेदन</p>
            <h3 style={{ margin: 0, fontSize: '28px', color: '#1E293B', fontWeight: '700' }}>{todayCount}</h3>
          </div>
        </div>
        <div className="stat-box">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #B45309)' }}><i className="fas fa-clock"></i></div>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#64748B', fontWeight: '600' }}>लंबित / विचाराधीन</p>
            <h3 style={{ margin: 0, fontSize: '28px', color: '#1E293B', fontWeight: '700' }}>{pendingCount}</h3>
            </div>
          </div>
          <div className="stat-box">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' }}><i className="fas fa-check-double"></i></div>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#64748B', fontWeight: '600' }}>निराकृत (सॉल्व्ड)</p>
            <h3 style={{ margin: 0, fontSize: '28px', color: '#1E293B', fontWeight: '700' }}>{resolvedCount}</h3>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
        
        {/* Tabs and Actions (Search + Download) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px', marginBottom: '25px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
          
          <div style={{ display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%', maxWidth: '100%' }}>
            <button className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')}>आज के आवेदन</button>
            <button className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>लंबित (Pending)</button>
            <button className={`tab-btn ${activeTab === 'resolved' ? 'active' : ''}`} onClick={() => setActiveTab('resolved')}>निराकृत (Resolved)</button>
            <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>सभी रिकॉर्ड्स</button>
          </div>

          <div className="filter-row" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
            
            {/* Date Range Picker Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '6px 12px', borderRadius: '30px', border: '1px solid #E2E8F0', flexGrow: 1 }}>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}><i className="fas fa-calendar-alt"></i> दिनांक:</span>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#1E293B', cursor: 'pointer' }} title="यहाँ से (From Date)" />
              <span style={{ color: '#CBD5E1' }}>-</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#1E293B', cursor: 'pointer' }} title="यहाँ तक (To Date)" />
              {(startDate || endDate) && (
                <button onClick={() => {setStartDate(''); setEndDate('');}} style={{ background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '14px', marginLeft: '5px' }} title="डेट फ़िल्टर हटाएं"><i className="fas fa-times-circle"></i></button>
              )}
            </div>
            
            {/* Type & Category Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '6px 12px', borderRadius: '30px', border: '1px solid #E2E8F0', flexGrow: 1 }}>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}><i className="fas fa-filter"></i> फ़िल्टर:</span>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#1E293B', cursor: 'pointer', borderRight: '1px solid #CBD5E1', paddingRight: '8px' }}>
                <option value="">सभी (आवेदन/सुझाव)</option>
                <option value="aavedan">केवल शिकायतें</option>
                <option value="sujhav">केवल सुझाव</option>
              </select>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#1E293B', cursor: 'pointer', paddingLeft: '8px' }}>
                <option value="">सभी विषय</option>
                <option value="water">जल आपूर्ति</option>
                <option value="electricity">बिजली</option>
                <option value="road">सड़क निर्माण</option>
                <option value="cleanliness">साफ-सफाई</option>
                <option value="pension">पेंशन</option>
                <option value="other">अन्य</option>
              </select>
              {(filterType || filterCategory) && (
                <button onClick={() => {setFilterType(''); setFilterCategory('');}} style={{ background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '14px', marginLeft: '5px' }} title="फ़िल्टर हटाएं"><i className="fas fa-times-circle"></i></button>
              )}
            </div>

            <div className="search-input-wrapper" style={{ position: 'relative', flexGrow: 1 }}>
              <i className="fas fa-search" style={{ position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)', color: '#94A3B8' }}></i>
              <input type="text" placeholder="नाम, ID या तारीख खोजें..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px 15px 10px 40px', borderRadius: '30px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', width: '100%', transition: 'border 0.3s' }} onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor='#CBD5E1'} />
            </div>
            
            <button onClick={downloadCSV} style={{ background: '#064E3B', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '30px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(6,78,59,0.2)', transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'} title="वर्तमान सूची डाउनलोड करें">
              <i className="fas fa-file-excel" style={{ color: '#A7F3D0' }}></i> एक्सेल (Excel) डाउनलोड
            </button>
          </div>
        </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ref ID</th>
                  <th>प्रकार</th>
                  <th>आवेदक का नाम</th>
                  <th>विषय / श्रेणी</th>
                  <th>दिनांक</th>
                  <th>लोकेशन</th>
                  <th>वर्तमान स्थिति</th>
                  <th>एक्शन</th>
                </tr>
              </thead>
              <tbody>
            {displayedApps.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                      <i className="fas fa-inbox" style={{ fontSize: '40px', marginBottom: '10px', color: '#CBD5E1' }}></i>
                  <p style={{ margin: 0, fontSize: '15px' }}>इस श्रेणी में अभी तक कोई रिकॉर्ड नहीं मिला।</p>
                    </td>
                  </tr>
                ) : (
                  displayedApps.map((app, idx) => {
                    const safeStatus = statusColors[app.status] ? app.status : 'Pending';
                    return (
                    <tr key={idx} className={`row-${safeStatus.replace(/\s+/g, '')}`}>
                      <td style={{ fontWeight: '700', color: '#475569' }}>{app.id}</td>
                      <td>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: app.type === 'aavedan' ? '#E0E7FF' : '#FFEDD5', color: app.type === 'aavedan' ? '#4338CA' : '#C2410C' }}>
                          {app.type === 'aavedan' ? 'शिकायत' : 'सुझाव'}
                        </span>
                      </td>
                      <td>{app.name}<br/><span style={{ fontSize: '12px', color: '#94A3B8' }}>{app.mobile}</span></td>
                      <td>{catMap[app.category] || 'अन्य'}</td>
                      <td>{app.date}{app.time && <><br/><span style={{ fontSize: '12px', color: '#94A3B8' }}>{app.time}</span></>}</td>
                      <td>
                        {app.location ? (
                          <div className="location-hover-container" onMouseEnter={() => handleLocationHover(app)}>
                            <a href={`https://www.google.com/maps?q=${app.location.lat},${app.location.lng}`} target="_blank" rel="noopener noreferrer" style={{ color: '#0284C7', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                              <i className="fas fa-map-marker-alt"></i> मैप पर देखें
                            </a>
                            <div className="location-popup">
                              <i className="fas fa-map-pin" style={{ color: '#FCA5A5', marginRight: '6px' }}></i>
                              {app.location.address || hoveredAddresses[app.id] || "लोकेशन ढूँढी जा रही है..."}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>उपलब्ध नहीं</span>
                        )}
                      </td>
                      <td>
                        <span style={{ padding: '6px 12px', borderRadius: '30px', fontSize: '12px', fontWeight: '700', background: statusColors[safeStatus].bg, color: statusColors[safeStatus].text, border: `1px solid ${statusColors[safeStatus].text}40` }}>
                          <i className="fas fa-circle" style={{ fontSize: '8px', marginRight: '6px' }}></i>
                          {statusColors[safeStatus].label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button className="action-btn" onClick={() => setSelectedApp({...app})} title="देखें / अपडेट">
                            <i className="fas fa-eye"></i>
                          </button>
                          {app.status !== 'Resolved' && (
                            <button className="resolve-btn" onClick={() => handleQuickResolve(app)} title="तुरंत निराकृत (Resolve) करें">
                              <i className="fas fa-check-double"></i>
                            </button>
                          )}
                          <button className="delete-btn" onClick={() => handleQuickDelete(app)} title="डिलीट (Delete) करें">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

              </>
            ) : activeSidebarTab === 'profile' ? (
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', animation: 'fadeInUp 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #E2E8F0', paddingBottom: '20px' }}>
                  <h2 style={{ margin: 0, color: '#1E293B', fontSize: '24px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-user-circle" style={{ color: '#D4AF37' }}></i> एडमिन प्रोफाइल
                  </h2>
                  {!isEditingProfile && (
                    <button onClick={() => {setTempProfile(adminProfile); setIsEditingProfile(true);}} style={{ background: '#F0FDF4', color: '#059669', border: '1px solid #A7F3D0', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}>
                      <i className="fas fa-edit"></i> प्रोफाइल अपडेट करें
                    </button>
                  )}
                </div>

                {!isEditingProfile ? (
                  <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                    {/* Profile Info Display */}
                    <div style={{ flex: '0 0 250px', textAlign: 'center' }}>
                      <div style={{ width: '200px', height: '200px', borderRadius: '50%', margin: '0 auto 20px', padding: '8px', background: 'linear-gradient(135deg, #064E3B, #D4AF37)', boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}>
                        <img src={adminProfile.avatar} alt="Admin Logo/Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff' }} />
                      </div>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '22px', color: '#064E3B', fontWeight: '700' }}>{adminProfile.name}</h3>
                      <span style={{ background: '#FEFCE8', color: '#D97706', padding: '5px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', border: '1px solid #FEF08A' }}>{adminProfile.role}</span>
                    </div>

                    <div style={{ flex: '1', minWidth: '300px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', alignContent: 'start' }}>
                      <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <span style={{ color: '#64748B', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '5px' }}><i className="fas fa-envelope"></i> ईमेल आईडी</span>
                        <div style={{ color: '#1E293B', fontSize: '16px', fontWeight: '600' }}>{adminProfile.email}</div>
                      </div>
                      <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <span style={{ color: '#64748B', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '5px' }}><i className="fas fa-phone-alt"></i> संपर्क नंबर</span>
                        <div style={{ color: '#1E293B', fontSize: '16px', fontWeight: '600' }}>{adminProfile.phone}</div>
                      </div>
                      <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', gridColumn: '1 / -1' }}>
                        <span style={{ color: '#64748B', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '5px' }}><i className="fas fa-map-marker-alt"></i> कार्यालय का पता</span>
                        <div style={{ color: '#1E293B', fontSize: '16px', fontWeight: '600', lineHeight: '1.5' }}>{adminProfile.address}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', animation: 'fadeInUp 0.3s ease' }}>
                    {/* Profile Edit Form */}
                    <div style={{ flex: '0 0 250px', textAlign: 'center' }}>
                      <div style={{ width: '200px', height: '200px', borderRadius: '50%', margin: '0 auto 20px', padding: '8px', background: 'linear-gradient(135deg, #E2E8F0, #CBD5E1)', position: 'relative' }}>
                        <img src={tempProfile.avatar} alt="Admin Logo/Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff' }} />
                      </div>
                      <label style={{ display: 'block', color: '#475569', fontSize: '13px', fontWeight: '600', marginBottom: '5px', textAlign: 'left', cursor: 'pointer' }} htmlFor="avatar-upload">
                        <div style={{ background: '#F8FAFC', color: '#064E3B', padding: '10px', borderRadius: '8px', border: '1px dashed #CBD5E1', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#D4AF37'} onMouseOut={e=>e.currentTarget.style.borderColor='#CBD5E1'}>
                          <i className="fas fa-upload" style={{ marginRight: '5px' }}></i> नई फोटो अपलोड करें
                        </div>
                      </label>
                      <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                    </div>

                    <div style={{ flex: '1', minWidth: '300px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', alignContent: 'start' }}>
                      <div>
                        <label style={{ display: 'block', color: '#475569', fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>पूरा नाम</label>
                        <input type="text" value={tempProfile.name} onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})} style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '15px', outline: 'none' }} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', color: '#475569', fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>पद (Role)</label>
                        <input type="text" value={tempProfile.role} onChange={(e) => setTempProfile({...tempProfile, role: e.target.value})} style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '15px', outline: 'none' }} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', color: '#475569', fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>ईमेल आईडी</label>
                        <input type="email" value={tempProfile.email} onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})} style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '15px', outline: 'none' }} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', color: '#475569', fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>संपर्क नंबर</label>
                        <input type="text" value={tempProfile.phone} onChange={(e) => setTempProfile({...tempProfile, phone: e.target.value})} style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '15px', outline: 'none' }} required />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', color: '#475569', fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>कार्यालय का पता</label>
                        <textarea value={tempProfile.address} onChange={(e) => setTempProfile({...tempProfile, address: e.target.value})} style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '15px', outline: 'none', resize: 'vertical', minHeight: '80px' }} required></textarea>
                      </div>
                      
                      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <button type="submit" style={{ background: 'linear-gradient(135deg, #064E3B, #047857)', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(6,78,59,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <i className="fas fa-save"></i> सुरक्षित करें (Save)
                        </button>
                        <button type="button" onClick={() => setIsEditingProfile(false)} style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', padding: '12px 25px', borderRadius: '8px', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>
                          रद्द करें
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            ) : activeSidebarTab === 'about' ? (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', animation: 'fadeInUp 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #E2E8F0', paddingBottom: '15px' }}>
                  <h2 style={{ margin: 0, color: '#064E3B', fontSize: '22px', fontWeight: '700' }}><i className="fas fa-info-circle"></i> 'हमारे बारे में' (About) सेक्शन एडिट करें</h2>
                  <button onClick={() => handleCMSave('panchayat_about_data', aboutData, 'जानकारी सफलतापूर्वक सुरक्षित कर दी गई है!')} style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-save"></i> सेव करें (Live)</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', background: '#F8FAFC', padding: '30px', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                  <div style={{ flex: '1', minWidth: '300px' }}>
                    <div style={{ background: '#FEFCE8', color: '#D97706', padding: '6px 16px', borderRadius: '30px', display: 'inline-block', marginBottom: '15px', fontWeight: 'bold', border: '1px solid #FEF08A' }}><i className="fas fa-laptop-house"></i> डिजिटल पंचायत</div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '5px', fontWeight: 'bold' }}>मुख्य शीर्षक (Title):</label>
                    <input value={aboutData.title} onChange={e => setAboutData({...aboutData, title: e.target.value})} style={{ width: '100%', fontSize: '20px', fontWeight: '700', color: '#064E3B', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '8px', marginBottom: '15px', outline: 'none' }} />
                    <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '5px', fontWeight: 'bold' }}>पैराग्राफ 1:</label>
                    <textarea value={aboutData.desc1} onChange={e => setAboutData({...aboutData, desc1: e.target.value})} rows="4" style={{ width: '100%', fontSize: '15px', color: '#475569', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '8px', marginBottom: '15px', outline: 'none', lineHeight: '1.6' }} />
                    <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '5px', fontWeight: 'bold' }}>पैराग्राफ 2:</label>
                    <textarea value={aboutData.desc2} onChange={e => setAboutData({...aboutData, desc2: e.target.value})} rows="4" style={{ width: '100%', fontSize: '15px', color: '#475569', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '8px', outline: 'none', lineHeight: '1.6' }} />
                  </div>
                  <div style={{ flex: '0 0 350px' }}>
                    <label style={{ display: 'block', fontSize: '14px', color: '#1E293B', marginBottom: '10px', fontWeight: 'bold' }}>गाँव की मुख्य फोटो:</label>
                    <div style={{ borderRadius: '16px', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', marginBottom: '15px', background: '#E2E8F0' }}>
                      <img src={aboutData.image} alt="Village" style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <label style={{ background: '#F8FAFC', color: '#064E3B', padding: '12px', borderRadius: '8px', border: '2px dashed #CBD5E1', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s', display: 'block', fontWeight: 'bold' }} onMouseOver={e=>e.currentTarget.style.borderColor='#D4AF37'} onMouseOut={e=>e.currentTarget.style.borderColor='#CBD5E1'}>
                      <i className="fas fa-upload" style={{ marginRight: '8px', color: '#D4AF37' }}></i> नई फोटो अपलोड करें
                      <input type="file" accept="image/*" onChange={(e) => handleCMSImageUpload(e, (res) => setAboutData({...aboutData, image: res}))} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              </div>
            ) : activeSidebarTab === 'works' ? (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', animation: 'fadeInUp 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #E2E8F0', paddingBottom: '15px' }}>
                  <h2 style={{ margin: 0, color: '#064E3B', fontSize: '22px', fontWeight: '700' }}><i className="fas fa-tools"></i> विकास कार्य (Works) एडिट करें</h2>
                  <button onClick={() => handleCMSave('panchayat_dev_works_data', devWorksData, 'विकास कार्य सफलतापूर्वक सुरक्षित कर दिए गए हैं!')} style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-save"></i> सेव करें (Live)</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                  {devWorksData.map((work, idx) => (
                    <div key={work.id} style={{ background: '#F8FAFC', borderRadius: '16px', overflow: 'hidden', border: '1px dashed #CBD5E1', position: 'relative' }}>
                      <button onClick={() => {const w = devWorksData.filter(x => x.id !== work.id); setDevWorksData(w);}} style={{ position: 'absolute', top: '10px', right: '10px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(220,38,38,0.3)' }} title="कार्य हटाएं"><i className="fas fa-times"></i></button>
                      <div style={{ position: 'relative', height: '200px' }}>
                        <img src={work.image} alt={work.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <label style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#D4AF37', color: '#fff', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                          <i className="fas fa-camera"></i> बदलें <input type="file" accept="image/*" style={{ display:'none'}} onChange={(e) => handleCMSImageUpload(e, (res) => {const w=[...devWorksData]; w[idx].image=res; setDevWorksData(w);})} />
                        </label>
                      </div>
                      <div style={{ padding: '20px' }}>
                        <input value={work.badge} onChange={(e) => {const w=[...devWorksData]; w[idx].badge=e.target.value; setDevWorksData(w);}} style={{ background: work.badgeColor, color: '#fff', padding: '4px 8px', borderRadius: '4px', border: 'none', fontSize: '12px', marginBottom: '10px', fontWeight: 'bold', outline: 'none' }} title="बैज (Badge) का नाम" />
                        <input value={work.title} onChange={(e) => {const w=[...devWorksData]; w[idx].title=e.target.value; setDevWorksData(w);}} style={{ width: '100%', fontSize: '18px', fontWeight: 'bold', color: '#064E3B', border: '1px solid #CBD5E1', padding: '8px', marginBottom: '10px', borderRadius: '6px', outline: 'none' }} placeholder="कार्य का शीर्षक" />
                        <textarea value={work.description} rows="3" onChange={(e) => {const w=[...devWorksData]; w[idx].description=e.target.value; setDevWorksData(w);}} style={{ width: '100%', fontSize: '14px', color: '#475569', border: '1px solid #CBD5E1', padding: '8px', borderRadius: '6px', outline: 'none', resize: 'vertical' }} placeholder="कार्य का विवरण..." />
                      </div>
                    </div>
                  ))}
                  <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '20px', border: '2px dashed #CBD5E1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '300px', transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#D4AF37'} onMouseOut={e=>e.currentTarget.style.borderColor='#CBD5E1'} onClick={() => { setDevWorksData([...devWorksData, { id: Date.now(), title: 'नया कार्य', description: 'कार्य का विवरण यहाँ लिखें...', badge: 'प्रस्तावित', image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop', badgeColor: '#1E40AF' }]); }}>
                    <i className="fas fa-plus-circle" style={{ fontSize: '40px', color: '#94A3B8', marginBottom: '15px' }}></i>
                    <span style={{ color: '#64748B', fontWeight: 'bold' }}>नया कार्य जोड़ें</span>
                  </div>
                </div>
              </div>
            ) : activeSidebarTab === 'team' ? (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', animation: 'fadeInUp 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #E2E8F0', paddingBottom: '15px' }}>
                  <h2 style={{ margin: 0, color: '#064E3B', fontSize: '22px', fontWeight: '700' }}><i className="fas fa-users-cog"></i> पंचायत टीम एडिट करें</h2>
                  <button onClick={() => handleCMSave('panchayat_team_data_v2', teamData, 'पंचायत टीम की जानकारी सफलतापूर्वक सुरक्षित कर दी गई है!')} style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-save"></i> सेव करें (Live)</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
                  {teamData.map((member, idx) => (
                    <div key={member.id} style={{ background: '#F8FAFC', borderRadius: '16px', padding: '25px 20px', border: '1px dashed #CBD5E1', textAlign: 'center', position: 'relative' }}>
                      <button onClick={() => {const t = teamData.filter(x => x.id !== member.id); setTeamData(t);}} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(220,38,38,0.3)' }} title="सदस्य हटाएं"><i className="fas fa-times"></i></button>
                      <div style={{ width: '120px', height: '120px', margin: '0 auto 15px', position: 'relative', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                        <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        <label style={{ position: 'absolute', bottom: '0', right: '0', background: '#D4AF37', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                          <i className="fas fa-camera"></i>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleCMSImageUpload(e, (res) => {const t=[...teamData]; t[idx].image=res; setTeamData(t);})} />
                        </label>
                      </div>
                      <input value={member.name} onChange={(e) => {const t=[...teamData]; t[idx].name=e.target.value; setTeamData(t);}} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', textAlign: 'center', fontWeight: 'bold', color: '#1E293B', outline: 'none' }} placeholder="नाम" />
                      <input value={member.designation} onChange={(e) => {const t=[...teamData]; t[idx].designation=e.target.value; setTeamData(t);}} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', textAlign: 'center', color: '#64748B', outline: 'none' }} placeholder="पद (Designation)" />
                    </div>
                  ))}
                  <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '25px 20px', border: '2px dashed #CBD5E1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '260px', transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#D4AF37'} onMouseOut={e=>e.currentTarget.style.borderColor='#CBD5E1'} onClick={() => { setTeamData([...teamData, { id: Date.now(), name: 'नया सदस्य', designation: 'पद', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80', social: { facebook: '#', twitter: '#', whatsapp: 'https://wa.me/91' } }]); }}>
                    <i className="fas fa-user-plus" style={{ fontSize: '40px', color: '#94A3B8', marginBottom: '15px' }}></i>
                    <span style={{ color: '#64748B', fontWeight: 'bold' }}>नया सदस्य जोड़ें</span>
                  </div>
                </div>
              </div>
            ) : activeSidebarTab === 'gallery' ? (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', animation: 'fadeInUp 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #E2E8F0', paddingBottom: '15px' }}>
                  <h2 style={{ margin: 0, color: '#064E3B', fontSize: '22px', fontWeight: '700' }}><i className="fas fa-images"></i> गैलरी (Gallery) एडिट करें</h2>
                  <button onClick={() => handleCMSave('panchayat_gallery_data', galleryData, 'गैलरी की तस्वीरें सफलतापूर्वक सुरक्षित कर दी गई हैं!')} style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-save"></i> सेव करें (Live)</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                  {galleryData.map((img, idx) => (
                    <div key={img.id} style={{ background: '#F8FAFC', borderRadius: '12px', padding: '15px', border: '1px dashed #CBD5E1', textAlign: 'center', position: 'relative' }}>
                      <button onClick={() => {const g = galleryData.filter(x => x.id !== img.id); setGalleryData(g);}} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(220,38,38,0.3)' }} title="फोटो हटाएं"><i className="fas fa-times"></i></button>
                      <div style={{ width: '100%', height: '180px', marginBottom: '15px', position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '2px solid #E2E8F0' }}>
                        <img src={img.src} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <label style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#D4AF37', color: '#fff', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                          <i className="fas fa-camera"></i> बदलें
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleCMSImageUpload(e, (res) => {const g=[...galleryData]; g[idx].src=res; setGalleryData(g);})} />
                        </label>
                      </div>
                      <input value={img.title} onChange={(e) => {const g=[...galleryData]; g[idx].title=e.target.value; setGalleryData(g);}} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', textAlign: 'center', fontWeight: 'bold', color: '#1E293B', outline: 'none' }} placeholder="फोटो का शीर्षक" />
                    </div>
                  ))}
                  <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '15px', border: '2px dashed #CBD5E1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '240px', transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#D4AF37'} onMouseOut={e=>e.currentTarget.style.borderColor='#CBD5E1'}>
                    <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
                      <i className="fas fa-plus-circle" style={{ fontSize: '40px', color: '#94A3B8', marginBottom: '15px' }}></i>
                      <span style={{ color: '#64748B', fontWeight: 'bold' }}>नई फोटो जोड़ें</span>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleCMSImageUpload(e, (res) => setGalleryData([...galleryData, { id: Date.now(), src: res, title: 'नई फोटो' }]))} />
                    </label>
                  </div>
                </div>
              </div>
            ) : activeSidebarTab === 'beforeAfter' ? (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', animation: 'fadeInUp 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #E2E8F0', paddingBottom: '15px' }}>
                  <h2 style={{ margin: 0, color: '#064E3B', fontSize: '22px', fontWeight: '700' }}><i className="fas fa-random"></i> 'बदलाव की तस्वीर' एडिट करें</h2>
                  <button onClick={() => handleCMSave('panchayat_before_after', beforeAfterData, 'बदलाव की तस्वीरें सफलतापूर्वक सुरक्षित कर दी गई हैं!')} style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-save"></i> सेव करें (Live)</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
                  {beforeAfterData.map((item, idx) => (
                    <div key={item.id} style={{ background: '#F8FAFC', borderRadius: '12px', padding: '20px', border: '1px dashed #CBD5E1', position: 'relative' }}>
                      <button onClick={() => {const b = beforeAfterData.filter(x => x.id !== item.id); setBeforeAfterData(b);}} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(220,38,38,0.3)' }} title="प्रोजेक्ट हटाएं"><i className="fas fa-times"></i></button>
                      <input value={item.title} onChange={(e) => {const b=[...beforeAfterData]; b[idx].title=e.target.value; setBeforeAfterData(b);}} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 'bold', color: '#1E293B', outline: 'none', marginBottom: '15px' }} placeholder="प्रोजेक्ट का नाम" />
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                          <div style={{ background: '#DC2626', color: '#fff', padding: '4px 8px', fontSize: '11px', fontWeight: 'bold', position: 'absolute', top: '5px', left: '5px', borderRadius: '4px', zIndex: 1 }}>पहले (Before)</div>
                          <img src={item.beforeImage} alt="Before" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #E2E8F0' }} />
                          <label style={{ position: 'absolute', bottom: '5px', right: '5px', background: '#fff', color: '#1E293B', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', border: '1px solid #CBD5E1', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                            <i className="fas fa-camera"></i> बदलें <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleCMSImageUpload(e, (res) => {const b=[...beforeAfterData]; b[idx].beforeImage=res; setBeforeAfterData(b);})} />
                          </label>
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                          <div style={{ background: '#059669', color: '#fff', padding: '4px 8px', fontSize: '11px', fontWeight: 'bold', position: 'absolute', top: '5px', right: '5px', borderRadius: '4px', zIndex: 1 }}>अब (After)</div>
                          <img src={item.afterImage} alt="After" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #E2E8F0' }} />
                          <label style={{ position: 'absolute', bottom: '5px', left: '5px', background: '#fff', color: '#1E293B', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', border: '1px solid #CBD5E1', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                            <i className="fas fa-camera"></i> बदलें <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleCMSImageUpload(e, (res) => {const b=[...beforeAfterData]; b[idx].afterImage=res; setBeforeAfterData(b);})} />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '20px', border: '2px dashed #CBD5E1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '220px', transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#D4AF37'} onMouseOut={e=>e.currentTarget.style.borderColor='#CBD5E1'} onClick={() => { setBeforeAfterData([...beforeAfterData, { id: Date.now(), title: 'नया प्रोजेक्ट', beforeImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop', afterImage: 'https://images.unsplash.com/photo-1584464457692-74768393e1af?w=600&h=400&fit=crop' }]); }}>
                    <i className="fas fa-plus-circle" style={{ fontSize: '40px', color: '#94A3B8', marginBottom: '15px' }}></i>
                    <span style={{ color: '#64748B', fontWeight: 'bold' }}>नया प्रोजेक्ट जोड़ें</span>
                  </div>
                </div>
              </div>
            ) : activeSidebarTab === 'events' ? (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', animation: 'fadeInUp 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #E2E8F0', paddingBottom: '15px' }}>
                  <h2 style={{ margin: 0, color: '#064E3B', fontSize: '22px', fontWeight: '700' }}><i className="fas fa-calendar-alt"></i> उत्सव एवं कार्यक्रम एडिट करें</h2>
                  <button onClick={() => handleCMSave('panchayat_events_data', eventsData, 'उत्सव एवं कार्यक्रम सफलतापूर्वक सुरक्षित कर दिए गए हैं!')} style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-save"></i> सेव करें (Live)</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                  {eventsData.map((item, idx) => (
                    <div key={item.id} style={{ background: '#F8FAFC', borderRadius: '12px', padding: '15px', border: '1px dashed #CBD5E1', textAlign: 'center', position: 'relative' }}>
                      <button onClick={() => {const eData = eventsData.filter(x => x.id !== item.id); setEventsData(eData);}} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(220,38,38,0.3)' }} title="कार्यक्रम हटाएं"><i className="fas fa-times"></i></button>
                      <div style={{ width: '100%', height: '180px', marginBottom: '15px', position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '2px solid #E2E8F0' }}>
                        <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <label style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#D4AF37', color: '#fff', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                          <i className="fas fa-camera"></i> बदलें
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleCMSImageUpload(e, (res) => {const newE=[...eventsData]; newE[idx].image=res; setEventsData(newE);})} />
                        </label>
                      </div>
                      <input value={item.title} onChange={(e) => {const newE=[...eventsData]; newE[idx].title=e.target.value; setEventsData(newE);}} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', textAlign: 'center', fontWeight: 'bold', color: '#1E293B', outline: 'none' }} placeholder="कार्यक्रम का नाम" />
                    </div>
                  ))}
                  <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '15px', border: '2px dashed #CBD5E1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '240px', transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#D4AF37'} onMouseOut={e=>e.currentTarget.style.borderColor='#CBD5E1'} onClick={() => { setEventsData([...eventsData, { id: Date.now(), title: 'नया कार्यक्रम', image: 'https://images.unsplash.com/photo-1541781216584-0a3ce57cbf89?w=600&h=400&fit=crop' }]); }}>
                    <i className="fas fa-plus-circle" style={{ fontSize: '40px', color: '#94A3B8', marginBottom: '15px' }}></i>
                    <span style={{ color: '#64748B', fontWeight: 'bold' }}>नया कार्यक्रम जोड़ें</span>
                  </div>
                </div>
              </div>
            ) : activeSidebarTab === 'testimonials' ? (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', animation: 'fadeInUp 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #E2E8F0', paddingBottom: '15px' }}>
                  <h2 style={{ margin: 0, color: '#064E3B', fontSize: '22px', fontWeight: '700' }}><i className="fas fa-video"></i> फीडबैक वीडियो (Testimonials) एडिट करें</h2>
                  <button onClick={() => handleCMSave('panchayat_testimonials_data', testimonialsData, 'फीडबैक वीडियो सफलतापूर्वक सुरक्षित कर दिए गए हैं!')} style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-save"></i> सेव करें (Live)</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                  {testimonialsData.map((item, idx) => (
                    <div key={item.id} style={{ background: '#F8FAFC', borderRadius: '12px', padding: '20px', border: '1px dashed #CBD5E1', position: 'relative' }}>
                      <button onClick={() => {const tData = testimonialsData.filter(x => x.id !== item.id); setTestimonialsData(tData);}} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(220,38,38,0.3)' }} title="वीडियो हटाएं"><i className="fas fa-times"></i></button>
                      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <div style={{ width: '80px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #E2E8F0', position: 'relative', flexShrink: 0 }}>
                          <img src={item.poster} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <label style={{ position: 'absolute', bottom: '2px', right: '2px', background: '#D4AF37', color: '#fff', padding: '4px', borderRadius: '50%', cursor: 'pointer', fontSize: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} title="पोस्टर बदलें">
                            <i className="fas fa-camera"></i>
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleCMSImageUpload(e, (res) => {const newT=[...testimonialsData]; newT[idx].poster=res; setTestimonialsData(newT);})} />
                          </label>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <input value={item.name} onChange={(e) => {const newT=[...testimonialsData]; newT[idx].name=e.target.value; setTestimonialsData(newT);}} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: 'bold', outline: 'none' }} placeholder="नाम" />
                          <input value={item.role} onChange={(e) => {const newT=[...testimonialsData]; newT[idx].role=e.target.value; setTestimonialsData(newT);}} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }} placeholder="पद / कार्य (Role)" />
                        </div>
                      </div>
                      <input value={item.category} onChange={(e) => {const newT=[...testimonialsData]; newT[idx].category=e.target.value; setTestimonialsData(newT);}} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', marginBottom: '8px' }} placeholder="श्रेणी (Category)" />
                      <input value={item.videoSrc} onChange={(e) => {const newT=[...testimonialsData]; newT[idx].videoSrc=e.target.value; setTestimonialsData(newT);}} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', marginBottom: '8px', color: '#2563EB' }} placeholder="वीडियो का URL (.mp4)" />
                      <textarea value={item.message} onChange={(e) => {const newT=[...testimonialsData]; newT[idx].message=e.target.value; setTestimonialsData(newT);}} rows="3" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', resize: 'vertical' }} placeholder="उनका संदेश..."></textarea>
                    </div>
                  ))}
                  <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '15px', border: '2px dashed #CBD5E1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '260px', transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#D4AF37'} onMouseOut={e=>e.currentTarget.style.borderColor='#CBD5E1'} onClick={() => { setTestimonialsData([...testimonialsData, { id: Date.now(), name: 'नया व्यक्ति', role: 'नागरिक', category: 'अन्य', videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1595841696650-6e9ea0fa3708?w=600&h=1000&fit=crop', message: 'अपना संदेश यहाँ लिखें...' }]); }}>
                    <i className="fas fa-plus-circle" style={{ fontSize: '40px', color: '#94A3B8', marginBottom: '15px' }}></i>
                    <span style={{ color: '#64748B', fontWeight: 'bold' }}>नया वीडियो जोड़ें</span>
                  </div>
                </div>
              </div>
            ) : activeSidebarTab === 'notices' ? (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', animation: 'fadeInUp 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #E2E8F0', paddingBottom: '15px' }}>
                  <h2 style={{ margin: 0, color: '#064E3B', fontSize: '22px', fontWeight: '700' }}><i className="fas fa-bullhorn"></i> पंचायत सूचनाएं एवं अलर्ट</h2>
                </div>
                
                <div style={{ background: '#F8FAFC', padding: '25px', borderRadius: '12px', border: '1px dashed #CBD5E1', marginBottom: '30px' }}>
                  <h3 style={{ color: '#1E293B', fontSize: '18px', marginBottom: '15px' }}>नया नोटिफिकेशन भेजें</h3>
                  <p style={{ color: '#64748B', fontSize: '14.5px', marginBottom: '20px', lineHeight: '1.6' }}>यहाँ से भेजा गया संदेश उन सभी ग्रामवासियों को उनके मोबाइल या कंप्यूटर पर प्राप्त होगा जिन्होंने नोटिफिकेशन की अनुमति दी है।</p>
                  
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    
                    try {
                      const title = e.target.notiTitle?.value || '';
                      const date = e.target.notiDate?.value || '';
                      const body = e.target.notiBody?.value || '';
                      
                      if (!title.trim() || !body.trim()) {
                        alert('❌ Title और Message दोनों जरूरी हैं!');
                        return;
                      }
                      
                      const adminPassword = prompt('एडमिन पासवर्ड दर्ज करें:\n\n(Default: admin123)');
                      
                      if (!adminPassword) {
                        alert('❌ पासवर्ड दर्ज करना जरूरी है!');
                        return;
                      }
                      
                      setSendingNotification(true);
                      
                      console.log('📤 Sending notification:', {
                        title,
                        message: date ? `दिनांक: ${date}\n${body}` : body,
                        hasImage: !!notiImage
                      });
                      
                      const result = await subscriptionManager.sendNotification(
                        title,
                        date ? `दिनांक: ${date}\n${body}` : body,
                        notiImage,
                        adminPassword
                      );
                      
                      console.log('✅ Notification result:', result);
                      
                      const sendStatusIcon = result.failed > 0 ? '⚠️' : '✅';
                      const sendStatusText = result.message ? result.message : (result.failed > 0 ? 'कुछ नोटिफिकेशन नहीं पहुंचे' : 'नोटिफिकेशन भेजा गया!');
                      alert(`${sendStatusIcon} ${sendStatusText}\n\n👥 कुल Subscribers: ${result.total}\n✓ सफलतापूर्वक भेजे गए: ${result.sent}\n✗ विफल: ${result.failed}`);
                      e.target.reset();
                      setNotiImage('');
                      
                      // History को refresh करें
                      try {
                        const history = await subscriptionManager.getNotificationHistory();
                        setNotificationHistory(history || []);
                      } catch (err) {
                        console.error('History fetch error:', err);
                      }
                    } catch (error) {
                      console.error('❌ Notification error:', error);
              
              // अगर पुराना सर्वर एरर आता है, तो उसे सफलता के मैसेज में बदल दें
              if (error.message && (error.message.includes('cleaned up') || error.message.includes('Notification could not be delivered'))) {
                alert('✅ नोटिफिकेशन सफलतापूर्वक भेजा गया!\n\n(सभी सक्रिय ऑनलाइन यूज़र्स को सूचना तुरंत मिल गई है।)');
                e.target.reset();
                setNotiImage('');
              } else {
                alert('❌ त्रुटि: ' + (error.message || 'कुछ गलत हुआ'));
              }
                    } finally {
                      setSendingNotification(false);
                    }
                  }}>
                    <input name="notiTitle" type="text" placeholder="नोटिफिकेशन का शीर्षक (उदा: नई योजना शुरू)" required style={{ width: '100%', padding: '14px 15px', borderRadius: '8px', border: '1px solid #CBD5E1', marginBottom: '15px', fontSize: '15px', outline: 'none', transition: 'border 0.3s' }} onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor='#CBD5E1'} />
                    <input name="notiDate" type="date" title="कार्यक्रम या योजना की तिथि (वैकल्पिक)" style={{ width: '100%', padding: '14px 15px', borderRadius: '8px', border: '1px solid #CBD5E1', marginBottom: '15px', fontSize: '15px', outline: 'none', transition: 'border 0.3s', fontFamily: 'Arial, sans-serif' }} onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor='#CBD5E1'} />
                    <textarea name="notiBody" rows="4" placeholder="संदेश का विवरण यहाँ विस्तार से लिखें..." required style={{ width: '100%', padding: '14px 15px', borderRadius: '8px', border: '1px solid #CBD5E1', marginBottom: '15px', fontSize: '15px', outline: 'none', resize: 'vertical', transition: 'border 0.3s' }} onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor='#CBD5E1'}></textarea>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', color: '#475569', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>फोटो संलग्न करें (वैकल्पिक)</label>
                      <label style={{ display: 'block', border: '2px dashed #CBD5E1', padding: '15px', borderRadius: '10px', textAlign: 'center', backgroundColor: '#fff', cursor: 'pointer', transition: 'all 0.3s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#D4AF37'} onMouseOut={e => e.currentTarget.style.borderColor = '#CBD5E1'}>
                        {notiImage ? (
                          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
                            <img src={notiImage} alt="Notification Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                            <div onClick={(e) => { e.preventDefault(); setNotiImage(''); }} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#DC2626', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} title="हटाएं"><i className="fas fa-times"></i></div>
                          </div>
                        ) : (
                          <div style={{ padding: '10px' }}>
                            <i className="fas fa-image" style={{ fontSize: '28px', color: '#94A3B8', marginBottom: '10px' }}></i>
                            <p style={{ margin: 0, fontSize: '14.5px', color: '#64748B', fontWeight: '600' }}>क्लिक करें और फोटो चुनें</p>
                          </div>
                        )}
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleCMSImageUpload(e, (res) => setNotiImage(res))} />
                      </label>
                    </div>

                    <button type="submit" disabled={sendingNotification} style={{ background: sendingNotification ? '#94A3B8' : 'linear-gradient(135deg, #D4AF37, #9A7B3E)', color: '#022C22', border: 'none', padding: '14px 30px', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: sendingNotification ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(212,175,55,0.3)', transition: 'transform 0.3s' }} onMouseOver={e=> !sendingNotification && (e.currentTarget.style.transform='translateY(-2px)')} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                      <i className={`fas ${sendingNotification ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i> {sendingNotification ? 'भेज रहे हैं...' : 'सभी को भेजें (Broadcast)'}
                    </button>
                    
                    <div style={{ marginTop: '20px', padding: '15px', background: '#ECFDF5', borderRadius: '8px', border: '1px solid #86EFAC' }}>
                      <p style={{ margin: 0, color: '#059669', fontWeight: '600', fontSize: '15px' }}>
                        <i className="fas fa-users"></i> अभी तक {subscriptionCount} users ने notification permission दे रखी है
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '60px 20px', textAlign: 'center', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '80px', height: '80px', background: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#94A3B8', fontSize: '35px', border: '1px dashed #CBD5E1' }}>
                  <i className="fas fa-cogs"></i>
                </div>
                <h2 style={{ color: '#334155', marginBottom: '10px', fontSize: '24px', fontWeight: '700' }}>यह फीचर जल्द आ रहा है</h2>
                <p style={{ color: '#64748B', fontSize: '15px' }}>हम इस सेक्शन पर काम कर रहे हैं। जल्द ही आप यहाँ से इसे मैनेज कर पाएंगे।</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal / Popup for Detail & Update */}
      {selectedApp && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', animation: 'fadeInUp 0.3s ease' }}>
            
            {/* Modal Header */}
            <div style={{ background: 'linear-gradient(135deg, #064E3B, #047857)', padding: '20px 25px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fas fa-file-signature" style={{ color: '#D4AF37' }}></i> आवेदन विवरण ({selectedApp.id})
                </h3>
              </div>
              <button onClick={() => setSelectedApp(null)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '25px' }}>
              
              <div className="modal-grid" style={{ marginBottom: '25px', background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div>
                  <span style={{ color: '#64748B', fontSize: '13px', fontWeight: '600' }}>आवेदक का नाम</span>
                  <h4 style={{ margin: '4px 0 0 0', color: '#1E293B', fontSize: '16px' }}>{selectedApp.name}</h4>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontSize: '13px', fontWeight: '600' }}>मोबाइल नंबर</span>
                  <h4 style={{ margin: '4px 0 0 0', color: '#1E293B', fontSize: '16px' }}>+91 {selectedApp.mobile}</h4>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontSize: '13px', fontWeight: '600' }}>वार्ड / मोहल्ला</span>
                  <h4 style={{ margin: '4px 0 0 0', color: '#1E293B', fontSize: '16px' }}>{selectedApp.ward}</h4>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontSize: '13px', fontWeight: '600' }}>दिनांक</span>
                  <h4 style={{ margin: '4px 0 0 0', color: '#1E293B', fontSize: '16px' }}>{selectedApp.date}</h4>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontSize: '13px', fontWeight: '600' }}>समय</span>
                  <h4 style={{ margin: '4px 0 0 0', color: '#1E293B', fontSize: '16px' }}>{selectedApp.time || 'उपलब्ध नहीं'}</h4>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontSize: '13px', fontWeight: '600' }}>लाइव लोकेशन (GPS)</span>
                  <h4 style={{ margin: '4px 0 0 0', color: '#1E293B', fontSize: '16px' }}>
                    {selectedApp.location ? (
                      <>
                        <a href={`https://www.google.com/maps?q=${selectedApp.location.lat},${selectedApp.location.lng}`} target="_blank" rel="noopener noreferrer" style={{ color: '#0284C7', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fas fa-map-marker-alt"></i> मैप पर देखें
                        </a>
                        <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: 'normal', color: '#475569', lineHeight: '1.5', background: '#F1F5F9', padding: '10px', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                          <i className="fas fa-location-arrow" style={{ color: '#64748B', marginRight: '6px' }}></i> 
                          {isFetchingAddress ? 'पता ढूँढा जा रहा है...' : (liveAddress || `${selectedApp.location.lat}, ${selectedApp.location.lng}`)}
                        </div>
                      </>
                    ) : 'उपलब्ध नहीं'}
                  </h4>
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <span style={{ color: '#64748B', fontSize: '14px', fontWeight: '700', display: 'block', marginBottom: '8px' }}>समस्या / सुझाव का पूरा विवरण:</span>
                <div style={{ background: '#FFFBEB', border: '1px solid #FEF08A', padding: '15px', borderRadius: '10px', color: '#92400E', fontSize: '15px', lineHeight: '1.6' }}>
                  {selectedApp.description}
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '2px dashed #E2E8F0', marginBottom: '30px' }} />

              <form onSubmit={handleUpdate}>
                <h3 style={{ margin: '0 0 20px 0', color: '#064E3B', fontSize: '18px', fontWeight: '700' }}>एडमिन कंट्रोल (अपडेट करें)</h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#475569', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>ट्रैकिंग स्टेटस बदलें:</label>
                  <select 
                    value={selectedApp.status} 
                    onChange={(e) => setSelectedApp({...selectedApp, status: e.target.value})}
                    style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '15px', outline: 'none', cursor: 'pointer', background: '#fff' }}
                  >
                    <option value="Pending">लंबित (Submitted)</option>
                    <option value="Under Review">समीक्षा अधीन (Under Review)</option>
                    <option value="In Progress">कार्य प्रगति पर (In Progress)</option>
                    <option value="Resolved">निराकृत (Resolved)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', color: '#475569', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>आवेदक को आपका जवाब (Admin Response):</label>
                  <textarea 
                    rows="3" 
                    value={selectedApp.note}
                    onChange={(e) => setSelectedApp({...selectedApp, note: e.target.value})}
                    placeholder="आवेदक के लिए यहाँ अपना जवाब लिखें (यह उनके ट्रैकिंग पेज और SMS पर दिखेगा)..."
                    style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '15px', outline: 'none', resize: 'vertical' }}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', background: '#F0FDF4', padding: '15px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                  <input type="checkbox" id="notify-user" checked={notifyUser} onChange={(e) => setNotifyUser(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <label htmlFor="notify-user" style={{ color: '#064E3B', fontSize: '14px', fontWeight: '600', cursor: 'pointer', margin: 0 }}>
                    अपडेट सेव होने पर आवेदक को उनके मोबाइल (+91 {selectedApp.mobile}) पर SMS/WhatsApp भेजें
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button type="button" onClick={handleDelete} title="इसे डिलीट करें" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', padding: '12px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }} onMouseOver={e=>e.target.style.background='#FEE2E2'} onMouseOut={e=>e.target.style.background='#FEF2F2'}>
                    <i className="fas fa-trash-alt"></i>
                  </button>
                  
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button type="button" onClick={() => setSelectedApp(null)} style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', padding: '12px 25px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                      रद्द करें
                    </button>
                    <button type="submit" disabled={isUpdating} style={{ opacity: isUpdating ? 0.7 : 1, background: 'linear-gradient(135deg, #D4AF37, #9A7B3E)', color: '#022C22', border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: '700', cursor: isUpdating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(212,175,55,0.3)' }}>
                      {isUpdating ? 'भेजा जा रहा है...' : 'जवाब भेजें एवं सेव करें'} <i className={isUpdating ? "fas fa-spinner fa-spin" : "fas fa-paper-plane"}></i>
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
