'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import { useLenisScroll } from '@/providers/lenis-provider';

const YELLOW = '#FDE047';
const BUTTER = [0.22, 1, 0.36, 1] as const;

const navItems: { label: string; target: string | number }[] = [
  { label: 'About', target: '#about' },
  { label: 'Major', target: '#education' },
  { label: 'Experience', target: '#experience' },
  { label: 'Projects', target: '#projects' },
  { label: 'Contact', target: '#contact' },
];

export default function SiteNavbar() {
  const lenis = useLenisScroll();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    // Show navbar after scrolling down 80% of the viewport height (past the hero section)
    setIsScrolled(latest > (typeof window !== 'undefined' ? window.innerHeight * 0.8 : 500));
  });

  const go = (target: string | number) => {
    if (lenis) {
      lenis.scrollTo(target as never, { duration: 1.2 });
      return;
    }
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav 
      className="fixed left-1/2 top-0 z-[100]"
      initial={{ y: '-100%', x: '-50%' }}
      animate={{ y: isScrolled ? '0%' : '-100%', x: '-50%' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* pill slices open left → right, then links stagger in */}
      <motion.div
        className="flex max-w-[96vw] items-center gap-3 rounded-b-2xl border border-t-0 border-white/10 bg-black px-4 pb-2.5 pt-3 sm:gap-8 sm:px-6 md:gap-10"
        style={{ willChange: 'clip-path' }}
        initial={{ clipPath: 'inset(0 100% 0 0 round 0px 0px 9999px 9999px)' }}
        animate={{ clipPath: 'inset(0 0% 0 0 round 0px 0px 9999px 9999px)' }}
        transition={{ duration: 0.85, ease: BUTTER, delay: 0.15 }}
      >
        {navItems.map((item, i) => (
          <motion.button
            key={item.label}
            onClick={() => go(item.target)}
            className="cursor-pointer appearance-none whitespace-nowrap border-0 bg-transparent p-0 text-[11px] font-light tracking-wide opacity-80 transition-opacity hover:opacity-100 sm:text-sm"
            style={{ color: YELLOW }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.6 + i * 0.08 }}
          >
            {item.label}
          </motion.button>
        ))}
      </motion.div>
    </motion.nav>
  );
}
