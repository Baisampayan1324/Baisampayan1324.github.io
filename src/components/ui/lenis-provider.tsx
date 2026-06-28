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

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: true,
      duration: 1.15,
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

    // Scroll to hash if present in URL (e.g. /#projects)
    if (typeof window !== 'undefined' && window.location.hash) {
      setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) {
          lenis.scrollTo(target as HTMLElement, { immediate: true });
        }
      }, 100);
    }

    return () => {
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