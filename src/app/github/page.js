import GitHub from '@/components/GitHub';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'GitHub & Open Source | Okpara James Uchechi',
  description: 'Explore live GitHub telemetry, contribution heatmap, and open-source repositories by Okpara James Uchechi.',
};

export default function GitHubPage() {
  return (
    <main className="bg-[#07090e] min-h-screen text-white">
      <Navbar />
      <div className="pt-20">
        <GitHub />
      </div>
      <Footer />
    </main>
  );
}
