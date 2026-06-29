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
  const unmutedRef = useRef(false);
  const inAboutRef = useRef(false);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentJobIndex((prev) => (prev + 1) % jobTitles.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Ref callback: set muted as a real DOM property the instant the element
  // attaches — BEFORE first paint. This beats React's broken `muted` JSX prop
  // (which sets the property too late, so the browser's autoplay check sees
  // <video autoplay> without muted and blocks it → frozen first frame on prod).
  const attachVideo = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (!node) return;
    node.muted = true;
    node.defaultMuted = true;
    node.setAttribute('muted', '');
    node.playsInline = true;
  }, []);

  // Force muted autoplay with retries. Muted playback is always permitted, so
  // this reliably un-freezes the video on production. Poll briefly in case the
  // media events already fired before this effect attached (cached video).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const playMuted = () => {
      if (inAboutRef.current) return;
      v.muted = !unmutedRef.current;
      const p = v.play();
      if (p) p.catch(() => {});
    };

    playMuted();
    v.addEventListener('loadeddata', playMuted);
    v.addEventListener('canplay', playMuted);
    // Safety net: retry a few times after mount regardless of events.
    const retries = [100, 400, 1000, 2500].map((d) => setTimeout(playMuted, d));
    return () => {
      v.removeEventListener('loadeddata', playMuted);
      v.removeEventListener('canplay', playMuted);
      retries.forEach(clearTimeout);
    };
  }, []);

  // Audio needs a user gesture (browser policy). The FIRST interaction of any
  // kind — scroll, tap, key — silently unmutes. No button, no badge.
  useEffect(() => {
    const unlock = () => {
      const v = videoRef.current;
      if (!v || unmutedRef.current) return;
      unmutedRef.current = true;
      v.muted = false;
      v.volume = 1;
      if (!inAboutRef.current) v.play().catch(() => {});
      removeAll();
    };
    const removeAll = () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('wheel', unlock);
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('wheel', unlock, { passive: true });
    return removeAll;
  }, []);

  // Stop video + audio when About section is on screen; resume in hero.
  useEffect(() => {
    const about = document.getElementById('about');
    if (!about) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only react to About actually being on screen. Avoid the
        // boundingClientRect.top<0 trick — it can falsely pause at mount when
        // the browser restores a scroll position.
        const inAbout = entry.isIntersecting;
        inAboutRef.current = inAbout;
        setPastHero(inAbout);
        const v = videoRef.current;
        if (!v) return;
        if (inAbout) {
          v.pause();
        } else {
          v.muted = !unmutedRef.current;
          v.play().catch(() => {});
        }
      },
      { threshold: 0 }
    );
    observer.observe(about);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      const v = videoRef.current;
      if (v) { v.pause(); v.muted = true; }
    };
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
