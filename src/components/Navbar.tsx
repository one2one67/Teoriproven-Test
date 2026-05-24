import { motion } from 'motion/react';
import { LogOut, User, LayoutDashboard, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getSupabase } from '@/src/lib/supabase';
import { cn } from '@/src/lib/utils';
import { useEffect, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    try {
      const supabase = getSupabase();
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    } catch (e) {
      console.error("Supabase not initialized:", e);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await getSupabase().auth.signOut();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="font-display text-xl font-extrabold tracking-tight">
              teoriøving<span className="gradient-text">.no</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    "hidden sm:block text-sm font-medium transition-colors hover:text-white",
                    location.pathname === '/dashboard' ? "text-white" : "text-slate-400"
                  )}
                >
                  Min konto
                </Link>
                <Link
                  to="/app"
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-brand-blue/20 flex items-center gap-2"
                >
                  Åpne app <LayoutDashboard className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="Logg ut"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="text-sm font-bold text-white hover:text-brand-blue transition-colors px-4 py-2"
              >
                Logg inn
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
