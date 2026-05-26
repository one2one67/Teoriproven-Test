import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getSupabase, getAuthenticatedSupabase } from '@/src/lib/supabase';
import { Ticket, CheckCircle2, AlertCircle, Loader2, BookOpen, Clock } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useUser, useAuth } from '@clerk/clerk-react';

export default function Teori() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [code, setCode] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeMessage, setCodeMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [expiration, setExpiration] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (user) {
      const storedExp = localStorage.getItem(`${user.id}_expiration`);
      if (storedExp) {
        const expDate = new Date(storedExp);
        if (expDate > new Date()) {
          setExpiration(expDate);
        } else {
          localStorage.removeItem(`${user.id}_expiration`);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (!expiration) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = expiration.getTime() - now;

      if (distance < 0) {
        setExpiration(null);
        if (user) localStorage.removeItem(`${user.id}_expiration`);
        setTimeLeft('Utløpt');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}t ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiration, user]);

  const handleRedeem = async () => {
    if (!code || !user) return;
    setCodeLoading(true);
    setCodeMessage(null);

    const inputCode = code.trim().toUpperCase();

    try {
      const token = await getToken({ template: "supabase" });
      const supabase = token ? getAuthenticatedSupabase(token) : getSupabase();
      
      // Check code
      const { data: codeData, error: fetchError } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', inputCode)
        .single();

      if (fetchError || !codeData) {
        throw new Error('Koden finnes ikke, er ugyldig eller RLS mangler tillatelse.');
      }

      if (codeData.is_used) {
        throw new Error('Denne koden er allerede brukt.');
      }

      // Determine time
      let days = codeData.plan_days;
      let hours = 0;
      if (inputCode.startsWith('T24-')) {
        days = 0;
        hours = 24;
      } else if (inputCode.startsWith('D3-')) {
        days = 3;
      } else if (inputCode.startsWith('D7-')) {
        days = 7;
      }

      const expDate = new Date();
      expDate.setDate(expDate.getDate() + days);
      expDate.setHours(expDate.getHours() + hours);

      // Mark as used
      const { error: updateError } = await supabase
        .from('access_codes')
        .update({
          is_used: true,
          redeemed_by: user.primaryEmailAddress?.emailAddress || user.id
        })
        .eq('code', inputCode);

      if (updateError) {
        throw new Error('Kunne ikke aktivere koden i databasen.');
      }

      // Success
      localStorage.setItem(`${user.id}_expiration`, expDate.toISOString());
      setExpiration(expDate);
      setCodeMessage({ text: `✓ Kode aktivert! Tilgang til ${expDate.toLocaleString('no-NO')}.`, type: 'success' });
      setCode('');
    } catch (err: any) {
      setCodeMessage({ text: err.message, type: 'error' });
    } finally {
      setCodeLoading(false);
    }
  };

  if (!expiration) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 flex flex-col items-center">
        <div className="glass-card p-10 bg-linear-to-br from-brand-dark-2 to-brand-dark border-brand-blue/20 w-full max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-brand-blue/10 rounded-2xl text-brand-blue">
              <Ticket className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-2xl tracking-tight">Skriv inn aktiveringskode</h3>
              <p className="text-slate-400 text-sm">Du trenger en gyldig kode for å åpne teorisiden.</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {codeMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "p-5 rounded-2xl mb-6 text-sm font-semibold flex items-center gap-4 border",
                  codeMessage.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                )}
              >
                {codeMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {codeMessage.text}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="F.eks. T24-XXXX-XXXX"
              className="w-full bg-brand-dark border border-brand-border rounded-2xl px-6 py-4 font-display font-extrabold tracking-[0.1em] text-center outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all text-xl"
            />
            <button
              onClick={handleRedeem}
              disabled={codeLoading || !code}
              className="w-full bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white font-display font-bold px-10 py-4 rounded-2xl transition-all flex items-center justify-center shadow-xl shadow-brand-blue/20 text-lg hover:scale-105 active:scale-95 mt-2"
            >
              {codeLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Aktiver tilgang"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-4xl font-extrabold mb-2 tracking-tight">Teori og Øving</h1>
          <p className="text-slate-400 text-sm">Velkommen tilbake, {user?.firstName || user?.primaryEmailAddress?.emailAddress}</p>
        </div>
        
        <div className="glass-card px-6 py-3 flex items-center gap-3 border-emerald-500/20 bg-emerald-500/5">
          <Clock className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Tid igjen</div>
            <div className="text-lg font-display font-bold text-emerald-400">{timeLeft}</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 border-brand-blue/20 hover:border-brand-blue/40 transition-all cursor-pointer group">
           <div className="p-4 bg-brand-blue/10 w-fit rounded-2xl text-brand-blue mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8" />
           </div>
           <h2 className="font-display text-2xl font-bold mb-3">Eksamensimulering</h2>
           <p className="text-slate-400">Ta en full eksamen med 45 spørsmål, akkurat som hos Statens Vegvesen.</p>
        </div>
        
        <div className="glass-card p-8 border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group">
           <div className="p-4 bg-purple-500/10 w-fit rounded-2xl text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8" />
           </div>
           <h2 className="font-display text-2xl font-bold mb-3">Spørsmålsbank</h2>
           <p className="text-slate-400">Bla gjennom alle spørsmål tematisk og øv på det du er svakest på.</p>
        </div>
      </div>
    </div>
  );
}
