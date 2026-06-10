"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Database, CheckCircle2, XCircle, Loader2, Plug, Edit3 } from "lucide-react";
import axios from "axios";

const INITIAL_FORM = {
  name: "",
  host: "localhost",
  port: 5432,
  db_name: "",
  username: "postgres",
  password: "",
};

const fields = [
  { key: "name",     label: "Connection Name",  placeholder: "Production DB",  type: "text",     span: 2 },
  { key: "host",     label: "Host",             placeholder: "localhost",       type: "text",     span: 1 },
  { key: "port",     label: "Port",             placeholder: "5432",            type: "number",   span: 1 },
  { key: "db_name",  label: "Database Name",    placeholder: "my_database",     type: "text",     span: 2 },
  { key: "username", label: "Username",         placeholder: "postgres",        type: "text",     span: 1 },
  { key: "password", label: "Password",         placeholder: "••••••••",        type: "password", span: 1 },
];

export default function ConnectionModal({ open, onClose, onSaved, token, existingConn = null }) {
  const isEdit = !!existingConn;
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [testState, setTestState] = useState("idle"); // idle | testing | ok | fail
  const [testMsg, setTestMsg] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (isEdit) {
        setForm({
          name:     existingConn.name     || "",
          host:     existingConn.host     || "localhost",
          port:     existingConn.port     || 5432,
          db_name:  existingConn.db_name  || "",
          username: existingConn.username || "postgres",
          password: "",
        });
      } else {
        setForm(INITIAL_FORM);
      }
      setTestState("idle");
      setTestMsg("");
      setErrors({});
    }
  }, [open, existingConn, isEdit]);

  function validate() {
    const e = {};
    if (!form.name.trim())     e.name     = "Required";
    if (!form.host.trim())     e.host     = "Required";
    if (!form.port)            e.port     = "Required";
    if (!form.db_name.trim())  e.db_name  = "Required";
    if (!form.username.trim()) e.username = "Required";
    if (!isEdit && !form.password.trim()) e.password = "Required";
    return e;
  }

  const handleTest = async () => {
    setTestState("testing");
    setTestMsg("");
    try {
      const payload = {
        host:     form.host,
        port:     Number(form.port),
        db_name:  form.db_name,
        username: form.username,
        password: form.password,
      };
      await axios.post("http://localhost:8000/connections/test", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestState("ok");
      setTestMsg("Connection successful");
    } catch (err) {
      setTestState("fail");
      setTestMsg(err.response?.data?.detail || "Connection failed");
    }
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      if (isEdit) {
        const payload = { ...form, port: Number(form.port) };
        if (!payload.password) delete payload.password;
        await axios.put(`http://localhost:8000/connections/${existingConn.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:8000/connections/", { ...form, port: Number(form.port) }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      setErrors({ global: err.response?.data?.detail || "Failed to save connection" });
    } finally {
      setLoading(false);
    }
  };

  const setField = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
    setTestState("idle");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ background: "rgba(6,6,8,0.8)", backdropFilter: "blur(10px)" }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg rounded-2xl border shadow-card overflow-hidden"
            style={{ background: "#0d0d12", borderColor: "rgba(255,255,255,0.08)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
                  {isEdit ? <Edit3 size={16} className="text-brand-400" /> : <Database size={16} className="text-brand-400" />}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    {isEdit ? "Edit Connection" : "New Connection"}
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(241,241,245,0.4)" }}>
                    {isEdit ? "Update credentials and settings" : "Connect a PostgreSQL database"}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="btn-ghost w-8 h-8 p-0 rounded-lg" aria-label="Close">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {errors.global && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-rose-400"
                  style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)" }}
                >
                  <XCircle size={14} className="flex-shrink-0" />
                  {errors.global}
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {fields.map(field => (
                  <div key={field.key} className={field.span === 2 ? "col-span-2" : "col-span-1"}>
                    <label className="form-label">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={e => setField(field.key, field.type === "number" ? parseInt(e.target.value) || "" : e.target.value)}
                      className={`input-field ${errors[field.key] ? "border-rose-500/40 focus:border-rose-500/60" : ""}`}
                    />
                    {errors[field.key] && (
                      <p className="text-xs mt-1" style={{ color: "rgba(248,113,113,0.8)" }}>{errors[field.key]}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Test Connection */}
              <div className="pt-1">
                <button
                  onClick={handleTest}
                  disabled={testState === "testing" || !form.host || !form.db_name || !form.username || !form.password}
                  className="btn-ghost w-full justify-center border gap-2 py-2.5"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                >
                  {testState === "testing" && <Loader2 size={14} className="animate-spin" />}
                  {testState === "ok"      && <CheckCircle2 size={14} className="text-emerald-400" />}
                  {testState === "fail"    && <XCircle size={14} className="text-rose-400" />}
                  {testState === "idle"    && <Plug size={14} />}
                  <span className={
                    testState === "ok"   ? "text-emerald-400" :
                    testState === "fail" ? "text-rose-400" :
                    ""
                  }>
                    {testState === "testing" ? "Testing…" :
                     testState === "ok"      ? testMsg :
                     testState === "fail"    ? testMsg :
                     "Test Connection"}
                  </span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-6 py-4 border-t"
              style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
              <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="btn-primary flex-1">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="spinner" />
                    {isEdit ? "Saving…" : "Connecting…"}
                  </span>
                ) : (isEdit ? "Save Changes" : "Add Connection")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
