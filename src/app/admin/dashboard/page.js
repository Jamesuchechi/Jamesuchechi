'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPieChart, FiActivity, FiUsers, FiClock, FiMessageSquare, FiMenu } from 'react-icons/fi';
import Sidebar from '@/components/admin/Sidebar';
import ProjectsTab from '@/components/admin/ProjectsTab';
import SkillsTab from '@/components/admin/SkillsTab';
import ServicesTab from '@/components/admin/ServicesTab';
import AboutTab from '@/components/admin/AboutTab';
import TestimonialsTab from '@/components/admin/TestimonialsTab';
import ProcessTab from '@/components/admin/ProcessTab';
import MessagesTab from '@/components/admin/MessagesTab';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    visitorCount: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');

    if (!token || !adminData) {
      router.push('/admin/login');
      return;
    }

    try {
      setAdmin(JSON.parse(adminData));
      fetchStats();
    } catch (error) {
      console.error('Error parsing admin data:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchStats = async () => {
    try {
      const [projects, skills, messages] = await Promise.all([
        fetch('/api/projects').then(res => res.json()),
        fetch('/api/skills').then(res => res.json()),
        fetch('/api/contact-messages').then(res => res.json())
      ]);

      setStats({
        projects: projects.length || 0,
        skills: skills.length || 0,
        messages: messages.length || 0,
        visitorCount: 0 // Fetch from visitor-count API if implemented
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    router.push('/admin/login');
  };

  const tabs = [
    { id: 'overview', component: OverviewTab },
    { id: 'projects', component: ProjectsTab },
    { id: 'skills', component: SkillsTab },
    { id: 'services', component: ServicesTab },
    { id: 'about', component: AboutTab },
    { id: 'testimonials', component: TestimonialsTab },
    { id: 'process', component: ProcessTab },
    { id: 'messages', component: MessagesTab },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!admin) return null;

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || OverviewTab;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false); // Close on mobile after selection
        }} 
        admin={admin} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="lg:pl-72 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 lg:py-10">
          <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-500 hover:text-slate-900 lg:hidden"
              >
                <FiMenu size={24} />
              </button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight capitalize">
                  {activeTab} Management
                </h1>
                <p className="hidden xs:block text-slate-500 mt-1 text-sm lg:text-base">
                  Configure and monitor your portfolio components
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm text-sm font-medium">
                <FiClock className="text-indigo-600" />
                <span className="text-slate-600 hidden sm:inline">Last updated today</span>
                <span className="text-slate-600 sm:hidden">Today</span>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' ? <OverviewTab stats={stats} admin={admin} /> : <ActiveComponent />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function OverviewTab({ stats, admin }) {
  const cards = [
    { label: 'Total Projects', value: stats.projects, icon: FiActivity, color: 'indigo' },
    { label: 'Skills Added', value: stats.skills, icon: FiUsers, color: 'purple' },
    { label: 'New Messages', value: stats.messages, icon: FiMessageSquare, color: 'amber' },
    { label: 'Total Views', value: stats.visitorCount, icon: FiPieChart, color: 'emerald' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card p-6 border border-slate-100 bg-white"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{card.label}</p>
                <h3 className="text-3xl font-bold text-slate-900">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-${card.color}-50 text-${card.color}-600`}>
                <card.icon size={22} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 premium-card p-8 bg-white overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Welcome Back, {admin?.name}!</h3>
            <p className="text-slate-500 mb-6 max-w-md">
              Everything seems to be running smoothly. You have {stats.messages} unread messages waiting for your response.
            </p>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
              Manage Projects
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full -ml-10 -mb-10 blur-2xl opacity-50" />
        </div>

        <div className="premium-card p-8 bg-slate-900 text-white border-0 shadow-xl shadow-slate-200">
          <h3 className="text-lg font-bold mb-4">Quick Shortcuts</h3>
          <div className="space-y-3">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <p className="text-sm font-medium text-white">Add New Project</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <p className="text-sm font-medium text-white">Update Biography</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <p className="text-sm font-medium text-white">View Messages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
