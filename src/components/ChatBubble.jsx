import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, User, ShieldCheck } from 'lucide-react';

const ChatBubble = ({ message, isAI = false, timestamp, status }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`flex gap-4 mb-8 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Avatar Section */}
      <div className="flex-shrink-0 mt-1">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
          isAI 
            ? 'bg-violet-600/10 border-violet-500/20 text-violet-600 shadow-sm group-hover:scale-110' 
            : 'bg-slate-100 border-slate-200 text-slate-400'
        }`}>
          {isAI ? <BrainCircuit className="w-6 h-6" /> : <User className="w-6 h-6" />}
        </div>
      </div>

      {/* Message Content */}
      <div className={`max-w-[75%] space-y-2 ${isAI ? '' : 'text-right flex flex-col items-end'}`}>
        <div className={`p-5 rounded-[2rem] text-[15px] leading-relaxed relative group transition-all duration-500 ${
          isAI 
            ? 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none hover:border-violet-500/30 shadow-sm' 
            : 'bg-violet-500/10 border border-violet-500/20 text-slate-800 rounded-tr-none hover:border-violet-500/40 shadow-sm'
        }`}>
          {/* Subtle Glow for AI */}
          {isAI && (
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none rounded-[2rem] rounded-tl-none" />
          )}
          
          <div className="relative z-10 font-medium">
            {message}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-3 px-2">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{timestamp}</span>
          {isAI && status && (
            <>
              <div className="w-1 h-1 rounded-full bg-slate-200" />
              <div className="flex items-center gap-1.5">
                {status === 'VERIFIED_RESPONSE' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${status === 'VERIFIED_RESPONSE' ? 'text-emerald-600' : 'text-violet-600'}`}>
                  {status.replace('_', ' ')}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
