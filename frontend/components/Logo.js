"use client";
import { motion } from "framer-motion";

/**
 * DataMind Logo — geometric mark with interlocked data rings + node
 * scalable SVG, works at any size
 */
export function LogoMark({ size = 32, animated = false }) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const R = s * 0.36;      // outer ring radius
  const r = s * 0.16;      // inner node radius
  const dotR = s * 0.05;   // small accent dots

  const Wrapper = animated ? motion.div : "div";
  const animProps = animated
    ? { animate: { rotate: [0, 360] }, transition: { duration: 40, repeat: Infinity, ease: "linear" } }
    : {};

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DataMind logo mark"
    >
      <defs>
        <linearGradient id="dm-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="55%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="dm-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <filter id="dm-glow">
          <feGaussianBlur stdDeviation={s * 0.04} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer orbit ring */}
      <circle
        cx={cx} cy={cy} r={R}
        stroke="url(#dm-grad-1)"
        strokeWidth={s * 0.03}
        strokeDasharray={`${R * 0.6} ${R * 0.4}`}
        strokeLinecap="round"
        opacity={0.7}
      />

      {/* Second orbit ring — tilted */}
      <ellipse
        cx={cx} cy={cy}
        rx={R} ry={R * 0.42}
        stroke="url(#dm-grad-2)"
        strokeWidth={s * 0.025}
        strokeDasharray={`${R * 0.5} ${R * 0.55}`}
        strokeLinecap="round"
        opacity={0.5}
        transform={`rotate(-35 ${cx} ${cy})`}
      />

      {/* Centre node */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="url(#dm-grad-1)"
        filter="url(#dm-glow)"
        opacity={0.95}
      />

      {/* Inner cross lines */}
      <line x1={cx} y1={cy - r * 0.55} x2={cx} y2={cy + r * 0.55} stroke="white" strokeWidth={s * 0.025} strokeLinecap="round" opacity={0.6} />
      <line x1={cx - r * 0.55} y1={cy} x2={cx + r * 0.55} y2={cy} stroke="white" strokeWidth={s * 0.025} strokeLinecap="round" opacity={0.6} />

      {/* Accent dots on orbit */}
      <circle cx={cx + R} cy={cy} r={dotR} fill="#22d3ee" opacity={0.9} />
      <circle cx={cx - R} cy={cy} r={dotR} fill="#8b5cf6" opacity={0.9} />
      <circle cx={cx} cy={cy - R} r={dotR} fill="#6366f1" opacity={0.9} />
    </svg>
  );
}

export function LogoFull({ size = 32, className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <span
        style={{
          fontSize: size * 0.56,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6 50%, #22d3ee)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        DataMind
      </span>
    </div>
  );
}

export default LogoFull;
