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
  Plus
} from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import GlassCard from '../components/GlassCard';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
  >
    <GlassCard className="h-full border-white/5 hover:border-primary/20 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:neon-glow transition-all">
        <Icon className="w-6 h-6 text-primary-neon" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </GlassCard>
  </motion.div>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-accent-neon animate-pulse" />
            <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Next-Gen AI Core v4.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8"
          >
            Emotionally Intelligent <br />
            <span className="text-gradient">Customer Support</span> That Learns
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto text-lg md:text-xl text-white/50 mb-12 leading-relaxed"
          >
            An AI-powered customer care ecosystem combining emotion detection, semantic memory retrieval, AI supervision, and self-correcting hindsight learning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/dashboard" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30 hover:scale-105 transition-transform flex items-center gap-2 group">
              Launch Demo Center
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 glass-button rounded-2xl font-bold text-lg text-white">
              Watch Neural Workflow
            </button>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] animate-pulse-slow" />
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] animate-pulse-slow delay-700" />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-4">Neural Infrastructure</h2>
            <p className="text-white/40 max-w-2xl mx-auto font-medium">The foundation of our cognitive customer care platform, built for enterprise-scale empathy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Mic2} 
              title="Voice Emotion Detection" 
              description="Real-time tonal analysis of vocal patterns to detect frustration, satisfaction, or urgency in customer voices."
              delay={0.1}
            />
            <FeatureCard 
              icon={MessageSquare} 
              title="Text Sentiment Core" 
              description="Deep semantic analysis of chat messages, identifying subtle emotional cues and intent variations."
              delay={0.2}
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="AI Supervisor Agent" 
              description="High-level monitoring system that intercedes when the primary bot detects high-risk emotional states."
              delay={0.3}
            />
            <FeatureCard 
              icon={Database} 
              title="Semantic Memory" 
              description="Longterm retrieval system that remembers customer preferences and past interactions across years."
              delay={0.4}
            />
            <FeatureCard 
              icon={History} 
              title="Hindsight Learning" 
              description="Self-correcting algorithm that re-evaluates past failures to autonomously update future response weights."
              delay={0.5}
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Real-Time Analytics" 
              description="Live visualization of the emotional health of your customer base and AI performance benchmarks."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Workflow Visualization */}
      <section id="workflow" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-lg mb-6">
                <Zap className="w-4 h-4 text-secondary-neon fill-secondary-neon" />
                <span className="text-[10px] font-bold text-secondary-neon uppercase tracking-wider">Live Logic Flow</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">Cognitive Processing Loop</h2>
              <p className="text-white/50 text-lg mb-8 leading-relaxed">
                Unlike traditional chatbots, E-Aware processes information through multiple neural layers, ensuring every response is calibrated for the current emotional context.
              </p>
              
              <ul className="space-y-6">
                {[
                  { t: 'Inbound Analysis', d: 'Emotion & Intent classified in <100ms' },
                  { t: 'Memory Context', d: 'Retrieval of historical interaction patterns' },
                  { t: 'Supervised Generation', d: 'Response drafted and verified by Risk-check AI' },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-secondary-neon font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{item.t}</h4>
                      <p className="text-sm text-white/40">{item.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-secondary/20 rounded-full blur-[100px] -z-10" />
              <GlassCard className="p-0 overflow-hidden border-white/10" hover={false}>
                <div className="bg-white/5 p-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">System_Logic_Trace</span>
                </div>
                <div className="p-8 font-mono text-xs text-secondary-neon space-y-4">
                  <p className=""><span className="text-white/30">{">>"}</span> DETECTING_EMOTION: <span className="p-1 rounded bg-secondary/20 font-bold">FRUSTRATION_LEVEL_HIGH</span></p>
                  <p className=""><span className="text-white/30">{">>"}</span> SEARCHING_MEMORY: <span className="text-white/80">MATCH_FOUND (TID_992)</span></p>
                  <p className=""><span className="text-white/30">{">>"}</span> AI_SUPERVISOR: <span className="text-accent-neon">INTERVENTION_BYPASSED_SAFE</span></p>
                  <p className=""><span className="text-white/30">{">>"}</span> EXECUTING_RESPONSE: <span className="text-white/80 italic">"I understand your frustration, John. I see we addressed this similar issue last October..."</span></p>
                  <div className="w-full h-px bg-white/5 my-4" />
                  <p className="animate-pulse text-[10px] uppercase text-white/20 tracking-tighter">Hindsight learning cycle scheduled: T+12h</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Hindsight Section */}
      <section id="hindsight" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
             <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <History className="w-8 h-8 text-primary-neon" />
             </div>
             <h2 className="text-4xl font-bold text-white mb-6">Self-Correcting Hindsight Learning</h2>
             <p className="text-white/50 text-lg">
               Our proprietary Hindsight Algorithm analyzes every interaction at the end of each duty cycle, comparing predicted outcomes with actual customer satisfaction.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
              <h4 className="text-primary-neon font-bold uppercase tracking-widest text-[10px] mb-4">The Problem</h4>
              <h3 className="text-2xl font-bold text-white mb-4">Static AI Decay</h3>
              <p className="text-white/40 leading-relaxed">
                Most AI models become static after deployment. They repeat errors and fail to adapt to changing customer vernacular or sentiment shifts.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 shadow-2xl shadow-primary/5">
              <h4 className="text-accent-neon font-bold uppercase tracking-widest text-[10px] mb-4">Our Solution</h4>
              <h3 className="text-2xl font-bold text-white mb-4">Autonomous Evolution</h3>
              <p className="text-white/70 leading-relaxed font-medium">
                E-Aware utilizes a feedback loop that identifies "Emotional Mismatches" and automatically refines its neural weights to ensure errors are never repeated twice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-32 px-6 bg-gradient-to-t from-primary/10 to-transparent">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">Ready for Empathic Scalability?</h2>
          <p className="text-xl text-white/50 mb-12">Join the next generation of customer care where AI doesn't just respond—it understands.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/dashboard" className="w-full sm:w-auto px-10 py-5 bg-white text-background rounded-2xl font-bold text-lg hover:scale-105 transition-transform">
              Explore Dashboard
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 bg-primary/20 border border-primary/30 text-white rounded-2xl font-bold text-lg hover:bg-primary/30 transition-all">
              Schedule Enterprise Demo
            </button>
          </div>
        </div>
      </section>

      {/* Final Footer Info */}
      <footer className="py-12 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <BrainCircuit className="w-5 h-5" />
            <span className="text-sm font-bold tracking-tight text-white uppercase">E-Aware Platform</span>
          </div>
          <div className="flex gap-8 text-xs text-white/30 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Neural Ethics</a>
            <a href="#" className="hover:text-white transition-colors">Model Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Enterprise SLA</a>
          </div>
          <p className="text-xs text-white/20">© 2026 E-Aware Cognitive Systems. All protocols active.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
