import React from 'react';
import { motion } from 'framer-motion';

const RiskHeatmap = () => {
  const cells = Array(25).fill(0).map((_, i) => ({
    id: i,
    val: Math.random() * 100,
    pulse: Math.random() > 0.7
  }));

  return (
    <div className="relative h-full w-full">
      {/* Grid Scanline effect */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-xl">
        <motion.div 
          animate={{ translateY: ['0%', '1000%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-full h-[2px] bg-primary/20 blur-[1px] opacity-20"
        />
      </div>

      <div className="grid grid-cols-5 grid-rows-5 gap-1.5 h-full">
        {cells.map((cell, i) => {
          let bgColor = 'bg-white/5';
          let borderColor = 'border-white/5';
          let glowColor = '';

          if (cell.val > 80) {
            bgColor = 'bg-red-500/20';
            borderColor = 'border-red-500/30';
            glowColor = 'shadow-[0_0_10px_rgba(239,68,68,0.2)]';
          } else if (cell.val > 50) {
            bgColor = 'bg-amber-500/10';
            borderColor = 'border-amber-500/20';
          } else {
            bgColor = 'bg-accent/5';
            borderColor = 'border-accent/10';
          }

          return (
            <motion.div
              key={cell.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                backgroundColor: cell.pulse ? [undefined, 'rgba(255,255,255,0.1)', undefined] : undefined
              }}
              transition={{ 
                delay: i * 0.02,
                backgroundColor: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className={`rounded-sm border ${bgColor} ${borderColor} ${glowColor} relative flex items-center justify-center group overflow-hidden cursor-crosshair`}
            >
              <div className={`w-[2px] h-[2px] rounded-full ${cell.val > 80 ? 'bg-red-500 shadow-[0_0_5px_#ef4444]' : 'bg-white/10'}`} />
              
              {/* Corner markings for tech look */}
              <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RiskHeatmap;
