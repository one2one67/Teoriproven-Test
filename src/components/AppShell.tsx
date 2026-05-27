import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, BookOpen, PenSquare, ClipboardList, Info } from 'lucide-react';
import { useStore } from '../lib/store';
import { CATS, UI, QDATA } from '../data/questions';
import { cn } from '../lib/utils';
import HomeTab from './tabs/HomeTab';
import FlashcardsTab from './tabs/FlashcardsTab';
import QuizTab from './tabs/QuizTab';
import ExamTab from './tabs/ExamTab';

export default function AppShell() {
  const { lang, setLang, catId, setCatId } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'home'|'fc'|'quiz'|'exam'>('home');

  if (!catId) {
    navigate('/');
    return null;
  }

  const cat = CATS.find(c => c.id === catId)!;
  const ui = UI[lang] || UI['no'];
  
  return (
    <div className="flex flex-col h-full bg-brand-dark overflow-hidden fixed inset-0 z-50">
      {/* Topbar */}
      <div className="flex items-center gap-2 p-3 px-4 bg-brand-dark-2 border-b border-brand-border shrink-0 z-20">
        <button 
          className="flex items-center justify-center w-8 h-8 rounded-lg border-[1.5px] border-transparent hover:border-brand-border bg-transparent text-slate-400 hover:text-white transition-all shrink-0 cursor-pointer"
          onClick={() => { setCatId(null); navigate('/'); }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex items-center gap-1.5 overflow-hidden min-w-0" style={{'--cat-c': cat.color} as any}>
          <span className="text-lg shrink-0">{cat.icon}</span>
          <span className="font-display text-[13px] font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">
            {(cat as any)[lang]?.name || (cat as any)['no'].name}
          </span>
        </div>
        <div className="flex flex-row gap-1 items-center">
          {['no', 'en', 'ar', 'pl'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l as any)}
              className={cn(
                "flex items-center justify-center w-7 h-7 rounded-md border-[1.5px] text-[10px] font-bold uppercase transition-all cursor-pointer",
                lang === l ? "bg-brand-blue border-brand-blue text-white" : "border-brand-border bg-transparent text-slate-400 hover:border-[#253347] hover:bg-white/5"
              )}
            >
              {l === 'ar' ? 'ع' : l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex bg-brand-dark-2 border-b border-brand-border shrink-0">
        <button onClick={() => setActiveTab('home')} className={cn("flex-1 p-2 text-center text-[10px] font-semibold cursor-pointer border-b-[2.5px] transition-all flex flex-col items-center gap-0.5", activeTab === 'home' ? "text-brand-blue border-brand-blue" : "text-[#4a5f73] border-transparent hover:text-slate-300")}>
          <Home className="w-[18px] h-[18px]" /> {ui.tHome}
        </button>
        <button onClick={() => setActiveTab('fc')} className={cn("flex-1 p-2 text-center text-[10px] font-semibold cursor-pointer border-b-[2.5px] transition-all flex flex-col items-center gap-0.5", activeTab === 'fc' ? "text-brand-blue border-brand-blue" : "text-[#4a5f73] border-transparent hover:text-slate-300")}>
          <BookOpen className="w-[18px] h-[18px]" /> {ui.tFC}
        </button>
        <button onClick={() => setActiveTab('quiz')} className={cn("flex-1 p-2 text-center text-[10px] font-semibold cursor-pointer border-b-[2.5px] transition-all flex flex-col items-center gap-0.5", activeTab === 'quiz' ? "text-brand-blue border-brand-blue" : "text-[#4a5f73] border-transparent hover:text-slate-300")}>
          <PenSquare className="w-[18px] h-[18px]" /> {ui.tQuiz}
        </button>
        <button onClick={() => setActiveTab('exam')} className={cn("flex-1 p-2 text-center text-[10px] font-semibold cursor-pointer border-b-[2.5px] transition-all flex flex-col items-center gap-0.5", activeTab === 'exam' ? "text-brand-blue border-brand-blue" : "text-[#4a5f73] border-transparent hover:text-slate-300")}>
          <ClipboardList className="w-[18px] h-[18px]" /> {ui.tExam}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 block relative" style={{'--cat-c': cat.color} as any}>
        {activeTab === 'home' && <HomeTab onNavigate={setActiveTab} />}
        {activeTab === 'fc' && <FlashcardsTab />}
        {activeTab === 'quiz' && <QuizTab />}
        {activeTab === 'exam' && <ExamTab />}
      </div>
    </div>
  );
}
