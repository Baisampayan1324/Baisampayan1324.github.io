'use client';

import { useEffect, useRef, useState } from 'react';
import { useLenisScroll } from '@/components/ui/lenis-provider';
import SplitText from '@/components/ui/split-text';
import FlipText from '@/components/ui/flip-text';
import styles from '../../app/styles/VideoIntro.module.css';

// defensive removal helper to avoid intermittent `removeChild` TypeError
const safeRemove = (el: Element | null) => {
  if (!el) return;
  try {
    if ((el as any).remove) {
      (el as any).remove();
      return;
    }
    const p = el.parentElement;
    if (p && p.contains(el)) p.removeChild(el);
  } catch (err) {
    // swallow intermittent DOM race errors
  }
};

export default function VideoIntro() {
  const lenis = useLenisScroll();
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Default to false as requested by user to hear voice immediately
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [nameSettled, setNameSettled] = useState(true);

  const jobTitles = [
    "AI/ML Engineer",
    "Python Developer",
    "Full Stack Developer",
    "Software Engineer"
  ];
  const [currentJobIndex, setCurrentJobIndex] = useState(0);

  // Cycle through job titles
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentJobIndex((prev) => (prev + 1) % jobTitles.length);
    }, 3000);
    return () => clearInterval(id);
  }, [jobTitles.length]);

  // Settle name after SplitText animation completes
  useEffect(() => {
    const timer = setTimeout(() => setNameSettled(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Remove Next.js DevTools floating button in dev preview if present
  useEffect(() => {
    try {
      const devDiv = document.querySelector("div[data-nextjs-devtools]");
      safeRemove(devDiv);

      const btns = Array.from(document.querySelectorAll('button')) as HTMLButtonElement[];
      btns.forEach((b) => {
        try {
          const txt = (b.textContent || '').trim();
          const aria = (b.getAttribute('aria-label') || '').trim();
          if (txt.includes('Next.js') || txt.includes('Open Next.js Dev Tools') || aria === 'Next.js' || aria === 'N') {
            safeRemove(b);
          }
        } catch (e) {
          /* ignore per-button errors */
        }
      });

      const iframes = Array.from(document.querySelectorAll('iframe')) as HTMLIFrameElement[];
      iframes.forEach((f) => {
        try {
          if (f.src && f.src.includes('next')) safeRemove(f);
        } catch (e) {
          /* ignore */
        }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  // In some dev setups the button gets re-inserted; poll briefly and remove it if found
  useEffect(() => {
    const id = setInterval(() => {
      try {
        let removed = false;
        const devDiv = document.querySelector("div[data-nextjs-devtools]");
        if (devDiv) { safeRemove(devDiv); removed = true; }

        const nodes = Array.from(document.querySelectorAll('button')) as HTMLButtonElement[];
        nodes.forEach((n) => {
          try {
            const t = (n.textContent || '').trim();
            const aria = (n.getAttribute('aria-label') || '').trim();
            if (t.includes('Next.js') || t.includes('Open Next.js Dev Tools') || aria === 'Next.js' || aria === 'N') {
              safeRemove(n); removed = true;
            }
          } catch (e) {
            /* ignore per-button */
          }
        });

        const iframe = Array.from(document.querySelectorAll('iframe')) as HTMLIFrameElement[];
        iframe.forEach((f) => {
          try {
            if (f.src && f.src.includes('next')) { safeRemove(f); removed = true; }
          } catch (e) {
            /* ignore */
          }
        });

        if (removed) {
          clearInterval(id);
        }
      } catch (e) {
        // ignore
      }
    }, 600);
    // stop after 5s to avoid infinite polling
    const stop = setTimeout(() => clearInterval(id), 5000);
    return () => { clearInterval(id); clearTimeout(stop); };
  }, []);

  const handleMuteToggle = () => {
    const v = videoRef.current;
    const bg = bgVideoRef.current;
    if (!v) return;
    const next = !isMuted;
    v.muted = next;
    v.volume = next ? 0 : 1;
    if (bg) bg.muted = true;
    setIsMuted(next);

    if (!next) {
      void v.play();
    }
  };

  const handlePlayPause = () => {
    const v = videoRef.current;
    const bg = bgVideoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      bg?.play();
      setIsPlaying(true);
    } else {
      v.pause();
      bg?.pause();
      setIsPlaying(false);
    }
  };

  // Floating control swaps mute -> back-to-top once the About section is reached.
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const about = document.getElementById('about');
      if (!about) return;
      setPastHero(about.getBoundingClientRect().top <= window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-mute/unmute when entering/leaving the hero section
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (pastHero) {
      // user has scrolled past hero — mute to stop audio
      v.muted = true;
      try { v.pause(); } catch (e) {}
      setIsMuted(true);
      setIsPlaying(false);
    } else {
      // user is in hero — unmute and play
      v.muted = false;
      v.volume = 1;
      void v.play().catch(() => {});
      setIsMuted(false);
      setIsPlaying(true);
    }
  }, [pastHero]);

  // Clean up video on unmount so audio doesn't keep playing in the background
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

      {/* ── Background ambient blur layer ── */}
      <div className={styles.bgBlur} aria-hidden="true">
        <video
          ref={bgVideoRef}
          className={styles.bgVideo}
          src="/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>

      {/* ── Main foreground video ── */}
      <video
        ref={videoRef}
        className={styles.mainVideo}
        src="/hero-video.mp4"
        autoPlay
        muted={isMuted}
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
