import GitHub from '@/components/GitHub';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function GitHubPage() {
  return (
    <main className="bg-[#0a0a0f]">
      <Navbar />
      <div className="pt-24">
        <GitHub />
      </div>
      <Footer />
    </main>
  );
}
