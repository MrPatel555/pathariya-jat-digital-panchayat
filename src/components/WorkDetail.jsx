import React, { useEffect, useState } from 'react';

function WorkDetail({ workId }) {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // पेज खुलने पर स्क्रीन को सबसे ऊपर ले जाने के लिए
    window.scrollTo(0, 0);
  }, [workId]);

  // हर विकास कार्य के लिए विस्तृत जानकारी, लाभ और तस्वीरें
  const devWorks = [
    {
      id: '1',
      title: 'पक्की सड़क एवं नाली निर्माण',
      category: 'बुनियादी ढांचा (Infrastructure)',
      status: 'पूर्ण कार्य',
      description: 'ग्राम के मुख्य मार्ग से लेकर वार्ड क्र. 4 तक सीसी रोड और जल निकासी के लिए पक्की नाली का निर्माण कार्य सफलतापूर्वक पूर्ण किया गया।',
      content: 'गाँव में आवागमन को सुगम बनाने और बारिश के दिनों में जलभराव की समस्या को खत्म करने के लिए पंचायत ने पक्की सड़क और नाली निर्माण को प्राथमिकता दी। इस परियोजना के तहत उच्च गुणवत्ता वाली कंक्रीट और सीमेंट का उपयोग किया गया है जिससे सड़क लंबे समय तक टिक सके। इसके साथ ही, वैज्ञानिक तरीके से नालियों का निर्माण किया गया है ताकि गंदे पानी की निकासी सुचारू रूप से हो सके और गाँव में स्वच्छता बनी रहे।',
      banner: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1600&h=600&fit=crop',
      image1: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&h=600&fit=crop',
      image2: 'https://images.unsplash.com/photo-1584464457692-74768393e1af?w=600&h=600&fit=crop',
      benefits: [
        { icon: 'fas fa-road', title: 'सुगम यातायात', desc: 'बारिश के मौसम में भी बिना किसी बाधा के सुरक्षित और आसान आवागमन।' },
        { icon: 'fas fa-water', title: 'जल निकासी', desc: 'जलभराव की समस्या से 100% मुक्ति और बीमारियों पर लगाम।' },
        { icon: 'fas fa-truck-pickup', title: 'कृषि में लाभ', desc: 'किसानों को अपनी फसल मंडी तक ले जाने में अब आसानी होती है।' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&fit=crop',
        'https://images.unsplash.com/photo-1584464457692-74768393e1af?w=800&fit=crop',
        'https://images.unsplash.com/photo-1541888004555-5ce0d68f2378?w=800&fit=crop'
      ],
      beforeImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1584464457692-74768393e1af?w=600&h=400&fit=crop',
      feedbacks: [
        { name: 'रामलाल सिंह', role: 'किसान', text: 'पहले बारिश में कीचड़ से निकलना मुश्किल था, अब ट्रैक्टर सीधे घर तक आता है।' },
        { name: 'सुनीता बाई', role: 'स्थानीय निवासी', text: 'नाली बनने से अब मोहल्ले में पानी नहीं भरता, बीमारियाँ भी कम हुई हैं।' }
      ]
    },
    {
      id: '2',
      title: 'हर घर नल जल योजना',
      category: 'स्वास्थ्य एवं स्वच्छता',
      status: 'प्रगति पर',
      description: 'जल जीवन मिशन के अंतर्गत पंचायत के सभी घरों में शुद्ध पेयजल पहुँचाने के लिए पाइपलाइन बिछाने का कार्य तेजी से प्रगति पर है।',
      content: 'स्वच्छ और सुरक्षित पेयजल हर ग्रामीण का अधिकार है। इसी उद्देश्य को पूरा करने के लिए पंचायत ने "जल जीवन मिशन" के तहत तेजी से काम किया है। एक बड़ी पानी की टंकी का निर्माण कार्य पूर्ण हो चुका है और पाइपलाइन बिछाने का काम अंतिम चरण में है। इस योजना के पूरी होने से महिलाओं को दूर से पानी लाने की समस्या से हमेशा के लिए मुक्ति मिल जाएगी।',
      banner: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1600&h=600&fit=crop',
      image1: 'https://images.unsplash.com/photo-1548503027-2c932bf52c3c?w=600&h=600&fit=crop',
      image2: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=600&fit=crop',
      benefits: [
        { icon: 'fas fa-faucet', title: 'शुद्ध पेयजल', desc: 'हर घर में सीधे आरओ (RO) की तरह शुद्ध और स्वच्छ पानी की आपूर्ति।' },
        { icon: 'fas fa-female', title: 'महिलाओं को राहत', desc: 'दूर से पानी भरकर लाने की भारी मेहनत और समय की बचत।' },
        { icon: 'fas fa-virus-slash', title: 'बीमारियों से बचाव', desc: 'दूषित पानी से होने वाली जलजनित बीमारियों से सुरक्षा।' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1548503027-2c932bf52c3c?w=800&fit=crop',
        'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&fit=crop',
        'https://images.unsplash.com/photo-1544383835-bca2bc6f5ea3?w=800&fit=crop'
      ],
      beforeImage: 'https://images.unsplash.com/photo-1616422285623-14e9e049ed67?w=600&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1548503027-2c932bf52c3c?w=600&h=400&fit=crop',
      feedbacks: [
        { name: 'गीता देवी', role: 'गृहिणी', text: 'गर्मी के दिनों में 2 किलोमीटर दूर से पानी लाना पड़ता था। अब घर में नल से पानी आता है।' },
        { name: 'सुरेश पटेल', role: 'ग्रामीण', text: 'पाइपलाइन बिछाने का काम बहुत तेजी और अच्छी गुणवत्ता के साथ हुआ है।' }
      ]
    },
    {
      id: '3',
      title: 'सोलर स्ट्रीट लाइट स्थापना',
      category: 'ऊर्जा एवं पर्यावरण',
      status: 'पूर्ण कार्य',
      description: 'पर्यावरण संरक्षण और ऊर्जा बचत को ध्यान में रखते हुए पंचायत के प्रमुख चौराहों पर 50 से अधिक सोलर स्ट्रीट लाइटें लगाई गई हैं।',
      content: 'गाँव की सड़कों, चौराहों और मुख्य स्थानों को रात में भी रोशन रखने के लिए पर्यावरण के अनुकूल अत्याधुनिक सोलर स्ट्रीट लाइटें लगाई गई हैं। ये लाइटें दिन में सूर्य की रोशनी से चार्ज होती हैं और रात भर चलती हैं। इससे न केवल रात में ग्रामीणों को सुरक्षित आवागमन की सुविधा मिली है, बल्कि पंचायत के बिजली बिल में भी भारी बचत हो रही है।',
      banner: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1600&h=600&fit=crop',
      image1: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&h=600&fit=crop',
      image2: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&h=600&fit=crop',
      benefits: [
        { icon: 'fas fa-lightbulb', title: 'संपूर्ण रोशनी', desc: 'रात के समय गाँव के मुख्य मार्गों पर सुरक्षा और उजाला।' },
        { icon: 'fas fa-leaf', title: 'हरित ऊर्जा', desc: 'प्रदूषण मुक्त और पर्यावरण के अनुकूल सौर ऊर्जा का उपयोग।' },
        { icon: 'fas fa-piggy-bank', title: 'धन की बचत', desc: 'बिजली कटौती की समस्या खत्म और बिलों में भारी कमी।' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&fit=crop',
        'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&fit=crop',
        'https://images.unsplash.com/photo-1548611716-e5c4ec4d9241?w=800&fit=crop'
      ],
      beforeImage: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&h=400&fit=crop',
      feedbacks: [
        { name: 'मनोज गुप्ता', role: 'दुकानदार', text: 'पहले रात 8 बजे के बाद बाजार सूना हो जाता था। अब रात में भी चहल-पहल रहती है।' },
        { name: 'रेखा अहिरवार', role: 'महिला समिति', text: 'सोलर लाइट लगने से अब महिलाएं भी रात के समय सुरक्षित महसूस करती हैं।' }
      ]
    },
    {
      id: '4',
      title: 'पंचायत भवन का जीर्णोद्धार',
      category: 'ई-पंचायत एवं प्रशासन',
      status: 'पूर्ण कार्य',
      description: 'ग्राम पंचायत भवन की मरम्मत, रंग-रोगन और आधुनिक सुविधाओं के साथ उन्नयन कार्य सफलतापूर्वक पूर्ण किया गया है।',
      content: 'पंचायत भवन गाँव के विकास और प्रशासन का मुख्य केंद्र है। इसे एक आधुनिक "ई-पंचायत" का रूप देने के लिए इसका संपूर्ण जीर्णोद्धार किया गया है। भवन में नए फर्नीचर, तेज़ इंटरनेट, कंप्यूटर सिस्टम और डिजिटल डिस्प्ले जैसी सुविधाएं लगाई गई हैं। अब ग्रामीणों को आय प्रमाण पत्र, जाति प्रमाण पत्र और अन्य सरकारी कार्यों के लिए शहर जाने की आवश्यकता नहीं है।',
      banner: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=600&fit=crop',
      image1: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop',
      image2: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=600&fit=crop',
      benefits: [
        { icon: 'fas fa-desktop', title: 'डिजिटल सुविधाएं', desc: 'गाँव में ही कंप्यूटर और इंटरनेट से सभी ऑनलाइन फॉर्म भरने की सुविधा।' },
        { icon: 'fas fa-users', title: 'ग्राम सभा हॉल', desc: 'ग्रामीणों की बैठक और चर्चा के लिए एक बड़ा और सुसज्जित हॉल।' },
        { icon: 'fas fa-clock', title: 'समय की बचत', desc: 'सरकारी कामों के लिए अब तहसील या शहर जाने की आवश्यकता नहीं।' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&fit=crop',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&fit=crop',
        'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&fit=crop'
      ],
      beforeImage: 'https://images.unsplash.com/photo-1558227691-41ea78d1f631?w=600&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
      feedbacks: [
        { name: 'राकेश विश्वकर्मा', role: 'छात्र', text: 'आय और जाति प्रमाण पत्र बनवाने के लिए अब हमें शहर के चक्कर नहीं काटने पड़ते।' },
        { name: 'कमल ठाकुर', role: 'बुजुर्ग', text: 'पंचायत भवन में बैठने की अच्छी व्यवस्था हो गई है। अधिकारी भी समय पर मिलते हैं।' }
      ]
    },
    {
      id: '5',
      title: 'सार्वजनिक शौचालय निर्माण',
      category: 'स्वच्छ भारत मिशन',
      status: 'प्रगति पर',
      description: 'स्वच्छ भारत मिशन के तहत बस स्टैंड और प्रमुख बाज़ारों में ग्रामीणों की सुविधा हेतु सार्वजनिक शौचालयों का निर्माण कार्य जारी है।',
      content: 'स्वच्छता अभियान को नए स्तर पर ले जाते हुए, पंचायत के प्रमुख स्थानों (जैसे बस स्टैंड, बाज़ार और हाट) पर आधुनिक सार्वजनिक शौचालयों का निर्माण किया जा रहा है। इन शौचालयों में महिलाओं और पुरुषों के लिए अलग-अलग व्यवस्था, पानी की निरंतर आपूर्ति और साफ-सफाई के लिए विशेष ध्यान रखा गया है। इससे हमारे गाँव को "पूर्ण रूप से खुले में शौच मुक्त" (ODF Plus) का दर्जा मिलेगा।',
      banner: 'https://images.unsplash.com/photo-1584483745277-2b36b6dcd426?w=1600&h=600&fit=crop',
      image1: 'https://images.unsplash.com/photo-1584483745277-2b36b6dcd426?w=600&h=600&fit=crop',
      image2: 'https://images.unsplash.com/photo-1628167810574-0f3fdebafeee?w=600&h=600&fit=crop',
      benefits: [
        { icon: 'fas fa-restroom', title: 'सुविधाजनक व्यवस्था', desc: 'महिलाओं और पुरुषों के लिए पूर्ण गोपनीयता के साथ अलग-अलग ब्लॉक।' },
        { icon: 'fas fa-hand-sparkles', title: 'संपूर्ण स्वच्छता', desc: 'बाज़ार और सार्वजनिक स्थानों पर गंदगी और बदबू से पूरी तरह निजात।' },
        { icon: 'fas fa-award', title: 'आदर्श ग्राम', desc: 'स्वच्छ भारत मिशन के तहत ODF Plus गाँव का सम्मान।' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1584483745277-2b36b6dcd426?w=800&fit=crop',
        'https://images.unsplash.com/photo-1628167810574-0f3fdebafeee?w=800&fit=crop',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&fit=crop'
      ],
      beforeImage: 'https://images.unsplash.com/photo-1510133744874-0968ee3a428e?w=600&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1628167810574-0f3fdebafeee?w=600&h=400&fit=crop',
      feedbacks: [
        { name: 'शांति बाई', role: 'स्थानीय निवासी', text: 'बाजार और बस स्टैंड पर सुलभ शौचालय बनने से महिलाओं को सबसे ज्यादा सुविधा मिली है।' },
        { name: 'हरीश लोधी', role: 'दुकानदार', text: 'गंदगी और बदबू खत्म हो गई है। बाजार में अब साफ-सफाई रहती है।' }
      ]
    },
    {
      id: '6',
      title: 'स्मार्ट आंगनवाड़ी केंद्र',
      category: 'बाल विकास एवं शिक्षा',
      status: 'प्रस्तावित',
      description: 'बच्चों के सर्वांगीण विकास के लिए आधुनिक सुविधाओं से युक्त डिजिटल और स्मार्ट आंगनवाड़ी केंद्र का प्रस्ताव स्वीकृत हो चुका है।',
      content: 'बच्चों की प्राथमिक शिक्षा और स्वास्थ्य की बेहतर देखभाल के लिए हमारी पंचायत एक स्मार्ट आंगनवाड़ी केंद्र का निर्माण करने जा रही है। इस केंद्र में बच्चों के लिए डिजिटल लर्निंग टूल्स (टीवी/प्रोजेक्टर), रंग-बिरंगी दीवारें, सुरक्षित खेलने का क्षेत्र और पौष्टिक आहार पकाने के लिए एक आधुनिक रसोईघर की व्यवस्था होगी। इससे बच्चों का मानसिक और शारीरिक विकास खेल-खेल में हो सकेगा।',
      banner: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=1600&h=600&fit=crop',
      image1: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=600&h=600&fit=crop',
      image2: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=600&fit=crop',
      benefits: [
        { icon: 'fas fa-shapes', title: 'डिजिटल शिक्षा', desc: 'स्मार्ट टीवी और खिलौनों के माध्यम से बच्चों को खेल-खेल में शिक्षा।' },
        { icon: 'fas fa-apple-alt', title: 'पोषण एवं स्वास्थ्य', desc: 'गर्भवती महिलाओं और बच्चों के लिए स्वच्छ किचन में बना पौष्टिक आहार।' },
        { icon: 'fas fa-shield-alt', title: 'सुरक्षित वातावरण', desc: 'बच्चों के खेलने और रहने के लिए पूरी तरह से सुरक्षित और रंगीन परिसर।' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=800&fit=crop',
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&fit=crop',
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&fit=crop'
      ],
      beforeImage: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=600&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=600&h=400&fit=crop',
      feedbacks: [
        { name: 'माया प्रजापति', role: 'आंगनवाड़ी कार्यकर्ता', text: 'स्मार्ट टीवी और खिलौनों से अब बच्चे खुशी-खुशी आंगनवाड़ी आते हैं।' },
        { name: 'कविता सेन', role: 'माता', text: 'बच्चों को अब अच्छा और पौष्टिक खाना मिलता है, और वे नई चीजें भी सीख रहे हैं।' }
      ]
    }
  ];

  // URL hash से मैच करने वाला कार्य ढूँढें, न मिलने पर पहला कार्य दिखाएं
  const work = devWorks.find(w => w.id === workId) || devWorks[0];

  return (
    <div className="work-detail-page" style={{ backgroundColor: '#FDFBF7', paddingBottom: '80px' }}>
      
      {/* Hero Banner Section */}
      <div style={{ 
        width: '100%', 
        height: '400px', 
        backgroundImage: `linear-gradient(rgba(2, 44, 34, 0.75), rgba(2, 44, 34, 0.9)), url("${work.banner}")`, 
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
          <i className="fas fa-project-diagram"></i> {work.category}
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '700', marginBottom: '15px', textShadow: '0 4px 15px rgba(0,0,0,0.3)', maxWidth: '900px' }}>
          {work.title}
        </h1>
        <p style={{ fontSize: '18px', maxWidth: '800px', lineHeight: '1.6', opacity: '0.9' }}>
          {work.description}
        </p>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '-50px auto 0', position: 'relative', zIndex: 10, padding: '0 24px' }}>
        
        {/* Main Content & Image Collage Box */}
        <div style={{ background: '#ffffff', padding: 'clamp(20px, 5vw, 50px)', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '50px', alignItems: 'center' }}>
            {/* Left Side: Text / Theory */}
            <div>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: '#064E3B', marginBottom: '20px', fontWeight: '700' }}>परियोजना का विवरण</h2>
              <div style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', textAlign: 'justify' }}>
                <p>{work.content}</p>
              </div>
            </div>
            
            {/* Right Side: Image Collage Frame */}
            <div style={{ position: 'relative', height: '420px', width: '100%' }}>
              <div style={{ position: 'absolute', top: '10%', right: '5%', bottom: '0', left: '15%', background: '#F0FDF4', borderRadius: '24px', border: '2px dashed #A7F3D0', zIndex: 0 }}></div>
              
              {/* Image 1 */}
              <img src={work.image1} alt="Project Progress 1" 
                   style={{ position: 'absolute', top: '0', left: '0', width: '65%', height: '280px', objectFit: 'cover', borderRadius: '16px', border: '8px solid #ffffff', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', cursor: 'zoom-in', zIndex: 2, transition: 'transform 0.4s' }} 
                   onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03) rotate(-2deg)'} 
                   onMouseOut={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                   onClick={() => setSelectedImage({ src: work.image1, title: 'परियोजना का दृश्य 1' })} title="बड़ा देखने के लिए क्लिक करें" />

              {/* Image 2 */}
              <img src={work.image2} alt="Project Progress 2" 
                   style={{ position: 'absolute', bottom: '20px', right: '0', width: '60%', height: '260px', objectFit: 'cover', borderRadius: '16px', border: '8px solid #ffffff', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', cursor: 'zoom-in', zIndex: 3, transition: 'transform 0.4s' }} 
                   onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03) rotate(2deg)'} 
                   onMouseOut={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                   onClick={() => setSelectedImage({ src: work.image2, title: 'परियोजना का दृश्य 2' })} title="बड़ा देखने के लिए क्लिक करें" />

              {/* Status Badge */}
              <div style={{ position: 'absolute', top: '40%', right: '-15px', background: work.status === 'पूर्ण कार्य' ? 'linear-gradient(135deg, #059669, #047857)' : work.status === 'प्रगति पर' ? 'linear-gradient(135deg, #D97706, #B45309)' : 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#ffffff', padding: '15px', borderRadius: '50%', width: '90px', height: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', zIndex: 4, border: '4px solid #fff' }}>
                <i className={work.status === 'पूर्ण कार्य' ? "fas fa-check-double" : work.status === 'प्रगति पर' ? "fas fa-tools" : "fas fa-clipboard-list"} style={{ fontSize: '24px', marginBottom: '4px' }}></i>
                <span style={{ fontSize: '12px', textAlign: 'center', lineHeight: '1.2', fontWeight: 'bold' }}>{work.status}</span>
              </div>
            </div>
          </div>

          {/* Before & After Section */}
          <div style={{ marginTop: '60px' }}>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 28px)', color: '#064E3B', marginBottom: '30px', fontWeight: '700', textAlign: 'center' }}>
              परियोजना का प्रभाव: <span style={{ color: '#D4AF37' }}>पहले और अब</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '30px' }}>
              {/* Before Card */}
              <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', borderTop: '4px solid #DC2626', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                <div style={{ background: '#FEF2F2', padding: '14px 20px', color: '#DC2626', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px' }}><i className="fas fa-times-circle"></i> कार्य से पहले की स्थिति</div>
                <div style={{ height: '280px', overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setSelectedImage({ src: work.beforeImage, title: 'कार्य से पहले' })} title="बड़ा देखने के लिए क्लिक करें">
                  <img src={work.beforeImage} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)', transition: 'transform 0.4s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                </div>
              </div>
              {/* After Card */}
              <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', borderTop: '4px solid #059669', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                <div style={{ background: '#F0FDF4', padding: '14px 20px', color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px' }}><i className="fas fa-check-circle"></i> कार्य पूर्ण होने के बाद</div>
                <div style={{ height: '280px', overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setSelectedImage({ src: work.afterImage, title: 'कार्य के बाद' })} title="बड़ा देखने के लिए क्लिक करें">
                  <img src={work.afterImage} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Benefits Section */}
        <div style={{ marginTop: '80px' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: '#064E3B', marginBottom: '40px', fontWeight: '700', textAlign: 'center' }}>
            इस कार्य के प्रमुख <span style={{ color: '#D4AF37' }}>लाभ</span>
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '30px' }}>
            {work.benefits.map((benefit, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', padding: '35px 25px', borderRadius: '16px', border: '1px solid #E2E8F0', borderBottom: '4px solid #064E3B', textAlign: 'center', transition: 'transform 0.3s, boxShadow 0.3s' }} onMouseOver={e => {e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.08)'}} onMouseOut={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'}}>
                <div style={{ width: '70px', height: '70px', margin: '0 auto 20px', background: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#064E3B', fontSize: '28px' }}>
                  <i className={benefit.icon}></i>
                </div>
                <h3 style={{ fontSize: '22px', color: '#1E293B', marginBottom: '12px', fontWeight: '700' }}>{benefit.title}</h3>
                <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Public Feedback Section */}
        <div style={{ marginTop: '80px', background: '#F8FAFC', borderRadius: '24px', padding: 'clamp(20px, 5vw, 50px)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: '#064E3B', fontWeight: '700', marginBottom: '15px' }}>
              ग्रामीणों की <span style={{ color: '#D4AF37' }}>प्रतिक्रिया</span>
            </h2>
            <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>इस विकास कार्य से ग्रामवासियों के जीवन में आए सकारात्मक बदलाव के उनके अपने अनुभव।</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '30px' }}>
            {work.feedbacks.map((feedback, idx) => (
              <div key={idx} style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #E2E8F0', position: 'relative', boxShadow: '0 5px 15px rgba(0,0,0,0.02)', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <i className="fas fa-quote-left" style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '30px', color: '#D4AF37', opacity: '0.2' }}></i>
                <p style={{ fontSize: '15.5px', color: '#4B5563', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '20px', position: 'relative', zIndex: 1 }}>"{feedback.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderTop: '1px dashed #E2E8F0', paddingTop: '15px' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #064E3B, #047857)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>
                    {feedback.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#1E293B', fontSize: '16px', fontWeight: '700' }}>{feedback.name}</h4>
                    <span style={{ fontSize: '13px', color: '#D97706', fontWeight: '600' }}>{feedback.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Image Gallery */}
        <div style={{ marginTop: '80px' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 28px)', color: '#064E3B', marginBottom: '30px', fontWeight: '700' }}>
            परियोजना की <span style={{ color: '#D4AF37' }}>गैलरी</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
            {work.gallery.map((imgSrc, idx) => (
              <div key={idx} style={{ borderRadius: '16px', overflow: 'hidden', height: '220px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', cursor: 'zoom-in' }} onClick={() => setSelectedImage({ src: imgSrc, title: `${work.title} - दृश्य ${idx + 1}` })} title="बड़ा देखने के लिए क्लिक करें">
                <img src={imgSrc} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
              </div>
            ))}
          </div>
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
            style={{ maxWidth: '90%', maxHeight: '80vh', borderRadius: '10px', border: '5px solid #fff', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }} 
            onClick={(e) => e.stopPropagation()} 
          />
          {selectedImage.title && (
            <h3 style={{ color: '#fff', marginTop: '20px', fontSize: '1.5rem', fontWeight: '600', letterSpacing: '1px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              {selectedImage.title}
            </h3>
          )}
        </div>
      )}
    </div>
  );
}

export default WorkDetail;