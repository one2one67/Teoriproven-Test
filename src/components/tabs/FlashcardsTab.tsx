import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { UI, QDATA } from '../../data/questions';
import { Play, X, RotateCcw, Hand, Check, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export default function FlashcardsTab() {
  const { lang, catId, mastered, toggleMastered, clearMastered } = useStore();
  const [playing, setPlaying] = useState(false);
  const [fcPool, setFcPool] = useState<any[]>([]);
  const [fcIdx, setFcIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [topic, setTopic] = useState<string>('all');
  const [filter, setFilter] = useState<string>('all');

  const ui = UI[lang] || UI['no'];
  if (!catId) return null;
  const allQs = QDATA[catId].q;
  const th = QDATA[catId].themes[lang] || QDATA[catId].themes['no'];
  const cats = [ui.allTopics, ...Object.keys(th)];

  const start = () => {
    let pool = allQs.map((q, i) => ({ ...(q[lang] || q['no']), gi: i, _no_t: (q['no'] || {}).t }));
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
    if (knew && !mastered.has(catId + '_' + gi)) {
      toggleMastered(catId + '_' + gi);
    } else if (!knew && mastered.has(catId + '_' + gi)) {
      toggleMastered(catId + '_' + gi);
    }
    setFlipped(false);
    setFcIdx(i => i + 1);
  };

  if (!playing) {
    return (
      <div className="animate-in fade-in duration-300">
        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-4 mb-3">
          <div className="font-display text-sm font-bold text-white mb-3">{ui.fcTit}</div>
          <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-widest">{ui.fcLblT}</label>
          <div className="relative mb-2.5">
            <select value={topic} onChange={e => setTopic(e.target.value)} className="w-full bg-brand-dark text-white border-[1.5px] border-brand-border rounded-lg p-2.5 text-sm appearance-none outline-none focus:border-brand-blue">
              <option value="all">{ui.allTopics}</option>
              {Object.keys(th).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-widest">{ui.fcLblF}</label>
          <div className="relative mb-3">
            <select value={filter} onChange={e => setFilter(e.target.value)} className="w-full bg-brand-dark text-white border-[1.5px] border-brand-border rounded-lg p-2.5 text-sm appearance-none outline-none focus:border-brand-blue">
              <option value="all">{ui.fcAll}</option>
              <option value="un">{ui.fcUn}</option>
              <option value="m">{ui.fcM}</option>
            </select>
          </div>
          <button onClick={start} className="w-full bg-gradient-to-br from-brand-blue to-[#1d5fcc] text-white font-display text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.97]">
            <Play className="w-4 h-4" /> {ui.fcStart}
          </button>
        </div>
        <div className="bg-[rgba(29,111,235,0.07)] border border-[rgba(29,111,235,0.18)] rounded-xl p-3 text-xs text-slate-400 leading-relaxed flex gap-2 items-start mt-3">
          <span className="text-brand-blue mt-[1px]"><i className="ti ti-info-circle"></i></span>
          <span>{ui.fcHintTxt}</span>
        </div>
      </div>
    );
  }

  if (fcIdx >= fcPool.length) {
    return (
      <div className="animate-in fade-in duration-300 text-center pt-8 px-2">
        <div className="text-5xl mb-2.5">🎉</div>
        <div className="font-display text-lg font-extrabold text-white mb-6">{ui.fcDoneTit}</div>
        <button onClick={start} className="w-full bg-gradient-to-br from-brand-blue to-[#1d5fcc] text-white font-display text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 mb-2 transition-all active:scale-[0.97]">
          <Play className="w-4 h-4" /> {ui.fcAgain}
        </button>
        <button onClick={() => setPlaying(false)} className="w-full bg-brand-dark-2 border-[1.5px] border-brand-border text-white font-display text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.97]">
          <ArrowLeft className="w-4 h-4" /> {ui.fcHome}
        </button>
      </div>
    );
  }

  const q = fcPool[fcIdx];
  const color = th[q.t] || 'var(--color-brand-blue)';

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => setPlaying(false)} className="bg-transparent border-none text-slate-400 cursor-pointer text-[13px] flex items-center gap-1 hover:text-white">
          <X className="w-4 h-4" /> {ui.fcBack}
        </button>
        <span className="font-display text-xs font-bold text-slate-400">{fcIdx + 1} {ui.of} {fcPool.length}</span>
        <button onClick={() => { if (confirm(ui.resetConfirm)) { clearMastered(); setPlaying(false); } }} className="bg-transparent border-none text-slate-500 cursor-pointer text-[11px] flex items-center gap-1 hover:text-slate-300">
          <RotateCcw className="w-3 h-3" /> {ui.fcReset}
        </button>
      </div>

      <div className="bg-brand-border rounded-full h-1 overflow-hidden my-2">
        <div className="h-full bg-gradient-to-r from-brand-blue to-cyan-500 transition-all duration-400" style={{ width: `${(fcIdx / fcPool.length) * 100}%` }}></div>
      </div>

      <div className="mb-1">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] text-[10px] font-bold tracking-wider border-l-[3px] rtl:border-l-0 rtl:border-r-[3px]" style={{ background: `${color}18`, color: color, borderColor: color }}>
          {q.t.replace(/T\d+[^:]*:\s*/, '')}
        </span>
      </div>

      <div className="perspective-[1200px] w-full min-h-[230px] cursor-pointer mb-3" onClick={() => setFlipped(true)}>
        <motion.div 
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full min-h-[230px] transform-style-3d"
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-brand-dark-2 border-[1.5px] border-brand-border border-t-[3px] rounded-2xl p-6 flex flex-col justify-center" style={{ borderTopColor: 'var(--cat-c)' }}>
            <div className="text-[11px] text-slate-500 text-center mb-3.5 flex items-center justify-center gap-1">
              <Hand className="w-3.5 h-3.5" /> {ui.fcHint}
            </div>
            <div className="font-display text-[clamp(15px,3.5vw,18px)] font-bold text-white leading-relaxed text-center rtl:text-right">
              {q.q}
            </div>
          </div>
          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-brand-dark-2 border-[1.5px] border-brand-border border-t-[3px] border-t-emerald-500 rounded-2xl p-6 flex flex-col justify-center" style={{ transform: 'rotateY(180deg)' }}>
            <div className="text-sm text-emerald-400 font-semibold mb-2.5 leading-snug">
              {q.o[q.c]}
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              {q.e}
            </div>
          </div>
        </motion.div>
      </div>

      {flipped && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 mt-2">
          <button onClick={() => mark(false)} className="flex-1 bg-[rgba(207,34,46,0.13)] text-red-400 border-[1.5px] border-[rgba(207,34,46,0.28)] font-display text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.97]">
            <RotateCcw className="w-4 h-4" /> {ui.fcMore}
          </button>
          <button onClick={() => mark(true)} className="flex-1 bg-gradient-to-br from-emerald-600 to-[#138340] text-white font-display text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.97] border-0">
            <Check className="w-4 h-4" /> {ui.fcGot}
          </button>
        </motion.div>
      )}
    </div>
  );
}
