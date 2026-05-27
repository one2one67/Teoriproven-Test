/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Teori from './pages/Teori';
import Eksamen from './pages/Eksamen';
import Bank from './pages/Bank';
import Admin from './pages/Admin';
import { StoreProvider } from './lib/store';

export default function App() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isScreenBlocked, setIsScreenBlocked] = useState(false);
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'amjmah87@gmail.com';

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

      // Ctrl+C / Cmd+C (Kopier)
      if (isMeta && key === 'c') {
        e.preventDefault();
      }

      // Ctrl+P / Cmd+P (Utskrift / PDF)
      if (isMeta && key === 'p') {
        e.preventDefault();
      }

      // Ctrl+S / Cmd+S (Lagre nettside)
      if (isMeta && key === 's') {
        e.preventDefault();
      }

      // F12 eller Ctrl+Shift+I / Cmd+Option+I (Utviklerverktøy)
      if (e.key === 'F12' || (isMeta && e.shiftKey && key === 'i')) {
        e.preventDefault();
      }

      // PrintScreen tast (Prøve å fjerne utklipp)
      if (e.key === 'PrintScreen') {
        navigator.clipboard?.writeText?.('');
      }
    };

    // 4. Detekter når appen legges i bakgrunnen for å skjule innhold (skjermbilde på mobil/bytte app)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsScreenBlocked(true);
      } else {
        setIsScreenBlocked(false);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);

      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (!isLoaded) {
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white">Laster...</div>;
  }

  const isAdmin = user?.primaryEmailAddress?.emailAddress === adminEmail;

  return (
    <StoreProvider>
      <Router>
        <div className="min-h-[100dvh] bg-brand-dark text-white overflow-hidden flex flex-col relative select-none">
          
          {isScreenBlocked && (
            <div 
              onClick={() => setIsScreenBlocked(false)}
              className="fixed inset-0 z-[10000] bg-brand-dark flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer pointer-events-auto"
            >
              <div className="text-4xl mb-4">🔒</div>
              <div className="font-display text-lg font-bold text-white mb-2">Skjermbeskyttelse aktiv</div>
              <div className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Innholdet er midlertidig skjult for å beskytte mot skjermbilder og kopiering.
                Gå tilbake til appen eller trykk på skjermen for å fortsette.
              </div>
            </div>
          )}

          <div className={isScreenBlocked ? "filter blur-xl opacity-20 pointer-events-none transition-all duration-300 flex-1 flex flex-col" : "flex-1 flex flex-col transition-all duration-300"}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/teori" element={isSignedIn ? <Teori /> : <Navigate to="/" />} />
              <Route path="/eksamen" element={isSignedIn ? <Eksamen /> : <Navigate to="/" />} />
              <Route path="/bank" element={isSignedIn ? <Bank /> : <Navigate to="/" />} />
              <Route 
                path="/admin" 
                element={isSignedIn && isAdmin ? <Admin /> : <Navigate to="/" />} 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </StoreProvider>
  );
}

