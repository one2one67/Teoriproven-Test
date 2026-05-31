import React from 'react';
import { useStore } from '../../lib/store';
import { UI, QDATA, CATS } from '../../data/questions';
import { Flame, BookOpen, PenSquare, ClipboardList, ChevronRight, Library } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomeTab({ onNavigate }: { onNavigate: (tab: 'fc'|'quiz'|'exam') => void }) {
  const { lang, catId, streak, hist, mastered } = useStore();
  const navigate = useNavigate();
  const ui = UI[lang] || UI['no'];
  
  if (!catId) return null;
  const qs = QDATA[catId].q;
  const doneCount = qs.filter((_, i) => mastered.has(catId + '_' + i)).length;
  
  const hQs = hist.filter(h => h.ty === 'q' && h.cat === catId).length;
  const hEx = hist.filter(h => h.ty === 'e' && h.cat === catId && h.passed).length;
  
  const th = QDATA[catId].themes[lang] || QDATA[catId].themes['no'];
  const catInfo = CATS.find(c => c.id === catId);
  const catName = catInfo ? (catInfo[lang as any] || catInfo['no']).name : '';
  const catSub = catInfo ? (catInfo[lang as any] || catInfo['no']).sub : '';
  const catColor = catInfo ? catInfo.color : '#1d6feb';

  // Recommended next step info based on state
  let recTitle = '';
  let recDesc = '';
  let recActionLabel = '';
  let recActionTab: 'fc' | 'quiz' | 'exam' = 'fc';

  if (lang === 'no') {
    if (doneCount === 0) {
      recTitle = "Anbefalt neste steg";
      recDesc = "Kom i gang! Start med flashkort for å lære kjernebegrepene.";
      recActionLabel = "Begynn med flashkort";
      recActionTab = 'fc';
    } else if (doneCount < qs.length * 0.6) {
      recTitle = "Fortsett læringen";
      recDesc = "Du er godt i gang! Test deg selv med en kjapp quiz eller ta flere flashkort.";
      recActionLabel = "Ta en quiz";
      recActionTab = 'quiz';
    } else {
      recTitle = "Sikter du på bestått?";
      recDesc = "Høy fremgang! Test om du klarer teoriprøven under ekte tidspress nå.";
      recActionLabel = "Ta prøveeksamen";
      recActionTab = 'exam';
    }
  } else if (lang === 'en') {
    if (doneCount === 0) {
      recTitle = "Recommended Next Step";
      recDesc = "Get started! Start with flashcards to learn the core concepts.";
      recActionLabel = "Start with flashcards";
      recActionTab = 'fc';
    } else if (doneCount < qs.length * 0.6) {
      recTitle = "Continue Learning";
      recDesc = "You are on track! Test yourself with a quick quiz or do more flashcards.";
      recActionLabel = "Take a quiz";
      recActionTab = 'quiz';
    } else {
      recTitle = "Aiming for a Pass?";
      recDesc = "Great progress! Test if you can pass the theory exam under real time pressure.";
      recActionLabel = "Take exam simulation";
      recActionTab = 'exam';
    }
  } else if (lang === 'ar') {
    if (doneCount === 0) {
      recTitle = "الخطوة الموصى بها";
      recDesc = "ابدأ ببطاقات التعلم لحفظ وفهم المفاهيم الأساسية بيسر.";
      recActionLabel = "بدء التمرن بالبطاقات";
      recActionTab = 'fc';
    } else if (doneCount < qs.length * 0.6) {
      recTitle = "واصل التمرن";
      recDesc = "لقد بدأت بالفعل! اختبر سرعة استجابتك من خلال اختبار سريع.";
      recActionLabel = "ابدأ اختباراً سريعاً";
      recActionTab = 'quiz';
    } else {
      recTitle = "هل أنت جاهز للامتحان؟";
      recDesc = "مستوى مذهل! جرب محاكاة الامتحان الفعلي لتقيس جاهزيتك للنجاح.";
      recActionLabel = "ابدأ محاكاة الامتحان";
      recActionTab = 'exam';
    }
  } else { // pl
    if (doneCount === 0) {
      recTitle = "Zalecany następny krok";
      recDesc = "Zacznij od fiszek, aby poznać podstawowe przepisy i pojęcia.";
      recActionLabel = "Rozpocznij fiszki";
      recActionTab = 'fc';
    } else if (doneCount < qs.length * 0.6) {
      recTitle = "Kontynuuj naukę";
      recDesc = "Świetny start! Sprawdź swoją wiedzę w quizie lub przejrzyj fiszki.";
      recActionLabel = "Weź szybki quiz";
      recActionTab = 'quiz';
    } else {
      recTitle = "Celujesz w sukces?";
      recDesc = "Bardzo dobry poziom! Sprawdź czy ukończysz symulację egzaminu w czasie.";
      recActionLabel = "Rozpocznij egzamin";
      recActionTab = 'exam';
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
      
      {/* Category Overview Header */}
      <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-4 flex items-center gap-3.5 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-blue/10 to-transparent rounded-bl-full pointer-events-none" />
        <span className="text-3xl p-2.5 bg-brand-dark rounded-xl border border-brand-border/40 font-semibold shrink-0" style={{ textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>
          {catInfo?.icon || '🚙'}
        </span>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold tracking-widest text-brand-blue uppercase">{catInfo?.id}</span>
          <h2 className="font-display text-base font-extrabold text-white leading-tight mt-0.5 truncate">{catName}</h2>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate font-sans leading-relaxed">{catSub}</p>
        </div>
      </div>

      {/* Streak display */}
      <div className="flex items-center gap-3 bg-gradient-to-br from-[rgba(212,160,23,0.1)] to-[rgba(212,160,23,0.03)] border border-[rgba(212,160,23,0.22)] rounded-xl p-3 px-3.5 shadow-sm">
        <span className="text-2xl shrink-0"><Flame className="w-7 h-7 text-amber-500 fill-amber-500 animate-pulse" /></span>
        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-[1px]">{ui.hStrLbl}</div>
          <div className="font-display text-[22px] font-extrabold text-amber-400 leading-none">{streak} {ui.hStrDays}</div>
        </div>
      </div>

      {/* Recommended Next Step Section */}
      <div className="bg-brand-dark-2 border-[1.5px] border-brand-border rounded-2xl p-4.5 relative overflow-hidden shadow-lg" style={{ borderLeft: `4px solid ${catColor}` }}>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <span className="text-[10px] font-extrabold text-brand-blue uppercase tracking-widest leading-none block mb-1">{recTitle}</span>
            <p className="text-[12px] sm:text-[13px] text-slate-300 font-sans leading-relaxed mt-1">
              {recDesc}
            </p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate(recActionTab)} 
          className="mt-3.5 w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-display text-xs font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer min-h-[44px] shadow-sm shadow-brand-blue/25 uppercase tracking-wide"
        >
          {recActionLabel} <ChevronRight className="w-4 h-4 rtl:scale-x-[-1]" />
        </button>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-brand-dark-2 border border-brand-border rounded-xl p-2.5 flex flex-col items-center justify-center text-center min-h-[72px] shadow-sm">
          <div className="font-display text-sm sm:text-base md:text-lg font-extrabold text-white leading-none truncate w-full">{doneCount}/{qs.length}</div>
          <div className="text-[9px] sm:text-[10px] text-slate-400 mt-1.5 leading-snug">{ui.hsMl}</div>
        </div>
        <div className="bg-brand-dark-2 border border-brand-border rounded-xl p-2.5 flex flex-col items-center justify-center text-center min-h-[72px] shadow-sm">
          <div className="font-display text-sm sm:text-base md:text-lg font-extrabold text-white leading-none truncate w-full">{hQs}</div>
          <div className="text-[9px] sm:text-[10px] text-slate-400 mt-1.5 leading-snug">{ui.hsQl}</div>
        </div>
        <div className="bg-brand-dark-2 border border-brand-border rounded-xl p-2.5 flex flex-col items-center justify-center text-center min-h-[72px] shadow-sm">
          <div className="font-display text-sm sm:text-base md:text-lg font-extrabold text-white leading-none truncate w-full">{hEx}</div>
          <div className="text-[9px] sm:text-[10px] text-slate-400 mt-1.5 leading-snug">{ui.hsEl}</div>
        </div>
      </div>

      {/* Progress per theme */}
      <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-4.5 shadow-md">
        <div className="font-display text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
          <span className="w-1.5 h-3 bg-brand-blue rounded-full"></span>
          {ui.hProg}
        </div>
        <div className="flex flex-col gap-3">
          {Object.entries(th).map(([t, color]) => {
            const tqs = qs.map((q, i) => ({ q, i })).filter(({ q }) => {
              const d = q[lang] || q['no'] || {};
              return d.t === t;
            });
            const tc = tqs.filter(({ i }) => mastered.has(catId + '_' + i)).length;
            const pct = tqs.length ? Math.round((tc / tqs.length) * 100) : 0;
            const shortName = t.replace(/T\d+[^:]*:\s*/, '');
            return (
              <div key={t} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5">
                <div className="text-[11px] text-slate-400 sm:w-28 whitespace-nowrap overflow-hidden text-ellipsis rtl:text-right">{shortName}</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-brand-border rounded-full h-[5px] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color as string }}></div>
                  </div>
                  <div className="text-[10px] text-slate-400 min-w-[28px] text-right font-mono rtl:text-left">{pct}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learn Modes divider */}
      <div className="flex items-center gap-2.5 py-1 text-[#4a5f73] text-[9px] font-black tracking-[0.15em] uppercase before:content-[''] before:flex-1 before:h-[1px] before:bg-[repeating-linear-gradient(90deg,var(--color-brand-border)_0,var(--color-brand-border)_8px,transparent_8px,transparent_14px)] after:content-[''] after:flex-1 after:h-[1px] after:bg-[repeating-linear-gradient(90deg,var(--color-brand-border)_0,var(--color-brand-border)_8px,transparent_8px,transparent_14px)]">
        {ui.hModesLbl}
      </div>

      {/* Mode selectors */}
      <div className="space-y-2.5">
        <div onClick={() => onNavigate('fc')} className="bg-brand-dark-2 border-[1.5px] border-brand-border rounded-2xl p-3.5 cursor-pointer flex items-center gap-3.5 transition-all hover:border-brand-blue hover:bg-brand-dark-3 active:scale-[0.98] shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-brand-dark border border-brand-border/60 flex items-center justify-center text-xl shrink-0 text-amber-500">
            <BookOpen className="w-5.5 h-5.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-sm font-extrabold text-white mb-0.5">{ui.hmFC}</div>
            <div className="text-[11px] text-slate-400 leading-snug">{ui.hmFCd}</div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#4a5f73] shrink-0 rtl:scale-x-[-1]" />
        </div>

        <div onClick={() => onNavigate('quiz')} className="bg-brand-dark-2 border-[1.5px] border-brand-border rounded-2xl p-3.5 cursor-pointer flex items-center gap-3.5 transition-all hover:border-brand-blue hover:bg-brand-dark-3 active:scale-[0.98] shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-brand-dark border border-brand-border/60 flex items-center justify-center text-xl shrink-0 text-emerald-500">
            <PenSquare className="w-5.5 h-5.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-sm font-extrabold text-white mb-0.5">{ui.hmQZ}</div>
            <div className="text-[11px] text-slate-400 leading-snug">{ui.hmQZd}</div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#4a5f73] shrink-0 rtl:scale-x-[-1]" />
        </div>

        <div onClick={() => onNavigate('exam')} className="bg-brand-dark-2 border-[1.5px] border-brand-border rounded-2xl p-3.5 cursor-pointer flex items-center gap-3.5 transition-all hover:border-brand-blue hover:bg-brand-dark-3 active:scale-[0.98] shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-brand-dark border border-brand-border/60 flex items-center justify-center text-xl shrink-0 text-cyan-500">
            <ClipboardList className="w-5.5 h-5.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-sm font-extrabold text-white mb-0.5">{ui.hmEx}</div>
            <div className="text-[11px] text-slate-400 leading-snug">{ui.hmExd}</div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#4a5f73] shrink-0 rtl:scale-x-[-1]" />
        </div>

        <div onClick={() => navigate('/bank')} className="bg-brand-dark-2 border-[1.5px] border-brand-border rounded-2xl p-3.5 cursor-pointer flex items-center gap-3.5 transition-all hover:border-brand-blue hover:bg-brand-dark-3 active:scale-[0.98] shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-brand-dark border border-brand-border/60 flex items-center justify-center text-xl shrink-0 text-purple-500">
            <Library className="w-5.5 h-5.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-sm font-extrabold text-white mb-0.5">Spørsmålsbank</div>
            <div className="text-[11px] text-slate-400 leading-snug">Se gjennom alle spørsmål og forklaringer</div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#4a5f73] shrink-0 rtl:scale-x-[-1]" />
        </div>
      </div>

    </div>
  );
}
