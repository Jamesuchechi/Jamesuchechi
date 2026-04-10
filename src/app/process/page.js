import Process from '@/components/Process';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProcessPage() {
  return (
    <main className="bg-white">
      <Navbar />
      <div className="pt-24">
        <Process />
      </div>
      <Footer />
    </main>
  );
}
