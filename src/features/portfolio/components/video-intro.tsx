'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLenisScroll } from '@/providers/lenis-provider';
import SplitText from '@/components/ui/split-text';
import FlipText from '@/components/ui/flip-text';
import styles from './video-intro.module.css';
import { jobTitles } from '../constants/portfolio-data';

export default function VideoIntro() {
  const lenis = useLenisScroll();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const pastHeroRef = useRef(false);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentJobIndex((prev) => (prev + 1) % jobTitles.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Ref callback: set muted as a real DOM property the instant the element
  // attaches — BEFORE first paint. Beats React's broken `muted` JSX prop
  // (set too late, so the browser's autoplay check sees <video autoplay>
  // without muted and blocks it → frozen first frame on production).
  const attachVideo = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (!node) return;
    node.muted = true;
    node.defaultMuted = true;
    node.setAttribute('muted', '');
    node.playsInline = true;
  }, []);

  // Keep the muted video playing. NEVER unmute — Chrome pauses a playing video
  // when it's unmuted without a fresh user gesture, which froze it forever.
  // Muted playback is always allowed, so this just guarantees it runs.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const play = () => {
      if (pastHeroRef.current) return;
      v.muted = true;
      const p = v.play();
      if (p) p.catch(() => {});
    };
    play();
    v.addEventListener('canplay', play);
    const retries = [200, 600, 1500].map((d) => setTimeout(play, d));
    return () => {
      v.removeEventListener('canplay', play);
      retries.forEach(clearTimeout);
    };
  }, []);

  // Pause to save resources only when About is genuinely on screen; resume in
  // hero. Always muted — no audio toggling, no gesture, nothing that can stall.
  useEffect(() => {
    const about = document.getElementById('about');
    if (!about) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inAbout = entry.isIntersecting;
        pastHeroRef.current = inAbout;
        setPastHero(inAbout);
        const v = videoRef.current;
        if (!v) return;
        if (inAbout) {
          v.pause();
        } else {
          v.muted = true;
          v.play().catch(() => {});
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(about);
    return () => observer.disconnect();
  }, []);

  const handleBackToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.bgBlur} aria-hidden="true" />

      <video
        ref={attachVideo}
        className={styles.mainVideo}
        src="/hero-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        suppressHydrationWarning
      />

      <div className={styles.overlays}>
        <div className={styles.gradLeft} />
        <div className={styles.gradBottom} />
        <div className={styles.gradTop} />
        <div className={styles.gradRight} />
        <div className={styles.vignette} />
      </div>

      <div className={styles.content}>
        <div className={styles.contentInner}>
          <div className="flex flex-col items-start w-fit mx-auto">
            <div className="mb-2 flex whitespace-nowrap" style={{ fontFamily: '"Haglos", sans-serif' }}>
              <SplitText
                text="Baisampayan Dey"
                className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-yellow-400 drop-shadow-xl"
                delay={50}
                duration={1.25}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                triggerOnScroll={false}
              />
            </div>
            <div className="mb-8 flex" style={{ fontFamily: '"Deltha", sans-serif' }}>
              <FlipText
                key={currentJobIndex}
                className="text-xl md:text-2xl font-light text-yellow-400 tracking-[0.2em] uppercase opacity-90 drop-shadow-md"
                duration={2.2}
                delay={0.1}
                loop={false}
              >
                {jobTitles[currentJobIndex]}
              </FlipText>
            </div>
            <div className={styles.ctaRow}>
              <a
                className={`${styles.ctaPrimary} lm-btn`}
                href="https://drive.google.com/file/d/1EuypLMFigJg8yYvp9s5Fo18BxTv2LCvF/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
              >
                Curriculum Vitae
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.floatingControls}>
        {pastHero && (
          <button
            className={`${styles.floatBtn} lm-btn`}
            onClick={handleBackToTop}
            aria-label="Back to top"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l7-7 7 7M12 5v14"/>
            </svg>
          </button>
        )}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 text-white/80">
        <div className="w-[30px] h-[46px] rounded-full border-[1.5px] border-white/60 flex justify-center pt-2.5">
          <div className="w-[8px] h-[8px] rounded-full border-[1.5px] border-white/80 animate-bounce" />
        </div>
        <span className="text-sm font-light tracking-wide">Scroll</span>
      </div>
    </section>
  );
}
