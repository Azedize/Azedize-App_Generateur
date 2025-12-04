import React, { useState, useEffect, useRef } from 'react';
import { Toaster } from 'sonner';
import { translations } from './services/i18nService';
import { LanguageCode, ViewType, VaultState } from './types';
import PasswordGenerator from './components/PasswordGenerator';
import StrengthAnalyzer from './components/StrengthAnalyzer';
import Vault from './components/Vault';
import AuditDashboard from './components/AuditDashboard';
import AiAdvisor from './components/AiAdvisor';
import SecurityTools from './components/SecurityTools';
import Sidebar from './components/layout/Sidebar';
import MobileHeader from './components/layout/MobileHeader';
import LandingPage from './components/LandingPage';
import gsap from 'gsap';

const App: React.FC = () => {
  const [lang, setLang] = useState<LanguageCode>('en');
  const [view, setView] = useState<ViewType>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [debug, setDebug] = useState(true);   // <-- MODE DEBUG
  
  const [vaultState, setVaultState] = useState<VaultState>({
    isLocked: true,
    masterHash: null,
    masterPassword: null,
    entries: []
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const t = translations;

  /** -------------------------
   *  LOG FUNCTION (DEBUG MODE)
   * --------------------------*/
  const log = (...msg: any[]) => {
    if (debug) console.log("[APP DEBUG]:", ...msg);
  };

  /** LANGUAGE */
  useEffect(() => {
    log("Lang changed to:", lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  /** DARK MODE */
  useEffect(() => {
    log("Dark mode updated:", isDarkMode);
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  /** VIEW TRANSITION */
  useEffect(() => {
    log("View changed:", view);
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 15, scale: 0.99 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out", clearProps: "all" }
      );
    }
  }, [view]);
  console.log("Current view:", view);

  /** SIDEBAR ANIMATION */
  useEffect(() => {
    log("Sidebar loaded");
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  /** VAULT STATE WATCHER */
  useEffect(() => {
    log("Vault state updated:", vaultState);
  }, [vaultState]);

  const handleLogout = () => {
    log("User logged out");
    setVaultState(prev => ({ ...prev, isLocked: true, masterPassword: null }));
    setView('vault');
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">

      {/* Sidebar Desktop */}
      {view !== 'landing' && (
        <aside ref={sidebarRef} className="hidden md:block w-72 h-full flex-shrink-0">
          <Sidebar 
            lang={lang}
            setLang={setLang}
            view={view}
            setView={setView}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            vaultState={vaultState}
            handleLogout={handleLogout}
          />
        </aside>
      )}

      {/* Mobile Header */}
      {view !== 'landing' && (
        <MobileHeader
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background pt-16 animate-in slide-in-from-top-10 duration-200">
          <Sidebar
            lang={lang}
            setLang={setLang}
            view={view}
            setView={setView}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            vaultState={vaultState}
            handleLogout={handleLogout}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </div>
      )}

      <Toaster position="top-center" richColors />

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto ${view !== 'landing' ? 'pt-20 md:pt-0' : ''} bg-secondary/30 relative flex flex-col`}>
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] opacity-20 pointer-events-none"></div>

        <div className="flex-1 relative z-10 mx-auto w-full" ref={contentRef}>
          {view === 'landing' && (
            <LandingPage 
              lang={lang}
              setLang={setLang}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              onGetStarted={() => setView('generator')}
            />
          )}

          {view === 'generator' && (
            <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-8 py-12">
              <PasswordGenerator lang={lang} />
            </div>
          )}

          {view === 'vault' && (
            <Vault lang={lang} vaultState={vaultState} setVaultState={setVaultState} />
          )}

          {view === 'analyzer' && (
            <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-8 py-12">
              <StrengthAnalyzer lang={lang} />
            </div>
          )}

          {view === 'tools' && (
            <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-8 py-12">
              <SecurityTools lang={lang} />
            </div>
          )}

          {view === 'audit' && (
            <AuditDashboard entries={vaultState.entries} lang={lang} />
          )}

          {view === 'advisor' && (
            <AiAdvisor lang={lang} />
          )}
        </div>

        {/* FOOTER */}
        <footer className="relative z-10 py-6 text-center text-sm text-muted-foreground/60">
          <span className="opacity-80">&copy; {new Date().getFullYear()} · {t.footer_made[lang]} </span>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary/50"
          >
            Azedsine Chentouf
          </a>
        </footer>
      </main>

      {/* DEBUG PANEL (visible si debug = true) */}
      {debug && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-green-400 p-3 rounded-md text-xs max-w-xs z-50 shadow-lg border border-green-600/40">
          <div><b>View:</b> {view}</div>
          <div><b>Lang:</b> {lang}</div>
          <div><b>Dark:</b> {isDarkMode ? "yes" : "no"}</div>
          <div><b>Vault Locked:</b> {vaultState.isLocked ? "yes" : "no"}</div>
          <div><b>Entries:</b> {vaultState.entries.length}</div>
        </div>
      )}

    </div>
  );
};

export default App;
