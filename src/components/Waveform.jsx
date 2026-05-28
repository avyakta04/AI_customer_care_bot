import React from 'react';
import { motion } from 'framer-motion';

const Waveform = ({ isActive = false }) => {
  return (
    <div className="flex items-center justify-center gap-1 h-32 w-full">
      {[...Array(40)].map((_, i) => (
        <motion.div
           key={i}
           animate={isActive ? {
             height: [
               Math.random() * 20 + 10,
               Math.random() * 80 + 20,
               Math.random() * 40 + 10
             ]
           } : { height: 4 }}
           transition={{
             repeat: Infinity,
             duration: 0.5 + Math.random() * 0.5,
             ease: "easeInOut"
           }}
           className={`w-1 rounded-full ${isActive ? 'bg-gradient-to-t from-primary to-secondary neon-glow' : 'bg-white/10'}`}
        />
      ))}
    </div>
  );
};

export default Waveform;
