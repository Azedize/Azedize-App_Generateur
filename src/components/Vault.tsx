import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Lock, Unlock, Plus, Trash2, Eye, EyeOff, Globe, Copy, Search, Key, StickyNote, CreditCard, ChevronRight, MoreHorizontal, AlertTriangle, RefreshCcw } from 'lucide-react';
import { translations } from '../services/i18nService';
import { PasswordEntry, LanguageCode, VaultState, EntryType } from '../types';
import { decryptData, encryptData, hashPassword } from '../services/cryptoService';
import gsap from 'gsap';

interface Props {
  lang: LanguageCode;
  vaultState: VaultState;
  setVaultState: React.Dispatch<React.SetStateAction<VaultState>>;
}

const STORAGE_KEY = 'xpass_vault_data';
const MASTER_HASH_KEY = 'xpass_master_hash';

const Vault: React.FC<Props> = ({ lang, vaultState, setVaultState }) => {
  const t = translations;
  const [masterInput, setMasterInput] = useState('');
  const [setupMode, setSetupMode] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [showPwd, setShowPwd] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'login' | 'note'>('all');
  
  // New Entry Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<PasswordEntry>>({ type: 'login', category: 'personal', strengthScore: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if vault exists on mount
    const storedData = localStorage.getItem(STORAGE_KEY);
    const storedHash = localStorage.getItem(MASTER_HASH_KEY);

    if (!storedData || !storedHash) {
      setSetupMode(true);
    } else {
        setVaultState(prev => ({...prev, masterHash: storedHash}));
    }
  }, [setVaultState]);

  useEffect(() => {
      // Animate list items when they change or filter changes
      if (listRef.current && !vaultState.isLocked && !isAdding) {
          gsap.fromTo(listRef.current.children, 
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, stagger: 0.05, duration: 0.3, ease: "power2.out", clearProps: "all" }
          );
      }
  }, [filterTab, search, vaultState.entries.length, vaultState.isLocked, isAdding]);

  // Helper to encrypt and save current entries to LocalStorage
  const syncToStorage = async (entries: PasswordEntry[], password: string) => {
    try {
        const encrypted = await encryptData(JSON.stringify(entries), password);
        localStorage.setItem(STORAGE_KEY, encrypted);
        return true;
    } catch (e) {
        console.error("Failed to sync to storage", e);
        toast.error(t.vault_error_save[lang]);
        return false;
    }
  };

  const handleCreateVault = async () => {
    if (masterInput.length < 4) return toast.error(t.vault_error_min_len[lang]);
    const hash = await hashPassword(masterInput);
    const emptyEntries: PasswordEntry[] = [];
    
    // Initial Save
    const encrypted = await encryptData(JSON.stringify(emptyEntries), masterInput);
    localStorage.setItem(STORAGE_KEY, encrypted);
    localStorage.setItem(MASTER_HASH_KEY, hash);
    
    setVaultState({ isLocked: false, masterHash: hash, masterPassword: masterInput, entries: emptyEntries });
    setSetupMode(false);
    setMasterInput('');
  };

  const handleUnlock = async () => {
    const hash = await hashPassword(masterInput);
    if (hash === vaultState.masterHash) {
       const encrypted = localStorage.getItem(STORAGE_KEY);
       if(encrypted) {
           const decryptedJson = await decryptData(encrypted, masterInput);
           if(decryptedJson) {
               setVaultState({ 
                   isLocked: false, 
                   masterHash: hash, 
                   masterPassword: masterInput, // Keep session key
                   entries: JSON.parse(decryptedJson) 
               });
               setMasterInput('');
           } else {
               toast.error(t.vault_error_decrypt[lang]);
           }
       }
    } else {
        toast.error(t.vault_error_password[lang]);
        // Shake animation for error could go here
    }
  };

  const handleResetVault = () => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(MASTER_HASH_KEY);
      setVaultState({ isLocked: true, masterHash: null, masterPassword: null, entries: [] });
      setSetupMode(true);
      setResetMode(false);
      setMasterInput('');
  };

  const saveEntry = async () => {
      if(!newEntry.title) return;
      if(!vaultState.masterPassword) {
          toast.error(t.vault_error_session[lang]);
          setVaultState(prev => ({...prev, isLocked: true}));
          return;
      }

      const entry: PasswordEntry = {
          id: crypto.randomUUID(),
          type: (newEntry.type as EntryType) || 'login',
          title: newEntry.title!,
          username: newEntry.username || '',
          password: newEntry.password || '',
          note: newEntry.note || '',
          website: newEntry.website || '',
          category: newEntry.category as any || 'other',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          strengthScore: 3 
      };
      
      const updatedEntries = [...vaultState.entries, entry];
      
      // Persist to storage immediately
      const saved = await syncToStorage(updatedEntries, vaultState.masterPassword);
      
      if (saved) {
        setVaultState(prev => ({ ...prev, entries: updatedEntries }));
        setIsAdding(false);
        setNewEntry({ type: 'login', category: 'personal' });
        toast.success(t.lbl_save[lang] || 'Entry saved successfully');
      }
  };

  const deleteEntry = async (id: string) => {
      if(!vaultState.masterPassword) return;
      
      // Custom confirmation dialog would be better, but sticking to logic replacement for now
      // Or use sonner's promise/custom toast for confirmation. 
      // For now, let's keep window.confirm or replace with a toast action if desired.
      // The user specifically asked about "password that is not acceptable", which usually refers to unlock/create.
      // But let's replace confirm with a toast action for better UX? 
      // Actually, let's stick to the user request "password that is not acceptable". 
      // But I should replace all alerts.
      
      if(window.confirm(t.vault_confirm_delete[lang])) {
          const updatedEntries = vaultState.entries.filter(e => e.id !== id);
          const saved = await syncToStorage(updatedEntries, vaultState.masterPassword);
          if (saved) {
              setVaultState(prev => ({ ...prev, entries: updatedEntries }));
              toast.success('Entry deleted');
          }
      }
  };

  const filteredEntries = vaultState.entries.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                            e.username?.toLowerCase().includes(search.toLowerCase());
      const matchesTab = filterTab === 'all' ? true : e.type === filterTab;
      return matchesSearch && matchesTab;
  });

  // Locked or Setup Views
  if (setupMode || vaultState.isLocked) {
      return (
          <div className="flex items-center justify-center h-full p-4">
              <div ref={containerRef} className="bg-card text-card-foreground p-8 md:p-12 rounded-3xl shadow-2xl border border-border max-w-md w-full text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                  
                  {resetMode ? (
                      <div className="animate-in fade-in zoom-in-95 duration-300">
                          <div className="bg-destructive/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                             <AlertTriangle size={40} className="text-destructive" />
                          </div>
                          <h2 className="text-2xl font-bold mb-3 tracking-tight text-destructive">{t.vault_reset_title[lang]}</h2>
                          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                            <span className="font-bold text-foreground">{t.vault_warning[lang]}</span> {t.vault_reset_desc[lang]}
                          </p>
                          <div className="flex flex-col gap-3">
                              <button 
                                onClick={handleResetVault} 
                                className="w-full bg-destructive text-destructive-foreground py-3 rounded-xl font-bold hover:bg-destructive/90 transition-all shadow-lg shadow-destructive/20"
                              >
                                  {t.vault_reset_confirm[lang]}
                              </button>
                              <button 
                                onClick={() => setResetMode(false)} 
                                className="w-full bg-secondary text-secondary-foreground py-3 rounded-xl font-bold hover:bg-secondary/80 transition-all"
                              >
                                  {t.lbl_cancel[lang]}
                              </button>
                          </div>
                      </div>
                  ) : (
                      <div className="animate-in fade-in duration-300">
                          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                             <Lock size={40} className="text-primary" strokeWidth={1.5} />
                          </div>
                          <h2 className="text-3xl font-bold mb-3 tracking-tight">{setupMode ? t.vault_setup_title[lang] : t.vault_locked_title[lang]}</h2>
                          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                            {setupMode ? t.vault_setup_desc[lang] : t.vault_locked_desc[lang]}
                          </p>
                          
                          <div className="space-y-4">
                              <input 
                                type="password" 
                                className="w-full bg-background border border-input focus:ring-2 focus:ring-ring p-3.5 rounded-xl transition-all outline-none text-center tracking-widest text-lg" 
                                placeholder="••••••••" 
                                value={masterInput}
                                onChange={e => setMasterInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (setupMode ? handleCreateVault() : handleUnlock())}
                                autoFocus
                              />
                              <button 
                                onClick={setupMode ? handleCreateVault : handleUnlock} 
                                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                              >
                                  {setupMode ? <Key size={18} /> : <Unlock size={18} />}
                                  {setupMode ? t.vault_create[lang] : t.vault_unlock[lang]}
                              </button>
                              
                              {!setupMode && (
                                  <button onClick={() => setResetMode(true)} className="text-xs text-muted-foreground hover:text-destructive transition-colors mt-4 underline underline-offset-4">
                                      {t.vault_forgot_pass[lang]}
                                  </button>
                              )}
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto h-full flex flex-col">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 flex-shrink-0">
            <div>
               <h2 className="text-3xl font-bold tracking-tight mb-1">{t.vault_title[lang]}</h2>
               <p className="text-muted-foreground text-sm">{t.vault_subtitle[lang]}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
               <div className="flex bg-muted p-1 rounded-lg">
                  {(['all', 'login', 'note'] as const).map(tab => (
                      <button key={tab} onClick={() => setFilterTab(tab)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterTab === tab ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                        {tab === 'all' ? t.vault_tab_all[lang] : tab === 'login' ? t.vault_tab_logins[lang] : t.vault_tab_notes[lang]}
                      </button>
                  ))}
               </div>
               
               <div className="flex gap-2">
                   <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-1 focus:ring-ring focus:outline-none text-sm"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                   </div>
                   <button 
                        onClick={() => setIsAdding(true)}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:bg-primary/90 shadow-sm whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span className="text-sm font-bold">{t.vault_add[lang]}</span>
                    </button>
               </div>
            </div>
        </div>

        {/* Add Entry Modal/Form */}
        {isAdding && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-card text-card-foreground w-full max-w-lg p-6 rounded-2xl shadow-2xl border border-border animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="text-xl font-bold">{t.vault_add[lang]}</h3>
                       <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground"><Trash2 size={20} className="hidden" /><XIcon /></button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <TypeButton active={newEntry.type === 'login'} onClick={() => setNewEntry({...newEntry, type: 'login'})} icon={Lock} label={t.vault_type_login[lang]} />
                        <TypeButton active={newEntry.type === 'note'} onClick={() => setNewEntry({...newEntry, type: 'note'})} icon={StickyNote} label={t.vault_type_note[lang]} />
                    </div>

                    <div className="space-y-4">
                        <InputGroup label={t.lbl_title[lang]} value={newEntry.title} onChange={v => setNewEntry({...newEntry, title: v})} autoFocus />
                        
                        {newEntry.type === 'login' && (
                            <>
                                <InputGroup label={t.vault_lbl_username[lang]} value={newEntry.username} onChange={v => setNewEntry({...newEntry, username: v})} />
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">{t.vault_lbl_password[lang]}</label>
                                    <div className="relative">
                                        <input type="text" className="w-full bg-background border border-input rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-ring outline-none" value={newEntry.password || ''} onChange={e => setNewEntry({...newEntry, password: e.target.value})} />
                                        <button className="absolute right-2 top-2 text-muted-foreground hover:text-primary"><RefreshButton onClick={() => setNewEntry({...newEntry, password: Math.random().toString(36).slice(-8)})} /></button>
                                    </div>
                                </div>
                                <InputGroup label={t.vault_lbl_website[lang]} value={newEntry.website} onChange={v => setNewEntry({...newEntry, website: v})} />
                            </>
                        )}
                        
                        {newEntry.type === 'note' && (
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground uppercase">{t.lbl_note[lang]}</label>
                                <textarea className="w-full bg-background border border-input rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-ring outline-none min-h-[100px]" value={newEntry.note || ''} onChange={e => setNewEntry({...newEntry, note: e.target.value})}></textarea>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground uppercase">{t.lbl_category[lang]}</label>
                            <select className="w-full bg-background border border-input rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-ring outline-none" value={newEntry.category} onChange={e => setNewEntry({...newEntry, category: e.target.value as any})}>
                                <option value="personal">{t.vault_cat_personal[lang]}</option>
                                <option value="work">{t.vault_cat_work[lang]}</option>
                                <option value="finance">{t.vault_cat_finance[lang]}</option>
                                <option value="social">{t.vault_cat_social[lang]}</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button onClick={() => setIsAdding(false)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">{t.lbl_cancel[lang]}</button>
                        <button onClick={saveEntry} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">{t.lbl_save[lang]}</button>
                    </div>
                </div>
            </div>
        )}

        {/* Entries List */}
        <div className="flex-grow overflow-y-auto pr-2 pb-20 custom-scrollbar">
            {filteredEntries.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-2xl bg-muted/20">
                    <div className="bg-muted p-4 rounded-full mb-4">
                        <Lock size={32} className="text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium text-foreground">{t.vault_empty[lang]}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t.vault_empty_desc[lang]}</p>
                </div>
            ) : (
                <div ref={listRef} className="space-y-3">
                    {filteredEntries.map(entry => (
                        <div key={entry.id} className="group bg-card text-card-foreground p-4 rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex items-center justify-between">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    entry.type === 'note' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                    {entry.type === 'note' ? <StickyNote size={20} /> : <Globe size={20} />}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-base truncate">{entry.title}</h4>
                                    <p className="text-xs text-muted-foreground truncate">{entry.type === 'login' ? entry.username : t.vault_secure_note[lang]}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {entry.type === 'login' && (
                                    <>
                                        <div className="relative w-32 hidden md:block">
                                            <input 
                                                type={showPwd[entry.id] ? "text" : "password"} 
                                                readOnly 
                                                value={entry.password} 
                                                className="w-full bg-muted/50 border-none rounded px-2 py-1 text-xs text-muted-foreground"
                                            />
                                        </div>
                                        <ActionButton onClick={() => setShowPwd(p => ({...p, [entry.id]: !p[entry.id]}))} icon={showPwd[entry.id] ? EyeOff : Eye} />
                                        <ActionButton onClick={() => { navigator.clipboard.writeText(entry.password || ''); toast.success(t.vault_copy_pass[lang]); }} icon={Copy} tooltip={t.vault_copy_pass[lang]} />
                                    </>
                                )}
                                {entry.type === 'note' && (
                                    <ActionButton onClick={() => { navigator.clipboard.writeText(entry.note || ''); toast.success(t.vault_copy_note[lang]); }} icon={Copy} tooltip={t.vault_copy_note[lang]} />
                                )}
                                <div className="w-px h-6 bg-border mx-1"></div>
                                <ActionButton onClick={() => deleteEntry(entry.id)} icon={Trash2} variant="danger" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

// UI Components
const InputGroup = ({ label, value, onChange, autoFocus }: any) => (
    <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase">{label}</label>
        <input 
            type="text" 
            className="w-full bg-background border border-input rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-ring outline-none transition-all" 
            value={value || ''} 
            onChange={e => onChange(e.target.value)}
            autoFocus={autoFocus}
        />
    </div>
);

const TypeButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${active ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border hover:bg-muted'}`}>
        <Icon size={24} className="mb-2" />
        <span className="text-xs font-bold">{label}</span>
    </button>
);

const ActionButton = ({ onClick, icon: Icon, variant, tooltip }: any) => (
    <button 
        onClick={onClick} 
        title={tooltip}
        className={`p-2 rounded-lg transition-colors ${
            variant === 'danger' 
            ? 'text-destructive/70 hover:text-destructive hover:bg-destructive/10' 
            : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
        }`}
    >
        <Icon size={16} />
    </button>
);

const RefreshButton = ({ onClick }: any) => (
    <div onClick={onClick} className="cursor-pointer">
       <RefreshCcw size={16} />
    </div>
)

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
)

export default Vault;