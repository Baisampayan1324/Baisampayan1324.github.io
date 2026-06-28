"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function IconGithub() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.165c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function IconArrowLeft() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

const SYNE: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const DM: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif" };

type ProjectPage = {
  title: string;
  description: string;
  techStack: string;
  github: string;
  live: string;
  showGithub: boolean;
  showLive: boolean;
  accentColor: string;
  leftBgImage: string | null;
  rightBgImage: string | null;
  /** which half shows the text content panel */
  side: "left" | "right";
};

const projectPages: ProjectPage[] = [
  // ── MAIN 4 (from cinematic portfolio) ─────────────────────────────────────
  {
    title: "AI-MOM",
    description:
      "Real-time meeting intelligence platform that transcribes and summarises conversations with advanced speaker diarisation. Leverages concurrent multi-model processing for context-aware alerts.",
    techStack: "Next.js · Whisper · GPT-4 · WebSockets",
    github: "https://github.com/Baisampayan1324/AI-MOM",
    live: "https://ai-mom-iota.vercel.app/",
    showGithub: true,
    showLive: true,
    accentColor: "#4A90D9",
    leftBgImage:
      "/companies/aimom.png",
    rightBgImage: null,
    side: "right",
  },
  {
    title: "Stress Analysis AI",
    description:
      "Full-stack AI application combining machine learning with large language models for personalised stress assessments. Delivers real-time analytics and intelligent counselling recommendations.",
    techStack: "Python · scikit-learn · LangChain · FastAPI · React",
    github: "https://github.com/Baisampayan1324/Stress-Analysis-AI-System",
    live: "https://stress-compass-ai.vercel.app/",
    showGithub: true,
    showLive: true,
    accentColor: "#7C3AED",
    leftBgImage: null,
    rightBgImage: "/companies/stress.png",
    side: "left",
  },
  {
    title: "DocuMind",
    description:
      "Enterprise-grade RAG chat system letting users converse naturally with documents across multiple formats. Features semantic search and automatic multi-LLM failover for high reliability.",
    techStack: "LangChain · Pinecone · GPT-4 · FastAPI · Next.js",
    github: "https://github.com/Baisampayan1324/DocuMind",
    live: "https://doc-u-mind.dev/",
    showGithub: true,
    showLive: true,
    accentColor: "#10B981",
    leftBgImage:
      "/companies/documind.png",
    rightBgImage: null,
    side: "right",
  },
  {
    title: "MailBuddy",
    description:
      "High-performance AI email assistant that streamlines inbox triage through intelligent classification and summarisation. Drafts smart, context-aware replies and manages ongoing communications efficiently.",
    techStack: "Next.js · OpenAI · Gmail API · Tailwind",
    github: "",
    live: "https://mailbuddy-xi.vercel.app/",
    showGithub: false,
    showLive: true,
    accentColor: "#F59E0B",
    leftBgImage: null,
    rightBgImage: "/companies/mailbuddy.png",
    // rightBgImage:
    //   "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=900&auto=format&fit=crop&q=70",
    side: "left",
  },
  // ── ADDITIONAL PROJECTS (GitHub only, no Live) ─────────────────────────────
  {
    title: "TwinMind Copilot",
    description:
      "A real-time AI meeting copilot that transcribes speech and surfaces contextual suggestions. Acts as a continuous streaming chat assistant to enhance decision-making during live conversations.",
    techStack: "Next.js · Groq · Whisper · Tailwind",
    github: "https://github.com/Baisampayan1324/TwinMind-Live-Copliot",
    live: "https://twinmind-live-copliot.vercel.app/",
    showGithub: true,
    showLive: true,
    accentColor: "#EC4899",
    leftBgImage:
      "/companies/twinmind.png",
    rightBgImage: null,
    side: "right",
  },
  {
    title: "Ethara PM",
    description:
      "Comprehensive project management web app with role-based access control, secure authentication, and an interactive Kanban board to keep teams organised and productive.",
    techStack: "Node.js · Express · PostgreSQL · React",
    github: "https://github.com/Baisampayan1324/Ethara-Project-Management",
    live: "#",
    showGithub: true,
    showLive: false,
    accentColor: "#06B6D4",
    leftBgImage: null,
    rightBgImage: "/companies/ethara.png",
    side: "left",
  },
  {
    title: "Clinic NL2SQL",
    description:
      "Natural Language to SQL chatbot for clinic management — powered by Vanna 2.0 + Groq via FastAPI. Enforces read-only SQL safety rules and returns structured results with Plotly chart payloads.",
    techStack: "Python · FastAPI · Vanna 2.0 · Groq",
    github: "https://github.com/Baisampayan1324/NL2SQL-Clinic",
    live: "#",
    showGithub: true,
    showLive: false,
    accentColor: "#E11D48",
    leftBgImage: "/companies/clinic.png",
    rightBgImage: null,
    side: "right",
  },
];

// ── Content Panel ─────────────────────────────────────────────────────────────
function ContentPanel({ project }: { project: ProjectPage }) {
  return (
    <div
      className="flex flex-col items-start justify-center h-full px-10 md:px-16 py-12"
      style={{ background: "rgba(0,0,0,0.75)" }}
    >
      <div
        className="w-12 h-1 mb-6 rounded-full"
        style={{ background: project.accentColor }}
      />
      <span
        className="text-[10px] uppercase tracking-[0.3em] mb-2"
        style={{ color: project.accentColor, ...SYNE }}
      >
      </span>
      <h2
        className="text-3xl md:text-4xl font-extrabold uppercase leading-tight text-white mb-4"
        style={SYNE}
      >
        {project.title}
      </h2>
      <p
        className="text-sm leading-relaxed text-white/70 mb-5 max-w-xs"
        style={DM}
      >
        {project.description}
      </p>
      <p
        className="text-[11px] uppercase tracking-widest mb-8"
        style={{ color: project.accentColor, ...DM }}
      >
        {project.techStack}
      </p>
      <div className="flex flex-wrap gap-3">
        {project.showGithub && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-white/20 bg-white/10 hover:bg-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors"
            style={SYNE}
          >
            <IconGithub /> GitHub
          </a>
        )}
        {project.showLive && (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-90"
            style={{ background: project.accentColor, ...SYNE }}
          >
            <IconExternalLink /> Live
          </a>
        )}
      </div>
    </div>
  );
}

// ── Dot Navigation ────────────────────────────────────────────────────────────
function DotNav({
  total,
  current,
  onClick,
  accentColor,
}: {
  total: number;
  current: number;
  onClick: (i: number) => void;
  accentColor: string;
}) {
  return (
    <div className="absolute right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onClick(i + 1)}
          aria-label={`Go to slide ${i + 1}`}
          className="w-2 h-2 rounded-full border border-white/40 transition-all duration-300"
          style={{
            background: current === i + 1 ? accentColor : "transparent",
            transform: current === i + 1 ? "scale(1.4)" : "scale(1)",
          }}
        />
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ScrollAdventure() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const numOfPages = projectPages.length;
  const animTime = 1500;
  const scrolling = useRef(false);

  const handleWheel = (e: WheelEvent) => {
    if (scrolling.current) return;
    scrolling.current = true;
    if (e.deltaY > 0) {
      setCurrentPage((p) => (p < numOfPages ? p + 1 : p));
    } else {
      setCurrentPage((p) => (p > 1 ? p - 1 : p));
    }
    setTimeout(() => (scrolling.current = false), animTime);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (scrolling.current) return;
    if (e.key === "ArrowDown") {
      scrolling.current = true;
      setCurrentPage((p) => (p < numOfPages ? p + 1 : p));
      setTimeout(() => (scrolling.current = false), animTime);
    } else if (e.key === "ArrowUp") {
      scrolling.current = true;
      setCurrentPage((p) => (p > 1 ? p - 1 : p));
      setTimeout(() => (scrolling.current = false), animTime);
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activePage = projectPages[currentPage - 1];

  return (
    <div className="relative overflow-hidden h-screen bg-black">
      {/* Back button */}
      <button
        onClick={() => router.push('/#projects')}
        className="absolute top-6 left-6 z-50 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white hover:text-white transition-colors cursor-pointer bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-lg hover:bg-black/80"
        style={SYNE}
      >
        <IconArrowLeft />
        Back
      </button>

      {/* Slide counter */}
      <div
        className="absolute top-6 right-14 z-50 text-xs tracking-widest text-white/40"
        style={SYNE}
      >
        <span className="text-white">{String(currentPage).padStart(2, "0")}</span>
        &nbsp;/&nbsp;{String(numOfPages).padStart(2, "0")}
      </div>

      {/* Dot nav */}
      <DotNav
        total={numOfPages}
        current={currentPage}
        onClick={setCurrentPage}
        accentColor={activePage.accentColor}
      />

      {/* Pages */}
      {projectPages.map((page, i) => {
        const idx = i + 1;
        const isActive = currentPage === idx;
        const leftTrans = isActive ? "translateY(0)" : "translateY(100%)";
        const rightTrans = isActive ? "translateY(0)" : "translateY(-100%)";

        return (
          <div key={idx} className="absolute inset-0 pointer-events-none">
            {/* LEFT HALF */}
            <div
              className={`absolute top-0 left-0 w-full md:w-1/2 h-full transition-transform duration-[1500ms] ease-in-out pointer-events-auto ${page.side === "left" ? "z-10 md:z-auto" : "z-0 md:z-auto"}`}
              style={{ transform: leftTrans }}
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={
                  page.leftBgImage
                    ? { backgroundImage: `url(${page.leftBgImage})` }
                    : { background: `linear-gradient(135deg, ${page.accentColor}33 0%, #050505 80%)` }
                }
              >
                {page.side === "left" ? (
                  <ContentPanel project={page} />
                ) : (
                  <div className="flex items-end h-full p-10">
                    <span
                      className="text-5xl md:text-6xl font-black uppercase tracking-tight text-white/80 drop-shadow-lg"
                      style={SYNE}
                    >
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT HALF */}
            <div
              className={`absolute top-0 left-0 md:left-1/2 w-full md:w-1/2 h-full transition-transform duration-[1500ms] ease-in-out pointer-events-auto ${page.side === "right" ? "z-10 md:z-auto" : "z-0 md:z-auto"}`}
              style={{ transform: rightTrans }}
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={
                  page.rightBgImage
                    ? { backgroundImage: `url(${page.rightBgImage})` }
                    : { background: `linear-gradient(225deg, ${page.accentColor}33 0%, #050505 80%)` }
                }
              >
                {page.side === "right" ? (
                  <ContentPanel project={page} />
                ) : (
                  <div className="flex items-end h-full p-10">
                    <span
                      className="text-5xl md:text-6xl font-black uppercase tracking-tight text-white/80 drop-shadow-lg"
                      style={SYNE}
                    >
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Scroll hint – first slide only */}
      {currentPage === 1 && (
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 text-white/80"
          style={SYNE}
        >
          <div className="w-[30px] h-[46px] rounded-full border-[1.5px] border-white/60 flex justify-center pt-2.5">
            <div className="w-[8px] h-[8px] rounded-full border-[1.5px] border-white/80 animate-bounce" />
          </div>
          <span className="text-sm font-light tracking-wide">scroll</span>
        </div>
      )}
    </div>
  );
}
