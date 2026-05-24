import { ShieldAlert, BookOpen, Brain, History, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

export default function AppPlaceholder() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-brand-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-card p-12 border-dashed border-brand-border"
        >
          <div className="w-20 h-20 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue mx-auto mb-8 animate-pulse">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-4">Begynn å øve</h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            Dette er en placeholder for selve øvingsmodulen. Her vil du kunne velge mellom flashkort, teorifilm og eksamenssimulering.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-brand-dark border border-brand-border opacity-50 flex flex-col items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Teori</span>
            </div>
            <div className="p-4 rounded-xl bg-brand-dark border border-brand-border opacity-50 flex flex-col items-center gap-2">
              <Brain className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Flashkort</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Desktop Sidebar Mock (Hidden on mobile) */}
      <div className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 border-r border-brand-border bg-brand-dark/50 flex-col p-6 space-y-6">
        <div className="space-y-1">
          <NavItem active icon={BookOpen} label="Læreplan" />
          <NavItem icon={Brain} label="Flashkort" />
          <NavItem icon={History} label="Historikk" />
          <NavItem icon={Trophy} label="Prestasjoner" />
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false }: any) {
  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer",
      active ? "bg-brand-blue/10 text-brand-blue shadow-sm" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
    )}>
      <Icon className="w-5 h-5" />
      {label}
    </div>
  );
}

import { cn } from '@/src/lib/utils';
