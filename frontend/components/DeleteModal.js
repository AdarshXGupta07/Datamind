"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

export default function DeleteModal({ open, onClose, onConfirm, loading, name }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ background: "rgba(6,6,8,0.75)", backdropFilter: "blur(8px)" }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm rounded-2xl border border-rose-500/20 p-6 shadow-card"
            style={{ background: "#12121a" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.2)" }}>
                  <Trash2 size={18} className="text-rose-400" />
                </div>
                <div>
                  <h2 className="text-sm font-600 text-white">Delete Connection</h2>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(241,241,245,0.4)" }}>This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="btn-ghost w-8 h-8 p-0 rounded-lg"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Warning */}
            <div className="rounded-xl p-3 mb-5 flex items-start gap-2.5"
              style={{ background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.15)" }}>
              <AlertTriangle size={14} className="text-rose-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed" style={{ color: "rgba(241,241,245,0.6)" }}>
                You are about to delete{" "}
                <span className="font-semibold text-white">{name || "this connection"}</span>.
                {" "}All query history linked to this connection will remain but the connection itself will be permanently removed.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="btn-danger flex-1"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="spinner" style={{ width: 14, height: 14 }} />
                    Deleting…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Trash2 size={14} />
                    Delete
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
