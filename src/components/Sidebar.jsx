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
    <aside className="w-72 h-screen fixed left-0 top-0 bg-background/50 backdrop-blur-2xl border-r border-white/10 flex flex-col z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
          <BrainCircuit className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wider uppercase text-white/90">E-Aware Bot</h1>
          <p className="text-[10px] text-primary-neon font-medium leading-none">v4.0 Enterprise</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white/80 transition-all mb-4 border border-transparent hover:border-white/5"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium text-sm">Exit to Website</span>
        </NavLink>

        <div className="h-px bg-white/5 mx-4 mb-4" />

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
              ${isActive 
                ? 'bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white/80'}
            `}
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-medium text-sm">{item.label}</span>
            <motion.div 
              className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.8)]"
              initial={{ opacity: 0 }}
              animate={(isActive) => ({ opacity: isActive ? 1 : 0 })}
            />
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
          <p className="text-xs text-white/40 font-medium mb-2 uppercase tracking-tighter">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-neon animate-pulse" />
            <span className="text-[11px] font-mono text-white/70 tracking-widest">AI CORE: NOMINAL</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
