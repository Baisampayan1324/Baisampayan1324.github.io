import Image from 'next/image';
import FlowArt, { FlowSection } from '@/components/ui/flow-art';
import SideRays from '@/components/ui/SideRays';

const SYNE: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const DM: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif" };

type EducationEntry = {
  badge?: string;
  badgeImg?: string;
  degree: string;
  school: string;
  period: string;
  points: { label?: string; text: string }[];
};

const education: EducationEntry[] = [
  {
    badge: 'PU',
    badgeImg: 'Parul.png',
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
    badgeImg: 'IMPS.png',
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

export default function Education() {
  const total = education.length;

  return (
    <div id="education" className="relative w-full">
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full pointer-events-none mix-blend-screen opacity-70 z-10">
        <SideRays origin="top-right" rayColor1="#FFC000" rayColor2="#ff9900" />
      </div>
      <FlowArt aria-label="Education timeline">
        {education.map((entry, i) => (
          <FlowSection
            key={entry.school}
            aria-label={entry.school}
            style={{
              background:
                i % 2 === 0
                  ? 'radial-gradient(120% 80% at 0% 100%, #14161d 0%, #050505 60%)'
                  : 'radial-gradient(120% 80% at 100% 100%, #15130d 0%, #050505 60%)',
            }}
          >
            {/* Top row: section label + index */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary" style={SYNE}>
                Education
              </p>
              <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground" style={SYNE}>
                {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </p>
            </div>

            {/* Bottom: the card + watermark */}
            <div className="relative">
              <span
                className="pointer-events-none absolute -top-[14vw] left-0 select-none text-[14vw] font-black uppercase leading-none tracking-tighter text-white/[0.04]"
                style={SYNE}
                aria-hidden
              >
                {entry.badge}
              </span>

              <article className="relative max-w-3xl rounded-2xl border border-white/10 bg-[#16181f]/90 p-8 md:p-12 backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white p-2">
                    {entry.badgeImg ? (
                      <Image
                        src={`/companies/${entry.badgeImg}`}
                        alt={`${entry.school} logo`}
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <span className="text-sm font-bold text-black" style={SYNE}>{entry.badge}</span>
                    )}
                  </span>
                  <span className="text-sm tracking-wider text-muted-foreground" style={{ fontFamily: 'monospace' }}>
                    {entry.period}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[#FFC000]" style={SYNE}>
                  {entry.degree}
                </h3>
                <p className="mt-2 text-base font-semibold text-foreground" style={SYNE}>
                  {entry.school}
                </p>

                <ul className="mt-6 grid gap-4">
                  {entry.points.map((p, j) => (
                    <li key={j} className="relative pl-6 text-sm leading-relaxed text-muted-foreground" style={DM}>
                      <span className="absolute left-0 top-[9px] h-1.5 w-1.5 rotate-45 bg-primary" aria-hidden />
                      {p.label && <strong className="font-bold text-foreground">{p.label}: </strong>}
                      {p.text}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </FlowSection>
        ))}
      </FlowArt>
    </div>
  );
}
