"use client";

import * as React from "react";
import { SplineScene } from "@/components/ui/splite";
import ScrollFloat from "@/components/ui/scroll-float";

const SYNE: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const DM: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif" };

interface AboutHeroProps {
  avatar?: React.ReactNode;
}

export function AboutHero({ avatar }: AboutHeroProps) {
  return (
    <section
      id="about"
      className="relative flex w-full flex-col overflow-hidden bg-background text-foreground md:flex-row md:min-h-screen border-t border-border/50"
    >
      {/* Left: content */}
      <div className="flex w-full flex-col justify-between p-6 sm:p-8 md:w-3/5 md:p-12 lg:p-20">
        <div>
          <p
            className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-primary sm:mb-6"
            style={SYNE}
          >
            About Me
          </p>

          <div>
            <ScrollFloat containerClassName="mb-6 sm:mb-8" textClassName="text-foreground">
              AI / ML developer building production ready systems
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
          </div>
        </div>
      </div>

      {/* Right: 3D avatar slot */}
      <div
        className="relative w-full min-h-[300px] sm:min-h-[380px] md:w-2/5 md:min-h-full overflow-hidden p-5 sm:p-8 flex items-center justify-center"
      >
        {avatar ? (
          avatar
        ) : (
          <div className="relative w-full h-[50vw] max-h-[480px] min-h-[260px] sm:h-[60vh] max-w-md bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <div
              className="absolute h-[80%] w-[80%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, color-mix(in oklch, hsl(var(--primary)) 25%, transparent) 0%, color-mix(in oklch, hsl(var(--secondary)) 15%, transparent) 50%, transparent 75%)",
              }}
            />
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full relative z-10"
            />
          </div>
        )}
      </div>
    </section>
  );
}
