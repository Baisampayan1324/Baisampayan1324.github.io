import VideoIntro from '@/features/portfolio/components/video-intro';
import NextSection from '@/features/portfolio/components/next-section';
import { ContactSection } from '@/features/portfolio/components/contact-section';

export default function Home() {
  return (
    <main>
      <VideoIntro />
      <NextSection />
      <ContactSection />
    </main>
  );
}
