import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction, Lock } from 'lucide-react';
import { useStore } from '../lib/store';
import { useUser } from '../lib/AuthContext';
import { getSupabase } from '../lib/supabase';

export default function Eksamen() {
  const { lang, expiration, setExpiration } = useStore();
  const { user } = useUser();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user) {
      const checkAccess = async () => {
        try {
          const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'amjmah87@gmail.com';
          const userId = user?.primaryEmailAddress?.emailAddress || user?.id;

          if (userId === adminEmail) {
            setExpiration(new Date('2099-12-31T23:59:59Z'));
            setChecking(false);
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
          console.error('Error verifying active permission inside simulated exam:', e);
        } finally {
          setChecking(false);
        }
      };
      checkAccess();
    } else {
      setChecking(false);
    }
  }, [user, setExpiration]);

  if (checking) {
    return (
      <div className="min-h-screen bg-brand-dark flex justify-center items-center">
         <div className="w-8 h-8 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  const isExpired = !expiration || expiration.getTime() < new Date().getTime();

  if (isExpired) {
    return (
      <div className="min-h-[80vh] bg-brand-dark flex flex-col justify-center items-center p-6 text-center font-sans">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="font-display text-xl font-bold text-white mb-2">
          {lang === 'no' ? 'Krever aktiv lisens' : 'Active Pass Required'}
        </h2>
        <p className="text-slate-400 max-w-md text-sm mb-8 leading-relaxed">
          {lang === 'no' 
            ? 'Eksamensimuleringen er en eksklusiv læringsressurs. Vennligst lås opp tilgang fra forsiden med din produktnøkkel.' 
            : 'The Exam Simulator is an exclusive learning asset. Please unlock access from the dashboard with your product key.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl border border-brand-border bg-white/5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all"
        >
          {lang === 'no' ? 'Tilbake til Hovedside' : 'Back to Home'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/teori" className="inline-flex items-center gap-2 text-brand-blue hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Tilbake til oversikt
      </Link>
      
      <div className="glass-card p-12 text-center border-brand-blue/20">
        <div className="mx-auto w-16 h-16 bg-brand-blue/10 flex items-center justify-center rounded-full text-brand-blue mb-6">
          <Construction className="w-8 h-8" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-4">Eksamensimulering kommer snart!</h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Vi jobber med å ferdigstille denne modulen. Her vil du snart kunne ta komplette simuleringer av teoriprøven med 45 spørsmål på 90 minutter.
        </p>
      </div>
    </div>
  );
}
