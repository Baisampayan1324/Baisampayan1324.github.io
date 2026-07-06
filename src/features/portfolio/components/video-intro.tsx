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
  const mutedRef = useRef(true);
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
      v.muted = mutedRef.current;
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

  // Play video + audio ONLY while the hero is on screen. Watch the hero
  // section itself (not #about) — otherwise scrolling through Projects/Contact
  // would resume the off-screen video and make audio come and go.
  useEffect(() => {
    const hero = sectionRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inHero = entry.isIntersecting;
        pastHeroRef.current = !inHero;
        setPastHero(!inHero);
        const v = videoRef.current;
        if (!v) return;
        if (inHero) {
          v.muted = mutedRef.current;
          v.play().catch(() => {});
        } else {
          v.pause(); // stops video AND audio when hero leaves view
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Intro loader's ENTER click unmutes the hero (fired within the user gesture).
  // If Chrome refuses the unmute it PAUSES the video (the old freeze bug) — so
  // always fall back to muted playback so the frame never stays stuck.
  useEffect(() => {
    const onEntered = () => {
      const v = videoRef.current;
      mutedRef.current = false;
      sessionStorage.setItem('audioOn', '1');
      if (!v) return;
      v.muted = false;
      v.volume = 1;
      try {
        v.currentTime = 0; // ENTER = fresh start, not wherever muted autoplay was
      } catch {
        /* seek may fail before metadata; harmless */
      }
      const p = v.play();
      if (p)
        p.catch(() => {
          v.muted = true; // unmute blocked → keep it playing muted, no freeze
          v.play().catch(() => {});
        });
    };
    window.addEventListener('intro-entered', onEntered);
    return () => window.removeEventListener('intro-entered', onEntered);
  }, []);

  // Safety net: if the hero video ever pauses while it's still on screen (e.g.
  // Chrome pausing on an unmute), resume it — muted, which is always allowed —
  // so it can never sit frozen on a single frame.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPause = () => {
      if (pastHeroRef.current) return; // intentional pause when hero left view
      const resume = v.play();
      if (resume)
        resume.catch(() => {
          v.muted = true;
          v.play().catch(() => {});
        });
    };
    v.addEventListener('pause', onPause);
    return () => v.removeEventListener('pause', onPause);
  }, []);

  // On refresh the intro is skipped, so ENTER never fires. If this tab already
  // earned audio (clicked ENTER earlier), keep it available: browsers block
  // autoplay-with-sound on reload and unmuting a muted autoplay video with no
  // gesture freezes it — so re-enable sound on the FIRST user gesture instead.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('audioOn') !== '1') return;

    // Any interaction attempts to bring sound back. Only "activation" gestures
    // (click/tap/key/pointerdown) actually let Chrome unmute — move/scroll/wheel
    // get blocked and quietly fall back to muted — so we STAY armed until an
    // unmute truly sticks, and only then remove the listeners.
    const events = ['pointerdown', 'click', 'keydown', 'touchstart', 'wheel', 'scroll', 'mousemove'];
    let done = false;
    let last = 0;

    const tryUnmute = () => {
      if (done) return;
      const now = performance.now();
      if (now - last < 250) return; // throttle: mousemove/scroll fire a lot
      last = now;
      const v = videoRef.current;
      if (!v || pastHeroRef.current) return;
      mutedRef.current = false;
      v.muted = false;
      v.volume = 1;
      const settle = () => {
        if (!v.muted && !v.paused) {
          done = true;
          cleanup(); // sound is actually on — stop listening
        } else {
          v.muted = true; // blocked → keep it playing muted, stay armed
          v.play().catch(() => {});
        }
      };
      const p = v.play();
      if (p) p.then(settle).catch(settle);
      else settle();
    };

    const cleanup = () => events.forEach((e) => window.removeEventListener(e, tryUnmute));
    events.forEach((e) => window.addEventListener(e, tryUnmute, { passive: true }));
    return cleanup;
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
