"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import ScrollFloat from "@/components/ui/scroll-float";

const MAX = 500;
const EMAIL_TO = "baisampayandey1999@gmail.com";

const SCOPED_STYLES = `
.contact-section-wrapper {
  font-family: 'Syne', sans-serif;
  --glass-1: color-mix(in oklch, hsl(var(--foreground)) 4%, transparent);
  --glass-2: color-mix(in oklch, hsl(var(--foreground)) 1%, transparent);
  --glass-line: color-mix(in oklch, hsl(var(--foreground)) 10%, transparent);
}

/* ── Animated cinematic background (aurora + grid) ── */
@keyframes contact-breathe {
  0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.45; }
  100% { transform: translate(-50%, -50%) scale(1.12); opacity: 0.85; }
}

.contact-aurora {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 90vw;
  height: 70%;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in oklch, hsl(var(--primary)) 14%, transparent) 0%,
    color-mix(in oklch, hsl(var(--secondary)) 12%, transparent) 40%,
    transparent 70%
  );
  animation: contact-breathe 8s ease-in-out infinite alternate;
}

.contact-grid {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, color-mix(in oklch, hsl(var(--foreground)) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, hsl(var(--foreground)) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
}

.contact-glass {
  background: linear-gradient(145deg, var(--glass-1) 0%, var(--glass-2) 100%);
  border: 1px solid var(--glass-line);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.contact-input,
.contact-textarea {
  font-family: 'DM Sans', sans-serif;
  background: color-mix(in oklch, hsl(var(--background)) 60%, transparent);
  border: 1px solid var(--glass-line);
  color: hsl(var(--foreground));
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.contact-input::placeholder,
.contact-textarea::placeholder {
  color: hsl(var(--muted-foreground));
}

.contact-input:focus,
.contact-textarea:focus {
  outline: none;
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 3px color-mix(in oklch, hsl(var(--primary)) 20%, transparent);
}

.contact-send {
  background: hsl(var(--primary));
  color: #000;
  transition: background 0.25s ease, opacity 0.25s ease;
}
.contact-send:hover:not(:disabled) { background: var(--gold-dark, #917300); }
.contact-send:disabled { opacity: 0.5; cursor: not-allowed; }

.contact-social {
  background: linear-gradient(145deg, var(--glass-1) 0%, var(--glass-2) 100%);
  border: 1px solid var(--glass-line);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: border-color 0.3s ease, color 0.3s ease, background 0.3s ease;
}
.contact-social:hover {
  border-color: color-mix(in oklch, hsl(var(--primary)) 50%, transparent);
  color: hsl(var(--foreground));
}

/* ── Performance + responsive ── */
/* backdrop-filter blur is GPU-heavy; drop on phones, keep solid glass look */
@media (max-width: 768px) {
  .contact-glass,
  .contact-social {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: color-mix(in oklch, hsl(var(--foreground)) 4%, transparent);
  }
  .contact-aurora { filter: blur(50px); width: 120vw; }
}

/* ── Diagonal scrolling marquee (from the old footer) ── */
@keyframes contact-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.contact-marquee-track {
  animation: contact-marquee 40s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .contact-aurora { animation: none; opacity: 0.5; }
  .contact-marquee-track { animation: none; }
}
`;

type SocialLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const socials: SocialLink[] = [
  {
    label: "Email",
    href: `mailto:${EMAIL_TO}`,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
  {
    label: "Discord",
    // TODO: replace with real Discord invite / profile
    href: "#",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/Baisampayan1324",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/baisampayan-dey-91ba89347/",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    label: "Medium",
    href: "https://medium.com/@baisampayandey1999/activity",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42S20.96 8.46 20.96 12zM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
  },
];

// Animated flowing line-art background (integrated alongside aurora + grid)
function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <svg className="absolute inset-0 w-full h-full text-foreground" viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMid slice">
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          strokeOpacity={0.05 + path.id * 0.018}
          initial={{ pathLength: 0.3, opacity: 0.5 }}
          animate={{ pathLength: 1, opacity: [0.2, 0.45, 0.2], pathOffset: [0, 1, 0] }}
          transition={{ duration: 20 + Math.random() * 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      ))}
    </svg>
  );
}

const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>AI / ML Engineer</span> <span className="text-primary/60">✦</span>
    <span>RAG &amp; LLM Systems</span> <span className="text-secondary/60">✦</span>
    <span>Production ML</span> <span className="text-primary/60">✦</span>
    <span>Data Pipelines</span> <span className="text-secondary/60">✦</span>
    <span>Open to Opportunities</span> <span className="text-primary/60">✦</span>
  </div>
);

// Letters flip up on hover, revealing a gold copy underneath
function FlipLink({ children, href }: { children: string; href: string }) {
  const ext = href.startsWith("http");
  const letters = children.split("");
  return (
    <a
      href={href}
      target={ext ? "_blank" : undefined}
      rel={ext ? "noreferrer" : undefined}
      className="group relative block overflow-hidden whitespace-nowrap text-xl font-black uppercase text-foreground sm:text-2xl md:text-3xl cursor-pointer"
      style={{ lineHeight: 0.9, fontFamily: "'Syne', sans-serif" }}
    >
      <div className="flex">
        {letters.map((letter, i) => (
          <span
            key={i}
            className="inline-block transition-transform duration-300 ease-in-out group-hover:-translate-y-[110%]"
            style={{ transitionDelay: `${i * 25}ms` }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className="absolute inset-0 flex text-primary">
        {letters.map((letter, i) => (
          <span
            key={i}
            className="inline-block translate-y-[110%] transition-transform duration-300 ease-in-out group-hover:translate-y-0"
            style={{ transitionDelay: `${i * 25}ms` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </a>
  );
}

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSend = name.trim() !== "" && emailValid && message.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) {
      setStatus("Fill in your name, a valid email, and a message.");
      return;
    }
    // No backend wired — open the user's mail client with a prefilled draft.
    // Swap this for a fetch() to Formspree / a Next API route when ready.
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${EMAIL_TO}?subject=${subject}&body=${body}`;
    setStatus("Opening your mail app…");
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="contact-section-wrapper relative w-full overflow-x-clip bg-background text-foreground border-t border-border/50"
    >
      <style dangerouslySetInnerHTML={{ __html: SCOPED_STYLES }} />

      {/* Cinematic animated background (aurora + grid + flowing paths) */}
      <div className="contact-aurora" aria-hidden />
      <div className="contact-grid" aria-hidden />
      {/* paths bleed a little above the section top */}
      <div className="hidden md:block absolute inset-x-0 -top-[14vh] bottom-0 z-0 pointer-events-none" aria-hidden>
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* Diagonal scrolling marquee (shifted in from the old footer) */}
      <div className="relative z-10 mt-12 sm:mt-14 w-full overflow-hidden border-y border-border/50 bg-background/60 backdrop-blur-md py-4 -rotate-1 sm:-rotate-2 scale-[1.05] sm:scale-110 shadow-2xl">
        <div className="contact-marquee-track flex w-max text-xs sm:text-sm font-bold tracking-[0.3em] text-muted-foreground uppercase">
          <MarqueeItem />
          <MarqueeItem />
        </div>
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-14 sm:py-20 md:py-28"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="grid items-start gap-10 sm:gap-12 lg:gap-20 md:grid-cols-2">
          {/* LEFT: media — heading, intro, social flip links */}
          <div>
            <ScrollFloat containerClassName="text-foreground mb-5" textClassName="text-foreground">
              Let&apos;s Connect
            </ScrollFloat>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              I&apos;m always eager to explore new opportunities and take on exciting projects.
              If you have a project in mind, or just want to say hi, feel free to send me a message.
            </p>

            <p className="text-muted-foreground text-xs uppercase tracking-widest mt-12 mb-6">
              Or contact me with…
            </p>
            <div className="flex flex-col items-start gap-4">
              {socials.map((s) => (
                <div key={s.label} className="w-full">
                  <FlipLink href={s.href}>{s.label}</FlipLink>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: form */}
          <form onSubmit={handleSubmit} className="contact-glass rounded-2xl p-5 sm:p-6 md:p-10 w-full" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="cf-name" className="text-xs font-bold uppercase tracking-widest text-foreground">
                Name <span className="text-primary">*</span>
              </label>
              <input
                id="cf-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
                className="contact-input rounded-lg px-4 py-3 text-sm"
                suppressHydrationWarning
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="cf-email" className="text-xs font-bold uppercase tracking-widest text-foreground">
                Email <span className="text-primary">*</span>
              </label>
              <input
                id="cf-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@doe.com"
                required
                className="contact-input rounded-lg px-4 py-3 text-sm"
                suppressHydrationWarning
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <label htmlFor="cf-message" className="text-xs font-bold uppercase tracking-widest text-foreground">
              Message <span className="text-primary">*</span>
            </label>
            <textarea
              id="cf-message"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
              placeholder="Hello there, I would like to ask you about..."
              required
              rows={6}
              maxLength={MAX}
              className="contact-textarea rounded-lg px-4 py-3 text-sm resize-y"
              suppressHydrationWarning
            />
            <span className="self-end text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {message.length}/{MAX} characters
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <button
              type="submit"
              disabled={!canSend}
              className="lm-btn contact-send inline-flex items-center gap-2 rounded-lg px-7 py-3 text-sm font-bold cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
              Send
            </button>
            {status && (
              <span className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {status}
              </span>
            )}
          </div>
          </form>
        </div>

        {/* Bottom bar: centered copyright */}
        <div className="mt-20 pt-8 border-t border-border/40 flex items-center justify-center text-center">
          <span className="text-muted-foreground text-[10px] md:text-xs font-semibold tracking-widest uppercase">
            © 2026 Baisampayan Dey. All rights reserved.
          </span>
        </div>
      </motion.div>
    </section>
  );
}
