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

  // Default to false as requested by user to hear voice immediately
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [nameSettled, setNameSettled] = useState(true);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);

  // Cycle through job titles
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentJobIndex((prev) => (prev + 1) % jobTitles.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Settle name after SplitText animation completes
  useEffect(() => {
    const timer = setTimeout(() => setNameSettled(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleMuteToggle = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !isMuted;
    v.muted = next;
    v.volume = next ? 0 : 1;
    setIsMuted(next);
    if (!next) void v.play();
  };

  const handlePlayPause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  // Floating control swaps mute -> back-to-top once the About section is reached.
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const about = document.getElementById('about');
    if (!about) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Set pastHero true if the about section is visible or has been scrolled past
        setPastHero(entry.isIntersecting || entry.boundingClientRect.top < 0);
      },
      {
        threshold: 0,
      }
    );

    observer.observe(about);
    return () => observer.disconnect();
  }, []);

  // Auto-mute/unmute and pause/play when entering/leaving the hero section
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (pastHero) {
      v.muted = true;
      try { v.pause(); } catch (_) {}
      setIsMuted(true);
      setIsPlaying(false);
    } else {
      v.muted = false;
      v.volume = 1;
      void v.play().catch(() => {});
      setIsMuted(false);
      setIsPlaying(true);
    }
  }, [pastHero]);

  // Clean up on unmount so audio/video doesn't keep playing in the background
  useEffect(() => {
    return () => {
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.muted = true;
        v.removeAttribute('src');
        v.load();
      }
    };
  }, []);

  const handleBackToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className={styles.hero}>

      {/* ── Background ambient layer (CSS gradient — replaces the second video decode) ── */}
      <div className={styles.bgBlur} aria-hidden="true" />

      {/* ── Main foreground video ── */}
      <video
        ref={videoRef}
        className={styles.mainVideo}
        src="/hero-video.mp4"
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
      />

      {/* ── Cinematic gradient overlays ── */}
      <div className={styles.overlays}>
        <div className={styles.gradLeft} />
        <div className={styles.gradBottom} />
        <div className={styles.gradTop} />
        <div className={styles.gradRight} />
        <div className={styles.vignette} />
      </div>

      {/* ── Top controls bar ── */}
      <div className={styles.controls}>
        <button
          className={`${styles.glassBtn} lm-btn`}
          onClick={handlePlayPause}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="1" width="3.5" height="12" rx="1" fill="currentColor"/>
              <rect x="8.5" y="1" width="3.5" height="12" rx="1" fill="currentColor"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 1.5L12.5 7L3 12.5V1.5Z" fill="currentColor"/>
            </svg>
          )}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          className={`${styles.glassBtn} lm-btn`}
          onClick={handleMuteToggle}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
              <path d="M1 4.5H4L8 1v12L4 9.5H1V4.5Z" fill="currentColor"/>
              <line x1="11" y1="4" x2="15" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="15" y1="4" x2="11" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
              <path d="M1 4.5H4L8 1v12L4 9.5H1V4.5Z" fill="currentColor"/>
              <path d="M11 3.5C12.7 4.8 13.7 6.3 13.7 7S12.7 9.2 11 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M12.5 1.5C14.8 3.2 16 5 16 7s-1.2 3.8-3.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.55"/>
            </svg>
          )}
          <span>{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>
      </div>

      {/* ── Main content overlay ── */}
      <div className={styles.content}>
        <div className={styles.contentInner}>
          <div className="flex flex-col items-start w-fit mx-auto">
            <div className="mb-2 flex whitespace-nowrap" style={{ fontFamily: '"Haglos", sans-serif' }}>
              <SplitText
                text="Baisampayan Dey"
                className="text-7xl md:text-9xl text-yellow-400 drop-shadow-xl"
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
              <a className={`${styles.ctaPrimary} lm-btn`} href="https://drive.google.com/file/d/1upS_7CnuZPbpX3arNF8uatoy7WE7oGWq/view?usp=sharing" target="_blank" rel="noopener noreferrer">
                Curriculum Vitae
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating bottom-right control: back-to-top (from About) */}
      <div className={styles.floatingControls}>
        {pastHero && (
          <button
            className={`${styles.floatBtn} lm-btn`}
            onClick={handleBackToTop}
            aria-label="Back to top"
            title="Back to top"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l7-7 7 7M12 5v14"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── Scroll button (classic mouse indicator) ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 text-white/80">
        <div className="w-[30px] h-[46px] rounded-full border-[1.5px] border-white/60 flex justify-center pt-2.5">
          <div className="w-[8px] h-[8px] rounded-full border-[1.5px] border-white/80 animate-bounce" />
        </div>
        <span className="text-sm font-light tracking-wide">Scroll</span>
      </div>
    </section>
  );
}
