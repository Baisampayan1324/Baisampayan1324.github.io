"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform, useSpring } from "framer-motion";
import ScrollFloat from "@/components/ui/scroll-float";

const DM: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif" };

export function AboutHero() {
  const reduce = useReducedMotion();
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Scroll-linked "curtain": tied to the panel's position in the viewport so it
  // opens as the section scrolls in and closes again as it scrolls out — fully
  // reversible in both directions (no one-shot observer that could stick).
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  // Diagonal curtain: a slanted reveal edge sweeps across. `q` is the sweep
  // position (-20 = fully closed, 120 = fully open); the ±18 offset between the
  // top and bottom x makes the wipe edge a diagonal line, not a vertical one.
  // Closed → open while in view → closed on the way out (reversible).
  const q = useTransform(smooth, [0, 0.32, 0.68, 1], [-20, 120, 120, -20]);
  const clipPath = useTransform(
    q,
    (v) => `polygon(0% 0%, ${v + 18}% 0%, ${v - 18}% 100%, 0% 100%)`
  );

  return (
    <section
      id="about"
      className="relative flex w-full flex-col overflow-hidden bg-background text-foreground md:flex-row md:min-h-screen border-t border-border/50"
    >
      {/* LEFT: About Me only — no logo, no links, no CTA */}
      <div className="flex w-full flex-col justify-center p-6 sm:p-8 md:w-3/5 md:p-12 lg:p-20">
        <ScrollFloat containerClassName="mb-6 sm:mb-8" textClassName="text-foreground">
          About Me
        </ScrollFloat>

        <div className="my-6 h-1 w-16 bg-primary sm:my-7 sm:w-20" />

        <p
          className="mb-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          style={DM}
        >
          Hello! I&apos;m Baisampayan Dey, an AI/ML Developer currently pursuing B.Tech in
          Artificial Intelligence at Parul University, Vadodara, Gujarat. I specialize in
          building end-to-end AI solutions including RAG pipelines, LLM-based applications,
          and real-time inference systems. My passion lies in creating intelligent systems
          that solve complex real-world challenges and deliver production-ready results.
        </p>
        <p
          className="mb-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          style={DM}
        >
          I enjoy taking an idea all the way from research and prototyping to a deployed,
          reliable product — designing data pipelines, fine-tuning models, and wrapping them
          in clean APIs and interfaces. Alongside my AI work, I&apos;ve solved 300+ DSA
          problems and love exploring new tools, frameworks, and ideas. I&apos;m always
          open to collaborating on ambitious projects and learning something new along the way.
        </p>
      </div>

      {/* RIGHT: clip-path reveal holding the photo / waving video */}
      <motion.div
        ref={panelRef}
        className="relative w-full min-h-[340px] sm:min-h-[440px] md:w-2/5 md:min-h-full overflow-hidden bg-gradient-to-br from-primary/15 via-background to-background"
        style={reduce ? undefined : { clipPath }}
      >
        {/* Placeholder for local dev — swap for your waving video later. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/companies/mypic.webp"
          alt="Baisampayan Dey"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </motion.div>
    </section>
  );
}
