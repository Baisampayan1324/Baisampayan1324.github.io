'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface LoaderScreenProps {
  /** Heavy asset to preload for real progress. */
  preloadSrc?: string;
  /** Minimum time the loader stays on screen (ms). */
  minDuration?: number;
  /** Fired at the ENTER click itself (valid user gesture — unmute audio here). */
  onEnter?: () => void;
  /** Fired after the window has fully opened. */
  onDone?: () => void;
}

const CREAM = '#E1E0CC';
const BUTTER = [0.22, 1, 0.36, 1] as const; // easeOutExpo — silky settle
// Tiny inline blur of loader.webp — paints instantly so the loader is never a
// bare dark screen while the full image decodes.
const LQIP =
  'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAwBACdASoYAA4APu1iqk2ppaQiMAgBMB2JQBOgA4YGw3kim9xtWA2BZMAA/vDfe2P3SbFRttmobLRMAL0QICv1XmzNE91c6aSXkA2MZnEjALV89R/yuk8Z8AA=';

export default function LoaderScreen({
  preloadSrc = '/hero-video.mp4',
  minDuration = 2500,
  onEnter,
  onDone,
}: LoaderScreenProps) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [opening, setOpening] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let realFraction = 0;
    let realDone = false;
    const start = performance.now();

    (async () => {
      try {
        const res = await fetch(preloadSrc);
        const total = Number(res.headers.get('Content-Length')) || 0;
        if (!res.body || !total) {
          await res.blob();
          realFraction = 1;
          realDone = true;
          return;
        }
        const reader = res.body.getReader();
        let loaded = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          loaded += value.length;
          realFraction = Math.min(1, loaded / total);
        }
        realFraction = 1;
        realDone = true;
      } catch {
        realFraction = 1;
        realDone = true;
      }
    })();

    let displayed = 0;
    let raf = 0;
    const tick = (now: number) => {
      if (cancelled) return;
      const timed = Math.min((now - start) / minDuration, 1);
      const cap = realDone && timed >= 1 ? 1 : 0.985;
      const target = Math.min(timed, realFraction * 0.25 + timed * 0.75, cap) * 100;
      displayed += (target - displayed) * 0.18;
      setProgress(displayed);
      if (target >= 100 && displayed > 99.4) {
        setProgress(100);
        setReady(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [preloadSrc, minDuration]);

  // ENTER (valid gesture) → open the window, play the video, then hand off.
  const handleEnter = useCallback(() => {
    if (!ready || doneRef.current) return;
    doneRef.current = true;
    onEnter?.(); // gesture tick — unmute hero audio now
    setOpening(true);
    setTimeout(() => onDone?.(), 520);
  }, [ready, onEnter, onDone]);

  useEffect(() => {
    if (!ready) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ready, handleEnter]);

  const pct = Math.round(progress);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#060608]"
      style={{ color: CREAM, willChange: 'transform' }}
      animate={{ y: opening ? '-100%' : '0%' }}
      transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
    >
      {/* ─── Loader chrome (image + number). The whole panel lifts upward like a
           train window / transparent glass sliding up, revealing the live hero
           underneath — no fake video handoff. ─── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${LQIP}")` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/companies/loader.webp"
          alt=""
          fetchPriority="high"
          decoding="sync"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/75" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* giant countdown, tight in the bottom-right corner */}
        <div className="absolute bottom-0 right-0 leading-none">
          <span
            className="block font-medium leading-none tracking-[-0.04em] tabular-nums"
            style={{ fontFamily: "'Kaisg', sans-serif", fontSize: 'clamp(72px, 16vw, 200px)', color: CREAM }}
          >
            {pct}
          </span>
        </div>

        {/* ENTER — slides up into place the moment loading hits 100 */}
        <AnimatePresence>
          {ready && !opening && (
            <motion.button
              initial={{ y: 60, opacity: 0, x: '-50%' }}
              animate={{ y: 0, opacity: 1, x: '-50%' }}
              exit={{ y: 30, opacity: 0, x: '-50%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onClick={handleEnter}
              aria-label="Enter site"
              className="group absolute bottom-8 left-1/2 z-30 inline-flex items-center gap-2 rounded-full py-1 pl-6 pr-1 text-sm font-medium transition-[gap] hover:gap-3 md:bottom-12"
              style={{ background: CREAM, color: '#060608' }}
            >
              Enter
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CREAM} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* glass bottom edge — the lifting "train window" sheen that rides up with the panel */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/10 via-white/5 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/20" />
    </motion.div>
  );
}
