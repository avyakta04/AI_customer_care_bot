import React from 'react';
import { motion } from 'framer-motion';
import { Mic, FileText, Activity, Brain } from 'lucide-react';

const steps = [
  { icon: Mic, label: 'Voice Input', color: 'text-slate-800' },
  { icon: FileText, label: 'Whisper STT', color: 'text-primary-neon' },
  { icon: Activity, label: 'Librosa FE', color: 'text-secondary-neon' },
  { icon: Brain, label: 'Emotion Detection', color: 'text-accent-neon' },
];

const ProcessingPipeline = ({ currentStep = 0 }) => {
  return (
    <div className="flex items-center justify-between px-4 py-8">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-3 relative">
            <motion.div
              animate={currentStep === i ? {
                scale: [1, 1.2, 1],
                borderColor: ['rgba(226,232,240,0.5)', 'rgba(124,58,237,0.5)', 'rgba(226,232,240,0.5)']
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${
                currentStep >= i ? 'bg-slate-100 border-slate-200 shadow-sm' : 'bg-transparent border-slate-200/50 opacity-30'
              }`}
            >
              <step.icon className={`w-6 h-6 ${currentStep >= i ? step.color : 'text-slate-300'}`} />
            </motion.div>
            <span className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${
              currentStep >= i ? 'text-slate-700' : 'text-slate-300'
            }`}>
              {step.label}
            </span>
            {currentStep === i && (
              <motion.div 
                layoutId="active-ring"
                className="absolute inset-0 -m-1 border border-primary/30 rounded-[20px] animate-pulse"
              />
            )}
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 mx-4" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProcessingPipeline;
