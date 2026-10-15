import Skills from '@/components/Skills';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Skills & Tech Stack | James Uchechi',
  description:
    'Explore the full technical arsenal of James Uchechi — from frontend frameworks to cloud infrastructure and everything in between.',
  openGraph: {
    title: 'Skills & Tech Stack | James Uchechi',
    description:
      'Explore the full technical arsenal of James Uchechi — from frontend frameworks to cloud infrastructure and everything in between.',
  },
};

export default function SkillsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#06070a] text-white pt-24">
        <Skills />
      </main>
      <Footer />
    </>
  );
}
