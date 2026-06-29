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

  // Must start muted: browsers block autoplay of videos that have sound, which
  // freezes the video on its first frame. We unmute on the first user gesture.
  // Mute is driven via the video ref (DOM property); we only keep the setter to
  // record state for the control logic — the value itself isn't rendered.
  const [, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const hasInteracted = useRef(false);
  const didInit = useRef(false);
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

  const handlePlayPause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      // A button press is a user gesture — safe to turn sound on here too.
      if (!hasInteracted.current && !pastHero) {
        hasInteracted.current = true;
        v.muted = false;
        v.volume = 1;
        setIsMuted(false);
      }
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

  // On mount, autoplay MUTED. Muted autoplay is the only kind every browser
  // permits unconditionally, so the video reliably starts and keeps looping
  // instead of freezing on frame 1 when a sound-on autoplay attempt gets
  // blocked. Sound turns on at the first user gesture (see the unmute effect) —
  // which is required by browser policy no matter what we do here.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Set the muted DOM *property* (not just the attribute) before playing —
    // this is what actually allows autoplay.
    v.muted = true;
    v.defaultMuted = true;
    setIsMuted(true);
    setIsPlaying(true);

    const tryPlay = () => {
      v.muted = !hasInteracted.current;
      v.play().then(() => setIsPlaying(true)).catch(() => {});
    };
    tryPlay();
    // Retry once data is available — on a cold first load `play()` can be called
    // before the video has enough buffered to start.
    v.addEventListener('loadeddata', tryPlay);
    v.addEventListener('canplay', tryPlay);
    return () => {
      v.removeEventListener('loadeddata', tryPlay);
      v.removeEventListener('canplay', tryPlay);
    };
  }, []);

  // Pause/mute when scrolled past the hero, resume when back. Skips the very
  // first run so it doesn't clobber the sound-first attempt above on mount.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!didInit.current) {
      didInit.current = true;
      return;
    }
    if (pastHero) {
      v.muted = true;
      try { v.pause(); } catch (_) {}
      setIsMuted(true);
      setIsPlaying(false);
    } else {
      const muted = !hasInteracted.current;
      v.muted = muted;
      v.volume = muted ? 0 : 1;
      void v.play().catch(() => {});
      setIsMuted(muted);
      setIsPlaying(true);
    }
  }, [pastHero]);

  // Fallback for browsers that blocked sound-on autoplay: turn audio on at the
  // first real user gesture (click/tap/key — scrolling alone doesn't qualify).
  useEffect(() => {
    const unmute = () => {
      if (hasInteracted.current) return;
      const v = videoRef.current;
      if (!v || pastHero) return;
      hasInteracted.current = true;
      v.muted = false;
      v.volume = 1;
      setIsMuted(false);
      // If the browser still rejects sound-on playback (e.g. wheel isn't treated
      // as activation), fall back to muted so the video never freezes silent.
      v.play().catch(() => {
        hasInteracted.current = false;
        v.muted = true;
        setIsMuted(true);
        void v.play().catch(() => {});
      });
    };
    window.addEventListener('pointerdown', unmute);
    window.addEventListener('keydown', unmute);
    window.addEventListener('touchend', unmute);
    window.addEventListener('wheel', unmute, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', unmute);
      window.removeEventListener('keydown', unmute);
      window.removeEventListener('touchend', unmute);
      window.removeEventListener('wheel', unmute);
    };
  }, [pastHero]);

  // Resume when the tab/window regains focus. Opening the CV or a project link
  // in a new tab backgrounds this one, and browsers pause the video; on return
  // nothing restarted it (the scroll-based resume only fires on a pastHero
  // change). Re-play here whenever we're back, visible, and still in the hero.
  useEffect(() => {
    const resume = () => {
      const v = videoRef.current;
      if (!v || pastHero || document.hidden) return;
      if (v.paused) {
        v.muted = !hasInteracted.current;
        void v.play().catch(() => {});
        setIsPlaying(true);
      }
    };
    document.addEventListener('visibilitychange', resume);
    window.addEventListener('focus', resume);
    window.addEventListener('pageshow', resume);
    return () => {
      document.removeEventListener('visibilitychange', resume);
      window.removeEventListener('focus', resume);
      window.removeEventListener('pageshow', resume);
    };
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
      {/* No `autoPlay` / `muted={...}` props here on purpose: React sets `muted`
          as an attribute, not the DOM property, so on first SSR load the browser
          treats this as a sound-on autoplay and blocks it (video freezes on
          frame 1). Muting + playing is driven entirely from the ref below. */}
      <video
        ref={videoRef}
        className={styles.mainVideo}
        src="/hero-video.mp4"
        loop
        playsInline
        preload="auto"
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
      </div>

      {/* ── Main content overlay ── */}
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
              <a className={`${styles.ctaPrimary} lm-btn`} href="https://drive.google.com/file/d/1EuypLMFigJg8yYvp9s5Fo18BxTv2LCvF/view?usp=sharing" target="_blank" rel="noopener noreferrer">
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
