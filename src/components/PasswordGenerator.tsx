import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Copy, RefreshCw, CheckCircle, Dice5, FileText, Hash, ShieldCheck, Settings2, Sparkles } from 'lucide-react';
import { translations } from '../services/i18nService';
import { LanguageCode } from '../types';
import gsap from 'gsap';

interface Props {
  lang: LanguageCode;
}

const WORD_LIST = [
  "apple", "brave", "crisp", "delta", "eagle", "focus", "giant", "house", "input", "jolly",
  "kite", "lemon", "mango", "noble", "ocean", "piano", "queen", "river", "solar", "tiger",
  "unity", "vivid", "whale", "xenon", "yacht", "zebra", "alarm", "bread", "cloud", "dream",
  "earth", "flame", "grape", "heart", "image", "juice", "knock", "light", "money", "night",
  "olive", "paper", "quiet", "radio", "snake", "train", "urban", "voice", "water", "youth",
  "amber", "bliss", "coral", "dusk", "ember", "frost", "glory", "hazel", "ivory", "jade",
  "karma", "lunar", "mist", "nova", "orbit", "pearl", "quest", "ruby", "spark", "topaz"
];

type GenMode = 'random' | 'phrase' | 'pin';

const PasswordGenerator: React.FC<Props> = ({ lang }) => {
  const t = translations;
  const [mode, setMode] = useState<GenMode>('random');
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  // Random Mode State
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeAmbiguous, setIncludeAmbiguous] = useState(false);

  // Passphrase Mode State
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalize, setCapitalize] = useState(true);
  const [phraseNumber, setPhraseNumber] = useState(false);

  // PIN Mode State
  const [pinLength, setPinLength] = useState(4);

  const passwordRef = useRef<HTMLDivElement>(null);
  const strengthBarRef = useRef<HTMLDivElement>(null);

  const generatePassword = useCallback(() => {
    let newPassword = '';
    if (mode === 'random') {
      let charset = '';
      if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (includeNumbers) charset += '0123456789';
      if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      if (includeAmbiguous) charset += '0O1lI|{}[];:\'"\\<>,.?/~`';
      
      if (charset === '') charset = 'abcdefghijklmnopqrstuvwxyz'; 

      const array = new Uint32Array(length);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        newPassword += charset[array[i] % charset.length];
      }
    } 
    else if (mode === 'phrase') {
      const words = [];
      const array = new Uint32Array(wordCount);
      window.crypto.getRandomValues(array);
      
      for(let i=0; i<wordCount; i++) {
        let w = WORD_LIST[array[i] % WORD_LIST.length];
        if (capitalize) w = w.charAt(0).toUpperCase() + w.slice(1);
        words.push(w);
      }
      if (phraseNumber) {
         const num = Math.floor(Math.random() * 1000);
         const pos = Math.floor(Math.random() * words.length);
         words[pos] = words[pos] + num;
      }
      newPassword = words.join(separator);
    }
    else if (mode === 'pin') {
      const numbers = '0123456789';
      const array = new Uint32Array(pinLength);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < pinLength; i++) {
        newPassword += numbers[array[i] % numbers.length];
      }
    }

    setPassword(newPassword);

    if (passwordRef.current) {
      gsap.fromTo(passwordRef.current, { scale: 0.98, opacity: 0.8 }, { scale: 1, opacity: 1, duration: 0.2, ease: "power1.out" });
    }
  }, [mode, length, includeUpper, includeLower, includeNumbers, includeSymbols, includeAmbiguous, wordCount, separator, capitalize, phraseNumber, pinLength]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthPercentage = () => {
    if (mode === 'pin') return Math.min(100, (pinLength / 8) * 100);
    if (mode === 'phrase') return Math.min(100, (wordCount / 6) * 100);
    
    let bonus = 0;
    if (includeAmbiguous) bonus += 20;
    return Math.min(100, (length / 20) * 100 + bonus);
  };

  const getStrengthColor = () => {
    const p = getStrengthPercentage();
    if (p < 40) return 'bg-destructive shadow-[0_0_15px_rgba(239,68,68,0.4)]';
    if (p < 70) return 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]';
    return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]';
  };

  useEffect(() => {
    if (strengthBarRef.current) {
        gsap.to(strengthBarRef.current, { width: `${getStrengthPercentage()}%`, duration: 0.5, ease: "power2.out" });
    }
  }, [length, wordCount, pinLength, includeAmbiguous, mode]);

  const getModeLabel = (m: GenMode) => {
      switch(m) {
        case 'random': return t.gen_mode_random[lang];
        case 'phrase': return t.gen_mode_phrase[lang];
        case 'pin': return t.gen_mode_pin[lang];
      }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Section */}
      <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2">
             <ShieldCheck size={32} className="text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
             {t.gen_title[lang]}
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
             {t.gen_subtitle[lang]}
          </p>
      </div>

      <div className="bg-card text-card-foreground rounded-[2rem] shadow-2xl border border-border/50 overflow-hidden backdrop-blur-sm">
        
        {/* Password Display Area */}
        <div className="bg-muted/30 p-8 md:p-12 relative border-b border-border/50 flex flex-col items-center justify-center min-h-[200px]">
            <div 
                ref={passwordRef}
                className="font-mono text-3xl md:text-5xl font-bold text-center break-all leading-tight max-w-full z-10 drop-shadow-sm selection:bg-primary selection:text-primary-foreground"
            >
                {password}
            </div>
            
            <button 
                onClick={copyToClipboard}
                className="mt-8 flex items-center gap-2 px-6 py-2.5 bg-background border border-border rounded-full hover:border-primary hover:text-primary transition-all shadow-sm group"
            >
                {copied ? <CheckCircle size={18} className="text-emerald-500" /> : <Copy size={18} className="text-muted-foreground group-hover:text-primary" />}
                <span className="text-sm font-semibold">{copied ? t.gen_copied[lang] : t.gen_copy[lang]}</span>
            </button>

            {/* Strength Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-muted/50">
                 <div ref={strengthBarRef} className={`h-full transition-colors duration-300 ${getStrengthColor()}`}></div>
            </div>
        </div>

        {/* Configuration Area */}
        <div className="p-6 md:p-8 space-y-8">
            
            {/* Mode Selector (Radio Buttons Style) */}
            <div className="bg-muted/50 p-1.5 rounded-2xl grid grid-cols-3 gap-1">
                 {(['random', 'phrase', 'pin'] as GenMode[]).map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`
                           relative flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-bold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary
                           ${mode === m 
                              ? 'bg-background text-primary shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] ring-1 ring-border' 
                              : 'text-muted-foreground hover:bg-background/40 hover:text-foreground'
                           }
                        `}
                    >
                        {m === 'random' && <Dice5 size={20} className={mode === m ? 'animate-pulse' : ''} />}
                        {m === 'phrase' && <FileText size={20} />}
                        {m === 'pin' && <Hash size={20} />}
                        <span>{getModeLabel(m)}</span>
                    </button>
                 ))}
            </div>

            {/* Dynamic Controls */}
            <div className="bg-background border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
                
                {/* Random Controls */}
                {mode === 'random' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Length Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Settings2 size={16} /> {t.gen_length[lang]}
                                </label>
                                <span className="text-2xl font-mono font-bold text-primary">{length}</span>
                            </div>
                            <input 
                                type="range" 
                                min="6" max="64" 
                                value={length} 
                                onChange={(e) => setLength(parseInt(e.target.value))}
                                className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                            />
                        </div>

                        {/* Checkboxes Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <OptionToggle label={t.gen_uppercase[lang]} checked={includeUpper} onChange={setIncludeUpper} sample="ABC" />
                            <OptionToggle label={t.gen_lowercase[lang]} checked={includeLower} onChange={setIncludeLower} sample="abc" />
                            <OptionToggle label={t.gen_numbers[lang]} checked={includeNumbers} onChange={setIncludeNumbers} sample="123" />
                            <OptionToggle label={t.gen_symbols[lang]} checked={includeSymbols} onChange={setIncludeSymbols} sample="!@#" />
                            
                            <div className="sm:col-span-2">
                                <OptionToggle 
                                    label={t.gen_ambiguous[lang]} 
                                    checked={includeAmbiguous} 
                                    onChange={setIncludeAmbiguous} 
                                    sample="{ } [ ] / \ '"
                                    warning 
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Phrase Controls */}
                {mode === 'phrase' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    {t.gen_words[lang]}
                                </label>
                                <span className="text-2xl font-mono font-bold text-primary">{wordCount}</span>
                            </div>
                            <input 
                                type="range" 
                                min="3" max="10" 
                                value={wordCount} 
                                onChange={(e) => setWordCount(parseInt(e.target.value))}
                                className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground">{t.gen_separator[lang]}</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['-', '.', '_', ' '].map(sep => (
                                        <button
                                            key={sep}
                                            onClick={() => setSeparator(sep)}
                                            className={`h-10 rounded-lg border font-mono text-lg flex items-center justify-center transition-all ${separator === sep ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input hover:bg-muted'}`}
                                        >
                                            {sep === ' ' ? t.gen_space[lang] : sep}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <OptionToggle label={t.gen_capitalize[lang]} checked={capitalize} onChange={setCapitalize} sample="Word" />
                                <OptionToggle label={t.gen_include_num[lang]} checked={phraseNumber} onChange={setPhraseNumber} sample="Word1" />
                            </div>
                        </div>
                    </div>
                )}

                {/* PIN Controls */}
                {mode === 'pin' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    {t.gen_length[lang]}
                                </label>
                                <span className="text-2xl font-mono font-bold text-primary">{pinLength}</span>
                            </div>
                            <input 
                                type="range" 
                                min="4" max="12" 
                                value={pinLength} 
                                onChange={(e) => setPinLength(parseInt(e.target.value))}
                                className="w-full h-3 bg-mutsed rounded-full appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Generate Button */}
            <button 
                onClick={generatePassword}
                className="w-full py-5 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 group"
            >
                <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-700" />
                <span>{t.gen_generate[lang]}</span>
            </button>
        </div>
      </div>
    </div>
  );
};

const OptionToggle = ({ label, checked, onChange, sample, warning }: { label: string, checked: boolean, onChange: (v: boolean) => void, sample?: string, warning?: boolean }) => (
    <label 
        className={`
            flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group
            ${checked 
                ? 'bg-primary/5 border-primary shadow-sm' 
                : 'bg-background border-muted hover:border-muted-foreground/30 hover:bg-muted/30'
            }
            ${warning && checked ? 'bg-orange-500/10 border-orange-500' : ''}
        `}
    >
        <div className="flex items-center gap-3">
            <div className={`
                w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200
                ${checked 
                    ? (warning ? 'bg-orange-500 text-white' : 'bg-primary text-primary-foreground') 
                    : 'bg-muted text-transparent'
                }
            `}>
                <CheckCircle size={14} fill="currentColor" className="text-white" strokeWidth={3} />
            </div>
            <span className={`font-semibold ${checked ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
        </div>
        {sample && <span className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">{sample}</span>}
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="hidden" />
    </label>
);

export default PasswordGenerator;