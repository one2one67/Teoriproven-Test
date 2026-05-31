import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, CategoryId } from '../data/questions';

interface MainState {
  lang: Language;
  setLang: (l: Language) => void;
  catId: CategoryId | null;
  setCatId: (id: CategoryId | null) => void;
  mastered: Set<string>;
  toggleMastered: (id: string) => void;
  clearMastered: () => void;
  hist: any[];
  addHist: (h: any) => void;
  streak: number;
  updateStreak: () => void;
  expiration: Date | null;
  setExpiration: (d: Date | null) => void;
}

const StoreContext = createContext<MainState | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const l = localStorage.getItem('tov3_lang');
      if (l && (l === 'no' || l === 'en' || l === 'ar' || l === 'pl')) {
        return l as Language;
      }
    } catch {}
    return 'no';
  });
  const [catId, setCatId] = useState<CategoryId | null>(null);
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [hist, setHist] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [expiration, setExpiration] = useState<Date | null>(null);

  useEffect(() => {
    try {
      const m = localStorage.getItem('tov3_m');
      if (m) setMastered(new Set(JSON.parse(m)));
      const h = localStorage.getItem('tov3_h');
      if (h) setHist(JSON.parse(h));
      const s = localStorage.getItem('tov3_str');
      if (s) {
        const { n, d } = JSON.parse(s);
        const td = new Date().toDateString();
        const yd = new Date(Date.now() - 86400000).toDateString();
        setStreak((d === td || d === yd) ? n : 0);
      }
    } catch {}
  }, []);

  const save = (k: string, v: string) => {
    try { localStorage.setItem(k, v); } catch {}
  };

  const setLang = (l: Language) => {
    setLangState(l);
    save('tov3_lang', l);
  };

  const toggleMastered = (id: string) => {
    setMastered(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      save('tov3_m', JSON.stringify([...next]));
      return next;
    });
  };

  const clearMastered = () => {
    setMastered(new Set());
    save('tov3_m', JSON.stringify([]));
  };

  const addHist = (h: any) => {
    setHist(prev => {
      const next = [...prev, h].slice(-100);
      save('tov3_h', JSON.stringify(next));
      return next;
    });
  };

  const updateStreak = () => {
    const td = new Date().toDateString();
    let d = '', n = 0;
    try {
      const s = localStorage.getItem('tov3_str');
      if (s) {
        const p = JSON.parse(s);
        d = p.d; n = p.n;
      }
    } catch {}
    if (d === td) return;
    const yd = new Date(Date.now() - 86400000).toDateString();
    n = (d === yd) ? n + 1 : 1;
    save('tov3_str', JSON.stringify({ d: td, n }));
    setStreak(n);
  };

  return (
    <StoreContext.Provider value={{ lang, setLang, catId, setCatId, mastered, toggleMastered, clearMastered, hist, addHist, streak, updateStreak, expiration, setExpiration }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
