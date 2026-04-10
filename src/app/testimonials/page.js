import Testimonials from '@/components/Testimonials';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TestimonialsPage() {
  return (
    <main className="bg-[#080808]">
      <Navbar />
      <div className="pt-24">
        <Testimonials />
      </div>
      <Footer />
    </main>
  );
}
