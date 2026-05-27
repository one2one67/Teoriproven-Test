import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { UI, QDATA } from '../../data/questions';
import { Play, ArrowRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

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
  const recentHist = hist.filter(h => h.ty === 'q' && h.cat === catId).slice(-5).reverse();

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
    let emoji = '📚', title = ui.grOev, color = 'var(--text)';
    if (pct >= 90) { emoji = '🏆'; title = ui.grEx; color = 'var(--color-emerald-400)'; }
    else if (pct >= 70) { emoji = '👍'; title = ui.grBra; color = '#4dd4e4'; }
    else if (pct >= 50) { emoji = '✓'; title = ui.grGod; color = 'var(--color-amber-400)'; }
    else { color = 'var(--color-red-400)'; }

    return (
      <div className="animate-in fade-in duration-300">
        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-4 mb-3 text-center">
          <div className="text-5xl mb-2">{emoji}</div>
          <div className="font-display text-[22px] font-extrabold mb-1" style={{color}}>{title}</div>
          <div className="font-display text-[38px] font-extrabold text-white mb-0">{correct} / {total}</div>
          <div className="text-xs text-slate-400 mt-1">{pct}{ui.pct}</div>
        </div>

        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-4 mb-3">
          <div className="font-display text-sm font-bold text-white mb-3">{ui.qrRevTit}</div>
          <div className="flex flex-col gap-0 border-b border-brand-border">
            {answers.map((a, i) => (
              <div key={i} className="flex gap-2.5 items-start py-2.5 border-t border-brand-border">
                <span className="shrink-0 pt-0.5">
                  {a.ok ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center text-white text-xs font-bold">✓</div>
                  ) : (
                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                      <div className="relative w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-red-600 flex items-center justify-center">
                        <span className="absolute top-[3px] -left-[2px] text-[10px] font-black text-white">!</span>
                      </div>
                    </div>
                  )}
                </span>
                <div>
                  <div className="text-xs leading-relaxed text-slate-300"><b>{i+1}.</b> {a.q.q}</div>
                  {!a.ok && <div className="text-[11px] text-emerald-400 mt-1 font-medium">{a.q.o[a.q.c]}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={start} className="flex-1 bg-gradient-to-br from-brand-blue to-[#1d5fcc] text-white font-display text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.97]">
            <Play className="w-4 h-4" /> {ui.qrRetry}
          </button>
          <button onClick={() => setPlaying(false)} className="flex-1 bg-brand-dark-2 border-[1.5px] border-brand-border text-white font-display text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.97]">
            <Home className="w-4 h-4" /> {ui.qrHome}
          </button>
        </div>
      </div>
    );
  }

  if (!playing) {
    return (
      <div className="animate-in fade-in duration-300">
        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-4 mb-3">
          <div className="font-display text-sm font-bold text-white mb-3">{ui.qzTit}</div>
          <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-widest">{ui.qzLblT}</label>
          <div className="relative mb-3">
            <select value={topic} onChange={e => setTopic(e.target.value)} className="w-full bg-brand-dark text-white border-[1.5px] border-brand-border rounded-lg p-2.5 text-sm appearance-none outline-none focus:border-brand-blue">
              <option value="all">{ui.allTopics}</option>
              {Object.keys(th).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={start} className="w-full bg-gradient-to-br from-brand-blue to-[#1d5fcc] text-white font-display text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.97]">
            <Play className="w-4 h-4" /> {ui.qzStart}
          </button>
        </div>

        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-4">
          <div className="font-display text-sm font-bold text-white mb-2">{ui.qzHistTit}</div>
          {recentHist.length === 0 ? (
            <p className="text-xs text-[#4a5f73]">{ui.noHist}</p>
          ) : (
            <div className="flex flex-col">
              {recentHist.map((h, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-brand-border last:border-b-0">
                  <span className="text-xs text-slate-400">{h.date}</span>
                  <span className={cn("font-display text-xs font-bold", h.pct >= 70 ? 'text-emerald-400' : 'text-amber-400')}>
                    {h.score}/{h.total} · {h.pct}%
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

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
        <span>{qIdx + 1} {ui.of} {qPool.length}</span>
        <span className="text-emerald-400 font-bold font-display">{correctCount} {ui.correct2}</span>
      </div>
      <div className="bg-brand-border rounded-full h-1 overflow-hidden my-2">
        <div className="h-full bg-gradient-to-r from-brand-blue to-cyan-500 transition-all duration-400" style={{ width: `${(qIdx / qPool.length) * 100}%` }}></div>
      </div>

      <div className="bg-brand-dark-2 border border-brand-border border-t-[3px] rounded-2xl p-4 mb-3" style={{ borderTopColor: 'var(--cat-c)' }}>
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] text-[10px] font-bold tracking-wider border-l-[3px] rtl:border-l-0 rtl:border-r-[3px]" style={{ background: `${color}18`, color: color, borderColor: color }}>
            {q.t.replace(/T\d+[^:]*:\s*/, '')}
          </span>
        </div>
        <div className="text-[10px] text-slate-400 mb-2 font-medium uppercase tracking-wider">{qIdx + 1} / {qPool.length}</div>
        <div className="font-display text-[clamp(15px,3.8vw,19px)] font-bold text-white leading-relaxed">
          {q.q}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {q.o.map((opt: string, i: number) => {
          let stateClass = "border-[#253347] bg-brand-dark hover:border-brand-blue hover:bg-[#1a2235]";
          let letterClass = "bg-[#1a2235] border-brand-border text-slate-400";
          
          if (ans) {
            stateClass = "border-[#253347] bg-brand-dark opacity-70 cursor-default";
            if (i === q.c) {
              stateClass = "border-emerald-600 bg-[rgba(26,158,82,0.1)] opacity-100";
              letterClass = "bg-emerald-600 text-white border-emerald-600";
            } else if (ans.chosen === i && !ans.ok) {
              stateClass = "border-red-600 bg-[rgba(207,34,46,0.1)] opacity-100";
              letterClass = "bg-red-600 text-white border-red-600";
            }
          }

          return (
            <button key={i} disabled={!!ans} onClick={() => handleAns(i)} className={cn("w-full text-left p-3 rounded-xl border-[1.5px] transition-all flex items-center gap-2.5", stateClass)}>
              <span className={cn("flex items-center justify-center min-w-[26px] h-[26px] rounded-md font-display text-[11px] font-bold shrink-0 transition-all border-[1.5px]", letterClass)}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-sm leading-relaxed text-slate-200 rtl:text-right">{opt}</span>
            </button>
          );
        })}
      </div>

      {ans && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("mt-2.5 p-3 rounded-xl text-[13px] leading-relaxed flex gap-2.5 items-start", ans.ok ? "bg-[rgba(26,158,82,0.09)] border border-[rgba(74,222,128,0.22)]" : "bg-[rgba(207,34,46,0.09)] border border-[rgba(248,113,113,0.22)]")}>
          <span className="shrink-0 mt-0.5">
            {ans.ok ? (
              <div className="w-[26px] h-[26px] rounded-full bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center text-white text-[13px] font-extrabold">✓</div>
            ) : (
              <div className="relative w-0 h-0 border-l-[13px] border-r-[13px] border-b-[24px] border-l-transparent border-r-transparent border-b-red-600 flex items-center justify-center">
                <span className="absolute top-[3px] -left-[2px] text-[10px] font-black text-white">!</span>
              </div>
            )}
          </span>
          <div>
            <div className={cn("font-display text-xs font-bold mb-1", ans.ok ? "text-emerald-400" : "text-red-400")}>
              {ans.ok ? ui.correct : ui.wrong}
            </div>
            <div className="text-slate-400">{q.e}</div>
          </div>
        </motion.div>
      )}

      {ans && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={next} className="mt-3 w-full bg-brand-blue text-white font-display text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.97]">
          {qIdx + 1 >= qPool.length ? ui.submitEx : ui.nextQ} <ArrowRight className="w-4 h-4 rtl:scale-x-[-1]" />
        </motion.button>
      )}
    </div>
  );
}
