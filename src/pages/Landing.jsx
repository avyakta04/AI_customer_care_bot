import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  Mic2, 
  MessageSquare, 
  ShieldCheck, 
  Database, 
  History, 
  BarChart3, 
  Zap, 
  Cpu, 
  ArrowRight,
  Sparkles,
  Command,
  Activity,
  Flame,
  Fingerprint,
  TrendingUp,
  Workflow,
  Network
} from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import GlassCard from '../components/GlassCard';

// -------------------------------------------------------------
// PARTICLE CANVAS COMPONENT
// -------------------------------------------------------------
const DynamicNeuralCanvas = () => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Nodes definition
    const particleCount = 45;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseVal: Math.random() * Math.PI,
        color: Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.4)' : 'rgba(6, 182, 212, 0.4)'
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw mouse light aura
      const gradient = ctx.createRadialGradient(
        mousePos.x,
        mousePos.y,
        10,
        mousePos.x,
        mousePos.y,
        300
      );
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.04)');
      gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.02)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Connect particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Bounce
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        p1.pulseVal += p1.pulseSpeed;
        const currentRadius = p1.radius + Math.sin(p1.pulseVal) * 0.5;

        // Draw node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.shadowColor = p1.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.12;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            // Animated light particles flowing along vector lanes
            if (Math.random() > 0.992) {
              ctx.fillStyle = '#06b6d4';
              ctx.beginPath();
              ctx.arc(p1.x + (p2.x - p1.x) * 0.5, p1.y + (p2.y - p1.y) * 0.5, 2, 0, Math.PI * 2);
              ctx.shadowColor = '#06b6d4';
              ctx.shadowBlur = 8;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
};

// -------------------------------------------------------------
// INTERACTIVE PIPELINE STEPS
// -------------------------------------------------------------
const pipelineNodes = [
  { 
    id: 1, 
    title: "1. User Message Input", 
    desc: "Vocal signals & raw textual strings parsed instantly.",
    icon: Mic2, 
    color: "from-slate-400 to-slate-200", 
    glow: "shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
  },
  { 
    id: 2, 
    title: "2. Emotion Detection Matrix", 
    desc: "Tonal frequencies matched with 94.6% satisfaction indexes.",
    icon: Activity, 
    color: "from-violet-600 to-indigo-600", 
    glow: "shadow-[0_0_25px_rgba(139,92,246,0.4)]" 
  },
  { 
    id: 3, 
    title: "3. Vector Memory Retrieval", 
    desc: "ChromaDB matching pulls past user history & resolutions.",
    icon: Database, 
    color: "from-cyan-500 to-blue-500", 
    glow: "shadow-[0_0_25px_rgba(6,182,212,0.4)]" 
  },
  { 
    id: 4, 
    title: "4. Semantic Context Builder", 
    desc: "Prepares a unified context packet of history + emotion.",
    icon: BrainCircuit, 
    color: "from-fuchsia-500 to-purple-500", 
    glow: "shadow-[0_0_25px_rgba(217,70,239,0.4)]" 
  },
  { 
    id: 5, 
    title: "5. Response Generation Module", 
    desc: "Hyper-personalized empathetic scripts synthesized under 80ms.",
    icon: MessageSquare, 
    color: "from-sky-500 to-indigo-500", 
    glow: "shadow-[0_0_25px_rgba(14,165,233,0.4)]" 
  },
  { 
    id: 6, 
    title: "6. AI Supervisor Shield", 
    desc: "Real-time policing validates grammar & safety parameters.",
    icon: ShieldCheck, 
    color: "from-emerald-500 to-teal-500", 
    glow: "shadow-[0_0_25px_rgba(16,185,129,0.4)]" 
  },
  { 
    id: 7, 
    title: "7. Hindsight Learning Loop", 
    desc: "Calculates correction coefficients to optimize future runs.",
    icon: History, 
    color: "from-amber-500 to-orange-500", 
    glow: "shadow-[0_0_25px_rgba(245,158,11,0.4)]" 
  }
];

// -------------------------------------------------------------
// MAIN LANDING COMPONENT
// -------------------------------------------------------------
const Landing = () => {
  const [pipelineIndex, setPipelineIndex] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [terminalLogs, setTerminalLogs] = useState([
    "SYS_INIT: Neura Platform OS boot engagement...",
    "MODULE_LOAD: Emotion core v4.0 status... NOMINAL",
    "MODULE_LOAD: ChromaDB neural network index synced.",
    "MONITORING: AI Supervisor Shield active on port 8080."
  ]);

  const { scrollYProgress } = useScroll();
  const scaleMetric = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  // Floating effect handler
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) * 0.03;
    const y = (clientY - window.innerHeight / 2) * 0.03;
    setMouseOffset({ x, y });
  };

  // Pipeline Flow Animation Loop
  useEffect(() => {
    const pipelineTimer = setInterval(() => {
      setPipelineIndex((prev) => (prev + 1) % pipelineNodes.length);
    }, 2500);

    // Terminal mock logs stream
    const terminalTimer = setInterval(() => {
      const liveFeeds = [
        `TRACE: Session #9${Math.floor(Math.random() * 900)} tone metrics evaluated...`,
        "DATABASE: Chromadb query latency: 12ms",
        "SUPERVISOR: Safety compliance check... nominal (0.01% violation)",
        "LEARNING: Coefficient adjustment completed for sector 3F.",
        "EMOTION: User sentiment detected: Happy (89% confidence)"
      ];
      setTerminalLogs((prev) => [...prev.slice(-4), liveFeeds[Math.floor(Math.random() * liveFeeds.length)]]);
    }, 3000);

    return () => {
      clearInterval(pipelineTimer);
      clearInterval(terminalTimer);
    };
  }, []);

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-slate-950 text-slate-200 selection:bg-violet-500/30 overflow-x-hidden relative"
    >
      {/* Premium Canvas Neural Particles */}
      <DynamicNeuralCanvas />
      
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-44 pb-28 lg:pt-56 lg:pb-36 px-6 z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/[0.02] border border-white/10 mb-8 backdrop-blur-md shadow-inner"
        >
          <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">AI Core v4.0 Operating System</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mb-8 leading-[0.9] text-glow"
        >
          INTELLIGENCE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 animate-pulse-slow">UNLEASHED</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="max-w-3xl mx-auto text-base md:text-lg text-white/50 mb-12 leading-relaxed font-medium"
        >
          Enter the first **Emotionally-Aware Support Ecosystem**. Seamlessly bridging human sentiment, vector context databases, real-time safety supervisors, and reinforcement learning.
        </motion.p>

        {/* Magnetic launcher buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 z-20"
        >
          <Link 
            to="/dashboard" 
            style={{ transform: `translate(${mouseOffset.x * 0.1}px, ${mouseOffset.y * 0.1}px)` }}
            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:scale-105 active:scale-[0.98] transition-all duration-300 shadow-[0_0_30px_rgba(139,92,246,0.4)] flex items-center justify-center gap-3 hover:brightness-110"
          >
            ENTER THE OS
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a 
            href="#pipeline" 
            style={{ transform: `translate(${mouseOffset.x * -0.05}px, ${mouseOffset.y * -0.05}px)` }}
            className="w-full sm:w-auto px-10 py-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl font-black text-sm tracking-widest text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-3 uppercase cursor-pointer"
          >
            <Command className="w-4 h-4 text-cyan-400" />
            Explore Pipeline
          </a>
        </motion.div>
      </section>

      {/* Floating live metrics absolute layout */}
      <div className="absolute top-[35%] left-12 hidden xl:block z-20">
        <motion.div 
          style={{ x: mouseOffset.x * 1.5, y: mouseOffset.y * 1.5 }}
          className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
            <Activity className="w-5 h-5 text-violet-400 animate-pulse" />
          </div>
          <div>
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Emotion Accuracy</p>
            <h4 className="text-lg font-black text-white tracking-tight">94.6%</h4>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-[48%] right-12 hidden xl:block z-20">
        <motion.div 
          style={{ x: mouseOffset.x * -1.8, y: mouseOffset.y * -1.8 }}
          className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center gap-4 animate-glow-pulse-cyan"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
            <Database className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Memory Precision</p>
            <h4 className="text-lg font-black text-white tracking-tight">92.3%</h4>
          </div>
        </motion.div>
      </div>

      {/* Live AI Status Bar Panel */}
      <section className="px-6 py-12 z-20 relative flex justify-center">
        <div className="w-full max-w-5xl rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-2xl px-8 py-6 shadow-2xl flex flex-wrap gap-8 justify-around items-center">
          {[
            { name: "Emotion Engine", state: "ACTIVE", color: "text-violet-400", bg: "bg-violet-500/20 border-violet-500/30" },
            { name: "Memory Retrieval", state: "ACTIVE", color: "text-cyan-400", bg: "bg-cyan-500/20 border-cyan-500/30" },
            { name: "AI Supervisor", state: "MONITORING", color: "text-amber-400", bg: "bg-amber-500/20 border-amber-500/30" },
            { name: "Learning Engine", state: "RUNNING", color: "text-emerald-400", bg: "bg-emerald-500/20 border-emerald-500/30" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 group">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${item.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${item.color.replace('text', 'bg')} animate-ping`} />
              </div>
              <div>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.25em] font-black">{item.name}</p>
                <h3 className={`text-xs font-black tracking-widest ${item.color} uppercase mt-0.5 group-hover:scale-105 transition-transform`}>{item.state}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive AI Pipeline Flow */}
      <section id="pipeline" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">System Execution Pipeline</h2>
            <p className="text-white/40 text-sm mt-3 font-semibold uppercase tracking-wider">Hover nodes to view execution thread telemetry</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-stretch relative">
            {pipelineNodes.map((node, i) => {
              const Icon = node.icon;
              const isActive = pipelineIndex === i;
              
              return (
                <motion.div
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(i)}
                  onMouseLeave={() => setHoveredNode(null)}
                  whileHover={{ y: -6 }}
                  className={`p-6 rounded-[2rem] border transition-all duration-500 relative flex flex-col justify-between cursor-pointer ${
                    isActive 
                      ? "border-violet-500 bg-violet-500/[0.04] " + node.glow
                      : "border-white/5 bg-slate-950/60 backdrop-blur-xl hover:border-white/20"
                  }`}
                >
                  <div>
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${node.color} flex items-center justify-center mb-6`}>
                      <Icon className="w-5 h-5 text-slate-950" />
                    </div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2">{node.title}</h3>
                  </div>

                  <AnimatePresence>
                    {(hoveredNode === i || isActive) && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[10px] text-white/50 font-semibold leading-relaxed mt-4 pt-4 border-t border-white/5"
                      >
                        {node.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Flow progress indicators */}
                  {isActive && (
                    <motion.div 
                      layoutId="pipeline-active"
                      className="absolute inset-x-0 -bottom-1 h-1 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Scroll Storytelling */}
      <section className="py-24 px-6 relative z-10 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-36">
          {/* Section 1: Emotion Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                <Activity className="w-4 h-4 text-violet-400" />
                <span className="text-[9px] font-black text-violet-300 uppercase tracking-widest">Cognitive Module 01</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">Emotion Detection Engine</h3>
              <p className="text-white/40 text-lg leading-relaxed font-semibold mb-8 italic">
                "Our voice & text matrix tracks real-time vocal patterns, instantly processing spikes in customer frustration."
              </p>
              <div className="flex gap-8">
                <div>
                  <h4 className="text-3xl font-black text-white tracking-tight">88%</h4>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Resolution Accuracy</p>
                </div>
                <div className="w-px bg-white/10 h-10" />
                <div>
                  <h4 className="text-3xl font-black text-white tracking-tight">&lt; 80ms</h4>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Classification Speed</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-slate-950/80 border border-white/5 relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-6 left-6 text-[10px] font-mono text-white/20 uppercase tracking-widest">Emotion Live Vector Stream</div>
              
              {/* Spinning active ring */}
              <div className="my-10 relative flex items-center justify-center">
                <svg width="150" height="150" className="rotate-[-90deg]">
                  <circle cx="75" cy="75" r="60" stroke="rgba(255,255,255,0.02)" strokeWidth="6" fill="transparent" />
                  <motion.circle
                    cx="75"
                    cy="75"
                    r="60"
                    stroke="#8b5cf6"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 60}
                    animate={{ strokeDashoffset: [2 * Math.PI * 60, 2 * Math.PI * 60 * 0.2] }}
                    transition={{ duration: 2, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">88%</span>
                  <span className="text-[7px] text-white/40 uppercase font-mono tracking-widest mt-0.5">Frustrated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Memory Retrieval */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-last lg:order-first p-8 rounded-[2.5rem] bg-slate-950/80 border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              <div className="absolute top-6 left-6 text-[10px] font-mono text-white/20 uppercase tracking-widest font-black">ChromaDB Vector Matching</div>
              
              <div className="grid grid-cols-5 gap-3 mt-12 mb-6">
                {[...Array(15)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ 
                      opacity: [0.1, 0.8, 0.1],
                      borderColor: i % 3 === 0 ? ['rgba(6,182,212,0.1)', 'rgba(6,182,212,1)', 'rgba(6,182,212,0.1)'] : 'rgba(255,255,255,0.05)'
                    }}
                    transition={{ duration: 3, delay: i * 0.15, repeat: Infinity }}
                    className="aspect-square rounded-xl border flex items-center justify-center bg-white/[0.01]"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${i % 3 === 0 ? 'bg-cyan-400' : 'bg-white/10'}`} />
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                <Database className="w-4 h-4 text-cyan-400" />
                <span className="text-[9px] font-black text-cyan-300 uppercase tracking-widest">Cognitive Module 02</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">Semantic Memory Retrieval</h3>
              <p className="text-white/40 text-lg leading-relaxed font-semibold mb-8 italic">
                "Retrieves precise long-term client interaction indexes in milliseconds. High-density context mapping eliminates hallucinations."
              </p>
              <div className="flex gap-8">
                <div>
                  <h4 className="text-3xl font-black text-white tracking-tight">14ms</h4>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Retrieval Latency</p>
                </div>
                <div className="w-px bg-white/10 h-10" />
                <div>
                  <h4 className="text-3xl font-black text-white tracking-tight">98.2%</h4>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Context Precision</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: AI Supervision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[9px] font-black text-emerald-300 uppercase tracking-widest">Cognitive Module 03</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">Real-Time AI Supervisor</h3>
              <p className="text-white/40 text-lg leading-relaxed font-semibold mb-8 italic">
                "Monitors tone compliance, factuality boundaries, and safely routes tickets instantly if stress levels cross nominal levels."
              </p>
              <div className="flex gap-8">
                <div>
                  <h4 className="text-3xl font-black text-white tracking-tight">0.01%</h4>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Hallucination Risk</p>
                </div>
                <div className="w-px bg-white/10 h-10" />
                <div>
                  <h4 className="text-3xl font-black text-white tracking-tight">96.1%</h4>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Verification Grade</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-slate-950/80 border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[250px] font-mono text-xs">
              <div className="absolute top-6 left-6 text-[10px] text-white/20 uppercase tracking-widest font-black">Supervisor Guard Shield</div>
              
              <div className="space-y-3 mt-10">
                <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-2xl">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>POLICING: FACTUALITY VALIDATION SECURED</span>
                </div>
                <div className="flex items-center gap-3 text-white/50 p-3 rounded-2xl bg-white/[0.01] border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-white/30" />
                  <span>COMPARE: RESPONSE MATCHES USER PROFILE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Hindsight Learning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-last lg:order-first p-8 rounded-[2.5rem] bg-slate-950/80 border border-white/5 relative overflow-hidden flex flex-col justify-center items-center min-h-[300px]">
              <div className="absolute top-6 left-6 text-[10px] font-mono text-white/20 uppercase tracking-widest font-black">Weights Optimization Cycle</div>
              
              {/* Dynamic feedback visual */}
              <div className="flex items-center gap-4 mt-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <History className="w-6 h-6 animate-spin-slow" />
                </div>
                <div className="h-px bg-white/10 w-20 relative">
                  <motion.div 
                    animate={{ left: ['0%', '100%'] }} 
                    transition={{ duration: 1.5, repeat: Infinity }} 
                    className="absolute w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] -top-1"
                  />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <Cpu className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                <History className="w-4 h-4 text-amber-400" />
                <span className="text-[9px] font-black text-amber-300 uppercase tracking-widest">Cognitive Module 04</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">Hindsight Learning Algorithm</h3>
              <p className="text-white/40 text-lg leading-relaxed font-semibold mb-8 italic">
                "Continuously refines local prompt-weight structures. Converts offline ticket resolutions into optimized execution parameters."
              </p>
              <div className="flex gap-8">
                <div>
                  <h4 className="text-3xl font-black text-white tracking-tight">+2.4%</h4>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Weekly Metric Growth</p>
                </div>
                <div className="w-px bg-white/10 h-10" />
                <div>
                  <h4 className="text-3xl font-black text-white tracking-tight">Nominal</h4>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Convergence Index</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Command Center Preview Panel */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">AI OS Interface Overview</h2>
            <p className="text-white/40 text-sm mt-3 font-semibold uppercase tracking-wider">High dimensional real-time telemetry control preview</p>
          </div>

          <div className="p-[1px] rounded-[3rem] bg-gradient-to-br from-white/15 to-transparent relative overflow-hidden shadow-2xl">
            <div className="bg-slate-950/95 backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden">
              <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                </div>
                <span className="text-[9px] font-mono text-white/30 tracking-[0.3em] uppercase">Enterprise_Console_Active</span>
              </div>
              <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left: Console Logs */}
                <div className="font-mono text-[11px] leading-relaxed p-6 bg-black/40 border border-white/5 rounded-2xl h-60 overflow-y-auto space-y-2">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="flex gap-2 text-white/50">
                      <span className="text-violet-400">{" >> "}</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  <div className="flex gap-2 text-emerald-400 animate-pulse">
                    <span>{" >> "}</span>
                    <span>STANDBY: Monitoring active threads...</span>
                  </div>
                </div>

                {/* Right: Dashboard Summary Mockup */}
                <div className="flex flex-col justify-between space-y-6">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-black">Active Conversations</p>
                      <h4 className="text-2xl font-black text-white mt-1">1,284</h4>
                    </div>
                    <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400">
                      <Network className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-black">Risk Supervisor Interventions</p>
                      <h4 className="text-2xl font-black text-amber-400 mt-1">08</h4>
                    </div>
                    <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 animate-bounce">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-44 px-6 relative overflow-hidden z-10 flex flex-col items-center justify-center text-center">
        <div className="absolute -inset-10 bg-violet-600/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-none"
          >
            HYPER <br />SCALABILITY
          </motion.h2>
          <p className="text-lg md:text-xl text-white/40 mb-12 font-medium italic max-w-2xl mx-auto leading-relaxed">
            "A support model that doesn't just resolve tickets, but feels empathy, logs history, and supervises safety autonomously."
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/dashboard" 
              className="w-full sm:w-auto px-12 py-6 bg-white text-slate-950 rounded-2xl font-black text-sm tracking-widest hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)] uppercase"
            >
              LAUNCH CONSOLE
            </Link>
            <button className="w-full sm:w-auto px-12 py-6 bg-white/[0.03] border border-white/10 text-white rounded-2xl font-black text-sm tracking-widest hover:bg-white/[0.08] transition-all uppercase">
              Developer APIs
            </button>
          </div>
        </div>
      </section>

      {/* Final Footer Info */}
      <footer className="py-16 border-t border-white/[0.05] px-6 bg-slate-950/80 backdrop-blur-2xl relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4 group">
            <div className="p-3 rounded-xl bg-violet-600/20 border border-violet-500/30 group-hover:rotate-12 transition-transform">
              <BrainCircuit className="w-6 h-6 text-violet-400" />
            </div>
            <span className="text-lg font-black tracking-tighter text-white uppercase italic">NEURA_PLATFORM</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-black text-white/20 uppercase tracking-[0.25em]">
            <a href="#" className="hover:text-violet-400 transition-colors">Neural_Ethics</a>
            <a href="#" className="hover:text-violet-400 transition-colors">Open_API_Log</a>
            <a href="#" className="hover:text-violet-400 transition-colors">Security_Ops</a>
          </div>
          <p className="text-[10px] font-black text-white/10 uppercase tracking-widest">© 2026 Neura Systems. All Core modules active.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
