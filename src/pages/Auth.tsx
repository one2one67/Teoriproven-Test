import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getSupabase } from '@/src/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const supabase = getSupabase();
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        if (password !== confirmPassword) throw new Error('Passordene stemmer ikke overens.');
        if (password.length < 8) throw new Error('Passordet må være minst 8 tegn.');

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + '/auth' },
        });
        if (error) throw error;
        setSuccess('✓ Sjekk e-posten din og klikk på bekreftelseslenken!');
      }
    } catch (err: any) {
      setError(err.message || 'En feil oppstod. Vennligst prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Skriv inn e-postadressen din først.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth',
      });
      if (error) setError(error.message);
      else setSuccess('✓ Tilbakestillingslenke er sendt til ' + email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(29,111,235,0.15),transparent)] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-extrabold tracking-tight mb-2">
            teoriøving<span className="gradient-text">.no</span>
          </h1>
          <p className="text-slate-400 text-sm">Alt du trenger for å bestå teoriprøven</p>
        </div>

        <div className="glass-card p-8 relative overflow-hidden shadow-2xl">
          <div className="flex gap-1 p-1 bg-brand-dark rounded-xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={cn(
                "flex-1 py-2 text-xs font-bold font-display rounded-lg transition-all",
                isLogin ? "background-brand-dark-2 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Logg inn
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={cn(
                "flex-1 py-2 text-xs font-bold font-display rounded-lg transition-all",
                !isLogin ? "background-brand-dark-2 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Registrer
            </button>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">E-post</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@epost.no"
                  className="w-full bg-brand-dark border border-brand-border rounded-xl py-3 pl-10 pr-4 text-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Passord</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-brand-dark border border-brand-border rounded-xl py-3 pl-10 pr-4 text-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Bekreft Passord</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Gjenta passordet"
                    className="w-full bg-brand-dark border border-brand-border rounded-xl py-3 pl-10 pr-4 text-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all"
                    required
                  />
                </div>
              </motion.div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-semibold text-brand-blue hover:text-brand-blue/80 transition-colors"
                >
                  Glemt passord?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-brand-blue to-blue-600 text-white font-display font-bold py-3 rounded-xl shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Logg inn' : 'Opprett konto')}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-slate-500 text-xs">
          Ved å logge inn godtar du våre <a href="#" className="text-slate-400 hover:underline">Vilkår for bruk</a>
        </p>
      </motion.div>
    </div>
  );
}
