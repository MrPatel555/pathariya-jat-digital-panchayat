import React, { useState, useRef, useEffect } from 'react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('hi'); // 'hi' for Hindi, 'en' for English
  const [isListening, setIsListening] = useState(false);
  const [weather, setWeather] = useState({ temp: '--°C', icon: 'fas fa-cloud-sun' });
  const recognitionRef = useRef(null);
  const startTextRef = useRef('');
  
  // UI Text for Both Languages
  const uiText = {
    hi: {
      header: 'पंचायत AI असिस्टेंट',
      placeholder: isListening ? 'बोलिए, मैं सुन रहा हूँ...' : 'अपना सवाल यहाँ लिखें या बोलें...',
      typing: '...AI टाइप कर रहा है...',
      greeting: 'नमस्ते! मैं पथरिया जाट ग्राम पंचायत का स्मार्ट AI असिस्टेंट हूँ। आप गाँव की जनसंख्या, सरपंच, योजनाओं या विकास कार्यों के बारे में मुझसे पूछ सकते हैं। मैं आपकी क्या सहायता कर सकता हूँ?',
      fallback: 'क्षमा करें, मुझे इस सवाल का सटीक जवाब नहीं पता। मैं अभी सीख रहा हूँ। कृपया सरपंच, जनसंख्या या विकास कार्यों से जुड़ा कुछ पूछें।',
      notSupported: 'आपका ब्राउज़र वॉइस इनपुट सपोर्ट नहीं करता है। कृपया क्रोम (Chrome) का उपयोग करें।'
    },
    en: {
      header: 'Panchayat AI Assistant',
      placeholder: isListening ? 'Speak now, listening...' : 'Type or speak your question...',
      typing: '...AI is typing...',
      greeting: 'Hello! I am the smart AI assistant of Pathariya Jat Gram Panchayat. You can ask me about the village population, Sarpanch, schemes, or development works. How can I help you?',
      fallback: 'Sorry, I don\'t have the exact answer to this question yet. I am still learning. Please ask about the Sarpanch, population, or development works.',
      notSupported: 'Your browser does not support voice input. Please use Chrome.'
    }
  };

  const [messages, setMessages] = useState([
    { sender: 'bot', text: uiText.hi.greeting }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // हर नए मैसेज पर चैट को नीचे स्क्रॉल करने के लिए
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // रियल-टाइम मौसम की जानकारी (सागर, मध्य प्रदेश के अक्षांश और देशांतर के आधार पर)
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=23.83&longitude=78.71&current_weather=true')
      .then(res => res.json())
      .then(data => {
        if (data && data.current_weather) {
          const temp = Math.round(data.current_weather.temperature);
          const code = data.current_weather.weathercode;
          let icon = 'fas fa-sun'; // साफ मौसम
          if (code >= 1 && code <= 3) icon = 'fas fa-cloud-sun'; // आंशिक बादल
          else if (code >= 45 && code <= 48) icon = 'fas fa-smog'; // कोहरा
          else if (code >= 51 && code <= 67) icon = 'fas fa-cloud-rain'; // बारिश
          else if (code >= 71 && code <= 82) icon = 'fas fa-snowflake'; // बर्फ/ठंड
          else if (code >= 95) icon = 'fas fa-bolt'; // आंधी-तूफान
          
          setWeather({ temp: `${temp}°C`, icon });
        }
      })
      .catch(err => console.error('Weather fetch error:', err));
  }, []);

  // भाषा बदलने पर नया ग्रीटिंग मैसेज भेजें
  const toggleLanguage = () => {
    const newLang = lang === 'hi' ? 'en' : 'hi';
    setLang(newLang);
    setMessages([{ sender: 'bot', text: uiText[newLang].greeting }]);
    setInput('');
  };

  // पथरिया जाट का लोकल AI नॉलेज-बेस (Bilingual)
  const knowledgeBase = [
    { keywords: ['सरपंच', 'sarpanch', 'mukhiya', 'मुखिया', 'प्रधान'], hi: 'ग्राम पंचायत पथरिया जाट के वर्तमान सरपंच श्रीमान रामसेवक पटेल जी हैं।', en: 'The current Sarpanch of Gram Panchayat Pathariya Jat is Mr. Ramsewak Patel.' },
    { keywords: ['उप-सरपंच', 'उप सरपंच', 'upsarpanch', 'vice sarpanch'], hi: 'यहाँ के उप-सरपंच श्रीमान मोहन यादव जी हैं।', en: 'The Deputy Sarpanch here is Mr. Mohan Yadav.' },
    { keywords: ['सचिव', 'sachiv', 'secretary'], hi: 'श्रीमती गीता विश्वकर्मा जी पंचायत सचिव हैं और श्रीमान सुरेश कुमार जी रोजगार सहायक हैं।', en: 'Mrs. Geeta Vishwakarma is the Panchayat Secretary and Mr. Suresh Kumar is the Employment Assistant.' },
    { keywords: ['जनसंख्या', 'population', 'लोग', 'आबादी', 'कितने', 'how many people'], hi: 'पथरिया जाट की कुल जनसंख्या लगभग 9,250 है, जिसमें 4,718 पुरुष और 4,532 महिलाएँ हैं।', en: 'The total population of Pathariya Jat is approximately 9,250, which includes 4,718 males and 4,532 females.' },
    { keywords: ['कहाँ', 'where', 'जिला', 'district', 'location', 'कहा', 'पता', 'address'], hi: 'पथरिया जाट मध्य प्रदेश के सागर जिले (सागर तहसील) में स्थित एक आदर्श ग्राम पंचायत है।', en: 'Pathariya Jat is an ideal Gram Panchayat located in Sagar district (Sagar Tehsil) of Madhya Pradesh.' },
    { keywords: ['योजना', 'yojana', 'scheme', 'योजनाएं', 'लाभ'], hi: 'गाँव में जल जीवन मिशन, स्वच्छ भारत मिशन, पीएम आवास योजना, लाडली बहना योजना और कई पेंशन योजनाएं सफलतापूर्वक चल रही हैं।', en: 'Schemes like Jal Jeevan Mission, Swachh Bharat Mission, PM Awas Yojana, Ladli Behna Yojana, and various pension schemes are successfully running in the village.' },
    { keywords: ['विकास', 'development', 'काम', 'work', 'प्रोजेक्ट'], hi: 'पंचायत में मुख्य रूप से सीसी रोड निर्माण, हर घर नल-जल योजना, सोलर स्ट्रीट लाइट और स्मार्ट आंगनवाड़ी जैसे कई बेहतरीन विकास कार्य प्रगति पर हैं।', en: 'Major development works like CC road construction, tap water scheme for every house, solar street lights, and smart Anganwadi are in progress.' },
    { keywords: ['धन्यवाद', 'thank', 'thanks', 'ok', 'ओके', 'ठीक'], hi: 'आपका बहुत-बहुत स्वागत है! क्या मैं आपकी किसी और विषय में मदद कर सकता हूँ?', en: 'You are very welcome! Can I help you with anything else?' },
    { keywords: ['नमस्ते', 'hi', 'hello', 'hey', 'हेल्लो', 'हाय'], hi: 'नमस्ते! पथरिया जाट डिजिटल पंचायत में आपका स्वागत है। बताइए, मैं आपकी क्या सहायता कर सकता हूँ?', en: 'Hello! Welcome to Pathariya Jat Digital Panchayat. How can I assist you today?' },
    { keywords: ['तुम कौन हो', 'who are you', 'तुम्हारा नाम', 'your name'], hi: 'मैं पथरिया जाट डिजिटल पंचायत का अपना AI असिस्टेंट हूँ। मुझे ग्राम पंचायत से जुड़ी जानकारी देने के लिए प्रोग्राम किया गया है।', en: 'I am the AI Assistant of Pathariya Jat Digital Panchayat. I am programmed to provide information related to the Gram Panchayat.' }
  ];

  // असली AI जैसा महसूस कराने के लिए जवाब ढूँढने का लॉजिक
  const generateResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    for (let item of knowledgeBase) {
      if (item.keywords.some(kw => lowerInput.includes(kw))) {
        return item[lang];
      }
    }
    
    // अगर सवाल समझ न आए (Fallback)
    return uiText[lang].fallback;
  };

  // Voice Input (Speech to Text) Logic
  const handleVoiceInput = (e) => {
    if (e) e.preventDefault();
    
    // मोबाइल पर बिना HTTPS के टेस्ट करने पर वार्निंग (Chrome Security Rule)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      alert("ब्राउज़र सुरक्षा: वॉइस टाइपिंग (माइक) मोबाइल पर तभी काम करेगा जब वेबसाइट इंटरनेट पर Live (HTTPS) हो। बिना HTTPS के Chrome इसे तुरंत ब्लॉक कर देता है। कृपया इसे ऑनलाइन पब्लिश करने के बाद मोबाइल पर टेस्ट करें।");
      setIsListening(false);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(uiText[lang].notSupported);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      recognition.interimResults = true; 
      recognition.continuous = true; // बिना रुके लगातार सुनने के लिए true रखें

      startTextRef.current = input;

      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        let transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        const baseText = startTextRef.current;
        setInput(baseText + (baseText && transcript ? ' ' : '') + transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech error:', event.error);
        if (event.error === 'not-allowed') {
          alert("माइक्रोफ़ोन (Mic) की परमिशन नहीं मिली है।");
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error("Speech recognition has already started", e);
      setIsListening(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // यूज़र का मैसेज जोड़ें
    const newMessages = [...messages, { sender: 'user', text: input.trim() }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // 1-2 सेकंड का टाइपिंग डिले (असली AI की तरह)
    setTimeout(() => {
      const botReply = generateResponse(input.trim());
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <style>
        {`
          .chatbot-btn {
            position: fixed;
            bottom: 85px; /* Up Arrow बटन के ऊपर */
            right: 20px;
            width: 55px;
            height: 55px;
            background: linear-gradient(135deg, #D4AF37, #B45309);
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
            cursor: pointer;
            z-index: 9999;
            transition: all 0.3s ease;
            border: 2px solid #fff;
          }
          .chatbot-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 8px 25px rgba(212, 175, 55, 0.6);
          }
          
          .chatbot-window {
            position: fixed;
            bottom: 155px;
            right: 20px;
            width: 350px;
            max-width: calc(100vw - 40px);
            height: 500px;
            max-height: calc(100vh - 180px);
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 9998;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform-origin: bottom right;
            opacity: ${isOpen ? '1' : '0'};
            transform: ${isOpen ? 'scale(1)' : 'scale(0.5)'};
            pointer-events: ${isOpen ? 'auto' : 'none'};
            border: 1px solid #E2E8F0;
          }

          .chat-header {
            background: linear-gradient(135deg, #064E3B, #047857);
            color: #fff;
            padding: 12px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .chat-header h3 {
            margin: 0;
            font-size: 15px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
          }
          .chat-close {
            cursor: pointer;
            font-size: 20px;
            transition: opacity 0.3s;
          }
          .chat-close:hover { opacity: 0.7; }

          .weather-widget {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .lang-toggle-wrap {
            display: flex;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 20px;
            overflow: hidden;
            cursor: pointer;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .lang-toggle-wrap span {
            padding: 4px 8px;
            font-size: 13px;
            font-weight: bold;
            color: rgba(255, 255, 255, 0.7);
            transition: all 0.3s;
            line-height: 1;
          }
          .lang-toggle-wrap span.active {
            background: #D4AF37;
            color: #fff;
          }

          .chat-body {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #FDFBF7;
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .chat-msg {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 16px;
            font-size: 14.5px;
            line-height: 1.5;
            word-wrap: break-word;
          }
          .msg-bot {
            background: #fff;
            color: #1E293B;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            border: 1px solid #E2E8F0;
          }
          .msg-user {
            background: #064E3B;
            color: #fff;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
            box-shadow: 0 2px 10px rgba(6,78,59,0.15);
          }

          .chat-footer {
            padding: 15px;
            background: #fff;
            border-top: 1px solid #E2E8F0;
          }
          .chat-form {
            display: flex;
            gap: 10px;
          }
          .chat-form input {
            flex: 1;
            padding: 10px 15px;
            border: 1px solid #CBD5E1;
            border-radius: 30px;
            outline: none;
            font-size: 14px;
            transition: border-color 0.3s;
          }
          .chat-form input:focus { border-color: #D4AF37; }
          .chat-form button {
            width: 40px;
            height: 40px;
            background: #D4AF37;
            color: #fff;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
          }
          .chat-form button:hover { background: #B45309; }
          
          .mic-btn {
            background: ${isListening ? '#DC2626' : '#F1F5F9'};
            color: ${isListening ? '#fff' : '#64748B'};
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
            animation: ${isListening ? 'pulse-mic 1.5s infinite' : 'none'};
          }
          .mic-btn:hover { background: ${isListening ? '#B91C1C' : '#E2E8F0'}; }

          @keyframes pulse-mic {
            0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
            100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
          }
        `}
      </style>

      {/* Floating Chat Button */}
      <div className="chatbot-btn" onClick={() => setIsOpen(!isOpen)} title="AI असिस्टेंट से बात करें">
        <i className={isOpen ? "fas fa-times" : "fas fa-robot"}></i>
      </div>

      {/* Chat Window */}
      <div className="chatbot-window">
        <div className="chat-header">
          <h3><i className="fas fa-robot"></i> {uiText[lang].header}</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            
            {/* Live Weather Widget */}
            <div className="weather-widget" title="सागर (म.प्र.) का वर्तमान मौसम">
              <i className={weather.icon}></i> {weather.temp}
            </div>

            {/* Custom Lang Toggle */}
            <div className="lang-toggle-wrap" onClick={toggleLanguage} title={lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}>
              <span className={lang === 'hi' ? 'active' : ''}>अ</span>
              <span className={lang === 'en' ? 'active' : ''}>A</span>
            </div>
            
            <i className="fas fa-times chat-close" onClick={() => setIsOpen(false)}></i>
          </div>
        </div>
        
        <div className="chat-body">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-msg ${msg.sender === 'bot' ? 'msg-bot' : 'msg-user'}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && <div className="chat-msg msg-bot">{uiText[lang].typing}</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-footer">
          <form className="chat-form" onSubmit={handleSend}>
            <button type="button" className="mic-btn" onClick={handleVoiceInput} title="बोलकर टाइप करें">
              <i className={isListening ? "fas fa-microphone" : "fas fa-microphone-alt"}></i>
            </button>
            <input type="text" placeholder={uiText[lang].placeholder} value={input} onChange={(e) => setInput(e.target.value)} />
            <button type="submit" disabled={!input.trim()}><i className="fas fa-paper-plane"></i></button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Chatbot;