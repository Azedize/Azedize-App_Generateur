export type LanguageCode = 'en' | 'ar' | 'fr';

export interface Translation {
  [key: string]: {
    en: string;
    ar: string;
    fr: string;
  };
}

export type EntryType = 'login' | 'note' | 'card';

export interface PasswordEntry {
  id: string;
  type: EntryType;
  title: string;
  username?: string;
  password?: string;
  website?: string;
  note?: string; // For Secure Notes
  category: 'social' | 'work' | 'finance' | 'personal' | 'other';
  createdAt: number;
  updatedAt: number;
  strengthScore: number; // 0-4
}

export interface VaultState {
  isLocked: boolean;
  masterHash: string | null; // Storing a hash to verify unlock
  masterPassword?: string | null; // Temporarily store decrypted key for session operations
  entries: PasswordEntry[];
}

export type ViewType = 'landing' | 'generator' | 'vault' | 'analyzer' | 'tools' | 'advisor' | 'audit' | 'settings';

export interface AuditStats {
  total: number;
  weak: number;
  reused: number;
  old: number;
}