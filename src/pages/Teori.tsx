import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { getSupabase } from '@/src/lib/supabase';
import { useUser } from '../lib/AuthContext';
import AppShell from '../components/AppShell';
import { useStore } from '../lib/store';
import { CATS } from '../data/questions';
import { Lock, Unlock, Globe, HelpCircle, ArrowLeft, Ticket, AlertCircle } from 'lucide-react';
import { checkUserAccess, redeemAccessCode } from '../lib/access';

export default function Teori() {
  const { user } = useUser();
  const { expiration, setExpiration, lang, catId } = useStore();

  const [code, setCode] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (user) {
      checkActiveAccess();
    }
  }, [user]);

  const checkActiveAccess = async () => {
    try {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'amjmah87@gmail.com';
      const userId = user?.primaryEmailAddress?.emailAddress || user?.id;

      if (userId === adminEmail) {
        // Administratorer har automatisk evig tilgang
        setExpiration(new Date('2099-12-31T23:59:59Z'));
        return;
      }

      if (!userId) return;
      const exp = await checkUserAccess(userId);
      if (exp) {
        setExpiration(exp);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setInitialLoad(false);
    }
  };

  const labels: Record<string, any> = {
    no: {
      title: "Lås opp full tilgang",
      desc: "Skriv inn koden du har mottatt på e-post",
      prompt: "Har du ikke en kode? Ta kontakt over e-post for å bestille.",
      placeholder: "f.eks. D3-XXXX",
      activate: "Aktiver",
      support: "Kontakt support på amjmah87@gmail.com ved problemer.",
      invalid: "Koden finnes ikke eller er ugyldig.",
      expired: "Denne koden har utløpt.",
      already_used: "Denne koden er allerede benyttet.",
      availablePlans: "Tilgjengelige tidsplaner:",
      t24Title: "T24 - 24 Timer",
      t24Sub: "Siste-liten repetisjon",
      t24Badge: "1 Dag",
      d3Title: "D3 - 3 Dager",
      d3Sub: "Populær helgepakke",
      d3Badge: "3 Dager",
      d3Pop: "POPPIS",
      d7Title: "D7 - 7 Dager",
      d7Sub: "Full beståttgaranti",
      d7Badge: "1 Uke",
      footSafe: "Kildebasert og trygt"
    },
    en: {
      title: "Unlock Full Access",
      desc: "Enter the code you received on email",
      prompt: "Don't have an access key? Contact email to purchase.",
      placeholder: "e.g., D3-XXXX",
      activate: "Activate",
      support: "Contact support at amjmah87@gmail.com if you face issues.",
      invalid: "Token is invalid or does not exist.",
      expired: "This access token has expired.",
      already_used: "This access token has already been used.",
      availablePlans: "Available Study Passes:",
      t24Title: "T24 - 24 Hours",
      t24Sub: "Last-minute study pass",
      t24Badge: "1 Day",
      d3Title: "D3 - 3 Days",
      d3Sub: "Popular weekend pass",
      d3Badge: "3 Days",
      d3Pop: "POPULAR",
      d7Title: "D7 - 7 Days",
      d7Sub: "Pass guaranteed pass",
      d7Badge: "1 Week",
      footSafe: "Source-verified and secure"
    },
    ar: {
      title: "فتح قفل الوصول الكامل",
      desc: "أدخل الكود الذي تلقيته على بريدك الإلكتروني",
      prompt: "لا تملك كود تفعيل؟ تواصل عبر البريد الإلكتروني للحصول عليه.",
      placeholder: "مثال: D3-XXXX",
      activate: "تفعيل",
      support: "تواصل مع الدعم الفني amjmah87@gmail.com في حال وجود مشاكل.",
      invalid: "الكود المدخل غير موجود أو منتهي الصلاحية.",
      expired: "انتهت صلاحية كود التفعيل هذا.",
      already_used: "كود التفعيل هذا مستخدم بالفعل للحساب.",
      availablePlans: "باقات الدراسة المتاحة:",
      t24Title: "T24 - ٢٤ ساعة",
      t24Sub: "مراجعة اللحظات الأخيرة قبل الاختبار",
      t24Badge: "يوم واحد",
      d3Title: "D3 - ٣ أيام",
      d3Sub: "باقة عطلة نهاية الأسبوع الأكثر شعبية",
      d3Badge: "٣ أيام",
      d3Pop: "شائع",
      d7Title: "D7 - ٧ أيام",
      d7Sub: "ضمان كامل ومثالي للنجاح",
      d7Badge: "أسبوع واحد",
      footSafe: "معتمد وآمن ١٠٠٪"
    },
    pl: {
      title: "Odblokuj Pełny Dostęp",
      desc: "Wpisz kod, który otrzymałeś na e-mail",
      prompt: "Nie masz kodu? Skontaktuj się e-mailowo, aby zamówić.",
      placeholder: "np. D3-XXXX",
      activate: "Aktywuj",
      support: "W razie problemów skontaktuj się z obsługą pod adresem amjmah87@gmail.com.",
      invalid: "Kod nie istnieje lub jest nieprawidłowy.",
      expired: "Ten kod dostępu wygasł.",
      already_used: "Ten kod został już wykorzystany.",
      availablePlans: "Dostępne pakiety nauki:",
      t24Title: "T24 - 24 Godziny",
      t24Sub: "Powtórka na ostatnią chwilę",
      t24Badge: "1 Dzień",
      d3Title: "D3 - 3 Dni",
      d3Sub: "Popularny pakiet weekendowy",
      d3Badge: "3 Dni",
      d3Pop: "HIT",
      d7Title: "D7 - 7 Dni",
      d7Sub: "Pełna gwarancja zdania",
      d7Badge: "1 Tydzień",
      footSafe: "Rzetelność i bezpieczeństwo"
    }
  };

  const t = labels[lang] || labels['no'];

  const handleRedeem = async () => {
    if (!code || !user) return;
    setCodeLoading(true);
    setCodeError('');

    const inputCode = code.trim().toUpperCase();
    const userId = user.primaryEmailAddress?.emailAddress || user.id;

    try {
      if (!userId) throw new Error('Not authenticated');
      const newExp = await redeemAccessCode(userId, code);
      setExpiration(newExp);
      setCode('');
    } catch (err: any) {
      let msg = err.message || 'Kunne ikke aktivere kode.';
      if (err.message === 'invalid_code') msg = t.invalid;
      if (err.message === 'already_used') msg = t.already_used;
      if (err.message === 'code_expired') msg = t.expired;
      if (err.message === 'activation_failed') msg = 'Kunne ikke aktivere koden.';
      setCodeError(msg);
    } finally {
      setCodeLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-brand-dark flex justify-center items-center">
         <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (!expiration) {
    const activeCat = catId ? CATS.find(c => c.id === catId) : null;
    const activeCatName = activeCat ? ((activeCat as any)[lang]?.name || (activeCat as any)['no']?.name || catId) : '';
    const activeCatIcon = activeCat ? activeCat.icon : '✨';
    const activeCatColor = activeCat ? activeCat.color : '#2563eb';

    const currentOpeningLabel: Record<string, string> = {
      no: "Du prøver å åpne:",
      en: "You are opening:",
      ar: "أنت تحاول فتح:",
      pl: "Próbujesz otworzyć:"
    };

    const promptLabel = currentOpeningLabel[lang] || currentOpeningLabel['no'];

    return (
      <div className="min-h-screen bg-brand-dark flex flex-col relative w-full overflow-y-auto" style={{
        background: 'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(37,99,235,0.08), transparent), var(--color-brand-dark)',
      }}>
        {/* Navigation Action Header */}
        <header className="w-full max-w-4xl mx-auto px-4 py-5 flex justify-between items-center z-20 shrink-0">
          <button 
            onClick={() => window.location.href = '/'}
            className="text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer bg-white/5 border border-brand-border rounded-xl px-3.5 py-2.5 shadow-[0_0_15px_rgba(255,255,255,0.02)]"
          >
            <ArrowLeft className="w-4 h-4 rtl:scale-x-[-1]" />
            <span>{lang === 'no' ? 'Gå til Hjem' : lang === 'en' ? 'Back to Home' : lang === 'ar' ? 'الرئيسية' : 'Hjem'}</span>
          </button>
        </header>

        {/* Content locks overview container */}
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 flex items-center justify-center py-6 pb-16 z-10">
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch bg-brand-dark-2/40 border border-brand-border/60 rounded-3xl overflow-hidden shadow-2xl relative">
            
            {/* Left Box: Active Target curriculum segment details and Plan tier details */}
            <div className="md:col-span-5 bg-gradient-to-br from-brand-blue/15 via-cyan-500/5 to-transparent p-7 flex flex-col justify-between border-b md:border-b-0 md:border-r border-brand-border/50 relative">
              <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-brand-blue/10 to-transparent blur-xl pointer-events-none"></div>
              
              {/* Context prompt */}
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 leading-none">
                  <Lock className="w-3 h-3" />
                  Premium Content Locked
                </span>
                
                <div>
                  <div className="text-[11px] font-mono text-slate-400 tracking-wider uppercase mb-1">
                    {promptLabel}
                  </div>
                  <div className="flex items-center gap-3 bg-brand-dark/50 border border-brand-border/80 rounded-xl p-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                      style={{ background: `${activeCatColor}15`, border: `1px solid ${activeCatColor}25` }}
                    >
                      {activeCatIcon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-extrabold text-white text-sm truncate">
                        {activeCatName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans truncate">
                        ID: {catId} · Teoribank
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Tiers summary list */}
                <div className="pt-6 border-t border-brand-border/40 space-y-3.5">
                  <h4 className="text-[11px] font-black font-display text-white uppercase tracking-wider pl-0.5">
                    {t.availablePlans}
                  </h4>
                  <div className="space-y-2.5">
                    <div className="bg-white/[0.02] border border-brand-border/40 rounded-xl p-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">{t.t24Title}</div>
                        <p className="text-[10px] text-slate-400 leading-none mt-0.5">{t.t24Sub}</p>
                      </div>
                      <span className="text-[10px] font-mono text-brand-blue-lt bg-brand-blue/10 px-2 py-0.5 rounded border border-brand-blue/20 font-bold uppercase">{t.t24Badge}</span>
                    </div>

                    <div className="bg-white/[0.02] border border-[#2563eb]/25 rounded-xl p-2.5 flex items-center justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-[#2563eb] text-white text-[8px] font-black px-1.5 py-0.5 rounded-bl">{t.d3Pop}</div>
                      <div>
                        <div className="text-xs font-bold text-white">{t.d3Title}</div>
                        <p className="text-[10px] text-slate-400 leading-none mt-0.5">{t.d3Sub}</p>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-bold uppercase">{t.d3Badge}</span>
                    </div>

                    <div className="bg-white/[0.02] border border-brand-border/40 rounded-xl p-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">{t.d7Title}</div>
                        <p className="text-[10px] text-slate-400 leading-none mt-0.5">{t.d7Sub}</p>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">{t.d7Badge}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Support Badge */}
              <div className="pt-4 mt-6 border-t border-brand-border/30 flex items-center gap-2 text-slate-500 font-mono text-[9px] uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                {t.footSafe}
              </div>
            </div>

            {/* Right Box: Key input redeeming field and errors warnings */}
            <div className="md:col-span-7 p-6 sm:p-9 flex flex-col justify-center relative">
              <div className="max-w-md mx-auto w-full space-y-5">
                
                {/* Header text */}
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-black text-white leading-tight">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                    {t.desc}
                  </p>
                </div>

                {/* prompt */}
                <div className="bg-brand-dark/40 border border-brand-border p-3.5 rounded-xl text-center text-[11px] leading-relaxed text-slate-300 font-sans">
                  🎟️ {t.prompt}
                </div>

                {/* Inline redeeming form */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      className={cn(
                        "flex-1 bg-brand-dark text-white border-[1.5px] rounded-xl px-4 py-3 text-sm font-mono tracking-widest uppercase outline-none transition-all focus:border-brand-blue text-center sm:text-left rtl:text-center",
                        codeError ? "border-red-500/70" : "border-brand-border focus:border-brand-blue"
                      )}
                      placeholder={t.placeholder}
                      maxLength={30}
                      value={code}
                      onChange={(e) => { setCode(e.target.value.toUpperCase()); setCodeError(''); }}
                    />
                    <button
                      onClick={handleRedeem}
                      disabled={codeLoading || !code}
                      className="px-6 py-3 rounded-xl bg-gradient-to-br from-brand-blue to-[#1d5fcc] hover:from-brand-blue/95 hover:to-[#1d5fcc]/95 text-white font-display text-xs font-bold uppercase tracking-wide cursor-pointer whitespace-nowrap transition-all shadow-md flex items-center justify-center min-h-[44px] disabled:opacity-40"
                    >
                      {codeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{t.activate}</span>}
                    </button>
                  </div>

                  {codeError && (
                    <div className="text-xs text-red-300 font-semibold font-sans bg-red-500/5 border border-red-500/10 p-3 rounded-xl leading-relaxed flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{codeError}</span>
                    </div>
                  )}
                </div>

                {/* email warning block */}
                <div className="text-[10px] text-slate-500 text-center leading-normal pt-2 border-t border-brand-border/40 font-sans">
                  {t.support}
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    );
  }

  // Active state: show App Shell
  return <AppShell />;
}
