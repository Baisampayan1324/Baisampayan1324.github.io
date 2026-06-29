import * as React from "react";

export type EducationEntry = {
  badge?: string;
  badgeImg?: string;
  degree: string;
  school: string;
  period: string;
  points: { label?: string; text: string }[];
};

export type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  logo: string;
  accent: string;
  points: string[];
};

export type SocialLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export const EMAIL_TO = "baisampayandey1999@gmail.com";

export const jobTitles = [
  "AI/ML Engineer",
  "Python Developer",
  "Full Stack Developer",
  "Software Engineer"
];

export const education: EducationEntry[] = [
  {
    badge: 'PU',
    badgeImg: 'Parul.webp',
    degree: 'Bachelor of Technology in Computer Science & Engineering (Artificial Intelligence)',
    school: 'Parul University',
    period: '2023 — 2026',
    points: [
      { text: 'Pursuing specialized education in Artificial Intelligence with focus on machine learning, deep learning, and intelligent system design' },
      { text: 'Engaging in cutting-edge research and practical applications of AI in real-world scenarios' },
      { label: 'Specializations', text: 'Artificial Intelligence, Machine Learning, Deep Learning, Computer Vision, MEAN Stack Development, High Parallel Computing' },
      { label: 'Key Coursework', text: 'Advanced Algorithms and Data Structures, Neural Networks and Deep Learning, Computer Vision and Image Processing, Natural Language Processing, AI Ethics and Responsible Computing' },
    ],
  },
  {
    badge: 'IMPS',
    badgeImg: 'IMPS.webp',
    degree: 'Diploma in Computer Science',
    school: 'IMPS Polytechnic College',
    period: '2020 — 2023',
    points: [
      { text: 'Established solid foundation in computer science fundamentals including programming, data structures, software engineering, and system design' },
      { text: 'Developed strong analytical thinking and problem-solving skills essential for advanced studies' },
      { label: 'Core Areas', text: 'Programming Fundamentals, Data Structures, Database Systems, Algorithms, Software Engineering, System Analysis' },
      { label: 'Core Competencies', text: 'Object-Oriented Programming (Java, C++), Database Design and Management, Web Technologies (HTML, CSS, JavaScript), Software Development Life Cycle, System Architecture and Design, Project Management Fundamentals' },
    ],
  },
];

export const experiences: Experience[] = [
  {
    role: "AI Developer Intern",
    company: "iWebWala",
    location: "Vadodara",
    period: "Jan 2026 — Apr 2026",
    logo: "iwebwala.webp",
    accent: "#4A90D9",
    points: [
      "Built MailBuddy — an AI-powered email triage platform with multi-category LLM classification and confidence scoring for fully automated inbox management.",
      "Designed stateful agentic AI pipelines using LangGraph with persistent checkpointing and human-in-the-loop (HITL) feedback loops for reliable, auditable workflows.",
    ],
  },
  {
    role: "Q&A Subject Expert (Freelance)",
    company: "Chegg Inc.",
    location: "Remote",
    period: "Apr 2024 — Apr 2026",
    logo: "Chegg.webp",
    accent: "#F59E0B",
    points: [
      "Solved 100+ problems across ML, Python, and DSA — debugged ML pipelines and explained complex concepts with precision and clarity for students worldwide.",
      "Specialized in breaking down advanced topics in programming, data structures, algorithms, and theory of computation through detailed step-by-step solutions.",
    ],
  },
  {
    role: "Data Science Intern",
    company: "Cognifyz Technologies",
    location: "Remote",
    period: "Feb 2025 — Apr 2025",
    logo: "Cognifyz.webp",
    accent: "#10B981",
    points: [
      "Built and evaluated ML models on 20K+ row datasets, improving F1-score by 10% through systematic feature engineering and hyperparameter tuning.",
      "Executed the full end-to-end pipeline — EDA, preprocessing, feature selection, model training, and evaluation — using Python and SQL.",
    ],
  },
];

export const socials: SocialLink[] = [
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
