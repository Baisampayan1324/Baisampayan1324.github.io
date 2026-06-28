"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion, useTransform, useSpring, useScroll } from "framer-motion";

// --- Types ---
type Phase = "scatter" | "line" | "circle";

type Tech = { name: string; icon: string; desc: string; usage: string };

interface BallProps {
  tech: Tech;
  target: { x: number; y: number; scale: number; opacity: number };
  onClick: () => void;
}

// --- Card Component (trigger) ---
const CARD_W = 78; // px
const CARD_H = 94; // px

const ico = (path: string) => `https://api.iconify.design/${path}.svg?height=512`;

function Ball({ tech, target, onClick }: BallProps) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: "spring", stiffness: 40, damping: 15 }}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: CARD_W,
        height: CARD_H,
        marginLeft: -CARD_W / 2,
        marginTop: -CARD_H / 2,
      }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* The card */}
      <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-white p-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.3)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ico(tech.icon)}
          alt={tech.name}
          className="h-[78%] w-[78%] object-contain transition-transform duration-300 group-hover:scale-110"
          draggable={false}
        />
      </div>

      {/* Name label on hover */}
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {tech.name}
      </span>
    </motion.div>
  );
}

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
    <div className="fixed inset-0 z-[100] grid place-items-center p-5">
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

// --- Tech list (Iconify colored logos) ---
const TECH: Tech[] = [
  { name: "Python", icon: "logos/python", desc: "Language", usage: "Primary language for everything — ML pipelines, data prep, backends, and automation scripts." },
  { name: "Java", icon: "logos/java", desc: "Language", usage: "OOP fundamentals and DSA practice; used across academic projects and 300+ LeetCode solutions." },
  { name: "SQL", icon: "logos/mysql", desc: "Databases", usage: "Querying and modelling relational data behind my apps and analytics work." },
  { name: "HTML", icon: "logos/html-5", desc: "Markup", usage: "Structural backbone for the web UIs and dashboards I build." },
  { name: "CSS", icon: "logos/css-3", desc: "Styling", usage: "Responsive layouts, animations, and visual polish on front-ends." },
  { name: "TensorFlow", icon: "logos/tensorflow", desc: "ML Framework", usage: "Building and training deep-learning models for vision and NLP experiments." },
  { name: "PyTorch", icon: "logos/pytorch-icon", desc: "ML Framework", usage: "My go-to for research-style model building, fine-tuning, and custom training loops." },
  { name: "Keras", icon: "simple-icons/keras?color=%23D00000", desc: "Deep Learning", usage: "Fast prototyping of neural networks on top of TensorFlow." },
  { name: "SciPy", icon: "logos/scipy", desc: "Scientific", usage: "Scientific computing and optimization inside data pipelines." },
  { name: "NumPy", icon: "logos/numpy", desc: "Arrays", usage: "Vectorized array math at the core of every preprocessing step." },
  { name: "Pandas", icon: "logos/pandas-icon", desc: "Data", usage: "Data wrangling, cleaning, and feature engineering on tabular datasets." },
  { name: "Matplotlib", icon: "logos/matplotlib-icon", desc: "Plotting", usage: "Visualizing metrics, distributions, and model results." },
  { name: "Hugging Face", icon: "logos/hugging-face-icon", desc: "Models", usage: "Pretrained transformers and datasets for LLM and NLP applications." },
  { name: "LangChain", icon: "simple-icons/langchain?color=%231C3C3C", desc: "LLM Apps", usage: "Orchestrating RAG pipelines, agents, and multi-LLM workflows." },
  { name: "Scikit-Learn", icon: "logos/scikit-learn", desc: "ML", usage: "Classic ML — regression, classification, clustering, and evaluation." },
  { name: "FastAPI", icon: "logos/fastapi-icon", desc: "API", usage: "Serving ML models and building production REST APIs with real-time inference." },
  { name: "Streamlit", icon: "logos/streamlit", desc: "Apps", usage: "Shipping quick interactive demos and data apps." },
  { name: "Node.js", icon: "logos/nodejs-icon", desc: "Runtime", usage: "JavaScript runtime for tooling and full-stack glue." },
  { name: "React", icon: "logos/react", desc: "UI", usage: "Building interactive front-ends — including this portfolio." },
  { name: "Flask", icon: "simple-icons/flask?color=%23000000", desc: "Web", usage: "Lightweight Python APIs and microservices." },
  { name: "Django", icon: "logos/django-icon", desc: "Web", usage: "Full-featured web backends with ORM and auth." },
  { name: "Docker", icon: "logos/docker-icon", desc: "Containers", usage: "Containerizing apps and models for reproducible deploys." },
  { name: "MySQL", icon: "logos/mysql", desc: "Database", usage: "Relational storage for application data." },
  { name: "MongoDB", icon: "logos/mongodb-icon", desc: "Database", usage: "Document store for flexible, unstructured app data." },
  { name: "Firebase", icon: "logos/firebase", desc: "Backend", usage: "Auth, realtime DB, and hosting for quick product builds." },
  { name: "Google Cloud", icon: "logos/google-cloud", desc: "Cloud", usage: "Deploying and scaling ML services in the cloud." },
  { name: "Git", icon: "logos/git-icon", desc: "VCS", usage: "Version control on every project." },
  { name: "GitHub", icon: "simple-icons/github?color=%23000000", desc: "Code Host", usage: "Hosting code, CI, and collaboration." },
  { name: "VS Code", icon: "logos/visual-studio-code", desc: "Editor", usage: "Daily-driver editor for all development." },
  { name: "Anaconda", icon: "logos/anaconda-icon", desc: "Env", usage: "Managing Python environments and ML dependencies." },
];

const TOTAL = TECH.length;

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function TechSpheres() {
  const [phase, setPhase] = useState<Phase>("scatter");
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

  // --- Scroll-driven morph (no wheel hijacking — natural page scroll) ---
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // 0 -> 1 : circle morphs to bottom arc (first 55% of scroll track)
  const morph = useTransform(scrollYProgress, [0.05, 0.55], [0, 1]);
  const smoothMorph = useSpring(morph, { stiffness: 40, damping: 20 });

  // 0 -> 1 : shuffle/sweep the arc (last 45%)
  const shuffle = useTransform(scrollYProgress, [0.55, 1], [0, 1]);
  const smoothShuffle = useSpring(shuffle, { stiffness: 40, damping: 20 });

  const [morphValue, setMorphValue] = useState(0);
  const [shuffleValue, setShuffleValue] = useState(0);

  useEffect(() => {
    const a = smoothMorph.on("change", setMorphValue);
    const b = smoothShuffle.on("change", setShuffleValue);
    return () => { a(); b(); };
  }, [smoothMorph, smoothShuffle]);

  // --- Intro sequence: scatter -> line -> circle ---
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("line"), 450);
    const t2 = setTimeout(() => setPhase("circle"), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // --- Random scatter start positions ---
  const scatterPositions = useMemo(
    () =>
      TECH.map(() => ({
        x: (Math.random() - 0.5) * 1400,
        y: (Math.random() - 0.5) * 900,
        scale: 0.5,
        opacity: 0,
      })),
    []
  );

  // Header / hint fade as arc forms
  const introTextOpacity = useTransform(smoothMorph, [0, 0.5], [1, 0]);

  return (
    <div ref={wrapRef} className="relative h-[280vh] w-full">
      <div
        ref={pinRef}
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden"
      >
        {/* Intro hint (fades as morph begins) */}
        <motion.div
          style={{ opacity: introTextOpacity }}
          className="pointer-events-none absolute top-4 z-0 flex flex-col items-center text-center"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Scroll to explore the stack · tap a card for details
          </p>
        </motion.div>

        {/* Cards */}
        {TECH.map((t, i) => {
          let target = { x: 0, y: 0, scale: 1, opacity: 1 };

          if (phase === "scatter") {
            target = scatterPositions[i];
          } else if (phase === "line") {
            const spacing = 92;
            const totalWidth = TOTAL * spacing;
            target = { x: i * spacing - totalWidth / 2, y: 0, scale: 0.7, opacity: 1 };
          } else {
            const isMobile = size.width < 768;
            const minDim = Math.min(size.width, size.height);

            // A. Circle
            const circleRadius = Math.min(minDim * 0.36, 340);
            const circleAngle = (i / TOTAL) * 360;
            const circleRad = (circleAngle * Math.PI) / 180;
            const circlePos = {
              x: Math.cos(circleRad) * circleRadius,
              y: Math.sin(circleRad) * circleRadius,
            };

            // B. Bottom rainbow arc (convex up)
            const baseRadius = Math.min(size.width, size.height * 1.5);
            const arcRadius = baseRadius * (isMobile ? 1.4 : 1.05);
            const arcApexY = size.height * (isMobile ? 0.32 : 0.18);
            const arcCenterY = arcApexY + arcRadius;

            const spreadAngle = isMobile ? 110 : 150;
            const startAngle = -90 - spreadAngle / 2;
            const step = spreadAngle / (TOTAL - 1);

            const maxRotation = spreadAngle * 0.8;
            const boundedRotation = -shuffleValue * maxRotation;

            const arcAngle = startAngle + i * step + boundedRotation;
            const arcRad = (arcAngle * Math.PI) / 180;
            const arcPos = {
              x: Math.cos(arcRad) * arcRadius,
              y: Math.sin(arcRad) * arcRadius + arcCenterY,
              scale: isMobile ? 1.05 : 1.35,
            };

            // C. Morph between circle and arc
            target = {
              x: lerp(circlePos.x, arcPos.x, morphValue),
              y: lerp(circlePos.y, arcPos.y, morphValue),
              scale: lerp(1, arcPos.scale, morphValue),
              opacity: 1,
            };
          }

          return <Ball key={t.name + i} tech={t} target={target} onClick={() => setActiveIndex(i)} />;
        })}
      </div>

      {/* Expanded detail card */}
      <AnimatePresence>
        {activeIndex !== null && (
          <DetailCard tech={TECH[activeIndex]} onClose={() => setActiveIndex(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
