import React from 'react';
import { motion } from 'framer-motion';
import { 
  Angry, 
  Frown, 
  HelpCircle, 
  Smile, 
  Meh, 
  AlertTriangle 
} from 'lucide-react';

const emotions = {
  Angry: { icon: Angry, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', rgb: '239, 68, 68', dotColor: 'bg-red-500' },
  Frustrated: { icon: Frown, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', rgb: '249, 115, 22', dotColor: 'bg-orange-500' },
  Confused: { icon: HelpCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', rgb: '234, 179, 8', dotColor: 'bg-yellow-500' },
  Happy: { icon: Smile, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', rgb: '34, 197, 94', dotColor: 'bg-green-500' },
  Neutral: { icon: Meh, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', rgb: '59, 130, 246', dotColor: 'bg-blue-500' },
  Urgent: { icon: AlertTriangle, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', rgb: '168, 85, 247', dotColor: 'bg-purple-500' },
};

const EmotionBadge = ({ type = 'Neutral', confidence = 95 }) => {
  const emotion = emotions[type] || emotions.Neutral;
  const Icon = emotion.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        boxShadow: [
          `0 0 0px rgba(${emotion.rgb}, 0.1)`,
          `0 0 12px rgba(${emotion.rgb}, 0.4)`,
          `0 0 0px rgba(${emotion.rgb}, 0.1)`
        ]
      }}
      transition={{ 
        boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" },
        duration: 0.3
      }}
      className={`flex items-center gap-2 p-1.5 px-3 rounded-full border ${emotion.bg} ${emotion.border} transition-all duration-500`}
    >
      <div className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${emotion.dotColor}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${emotion.dotColor}`} />
      </div>
      <Icon className={`w-3.5 h-3.5 ${emotion.color}`} />
      <span className={`text-[10px] font-bold uppercase tracking-wider ${emotion.color}`}>
        {type}
      </span>
      <div className="w-px h-3 bg-white/10 mx-0.5" />
      <span className="text-[10px] font-mono text-white/40">
        {confidence}%
      </span>
    </motion.div>
  );
};

export default EmotionBadge;
