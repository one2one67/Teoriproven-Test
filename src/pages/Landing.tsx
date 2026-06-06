import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  PenSquare, 
  ClipboardList, 
  Award,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  PlaySquare,
  Zap,
  Globe2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../lib/store';
import { useUser } from '../lib/AuthContext';
import { checkUserAccess, redeemAccessCode } from '../lib/access';
import { cn } from '../lib/utils';

export default function Landing() {
  const { lang, setCatId, expiration, setExpiration } = useStore();
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');

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

          if (userId) {
            const expDate = await checkUserAccess(userId);
            if (expDate) setExpiration(expDate);
          }
        } catch (e) {
          console.error('Error fetching active access', e);
        }
      };
      checkActiveAccess();
    }
  }, [isSignedIn, user, setExpiration]);

  const handleCategoryClick = (catId?: string) => {
    if (catId) {
      setCatId(catId as any);
    }
    if (isSignedIn) {
      navigate('/teori');
    } else {
      navigate(`/auth?redirect=/teori`);
    }
  };

  const scrollToLower = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    
    if (!isSignedIn) {
      navigate('/auth');
      return;
    }

    setCodeLoading(true);
    setCodeError('');
    setCodeSuccess('');
    
    try {
      const userId = user?.primaryEmailAddress?.emailAddress || user?.id;
      if (!userId) throw new Error('Not authenticated');
      
      const newExp = await redeemAccessCode(userId, code);
      setExpiration(newExp);
      setCode('');
      setCodeSuccess('Koden er aktivert! Velkommen til Teorigo.');
    } catch (err: any) {
      let msg = err.message || 'Error';
      if (err.message === 'invalid_code') msg = 'Koden finnes ikke eller er ugyldig.';
      if (err.message === 'already_used') msg = 'Koden er allerede benyttet eller oppbrukt.';
      if (err.message === 'code_expired') msg = 'Koden har utløpt.';
      setCodeError(msg);
    } finally {
      setCodeLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-brand-dark flex flex-col relative w-full overflow-y-auto" style={{ paddingBottom: '0' }}>
      
      {/* 1. HERO */}
      <section className="w-full relative px-4 sm:px-6 py-20 lg:py-28 text-center flex flex-col items-center border-b border-brand-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.12),transparent_60%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="font-display text-[40px] md:text-[56px] lg:text-[64px] font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            Lær teori smartere, med bilder, <br className="hidden md:block" />
            <span className="text-brand-blue-lt">forklaringer og ekte kilder</span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mb-10 leading-relaxed font-sans px-2">
            Tren på trafikkskilt, komplekse situasjoner, trafikkregler og eksamenslignende oppgaver – alt samlet for at du skal bestå.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4">
            <button 
              onClick={() => handleCategoryClick()}
              className="w-full sm:w-auto bg-brand-blue hover:bg-brand-blue/90 text-white font-display font-bold py-4 px-8 rounded-xl text-[15px] transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] cursor-pointer"
            >
              Start gratis
            </button>
            <button 
              onClick={() => scrollToLower('kodetilgang')}
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-brand-border text-white font-display font-medium py-4 px-8 rounded-xl text-[15px] transition-all cursor-pointer"
            >
              Jeg har kode
            </button>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="w-full bg-brand-dark-2 border-b border-brand-border/60 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-[13px] sm:text-sm font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <PlaySquare className="w-4 h-4 text-brand-blue-lt" />
            Bildebaserte oppgaver
          </div>
          <div className="hidden sm:block text-brand-border">|</div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Kildebasert læring
          </div>
          <div className="hidden sm:block text-brand-border">|</div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Korte økter
          </div>
          <div className="hidden sm:block text-brand-border">|</div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            Flere språk
          </div>
        </div>
      </section>

      {/* 3. TEMAKATALOG */}
      <section className="w-full py-24 px-4 max-w-7xl mx-auto border-b border-brand-border/40">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight">Temakatalog</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { id: 'personbil_b', n: 'Skilt', icon: '🛑' },
            { id: 'b_visual', n: 'Vegoppmerking', icon: '🛣️' },
            { id: 'b_situations', n: 'Vikeplikt', icon: '⚠️' },
            { id: 'b_knowledge', n: 'Parkering', icon: '🅿️' },
            { id: 'b_driving_dynamics', n: 'Lys og signaler', icon: '🚦' },
            { id: 'b_environment', n: 'Tunneler og kjøring i trafikk', icon: '🚇' }
          ].map(c => (
             <div 
               key={c.id}
               onClick={() => handleCategoryClick(c.id)}
               className="bg-brand-dark-2 border border-brand-border rounded-2xl p-6 cursor-pointer hover:border-brand-blue/40 hover:bg-brand-blue/5 transition-all flex items-center justify-between group shadow-sm hover:shadow-lg"
             >
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-brand-dark flex items-center justify-center text-2xl shadow-inner border border-white/5">
                   {c.icon}
                 </div>
                 <span className="font-display font-bold text-[16px] text-slate-200 group-hover:text-white transition-colors">{c.n}</span>
               </div>
               <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-brand-blue-lt transition-colors" />
             </div>
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={() => handleCategoryClick()}
            className="text-brand-blue-lt hover:text-white font-bold font-display text-[15px] underline underline-offset-4 decoration-brand-blue-lt/30 hover:decoration-brand-blue-lt transition-all cursor-pointer inline-flex items-center gap-2"
          >
            Se alle temaer <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. FORTSETT LÆRING */}
      {isSignedIn && (
        <section className="w-full py-20 px-4 bg-brand-blue/5 border-b border-brand-border/40">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-10 tracking-tight text-center sm:text-left">Fortsett der du slapp</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div 
                onClick={() => handleCategoryClick()}
                className="bg-brand-dark-2/90 border border-brand-border p-6 rounded-2xl cursor-pointer hover:border-brand-blue/50 transition-colors group"
              >
                <div className="text-[11px] font-bold text-brand-blue-lt uppercase tracking-widest mb-3 font-mono">Siste Tema</div>
                <div className="font-display font-bold text-white text-lg mb-4">Skilt og Oppmerking</div>
                <div className="text-[13px] font-bold text-slate-400 group-hover:text-white flex items-center gap-1 transition-colors">
                  Fortsett trening <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
              
              <div 
                onClick={() => handleCategoryClick()}
                className="bg-brand-dark-2/90 border border-brand-border p-6 rounded-2xl cursor-pointer hover:border-brand-blue/50 transition-colors group"
              >
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-3 font-mono">Siste Quiz</div>
                <div className="font-display font-bold text-white text-lg mb-4">Blandet test (45 spm)</div>
                <div className="text-[13px] font-bold text-slate-400 group-hover:text-white flex items-center gap-1 transition-colors">
                  Vis resultater <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div 
                onClick={() => handleCategoryClick()}
                className="bg-brand-dark-2/90 border border-brand-border p-6 rounded-2xl cursor-pointer hover:border-brand-blue/50 transition-colors group"
              >
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-3 font-mono">Siste Flashkortsett</div>
                <div className="font-display font-bold text-white text-lg mb-4">Vikeplikt situasjoner</div>
                <div className="text-[13px] font-bold text-slate-400 group-hover:text-white flex items-center gap-1 transition-colors">
                  Øv på nytt <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. HVORDAN DET FUNGERER */}
      <section className="w-full py-24 px-4 max-w-7xl mx-auto border-b border-brand-border/40">
        <div className="text-center mb-16">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">Hvordan det fungerer</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-dark-2 border border-brand-border text-white font-display text-2xl font-extrabold flex items-center justify-center mb-6 shadow-xl relative overflow-hidden">
               <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-blue opacity-50"></div>
               1
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-3">Velg tema</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-dark-2 border border-brand-border text-white font-display text-2xl font-extrabold flex items-center justify-center mb-6 shadow-xl relative overflow-hidden">
               <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 opacity-50"></div>
               2
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-3">Øv med bilder og forklaringer</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-dark-2 border border-brand-border text-white font-display text-2xl font-extrabold flex items-center justify-center mb-6 shadow-xl relative overflow-hidden">
               <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-500 opacity-50"></div>
               3
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-3">Test deg med quiz og eksamen</h3>
          </div>
        </div>
      </section>

      {/* 6. LÆRINGSFORDELER */}
      <section className="w-full py-24 px-4 bg-brand-dark-2/40 border-b border-brand-border/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-12 tracking-tight">Læringsfordeler</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-4 border border-brand-blue/20">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-white text-lg mb-2">Korte økter</h4>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
                <PenSquare className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-white text-lg mb-2">Interaktive spørsmål</h4>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-white text-lg mb-2">Kilder på innholdet</h4>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-white text-lg mb-2">Bygget for teoriprøven</h4>
            </div>
          </div>
        </div>
      </section>

      {/* 7. KODETILGANG */}
      <section id="kodetilgang" className="w-full py-28 px-4 bg-brand-dark text-center">
        <div className="max-w-xl mx-auto bg-brand-dark-2 border border-brand-border p-10 rounded-[32px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-brand-blue/10 to-transparent rounded-bl-full pointer-events-none" />
          
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-3 relative z-10 tracking-tight">Kodetilgang</h2>
          <p className="text-slate-400 text-[15px] mb-10 relative z-10">Har du fått tilgangskode fra admin?</p>

          <form onSubmit={handleRedeem} className="space-y-4 relative z-10 flex flex-col items-center">
            <input
              type="text"
              placeholder="Skriv inn kode"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-brand-dark text-white border-[1.5px] border-brand-border rounded-xl px-5 py-4 text-[15px] font-mono font-bold uppercase tracking-widest outline-none focus:border-brand-blue transition-colors text-center shadow-inner"
            />
            
            {codeError && <div className="w-full text-red-400 text-sm font-bold bg-red-500/10 py-3 rounded-lg border border-red-500/20">{codeError}</div>}
            {codeSuccess && <div className="w-full text-emerald-400 text-sm font-bold bg-emerald-500/10 py-3 rounded-lg border border-emerald-500/20">{codeSuccess}</div>}
            
            <button
              type="submit"
              disabled={codeLoading}
              className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-display font-bold py-4 px-6 rounded-xl text-[15px] transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {codeLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Åpne min konto"}
            </button>
          </form>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="w-full py-10 border-t border-brand-border bg-brand-dark-2 text-center">
        <p className="text-slate-500 text-[13px] font-bold tracking-wider font-display uppercase">© Teorigo.no</p>
      </footer>

    </div>
  );
}