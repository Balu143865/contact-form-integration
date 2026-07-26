import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X, MailCheck, ArrowRight } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!toast) return;

    setProgress(100);
    const duration = 5000; // 5 seconds
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      if (!isHovered) {
        setProgress((prev) => {
          if (prev <= step) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - step;
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toast, isHovered, onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(2px)' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="pointer-events-auto relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-900/95 text-slate-100 shadow-2xl backdrop-blur-md p-4 dark:bg-slate-900/95 dark:text-slate-100 light:bg-white light:text-slate-900 light:border-emerald-600/40 light:shadow-slate-300/80 transition-colors"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-400 to-emerald-500" />

            <div className="flex items-start gap-3.5 pt-1">
              {/* Icon */}
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 flex items-center gap-1.5">
                    {toast.title}
                  </h4>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Confirmed
                  </span>
                </div>
                <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-1 leading-relaxed">
                  {toast.message}
                </p>

                {toast.actionLabel && toast.onAction && (
                  <button
                    onClick={() => {
                      toast.onAction?.();
                      onClose();
                    }}
                    className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 dark:text-sky-400 light:text-sky-600 hover:underline group"
                  >
                    <span>{toast.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Dismiss notification"
                className="text-slate-400 hover:text-slate-200 dark:hover:text-white light:text-slate-500 light:hover:text-slate-800 p-1 rounded-lg hover:bg-slate-800/50 light:hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/50 light:bg-slate-100">
              <div
                className="h-full bg-emerald-500 transition-all ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
