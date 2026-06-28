import styles from '../../app/styles/NextSection.module.css';
import { AboutHero } from '@/components/sections/about-hero';
import Education from './education';
import { ExperienceStack } from '@/components/sections/experience-stack';
import { ProjectsParallax } from '@/components/sections/projects-parallax';
import { TechnicalArsenal } from './technical-arsenal';

// Thin composer — each section lives in its own file (no inline section markup).
export default function NextSection() {
  return (
    <div className={styles.stack}>
      <AboutHero />
      <Education />
      <ExperienceStack />
      <ProjectsParallax />
      <TechnicalArsenal />
    </div>
  );
}
