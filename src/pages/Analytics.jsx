import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  BrainCircuit,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';
import RiskHeatmap from '../components/RiskHeatmap';
import { 
  Line, 
  Doughnut, 
  Radar, 
  Bar,
  Pie
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale
);

const Analytics = () => {
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10 }, padding: 20, usePointStyle: true }
      }
    }
  };

  const emotionData = {
    labels: ['Happy', 'Frustrated', 'Angry', 'Confused', 'Neutral'],
    datasets: [{
      data: [35, 25, 10, 15, 15],
      backgroundColor: [
        'rgba(16, 185, 129, 0.6)',
        'rgba(245, 158, 11, 0.6)',
        'rgba(239, 68, 68, 0.6)',
        'rgba(249, 115, 22, 0.6)',
        'rgba(6, 182, 212, 0.6)',
      ],
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
    }]
  };

  const trendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Satisfaction',
        data: [85, 88, 82, 94, 91, 95, 98],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Interventions',
        data: [12, 10, 15, 8, 11, 7, 5],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const capabilityData = {
    labels: ['Empathy', 'Reasoning', 'Accuracy', 'Context', 'Speed', 'Stability'],
    datasets: [{
      label: 'AI Performance Index',
      data: [88, 92, 95, 84, 98, 91],
      backgroundColor: 'rgba(6, 182, 212, 0.2)',
      borderColor: '#06b6d4',
      borderWidth: 2,
    }]
  };

  const successData = {
    labels: ['Resolution', 'Escalation', 'Fallback'],
    datasets: [{
      label: 'Success Rate',
      data: [78, 15, 7],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      hoverOffset: 4
    }]
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Enterprise Analytics</h1>
          <p className="text-white/40 mt-1">Deep-layer performance benchmarks and emotional demographics.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/60">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </div>
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20">
            <Download className="w-4 h-4" />
            Export Insights
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Avg. Satisfaction" value={92} target={95} suffix="%" trend="up" percentage="+4.2%" />
        <StatCard label="Inference Speed" value={142} target={120} suffix="ms" trend="up" percentage="-15ms" />
        <StatCard label="Escalation Rate" value={12} target={15} suffix="%" trend="down" percentage="-3.1%" />
        <StatCard label="Success Rate" value={98.8} target={99.5} suffix="%" trend="up" percentage="+0.4%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Trend Chart */}
        <GlassCard className="lg:col-span-2 min-h-[400px] border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <TrendingUp className="w-5 h-5 text-primary-neon" />
                 <h3 className="text-sm font-bold text-white uppercase tracking-widest">Growth & Intervention Trends</h3>
              </div>
           </div>
           <div className="h-[300px]">
              <Line 
                 data={trendData} 
                 options={{
                    ...commonOptions,
                    scales: {
                       x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } } },
                       y: { grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } } }
                    }
                 }} 
              />
           </div>
        </GlassCard>

        {/* Emotion Dist Chart */}
        <GlassCard className="border-white/5">
           <div className="flex items-center gap-3 mb-8">
              <PieIcon className="w-5 h-5 text-secondary-neon" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Emotion Demographics</h3>
           </div>
           <div className="h-[300px]">
              <Doughnut 
                 data={emotionData} 
                 options={{
                    ...commonOptions,
                    cutout: '70%',
                    plugins: { ...commonOptions.plugins, legend: { position: 'bottom' } }
                 }} 
              />
           </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {/* Success Rate Pie */}
         <GlassCard className="border-white/5">
            <div className="flex items-center gap-3 mb-8">
               <ShieldCheck className="w-5 h-5 text-accent-neon" />
               <h3 className="text-sm font-bold text-white uppercase tracking-widest">Outcome Ratios</h3>
            </div>
            <div className="h-[250px]">
               <Pie data={successData} options={commonOptions} />
            </div>
         </GlassCard>

         {/* Capability Radar */}
         <GlassCard className="border-white/5">
            <div className="flex items-center gap-3 mb-8">
               <BrainCircuit className="w-5 h-5 text-primary-neon" />
               <h3 className="text-sm font-bold text-white uppercase tracking-widest">Model Capability Index</h3>
            </div>
            <div className="h-[250px]">
               <Radar 
                 data={capabilityData} 
                 options={{
                    ...commonOptions,
                    scales: {
                       r: {
                          angleLines: { color: 'rgba(255,255,255,0.05)' },
                          grid: { color: 'rgba(255,255,255,0.05)' },
                          suggestedMin: 50,
                          pointLabels: { color: 'rgba(255,255,255,0.5)', font: { size: 9 } },
                          ticks: { display: false }
                       }
                    }
                 }} 
               />
            </div>
         </GlassCard>

         {/* Frustration Heatmap Wrapper */}
         <GlassCard className="border-white/5">
            <div className="flex items-center gap-3 mb-8">
               <Users className="w-5 h-5 text-orange-500" />
               <h3 className="text-sm font-bold text-white uppercase tracking-widest">Frustration Heatmap</h3>
            </div>
            <div className="h-[250px]">
                <RiskHeatmap />
                <div className="mt-8 flex justify-between items-center px-4">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded bg-accent/20" />
                      <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Neutral</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded bg-amber-500/50" />
                      <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Rising</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.3)]" />
                      <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Critical</span>
                   </div>
                </div>
            </div>
         </GlassCard>
      </div>

      {/* Learning Efficiency Bar */}
      <GlassCard className="bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent border-primary/20">
         <div className="flex flex-col md:flex-row items-center gap-8 py-2">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary-neon flex-shrink-0">
               <Zap className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center md:text-left">
               <h3 className="text-xl font-bold text-white mb-2">Neural Learning Efficiency: 94.2%</h3>
               <p className="text-sm text-white/50">The Hindsight Engine has improved response quality by an average of 12.4% across all emotional sectors this month.</p>
            </div>
            <div className="w-full md:w-64 h-3 bg-white/5 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: '94.2%' }} className="h-full bg-gradient-to-r from-primary to-secondary neon-glow" />
            </div>
         </div>
      </GlassCard>
    </div>
  );
};

export default Analytics;
