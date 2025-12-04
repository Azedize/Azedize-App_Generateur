import React, { useState } from 'react';
import { Shield, KeyRound, LayoutDashboard, BrainCircuit, LogOut, Wrench, Vault as VaultIcon, ChevronDown } from 'lucide-react';
import { translations } from '../../services/i18nService';
import { LanguageCode, ViewType, VaultState } from '../../types';
import ThemeToggle from '../ui/ThemeToggle';

interface SidebarProps {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  view: ViewType;
  setView: (view: ViewType) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  vaultState: VaultState;
  handleLogout: () => void;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
}

const languages = [
  { code: 'en', country: 'us', name: 'English' },
  { code: 'ar', country: 'sa', name: 'العربية' },
  { code: 'fr', country: 'fr', name: 'Français' }
];

const Sidebar: React.FC<SidebarProps> = ({
  lang,
  setLang,
  view,
  setView,
  isDarkMode,
  setIsDarkMode,
  vaultState,
  handleLogout,
  setIsMobileMenuOpen
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const t = translations;

  const navItems = [
    { id: 'generator', label: t.nav_generator[lang], icon: KeyRound },
    { id: 'analyzer', label: t.nav_analyzer[lang], icon: Shield },
    { id: 'tools', label: t.nav_tools[lang], icon: Wrench },
    { id: 'vault', label: t.nav_vault[lang], icon: VaultIcon },
    { id: 'audit', label: t.nav_audit[lang], icon: LayoutDashboard },
    { id: 'advisor', label: t.nav_advisor[lang], icon: BrainCircuit },
  ];

  return (
      <div className="flex flex-col h-full bg-card border-r border-border shadow-2xl z-20">
          <div className="p-6 flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 text-primary-foreground">
                  <Shield size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-foreground">XPass</h1>
                <p className="text-xs text-muted-foreground font-medium">{t.app_subtitle[lang]}</p>
              </div>
          </div>

          <nav className="flex-1 space-y-1.5 px-3">
              {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { 
                      setView(item.id as ViewType); 
                      if (setIsMobileMenuOpen) setIsMobileMenuOpen(false); 
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                      view === item.id 
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                      <item.icon size={18} className={view === item.id ? 'animate-pulse' : ''} />
                      <span>{item.label}</span>
                  </button>
              ))}
          </nav>

          <div className="p-4 border-t border-border mt-auto space-y-4">
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border border-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.app_appearance[lang]}</span>
                  <ThemeToggle isDark={isDarkMode} toggle={() => setIsDarkMode(!isDarkMode)} />
              </div>

              <div className="relative">
                  <button 
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="w-full flex items-center justify-between bg-background border border-input rounded-lg p-2.5 hover:bg-muted/50 transition-all outline-none focus:ring-1 focus:ring-ring"
                  >
                      <div className="flex items-center gap-3">
                          <img 
                              src={`https://flagcdn.com/w40/${languages.find(l => l.code === lang)?.country}.png`}
                              srcSet={`https://flagcdn.com/w80/${languages.find(l => l.code === lang)?.country}.png 2x`}
                              alt={lang}
                              className="w-6 h-4 object-cover rounded-[3px] shadow-sm"
                          />
                          <span className="text-sm font-medium">{languages.find(l => l.code === lang)?.name}</span>
                      </div>
                      <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isLangMenuOpen && (
                      <div className="absolute bottom-full left-0 w-full mb-2 bg-popover border border-border rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 z-50">
                          {languages.map((l) => (
                              <button
                                  key={l.code}
                                  onClick={() => {
                                      setLang(l.code as LanguageCode);
                                      setIsLangMenuOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-start ${lang === l.code ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
                              >
                                  <img 
                                      src={`https://flagcdn.com/w40/${l.country}.png`}
                                      srcSet={`https://flagcdn.com/w80/${l.country}.png 2x`}
                                      alt={l.name}
                                      className="w-6 h-4 object-cover rounded-[3px] shadow-sm flex-shrink-0"
                                  />
                                  <span className="text-sm font-medium">{l.name}</span>
                                  {lang === l.code && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>}
                              </button>
                          ))}
                      </div>
                  )}
              </div>
              
              {!vaultState.isLocked && (
                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-destructive border border-destructive/20 hover:bg-destructive/10 rounded-lg transition-colors text-sm font-medium">
                      <LogOut size={16} />
                      <span>{t.nav_logout[lang]}</span>
                  </button>
              )}
          </div>
      </div>
  );
};

export default Sidebar;
