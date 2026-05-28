import React from 'react';
import GlassCard from '../components/GlassCard';
import EmotionChart from '../charts/EmotionChart';
import { 
  Users, 
  Activity, 
  Zap, 
  ShieldAlert, 
  ArrowUpRight, 
  MessageSquareText, 
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Active Sessions', value: '1,284', change: '+12%', icon: Users, color: 'text-primary-neon' },
  { label: 'AI Supervision Rate', value: '99.4%', change: '+0.2%', icon: Activity, color: 'text-secondary-neon' },
  { label: 'Emotion Recovery', value: '88.2%', change: '+5.4%', icon: Zap, color: 'text-accent-neon' },
  { label: 'Risk Interventions', value: '12', change: '-3', icon: ShieldAlert, color: 'text-amber-400' },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AI Command Center</h1>
          <p className="text-white/40 mt-1">Real-time monitoring of emotion-aware neural processors.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 glass-button rounded-xl text-sm font-semibold flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Neural Reboot
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:brightness-110 transition-all">
            Export Logs
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <GlassCard key={idx}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md bg-white/5 ${stat.change.startsWith('+') ? 'text-accent-neon' : 'text-amber-400'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider">{stat.label}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-white">Neural Response Analytics</h2>
              <p className="text-xs text-white/40">Emotion satisfaction vs. system stress levels</p>
            </div>
            <select className="bg-white/5 border border-white/10 rounded-lg text-xs text-white/70 px-3 py-1.5 focus:outline-none">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <EmotionChart />
        </GlassCard>

        {/* Live Feed */}
        <GlassCard>
          <h2 className="text-lg font-bold text-white mb-6">AI Supervisor Feed</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <MessageSquareText className="w-5 h-5 text-white/40 group-hover:text-primary-neon transition-colors" />
                  </div>
                  {i === 1 && <div className="absolute top-0 right-0 w-3 h-3 bg-accent-neon rounded-full border-2 border-background" />}
                </div>
                <div className="flex-1 border-b border-white/5 pb-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-white/90">Session #829{i}</h4>
                    <span className="text-[10px] text-white/30 font-mono">1{i}m ago</span>
                  </div>
                  <p className="text-xs text-white/50 mt-1 line-clamp-1">Customer showing frustration patterns in sector 7G...</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-xs font-bold text-primary-neon border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors uppercase tracking-widest leading-none">
            View All Events
          </button>
        </GlassCard>
      </div>

      {/* Hindsight Learning Banner */}
      <GlassCard className="bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent border-primary/20" hover={false}>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex w-16 h-16 rounded-2xl bg-primary/20 items-center justify-center text-primary-neon shadow-[0_0_30px_rgba(139,92,246,0.2)]">
            <ArrowUpRight className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">Hindsight Learning Cycle Complete</h2>
            <p className="text-sm text-white/60 mt-1 max-w-2xl">
              Neural weights updated based on last week's edge cases. AI accuracy improved by <span className="text-accent-neon font-bold">2.4%</span> across all emotion sectors.
            </p>
          </div>
          <button className="px-6 py-2 bg-white text-background rounded-xl text-sm font-bold hover:scale-105 transition-transform">
            Review Updates
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard;
