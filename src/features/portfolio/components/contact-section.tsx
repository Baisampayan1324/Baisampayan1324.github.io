"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ScrollFloat from "@/components/ui/scroll-float";
import { socials } from "../constants/portfolio-data";
import styles from "./contact-section.module.css";

const MAX = 500;

// Animated flowing line-art background (24 paths, animated draw + offset).
function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <svg
      className="absolute inset-0 w-full h-full text-foreground"
      viewBox="0 0 696 316"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
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
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Spam honeypot — bots fill this hidden field; humans never see it.
  const [botcheck, setBotcheck] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => setIsVisible(entries[0]?.isIntersecting ?? false),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSend = name.trim() !== "" && emailValid && message.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) {
      setStatus("Fill in your name, a valid email, and a message.");
      return;
    }
    if (botcheck) return; // honeypot tripped — silently drop

    setSubmitting(true);
    setStatus("Sending…");
    try {
      // FormSubmit.co (activated, masked alias — keeps the email out of the
      // client). AJAX form of the alias is /ajax/<token> (no "el/" prefix).
      const res = await fetch("https://formsubmit.co/ajax/mobago", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio contact from ${name}`,
          _template: "table",
          _captcha: "false",
          _honey: botcheck, // server-side honeypot
        }),
      });
      const data = await res.json();
      // FormSubmit returns success as a boolean true or the string "true".
      if (data.success === true || data.success === "true") {
        setStatus("Message sent — I'll get back to you soon. ✓");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus(data.message || "Something went wrong. Please email me directly.");
      }
    } catch {
      setStatus("Network error. Please email me directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      ref={ref}
      id="contact"
      className={`${styles.contactSectionWrapper} relative w-full overflow-x-clip bg-background text-foreground border-t border-border/50`}
    >
      {/* Cinematic animated background (aurora + grid) */}
      <div className={styles.contactAurora} aria-hidden />
      <div className={styles.contactGrid} aria-hidden />

      {/* Animated flowing line-art — bleeds a little above the section top */}
      {isVisible && (
        <div className="hidden md:block absolute inset-x-0 -top-[14vh] bottom-0 z-0 pointer-events-none" aria-hidden>
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      )}

      {/* Diagonal scrolling marquee */}
      <div className="relative z-10 mt-12 sm:mt-14 w-full overflow-hidden border-y border-border/50 bg-background/60 backdrop-blur-md py-4 -rotate-1 sm:-rotate-2 scale-[1.05] sm:scale-110 shadow-2xl">
        <div className={`${styles.contactMarqueeTrack} flex w-max text-xs sm:text-sm font-bold tracking-[0.3em] text-muted-foreground uppercase`}>
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
          {/* LEFT: heading, social links */}
          <div>
            <ScrollFloat containerClassName="text-foreground mb-5" textClassName="text-foreground">
              Let&apos;s Connect
            </ScrollFloat>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Always open to new opportunities and interesting builds.
              If you have a project in mind or want to say hi, send a message.
            </p>

            <p className="text-muted-foreground text-xs uppercase tracking-widest mt-12 mb-6">
              Or reach me at…
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
          <form onSubmit={handleSubmit} className={`${styles.contactGlass} rounded-2xl p-5 sm:p-6 md:p-10 w-full`} noValidate>
            {/* Honeypot — hidden from users, catches bots */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={botcheck}
              onChange={(e) => setBotcheck(e.target.value)}
              className="hidden"
              aria-hidden
            />
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
                  className={`${styles.contactInput} rounded-lg px-4 py-3 text-sm`}
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
                  className={`${styles.contactInput} rounded-lg px-4 py-3 text-sm`}
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
                className={`${styles.contactTextarea} rounded-lg px-4 py-3 text-sm resize-y`}
                suppressHydrationWarning
              />
              <span className="self-end text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {message.length}/{MAX} characters
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <button
                type="submit"
                disabled={!canSend || submitting}
                className={`lm-btn ${styles.contactSend} inline-flex items-center gap-2 rounded-lg px-7 py-3 text-sm font-bold cursor-pointer`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
                {submitting ? "Sending…" : "Send"}
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
