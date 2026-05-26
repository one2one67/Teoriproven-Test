import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Award, CheckCircle2, ChevronRight, Apple, Smartphone } from 'lucide-react';
import { SignInButton } from '@clerk/clerk-react';

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(29,111,235,0.2),transparent_70%)] -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-bold uppercase tracking-widest mb-6">
              <Zap className="w-3 h-3" /> Oppdatert for 2026
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Bestå teoriprøven<br />på <span className="gradient-text">første forsøk</span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg mb-10 leading-relaxed">
              Norges mest moderne plattform for teoriøving. Tusenvis av spørsmål til varebilløyve, taxiløyve, drosjeeksamen og lastebilløyve.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignInButton mode="modal">
                <button
                  className="w-full sm:w-auto bg-brand-blue hover:bg-brand-blue/90 text-white font-display font-bold py-4 px-10 rounded-2xl shadow-xl shadow-brand-blue/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  Prøv gratis nå <ChevronRight className="w-5 h-5" />
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button
                  className="w-full sm:w-auto glass-card py-4 px-10 font-display font-bold text-white hover:bg-brand-dark-2 transition-all flex items-center justify-center gap-2"
                >
                  Logg inn
                </button>
              </SignInButton>
            </div>

            <div className="mt-16 flex items-center justify-center gap-8 text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-medium">98% bestått-rate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-medium">Tusenvis av elever</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-brand-dark-2/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Alltid oppdatert",
                description: "Spørsmålene våre følger Vegvesenets nyeste retningslinjer for 2026."
              },
              {
                icon: Zap,
                title: "Effektiv øving",
                description: "Vår adaptive plattform fokuserer på emnene du trenger mest hjelp med."
              },
              {
                icon: Award,
                title: "Eksamensimulering",
                description: "Opplev den ekte prøven før du tar den hos Statens Vegvesen."
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 group hover:border-brand-blue/40 transition-all"
              >
                <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-xl mb-3">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <h2 className="font-display text-4xl font-extrabold mb-16 text-center">Alle kategorier på ett sted</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {['Varebilløyve', 'Taxiløyve', 'Lastebilløyve', 'Drosjeeksamen'].map((cat, i) => (
              <div key={i} className="glass-card p-6 text-center hover:bg-brand-blue/5 border-brand-blue/10">
                <span className="font-display font-bold text-sm">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-brand-border bg-brand-dark">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-display text-lg font-extrabold">
            Teorigo<span className="gradient-text">.no</span>
          </div>
          <p className="text-slate-500 text-xs text-center md:text-left">
            &copy; 2026 Teorigo.no – Eies og driftes av Teoriøving AS. Alle rettigheter reservert.
          </p>
          <div className="flex gap-4">
            <Apple className="w-5 h-5 text-slate-600 hover:text-slate-400 cursor-pointer transition-colors" />
            <Smartphone className="w-5 h-5 text-slate-600 hover:text-slate-400 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
