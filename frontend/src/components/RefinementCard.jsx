import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, XCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import GlassCard from './GlassCard';

const RefinementCard = ({ original, improved, scoreGain, category }) => {
  return (
    <GlassCard className="border-slate-200/80 overflow-hidden p-0 bg-white/70 shadow-sm">
      <div className="p-4 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">{category} REFINEMENT</span>
         </div>
         <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-250">
            <span className="text-[9px] font-bold text-emerald-600">+{scoreGain}% EFFICIENCY</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200/60">
         <div className="p-6 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-4 opacity-75">
               <XCircle className="w-4 h-4 text-red-500" />
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Legacy Response</span>
            </div>
            <p className="text-xs text-slate-450 leading-relaxed italic line-through decoration-red-500/30">
               "{original}"
            </p>
         </div>

         <div className="p-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
               <CheckCircle2 className="w-4 h-4 text-emerald-600" />
               <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Optimized Response</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
               "{improved}"
            </p>
            <div className="mt-6 flex items-center gap-2">
               <div className="px-2 py-0.5 rounded bg-cyan-50 border border-cyan-200 text-[8px] font-mono text-cyan-600">EMPATHY_WEIGHT_UP +0.12</div>
               <div className="px-2 py-0.5 rounded bg-violet-50 border border-violet-200 text-[8px] font-mono text-violet-600">CONTEXT_AWARENESS_v4</div>
            </div>
         </div>
      </div>
    </GlassCard>
  );
};

export default RefinementCard;
