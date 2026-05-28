import React from 'react';
import { motion } from 'framer-motion';
import { Mic, FileText, Activity, Brain } from 'lucide-react';

const steps = [
  { icon: Mic, label: 'Voice Input', color: 'text-white' },
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
                borderColor: ['rgba(255,255,255,0.1)', 'rgba(139,92,246,0.5)', 'rgba(255,255,255,0.1)']
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${
                currentStep >= i ? 'bg-white/5 border-white/20 shadow-xl' : 'bg-transparent border-white/5 opacity-30'
              }`}
            >
              <step.icon className={`w-6 h-6 ${currentStep >= i ? step.color : 'text-white/20'}`} />
            </motion.div>
            <span className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${
              currentStep >= i ? 'text-white/80' : 'text-white/10'
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
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 via-white/5 to-white/10 mx-4" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProcessingPipeline;
