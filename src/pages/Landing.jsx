import React from 'react';
import { motion } from 'framer-motion';
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
  Layout
} from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import GlassCard from '../components/GlassCard';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
  >
    <div className="relative p-[1px] rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent group transition-all duration-500 hover:from-violet-500/50">
      <div className="h-full rounded-[2.5rem] bg-slate-950/80 backdrop-blur-xl p-8 lg:p-10 border border-white/[0.05]">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border border-violet-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
          <Icon className="w-8 h-8 text-violet-400 group-hover:text-cyan-400 transition-colors" />
        </div>
        <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{title}</h3>
        <p className="text-white/50 text-[15px] leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  </motion.div>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 selection:bg-violet-500/30 overflow-x-hidden">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 lg:pt-64 lg:pb-48 px-6">
        {/* Cinematic Grid Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-600/20 via-slate-950/0 to-transparent opacity-50" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150" />
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-10 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">AI Core v4.0 Enterprise</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mb-10 leading-[0.9]"
          >
            INTELLIGENCE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">UNLEASHED</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-white/40 mb-14 leading-relaxed font-medium"
          >
            The world's first emotionally aware AI ecosystem built for high-stakes enterprise customer care. Hyper-precision, semantic memory, and autonomous hindsight.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/dashboard" className="w-full sm:w-auto px-10 py-5 bg-violet-600 text-white rounded-[2.5rem] font-black text-lg shadow-[0_20px_50px_rgba(139,92,246,0.3)] hover:shadow-[0_25px_60px_rgba(139,92,246,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group overflow-hidden relative">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              LAUNCH PLATFORM
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] font-black text-lg text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-3">
              <Command className="w-5 h-5 text-indigo-400" />
              VIEW PROTOCOLS
            </button>
          </motion.div>
        </div>
      </section>

      {/* Brands Scrolling (Simulation) */}
      <section className="py-20 border-y border-white/[0.05] overflow-hidden whitespace-nowrap bg-white/[0.01]">
        <div className="flex gap-20 animate-marquee items-center opacity-30 grayscale">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex items-center gap-3 text-2xl font-black text-white italic">
              <Cpu className="w-8 h-8" />
              NEURAL_NODE_{i}00
            </div>
          ))}
          {/* Duplicate for seamless scroll */}
          {[1,2,3,4,5,6].map(i => (
            <div key={`dup-${i}`} className="flex items-center gap-3 text-2xl font-black text-white italic">
              <Cpu className="w-8 h-8" />
              NEURAL_NODE_{i}00
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 lg:py-48 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-10">
            <div className="max-w-2xl">
              <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-8 leading-none uppercase">Neural <br />Architecture</h2>
              <p className="text-white/40 text-xl font-medium leading-relaxed italic">
                "Our infrastructure isn't just code. It's a high-dimensional emotional matrix designed to bridge the gap between human empathy and AI's infinite scalability."
              </p>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white/60 text-xs font-black tracking-widest uppercase">Nodes: 14k+</div>
              <div className="px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black tracking-widest uppercase">Core: Nominal</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            <FeatureCard 
              icon={Mic2} 
              title="Voice Tone Matrix" 
              description="High-frequency tonal analysis scans for frustration, hesitation, and emotional nuance in real-time vocal streams."
              delay={0.1}
            />
            <FeatureCard 
              icon={MessageSquare} 
              title="Semantic Intent" 
              description="Proprietary NLU engine deciphers human intent with 99.9% accuracy, understanding slang and cultural context."
              delay={0.2}
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="AI Oversight" 
              description="A dedicated supervisor model monitors all tier-1 interactions, intervening automatically during high-stress spikes."
              delay={0.3}
            />
            <FeatureCard 
              icon={Database} 
              title="Hyper-Retrieval" 
              description="Vector-based long-term memory ensures the AI never forgets a customer's specific technical history or preferences."
              delay={0.4}
            />
            <FeatureCard 
              icon={History} 
              title="Hindsight Algo" 
              description="Autonomous optimization cycles analyze past interactions to refine response weights for future perfection."
              delay={0.5}
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Neural Insights" 
              description="Real-time glass-box dashboards visualizing the global emotional health of your customer ecosystem."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Logic Flow Visualization */}
      <section id="workflow" className="py-32 lg:py-48 px-6 bg-white/[0.01] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-10">
                <Layout className="w-8 h-8 text-violet-400" />
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-10 leading-none uppercase">The Cognitive <br />Cycle</h2>
              <div className="space-y-12">
                {[
                  { t: 'Synaptic Input', d: 'Inbound message processed via semantic & emotional encoders in under 80ms.' },
                  { t: 'History Retrieval', d: 'Hyper-indexed search of 5+ years of customer context and resolution patterns.' },
                  { t: 'Supervised Response', d: 'Response drafted, verified against ethics protocols, and deployed with empathy.' },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex gap-8 group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-sm font-black text-white/20 group-hover:border-violet-500 group-hover:text-violet-400 transition-all duration-500">
                      0{i + 1}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-white mb-3 group-hover:translate-x-2 transition-transform duration-500">{item.t}</h4>
                      <p className="text-white/40 text-lg font-medium italic">"{item.d}"</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-10 bg-violet-600/10 rounded-full blur-[120px] transition-all duration-1000 group-hover:bg-violet-600/20" />
              <div className="relative p-[1px] rounded-[3rem] bg-gradient-to-br from-white/20 via-transparent to-transparent">
                <div className="bg-slate-950/90 backdrop-blur-3xl rounded-[3rem] overflow-hidden border border-white/[0.05] shadow-2xl">
                  <div className="px-8 py-5 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
                    <div className="flex gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/30" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/30" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/30" />
                    </div>
                    <span className="text-[10px] font-black text-white/20 tracking-[0.4em] uppercase">Core_Trace_Log</span>
                  </div>
                  <div className="p-10 font-mono text-[13px] leading-relaxed space-y-6">
                    <p className="text-violet-400/80 tracking-tight"><span className="text-white/20">{" >> "}</span> DETECT_STATE: <span className="px-2 py-0.5 rounded bg-violet-500/10 font-black text-violet-300">FRUSTRATION_INDEX_92</span></p>
                    <p className="text-cyan-400/80 tracking-tight"><span className="text-white/20">{" >> "}</span> MEMORY_LOC: <span className="text-white/70 italic">MATCH_IDENTIFIED_ID_00X12</span></p>
                    <p className="text-fuchsia-400/80 tracking-tight"><span className="text-white/20">{" >> "}</span> SUPERVISOR: <span className="text-emerald-400 font-bold">BYPASS_AUTHORIZED</span></p>
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-white/50 leading-relaxed italic">
                      "Analyzing past interactions with user John D. Identified pattern: High preference for direct technical fixes over empathetic padding. Calibrating response..."
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Output Ready: T-0.12ms</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-48 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black text-white mb-12 tracking-tighter leading-none"
          >
            HYPER <br />SCALABILITY.
          </motion.h2>
          <p className="text-2xl text-white/40 mb-16 font-medium italic max-w-3xl mx-auto leading-relaxed">
            "We are not here to replace human support. We are here to make it infinite."
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link to="/dashboard" className="w-full sm:w-auto px-12 py-6 bg-white text-slate-950 rounded-[2.5rem] font-black text-xl hover:scale-105 transition-transform shadow-[0_30px_60px_rgba(255,255,255,0.1)]">
              EXPLORE CORE
            </Link>
            <button className="w-full sm:w-auto px-12 py-6 bg-white/[0.03] border border-white/10 text-white rounded-[2.5rem] font-black text-xl hover:bg-white/[0.08] transition-all">
              ENTERPRISE API
            </button>
          </div>
        </div>
      </section>

      {/* Final Footer Info */}
      <footer className="py-20 border-t border-white/[0.05] px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4 group">
            <div className="p-3 rounded-xl bg-violet-600/20 border border-violet-500/30 group-hover:rotate-12 transition-transform">
              <BrainCircuit className="w-6 h-6 text-violet-400" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">NEURA_PLATFORM</span>
          </div>
          <div className="flex flex-wrap justify-center gap-10 text-xs font-black text-white/20 uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-violet-400 transition-colors">Neural_Ethics</a>
            <a href="#" className="hover:text-violet-400 transition-colors">Open_API_Log</a>
            <a href="#" className="hover:text-violet-400 transition-colors">Security_Ops</a>
          </div>
          <p className="text-xs font-black text-white/10 uppercase tracking-widest">© 2026 Neura Systems. All Core modules active.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
