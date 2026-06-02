import React from 'react';
import { ArrowRight, BookOpen, ClipboardList, PenSquare } from 'lucide-react';
import { Language } from '../data/q_base';

interface LandingHeroProps {
  text: any;
  lang: Language;
  onStartClick: () => void;
  onLearnMoreClick: () => void;
}

export function LandingHero({ text, lang, onStartClick, onLearnMoreClick }: LandingHeroProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-48 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15),transparent_70%)] pointer-events-none"></div>
      
      <div className="flex flex-col items-center text-center relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-col items-center rtl:items-center text-center rtl:text-center w-full">
          <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/25 text-[#60a5fa] text-[11px] font-bold px-3 py-1.5 rounded-full mb-6 tracking-wide shadow-sm uppercase font-sans">
            <span className="flex h-2 w-2 rounded-full bg-brand-blue animate-pulse"></span>
            {text.heroBadge}
          </div>
          
          <h1 className="font-display text-[clamp(32px,5vw,56px)] font-extrabold tracking-[-1.5px] leading-[1.05] mb-5 text-white">
            {text.heroTitle} <br />
            <span className="bg-gradient-to-r from-brand-blue-lt to-cyan-400 bg-clip-text text-transparent">
              {text.heroSpan}
            </span>
          </h1>
          
          <p className="text-[15px] sm:text-[17px] text-slate-400 max-w-[620px] mb-8 leading-relaxed font-sans font-normal mx-auto">
            {text.heroDesc}
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={onStartClick}
              className="bg-brand-blue hover:bg-brand-blue/90 text-white font-display font-bold py-3.5 px-7 rounded-xl text-sm transition-all shadow-xl hover:shadow-brand-blue/10 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {text.ctaStart}
              <ArrowRight className="w-4 h-4 ml-0.5 rtl:ml-0 rtl:mr-0.5 rtl:scale-x-[-1]" />
            </button>
            <button
              onClick={onLearnMoreClick}
              className="bg-transparent hover:bg-white/5 border-[1.5px] border-brand-border text-slate-300 font-display font-bold py-3.5 px-6 rounded-xl text-sm transition-all flex items-center justify-center cursor-pointer"
            >
              {text.learnMore}
            </button>
          </div>
          
          <div className="text-[12px] text-slate-500 mt-3">
            🔒 {text.ctaHelp} · Statens vegvesen Læreplaner
          </div>
        </div>
      </div>
    </section>
  );
}

export function LearningModesSection({ text }: { text: any }) {
  return (
    <section className="w-full bg-brand-dark-2/40 border-y border-brand-border py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-bold text-brand-blue bg-brand-blue/10 border border-brand-blue/20 uppercase tracking-widest px-2.5 py-1 rounded inline-block mb-3">
            Målrettet læring
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-3">
            {text.modesHeader}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {text.modesDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-brand-dark-2 border border-brand-border p-6 rounded-2xl">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl flex items-center justify-center text-xl mb-5">
              <BookOpen className="w-5.5 h-5.5" />
            </div>
            <h3 className="font-display text-base font-bold text-white mb-2">{text.modeFcTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">{text.modeFcDesc}</p>
          </div>

          <div className="bg-brand-dark-2 border border-brand-border p-6 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl flex items-center justify-center text-xl mb-5">
              <PenSquare className="w-5.5 h-5.5" />
            </div>
            <h3 className="font-display text-base font-bold text-white mb-2">{text.modeQuizTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">{text.modeQuizDesc}</p>
          </div>

          <div className="bg-brand-dark-2 border border-brand-border p-6 rounded-2xl">
            <div className="w-12 h-12 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 rounded-xl flex items-center justify-center text-xl mb-5">
              <ClipboardList className="w-5.5 h-5.5" />
            </div>
            <h3 className="font-display text-base font-bold text-white mb-2">{text.modeExamTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">{text.modeExamDesc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PremiumAccessSection({ text }: { text: any }) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] font-bold text-brand-blue bg-brand-blue/10 border border-brand-blue/20 uppercase tracking-widest px-2.5 py-1 rounded inline-block mb-3">
          Access tiers
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-3">
          {text.premiumHeader}
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          {text.premiumDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-6 relative">
          <div className="text-xs font-bold text-slate-500 tracking-wider mb-2 font-mono uppercase">TIER 1</div>
          <h3 className="font-display text-lg font-bold text-white mb-3">{text.premiumCard1}</h3>
          <p className="text-xs text-slate-400 leading-relaxed min-h-[44px] mb-5">{text.premiumCard1Sub}</p>
          <div className="border-t border-brand-border pt-4">
            <div className="text-2xl font-extrabold text-white tracking-tight font-display">T24-KODE</div>
            <div className="text-[10px] text-slate-500 mt-1 leading-snug">Aktiveres enkelt via e-post biletter.</div>
          </div>
        </div>

        <div className="bg-brand-dark-2 border-2 border-brand-blue rounded-2xl p-6 relative">
          <div className="absolute top-0 right-6 -translate-y-1/2 bg-brand-blue text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
            MOST POPULAR
          </div>
          <div className="text-xs font-bold text-brand-blue tracking-wider mb-2 font-mono uppercase">TIER 2</div>
          <h3 className="font-display text-lg font-bold text-white mb-3">{text.premiumCard2}</h3>
          <p className="text-xs text-slate-400 leading-relaxed min-h-[44px] mb-5">{text.premiumCard2Sub}</p>
          <div className="border-t border-brand-border pt-4">
            <div className="text-2xl font-extrabold text-white tracking-tight font-display">D3-KODE</div>
            <div className="text-[10px] text-slate-500 mt-1 leading-snug font-sans">Full tilgang i 72 sammenhengende timer.</div>
          </div>
        </div>

        <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-6 relative">
          <div className="text-xs font-bold text-slate-500 tracking-wider mb-2 font-mono uppercase">TIER 3</div>
          <h3 className="font-display text-lg font-bold text-white mb-3">{text.premiumCard3}</h3>
          <p className="text-xs text-slate-400 leading-relaxed min-h-[44px] mb-5">{text.premiumCard3Sub}</p>
          <div className="border-t border-brand-border pt-4">
            <div className="text-2xl font-extrabold text-white tracking-tight font-display">D7-KODE</div>
            <div className="text-[10px] text-slate-500 mt-1 leading-snug">Beståttgaranti. Full ukespass.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
