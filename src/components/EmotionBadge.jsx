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
  Angry: { icon: Angry, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  Frustrated: { icon: Frown, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  Confused: { icon: HelpCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  Happy: { icon: Smile, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  Neutral: { icon: Meh, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  Urgent: { icon: AlertTriangle, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
};

const EmotionBadge = ({ type = 'Neutral', confidence = 95 }) => {
  const emotion = emotions[type] || emotions.Neutral;
  const Icon = emotion.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-2 p-1.5 px-3 rounded-full border ${emotion.bg} ${emotion.border} transition-all duration-500`}
    >
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
