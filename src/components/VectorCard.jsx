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
      <GlassCard className="mb-4 border-white/5 hover:border-secondary/30 transition-all p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary-neon border border-secondary/20">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/30 tracking-widest uppercase">Memory Block</p>
              <p className="text-[11px] font-mono text-secondary-neon">ID_{id}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-accent-neon mb-1">
              <Target className="w-3.5 h-3.5" />
              <span className="text-sm font-bold tracking-tighter">{similarity}%</span>
            </div>
            <p className="text-[9px] text-white/20 font-bold uppercase tracking-tighter">Similarity Score</p>
          </div>
        </div>
        
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 mb-4">
          <p className="text-xs text-white/60 leading-relaxed italic">
            "{snippet}"
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-white/30">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-medium">{date}</span>
          </div>
          <button className="text-[10px] font-bold text-primary-neon uppercase tracking-widest hover:underline">
            Load Full Context
          </button>
        </div>
      </GlassCard>
      
      {/* Connector line for the timeline effect if needed */}
      <div className="absolute top-1/2 -left-3 w-3 h-px bg-white/10" />
    </motion.div>
  );
};

export default VectorCard;
