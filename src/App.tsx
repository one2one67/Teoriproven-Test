/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Teori from './pages/Teori';
import Eksamen from './pages/Eksamen';
import Bank from './pages/Bank';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import { StoreProvider } from './lib/store';
import { AuthProvider, useUser } from './lib/AuthContext';

function MainAppContent() {
  const { isLoaded, isSignedIn, user } = useUser();
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
