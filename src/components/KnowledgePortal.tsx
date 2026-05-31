import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, CheckCircle2, XCircle, Lightbulb, AlertTriangle, ListChecks, ArrowRight } from 'lucide-react';
import { KNOWLEDGE_CATS } from '../data/knowledge';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';

export default function KnowledgePortal() {
  const { lang } = useStore();
  const [activeCat, setActiveCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(new Set());

  // Dictionary for UI strings
  const T = {
    no: { all: 'Alle', filter: 'Søk i alle spørsmål og svar...', noResults: 'Ingen treff', hits: 'treff', tryAgain: '↩ Prøv igjen', quiz: 'Quiz' },
    en: { all: 'All', filter: 'Search all questions and answers...', noResults: 'No results', hits: 'results', tryAgain: '↩ Try again', quiz: 'Quiz' },
    ar: { all: 'الكل', filter: 'ابحث في جميع الأسئلة والأجوبة...', noResults: 'لا توجد نتائج', hits: 'نتائج', tryAgain: '↩ حاول مرة أخرى', quiz: 'اختبار' },
    pl: { all: 'Wszystkie', filter: 'Szukaj we wszystkich pytaniach i odpowiedziach...', noResults: 'Brak wyników', hits: 'wyniki', tryAgain: '↩ Spróbuj ponownie', quiz: 'Quiz' },
  };
  const t = T[lang] || T.no;

  const toggleFaq = (id: string) => {
    setExpandedFaqs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const filteredCats = useMemo(() => {
    return KNOWLEDGE_CATS.map(cat => {
      const qs = cat.faqs.filter(faq => {
        if (!searchQuery) return true;
        const qRaw = ((faq.q as any)[lang] || (faq.q as any)['no']) || '';
        const aRaw = ((faq.a as any)[lang] || (faq.a as any)['no']) || '';
        const qText = qRaw.toLowerCase();
        const aText = aRaw.toLowerCase();
        const s = searchQuery.toLowerCase();
        return qText.includes(s) || aText.includes(s);
      });
      return { ...cat, faqs: qs };
    }).filter(cat => (activeCat === 'all' || cat.id === activeCat) && cat.faqs.length > 0);
  }, [searchQuery, activeCat, lang]);

  const searchHits = KNOWLEDGE_CATS.reduce((acc, cat) => {
    return acc + cat.faqs.filter(faq => {
      const qRaw = ((faq.q as any)[lang] || (faq.q as any)['no']) || '';
      const aRaw = ((faq.a as any)[lang] || (faq.a as any)['no']) || '';
      const qText = qRaw.toLowerCase();
      const aText = aRaw.toLowerCase();
      const s = searchQuery.toLowerCase();
      return qText.includes(s) || aText.includes(s);
    }).length;
  }, 0);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-20">
      
      {/* Search box */}
      <div className="w-full max-w-2xl mx-auto mb-6 relative">
        <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.filter}
          className="w-full bg-brand-dark-2 border-[1.5px] border-brand-border rounded-xl pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2.5 text-sm outline-none focus:border-brand-blue transition-colors text-white placeholder:text-slate-500"
        />
        {searchQuery && (
          <div className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-xs text-brand-blue font-bold">
            {searchHits} {t.hits}
          </div>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveCat('all')}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-[1.5px] text-[11px] font-bold cursor-pointer transition-all",
            activeCat === 'all' ? "border-brand-blue bg-brand-blue/15 text-white" : "border-brand-border bg-transparent text-slate-400 hover:border-[#253347] hover:text-white"
          )}
        >
          {t.all}
        </button>
        {KNOWLEDGE_CATS.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-[1.5px] text-[11px] font-bold cursor-pointer transition-all",
              activeCat === cat.id ? "border-brand-blue bg-brand-blue/15 text-white" : "border-brand-border bg-transparent text-slate-400 hover:border-[#253347] hover:text-white"
            )}
          >
            <span className="text-sm">{cat.icon}</span>
            {(cat.names as any)[lang] || (cat.names as any)['no']}
          </button>
        ))}
      </div>

      {searchQuery && filteredCats.length === 0 && (
        <div className="text-center text-slate-400 text-sm py-10">
          {t.noResults}
        </div>
      )}

      {/* Categories & FAQs */}
      <div className="space-y-6">
        {filteredCats.map((cat) => {
          const catName = (cat.names as any)[lang] || (cat.names as any)['no'];
          const catIntro = (cat.intros as any)[lang] || (cat.intros as any)['no'];
          const isCatExpanded = searchQuery || activeCat === cat.id || expandedFaqs.has(`cat_header_${cat.id}`);

          return (
            <div key={cat.id} className="w-full">
              <div 
                className="flex items-center gap-3 py-4 cursor-pointer select-none group"
                onClick={() => toggleFaq(`cat_header_${cat.id}`)}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" 
                  style={{ background: cat.color + '15', border: `1.5px solid ${cat.color}30` }}
                >
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-base font-bold text-white group-hover:text-brand-blue transition-colors leading-tight">
                    {catName}
                  </h2>
                  <p className="text-xs text-slate-400 leading-snug mt-0.5">{catIntro}</p>
                </div>
                <div className="ml-auto text-[10px] font-bold text-slate-500 bg-brand-dark-2 border border-brand-border px-2 py-0.5 rounded shrink-0">
                  {cat.faqs.length} FAQ
                </div>
                <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform", isCatExpanded && "rotate-180")} />
              </div>

              {isCatExpanded && (
                <div className="flex flex-col gap-2 mt-1">
                  {cat.faqs.map((faq, fi) => {
                    const faqId = `${cat.id}_${fi}`;
                    const qTxt = (faq.q as any)[lang] || (faq.q as any)['no'];
                    const aTxt = (faq.a as any)[lang] || (faq.a as any)['no'];
                    const isExpanded = searchQuery ? true : expandedFaqs.has(faqId);

                    return (
                      <div key={faqId} className={cn(
                        "bg-brand-dark-2 border rounded-xl overflow-hidden transition-colors",
                        isExpanded ? "border-brand-blue/30" : "border-brand-border hover:border-[#253347]"
                      )}>
                        <div 
                          className="flex items-center gap-3 p-3 cursor-pointer select-none group/f"
                          onClick={() => toggleFaq(faqId)}
                        >
                          <div className="w-6 h-6 rounded flex items-center justify-center bg-brand-dark border border-brand-border text-[9px] font-bold text-slate-400 shrink-0">
                            {fi + 1}
                          </div>
                          <div className="text-[13px] font-bold text-slate-200 flex-1 leading-snug group-hover/f:text-white transition-colors">
                            {qTxt}
                          </div>
                          <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform shrink-0", isExpanded && "rotate-180")} />
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-4 pb-4 overflow-hidden"
                            >
                              <div className="text-[13px] text-slate-300 leading-relaxed max-w-3xl">
                                {aTxt.split('\n').map((line: string, idx: number) => (
                                  <React.Fragment key={idx}>
                                    {line}
                                    {idx !== aTxt.split('\n').length - 1 && <br />}
                                  </React.Fragment>
                                ))}
                              </div>

                              {/* Details */}
                              {faq.details && (faq.details as any)[lang || 'no'] && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                  {((faq.details as any)[lang || 'no']).map((db: any, di: number) => (
                                    <div key={di} className="bg-brand-dark border border-brand-border rounded-lg p-3">
                                      <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                                        <ListChecks className="w-3.5 h-3.5" />
                                        {db.title}
                                      </div>
                                      <ul className="flex flex-col gap-1.5">
                                        {db.items.map((it: string, iti: number) => (
                                          <li key={iti} className="flex gap-2 text-xs text-slate-300 leading-snug">
                                            <span className="text-brand-blue">›</span>
                                            {it}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Table */}
                              {faq.table && (
                                <div className="mt-4 overflow-x-auto border border-brand-border rounded-lg bg-brand-dark">
                                  <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                      <tr>
                                        {((faq.table.headers as any)[lang || 'no']).map((h: string, hi: number) => (
                                          <th key={hi} className="bg-brand-dark-2 p-2.5 text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-brand-border">
                                            {h}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {faq.table.rows.map((row, ri) => (
                                        <tr key={ri} className="border-b border-brand-border/50 last:border-0 hover:bg-white/[0.02]">
                                          {row.map((cell, ci) => (
                                            <td key={ci} className="p-2.5 text-slate-300">
                                              {ci === 0 ? <strong className="text-slate-100">{cell}</strong> : cell}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}

                              {/* Tips */}
                              {faq.tips && (faq.tips as any)[lang || 'no'] && (
                                <div className="flex gap-2 items-start bg-brand-blue/10 border border-brand-blue/20 p-3 rounded-lg mt-4">
                                  <Lightbulb className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                                  <div className="text-xs text-slate-300 leading-relaxed">
                                    {(faq.tips as any)[lang || 'no']}
                                  </div>
                                </div>
                              )}

                              {/* Warnings */}
                              {faq.warnings && (faq.warnings as any)[lang || 'no'] && (
                                <div className="flex gap-2 items-start bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg mt-4">
                                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                  <div className="text-xs text-slate-300 leading-relaxed">
                                    {(faq.warnings as any)[lang || 'no']}
                                  </div>
                                </div>
                              )}

                              {/* Sources */}
                              {faq.sources && (
                                <div className="flex flex-wrap gap-1.5 mt-4">
                                  {faq.sources.map((src, si) => (
                                    <span key={si} className="text-[10px] font-bold px-2 py-0.5 rounded border border-brand-blue/20 bg-brand-blue/10 text-brand-blue">
                                      {src}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Quiz module */}
                              {faq.quiz && (
                                <QuizModule qz={faq.quiz} qid={faqId} lang={lang as any} t={t} />
                              )}

                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="flex items-center gap-3 py-6 opacity-30 select-none">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-border to-transparent"></div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

function QuizModule({ qz, qid, lang, t }: { qz: any, qid: string, lang: 'no'|'en'|'ar'|'pl', t: any }) {
  const qq = qz.q[lang] || qz.q.no;
  const opts = qz.opts[lang] || qz.opts.no;
  const expl = qz.expl[lang] || qz.expl.no;
  const correct = qz.c as number;
  const letters = ['A','B','C','D'];

  const [answered, setAnswered] = useState<number | null>(null);

  const handleAnswer = (idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
  };

  const reset = () => setAnswered(null);

  return (
    <div className="bg-gradient-to-br from-brand-blue/10 to-cyan-500/5 border border-brand-blue/20 rounded-xl p-4 mt-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🧠</span>
        <h3 className="font-display font-bold text-sm text-white">{t.quiz}</h3>
      </div>
      <div className="text-[13px] font-bold text-white mb-4 leading-snug">{qq}</div>
      
      <div className="flex flex-col gap-2">
        {opts.map((opt: string, i: number) => {
          let btnClass = "bg-brand-dark border-brand-border text-slate-300 hover:border-brand-blue hover:text-white";
          if (answered !== null) {
            if (i === correct) {
              btnClass = "bg-green-500/20 border-green-500 text-green-400";
            } else if (i === answered) {
              btnClass = "bg-red-500/20 border-red-500 text-red-400";
            } else {
              btnClass = "bg-brand-dark/50 border-brand-border/50 text-slate-500";
            }
          }

          return (
            <button
              key={i}
              disabled={answered !== null}
              onClick={() => handleAnswer(i)}
              className={cn(
                "flex items-center gap-3 p-2.5 rounded-lg border-[1.5px] text-xs font-medium text-left transition-all",
                btnClass
              )}
            >
              <div className="w-5 h-5 rounded flex items-center justify-center bg-brand-border/50 text-[10px] font-bold shrink-0 font-display text-white">
                {letters[i]}
              </div>
              <span className="flex-1">{opt}</span>
              {answered !== null && i === correct && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
              {answered !== null && i === answered && i !== correct && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
            </button>
          );
        })}
      </div>

      {answered !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="bg-brand-dark p-3 rounded-lg border border-brand-border text-xs text-slate-300 leading-relaxed">
            {expl}
          </div>
          <button 
            onClick={reset}
            className="mt-3 px-4 py-2 bg-brand-blue hover:bg-brand-blue-lt text-white text-xs font-bold font-display rounded-lg transition-colors inline-block"
          >
            {t.tryAgain}
          </button>
        </motion.div>
      )}
    </div>
  );
}
