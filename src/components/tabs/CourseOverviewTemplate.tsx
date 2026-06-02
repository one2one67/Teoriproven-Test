import React from 'react';
import { CATS, CategoryId } from '../../data/q_base';
import { useStore } from '../../lib/store';
import { COURSE_DETAILS } from '../../data/course_details';
import { ArrowLeft, BookOpen, Clock, CheckCircle2, Lock, ListTodo, ShieldCheck, HelpCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface Props {
  catId: CategoryId;
  onGoBack: () => void;
}

export function CourseOverviewTemplate({ catId, onGoBack }: Props) {
  const { lang, expiration, setCatId } = useStore();
  const cat = CATS.find(c => c.id === catId)!;
  const navigate = useNavigate();

  const details = COURSE_DETAILS[catId];
  if (!details) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-white font-display text-xl mb-4">No content available for {catId}</h2>
        <button onClick={onGoBack} className="text-brand-blue hover:text-white transition-colors">Go Back</button>
      </div>
    );
  }

  const langCode = lang === 'no' ? 'no' : lang === 'en' ? 'en' : lang === 'ar' ? 'ar' : 'pl';
  const noTrans = (en: string, no: string) => lang === 'no' ? no : lang === 'en' ? en : lang === 'ar' ? no : no; // Simplified Arabic/PL fallback for generic UI

  const overview = details.overview[langCode] || details.overview.no;
  const topics = details.topics[langCode] || details.topics.no;
  const goals = details.learningGoals[langCode] || details.learningGoals.no;
  const title = (cat as any)[lang]?.name || (cat as any)['no'].name;
  const subtitle = (cat as any)[lang]?.sub || (cat as any)['no'].sub;

  const isLocked = !expiration;

  const getBtnText = () => {
    return lang === 'no' ? 'Innhold under utvikling' : lang === 'en' ? 'Content in development' : lang === 'ar' ? 'المحتوى قيد التطوير' : 'Treść w przygotowaniu';
  };

  const getTopicsText = () => {
    return lang === 'no' ? 'Emner i kurset' : lang === 'en' ? 'Course Topics' : lang === 'ar' ? 'مواضيع الدورة' : 'Tematy kursu';
  };

  const getGoalsText = () => {
    return lang === 'no' ? 'Læringsmål' : lang === 'en' ? 'Learning Goals' : lang === 'ar' ? 'أهداف التعلم' : 'Cele nauczania';
  };

  const getPracticeText = () => {
    return lang === 'no' ? 'Start øving' : lang === 'en' ? 'Start Practice' : lang === 'ar' ? 'ابدأ التدريب' : 'Rozpocznij ćwiczenia';
  };

  return (
    <div className="flex-1 overflow-y-auto overscroll-contain bg-brand-dark p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        
        {/* Header Section */}
        <div className="bg-brand-dark-2 border border-brand-border rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-blue/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center w-full">
            <div 
              className="w-20 h-20 md:w-28 md:h-28 rounded-2xl flex items-center justify-center text-4xl md:text-5xl shrink-0 shadow-inner"
              style={{ background: `linear-gradient(135deg, ${cat.color}20, ${cat.color}05)`, border: `1px solid ${cat.color}30` }}
            >
              {cat.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-white bg-brand-border px-2.5 py-1 rounded uppercase tracking-widest font-mono">
                  {catId.toUpperCase()}
                </span>
                {isLocked && (
                  <span className="text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded flex items-center gap-1 uppercase tracking-widest">
                    <Lock className="w-3 h-3" /> {lang === 'no' ? 'Låst' : lang === 'en' ? 'Locked' : 'Locked'}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white mb-2 leading-tight">
                {title}
              </h1>
              <p className="text-sm md:text-base text-slate-400 font-sans leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Overview & Action Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Overview Description */}
            <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-6">
              <h3 className="text-[11px] font-black font-display text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-brand-blue" />
                {lang === 'no' ? 'Om dette kurset' : lang === 'en' ? 'About this course' : 'O tym kursie'}
              </h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-sans">
                {overview}
              </p>
            </div>

            {/* Topics Grid */}
            <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-6">
              <h3 className="text-[11px] font-black font-display text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-emerald-500" />
                {getTopicsText()}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topics.map((t, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 leading-snug">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-6">
              <h3 className="text-[11px] font-black font-display text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                {getGoalsText()}
              </h3>
              <ul className="space-y-3">
                {goals.map((g, i) => (
                  <li key={i} className="flex gap-3 text-xs md:text-sm text-slate-300 items-start">
                    <span className="w-5 h-5 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold border border-purple-500/20">{i + 1}</span>
                    <span className="mt-0.5 leading-relaxed">{g}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* CTA Box (Not yet ready banner) */}
            <div className="bg-brand-dark-2 border-[1.5px] border-brand-border rounded-2xl p-6 sticky top-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-white mb-2">{getBtnText()}</h4>
              <p className="text-xs text-slate-400 font-sans leading-relaxed mb-6">
                {lang === 'no' 
                  ? 'Vi legger inn teorispørsmål og læringsmateriell for dette kurset akkurat nå. Tilgangen åpnes automatisk når innholdet er kvalitetssikret.' 
                  : lang === 'en'
                  ? 'We are currently adding theory questions and study materials for this course. Access will open automatically when the content is quality assured.'
                  : lang === 'ar'
                  ? 'نحن نقوم حاليًا بإضافة أسئلة النظرية والمواد الدراسية لهذه الدورة. سيتم فتح الوصول تلقائيًا عندما يتم ضمان جودة المحتوى.'
                  : 'Aktualnie dodajemy pytania teoretyczne i materiały do nauki dla tego kursu. Dostęp zostanie otwarty automatycznie po sprawdzeniu jakości.'}
              </p>
              
              <button 
                disabled
                className="w-full bg-brand-border text-slate-500 font-display font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-white/5"
              >
                {getPracticeText()}
              </button>

              <div className="mt-4 flex gap-2 w-full justify-between pt-4 border-t border-brand-border">
                <button disabled className="flex-1 py-2 bg-brand-dark text-slate-600 rounded-lg text-[10px] uppercase font-bold flex items-center justify-center gap-1.5 cursor-not-allowed">
                  <BookOpen className="w-3.5 h-3.5" /> {lang === 'no' ? 'Kort' : lang === 'en' ? 'Cards' : lang === 'ar' ? 'بطاقات' : 'Fiszki'}
                </button>
                <button disabled className="flex-1 py-2 bg-brand-dark text-slate-600 rounded-lg text-[10px] uppercase font-bold flex items-center justify-center gap-1.5 cursor-not-allowed">
                  <HelpCircle className="w-3.5 h-3.5" /> {lang === 'no' ? 'Eksamen' : lang === 'en' ? 'Exam' : lang === 'ar' ? 'امتحان' : 'Egzamin'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
