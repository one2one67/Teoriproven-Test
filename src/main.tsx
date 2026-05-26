import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

const envPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const PUBLISHABLE_KEY = envPublishableKey || 'pk_test_bWFnaWNhbC1kcnVtLTM4LmNsZXJrLmFjY291bnRzLmRldiQ';

if (!PUBLISHABLE_KEY) {
  console.warn("Mangler Clerk Publishable Key - legg den til i Settings > Secrets som VITE_CLERK_PUBLISHABLE_KEY");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 text-white font-sans text-center">
        <h1 className="text-2xl font-bold mb-4">Venter på Clerk konfigurasjon</h1>
        <p className="text-slate-400 max-w-md">
          Du må legge til din egen <strong>VITE_CLERK_PUBLISHABLE_KEY</strong> fra Clerk dashboardet i menyen til høyre under &quot;Secrets&quot; for at innlogging med Google skal fungere.
        </p>
      </div>
    )}
  </StrictMode>,
);
