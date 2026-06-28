import { CircularProjects, Project } from "@/components/ui/circular-projects";

const projects: Project[] = [
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
    image: "/companies/aimom.png",
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
    image: "/companies/stress.png",
  },
  {
    title: "DocuMind AI",
    description:
      "Enterprise-grade RAG chat system letting users converse naturally with documents across multiple formats. Features semantic search and automatic multi-LLM failover for high reliability.",
    techStack: "LangChain · Pinecone · GPT-4 · FastAPI · Next.js",
    github: "https://github.com/Baisampayan1324/DocuMind",
    live: "https://doc-u-mind.dev/",
    showGithub: true,
    showLive: true,
    accentColor: "#10B981",
    image: "/companies/documind.png",
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
    image: "/companies/mailbuddy.png",
  },
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
    image: "/companies/twinmind.png",
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
    image: "/companies/ethara.png",
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
    image: "/companies/clinic.png",
  },
];

export default function ProjectsPage() {
  return (
    <main className="w-full bg-black min-h-screen">
      <CircularProjects projects={projects} autoplay={true} />
    </main>
  );
}
