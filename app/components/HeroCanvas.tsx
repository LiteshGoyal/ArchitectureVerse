"use client";

import { useEffect, useRef, useState } from "react";
import { Wand2 } from "lucide-react";

type Phase = "typing" | "generating" | "revealed" | "clearing";
type Tone = "plain" | "coral" | "amber";

interface NodeDef {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tone: Tone;
}

interface EdgeDef {
  from: string;
  to: string;
}

// Two prompts so the loop doesn't feel like it's repeating the exact same demo.
const PROMPTS = [
  "A streaming app with auth, caching and a CDN",
  "A checkout flow with a queue and a payment service",
];

// Fixed layout for the mock diagram — mirrors the real canvas's node + edge model.
const NODES: NodeDef[] = [
  { id: "client", label: "Client App", x: 16, y: 24, w: 112, h: 38, tone: "plain" },
  { id: "gateway", label: "API Gateway", x: 192, y: 24, w: 112, h: 38, tone: "plain" },
  { id: "auth", label: "Auth Service", x: 366, y: 4, w: 130, h: 36, tone: "plain" },
  { id: "content", label: "Content Service", x: 366, y: 64, w: 130, h: 36, tone: "plain" },
  { id: "cache", label: "Cache (Redis)", x: 192, y: 124, w: 112, h: 36, tone: "coral" },
  { id: "cdn", label: "CDN", x: 16, y: 124, w: 112, h: 36, tone: "amber" },
];

const EDGES: EdgeDef[] = [
  { from: "client", to: "gateway" },
  { from: "gateway", to: "auth" },
  { from: "gateway", to: "content" },
  { from: "content", to: "cache" },
  { from: "content", to: "cdn" },
];

const TONE_STYLES: Record<Tone, { fill: string; stroke: string; text: string }> = {
  plain: { fill: "#FFFFFF", stroke: "#D8D7CD", text: "#14141A" },
  coral: { fill: "#FFEEE8", stroke: "#FF6B4A", text: "#7A2E1B" },
  amber: { fill: "#FFF6E5", stroke: "#F2A93B", text: "#7A4E0E" },
};

function edgePath(a: NodeDef, b: NodeDef) {
  const forward = b.x >= a.x;
  const x1 = forward ? a.x + a.w : a.x;
  const y1 = a.y + a.h / 2;
  const x2 = forward ? b.x : b.x + b.w;
  const y2 = b.y + b.h / 2;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

export default function HeroCanvas() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const reducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      reducedMotion.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }
  }, []);

  useEffect(() => {
    if (reducedMotion.current) {
      setTyped(PROMPTS[0]);
      setPhase("revealed");
      return;
    }

    const full = PROMPTS[promptIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (typed.length < full.length) {
        timer = setTimeout(() => setTyped(full.slice(0, typed.length + 1)), 35);
      } else {
        timer = setTimeout(() => setPhase("generating"), 550);
      }
    } else if (phase === "generating") {
      timer = setTimeout(() => setPhase("revealed"), 1100);
    } else if (phase === "revealed") {
      timer = setTimeout(() => setPhase("clearing"), 4200);
    } else {
      timer = setTimeout(() => {
        setTyped("");
        setPromptIndex((i) => (i + 1) % PROMPTS.length);
        setPhase("typing");
      }, 550);
    }

    return () => clearTimeout(timer);
  }, [phase, typed, promptIndex]);

  const showNodes = phase === "revealed";

  return (
    <div className="animate-float-slow rounded-2xl border border-[#E7E6E1] bg-white shadow-[0_30px_70px_-25px_rgba(20,20,26,0.18)]">
      {/* window chrome, mirrors the real toolbar's app-like feel */}
      <div className="flex items-center justify-between border-b border-[#E7E6E1] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B4A]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#F2A93B]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3FB27F]" />
        </div>
        <div className="font-mono flex items-center gap-1.5 text-[11px] text-[#5C5C68]">
          <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-[#3FB27F]" />
          2 people editing
        </div>
      </div>

      {/* fake "describe architecture" input, echoing the real toolbar */}
      <div className="flex items-center gap-2 border-b border-[#E7E6E1] px-4 py-3">
        <div className="flex-1 truncate rounded-lg border border-[#E7E6E1] bg-[#FAFAF8] px-3 py-2 text-sm text-[#14141A]">
          {typed || "Describe architecture\u2026"}
          <span className="animate-blink">|</span>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#4F46E5] px-3 py-2 text-xs font-medium text-white">
          {phase === "generating" ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <Wand2 size={13} />
          )}
          Generate
        </div>
      </div>

      <div className="bg-dot-grid relative h-[210px] overflow-hidden rounded-b-2xl">
        <svg viewBox="0 0 520 180" className="h-full w-full">
          {EDGES.map((edge, i) => {
            const a = NODES.find((n) => n.id === edge.from)!;
            const b = NODES.find((n) => n.id === edge.to)!;
            return (
              <path
                key={`${edge.from}-${edge.to}`}
                d={edgePath(a, b)}
                fill="none"
                stroke="#D8D7CD"
                strokeWidth={1.4}
                strokeDasharray="4 5"
                className={showNodes ? "animate-dash" : ""}
                style={{
                  opacity: showNodes ? 1 : 0,
                  transition: `opacity 0.4s ease ${0.25 + i * 0.08}s`,
                }}
              />
            );
          })}

          {NODES.map((node, i) => {
            const tone = TONE_STYLES[node.tone];
            return (
              <g
                key={node.id}
                style={{
                  opacity: showNodes ? 1 : 0,
                  transform: showNodes ? "translateY(0)" : "translateY(6px)",
                  transition: `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`,
                }}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={node.h}
                  rx={9}
                  fill={tone.fill}
                  stroke={tone.stroke}
                  strokeWidth={1.2}
                />
                <text
                  x={node.x + node.w / 2}
                  y={node.y + node.h / 2 + 4}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                  fill={tone.text}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
