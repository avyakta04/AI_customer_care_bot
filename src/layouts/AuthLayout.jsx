import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  const [mousePos, setMousePos] = React.useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-inter"
    >
      {/* Dynamic Cursor Spotlight (Behind all content) */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-60"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(30, 58, 138, 0.08) 0%, rgba(212, 175, 55, 0.03) 60%, transparent 100%)`
        }}
      />

      {/* Animated Background Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
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
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none z-0" />

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
              <span className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
                <span className="text-primary-neon">ECHO</span>
                <span className="text-secondary">MIND</span>
              </span>
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mt-1">AI Intelligence Platform</span>
            </div>
          </Link>
        </div>

        {/* Form Container */}
        <div className="p-8 border border-white/10 bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] relative overflow-hidden group transition-all duration-500 hover:border-primary/20 hover:shadow-[0_0_30px_rgba(30,58,138,0.1)]">
           {/* Subtle glass reflection */}
           <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
           
           {/* Form content */}
           <div className="relative z-10">
              {children}
           </div>
        </div>
      </motion.div>

      {/* Floating particles or tech elements */}
      <div className="absolute bottom-10 right-10 flex flex-col items-end opacity-20 hidden md:flex z-10">
         <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Encryption: AES-256-GCM</span>
         <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">System Status: Secure</span>
      </div>
    </div>
  );
};

export default AuthLayout;
