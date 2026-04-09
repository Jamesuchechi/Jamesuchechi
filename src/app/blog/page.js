import Blog from '@/components/Blog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BlogPage() {
  return (
    <main className="bg-[#07090c]">
      <Navbar />
      <Blog />
      <Footer />
    </main>
  );
}
