import React, { useEffect, useState } from 'react';
import { Search, Bell, User, Flame, Zap, Database, ShieldAlert, Cpu, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [activeTheme, setActiveTheme] = useState('purple');

  const handleThemeChange = (theme) => {
    setActiveTheme(theme);
    const root = document.documentElement;
    if (theme === 'purple') {
      root.style.setProperty('--primary', '139, 92, 246');
      root.style.setProperty('--secondary', '6, 182, 212');
      root.style.setProperty('--accent', '16, 185, 129');
    } else if (theme === 'cyan') {
      root.style.setProperty('--primary', '6, 182, 212');
      root.style.setProperty('--secondary', '59, 130, 246');
      root.style.setProperty('--accent', '236, 72, 153');
    } else if (theme === 'green') {
      root.style.setProperty('--primary', '16, 185, 129');
      root.style.setProperty('--secondary', '34, 197, 94');
      root.style.setProperty('--accent', '139, 92, 246');
    } else if (theme === 'amber') {
      root.style.setProperty('--primary', '245, 158, 11');
      root.style.setProperty('--secondary', '249, 115, 22');
      root.style.setProperty('--accent', '239, 68, 68');
    }
  };

  const [engineStates, setEngineStates] = useState({
    emotion: { name: 'Emotion Engine', state: 'ACTIVE', color: 'bg-violet-500', ping: 'bg-violet-400' },
    memory: { name: 'Memory Engine', state: 'ACTIVE', color: 'bg-cyan-500', ping: 'bg-cyan-400' },
    supervisor: { name: 'Supervisor Monitoring', state: 'NOMINAL', color: 'bg-amber-500', ping: 'bg-amber-400' },
    learning: { name: 'Learning Engine', state: 'RUNNING', color: 'bg-emerald-500', ping: 'bg-emerald-400' },
    context: { name: 'Context Retrieval', state: 'ACTIVE', color: 'bg-blue-500', ping: 'bg-blue-400' }
  });

  useEffect(() => {
    const statesMap = {
      emotion: ['ACTIVE', 'SCANNING', 'EVALUATING'],
      memory: ['ACTIVE', 'SEARCHING', 'STANDBY'],
      supervisor: ['NOMINAL', 'VERIFYING', 'MONITORING'],
      learning: ['RUNNING', 'OPTIMIZING', 'IDLE'],
      context: ['ACTIVE', 'BUILDING', 'INJECTING']
    };

    const interval = setInterval(() => {
      // Pick a random engine and change its state
      const engines = Object.keys(statesMap);
      const randomEngine = engines[Math.floor(Math.random() * engines.length)];
      const possibleStates = statesMap[randomEngine];
      const nextState = possibleStates[Math.floor(Math.random() * possibleStates.length)];
      
      setEngineStates(prev => ({
        ...prev,
        [randomEngine]: {
          ...prev[randomEngine],
          state: nextState
        }
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const glowColors = {
    emotion: 'shadow-[0_0_8px_#8b5cf6] bg-violet-400',
    memory: 'shadow-[0_0_8px_#22d3ee] bg-cyan-400',
    supervisor: 'shadow-[0_0_8px_#f59e0b] bg-amber-400',
    learning: 'shadow-[0_0_8px_#10b981] bg-emerald-400',
    context: 'shadow-[0_0_8px_#3b82f6] bg-blue-400'
  };

  return (
    <header className="h-20 fixed top-0 right-0 left-72 bg-white/40 backdrop-blur-3xl border-b border-slate-200/80 z-40 flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search AI parameters..." 
            className="bg-slate-100 border border-slate-200 rounded-2xl pl-11 pr-5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 w-64 transition-all duration-300 focus:w-80 hover:bg-slate-200/50"
          />
        </div>
        
        {/* Global Live Status Bar */}
        <div className="hidden xl:flex items-center gap-3.5 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
          {Object.entries(engineStates).map(([key, info]) => (
            <div key={key} className="flex items-center gap-2.5 px-1 relative group/tooltip cursor-help">
              <span className="relative flex h-2 w-2">
                {info.state !== 'IDLE' && info.state !== 'STANDBY' && (
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${info.ping} ${glowColors[key]}`} />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${info.color} ${glowColors[key]}`} />
              </span>
              <div className="flex flex-col">
                <span className="text-[8px] font-black font-mono text-slate-400 tracking-wider leading-none uppercase">{info.name}</span>
                <span className="text-[9px] font-bold font-mono text-slate-700 leading-normal tracking-wide transition-all duration-300">
                  {info.state}
                </span>
              </div>

              {/* Tooltip */}
              <div className="absolute top-11 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-[9px] font-mono text-slate-800 opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg translate-y-1 group-hover/tooltip:translate-y-0">
                System: <span className="text-violet-600 font-bold">{info.name}</span> • Status: <span className="text-cyan-600 font-bold">{info.state}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 border-r border-slate-200 pr-5">
          {/* Cybernetic Theme Selector */}
          <div className="flex items-center gap-1.5 mr-3 bg-slate-50 border border-slate-200 p-1.5 rounded-xl">
            {[
              { id: 'purple', color: 'bg-[#8b5cf6] border-[#a78bfa]' },
              { id: 'cyan', color: 'bg-[#06b6d4] border-[#67e8f9]' },
              { id: 'green', color: 'bg-[#10b981] border-[#34d399]' },
              { id: 'amber', color: 'bg-[#f59e0b] border-[#fbbf24]' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${t.color} ${
                  activeTheme === t.id ? 'scale-125 ring-2 ring-slate-400' : 'opacity-40 hover:opacity-100 hover:scale-110'
                }`}
                title={`Theme: ${t.id}`}
              />
            ))}
          </div>

          <button className="relative p-2.5 rounded-xl transition-all duration-300 hover:bg-slate-100 group border border-transparent hover:border-slate-200 active:scale-95">
            <Bell className="w-5 h-5 text-slate-400 group-hover:text-slate-800 transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-violet-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(139,92,246,0.3)] animate-pulse" />
          </button>
          
          <button className="p-2.5 rounded-xl transition-all duration-300 hover:bg-slate-100 group border border-transparent hover:border-slate-200 active:scale-95">
            <Flame className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
          </button>
        </div>

        <div className="flex items-center gap-3.5 cursor-pointer group">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-800 leading-none group-hover:text-violet-600 transition-colors">System Admin</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Neural Level 5</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-premium/10 border border-slate-200 flex items-center justify-center overflow-hidden group-hover:border-violet-500/50 group-hover:shadow-md transition-all duration-500 relative">
            <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            <User className="text-slate-400 w-5 h-5 group-hover:text-violet-600 transition-all duration-500 group-hover:scale-110 z-10" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
