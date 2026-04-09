import Projects from '@/components/Projects';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function WorksPage() {
  return (
    <main className="bg-white">
      <Navbar />
      <div className="pt-32">
        <Projects />
      </div>
      <Footer />
    </main>
  );
}
