"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import ScrollFloat from "@/components/ui/scroll-float";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects, Project } from "@/features/projects/constants/projects-data";

const SYNE: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const DM: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif" };

function GithubIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

const ProjectRow = React.memo(function ProjectRow({ project, index }: { project: Project; index: number }) {
  const reverse = index % 2 === 1;
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });

  // When reduced-motion is preferred, disable parallax and reveal immediately
  const textY = useTransform(smooth, [0, 1], prefersReduced ? [0, 0] : [70, -40]);
  const opacity = useTransform(smooth, [0, 0.55], prefersReduced ? [1, 1] : [0, 1]);
  const scale = useTransform(smooth, [0, 0.6], prefersReduced ? [1, 1] : [1.12, 1]);
  const clipPath = useTransform(
    smooth,
    [0, 0.6],
    prefersReduced
      ? ["inset(0 0 0 0%)", "inset(0 0 0 0%)"]
      : reverse
        ? ["inset(0 0 0 100%)", "inset(0 0 0 0%)"]
        : ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]
  );

  return (
    <div
      ref={ref}
      className={`flex min-h-[75vh] flex-col items-center justify-center gap-10 sm:min-h-[85vh] md:min-h-screen md:gap-24 ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {/* Text */}
      <motion.div style={{ y: textY }} className="w-full md:max-w-md">
        <h3 className="text-2xl font-extrabold uppercase leading-[1.02] tracking-tight text-foreground sm:text-3xl md:text-4xl" style={SYNE}>
          {project.title}
        </h3>
        <div className="my-5 h-1 w-14 md:my-6 md:w-16" style={{ background: project.accentColor }} />

        <ul className="grid gap-3 md:gap-4">
          {project.points.map((point, i) => (
            <li key={i} className="relative pl-6 text-sm leading-relaxed text-muted-foreground" style={DM}>
              <span className="absolute left-0 top-[9px] h-1.5 w-1.5 rotate-45 bg-primary" aria-hidden />
              {point}
            </li>
          ))}
        </ul>

        {/* GitHub + Live buttons */}
        <div className="mt-7 flex flex-wrap gap-3 md:mt-8">
          {project.github && project.github !== "#" && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="lm-btn inline-flex items-center gap-2 border border-border bg-black px-4 py-2 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-[#494949] hover:bg-[#202020] cursor-pointer sm:px-5 sm:py-2.5"
              style={SYNE}
            >
              <GithubIcon /> GitHub
            </a>
          )}
          {project.live && project.live !== "#" && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="lm-btn inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-90 cursor-pointer sm:px-5 sm:py-2.5"
              style={{ ...SYNE, background: "var(--gold)" }}
            >
              <ExternalIcon /> Live
            </a>
          )}
        </div>
      </motion.div>

      {/* Visual panel with scroll-linked clip-path reveal */}
      <motion.div style={{ opacity, clipPath }} className="relative w-full flex-shrink-0 md:w-auto">
        <motion.div
          style={{
            scale,
            background: project.image
              ? `url(${project.image}) center/cover no-repeat`
              : `linear-gradient(135deg, ${project.accentColor}40 0%, #0b0b0b 70%)`,
          }}
          className="relative flex w-full items-end overflow-hidden rounded-xl shadow-2xl group aspect-video md:w-[44rem] lg:w-[48rem] md:aspect-video"
        >
          {project.video && (
            <video
              src={project.video}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover object-center scale-[1.06] origin-center"
            />
          )}
          {project.image && !project.video && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover object-center scale-[1.06] origin-center"
            />
          )}
          {(project.image || project.video) && (
            <div className="absolute inset-0 bg-black/50 transition-colors group-hover:bg-black/30 z-[5]" />
          )}
          {(!project.image && !project.video) && (
            <div
              className="absolute -right-10 -top-10 h-44 w-44 rounded-full blur-3xl"
              style={{ background: project.accentColor, opacity: 0.35 }}
            />
          )}
          <span className="relative z-10 p-4 text-xl font-black uppercase tracking-tight text-white/90 sm:p-6 sm:text-2xl md:text-3xl drop-shadow-md" style={SYNE}>
            {project.tag}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
});

export function ProjectsParallax() {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section id="projects" className="relative w-full bg-background px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-24 border-t border-border/50">
      <header className="mx-auto mb-10 max-w-7xl md:mb-12">
        <ScrollFloat containerClassName="text-foreground" textClassName="text-foreground">
          Selected AI projects and production systems
        </ScrollFloat>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-16 sm:gap-20 md:gap-0">
        {featuredProjects.map((project, index) => (
          <ProjectRow key={project.title} project={project} index={index} />
        ))}
      </div>

      {/* View More */}
      <div className="mx-auto mt-14 flex max-w-7xl justify-center md:mt-16">
        <Link
          href="/projects"
          prefetch={true}
          className="group relative inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/50 border border-white text-white hover:bg-white/10 backdrop-blur-md transition-colors cursor-pointer no-underline"
        >
          <span className="font-medium text-sm">View More</span>
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
