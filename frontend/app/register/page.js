"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "../../config";
import { LogoFull } from "../../components/Logo";
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

function PasswordStrength({ password }) {
  if (!password) return null;
  const score =
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);

  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["#f43f5e", "#f59e0b", "#22d3ee", "#10b981"];

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i < score ? colors[score - 1] : "rgba(255,255,255,0.08)",
            }}
          />
        ))}
      </div>
      {score > 0 && (
        <p className="text-xs" style={{ color: colors[score - 1] }}>
          {labels[score - 1]}
        </p>
      )}
    </div>
  );
}

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.name.trim() || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        ...form,
        role: "admin",
      });
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
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    "Free to start — no credit card needed",
    "AI-powered SQL generation",
    "Secure, encrypted credential storage",
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-2/5 p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(139,92,246,0.07) 0%, rgba(34,211,238,0.04) 100%)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 80% at 100% 0%, rgba(139,92,246,0.1), transparent)" }} />

        <LogoFull size={32} className="relative z-10" />

        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-xl font-black mb-2">Start analysing your data today</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(241,241,245,0.45)" }}>
              Create a free account and connect your first database in under 2 minutes.
            </p>
          </div>
          <div className="space-y-3">
            {perks.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)" }}
                >
                  <CheckCircle2 size={11} className="text-emerald-400" />
                </div>
                <span className="text-sm" style={{ color: "rgba(241,241,245,0.6)" }}>{p}</span>
              </motion.div>
            ))}
          </div>
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
            <h1 className="text-2xl font-black tracking-tight mb-1.5">Create your account</h1>
            <p className="text-sm" style={{ color: "rgba(241,241,245,0.45)" }}>
              Start exploring your data with AI
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
            {/* Name */}
            <div>
              <label className="form-label">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgba(241,241,245,0.3)" }} />
                <input
                  type="text"
                  placeholder="Adarsh"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="input-field pl-10"
                  autoComplete="name"
                />
              </div>
            </div>

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
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input-field pl-10 pr-10"
                  autoComplete="new-password"
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
              <PasswordStrength password={form.password} />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="btn-primary w-full mt-3 py-3 text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="spinner" />
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  Create account
                  <ArrowRight size={15} />
                </span>
              )}
            </motion.button>

            <p className="text-xs text-center" style={{ color: "rgba(241,241,245,0.3)" }}>
              By creating an account you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "rgba(241,241,245,0.4)" }}>
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="font-medium transition-colors"
              style={{ color: "var(--accent-primary)" }}
              onMouseEnter={e => e.currentTarget.style.color = "#a5b4fc"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--accent-primary)"}
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
