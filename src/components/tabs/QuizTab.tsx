import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { UI, QDATA } from '../../data/questions';
import { Play, ArrowRight, Home, CheckCircle2, AlertCircle, HelpCircle, RefreshCw, Sparkles, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function QuizTab() {
  const { lang, catId, hist, addHist } = useStore();
  const [playing, setPlaying] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [qPool, setQPool] = useState<any[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<{q: any, chosen: number, ok: boolean}[]>([]);
  const [topic, setTopic] = useState<string>('all');

  const ui = UI[lang] || UI['no'];
  if (!catId) return null;
  const allQs = QDATA[catId].q;
  const th = QDATA[catId].themes[lang] || QDATA[catId].themes['no'];
  const recentHist = hist.filter(h => h.ty === 'q' && h.cat === catId).slice(-4).reverse();

  const start = () => {
    let pool = allQs.map((q, i) => ({ ...(q[lang] || q['no']), gi: i, _no_t: (q['no'] || {}).t }));
    if (topic !== 'all' && topic !== ui.allTopics) {
      pool = pool.filter(q => q.t === topic || q._no_t === topic);
    }
    setQPool(pool.sort(() => Math.random() - 0.5));
    setQIdx(0);
    setAnswers([]);
    setPlaying(true);
    setShowResults(false);
  };

  const handleAns = (idx: number) => {
    if (answers[qIdx]) return;
    const q = qPool[qIdx];
    const ok = idx === q.c;
    const newAnswers = [...answers];
    newAnswers[qIdx] = { q, chosen: idx, ok };
    setAnswers(newAnswers);
  };

  const next = () => {
    if (qIdx + 1 >= qPool.length) {
      const correct = answers.filter(a => a.ok).length;
      const total = qPool.length;
      const pct = Math.round((correct / total) * 100);
      addHist({ ty: 'q', cat: catId, date: new Date().toLocaleDateString(), score: correct, total, pct });
      setShowResults(true);
    } else {
      setQIdx(i => i + 1);
    }
  };

  if (showResults) {
    const correct = answers.filter(a => a.ok).length;
    const total = qPool.length;
    const pct = Math.round((correct / total) * 100);
    let emoji = '📚', title = ui.grOev, headingColor = 'text-white';
    
    if (pct >= 90) { 
      emoji = '🏆'; 
      title = ui.grEx; 
      headingColor = 'text-emerald-400'; 
    } else if (pct >= 70) { 
      emoji = '✨'; 
      title = ui.grBra; 
      headingColor = 'text-teal-400'; 
    } else if (pct >= 50) { 
      emoji = '👍'; 
      title = ui.grGod; 
      headingColor = 'text-amber-400'; 
    } else { 
      headingColor = 'text-red-400'; 
    }

    return (
      <div className="animate-in fade-in duration-300 space-y-4">
        {/* Results Card */}
        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-6 text-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-teal-500/5 to-transparent rounded-bl-full pointer-events-none" />
          <div className="text-5xl mb-3">{emoji}</div>
          <div className={cn("font-display text-xl font-extrabold mb-1", headingColor)}>{title}</div>
          <div className="font-display text-4xl font-extrabold text-white mb-1">{correct} / {total}</div>
          <div className="text-xs text-slate-400">{pct}{ui.pct} {lang === 'no' ? 'korrekt besvart' : lang === 'en' ? 'correctly answered' : lang === 'ar' ? 'إجابات صحيحة' : 'prawidłowych odpowiedzi'}</div>
        </div>

        {/* Detailed reviews */}
        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-4.5 shadow-md">
          <div className="font-display text-xs font-bold text-white mb-3.5 uppercase tracking-wider flex items-center gap-1.5 border-b border-brand-border/40 pb-2.5">
            <BookOpen className="w-4 h-4 text-brand-blue" />
            {ui.qrRevTit}
          </div>
          <div className="divide-y divide-brand-border/40 max-h-[320px] overflow-y-auto pr-1.5 custom-scrollbar space-y-2.5">
            {answers.map((a, i) => (
              <div key={i} className="flex gap-3 items-start pt-3.5 first:pt-1">
                <span className="shrink-0 mt-0.5">
                  {a.ok ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 fill-red-500/5" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 leading-normal">
                    <span className="text-slate-400 font-mono mr-1">{i + 1}.</span>
                    {a.q.q}
                  </div>
                  {!a.ok ? (
                    <div className="text-[11px] text-emerald-400 mt-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded px-2 py-1 leading-snug">
                      <span className="font-bold">{lang === 'no' ? 'Riktig svar: ' : lang === 'en' ? 'Correct answer: ' : lang === 'ar' ? 'الجواب الصحيح: ' : 'Prawidłowa odpowiedź: '}</span>
                      {a.q.o[a.q.c]}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 mt-1 pl-1">
                      {lang === 'no' ? 'Du valgte riktig svar.' : lang === 'en' ? 'You chose the correct answer.' : lang === 'ar' ? 'لقد اخترت الإجابة الصحيحة.' : 'Hicior! Wybrałeś prawidłowo.'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button 
            onClick={start} 
            className="flex-1 bg-gradient-to-br from-brand-blue to-[#1d5fcc] hover:from-brand-blue/95 hover:to-[#1d5fcc]/95 text-white font-display text-sm font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> {ui.qrRetry}
          </button>
          <button 
            onClick={() => setPlaying(false)} 
            className="flex-1 bg-brand-dark-2 border-[1.5px] border-brand-border text-slate-300 hover:text-white font-display text-sm font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Home className="w-4 h-4" /> {ui.qrHome}
          </button>
        </div>
      </div>
    );
  }

  if (!playing) {
    return (
      <div className="animate-in fade-in duration-300 space-y-4">
        {/* Setup card */}
        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-xl p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">✍️</span>
            <h3 className="font-display text-base font-extrabold text-white leading-tight">{ui.qzTit}</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest pl-0.5">
                {ui.qzLblT}
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

            <button 
              onClick={start} 
              className="mt-2 w-full bg-gradient-to-br from-brand-blue to-[#1d5fcc] hover:from-brand-blue/95 hover:to-[#1d5fcc]/95 text-white font-display text-sm font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer min-h-[46px]"
            >
              <Play className="w-4 h-4 fill-white" /> {ui.qzStart}
            </button>
          </div>
        </div>

        {/* Practice history */}
        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-4.5 shadow-md">
          <div className="font-display text-xs font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-1.5 border-b border-brand-border/40 pb-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            {ui.qzHistTit}
          </div>
          {recentHist.length === 0 ? (
            <p className="text-xs text-slate-500 p-2 italic">{ui.noHist}</p>
          ) : (
            <div className="divide-y divide-brand-border/40">
              {recentHist.map((h, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 first:pt-1 last:pb-1 text-xs">
                  <span className="text-slate-400 font-mono">{h.date}</span>
                  <span className={cn("font-display text-xs font-extrabold px-2.5 py-0.5 rounded-full", h.pct >= 70 ? 'bg-emerald-500/10 text-[#4ade80]' : 'bg-amber-500/10 text-[#fbbf24]')}>
                    {h.score} / {h.total} ({h.pct}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const q = qPool[qIdx];
  const ans = answers[qIdx];
  const color = th[q.t] || 'var(--color-brand-blue)';
  const correctCount = answers.filter(a => a.ok).length;
  const pctProgress = Math.round((qIdx / qPool.length) * 100);

  return (
    <div className="animate-in fade-in duration-300 space-y-4">
      {/* Header Info */}
      <div className="flex justify-between items-center bg-brand-dark-2/40 border border-brand-border p-2.5 px-3.5 rounded-xl text-[11px] text-slate-400">
        <span className="font-bold">
          {qIdx + 1} / {qPool.length}
        </span>
        <span className="text-emerald-400 font-extrabold flex items-center gap-1 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded">
          <CheckCircle2 className="w-3.5 h-3.5" /> {correctCount} {ui.correct2}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="bg-brand-border rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-blue to-cyan-500 transition-all duration-300" style={{ width: `${pctProgress}%` }}></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-brand-dark-2 border border-brand-border border-t-[4px] rounded-2xl p-4.5 shadow-md" style={{ borderTopColor: 'var(--cat-c)' }}>
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider" style={{ background: `${color}18`, color: color }}>
            {q.t.replace(/T\d+[^:]*:\s*/, '')}
          </span>
        </div>
        <h4 className="font-display text-sm sm:text-base font-bold text-white leading-relaxed mt-1">
          {q.q}
        </h4>
      </div>

      {/* Answer buttons */}
      <div className="space-y-2.5">
        {q.o.map((opt: string, i: number) => {
          let stateClass = "border-brand-border/60 bg-brand-dark hover:border-brand-blue hover:bg-brand-dark-2";
          let letterClass = "bg-brand-dark border-brand-border text-slate-400";
          
          if (ans) {
            stateClass = "border-brand-border/40 bg-brand-dark opacity-60 cursor-default";
            if (i === q.c) {
              stateClass = "border-emerald-500 bg-emerald-500/10 opacity-100 shadow-sm shadow-emerald-500/5";
              letterClass = "bg-emerald-500 text-white border-emerald-500";
            } else if (ans.chosen === i && !ans.ok) {
              stateClass = "border-red-500 bg-red-500/10 opacity-100";
              letterClass = "bg-red-500 text-white border-red-500";
            }
          }

          return (
            <button 
              key={i} 
              disabled={!!ans} 
              onClick={() => handleAns(i)} 
              className={cn("w-full text-left p-3.5 min-h-[48px] rounded-xl border-[1.5px] transition-all flex items-center gap-3 justify-start focus:outline-none cursor-pointer active:scale-[0.99]", stateClass)}
            >
              <span className={cn("flex items-center justify-center min-w-[26px] h-[26px] rounded-lg font-display text-[11px] font-extrabold shrink-0 border-[1.5px] tracking-none", letterClass)}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-xs sm:text-sm leading-relaxed text-slate-200 rtl:text-right font-medium">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Immediate Explanation Panel */}
      <AnimatePresence>
        {ans && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            className={cn("p-4 rounded-xl text-xs leading-relaxed flex gap-3 items-start shadow-md", ans.ok ? "bg-[rgba(26,158,82,0.06)] border border-[rgba(74,222,128,0.18)]" : "bg-[rgba(207,34,46,0.06)] border border-[rgba(248,113,113,0.18)]")}
          >
            <span className="shrink-0 mt-0.5">
              {ans.ok ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/5" />
              ) : (
                <HelpCircle className="w-5 h-5 text-red-500 fill-red-500/5" />
              )}
            </span>
            <div className="flex-1 min-w-0">
              <div className={cn("font-display text-xs font-extrabold mb-1", ans.ok ? "text-emerald-400" : "text-red-400")}>
                {ans.ok ? ui.correct : ui.wrong}
              </div>
              <p className="text-slate-300 font-sans leading-relaxed text-[11.5px]">{q.e}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Question Floating Button */}
      {ans && (
        <motion.button 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          onClick={next} 
          className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-display text-sm font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer min-h-[46px] shadow-sm shadow-brand-blue/20"
        >
          {qIdx + 1 >= qPool.length ? ui.submitEx : ui.nextQ} 
          <ArrowRight className="w-4 h-4 rtl:scale-x-[-1]" />
        </motion.button>
      )}
    </div>
  );
}
