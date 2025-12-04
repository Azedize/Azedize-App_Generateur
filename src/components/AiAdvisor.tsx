import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import { getSecurityAdvice } from '../services/geminiService';
import { translations } from '../services/i18nService';
import { LanguageCode } from '../types';
import gsap from 'gsap';

interface Props {
  lang: LanguageCode;
}

const AiAdvisor: React.FC<Props> = ({ lang }) => {
  const t = translations;
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
      { role: 'ai', text: t.advisor_intro[lang] }
  ]);
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, loading]);

  const handleAsk = async () => {
    if (!query.trim()) return;
    
    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const answer = await getSecurityAdvice(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: answer }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-100px)] flex flex-col p-4 md:p-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-primary">
            <Sparkles size={24} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{t.advisor_title[lang]}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{t.advisor_desc[lang]}</p>
      </div>

      <div className="flex-grow bg-card border border-border rounded-3xl shadow-xl overflow-hidden flex flex-col relative">
        <div ref={containerRef} className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 animate-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-2 ${msg.role === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${
                        msg.role === 'ai' 
                        ? 'bg-muted/50 text-foreground rounded-tl-none border border-border/50' 
                        : 'bg-primary text-primary-foreground rounded-tr-none'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}

            {loading && (
                <div className="flex gap-4 animate-in fade-in">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-2 text-primary-foreground">
                        <Bot size={16} />
                    </div>
                    <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-none border border-border/50 flex items-center gap-1.5 h-12">
                        <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-background border-t border-border">
            <div className="relative flex items-center">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                    placeholder={t.advisor_placeholder[lang]}
                    className="w-full pl-5 pr-14 py-4 bg-muted/30 border border-input rounded-2xl focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all shadow-inner"
                    autoFocus
                />
                <button 
                    onClick={handleAsk}
                    disabled={loading || !query.trim()}
                    className="absolute right-2 p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AiAdvisor;