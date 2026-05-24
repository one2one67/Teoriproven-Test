import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getSupabase } from '@/src/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Calendar, ShieldCheck, Clock, Ticket, CheckCircle2, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { UserAccess } from '@/src/types';

export default function Dashboard() {
  const [access, setAccess] = useState<UserAccess | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeMessage, setCodeMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      await loadAccess(session.user.id);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAccess = async (userId: string) => {
    try {
      const { data } = await getSupabase()
        .from('user_access')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        setAccess(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRedeem = async () => {
    if (!code) return;
    setCodeLoading(true);
    setCodeMessage(null);

    try {
      const { data, error } = await getSupabase().rpc('redeem_code', { p_code: code.trim().toUpperCase() });

      if (error || !data?.ok) {
        setCodeMessage({ text: data?.error || 'Ugyldig eller brukt kode.', type: 'error' });
      } else {
        setCodeMessage({ text: `✓ Kode aktivert! ${data.plan_days} dager tilgang.`, type: 'success' });
        setCode('');
        await loadAccess(user.id);
      }
    } catch (err: any) {
      setCodeMessage({ text: err.message, type: 'error' });
    } finally {
      setCodeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">Konfigurasjonsfeil</h1>
        <p className="text-slate-400 text-sm mb-6 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-brand-blue text-white px-6 py-2 rounded-xl font-bold text-sm"
        >
          Prøv på nytt
        </button>
      </div>
    );
  }

  const isExpired = access && new Date(access.expires_at) < new Date();
  const isActive = access && new Date(access.expires_at) > new Date();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="font-display text-3xl font-extrabold mb-1 tracking-tight">Min konto</h1>
        <p className="text-slate-400 text-sm">Logget inn som <span className="text-slate-300 font-medium">{user?.email}</span></p>
      </header>

      {/* ACCESS CARD */}
      <section className="mb-10">
        <div className={cn(
          "relative overflow-hidden p-8 rounded-3xl border transition-all duration-500",
          isActive
            ? "bg-emerald-500/5 border-emerald-500/20 shadow-xl shadow-emerald-500/5"
            : isExpired
              ? "bg-red-500/5 border-red-500/20"
              : "bg-brand-blue/5 border-brand-blue/20"
        )}>
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-4 rounded-2xl",
                isActive ? "bg-emerald-500/10 text-emerald-400" : isExpired ? "bg-red-500/10 text-red-400" : "bg-brand-blue/10 text-brand-blue"
              )}>
                {isActive ? <ShieldCheck className="w-8 h-8" /> : isExpired ? <Clock className="w-8 h-8" /> : <Calendar className="w-8 h-8" />}
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">
                  {isActive ? "Full tilgang aktiv" : isExpired ? "Tilgang utløpt" : "Ingen aktiv tilgang"}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  {isActive
                    ? `Utløper ${new Date(access.expires_at).toLocaleString('no-NO', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}`
                    : "Løs inn en kode for å få full tilgang"}
                </p>
              </div>
            </div>
            {isActive && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                Full tilgang
              </span>
            )}
          </div>

          {isActive ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                  <span>Status</span>
                  <span>{access.plan_days} dager aktivert</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="h-full bg-linear-to-r from-emerald-500 to-green-400 rounded-full"
                  />
                </div>
              </div>
              <button
                onClick={() => navigate('/app')}
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-display font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Start øving <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Du bruker for øyeblikket en gratisversjon. For å låse opp alle funksjoner, flashkort og eksamensimuleringer må du løse inn en tilgangskode.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* REDEEM SECTION - MORE PROMINENT */}
      <section>
        <div className="glass-card p-10 bg-linear-to-br from-brand-dark-2 to-brand-dark border-brand-blue/20">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-brand-blue/10 rounded-2xl text-brand-blue">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-2xl tracking-tight">Løs inn kode</h3>
              <p className="text-slate-400 text-sm">Gjør den manuelle koden om til full tilgang</p>
            </div>
          </div>

          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Har du mottatt en tilgangskode manuelt fra en instruktør? Skriv den inn under for å knytte tilgangen til din brukerprofil umiddelbart.
          </p>

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

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full bg-brand-dark border border-brand-border rounded-2xl px-6 py-4 font-display font-extrabold tracking-[0.25em] text-lg text-center outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-600"
              />
            </div>
            <button
              onClick={handleRedeem}
              disabled={codeLoading || !code}
              className="bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white font-display font-bold px-10 rounded-2xl transition-all flex items-center justify-center min-w-[160px] shadow-xl shadow-brand-blue/20 text-lg hover:scale-105 active:scale-95"
            >
              {codeLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Aktiver"}
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-brand-border/50">
            <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">Tilgjengelige planer</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                24 timer (99 kr)
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                3 dager (249 kr)
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                7 dager (499 kr)
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
