"use client";

import * as React from "react";
import { SplineScene } from "@/components/ui/spline-scene";
import ScrollFloat from "@/components/ui/scroll-float";

const SYNE: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const DM: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif" };

interface AboutHeroProps {
  avatar?: React.ReactNode;
}

export function AboutHero({ avatar }: AboutHeroProps) {
  const [hasBeenVisible, setHasBeenVisible] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Load slightly before it enters viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="relative flex w-full flex-col overflow-hidden bg-background text-foreground md:flex-row md:min-h-screen border-t border-border/50"
    >
      {/* Left: content */}
      <div className="flex w-full flex-col justify-between p-6 sm:p-8 md:w-3/5 md:p-12 lg:p-20">
        <div>
          <div>
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
        </div>
      </div>

      {/* Right: 3D avatar slot */}
      <div
        ref={containerRef}
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
            {hasBeenVisible && (
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full relative z-10"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
