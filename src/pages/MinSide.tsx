import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../lib/AuthContext';
import { useStore } from '../lib/store';
import { LogOut, User, Award, ShieldCheck, Clock, Zap, History, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function MinSide() {
  const { user } = useUser();
  const { lang, streak, mastered, hist, expiration } = useStore();
  const navigate = useNavigate();

  // Språkstrenger
  const t = {
    no: {
      title: 'Min Side',
      account: 'Min Konto',
      email: 'E-post',
      name: 'Navn',
      subscription: 'Abonnement',
      accessUntil: 'Premium tilgang utløper:',
      unlimited: 'Ubegrenset',
      stats: 'Min Statistikk',
      cardsLearned: 'Kort lært',
      quizzesDone: 'Quizzer fullført',
      testsTaken: 'Eksamener tatt',
      currentStreak: 'Dager på rad',
      logout: 'Logg ut',
      dateUnknown: 'Ukjent dato'
    },
    en: {
      title: 'My Page',
      account: 'My Account',
      email: 'Email',
      name: 'Name',
      subscription: 'Subscription',
      accessUntil: 'Premium access expires:',
      unlimited: 'Unlimited',
      stats: 'My Stats',
      cardsLearned: 'Cards learned',
      quizzesDone: 'Quizzes completed',
      testsTaken: 'Exams taken',
      currentStreak: 'Day streak',
      logout: 'Log out',
      dateUnknown: 'Unknown date'
    },
    ar: {
      title: 'صفحتي',
      account: 'حسابي',
      email: 'البريد الإلكتروني',
      name: 'الاسم',
      subscription: 'الاشتراك',
      accessUntil: 'ينتهي الوصول المميز في:',
      unlimited: 'غير محدود',
      stats: 'إحصائياتي',
      cardsLearned: 'البطاقات المتعلمة',
      quizzesDone: 'الاختبارات المنجزة',
      testsTaken: 'الامتحانات التي تم أخذها',
      currentStreak: 'أيام متتالية',
      logout: 'خروج',
      dateUnknown: 'تاريخ غير معروف'
    },
    pl: {
      title: 'Moja Strona',
      account: 'Moje Konto',
      email: 'E-mail',
      name: 'Imię',
      subscription: 'Subskrypcja',
      accessUntil: 'Dostęp Premium wygasa:',
      unlimited: 'Nielimitowany',
      stats: 'Moje Statystyki',
      cardsLearned: 'Nauczone karty',
      quizzesDone: 'Ukończone quizy',
      testsTaken: 'Zaliczone egzaminy',
      currentStreak: 'Dni z rzędu',
      logout: 'Wyloguj',
      dateUnknown: 'Nieznana data'
    }
  };

  const l = t[lang as keyof typeof t] || t.no;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const parsedExp = expiration ? new Date(expiration) : null;
  const isExpired = parsedExp ? parsedExp.getTime() < Date.now() : false;
  
  const formattedExp = parsedExp 
    ? new Intl.DateTimeFormat(lang === 'no' ? 'nb-NO' : lang === 'en' ? 'en-GB' : lang === 'pl' ? 'pl-PL' : 'ar-SA', { 
        day: 'numeric', month: 'long', year: 'numeric' 
      }).format(parsedExp)
    : l.unlimited;

  const qzCount = hist.filter(h => h.ty === 'q').length;
  const exCount = hist.filter(h => h.ty === 'e').length;

  return (
    <div className="flex-1 w-full flex flex-col bg-brand-dark overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 sm:gap-8 pb-20">
        
        {/* Hoved Overskrift */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue/20 to-indigo-500/20 border border-brand-blue/30 flex items-center justify-center shrink-0">
            <User className="w-8 h-8 text-brand-blue-lt" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              {l.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kort 1: Konto & Abonnement */}
          <div className="bg-brand-dark-2 rounded-2xl border border-brand-border p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-200">{l.subscription}</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="bg-white/5 rounded-xl p-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-brand-blue" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{l.accessUntil}</span>
                </div>
                <div className={`text-lg font-bold font-mono ${isExpired ? 'text-red-400' : 'text-emerald-400'}`}>
                  {formattedExp}
                </div>
              </div>

              <div className="mt-2 space-y-3 px-1">
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1">
                  <span className="text-sm text-slate-500">{l.name}</span>
                  <span className="text-sm font-medium text-slate-200">{user?.firstName || user?.email?.split('@')[0]}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1">
                  <span className="text-sm text-slate-500">{l.email}</span>
                  <span className="text-sm font-medium text-slate-200">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kort 2: Statistikk */}
          <div className="bg-brand-dark-2 rounded-2xl border border-brand-border p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <History className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-slate-200">{l.stats}</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-brand-dark rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center text-center gap-1">
                <Zap className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-2xl font-display font-bold text-white">{streak}</span>
                <span className="text-xs text-slate-400">{l.currentStreak}</span>
              </div>
              
              <div className="bg-brand-dark rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center text-center gap-1">
                <GraduationCap className="w-5 h-5 text-emerald-500 mb-1" />
                <span className="text-2xl font-display font-bold text-white">{mastered.size}</span>
                <span className="text-xs text-slate-400">{l.cardsLearned}</span>
              </div>
              
              <div className="bg-brand-dark rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center text-center gap-1">
                <Clock className="w-5 h-5 text-brand-blue-lt mb-1" />
                <span className="text-2xl font-display font-bold text-white">{qzCount}</span>
                <span className="text-xs text-slate-400">{l.quizzesDone}</span>
              </div>
              
              <div className="bg-brand-dark rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center text-center gap-1">
                <Award className="w-5 h-5 text-purple-400 mb-1" />
                <span className="text-2xl font-display font-bold text-white">{exCount}</span>
                <span className="text-xs text-slate-400">{l.testsTaken}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Utlogging for mobil eller for tydelighet i Min Side */}
        <div className="pt-4 flex justify-center md:justify-start">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 font-bold text-sm tracking-wide transition-all hover:bg-red-500/20 hover:border-red-500/40 cursor-pointer w-full md:w-auto justify-center"
          >
            <LogOut className="w-4 h-4" />
            {l.logout}
          </button>
        </div>

      </div>
    </div>
  );
}
