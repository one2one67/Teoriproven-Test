import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

export default function Eksamen() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/teori" className="inline-flex items-center gap-2 text-brand-blue hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Tilbake til oversikt
      </Link>
      
      <div className="glass-card p-12 text-center border-brand-blue/20">
        <div className="mx-auto w-16 h-16 bg-brand-blue/10 flex items-center justify-center rounded-full text-brand-blue mb-6">
          <Construction className="w-8 h-8" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-4">Eksamensimulering kommer snart!</h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Vi jobber med å ferdigstille denne modulen. Her vil du snart kunne ta komplette simuleringer av teoriprøven med 45 spørsmål på 90 minutter.
        </p>
      </div>
    </div>
  );
}
