import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { getSupabase } from '../lib/supabase';
import { useUser } from '../lib/AuthContext';
import {
  Plus,
  RefreshCcw,
  Copy,
  Ticket,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileDown,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  User,
  Calendar,
  Layers,
  Check,
  AlertTriangle,
  Clock,
  Briefcase
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { AccessCode } from '../types';

export default function Admin() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dashboard overall statistics
  const [stats, setStats] = useState({
    total: 0,
    used: 0,
    available: 0,
    conversionPct: 0
  });
  
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [activeTab, setActiveTab] = useState<'gen' | 'list'>('list');

  // Filters and search states for list tab
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'used'>('all');
  const [tierFilter, setTierFilter] = useState<'all' | '1' | '3' | '7'>('all');

  // Multi / Bulk Gen Form state
  const [genLoading, setGenLoading] = useState(false);
  const [planDays, setPlanDays] = useState<1 | 3 | 7>(7);
  const [quantity, setQuantity] = useState<number>(5);
  const [lastCodes, setLastCodes] = useState<string[]>([]);
  const [activeCopiedIndex, setActiveCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  
  // Single Code click-to-copy tracker
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      await Promise.all([loadStats(), loadCodes()]);
    } catch (err: any) {
      console.error('Error loading administrative data:', err);
      setError(err?.message || 'Det oppstod en feil under lasting av administrative data.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const supabase = getSupabase();
      const { count: total } = await supabase.from('access_codes').select('*', { count: 'exact', head: true });
      const { count: used } = await supabase.from('access_codes').select('*', { count: 'exact', head: true }).eq('is_used', true);
      
      const tot = total || 0;
      const usd = used || 0;
      const avl = Math.max(0, tot - usd);
      const conversion = tot > 0 ? Math.round((usd / tot) * 100) : 0;
      
      setStats({
        total: tot,
        used: usd,
        available: avl,
        conversionPct: conversion
      });
    } catch (e) {
      console.error('Error fetching dashboard statistics:', e);
    }
  };

  const loadCodes = async () => {
    try {
      const supabase = getSupabase();
      // Fetch up to 300 codes for powerful audit-friendly tracking
      const { data, error: codesErr } = await supabase
        .from('access_codes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(300);
      
      if (codesErr) throw codesErr;
      if (data) setCodes(data);
    } catch (e: any) {
      console.error('Error loading system codes:', e);
      setError(e.message || 'Klarte ikke hente lisenskoder.');
    }
  };

  const makeCode = (days: 1 | 3 | 7) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    
    let prefix = '';
    if (days === 1) prefix = 'T24-';
    else if (days === 3) prefix = 'D3-';
    else if (days === 7) prefix = 'D7-';

    return `${prefix}${seg()}-${seg()}`;
  };

  // Bulk Generation action using fast single-roundtrip batch inserts
  const handleBulkGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity < 1 || quantity > 100) {
      alert('Vennligst oppgi et antall mellom 1 og 100 koder.');
      return;
    }

    setGenLoading(true);
    setError(null);
    try {
      const creatorEmail = user?.primaryEmailAddress?.emailAddress || user?.email || 'admin@teorigo.no';
      const rowsToInsert = [];
      const generatedList = [];

      for (let i = 0; i < quantity; i++) {
        const token = makeCode(planDays);
        generatedList.push(token);
        rowsToInsert.push({
          code: token,
          plan_days: planDays,
          created_by: creatorEmail,
          is_used: false
        });
      }

      const supabase = getSupabase();
      const { error: insertErr } = await supabase.from('access_codes').insert(rowsToInsert);
      
      if (insertErr) throw insertErr;

      setLastCodes(generatedList);
      setCopiedAll(false);
      setActiveTab('gen'); // Stays on generation screen to show results
      await Promise.all([loadStats(), loadCodes()]);
    } catch (e: any) {
      console.error('Failed to generate batch codes:', e);
      setError('Klarte ikke bulk-generere koder: ' + (e.message || e));
    } finally {
      setGenLoading(false);
    }
  };

  // Copy helper for single code in results
  const copySingleResult = (codeToCopy: string, index: number) => {
    navigator.clipboard.writeText(codeToCopy);
    setActiveCopiedIndex(index);
    setTimeout(() => setActiveCopiedIndex(null), 1800);
  };

  // Copy all results at once
  const copyAllResults = () => {
    if (lastCodes.length === 0) return;
    navigator.clipboard.writeText(lastCodes.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Copy helper for cells inside the central table
  const copyTableCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 1500);
  };

  // CSV Export utility for offline bookkeeping and secure external audits
  const exportFilteredToCSV = () => {
    const csvRows = [
      ['ID', 'Lisenskode', 'Varighet Dager', 'Redemptions STATUS', 'Opprettet av', 'Opprettet dato', 'Innløst av', 'Innløst tidspunkt', 'Utløpsdato']
    ];

    filteredCodes.forEach(c => {
      csvRows.push([
        c.id,
        c.code,
        String(c.plan_days),
        c.is_used ? 'BRUKT' : 'LEDIG',
        c.created_by,
        new Date(c.created_at).toISOString(),
        c.redeemed_by || '',
        c.redeemed_at || '',
        c.expires_at || ''
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Teorigo_Lisenskoder_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Advanced Filtering and Searching operations (Computed state)
  const filteredCodes = codes.filter(c => {
    // Status filter
    if (statusFilter === 'available' && c.is_used) return false;
    if (statusFilter === 'used' && !c.is_used) return false;

    // Plans tier filter
    if (tierFilter !== 'all' && String(c.plan_days) !== tierFilter) return false;

    // Elastic search mapping
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const codeMatch = String(c.code || '').toLowerCase().includes(q);
      const creatorMatch = String(c.created_by || '').toLowerCase().includes(q);
      const redeemerMatch = String(c.redeemed_by || '').toLowerCase().includes(q);
      return codeMatch || creatorMatch || redeemerMatch;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative font-sans text-slate-300">
      
      {/* Back button header navigation link */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-border bg-white/5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 rtl:scale-x-[-1]" />
          <span>Gå til Hjemmeside</span>
        </button>

        <span className="text-[10px] font-mono bg-slate-800/80 border border-brand-border px-3 py-1 rounded-md text-slate-400">
          Rollesignatur: <span className="text-brand-blue-lt font-bold">Administrator</span>
        </span>
      </div>

      {/* Main Administrative Header */}
      <header className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-brand-border/40">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-brand-blue" />
            Teorigo Internkontroll
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
            Overvåk systemstatus, administrer tidsbegrensede lisenser, og bulk-generer tidsbilletter.
          </p>
        </div>

        {/* Dashboard Stat Grid - High density, professional metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-brand-dark-2/40 border border-brand-border/60 p-3 rounded-2xl">
          <div className="bg-brand-dark rounded-xl px-4 py-2.5 border border-brand-border/30">
            <div className="text-slate-500 text-[9px] font-black uppercase tracking-wider mb-0.5">Total Generated</div>
            <div className="text-xl font-display font-black text-white">{stats.total}</div>
          </div>
          
          <div className="bg-brand-dark rounded-xl px-4 py-2.5 border border-brand-border/30">
            <div className="text-emerald-500 text-[9px] font-black uppercase tracking-wider mb-0.5">Active / Unused</div>
            <div className="text-xl font-display font-black text-emerald-400">{stats.available}</div>
          </div>

          <div className="bg-brand-dark rounded-xl px-4 py-2.5 border border-brand-border/30">
            <div className="text-red-400 text-[9px] font-black uppercase tracking-wider mb-0.5">Redeemed</div>
            <div className="text-xl font-display font-black text-red-400">{stats.used}</div>
          </div>

          <div className="bg-brand-dark rounded-xl px-4 py-2.5 border border-brand-border/30">
            <div className="text-brand-blue-lt text-[9px] font-black uppercase tracking-wider mb-0.5">Conversion</div>
            <div className="text-xl font-display font-black text-brand-blue-lt flex items-center gap-1">
              {stats.conversionPct}%
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </header>

      {/* Internal System Messages / Warns */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-300 text-xs sm:text-sm flex items-start gap-2.5"
          >
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
            <div>
              <span className="font-bold">Systemfeil:</span> {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Tab Switcing Mechanism */}
      <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
        <div className="flex gap-1.5 p-1 bg-brand-dark border border-brand-border rounded-xl">
          <button
            onClick={() => setActiveTab('list')}
            className={cn(
              "px-5 py-2 rounded-lg text-xs font-bold font-display transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'list' ? "bg-brand-dark-2 text-white shadow" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            Lisenser og revisjon
          </button>
          
          <button
            onClick={() => setActiveTab('gen')}
            className={cn(
              "px-5 py-2 rounded-lg text-xs font-bold font-display transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'gen' ? "bg-brand-dark-2 text-white shadow" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            Bulk-opprett lisenser
          </button>
        </div>

        {/* Global refreshing action */}
        <button
          onClick={init}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 border border-brand-border/60 cursor-pointer flex items-center gap-1 text-xs font-bold font-display transition-colors"
          title="Oppdater systemdata"
        >
          <RefreshCcw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          <span>Last på nytt</span>
        </button>
      </div>

      {/* Tabs panels switching code */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: CODE LISENS LIST AND ADVANCED AUDIT TRACKING */}
        {activeTab === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Filter and search control bar */}
            <div className="bg-brand-dark-2 border border-brand-border rounded-2xl p-4 shadow-md grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
              
              {/* Searchbox query */}
              <div className="md:col-span-5 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Søk i lisenskode, oppretter eller innløser..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-border/80 focus:border-brand-blue text-xs rounded-xl pl-9.5 pr-4 py-2.5 text-white placeholder-slate-500 font-sans outline-none transition-colors"
                />
              </div>

              {/* Status filter selection */}
              <div className="md:col-span-3 flex items-center gap-2">
                <span className="text-[10px] uppercase font-black text-slate-500 pr-1 flex items-center gap-1 shrink-0">
                  <Filter className="w-3 h-3" /> Status
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full bg-brand-dark border border-brand-border/80 text-xs text-white rounded-xl px-3 py-2.5 outline-none font-bold cursor-pointer hover:border-slate-500 transition-colors"
                >
                  <option value="all">Alle koder</option>
                  <option value="available">Ledige (Uinnløste)</option>
                  <option value="used">Brukte (Innløste)</option>
                </select>
              </div>

              {/* Plans tier filter selection */}
              <div className="md:col-span-3 flex items-center gap-2">
                <span className="text-[10px] uppercase font-black text-slate-500 pr-1 flex items-center gap-1 shrink-0">
                  <Layers className="w-3 h-3" /> Tier
                </span>
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value as any)}
                  className="w-full bg-brand-dark border border-brand-border/80 text-xs text-white rounded-xl px-3 py-2.5 outline-none font-bold cursor-pointer hover:border-slate-500 transition-colors"
                >
                  <option value="all">Alle varigheter</option>
                  <option value="1">1 Dag (T24)</option>
                  <option value="3">3 Dager (D3)</option>
                  <option value="7">7 Dager (D7)</option>
                </select>
              </div>

              {/* Bulk Export to Excel / CSV */}
              <div className="md:col-span-1 justify-self-stretch sm:justify-self-end w-full">
                <button
                  onClick={exportFilteredToCSV}
                  disabled={filteredCodes.length === 0}
                  className="w-full p-2.5 rounded-xl border border-brand-border bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Eksporter søkeresultat til CSV"
                >
                  <FileDown className="w-4 h-4 text-brand-blue-lt" />
                  <span className="md:hidden">Last ned CSV</span>
                </button>
              </div>

            </div>

            {/* Main responsive table container */}
            <div className="bg-brand-dark-2 border border-brand-border rounded-2xl shadow-xl overflow-hidden">
              
              {/* Header metrics bar above lists */}
              <div className="px-5 py-3 border-b border-brand-border/40 bg-brand-dark/40 flex justify-between items-center text-[11px] font-bold text-slate-400">
                <span>Viser {filteredCodes.length} av totalt {codes.length} koder i databasen</span>
                <span className="hidden sm:inline">Klikk på en kode for å kopiere til utklippshavnen</span>
              </div>

              {filteredCodes.length === 0 ? (
                <div className="p-16 text-center">
                  <Ticket className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-sm text-slate-400 font-medium">Ingen lisenskoder samsvarer med søket ditt.</p>
                  <p className="text-xs text-slate-500 mt-1">Prøv å endre søkestrengen eller tilbakestille filtrene.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {/* Table layout is visible on Desktop and medium viewports */}
                  <table className="w-full text-left border-collapse hidden md:table">
                    <thead>
                      <tr className="border-b border-brand-border bg-brand-dark/50 text-slate-400">
                        <th className="p-4 text-[10px] font-black uppercase tracking-wider pl-6">Kode</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-wider">Plan / Tier</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-wider">Status</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-wider">Aktivert Av (Bruker)</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-wider">Redeem Tidspunkt</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-wider">Utløper</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-wider">Utstedt av</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/40">
                      {filteredCodes.map((c) => {
                        const tierLbl = c.plan_days === 1 ? '1 Dag (T24)' : c.plan_days === 3 ? '3 Dager (D3)' : c.plan_days === 7 ? '7 Dager (D7)' : `${c.plan_days} Dager`;
                        const isCopied = copiedCodeId === c.id;

                        // Calculate activation timestamp backwards from expiration of used codes
                        let activatedStr = '–';
                        if (c.is_used && c.expires_at) {
                          const exp = new Date(c.expires_at);
                          let hours = c.plan_days * 24;
                          if (c.code.startsWith('T24-')) hours = 24;
                          const act = new Date(exp.getTime() - hours * 60 * 60 * 1000);
                          activatedStr = act.toLocaleString('no-NO', { dateStyle: 'short', timeStyle: 'short' });
                        }

                        return (
                          <tr key={c.id} className="hover:bg-white/[0.01] transition-colors group">
                            
                            {/* Copyable code field */}
                            <td className="p-4 pl-6">
                              <button
                                onClick={() => copyTableCode(c.code, c.id)}
                                className={cn(
                                  "font-mono text-xs sm:text-[13px] font-bold tracking-wider px-2.5 py-1 rounded bg-brand-dark border hover:bg-brand-dark-2 cursor-pointer transition-all flex items-center gap-1.5 leading-none",
                                  isCopied ? "border-emerald-500/60 text-emerald-400 bg-emerald-500/[0.02]" : "border-brand-border/60 text-white"
                                )}
                              >
                                {c.code}
                                {isCopied ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ) : (
                                  <Copy className="w-3 h-3 text-slate-500 group-hover:text-slate-300 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
                                )}
                              </button>
                            </td>

                            {/* Plan days Label */}
                            <td className="p-4">
                              <span className="font-display text-xs font-bold text-slate-200">
                                {tierLbl}
                              </span>
                            </td>

                            {/* Redemption status color code */}
                            <td className="p-4">
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border leading-none",
                                c.is_used 
                                  ? "bg-red-500/10 text-red-400 border-red-500/20" 
                                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              )}>
                                {c.is_used ? (
                                  <>
                                    <XCircle className="w-2.5 h-2.5 shrink-0" /> Brukt
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-2.5 h-2.5 shrink-0" /> Ledig
                                  </>
                                )}
                              </span>
                            </td>

                            {/* Redeemer details */}
                            <td className="p-4 text-xs font-medium text-slate-300 truncate max-w-[160px]" title={c.redeemed_by || undefined}>
                              {c.redeemed_by ? (
                                <span className="flex items-center gap-1 text-slate-200">
                                  <User className="w-3.5 h-3.5 text-brand-blue" />
                                  {c.redeemed_by}
                                </span>
                              ) : (
                                <span className="text-slate-500 font-mono">–</span>
                              )}
                            </td>

                            {/* Activation time */}
                            <td className="p-4 text-xs font-mono text-slate-400">
                              {activatedStr}
                            </td>

                            {/* License ending / expiration time */}
                            <td className="p-4 text-xs font-mono">
                              {c.expires_at ? (
                                <span className={cn(
                                  "font-bold",
                                  new Date(c.expires_at).getTime() < new Date().getTime() 
                                    ? "text-slate-500 line-through" 
                                    : "text-emerald-400"
                                )}>
                                  {new Date(c.expires_at).toLocaleString('no-NO', { dateStyle: 'short', timeStyle: 'short' })}
                                </span>
                              ) : (
                                <span className="text-slate-500 font-mono">–</span>
                              )}
                            </td>

                            {/* Created by credential creator */}
                            <td className="p-4 text-[11px] text-slate-400 truncate max-w-[130px]" title={c.created_by}>
                              <div className="flex flex-col">
                                <span className="font-sans font-medium text-slate-300">{c.created_by?.split('@')[0]}</span>
                                <span className="text-[9px] font-mono text-slate-500">{new Date(c.created_at).toLocaleDateString('no-NO')}</span>
                              </div>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Responsive Grid layout for smaller screens / Mobile devices */}
                  <div className="md:hidden divide-y divide-brand-border/40 p-4 space-y-4">
                    {filteredCodes.map((c) => {
                      const tierLbl = c.plan_days === 1 ? '1 Dag (T24)' : c.plan_days === 3 ? '3 Dager (D3)' : c.plan_days === 7 ? '7 Dager (D7)' : `${c.plan_days} Dager`;
                      const isCopied = copiedCodeId === c.id;
                      
                      return (
                        <div key={c.id} className="pt-4 first:pt-0 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => copyTableCode(c.code, c.id)}
                              className={cn(
                                "font-mono text-xs font-extrabold tracking-wider px-2 py-1 rounded bg-brand-dark border focus:outline-none flex items-center gap-1.5",
                                isCopied ? "border-emerald-500/60 text-emerald-400" : "border-brand-border/80 text-white"
                              )}
                            >
                              {c.code}
                              <Copy className="w-3 h-3 text-slate-500" />
                            </button>
                            <span className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                              c.is_used ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            )}>
                              {c.is_used ? 'Brukt' : 'Ledig'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] bg-brand-dark/40 p-3 rounded-xl border border-brand-border/35 leading-tight">
                            <div>
                              <span className="text-slate-500 block text-[9px] uppercase font-black">Plan</span>
                              <span className="text-slate-200 font-bold">{tierLbl}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px] uppercase font-black">Utstedt av</span>
                              <span className="text-slate-400 text-ellipsis overflow-hidden block whitespace-nowrap">{c.created_by}</span>
                            </div>
                            <div className="col-span-2 pt-1 border-t border-brand-border/20">
                              <span className="text-slate-500 block text-[9px] uppercase font-black">Kandidat / Innløst av</span>
                              <span className="text-slate-300 font-medium truncate block">{c.redeemed_by || 'Ikke registrert ennå'}</span>
                            </div>
                            {c.expires_at && (
                              <div className="col-span-2 pt-1 border-t border-brand-border/20">
                                <span className="text-slate-500 block text-[9px] uppercase font-black">Lisens utløpstidspunkt</span>
                                <span className="text-slate-200 font-mono font-bold text-xs">{new Date(c.expires_at).toLocaleString('no-NO')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 2: BULK CODE GENERATION WIDGET */}
        {activeTab === 'gen' && (
          <motion.div
            key="gen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Control Form inputs */}
            <div className="lg:col-span-5 bg-brand-dark-2 border border-brand-border rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-blue/10 to-transparent rounded-bl-full pointer-events-none" />
              
              <h2 className="font-display text-lg font-extrabold text-white mb-4 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-brand-blue" />
                Opprett lisenser i bulk
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Velg varighet og antall unike billett-koder som skal opprettes samtidig i Teorigo-databasen.
              </p>

              <form onSubmit={handleBulkGenerate} className="space-y-6">
                {/* Durations selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">
                    Varighet for lisens (Tidsperiode)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPlanDays(1)}
                      className={cn(
                        "py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center p-2 leading-tight gap-1",
                        planDays === 1 
                          ? "bg-brand-blue/15 border-brand-blue text-white shadow-sm" 
                          : "bg-brand-dark/50 border-brand-border text-slate-400 hover:border-slate-500"
                      )}
                    >
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>T24 (1 dag)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlanDays(3)}
                      className={cn(
                        "py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center p-2 leading-tight gap-1",
                        planDays === 3 
                          ? "bg-brand-blue/15 border-brand-blue text-white shadow-sm" 
                          : "bg-brand-dark/50 border-brand-border text-slate-400 hover:border-slate-500"
                      )}
                    >
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>D3 (3 dager)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlanDays(7)}
                      className={cn(
                        "py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center p-2 leading-tight gap-1",
                        planDays === 7 
                          ? "bg-brand-blue/15 border-brand-blue text-white shadow-sm" 
                          : "bg-brand-dark/50 border-brand-border text-slate-400 hover:border-slate-500"
                      )}
                    >
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <span>D7 (7 dager)</span>
                    </button>
                  </div>
                </div>

                {/* Quantitative amount selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block pl-0.5">
                    Antall koder som skal genereres
                  </label>
                  
                  <div className="flex gap-2">
                    {[1, 5, 10, 20].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setQuantity(num)}
                        className={cn(
                          "flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer",
                          quantity === num 
                            ? "border-brand-blue text-brand-blue-lt bg-brand-blue/5" 
                            : "border-brand-border/60 text-slate-400 hover:border-slate-500 hover:bg-slate-800"
                        )}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    min={1}
                    max={100}
                    placeholder="Custom antall..."
                    value={quantity || ''}
                    onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 0)))}
                    className="w-full bg-brand-dark border border-brand-border focus:border-brand-blue text-xs rounded-xl px-4 py-3 text-white placeholder-slate-600 font-sans outline-none font-bold text-center"
                  />
                  <div className="text-[10px] text-slate-500 text-center">
                    Maksimum 100 koder per bulkoperasjon av hensyn til ytelse.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={genLoading || !quantity}
                  className="w-full py-4 bg-gradient-to-br from-brand-blue to-[#1d5fcc] hover:from-brand-blue/95 hover:to-[#1d5fcc]/95 text-white font-display text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-brand-blue/20 cursor-pointer disabled:opacity-45 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {genLoading ? (
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Bulk-generer {quantity} koder nå</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results columns displays */}
            <div className="lg:col-span-7 space-y-4">
              {lastCodes.length > 0 ? (
                <div className="bg-brand-dark-2 border border-emerald-500/20 bg-emerald-500/[0.01] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border/40 pb-5 mb-5">
                    <div>
                      <h3 className="font-display font-black text-lg text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-5 h-5" /> Opprettet med suksess!
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Kildene er lagret i databasen og er klare til å utleveres.
                      </p>
                    </div>

                    <button 
                      onClick={copyAllResults} 
                      className={cn(
                        "px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold border uppercase tracking-wider shrink-0 w-full sm:w-auto",
                        copiedAll 
                          ? "bg-emerald-500 border-emerald-500 text-white" 
                          : "bg-white/5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      )}
                    >
                      {copiedAll ? (
                        <>
                          <Check className="w-4 h-4" /> Kopiert!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Kopier alle {lastCodes.length}
                        </>
                      )}
                    </button>
                  </div>

                  {/* List of scrollable codes cards inside box */}
                  <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1.5 custom-scrollbar">
                    {lastCodes.map((codeText, index) => {
                      const isSingleCopied = activeCopiedIndex === index;
                      return (
                        <div 
                          key={index}
                          onClick={() => copySingleResult(codeText, index)}
                          className={cn(
                            "flex items-center justify-between p-3.5 rounded-xl border font-mono font-extrabold text-sm sm:text-base tracking-[0.1em] cursor-pointer transition-all",
                            isSingleCopied 
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-300" 
                              : "bg-brand-dark/60 border-brand-border/80 text-white hover:border-emerald-500/40 hover:bg-brand-dark"
                          )}
                        >
                          <span>{codeText}</span>
                          <span className="text-[10px] uppercase font-bold tracking-normal font-sans text-slate-500 flex items-center gap-1">
                            {isSingleCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" /> Kopiert
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-500" />
                              </>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* support guidelines footer instructions */}
                  <div className="bg-brand-dark/40 border border-brand-border/60 rounded-xl p-3 text-[11px] leading-relaxed text-slate-400 mt-5 font-sans">
                    💡 <span className="font-bold text-slate-300">Tips for administrasjon:</span> Du kan dytte disse kodene rett inn i e-post-maler eller sende dem til brukere via SMS. Innløsning skjer automatisk når de limer de inn i Teorigo-dashboardet.
                  </div>

                </div>
              ) : (
                <div className="bg-brand-dark-2 border border-dashed border-brand-border/60 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[300px] opacity-60">
                  <Ticket className="w-14 h-14 text-slate-700 mb-4" />
                  <h3 className="font-display font-extrabold text-white text-base">Resultatavdeling</h3>
                  <p className="text-slate-400 text-xs mt-1.5 max-w-sm leading-relaxed">
                    Når du bulk-genererer lisenser, vil de ferske unike kodene dine fylles inn i denne kolonnen for umiddelbar kopiering.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
