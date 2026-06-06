import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn } from 'lucide-react';
import { useStore } from '../lib/store';
import { resolveQuestionImage } from '../lib/assets';

interface QuestionImageProps {
  src: string | null;
  alt?: string;
  className?: string;
  questionText?: string;
}

export function QuestionImage({ src, alt, className = '', questionText }: QuestionImageProps) {
  const [zoomed, setZoomed] = useState(false);
  const { catId } = useStore();
  const resolvedSrc = resolveQuestionImage(catId || 'personbil_b', questionText || alt || '', src);

  if (!resolvedSrc) return null;

  return (
    <>
      <div 
        className={`relative group rounded-xl bg-brand-dark/40 flex items-center justify-center border border-brand-border/40 cursor-pointer overflow-hidden max-h-[300px] w-full ${className}`}
        onClick={() => setZoomed(true)}
      >
        <img 
          src={resolvedSrc} 
          alt={alt || 'Question illustration'} 
          className="w-full h-auto max-h-[inherit] object-contain transition-all duration-300 group-hover:scale-[1.03] p-3" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-brand-dark-2/90 text-white p-2 rounded-full backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
            <ZoomIn className="w-5 h-5 text-slate-300" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {zoomed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center isolate p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setZoomed(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-zoom-out" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[90vh] w-full flex flex-col pointer-events-none"
            >
              <img 
                src={resolvedSrc} 
                alt={alt || 'Question illustration'} 
                className="w-full h-auto max-h-[85vh] object-contain pointer-events-auto rounded-lg shadow-2xl" 
                onClick={(e) => e.stopPropagation()}
              />
              <button 
                onClick={() => setZoomed(false)}
                className="absolute top-2 right-2 md:-top-4 md:-right-4 text-white p-2 rounded-full bg-brand-dark/80 hover:bg-brand-blue border border-[rgba(255,255,255,0.1)] transition-colors pointer-events-auto"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
