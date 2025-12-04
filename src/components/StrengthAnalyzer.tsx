import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ShieldAlert, Shield, Check, X, Eye, EyeOff, Copy } from 'lucide-react';
import { translations } from '../services/i18nService';
import { LanguageCode } from '../types';
import { checkBreach } from '../services/breachService';
import gsap from 'gsap';

interface Props {
  lang: LanguageCode;
}

const generateSuggestion = (id: string) => {
    const uppers = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lowers = "abcdefghijkmnopqrstuvwxyz";
    const nums = "23456789"; 
    const syms = "!@#$%^&*";
    
    switch(id) {
        case 'length': return "S3c!"; // Suggest a chunk to add length
        case 'upper': return uppers[Math.floor(Math.random()*uppers.length)];
        case 'lower': return lowers[Math.floor(Math.random()*lowers.length)];
        case 'number': return nums[Math.floor(Math.random()*nums.length)];
        case 'symbol': return syms[Math.floor(Math.random()*syms.length)];
        default: return "?";
    }
}

const StrengthAnalyzer: React.FC<Props> = ({ lang }) => {
  const t = translations;
  const [input, setInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [breachCount, setBreachCount] = useState<number | null>(null);
  const [isCheckingBreach, setIsCheckingBreach] = useState(false);
  
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const meterRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate stable suggestions on mount so they don't flicker
    const newSuggestions: Record<string, string> = {};
    ['length', 'upper', 'lower', 'number', 'symbol'].forEach(id => {
        newSuggestions[id] = generateSuggestion(id);
    });
    setSuggestions(newSuggestions);
  }, []);

  const handleCopySuggestion = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Detailed criteria check
  const checks = [
    { id: 'length', valid: input.length >= 12, label: t.req_length[lang] },
    { id: 'upper', valid: /[A-Z]/.test(input), label: t.req_upper[lang] },
    { id: 'lower', valid: /[a-z]/.test(input), label: t.req_lower[lang] },
    { id: 'number', valid: /[0-9]/.test(input), label: t.req_number[lang] },
    { id: 'symbol', valid: /[^A-Za-z0-9]/.test(input), label: t.req_symbol[lang] },
  ];

  const passedChecks = checks.filter(c => c.valid).length;
  
  let strength = 0;
  if (input.length > 0) {
      if (input.length < 8) strength = 0;
      else if (passedChecks <= 2) strength = 1;
      else if (passedChecks === 3) strength = 2;
      else if (passedChecks === 4) strength = 3;
      else if (passedChecks === 5) strength = 4;
  }

  useEffect(() => {
    // Animate strength meter
    if (meterRef.current) {
        const percentage = (strength / 4) * 100;
        gsap.to(meterRef.current, { width: `${percentage}%`, duration: 0.6, ease: "elastic.out(1, 0.7)" });
    }
  }, [strength]);

  useEffect(() => {
    // Entrance animation using fromTo to avoid Strict Mode issues
    if (cardRef.current) {
        gsap.fromTo(cardRef.current, 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
        );
    }
  }, []);

  // Debounce breach check
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (input.length >= 6) {
        setIsCheckingBreach(true);
        const count = await checkBreach(input);
        setBreachCount(count);
        setIsCheckingBreach(false);
      } else {
        setBreachCount(null);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [input]);

  const getStrengthMeta = () => {
    if (!input) return { label: t.analyze_enter[lang], color: 'text-muted-foreground', bg: 'bg-muted', icon: Shield };
    switch (strength) {
      case 0: return { label: t.analyze_very_weak[lang], color: 'text-destructive', bg: 'bg-destructive', icon: ShieldAlert };
      case 1: return { label: t.analyze_weak[lang], color: 'text-orange-500', bg: 'bg-orange-500', icon: ShieldAlert };
      case 2: return { label: t.analyze_fair[lang], color: 'text-yellow-500', bg: 'bg-yellow-500', icon: Shield };
      case 3: return { label: t.analyze_good[lang], color: 'text-blue-500', bg: 'bg-blue-500', icon: ShieldCheck };
      case 4: return { label: t.analyze_strong[lang], color: 'text-emerald-500', bg: 'bg-emerald-500', icon: ShieldCheck };
      default: return { label: '', color: 'text-muted-foreground', bg: 'bg-muted', icon: Shield };
    }
  };

  const meta = getStrengthMeta();

  return (
    <div ref={cardRef} className="bg-card text-card-foreground p-8 rounded-3xl shadow-xl border border-border max-w-2xl mx-auto w-full transition-colors relative overflow-hidden">
       {/* Background accent */}
       <div className={`absolute top-0 left-0 w-full h-1.5 transition-colors duration-500 ${input ? meta.bg : 'bg-transparent'}`}></div>

       <div className="text-center mb-10">
         <h2 className="text-3xl font-bold tracking-tight mb-2">{t.analyze_title[lang]}</h2>
         <p className="text-muted-foreground text-sm">{t.analyze_subtitle[lang]}</p>
       </div>

       <div className="relative mb-8 group">
         <input 
            type={showPassword ? "text" : "password"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.analyze_placeholder[lang]}
            className="w-full py-4 pl-6 pr-14 text-xl bg-background border border-input rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono tracking-tight shadow-sm group-hover:shadow-md placeholder:text-muted-foreground/50"
         />
         <button 
           onClick={() => setShowPassword(!showPassword)}
           className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-2"
         >
           {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
         </button>
       </div>

       {input && (
         <div className="space-y-6">
           {/* Strength Meter */}
           <div className="bg-muted/50 p-6 rounded-2xl border border-border">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <meta.icon className={meta.color} size={24} />
                    <span className={`text-xl font-bold ${meta.color}`}>{meta.label}</span>
                </div>
                <span className="text-muted-foreground text-sm font-mono">{Math.round((strength/4)*100)}%</span>
             </div>
             
             <div className="w-full h-3 bg-muted rounded-full overflow-hidden relative">
               <div 
                 ref={meterRef}
                 className={`h-full absolute top-0 left-0 rounded-full transition-colors duration-500 ${meta.bg}`} 
                 style={{width: '0%'}} // Handled by GSAP
               ></div>
             </div>
           </div>
           
           {/* Breach Check Status */}
           <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 ${
             breachCount === null || isCheckingBreach ? 'bg-card border-border' :
             breachCount > 0 ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30' : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30'
           }`}>
              <div className="relative flex-shrink-0">
                 {isCheckingBreach ? (
                    <div className="w-10 h-10 rounded-full border-2 border-muted border-t-primary animate-spin"></div>
                 ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${breachCount && breachCount > 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'}`}>
                        {breachCount && breachCount > 0 ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
                    </div>
                 )}
              </div>
              <div className="flex-1 min-w-0">
                {isCheckingBreach && <p className="font-medium text-muted-foreground">{t.analyze_breach_check[lang]}</p>}
                {!isCheckingBreach && breachCount !== null && breachCount > 0 && (
                   <>
                     <p className="font-bold text-destructive truncate">{t.analyze_breached[lang]}</p>
                     <p className="text-xs text-muted-foreground truncate">{t.analyze_found_breach[lang].replace('{count}', breachCount.toLocaleString())}</p>
                   </>
                )}
                {!isCheckingBreach && breachCount === 0 && (
                  <>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 truncate">{t.analyze_safe[lang]}</p>
                      <p className="text-xs text-muted-foreground truncate">{t.analyze_no_breach[lang]}</p>
                  </>
                )}
              </div>
           </div>

           {/* Feedback Checklist */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                {checks.map((check) => (
                  <div key={check.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${check.valid ? 'bg-primary/5 border-primary/20' : 'bg-muted/20 border-transparent'}`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${check.valid ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {check.valid ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                        </div>
                        <span className={`text-sm ${check.valid ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                            {check.label}
                        </span>
                    </div>

                    {!check.valid && suggestions[check.id] && (
                        <button 
                            onClick={() => handleCopySuggestion(check.id, suggestions[check.id])}
                            className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 bg-background border border-border rounded-md text-xs font-mono text-primary hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-sm ml-2"
                            title={t.analyze_copy_sugg[lang]}
                        >
                            {copiedId === check.id ? <Check size={12} /> : <Copy size={12} />}
                            <span className="whitespace-nowrap">{suggestions[check.id]}</span>
                        </button>
                    )}
                  </div>
                ))}
           </div>
         </div>
       )}
    </div>
  );
};

export default StrengthAnalyzer;