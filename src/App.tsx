/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Teori from './pages/Teori';
import Eksamen from './pages/Eksamen';
import Bank from './pages/Bank';
import Admin from './pages/Admin';

export default function App() {
  const { isLoaded, isSignedIn, user } = useUser();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'amjmah87@gmail.com';

  if (!isLoaded) {
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white">Laster...</div>;
  }

  const isAdmin = user?.primaryEmailAddress?.emailAddress === adminEmail;

  return (
    <Router>
      <div className="min-h-screen bg-brand-dark text-white overflow-x-hidden">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={isSignedIn ? <Navigate to="/teori" /> : <Landing />} />
            <Route path="/teori" element={isSignedIn ? <Teori /> : <Navigate to="/" />} />
            <Route path="/eksamen" element={isSignedIn ? <Eksamen /> : <Navigate to="/" />} />
            <Route path="/bank" element={isSignedIn ? <Bank /> : <Navigate to="/" />} />
            <Route 
              path="/admin" 
              element={isSignedIn && isAdmin ? <Admin /> : <Navigate to="/" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

