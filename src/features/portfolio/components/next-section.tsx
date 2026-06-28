import styles from './next-section.module.css';
import { AboutHero } from './about-hero';
import Education from './education';
import { ExperienceStack } from './experience-stack';
import { ProjectsParallax } from './projects-parallax';
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
