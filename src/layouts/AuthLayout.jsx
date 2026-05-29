import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-inter">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
            rotate: [0, -45, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] bg-secondary/10 blur-[100px] rounded-full"
        />
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Branding */}
        <div className="flex flex-col items-center mb-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl group-hover:border-primary/50 transition-all duration-500 shadow-xl shadow-primary/5">
              <BrainCircuit className="w-8 h-8 text-primary-neon group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white tracking-tighter uppercase leading-none">NEURAL<span className="text-primary-neon">CORE</span></span>
              <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold mt-1">Cognitive Interface v4</span>
            </div>
          </Link>
        </div>

        {/* Form Container */}
        <div className="glass-card p-8 border-white/5 bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden group">
           {/* Subtle glass reflection */}
           <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
           
           {/* Form content */}
           <div className="relative z-10">
              {children}
           </div>
        </div>
      </motion.div>

      {/* Floating particles or tech elements */}
      <div className="absolute bottom-10 right-10 flex flex-col items-end opacity-20 hidden md:flex">
         <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Encryption: AES-256-GCM</span>
         <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">System Status: Secure</span>
      </div>
    </div>
  );
};

export default AuthLayout;
