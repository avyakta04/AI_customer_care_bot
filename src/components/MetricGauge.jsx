import React from 'react';
import { motion } from 'framer-motion';

const MetricGauge = ({ label, value, color = 'primary', size = 'md' }) => {
  const radius = size === 'lg' ? 45 : 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const colorMap = {
    primary: { stroke: '#8b5cf6', glow: 'rgba(139,92,246,0.3)' },
    secondary: { stroke: '#06b6d4', glow: 'rgba(6,182,212,0.3)' },
    accent: { stroke: '#10b981', glow: 'rgba(16,185,129,0.3)' },
    danger: { stroke: '#ef4444', glow: 'rgba(239,68,68,0.3)' },
    warning: { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
  };

  const selectedColor = colorMap[color] || colorMap.primary;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg 
           width={size === 'lg' ? 110 : 90} 
           height={size === 'lg' ? 110 : 90} 
           className="rotate-[-90deg]"
        >
          <circle
            cx={size === 'lg' ? 55 : 45}
            cy={size === 'lg' ? 55 : 45}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx={size === 'lg' ? 55 : 45}
            cy={size === 'lg' ? 55 : 45}
            r={radius}
            stroke={selectedColor.stroke}
            strokeWidth="4"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
            style={{ filter: `drop-shadow(0 0 4px ${selectedColor.glow})` }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-bold text-white tracking-tighter">{value}%</span>
        </div>
      </div>
      <p className="mt-2 text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
};

export default MetricGauge;
