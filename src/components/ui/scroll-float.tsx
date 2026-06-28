'use client';

import { useMemo, useRef, type ReactNode, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import './scroll-float.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  scrub?: boolean | number;
}

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ScrollFloat({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'top 85%',
  scrollEnd = 'bottom 15%',
  stagger = 0.03,
  scrub = false,
}: ScrollFloatProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    // Group characters into per-word wrappers. The text span is a wrapping
    // flex row (see CSS), so lines break only between words — never mid-word
    // like "CO / NNECT". Each char stays a `.char` span for the GSAP animation.
    let charIndex = 0;
    const words = text.split(/\s+/).filter(Boolean);
    return words.map((word, wordIndex) => (
      <span className="word" key={`w-${wordIndex}`}>
        {word.split('').map((char) => (
          <span className="char" key={`c-${charIndex++}`}>
            {char}
          </span>
        ))}
      </span>
    ));
  }, [children]);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      // Skip animation; leave chars visible at their final state
      if (prefersReducedMotion) return;

      const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
      const charElements = el.querySelectorAll('.char');

      const tween = gsap.fromTo(
        charElements,
        {
          // No willChange — GSAP promotes layers automatically during animation.
          // Explicit willChange on individual chars creates one compositor layer
          // per character, exhausting GPU memory on mobile.
          opacity: 0,
          yPercent: 120,
          scaleY: 2.3,
          scaleX: 0.7,
          transformOrigin: '50% 0%',
        },
        {
          duration: animationDuration,
          ease,
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: scrollStart,
            end: scrollEnd,
            scrub,
            toggleActions: 'play none none reverse',
          },
        }
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    {
      scope: containerRef,
      dependencies: [
        scrollContainerRef,
        animationDuration,
        ease,
        scrollStart,
        scrollEnd,
        stagger,
        scrub,
        children,
      ],
    }
  );

  return (
    <h2 ref={containerRef} className={`scroll-float ${containerClassName}`}>
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </h2>
  );
}
