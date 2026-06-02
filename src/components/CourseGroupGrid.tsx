import React from 'react';
import { COURSE_GROUPS, CATS, CategoryId, Language } from '../data/q_base';
import { ArrowRight, Unlock, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../lib/store';
import { useUser } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CourseGroupGridProps {
  layoutType: 'marketing' | 'dashboard';
  onCategoryClick: (id: CategoryId) => void;
}

export function CourseGroupGrid({ layoutType, onCategoryClick }: CourseGroupGridProps) {
  const { lang, expiration } = useStore();

  const getBtnText = () => {
    return lang === 'no' ? 'Åpne test' : lang === 'en' ? 'Start study' : lang === 'ar' ? 'ابدأ الدراسة' : 'Rozpocznij';
  };

  const getUnlText = () => {
    return lang === 'no' ? 'Låst opp' : lang === 'en' ? 'Unlocked' : lang === 'ar' ? 'مفتوح' : 'Aktywny';
  };

  const getLocText = () => {
    return lang === 'no' ? 'Låst' : lang === 'en' ? 'Locked' : lang === 'ar' ? 'مغلق' : 'Zablokowany';
  };

  return (
    <div className="space-y-12">
      {COURSE_GROUPS.map((group) => {
        const groupTitle = group[lang]?.name || group.no.name;
        
        let gridClass = "";
        if (layoutType === 'marketing') {
            gridClass = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";
        } else {
            gridClass = "grid grid-cols-1 sm:grid-cols-2 gap-4";
        }

        return (
          <div key={group.id} className="flex flex-col">
            <h3 className="text-white font-display font-black text-sm tracking-widest uppercase mb-4 opacity-90 border-b border-brand-border/40 pb-2">
              {groupTitle}
            </h3>
            <div className={gridClass}>
              {group.items.map((catId) => {
                const cat = CATS.find((c) => c.id === catId);
                if (!cat) return null;
                const cd = (cat as any)[lang] || (cat as any)['no'];

                if (layoutType === 'marketing') {
                  return (
                    <div
                      key={cat.id}
                      onClick={() => onCategoryClick(cat.id as CategoryId)}
                      className="group bg-brand-dark-2 border-[1.5px] border-brand-border border-t-[3px] rounded-2xl pb-5 cursor-pointer overflow-hidden relative transition-all hover:-translate-y-1 hover:border-brand-blue/40 shadow-xl hover:shadow-black/50"
                      style={{ borderTopColor: cat.color }}
                    >
                      <div 
                        className="h-20 flex items-center justify-center text-4xl mb-4 relative overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${cat.color}08, ${cat.color}15)` }}
                      >
                        <span className="transform group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                        <div className="absolute bottom-0 left-0 right-0 h-[1.5px]" style={{ background: `linear-gradient(90deg, transparent, ${cat.color} 50%, transparent)` }}></div>
                      </div>
                      <div className="px-4">
                        <div className="font-display text-sm font-bold text-white mb-1.5 leading-snug group-hover:text-brand-blue-lt transition-colors">{cd.name}</div>
                        <div className="text-[11px] text-slate-400 leading-snug mb-4">{cd.sub}</div>
                      </div>
                      
                      <div className="px-4 mt-auto">
                        <div className="inline-flex items-center gap-1.5 font-display text-[11px] font-bold text-brand-blue-lt group-hover:text-white transition-colors">
                          {getBtnText()}
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 w-3 h-3 rounded-full opacity-30" style={{ background: cat.color }}></div>
                    </div>
                  );
                } else {
                  return (
                    <div
                        key={cat.id}
                        onClick={() => onCategoryClick(cat.id as CategoryId)}
                        className={cn(
                          "group bg-brand-dark border-[1.5px] rounded-xl p-4.5 cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col justify-between min-h-[110px]",
                          expiration 
                            ? "border-emerald-500/10 hover:border-emerald-500/30 hover:bg-emerald-500/[0.01]" 
                            : "border-brand-border hover:border-brand-blue/30"
                        )}
                      >
                        <div className="flex gap-4 items-start w-full">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-105 duration-300 shadow-sm"
                            style={{ background: `${cat.color}12`, border: `1px solid ${cat.color}25` }}
                          >
                            {cat.icon}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <h4 className="font-display font-bold text-sm text-white group-hover:text-brand-blue-lt transition-colors leading-tight truncate max-w-[150px]">
                                {cd.name}
                              </h4>
                              {expiration ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 leading-none">
                                  <Unlock className="w-2.5 h-2.5 shrink-0" />
                                  {getUnlText()}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700 leading-none">
                                  <Lock className="w-2.5 h-2.5 shrink-0 text-slate-500" />
                                  {getLocText()}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-snug line-clamp-2 mt-1">
                              {cd.sub}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3.5 pt-2.5 border-t border-brand-border/40 flex justify-between items-center w-full">
                          <span className="text-[10px] font-mono text-slate-500 tracking-wider">
                            ID: {cat.id}
                          </span>
                          <span className={cn(
                            "inline-flex items-center gap-1 text-[11px] font-bold font-display cursor-pointer",
                            expiration ? "text-emerald-400 group-hover:text-emerald-300" : "text-brand-blue-lt group-hover:text-white"
                          )}>
                            {getBtnText()}
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
