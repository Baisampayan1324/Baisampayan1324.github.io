import VideoIntro from '@/features/portfolio/components/video-intro';
import NextSection from '@/features/portfolio/components/next-section';
import { ContactSection } from '@/features/portfolio/components/contact-section';
import SiteNavbar from '@/features/portfolio/components/site-navbar';

export default function Home() {
  return (
    <main>
      <SiteNavbar />
      <VideoIntro />
      <NextSection />
      <ContactSection />
    </main>
  );
}
