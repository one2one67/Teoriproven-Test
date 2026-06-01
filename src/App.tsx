/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Teori from './pages/Teori';
import Eksamen from './pages/Eksamen';
import Bank from './pages/Bank';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Legal from './pages/Legal';
import CookieBanner from './components/CookieBanner';
import { StoreProvider, useStore } from './lib/store';
import { AuthProvider, useUser } from './lib/AuthContext';

function Footer() {
  const { lang } = useStore();
  const t = {
    no: { privacy: 'Personvern', terms: 'Vilkår', cookies: 'Cookies', contact: 'Kontakt' },
    en: { privacy: 'Privacy Policy', terms: 'Terms', cookies: 'Cookies', contact: 'Contact' },
    ar: { privacy: 'سياسة الخصوصية', terms: 'الشروط', cookies: 'ملفات تعريف الارتباط', contact: 'اتصل بنا' },
    pl: { privacy: 'Prywatność', terms: 'Warunki', cookies: 'Cookies', contact: 'Kontakt' },
  };
  const labels = t[lang as keyof typeof t] || t.no;

  return (
    <footer className="py-8 border-t border-brand-border/20 bg-brand-dark-2/20 text-center font-sans">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] text-slate-400 font-medium">
          <Link to="/privacy" className="hover:text-white transition-colors">{labels.privacy}</Link>
          <Link to="/terms" className="hover:text-white transition-colors">{labels.terms}</Link>
          <Link to="/cookies" className="hover:text-white transition-colors">{labels.cookies}</Link>
          <Link to="/contact" className="hover:text-white transition-colors">{labels.contact}</Link>
        </div>
        <div className="text-[11px] text-slate-500 tracking-wide mt-2">
          Copyright © Teorigo.no
        </div>
      </div>
    </footer>
  );
}

function MainAppContent() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { lang } = useStore();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'amjmah87@gmail.com';

  useEffect(() => {
    // Sett global retning og språk
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.body.className = lang === 'ar' ? 'rtl' : lang === 'pl' ? 'pl-font' : '';
  }, [lang]);

  useEffect(() => {
    // 1. Forhindre høyreklikk
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Forhindre kopiering (Copy event)
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    // 3. Forhindre snarveier (Copy, Print, Save, Developer tools)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (isMeta && key === 'c') e.preventDefault();
      if (isMeta && key === 'p') e.preventDefault();
      if (isMeta && key === 's') e.preventDefault();
      if (e.key === 'F12' || (isMeta && e.shiftKey && key === 'i')) e.preventDefault();
      if (e.key === 'PrintScreen') navigator.clipboard?.writeText?.('');
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isLoaded) {
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white">Laster...</div>;
  }

  const isAdmin = user?.primaryEmailAddress?.emailAddress === adminEmail;

  return (
    <Router>
      <div className="min-h-[100dvh] bg-brand-dark text-white overflow-hidden flex flex-col relative select-none">
        <Navbar />
        <div className="flex-1 flex flex-col transition-all duration-300">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Legal Pages */}
            <Route path="/privacy" element={<Legal pageType="privacy" />} />
            <Route path="/terms" element={<Legal pageType="terms" />} />
            <Route path="/cookies" element={<Legal pageType="cookies" />} />
            <Route path="/contact" element={<Legal pageType="contact" />} />

            <Route path="/teori" element={isSignedIn ? <Teori /> : <Navigate to="/auth?redirect=/teori" />} />
            <Route path="/dashboard" element={isSignedIn ? <Teori /> : <Navigate to="/auth?redirect=/dashboard" />} />
            <Route path="/eksamen" element={isSignedIn ? <Eksamen /> : <Navigate to="/auth?redirect=/eksamen" />} />
            <Route path="/bank" element={isSignedIn ? <Bank /> : <Navigate to="/auth?redirect=/bank" />} />
            <Route 
              path="/admin" 
              element={isSignedIn && isAdmin ? <Admin /> : <Navigate to="/" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
        <CookieBanner />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <MainAppContent />
      </StoreProvider>
    </AuthProvider>
  );
}
