import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, XCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import GlassCard from './GlassCard';

const RefinementCard = ({ original, improved, scoreGain, category }) => {
  return (
    <GlassCard className="border-white/5 overflow-hidden p-0">
      <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
         <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent-neon" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{category} REFINEMENT</span>
         </div>
         <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-accent-neon/10 border border-accent-neon/20">
            <span className="text-[9px] font-bold text-accent-neon">+{scoreGain}% EFFICIENCY</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
         <div className="p-6 bg-background">
            <div className="flex items-center gap-2 mb-4 opacity-50">
               <XCircle className="w-4 h-4 text-red-500" />
               <span className="text-[10px] font-bold text-white uppercase tracking-widest">Legacy Response</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed italic line-through decoration-red-500/30">
               "{original}"
            </p>
         </div>

         <div className="p-6 bg-white/[0.01]">
            <div className="flex items-center gap-2 mb-4">
               <CheckCircle2 className="w-4 h-4 text-accent-neon" />
               <span className="text-[10px] font-bold text-white uppercase tracking-widest">Optimized Response</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
               "{improved}"
            </p>
            <div className="mt-6 flex items-center gap-2">
               <div className="px-2 py-0.5 rounded bg-secondary/10 border border-secondary/20 text-[8px] font-mono text-secondary-neon">EMPATHY_WEIGHT_UP +0.12</div>
               <div className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[8px] font-mono text-primary-neon">CONTEXT_AWARENESS_v4</div>
            </div>
         </div>
      </div>
    </GlassCard>
  );
};

export default RefinementCard;
