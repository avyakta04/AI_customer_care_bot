import React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import GlassCard from './GlassCard';

const StatCard = ({ label, value, target, suffix = "", prefix = "", trend = "up", percentage = "0%" }) => {
  return (
    <GlassCard className="border-white/5 hover:border-primary/20 transition-all">
      <div className="flex justify-between items-start mb-6">
         <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{label}</p>
         <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
           trend === 'up' ? 'bg-accent-neon/10 text-accent-neon' : trend === 'down' ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-white/40'
         }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {percentage}
         </div>
      </div>
      
      <div className="flex items-baseline gap-1 mb-2">
         <span className="text-3xl font-bold text-white tracking-tighter">{prefix}{value}{suffix}</span>
         <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest ml-2">vs {target} target</span>
      </div>

      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-4">
         <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(value / target) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${trend === 'up' ? 'from-primary to-secondary' : 'from-red-500 to-orange-500'}`}
         />
      </div>
    </GlassCard>
  );
};

export default StatCard;
