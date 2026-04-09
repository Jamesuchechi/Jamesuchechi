import Education from '@/components/Education';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Education | James Uchechi',
  description: 'Academic background and scholastic foundation of James Uchechi.',
};

export default function EducationPage() {
  return (
    <main className="bg-[#07090c]">
      <Navbar />
      <Education />
      <Footer />
    </main>
  );
}
