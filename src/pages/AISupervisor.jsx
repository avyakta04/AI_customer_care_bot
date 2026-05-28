import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Eye, 
  Activity, 
  AlertTriangle, 
  Terminal, 
  Brain,
  MessageSquare,
  TrendingDown,
  TrendingUp,
  Wind
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import MetricGauge from '../components/MetricGauge';
import RiskHeatmap from '../components/RiskHeatmap';
import { Line } from 'react-chartjs-2';

const AISupervisor = () => {
  const [activeSession, setActiveSession] = useState('SID_9921_NEURAL');
  const [healthScore, setHealthScore] = useState(94);
  const [logs, setLogs] = useState([
    { t: "20:30:10", msg: "INIT_SUPERVISOR_PROTOCOL: ACTIVE", type: "system" },
    { t: "20:30:12", msg: "MONITORING_BOT_INSTANCE: ALPHA_01", type: "system" },
    { t: "20:30:15", msg: "ADVISORY: RESPONSE_LATENCY_INCREASED_BY_12MS", type: "warning" },
  ]);

  useEffect(() => {
    const logInterval = setInterval(() => {
      const msgs = [
        "EVALUATING_EMOTIONAL_STABILITY: NOMINAL",
        "HALLUCINATION_CHECK: 0.02%_PROBABILITY",
        "SENTIMENT_MATCHING: 98%_ACCURACY",
        "CROSS_CHECKING_CHROMADB_CONTEXT: VERIFIED",
        "DETECTED_ADVISORY: TONE_IS_TOO_FORMAL_FOR_USER_STATE"
      ];
      const newLog = {
        t: new Date().toLocaleTimeString([], { hour12: false }),
        msg: msgs[Math.floor(Math.random() * msgs.length)],
        type: Math.random() > 0.8 ? 'warning' : 'info'
      };
      setLogs(prev => [...prev.slice(-10), newLog]);
      setHealthScore(prev => Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 5)));
    }, 3000);
    return () => clearInterval(logInterval);
  }, []);

  const stabilityData = {
    labels: Array(15).fill(''),
    datasets: [{
      data: Array(15).fill(0).map(() => 80 + Math.random() * 20),
      borderColor: '#10b981',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(16, 185, 129, 0.05)',
    }]
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner: Active Status */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary-neon neon-glow">
               <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
               <h1 className="text-3xl font-bold text-white tracking-tight">AI Supervisor Control</h1>
               <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-accent-neon animate-pulse" />
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Guardian Protocol v4.2 Active</p>
               </div>
            </div>
         </div>
         
         <div className="flex bg-white/5 border border-white/10 rounded-2xl p-2 h-14">
            {['SID_9921_NEURAL', 'SID_4452_TEXT', 'SID_1102_VOICE'].map(sid => (
              <button 
                key={sid}
                onClick={() => setActiveSession(sid)}
                className={`px-4 rounded-xl text-[9px] font-bold tracking-widest transition-all ${
                  activeSession === sid ? 'bg-primary text-white shadow-lg' : 'text-white/30 hover:text-white'
                }`}
              >
                {sid}
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Core Metrics Dashboard */}
        <GlassCard className="lg:col-span-3 border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
           <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                 <Eye className="w-5 h-5 text-secondary-neon" />
                 <h3 className="text-sm font-bold text-white uppercase tracking-widest">Real-Time Evaluation</h3>
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Bot Persona</p>
                    <p className="text-sm font-bold text-secondary-neon">Empathetic_Enterprise</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary-neon border border-secondary/20">
                    <Brain className="w-5 h-5" />
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
              <MetricGauge label="Empathy Score" value={92} color="secondary" size="lg" />
              <MetricGauge label="Response Quality" value={96} color="accent" size="lg" />
              <MetricGauge label="Hallucination Risk" value={2} color="danger" size="lg" />
              <MetricGauge label="Escalation Prob" value={14} color="warning" size="lg" />
           </div>

           <div className="pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                 <div className="flex items-center justify-between mb-4 px-2">
                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Tone Matching Stream</h4>
                    <TrendingUp className="w-3 h-3 text-accent-neon" />
                 </div>
                 <div className="h-32 bg-black/20 rounded-2xl border border-white/5 p-4 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                       <MessageSquare className="w-12 h-12" />
                    </div>
                    {/* Simulated pulse wave */}
                    <div className="flex items-end gap-1 h-full w-full justify-center">
                       {[...Array(20)].map((_, i) => (
                         <motion.div 
                           key={i} 
                           animate={{ height: [`${Math.random() * 50 + 20}%`, `${Math.random() * 50 + 20}%`] }}
                           className="w-1.5 bg-secondary-neon/50 rounded-t-sm" 
                         />
                       ))}
                    </div>
                 </div>
              </div>

              <div>
                 <div className="flex items-center justify-between mb-4 px-2">
                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Emotional Stability Trend</h4>
                    <span className="text-[10px] font-bold text-accent-neon uppercase">NOMINAL</span>
                 </div>
                 <div className="h-32 bg-black/20 rounded-2xl border border-white/5 p-4">
                    <Line 
                      data={stabilityData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false, 
                        plugins: { legend: { display: false } },
                        scales: { x: { display: false }, y: { display: false, min: 60, max: 100 } }
                      }} 
                    />
                 </div>
              </div>
           </div>
        </GlassCard>

        {/* Supervision Sidebar */}
        <div className="space-y-6">
           <GlassCard className="border-white/5 h-[300px] flex flex-col p-0 overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                 <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary-neon" />
                    <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Reasoning Logs</h3>
                 </div>
                 <span className="text-[8px] font-mono text-white/20 animate-pulse">STREAMING_PROT</span>
              </div>
              <div className="flex-1 p-4 font-mono text-[10px] overflow-y-auto space-y-2 bg-black/40">
                 {logs.map((log, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -5 }} 
                     animate={{ opacity: 1, x: 0 }} 
                     key={i} 
                     className={`flex gap-3 leading-relaxed ${log.type === 'warning' ? 'text-amber-400' : 'text-white/40'}`}
                   >
                     <span className="opacity-30 flex-shrink-0">[{log.t}]</span>
                     <span>{log.msg}</span>
                   </motion.div>
                 ))}
              </div>
           </GlassCard>

           <GlassCard className="border-red-500/10 bg-red-500/[0.02]">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xs font-bold text-white uppercase tracking-widest">Risk Heatmap</h3>
                 <div className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[8px] font-bold text-red-500 uppercase">Attention Required</div>
              </div>
              <div className="h-32">
                 <RiskHeatmap />
              </div>
              <p className="mt-4 text-[9px] text-white/30 leading-relaxed italic">
                 "Heatmap reflects cross-layered analysis of intent, tone, and factual accuracy. Red cells indicate potential hallucination or high escalation probability."
              </p>
           </GlassCard>

           <GlassCard className="border-white/5">
              <div className="flex items-center gap-3 mb-4">
                 <Activity className="w-4 h-4 text-secondary-neon" />
                 <span className="text-[10px] font-bold text-white/40 uppercase">Conversation Health</span>
              </div>
              <div className="flex items-end gap-3">
                 <span className="text-4xl font-bold text-white tracking-tighter">{Math.round(healthScore)}</span>
                 <div className="mb-1.5 flex flex-col">
                    <span className="text-[10px] text-accent-neon font-bold uppercase tracking-tighter">Healthy</span>
                    <div className="w-12 h-1 bg-accent-neon/20 rounded-full overflow-hidden">
                       <motion.div animate={{ width: `${healthScore}%` }} className="h-full bg-accent-neon" />
                    </div>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AISupervisor;
