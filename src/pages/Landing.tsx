import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  PenSquare, 
  ClipboardList, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  ArrowRight, 
  Loader2, 
  Flame,
  Award,
  HelpCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { CATS, UI, CategoryId } from '../data/questions';
import { useStore } from '../lib/store';
import { useUser } from '../lib/AuthContext';
import { getSupabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import KnowledgePortal from '../components/KnowledgePortal';

const L = {
  no: {
    heroBadge: "Statens vegvesen Læreplaner",
    heroTitle: "Kildebasert kunnskap til din teoriprøve",
    heroSpan: "med 100% trygghet",
    heroDesc: "Forbered deg effektivt til teoriprøver for varebil, taxi, drosje og lastebilløyver i Norge. Teorigo leverer nøyaktig kildebasert kunnskap tilpasset dine læringsbehov.",
    ctaStart: "Begynn gratis øving",
    ctaHelp: "Ingen kredittkort kreves",
    learnMore: "Lær mer under",
    
    trustVerify: "100% Kildebasert Kvalitet",
    trustBadge: "Sertifisert kunnskapsbase",
    trustDesc: "Alt vårt innhold er nøyaktig basert på Lovdata, vegdirektoratets rundskriv og Statens vegvesen sine offisielle retningslinjer for yrkessjåførereksamen.",
    
    modesHeader: "Interaktive læringsmoduser",
    modesDesc: "Tre unike formater som garanterer optimal memorering av tungt stoff og raskere progresjon.",
    modeFcTitle: "🃏 Flashkort (Spørsmål & Svar)",
    modeFcDesc: "Perfekt for å trene inn begreper og nøkkelregler. Appen husker hvilke emner du må øve mer på.",
    modeQuizTitle: "✍️ Quiz med dype forklaringer",
    modeQuizDesc: "Øv med flervalgsoppgaver. Hvert spørsmål har pedagogiske forklaringer med henvisning til norsk lov.",
    modeExamTitle: "📋 Eksamensimulator",
    modeExamDesc: "En nøyaktig kopi av den virkelige teoriprøven hos Statens vegvesen. Tidsbegrenset på 45 minutter med samme krav.",
    
    premiumHeader: "Enkel tilgang over hele linjen",
    premiumDesc: "Lås opp uavbrutt tilgang til hele teoribanken. Du aktiverer din tilgang på sekunder med en engangskode.",
    premiumCard1: "T24 - 24 timer tilgang",
    premiumCard1Sub: "Perfekt for intensiv repetisjon rett før din offisielle prøve.",
    premiumCard2: "D3 - 3 dager tilgang",
    premiumCard2Sub: "Vår mest populære pakke for grundig forberedelse over en helg.",
    premiumCard3: "D7 - 7 dager tilgang",
    premiumCard3Sub: "Full ukesbillett for deg som vil sikre bestått på første forsøk.",
    premiumActivationTitle: "Aktiver tilgang",
    premiumActivationDesc: "Har du en tilgangskode? Skriv den inn her for å låse opp innholdet med en gang.",
    premiumActivateBtn: "Aktiver kode",
    
    faqSectionTitle: "Ofte stilte spørsmål og svar",
    faqSectionDesc: "Finn raske, nøyaktige svar om løyvebestemmelser, eksamenskrav, tidsfrister og saksbehandling.",
    
    dashboardTitle: "Ditt personlige læringssenter",
    dashboardDesc: "Velg din lisenskategori nedenfor for å åpne det dedikerte læringsverktøyet.",
    activeEntitlement: "Aktiv tilgang:",
    activeHours: "gjenstår av din tilgangsperiode.",
    noActivePlan: "Ingen aktiv uke- eller dagsbillett registrert.",
    hasCodePrompt: "Har du en tilgangskode? Tast den inn under for å låse opp teoribanken med en gang:",
    enterCodePlh: "Skriv kode her (f.eks. D3-XXXX)",
    activateBtn: "Aktiver og lås opp",
    adminBtn: "🛠 Gå til admin-panelet",
    hello: "Velkommen,",
    selectCatToStart: "Velg din teoriprøve for å starte læringen"
  },
  en: {
    heroBadge: "Public Roads Administration Curriculums",
    heroTitle: "Source-Verified Theory for Commercial Exams",
    heroSpan: "with 100% confidence",
    heroDesc: "Prepare efficiently for theory tests for light vans, taxis, driver permits, and heavy trucks in Norway. Teorigo supplies accurate, source-based knowledge optimized for quick learning.",
    ctaStart: "Start free practice",
    ctaHelp: "No credit card required",
    learnMore: "Learn more below",
    
    trustVerify: "100% Verified Source Material",
    trustBadge: "Certified knowledge base",
    trustDesc: "All our curriculum layouts are strictly designed around Lovdata, official road safety circulars, and national road board regulations.",
    
    modesHeader: "Interactive Study Methods",
    modesDesc: "Three tailor-made learning modes to maximize retention and keep track of your performance.",
    modeFcTitle: "🃏 Interactive Flashcards",
    modeFcDesc: "Perfect for initial retention. Flip cards to test recollection. The engine tracks your struggle cards.",
    modeQuizTitle: "✍️ Quizzes with Explanations",
    modeQuizDesc: "Take targeted multiple choice queries showing instant feedback, official sources, and tips.",
    modeExamTitle: "📋 Genuine Exam Simulator",
    modeExamDesc: "Mimics the genuine state exam with identical timing (45 mins) and grading bounds, with zero hints.",
    
    premiumHeader: "Premium Access · Clear and Forseeable",
    premiumDesc: "Get full uninterrupted entry to the complete question bank. Instantly redeem a key sent to your user email.",
    premiumCard1: "T24 - 24-Hour Access",
    premiumCard1Sub: "Excellent choice for super-intensive revision hours right before your appointment.",
    premiumCard2: "D3 - 3-Day Pass",
    premiumCard2Sub: "Our most popular candidate choice to study over an active weekend block.",
    premiumCard3: "D7 - 1-Week Access",
    premiumCard3Sub: "Full week access to pass the theory of heavy transport or taxi drivers perfectly.",
    premiumActivationTitle: "Activate Access Pass",
    premiumActivationDesc: "Acquired a token key? Key it below to start your study timer immediately.",
    premiumActivateBtn: "Redeem Access Key",
    
    faqSectionTitle: "Frequently Asked Questions",
    faqSectionDesc: "Find immediate answers regarding licensing terms, examination routines, and Norwegian transport laws.",
    
    dashboardTitle: "Your Learning Hub",
    dashboardDesc: "Select your commercial license class below to enter the workspace.",
    activeEntitlement: "Active access:",
    activeHours: "remaining in your license window.",
    noActivePlan: "No active premium study duration detected on your account.",
    hasCodePrompt: "Do you have an access token? Insert it below to launch premium features:",
    enterCodePlh: "Enter code here (e.g., D3-XXXX)",
    activateBtn: "Unlock study bank",
    adminBtn: "🛠 Open Admin Dashboard",
    hello: "Welcome,",
    selectCatToStart: "Select your theory test category to start studying"
  },
  ar: {
    heroBadge: "مناهج إدارة الطرق العامة النرويجية",
    heroTitle: "معرفة مستندة للمصادر لقطاع النقل",
    heroSpan: "بثقة كاملة وموثوقية عالية",
    heroDesc: "استعد بذكاء للاختبارات النظرية لرخص سيارات الأجرة، الشاحنات، وسيارات النقل في النرويج. نقدم لك مادة علمية معتمدة ومحدثة.",
    ctaStart: "ابدأ الدراسة مجاناً",
    ctaHelp: "لا يتطلب بطاقة ائتمان",
    learnMore: "تعرف على المزيد أدناه",
    
    trustVerify: "جودة مستندة للمصادر بنسبة ١٠٠٪",
    trustBadge: "قاعدة معرفية معتمدة",
    trustDesc: "تستند جميع المواد التعليمية لدينا بدقة إلى نظام القوانين واللوائح الرسمية لاختبارات السائقين المهنيين في النرويج.",
    
    modesHeader: "أوضاع تعلم تفاعلية",
    modesDesc: "ثلاث طرق تعلم ذكية تضمن لك حفظ وتنظيم المعلومات بفاعلية تامة.",
    modeFcTitle: "🃏 بطاقات التعلم السريعة",
    modeFcDesc: "ممتازة لحفظ المفاهيم والقواعد الرئيسية عن طريق السحب والقلب مع تتبع مستواك.",
    modeQuizTitle: "✍️ اختبارات مع الشرح المفصل",
    modeQuizDesc: "أجب عن الأسئلة المتعددة وتعرف على الإجابة الصحيحة فوراً مع التبرير القانوني والشرح.",
    modeExamTitle: "📋 محاكاة الامتحان الرسمي",
    modeExamDesc: "نسخة مطابقة للاختبار النظري الحقيقي لدى مصلحة الطرق النرويجية. وقت محدد وبدون تلميحات.",
    
    premiumHeader: "اشتراك بريميوم · مرونة ووضوح تام",
    premiumDesc: "احصل على وصول غير محدود لكامل بنك الأسئلة والتمارين بأسعار منخفضة وفورية عن طريق الكود.",
    premiumCard1: "T24 - صلاحية ٢٤ ساعة",
    premiumCard1Sub: "خيار رائع للمراجعة المركزة والمكثفة قبل موعد الامتحان بيوم واحد.",
    premiumCard2: "D3 - صلاحية ٣ أيام",
    premiumCard2Sub: "الباقة الأكثر مبيعاً للتحضير والدراسة على مدار عطلة نهاية الأسبوع.",
    premiumCard3: "D7 - صلاحية ٧ أيام",
    premiumCard3Sub: "أسبوع كامل لدراسة كافة المحاور وحل جميع النماذج لضمان النجاح.",
    premiumActivationTitle: "تفعيل الكود",
    premiumActivationDesc: "هل حصلت على كود تفعيل؟ أدخله هنا لفتح المنصة فوراً.",
    premiumActivateBtn: "تفعيل الكود",
    
    faqSectionTitle: "الأسئلة الشائعة حول اختبارات المرور",
    faqSectionDesc: "تصفح الإجابات الشافية عن شروط الرخص وإجراءات الفحوصات والامتحانات الرسمية في النرويج.",
    
    dashboardTitle: "مركز التعليم الخاص بك",
    dashboardDesc: "اختر فئة الرخصة أدناه للبدء بالدراسة الفورية وحل الأسئلة المعتمدة.",
    activeEntitlement: "الوصول النشط:",
    activeHours: "متبقية في صلاحية اشتراكك.",
    noActivePlan: "لا يوجد اشتراك نشط مسجل لحسابك حالياً.",
    hasCodePrompt: "هل لديك كود تفعيل؟ أدخله أدناه لفتح المنصة وبدء الدراسة:",
    enterCodePlh: "ادخل الرمز هنا",
    activateBtn: "تفعيل الكود والبدء",
    adminBtn: "🛠 لوحة التحكم للمشرفين",
    hello: "مرحباً بك،",
    selectCatToStart: "اختر فئة الاختبار للبدء في المذاكرة"
  },
  pl: {
    heroBadge: "Oficjalna podstawa programowa Statens Vegvesen",
    heroTitle: "Dedykowana Teoria do Egzaminów w Norwegii",
    heroSpan: "ze 100% pewnością",
    heroDesc: "Przygotuj się skutecznie do egzaminów teoretycznych na busy, taksówki, przewóz osób i towarów. Teorigo zapewnia rzetelną wiedzę opartą na norweskich przepisach.",
    ctaStart: "Rozpocznij darmową naukę",
    ctaHelp: "Nie wymagamy karty płatniczej",
    learnMore: "Sprawdź szczegóły poniżej",
    
    trustVerify: "100% Sprawdzone Przepisy i Źródła",
    trustBadge: "Certyfikowana baza wiedzy",
    trustDesc: "Cały program szkolenia opiera się precyzyjnie na norweskim kodeksie drogowym, okólnikach dyrekcji dróg i Statens vegvesen.",
    
    modesHeader: "Interaktywne Tryby Nauki",
    modesDesc: "Trzy niezależne metody dydaktyczne gwarantujące rewelacyjne efekty i szybką progresję.",
    modeFcTitle: "🃏 Aktywne Fiszki",
    modeFcDesc: "Odwracaj karty, by uczyć się definicji i wskaźników prawnych. Aplikacja uczy się, co sprawia Ci trudność.",
    modeQuizTitle: "✍️ Quizy z Wyjaśnieniem",
    modeQuizDesc: "Rozwiązuj pytania jednokrotnego wyboru wraz z natychmiastowym, pełnym komentarzem dydaktycznym.",
    modeExamTitle: "📋 Symulator Egzaminu",
    modeExamDesc: "Wzorowany wiernie na państwowym egzaminie w Norweskim Zarządzie Dróg. 45 minut, brak podpowiedzi.",
    
    premiumHeader: "Dostęp Premium · Prosto i Uczciwie",
    premiumDesc: "Uzyskaj nieograniczony dostęp do bazy pytań. Aktywuj kodem wysłanym na Twój adres e-mail.",
    premiumCard1: "T24 - Dostęp na 24 godziny",
    premiumCard1Sub: "Doskonały wybór na intensywną powtórkę w przeddzień egzaminu państwowego.",
    premiumCard2: "D3 - Dostęp na 3 dni",
    premiumCard2Sub: "Optymalny pakiet do gruntownej nauki przez cały weekend.",
    premiumCard3: "D7 - Dostęp na 7 dni",
    premiumCard3Sub: "Pełny, tygodniowy bilet dający czas na sprawdzenie każdego tematu i pewny sukces.",
    premiumActivationTitle: "Aktywuj kod",
    premiumActivationDesc: "Posiadasz bilet kodowy? Wpisz go poniżej, by natychmiast odblokować naukę.",
    premiumActivateBtn: "Uruchom dostęp",
    
    faqSectionTitle: "Często Zadawane Pytania (FAQ)",
    faqSectionDesc: "Znajdź istotne informacje na temat warunków licencjonowania, opłat i terminów egzaminów.",
    
    dashboardTitle: "Twój Panel Nauki",
    dashboardDesc: "Wybierz poniżej swoją kategorię prawa jazdy/licencji, aby wejść do bazy pytań.",
    activeEntitlement: "Aktywny dostęp:",
    activeHours: "pozostało z Twojego dostępu.",
    noActivePlan: "Brak aktywnego dostępu premium na Twoim koncie.",
    hasCodePrompt: "Posiadasz kod dostępu? Wpisz go poniżej, by odblokować bazę pytań:",
    enterCodePlh: "Wpisz kod tutaj",
    activateBtn: "Odblokuj dostęp teraz",
    adminBtn: "🛠 Przejdź do panelu Admina",
    hello: "Witaj,",
    selectCatToStart: "Wybierz kategorię egzaminu, aby rozpocząć naukę"
  }
};

export default function Landing() {
  const { lang, setCatId, expiration, setExpiration } = useStore();
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  // Access Code activation state directly on the dashboard
  const [code, setCode] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');
  const [timeLeftStr, setTimeLeftStr] = useState('');

  // Update dynamic active subscription countdown on dashboard
  useEffect(() => {
    if (!expiration) {
      setTimeLeftStr('');
      return;
    }
    
    if (expiration.getFullYear() > 2050) {
      setTimeLeftStr(lang === 'no' ? 'Livstid / Evig' : lang === 'en' ? 'Lifetime / Permanent' : lang === 'ar' ? 'أبدي / مدى الحياة' : 'Dożywotni');
      return;
    }

    const calcTime = () => {
      const now = new Date();
      const diff = expiration.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeftStr(lang === 'no' ? 'Utløpt' : lang === 'en' ? 'Expired' : lang === 'ar' ? 'منتهي الصلاحية' : 'Wygasł');
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (h > 48) {
        const d = Math.floor(h / 24);
        setTimeLeftStr(lang === 'no' ? `${d} dager` : lang === 'en' ? `${d} days` : lang === 'ar' ? `${d} أيام` : `${d} dni`);
      } else {
        setTimeLeftStr(`${h}t ${m}m`);
      }
    };

    calcTime();
    const interval = setInterval(calcTime, 10000);
    return () => clearInterval(interval);
  }, [expiration, lang]);

  useEffect(() => {
    document.body.className = lang === 'ar' ? 'rtl' : lang === 'pl' ? 'pl-font' : '';
  }, [lang]);

  useEffect(() => {
    if (isSignedIn && user) {
      const checkActiveAccess = async () => {
        try {
          const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'amjmah87@gmail.com';
          const userId = user?.primaryEmailAddress?.emailAddress || user?.id;

          if (userId === adminEmail) {
            setExpiration(new Date('2099-12-31T23:59:59Z'));
            return;
          }

          const supabaseObj = getSupabase();
          const { data, error } = await supabaseObj
            .from('access_codes')
            .select('expires_at')
            .eq('redeemed_by', userId)
            .eq('is_used', true)
            .gte('expires_at', new Date().toISOString())
            .order('expires_at', { ascending: false })
            .limit(1);

          if (!error && data && data.length > 0 && data[0].expires_at) {
            setExpiration(new Date(data[0].expires_at));
          }
        } catch (e) {
          console.error('Error fetching active access on landing mount:', e);
        }
      };
      checkActiveAccess();
    }
  }, [isSignedIn, user, setExpiration]);

  const handleCategoryClick = (id: CategoryId) => {
    if (isSignedIn) {
      setCatId(id);
      navigate('/teori');
    } else {
      setCatId(id);
      navigate(`/auth?redirect=/teori`);
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !user) return;
    setCodeLoading(true);
    setCodeError('');
    setCodeSuccess('');

    const inputCode = code.trim().toUpperCase();
    const userId = user.primaryEmailAddress?.emailAddress || user.id;

    try {
      const supabase = getSupabase();
      
      const { data: codeData, error: fetchError } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', inputCode)
        .single();

      if (fetchError || !codeData) {
        throw new Error(lang === 'no' ? 'Koden finnes ikke eller er ugyldig.' : 'Verification code is invalid or does not exist.');
      }

      if (codeData.is_used) {
        if (codeData.redeemed_by === userId && codeData.expires_at) {
          const exp = new Date(codeData.expires_at);
          if (exp > new Date()) {
            setExpiration(exp);
            setCode('');
            setCodeSuccess(lang === 'no' ? 'Koden er allerede aktiv på din konto!' : 'Code is already active on this account!');
            return;
          } else {
            throw new Error(lang === 'no' ? 'Denne koden har utløpt.' : 'This access token has expired.');
          }
        }
        throw new Error(lang === 'no' ? 'Denne koden er allerede benyttet.' : 'This access token has already been used.');
      }

      let days = codeData.plan_days;
      let hours = 0;
      if (inputCode.startsWith('T24-')) { days = 0; hours = 24; }
      else if (inputCode.startsWith('D3-')) { days = 3; }
      else if (inputCode.startsWith('D7-')) { days = 7; }

      const expDate = new Date();
      expDate.setDate(expDate.getDate() + days);
      expDate.setHours(expDate.getHours() + hours);

      const { error: updateError } = await supabase
        .from('access_codes')
        .update({
          is_used: true,
          redeemed_by: userId,
          expires_at: expDate.toISOString()
        })
        .eq('code', inputCode);

      if (updateError) {
        throw new Error(lang === 'no' ? 'Kunne ikke oppdatere koden.' : 'Could not upgrade access code credentials.');
      }

      setExpiration(expDate);
      setCode('');
      
      let tierDetails = '';
      if (inputCode.startsWith('T24-')) {
        tierDetails = lang === 'no' ? '24 timer (1 dag)' : '24 hours (1 day)';
      } else if (inputCode.startsWith('D3-')) {
        tierDetails = lang === 'no' ? '3 dagers fulltilgang' : '3 days full access';
      } else if (inputCode.startsWith('D7-')) {
        tierDetails = lang === 'no' ? '7 dagers fulltilgang (Beståttgaranti)' : '7 days full access';
      } else {
        tierDetails = `${codeData.plan_days} ${lang === 'no' ? 'dager' : 'days'}`;
      }

      setCodeSuccess(lang === 'no' 
        ? `Lykkes! Koden din (${tierDetails}) er aktivert. Teoriprøvene dine er nå helt låst opp!` 
        : `Success! Your access pass (${tierDetails}) is online. Premium features are fully unlocked!`);
    } catch (err: any) {
      setCodeError(err.message || 'Error activating code');
    } finally {
      setCodeLoading(false);
    }
  };

  const ui = UI[lang] || UI['no'];
  const text = L[lang] || L['no'];
  
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'amjmah87@gmail.com';
  const isAdmin = user?.primaryEmailAddress?.emailAddress === adminEmail;

  return (
    <div className="min-h-[100dvh] bg-brand-dark flex flex-col relative w-full overflow-y-auto" style={{
      background: 'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(37,99,235,0.06), transparent), var(--color-brand-dark)',
      paddingBottom: '100px'
    }}>

      {/* DUAL LAYER CONFIGURATION */}
      {!isSignedIn ? (
        /* LAYER 1: PUBLIC EXPLANATORY & MARKETING PORTAL */
        <div className="w-full">
          {/* Hero Section */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-48 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15),transparent_70%)] pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              {/* Left Column: Information Editorial */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
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
                
                <p className="text-[15px] sm:text-[17px] text-slate-400 max-w-[620px] mb-8 leading-relaxed font-sans font-normal">
                  {text.heroDesc}
                </p>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const el = document.getElementById('theory-categories');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-brand-blue hover:bg-brand-blue/90 text-white font-display font-bold py-3.5 px-7 rounded-xl text-sm transition-all shadow-xl hover:shadow-brand-blue/10 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {text.ctaStart}
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('faqs-anchor');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-transparent hover:bg-white/5 border-[1.5px] border-brand-border text-slate-300 font-display font-bold py-3.5 px-6 rounded-xl text-sm transition-all flex items-center justify-center cursor-pointer"
                  >
                    {text.learnMore}
                  </button>
                </div>
                
                <div className="text-[12px] text-slate-500 mt-3 pl-1">
                  🔒 {text.ctaHelp} · Statens vegvesen Læreplaner
                </div>
              </div>

              {/* Right Column: Interactive Quick Card / Summary */}
              <div className="lg:col-span-5">
                <div className="bg-brand-dark-2/90 border-[1.5px] border-brand-border rounded-3xl p-6 shadow-2xl relative">
                  <div className="absolute top-0 right-0 h-28 w-28 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent)] pointer-events-none rounded-tr-3xl"></div>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/25 flex items-center justify-center text-lg text-brand-blue-lt font-bold shrink-0">
                      🇳🇴
                    </div>
                    <div>
                      <div className="font-display text-sm font-bold text-white">Teorigo.no</div>
                      <div className="text-[11px] text-slate-400 font-sans">Multi-language transport academy</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3 items-start p-3 bg-white/[0.02] border border-brand-border/40 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[13px] font-bold text-white">4 Integrerte Språk</div>
                        <div className="text-xs text-slate-500 font-sans leading-snug">Bytt umiddelbart mellom Norsk, Engelsk, Arabisk (RTL) og Polsk.</div>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start p-3 bg-white/[0.02] border border-brand-border/40 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[13px] font-bold text-white">Ekte Eksamensimulator</div>
                        <div className="text-xs text-slate-500 font-sans leading-snug">Våre tester følger nøyaktig kravene til tid og bestått-grense hos Vegvesenet.</div>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start p-3 bg-white/[0.02] border border-brand-border/40 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[13px] font-bold text-white">Premium Spørsmålsbank</div>
                        <div className="text-xs text-slate-500 font-sans leading-snug">Hundrevis av kildebaserte spørsmål med dype, pedagogiske forklaringer.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Trust / Verification Value Prop */}
          <section className="w-full bg-brand-dark-2 border-y border-brand-border py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563eb] bg-brand-blue/10 border border-brand-blue/20 px-2.5 py-1 rounded mb-2.5 inline-block">
                    {text.trustBadge}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">{text.trustVerify}</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[700px] leading-relaxed">
                    {text.trustDesc}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 text-slate-500 font-mono text-[11px] shrink-0">
                  <span className="border-r border-brand-border pr-4">✓ LOVDATA</span>
                  <span className="border-r border-brand-border pr-4">✓ STATENS VEGVESEN</span>
                  <span>✓ YRKESTRANSPORTLOVEN</span>
                </div>
              </div>
            </div>
          </section>

          {/* Category Selector Grid - Explanatory category lists */}
          <section id="theory-categories" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-4xl mb-12 flex flex-col items-start justify-start text-left">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                {UiText(lang, 'licenceHeader', 'Velg ditt teoripensum')}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base font-sans max-w-xl leading-relaxed">
                {text.selectCatToStart}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CATS.map((cat, i) => {
                const cd = (cat as any)[lang] || (cat as any)['no'];
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id as CategoryId)}
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
                        {(lang === 'no' ? 'Åpne test' : lang === 'en' ? 'Start study' : lang === 'ar' ? 'ابدأ الدراسة' : 'Rozpocznij')}
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 w-3 h-3 rounded-full opacity-30" style={{ background: cat.color }}></div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Exploded Learning Modes Showcase */}
          <section className="w-full bg-brand-dark-2/40 border-y border-brand-border py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-[10px] font-bold text-brand-blue bg-brand-blue/10 border border-brand-blue/20 uppercase tracking-widest px-2.5 py-1 rounded inline-block mb-3">
                  {lang === 'no' ? 'Målrettet læring' : 'Targeted Retention'}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-3">
                  {text.modesHeader}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {text.modesDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Mode 1 */}
                <div className="bg-brand-dark-2 border border-brand-border p-6 rounded-2xl">
                  <div className="w-12 h-12 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl flex items-center justify-center text-xl mb-5">
                    <BookOpen className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white mb-2">{text.modeFcTitle}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{text.modeFcDesc}</p>
                </div>

                {/* Mode 2 */}
                <div className="bg-brand-dark-2 border border-brand-border p-6 rounded-2xl">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl flex items-center justify-center text-xl mb-5">
                    <PenSquare className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white mb-2">{text.modeQuizTitle}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{text.modeQuizDesc}</p>
                </div>

                {/* Mode 3 */}
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

          {/* Premium & Access Pricing Cards */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[10px] font-bold text-brand-blue bg-brand-blue/10 border border-brand-blue/20 uppercase tracking-widest px-2.5 py-1 rounded inline-block mb-3">
                {lang === 'no' ? 'Monetisering og tilgang' : 'Access tiers'}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-3">
                {text.premiumHeader}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                {text.premiumDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Plan 1 */}
              <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-6 relative">
                <div className="text-xs font-bold text-slate-500 tracking-wider mb-2 font-mono uppercase">TIER 1</div>
                <h3 className="font-display text-lg font-bold text-white mb-3">{text.premiumCard1}</h3>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[44px] mb-5">{text.premiumCard1Sub}</p>
                <div className="border-t border-brand-border pt-4">
                  <div className="text-2xl font-extrabold text-white tracking-tight font-display">T24-KODE</div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-snug">Aktiveres enkelt via e-post biletter.</div>
                </div>
              </div>

              {/* Plan 2 - Featured */}
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

              {/* Plan 3 */}
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

          {/* Interactive FAQs & Search Portal */}
          <section id="faqs-anchor" className="w-full bg-brand-dark-2/20 border-t border-brand-border py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white mb-2">
                  {text.faqSectionTitle}
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm">
                  {text.faqSectionDesc}
                </p>
              </div>

              <KnowledgePortal />
            </div>
          </section>
        </div>
      ) : (
        /* LAYER 2: AUTHENTICATED LEARNER DASHBOARD HUB */
        <div className="w-full max-w-5xl mx-auto px-4 pt-12 pb-20">
          
          {/* Workspace Hello Panel */}
          <div className="mb-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
            <div>
              <div className="text-xs text-brand-blue-lt font-display uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
                {text.hello} {user?.firstName || user?.email?.split('@')[0]}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {text.dashboardTitle}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-snug">
                {text.dashboardDesc}
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold font-display px-4 py-2 rounded-xl hover:bg-red-500/20 cursor-pointer transition-all shrink-0"
              >
                {text.adminBtn}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Box: Active Subscription Box & Code activation Form */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Access Entitlement Panel */}
              <div className="bg-brand-dark-2 border-[1.5px] border-brand-border rounded-2xl p-5.5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-brand-blue/10 to-transparent rounded-bl-full pointer-events-none" />
                
                <h3 className="text-xs font-black font-display text-slate-400 uppercase tracking-widest mb-3.5 flex items-center gap-2">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-brand-blue"></span>
                  {text.activeEntitlement}
                </h3>

                {expiration ? (
                  <div className="bg-emerald-500/[0.03] border border-emerald-500/20 p-4.5 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2.5 border border-emerald-500/20 shadow-inner">
                      <Unlock className="w-5 h-5" />
                    </div>
                    <div className="text-[10px] font-black font-display text-emerald-400/90 uppercase tracking-widest mb-1">
                      {lang === 'no' ? 'Full tilgang' : 'Full Access'}
                    </div>
                    <div className="font-display text-xl sm:text-2xl font-black text-white leading-none tracking-tight mb-2">
                      {timeLeftStr}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug font-sans px-2">
                      {lang === 'no' 
                        ? `Tilgangen din utløper: ${expiration.toLocaleDateString('no-NO')} kl. ${expiration.toLocaleTimeString('no-NO', {hour: '2-digit', minute:'2-digit'})}` 
                        : `Your license is active until ${expiration.toLocaleDateString()}`}
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-500/[0.02] border border-red-500/15 p-4.5 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-500/5 to-transparent rounded-bl-full pointer-events-none" />
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-2.5 border border-red-500/20 shadow-inner">
                      <Lock className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="text-[10px] font-black font-display text-red-400/90 uppercase tracking-widest mb-1">
                      {lang === 'no' ? 'Begrenset tilgang' : 'Limited Access'}
                    </div>
                    <div className="font-display text-xs font-black text-slate-300 leading-normal max-w-[200px] mb-2">
                      {text.noActivePlan}
                    </div>
                    <p className="text-[10.5px] text-slate-400 leading-normal font-sans px-1">
                      {lang === 'no' 
                        ? 'Forberedelser og simulerte tester er lukket til en dags- eller ukebillett blir aktivert.' 
                        : 'Simulators and learning banks are restricted until a premium pass is active.'}
                    </p>
                  </div>
                )}
              </div>
 
              {/* Access Key Redeeming Widget inside Dashboard */}
              <div className="bg-brand-dark-2 border-[1.5px] border-brand-border rounded-2xl p-5.5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 h-12 w-12 bg-gradient-to-bl from-brand-blue/5 to-transparent pointer-events-none" />
                
                <h3 className="text-xs font-black font-display text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  🎟️ {lang === 'no' ? 'Aktiver Lisenskode' : 'Redeem Access Pass'}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                  {text.hasCodePrompt}
                </p>
 
                <form onSubmit={handleRedeem} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={32}
                      placeholder={text.enterCodePlh}
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.toUpperCase());
                        setCodeError('');
                        setCodeSuccess('');
                      }}
                      className={cn(
                        "w-full bg-brand-dark text-white border-[1.5px] rounded-xl px-3 py-3 text-xs font-mono font-bold uppercase tracking-widest outline-none transition-all text-center",
                        codeError ? "border-red-500/60 focus:border-red-500" : codeSuccess ? "border-emerald-500/60 focus:border-emerald-500" : "border-brand-border focus:border-brand-blue"
                      )}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!code || codeLoading}
                    className="w-full bg-gradient-to-br from-brand-blue to-[#1d5fcc] hover:from-brand-blue/95 hover:to-[#1d5fcc]/95 disabled:from-brand-blue/30 disabled:to-[#1d5fcc]/30 disabled:opacity-40 text-white font-display font-bold py-3 px-4 rounded-xl text-xs transition-all uppercase tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-[0.98]"
                  >
                    {codeLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>{text.activateBtn}</span>
                    )}
                  </button>
                </form>
 
                <AnimatePresence mode="wait">
                  {codeError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-300 mt-3 font-semibold font-sans bg-red-500/5 border border-red-500/10 p-3 rounded-xl leading-relaxed flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{codeError}</span>
                    </motion.div>
                  )}
                  {codeSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-emerald-300 mt-3 font-semibold font-sans bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl leading-relaxed flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>{codeSuccess}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
 
                <div className="text-[10px] text-[#4a5f73] text-center mt-4 pt-3 border-t border-brand-border/40 font-sans">
                  Bestilling eller support: <span className="text-slate-400">amjmah87@gmail.com</span>
                </div>
              </div>
            </div>
 
            {/* Right Box: Grid of Selectable Licences to Launch AppShell */}
            <div className="lg:col-span-8">
              <div className="bg-brand-dark-2/65 border border-brand-border rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-blue/5 to-transparent rounded-bl-full pointer-events-none" />
                
                <h2 className="font-display text-base font-extrabold text-white mb-5 flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-blue" />
                  {lang === 'no' ? 'Tilgjengelige teorikurs' : 'Available Theory Classes'}
                </h2>
 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CATS.map((cat) => {
                    const cd = (cat as any)[lang] || (cat as any)['no'];
                    return (
                      <div
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id as CategoryId)}
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
                                  {lang === 'no' ? 'Låst opp' : lang === 'en' ? 'Unlocked' : lang === 'ar' ? 'مفتوح' : 'Aktywny'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-800 text-slate-400 border border-brand-border/80 leading-none">
                                  <Lock className="w-2.5 h-2.5 shrink-0" />
                                  {lang === 'no' ? 'Låst' : lang === 'en' ? 'Locked' : lang === 'ar' ? 'مغلق' : 'Zablokwany'}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-400 text-[11px] leading-snug font-sans line-clamp-2">
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
                            expiration ? "text-emerald-400 group-hover:text-white" : "text-brand-blue-lt group-hover:text-white"
                          )}>
                            {expiration 
                              ? (lang === 'no' ? 'Start øving' : lang === 'en' ? 'Practice' : lang === 'ar' ? 'ابدأ المذاكرة' : 'Ucz się')
                              : (lang === 'no' ? 'Lås opp' : lang === 'en' ? 'Unlock class' : lang === 'ar' ? 'فتح القفل' : 'Odblokuj')
                            }
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Micro fallback helper for text elements
function UiText(lang: string, key: string, fallback: string) {
  const dictionary: Record<string, Record<string, string>> = {
    no: {
      licenceHeader: "Kildebaserte teoriprøver",
    },
    en: {
      licenceHeader: "Source-based Theory Tests",
    },
    ar: {
      licenceHeader: "الاختبارات النظرية المعتمدة",
    },
    pl: {
      licenceHeader: "Egzaminy Teoretyczne",
    }
  };
  return dictionary[lang]?.[key] || fallback;
}
