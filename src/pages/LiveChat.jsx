import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Mic, 
  ShieldCheck, 
  AlertCircle, 
  Activity, 
  Sparkles,
  Info,
  BrainCircuit,
  MessageCircle,
  Command
} from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import EmotionBadge from '../components/EmotionBadge';
import GlassCard from '../components/GlassCard';

const initialMessages = [
  { id: 1, text: "Neural connection established. Secure Session ID: 0x-A492-B812. AI Core v4.0 monitoring engaged.", isAI: true, timestamp: "10:00 AM", status: "SYSTEM_INIT" },
  { id: 2, text: "Hello, I've been trying to access my enterprise dashboard for the last hour but I keep getting a credential mismatch error. This is very frustrating as I have a deadline.", isAI: false, timestamp: "10:01 AM" },
];

const LiveChat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState({ type: 'Frustrated', confidence: 88 });
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      text: inputValue,
      isAI: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    simulateAIResponse(inputValue);
  };

  const simulateAIResponse = (userText) => {
    setIsTyping(true);
    
    // Simulate emotion change based on keywords
    if (userText.toLowerCase().includes("urgent") || userText.toLowerCase().includes("deadline")) {
      setCurrentEmotion({ type: 'Urgent', confidence: 94 });
    } else {
      setCurrentEmotion({ type: 'Neutral', confidence: 91 });
    }

    setTimeout(() => {
      setIsTyping(false);
      setIsStreaming(true);
      
      const aiResponseId = Date.now() + 1;
      const fullText = "I understand the urgency regarding your deadline. I've initiated a deep-scan of your credential cache. It appears there was a sync delay with the global auth server. I am re-validating your token now. Please try again in 30 seconds.";
      
      let currentIdx = 0;
      const streamingMsg = {
        id: aiResponseId,
        text: "",
        isAI: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "NEURAL_STREAMING"
      };

      setMessages(prev => [...prev, streamingMsg]);

      const interval = setInterval(() => {
        if (currentIdx < fullText.length) {
          setMessages(prev => {
            const last = [...prev];
            const msgIdx = last.findIndex(m => m.id === aiResponseId);
            if (msgIdx !== -1) {
              last[msgIdx] = { ...last[msgIdx], text: fullText.substring(0, currentIdx + 1) };
            }
            return last;
          });
          currentIdx += 2; // Stream 2 chars at a time for speed
        } else {
          clearInterval(interval);
          setIsStreaming(false);
          setMessages(prev => {
            const last = [...prev];
            const msgIdx = last.findIndex(m => m.id === aiResponseId);
            if (msgIdx !== -1) {
              last[msgIdx] = { ...last[msgIdx], status: "VERIFIED_RESPONSE" };
            }
            return last;
          });
        }
      }, 30);
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 p-2 lg:p-0">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Escalation Banner */}
        <AnimatePresence>
          {currentEmotion.type === 'Urgent' && (
            <motion.div
              initial={{ height: 0, opacity: 0, scale: 0.95 }}
              animate={{ height: 'auto', opacity: 1, scale: 1 }}
              exit={{ height: 0, opacity: 0, scale: 0.95 }}
              className="mb-4 overflow-hidden"
            >
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-[2rem] flex items-center gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <AlertCircle className="text-red-500 w-6 h-6 animate-bounce" />
                </div>
                <div className="relative z-10">
                  <h4 className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">High-Priority Detection</h4>
                  <p className="text-xs text-red-200/80 font-medium leading-relaxed">
                    System detected a critical blocker. AI Supervisor protocol engaged. Response precision increased by 2x.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conversation Area */}
        <GlassCard className="flex-1 p-0 flex flex-col overflow-hidden relative border-white/[0.05] rounded-[2.5rem]">
          <div className="px-8 py-5 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01] backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-950 flex items-center justify-center border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Session Engage</h3>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.1em]">Core v4.0 Active</p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2 group hover:border-violet-500/30 transition-colors cursor-default">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Protocol Secured</span>
              </div>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 p-8 overflow-y-auto custom-scrollbar scroll-smooth space-y-8"
          >
            {messages.map((msg) => (
              <ChatBubble 
                key={msg.id}
                message={msg.text}
                isAI={msg.isAI}
                timestamp={msg.timestamp}
                status={msg.status}
              />
            ))}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-4 mb-6"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                  <BrainCircuit className="w-6 h-6 animate-pulse" />
                </div>
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 rounded-[1.5rem] rounded-tl-none flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-violet-400/60" />
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-violet-400/30" />
                  </div>
                  <span className="text-[11px] font-mono text-white/30 uppercase tracking-[0.2em] font-bold">Neural Processing...</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white/[0.01] backdrop-blur-2xl border-t border-white/[0.05]">
            <div className="max-w-4xl mx-auto flex items-end gap-4">
              <div className="flex-1 relative group">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent group-focus-within:via-violet-500 transition-all" />
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder="Enter message or use /commands..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-5 pr-14 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/30 focus:bg-white/[0.05] transition-all resize-none min-h-[64px] max-h-48 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                  rows={1}
                />
                <button className="absolute right-5 bottom-5 p-1 text-white/20 hover:text-white transition-colors group">
                  <Command className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
              <div className="flex gap-3">
                <button className="p-5 bg-white/[0.03] border border-white/10 rounded-[2rem] text-white/30 hover:text-violet-400 hover:bg-violet-500/10 transition-all group active:scale-95 shadow-lg">
                  <Mic className="w-5 h-5 transition-transform group-hover:scale-110" />
                </button>
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isStreaming}
                  className="p-5 bg-violet-600 text-white rounded-[2rem] shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.4)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none active:scale-95 group"
                >
                  <Send className="w-5 h-5 fill-current group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex justify-center">
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">Press Ent to send • Shift+Ent for newline</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Emotion Monitoring Sidebar */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        <GlassCard className="border-white/[0.05] rounded-[2.5rem] bg-white/[0.02]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Emotion Core</h3>
            </div>
            <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">Live Scan</div>
          </div>
          
          <div className="space-y-6">
            <div className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/[0.05] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-5">Primary Detection</p>
              <EmotionBadge type={currentEmotion.type} confidence={currentEmotion.confidence} />
              
              <div className="mt-8 space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                  <span>Confidence Scale</span>
                  <span className="text-white">{currentEmotion.confidence}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentEmotion.confidence}%` }}
                    transition={{ duration: 1.5, cubicBezier: [0.16, 1, 0.3, 1] }}
                    className={`h-full rounded-full bg-gradient-to-r ${currentEmotion.type === 'Urgent' ? 'from-red-500 via-orange-500 to-amber-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'from-indigo-500 via-violet-500 to-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]'}`}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/10">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-[11px] font-black text-white uppercase tracking-[0.1em]">AI Adaptive Tone</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed font-medium italic">
                "System recalibrating response parameters to account for user frustration spikes. Priority: Empathy + Resolution."
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="border-white/[0.05] flex-1 p-8 rounded-[2.5rem] bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Info className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Neural Insights</h3>
          </div>
          
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Detected Intents</p>
              <div className="flex flex-wrap gap-2.5">
                {['AUTH_CORE', 'TOKEN_SYNC', 'UI_BLOCKER', 'LATENCY'].map(tag => (
                  <motion.span 
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(99, 102, 241, 0.2)' }}
                    key={tag} 
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono font-bold text-indigo-300"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/[0.05]">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Accuracy Index</p>
                <span className="text-[10px] font-bold text-emerald-400 tracking-[0.2em]">A+ GRADE</span>
              </div>
              <div className="flex items-end gap-1.5 h-10">
                {[45, 65, 85, 95, 100, 90, 80].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1, duration: 1, ease: "circOut" }}
                    className={`flex-1 rounded-t-sm ${i < 5 ? 'bg-gradient-to-t from-emerald-500/50 to-emerald-400' : 'bg-white/5'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default LiveChat;
