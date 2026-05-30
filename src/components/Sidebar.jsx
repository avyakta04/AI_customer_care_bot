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
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', color: 'text-cyan-400', activeBg: 'from-cyan-500/[0.08] to-transparent', border: 'border-cyan-500/20' },
  { icon: MessageSquare, label: 'Live Chat', path: '/dashboard/chat', color: 'text-violet-400', activeBg: 'from-violet-500/[0.08] to-transparent', border: 'border-violet-500/20' },
  { icon: Mic2, label: 'Voice Analysis', path: '/dashboard/voice', color: 'text-pink-400', activeBg: 'from-pink-500/[0.08] to-transparent', border: 'border-pink-500/20' },
  { icon: ShieldCheck, label: 'AI Supervisor', path: '/dashboard/supervisor', color: 'text-emerald-400', activeBg: 'from-emerald-500/[0.08] to-transparent', border: 'border-emerald-500/20' },
  { icon: Database, label: 'Memory Retrieval', path: '/dashboard/memory', color: 'text-amber-400', activeBg: 'from-amber-500/[0.08] to-transparent', border: 'border-amber-500/20' },
  { icon: History, label: 'Hindsight Learning', path: '/dashboard/learning', color: 'text-fuchsia-400', activeBg: 'from-fuchsia-500/[0.08] to-transparent', border: 'border-fuchsia-500/20' },
  { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics', color: 'text-sky-400', activeBg: 'from-sky-500/[0.08] to-transparent', border: 'border-sky-500/20' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings', color: 'text-slate-400', activeBg: 'from-slate-500/[0.08] to-transparent', border: 'border-slate-500/20' },
];

const Sidebar = () => {
  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-slate-950/40 backdrop-blur-3xl border-r border-white/[0.08] flex flex-col z-50">
      {/* Branding Section */}
      <div className="p-8 pb-4 flex items-center gap-4">
        <motion.div 
          whileHover={{ rotate: 10, scale: 1.05 }}
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        >
          <BrainCircuit className="text-white w-7 h-7" />
        </motion.div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-white leading-tight">NEURA</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">ENTERPRISE v4.0</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-6 my-4" />

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pt-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => `
              flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-500 group relative overflow-hidden
              ${isActive 
                ? `bg-gradient-to-r ${item.activeBg} text-white border ${item.border} shadow-[0_0_15px_rgba(255,255,255,0.02)]` 
                : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${isActive ? item.color : 'text-white/40'}`} />
                <span className={`text-sm font-semibold tracking-wide ${isActive ? 'translate-x-0.5 transition-transform' : ''}`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-bg"
                    className={`absolute inset-0 bg-gradient-to-r ${item.activeBg} pointer-events-none`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className={`ml-auto w-1 h-4 rounded-full bg-gradient-to-b from-white/30 to-white/10`}
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
            className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-white/40 hover:text-white/80 hover:bg-red-500/10 transition-all duration-300 border border-transparent hover:border-red-500/20"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-semibold">Exit Platform</span>
          </NavLink>
        </div>
      </nav>

      {/* Footer Status */}
      <div className="p-6">
        <div className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:border-violet-500/30 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none" />
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mb-3">Core Status</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/60 font-medium">Uptime</span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">99.9%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-violet-500"
                initial={{ width: 0 }}
                animate={{ width: "99.9%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase">Modules: Nominal</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
