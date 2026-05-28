import { useState } from 'react';
import { useStore } from '../lib/store';
import { UI, QDATA } from '../data/questions';
import { ArrowLeft, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Bank() {
  const { lang, catId } = useStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);

  if (!catId) {
    navigate('/');
    return null;
  }

  const ui = UI[lang] || UI['no'];
  const qs = QDATA[catId].q;
  
  // Flatten and prepare questions with index
  const list = qs.map((q, i) => {
    const data = q[lang] || q['no'];
    return { ...data, gi: i, original: q };
  }).filter(q => {
    if (!query) return true;
    const search = query.toLowerCase();
    return (q.q && q.q.toLowerCase().includes(search)) || 
           (q.e && q.e.toLowerCase().includes(search));
  });

  return (
    <div className="flex flex-col h-full bg-brand-dark fixed inset-0 z-50">
      {/* Topbar */}
      <div className="flex items-center gap-2 p-3 px-4 bg-brand-dark-2 border-b border-brand-border shrink-0 z-20">
        <button 
          className="flex items-center justify-center w-8 h-8 rounded-lg border-[1.5px] border-transparent hover:border-brand-border bg-transparent text-slate-400 hover:text-white transition-all shrink-0 cursor-pointer"
          onClick={() => navigate('/teori')}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 font-display text-base font-bold text-white">
          Spørsmålsbank // {list.length} Spørsmål
        </div>
      </div>

      <div className="p-4 shrink-0 bg-brand-dark-2 border-b border-brand-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Søk i spørsmål og forklaringer..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-brand-dark border-[1.5px] border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-display text-white outline-none focus:border-brand-blue transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {list.map((q, idx) => {
          const isOpen = openId === q.gi;
          return (
            <div key={q.gi} className="bg-brand-dark-2 border border-brand-border rounded-xl overflow-hidden">
              <button 
                onClick={() => setOpenId(isOpen ? null : q.gi)}
                className="w-full text-left p-4 flex items-start gap-3 hover:bg-white/5 transition-colors"
              >
                <div className="text-brand-blue font-mono text-sm mt-0.5">{q.gi + 1}.</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm font-semibold text-white leading-snug">{q.q}</div>
                  <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{q.t}</div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-brand-border/50"
                  >
                    <div className="p-4 pb-5 pl-12">
                      <div className="space-y-2 mb-4">
                        {q.o.map((opt: string, optIdx: number) => {
                          const isCorrect = q.c === optIdx;
                          return (
                            <div key={optIdx} className={cn(
                              "text-sm p-3 rounded-lg border",
                              isCorrect 
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-100 font-medium" 
                                : "bg-brand-dark border-brand-border/50 text-slate-400"
                            )}>
                              {opt}
                            </div>
                          );
                        })}
                      </div>
                      
                      {q.e && (
                        <div className="bg-[#1a2235] border border-brand-blue/30 rounded-lg p-3.5">
                          <div className="text-[11px] font-bold text-brand-blue uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Search className="w-3.5 h-3.5" /> Forklaring
                          </div>
                          <div className="text-sm text-slate-300 leading-relaxed">
                            {q.e}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {list.length === 0 && (
          <div className="text-center p-8 text-slate-400 text-sm">
            Ingen spørsmål funnet for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}

