import VideoIntro from '@/components/sections/video-intro';
import NextSection from '@/components/sections/next-section';
import { ContactSection } from '@/components/sections/contact-section';

export default function Home() {
  return (
    <main>
      <VideoIntro />
      <NextSection />
      <ContactSection />
    </main>
  );
}
