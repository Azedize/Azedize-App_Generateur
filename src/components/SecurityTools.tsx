import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../services/i18nService';
import { LanguageCode } from '../types';
import { Hash, Key, User, FileDigit, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import gsap from 'gsap';

interface Props {
  lang: LanguageCode;
}

const ADJECTIVES = ["Swift", "Silent", "Brave", "Clever", "Neon", "Cyber", "Quantum", "Rapid", "Secure", "Hidden", "Mystery", "Grand", "Cosmic", "Digital", "Prime"];
const NOUNS = ["Fox", "Hawk", "Wolf", "Bear", "Eagle", "Shark", "Tiger", "Ghost", "Shadow", "Pilot", "Coder", "Nomad", "Ninja", "Wizard", "Guardian"];

const SecurityTools: React.FC<Props> = ({ lang }) => {
  const t = translations;
  const [activeTab, setActiveTab] = useState<'hash' | 'uuid' | 'user' | 'api'>('hash');
  
  // State variables...
  const [hashInput, setHashInput] = useState('');
  const [hashAlgo, setHashAlgo] = useState('SHA-256');
  const [hashOutput, setHashOutput] = useState('');
  const [uuid, setUuid] = useState('');
  const [username, setUsername] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiKeyLen, setApiKeyLen] = useState(32);
  const [copied, setCopied] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate content when tab changes
    if (contentRef.current) {
        gsap.fromTo(contentRef.current, 
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
    }
  }, [activeTab]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateHash = async () => {
    if(!hashInput) return;
    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);
    const buffer = await crypto.subtle.digest(hashAlgo, data);
    const hashArray = Array.from(new Uint8Array(buffer));
    setHashOutput(hashArray.map(b => b.toString(16).padStart(2, '0')).join(''));
  };

  return (
    <div className="bg-card text-card-foreground p-8 rounded-3xl shadow-xl border border-border max-w-4xl mx-auto w-full flex flex-col min-h-[500px]">
       <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">{t.nav_tools[lang]}</h2>
            <p className="text-muted-foreground">{t.tools_subtitle[lang]}</p>
       </div>

       <div className="flex flex-wrap gap-2 mb-8 bg-muted/50 p-1.5 rounded-xl border border-border w-fit">
          {[
              { id: 'hash', icon: Hash, label: t.tool_hash[lang] },
              { id: 'uuid', icon: FileDigit, label: t.tool_uuid[lang] },
              { id: 'user', icon: User, label: t.tool_user[lang] },
              { id: 'api', icon: Key, label: t.tool_api[lang] }
          ].map((tab: any) => (
             <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
            >
                <tab.icon size={16} /> {tab.label}
             </button>
          ))}
       </div>

       <div ref={contentRef} className="flex-grow">
          {activeTab === 'hash' && (
            <div className="space-y-6 max-w-2xl">
               <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                      <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">{t.tool_algo[lang]}</label>
                      <select value={hashAlgo} onChange={e => setHashAlgo(e.target.value)} className="w-full p-2.5 border border-input rounded-lg bg-background text-sm font-medium">
                            <option value="SHA-1">SHA-1</option>
                            <option value="SHA-256">SHA-256</option>
                            <option value="SHA-384">SHA-384</option>
                            <option value="SHA-512">SHA-512</option>
                        </select>
                  </div>
                  <div className="col-span-3">
                     <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">{t.tool_input[lang]}</label>
                     <input 
                        type="text"
                        value={hashInput} 
                        onChange={e => setHashInput(e.target.value)} 
                        className="w-full p-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none"
                        placeholder={t.tools_hash_placeholder[lang]}
                     />
                  </div>
               </div>
               
               <button onClick={generateHash} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold shadow-md hover:bg-primary/90 transition-all">{t.tools_gen_hash[lang]}</button>
               
               {hashOutput && (
                 <div className="animate-in fade-in slide-in-from-bottom-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">{t.tool_output[lang]}</label>
                    <div className="relative group">
                      <div className="w-full p-4 bg-muted/30 border border-border rounded-xl font-mono text-sm break-all text-foreground">
                        {hashOutput}
                      </div>
                      <button onClick={() => handleCopy(hashOutput)} className="absolute top-2 right-2 p-2 bg-background border border-border rounded-lg shadow-sm text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all">
                         {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'uuid' && (
             <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-primary/10 p-6 rounded-full mb-6 text-primary"><FileDigit size={48} /></div>
                <h3 className="text-2xl font-bold mb-2">{t.tool_uuid[lang]}</h3>
                <p className="text-muted-foreground mb-8">{t.tools_uuid_desc[lang]}</p>
                
                <div className="relative w-full max-w-md mb-8">
                    <input type="text" readOnly value={uuid || t.tools_click_gen[lang]} className="w-full p-5 text-center font-mono text-xl border border-input rounded-2xl bg-muted/20 text-foreground" />
                    {uuid && (
                        <button onClick={() => handleCopy(uuid)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                             {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                        </button>
                    )}
                </div>

                <button onClick={() => setUuid(crypto.randomUUID())} className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
                   <RefreshCw size={20} /> {t.tools_gen_uuid[lang]}
                </button>
             </div>
          )}

          {activeTab === 'user' && (
             <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-primary/10 p-6 rounded-full mb-6 text-primary"><User size={48} /></div>
                <h3 className="text-2xl font-bold mb-2">{t.tools_identity_title[lang]}</h3>
                <div className="relative w-full max-w-md my-8">
                    <div className="w-full p-6 text-center font-bold text-3xl border border-border rounded-2xl bg-card shadow-sm text-foreground min-h-[5rem] flex items-center justify-center">
                         {username || "..."}
                    </div>
                    {username && (
                        <button onClick={() => handleCopy(username)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary">
                             {copied ? <CheckCircle size={24} /> : <Copy size={24} />}
                        </button>
                    )}
                </div>
                <button onClick={() => {
                    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
                    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
                    const num = Math.floor(Math.random() * 9999);
                    setUsername(`${adj}${noun}${num}`);
                }} className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
                   <RefreshCw size={20} /> {t.tools_gen_user[lang]}
                </button>
             </div>
          )}

           {activeTab === 'api' && (
             <div className="flex flex-col items-center justify-center py-12 text-center max-w-xl mx-auto">
                <div className="bg-primary/10 p-6 rounded-full mb-6 text-primary"><Key size={48} /></div>
                <h3 className="text-2xl font-bold mb-2">{t.tools_api_title[lang]}</h3>
                
                <div className="w-full mb-6 bg-muted/30 p-4 rounded-xl border border-border">
                   <div className="flex justify-between mb-2">
                       <label className="text-sm font-medium text-muted-foreground">{t.tools_entropy[lang]}</label>
                       <span className="font-mono font-bold">{apiKeyLen}</span>
                   </div>
                   <input type="range" min="16" max="64" step="8" value={apiKeyLen} onChange={e => setApiKeyLen(parseInt(e.target.value))} className="w-full accent-primary" />
                </div>

                <div className="relative w-full mb-8 group">
                    <div className="w-full p-4 text-center font-mono text-sm break-all border border-input rounded-xl bg-background text-foreground min-h-[4rem] flex items-center justify-center shadow-sm">
                        {apiKey || t.tools_api_placeholder[lang]}
                    </div>
                    {apiKey && (
                        <button onClick={() => handleCopy(apiKey)} className="absolute right-2 top-2 p-2 bg-muted rounded-lg text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all">
                             {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                        </button>
                    )}
                </div>

                <button onClick={() => {
                    const array = new Uint8Array(apiKeyLen);
                    crypto.getRandomValues(array);
                    setApiKey(Array.from(array).map(b => b.toString(16).padStart(2, '0')).join(''));
                }} className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
                   <RefreshCw size={20} /> {t.tools_gen_key[lang]}
                </button>
             </div>
          )}
       </div>
    </div>
  );
};

export default SecurityTools;