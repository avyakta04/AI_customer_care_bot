import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingNavbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-850">E-Aware <span className="text-violet-600 font-black">AI</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Workflow', 'Hindsight', 'Analytics'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              {item}
            </a>
          ))}
          <Link 
            to="/login" 
            className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider"
          >
            Sign In
          </Link>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <Link 
            to="/dashboard" 
            className="px-5 py-2.5 bg-violet-600 rounded-xl text-sm font-bold text-white hover:brightness-110 shadow-sm transition-all"
          >
            Launch Dashboard
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-800" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-white/95 border-b border-slate-200 px-6"
      >
        <div className="flex flex-col gap-4 py-8">
          {['Features', 'Workflow', 'Hindsight', 'Analytics'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-lg font-medium text-slate-650"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}
          <Link 
            to="/login" 
            className="mt-4 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-center font-bold text-slate-850 hover:bg-slate-100 transition-all"
            onClick={() => setIsOpen(false)}
          >
            Sign In
          </Link>
          <Link 
            to="/dashboard" 
            className="px-6 py-4 bg-violet-600 rounded-2xl text-center font-bold text-white shadow-sm"
            onClick={() => setIsOpen(false)}
          >
            Launch Dashboard
          </Link>
        </div>
      </motion.div>
    </nav>
  );
};

export default LandingNavbar;
