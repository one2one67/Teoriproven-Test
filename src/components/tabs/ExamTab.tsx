import React, { useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { UI, QDATA } from '../../data/questions';
import { ClipboardList, Play, Home, ArrowRight, Ban, Clock, CheckCircle2, AlertCircle, ArrowLeft, ArrowRightLeft, BookOpen, UserCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { QuestionImage } from '../QuestionImage';

import { getQuestionsForCategory } from '../../lib/question_engine';

export default function ExamTab() {
  const { lang, catId, addHist } = useStore();
  const [playing, setPlaying] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [qPool, setQPool] = useState<any[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<{ q: any, chosen: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState(45 * 60);

  const ui = UI[lang] || UI['no'];
  if (!catId) return null;
  

  useEffect(() => {
    let timer: any;
    if (playing && !showResults && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            finishExam(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [playing, showResults, timeLeft]);

  const start = () => {
    const isSpecial = catId === 'drosje' || catId === 'lastebil';
    const limit = isSpecial ? 27 : 30;
    
    let pool = getQuestionsForCategory(catId as any, lang);
    pool = pool.sort(() => Math.random() - 0.5).slice(0, Math.min(limit, pool.length));
    setQPool(pool);
    setQIdx(0);
    setAnswers([]);
    setTimeLeft(45 * 60);
    setPlaying(true);
    setShowResults(false);
  };

  const handleAns = (idx: number) => {
    // Allows overwriting or first choosing an option.
    const newAnswers = [...answers];
    newAnswers[qIdx] = { q: qPool[qIdx], chosen: idx };
    setAnswers(newAnswers);
  };

  const finishExam = (timeout: boolean = false) => {
    // Fill remaining unanswered indices
    const finalAnswers = [...answers];
    for (let i = 0; i < qPool.length; i++) {
      if (!finalAnswers[i]) {
        finalAnswers[i] = { q: qPool[i], chosen: -1 };
      }
    }
    setAnswers(finalAnswers);
    const correct = finalAnswers.filter(a => a.chosen === a.q.c).length;
    const total = qPool.length;
    const pct = Math.round((correct / total) * 100);
    const passReq = Math.ceil((total * 22) / 30);
    const passed = correct >= passReq;
    
    addHist({ ty: 'e', cat: catId, date: new Date().toLocaleDateString(), score: correct, total, pct, passed });
    setShowResults(true);
  };

  const selectQuestion = (idx: number) => {
    if (idx >= 0 && idx < qPool.length) {
      setQIdx(idx);
    }
  };

  const next = () => {
    if (qIdx + 1 >= qPool.length) {
      finishExam();
    } else {
      setQIdx(i => i + 1);
    }
  };

  if (showResults) {
    const correct = answers.filter(a => a.chosen === a.q.c).length;
    const total = qPool.length;
    const pct = Math.round((correct / total) * 100);
    const passReq = Math.ceil((total * 22) / 30);
    const passed = correct >= passReq;

    return (
      <div className="animate-in fade-in duration-300 space-y-4">
        {/* Exam outcomes */}
        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-6 text-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-brand-blue/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="text-5xl mb-3">{passed ? '🎉' : '✍️'}</div>
          <div className={cn("font-display text-xl font-black tracking-wider uppercase mb-1", passed ? "text-emerald-400" : "text-red-400")}>
            {passed ? ui.passed : ui.notPassed}
          </div>
          <div className="font-display text-5xl font-extrabold text-white mb-2">{correct} / {total}</div>
          <div className="text-xs text-slate-400 font-medium">
            {pct}{ui.pct} · Krav: {passReq} / {total}
          </div>
          <div className="mt-4 flex justify-center">
            <span className={cn("inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border", passed ? "bg-[rgba(26,158,82,0.12)] text-[#4ade80] border-[rgba(74,222,128,0.22)]" : "bg-[rgba(207,34,46,0.12)] text-[#f87171] border-[rgba(248,113,113,0.18)]")}>
              {passed ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} 
              {passed ? ui.passMsg : ui.failMsg}
            </span>
          </div>
        </div>

        {/* Audit breakdown checklist */}
        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-4.5 shadow-md">
          <div className="font-display text-xs font-bold text-white mb-3.5 uppercase tracking-wider flex items-center gap-1.5 border-b border-brand-border/40 pb-2.5">
            <BookOpen className="w-4 h-4 text-brand-blue" />
            {ui.erRevTit}
          </div>
          <div className="divide-y divide-brand-border/40 max-h-[300px] overflow-y-auto pr-1.5 custom-scrollbar space-y-3">
            {answers.map((a, i) => {
              const ok = a.chosen === a.q.c;
              return (
                <div key={i} className="flex gap-3 items-start pt-3 first:pt-1">
                  <span className="shrink-0 mt-0.5">
                    {ok ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500 fill-red-500/5" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-200 leading-normal">
                      <span className="text-slate-400 font-mono mr-1">{i + 1}.</span> {a.q.q}
                    </div>
                    {!ok && (
                      <div className="text-[11px] text-emerald-400 mt-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded px-2.5 py-1 leading-snug">
                        <span className="font-bold">{lang === 'no' ? 'Korrekt svar: ' : lang === 'en' ? 'Correct reply: ' : lang === 'ar' ? 'الجواب الصحيح: ' : 'Prawidłowa odpowiedź: '}</span>
                        {a.q.o[a.q.c]}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2.5 pt-2">
          <button 
            onClick={start} 
            className="flex-1 bg-gradient-to-br from-brand-blue to-[#1d5fcc] hover:from-brand-blue/95 hover:to-[#1d5fcc]/95 text-white font-display text-sm font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" /> {ui.erRetry}
          </button>
          <button 
            onClick={() => setPlaying(false)} 
            className="flex-1 bg-brand-dark-2 border-[1.5px] border-brand-border text-slate-300 hover:text-white font-display text-sm font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Home className="w-4 h-4" /> {ui.erHome}
          </button>
        </div>
      </div>
    );
  }

  if (!playing) {
    const isSpecial = catId === 'drosje' || catId === 'lastebil';
    const totalQs = isSpecial ? 27 : 30;
    const passReq = Math.ceil((totalQs * 22) / 30);
    const reqText = ui.exReqLbl.replace('22', passReq.toString()).replace('30', totalQs.toString()).replace('٢٢', passReq.toString()).replace('٣٠', totalQs.toString());
    const hintText = ui.exHint.replace('30', totalQs.toString()).replace('٣٠', totalQs.toString());

    return (
      <div className="animate-in fade-in duration-300 space-y-4">
        {/* Setup Exam card */}
        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-600/5 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-xl p-1.5 bg-red-500/10 rounded-lg text-red-500 border border-red-500/20">📋</span>
            <h3 className="font-display text-base font-extrabold text-white leading-tight">{ui.exTit}</h3>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-brand-dark border border-brand-border/80 rounded-xl mb-4">
            <div className="inline-flex items-center justify-center w-[36px] h-[36px] rounded-full border-[2px] border-red-500 bg-white font-display text-xs font-black text-slate-900 shrink-0">
              75%
            </div>
            <div>
              <div className="font-display text-xs font-extrabold text-white mb-0.5">{reqText}</div>
              <div className="text-[11px] text-slate-400 leading-relaxed font-sans">{hintText}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <div className="bg-brand-dark border border-brand-border/60 rounded-xl p-3 text-center">
              <div className="font-display text-xl font-extrabold text-white leading-none">{totalQs}</div>
              <div className="text-[10px] text-slate-400 mt-1 font-medium">{ui.exInfoQ}</div>
            </div>
            <div className="bg-brand-dark border border-brand-border/60 rounded-xl p-3 text-center">
              <div className="font-display text-xl font-extrabold text-white leading-none">45</div>
              <div className="text-[10px] text-slate-400 mt-1 font-medium">{ui.exInfoMin}</div>
            </div>
          </div>

          <button 
            onClick={start} 
            className="w-full bg-gradient-to-br from-brand-blue to-[#1d5fcc] hover:from-brand-blue/95 hover:to-[#1d5fcc]/95 text-white font-display text-sm font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-sm shadow-brand-blue/20"
          >
            <ClipboardList className="w-4 h-4" /> {ui.exStart}
          </button>
        </div>
      </div>
    );
  }

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const isCrucialTime = timeLeft < 120; // less than 2 minutes
  const timerBorderClass = timeLeft < 60 ? 'border-red-500 animate-pulse bg-red-500/10' : timeLeft < 300 ? 'border-amber-500 bg-amber-500/5' : 'border-emerald-500 bg-emerald-500/5';
  const q = qPool[qIdx];
  const ans = answers[qIdx];
  const pctProgress = Math.round((qIdx / qPool.length) * 100);

  return (
    <div className="animate-in fade-in flex flex-col -mx-3.5 -mt-3.5 relative">
      {/* Premium timing header bar */}
      <div className="bg-brand-dark-2 border-b border-brand-border p-4 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-md">
        <div className="flex items-center gap-3">
          <div className={cn("h-11 px-3.5 rounded-xl border-[1.5px] flex items-center gap-2 transition-all font-mono text-base font-extrabold text-white tabular-nums", timerBorderClass)}>
            <Clock className="w-4 h-4 shrink-0 text-slate-400" />
            {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
          <div>
            <div className="font-display text-xs font-bold text-white mb-0.5">{ui.exModeLbl}</div>
            <div className="text-[10px] text-red-400 flex items-center gap-1">
              <Ban className="w-3 h-3 text-red-500" /> {ui.exNoHint}
            </div>
          </div>
        </div>
        
        {/* Navigation actions */}
        <div className="flex gap-1.5">
          <button 
            disabled={qIdx === 0}
            onClick={() => selectQuestion(qIdx - 1)}
            className="w-9 h-9 border border-brand-border bg-brand-dark text-slate-400 hover:text-white rounded-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            ←
          </button>
          <button 
            disabled={qIdx + 1 >= qPool.length}
            onClick={() => selectQuestion(qIdx + 1)}
            className="w-9 h-9 border border-brand-border bg-brand-dark text-slate-400 hover:text-white rounded-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            →
          </button>
        </div>
      </div>

      {/* Progress timeline */}
      <div className="px-4 shrink-0 mt-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold px-0.5">
            <span>{lang === 'no' ? 'progresjon' : lang === 'en' ? 'progression' : lang === 'ar' ? 'التقدم مجملاً' : 'progres'}</span>
            <span>{qIdx + 1} / {qPool.length}</span>
          </div>
          <div className="bg-brand-border rounded-full h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 via-brand-blue to-cyan-500 transition-all duration-300" style={{ width: `${pctProgress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 pb-8 space-y-4">
        {/* Question Panel */}
        <div className="bg-brand-dark-2 border border-brand-border border-t-[4px] rounded-2xl p-4.5 shadow-md" style={{ borderTopColor: 'var(--cat-c)' }}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-brand-dark px-2 py-0.5 rounded inline-block">
              {lang === 'no' ? 'Spørsmål' : lang === 'en' ? 'Question' : lang === 'ar' ? 'سؤال' : 'Pytanie'} {qIdx + 1}
            </div>
          </div>
          {q.image && (
            <div className="mb-3 mt-1">
              <QuestionImage src={q.image} alt={q.imageAlt || 'Exam illustration'} />
            </div>
          )}
          <h4 className="font-display text-sm sm:text-base font-bold text-white leading-relaxed mt-1">
            {q.q}
          </h4>
        </div>

        {/* Exam options list (touch controls) */}
        <div className="space-y-2.5">
          {q.o.map((opt: string, i: number) => {
            const isChosen = ans && ans.chosen === i;
            const stateClass = isChosen 
              ? "border-brand-blue bg-brand-blue/10 shadow-sm" 
              : "border-brand-border/60 bg-brand-dark hover:border-brand-blue/60";
            const letterClass = isChosen 
              ? "bg-brand-blue text-white border-brand-blue" 
              : "bg-brand-dark border-brand-border text-slate-400";

            return (
              <button 
                key={i} 
                onClick={() => handleAns(i)} 
                className={cn("w-full text-left rtl:text-right p-3.5 min-h-[48px] rounded-xl border-[1.5px] transition-all flex items-center gap-3 justify-start focus:outline-none cursor-pointer active:scale-[0.99]", stateClass)}
              >
                <span className={cn("flex items-center justify-center min-w-[26px] h-[26px] rounded-lg font-display text-[11px] font-extrabold shrink-0 border-[1.5px]", letterClass)}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 text-xs sm:text-sm leading-relaxed text-slate-200 rtl:text-right font-medium">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Question Navigator Tray (clickable small blocks to pick/review questions easily) */}
        <div className="bg-brand-dark-2 border border-brand-border rounded-xl p-3 shadow-md">
          <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1">
            <ArrowRightLeft className="w-3.5 h-3.5 shrink-0 text-brand-blue" />
            {lang === 'no' ? 'Hopp til spørsmål' : lang === 'en' ? 'Navigate to question' : lang === 'ar' ? 'الانتقال السريع إلى سؤال' : 'Nawigacja po pytaniach'}
          </div>
          <div className="flex flex-wrap gap-1.5 justify-start">
            {qPool.map((_, idx) => {
              const itemAns = answers[idx];
              const isSelected = qIdx === idx;
              
              let blockClass = "border-brand-border text-slate-400 bg-brand-dark hover:border-slate-500";
              if (itemAns && itemAns.chosen !== -1) {
                blockClass = "border-brand-blue/40 text-brand-blue-lt bg-brand-blue/5 hover:border-brand-blue";
              }
              if (isSelected) {
                blockClass = "border-brand-blue text-white bg-brand-blue shadow-sm shadow-brand-blue/20";
              }

              return (
                <button 
                  key={idx}
                  onClick={() => selectQuestion(idx)}
                  className={cn("w-[28px] h-[28px] rounded-md border text-[11px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer focus:outline-none", blockClass)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit or Navigation CTA */}
        <div className="pt-2">
          {qIdx + 1 >= qPool.length ? (
            <button 
              onClick={() => finishExam()} 
              className="w-full bg-gradient-to-br from-emerald-500 to-emerald-600 hover:brightness-105 text-white font-display text-sm font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              <UserCheck className="w-4 h-4 shrink-0" /> {ui.submitEx}
            </button>
          ) : (
            <button 
              onClick={next} 
              className="w-full bg-[#1a2235] text-slate-200 border-[1.5px] border-brand-border hover:border-slate-400 font-display text-sm font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              {ui.nextQ} <ArrowRight className="w-4 h-4 rtl:scale-x-[-1]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
