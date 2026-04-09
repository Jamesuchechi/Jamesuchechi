import Achievements from '@/components/Achievements';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AchievementsPage() {
  return (
    <main className="bg-[#07090c]">
      <Navbar />
      <Achievements />
      <Footer />
    </main>
  );
}
