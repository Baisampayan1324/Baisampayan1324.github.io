"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DotField from "@/components/ui/dot-field";
import { cn } from "@/utils/cn";
import { Project } from "../constants/projects-data";

const SYNE: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const DM: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif" };

function GithubIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

interface CircularProjectsProps {
  projects: Project[];
  autoplay?: boolean;
}

function ProjectMedia({ project }: { project: Project }) {
  if (project.video) {
    return (
      <video
        src={project.video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover object-center"
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={project.image}
      alt={project.title}
      draggable={false}
      className="h-full w-full object-cover object-center"
    />
  );
}

function ProjectButtons({ project, center = false }: { project: Project; center?: boolean }) {
  const hasGithub = project.showGithub && project.github && project.github !== "#";
  const hasLive = project.showLive && project.live && project.live !== "#";
  if (!hasGithub && !hasLive) return null;
  return (
    <div className={cn("flex flex-wrap gap-3", center && "justify-center")}>
      {hasGithub && (
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          aria-label="View source on GitHub"
          title="GitHub"
          className="lm-btn inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black text-white transition-colors hover:border-white/40 hover:bg-[#1a1a1a] cursor-pointer no-underline"
        >
          <GithubIcon />
        </a>
      )}
      {hasLive && (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer"
          aria-label="Open live site"
          title="Live"
          className="lm-btn inline-flex h-11 w-11 items-center justify-center rounded-full text-black transition-opacity hover:opacity-90 cursor-pointer no-underline"
          style={{ background: project.accentColor }}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

export const CircularProjects = ({ projects, autoplay = true }: CircularProjectsProps) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const len = projects.length;
  const project = projects[index];

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const goTo = useCallback((i: number) => {
    stopAutoplay();
    setIndex(((i % len) + len) % len);
  }, [len, stopAutoplay]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  const handleBack = useCallback(() => {
    // Always land on the "View More" button on the home page. history.back()
    // was unreliable — Lenis + client nav drop the restored scroll position, so
    // it dumped you at the top. A hash nav re-mounts LenisProvider, which scrolls
    // to #projects-view-more (it retries over the first ~1.5s to land reliably).
    if (typeof window !== "undefined") {
      window.location.href = "/#projects-view-more";
    }
  }, []);

  // Autoplay (pauses permanently once the user navigates manually).
  useEffect(() => {
    if (!autoplay) return;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % len), 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplay, len]);

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const dotColors = useMemo(
    () => ({ from: project.accentColor + "66", to: project.accentColor + "1A" }),
    [project.accentColor]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] flex items-center justify-center p-6 lg:p-12">
      {/* Background DotField — tinted by the active project */}
      <div className="absolute inset-0 z-0">
        <DotField
          dotRadius={1.5}
          dotSpacing={22}
          dotShape="circle"
          bulgeStrength={67}
          bulgeOnly={false}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom={dotColors.from}
          gradientTo={dotColors.to}
          glowColor="rgba(255, 255, 255, 0.1)"
        />
      </div>

      {/* Back button */}
      <button
        onClick={handleBack}
        aria-label="Go back to projects"
        className="fixed top-8 left-8 z-50 flex items-center gap-2 px-6 py-2 rounded-full bg-black/50 border border-white text-white hover:bg-white/10 backdrop-blur-md transition-colors cursor-pointer"
      >
        <ArrowLeft size={18} />
        <span className="font-medium text-sm">Back</span>
      </button>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        {/* ── Desktop layout (lg+ only — the fixed 640+360 widths overflow tablets) ── */}
        <div className="hidden lg:flex relative items-center justify-center">
          {/* Media (enlarged) */}
          <div className="w-[560px] xl:w-[640px] aspect-video rounded-3xl overflow-hidden bg-[#111] flex-shrink-0 shadow-2xl ring-1 ring-white/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${project.title}-media`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="h-full w-full"
              >
                <ProjectMedia project={project} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Card (overlaps the media) — reduced width */}
          <div className="ml-[-90px] z-10 w-[340px] xl:w-[360px] flex-shrink-0 rounded-3xl border border-white/10 bg-[#101010]/95 p-6 shadow-2xl backdrop-blur-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <div className="mb-5 h-1 w-10 rounded-full" style={{ background: project.accentColor }} />
                <h2 className="mb-2 text-2xl lg:text-3xl font-extrabold uppercase leading-tight text-white" style={SYNE}>
                  {project.title}
                </h2>
                <p className="mb-6 text-[11px] uppercase tracking-[0.22em]" style={{ ...DM, color: project.accentColor }}>
                  {project.techStack}
                </p>
                <p className="mb-8 text-sm lg:text-base leading-relaxed text-white/75" style={DM}>
                  {project.description}
                </p>
                <ProjectButtons project={project} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Mobile + tablet layout (stacked, fits any width) ── */}
        <div className="lg:hidden mx-auto max-w-sm text-center">
          <div className="mb-6 w-full aspect-video overflow-hidden rounded-3xl bg-[#111] ring-1 ring-white/10 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${project.title}-media-m`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="h-full w-full"
              >
                <ProjectMedia project={project} />
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${project.title}-m`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full" style={{ background: project.accentColor }} />
              <h2 className="mb-2 text-xl font-extrabold uppercase text-white" style={SYNE}>
                {project.title}
              </h2>
              <p className="mb-4 text-[10px] uppercase tracking-[0.2em]" style={{ ...DM, color: project.accentColor }}>
                {project.techStack}
              </p>
              <p className="mb-6 text-sm leading-relaxed text-white/75" style={DM}>
                {project.description}
              </p>
              <ProjectButtons project={project} center />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* ── Navigation: fixed arrow pair, centered below the card (dots removed) ── */}
      <div className="fixed bottom-[18%] left-1/2 z-50 flex -translate-x-1/2 items-center gap-5">
        <button
          onClick={prev}
          aria-label="Previous project"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all hover:border-white/50 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
        </button>
        <button
          onClick={next}
          aria-label="Next project"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all hover:border-white/50 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default CircularProjects;
