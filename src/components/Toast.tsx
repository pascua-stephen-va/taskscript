import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  subMessage?: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, subMessage, onClose }) => {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#001B39] text-white p-4 rounded-3xl shadow-2xl border border-amber-400/40 flex items-start gap-3 select-none"
      >
        <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
        </div>

        <div className="flex-1 min-w-0">
          <h5 className="text-xs font-bold text-white leading-tight">
            {message}
          </h5>
          {subMessage && (
            <p className="text-[11px] text-slate-300 mt-0.5 truncate">
              {subMessage}
            </p>
          )}
          <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-300 font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Ready to paste in ChatGPT or Teams</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
