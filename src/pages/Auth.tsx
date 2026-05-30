import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { useStore } from '../lib/store';
import { Mail, Lock, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Auth() {
  const { isSignedIn } = useAuth();
  const { lang } = useStore();
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
      titleRegister: 'Opprett konto',
      subLogin: 'Logg inn for å fortsette øvingen din på Teorigo.no',
      subRegister: 'Begynn å forberede deg til teoriprøven i dag',
      email: 'E-postadresse',
      password: 'Passord',
      buttonLogin: 'Logg inn',
      buttonRegister: 'Opprett konto',
      switchLogin: 'Har du allerede en konto? Logg inn',
      switchRegister: 'Ny på Teorigo? Opprett konto her',
      errorEmpty: 'Vennligst fyll ut alle feltene.',
      successRegister: 'Kontoen ble opprettet! Du kan logge inn nå.',
      authHeader: 'Sikker innlogging og registrering'
    },
    en: {
      titleLogin: 'Welcome Back',
      titleRegister: 'Create Account',
      subLogin: 'Log in to continue your preparation on Teorigo.no',
      subRegister: 'Start preparing for your theory test today',
      email: 'Email Address',
      password: 'Password',
      buttonLogin: 'Log In',
      buttonRegister: 'Create Account',
      switchLogin: 'Already have an account? Log in',
      switchRegister: 'New to Teorigo? Create an account here',
      errorEmpty: 'Please fill in all fields.',
      successRegister: 'Account created successfully! You can now log in.',
      authHeader: 'Secure Sign In & Registration'
    },
    ar: {
      titleLogin: 'مرحباً بعودتك',
      titleRegister: 'إنشاء حساب جديد',
      subLogin: 'قم بتسجيل الدخول لمتابعة تدريبك على Teorigo.no',
      subRegister: 'ابدأ التحضير لاختبارك النظري اليوم',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      buttonLogin: 'تسجيل الدخول',
      buttonRegister: 'إنشاء حساب',
      switchLogin: 'هل لديك حساب بالفعل؟ سجل دخولك',
      switchRegister: 'جديد في Teorigo؟ أنشئ حسابك هنا',
      errorEmpty: 'يرجى ملء جميع الحقول.',
      successRegister: 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.',
      authHeader: 'تسجيل دخول وتسجيل آمن'
    },
    pl: {
      titleLogin: 'Witaj z powrotem',
      titleRegister: 'Utwórz konto',
      subLogin: 'Zaloguj się, aby kontynuować naukę na Teorigo.no',
      subRegister: 'Zacznij przygotowywać się do egzaminu już dziś',
      email: 'Adres e-mail',
      password: 'Hasło',
      buttonLogin: 'Zaloguj się',
      buttonRegister: 'Utwórz konto',
      switchLogin: 'Masz już konto? Zaloguj się',
      switchRegister: 'Nowy w Teorigo? Utwórz konto tutaj',
      errorEmpty: 'Proszę wypełnić wszystkie pola.',
      successRegister: 'Konto zostało utworzone! Możesz się teraz zalogować.',
      authHeader: 'Bezpieczne logowanie i rejestracja'
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
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        if (error) throw error;
        navigate(redirectPath);
      } else {
        const { error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        if (error) throw error;
        setSuccessMsg(labels.successRegister);
        setIsLogin(true); // Switch to login after success
        setPassword('');
      }
    } catch (err: any) {
      console.error('Supabase Auth error:', err);
      // Simplify error output or fetch error description
      setError(err.message || 'Det oppstod en feil under godkjenning.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 relative" style={{ 
      background: 'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(29,111,235,0.12), transparent), var(--color-brand-dark)',
    }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-brand-border bg-white/5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all shadow-[0_0_15px_rgba(255,255,255,0.02)]"
      >
        <ArrowLeft className="w-4 h-4" /> {(lang === 'no' ? 'Hjem' : lang === 'en' ? 'Home' : lang === 'ar' ? 'الرئيسية' : 'Hjem')}
      </button>

      <div className="w-full max-w-[420px] bg-brand-dark-2 border-[1.5px] border-brand-border rounded-[24px] overflow-hidden shadow-2xl relative z-10 transition-all">
        {/* Visual Header Glow */}
        <div className="bg-gradient-to-br from-brand-blue/15 to-cyan-500/10 p-8 px-6 text-center border-b border-brand-border relative">
          <div className="font-display text-sm font-semibold text-brand-blue tracking-[0.05em] uppercase mb-1.5 opacity-80">
            {labels.authHeader}
          </div>
          <h2 className="font-display text-2xl font-extrabold text-white mb-2">
            {isLogin ? labels.titleLogin : labels.titleRegister}
          </h2>
          <p className="text-[13px] text-slate-400 max-w-[320px] mx-auto leading-relaxed">
            {isLogin ? labels.subLogin : labels.subRegister}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Alerts */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-2.5 p-3.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-300 text-xs leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-2.5 p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-300 text-xs leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              {labels.email}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                className="w-full bg-brand-dark/50 text-white border-[1.5px] border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:bg-brand-dark/80 transition-all font-sans"
                placeholder="navn@domene.no"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              {labels.password}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                minLength={6}
                className="w-full bg-brand-dark/50 text-white border-[1.5px] border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:bg-brand-dark/80 transition-all font-sans"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-brand-blue hover:bg-brand-blue/90 text-white border-[1.5px] border-brand-blue hover:border-brand-blue/90 font-display font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-blue/20 cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              isLogin ? labels.buttonLogin : labels.buttonRegister
            )}
          </button>

          {/* Toggle Action */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccessMsg(null);
              }}
              className="text-xs text-brand-blue hover:underline cursor-pointer font-medium"
            >
              {isLogin ? labels.switchRegister : labels.switchLogin}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
