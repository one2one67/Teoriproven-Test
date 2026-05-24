import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getSupabase, ADMIN_EMAIL } from '@/src/lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Plus,
  RefreshCcw,
  Copy,
  Mail,
  Users,
  Ticket,
  BarChart3,
  Loader2,
  ExternalLink,
  Check,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { AccessCode } from '@/src/types';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, used: 0 });
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [activeTab, setActiveTab] = useState<'gen' | 'list' | 'email'>('gen');

  // Gen form
  const [genCount, setGenCount] = useState(1);
  const [genPlan, setGenPlan] = useState(7);
  const [genNote, setGenNote] = useState('');
  const [genLoading, setGenLoading] = useState(false);
  const [lastCodes, setLastCodes] = useState<string[]>([]);

  // Email form
  const [emailTo, setEmailTo] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailPlan, setEmailPlan] = useState(7);

  const navigate = useNavigate();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.email !== ADMIN_EMAIL) {
        navigate('/dashboard');
        return;
      }
      setUser(session.user);
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
      const supabase = getSupabase();
      const { count: total } = await supabase.from('access_codes').select('*', { count: 'exact', head: true });
      const { count: used } = await supabase.from('access_codes').select('*', { count: 'exact', head: true }).eq('is_used', true);
      setStats({ total: total || 0, used: used || 0 });
    } catch (e) {
      console.error(e);
    }
  };

  const loadCodes = async () => {
    try {
      const { data } = await getSupabase().from('access_codes').select('*').order('created_at', { ascending: false }).limit(100);
      if (data) setCodes(data);
    } catch (e) {
      console.error(e);
    }
  };

  const makeCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${seg()}-${seg()}-${seg()}`;
  };

  const generateCodes = async () => {
    setGenLoading(true);
    try {
      const newCodes = Array.from({ length: genCount }, () => makeCode());
      const rows = newCodes.map(c => ({
        code: c,
        plan_days: genPlan,
        created_by: ADMIN_EMAIL + (genNote ? ` | ${genNote}` : '')
      }));

      const { error } = await getSupabase().from('access_codes').insert(rows);
      if (!error) {
        setLastCodes(newCodes);
        setEmailCode(newCodes[0]);
        setEmailPlan(genPlan);
        await loadStats();
        if (activeTab === 'list') await loadCodes();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenLoading(false);
    }
  };

  const copyCodes = () => {
    navigator.clipboard.writeText(lastCodes.join('\n'));
  };

  const getEmailPreview = () => {
    const daysStr = emailPlan === 1 ? '24 timer' : `${emailPlan} dager`;
    return `Hei!

Du har mottatt en tilgangskode til teoriøving.no – ${daysStr} full tilgang.

Din kode: ${emailCode || 'XXXX-XXXX-XXXX'}

Slik bruker du koden:
1. Gå til teoriøving.no og logg inn (eller opprett gratis konto)
2. Gå til "Min konto" → "Løs inn kode"
3. Lim inn koden og klikk "Aktiver"

Dette gir deg full tilgang til over 1000 spørsmål, flashkort og eksamensimulering i ${daysStr}.

Lykke til med prøven! 🎓

– teoriøving.no`;
  };

  const openMailClient = () => {
    const daysStr = emailPlan === 1 ? '24 timer' : `${emailPlan} dager`;
    const subject = `Din tilgangskode til teoriøving.no – ${daysStr}`;
    const body = getEmailPreview();
    window.open(`mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  if (loading) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Admin-panel</h1>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
              Shield
            </span>
          </div>
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
        <button
          onClick={() => setActiveTab('email')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-xs font-bold font-display transition-all flex items-center gap-2",
            activeTab === 'email' ? "bg-brand-dark-2 text-white shadow-lg" : "text-slate-500 hover:text-slate-400"
          )}
        >
          <Mail className="w-4 h-4" /> Send e-post
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
                  <Ticket className="w-5 h-5 text-brand-blue" /> Generer nye koder
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Abonnement</label>
                    <select
                      value={genPlan}
                      onChange={(e) => setGenPlan(parseInt(e.target.value))}
                      className="w-full bg-brand-dark border border-brand-border rounded-xl p-3 text-sm focus:border-brand-blue outline-none"
                    >
                      <option value={1}>24 timer (99 kr)</option>
                      <option value={3}>3 dager (249 kr)</option>
                      <option value={7}>7 dager (499 kr)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Antall koder</label>
                    <input
                      type="number"
                      value={genCount}
                      onChange={(e) => setGenCount(parseInt(e.target.value))}
                      min="1" max="50"
                      className="w-full bg-brand-dark border border-brand-border rounded-xl p-3 text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Internt notat</label>
                    <input
                      type="text"
                      value={genNote}
                      onChange={(e) => setGenNote(e.target.value)}
                      placeholder="F.eks. Sommerkampanje"
                      className="w-full bg-brand-dark border border-brand-border rounded-xl p-3 text-sm outline-none"
                    />
                  </div>

                  <button
                    onClick={generateCodes}
                    disabled={genLoading}
                    className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-display font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20"
                  >
                    {genLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generer nå"}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {lastCodes.length > 0 ? (
                  <div className="glass-card p-8 border-emerald-500/20 bg-emerald-500/5 h-full">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-display font-bold text-lg text-emerald-400">Resultat</h3>
                      <button onClick={copyCodes} className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors text-emerald-400">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {lastCodes.map((c, i) => (
                        <div key={i} className="bg-brand-dark border border-emerald-500/10 p-3 rounded-lg text-center font-display font-bold tracking-[0.2em] text-emerald-400 text-lg">
                          {c}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setActiveTab('email')}
                      className="w-full mt-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-display font-bold text-sm hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" /> Send på e-post
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
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Plan</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Innløst av</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {codes.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-display font-bold tracking-widest text-sm">{c.code}</td>
                      <td className="p-4 text-xs text-slate-400">{c.plan_days} dager</td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                          c.is_used ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                        )}>
                          {c.is_used ? "Brukt" : "Ledig"}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-400 truncate max-w-[150px]">{c.redeemed_by || '–'}</td>
                      <td className="p-4 text-[10px] text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
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

        {activeTab === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Mottaker</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="bruker@epost.no"
                    className="w-full bg-brand-dark border border-brand-border rounded-xl p-3 text-sm outline-none"
                  />
                </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Kode</label>
                      <input
                        type="text"
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value.toUpperCase())}
                        className="w-full bg-brand-dark border border-brand-border rounded-xl p-3 text-sm font-display font-bold tracking-widest outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Plan</label>
                      <select
                        value={emailPlan}
                        onChange={(e) => setEmailPlan(parseInt(e.target.value))}
                        className="w-full bg-brand-dark border border-brand-border rounded-xl p-3 text-sm outline-none"
                      >
                        <option value={1}>24 timer</option>
                        <option value={3}>3 dager</option>
                        <option value={7}>7 dager</option>
                      </select>
                    </div>
                  </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Forhåndsvisning</label>
                  <div className="bg-brand-dark/50 border border-brand-border rounded-xl p-6 text-xs text-slate-400 font-mono whitespace-pre-wrap leading-relaxed">
                    {getEmailPreview()}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={openMailClient}
                    className="flex-1 bg-brand-blue hover:bg-brand-blue/90 text-white font-display font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /> Åpne i e-postklient
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(getEmailPreview())}
                    className="px-6 rounded-xl border border-brand-border hover:bg-brand-dark-2 transition-all"
                    title="Kopier tekst"
                  >
                    <Copy className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
