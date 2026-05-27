import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { motion } from 'motion/react';
import { CATS, UI, CategoryId } from '../data/questions';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';
import Navbar from '../components/Navbar';

export default function Landing() {
  const { lang, setLang, setCatId } = useStore();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const handleCategoryClick = (id: CategoryId) => {
    if (isSignedIn) {
      setCatId(id);
      navigate('/teori');
    } else {
      openSignIn({ afterSignInUrl: '/teori' });
    }
  };

  useEffect(() => {
    document.body.className = lang === 'ar' ? 'rtl' : lang === 'pl' ? 'pl-font' : '';
  }, [lang]);

  const ui = UI[lang] || UI['no'];

  return (
    <div className="min-h-[100dvh] flex flex-col relative w-full overflow-y-auto" style={{ 
      background: 'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(29,111,235,0.18), transparent), radial-gradient(ellipse 55% 35% at 85% 90%, rgba(6,182,212,0.1), transparent), var(--color-brand-dark)',
      paddingBottom: '80px'
    }}>
      
      <div className="absolute top-0 right-0 z-10 flex flex-row items-center justify-end gap-1.5 p-3 px-4">
        {[
          { code: 'no', flag: '🇳🇴', label: 'Norsk' },
          { code: 'en', flag: '🇬🇧', label: 'English' },
          { code: 'ar', flag: '🇸🇦', label: 'عربي' },
          { code: 'pl', flag: '🇵🇱', label: 'Polski' }
        ].map(l => (
          <button
            key={l.code}
            onClick={() => setLang(l.code as any)}
            title={l.label}
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-lg border-[1.5px] border-brand-border bg-white/5 text-lg cursor-pointer transition-all p-0 overflow-hidden relative",
              lang === l.code ? "border-brand-blue bg-brand-blue/15 shadow-[0_0_0_2px_rgba(29,111,235,0.3)]" : "hover:border-[#253347] hover:bg-white/10"
            )}
          >
            {l.flag}
          </button>
        ))}
      </div>

      <div className="w-full text-center pt-16 pb-6 px-5 bg-gradient-to-b from-brand-blue/5 to-transparent border-b border-brand-border relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-[3px] bg-gradient-to-r from-brand-blue to-cyan-500 rounded-sm"></div>
        <div className="inline-flex items-center gap-1.5 bg-brand-blue text-white font-display text-[9px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded mb-2.5 before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:bg-white before:rounded-full before:opacity-70">
          {ui.badge}
        </div>
        <div className="font-display text-[clamp(26px,6vw,38px)] font-extrabold bg-gradient-to-br from-white via-white/80 to-[#7eb8f7] bg-clip-text text-transparent tracking-[-1.5px] mb-1">
          teorigo<span className="bg-gradient-to-br from-[#4d8ef5] to-cyan-500 bg-clip-text text-transparent">.no</span>
        </div>
        <div className="text-[13px] text-slate-400 max-w-[280px] mx-auto">
          {ui.tagline}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-[480px] px-4 pt-4 mx-auto">
        {CATS.map((cat, i) => {
          const cd = (cat as any)[lang] || (cat as any)['no'];
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              onClick={() => handleCategoryClick(cat.id as CategoryId)}
              className="bg-brand-dark-2 border-[1.5px] border-brand-border border-t-[3px] rounded-2xl pb-3.5 cursor-pointer overflow-hidden relative transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 active:scale-[0.97]"
              style={{ borderTopColor: cat.color }}
            >
              <div 
                className="h-[72px] flex items-center justify-center text-[38px] mb-2.5 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(29,111,235,0.15), transparent)' }}
              >
                {cat.icon}
                <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${cat.color} 50%, transparent)` }}></div>
              </div>
              <div className="px-3">
                <div className="font-display text-[13px] font-bold text-white mb-0.5 leading-[1.2]">{cd.name}</div>
                <div className="text-[10px] text-slate-400 leading-[1.3] mb-2">{cd.sub}</div>
              </div>
              <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full opacity-35" style={{ background: cat.color }}></div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-[11px] text-[#4a5f73] text-center pt-3.5 px-5">
        {ui.hint}
      </p>
    </div>
  );
}
