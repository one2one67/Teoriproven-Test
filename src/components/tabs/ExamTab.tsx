import React, { useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { UI, QDATA } from '../../data/questions';
import { ClipboardList, Play, Home, ArrowRight, Ban } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export default function ExamTab() {
  const { lang, catId, addHist } = useStore();
  const [playing, setPlaying] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [qPool, setQPool] = useState<any[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<{q: any, chosen: number}[]>([]);
  const [timeLeft, setTimeLeft] = useState(45 * 60);

  const ui = UI[lang] || UI['no'];
  if (!catId) return null;
  const allQs = QDATA[catId].q;

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
    
    let pool = allQs.map((q, i) => ({ ...(q[lang] || q['no']), gi: i }));
    pool = pool.sort(() => Math.random() - 0.5).slice(0, Math.min(limit, pool.length));
    setQPool(pool);
    setQIdx(0);
    setAnswers([]);
    setTimeLeft(45 * 60);
    setPlaying(true);
    setShowResults(false);
  };

  const handleAns = (idx: number) => {
    if (answers[qIdx]) return;
    const newAnswers = [...answers];
    newAnswers[qIdx] = { q: qPool[qIdx], chosen: idx };
    setAnswers(newAnswers);
  };

  const finishExam = (timeout: boolean = false) => {
    const finalAnswers = [...answers];
    while (finalAnswers.length < qPool.length) {
      finalAnswers.push({ q: qPool[finalAnswers.length], chosen: -1 });
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
      <div className="animate-in fade-in duration-300">
        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-4 mb-3 text-center">
          <div className="text-5xl mb-2">{passed ? '🎉' : '📚'}</div>
          <div className="font-display text-[22px] font-extrabold mb-1" style={{ color: passed ? '#4ade80' : '#f87171' }}>
            {passed ? ui.passed : ui.notPassed}
          </div>
          <div className="font-display text-[38px] font-extrabold text-white mb-0">{correct} / {total}</div>
          <div className="text-xs text-slate-400 mt-1">{pct}{ui.pct} · Krav: {passReq} / {total}</div>
          <div className="mt-3">
            <span className={cn("inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border", passed ? "bg-[rgba(26,158,82,0.13)] text-[#4ade80] border-[rgba(74,222,128,0.28)]" : "bg-[rgba(207,34,46,0.1)] text-[#f87171] border-[rgba(248,113,113,0.22)]")}>
              {passed ? <Check className="w-3.5 h-3.5"/> : <X className="w-3.5 h-3.5"/>} {passed ? ui.passMsg : ui.failMsg}
            </span>
          </div>
        </div>

        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-4 mb-3">
          <div className="font-display text-sm font-bold text-white mb-3">{ui.erRevTit}</div>
          <div className="flex flex-col gap-0 border-b border-brand-border">
            {answers.map((a, i) => {
              const ok = a.chosen === a.q.c;
              return (
                <div key={i} className="flex gap-2.5 items-start py-2.5 border-t border-brand-border">
                  <span className="shrink-0 pt-0.5">
                    {ok ? (
                      <div className="w-6 h-6 rounded-full bg-[#1a9e52] border-2 border-[#4ade80] flex items-center justify-center text-white text-xs font-bold">✓</div>
                    ) : (
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <div className="relative w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-[#cf222e] flex items-center justify-center">
                          <span className="absolute top-[3px] -left-[2px] text-[10px] font-black text-white">!</span>
                        </div>
                      </div>
                    )}
                  </span>
                  <div>
                    <div className="text-xs leading-relaxed text-slate-300"><b>{i+1}.</b> {a.q.q}</div>
                    {!ok && <div className="text-[11px] text-[#4ade80] mt-1 font-medium">{a.q.o[a.q.c]}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={start} className="flex-1 bg-gradient-to-br from-brand-blue to-[#1d5fcc] text-white font-display text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.97]">
            <Play className="w-4 h-4" /> {ui.erRetry}
          </button>
          <button onClick={() => setPlaying(false)} className="flex-1 bg-brand-dark-2 border-[1.5px] border-brand-border text-white font-display text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.97]">
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
      <div className="animate-in fade-in duration-300">
        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-4 mb-3">
          <div className="font-display text-sm font-bold text-white mb-4">{ui.exTit}</div>
          <div className="flex items-start gap-3.5 p-3.5 bg-brand-dark border border-[#253347] rounded-xl mb-3.5">
            <div className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-full border-[2.5px] border-red-600 bg-white font-display text-[11px] font-extrabold text-[#222] shrink-0">
              75
            </div>
            <div>
              <div className="font-display text-[12px] font-bold text-white mb-1">{reqText}</div>
              <div className="text-[12px] text-slate-400 leading-relaxed">{hintText}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3.5">
            <div className="bg-[#1a2235] border border-[#253347] rounded-lg p-2.5 text-center">
              <div className="font-display text-lg font-extrabold text-white leading-none">{totalQs}</div>
              <div className="text-[10px] text-slate-400 mt-1">{ui.exInfoQ}</div>
            </div>
            <div className="bg-[#1a2235] border border-[#253347] rounded-lg p-2.5 text-center">
              <div className="font-display text-lg font-extrabold text-white leading-none">45</div>
              <div className="text-[10px] text-slate-400 mt-1">{ui.exInfoMin}</div>
            </div>
          </div>
          <button onClick={start} className="w-full bg-gradient-to-br from-brand-blue to-[#1d5fcc] text-white font-display text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.97]">
            <ClipboardList className="w-4 h-4" /> {ui.exStart}
          </button>
        </div>
      </div>
    );
  }

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const timerClass = timeLeft < 60 ? 'border-[#cf222e] animate-pulse' : timeLeft < 300 ? 'border-[#d4a017]' : 'border-[#1a9e52]';
  const q = qPool[qIdx];
  const ans = answers[qIdx];

  return (
    <div className="animate-in fade-in flex flex-col h-full -mx-3.5 -mt-3.5">
      <div className="bg-brand-dark-2 border-b border-brand-border p-2.5 py-3 flex items-center gap-3 shrink-0 px-4">
        <div className={cn("w-16 h-16 rounded-full border-[3px] bg-brand-dark flex flex-col items-center justify-center shrink-0 transition-colors", timerClass)}>
          <div className="font-display text-[15px] font-extrabold text-white tabular-nums leading-none">
            {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
          <div className="text-[8px] text-slate-400 mt-[1px]">{ui.exTimerLbl}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-xs font-bold text-white mb-0.5">{ui.exModeLbl}</div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
            <Ban className="w-3 h-3 text-red-500" /> {ui.exNoHint}
          </div>
          <div className="text-[11px] text-slate-400">{qIdx + 1} {ui.of} {qPool.length}</div>
        </div>
      </div>

      <div className="px-4 py-1.5 shrink-0">
        <div className="bg-brand-border rounded-full h-1 overflow-hidden my-1">
          <div className="h-full bg-gradient-to-r from-brand-blue to-cyan-500 transition-all duration-400" style={{ width: `${(qIdx / qPool.length) * 100}%` }}></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="bg-brand-dark-2 border border-brand-border border-t-[3px] rounded-2xl p-4 mb-3" style={{ borderTopColor: 'var(--cat-c)' }}>
          <div className="text-[10px] text-slate-400 mb-2 font-medium uppercase tracking-wider">{qIdx + 1} / {qPool.length}</div>
          <div className="font-display text-[clamp(15px,3.8vw,19px)] font-bold text-white leading-relaxed">
            {q.q}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {q.o.map((opt: string, i: number) => {
            let stateClass = "border-[#253347] bg-brand-dark hover:border-brand-blue hover:bg-[#1a2235]";
            let letterClass = "bg-[#1a2235] border-brand-border text-slate-400";
            
            if (ans && ans.chosen === i) {
              stateClass = "border-brand-blue bg-[#1a2235]";
              letterClass = "bg-brand-blue text-white border-brand-blue";
            } else if (ans) {
              stateClass = "opacity-70 cursor-default";
            }

            return (
              <button key={i} disabled={!!ans} onClick={() => handleAns(i)} className={cn("w-full text-left p-3 rounded-xl border-[1.5px] transition-all flex items-center gap-2.5", stateClass)}>
                <span className={cn("flex items-center justify-center min-w-[26px] h-[26px] rounded-md font-display text-[11px] font-bold shrink-0 transition-all border-[1.5px]", letterClass)}>
                  {String(fromCharCode(65 + i))}
                </span>
                <span className="flex-1 text-sm leading-relaxed text-slate-200 rtl:text-right">{opt}</span>
              </button>
            );
          })}
        </div>

        {ans && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={next} className="mt-3 w-full bg-[#1a2235] text-white border-[1.5px] border-brand-border font-display text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.97] hover:border-slate-500">
            {qIdx + 1 >= qPool.length ? ui.submitEx : ui.nextQ} <ArrowRight className="w-4 h-4 rtl:scale-x-[-1]" />
          </motion.button>
        )}
      </div>
    </div>
  );
}

// Quick polyfill for correct compilation
function fromCharCode(code: number) {
  return String.fromCharCode(code);
}
// Using lucide-react Check / X for the exam
const Check = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12" /></svg>;
const X = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>;
