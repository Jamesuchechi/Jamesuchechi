'use client';
import { motion } from 'framer-motion';
import { 
  FiBriefcase, 
  FiCpu, 
  FiLayers, 
  FiUser, 
  FiMessageSquare, 
  FiPieChart,
  FiLogOut,
  FiActivity,
  FiMessageCircle,
  FiCheckCircle
} from 'react-icons/fi';

export default function Sidebar({ activeTab, setActiveTab, admin, onLogout }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FiPieChart },
    { id: 'projects', label: 'Projects', icon: FiBriefcase },
    { id: 'skills', label: 'Skills', icon: FiCpu },
    { id: 'services', label: 'Services', icon: FiLayers },
    { id: 'about', label: 'About', icon: FiUser },
    { id: 'testimonials', label: 'Testimonials', icon: FiMessageCircle },
    { id: 'process', label: 'Process', icon: FiCheckCircle },
    { id: 'messages', label: 'Messages', icon: FiMessageSquare },
  ];

  return (
    <div className="w-72 h-screen fixed left-0 top-0 bg-white border-r border-slate-100 flex flex-col z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <FiActivity size={24} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Admin Panel
          </span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-6 bg-indigo-600 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-slate-50">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{admin?.name}</p>
            <p className="text-xs text-slate-500 truncate">{admin?.email}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <FiLogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
