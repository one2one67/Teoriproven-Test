import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { UI, QDATA } from '../../data/questions';
import { Play, X, RotateCcw, Hand, Check, ArrowLeft, RefreshCw, Layers, ShieldCheck, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { QuestionImage } from '../QuestionImage';

import { getQuestionsForCategory } from '../../lib/question_engine';

export default function FlashcardsTab() {
  const { lang, catId, mastered, toggleMastered, clearMastered } = useStore();
  const [playing, setPlaying] = useState(false);
  const [fcPool, setFcPool] = useState<any[]>([]);
  const [fcIdx, setFcIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [topic, setTopic] = useState<string>('all');
  const [filter, setFilter] = useState<string>('all');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const ui = UI[lang] || UI['no'];
  if (!catId || !QDATA[catId]) return null;
  
  const th = QDATA[catId].themes?.[lang] || QDATA[catId].themes?.['no'] || {};

  const start = () => {
    let pool = getQuestionsForCategory(catId as any, lang);
    if (topic !== 'all' && topic !== ui.allTopics) {
      pool = pool.filter(q => q.t === topic || q._no_t === topic);
    }
    if (filter === 'un') pool = pool.filter(q => !mastered.has(catId + '_' + q.gi));
    if (filter === 'm') pool = pool.filter(q => mastered.has(catId + '_' + q.gi));
    
    setFcPool(pool.sort(() => Math.random() - 0.5));
    setFcIdx(0);
    setFlipped(false);
    setPlaying(true);
  };

  const mark = (knew: boolean) => {
    const gi = fcPool[fcIdx].gi;
    const isCurrentlyMastered = mastered.has(catId + '_' + gi);

    if (knew && !isCurrentlyMastered) {
      toggleMastered(catId + '_' + gi);
    } else if (!knew && isCurrentlyMastered) {
      toggleMastered(catId + '_' + gi);
    }
    setFlipped(false);
    setFcIdx(i => i + 1);
  };

  if (!playing) {
    return (
      <div className="animate-in fade-in duration-300 space-y-4">
        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-xl p-1.5 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">🃏</span>
            <h3 className="font-display text-base font-extrabold text-white leading-snug">{ui.fcTit}</h3>
          </div>

          <div className="space-y-4">
            {/* Topic Select */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest pl-0.5">
                {ui.fcLblT}
              </label>
              <div className="relative">
                <select 
                  value={topic} 
                  onChange={e => setTopic(e.target.value)} 
                  className="w-full bg-brand-dark text-white border-[1.5px] border-brand-border rounded-xl p-3 text-sm appearance-none outline-none focus:border-brand-blue cursor-pointer transition-all"
                >
                  <option value="all">{ui.allTopics}</option>
                  {Object.keys(th).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 flex items-center px-3.5 text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Filter Select */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest pl-0.5">
                {ui.fcLblF}
              </label>
              <div className="relative">
                <select 
                  value={filter} 
                  onChange={e => setFilter(e.target.value)} 
                  className="w-full bg-brand-dark text-white border-[1.5px] border-brand-border rounded-xl p-3 text-sm appearance-none outline-none focus:border-brand-blue cursor-pointer transition-all"
                >
                  <option value="all">{ui.fcAll}</option>
                  <option value="un">{ui.fcUn}</option>
                  <option value="m">{ui.fcM}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 flex items-center px-3.5 text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <button 
              onClick={start} 
              className="mt-2 w-full bg-gradient-to-br from-brand-blue to-[#1d5fcc] hover:from-brand-blue/95 hover:to-[#1d5fcc]/95 text-white font-display text-sm font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer min-h-[46px] shadow-sm shadow-brand-blue/20"
            >
              <Play className="w-4 h-4 fill-white" /> {ui.fcStart}
            </button>
          </div>
        </div>

        {/* Tip banner */}
        <div className="bg-[rgba(29,111,235,0.06)] border border-[rgba(29,111,235,0.15)] rounded-xl p-3.5 text-xs text-slate-400 leading-relaxed flex gap-2.5 items-start">
          <span className="text-brand-blue shrink-0 mt-0.5"><Layers className="w-4 h-4" /></span>
          <span className="font-sans leading-normal">{ui.fcHintTxt}</span>
        </div>

        {/* Dynamic Reset State Confirmation inside App */}
        {mastered.size > 0 && (
          <div className="pt-2">
            {!showResetConfirm ? (
              <button 
                onClick={() => setShowResetConfirm(true)} 
                className="w-full bg-transparent text-slate-500 hover:text-slate-300 text-xs font-bold py-2.5 flex items-center justify-center gap-1.5 cursor-pointer hover:underline border border-dashed border-brand-border/40 hover:border-slate-500/40 rounded-xl transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> {ui.fcReset}
              </button>
            ) : (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3.5 text-center animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="text-xs text-red-200 font-semibold mb-2 leading-relaxed">{ui.resetConfirm}</p>
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={() => { clearMastered(); setShowResetConfirm(false); }} 
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {lang === 'no' ? 'Ja, nullstill' : lang === 'en' ? 'Yes, reset' : lang === 'ar' ? 'نعم، إعادة تعيين' : 'Tak, resetuj'}
                  </button>
                  <button 
                    onClick={() => setShowResetConfirm(false)} 
                    className="bg-brand-border hover:bg-brand-border/80 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {lang === 'no' ? 'Avbryt' : lang === 'en' ? 'Cancel' : lang === 'ar' ? 'إلغاء' : 'Anuluj'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (fcPool.length === 0) {
    return (
      <div className="animate-in fade-in duration-300 text-center py-10 px-4 space-y-4">
        <div className="text-5xl">🤷‍♂️</div>
        <div className="font-display text-base font-extrabold text-white">
          {lang === 'no' ? 'Ingen kort funnet' : lang === 'en' ? 'No cards found' : lang === 'ar' ? 'لم يتم العثور على بطاقات' : 'Nie znaleziono fiszek'}
        </div>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          {lang === 'no' 
            ? 'Prøv å endre på filtrene eller velg et annet tema for å lære.' 
            : lang === 'en' 
            ? 'Try changing the filters or select another topic to study.' 
            : lang === 'ar' 
            ? 'حاول تغيير الفلاتر أو اختر موضوعاً آخر للدراسة.' 
            : 'Spróbuj zmienić filtry lub wybierz inny temat do nauki.'}
        </p>
        <button 
          onClick={() => setPlaying(false)} 
          className="bg-brand-dark-2 border border-brand-border text-white text-xs font-bold rounded-xl py-2.5 px-5 transition-colors hover:border-slate-400 cursor-pointer inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:scale-x-[-1]" /> {ui.fcHome}
        </button>
      </div>
    );
  }

  if (fcIdx >= fcPool.length) {
    return (
      <div className="animate-in fade-in duration-300 text-center py-12 px-4 space-y-5">
        <div className="text-5xl animate-bounce">🎉</div>
        <div>
          <div className="font-display text-lg font-extrabold text-white mb-1.5">{ui.fcDoneTit}</div>
          <p className="text-xs text-slate-400 leading-normal max-w-xs mx-auto">
            {lang === 'no' 
              ? 'Du har gått gjennom alle planlagte flashkort for denne runden!' 
              : lang === 'en' 
              ? 'You have reviewed all the scheduled flashcards for this round!' 
              : lang === 'ar' 
              ? 'لقد راجعت جميع بطاقات التعلم المخصصة لهذه الجولة!' 
              : 'Przejrzałeś wszystkie zaplanowane fiszki dla tej rundy!'}
          </p>
        </div>
        <div className="space-y-2 max-w-xs mx-auto pt-2">
          <button 
            onClick={start} 
            className="w-full bg-brand-blue hover:bg-brand-blue/95 text-white font-display text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.97] cursor-pointer min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4" /> {ui.fcAgain}
          </button>
          <button 
            onClick={() => setPlaying(false)} 
            className="w-full bg-brand-dark-2 border-[1.5px] border-brand-border text-slate-300 hover:text-white font-display text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.97] cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 rtl:scale-x-[-1]" /> {ui.fcHome}
          </button>
        </div>
      </div>
    );
  }

  if (playing && fcPool.length === 0) {
    return (
      <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-6 text-center space-y-4">
        <p className="text-sm text-slate-300">
          {lang === 'no' ? 'Ingen flashcards tilgjengelig for dette filteret.' : 'No flashcards available for this filter.'}
        </p>
        <button 
          onClick={() => setPlaying(false)} 
          className="mx-auto px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          {ui.fcBack || 'Back'}
        </button>
      </div>
    );
  }

  const q = fcPool[fcIdx];
  const color = th[q.t] || 'var(--color-brand-blue)';
  const pctFinished = fcPool.length > 0 ? Math.round((fcIdx / fcPool.length) * 100) : 0;

  return (
    <div className="animate-in fade-in duration-300 space-y-4">
      {/* Quiz Header Info */}
      <div className="flex justify-between items-center bg-brand-dark-2/40 border border-brand-border p-2 px-3 rounded-xl">
        <button 
          onClick={() => setPlaying(false)} 
          className="bg-transparent border-none text-slate-400 cursor-pointer text-[12px] font-bold flex items-center gap-1 hover:text-white"
        >
          <X className="w-4 h-4" /> {ui.fcBack}
        </button>
        <span className="font-display text-[11px] font-bold text-slate-400 bg-brand-dark px-2 py-0.5 rounded border border-brand-border">
          {fcIdx + 1} / {fcPool.length}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider px-1">
          <span>{lang === 'no' ? 'fremgang' : lang === 'en' ? 'progress' : lang === 'ar' ? 'التقدم' : 'postęp'}</span>
          <span className="font-mono">{pctFinished}%</span>
        </div>
        <div className="bg-brand-border rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-blue to-teal-400 transition-all duration-400" style={{ width: `${pctFinished}%` }}></div>
        </div>
      </div>

      <div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] text-[10px] font-bold tracking-wider border-l-[3px] rtl:border-l-0 rtl:border-r-[3px]" style={{ background: `${color}18`, color: color, borderColor: color }}>
          {q.t.replace(/T\d+[^:]*:\s*/, '')}
        </span>
      </div>

      {/* 3D Flashcard container */}
      <div 
        className="perspective-[1200px] w-full min-h-[260px] sm:min-h-[290px] cursor-pointer select-none" 
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div 
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="relative w-full min-h-[260px] sm:min-h-[290px] [transform-style:preserve-3d]"
        >
          {/* Card Front */}
          <div 
            className="absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] bg-brand-dark-2 border-[1.5px] border-brand-border border-t-[4px] rounded-2xl p-5 sm:p-7 flex flex-col justify-between shadow-xl" 
            style={{ borderTopColor: color }}
          >
            <div className="text-[10px] sm:text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 font-bold uppercase tracking-widest py-1 bg-brand-dark/40 border border-brand-border/40 rounded-lg shrink-0">
              <Hand className="w-3.5 h-3.5 text-amber-500 animate-bounce" /> {ui.fcHint}
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center py-4 overflow-y-auto custom-scrollbar">
              <div className="mb-4 w-full h-[120px] shrink-0">
                <QuestionImage src={q.image || null} questionText={q.q} alt={q.imageAlt || 'Flashcard illustration'} className="w-full h-full object-contain" />
              </div>
              <p className="font-display text-sm sm:text-base md:text-lg font-bold text-white leading-relaxed text-center rtl:text-right w-full">
                {q.q}
              </p>
            </div>

            <div className="text-[9px] text-[#4a5f73] font-mono text-center tracking-wide uppercase shrink-0">
              ID: {q.gi + 1}
            </div>
          </div>

          {/* Card Back */}
          <div 
            className="absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] bg-brand-dark-2 border-[1.5px] border-brand-border border-t-[4px] border-t-emerald-500 rounded-2xl p-5 sm:p-7 flex flex-col justify-between shadow-xl" 
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded border border-emerald-500/10 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400" /> {lang === 'no' ? 'Korrekt Svar' : lang === 'en' ? 'Correct Answer' : lang === 'ar' ? 'الإجابة الصحيحة' : 'Prawidłowa Odpowiedź'}
            </div>

            <div className="flex-1 flex flex-col justify-center py-3 overflow-y-auto max-h-[160px] scrollbar-thin">
              <p className="text-sm sm:text-base text-white font-extrabold mb-2 text-center rtl:text-right leading-tight">
                {q.o[q.c]}
              </p>
              {q.e && (
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-sans text-center rtl:text-right border-t border-brand-border/40 pt-2.5">
                  {q.e}
                </p>
              )}
            </div>

            <div className="text-[9px] text-slate-600 font-mono text-center tracking-wide uppercase">
              tap to flip back
            </div>
          </div>
        </motion.div>
      </div>

      {/* Card Actions Container */}
      <div className="min-h-[50px] flex items-center justify-center">
        {flipped ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="flex gap-3 w-full"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); mark(false); }} 
              className="flex-1 bg-red-500/10 hover:bg-red-500/15 text-red-200 border-[1.5px] border-red-500/30 font-display text-xs sm:text-sm font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer min-h-[46px]"
            >
              <RotateCcw className="w-4 h-4 shrink-0 text-red-400" /> {ui.fcMore}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); mark(true); }} 
              className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:brightness-105 text-white font-display text-xs sm:text-sm font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer min-h-[46px] border-0 shadow-sm shadow-emerald-500/20"
            >
              <Check className="w-4 h-4 shrink-0" /> {ui.fcGot}
            </button>
          </motion.div>
        ) : (
          <p className="text-xs text-slate-500 italic text-center animate-pulse">
            {lang === 'no' ? 'Trykk på kortet for å avsløre svaret' : lang === 'en' ? 'Tap the card to reveal the answer' : lang === 'ar' ? 'اضغط على البطاقة لكشف الإجابة' : 'Dotknij karty, aby ujawnić odpowiedź'}
          </p>
        )}
      </div>
    </div>
  );
}
