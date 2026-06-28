"use client";

import * as React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import ScrollFloat from "@/components/ui/scroll-float";
import { socials, EMAIL_TO } from "../constants/portfolio-data";
import styles from "./contact-section.module.css";

const MAX = 500;

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
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${EMAIL_TO}?subject=${subject}&body=${body}`;
    setStatus("Opening your mail app…");
  };

  return (
    <section
      id="contact"
      className={`${styles.contactSectionWrapper} relative w-full overflow-x-clip bg-background text-foreground border-t border-border/50`}
    >
      {/* Cinematic animated background (aurora + grid) */}
      <div className={styles.contactAurora} aria-hidden />
      <div className={styles.contactGrid} aria-hidden />

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
                disabled={!canSend}
                className={`lm-btn ${styles.contactSend} inline-flex items-center gap-2 rounded-lg px-7 py-3 text-sm font-bold cursor-pointer`}
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
