import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, User } from 'lucide-react';

const ChatBubble = ({ message, isAI = false, timestamp, status }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-4 mb-6 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${
        isAI ? 'bg-primary/20 border-primary/30 text-primary-neon' : 'bg-white/10 border-white/10 text-white/50'
      }`}>
        {isAI ? <BrainCircuit className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      <div className={`max-w-[70%] space-y-1 ${isAI ? '' : 'text-right flex flex-col items-end'}`}>
        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
          isAI 
            ? 'glass-card border-white/5 text-white/90 rounded-tl-none' 
            : 'bg-primary/10 border border-primary/20 text-white rounded-tr-none'
        }`}>
          {message}
        </div>
        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] text-white/20 font-medium uppercase tracking-tighter">{timestamp}</span>
          {isAI && status && (
            <>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-[10px] text-accent-neon font-bold uppercase tracking-tighter">{status}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
