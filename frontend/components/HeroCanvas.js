"use client";
import { useEffect, useRef } from "react";

const NODE_COUNT = 28;
const EDGE_PROBABILITY = 0.18;
const PACKET_INTERVAL = 800;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function hsl(h, s, l, a = 1) {
  return `hsla(${h},${s}%,${l}%,${a})`;
}

export default function HeroCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width, height;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      if (stateRef.current) {
        initNodes();
      }
    }

    // Node types with visual metadata
    const NODE_TYPES = [
      { label: "PG",    color: [220, 80, 65],  size: 18, category: "db" },
      { label: "MY",    color: [200, 70, 60],  size: 16, category: "db" },
      { label: "API",   color: [260, 75, 70],  size: 14, category: "api" },
      { label: "AI",    color: [280, 80, 72],  size: 20, category: "ai" },
      { label: "CDN",   color: [185, 70, 60],  size: 13, category: "infra" },
      { label: "SYNC",  color: [165, 65, 55],  size: 12, category: "infra" },
      { label: "CACHE", color: [240, 65, 68],  size: 14, category: "cache" },
      { label: "S3",    color: [35, 75, 60],   size: 13, category: "storage" },
    ];

    function initNodes() {
      const nodes = [];
      const margin = 80;
      for (let i = 0; i < NODE_COUNT; i++) {
        const type = NODE_TYPES[i % NODE_TYPES.length];
        const [h, s, l] = type.color;
        nodes.push({
          id: i,
          x: randomBetween(margin, width - margin),
          y: randomBetween(margin, height - margin),
          vx: randomBetween(-0.12, 0.12),
          vy: randomBetween(-0.12, 0.12),
          size: type.size + randomBetween(-2, 3),
          label: type.label,
          color: [h, s, l],
          category: type.category,
          pulse: randomBetween(0, Math.PI * 2),
          pulseSpeed: randomBetween(0.02, 0.05),
          active: false,
          activeDuration: 0,
        });
      }

      // Build adjacency
      const edges = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (Math.random() < EDGE_PROBABILITY) {
            edges.push({ from: i, to: j });
          }
        }
      }

      // Packets
      const packets = [];

      stateRef.current = { nodes, edges, packets };
    }

    function spawnPacket() {
      const state = stateRef.current;
      if (!state) return;
      const { nodes, edges, packets } = state;
      if (edges.length === 0) return;
      const edge = edges[Math.floor(Math.random() * edges.length)];
      const reverse = Math.random() > 0.5;
      const from = reverse ? edge.to : edge.from;
      const to = reverse ? edge.from : edge.to;

      packets.push({
        from,
        to,
        t: 0,
        speed: randomBetween(0.004, 0.009),
        color: nodes[from].color,
        size: randomBetween(2, 4),
        trail: [],
      });

      nodes[from].active = true;
      nodes[from].activeDuration = 60;
    }

    function drawNode(node, t) {
      const [h, s, l] = node.color;
      node.pulse += node.pulseSpeed;

      const pulseFactor = 0.08 * Math.sin(node.pulse);
      const r = node.size + node.size * pulseFactor;

      // Outer ring (for active nodes)
      if (node.active) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 6, 0, Math.PI * 2);
        ctx.strokeStyle = hsl(h, s, l, 0.25);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Glow
      const grd = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 3);
      grd.addColorStop(0, hsl(h, s, l, 0.15));
      grd.addColorStop(1, hsl(h, s, l, 0));
      ctx.beginPath();
      ctx.arc(node.x, node.y, r * 3, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Main circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = hsl(h, s, l * 0.35, 0.9);
      ctx.fill();
      ctx.strokeStyle = hsl(h, s, l, 0.6);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.fillStyle = hsl(h, s, l, 0.85);
      ctx.font = `600 ${Math.max(7, r * 0.55)}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y);

      // Cool inner dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = hsl(h, s, l + 20, 0.9);
      ctx.fill();

      if (node.activeDuration > 0) {
        node.activeDuration--;
        if (node.activeDuration <= 0) node.active = false;
      }
    }

    function drawEdge(edge, nodes) {
      const a = nodes[edge.from];
      const b = nodes[edge.to];

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 380) return;

      const alpha = Math.max(0, 0.12 - dist / 3200);

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);

      // Slight curve
      const mx = (a.x + b.x) / 2 + dy * 0.06;
      const my = (a.y + b.y) / 2 - dx * 0.06;
      ctx.quadraticCurveTo(mx, my, b.x, b.y);

      const [ah, as_, al] = a.color;
      const grd = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grd.addColorStop(0, hsl(ah, as_, al, alpha));
      grd.addColorStop(1, hsl(...b.color, alpha));
      ctx.strokeStyle = grd;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    function drawPacket(packet, nodes) {
      const a = nodes[packet.from];
      const b = nodes[packet.to];
      if (!a || !b) return;

      const t = packet.t;
      const [h, s, l] = packet.color;

      // Bezier position
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const mx = (a.x + b.x) / 2 + dy * 0.06;
      const my = (a.y + b.y) / 2 - dx * 0.06;

      const px = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * mx + t * t * b.x;
      const py = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * my + t * t * b.y;

      // Trail
      packet.trail.push({ x: px, y: py });
      if (packet.trail.length > 12) packet.trail.shift();

      for (let i = 0; i < packet.trail.length; i++) {
        const alpha = (i / packet.trail.length) * 0.5;
        ctx.beginPath();
        ctx.arc(packet.trail[i].x, packet.trail[i].y, packet.size * 0.6 * (i / packet.trail.length), 0, Math.PI * 2);
        ctx.fillStyle = hsl(h, s, l, alpha);
        ctx.fill();
      }

      // Glow
      const grd = ctx.createRadialGradient(px, py, 0, px, py, packet.size * 3);
      grd.addColorStop(0, hsl(h, s, l, 0.6));
      grd.addColorStop(1, hsl(h, s, l, 0));
      ctx.beginPath();
      ctx.arc(px, py, packet.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(px, py, packet.size, 0, Math.PI * 2);
      ctx.fillStyle = hsl(h, s, l, 0.9);
      ctx.fill();
    }

    let lastPacketTime = 0;
    let frame = 0;

    function draw(timestamp) {
      if (!stateRef.current) { animRef.current = requestAnimationFrame(draw); return; }
      const { nodes, edges, packets } = stateRef.current;

      ctx.clearRect(0, 0, width, height);

      // Subtle grid
      ctx.strokeStyle = "rgba(99,102,241,0.025)";
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Edges
      edges.forEach(e => drawEdge(e, nodes));

      // Packets
      const alive = [];
      for (const p of packets) {
        p.t += p.speed;
        if (p.t < 1) {
          drawPacket(p, nodes);
          alive.push(p);
        }
      }
      stateRef.current.packets = alive;

      // Spawn packets
      if (timestamp - lastPacketTime > PACKET_INTERVAL) {
        spawnPacket();
        if (Math.random() > 0.6) spawnPacket();
        lastPacketTime = timestamp;
      }

      // Nodes
      nodes.forEach(n => drawNode(n, frame));

      // Move nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 40 || n.x > width - 40) n.vx *= -1;
        if (n.y < 40 || n.y > height - 40) n.vy *= -1;
      });

      frame++;
      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="hero-canvas"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.75,
      }}
      aria-hidden="true"
    />
  );
}
