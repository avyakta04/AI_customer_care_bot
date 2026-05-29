import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ className, circle = false }) => {
  return (
    <div className={`relative overflow-hidden bg-white/5 ${circle ? 'rounded-full' : 'rounded-xl'} ${className}`}>
      <motion.div
        animate={{ 
          translateX: ['-100%', '100%'] 
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
      />
    </div>
  );
};

export default SkeletonLoader;
