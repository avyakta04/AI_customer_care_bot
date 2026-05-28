import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Cpu, 
  Layers, 
  Link2, 
  Sparkles, 
  Database,
  ArrowRight,
  Fingerprint,
  RefreshCcw,
  Zap
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import VectorCard from '../components/VectorCard';

const searchSteps = [
  { icon: Search, label: 'Query Input', color: 'text-white' },
  { icon: Fingerprint, label: 'Embedding (MiniLM)', color: 'text-primary-neon' },
  { icon: Database, label: 'ChromaDB Search', color: 'text-secondary-neon' },
  { icon: Link2, label: 'Context Injection', color: 'text-accent-neon' },
];

const mockMemories = [
  { id: '882A', similarity: 98.4, snippet: "Customer mentioned a specific preference for dark mode in the enterprise dashboard during our October review.", date: "Oct 12, 2025" },
  { id: '119B', similarity: 82.1, snippet: "Reported credential mismatch error. Technical lead noted sync delay with the global auth server.", date: "Jan 04, 2026" },
  { id: '445C', similarity: 76.5, snippet: "Inquired about the Hindsight Learning cycle frequency and requested automated email summaries.", date: "Mar 15, 2026" },
];

const MemoryRetrieval = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [foundMemories, setFoundMemories] = useState([]);

  const startSearch = () => {
    setIsSearching(true);
    setFoundMemories([]);
    setActiveStep(0);
    
    // Simulate pipeline progression
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setActiveStep(step);
      if (step === 3) {
        clearInterval(interval);
        setTimeout(() => {
          setFoundMemories(mockMemories);
          setIsSearching(false);
          setActiveStep(-1);
        }, 1000);
      }
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Semantic Memory Retrieval</h1>
          <p className="text-white/40 mt-1">Visualizing vector similarity and contextual context construction.</p>
        </div>
        <button 
          onClick={startSearch}
          disabled={isSearching}
          className="px-6 py-3 bg-secondary/20 border border-secondary/30 rounded-2xl font-bold text-sm text-secondary-neon hover:bg-secondary/30 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
          RE-GENERATE CONTEXT
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Search Pipeline visualization */}
        <GlassCard className="lg:col-span-8 border-white/5 relative overflow-hidden flex flex-col justify-center min-h-[450px]">
          {/* Animated Background Flow */}
          <div className="absolute inset-0 pointer-events-none z-0">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent)]" />
             {isSearching && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="absolute inset-0"
               >
                 {[...Array(20)].map((_, i) => (
                   <motion.div
                     key={i}
                     initial={{ x: -100, y: Math.random() * 400, opacity: 0 }}
                     animate={{ x: 1200, opacity: [0, 1, 0] }}
                     transition={{ repeat: Infinity, duration: 2 + Math.random() * 2, delay: Math.random() * 2 }}
                     className="absolute w-1 h-1 bg-secondary-neon rounded-full blur-[1px]"
                   />
                 ))}
               </motion.div>
             )}
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center justify-between w-full max-w-4xl px-12 mb-20 relative">
               {searchSteps.map((step, i) => (
                 <React.Fragment key={i}>
                   <div className="flex flex-col items-center gap-4 relative">
                     <motion.div
                       animate={activeStep === i ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
                       className={`w-20 h-20 rounded-[2rem] border flex items-center justify-center transition-all duration-500 ${
                         activeStep >= i ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 opacity-20'
                       }`}
                     >
                       <step.icon className={`w-8 h-8 ${activeStep >= i ? step.color : 'text-white'}`} />
                     </motion.div>
                     <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all absolute top-24 whitespace-nowrap ${
                       activeStep >= i ? 'text-white/80' : 'text-white/10'
                     }`}>
                       {step.label}
                     </span>
                     {activeStep === i && (
                       <motion.div 
                         layoutId="step-glow"
                         className="absolute inset-0 -m-2 border-2 border-secondary/20 rounded-[2.5rem] blur-sm animate-pulse"
                       />
                     )}
                   </div>
                   {i < searchSteps.length - 1 && (
                     <div className="flex-1 px-4 mb-4">
                        <div className="h-px bg-gradient-to-r from-white/10 via-white/5 to-white/10 w-full relative">
                           {activeStep >= i && (
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: '100%' }}
                               transition={{ duration: 1.2 }}
                               className="absolute inset-0 bg-secondary-neon shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                             />
                           )}
                        </div>
                     </div>
                   )}
                 </React.Fragment>
               ))}
            </div>

            <div className="text-center max-w-2xl">
               <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">Execution Log</h3>
               <div className="bg-black/20 p-6 rounded-2xl border border-white/5 font-mono text-left space-y-3">
                 <p className="text-xs text-secondary-neon/60 flex gap-2">
                   <span className="text-white/20 font-bold">14:30:05</span>
                   <span className="text-white/40">{">>"}</span>
                   <span>VECTOR_DIMENSIONS: <span className="text-white">384 (all-MiniLM-L6-v2)</span></span>
                 </p>
                 <p className="text-xs text-secondary-neon/60 flex gap-2">
                   <span className="text-white/20 font-bold">14:30:06</span>
                   <span className="text-white/40">{">>"}</span>
                   <span>DB_INDEX_PATH: <span className="text-white">./chroma_persistence/v4</span></span>
                 </p>
                 <AnimatePresence>
                   {activeStep >= 2 && (
                     <motion.p 
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       className="text-xs text-accent-neon flex gap-2"
                     >
                       <span className="text-white/20 font-bold">14:30:07</span>
                       <span className="text-white/40">{">>"}</span>
                       <span>SEMANTIC_HITS: <span className="font-bold underline">3 MATCHES_FOUND</span></span>
                     </motion.p>
                   )}
                 </AnimatePresence>
                 <AnimatePresence>
                   {activeStep === -1 && foundMemories.length > 0 && (
                     <motion.p 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="text-[10px] text-white/20 uppercase tracking-tighter pt-4 border-t border-white/5"
                     >
                       Context ready for AI response generation.
                     </motion.p>
                   )}
                 </AnimatePresence>
               </div>
            </div>
          </div>
        </GlassCard>

        {/* Results Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-3 mb-2 px-2">
            <Layers className="w-5 h-5 text-primary-neon" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Retrieved Contexts</h3>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {foundMemories.length > 0 ? (
                foundMemories.map((mem, i) => (
                  <VectorCard 
                    key={mem.id}
                    id={mem.id}
                    snippet={mem.snippet}
                    similarity={mem.similarity}
                    date={mem.date}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center opacity-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                  <Cpu className="w-12 h-12 mb-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">Awaiting Semantic Search</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {foundMemories.length > 0 && (
            <GlassCard className="border-accent-neon/20 bg-accent/5">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-4 h-4 text-accent-neon" />
                <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Intelligence Summary</h4>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                The retrieved memory provides <span className="text-white font-bold">historical preference context</span> and <span className="text-white font-bold">known technical blockers</span>, allowing the AI to bypass repetitive troubleshooting steps.
              </p>
              <button className="w-full mt-4 py-2 text-[9px] font-bold text-accent-neon border border-accent/20 rounded-lg hover:bg-accent/10 transition-all uppercase tracking-[0.2em]">
                Enhance Response Now
              </button>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryRetrieval;
