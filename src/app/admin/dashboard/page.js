'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPieChart, FiActivity, FiUsers, FiClock, FiMessageSquare, FiMenu, FiBook } from 'react-icons/fi';
import Sidebar from '@/components/admin/Sidebar';
import ProjectsTab from '@/components/admin/ProjectsTab';
import ExperienceTab from '@/components/admin/ExperienceTab';
import AchievementsTab from '@/components/admin/AchievementsTab';
import BlogTab from '@/components/admin/BlogTab';
import SkillsTab from '@/components/admin/SkillsTab';
import ServicesTab from '@/components/admin/ServicesTab';
import AboutTab from '@/components/admin/AboutTab';
import TestimonialsTab from '@/components/admin/TestimonialsTab';
import ProcessTab from '@/components/admin/ProcessTab';
import EducationTab from '@/components/admin/EducationTab';
import FaqTab from '@/components/admin/FaqTab';
import LabTab from '@/components/admin/LabTab';
import MessagesTab from '@/components/admin/MessagesTab';
import VideoTab from '@/components/admin/VideoTab';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';


export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    projects: 0,
    caseStudies: 0,
    education: 0,
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
      const [projects, skills, messages, education] = await Promise.all([
        fetch('/api/projects').then(res => res.json()),
        fetch('/api/skills').then(res => res.json()),
        fetch('/api/contact-messages').then(res => res.json()),
        fetch('/api/education').then(res => res.json())
      ]);

      const caseStudyCount = projects.filter(p => p.problem || p.process || p.outcome).length;
      
      setStats({
        projects: projects.length || 0,
        caseStudies: caseStudyCount,
        education: education.length || 0,
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
    { id: 'overview',     component: OverviewTab },
    { id: 'projects',     component: ProjectsTab },
    { id: 'experience',   component: ExperienceTab },
    { id: 'achievements', component: AchievementsTab },
    { id: 'education',    component: EducationTab },
    { id: 'blog',         component: BlogTab },
    { id: 'skills',       component: SkillsTab },
    { id: 'services',     component: ServicesTab },
    { id: 'process',      component: ProcessTab },
    { id: 'faq',          component: FaqTab },
    { id: 'about',        component: AboutTab },
    { id: 'testimonials', component: TestimonialsTab },
    { id: 'lab',          component: LabTab },
    { id: 'messages',     component: MessagesTab },
    { id: 'video',        component: VideoTab },
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
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard-stats')
      .then(res => res.json())
      .then(data => {
        setChartData(data);
        setChartLoading(false);
      })
      .catch(err => {
        console.error('Error fetching chart data:', err);
        setChartLoading(false);
      });
  }, []);

  const cards = [
    { label: 'Total Projects', value: stats.projects, icon: FiActivity, color: 'indigo' },
    { label: 'Case Studies', value: stats.caseStudies, icon: FiBook, color: 'emerald' },
    { label: 'New Messages', value: stats.messages, icon: FiMessageSquare, color: 'amber' },
    { label: 'Skills Added', value: stats.skills, icon: FiUsers, color: 'purple' },
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

      {/* Analytics Chart */}
      <div className="premium-card p-8 bg-white border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Portfolio Analytics</h3>
            <p className="text-slate-500 text-sm">Tracking visitors, contacts, and activity over the last 30 days</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-xs font-medium text-slate-600">Visitors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-600">Contacts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs font-medium text-slate-600">Projects</span>
            </div>
          </div>
        </div>

        <div className="h-[350px] w-full">
          {chartLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(str) => {
                    const date = new Date(str);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                  minTickGap={30}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ marginBottom: '4px', fontWeight: 'bold', color: '#1e293b' }}
                  labelFormatter={(str) => {
                    const date = new Date(str);
                    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVisitors)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="contacts" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorContacts)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="projects" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorProjects)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
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
