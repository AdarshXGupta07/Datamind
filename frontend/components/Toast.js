"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />,
  error:   <XCircle    size={16} className="text-rose-400 flex-shrink-0" />,
  warning: <AlertCircle size={16} className="text-amber-400 flex-shrink-0" />,
  info:    <Info       size={16} className="text-brand-400 flex-shrink-0" />,
};

const STYLES = {
  success: "border-emerald-500/20 bg-surface-3",
  error:   "border-rose-500/20 bg-surface-3",
  warning: "border-amber-500/20 bg-surface-3",
  info:    "border-brand-500/20 bg-surface-3",
};

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "info", duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-card max-w-sm ${STYLES[toast.type]}`}
            >
              {ICONS[toast.type]}
              <p className="text-sm text-white/80 flex-1 leading-snug">{toast.message}</p>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0 mt-0.5"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
