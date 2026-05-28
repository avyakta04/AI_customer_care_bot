import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Volume2, 
  Wifi, 
  Zap, 
  RotateCcw, 
  Play, 
  Square,
  Crosshair,
  BarChart
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Waveform from '../components/Waveform';
import ProcessingPipeline from '../components/ProcessingPipeline';
import { Line } from 'react-chartjs-2';

const VoiceAnalysis = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [intensity, setIntensity] = useState(45);
  const [pitch, setPitch] = useState(220);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setIntensity(prev => Math.max(10, Math.min(100, prev + (Math.random() - 0.5) * 40)));
        setPitch(prev => Math.max(100, Math.min(500, prev + (Math.random() - 0.5) * 50)));
        setPipelineStep(prev => (prev + 1) % 4);
      }, 1000);
    } else {
      setPipelineStep(-1);
      setIntensity(0);
      setPitch(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const chartData = {
    labels: Array(20).fill(''),
    datasets: [
      {
        label: 'Voice Stress',
        data: Array(20).fill(0).map(() => Math.random() * 100),
        borderColor: '#8b5cf6',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.05)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false, min: 0, max: 100 }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Voice Emotion Analysis</h1>
          <p className="text-white/40 mt-1">Real-time spectral analysis and sentiment extraction.</p>
        </div>
        <div className="flex gap-4">
          <button 
             onClick={() => setIsRecording(!isRecording)}
             className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-3 transition-all ${
               isRecording 
               ? 'bg-red-500/20 border border-red-500/30 text-red-500 neon-glow' 
               : 'bg-primary text-white shadow-lg shadow-primary/20'
             }`}
          >
            {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isRecording ? 'STOP ANALYSIS' : 'START RECORDING'}
          </button>
          <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/50 hover:text-white transition-all">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visualizer Panel */}
        <GlassCard className="lg:col-span-2 flex flex-col justify-center min-h-[400px] border-white/5">
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/10'}`} />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">
              {isRecording ? 'Live Spectral Input' : 'Microphone Standby'}
            </span>
          </div>

          <Waveform isActive={isRecording} />

          <div className="mt-12">
            <ProcessingPipeline currentStep={pipelineStep} />
          </div>
        </GlassCard>

        {/* Confidence & Transcription */}
        <div className="space-y-8">
          <GlassCard className="border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Sentiment Confidence</h3>
              <Crosshair className="w-4 h-4 text-primary-neon" />
            </div>
            
            <div className="space-y-5">
              {[
                { label: 'Happy', val: isRecording ? 12 : 0, color: 'bg-green-500' },
                { label: 'Frustrated', val: isRecording ? 78 : 0, color: 'bg-orange-500' },
                { label: 'Neutral', val: isRecording ? 10 : 0, color: 'bg-blue-500' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-white/60">
                    <span>{item.label}</span>
                    <span>{item.val}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.val}%` }}
                      className={`h-full ${item.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="border-white/5 flex-1 min-h-[200px]">
             <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Transcription Preview</h3>
             <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 h-[120px] overflow-y-auto">
               <p className={`text-sm leading-relaxed transition-all ${isRecording ? 'text-white/80' : 'text-white/10 italic'}`}>
                 {isRecording 
                   ? "I've been trying to get this to work for some time now and it's starting to get really frustrating..." 
                   : "Waiting for voice input stream..."}
                 {isRecording && <span className="inline-block w-1 h-4 bg-primary-neon ml-1 animate-pulse" />}
               </p>
             </div>
          </GlassCard>
        </div>
      </div>

      {/* Monitoring Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard>
           <div className="flex items-center gap-3 mb-4">
             <Volume2 className="w-4 h-4 text-primary-neon" />
             <span className="text-[10px] font-bold text-white/40 uppercase">Speech Intensity</span>
           </div>
           <div className="flex items-end gap-2">
             <span className="text-3xl font-bold text-white tracking-tighter">{Math.round(intensity)}</span>
             <span className="text-[10px] text-white/30 font-bold mb-1.5">dB</span>
           </div>
           <div className="h-12 mt-4">
              <Line data={chartData} options={chartOptions} />
           </div>
        </GlassCard>

        <GlassCard>
           <div className="flex items-center gap-3 mb-4">
             <Wifi className="w-4 h-4 text-secondary-neon" />
             <span className="text-[10px] font-bold text-white/40 uppercase">Fundamental Pitch</span>
           </div>
           <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white tracking-tighter">{Math.round(pitch)}</span>
              <span className="text-[10px] text-white/30 font-bold mb-1.5">Hz</span>
           </div>
           <div className="h-12 mt-4">
              <Line data={{...chartData, datasets: [{...chartData.datasets[0], borderColor: '#06b6d4'}]}} options={chartOptions} />
           </div>
        </GlassCard>

        <GlassCard>
           <div className="flex items-center gap-3 mb-4">
             <Zap className="w-4 h-4 text-accent-neon" />
             <span className="text-[10px] font-bold text-white/40 uppercase">Stress Index</span>
           </div>
           <div className="flex items-end gap-2 text-accent-neon">
              <span className="text-3xl font-bold tracking-tighter">LOW</span>
              <span className="text-[10px] text-white/30 font-bold mb-1.5 ml-2">LEVEL_1</span>
           </div>
           <div className="h-12 mt-4">
              <Line data={{...chartData, datasets: [{...chartData.datasets[0], borderColor: '#10b981'}]}} options={chartOptions} />
           </div>
        </GlassCard>

        <GlassCard>
           <div className="flex items-center gap-3 mb-4">
             <BarChart className="w-4 h-4 text-amber-500" />
             <span className="text-[10px] font-bold text-white/40 uppercase">Information Density</span>
           </div>
           <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white tracking-tighter">0.84</span>
              <span className="text-[10px] text-white/30 font-bold mb-1.5">bits/s</span>
           </div>
           <div className="h-12 mt-4">
              <Line data={{...chartData, datasets: [{...chartData.datasets[0], borderColor: '#f59e0b'}]}} options={chartOptions} />
           </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default VoiceAnalysis;
