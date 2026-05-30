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
           } : {
             height: [
               Math.sin(i * 0.5) * 8 + 12,
               Math.cos(i * 0.3) * 6 + 10,
               Math.sin(i * 0.5) * 8 + 12
             ]
           }}
           transition={{
             repeat: Infinity,
             duration: isActive ? (0.5 + Math.random() * 0.5) : (1.5 + Math.random() * 1.5),
             ease: "easeInOut"
           }}
           className={`w-1 rounded-full transition-colors duration-500 ${isActive ? 'bg-gradient-to-t from-primary to-secondary neon-glow' : 'bg-white/20'}`}
        />
      ))}
    </div>
  );
};

export default Waveform;
