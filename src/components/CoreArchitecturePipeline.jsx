import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Database, 
  ShieldCheck, 
  History, 
  Cpu, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const nodes = [
  {
    id: 'emotion',
    title: 'ECHOMIND Emotion Engine',
    desc: 'Real-time speech & text tone processing',
    icon: Activity,
    color: 'text-[#1E3A8A]',
    borderColor: 'border-[#1E3A8A]/20',
    glowColor: 'rgba(30, 58, 138, 0.15)',
    states: ['SCANNING_INPUT', 'TREAT_ANALYSIS', 'NOMINAL_STATE'],
  },
  {
    id: 'memory',
    title: 'ECHOMIND Memory Core',
    desc: 'Semantic context lookup via ChromaDB',
    icon: Database,
    color: 'text-[#1E3A8A]',
    borderColor: 'border-[#D4AF37]/20',
    glowColor: 'rgba(212, 175, 55, 0.15)',
    states: ['VECTOR_SEARCH', 'CONTEXT_INJECTION', 'VERIFIED_CACHE'],
  },
  {
    id: 'supervisor',
    title: 'ECHOMIND AI Supervisor',
    desc: 'Hallucination & safety verification layer',
    icon: ShieldCheck,
    color: 'text-[#D4AF37]',
    borderColor: 'border-[#D4AF37]/20',
    glowColor: 'rgba(212, 175, 55, 0.15)',
    states: ['POLICING_SAFETY', 'SYNTAX_CHECK', 'NOMINAL_SECURE'],
  },
  {
    id: 'learning',
    title: 'ECHOMIND Learning Engine',
    desc: 'Offline reinforcement learning optimization',
    icon: History,
    color: 'text-[#D4AF37]',
    borderColor: 'border-[#1E3A8A]/20',
    glowColor: 'rgba(30, 58, 138, 0.15)',
    states: ['COMPILING_WEIGHTS', 'SYNCING_NODES', 'WEIGHTS_NOMINAL'],
  }
];

const CoreArchitecturePipeline = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [nodeStates, setNodeStates] = useState(
    nodes.map(node => node.states[2])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      // Cycle through active steps
      const nextStep = (activeStep + 1) % nodes.length;
      setActiveStep(nextStep);

      // Randomly cycle states for realistic feel
      setNodeStates(prev => {
        const updated = [...prev];
        updated[activeStep] = nodes[activeStep].states[Math.floor(Math.random() * 2)];
        updated[(activeStep - 1 + nodes.length) % nodes.length] = nodes[(activeStep - 1 + nodes.length) % nodes.length].states[2];
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeStep]);

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/70 border border-slate-200/80 relative overflow-hidden shadow-sm backdrop-blur-md">
      {/* Decorative Cyber Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title block */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-xl">
            <Cpu className="w-5 h-5 text-violet-600 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">ECHOMIND System Architecture</h3>
            <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mt-0.5">End-to-End Operating Pipeline</p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[9px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Core Operating System Online
        </div>
      </div>

      {/* Grid of Architectural Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        {nodes.map((node, i) => {
          const Icon = node.icon;
          const isActive = activeStep === i;
          const statusText = nodeStates[i];

          return (
            <React.Fragment key={node.id}>
              <div className="relative group">
                {/* Glowing Aura when active or hovered */}
                <div 
                  className="absolute inset-0 rounded-[2rem] transition-all duration-700 pointer-events-none opacity-0 group-hover:opacity-100"
                  style={{
                    boxShadow: `0 0 30px ${node.glowColor}`,
                    background: `radial-gradient(circle at center, ${node.glowColor.replace('0.15', '0.05')} 0%, transparent 70%)`
                  }}
                />

                {isActive && (
                  <div 
                    className="absolute inset-0 rounded-[2rem] transition-all duration-700 pointer-events-none"
                    style={{
                      boxShadow: `0 0 20px ${node.glowColor}`,
                      border: `1px solid ${node.glowColor.replace('0.15', '0.4')}`
                    }}
                  />
                )}

                <div className={`p-6 rounded-[2rem] border transition-all duration-500 bg-white relative h-full flex flex-col justify-between shadow-sm ${
                  isActive ? 'border-transparent shadow-md scale-[1.01]' : 'border-slate-200/80 hover:border-slate-300'
                }`}>
                  <div>
                    {/* Header: Icon & Pulse Indicator */}
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-3 rounded-2xl bg-slate-50 border border-slate-200/60 ${node.color} shadow-sm transition-transform group-hover:scale-110 duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      {/* Active Node Pulse */}
                      {isActive ? (
                        <span className="relative flex h-2 w-2 mt-2 mr-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-2 mr-1" />
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 tracking-wider uppercase mb-1">{node.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-semibold mb-6">{node.desc}</p>
                  </div>

                  {/* Node State Display */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">STATE</span>
                    <span className={`text-[9px] font-mono font-black uppercase tracking-widest transition-all ${
                      isActive ? node.color + ' animate-pulse' : 'text-slate-600'
                    }`}>
                      {statusText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Glowing Arrow Connection with flow dots between nodes */}
              {i < nodes.length - 1 && (
                <div className="hidden lg:flex items-center justify-center shrink-0 w-0 h-0 relative">
                  <div className="absolute left-[calc(-0.5rem)] z-20 pointer-events-none flex items-center justify-center">
                    <ArrowRight className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-violet-500 scale-125' : 'text-slate-300'
                    }`} />
                  </div>
                  {/* Pulse flow animation */}
                  {isActive && (
                    <motion.div 
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 100, opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute h-1.5 w-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)] z-30"
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CoreArchitecturePipeline;
