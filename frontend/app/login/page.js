"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LogoFull } from "../../components/Logo";
import { ArrowRight, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:8000/auth/login", form);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg).join(", "));
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-2/5 p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.04) 100%)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Grid bg */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 80% at 0% 100%, rgba(99,102,241,0.08), transparent)" }} />

        <LogoFull size={32} className="relative z-10" />

        <div className="relative z-10 space-y-8">
          {[
            { icon: "◈", text: "Ask questions in plain English — no SQL required" },
            { icon: "◈", text: "Instant visualizations from your live data" },
            { icon: "◈", text: "Secure, role-based access for your whole team" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.12 }}
              className="flex items-start gap-3"
            >
              <span className="text-brand-400 mt-0.5 text-sm">{item.icon}</span>
              <span className="text-sm leading-relaxed" style={{ color: "rgba(241,241,245,0.55)" }}>
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="text-xs relative z-10" style={{ color: "rgba(241,241,245,0.2)" }}>
          © {new Date().getFullYear()} DataMind
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 flex justify-center">
            <LogoFull size={30} />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-black tracking-tight mb-1.5">Welcome back</h1>
            <p className="text-sm" style={{ color: "rgba(241,241,245,0.45)" }}>
              Sign in to your DataMind account
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl text-sm mb-5"
              style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)", color: "#fda4af" }}
            >
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="form-label">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgba(241,241,245,0.3)" }} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="input-field pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgba(241,241,245,0.3)" }} />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input-field pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 btn-ghost p-0 w-6 h-6"
                  tabIndex={-1}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="btn-primary w-full mt-2 py-3 text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="spinner" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  Sign in
                  <ArrowRight size={15} />
                </span>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "rgba(241,241,245,0.4)" }}>
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/register")}
              className="font-medium transition-colors"
              style={{ color: "var(--accent-primary)" }}
              onMouseEnter={e => e.currentTarget.style.color = "#a5b4fc"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--accent-primary)"}
            >
              Create one
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
