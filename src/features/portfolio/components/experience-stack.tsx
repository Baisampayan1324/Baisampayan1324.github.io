"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import ScrollFloat from "@/components/ui/scroll-float";
import { experiences } from "../constants/portfolio-data";

const SYNE: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const DM: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif" };

// --- Custom Hook for Scroll Animation ---
const useScrollAnimation = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
};

// --- Header Component ---
const AnimatedHeader = () => {
  const [headerRef, headerInView] = useScrollAnimation();

  return (
    <header className="mx-auto max-w-4xl px-4 sm:px-6 md:px-12 pt-16 sm:pt-20 md:pt-24 pb-4 mb-8 text-center">
      <div
        ref={headerRef}
        className={`transition-transform duration-700 ease-out ${
          headerInView ? "translate-y-0" : "translate-y-6"
        }`}
      >
        <ScrollFloat containerClassName="text-foreground" textClassName="text-foreground">
          Applied AI &amp; data science experience
        </ScrollFloat>
      </div>
    </header>
  );
};

export function ExperienceStack() {
  return (
    <section id="experience" className="relative w-full bg-background border-t border-border/50">
      <AnimatedHeader />

      {/* The container for the sticky cards */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-12 pb-[15vh]">
        {experiences.map((exp, index) => (
          <div
            key={exp.company}
            // The sticky class makes the card stick to the top of the container.
            className={`w-full relative rounded-2xl p-6 sm:p-8 md:p-12 mb-16 sticky shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:scale-[1.02] ${
              index % 3 === 0 ? "-rotate-1" : index % 3 === 1 ? "rotate-2" : "-rotate-2"
            }`}
            style={{
              top: `calc(150px + ${index * 16}px)`,
              background: `color-mix(in oklch, ${exp.accent} 6%, #16181f)`,
              border: `1px solid color-mix(in oklch, ${exp.accent} 22%, transparent)`,
            }}
          >
            {/* logo + period row */}
            <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white p-2">
                <Image
                  src={`/companies/${exp.logo}`}
                  alt={`${exp.company} logo`}
                  width={40}
                  height={40}
                  loading="lazy"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <span
                className="rounded-full border px-3 py-1 text-xs tracking-wider text-muted-foreground"
                style={{ fontFamily: "monospace", borderColor: `${exp.accent}40` }}
              >
                {exp.period}
              </span>
            </div>

            <h3
              className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight"
              style={{ ...SYNE, color: exp.accent }}
            >
              {exp.role}
            </h3>
            <p className="mt-2 text-base font-semibold text-foreground" style={SYNE}>
              {exp.company}
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                · {exp.location}
              </span>
            </p>

            <ul className="mt-6 grid gap-4">
              {exp.points.map((point, j) => (
                <li
                  key={j}
                  className="relative pl-6 text-sm leading-relaxed text-muted-foreground"
                  style={DM}
                >
                  <span
                    className="absolute left-0 top-[9px] h-1.5 w-1.5 rotate-45"
                    style={{ background: exp.accent }}
                    aria-hidden
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
