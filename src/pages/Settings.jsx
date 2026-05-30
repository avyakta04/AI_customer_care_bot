import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sliders, 
  ShieldAlert, 
  Database, 
  Smile, 
  Cpu, 
  Activity, 
  Lock, 
  Zap, 
  CheckCircle,
  Network
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Settings = () => {
  // Model tuning states
  const [temperature, setTemperature] = useState(0.4);
  const [maxTokens, setMaxTokens] = useState(512);

  // Safety filter states
  const [policingActive, setPolicingActive] = useState(true);
  const [ethicsFilter, setEthicsFilter] = useState(true);
  const [escalationThreshold, setEscalationThreshold] = useState(85);

  // Active tone persona
  const [activePersona, setActivePersona] = useState('empathetic');

  // Vector DB states
  const [dbUrl, setDbUrl] = useState('http://localhost:8000/chromadb');
  const [dbConnecting, setDbConnecting] = useState(false);
  const [dbStatus, setDbStatus] = useState('Nominal'); // 'Nominal', 'Testing', 'Verified', 'Failed'
  const [dbLogs, setDbLogs] = useState([]);

  // Database Connection Testing simulation
  const handleTestConnection = () => {
    setDbConnecting(true);
    setDbStatus('Testing');
    setDbLogs([]);

    const logMessages = [
      "INIT_CONNECTION: Pinging local port 8000...",
      "HANDSHAKE: Establishing secure schema protocol...",
      "DATABASE_CHECK: Synced collections found... NOMINAL (14,204 indices)",
      "VERIFICATION: Latency 8.4ms... SECURED"
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < logMessages.length) {
        setDbLogs(prev => [...prev, logMessages[step]]);
        step++;
      } else {
        clearInterval(interval);
        setDbConnecting(false);
        setDbStatus('Verified');
      }
    }, 800);
  };

  const personas = [
    { id: 'empathetic', title: 'Empathetic Guide', icon: Smile, desc: 'Prioritizes calming language, frustration reduction, and active listening.' },
    { id: 'technical', title: 'Strict Technical', icon: Cpu, desc: 'Focuses entirely on factual solutions, schema specifications, and database corrections.' },
    { id: 'neutral', title: 'Neutral Concierge', icon: Activity, desc: 'Balanced response pattern optimizing processing speeds.' }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">System Settings</h1>
        <p className="text-white/40 mt-1 text-sm font-medium">Fine-tune active neural profiles and safety firewall parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: Model Tuning Sandbox */}
        <div className="space-y-8 lg:col-span-2">
          
          {/* Model Tuning Parameters */}
          <GlassCard className="p-8 border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Model Tuning Sandbox</h3>
                <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mt-0.5">Parameters drive inference outputs</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Temperature slider */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-white/60">
                  <span className="uppercase tracking-wider">Temperature</span>
                  <span className="font-mono text-violet-400 font-bold">{temperature.toFixed(2)}</span>
                </div>
                <div className="relative">
                  <input 
                    type="range" 
                    min="0" 
                    max="1.0" 
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-violet-500 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-white/20 mt-1 px-1">
                    <span>STRICT (0.00)</span>
                    <span>CREATIVE (1.00)</span>
                  </div>
                </div>
              </div>

              {/* Max tokens slider */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-white/60">
                  <span className="uppercase tracking-wider">Max Generation Tokens</span>
                  <span className="font-mono text-violet-400 font-bold">{maxTokens} tokens</span>
                </div>
                <div className="relative">
                  <input 
                    type="range" 
                    min="128" 
                    max="2048" 
                    step="128"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full accent-violet-500 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-white/20 mt-1 px-1">
                    <span>128 TOKENS</span>
                    <span>2048 TOKENS</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Active Tone Profile Selection */}
          <GlassCard className="p-8 border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-400">
                <Smile className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Active Tone Profile</h3>
                <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mt-0.5">Select bot interaction persona</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {personas.map((persona) => {
                const Icon = persona.icon;
                const isSelected = activePersona === persona.id;
                
                return (
                  <motion.button
                    key={persona.id}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActivePersona(persona.id)}
                    className={`p-6 rounded-2xl border text-left transition-all flex flex-col justify-between h-44 ${
                      isSelected 
                        ? 'border-pink-500/30 bg-pink-500/[0.04] shadow-[0_0_20px_rgba(244,63,94,0.1)]' 
                        : 'border-white/5 bg-slate-950/40 hover:border-white/20'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl bg-white/[0.03] border border-white/5 ${isSelected ? 'text-pink-400' : 'text-white/30'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wide mb-1">{persona.title}</h4>
                      <p className="text-[9px] text-white/40 leading-relaxed font-semibold">{persona.desc}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Column 2: Safety & DB Configurations */}
        <div className="space-y-8">
          
          {/* Safety policy firewall */}
          <GlassCard className="p-8 border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Safety Policy Firewall</h3>
                <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mt-0.5">Real-time policing boundaries</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Hallucination toggle */}
              <div className="flex justify-between items-center py-2.5 border-b border-white/[0.05]">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Hallucination Policing</h4>
                  <p className="text-[8px] text-white/30 uppercase mt-0.5">Validates responses against vectors</p>
                </div>
                <button 
                  onClick={() => setPolicingActive(!policingActive)}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${policingActive ? 'bg-emerald-500' : 'bg-white/10'}`}
                >
                  <motion.div 
                    layout 
                    className="w-4 h-4 bg-slate-950 rounded-full" 
                    animate={{ x: policingActive ? 24 : 0 }}
                  />
                </button>
              </div>

              {/* Ethics filter toggle */}
              <div className="flex justify-between items-center py-2.5 border-b border-white/[0.05]">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Tonal Compliance Guard</h4>
                  <p className="text-[8px] text-white/30 uppercase mt-0.5">Flags passive-aggression</p>
                </div>
                <button 
                  onClick={() => setEthicsFilter(!ethicsFilter)}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${ethicsFilter ? 'bg-emerald-500' : 'bg-white/10'}`}
                >
                  <motion.div 
                    layout 
                    className="w-4 h-4 bg-slate-950 rounded-full" 
                    animate={{ x: ethicsFilter ? 24 : 0 }}
                  />
                </button>
              </div>

              {/* Escalation slider */}
              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between text-[10px] font-bold text-white/60 uppercase">
                  <span>Auto-Escalation Threshold</span>
                  <span className="font-mono text-emerald-400 font-bold">{escalationThreshold}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  value={escalationThreshold}
                  onChange={(e) => setEscalationThreshold(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 bg-white/5 h-1 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </GlassCard>

          {/* Database connections */}
          <GlassCard className="p-8 border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
                <Database className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Vector Core Link</h3>
                <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mt-0.5">ChromaDB index targets</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest font-mono">CONNECTION URL</span>
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={dbUrl}
                    onChange={(e) => setDbUrl(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs text-white/70 focus:outline-none focus:border-cyan-500/30"
                  />
                  <div className="absolute right-4 p-1 rounded bg-white/5">
                    <Lock className="w-3.5 h-3.5 text-white/30" />
                  </div>
                </div>
              </div>

              {/* simulated logs panel */}
              {dbLogs.length > 0 && (
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[9px] text-cyan-400 space-y-1.5 h-28 overflow-y-auto">
                  {dbLogs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-white/20">&gt;&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={handleTestConnection}
                disabled={dbConnecting}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex justify-center items-center gap-2.5"
              >
                {dbStatus === 'Testing' ? (
                  <>
                    <Network className="w-4 h-4 animate-spin" />
                    TESTING LINK...
                  </>
                ) : dbStatus === 'Verified' ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                    LINK SECURED
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    TEST CONNECTION
                  </>
                )}
              </button>
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
};

export default Settings;
