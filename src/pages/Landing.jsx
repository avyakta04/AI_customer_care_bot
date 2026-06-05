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
  Network,
  Lock,
  Globe,
  Radio,
  Server
} from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import GlassCard from '../components/GlassCard';
import AICoreVisualizer from '../components/AICoreVisualizer';

// -------------------------------------------------------------
// LIVE IMMERSIVE CANVAS BACKGROUND
// -------------------------------------------------------------
const DynamicNeuralCanvas = () => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

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

    // Dynamic Nodes & Connections
    const particleCount = 50;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        pulseVal: Math.random() * Math.PI,
        color: Math.random() > 0.5 ? 'rgba(30, 58, 138, 0.25)' : 'rgba(212, 175, 55, 0.25)'
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Light ambient gradient follow
      if (mousePos.x !== -1000) {
        const gradient = ctx.createRadialGradient(
          mousePos.x,
          mousePos.y,
          10,
          mousePos.x,
          mousePos.y,
          350
        );
        gradient.addColorStop(0, 'rgba(30, 58, 138, 0.035)');
        gradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.015)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw grid lines
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.012)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Connect particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Boundary wrapping
        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        p1.pulseVal += p1.pulseSpeed;
        const currentRadius = p1.radius + Math.sin(p1.pulseVal) * 0.4;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.12;
            ctx.strokeStyle = `rgba(15, 23, 42, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            // Tiny stream animation dots along connections
            if (Math.random() > 0.995) {
              const gradientPoint = ctx.createRadialGradient(
                p1.x + (p2.x - p1.x) * 0.5,
                p1.y + (p2.y - p1.y) * 0.5,
                0,
                p1.x + (p2.x - p1.x) * 0.5,
                p1.y + (p2.y - p1.y) * 0.5,
                4
              );
              gradientPoint.addColorStop(0, '#D4AF37');
              gradientPoint.addColorStop(1, 'transparent');
              ctx.fillStyle = gradientPoint;
              ctx.beginPath();
              ctx.arc(p1.x + (p2.x - p1.x) * 0.5, p1.y + (p2.y - p1.y) * 0.5, 3, 0, Math.PI * 2);
              ctx.fill();
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
// MAIN LANDING PAGE SYSTEM CONTROL
// -------------------------------------------------------------
const Landing = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Live fluctuating numbers
  const [emotionScore, setEmotionScore] = useState(94.6);
  const [memoryScore, setMemoryScore] = useState(98.2);
  const [supervisorScore, setSupervisorScore] = useState(99.89);
  const [learningScore, setLearningScore] = useState(92.4);

  // Live updating feed events
  const [feedEvents, setFeedEvents] = useState([
    { id: 1, type: "Emotion Detected", details: "Frustration patterns classified in sector 7G", color: "text-primary", bg: "bg-primary/5 border-primary/20", time: "Just now" },
    { id: 2, type: "Memory Retrieved", details: "ChromaDB confidence lookup: 98.4%", color: "text-secondary", bg: "bg-secondary/10 border-secondary/20", time: "12s ago" },
    { id: 3, type: "Supervisor Approved", details: "Hallucination scanning: NOMINAL (0.01%)", color: "text-secondary", bg: "bg-secondary/10 border-secondary/20", time: "1m ago" },
    { id: 4, type: "Learning Updated", details: "Offline weights sync cycle finished successfully", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", time: "3m ago" }
  ]);

  // Handle mouse moves for 3D parallax effects
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) * 0.02;
    const y = (clientY - window.innerHeight / 2) * 0.02;
    setMouseOffset({ x, y });
  };

  useEffect(() => {
    // Oscillate values to simulate real-time processing
    const scoreInterval = setInterval(() => {
      setEmotionScore(prev => Math.max(93.0, Math.min(96.5, prev + (Math.random() - 0.5) * 0.2)));
      setMemoryScore(prev => Math.max(97.5, Math.min(99.0, prev + (Math.random() - 0.5) * 0.1)));
      setSupervisorScore(prev => Math.max(99.8, Math.min(99.99, prev + (Math.random() - 0.5) * 0.03)));
      setLearningScore(prev => Math.max(91.5, Math.min(94.0, prev + (Math.random() - 0.5) * 0.15)));
    }, 2000);

    // Real-time events stream push
    const eventInterval = setInterval(() => {
      const sampleEvents = [
        { type: "Emotion Detected", details: "Tone detected: empathetic resolution bypass engaged", color: "text-primary", bg: "bg-primary/5 border-primary/20" },
        { type: "Memory Retrieved", details: "Vector memory search hit cached sequence in sector 3A", color: "text-secondary", bg: "bg-secondary/10 border-secondary/20" },
        { type: "Supervisor Approved", details: "Prompt injection validation check complete: SAFE", color: "text-secondary", bg: "bg-secondary/10 border-secondary/20" },
        { type: "Learning Updated", details: "Reinforcement feedback compilation loop engaged", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
        { type: "Response Optimized", details: "Empathetic latency decreased by 14ms (total speed 68ms)", color: "text-primary", bg: "bg-primary/5 border-primary/20" }
      ];

      const nextEvt = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      setFeedEvents(prev => [
        {
          id: Date.now(),
          type: nextEvt.type,
          details: nextEvt.details,
          color: nextEvt.color,
          bg: nextEvt.bg,
          time: "Just now"
        },
        ...prev.slice(0, 4)
      ]);
    }, 4500);

    // Active step cycling
    const stepInterval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 6);
    }, 3000);

    return () => {
      clearInterval(scoreInterval);
      clearInterval(eventInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const rightOrbitSteps = [
    { label: "User Input", icon: Mic2, desc: "Acoustic streams and textual messages parsed", color: "text-slate-600", glow: "rgba(100, 116, 139, 0.15)" },
    { label: "Emotion Detection", icon: Activity, desc: "Tone mapped against satisfaction grids", color: "text-primary", glow: "rgba(30, 58, 138, 0.15)" },
    { label: "Memory Retrieval", icon: Database, desc: "ChromaDB queries past logs and cached files", color: "text-secondary", glow: "rgba(212, 175, 55, 0.15)" },
    { label: "Context Builder", icon: BrainCircuit, desc: "Binds user parameters and vector caches", color: "text-primary", glow: "rgba(30, 58, 138, 0.15)" },
    { label: "AI Supervisor", icon: ShieldCheck, desc: "Intercepts unsafe prompts & hallucinations", color: "text-secondary", glow: "rgba(212, 175, 55, 0.15)" },
    { label: "Hindsight Learning", icon: History, desc: "Recalculates weights from final outcomes", color: "text-emerald-600", glow: "rgba(16, 185, 129, 0.15)" }
  ];

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-primary/10 overflow-x-hidden relative font-inter"
    >
      <DynamicNeuralCanvas />
      <LandingNavbar />

      {/* Decorative Blur Rays */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/5 to-emerald-400/5 rounded-full blur-[130px] pointer-events-none" />

      {/* MAIN SCI-FI OS PANEL HUD */}
      <main className="max-w-[1600px] mx-auto pt-32 px-6 lg:px-12 relative z-10">
        
        {/* Dynamic HUD Layout grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* LEFT SIDE: LIVE SYSTEM STATUS PANEL (2 Cols) */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            <GlassCard className="flex-1 p-6 flex flex-col justify-between border-slate-200/80 bg-white/70 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Live System Status</span>
                  <span className="px-2 py-0.5 text-[8px] font-mono font-bold bg-emerald-50 border border-emerald-200 text-emerald-600 rounded">SYS_NOMINAL</span>
                </div>

                <div className="space-y-6">
                  {/* Module 1: Emotion Engine */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-slate-800">Emotion Engine</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-primary">{emotionScore.toFixed(1)}%</span>
                    </div>
                    {/* Mini sparkline chart SVG */}
                    <div className="h-6 w-full opacity-60">
                      <svg viewBox="0 0 100 20" className="w-full h-full">
                        <path d="M 0 15 Q 10 5, 20 12 T 40 8 T 60 14 T 80 5 L 100 10" fill="none" stroke="#1E3A8A" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Module 2: Memory Retrieval */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-secondary/20 hover:shadow-sm transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-secondary" />
                        <span className="text-xs font-bold text-slate-800">Memory Retrieval</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-secondary">{memoryScore.toFixed(1)}%</span>
                    </div>
                    <div className="h-6 w-full opacity-60">
                      <svg viewBox="0 0 100 20" className="w-full h-full">
                        <path d="M 0 10 T 15 15 T 35 5 T 55 10 T 75 14 T 100 7" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Module 3: AI Supervisor */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-secondary/20 hover:shadow-sm transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-secondary" />
                        <span className="text-xs font-bold text-slate-800">AI Supervisor</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-secondary">{supervisorScore.toFixed(2)}%</span>
                    </div>
                    <div className="h-6 w-full opacity-60">
                      <svg viewBox="0 0 100 20" className="w-full h-full">
                        <path d="M 0 12 T 20 10 T 40 11 T 60 9 T 80 12 T 100 10" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Module 4: Learning Engine */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-500/20 hover:shadow-sm transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-800">Learning Engine</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-600">{learningScore.toFixed(1)}%</span>
                    </div>
                    <div className="h-6 w-full opacity-60">
                      <svg viewBox="0 0 100 20" className="w-full h-full">
                        <path d="M 0 18 Q 15 5, 30 14 T 60 7 T 80 16 L 100 12" fill="none" stroke="#10b981" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Console Port: 8080</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Active Live Thread
                </span>
              </div>
            </GlassCard>
          </div>

          {/* CENTER: HERO & MASSIVE DYNAMIC AI CORE (8 Cols) */}
          <div className="xl:col-span-8 flex flex-col gap-6 justify-between">
            <div className="text-center flex flex-col items-center">
              {/* Sub-badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-200/60 shadow-sm relative z-20 mb-4"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary animate-spin-slow" />
                <span className="text-[9px] font-black text-slate-800 uppercase tracking-[0.25em]">Emotional Intelligence OS</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-3 select-none">
                <span className="text-primary">ECHO</span>
                <span className="text-secondary">MIND</span>
              </h1>
              <h2 className="text-sm md:text-base font-bold text-slate-700 tracking-wide uppercase max-w-lg leading-relaxed mb-3">
                Emotion-Aware Customer Intelligence Platform
              </h2>
              <p className="text-xs text-slate-500 max-w-xl leading-relaxed mb-4">
                ECHOMIND combines emotion detection, memory retrieval, AI supervision, and hindsight learning to deliver smarter, more empathetic customer interactions that improve over time.
              </p>
            </div>

            {/* Massive Interactive 3D Orbit Visualizer centerpiece */}
            <div className="relative z-10 w-full flex-1">
              <AICoreVisualizer />
            </div>

            {/* Launch Console CTA Action */}
            <div className="relative z-20 flex flex-wrap gap-4 justify-center items-center w-full">
              <Link 
                to="/dashboard" 
                style={{ transform: `translate(${mouseOffset.x * 0.2}px, ${mouseOffset.y * 0.2}px)` }}
                className="px-10 py-4.5 bg-gradient-premium text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-105 active:scale-[0.98] transition-all duration-300 shadow-md flex items-center gap-3 hover:brightness-110"
              >
                LAUNCH CONSOLE
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="#activity-feed" 
                style={{ transform: `translate(${mouseOffset.x * -0.1}px, ${mouseOffset.y * -0.1}px)` }}
                className="px-10 py-4.5 bg-white border border-slate-200 rounded-2xl font-black text-xs tracking-widest text-slate-800 hover:bg-slate-50 transition-all flex items-center gap-3 uppercase shadow-sm cursor-pointer"
              >
                <Command className="w-4 h-4 text-secondary" />
                Live OS Feed
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: INTERACTIVE AI PROCESSING ORBIT (2 Cols) */}
          <div className="xl:col-span-2 flex flex-col justify-between">
            <GlassCard className="flex-1 p-6 flex flex-col justify-between border-slate-200/80 bg-white/70 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl" />
              
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black block mb-6">AI Processing Orbit</span>
                
                {/* 6 Circular Orbit Nodes layout */}
                <div className="space-y-3 relative">
                  {rightOrbitSteps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isActive = activeStep === idx;
                    
                    return (
                      <motion.div
                        key={idx}
                        onMouseEnter={() => setHoveredNode(idx)}
                        onMouseLeave={() => setHoveredNode(null)}
                        whileHover={{ x: 4 }}
                        className={`p-3.5 rounded-2xl border transition-all duration-500 relative flex items-center gap-3 cursor-pointer ${
                          isActive 
                            ? "bg-white border-slate-300/80 shadow-md scale-[1.01]" 
                            : "bg-white/80 border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-primary to-secondary rounded-full" />
                        )}
                        <div className={`p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 ${step.color} ${isActive ? 'animate-bounce' : ''}`}>
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">{step.label}</h4>
                          <p className="text-[9px] text-slate-400 truncate mt-0.5">{step.desc}</p>
                        </div>
                        {isActive && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Data stream description popup */}
              <div className="mt-6 pt-4 border-t border-slate-100 min-h-[50px]">
                <AnimatePresence mode="wait">
                  {hoveredNode !== null ? (
                    <motion.div 
                      key={hoveredNode}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Active Step Info</p>
                      <p className="text-[11px] text-slate-600 font-semibold leading-relaxed mt-1">{rightOrbitSteps[hoveredNode].desc}</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Active Step Info</p>
                      <p className="text-[11px] text-slate-500 font-semibold mt-1">Hover steps above to query flow telemetry.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </div>

        </div>

        {/* METRICS SECTION: FLOATING METRICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Emotion Accuracy", value: `${emotionScore.toFixed(1)}%`, target: "95%", icon: Activity, progress: 94, trend: "up", color: "text-primary", stroke: "#1E3A8A" },
            { label: "Response Quality", value: `${supervisorScore.toFixed(2)}%`, target: "100%", icon: ShieldCheck, progress: 99, trend: "up", color: "text-secondary", stroke: "#D4AF37" },
            { label: "Memory Recall", value: `${memoryScore.toFixed(1)}%`, target: "99%", icon: Database, progress: 98, trend: "up", color: "text-secondary", stroke: "#D4AF37" },
            { label: "Customer Satisfaction", value: "4.86/5", target: "4.90", icon: Sparkles, progress: 97, trend: "up", color: "text-emerald-600", stroke: "#10b981" }
          ].map((card, idx) => (
            <GlassCard key={idx} className="border-slate-200/80 bg-white/70 shadow-sm p-6 flex items-center justify-between group hover:border-primary/20 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl bg-slate-50 border border-slate-200/60 ${card.color}`}>
                    <card.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black text-slate-455 uppercase tracking-[0.15em]">{card.label}</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{card.value}</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Target {card.target}</p>
                </div>
              </div>
              
              {/* Circular SVG progress */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg width="60" height="60" className="rotate-[-90deg]">
                  <circle cx="30" cy="30" r="24" stroke="rgba(15,23,42,0.03)" strokeWidth="4.5" fill="transparent" />
                  <motion.circle
                    cx="30"
                    cy="30"
                    r="24"
                    stroke={card.stroke}
                    strokeWidth="4.5"
                    strokeDasharray={2 * Math.PI * 24}
                    initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - card.progress / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[10px] font-black text-slate-650">{card.progress}%</span>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* LIVE AI ACTIVITY FEED */}
        <div id="activity-feed" className="w-full mb-16">
          <GlassCard className="border border-slate-200/80 bg-white/70 shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/5 border border-primary/10 rounded-xl">
                  <Network className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 tracking-tight">Live OS Execution Stream</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Real-time trace logs & decision loops</p>
                </div>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Trace Socket Active
              </div>
            </div>
 
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {feedEvents.map((evt) => (
                  <motion.div 
                    key={evt.id}
                    initial={{ opacity: 0, y: -15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-primary/20 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1.5 rounded-xl font-mono text-[9px] font-black uppercase tracking-wider border ${evt.bg} ${evt.color}`}>
                        {evt.type}
                      </span>
                      <span className="text-xs text-slate-600 font-semibold">{evt.details}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">{evt.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>

        {/* CTA PLATFORM ENTRY BANNER */}
        <section className="py-24 relative overflow-hidden z-10 flex flex-col items-center justify-center text-center">
          <div className="absolute -inset-10 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-none"
            >
              HYPER <br />SCALABILITY
            </motion.h2>
            <p className="text-base md:text-lg text-slate-500 mb-12 font-medium italic max-w-2xl mx-auto leading-relaxed">
              "A support model that doesn't just resolve tickets, but feels empathy, logs history, and supervises safety autonomously."
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/dashboard" 
                className="w-full sm:w-auto px-12 py-5 bg-gradient-premium text-white rounded-2xl font-black text-xs tracking-widest hover:brightness-110 shadow-md transition-transform uppercase"
              >
                ENTER PLATFORM CONSOLE
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-12 py-5 bg-white border border-slate-200 text-slate-800 rounded-2xl font-black text-xs tracking-widest hover:bg-slate-50 transition-all uppercase shadow-sm"
              >
                OPERATOR ACCESS
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="py-16 border-t border-slate-200/80 px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4 group">
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 group-hover:rotate-12 transition-transform">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            <span className="text-lg font-black tracking-tighter text-slate-800 uppercase italic">ECHOMIND</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-black text-slate-400 uppercase tracking-[0.25em]">
            <a href="#" className="hover:text-primary transition-colors">Ethics</a>
            <a href="#" className="hover:text-primary transition-colors">Open_API_Log</a>
            <a href="#" className="hover:text-primary transition-colors">Security_Ops</a>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 ECHOMIND. Every Conversation Matters.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
