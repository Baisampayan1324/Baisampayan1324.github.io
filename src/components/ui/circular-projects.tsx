"use client";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DotField from './DotField';

const SYNE: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const DM: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif" };

export interface Project {
  title: string;
  description: string;
  techStack: string;
  github: string;
  live: string;
  showGithub: boolean;
  showLive: boolean;
  accentColor: string;
  image: string;
  video?: string;
}

interface CircularProjectsProps {
  projects: Project[];
  autoplay?: boolean;
}

function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 55;
  const maxGap = 80;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const CircularProjects = ({
  projects,
  autoplay = true,
}: CircularProjectsProps) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const projectsLength = useMemo(() => projects.length, [projects]);
  const activeProject = useMemo(() => projects[activeIndex], [activeIndex, projects]);

  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (autoplay) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % projectsLength);
      }, 5000);
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, projectsLength]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, projectsLength]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % projectsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [projectsLength]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + projectsLength) % projectsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [projectsLength]);

  function getImageStyle(index: number): React.CSSProperties {
    const isActive = index === activeIndex;
    
    // Calculate distance from active index
    let offset = index - activeIndex;
    if (offset < -projectsLength / 2) offset += projectsLength;
    if (offset > projectsLength / 2) offset -= projectsLength;
    
    const absOffset = Math.abs(offset);

    if (isActive) {
      return {
        zIndex: 50,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translate(0px, 0px) scale(1) rotateZ(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    
    // Pseudo-random but consistent values based on index
    const rotate = ((index * 13) % 20) - 10; // -10 to 10 deg
    const tx = ((index * 29) % 60) - 30; // -30 to 30 px
    const ty = ((index * 17) % 60) - 30; // -30 to 30 px
    
    return {
      zIndex: 50 - absOffset,
      opacity: Math.max(0, 1 - absOffset * 0.15),
      pointerEvents: "none",
      transform: `translate(${tx}px, ${ty}px) scale(${1 - absOffset * 0.05}) rotateZ(${rotate}deg)`,
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Create semi-transparent versions of the accent color for the dots
  const getGradientColors = () => {
    // Basic conversion for solid hex to rgba (assuming hex like #4A90D9)
    const color = activeProject.accentColor;
    return {
      from: color + '66', // ~40% opacity
      to: color + '1A'    // ~10% opacity
    };
  };
  const dotColors = getGradientColors();

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 lg:p-12 overflow-hidden">
      {/* Background DotField */}
      <div className="absolute inset-0 z-0">
        <DotField
          dotRadius={4}
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

      {/* Back button — top-left corner */}
      <button
        onClick={() => router.push('/#projects')}
        aria-label="Go back to projects"
        className="fixed top-8 left-8 z-50 flex items-center gap-2 px-6 py-2 rounded-full bg-black/50 border border-white text-white hover:bg-white/10 backdrop-blur-md transition-colors cursor-pointer"
      >
        <ArrowLeft size={18} />
        <span className="font-medium text-sm">Back</span>
      </button>

      {/* Main grid */}
      <div className="w-full max-w-screen-2xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-center">
        
        {/* Image Stack */}
        <div
          ref={imageContainerRef}
          className="relative w-full max-w-[640px] aspect-video mx-auto overflow-hidden rounded-2xl"
          style={{ perspective: "1200px" }}
        >
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="absolute inset-0 overflow-hidden shadow-2xl bg-[#0a0a0a]"
              style={{ ...getImageStyle(index), borderRadius: 'inherit' }}
            >
              {project.video ? (
                <video
                  src={project.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover origin-center scale-[1.06]"
                />
              ) : (
              <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover origin-center scale-[1.06]"
                />
              )}
              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="flex flex-col"
            >
              {/* Accent bar */}
              <div
                className="w-10 h-[3px] mb-5 rounded-full"
                style={{ background: activeProject.accentColor }}
              />

              {/* Title */}
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase leading-[1.05] text-white mb-3"
                style={SYNE}
              >
                {activeProject.title}
              </h2>

              {/* Tech stack */}
              <p
                className="text-[11px] uppercase tracking-[0.22em] mb-6"
                style={{ color: activeProject.accentColor, ...DM }}
              >
                {activeProject.techStack}
              </p>

              {/* Description — word-by-word blur animation */}
              <motion.p
                className="text-white/75 text-sm lg:text-base leading-relaxed mb-8 max-w-md"
                style={DM}
              >
                {activeProject.description.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ filter: "blur(8px)", opacity: 0, y: 4 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut", delay: 0.012 * i }}
                    style={{ display: "inline-block" }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>

              {/* Buttons — GitHub + Live */}
              <motion.div
                className="flex flex-wrap gap-4 mb-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.4 }}
              >
                {activeProject.showGithub && activeProject.github && (
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors rounded-sm no-underline"
                    style={SYNE}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.165c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    GITHUB
                  </a>
                )}
                {activeProject.showLive && activeProject.live && activeProject.live !== "#" && (
                  <a
                    href={activeProject.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-85 rounded-sm no-underline"
                    style={{ ...SYNE, background: activeProject.accentColor }}
                  >
                    <ExternalLink size={14} /> LIVE
                  </a>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows — Placed outside AnimatePresence so they don't jump when text changes */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handlePrev}
              aria-label="Previous project"
              className="w-[50px] h-[50px] rounded-full border border-white/40 hover:border-white text-white backdrop-blur-md transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 duration-200 bg-transparent"
            >
              <ArrowLeft size={22} strokeWidth={1} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next project"
              className="w-[50px] h-[50px] rounded-full border border-white/40 hover:border-white text-white backdrop-blur-md transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 duration-200 bg-transparent"
            >
              <ArrowRight size={22} strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularProjects;
