import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

export default function Bank() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/teori" className="inline-flex items-center gap-2 text-purple-400 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Tilbake til oversikt
      </Link>
      
      <div className="glass-card p-12 text-center border-purple-500/20">
        <div className="mx-auto w-16 h-16 bg-purple-500/10 flex items-center justify-center rounded-full text-purple-400 mb-6">
          <Construction className="w-8 h-8" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-4">Spørsmålsbank kommer snart!</h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Snart vil du kunne bla gjennom alle våre spørsmål sortert på tema, og trene spesifikt på det du synes er vanskeligst.
        </p>
      </div>
    </div>
  );
}
