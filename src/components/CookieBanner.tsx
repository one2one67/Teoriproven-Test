import { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';
import { X } from 'lucide-react';

export default function CookieBanner() {
  const { lang } = useStore();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [prefs, setPrefs] = useState({
    essential: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('teorigo_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    } else {
      try {
        setPrefs(JSON.parse(consent));
      } catch (e) {}
    }
    
    // Add event listener to open cookie settings later
    const handleOpenSettings = () => {
      setIsVisible(true);
      setShowSettings(true);
    };
    
    window.addEventListener('openCookieSettings', handleOpenSettings);
    return () => window.removeEventListener('openCookieSettings', handleOpenSettings);
  }, []);

  const handleAcceptAll = () => {
    const newPrefs = { essential: true, analytics: true, marketing: true };
    localStorage.setItem('teorigo_cookie_consent', JSON.stringify(newPrefs));
    setPrefs(newPrefs);
    setIsVisible(false);
    window.dispatchEvent(new Event('cookieConsentChanged'));
  };

  const handleRejectAll = () => {
    const newPrefs = { essential: true, analytics: false, marketing: false };
    localStorage.setItem('teorigo_cookie_consent', JSON.stringify(newPrefs));
    setPrefs(newPrefs);
    setIsVisible(false);
    window.dispatchEvent(new Event('cookieConsentChanged'));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('teorigo_cookie_consent', JSON.stringify(prefs));
    setIsVisible(false);
    setShowSettings(false);
    window.dispatchEvent(new Event('cookieConsentChanged'));
  };

  if (!isVisible) return null;

  const t = {
    no: {
      title: 'Vi bruker informasjonskapsler',
      desc: 'Vi bruker informasjonskapsler (cookies) for å gi deg en bedre opplevelse, analysere trafikk, og av sikkerhetsgrunner. Du kan velge å godta alle eller tilpasse dine valg.',
      acceptAll: 'Godta alle',
      rejectAll: 'Avvis ikke-essensielle',
      customize: 'Tilpass',
      save: 'Lagre valg',
      essential: 'Nødvendige',
      essentialDesc: 'Kreves for at nettsiden skal fungere og for sikkerhet.',
      analytics: 'Analyse',
      analyticsDesc: 'Hjelper oss å forstå hvordan nettsiden brukes.',
      marketing: 'Markedsføring',
      marketingDesc: 'Brukes for å tilpasse annonser.',
    },
    en: {
      title: 'We use cookies',
      desc: 'We use cookies to improve your experience, analyze traffic, and for security reasons. You can choose to accept all or customize your choices.',
      acceptAll: 'Accept all',
      rejectAll: 'Reject non-essential',
      customize: 'Customize',
      save: 'Save preferences',
      essential: 'Essential',
      essentialDesc: 'Required for the website to function and for security.',
      analytics: 'Analytics',
      analyticsDesc: 'Helps us understand how the website is used.',
      marketing: 'Marketing',
      marketingDesc: 'Used to personalize advertisements.',
    },
    ar: {
      title: 'نحن نستخدم ملفات تعريف الارتباط',
      desc: 'نستعمل ملفات تعريف الارتباط (الكوكيز) لتحسين تجربتك، تحليل الزيارات، ولأسباب أمنية. يمكنك قبول الكل أو تخصيص خياراتك.',
      acceptAll: 'قبول الكل',
      rejectAll: 'رفض اختياري',
      customize: 'تخصيص',
      save: 'حفظ الخيارات',
      essential: 'أساسية',
      essentialDesc: 'ضرورية لعمل الموقع وللأمان.',
      analytics: 'تحليلات',
      analyticsDesc: 'تساعدنا على فهم كيفية استخدام الموقع.',
      marketing: 'تسويق',
      marketingDesc: 'تُستعمل لتخصيص الإعلانات.',
    },
    pl: {
      title: 'Używamy plików cookie',
      desc: 'Używamy plików cookie (ciasteczek), aby poprawić Twoje doświadczenie, analizować ruch i z powodów bezpieczeństwa. Możesz zaakceptować wszystkie lub dostosować wybór.',
      acceptAll: 'Akceptuj wszystkie',
      rejectAll: 'Odrzuć opcjonalne',
      customize: 'Dostosuj',
      save: 'Zapisz wybór',
      essential: 'Niezbędne',
      essentialDesc: 'Wymagane do działania strony i bezpieczeństwa.',
      analytics: 'Analityka',
      analyticsDesc: 'Pomaga nam zrozumieć, jak używana jest strona.',
      marketing: 'Marketing',
      marketingDesc: 'Używane do personalizacji reklam.',
    },
  };

  const labels = t[lang as keyof typeof t] || t.no;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto w-full pointer-events-auto">
        <div className="bg-brand-dark-2/95 backdrop-blur-xl border border-brand-border shadow-2xl rounded-2xl overflow-hidden p-6 sm:p-8">
          
          {!showSettings ? (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-display font-bold text-white mb-2">{labels.title}</h3>
                <p className="text-sm text-slate-400 font-sans leading-relaxed m-0">
                  {labels.desc}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-all"
                >
                  {labels.customize}
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-all"
                >
                  {labels.rejectAll}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-sm font-bold rounded-xl transition-all"
                >
                  {labels.acceptAll}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold text-white m-0">{labels.customize}</h3>
                <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white transition-colors p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl border border-brand-border/50 bg-white/5">
                  <input type="checkbox" checked={true} disabled className="mt-1" />
                  <div>
                    <div className="font-semibold text-white text-sm">{labels.essential}</div>
                    <div className="text-xs text-slate-400 mt-1 font-sans">{labels.essentialDesc}</div>
                  </div>
                </div>
                
                <label className="flex items-start gap-4 p-4 rounded-xl border border-brand-border/50 bg-white/[0.02] cursor-pointer hover:bg-white/5 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={prefs.analytics} 
                    onChange={(e) => setPrefs({...prefs, analytics: e.target.checked})}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-semibold text-white text-sm">{labels.analytics}</div>
                    <div className="text-xs text-slate-400 mt-1 font-sans">{labels.analyticsDesc}</div>
                  </div>
                </label>
                
                <label className="flex items-start gap-4 p-4 rounded-xl border border-brand-border/50 bg-white/[0.02] cursor-pointer hover:bg-white/5 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={prefs.marketing} 
                    onChange={(e) => setPrefs({...prefs, marketing: e.target.checked})}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-semibold text-white text-sm">{labels.marketing}</div>
                    <div className="text-xs text-slate-400 mt-1 font-sans">{labels.marketingDesc}</div>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-sm font-bold rounded-xl transition-all"
                >
                  {labels.save}
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
