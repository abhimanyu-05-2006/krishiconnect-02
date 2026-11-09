import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Globe, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isRealAi?: boolean;
  groundedWithMaps?: boolean;
  mapSources?: { title: string; uri?: string }[];
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const { user, role } = useAuth();
  const { lang, setLang } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      text:
        lang === 'hi'
          ? 'नमस्ते! मैं कृषि मित्र (KrishiMitra) AI सहायक हूँ। आप मुझसे मंडी भाव, फसल संरक्षण, जैविक कीट नियंत्रण, आगामी मौसमी मांग या खेत से सीधी बिक्री के बारे में कुछ भी पूछ सकते हैं।'
          : lang === 'mr'
          ? 'नमस्कार! मी कृषी मित्र (KrishiMitra) AI सहाय्यक आहे. आपण मला बाजारभाव, सेंद्रिय कीड नियंत्रण, पीक सल्ला, आगामी हंगामी मागणी किंवा थेट शेतमाल विक्रीबद्दल काहीही विचारू शकता.'
          : 'Namaste! I am KrishiMitra, your AI agricultural & marketplace assistant. Ask me anything about mandi rates, organic pest management, seasonal crop demand, or direct pricing strategies in Madhya Pradesh.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRealAi: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts =
    lang === 'hi'
      ? [
          'भोपाल व सीहोर मंडी में आज टमाटर का सही भाव क्या है?',
          'टमाटर में अगेती झुलसा रोग का जैविक उपचार बताएं',
          'इस महीने किन सब्जियों की मांग सबसे अधिक रहेगी?',
          'पारंपरिक आढ़तिया की तुलना में कृषि कनेक्ट से क्या फायदा है?',
        ]
      : lang === 'mr'
      ? [
          'बाजारपेठेत आज टोमॅटोचा रास्त बाजारभाव काय आहे?',
          'भाजीपाल्यावरील कीड व रोगांवर सेंद्रिय उपाय सांगा',
          'येत्या महिन्यात कोणत्या शेतमालाला सर्वाधिक मागणी राहील?',
          'दलालांशिवाय कृषी कनेक्टवर थेट विक्रीचे काय फायदे आहेत?',
        ]
      : [
          'What is the fair direct price for organic tomatoes in Sehore?',
          'Organic pest remedies for leafy vegetables (Spinach/Palak)',
          'Which crops have highest upcoming demand in Bhopal & MP?',
          'How does KrishiConnect compare to traditional mandi commission?',
        ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          role: role,
          language: lang,
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Thank you. KrishiConnect is ready to help.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRealAi: data.isRealAi,
        groundedWithMaps: data.groundedWithMaps,
        mapSources: data.mapSources,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to reach Gemini API. However, based on Sehore Mandi records: current tomato arrivals are moderate (₹22-25/kg); recommended KrishiConnect direct price: ₹28-30/kg.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRealAi: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#F7F8F2] w-full max-w-2xl rounded-2xl border border-[#174D35]/20 shadow-2xl flex flex-col h-[640px] max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 bg-[#174D35] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B7D96B] text-[#174D35] flex items-center justify-center font-bold shadow">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">KrishiMitra AI Assistant</h3>
                <span className="text-[10px] bg-[#B7D96B]/20 text-[#B7D96B] font-semibold px-2 py-0.5 rounded">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-[#B7D96B]/80">
                Contextual advisory for {user?.name} ({role})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : lang === 'hi' ? 'mr' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              title="Change Language / भाषा बदला"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'EN' : lang === 'hi' ? 'हिं' : 'मरा'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 max-w-[85%] ${
                m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                  m.sender === 'user'
                    ? 'bg-[#174D35] text-white'
                    : 'bg-[#3C8D5A] text-white'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#174D35] text-white rounded-tr-xs'
                    : 'bg-white text-[#17251C] border border-[#174D35]/15 shadow-xs rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line font-normal">{m.text}</div>

                {/* Google Maps Grounding Sources */}
                {m.mapSources && m.mapSources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[#174D35]/10 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-[#3C8D5A] flex items-center gap-1">
                      <svg className="w-3 h-3 fill-current text-red-500" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      Google Maps Grounding:
                    </span>
                    {m.mapSources.map((src, sIdx) => (
                      <a
                        key={sIdx}
                        href={src.uri || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F7F8F2] hover:bg-white border border-[#174D35]/15 text-[10px] text-[#174D35] font-medium transition-colors"
                      >
                        <span>{src.title}</span>
                      </a>
                    ))}
                  </div>
                )}

                <div
                  className={`mt-1.5 text-[10px] flex items-center justify-between gap-3 ${
                    m.sender === 'user' ? 'text-white/70' : 'text-[#7C887E]'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {m.sender === 'assistant' && (
                    <span className="text-[10px] italic flex items-center gap-1">
                      {m.groundedWithMaps && (
                        <span className="text-[9px] font-semibold text-[#174D35] bg-[#B7D96B]/30 px-1.5 py-0.2 rounded">
                          Maps Grounded
                        </span>
                      )}
                      <span>{m.isRealAi ? 'Gemini 3.8 Flash' : 'Mandi Knowledge Base'}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 max-w-[85%]">
              <div className="w-7 h-7 rounded-lg bg-[#3C8D5A] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#174D35]/15 text-xs text-[#7C887E] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#3C8D5A] animate-ping" />
                <span>Analyzing mandi prices and agricultural records...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2 bg-white/60 border-t border-[#174D35]/10 flex gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-[#174D35]/15 hover:border-[#174D35] text-[#174D35] whitespace-nowrap transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-white border-t border-[#174D35]/15">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'फसल, मंडी भाव या कीट नियंत्रण के बारे में पूछें...'
                  : lang === 'mr'
                  ? 'शेतमाल, बाजारभाव किंवा कीड नियंत्रणाबद्दल विचारा...'
                  : 'Ask about mandi prices, organic sprays, crop demand...'
              }
              className="flex-1 px-3.5 py-2.5 text-xs bg-[#F7F8F2] border border-[#174D35]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D35] focus:bg-white text-[#17251C]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-[#174D35] text-white hover:bg-[#123b28] disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-1.5 text-[10px] text-[#7C887E] flex items-center justify-between">
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-[#E6A23C]" />
              {lang === 'hi'
                ? 'AI अनुमान केवल सलाहकार मार्गदर्शन हैं; बड़े सौदों से पहले स्थानीय मंडी दर जांचें।'
                : lang === 'mr'
                ? 'AI अंदाज मार्गदर्शक स्वरूपाचे आहेत; मोठ्या व्यवहारांपूर्वी स्थानिक बाजार समिती दर तपासावेत.'
                : 'AI estimates are advisory recommendations; verify local mandi conditions before high-volume trades.'}
            </span>
            <span>KrishiConnect AI v2.4</span>
          </div>
        </div>

      </div>
    </div>
  );
};
