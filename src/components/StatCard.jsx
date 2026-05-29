import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import GlassCard from './GlassCard';

const StatCard = ({ label, value, target, suffix = "", prefix = "", trend = "up", percentage = "0%" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (value) => setDisplayValue(value.toFixed(suffix === '%' ? 1 : 0)),
      ease: "easeOut"
    });
    return () => controls.stop();
  }, [value, suffix]);

  return (
    <GlassCard className="border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
      {/* Animated background glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
         <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{label}</p>
         <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
           trend === 'up' ? 'bg-accent-neon/10 text-accent-neon' : trend === 'down' ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-white/40'
         }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {percentage}
         </div>
      </div>
      
      <div className="flex items-baseline gap-1 mb-2 relative z-10">
         <span className="text-3xl font-bold text-white tracking-tighter">
            {prefix}{displayValue}{suffix}
         </span>
         <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest ml-2">target {target}{suffix}</span>
      </div>

      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-4 relative z-10">
         <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((value / target) * 100, 100)}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r shadow-[0_0_10px_rgba(139,92,246,0.3)] ${trend === 'up' ? 'from-primary to-secondary' : 'from-red-500 to-orange-500'}`}
         />
      </div>
    </GlassCard>
  );
};

export default StatCard;
