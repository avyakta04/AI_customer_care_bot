import React from 'react';
import { motion } from 'framer-motion';
import { Database, Target, Clock } from 'lucide-react';
import GlassCard from './GlassCard';

const VectorCard = ({ snippet, similarity, date, id }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: -4 }}
      className="relative"
    >
      <GlassCard className="mb-4 border-slate-200/80 hover:border-cyan-300 transition-all p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 border border-cyan-100">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Memory Block</p>
              <p className="text-[11px] font-mono text-cyan-600">ID_{id}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <Target className="w-3.5 h-3.5" />
              <span className="text-sm font-bold tracking-tighter">{similarity}%</span>
            </div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Similarity Score</p>
          </div>
        </div>
        
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4">
          <p className="text-xs text-slate-600 leading-relaxed italic">
            "{snippet}"
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-medium">{date}</span>
          </div>
          <button className="text-[10px] font-bold text-violet-600 hover:text-violet-700 uppercase tracking-widest hover:underline">
            Load Full Context
          </button>
        </div>
      </GlassCard>
      
      {/* Connector line for the timeline effect if needed */}
      <div className="absolute top-1/2 -left-3 w-3 h-px bg-slate-200" />
    </motion.div>
  );
};

export default VectorCard;
