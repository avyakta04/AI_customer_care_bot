import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import EmotionChart from '../charts/EmotionChart';
import CoreArchitecturePipeline from '../components/CoreArchitecturePipeline';
import { 
  Users, 
  Activity, 
  Zap, 
  ShieldAlert, 
  ArrowUpRight, 
  MessageSquareText, 
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  // Live fluctuating states for stats grid
  const [sessions, setSessions] = useState(1284);
  const [supervisionRate, setSupervisionRate] = useState(99.4);
  const [recoveryRate, setRecoveryRate] = useState(88.2);
  const [interventions, setInterventions] = useState(12);

  // Stateful supervisor feed
  const [feedEvents, setFeedEvents] = useState([
    { id: 1, sid: "8291", time: "2m ago", text: "Customer showing frustration patterns in sector 7G", pulse: true },
    { id: 2, sid: "8292", time: "8m ago", text: "Vector memory search hit confidence > 98%", pulse: false },
    { id: 3, sid: "8293", time: "12m ago", text: "Supervisor approved empathetic cache response", pulse: false },
    { id: 4, sid: "8294", time: "15m ago", text: "Learning cycle complete: weights synchronized", pulse: false }
  ]);

  useEffect(() => {
    const statsInterval = setInterval(() => {
      // Oscillate stats slightly to simulate live transaction monitoring
      setSessions(prev => Math.max(1200, Math.min(1400, prev + Math.round((Math.random() - 0.5) * 8))));
      setSupervisionRate(prev => Math.max(98.5, Math.min(99.9, prev + (Math.random() - 0.5) * 0.1)));
      setRecoveryRate(prev => Math.max(85.0, Math.min(92.0, prev + (Math.random() - 0.5) * 0.3)));
      setInterventions(prev => Math.max(8, Math.min(22, prev + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0))));
    }, 3000);

    const feedInterval = setInterval(() => {
      const liveAlerts = [
        { text: "Detected tone sync latency spike in session #8310", pulse: true },
        { text: "Direct resolution bypass authorized for sector 3F", pulse: false },
        { text: "Emotion Engine: Customer sentiment recovered to Happy", pulse: false },
        { text: "ChromaDB memory indexing synchronized successfully", pulse: false },
        { text: "Hallucination Risk assessment: NOMINAL (0.01%)", pulse: false }
      ];

      const nextAlert = liveAlerts[Math.floor(Math.random() * liveAlerts.length)];
      const nextSid = Math.floor(Math.random() * 900) + 8200;
      
      setFeedEvents(prev => [
        {
          id: Date.now(),
          sid: nextSid.toString(),
          time: "Just now",
          text: nextAlert.text,
          pulse: nextAlert.pulse
        },
        ...prev.slice(0, 3)
      ]);
    }, 5000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(feedInterval);
    };
  }, []);

  const stats = [
    { label: 'Active Sessions', value: sessions.toLocaleString(), change: '+12%', icon: Users, color: 'text-violet-400', glow: 'shadow-[0_0_15px_rgba(139,92,246,0.2)]', border: 'border-violet-500/20', hoverBg: 'hover:bg-violet-950/10' },
    { label: 'AI Supervision Rate', value: `${supervisionRate.toFixed(1)}%`, change: '+0.2%', icon: Activity, color: 'text-cyan-400', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.2)]', border: 'border-cyan-500/20', hoverBg: 'hover:bg-cyan-950/10' },
    { label: 'Emotion Recovery', value: `${recoveryRate.toFixed(1)}%`, change: '+5.4%', icon: Zap, color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]', border: 'border-emerald-500/20', hoverBg: 'hover:bg-emerald-950/10' },
    { label: 'Risk Interventions', value: interventions.toString(), change: '-3', icon: ShieldAlert, color: 'text-amber-400', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]', border: 'border-amber-500/20', hoverBg: 'hover:bg-amber-950/10' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">AI Command Center</h1>
          <p className="text-white/40 mt-1 text-sm font-medium">Real-time monitoring of emotion-aware neural processors.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 active:scale-[0.98] transition-all duration-300">
            <Cpu className="w-4 h-4 text-violet-400 animate-spin-slow" />
            Neural Reboot
          </button>
          <button className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:brightness-110 active:scale-[0.98] transition-all duration-300">
            Export Logs
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <GlassCard key={idx} className={`border border-white/5 hover:${stat.border} ${stat.hoverBg} transition-colors duration-500`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-2xl bg-white/[0.04] ${stat.color} ${stat.glow} border border-white/5`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">{stat.label}</h3>
            <p className="text-3xl font-black text-white tracking-tighter leading-none">{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Core Architecture Pipeline (Emotion, Memory, Supervisor, Hindsight Learning) */}
      <CoreArchitecturePipeline />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <GlassCard className="lg:col-span-2 relative overflow-hidden border border-white/5 hover:border-violet-500/20 transition-colors duration-500">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Neural Response Analytics</h2>
              <p className="text-xs text-white/40 font-medium">Emotion satisfaction vs. system stress levels</p>
            </div>
            <select className="bg-slate-900 border border-white/10 rounded-xl text-xs text-white/70 px-3.5 py-2 focus:outline-none focus:border-violet-500/50 hover:bg-slate-800 transition-colors cursor-pointer">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="relative z-10">
            <EmotionChart />
          </div>
        </GlassCard>

        {/* Live Feed */}
        <GlassCard className="border border-white/5 hover:border-cyan-500/20 transition-colors duration-500 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white tracking-tight">AI Supervisor Feed</h2>
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </div>
            </div>
            <div className="space-y-4 min-h-[300px]">
              <AnimatePresence mode="popLayout">
                {feedEvents.map((evt) => (
                  <motion.div 
                    key={evt.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex gap-4 group cursor-pointer p-2.5 rounded-2xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all duration-300"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-violet-500/40 group-hover:bg-violet-500/5 transition-all duration-300">
                        <MessageSquareText className="w-5 h-5 text-white/40 group-hover:text-violet-400 transition-colors" />
                      </div>
                      {evt.pulse && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-slate-950" />
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black text-white/80 group-hover:text-violet-300 transition-colors">Session #{evt.sid}</h4>
                        <span className="text-[10px] text-white/30 font-mono font-semibold">{evt.time}</span>
                      </div>
                      <p className="text-xs text-white/50 mt-1 truncate group-hover:text-white/80 transition-colors">{evt.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <button className="w-full mt-6 py-3 text-[10px] font-black text-violet-400 border border-violet-500/20 rounded-2xl hover:bg-violet-500/10 transition-all duration-300 uppercase tracking-widest leading-none active:scale-[0.98]">
            View All Events
          </button>
        </GlassCard>
      </div>

      {/* Hindsight Learning Banner */}
      <GlassCard className="bg-gradient-to-r from-violet-500/10 via-cyan-500/5 to-transparent border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.05)] hover:border-violet-500/30 transition-all duration-500" hover={false}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="hidden md:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 items-center justify-center text-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.15)] flex-shrink-0">
            <ArrowUpRight className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-lg font-bold text-white tracking-tight">Hindsight Learning Cycle Complete</h2>
            <p className="text-xs text-white/50 mt-1 max-w-2xl font-medium leading-relaxed">
              Neural weights updated based on last week's edge cases. AI accuracy improved by <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-lg ml-0.5 shadow-[0_0_10px_rgba(16,185,129,0.15)]">2.4%</span> across all emotion sectors.
            </p>
          </div>
          <button className="px-5 py-2.5 bg-white text-slate-950 font-bold rounded-2xl text-xs uppercase tracking-wider hover:bg-white/90 active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            Review Updates
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard;
