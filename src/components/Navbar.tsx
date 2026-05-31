import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/lib/store';
import { useUser } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'amjmah87@gmail.com';
  
  const isAdmin = user?.primaryEmailAddress?.emailAddress === adminEmail;
  const { lang, setLang, catId } = useStore();

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
              <div className="relative">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as any)}
                  className="appearance-none flex items-center justify-between pl-3 pr-8 rtl:pl-8 rtl:pr-3 min-w-[100px] h-9 rounded-lg border-[1.5px] border-brand-border bg-white/5 text-xs font-medium text-white cursor-pointer transition-all hover:bg-white/10 hover:border-[#253347] focus:outline-none focus:border-brand-blue focus:bg-brand-blue/15 focus:shadow-[0_0_0_2px_rgba(29,111,235,0.3)] [&>option]:bg-brand-dark-2"
                >
                  {[
                    { code: 'no', label: '🇳🇴 Norsk' },
                    { code: 'en', label: '🇬🇧 English' },
                    { code: 'ar', label: '🇸🇦 عربي' },
                    { code: 'pl', label: '🇵🇱 Polski' }
                  ].map(l => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 flex items-center px-2.5 text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            )}

            {isSignedIn && (
              <div className="flex items-center gap-3">
                <span className="hidden md:inline-block text-xs text-slate-400 max-w-[120px] truncate font-sans">
                  {user?.firstName || user?.email}
                </span>
                
                {/* Beautiful Custom Avatar Badge */}
                <div 
                  className="w-8 h-8 rounded-full bg-brand-blue/20 border border-brand-blue text-brand-blue-lt flex items-center justify-center text-xs font-bold font-display uppercase tracking-wider select-none shrink-0" 
                  title={user?.email}
                >
                  {(user?.email?.[0] || 'U')}
                </div>

                <button 
                  onClick={handleSignOut}
                  className="text-xs font-bold text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer h-9 px-3 border border-brand-border rounded-lg bg-white/5 hover:bg-white/10"
                >
                  {lang === 'no' ? 'Logg ut' : lang === 'en' ? 'Log out' : lang === 'ar' ? 'خروج' : 'Wyloguj'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
