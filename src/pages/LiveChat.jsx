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
  Info
} from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import EmotionBadge from '../components/EmotionBadge';
import GlassCard from '../components/GlassCard';

const initialMessages = [
  { id: 1, text: "System connection established. AI Core v4.0 is monitoring this session.", isAI: true, timestamp: "10:00 AM", status: "SYSTEM_INIT" },
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
    <div className="flex h-[calc(100vh-120px)] gap-6">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Escalation Banner */}
        <AnimatePresence>
          {currentEmotion.type === 'Urgent' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-2xl flex items-center gap-3">
                <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
                <p className="text-xs text-red-200/80 font-medium">
                  <span className="font-bold text-red-500 uppercase tracking-widest mr-2">High Priority Escalation:</span> 
                  Customer is reporting time-critical blockers. AI Supervisor is now monitoring this thread.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conversation Area */}
        <GlassCard className="flex-1 p-0 flex flex-col overflow-hidden border-white/5 shadow-2xl relative">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-neon animate-pulse" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Active Neural Link</h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <ShieldCheck className="w-3 h-3 text-primary-neon" />
              <span className="text-[10px] font-bold text-white/40 uppercase">Supervisor Active</span>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 p-6 overflow-y-auto custom-scrollbar scroll-smooth"
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 mb-6"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-neon">
                  <BrainCircuit className="w-5 h-5 animate-pulse" />
                </div>
                <div className="glass-card border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <span className="text-xs text-white/40 font-mono italic">AI is thinking...</span>
                  <div className="flex gap-1">
                    <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1 h-1 rounded-full bg-primary" />
                    <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1 h-1 rounded-full bg-primary" />
                    <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1 h-1 rounded-full bg-primary" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/[0.02] border-t border-white/5">
            <div className="flex items-end gap-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder="Ask for assistance or report an issue..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none min-h-[56px] max-h-32"
                  rows={1}
                />
                <button className="absolute right-3 bottom-3 p-2 rounded-xl text-white/30 hover:text-white transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/30 hover:text-white transition-colors group">
                  <Mic className="w-5 h-5 group-hover:text-primary-neon transition-colors" />
                </button>
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isStreaming}
                  className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Emotion Monitoring Sidebar */}
      <div className="w-80 flex flex-col gap-6">
        <GlassCard className="border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-secondary-neon" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Emotion Monitor</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Detected State</p>
              <EmotionBadge type={currentEmotion.type} confidence={currentEmotion.confidence} />
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/40">
                  <span>Confidence Level</span>
                  <span>{currentEmotion.confidence}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentEmotion.confidence}%` }}
                    className={`h-full bg-gradient-to-r ${currentEmotion.type === 'Urgent' ? 'from-red-500 to-purple-500' : 'from-primary to-secondary'}`}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-accent-neon" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Self-Correction Mode</span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed italic">
                "AI has identified frustration patterns. Switching to empathetic tone with historical context priority."
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="border-white/5 flex-1 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Neural Insights</h3>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Intent Mapping</p>
              <div className="flex flex-wrap gap-2">
                {['AUTH_ERROR', 'LOGIN_ISSUE', 'CRITICAL_DEADLINE'].map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-mono text-indigo-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Response Quality</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`w-1.5 h-6 rounded-sm ${i <= 4 ? 'bg-accent-neon' : 'bg-white/5'}`} />
                ))}
                <span className="ml-2 text-xs font-bold text-accent-neon uppercase">A+ High</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default LiveChat;
