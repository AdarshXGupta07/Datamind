"use client";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { LogoFull } from "../components/Logo";
import {
  Database, Zap, BarChart3, Shield, Clock, GitBranch,
  ArrowRight, ChevronRight, Check, Star, Play, TrendingUp,
  Users, Activity
} from "lucide-react";

const HeroCanvas = dynamic(() => import("../components/HeroCanvas"), { ssr: false });

/* ── Typewriter ── */
function TypeWriter({ texts }) {
  const [current, setCurrent] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const text = texts[current];
    if (!deleting && displayed.length < text.length) {
      const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), 70);
      return () => clearTimeout(t);
    } else if (!deleting && displayed.length === text.length) {
      const t = setTimeout(() => setDeleting(true), 2200);
      return () => clearTimeout(t);
    } else if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      return () => clearTimeout(t);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setCurrent(c => (c + 1) % texts.length);
    }
  }, [displayed, deleting, current, texts]);

  return (
    <span className="gradient-text">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.55, repeat: Infinity }}
        style={{ display: "inline-block", width: "3px", height: "0.85em", background: "linear-gradient(135deg, #6366f1, #22d3ee)", marginLeft: 2, borderRadius: 2, verticalAlign: "middle" }}
      />
    </span>
  );
}

/* ── Animated counter ── */
function Counter({ to, suffix = "", duration = 1.8 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * to));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to, duration]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ── Reveal section wrapper ── */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Feature card ── */
const FEATURES = [
  {
    icon: <Database size={20} />, color: "#6366f1",
    title: "Connect Any Database",
    desc: "One-click PostgreSQL connections with secure credential storage and live health monitoring.",
  },
  {
    icon: <Zap size={20} />, color: "#8b5cf6",
    title: "Natural Language Queries",
    desc: "Type questions in plain English. Our AI translates them to optimized SQL instantly.",
  },
  {
    icon: <BarChart3 size={20} />, color: "#22d3ee",
    title: "Smart Visualizations",
    desc: "Automatic chart selection. Bar, line, pie — DataMind picks the best view for your data.",
  },
  {
    icon: <Shield size={20} />, color: "#10b981",
    title: "Enterprise Security",
    desc: "JWT auth, role-based access control, and encrypted credentials. Built for teams.",
  },
  {
    icon: <Clock size={20} />, color: "#f59e0b",
    title: "Query History",
    desc: "Every insight logged and searchable. Revisit, share, and build on previous work.",
  },
  {
    icon: <GitBranch size={20} />, color: "#f43f5e",
    title: "Multi-DB Workspaces",
    desc: "Manage multiple database connections in one workspace. Switch between them instantly.",
  },
];

const STATS = [
  { val: 10,   suffix: "x", label: "Faster insights vs manual SQL" },
  { val: 99.9, suffix: "%", label: "Query accuracy with schema context" },
  { val: 3,    suffix: "s", label: "Average time to first result" },
  { val: 50,   suffix: "+", label: "Supported query types" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Connect your database",
    desc: "Paste your PostgreSQL credentials. DataMind validates the connection and reads your schema automatically.",
    color: "#6366f1",
  },
  {
    step: "02",
    title: "Ask in plain English",
    desc: "Type any question about your data. No SQL knowledge required — we handle the query generation.",
    color: "#8b5cf6",
  },
  {
    step: "03",
    title: "Get instant insights",
    desc: "Results appear with the optimal chart type automatically chosen. Explore, filter, and share.",
    color: "#22d3ee",
  },
];

/* ── Mock terminal ── */
function MockTerminal() {
  const queries = [
    { q: "Show top 10 customers by revenue", sql: "SELECT customer_name, SUM(amount) AS revenue FROM orders GROUP BY customer_name ORDER BY revenue DESC LIMIT 10;" },
    { q: "What was sales growth last quarter?", sql: "SELECT DATE_TRUNC('month', created_at) AS month, SUM(total) FROM sales WHERE created_at >= NOW() - INTERVAL '3 months' GROUP BY 1;" },
    { q: "Which products have low inventory?", sql: "SELECT name, stock_qty FROM products WHERE stock_qty < 20 ORDER BY stock_qty ASC LIMIT 100;" },
  ];
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("typing-q"); // typing-q | done-q | typing-sql | done-sql
  const [typedQ, setTypedQ] = useState("");
  const [typedSQL, setTypedSQL] = useState("");

  useEffect(() => {
    const q = queries[idx];
    if (phase === "typing-q") {
      if (typedQ.length < q.q.length) {
        const t = setTimeout(() => setTypedQ(q.q.slice(0, typedQ.length + 1)), 45);
        return () => clearTimeout(t);
      } else {
        setTimeout(() => setPhase("done-q"), 300);
      }
    } else if (phase === "done-q") {
      setTimeout(() => setPhase("typing-sql"), 400);
    } else if (phase === "typing-sql") {
      if (typedSQL.length < q.sql.length) {
        const t = setTimeout(() => setTypedSQL(q.sql.slice(0, typedSQL.length + 2)), 18);
        return () => clearTimeout(t);
      } else {
        setTimeout(() => setPhase("done-sql"), 2400);
      }
    } else if (phase === "done-sql") {
      setTypedQ("");
      setTypedSQL("");
      setIdx(i => (i + 1) % queries.length);
      setPhase("typing-q");
    }
  }, [phase, typedQ, typedSQL, idx]);

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-card border"
      style={{ background: "#0a0a0e", borderColor: "rgba(255,255,255,0.07)" }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#080809" }}>
        <div className="w-3 h-3 rounded-full bg-rose-500/80" />
        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        <span className="ml-3 text-xs font-mono" style={{ color: "rgba(241,241,245,0.3)" }}>DataMind — AI Query Engine</span>
      </div>

      <div className="p-5 space-y-4">
        {/* User question */}
        <div>
          <p className="text-xs mb-2" style={{ color: "rgba(241,241,245,0.3)" }}>Question</p>
          <div
            className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}
          >
            <span style={{ color: "#818cf8" }}>◈</span>
            <span style={{ color: "rgba(241,241,245,0.85)" }}>{typedQ}
              {phase === "typing-q" && (
                <span style={{ display: "inline-block", width: 2, height: "1em", background: "#6366f1", marginLeft: 1, verticalAlign: "middle", borderRadius: 1 }} />
              )}
            </span>
          </div>
        </div>

        {/* Generated SQL */}
        {(phase === "typing-sql" || phase === "done-sql") && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs mb-2" style={{ color: "rgba(241,241,245,0.3)" }}>Generated SQL</p>
            <div className="code-block text-xs rounded-xl" style={{ background: "rgba(0,0,0,0.5)", minHeight: 52 }}>
              {typedSQL}
              {phase === "typing-sql" && (
                <span style={{ display: "inline-block", width: 2, height: "1em", background: "#22d3ee", marginLeft: 1, verticalAlign: "middle", borderRadius: 1 }} />
              )}
            </div>
          </motion.div>
        )}

        {/* Fake result rows */}
        {phase === "done-sql" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs" style={{ color: "rgba(241,241,245,0.3)" }}>Results</p>
              <span className="badge badge-emerald text-xs">10 rows</span>
            </div>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {[["Acme Corp", "$124,820", "+12%"], ["Globex", "$98,430", "+8%"], ["Initech", "$76,200", "+5%"]].map(([n, v, c], i) => (
                    <tr key={i}>
                      <td>{n}</td>
                      <td className="mono">{v}</td>
                      <td style={{ color: "#6ee7b7" }}>{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function Home() {
  const router = useRouter();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(6,6,8,0.92)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
        }}
      >
        <LogoFull size={30} />

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/login")}
            className="btn-ghost px-4 py-2 text-sm"
          >
            Sign in
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/register")}
            className="btn-primary text-sm px-5 py-2"
          >
            Get started
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 overflow-hidden">
        {/* Canvas background */}
        <div className="absolute inset-0">
          <HeroCanvas />
          {/* Radial vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, rgba(6,6,8,0.65) 80%, rgba(6,6,8,1) 100%)"
            }}
          />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <span
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.28)",
                color: "#a5b4fc",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#6366f1" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#818cf8" }} />
              </span>
              Powered by Llama 3.3 · 70B
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight text-balance mb-6"
          >
            Your data,{" "}
            <br className="hidden sm:block" />
            <TypeWriter texts={["ask anything.", "get insights.", "move faster.", "think bigger."]} />
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ color: "rgba(241,241,245,0.5)" }}
          >
            Connect your database. Ask questions in plain English. Get instant charts and insights — no SQL, no dashboards to build.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(99,102,241,0.45)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/register")}
              className="btn-primary text-base px-8 py-3.5"
            >
              Start for free
              <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/login")}
              className="btn-secondary text-base px-8 py-3.5"
            >
              Sign in
            </motion.button>
          </motion.div>

          {/* Trust signal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="flex items-center justify-center gap-1.5 text-sm"
            style={{ color: "rgba(241,241,245,0.3)" }}
          >
            <Shield size={13} />
            <span>No credit card required · Free to start · Secure by default</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats strip ── */}
      <Reveal>
        <div className="max-w-5xl mx-auto px-4 pb-20">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {STATS.map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center py-8 text-center"
                style={{ background: "var(--bg-secondary)" }}
              >
                <div
                  className="text-3xl md:text-4xl font-black mb-1.5 gradient-text"
                >
                  <Counter to={s.val} suffix={s.suffix} />
                </div>
                <div className="text-xs" style={{ color: "rgba(241,241,245,0.4)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── How it works ── */}
      <section className="py-24 px-4">
        <Reveal className="text-center mb-16">
          <span className="badge badge-indigo mb-4 inline-flex">How it works</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            From question to insight<br />in seconds
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(241,241,245,0.45)" }}>
            Three steps. No configuration. No learning curve.
          </p>
        </Reveal>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative rounded-2xl p-6 group cursor-default h-full"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Step number */}
                <div
                  className="text-xs font-mono font-bold mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{ background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}28` }}
                >
                  {step.step}
                </div>

                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(241,241,245,0.45)" }}>{step.desc}</p>

                {/* Connector arrow */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center rounded-full"
                    style={{ background: "var(--bg-secondary)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <ChevronRight size={12} style={{ color: "rgba(241,241,245,0.3)" }} />
                  </div>
                )}
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Live demo terminal ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <span className="badge badge-cyan mb-4 inline-flex">Live demo</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
              See the AI work<br />in real time
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(241,241,245,0.45)" }}>
              Watch as DataMind transforms your question into an optimized SQL query and executes it against your database — all in under 3 seconds.
            </p>
            <div className="space-y-3">
              {["Schema-aware query generation", "Auto-selected visualizations", "Instant execution with real data", "Full query history logged"].map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 text-sm"
                  style={{ color: "rgba(241,241,245,0.65)" }}
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)" }}>
                    <Check size={11} className="text-emerald-400" />
                  </div>
                  {feat}
                </motion.div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <MockTerminal />
          </Reveal>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="py-24 px-4">
        <Reveal className="text-center mb-16">
          <span className="badge badge-neutral mb-4 inline-flex">Features</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Everything your team needs
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(241,241,245,0.45)" }}>
            Built for analysts, loved by everyone who needs answers from data.
          </p>
        </Reveal>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -3, borderColor: `${f.color}35` }}
                className="rounded-2xl p-5 h-full cursor-default group transition-colors"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${f.color}18`, color: f.color, border: `1px solid ${f.color}25` }}
                >
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(241,241,245,0.42)" }}>{f.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <Reveal>
          <div
            className="max-w-3xl mx-auto rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.06) 50%, rgba(34,211,238,0.04) 100%)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            {/* Decorative orbs */}
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12), transparent)", filter: "blur(40px)" }}
            />
            <div
              className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(34,211,238,0.08), transparent)", filter: "blur(40px)" }}
            />

            <div className="relative z-10">
              <span className="badge badge-indigo mb-5 inline-flex">Get started today</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                Ready to see your data<br />differently?
              </h2>
              <p className="text-base max-w-lg mx-auto mb-10 leading-relaxed" style={{ color: "rgba(241,241,245,0.5)" }}>
                Join teams already using DataMind to make faster, smarter decisions without writing a single line of SQL.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(99,102,241,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/register")}
                  className="btn-primary text-base px-10 py-4"
                >
                  Start for free
                  <ArrowRight size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/login")}
                  className="btn-secondary text-base px-8 py-4"
                >
                  Sign in
                </motion.button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 border-t text-center" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
          <LogoFull size={26} />
          <p className="text-xs" style={{ color: "rgba(241,241,245,0.3)" }}>
            © {new Date().getFullYear()} DataMind. AI-powered business intelligence.
          </p>
          <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(241,241,245,0.3)" }}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
