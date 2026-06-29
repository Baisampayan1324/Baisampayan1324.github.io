"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useTransform, useSpring, useScroll, MotionValue } from "framer-motion";

// --- Types ---
type Tech = { name: string; icon: string; desc: string; usage: string };

interface BallProps {
  tech: Tech;
  index: number;
  smoothMorph: MotionValue<number>;
  smoothShuffle: MotionValue<number>;
  size: { width: number; height: number };
  entered: boolean;
  onClick: (index: number) => void;
}

// --- Card geometry ---
const CARD_W = 78; // px
const CARD_H = 94; // px

// Force a uniform black-and-white look: all icons come from monochrome Iconify
// sets (simple-icons / tabler) and are recolored to near-black so every logo
// stays visible on the white cards (colored `logos/*` icons washed out before).
const ico = (path: string) => `https://api.iconify.design/${path}.svg?height=512&color=%23141414`;

const Ball = React.memo(function Ball({
  tech,
  index,
  smoothMorph,
  smoothShuffle,
  size,
  entered,
  onClick,
}: BallProps) {
  const isMobile = size.width < 768;
  const minDim = Math.min(size.width, size.height);

  // A. Circle geometry (resting state)
  const circleRadius = Math.min(minDim * 0.36, 340);
  const circleAngle = (index / TOTAL) * 360;
  const circleRad = (circleAngle * Math.PI) / 180;
  const circleX = Math.cos(circleRad) * circleRadius;
  const circleY = Math.sin(circleRad) * circleRadius;

  // B. Bottom rainbow arc geometry
  const baseRadius = Math.min(size.width, size.height * 1.5);
  const arcRadius = baseRadius * (isMobile ? 1.4 : 1.05);
  const arcApexY = size.height * (isMobile ? 0.32 : 0.18);
  const arcCenterY = arcApexY + arcRadius;

  const spreadAngle = isMobile ? 110 : 150;
  const startAngle = -90 - spreadAngle / 2;
  const step = spreadAngle / (TOTAL - 1);
  const maxRotation = spreadAngle * 0.8;
  const scaleEnd = isMobile ? 1.05 : 1.35;

  // Scroll-linked transforms: circle -> arc (morph), then sweep left-to-right (shuffle).
  const x = useTransform([smoothMorph, smoothShuffle], ([latestMorph, latestShuffle]) => {
    const boundedRotation = -(latestShuffle as number) * maxRotation;
    const arcAngle = startAngle + index * step + boundedRotation;
    const arcRad = (arcAngle * Math.PI) / 180;
    const arcX = Math.cos(arcRad) * arcRadius;
    return lerp(circleX, arcX, latestMorph as number);
  });

  const y = useTransform([smoothMorph, smoothShuffle], ([latestMorph, latestShuffle]) => {
    const boundedRotation = -(latestShuffle as number) * maxRotation;
    const arcAngle = startAngle + index * step + boundedRotation;
    const arcRad = (arcAngle * Math.PI) / 180;
    const arcY = Math.sin(arcRad) * arcRadius + arcCenterY;
    return lerp(circleY, arcY, latestMorph as number);
  });

  const scale = useTransform(smoothMorph, (latestMorph) => lerp(1, scaleEnd, latestMorph as number));

  const handleClick = useCallback(() => onClick(index), [onClick, index]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: CARD_W,
        height: CARD_H,
        marginLeft: -CARD_W / 2,
        marginTop: -CARD_H / 2,
        x,
        y,
        scale,
      }}
      className="group cursor-pointer"
      onClick={handleClick}
    >
      {/* Inner wrapper handles the staggered entrance fade — kept separate from the
          scroll transforms above so the two never fight over the same properties. */}
      <motion.div
        className="relative h-full w-full"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: entered ? 1 : 0, scale: entered ? 1 : 0.6 }}
        transition={{ type: "spring", stiffness: 60, damping: 16, delay: index * 0.02 }}
      >
        <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-white p-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.3)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ico(tech.icon)}
            alt={tech.name}
            loading="lazy"
            className="h-[78%] w-[78%] object-contain transition-transform duration-300 group-hover:scale-110"
            draggable={false}
          />
        </div>
        <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {tech.name}
        </span>
      </motion.div>
    </motion.div>
  );
});

// --- Expanded detail card ---
function DetailCard({ tech, onClose }: { tech: Tech; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[300] grid place-items-center p-5">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
      />

      {/* Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-zinc-950 shadow-2xl ring-1 ring-white/10"
      >
        {/* Logo panel — logo ~80% */}
        <div className="relative flex h-56 items-center justify-center bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ico(tech.icon)}
            alt={tech.name}
            className="h-[80%] w-[80%] object-contain"
            draggable={false}
          />
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black/70 transition-colors hover:bg-white hover:text-black"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-7">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {tech.desc}
          </p>
          <h3 className="mb-4 text-3xl font-semibold text-white">{tech.name}</h3>
          <p className="text-sm leading-relaxed text-zinc-400">
            <span className="font-semibold text-zinc-200">Where I use it: </span>
            {tech.usage}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// --- Tech list (monochrome Iconify logos, recolored black by `ico`) ---
const TECH: Tech[] = [
  { name: "Python", icon: "simple-icons/python", desc: "Language", usage: "Primary language for everything — ML pipelines, data prep, backends, and automation scripts." },
  { name: "Java", icon: "mdi/language-java", desc: "Language", usage: "OOP fundamentals and DSA practice; used across academic projects and 300+ LeetCode solutions." },
  { name: "SQL", icon: "simple-icons/mysql", desc: "Databases", usage: "Querying and modelling relational data behind my apps and analytics work." },
  { name: "HTML", icon: "simple-icons/html5", desc: "Markup", usage: "Structural backbone for the web UIs and dashboards I build." },
  { name: "CSS", icon: "simple-icons/css", desc: "Styling", usage: "Responsive layouts, animations, and visual polish on front-ends." },
  { name: "TensorFlow", icon: "simple-icons/tensorflow", desc: "ML Framework", usage: "Building and training deep-learning models for vision and NLP experiments." },
  { name: "PyTorch", icon: "simple-icons/pytorch", desc: "ML Framework", usage: "My go-to for research-style model building, fine-tuning, and custom training loops." },
  { name: "Keras", icon: "simple-icons/keras", desc: "Deep Learning", usage: "Fast prototyping of neural networks on top of TensorFlow." },
  { name: "SciPy", icon: "simple-icons/scipy", desc: "Scientific", usage: "Scientific computing and optimization inside data pipelines." },
  { name: "NumPy", icon: "simple-icons/numpy", desc: "Arrays", usage: "Vectorized array math at the core of every preprocessing step." },
  { name: "Pandas", icon: "simple-icons/pandas", desc: "Data", usage: "Data wrangling, cleaning, and feature engineering on tabular datasets." },
  { name: "Matplotlib", icon: "tabler/chart-histogram", desc: "Plotting", usage: "Visualizing metrics, distributions, and model results." },
  { name: "Hugging Face", icon: "simple-icons/huggingface", desc: "Models", usage: "Pretrained transformers and datasets for LLM and NLP applications." },
  { name: "LangChain", icon: "simple-icons/langchain", desc: "LLM Apps", usage: "Orchestrating RAG pipelines, agents, and multi-LLM workflows." },
  { name: "Scikit-Learn", icon: "simple-icons/scikitlearn", desc: "ML", usage: "Classic ML — regression, classification, clustering, and evaluation." },
  { name: "FastAPI", icon: "simple-icons/fastapi", desc: "API", usage: "Serving ML models and building production REST APIs with real-time inference." },
  { name: "Streamlit", icon: "simple-icons/streamlit", desc: "Apps", usage: "Shipping quick interactive demos and data apps." },
  { name: "Node.js", icon: "simple-icons/nodedotjs", desc: "Runtime", usage: "JavaScript runtime for tooling and full-stack glue." },
  { name: "React", icon: "simple-icons/react", desc: "UI", usage: "Building interactive front-ends — including this portfolio." },
  { name: "Flask", icon: "simple-icons/flask", desc: "Web", usage: "Lightweight Python APIs and microservices." },
  { name: "Django", icon: "simple-icons/django", desc: "Web", usage: "Full-featured web backends with ORM and auth." },
  { name: "Docker", icon: "simple-icons/docker", desc: "Containers", usage: "Containerizing apps and models for reproducible deploys." },
  { name: "MySQL", icon: "simple-icons/mysql", desc: "Database", usage: "Relational storage for application data." },
  { name: "MongoDB", icon: "simple-icons/mongodb", desc: "Database", usage: "Document store for flexible, unstructured app data." },
  { name: "Firebase", icon: "simple-icons/firebase", desc: "Backend", usage: "Auth, realtime DB, and hosting for quick product builds." },
  { name: "Google Cloud", icon: "simple-icons/googlecloud", desc: "Cloud", usage: "Deploying and scaling ML services in the cloud." },
  { name: "Git", icon: "simple-icons/git", desc: "VCS", usage: "Version control on every project." },
  { name: "GitHub", icon: "simple-icons/github", desc: "Code Host", usage: "Hosting code, CI, and collaboration." },
  { name: "VS Code", icon: "simple-icons/visualstudiocode", desc: "Editor", usage: "Daily-driver editor for all development." },
  { name: "Anaconda", icon: "simple-icons/anaconda", desc: "Env", usage: "Managing Python environments and ML dependencies." },
];

const TOTAL = TECH.length;

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function TechSpheres() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [entered, setEntered] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const wrapRef = useRef<HTMLDivElement>(null); // tall scroll track
  const pinRef = useRef<HTMLDivElement>(null); // sticky stage

  // --- Stage size ---
  useEffect(() => {
    if (!pinRef.current) return;
    const el = pinRef.current;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(el);
    setSize({ width: el.offsetWidth, height: el.offsetHeight });
    return () => observer.disconnect();
  }, []);

  // --- Entrance: fade the circle in once we know the stage size (no scatter/line) ---
  useEffect(() => {
    if (size.width > 0 && !entered) {
      const t = setTimeout(() => setEntered(true), 150);
      return () => clearTimeout(t);
    }
  }, [size.width, entered]);

  // --- Scroll-driven morph (natural page scroll, reversible both directions) ---
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // 0 -> 1 : circle morphs to bottom arc (first 55% of the scroll track)
  const morph = useTransform(scrollYProgress, [0.05, 0.55], [0, 1]);
  const smoothMorph = useSpring(morph, { stiffness: 120, damping: 24 });

  // 0 -> 1 : sweep the arc left-to-right (last 45%)
  const shuffle = useTransform(scrollYProgress, [0.55, 1], [0, 1]);
  const smoothShuffle = useSpring(shuffle, { stiffness: 120, damping: 24 });

  // Hint fades out as the arc forms.
  const hintOpacity = useTransform(smoothMorph, [0, 0.5], [1, 0]);

  const handleBallClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <div ref={wrapRef} className="relative h-[280vh] w-full" style={{ contain: "layout style" }}>
      <div
        ref={pinRef}
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden"
      >
        {/* Hint (fades as the morph begins) */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute top-4 z-0 flex flex-col items-center text-center"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Click any logo to see where I use it · scroll to explore
          </p>
        </motion.div>

        {/* Cards */}
        {TECH.map((t, i) => (
          <Ball
            key={t.name + i}
            tech={t}
            index={i}
            smoothMorph={smoothMorph}
            smoothShuffle={smoothShuffle}
            size={size}
            entered={entered}
            onClick={handleBallClick}
          />
        ))}
      </div>

      {/* Expanded detail card — portaled to <body> so the section's CSS
          containment (`contain: layout`) can't trap this fixed overlay inside
          the tall scroll track (which hid it off-screen on click). */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {activeIndex !== null && (
              <DetailCard tech={TECH[activeIndex]} onClose={() => setActiveIndex(null)} />
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
