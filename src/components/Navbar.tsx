import { LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { cn } from '@/src/lib/utils';

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'amjmah87@gmail.com';
  
  const isAdmin = user?.primaryEmailAddress?.emailAddress === adminEmail;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="font-display text-xl font-extrabold tracking-tight">
              Teorigo<span className="gradient-text">.no</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <Link
                  to="/teori"
                  className={cn(
                    "hidden sm:block text-sm font-medium transition-colors hover:text-white",
                    location.pathname === '/teori' ? "text-white" : "text-slate-400"
                  )}
                >
                  Teori
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
                <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="text-sm font-bold text-white hover:text-brand-blue transition-colors px-4 py-2">
                  Logg inn
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
