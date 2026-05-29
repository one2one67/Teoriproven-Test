import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk, SignInButton, UserButton } from '@clerk/clerk-react';
import { motion } from 'motion/react';
import { CATS, UI, CategoryId } from '../data/questions';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';
import Navbar from '../components/Navbar';
import KnowledgePortal from '../components/KnowledgePortal';

export default function Landing() {
  const { lang, setLang, setCatId } = useStore();
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const handleCategoryClick = (id: CategoryId) => {
    if (isSignedIn) {
      setCatId(id);
      navigate('/teori');
    } else {
      openSignIn({ forceRedirectUrl: '/teori', signUpForceRedirectUrl: '/teori' });
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
      
      {/* Fjernet duplikat header. Navigasjon og språkvelger ligger i Navbar */}
      <div className="w-full text-center pt-24 pb-12 px-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-full bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(29,111,235,0.14),transparent)] pointer-events-none"></div>
        <div className="inline-flex items-center gap-1.5 bg-brand-blue/10 border border-brand-blue/20 text-[#7eb8f7] text-[11px] font-bold px-3 py-1 rounded-full mb-4.5 tracking-[0.04em] shadow-sm relative z-10">
          📚 {(lang === 'no' ? 'Komplett transportportal' : lang === 'en' ? 'Complete transport portal' : lang === 'ar' ? 'بوابة نقل شاملة' : 'Kompletny portal transportowy')}
        </div>
        <h1 className="font-display text-[clamp(26px,5.5vw,48px)] font-extrabold tracking-[-1.5px] leading-[1.1] mb-3 text-white max-w-2xl mx-auto relative z-10">
          {(lang === 'no' ? 'Alt du trenger å vite om ' : lang === 'en' ? 'Everything you need to know about ' : lang === 'ar' ? 'كل ما تحتاج معرفته عن ' : 'Wszystko co musisz wiedzieć o ')}
          <span className="bg-gradient-to-br from-[#4d8ef5] to-cyan-500 bg-clip-text text-transparent">
            {(lang === 'no' ? 'transport i Norge' : lang === 'en' ? 'transport in Norway' : lang === 'ar' ? 'النقل في النرويج' : 'transporcie w Norwegii')}
          </span>
        </h1>
        <p className="text-[clamp(13px,2vw,16px)] text-slate-400 max-w-[580px] mx-auto mb-8 leading-[1.7] relative z-10">
          {(lang === 'no' ? 'Kildebasert kunnskap om teoriprøver, løyver, trafikksikkerhet, HMS, kjøre-/hviletid, ADR og mye mer. For sjåfører, elever og transportbedrifter.' : lang === 'en' ? 'Source-based knowledge about theory tests, licences, road safety, HSE, driving/rest times, ADR and much more. For drivers, students and transport companies.' : lang === 'ar' ? 'معرفة مستندة للمصادر حول الاختبارات النظرية والرخص وسلامة السير والسلامة المهنية وأوقات القيادة/الراحة وADR والمزيد. للسائقين والطلاب وشركات النقل.' : 'Wiedza oparta na źródłach dotycząca egzaminów teoretycznych, licencji, bezpieczeństwa drogowego, BHP, czasu jazdy/odpoczynku, ADR i innych. Dla kierowców, uczniów i firm transportowych.')}
        </p>
        
        <div className="flex flex-wrap justify-center gap-5 relative z-10">
          <div className="text-center px-5 py-2.5 bg-white/[0.04] border border-brand-border rounded-xl shadow-lg">
            <div className="font-display text-2xl font-extrabold text-white">8+</div>
            <div className="text-[11px] text-slate-400">{(lang === 'no' ? 'Kategorier' : lang === 'en' ? 'Categories' : lang === 'ar' ? 'الفئات' : 'Kategorie')}</div>
          </div>
          <div className="text-center px-5 py-2.5 bg-white/[0.04] border border-brand-border rounded-xl shadow-lg">
            <div className="font-display text-2xl font-extrabold text-white">20+</div>
            <div className="text-[11px] text-slate-400">{(lang === 'no' ? 'FAQ-spørsmål' : lang === 'en' ? 'FAQ questions' : lang === 'ar' ? 'أسئلة FAQ' : 'Pytania FAQ')}</div>
          </div>
          <div className="text-center px-5 py-2.5 bg-white/[0.04] border border-brand-border rounded-xl shadow-lg">
            <div className="font-display text-2xl font-extrabold text-white">4</div>
            <div className="text-[11px] text-slate-400">{(lang === 'no' ? 'Språk' : lang === 'en' ? 'Languages' : lang === 'ar' ? 'اللغات' : 'Języki')}</div>
          </div>
          <div className="text-center px-5 py-2.5 bg-white/[0.04] border border-brand-border rounded-xl shadow-lg">
            <div className="font-display text-2xl font-extrabold text-white">100%</div>
            <div className="text-[11px] text-slate-400">{(lang === 'no' ? 'Kildebasert' : lang === 'en' ? 'Source-based' : lang === 'ar' ? 'مستندة للمصادر' : 'Oparte na źródłach')}</div>
          </div>
        </div>
      </div>

      <KnowledgePortal />

      <div className="w-full text-center mt-4 mb-4">
        <h2 className="font-display text-lg font-bold text-white mb-2">{(lang === 'no' ? 'Løyver og teoriprøver' : lang === 'en' ? 'Licences and theory tests' : lang === 'ar' ? 'الرخص والاختبارات النظرية' : 'Licencje i egzaminy teoretyczne')}</h2>
        <p className="text-xs text-slate-400">{(lang === 'no' ? 'Velg for å begynne' : lang === 'en' ? 'Select to start' : lang === 'ar' ? 'اختر للبدء' : 'Wybierz, aby rozpocząć')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-[480px] px-4 mx-auto mb-16">
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
