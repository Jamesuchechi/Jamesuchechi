import Services from '@/components/Services';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ServicesPage() {
  return (
    <main className="bg-[#080808]">
      <Navbar />
      <div className="pt-32">
        <Services />
      </div>
      <Footer />
    </main>
  );
}
