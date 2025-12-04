import React, { useEffect, useRef } from 'react';
import { LanguageCode } from '../types';
import { translations } from '../services/i18nService';
import { Shield, KeyRound, LayoutDashboard, Wrench, ChevronRight, Lock, Activity, Moon, Sun, Globe } from 'lucide-react';
import gsap from 'gsap';

interface Props {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  onGetStarted: () => void;
}

const LandingPage: React.FC<Props> = ({ lang, setLang, isDarkMode, setIsDarkMode, onGetStarted }) => {
  const t = translations;
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.fromTo(heroTextRef.current?.children || [],
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2 }
      );

      // Features Entrance
      gsap.fromTo(featuresRef.current?.children || [],
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.8 }
      );

      // Floating Background Elements
      gsap.to(".floating-blob", {
        y: "random(-50, 50)",
        x: "random(-50, 50)",
        duration: "random(5, 10)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: KeyRound, title: t.feat_gen[lang], desc: t.feat_gen_desc[lang], color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: Lock, title: t.feat_vault[lang], desc: t.feat_vault_desc[lang], color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: Activity, title: t.feat_analyze[lang], desc: t.feat_analyze_desc[lang], color: "text-orange-500", bg: "bg-orange-500/10" },
    { icon: Wrench, title: t.feat_tools[lang], desc: t.feat_tools_desc[lang], color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const toggleLang = () => {
    if (lang === 'en') setLang('fr');
    else if (lang === 'fr') setLang('ar');
    else setLang('en');
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-screen overflow-hidden bg-background text-foreground flex flex-col items-center justify-center">
      
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-blob absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen opacity-50"></div>
        <div className="floating-blob absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
        <div className="floating-blob absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] mix-blend-screen opacity-30"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)]"></div>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-2 md:gap-3">
        <button
          onClick={toggleLang}
          className="p-1.5 md:p-2 rounded-full bg-background/50 backdrop-blur-md border border-border/50 hover:bg-background/80 transition-colors text-muted-foreground hover:text-foreground"
          title="Switch Language"
        >
          <div className="flex items-center gap-2 px-1">
            <Globe size={18} />
            <span className="text-xs font-bold uppercase">{lang}</span>
          </div>
        </button>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-1.5 md:p-2 rounded-full bg-background/50 backdrop-blur-md border border-border/50 hover:bg-background/80 transition-colors text-muted-foreground hover:text-foreground"
          title="Toggle Theme"
        >
          {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 pt-20 pb-12 md:py-12 flex flex-col items-center">
        
        {/* Hero Section */}
        <div ref={heroTextRef} className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 backdrop-blur-md mb-4 shadow-lg">
            <Shield size={16} className="text-primary" />
            <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">XPass Security Suite</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-muted-foreground">
             {t.landing_hero[lang]}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
             {t.landing_sub[lang]}
          </p>

          <button 
            onClick={onGetStarted}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-bold shadow-2xl shadow-primary/30 overflow-hidden transition-all hover:scale-105 active:scale-95 hover:shadow-primary/50"
          >
            <span className="relative z-10">{t.landing_cta[lang]}</span>
            <ChevronRight className="relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
          </button>
        </div>

        {/* Feature Cards */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {features.map((f, i) => (
                <div key={i} className="group p-6 rounded-3xl bg-card/40 backdrop-blur-md border border-white/10 dark:border-white/5 hover:bg-card/60 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl hover:border-primary/20">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${f.bg} ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                        <f.icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
            ))}
        </div>


      </div>
    </div>
  );
};

export default LandingPage;
