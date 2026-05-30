import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { getSupabase } from '@/src/lib/supabase';
import { useUser } from '../lib/AuthContext';
import AppShell from '../components/AppShell';
import { useStore } from '../lib/store';

export default function Teori() {
  const { user } = useUser();
  const { expiration, setExpiration } = useStore();

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

      const supabase = getSupabase();

      const { data, error } = await supabase
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
      console.error(e);
    } finally {
      setInitialLoad(false);
    }
  };

  const handleRedeem = async () => {
    if (!code || !user) return;
    setCodeLoading(true);
    setCodeError('');

    const inputCode = code.trim().toUpperCase();
    const userId = user.primaryEmailAddress?.emailAddress || user.id;

    try {
      const supabase = getSupabase();
      
      const { data: codeData, error: fetchError } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', inputCode)
        .single();

      if (fetchError || !codeData) {
        throw new Error('Koden finnes ikke eller er ugyldig.');
      }

      if (codeData.is_used) {
        if (codeData.redeemed_by === userId && codeData.expires_at) {
          const exp = new Date(codeData.expires_at);
          if (exp > new Date()) {
            setExpiration(exp);
            setCode('');
            return;
          } else {
            throw new Error('Denne koden har utløpt.');
          }
        }
        throw new Error('Denne koden er allerede aktivert av en herdet bruker.');
      }

      let days = codeData.plan_days;
      let hours = 0;
      if (inputCode.startsWith('T24-')) { days = 0; hours = 24; }
      else if (inputCode.startsWith('D3-')) { days = 3; }
      else if (inputCode.startsWith('D7-')) { days = 7; }

      const expDate = new Date();
      expDate.setDate(expDate.getDate() + days);
      expDate.setHours(expDate.getHours() + hours);

      const { error: updateError } = await supabase
        .from('access_codes')
        .update({
          is_used: true,
          redeemed_by: userId,
          expires_at: expDate.toISOString()
        })
        .eq('code', inputCode);

      if (updateError) {
        throw new Error('Kunne ikke aktivere koden.');
      }

      setExpiration(expDate);
      setCode('');
    } catch (err: any) {
      setCodeError(err.message || 'Kunne ikke aktivere kode.');
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
    return (
      <div className="fixed inset-0 z-[999] bg-[#0b0f1a]/95 backdrop-blur-md flex items-center justify-center p-5">
        <div className="w-full max-w-[400px] bg-brand-dark-2 border-[1.5px] border-brand-border rounded-[20px] overflow-hidden">
          <div className="bg-gradient-to-br from-brand-blue/15 to-cyan-500/10 p-7 px-6 text-center border-b border-brand-border">
            <div className="font-display text-lg font-extrabold bg-gradient-to-br from-white via-white/70 to-[#7eb8f7] bg-clip-text text-transparent mb-1">
              teorigo<span className="bg-gradient-to-br from-brand-blue to-cyan-500 bg-clip-text text-transparent">.no</span>
            </div>
            <div className="font-display text-xl font-extrabold text-white mb-1.5">Lås opp full tilgang</div>
            <div className="text-[13px] text-slate-400 leading-relaxed">Skriv inn koden du har mottatt på e-post</div>
          </div>
          <div className="p-5 px-5">
            <div className="text-center text-4xl mb-2">🎟</div>
            <div>
              <div className="text-[12px] text-slate-400 mb-2 leading-relaxed text-center">
                Har du ikke en kode? Ta kontakt for å få tilgang.
              </div>
              <div className="flex gap-2">
                <input
                  className={cn("flex-1 bg-brand-dark text-white border-[1.5px] rounded-lg px-3.5 py-2.5 text-sm font-display tracking-widest outline-none transition-colors focus:border-brand-blue uppercase", codeError ? "border-red-500" : "border-brand-border")}
                  placeholder="XXXX-XXXX-XXXX"
                  maxLength={30}
                  value={code}
                  onChange={(e) => { setCode(e.target.value.toUpperCase()); setCodeError(''); }}
                />
                <button
                  onClick={handleRedeem}
                  disabled={codeLoading}
                  className="px-3.5 py-2.5 rounded-lg border-[1.5px] border-brand-border bg-[#1a2235] text-white font-display text-[13px] font-bold cursor-pointer whitespace-nowrap hover:border-brand-blue transition-all disabled:opacity-50"
                >
                  {codeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aktiver"}
                </button>
              </div>
              {codeError && (
                <div className="text-xs text-red-400 mt-1.5">{codeError}</div>
              )}
            </div>
          </div>
          <div className="text-[11px] text-[#4a5f73] text-center px-5 pb-4 leading-relaxed">
            Kontakt support på amjmah87@gmail.com ved problemer.
          </div>
        </div>
      </div>
    );
  }

  // Active state: show App Shell
  return <AppShell />;
}
