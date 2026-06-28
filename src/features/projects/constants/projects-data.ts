export interface Project {
  title: string;
  tag: string;
  description: string;
  points: string[];
  techStack: string;
  github: string;
  live: string;
  showGithub: boolean;
  showLive: boolean;
  accentColor: string;
  image: string;
  video?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    title: "AI-MOM",
    tag: "AI MOM (Minutes of Meetings)",
    description:
      "Real-time meeting intelligence platform that transcribes and summarises conversations with advanced speaker diarisation. Leverages concurrent multi-model processing for context-aware alerts.",
    points: [
      "Real-time meeting intelligence platform that transcribes and summarizes conversations with advanced speaker diarization.",
      "Leverages concurrent multi-model processing to deliver comprehensive insights and context-aware alerts.",
    ],
    techStack: "Next.js · Whisper · GPT-4 · WebSockets",
    github: "https://github.com/Baisampayan1324/AI-MOM",
    live: "https://ai-mom-iota.vercel.app/",
    showGithub: true,
    showLive: true,
    accentColor: "#4A90D9",
    image: "/companies/aimom.png",
    video: "/companies/ai-mom.mp4",
    featured: true,
  },
  {
    title: "Stress Analysis AI",
    tag: "Stress Analysis",
    description:
      "Full-stack AI application combining machine learning with large language models for personalised stress assessments. Delivers real-time analytics and intelligent counselling recommendations.",
    points: [
      "Full-stack AI application combining machine learning with large language models to provide personalized stress assessments.",
      "Delivers real-time analytics and intelligent counseling recommendations to help users manage their well-being effectively.",
    ],
    techStack: "Python · scikit-learn · LangChain · FastAPI · React",
    github: "https://github.com/Baisampayan1324/Stress-Analysis-AI-System",
    live: "https://stress-compass-ai.vercel.app/",
    showGithub: true,
    showLive: true,
    accentColor: "#7C3AED",
    image: "/companies/stress.png",
    featured: true,
  },
  {
    title: "DocuMind AI",
    tag: "DocuMind AI",
    description:
      "Enterprise-grade RAG chat system letting users converse naturally with documents across multiple formats. Features semantic search and automatic multi-LLM failover for high reliability.",
    points: [
      "Enterprise-grade RAG chat system allowing users to converse naturally with their documents across multiple formats.",
      "Features semantic search and an automatic multi-LLM failover mechanism for high reliability and accurate source citations.",
    ],
    techStack: "LangChain · Pinecone · GPT-4 · FastAPI · Next.js",
    github: "https://github.com/Baisampayan1324/DocuMind",
    live: "https://doc-u-mind.dev/",
    showGithub: true,
    showLive: true,
    accentColor: "#10B981",
    image: "/companies/documind.png",
    featured: true,
  },
  {
    title: "MailBuddy",
    tag: "MailBuddy",
    description:
      "High-performance AI email assistant that streamlines inbox triage through intelligent classification and summarisation. Drafts smart, context-aware replies and manages ongoing communications efficiently.",
    points: [
      "High-performance AI email assistant designed to streamline inbox triage through intelligent classification and summarization.",
      "Utilizes an adaptive workflow to draft smart, context-aware replies and manage ongoing communications efficiently.",
    ],
    techStack: "Next.js · OpenAI · Gmail API · Tailwind",
    github: "",
    live: "https://mailbuddy-xi.vercel.app/",
    showGithub: false,
    showLive: true,
    accentColor: "#F59E0B",
    image: "/companies/mailbuddy.png",
    featured: true,
  },
  {
    title: "TwinMind Copilot",
    tag: "TwinMind Copilot",
    description:
      "A real-time AI meeting copilot that transcribes speech and surfaces contextual suggestions. Acts as a continuous streaming chat assistant to enhance decision-making during live conversations.",
    points: [
      "A real-time AI meeting copilot that transcribes speech and surfaces contextual suggestions.",
      "Acts as a continuous streaming chat assistant to enhance decision-making during live conversations.",
    ],
    techStack: "Next.js · Groq · Whisper · Tailwind",
    github: "https://github.com/Baisampayan1324/TwinMind-Live-Copliot",
    live: "https://twinmind-live-copliot.vercel.app/",
    showGithub: true,
    showLive: true,
    accentColor: "#EC4899",
    image: "/companies/twinmind.png",
    featured: false,
  },
  {
    title: "Ethara PM",
    tag: "Ethara PM",
    description:
      "Comprehensive project management web app with role-based access control, secure authentication, and an interactive Kanban board to keep teams organised and productive.",
    points: [
      "Comprehensive project management web app with role-based access control and secure authentication.",
      "Interactive Kanban board interface to keep teams organized, track tasks, and boost daily productivity.",
    ],
    techStack: "Node.js · Express · PostgreSQL · React",
    github: "https://github.com/Baisampayan1324/Ethara-Project-Management",
    live: "#",
    showGithub: true,
    showLive: false,
    accentColor: "#06B6D4",
    image: "/companies/ethara.png",
    featured: false,
  },
  {
    title: "Clinic NL2SQL",
    tag: "Clinic NL2SQL",
    description:
      "Natural Language to SQL chatbot for clinic management — powered by Vanna 2.0 + Groq via FastAPI. Enforces read-only SQL safety rules and returns structured results with Plotly chart payloads.",
    points: [
      "Natural Language to SQL chatbot for clinic management powered by Vanna 2.0 and Groq via FastAPI.",
      "Enforces strict read-only SQL execution rules and returns rich structured results with Plotly chart payloads.",
    ],
    techStack: "Python · FastAPI · Vanna 2.0 · Groq",
    github: "https://github.com/Baisampayan1324/NL2SQL-Clinic",
    live: "#",
    showGithub: true,
    showLive: false,
    accentColor: "#E11D48",
    image: "/companies/clinic.png",
    featured: false,
  },
];
