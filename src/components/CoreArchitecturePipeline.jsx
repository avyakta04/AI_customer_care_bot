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
    title: 'Emotion Detection Engine',
    desc: 'Real-time speech & text tone processing',
    icon: Activity,
    color: 'text-violet-400',
    borderColor: 'border-violet-500/30',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    states: ['SCANNING_INPUT', 'TREAT_ANALYSIS', 'NOMINAL_STATE'],
  },
  {
    id: 'memory',
    title: 'Vector Memory Retrieval',
    desc: 'Semantic context lookup via ChromaDB',
    icon: Database,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    states: ['VECTOR_SEARCH', 'CONTEXT_INJECTION', 'VERIFIED_CACHE'],
  },
  {
    id: 'supervisor',
    title: 'AI Supervisor Shield',
    desc: 'Hallucination & safety verification layer',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    states: ['POLICING_SAFETY', 'SYNTAX_CHECK', 'NOMINAL_SECURE'],
  },
  {
    id: 'learning',
    title: 'Hindsight Learning Core',
    desc: 'Offline reinforcement learning optimization',
    icon: History,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    glowColor: 'rgba(245, 158, 11, 0.4)',
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
    <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] relative overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
      {/* Decorative Cyber Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title block */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-xl">
            <Cpu className="w-5 h-5 text-violet-400 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Neural System Architecture</h3>
            <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mt-0.5">End-to-End Operating Pipeline</p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
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
                    boxShadow: `0 0 40px ${node.glowColor}`,
                    background: `radial-gradient(circle at center, ${node.glowColor.replace('0.4', '0.03')} 0%, transparent 70%)`
                  }}
                />

                {isActive && (
                  <div 
                    className="absolute inset-0 rounded-[2rem] transition-all duration-700 pointer-events-none"
                    style={{
                      boxShadow: `0 0 30px ${node.glowColor}`,
                      border: `1px solid ${node.glowColor.replace('0.4', '0.6')}`
                    }}
                  />
                )}

                <div className={`p-6 rounded-[2rem] border transition-all duration-500 bg-slate-950/40 backdrop-blur-md relative h-full flex flex-col justify-between ${
                  isActive ? 'border-transparent shadow-2xl' : 'border-white/5 hover:border-white/20'
                }`}>
                  <div>
                    {/* Header: Icon & Pulse Indicator */}
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-3 rounded-2xl bg-white/[0.03] border border-white/5 ${node.color} shadow-lg transition-transform group-hover:scale-110 duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      {/* Active Node Pulse */}
                      {isActive ? (
                        <span className="relative flex h-2 w-2 mt-2 mr-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10 mt-2 mr-1" />
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-1">{node.title}</h4>
                    <p className="text-[10px] text-white/40 leading-relaxed font-semibold mb-6">{node.desc}</p>
                  </div>

                  {/* Node State Display */}
                  <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
                    <span className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-widest">STATE</span>
                    <span className={`text-[9px] font-mono font-black uppercase tracking-widest transition-all ${
                      isActive ? node.color + ' animate-pulse' : 'text-white/60'
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
                      isActive ? 'text-cyan-400 scale-125' : 'text-white/10'
                    }`} />
                  </div>
                  {/* Pulse flow animation */}
                  {isActive && (
                    <motion.div 
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 100, opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] z-30"
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
