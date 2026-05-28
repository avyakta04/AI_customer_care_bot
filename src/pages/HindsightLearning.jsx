import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  RefreshCw, 
  BrainCircuit, 
  ArrowUpRight, 
  Workflow, 
  Target,
  FlaskConical,
  Activity,
  Zap
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import RefinementCard from '../components/RefinementCard';
import { Line, Radar } from 'react-chartjs-2';

const steps = [
  { label: 'User Feedback', icon: Activity },
  { label: 'Neural Analysis', icon: BrainCircuit },
  { label: 'Mistake Detection', icon: Target },
  { label: 'Weight Update', icon: RefreshCw },
  { label: 'Optimization', icon: Zap },
];

const HindsightLearning = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [learningCycle, setLearningCycle] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
      if (activeStep === steps.length - 1) {
        setLearningCycle(prev => prev + 1);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [activeStep]);

  const evolutionaryData = {
    labels: ['Gen 1', 'Gen 2', 'Gen 3', 'Gen 4', 'Gen 5', 'Gen 6', 'Gen 7'],
    datasets: [{
      label: 'Intelligence Growth',
      data: [45, 52, 68, 72, 85, 91, 98],
      borderColor: '#8b5cf6',
      borderWidth: 3,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#8b5cf6',
      fill: true,
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
    }]
  };

  const capabilityData = {
    labels: ['Empathy', 'Accuracy', 'Speed', 'Context', 'Reasoning', 'Tone'],
    datasets: [{
      label: 'Model Capability',
      data: [85, 92, 78, 95, 88, 90],
      backgroundColor: 'rgba(6, 182, 212, 0.2)',
      borderColor: '#06b6d4',
      borderWidth: 2,
    }]
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent-neon neon-glow">
               <History className="w-7 h-7" />
            </div>
            <div>
               <h1 className="text-3xl font-bold text-white tracking-tight">Hindsight Learning Engine</h1>
               <p className="text-white/40 mt-1">Autonomous self-correction and neural weight optimization cycle.</p>
            </div>
         </div>
         <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
            <FlaskConical className="w-4 h-4 text-primary-neon" />
            <span className="text-[11px] font-bold text-white/60 tracking-widest uppercase">Learning Cycle: <span className="text-white">#{learningCycle.toString().padStart(4, '0')}</span></span>
         </div>
      </div>

      {/* Workflow Animation */}
      <GlassCard className="border-white/5 p-8 bg-gradient-to-r from-white/[0.02] to-transparent">
         <div className="flex items-center justify-between max-w-5xl mx-auto relative px-8">
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-4 relative z-10">
                   <motion.div
                     animate={activeStep === i ? { 
                       scale: [1, 1.2, 1],
                       boxShadow: ['0 0 0px rgba(139,92,246,0)', '0 0 20px rgba(139,92,246,0.3)', '0 0 0px rgba(139,92,246,0)']
                     } : {}}
                     className={`w-16 h-16 rounded-2xl border flex items-center justify-center transition-all duration-500 ${
                       activeStep === i ? 'bg-primary/20 border-primary/40 text-primary-neon' : 'bg-white/5 border-white/10 text-white/20'
                     }`}
                   >
                      <step.icon className="w-7 h-7" />
                   </motion.div>
                   <span className={`text-[9px] font-bold uppercase tracking-[0.2em] absolute top-20 whitespace-nowrap ${
                     activeStep === i ? 'text-white' : 'text-white/10'
                   }`}>
                      {step.label}
                   </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-px bg-white/5 mx-4 mb-4 relative overflow-hidden">
                     <motion.div 
                        animate={activeStep === i ? { left: ['-100%', '100%'] } : { left: '-100%' }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-primary-neon to-transparent opacity-50"
                     />
                  </div>
                )}
              </React.Fragment>
            ))}
         </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Refinement Stream */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-2 px-2">
               <Workflow className="w-5 h-5 text-primary-neon" />
               <h3 className="text-sm font-bold text-white uppercase tracking-widest">Self-Correction Stream</h3>
            </div>
            
            <RefinementCard 
               category="SENTIMENT_ALIGNMENT"
               scoreGain={18}
               original="I am sorry for the delay. Please wait while I check."
               improved="I understand your frustration with the delay, especially given your deadline. I've prioritized your request and am re-validating your token now."
            />
            
            <RefinementCard 
               category="FACTUAL_ACCURACY"
               scoreGain={12}
               original="The system reboot happens every Sunday at midnight."
               improved="Neural reboots are scheduled for Sundays at 00:00 UTC. During this 5-minute window, read-only mode is active for all non-critical modules."
            />
         </div>

         {/* Growth Metrics */}
         <div className="space-y-6">
            <GlassCard className="border-white/5">
                <div className="flex items-center gap-3 mb-6">
                   <ArrowUpRight className="w-5 h-5 text-accent-neon" />
                   <h3 className="text-sm font-bold text-white uppercase tracking-widest">Evolutionary intelligence</h3>
                </div>
                <div className="h-48">
                   <Line 
                     data={evolutionaryData} 
                     options={{ 
                        responsive: true, 
                        maintainAspectRatio: false, 
                        plugins: { legend: { display: false } },
                        scales: { x: { display: false }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 9 } } } }
                     }} 
                   />
                </div>
            </GlassCard>

            <GlassCard className="border-white/5">
                <div className="flex items-center gap-3 mb-6">
                   <BrainCircuit className="w-5 h-5 text-secondary-neon" />
                   <h3 className="text-sm font-bold text-white uppercase tracking-widest">Capability Matrix</h3>
                </div>
                <div className="h-48 flex items-center justify-center opacity-70">
                   <Radar 
                     data={capabilityData}
                     options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { r: { angleLines: { color: 'rgba(255,255,255,0.1)' }, grid: { color: 'rgba(255,255,255,0.1)' }, pointLabels: { color: 'rgba(255,255,255,0.5)', font: { size: 8 } }, ticks: { display: false } } }
                     }}
                   />
                </div>
            </GlassCard>
            
            <GlassCard className="border-accent-neon/20 bg-accent/5">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Success Ratio</span>
                  <span className="text-sm font-bold text-accent-neon">99.2%</span>
               </div>
               <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '99.2%' }} className="h-full bg-accent-neon" />
               </div>
               <p className="mt-4 text-[9px] text-white/30 leading-relaxed">
                  System has autonomously corrected <span className="text-white">1,248 potential mismatches</span> in the last 24 duty cycles.
               </p>
            </GlassCard>
         </div>
      </div>
    </div>
  );
};

export default HindsightLearning;
