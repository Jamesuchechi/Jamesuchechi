import About from '@/components/About';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <main className="bg-white">
      <Navbar />
      <div className="pt-32">
        <About />
      </div>
      <Footer />
    </main>
  );
}
