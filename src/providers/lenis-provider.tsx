'use client';

import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

type LenisContextValue = {
  scrollTo: (target: number | string | HTMLElement, options?: Parameters<Lenis['scrollTo']>[1]) => void;
};

const LenisContext = createContext<LenisContextValue | null>(null);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Skip smooth scroll for users who prefer reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      lerp: prefersReduced ? 1 : 0.11,
      smoothWheel: !prefersReduced,
      // syncTouch removed: causes iOS momentum scroll to fight Lenis, producing stutter on touch
    });

    lenisRef.current = lenis;

    const onScroll = () => {
      ScrollTrigger.update();
    };

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on('scroll', onScroll);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    // Scroll to hash if present in URL (e.g. /#projects). The home page has a
    // heavy hero and tall sections that finish laying out after mount, which
    // shifts the target's position — so a single early scroll lands at the top.
    // We retry over the first ~1.5s and again on window load to land reliably.
    let hashTimers: ReturnType<typeof setTimeout>[] = [];
    let scrollToHash: (() => void) | null = null;
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash;
      scrollToHash = () => {
        const target = document.querySelector(hash);
        if (target) {
          lenis.scrollTo(target as HTMLElement, { immediate: true, force: true });
        }
      };
      hashTimers = [80, 300, 600, 1000, 1500].map((d) => setTimeout(scrollToHash as () => void, d));
      window.addEventListener('load', scrollToHash);
    }

    return () => {
      hashTimers.forEach(clearTimeout);
      if (scrollToHash) window.removeEventListener('load', scrollToHash);
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const value = useMemo<LenisContextValue>(() => ({
    scrollTo: (target, options) => {
      lenisRef.current?.scrollTo(target, options);
    },
  }), []);

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}

export function useLenisScroll() {
  const context = useContext(LenisContext);
  return context;
}
