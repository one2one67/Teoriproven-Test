import React from 'react';
import { useStore } from '../../lib/store';
import { UI, QDATA, CATS } from '../../data/questions';
import { Flame, BookOpen, PenSquare, ClipboardList, ChevronRight } from 'lucide-react';

export default function HomeTab({ onNavigate }: { onNavigate: (tab: 'fc'|'quiz'|'exam') => void }) {
  const { lang, catId, streak, hist, mastered } = useStore();
  const ui = UI[lang] || UI['no'];
  
  if (!catId) return null;
  const qs = QDATA[catId].q;
  const doneCount = qs.filter((_, i) => mastered.has(catId + '_' + i)).length;
  
  const hQs = hist.filter(h => h.ty === 'q' && h.cat === catId).length;
  const hEx = hist.filter(h => h.ty === 'e' && h.cat === catId && h.passed).length;
  
  const th = QDATA[catId].themes[lang] || QDATA[catId].themes['no'];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-3 bg-gradient-to-br from-[rgba(212,160,23,0.1)] to-[rgba(212,160,23,0.03)] border border-[rgba(212,160,23,0.22)] rounded-xl p-3 px-3.5 mb-3">
        <span className="text-2xl"><Flame className="w-8 h-8 text-amber-500 fill-amber-500" /></span>
        <div>
          <div className="text-[11px] text-slate-400 mb-[1px]">{ui.hStrLbl}</div>
          <div className="font-display text-[22px] font-extrabold text-amber-400 leading-none">{streak}</div>
        </div>
        <div className="ml-auto text-[10px] text-slate-400 text-right">
          <span>{ui.hStrDays}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-brand-dark-2 border border-brand-border rounded-xl p-3 flex flex-col items-center text-center">
          <div className="font-display text-xl font-extrabold text-white leading-none">{doneCount}/{qs.length}</div>
          <div className="text-[10px] text-slate-400 mt-1 leading-snug">{ui.hsMl}</div>
        </div>
        <div className="bg-brand-dark-2 border border-brand-border rounded-xl p-3 flex flex-col items-center text-center">
          <div className="font-display text-xl font-extrabold text-white leading-none">{hQs}</div>
          <div className="text-[10px] text-slate-400 mt-1 leading-snug">{ui.hsQl}</div>
        </div>
        <div className="bg-brand-dark-2 border border-brand-border rounded-xl p-3 flex flex-col items-center text-center">
          <div className="font-display text-xl font-extrabold text-white leading-none">{hEx}</div>
          <div className="text-[10px] text-slate-400 mt-1 leading-snug">{ui.hsEl}</div>
        </div>
      </div>

      <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-4 mb-3">
        <div className="font-display text-sm font-bold text-white mb-3">{ui.hProg}</div>
        <div className="flex flex-col gap-2">
          {Object.entries(th).map(([t, color]) => {
            const tqs = qs.map((q, i) => ({ q, i })).filter(({ q }) => {
              const d = q[lang] || q['no'] || {};
              return d.t === t;
            });
            const tc = tqs.filter(({ i }) => mastered.has(catId + '_' + i)).length;
            const pct = tqs.length ? Math.round((tc / tqs.length) * 100) : 0;
            const shortName = t.replace(/T\d+[^:]*:\s*/, '');
            return (
              <div key={t} className="flex items-center gap-2">
                <div className="text-[11px] text-slate-400 min-w-[90px] whitespace-nowrap overflow-hidden text-ellipsis rtl:text-right">{shortName}</div>
                <div className="flex-1 bg-brand-border rounded-full h-[5px] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color as string }}></div>
                </div>
                <div className="text-[10px] text-slate-400 min-w-[28px] text-right font-mono rtl:text-left">{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2.5 my-3.5 text-[#4a5f73] text-[10px] font-bold tracking-[0.1em] uppercase before:content-[''] before:flex-1 before:h-[1px] before:bg-[repeating-linear-gradient(90deg,var(--color-brand-border)_0,var(--color-brand-border)_8px,transparent_8px,transparent_14px)] after:content-[''] after:flex-1 after:h-[1px] after:bg-[repeating-linear-gradient(90deg,var(--color-brand-border)_0,var(--color-brand-border)_8px,transparent_8px,transparent_14px)]">
        {ui.hModesLbl}
      </div>

      <div onClick={() => onNavigate('fc')} className="bg-brand-dark-2 border-[1.5px] border-brand-border rounded-2xl p-3.5 mb-2.5 cursor-pointer flex items-center gap-3 transition-all hover:border-brand-blue hover:bg-brand-dark active:scale-[0.98]">
        <div className="w-11 h-11 rounded-xl bg-brand-dark border border-[#253347] flex items-center justify-center text-xl shrink-0 text-amber-500">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-sm font-bold text-white mb-0.5">{ui.hmFC}</div>
          <div className="text-[11px] text-slate-400 leading-snug">{ui.hmFCd}</div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#4a5f73] shrink-0 rtl:scale-x-[-1]" />
      </div>

      <div onClick={() => onNavigate('quiz')} className="bg-brand-dark-2 border-[1.5px] border-brand-border rounded-2xl p-3.5 mb-2.5 cursor-pointer flex items-center gap-3 transition-all hover:border-brand-blue hover:bg-brand-dark active:scale-[0.98]">
        <div className="w-11 h-11 rounded-xl bg-brand-dark border border-[#253347] flex items-center justify-center text-xl shrink-0 text-emerald-500">
          <PenSquare className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-sm font-bold text-white mb-0.5">{ui.hmQZ}</div>
          <div className="text-[11px] text-slate-400 leading-snug">{ui.hmQZd}</div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#4a5f73] shrink-0 rtl:scale-x-[-1]" />
      </div>

      <div onClick={() => onNavigate('exam')} className="bg-brand-dark-2 border-[1.5px] border-brand-border rounded-2xl p-3.5 mb-2.5 cursor-pointer flex items-center gap-3 transition-all hover:border-brand-blue hover:bg-brand-dark active:scale-[0.98]">
        <div className="w-11 h-11 rounded-xl bg-brand-dark border border-[#253347] flex items-center justify-center text-xl shrink-0 text-cyan-500">
          <ClipboardList className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-sm font-bold text-white mb-0.5">{ui.hmEx}</div>
          <div className="text-[11px] text-slate-400 leading-snug">{ui.hmExd}</div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#4a5f73] shrink-0 rtl:scale-x-[-1]" />
      </div>

    </div>
  );
}
