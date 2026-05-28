import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { getSupabase, getAuthenticatedSupabase } from '@/src/lib/supabase';
import { useUser, useAuth } from '@clerk/clerk-react';
import {
  Plus,
  RefreshCcw,
  Copy,
  Ticket,
  Loader2,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { AccessCode } from '@/src/types';

export default function Admin() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, used: 0 });
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [activeTab, setActiveTab] = useState<'gen' | 'list'>('gen');

  // Gen form
  const [genLoading, setGenLoading] = useState(false);
  const [lastCodes, setLastCodes] = useState<string[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      await loadStats();
      await loadCodes();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = await getToken({ template: "supabase" });
      const supabase = token ? getAuthenticatedSupabase(token) : getSupabase();
      const { count: total } = await supabase.from('access_codes').select('*', { count: 'exact', head: true });
      const { count: used } = await supabase.from('access_codes').select('*', { count: 'exact', head: true }).eq('is_used', true);
      setStats({ total: total || 0, used: used || 0 });
    } catch (e) {
      console.error(e);
    }
  };

  const loadCodes = async () => {
    try {
      const token = await getToken({ template: "supabase" });
      const supabase = token ? getAuthenticatedSupabase(token) : getSupabase();
      const { data } = await supabase.from('access_codes').select('*').order('created_at', { ascending: false }).limit(100);
      if (data) setCodes(data);
    } catch (e) {
      console.error(e);
    }
  };

  const makeCode = (planDays: 1 | 3 | 7) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    
    let prefix = '';
    if (planDays === 1) prefix = 'T24-';
    else if (planDays === 3) prefix = 'D3-';
    else if (planDays === 7) prefix = 'D7-';

    return `${prefix}${seg()}-${seg()}`;
  };

  const generateSingleCode = async (planDays: 1 | 3 | 7) => {
    setGenLoading(true);
    try {
      const newCode = makeCode(planDays);
      const row = {
        code: newCode,
        plan_days: planDays,
        created_by: user?.primaryEmailAddress?.emailAddress || 'Admin'
      };

      const token = await getToken({ template: "supabase" });
      const supabase = token ? getAuthenticatedSupabase(token) : getSupabase();

      const { error } = await supabase.from('access_codes').insert([row]);
      if (error) {
        throw new Error(error.message);
      }
      
      setLastCodes([newCode]);
      await loadStats();
    } catch (e: any) {
      console.error(e);
      alert('Kunne ikke generere kode:\n' + e.message + '\n\n' + 
      (e.message.includes('RLS') ? 'Dette skjer fordi du bruker Clerk, men databasen (Supabase) har RLS. Opprett en JWT Template i Clerk for Supabase.' : ''));
    } finally {
      setGenLoading(false);
    }
  };

  const copyCodes = () => {
    navigator.clipboard.writeText(lastCodes.join('\n'));
  };

  if (loading) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-border bg-white/5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Tilbake til Teorigo.no
      </button>

      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Admin-panel</h1>
          <p className="text-slate-400 text-sm">Systemovervåking og kodebehandling</p>
        </div>

        <div className="flex gap-4">
          <div className="glass-card px-6 py-3 text-center">
            <div className="text-2xl font-display font-extrabold">{stats.total}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Totale koder</div>
          </div>
          <div className="glass-card px-6 py-3 text-center">
            <div className="text-2xl font-display font-extrabold text-emerald-400">{stats.used}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Innløste</div>
          </div>
        </div>
      </header>

      <div className="flex gap-1 p-1 bg-brand-dark border border-brand-border rounded-2xl mb-8 w-fit">
        <button
          onClick={() => setActiveTab('gen')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-xs font-bold font-display transition-all flex items-center gap-2",
            activeTab === 'gen' ? "bg-brand-dark-2 text-white shadow-lg" : "text-slate-500 hover:text-slate-400"
          )}
        >
          <Plus className="w-4 h-4" /> Generer
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-xs font-bold font-display transition-all flex items-center gap-2",
            activeTab === 'list' ? "bg-brand-dark-2 text-white shadow-lg" : "text-slate-500 hover:text-slate-400"
          )}
        >
          <Ticket className="w-4 h-4" /> Alle koder
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'gen' && (
          <motion.div
            key="gen"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-8">
                <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-brand-blue" /> Opprett ny kode
                </h2>
                <div className="space-y-4">
                  <button
                    onClick={() => generateSingleCode(1)}
                    disabled={genLoading}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-display font-bold py-4 rounded-xl transition-all border border-slate-600"
                  >
                    Generer 24 timer (T24)
                  </button>
                  <button
                    onClick={() => generateSingleCode(3)}
                    disabled={genLoading}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-display font-bold py-4 rounded-xl transition-all border border-slate-600"
                  >
                    Generer 3 dager (D3)
                  </button>
                  <button
                    onClick={() => generateSingleCode(7)}
                    disabled={genLoading}
                    className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-display font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-blue/20"
                  >
                    Generer 7 dager (D7)
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {lastCodes.length > 0 ? (
                  <div className="glass-card p-8 border-emerald-500/20 bg-emerald-500/5 h-full">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-display font-bold text-lg text-emerald-400">Resultat</h3>
                      <button onClick={copyCodes} className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors text-emerald-400">
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {lastCodes.map((c, i) => (
                        <div key={i} className="bg-brand-dark border border-emerald-500/30 p-6 rounded-xl text-center font-display font-extrabold tracking-[0.2em] text-white text-3xl">
                          {c}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={copyCodes}
                      className="w-full mt-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-display font-bold transition-all"
                    >
                      Kopier kode
                    </button>
                  </div>
                ) : (
                  <div className="glass-card p-8 border-dashed border-brand-border flex flex-col items-center justify-center text-center h-full opacity-50">
                    <Ticket className="w-12 h-12 text-slate-700 mb-4" />
                    <p className="text-slate-400 text-sm">Generer koder for å se resultater her</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-dark/50 p-4">
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kode</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Innløst av</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aktivert</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Utløper</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Opprettet D.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {codes.map((c) => {
                    let activatedStr = '–';
                    if (c.is_used && c.expires_at) {
                      const exp = new Date(c.expires_at);
                      let hours = c.plan_days === 0 ? 24 : c.plan_days * 24;
                      // Fallback for T24 where plan_days might be 1 but it's 24 hours
                      if (c.code.startsWith('T24-')) hours = 24;
                      const act = new Date(exp.getTime() - hours * 60 * 60 * 1000);
                      activatedStr = act.toLocaleString('no-NO', { dateStyle: 'short', timeStyle: 'short' });
                    }
                    
                    return (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-display font-bold tracking-widest text-sm">{c.code}</td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                          c.is_used ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                        )}>
                          {c.is_used ? "Brukt" : "Ledig"}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-400 truncate max-w-[150px]">{c.redeemed_by || '–'}</td>
                      <td className="p-4 text-xs text-slate-400">{activatedStr}</td>
                      <td className="p-4 text-xs text-slate-400">{c.expires_at ? new Date(c.expires_at).toLocaleString('no-NO', { dateStyle: 'short', timeStyle: 'short' }) : '–'}</td>
                      <td className="p-4 text-[10px] text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-brand-border flex justify-center">
              <button onClick={loadCodes} className="text-xs font-bold text-brand-blue flex items-center gap-2 hover:underline">
                <RefreshCcw className="w-3 h-3" /> Last inn flere
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
