import React from 'react';
import { motion } from 'framer-motion';

const RiskHeatmap = () => {
  const cells = Array(20).fill(0).map(() => Math.random() * 100);

  return (
    <div className="grid grid-cols-5 gap-2 h-full">
      {cells.map((val, i) => {
        let bgColor = 'bg-accent/20';
        if (val > 80) bgColor = 'bg-red-500/40 border-red-500/30';
        else if (val > 50) bgColor = 'bg-amber-500/30 border-amber-500/20';
        else bgColor = 'bg-accent/20 border-accent/10';

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, brightness: 1.5 }}
            className={`rounded-md border ${bgColor} flex items-center justify-center relative group overflow-hidden`}
          >
             <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
             <div className={`w-1 h-1 rounded-full ${val > 80 ? 'bg-red-500' : 'bg-white/20'}`} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default RiskHeatmap;
