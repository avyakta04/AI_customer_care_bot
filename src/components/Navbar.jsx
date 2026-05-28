import React from 'react';
import { Search, Bell, User, Flame, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <header className="h-20 fixed top-0 right-0 left-72 bg-background/30 backdrop-blur-md border-b border-white/5 z-40 flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary-neon transition-colors" />
          <input 
            type="text" 
            placeholder="Search AI parameters..." 
            className="bg-white/5 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm text-white/80 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 w-80 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
          <Zap className="w-3 h-3 text-accent-neon fill-accent-neon" />
          <span className="text-[10px] font-bold text-accent-neon uppercase tracking-wider">Live Analysis Active</span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-4 border-r border-white/10 pr-5">
          <button className="relative p-2 rounded-xl transition-colors hover:bg-white/5 group">
            <Bell className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background shadow-[0_0_8px_rgba(139,92,246,1)]" />
          </button>
          
          <button className="p-2 rounded-xl transition-colors hover:bg-white/5 group">
            <Flame className="w-5 h-5 text-white/40 group-hover:text-amber-400 transition-colors" />
          </button>
        </div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-xs font-bold text-white/90 leading-none">System Admin</p>
            <p className="text-[10px] text-white/40 font-medium">Neural Level 5</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-primary/50 transition-colors">
            <User className="text-white/40 w-6 h-6 group-hover:text-primary-neon transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
