import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Mic2, 
  ShieldCheck, 
  Database, 
  History, 
  BarChart3, 
  Settings,
  BrainCircuit,
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: MessageSquare, label: 'Live Chat', path: '/dashboard/chat' },
  { icon: Mic2, label: 'Voice Analysis', path: '/dashboard/voice' },
  { icon: ShieldCheck, label: 'AI Supervisor', path: '/dashboard/supervisor' },
  { icon: Database, label: 'Memory Retrieval', path: '/dashboard/memory' },
  { icon: History, label: 'Hindsight Learning', path: '/dashboard/learning' },
  { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

const Sidebar = () => {
  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 flex flex-col z-50">
      {/* Branding Section */}
      <div className="p-8 pb-4 flex items-center gap-4">
        <motion.div 
          whileHover={{ rotate: 10, scale: 1.05 }}
          className="w-12 h-12 rounded-2xl bg-gradient-premium flex items-center justify-center shadow-[0_4px_12px_rgba(30,58,138,0.15)]"
        >
          <BrainCircuit className="text-white w-7 h-7" />
        </motion.div>
        <div>
          <h1 className="text-lg font-black tracking-tight leading-tight">
            <span className="text-[#1E3A8A]">ECHO</span>
            <span className="text-[#D4AF37]">MIND</span>
          </h1>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">AI Intelligence Platform</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mx-6 my-4" />

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pt-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => `
              flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden
              ${isActive 
                ? 'bg-[#1E3A8A] text-white shadow-md border border-[#1E3A8A]/10' 
                : 'text-slate-555 hover:text-[#1E3A8A] hover:bg-[#D4AF37]/10'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 relative z-10 ${isActive ? 'text-[#D4AF37]' : 'text-slate-455 group-hover:text-[#1E3A8A]'}`} />
                <span className={`text-sm font-semibold tracking-wide relative z-10 ${isActive ? 'translate-x-0.5 transition-transform text-white' : ''}`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-[#1E3A8A] pointer-events-none"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="ml-auto w-1.5 h-4 rounded-full bg-[#D4AF37] relative z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}

        <div className="mt-8 mb-4">
          <NavLink
            to="/"
            onClick={() => {
              localStorage.removeItem('isAuthenticated');
            }}
            className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300 border border-transparent hover:border-red-200"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-semibold">Exit Platform</span>
          </NavLink>
        </div>
      </nav>

      {/* Footer Status */}
      <div className="p-6">
        <div className="p-5 rounded-[2rem] bg-slate-50 border border-slate-200/80 relative overflow-hidden group hover:border-violet-500/30 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none" />
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-3">Core Status</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-medium">Uptime</span>
              <span className="text-[11px] font-mono text-emerald-600 font-bold">99.9%</span>
            </div>
            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-violet-600"
                initial={{ width: 0 }}
                animate={{ width: "99.9%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">Modules: Nominal</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
