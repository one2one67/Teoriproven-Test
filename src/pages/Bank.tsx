import { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { UI, QDATA } from '../data/questions';
import { ArrowLeft, ChevronDown, ChevronUp, Search, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useUser } from '../lib/AuthContext';
import { getSupabase } from '../lib/supabase';
import { checkUserAccess } from '../lib/access';

export default function Bank() {
  const { lang, catId, expiration, setExpiration } = useStore();
  const { user } = useUser();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user) {
      const checkAccess = async () => {
        try {
          const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'amjmah87@gmail.com';
          const userId = user?.primaryEmailAddress?.emailAddress || user?.id;

          if (userId === adminEmail) {
            setExpiration(new Date('2099-12-31T23:59:59Z'));
            setChecking(false);
            return;
          }

          if (userId) {
            const expDate = await checkUserAccess(userId);
            if (expDate) setExpiration(expDate);
          }
        } catch (e) {
          console.error('Error verifying active permission inside query bank:', e);
        } finally {
          setChecking(false);
        }
      };
      checkAccess();
    } else {
      setChecking(false);
    }
  }, [user, setExpiration]);

  if (!catId) {
    navigate('/');
    return null;
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-brand-dark flex justify-center items-center">
         <div className="w-8 h-8 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  const isExpired = !expiration || expiration.getTime() < new Date().getTime();

  if (isExpired) {
    return (
      <div className="min-h-[80vh] bg-brand-dark flex flex-col justify-center items-center p-6 text-center font-sans">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="font-display text-xl font-bold text-white mb-2">
          {lang === 'no' ? 'Krever aktiv lisens' : 'Active Pass Required'}
        </h2>
        <p className="text-slate-400 max-w-md text-sm mb-8 leading-relaxed">
          {lang === 'no' 
            ? 'Spørsmålsbanken er en eksklusiv læringsressurs. Vennligst lås opp tilgang fra forsiden med din produktnøkkel.' 
            : 'The Question Bank is an exclusive learning asset. Please unlock access from the dashboard with your product key.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl border border-brand-border bg-white/5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all"
        >
          {lang === 'no' ? 'Tilbake til Hovedside' : 'Back to Home'}
        </button>
      </div>
    );
  }

  const labels: Record<string, any> = {
    no: {
      title: "Spørsmålsbank",
      cnt: "spørsmål",
      pld: "Søk i spørsmål og forklaringer...",
      empty: "Ingen spørsmål funnet for",
      explanation: "Forklaring"
    },
    en: {
      title: "Question Bank",
      cnt: "questions",
      pld: "Search in questions and explanations...",
      empty: "No questions found for",
      explanation: "Explanation"
    },
    ar: {
      title: "بنك الأسئلة",
      cnt: "سؤالاً",
      pld: "ابحث في الأسئلة والشروحات...",
      empty: "لم يتم العثور على أسئلة لـ",
      explanation: "الشرح والتوضيح"
    },
    pl: {
      title: "Bank Pytań",
      cnt: "pytań",
      pld: "Szukaj w pytaniach i wyjaśnieniach...",
      empty: "Nie znaleziono pytań dla",
      explanation: "Wyjaśnienie"
    }
  };

  const t = labels[lang] || labels['no'];
  const ui = UI[lang] || UI['no'];
  const qs = QDATA[catId].q;
  
  // Flatten and prepare questions with index
  const list = qs.map((q, i) => {
    const data = q[lang] || q['no'] || {};
    return { ...data, gi: i, original: q };
  }).filter(q => {
    if (!query) return true;
    const search = query.toLowerCase();
    const questionText = q.q || '';
    const explanationText = q.e || '';
    return questionText.toLowerCase().includes(search) || 
           explanationText.toLowerCase().includes(search);
  });

  return (
    <div className="flex flex-col h-full bg-brand-dark fixed inset-0 z-50">
      {/* Topbar */}
      <div className="flex items-center gap-2 p-3 px-4 bg-brand-dark-2 border-b border-brand-border shrink-0 z-20">
        <button 
          className="flex items-center justify-center w-8 h-8 rounded-lg border-[1.5px] border-transparent hover:border-brand-border bg-transparent text-slate-400 hover:text-white transition-all shrink-0 cursor-pointer"
          onClick={() => navigate('/teori')}
        >
          <ArrowLeft className="w-5 h-5 rtl:scale-x-[-1]" />
        </button>
        <div className="flex-1 font-display text-sm sm:text-base font-bold text-white truncate rtl:text-right">
          {t.title} // {list.length} {t.cnt}
        </div>
      </div>

      <div className="p-3 sm:p-4 shrink-0 bg-brand-dark-2 border-b border-brand-border">
        <div className="relative">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input 
            type="text" 
            placeholder={t.pld} 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-brand-dark border-[1.5px] border-brand-border rounded-xl pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 text-sm font-sans text-white outline-none focus:border-brand-blue transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {list.map((q, idx) => {
          const isOpen = openId === q.gi;
          return (
            <div key={q.gi} className="bg-brand-dark-2 border border-brand-border rounded-xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setOpenId(isOpen ? null : q.gi)}
                className="w-full text-left rtl:text-right p-4 flex items-start gap-3 hover:bg-white/5 transition-colors focus:outline-none"
              >
                <div className="text-brand-blue font-mono text-xs sm:text-sm mt-0.5 shrink-0">{q.gi + 1}.</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-xs sm:text-sm font-semibold text-white leading-snug">{q.q}</div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{q.t}</div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-brand-border/50"
                  >
                    <div className="p-4 pb-5 pl-12 rtl:pl-4 rtl:pr-12">
                      <div className="space-y-2 mb-4">
                        {q.o.map((opt: string, optIdx: number) => {
                          const isCorrect = q.c === optIdx;
                          return (
                            <div key={optIdx} className={cn(
                              "text-xs sm:text-sm p-3 rounded-lg border leading-relaxed",
                              isCorrect 
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-100 font-medium" 
                                : "bg-brand-dark border-brand-border/50 text-slate-400"
                            )}>
                              {opt}
                            </div>
                          );
                        })}
                      </div>
                      
                      {q.e && (
                        <div className="bg-[#1a2235] border border-brand-blue/30 rounded-lg p-3.5">
                          <div className="text-[10px] sm:text-[11px] font-bold text-brand-blue uppercase tracking-wider mb-1.5 flex items-center gap-1.5 rtl:justify-start">
                            <Search className="w-3.5 h-3.5 shrink-0" /> {t.explanation}
                          </div>
                          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                            {q.e}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {list.length === 0 && (
          <div className="text-center p-8 text-slate-400 text-sm">
            {t.empty} "{query}"
          </div>
        )}
      </div>
    </div>
  );
}

