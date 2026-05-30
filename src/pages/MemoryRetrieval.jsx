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
  const [logs, setLogs] = useState([
    { t: "14:30:05", msg: "VECTOR_DIMENSIONS: 384 (all-MiniLM-L6-v2)", type: "info" },
    { t: "14:30:06", msg: "DB_INDEX_PATH: ./chroma_persistence/v4", type: "info" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isSearching) return;
      const messages = [
        "CHROMA_QUERY: select * from cache where similarity > 0.78",
        "SEMANTIC_PARSE: keyword='credential mismatch', weights=loaded",
        "COSINE_SIMILARITY: computing distances for block 0xBF92",
        "VDB_CACHE: cache hit for key_signature '0x-A492'",
        "CONTEXT_COMPACTION: merged 3 memory layers, compression=0.88",
        "INDEX_OPTIMIZER: pruning dead synapses from local registry",
        "NEURAL_EMBEDDING: generated 384 float tensor",
        "METRIC_STORE: query_latency=12ms nodes_scanned=241"
      ];
      const newLog = {
        t: new Date().toLocaleTimeString([], { hour12: false }),
        msg: messages[Math.floor(Math.random() * messages.length)],
        type: Math.random() > 0.85 ? 'warning' : 'info'
      };
      setLogs(prev => [...prev.slice(-6), newLog]);
    }, 2500);
    return () => clearInterval(interval);
  }, [isSearching]);

  const startSearch = () => {
    setIsSearching(true);
    setFoundMemories([]);
    setActiveStep(0);
    
    // Clear and start search logs
    setLogs([
      { t: new Date().toLocaleTimeString([], { hour12: false }), msg: "QUERY_INPUT_RECEIVED: 'credential mismatch dashboard urgent'", type: "info" }
    ]);

    // Simulate pipeline progression
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setActiveStep(step);
      
      const stepMsgs = [
        "GENERATING_EMBEDDING: MiniLM-L6 model initialized",
        "CHROMADB_SCAN: cosine distance similarity metric applied",
        "SEMANTIC_HITS: 3 matches verified",
      ];
      
      setLogs(prev => [...prev, {
        t: new Date().toLocaleTimeString([], { hour12: false }),
        msg: stepMsgs[step - 1] || "PIPELINE_RESOLVED: context injected",
        type: step === 3 ? "success" : "info"
      }]);

      if (step === 3) {
        clearInterval(interval);
        setTimeout(() => {
          setFoundMemories(mockMemories);
          setIsSearching(false);
          setActiveStep(-1);
          setLogs(prev => [...prev, {
            t: new Date().toLocaleTimeString([], { hour12: false }),
            msg: "EXECUTION_COMPLETE: Context ready for AI response generation",
            type: "success"
          }]);
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
          className="px-6 py-3 bg-secondary/20 border border-secondary/30 rounded-2xl font-bold text-sm text-secondary-neon hover:bg-secondary/30 transition-all flex items-center gap-3 disabled:opacity-50 active:scale-[0.98]"
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
                         activeStep >= i ? 'bg-white/5 border-white/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-transparent border-white/5 opacity-20'
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
                     <div className="flex-1 px-4 mb-4 relative">
                        <div className="h-1 bg-white/5 w-full relative rounded-full overflow-hidden">
                           {(activeStep === i || isSearching) && (
                             <motion.div 
                               initial={{ left: '-100%' }}
                               animate={{ left: '100%' }}
                               transition={{ 
                                 repeat: Infinity, 
                                 duration: 1.2, 
                                 ease: 'linear' 
                               }}
                               className="absolute h-full w-16 bg-gradient-to-r from-transparent via-secondary-neon to-transparent shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                             />
                           )}
                        </div>
                     </div>
                   )}
                 </React.Fragment>
               ))}
            </div>

            <div className="text-center max-w-2xl w-full">
               <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">Execution Log</h3>
               <div className="bg-black/20 p-6 rounded-2xl border border-white/5 font-mono text-left space-y-2 min-h-[160px]">
                 {logs.map((log, idx) => (
                   <motion.p 
                     key={idx}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className={`text-xs flex gap-2 ${
                       log.type === 'success' ? 'text-accent-neon' : log.type === 'warning' ? 'text-amber-400' : 'text-secondary-neon/60'
                     }`}
                   >
                     <span className="text-white/20 font-bold">{log.t}</span>
                     <span className="text-white/40">{">>"}</span>
                     <span>{log.msg}</span>
                   </motion.p>
                 ))}
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
