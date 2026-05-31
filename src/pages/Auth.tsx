import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { useStore } from '../lib/store';
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  BookOpen, 
  Zap, 
  ShieldCheck, 
  Globe 
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Auth() {
  const { isSignedIn } = useAuth();
  const { lang, setLang } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Parse redirect path
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/teori';

  useEffect(() => {
    if (isSignedIn) {
      navigate(redirectPath);
    }
  }, [isSignedIn, navigate, redirectPath]);

  // Multilingual translations
  const t = {
    no: {
      titleLogin: 'Velkommen tilbake',
      titleRegister: 'Opprett din konto',
      subLogin: 'Logg inn for å fortsette den kildebaserte teoriprøveforberedelsen din på Teorigo.no',
      subRegister: 'Begynn å forberede deg til yrkessjåførprøver og løyveeksamen i dag',
      email: 'E-postadresse',
      password: 'Ditt passord',
      buttonLogin: 'Logg inn på konto',
      buttonRegister: 'Motta din tilgang',
      switchLogin: 'Har du allerede en bruker? Logg inn her →',
      switchRegister: 'Ny på Teorigo? Opprett konto her →',
      errorEmpty: 'Vennligst oppgi både e-post og passord.',
      successRegister: 'Kontoen ble opprettet! Du kan logge inn nå.',
      authHeader: 'Sikker pålogging og verifisering',
      benefitTitle: 'Hvorfor velge Teorigo?',
      benefits: [
        'Offisiell pensum- og Lovdata-samordning',
        'Smart flashkortsystem for raskere begrepslæring',
        'Nøyaktig eksamensimulator (45 minutter tidsbegrenset)',
        'Full språksvitsjing (Norsk, Engelsk, Polsk, Arabisk)'
      ]
    },
    en: {
      titleLogin: 'Welcome Back',
      titleRegister: 'Create Your Account',
      subLogin: 'Sign in to resume study progress and master your exam candidates',
      subRegister: 'Register today to access elite commercial driving prep databases',
      email: 'Email Address',
      password: 'Password',
      buttonLogin: 'Secure Sign In',
      buttonRegister: 'Unlock Access Now',
      switchLogin: 'Already have an account? Sign in here →',
      switchRegister: 'New candidate? Form an account here →',
      errorEmpty: 'Please provide both valid email and password credentials.',
      successRegister: 'Your account was set up successfully! Please log in now.',
      authHeader: 'Secure Access & Verification Gateway',
      benefitTitle: 'Why study with Teorigo?',
      benefits: [
        'Official Statens Vegvesen and Lovdata curricula alignment',
        'Intelligent flashcard repetition to build reflex knowledge',
        'Authentic exam simulator with precise time restrictions',
        'Instantly switch languages: Norwegian, English, Polish, Arabic'
      ]
    },
    ar: {
      titleLogin: 'مرحباً بطلب السائقين',
      titleRegister: 'إنشاء حسابك الأكاديمي',
      subLogin: 'سجل دخولك لمواصلة التدريب النظري والتحقق في منصة تيوريغو',
      subRegister: 'سجل اليوم للوصول لخدمات التدريب المهني في قطاع النقل البري بالترخيص',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      buttonLogin: 'تسجيل دخول آمن',
      buttonRegister: 'تفعيل الحساب الآن',
      switchLogin: 'لديك حساب مسجل بالفعل؟ قم بتسجيل الدخول هنا ←',
      switchRegister: 'مستخدم جديد؟ أنشئ حسابك التعليمي هنا ←',
      errorEmpty: 'يرجى تقديم مستندات بريد إلكتروني وكلمة مرور صالحة.',
      successRegister: 'تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول الآن.',
      authHeader: 'بوابة تسجيل الدخول والتحقق الآمنة',
      benefitTitle: 'ماذا يميز منصة Teorigo؟',
      benefits: [
        'توافق تام مع معايير ومناهج إدارة الطرق والتشريعات النرويجية',
        'مصفوفة بطاقات تفعيل للتمكن والتدريب الممنهج',
        'محاكاة دقيقة للاختبار الحقيقي بوقت قياسي (٤٥ دقيقة)',
        'تغيير فوري ومنتظم للغة: النرويجية، الإنجليزية، البولندية، العربية'
      ]
    },
    pl: {
      titleLogin: 'Witaj Ponownie',
      titleRegister: 'Utwórz swoje konto',
      subLogin: 'Zaloguj się, aby kontynuować rzetelne przygotowania na Teorigo.no',
      subRegister: 'Zarejestruj się dziś, aby odblokować bazę szkoleniową i testy',
      email: 'Adres e-mail',
      password: 'Hasło',
      buttonLogin: 'Zaloguj się bezpiecznie',
      buttonRegister: 'Zyskaj Pełny Dostęp',
      switchLogin: 'Masz już konto? Zaloguj się tutaj →',
      switchRegister: 'Zaczynasz naukę? Załóż konto tutaj →',
      errorEmpty: 'Wprowadź prawidłowy adres e-mail oraz hasło.',
      successRegister: 'Konto zostało utworzone pomyślnie! Zaloguj się teraz.',
      authHeader: 'Szyfrowane logowanie i autoryzacja',
      benefitTitle: 'Dlaczego warto uczyć się z Teorigo?',
      benefits: [
        'Program i interpretacje oparte bezpośrednio na norweskim Lovdata',
        'Inteligentne flaszkarty wspomagające trwałe zapamiętywanie',
        'Wierny symulator egzaminu państwowego (ograniczenie do 45 min)',
        'Przełączanie języków w locie: Norweski, Angielski, Polski, Arabski'
      ]
    }
  };

  const labels = t[lang] || t['no'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError(labels.errorEmpty);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error: loginErr } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        if (loginErr) throw loginErr;
        navigate(redirectPath);
      } else {
        const { error: signUpErr } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        if (signUpErr) throw signUpErr;
        setSuccessMsg(labels.successRegister);
        setIsLogin(true); // Switch to login after success
        setPassword('');
      }
    } catch (err: any) {
      console.error('Supabase Auth error:', err);
      let msg = err.message || 'Det oppstod en feil under verifiseringen.';
      const lower = msg.toLowerCase();
      if (lower.includes('rate limit') || lower.includes('rate_limit') || lower.includes('limit exceeded') || lower.includes('excessive')) {
        msg = lang === 'no'
          ? 'E-postgrensen til Supabase er overskredet (2 e-poster/time på gratisnivået). Vennligst unngå denne feilen ved å slå av "Confirm email" i Supabase-konsollen under Authentication -> Email Templates, eller prøv igjen senere.'
          : 'Supabase email rate limit exceeded. Disable "Confirm email" in your Supabase Auth templates directory or try again later.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative w-full overflow-x-hidden">
      
      {/* Upper Navigation Row with Brand Logo, Language Selector & Back Button */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center z-20 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-brand-border bg-white/5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all shadow-[0_0_15px_rgba(255,255,255,0.02)]"
        >
          <ArrowLeft className="w-4 h-4 rtl:scale-x-[-1]" /> 
          <span>{(lang === 'no' ? 'Tilbake til Hjem' : lang === 'en' ? 'Back' : lang === 'ar' ? 'الرجوع للرئيسية' : 'Wróć')}</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Custom language selector embedded right inside the auth page to match the rest of the application */}
          <div className="relative" translate="no">
            <span className="absolute left-2.5 rtl:left-auto rtl:right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Globe className="w-3.5 h-3.5" />
            </span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              className="appearance-none flex items-center justify-between pl-8 pr-6 rtl:pl-6 rtl:pr-8 h-8 rounded-lg border border-brand-border bg-brand-dark-2 text-xs font-bold uppercase text-slate-300 cursor-pointer transition-all hover:bg-white/5 hover:border-slate-500 focus:outline-none focus:border-brand-blue focus:text-white"
            >
              <option value="no">no</option>
              <option value="en">en</option>
              <option value="ar">ar</option>
              <option value="pl">pl</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-center py-6 sm:py-12 z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl rounded-3xl overflow-hidden bg-brand-dark-2/40 border border-brand-border/60 shadow-2xl relative">
          
          {/* Left Column: Premium Pitch Screen. Hidden on mobile, vibrant on desktop */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-brand-blue/15 via-cyan-500/5 to-transparent p-10 flex-col justify-between border-r border-brand-border/50 relative">
            <div className="absolute top-0 right-0 h-48 w-48 bg-gradient-to-bl from-brand-blue/10 to-transparent blur-xl rounded-tr-3xl pointer-events-none"></div>
            
            {/* Top Logo branding */}
            <div className="space-y-2">
              <div className="font-display text-2xl font-black text-white hover:opacity-95 transition-all">
                teorigo<span className="bg-gradient-to-br from-[#2563eb] to-[#60a5fa] bg-clip-text text-transparent">.no</span>
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Norges moderne, kildebaserte læringsplattform for yrkessjåførprøver, drosje, og tunge kjøretøy.
              </p>
            </div>

            {/* List of high-end educational goals */}
            <div className="space-y-6 my-8">
              <h3 className="font-display text-sm font-extrabold text-white uppercase tracking-wider pl-0.5">
                {labels.benefitTitle}
              </h3>
              <div className="space-y-4">
                {labels.benefits.map((benefit: string, idx: number) => (
                  <div key={idx} className="flex gap-3 items-start animate-in fade-in slide-in-from-left duration-300" style={{ animationDelay: `${idx * 75}ms` }}>
                    <div className="w-5 h-5 rounded-md bg-brand-blue/15 border border-brand-blue/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-brand-blue-lt" />
                    </div>
                    <span className="text-[12.5px] text-slate-300 font-sans leading-snug font-medium">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom footnote */}
            <div className="pt-4 border-t border-brand-border/30 flex items-center gap-2.5 text-[#4a5f73] font-mono text-[10px] tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4 text-[#1d6feb]" />
              Sikker, kildebasert verifisering
            </div>
          </div>

          {/* Right Column: Secure credentials input form */}
          <div className="col-span-1 lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center relative">
            <div className="max-w-md mx-auto w-full space-y-6">
              
              {/* Heading elements */}
              <div>
                <span className="text-[10px] font-extrabold text-brand-blue uppercase tracking-widest leading-none block mb-1">
                  {labels.authHeader}
                </span>
                <h1 className="font-display text-xl sm:text-2xl font-black text-white leading-tight">
                  {isLogin ? labels.titleLogin : labels.titleRegister}
                </h1>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1.5 pl-0.5">
                  {isLogin ? labels.subLogin : labels.subRegister}
                </p>
              </div>

              {/* Form trigger action */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                
                {/* Alerts Area */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-start gap-2.5 p-3.5 rounded-xl border border-red-500/25 bg-red-500/5 text-red-300 text-xs leading-relaxed"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-start gap-2.5 p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-emerald-300 text-xs leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                      <span>{successMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email address field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest pl-0.5 rtl:text-right">
                    {labels.email}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center pl-3.5 rtl:pl-0 rtl:pr-3.5 text-slate-500 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="Brukernavn eller e-post"
                      className="w-full bg-brand-dark/50 text-white border-[1.5px] border-brand-border rounded-xl pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-3 text-sm focus:outline-none focus:border-brand-blue focus:bg-brand-dark/80 transition-all font-sans"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest pl-0.5 rtl:text-right">
                    {labels.password}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center pl-3.5 rtl:pl-0 rtl:pr-3.5 text-slate-500 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full bg-brand-dark/50 text-white border-[1.5px] border-brand-border rounded-xl pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-3 text-sm focus:outline-none focus:border-brand-blue focus:bg-brand-dark/80 transition-all font-sans"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    />
                  </div>
                </div>

                {/* Submit action button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5. mt-2 bg-gradient-to-br from-brand-blue to-[#1d5fcc] hover:from-brand-blue/95 hover:to-[#1d5fcc]/95 text-white border-0 font-display font-bold rounded-xl transition-all shadow-lg shadow-brand-blue/15 hover:shadow-brand-blue/20 cursor-pointer flex items-center justify-center gap-2 text-xs uppercase tracking-wide min-h-[46px] disabled:opacity-45"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>{isLogin ? labels.buttonLogin : labels.buttonRegister}</span>
                  )}
                </button>
              </form>

              {/* Toggle Action and switcher */}
              <div className="pt-2 text-center border-t border-brand-border/40">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs text-brand-blue-lt hover:text-brand-blue hover:underline cursor-pointer font-bold transition-colors uppercase tracking-wide"
                >
                  {isLogin ? labels.switchRegister : labels.switchLogin}
                </button>
              </div>

              {/* Help & Support footnote footer inside form card */}
              <div className="text-[10px] text-slate-500 text-center leading-relaxed font-sans pt-1">
                Har du spørsmål om tilgang eller bestilling? Kontakt support på <span className="text-slate-400 font-mono">amjmah87@gmail.com</span>
              </div>

            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
