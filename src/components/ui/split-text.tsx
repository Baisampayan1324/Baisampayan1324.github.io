'use client';

import { useRef, useEffect, useState, type ElementType, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export interface SplitTextProps {
  text?: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines' | 'words, chars';
  from?: Record<string, unknown>;
  to?: Record<string, unknown>;
  threshold?: number;
  rootMargin?: string;
  textAlign?: CSSProperties['textAlign'];
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  overflow?: CSSProperties['overflow'];
  onLetterAnimationComplete?: () => void;
  triggerOnScroll?: boolean;
}

const SplitText = ({
  text = '',
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  overflow = 'visible',
  onLetterAnimationComplete,
  triggerOnScroll = true,
}: SplitTextProps) => {
  const ref = useRef<HTMLElement>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useGSAP(
    () => {
      if (!ref.current || !text) return;
      if (animationCompletedRef.current) return;

      const el = ref.current as HTMLElement & { _rbsplitInstance?: GSAPSplitText };

      if (el._rbsplitInstance) {
        try {
          el._rbsplitInstance.revert();
        } catch (_) {
          /* noop */
        }
        el._rbsplitInstance = undefined;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      let targets: Element[] | undefined;
      const assignTargets = (self: GSAPSplitText) => {
        if (splitType.includes('chars') && self.chars && self.chars.length) targets = self.chars;
        if (!targets && splitType.includes('words') && self.words && self.words.length) targets = self.words;
        if (!targets && splitType.includes('lines') && self.lines && self.lines.length) targets = self.lines;
        if (!targets) targets = self.chars || self.words || self.lines;
      };

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        // @ts-ignore autoSplit is valid in some builds
        autoSplit: splitType === 'lines',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        reduceWhiteSpace: false,
        onSplit: (self: GSAPSplitText) => {
          assignTargets(self);
          if (!targets || !targets.length) return;
          gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              ...(triggerOnScroll && {
                scrollTrigger: {
                  trigger: el,
                  start,
                  once: true,
                  fastScrollEnd: true,
                  anticipatePin: 0.4,
                }
              }),
              onComplete: () => {
                animationCompletedRef.current = true;
                onCompleteRef.current?.();
              },
              force3D: true,
            }
          );
        },
      });

      el._rbsplitInstance = splitInstance;

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === el) st.kill();
        });
        try {
          splitInstance.revert();
        } catch (_) {
          /* noop */
        }
        el._rbsplitInstance = undefined;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        triggerOnScroll,
      ],
      scope: ref,
    }
  );

  const style: CSSProperties = {
    textAlign,
    overflow,
    display: 'inline-block',
    // willChange removed: permanent compositor layer on the hero name after animation completes wastes GPU memory
  };
  const classes = `split-parent ${className}`;
  const Tag = (tag || 'p') as ElementType;

  return (
    <Tag ref={ref} style={style} className={classes}>
      {text}
    </Tag>
  );
};

export default SplitText;
