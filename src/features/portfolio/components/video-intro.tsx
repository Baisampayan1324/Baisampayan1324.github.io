'use client';

import { useEffect, useRef, useState } from 'react';
import { useLenisScroll } from '@/providers/lenis-provider';
import SplitText from '@/components/ui/split-text';
import FlipText from '@/components/ui/flip-text';
import styles from './video-intro.module.css';
import { jobTitles } from '../constants/portfolio-data';

export default function VideoIntro() {
  const lenis = useLenisScroll();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentJobIndex((prev) => (prev + 1) % jobTitles.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // React's muted JSX prop is broken — set DOM property directly
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    // Ensure playing if browser didn't autoplay (e.g. power-save mode)
    if (v.paused) v.play().catch(() => {});
  }, []);

  // Pause video when About section enters view, resume when leaving
  useEffect(() => {
    const about = document.getElementById('about');
    if (!about) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inAbout =
          entry.isIntersecting || entry.boundingClientRect.top < 0;
        setPastHero(inAbout);
        const v = videoRef.current;
        if (!v) return;
        if (inAbout) {
          v.pause();
        } else {
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
        ref={videoRef}
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
