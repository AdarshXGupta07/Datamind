"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Database, Plus, ChevronLeft, ChevronRight, Send, Trash2,
  MoreHorizontal, Edit3, Plug, PanelLeft, LogOut, User,
  Sparkles, Clock, Copy, Check, AlertCircle, CheckCircle2,
  Activity, BarChart2, TableIcon, TrendingUp, Loader2,
  ChevronDown, ChevronUp, Zap, X
} from "lucide-react";
import { LogoFull, LogoMark } from "../../components/Logo";
import DeleteModal from "../../components/DeleteModal";
import ConnectionModal from "../../components/ConnectionModal";
import { ToastProvider, useToast } from "../../components/Toast";

/* ─── Recharts colors ─── */
const CHART_COLORS = ["#6366f1", "#8b5cf6", "#22d3ee", "#10b981", "#f59e0b", "#f43f5e", "#ec4899", "#84cc16"];

const CHART_TOOLTIP = {
  contentStyle: {
    background: "#1a1a24",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    color: "#f1f1f5",
    fontSize: 12,
  },
  cursor: { fill: "rgba(99,102,241,0.07)" },
};

/* ─── Result chart ─── */
function ResultChart({ columns, rows, chartType }) {
  const data = rows.map(row => {
    const obj = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });
  const numKey = columns.find(c => typeof data[0]?.[c] === "number") || columns[1];
  const labelKey = columns[0];

  if (chartType === "bar") return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey={labelKey} tick={{ fill: "rgba(241,241,245,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(241,241,245,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip {...CHART_TOOLTIP} />
        <Bar dataKey={numKey} fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  if (chartType === "line") return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey={labelKey} tick={{ fill: "rgba(241,241,245,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(241,241,245,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip {...CHART_TOOLTIP} />
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Line type="monotone" dataKey={numKey} stroke="#6366f1" strokeWidth={2} dot={{ fill: "#8b5cf6", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#6366f1" }} />
      </LineChart>
    </ResponsiveContainer>
  );

  if (chartType === "pie") return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey={numKey} nameKey={labelKey} cx="50%" cy="50%" outerRadius={96}
          paddingAngle={2}
          label={({ name, percent }) => `${name} · ${(percent * 100).toFixed(0)}%`}
          labelLine={{ stroke: "rgba(241,241,245,0.15)" }}
        >
          {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
        </Pie>
        <Tooltip {...CHART_TOOLTIP} />
      </PieChart>
    </ResponsiveContainer>
  );

  // Table fallback
  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
      <table className="data-table w-full">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 50).map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className={typeof cell === "number" ? "mono" : ""}>
                  {cell === null ? <span style={{ color: "rgba(241,241,245,0.2)" }}>null</span> : String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 50 && (
        <p className="text-xs text-center py-2" style={{ color: "rgba(241,241,245,0.3)" }}>
          Showing 50 of {rows.length} rows
        </p>
      )}
    </div>
  );
}

/* ─── Copy SQL button ─── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={copy} className="btn-ghost w-7 h-7 p-0 rounded-lg" title="Copy SQL">
      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
    </button>
  );
}

/* ─── Chart type badge ─── */
function ChartBadge({ type }) {
  const map = {
    bar:   { icon: <BarChart2 size={11} />, cls: "badge-indigo",   label: "Bar" },
    line:  { icon: <TrendingUp size={11} />, cls: "badge-cyan",    label: "Line" },
    pie:   { icon: <Activity size={11} />,  cls: "badge-amber",    label: "Pie" },
    table: { icon: <TableIcon size={11} />, cls: "badge-neutral",  label: "Table" },
  };
  const m = map[type] || map.table;
  return (
    <span className={`badge ${m.cls} flex items-center gap-1`}>
      {m.icon} {m.label}
    </span>
  );
}

/* ─── Query result card ─── */
function QueryCard({ item, index }) {
  const [sqlOpen, setSqlOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Card header */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}
          >
            <Sparkles size={14} className="text-brand-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium leading-snug mb-1.5 text-white/85">
              {item.question}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <ChartBadge type={item.chart_type} />
              <span className="badge badge-neutral">{item.row_count} rows</span>
            </div>
          </div>
        </div>
      </div>

      {/* SQL toggle */}
      <div className="px-5 pb-3">
        <button
          onClick={() => setSqlOpen(v => !v)}
          className="flex items-center gap-1.5 text-xs font-mono transition-colors"
          style={{ color: "rgba(241,241,245,0.35)" }}
          onMouseEnter={e => e.currentTarget.style.color = "#a5b4fc"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(241,241,245,0.35)"}
        >
          {sqlOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {sqlOpen ? "Hide SQL" : "View SQL"}
        </button>

        <AnimatePresence>
          {sqlOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="relative mt-2">
                <div className="absolute top-2 right-2 z-10">
                  <CopyButton text={item.sql} />
                </div>
                <div className="code-block pr-10 text-xs">{item.sql}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chart */}
      {item.columns && item.rows && item.rows.length > 0 && (
        <div className="px-5 pb-5">
          <ResultChart columns={item.columns} rows={item.rows} chartType={item.chart_type} />
        </div>
      )}

      {item.rows?.length === 0 && (
        <div className="px-5 pb-5 text-sm text-center py-4" style={{ color: "rgba(241,241,245,0.3)" }}>
          Query returned 0 rows
        </div>
      )}
    </motion.div>
  );
}

/* ─── Connection item in sidebar ─── */
function ConnItem({ conn, selected, onSelect, onEdit, onDelete, onTest, testStatus }) {
  const statusDot = testStatus === "ok" ? "online" : testStatus === "fail" ? "offline" : testStatus === "testing" ? "testing" : "unknown";

  return (
    <div
      className={`group relative rounded-xl transition-all text-sm ${
        selected
          ? "bg-brand-500/15 text-white"
          : "text-white/55 hover:bg-white/4 hover:text-white/80"
      }`}
      style={selected ? { border: "1px solid rgba(99,102,241,0.25)" } : { border: "1px solid transparent" }}
    >
      {/* Main clickable area */}
      <div
        className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer"
        onClick={() => onSelect(conn.id)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && onSelect(conn.id)}
      >
        {/* Status dot */}
        <div className={`status-dot ${statusDot}`} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-xs truncate leading-snug">{conn.name}</p>
          <p className="text-xs truncate opacity-50 font-mono mt-0.5">{conn.db_name}</p>
        </div>
      </div>

      {/* Action buttons row - separate from clickable area */}
      <div className="flex items-center gap-1 px-3 pb-2">
        <button
          onClick={e => { e.stopPropagation(); onTest(conn); }}
          className="flex-1 text-xs py-1.5 rounded-lg transition-colors"
          style={{ 
            background: "rgba(99,102,241,0.1)", 
            color: "#a5b4fc",
            border: "1px solid rgba(99,102,241,0.2)"
          }}
          title="Test"
        >
          Test
        </button>
        <button
          onClick={e => { e.stopPropagation(); onEdit(conn); }}
          className="flex-1 text-xs py-1.5 rounded-lg transition-colors"
          style={{ 
            background: "rgba(255,255,255,0.05)", 
            color: "rgba(241,241,245,0.65)",
            border: "1px solid rgba(255,255,255,0.08)"
          }}
          title="Edit"
        >
          Edit
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDelete(conn); }}
          className="flex-1 text-xs py-1.5 rounded-lg transition-colors"
          style={{ 
            background: "rgba(244,63,94,0.1)", 
            color: "#fda4af",
            border: "1px solid rgba(244,63,94,0.2)"
          }}
          title="Delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* ─── Empty state ─── */
function EmptyState({ onAdd, hasConnections }) {
  const suggestions = [
    "Show me all records in the largest table",
    "Count rows in each table",
    "List the most recently created records",
    "Show all unique values in a column",
  ];
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
      >
        <Sparkles size={24} className="text-brand-400" />
      </motion.div>
      <h2 className="text-xl font-black mb-2">Ask your data anything</h2>
      <p className="text-sm max-w-md mb-8 leading-relaxed" style={{ color: "rgba(241,241,245,0.4)" }}>
        {hasConnections
          ? "Type a question below and DataMind will write the SQL and show you the results."
          : "Add a database connection on the left, then start asking questions about your data."}
      </p>

      {hasConnections && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg w-full">
          {suggestions.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <button
                data-suggestion={s}
                className="w-full text-left px-4 py-3 rounded-xl text-sm transition-colors group"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "rgba(241,241,245,0.5)",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.color = "rgba(241,241,245,0.8)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(241,241,245,0.5)"; }}
              >
                <span className="text-brand-400 mr-2">›</span>
                {s}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {!hasConnections && (
        <button onClick={onAdd} className="btn-primary text-sm">
          <Plus size={15} />
          Add your first connection
        </button>
      )}
    </div>
  );
}

/* ─── Inner dashboard (needs toast context) ─── */
function DashboardInner() {
  const router = useRouter();
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [connections, setConnections] = useState([]);
  const [selectedConn, setSelectedConn] = useState(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]); // Store ALL results with connection_id
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Modals
  const [connModal, setConnModal] = useState({ open: false, conn: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, conn: null, deleting: false });

  // Connection test states: { [connId]: "idle" | "testing" | "ok" | "fail" }
  const [testStates, setTestStates] = useState({});

  const inputRef = useRef(null);
  const resultsEndRef = useRef(null);

  // Setup axios interceptor for 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401 && window.location.pathname === "/dashboard") {
          localStorage.clear();
          toast.push("Session expired. Please login again.", "error");
          setTimeout(() => router.push("/login"), 1000);
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [router, toast]);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (!t || !u) { 
      router.push("/login"); 
      return; 
    }
    
    // Validate token format
    try {
      const parts = t.split('.');
      if (parts.length !== 3) {
        console.error("Invalid token format");
        localStorage.clear();
        router.push("/login");
        return;
      }
    } catch (err) {
      console.error("Token validation failed:", err);
      localStorage.clear();
      router.push("/login");
      return;
    }
    
    setToken(t);
    setUser(JSON.parse(u));
    fetchConnections(t);
  }, []);

  // Filter results for selected connection
  const filteredResults = results.filter(r => r.connection_id === selectedConn);

  // Scroll new results into view
  useEffect(() => {
    if (filteredResults.length > 0 && resultsEndRef.current) {
      resultsEndRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [filteredResults.length]);

  const fetchConnections = async (t) => {
    try {
      const res = await axios.get("http://localhost:8000/connections/", {
        headers: { Authorization: `Bearer ${t}` },
      });
      setConnections(res.data);
      if (res.data.length > 0) {
        setSelectedConn(prev => prev || res.data[0].id);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        // Token expired or invalid - logout and redirect
        localStorage.clear();
        toast.push("Session expired. Please login again.", "error");
        router.push("/login");
      } else {
        toast.push("Failed to load connections", "error");
      }
    }
  };

  const handleTestConnection = async (conn) => {
    setTestStates(p => ({ ...p, [conn.id]: "testing" }));
    try {
      await axios.post(`http://localhost:8000/connections/${conn.id}/test`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestStates(p => ({ ...p, [conn.id]: "ok" }));
      toast.push(`${conn.name} is healthy`, "success");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        toast.push("Session expired. Please login again.", "error");
        router.push("/login");
      } else {
        setTestStates(p => ({ ...p, [conn.id]: "fail" }));
        toast.push(err.response?.data?.detail || `${conn.name} connection failed`, "error");
      }
    }
  };

  const handleDeleteConfirm = async () => {
    const { conn } = deleteModal;
    setDeleteModal(p => ({ ...p, deleting: true }));
    try {
      await axios.delete(`http://localhost:8000/connections/${conn.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConnections(p => p.filter(c => c.id !== conn.id));
      if (selectedConn === conn.id) {
        const remaining = connections.filter(c => c.id !== conn.id);
        setSelectedConn(remaining.length > 0 ? remaining[0].id : null);
      }
      toast.push(`"${conn.name}" deleted`, "success");
      setDeleteModal({ open: false, conn: null, deleting: false });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        toast.push("Session expired. Please login again.", "error");
        router.push("/login");
      } else {
        toast.push(err.response?.data?.detail || "Delete failed", "error");
        setDeleteModal(p => ({ ...p, deleting: false }));
      }
    }
  };

  const runQuery = async () => {
    if (!question.trim() || !selectedConn || loading) return;
    setLoading(true);
    const q = question.trim();
    setQuestion("");
    try {
      const res = await axios.post(
        "http://localhost:8000/query/",
        { connection_id: selectedConn, question: q },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Add connection_id to result for filtering
      setResults(prev => [{ ...res.data, connection_id: selectedConn }, ...prev]);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        toast.push("Session expired. Please login again.", "error");
        router.push("/login");
      } else {
        toast.push(err.response?.data?.detail || "Query failed", "error");
      }
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSuggestionClick = (e) => {
    const suggestion = e.target.closest("[data-suggestion]")?.dataset.suggestion;
    if (suggestion) {
      setQuestion(suggestion);
      inputRef.current?.focus();
    }
  };

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const selectedConnObj = connections.find(c => c.id === selectedConn);

  // Get recent queries for selected connection only
  const recentQueries = filteredResults.slice(0, 6);

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "var(--bg-primary)", height: "100vh" }}>

      {/* ── Sidebar ── */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 flex flex-col overflow-hidden relative z-20"
            style={{
              background: "var(--bg-secondary)",
              borderRight: "1px solid rgba(255,255,255,0.05)",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
            }}
          >
            <div style={{ width: 256, display: "flex", flexDirection: "column", height: "100vh" }}>
              {/* Sidebar header */}
              <div className="flex items-center justify-between px-4 py-4 flex-shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <LogoFull size={28} />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="btn-ghost w-7 h-7 p-0 rounded-lg"
                  aria-label="Collapse sidebar"
                >
                  <PanelLeft size={14} />
                </button>
              </div>

              {/* Connections section */}
              <div className="flex-1 overflow-y-auto p-3">
                <div className="flex items-center justify-between px-2 py-2 mb-3">
                  <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "rgba(241,241,245,0.25)" }}>
                    Connections
                  </span>
                </div>

                {/* Add Connection Button - Always Visible */}
                <button
                  onClick={() => setConnModal({ open: true, conn: null })}
                  className="w-full mb-3 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    color: "#a5b4fc"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(99,102,241,0.18)";
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(99,102,241,0.12)";
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
                  }}
                >
                  <Plus size={16} />
                  Add Connection
                </button>

                {connections.length === 0 ? (
                  <div className="empty-state py-8 gap-2">
                    <Database size={20} style={{ color: "rgba(241,241,245,0.2)" }} />
                    <p className="text-xs" style={{ color: "rgba(241,241,245,0.3)" }}>No connections yet</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {connections.map(conn => (
                      <ConnItem
                        key={conn.id}
                        conn={conn}
                        selected={selectedConn === conn.id}
                        onSelect={setSelectedConn}
                        onEdit={conn => setConnModal({ open: true, conn })}
                        onDelete={conn => setDeleteModal({ open: true, conn, deleting: false })}
                        onTest={handleTestConnection}
                        testStatus={testStates[conn.id] || "unknown"}
                      />
                    ))}
                  </div>
                )}

                {/* Recent queries for selected connection */}
                {recentQueries.length > 0 && (
                  <div className="mt-5">
                    <div className="flex items-center gap-2 px-2 py-2 mb-1">
                      <Clock size={12} style={{ color: "rgba(241,241,245,0.25)" }} />
                      <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "rgba(241,241,245,0.25)" }}>
                        Recent
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      {recentQueries.map((r, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs cursor-default"
                          style={{ color: "rgba(241,241,245,0.35)" }}
                        >
                          <span className="text-brand-400 flex-shrink-0">›</span>
                          <span className="truncate">{r.question}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar footer — user info */}
              <div className="flex-shrink-0 p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-2.5 mb-2.5 px-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                  >
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{user?.name}</p>
                    <p className="text-xs truncate opacity-40">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="btn-ghost w-full text-xs justify-start gap-2 py-2 rounded-lg"
                  style={{ color: "rgba(241,241,245,0.4)" }}
                >
                  <LogOut size={13} />
                  Sign out
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main area ── */}
      <div 
        className="flex-1 flex flex-col min-w-0"
        style={{ 
          marginLeft: sidebarOpen ? "256px" : "0",
          height: "100vh",
          transition: "margin-left 0.28s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >

        {/* Top bar */}
        <header
          className="flex items-center gap-3 px-5 h-14 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "var(--bg-secondary)" }}
        >
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn-ghost w-8 h-8 p-0 rounded-lg flex-shrink-0"
              aria-label="Expand sidebar"
            >
              <PanelLeft size={15} />
            </button>
          )}

          {/* Connection selector */}
          {connections.length > 0 ? (
            <div className="flex items-center gap-2 min-w-0">
              <div className={`status-dot ${testStates[selectedConn] === "ok" ? "online" : testStates[selectedConn] === "fail" ? "offline" : "unknown"}`} />
              <span className="text-sm font-medium truncate">
                {selectedConnObj?.name || "Select connection"}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded font-mono hidden sm:inline" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(241,241,245,0.45)" }}>
                {selectedConnObj?.db_name}
              </span>
            </div>
          ) : (
            <span className="text-sm" style={{ color: "rgba(241,241,245,0.35)" }}>
              Add a connection to begin
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            {!sidebarOpen && (
              <button
                onClick={() => setConnModal({ open: true, conn: null })}
                className="btn-secondary text-xs py-1.5 px-3 hidden sm:flex items-center gap-1.5"
              >
                <Plus size={13} />
                Add connection
              </button>
            )}
          </div>
        </header>

        {/* Results area */}
        <div
          className="flex-1 overflow-y-auto p-5"
          onClick={handleSuggestionClick}
        >
          {filteredResults.length === 0 ? (
            <EmptyState
              onAdd={() => setConnModal({ open: true, conn: null })}
              hasConnections={connections.length > 0}
            />
          ) : (
            <div className="max-w-4xl mx-auto space-y-5">
              <div ref={resultsEndRef} />
              {filteredResults.map((item, i) => (
                <QueryCard key={i} item={item} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Input bar */}
        <div
          className="flex-shrink-0 px-5 py-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "var(--bg-secondary)" }}
        >
          {!selectedConn && connections.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs mb-2.5 px-1"
              style={{ color: "rgba(245,158,11,0.7)" }}
            >
              <AlertCircle size={12} />
              Select a connection in the sidebar to start querying
            </motion.div>
          )}

          <div className="max-w-4xl mx-auto">
            <div
              className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all"
              style={{
                background: "var(--bg-card)",
                border: selectedConn ? "1px solid rgba(99,102,241,0.25)" : "1px solid rgba(255,255,255,0.07)",
                boxShadow: selectedConn ? "0 0 20px rgba(99,102,241,0.08)" : "none",
              }}
            >
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mb-0.5">
                {loading
                  ? <Loader2 size={15} className="text-brand-400 animate-spin" />
                  : <Zap size={15} className="text-brand-400" />
                }
              </div>
              <textarea
                ref={inputRef}
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    runQuery();
                  }
                }}
                placeholder={
                  !selectedConn && connections.length === 0
                    ? "Add a database connection to start…"
                    : !selectedConn
                    ? "Select a connection above…"
                    : "Ask anything about your data… (Enter to send, Shift+Enter for new line)"
                }
                disabled={!selectedConn || loading}
                rows={1}
                className="flex-1 bg-transparent border-none outline-none text-sm resize-none leading-relaxed"
                style={{
                  color: "rgba(241,241,245,0.85)",
                  minHeight: 24,
                  maxHeight: 120,
                  caretColor: "#6366f1",
                }}
                onInput={e => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
              />
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={runQuery}
                disabled={!selectedConn || !question.trim() || loading}
                className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-35"
                style={{
                  background: question.trim() && selectedConn ? "var(--gradient-brand)" : "rgba(255,255,255,0.06)",
                  border: "none",
                }}
                aria-label="Send query"
              >
                <Send size={14} className={question.trim() && selectedConn ? "text-white" : ""} />
              </motion.button>
            </div>

            <p className="text-xs mt-2 text-center" style={{ color: "rgba(241,241,245,0.2)" }}>
              AI-generated queries · Always validate before production use
            </p>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <ConnectionModal
        open={connModal.open}
        onClose={() => setConnModal({ open: false, conn: null })}
        onSaved={() => fetchConnections(token)}
        token={token}
        existingConn={connModal.conn}
      />

      <DeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal(p => ({ ...p, open: false }))}
        onConfirm={handleDeleteConfirm}
        loading={deleteModal.deleting}
        name={deleteModal.conn?.name}
      />
    </div>
  );
}

/* ─── Wrap with ToastProvider ─── */
export default function Dashboard() {
  return (
    <ToastProvider>
      <DashboardInner />
    </ToastProvider>
  );
}
