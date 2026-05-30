import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RiskHeatmap = () => {
  const [cells, setCells] = useState(() => 
    Array(25).fill(0).map((_, i) => ({
      id: i,
      val: Math.random() * 100,
      pulse: Math.random() > 0.6
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time safety scanning, changing cells slightly
      setCells(prev => 
        prev.map(cell => 
          Math.random() > 0.7 
            ? { 
                ...cell, 
                val: Math.max(0, Math.min(100, cell.val + (Math.random() - 0.5) * 25)),
                pulse: Math.random() > 0.6
              } 
            : cell
        )
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* Grid Scanline effect */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-xl">
        <motion.div 
          animate={{ translateY: ['0%', '1000%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-full h-[2px] bg-primary/20 blur-[1px] opacity-30"
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
            glowColor = 'shadow-[0_0_12px_rgba(239,68,68,0.25)]';
          } else if (cell.val > 50) {
            bgColor = 'bg-amber-500/10';
            borderColor = 'border-amber-500/20';
            glowColor = 'shadow-[0_0_8px_rgba(245,158,11,0.15)]';
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
                backgroundColor: cell.pulse ? [undefined, 'rgba(255,255,255,0.08)', undefined] : undefined
              }}
              transition={{ 
                delay: i * 0.01,
                backgroundColor: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className={`rounded-sm border ${bgColor} ${borderColor} ${glowColor} relative flex items-center justify-center group overflow-hidden cursor-crosshair transition-all duration-700`}
            >
              <div className={`w-[2px] h-[2px] rounded-full ${cell.val > 80 ? 'bg-red-500 shadow-[0_0_5px_#ef4444]' : 'bg-white/10'}`} />
              
              {/* Corner markings for tech look */}
              <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RiskHeatmap;
