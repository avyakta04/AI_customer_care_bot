import React, { useState, useEffect } from 'react';
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
  Filter,
  Zap,
  Activity,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';
import RiskHeatmap from '../components/RiskHeatmap';
import { 
  Line, 
  Doughnut, 
  Radar, 
  Bar,
  Pie,
  PolarArea
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
  LinearScale,
  Filler,
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
  LinearScale,
  Filler
);

const Analytics = () => {
  const [escalations, setEscalations] = useState([15, 12, 18, 10, 8, 14, 9]);
  const [resolved, setResolved] = useState([85, 88, 82, 90, 92, 86, 91]);
  const [emotions, setEmotions] = useState([42, 18, 8, 12, 20]);
  const [csat, setCsat] = useState([92, 88, 85, 78, 95, 82]);
  const [interventions, setInterventions] = useState([2, 5, 12, 8, 15, 6]);

  const [resonance, setResonance] = useState(88.4);
  const [latency, setLatency] = useState(142);
  const [escalationRate, setEscalationRate] = useState(8);
  const [resSpeed, setResSpeed] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time metric shifts
      setEscalations(prev => [...prev.slice(1), Math.max(4, Math.min(25, prev[prev.length - 1] + Math.round((Math.random() - 0.5) * 6)))]);
      setResolved(prev => [...prev.slice(1), Math.max(70, Math.min(99, prev[prev.length - 1] + Math.round((Math.random() - 0.5) * 8)))]);
      
      setEmotions(prev => {
        const next = prev.map(val => Math.max(5, Math.min(50, val + Math.round((Math.random() - 0.5) * 4))));
        const sum = next.reduce((a, b) => a + b, 0);
        return next.map(v => Math.round((v / sum) * 100)); // Normalize
      });

      setCsat(prev => prev.map(v => Math.max(70, Math.min(98, v + Math.round((Math.random() - 0.5) * 4)))));
      setInterventions(prev => prev.map(v => Math.max(0, Math.min(25, v + Math.round((Math.random() - 0.5) * 5)))));

      // Oscillate Stat Cards
      setResonance(prev => Math.max(82, Math.min(96, prev + (Math.random() - 0.5) * 2)));
      setLatency(prev => Math.max(110, Math.min(160, prev + Math.round((Math.random() - 0.5) * 10))));
      setEscalationRate(prev => Math.max(4, Math.min(14, prev + (Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0))));
      setResSpeed(prev => Math.max(25, Math.min(55, prev + Math.round((Math.random() - 0.5) * 6))));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { 
          color: 'rgba(15, 23, 42, 0.6)', 
          font: { size: 10, family: "'Inter', sans-serif" }, 
          padding: 20, 
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#0f172a',
        bodyColor: 'rgba(15, 23, 42, 0.7)',
        borderColor: 'rgba(15, 23, 42, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    }
  };

  const emotionData = {
    labels: ['Happy', 'Frustrated', 'Angry', 'Confused', 'Neutral'],
    datasets: [{
      data: emotions,
      backgroundColor: [
        'rgba(16, 185, 129, 0.5)',
        'rgba(245, 158, 11, 0.5)',
        'rgba(239, 68, 68, 0.5)',
        'rgba(249, 115, 22, 0.5)',
        'rgba(30, 58, 138, 0.5)',
      ],
      hoverBackgroundColor: [
        '#10b981', '#f59e0b', '#ef4444', '#f97316', '#1E3A8A'
      ],
      borderColor: 'rgba(15, 23, 42, 0.05)',
      borderWidth: 2,
    }]
  };

  const escalationTrendData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Escalations',
        data: escalations,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'Resolved',
        data: resolved,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
      }
    ]
  };

  const successRateData = {
    labels: ['Direct Resolution', 'AI Handled', 'Human Handoff'],
    datasets: [{
      data: [65, 25, 10],
      backgroundColor: [
        'rgba(30, 58, 138, 0.6)',
        'rgba(212, 175, 55, 0.6)',
        'rgba(37, 99, 235, 0.6)',
      ],
      borderColor: 'rgba(15, 23, 42, 0.05)',
      borderWidth: 1,
    }]
  };

  const csatRadarData = {
    labels: ['Response Speed', 'Accuracy', 'Empathy', 'Complexity', 'Stability', 'Context'],
    datasets: [
      {
        label: 'Current Month',
        data: csat,
        backgroundColor: 'rgba(30, 58, 138, 0.2)',
        borderColor: '#1E3A8A',
        borderWidth: 2,
        pointBackgroundColor: '#1E3A8A',
      },
      {
        label: 'Target',
        data: [95, 95, 90, 85, 98, 90],
        backgroundColor: 'transparent',
        borderColor: 'rgba(15, 23, 42, 0.1)',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
      }
    ]
  };

  const interventionData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [{
      label: 'Supervisor Interventions',
      data: interventions,
      backgroundColor: 'rgba(212, 175, 55, 0.2)',
      borderColor: '#D4AF37',
      borderWidth: 2,
      fill: true,
      tension: 0.5
    }]
  };

  const learningEfficiencyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Standard AI',
        data: [65, 68, 70, 72],
        borderColor: 'rgba(15, 23, 42, 0.2)',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        tension: 0.3
      },
      {
        label: 'Hindsight AI',
        data: [65, 75, 88, 94],
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  return (
    <div className="space-y-8 pb-20 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3"
          >
            <Activity className="w-8 h-8 text-[#1E3A8A]" />
            ECHOMIND Analytics <span className="text-secondary font-light text-xl">v4.0</span>
          </motion.h1>
          <p className="text-slate-500 mt-1 uppercase tracking-[0.3em] text-[10px] font-bold">Deep-layer performance benchmarks & emotional intelligence datasets</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Active Model</span>
              <span className="text-xs text-slate-800 font-bold">GPT-4.0-O1 Hindsight</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <button className="flex items-center gap-2 px-6 py-2 bg-gradient-premium text-white rounded-xl font-bold text-sm hover:brightness-110 shadow-sm transition-all">
            <Download className="w-4 h-4" />
            Report.pdf
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Emotional Resonance" value={resonance} target={95} suffix="%" trend="up" percentage="+12.4%" />
        <StatCard label="Inference Latency" value={latency} target={120} suffix="ms" trend="down" percentage="-14ms" />
        <StatCard label="Critical Escalations" value={escalationRate} target={15} suffix="%" trend="up" percentage="-4.2%" />
        <StatCard label="Resolution Speed" value={resSpeed} target={30} suffix="s" trend="up" percentage="-12s" />
      </div>

      {/* Main Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Escalation Trends - 8 Cols */}
        <GlassCard className="lg:col-span-8 min-h-[400px] border-slate-200/80 bg-white/70 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                 </div>
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Escalation & Resolution Flux</h3>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-slate-100 rounded text-[10px] text-slate-500 font-bold">Real-time</span>
              </div>
           </div>
           <div className="h-[300px]">
              <Line 
                 data={escalationTrendData} 
                 options={{
                    ...commonOptions,
                    scales: {
                       x: { grid: { display: false }, ticks: { color: 'rgba(15,23,42,0.4)', font: { size: 9 } } },
                       y: { grid: { color: 'rgba(15,23,42,0.05)' }, border: { display: false }, ticks: { color: 'rgba(15,23,42,0.4)', font: { size: 9 } } }
                    }
                 }} 
              />
           </div>
        </GlassCard>

        {/* Emotion Dist - 4 Cols */}
        <GlassCard className="lg:col-span-4 border-slate-200/80 bg-white/70 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-secondary/10 rounded-lg">
                 <PieIcon className="w-4 h-4 text-secondary" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Emotion Demographics</h3>
            </div>
           <div className="h-[300px]">
              <Doughnut 
                 data={emotionData} 
                 options={{
                    ...commonOptions,
                    cutout: '75%',
                    plugins: { ...commonOptions.plugins, legend: { position: 'bottom' } }
                  }} 
              />
           </div>
        </GlassCard>

        {/* Conversation Success - 4 Cols */}
        <GlassCard className="lg:col-span-4 border-slate-200/80 bg-white/70 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg">
                 <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Success Rate Outcome</h3>
            </div>
           <div className="h-[280px]">
              <Pie 
                 data={successRateData} 
                 options={commonOptions} 
              />
           </div>
        </GlassCard>

        {/* CSAT Radar - 4 Cols */}
        <GlassCard className="lg:col-span-4 border-slate-200/80 bg-white/70 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-50 rounded-lg">
                 <UserCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Satisfaction Vectors</h3>
           </div>
           <div className="h-[280px]">
              <Radar 
                 data={csatRadarData} 
                 options={{
                    ...commonOptions,
                    scales: {
                       r: {
                          angleLines: { color: 'rgba(15,23,42,0.05)' },
                          grid: { color: 'rgba(15,23,42,0.05)' },
                          suggestedMin: 50,
                          pointLabels: { color: 'rgba(15,23,42,0.6)', font: { size: 8, weight: 'bold' } },
                          ticks: { display: false }
                       }
                    }
                 }} 
              />
           </div>
        </GlassCard>

        {/* Frustration Heatmap - 4 Cols */}
        <GlassCard className="lg:col-span-4 border-slate-200/80 bg-white/70 shadow-sm overflow-hidden">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-orange-50 rounded-lg">
                 <Users className="w-4 h-4 text-orange-500" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Frustration Heatmap</h3>
           </div>
           <div className="h-[200px]">
                <RiskHeatmap />
           </div>
           <div className="mt-8 flex justify-between items-center px-2">
              <div className="flex flex-col">
                 <span className="text-[10px] text-slate-400 uppercase font-black">Critical Zones</span>
                 <span className="text-xs text-slate-800 font-bold">12 Active Latencies</span>
              </div>
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-6 h-6 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
                     S{i}
                   </div>
                 ))}
              </div>
           </div>
        </GlassCard>

        {/* Learning Efficiency - 7 Cols */}
        <GlassCard className="lg:col-span-7 border-slate-200/80 bg-white/70 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-secondary/10 rounded-lg">
                 <Zap className="w-4 h-4 text-secondary" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Learning Efficiency Engine</h3>
            </div>
           <div className="h-[250px]">
              <Line 
                 data={learningEfficiencyData} 
                 options={{
                    ...commonOptions,
                    scales: {
                       x: { grid: { display: false }, ticks: { color: 'rgba(15,23,42,0.4)', font: { size: 9 } } },
                       y: { grid: { color: 'rgba(15,23,42,0.05)' }, ticks: { color: 'rgba(15,23,42,0.4)', font: { size: 9 } } }
                    }
                 }} 
              />
           </div>
        </GlassCard>

        {/* Supervisor Interventions - 5 Cols */}
        <GlassCard className="lg:col-span-5 border-slate-200/80 bg-white/70 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-secondary/10 rounded-lg">
                 <ShieldCheck className="w-4 h-4 text-secondary" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Supervisor Drift</h3>
            </div>
           <div className="h-[250px]">
              <Bar 
                 data={interventionData} 
                 options={{
                    ...commonOptions,
                    borderRadius: 4,
                    scales: {
                       x: { grid: { display: false }, ticks: { color: 'rgba(15,23,42,0.4)', font: { size: 9 } } },
                       y: { grid: { color: 'rgba(15,23,42,0.05)' }, ticks: { color: 'rgba(15,23,42,0.4)', font: { size: 9 } } }
                    }
                 }} 
              />
           </div>
        </GlassCard>

      </div>

      {/* Footer Branding */}
      <div className="pt-10 flex items-center justify-between border-t border-slate-200 opacity-50">
        <div className="flex items-center gap-2 text-slate-500">
           <BrainCircuit className="w-4 h-4" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em]">ECHOMIND</span>
        </div>
        <span className="text-[10px] font-medium text-slate-400">Session ID: EM-882-991-X</span>
      </div>
    </div>
  );
};

export default Analytics;
