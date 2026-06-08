import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/lib/store';
import { useUser } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'amjmah87@gmail.com';
  
  const isAdmin = user?.primaryEmailAddress?.emailAddress === adminEmail;
  const { lang, setLang, catId } = useStore();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img 
                src="/logo.png" 
                alt="Teorigo" 
                className="h-8 w-auto object-contain mix-blend-screen brightness-125"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextSibling) nextSibling.classList.remove('hidden');
                }}
              />
              <span className="hidden font-display text-xl font-extrabold tracking-tight text-white">
                Teorigo
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isSignedIn && (
              <>
                <Link
                  to="/teori"
                  className={cn(
                    "hidden sm:block text-sm font-medium transition-colors hover:text-white",
                    location.pathname === '/teori' ? "text-white" : "text-slate-400"
                  )}
                >
                  {lang === 'no' ? 'Hjem' : lang === 'en' ? 'Home' : lang === 'ar' ? 'الرئيسية' : 'Strona główna'}
                </Link>
                <Link
                  to="/min-side"
                  className={cn(
                    "hidden sm:block text-sm font-medium transition-colors hover:text-white",
                    location.pathname === '/min-side' ? "text-white" : "text-slate-400"
                  )}
                >
                  {lang === 'no' ? 'Min side' : lang === 'en' ? 'My Page' : lang === 'ar' ? 'صفحتي' : 'Moja Strona'}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={cn(
                      "hidden sm:block text-sm font-medium transition-colors hover:text-white",
                      location.pathname === '/admin' ? "text-white" : "text-slate-400"
                    )}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}

            {!isSignedIn && (
              <button 
                onClick={() => navigate('/auth')} 
                className="text-sm font-bold text-white hover:text-brand-blue transition-colors px-2.5 py-2 cursor-pointer"
              >
                {lang === 'no' ? 'Logg inn' : lang === 'en' ? 'Log in' : lang === 'ar' ? 'تسجيل الدخول' : 'Zaloguj'}
              </button>
            )}

            {/* Språkvelger */}
            {location.pathname === '/' && catId === null && (
              <div className="relative" ref={langRef}>
                <button
                  type="button"
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="appearance-none flex items-center justify-between px-3 min-w-[105px] h-9 rounded-lg border-[1.5px] border-brand-border bg-white/5 text-xs font-medium text-white cursor-pointer transition-all hover:bg-white/10 hover:border-[#253347] focus:outline-none focus:border-brand-blue focus:bg-brand-blue/15 focus:shadow-[0_0_0_2px_rgba(29,111,235,0.3)]"
                >
                  <div className="flex items-center gap-2">
                    {lang === 'no' && <img src="https://flagcdn.com/w40/no.png" alt="Norway" className="w-4 h-[11px] object-cover rounded-sm" />}
                    {lang === 'en' && <img src="https://flagcdn.com/w40/gb.png" alt="UK" className="w-4 h-[11px] object-cover rounded-sm" />}
                    {lang === 'ar' && <img src="https://flagcdn.com/w40/sa.png" alt="Saudi Arabia" className="w-4 h-[11px] object-cover rounded-sm" />}
                    {lang === 'pl' && <img src="https://flagcdn.com/w40/pl.png" alt="Poland" className="w-4 h-[11px] object-cover rounded-sm" />}
                    <span>{lang === 'no' ? 'Norsk' : lang === 'en' ? 'English' : lang === 'ar' ? 'عربي' : 'Polski'}</span>
                  </div>
                  <svg className={cn("w-3.5 h-3.5 text-slate-400 ml-2 rtl:mr-2 rtl:ml-0 transition-transform duration-200", isLangOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {isLangOpen && (
                  <div className="absolute top-full mt-1.5 right-0 rtl:right-auto rtl:left-0 min-w-full bg-[#0a0f18] border border-brand-border rounded-lg shadow-2xl overflow-hidden z-50 flex flex-col py-1">
                    {[
                      { code: 'no', label: 'Norsk', flag: 'no' },
                      { code: 'en', label: 'English', flag: 'gb' },
                      { code: 'ar', label: 'عربي', flag: 'sa' },
                      { code: 'pl', label: 'Polski', flag: 'pl' }
                    ].map(l => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLang(l.code as any);
                          setIsLangOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-start gap-2.5 px-3 py-2 text-xs font-medium transition-colors hover:bg-brand-blue/20",
                          lang === l.code ? "bg-brand-blue/10 text-brand-blue-lt" : "text-white"
                        )}
                      >
                        <img src={`https://flagcdn.com/w40/${l.flag}.png`} alt={l.label} className="w-4 h-[11px] object-cover rounded-sm" />
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isSignedIn && (
              <div className="flex items-center gap-3">
                <span className="hidden md:inline-block text-xs text-slate-400 max-w-[120px] truncate font-sans">
                  {user?.firstName || user?.email}
                </span>
                
                {/* Beautiful Custom Avatar Badge */}
                <Link 
                  to="/min-side"
                  className="w-8 h-8 rounded-full bg-brand-blue/20 border border-brand-blue text-brand-blue-lt flex items-center justify-center text-xs font-bold font-display uppercase tracking-wider select-none shrink-0 cursor-pointer hover:bg-brand-blue/30 transition-colors tooltip-trigger" 
                  title={lang === 'no' ? 'Gå til Min side' : 'Go to My Page'}
                >
                  {(user?.email?.[0] || 'U')}
                </Link>

                <button 
                  onClick={handleSignOut}
                  className="text-xs font-bold text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer h-9 px-2.5 sm:px-3 border border-brand-border rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {lang === 'no' ? 'Logg ut' : lang === 'en' ? 'Log out' : lang === 'ar' ? 'خروج' : 'Wyloguj'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
