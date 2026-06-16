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
  { id: 1, text: "ECHOMIND connection established. Secure Session ID: 0x-A492-B812. AI Core v4.0 monitoring engaged.", isAI: true, timestamp: "10:00 AM", status: "SYSTEM_INIT" },
  { id: 2, text: "Hello, I've been trying to access my enterprise dashboard for the last hour but I keep getting a credential mismatch error. This is very frustrating as I have a deadline.", isAI: false, timestamp: "10:01 AM" },
];

const personas = [
  {
    name: "VIP Outage",
    emoji: "😡",
    emotion: "Urgent",
    confidence: 98,
    text: "This is unacceptable! The server has been down for 2 hours, and our team is losing thousands of dollars! I need immediate support!",
    tags: ["SERVER_DOWN", "VIP_SUPPORT", "FINANCIAL_LOSS", "ESCALATION"],
    response: "I understand the extreme urgency of this database outage. I have immediately activated our VIP backup node and routed your request to the Tier 3 Supervisor. Synchronizing emergency redundancy cluster now."
  },
  {
    name: "Confused Trialist",
    emoji: "🤔",
    emotion: "Confused",
    confidence: 85,
    text: "Hello! I am trying to integrate the webhook, but the payload format in your docs doesn't match the event response. Can you help?",
    tags: ["WEBHOOK_ERR", "DOCS_DESYNC", "API_PAYLOAD", "INTEGRATION"],
    response: "I see a format mismatch in our webhook documentation payload definition. Let me pull the current production JSON schema. I am updating your local environment configurations now. Try resending the payload."
  },
  {
    name: "Happy Advocate",
    emoji: "😄",
    emotion: "Happy",
    confidence: 95,
    text: "Wow, the voice translation response speed is incredibly fast! I wanted to say thank you to the team for this outstanding upgrade!",
    tags: ["LATENCY_NOMINAL", "PRODUCT_LOVE", "SPEECH_SPEED", "LOYALTY"],
    response: "We are absolutely thrilled to hear the voice translation module is meeting your standards! Your feedback has been synchronized with the core product weights to keep high-frequency performance optimized."
  }
];

const LiveChat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [reasoningStep, setReasoningStep] = useState(0); // 0 = Idle, 1 = Analyzing, 2 = Memory, 3 = Supervisor, 4 = Generating
  const [currentEmotion, setCurrentEmotion] = useState({ type: 'Frustrated', confidence: 88 });
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTags, setActiveTags] = useState(['AUTH_CORE', 'TOKEN_SYNC', 'UI_BLOCKER', 'LATENCY']);
  const scrollRef = useRef(null);

  const getGlowClass = () => {
    switch (currentEmotion.type) {
      case 'Urgent':
      case 'Frustrated':
      case 'Angry':
        return 'shadow-[0_0_30px_rgba(239,68,68,0.15)] border-red-500/20';
      case 'Happy':
        return 'shadow-[0_0_30px_rgba(16,185,129,0.15)] border-emerald-500/20';
      case 'Confused':
        return 'shadow-[0_0_30px_rgba(245,158,11,0.15)] border-amber-500/20';
      default:
        return 'shadow-[0_0_30px_rgba(30,58,138,0.15)] border-primary/20';
    }
  };

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

  const handleFeedbackSubmit = async (messageId, score) => {
    try {
      await fetch('http://localhost:8000/api/hindsight/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message_id: messageId,
          feedback_score: score,
          corrected_response: score === -1 ? "I apologize. I have updated ECHOMIND learning weights and queued an automated resolution trace for billing staff." : null
        })
      });
    } catch (e) {
      console.error("Failed to submit feedback:", e);
    }
  };

  const simulateAIResponse = async (userText) => {
    setIsTyping(true);
    setReasoningStep(1);
    
    try {
      const response = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: 'SID_9921_ECHOMIND',
          customer_id: 'CUST001',
          text: userText
        })
      });
      const data = await response.json();
      
      // Step 2: Memory Retrieval
      await new Promise(r => setTimeout(r, 600));
      setReasoningStep(2);
      
      // Step 3: Supervisor Review
      await new Promise(r => setTimeout(r, 600));
      setReasoningStep(3);
      
      // Step 4: Generating Response
      await new Promise(r => setTimeout(r, 600));
      setReasoningStep(4);
      
      await new Promise(r => setTimeout(r, 400));

      setIsTyping(false);
      setReasoningStep(0);
      setIsStreaming(true);
      
      setCurrentEmotion({ type: data.emotion, confidence: Math.round(data.emotion_confidence * 100) });
      
      const tags = [
        data.intent.toUpperCase(),
        data.urgency.toUpperCase(),
        ...data.top_features.map(f => f.toUpperCase())
      ];
      setActiveTags(tags);
      
      const aiResponseId = Date.now() + 1;
      const fullText = data.response;

      let currentIdx = 0;
      const streamingMsg = {
        id: aiResponseId,
        text: "",
        isAI: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "ECHOMIND_STREAMING"
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
          currentIdx += 2;
        } else {
          clearInterval(interval);
          setIsStreaming(false);
          setMessages(prev => {
            const last = [...prev];
            const msgIdx = last.findIndex(m => m.id === aiResponseId);
            if (msgIdx !== -1) {
              last[msgIdx] = { 
                ...last[msgIdx], 
                status: "VERIFIED_RESPONSE",
                message_id: data.message_id
              };
            }
            return last;
          });
        }
      }, 15);
      
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setReasoningStep(0);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Error: Could not connect to ECHOMIND backend. Please verify that the FastAPI server is running on http://127.0.0.1:8000.",
        isAI: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "SYSTEM_ERR"
      }]);
    }
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
        <GlassCard className={`flex-1 p-0 flex flex-col overflow-hidden relative border-slate-200/80 rounded-[2.5rem] transition-all duration-700 ${getGlowClass()}`}>
          <div className="px-8 py-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/40 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-premium flex items-center justify-center text-white shadow-lg">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center border border-slate-200">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Session Engage</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">Core v4.0 Active</p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 group hover:border-primary/30 transition-colors cursor-default">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Protocol Secured</span>
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
                messageId={msg.message_id}
                onFeedback={handleFeedbackSubmit}
              />
            ))}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-4 mb-6"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm animate-pulse">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-[2rem] rounded-tl-none flex flex-col gap-4 min-w-[320px] shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] font-black">ECHOMIND Reasoning Active</span>
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  </div>
                  <div className="space-y-2">
                    {[
                      { step: 1, label: 'Analyzing Intent & Semantics' },
                      { step: 2, label: 'Retrieving Vector Context' },
                      { step: 3, label: 'Supervisor Evaluation & Hallucination Scan' },
                      { step: 4, label: 'Response Generation Engaged' }
                    ].map((s) => {
                       const isActive = reasoningStep === s.step;
                       const isDone = reasoningStep > s.step;
                       return (
                        <div key={s.step} className="flex items-center gap-3 text-xs">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center border text-[9px] font-mono transition-all duration-300 ${
                            isDone 
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-600' 
                              : isActive 
                              ? 'bg-primary/5 border border-primary/20 text-primary animate-pulse shadow-sm'
                              : 'bg-slate-100 border-slate-200 text-slate-400'
                          }`}>
                            {isDone ? '✓' : s.step}
                          </div>
                          <span className={`font-mono tracking-tight transition-colors duration-300 ${
                            isDone ? 'text-slate-400' : isActive ? 'text-slate-900 font-bold' : 'text-slate-350'
                          }`}>
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-slate-50/50 border-t border-slate-200">
            <div className="max-w-4xl mx-auto flex items-end gap-4">
              <div className="flex-1 relative group">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent group-focus-within:via-primary transition-all" />
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder="Enter message or use /commands..."
                  className="w-full bg-white border border-slate-200 rounded-[2rem] p-5 pr-14 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary/30 transition-all resize-none min-h-[64px] max-h-48 shadow-sm"
                  rows={1}
                />
                <button className="absolute right-5 bottom-5 p-1 text-slate-400 hover:text-slate-800 transition-colors group">
                  <Command className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
              <div className="flex gap-3">
                <button className="p-5 bg-slate-100 border border-slate-250 rounded-[2rem] text-slate-400 hover:text-primary hover:bg-primary/5 transition-all group active:scale-95 shadow-sm">
                  <Mic className="w-5 h-5 transition-transform group-hover:scale-110" />
                </button>
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isStreaming}
                  className="p-5 bg-gradient-premium text-white rounded-[2rem] shadow-sm hover:brightness-110 transition-all disabled:opacity-50 active:scale-95 group"
                >
                  <Send className="w-5 h-5 fill-current group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex justify-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Press Ent to send • Shift+Ent for newline</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Emotion Monitoring Sidebar */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        {/* Customer Persona Simulator Card */}
        <GlassCard className="border-slate-200/80 rounded-[2.5rem] bg-white/70 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Simulator Personas</h3>
          </div>
          <div className="space-y-4">
            {personas.map((persona) => (
              <motion.button
                key={persona.name}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setInputValue(persona.text);
                  setCurrentEmotion({ type: persona.emotion, confidence: persona.confidence });
                  setActiveTags(persona.tags);
                }}
                className="w-full text-left p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-primary/30 transition-all flex items-start gap-3.5 group"
              >
                <span className="text-2xl mt-0.5">{persona.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-slate-700 group-hover:text-primary transition-colors uppercase tracking-wider">{persona.name}</h4>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-black">{persona.emotion}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 truncate font-medium">{persona.text}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="border-slate-200/80 rounded-[2.5rem] bg-white/70 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20">
                <Activity className="w-5 h-5 text-secondary animate-pulse" />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Emotion Core</h3>
            </div>
            <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-[9px] font-bold text-emerald-600 uppercase tracking-tighter animate-pulse">Live Scan</div>
          </div>
          
          <div className="space-y-6">
            <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-200 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-5">Primary Detection</p>
              
              {/* Dynamic Emotion Ring */}
              <div className="flex flex-col items-center justify-center my-6 relative">
                <svg width="120" height="120" className="rotate-[-90deg]">
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    stroke="rgba(15,23,42,0.05)"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="48"
                    stroke={
                      currentEmotion.type === 'Urgent' || currentEmotion.type === 'Frustrated' ? '#ef4444' :
                      currentEmotion.type === 'Happy' ? '#10b981' :
                      currentEmotion.type === 'Confused' ? '#f59e0b' : '#3b82f6'
                    }
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 48}
                    initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 48 - (currentEmotion.confidence / 100) * (2 * Math.PI * 48) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    fill="transparent"
                    style={{
                      filter: `drop-shadow(0 0 6px ${
                        currentEmotion.type === 'Urgent' || currentEmotion.type === 'Frustrated' ? 'rgba(239,68,68,0.2)' :
                        currentEmotion.type === 'Happy' ? 'rgba(16,185,129,0.2)' :
                        currentEmotion.type === 'Confused' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)'
                      })`
                    }}
                  />
                </svg>
                
                {/* Floating Core */}
                <motion.div 
                  animate={{
                    scale: [1, 1.04, 1],
                    boxShadow: [
                      '0 0 10px rgba(15,23,42,0.02)',
                      '0 0 20px rgba(30,58,138,0.1)',
                      '0 0 10px rgba(15,23,42,0.02)'
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute w-16 h-16 rounded-full bg-white border border-slate-200 flex flex-col items-center justify-center z-10 shadow-md"
                >
                  <span className="text-sm font-black text-slate-800 tracking-tighter leading-none">{currentEmotion.confidence}%</span>
                  <span className="text-[7px] font-mono text-slate-400 uppercase tracking-widest mt-1">CONF</span>
                </motion.div>
              </div>
 
              <div className="flex justify-center mb-6">
                <EmotionBadge type={currentEmotion.type} confidence={currentEmotion.confidence} />
              </div>
              
              <div className="mt-8 space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Confidence Scale</span>
                  <span className="text-slate-800">{currentEmotion.confidence}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentEmotion.confidence}%` }}
                    transition={{ duration: 1.5, cubicBezier: [0.16, 1, 0.3, 1] }}
                    className={`h-full rounded-full bg-gradient-to-r ${currentEmotion.type === 'Urgent' || currentEmotion.type === 'Frustrated' ? 'from-red-500 via-orange-500 to-amber-500' : 'from-primary to-secondary'}`}
                  />
                </div>
              </div>
            </div>
 
            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-[0.1em]">AI Adaptive Tone</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
                "System recalibrating response parameters to account for user frustration spikes. Priority: Empathy + Resolution."
              </p>
            </div>
          </div>
        </GlassCard>
 
        <GlassCard className="border-slate-200/80 flex-1 p-8 rounded-[2.5rem] bg-white/70 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Info className="w-5 h-5 text-indigo-500" />
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">ECHOMIND Insights</h3>
          </div>
          
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Detected Intents</p>
              <div className="flex flex-wrap gap-2.5">
                {activeTags.map(tag => (
                  <motion.span 
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                    key={tag} 
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-[10px] font-mono font-bold text-indigo-600"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Accuracy Index</p>
                <span className="text-[10px] font-bold text-emerald-600 tracking-[0.2em]">A+ GRADE</span>
              </div>
              <div className="flex items-end gap-1.5 h-10">
                {[45, 65, 85, 95, 100, 90, 80].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1, duration: 1, ease: "circOut" }}
                    className={`flex-1 rounded-t-sm ${i < 5 ? 'bg-gradient-to-t from-emerald-500/50 to-emerald-400' : 'bg-slate-100'}`}
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
