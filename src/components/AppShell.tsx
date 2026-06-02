import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, BookOpen, PenSquare, ClipboardList, Clock, Sparkles } from 'lucide-react';
import { useStore } from '../lib/store';
import { CATS, UI, QDATA } from '../data/questions';
import { cn } from '../lib/utils';
import { useUser } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import HomeTab from './tabs/HomeTab';
import FlashcardsTab from './tabs/FlashcardsTab';
import QuizTab from './tabs/QuizTab';
import ExamTab from './tabs/ExamTab';
import { getQuestionsForCategory } from '../lib/question_engine';
import { CourseOverviewTemplate } from './tabs/CourseOverviewTemplate';

export default function AppShell() {
  const { lang, catId, setCatId, expiration } = useStore();
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'home'|'fc'|'quiz'|'exam'>('home');
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!expiration) return;
    
    // Admin
    if (expiration.getFullYear() > 2050) {
      setTimeLeft(lang === 'no' ? 'Evig' : lang === 'en' ? 'Lifetime' : lang === 'ar' ? 'مدى الحياة' : 'Dożywotnio');
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = expiration.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft(lang === 'no' ? 'Utløpt' : lang === 'en' ? 'Expired' : lang === 'ar' ? 'منتهي' : 'Wygasło');
        window.location.reload(); 
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      const formatTime = (h: number, m: number) => {
        if (h > 48) {
          const d = Math.floor(h / 24);
          if (lang === 'no') return `${d} dager igjen`;
          if (lang === 'en') return `${d} days left`;
          if (lang === 'ar') return `متبقي ${d} أيام`;
          return `${d} dni pozostało`;
        } else {
          if (lang === 'no') return `${h}t ${m}m igjen`;
          if (lang === 'en') return `${h}h ${m}m left`;
          if (lang === 'ar') return `متبقي ${h}س ${m}د`;
          return `${h}g ${m}m pozostało`;
        }
      };

      setTimeLeft(formatTime(h, m));
    }, 1000);
    
    // Trigger initially
    const initDiff = expiration.getTime() - new Date().getTime();
    if (initDiff > 0) {
       const h = Math.floor(initDiff / (1000 * 60 * 60));
       const m = Math.floor((initDiff % (1000 * 60 * 60)) / (1000 * 60));
       const formatTime = (h: number, m: number) => {
        if (h > 48) {
          const d = Math.floor(h / 24);
          if (lang === 'no') return `${d} dager igjen`;
          if (lang === 'en') return `${d} days left`;
          if (lang === 'ar') return `متبقي ${d} أيام`;
          return `${d} dni pozostało`;
        } else {
          if (lang === 'no') return `${h}t ${m}m igjen`;
          if (lang === 'en') return `${h}h ${m}m left`;
          if (lang === 'ar') return `متبقي ${h}س ${m}د`;
          return `${h}g ${m}m pozostało`;
        }
      };
      setTimeLeft(formatTime(h, m));
    }

    return () => clearInterval(interval);
  }, [expiration]);

  if (!catId) {
    navigate('/');
    return null;
  }

  const cat = CATS.find(c => c.id === catId);
  if (!cat) {
    navigate('/');
    return null;
  }

  const ui = UI[lang] || UI['no'];
  
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'amjmah87@gmail.com';
  const isAdmin = user?.primaryEmailAddress?.emailAddress === adminEmail;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isPlaceholder = !QDATA[catId] || getQuestionsForCategory(catId as any, 'no').length === 0;

  return (
    <div className="flex flex-col h-full bg-brand-dark overflow-hidden fixed inset-0 z-50">
      {/* Topbar */}
      <div className="flex items-center gap-2 p-3 px-4 bg-brand-dark-2 border-b border-brand-border shrink-0 z-20">
        <button 
          className="flex items-center justify-center w-8 h-8 rounded-lg border-[1.5px] border-transparent hover:border-brand-border bg-transparent text-slate-400 hover:text-white transition-all shrink-0 cursor-pointer"
          onClick={() => { setCatId(null); navigate('/'); }}
        >
          <ArrowLeft className="w-5 h-5 rtl:scale-x-[-1]" />
        </button>
        <div className="flex-1 flex items-center gap-1.5 overflow-hidden min-w-0" style={{'--cat-c': cat.color} as any}>
          <span className="text-lg shrink-0">{cat.icon}</span>
          <span className="font-display text-[13px] font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">
            {(cat as any)[lang]?.name || (cat as any)['no'].name}
          </span>
        </div>
        <div className="flex flex-row gap-2 items-center">
          {timeLeft && !['Evig', 'Lifetime', 'مدى الحياة', 'Dożywotnio'].includes(timeLeft) && (
            <div className="hidden sm:flex items-center justify-center gap-1.5 px-3 h-8 rounded border border-brand-border bg-white/5 text-[11px] font-bold text-slate-300">
              <Clock className="w-3.5 h-3.5 text-brand-blue" />
              {timeLeft}
            </div>
          )}
          {isAdmin && (
            <button
               onClick={() => navigate('/admin')}
               className="hidden sm:flex items-center justify-center px-3 h-8 rounded border border-red-500/30 bg-red-500/10 text-[11px] font-bold text-red-300 hover:bg-red-500/20 transition-all"
            >
              🛠 Admin
            </button>
          )}
          {/* Språkvelger fjernet for å kun vises på hjemmesiden */}
          <button
            onClick={handleSignOut}
            className="ml-1 rtl:ml-0 rtl:mr-1 flex items-center justify-center bg-white/5 border border-brand-border rounded-md hover:bg-white/10 hover:border-slate-500 cursor-pointer h-7 px-2.5 text-slate-300 hover:text-white transition-all text-[11px] font-bold"
          >
            {lang === 'no' ? 'Ut' : lang === 'en' ? 'Exit' : lang === 'ar' ? 'خروج' : 'Wyjdź'}
          </button>
        </div>
      </div>

      {!isPlaceholder ? (
        <>
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
        </>
      ) : (
        <CourseOverviewTemplate catId={catId} onGoBack={() => { setCatId(null); navigate('/'); }} />
      )}
    </div>
  );
}
