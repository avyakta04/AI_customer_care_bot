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

const audioSamples = [
  {
    title: "Frustrated System Outage",
    desc: "Vocal spikes, high stress, speed variation",
    transcription: "I have been trying to get this database restored for over two hours now! It is extremely critical and we are losing sales. Connect me to supervisor immediately!",
    intensity: 85,
    pitch: 340,
    stress: 92,
    density: 1.35,
    happiness: 5,
    frustration: 90,
    neutrality: 5
  },
  {
    title: "VIP Account Query",
    desc: "Calm tone, moderate stress, high density",
    transcription: "Hello, my client key seems to have an active lock on the regional replica cluster. Could you check if the syncer database is up-to-date?",
    intensity: 55,
    pitch: 210,
    stress: 30,
    density: 1.10,
    happiness: 20,
    frustration: 15,
    neutrality: 65
  },
  {
    title: "Satisfied Customer Feedback",
    desc: "Energetic frequency, high happiness, minimal stress",
    transcription: "Awesome! The system responded in under 50 milliseconds. Thanks for the quick support and resolving our routing latency issue!",
    intensity: 70,
    pitch: 280,
    stress: 10,
    density: 0.95,
    happiness: 88,
    frustration: 2,
    neutrality: 10
  }
];

const VoiceAnalysis = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);
  const [displayedTranscription, setDisplayedTranscription] = useState("");
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [intensity, setIntensity] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [stress, setStress] = useState(12);
  const [density, setDensity] = useState(0.0);

  // Chart data histories for rolling charts
  const [intensityHistory, setIntensityHistory] = useState(Array(20).fill(0));
  const [pitchHistory, setPitchHistory] = useState(Array(20).fill(0));
  const [stressHistory, setStressHistory] = useState(Array(20).fill(12));
  const [densityHistory, setDensityHistory] = useState(Array(20).fill(0));

  useEffect(() => {
    let interval;
    
    if (isRecording) {
      // Fast updates for active pipeline step
      interval = setInterval(() => {
        setPipelineStep(prev => (prev + 1) % 4);
      }, 1000);
    } else {
      setPipelineStep(-1);
    }
    
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    const dataInterval = setInterval(() => {
      // Simulate real-time vocal frequency dynamics
      if (isRecording) {
        const baseInt = selectedSample ? selectedSample.intensity : intensity;
        const basePitch = selectedSample ? selectedSample.pitch : pitch;
        const baseStress = selectedSample ? selectedSample.stress : stress;
        const baseDens = selectedSample ? selectedSample.density : density;

        const nextInt = Math.max(25, Math.min(95, baseInt + (Math.random() - 0.5) * 10));
        const nextPitch = Math.max(140, Math.min(380, basePitch + (Math.random() - 0.5) * 20));
        const nextStress = Math.max(45, Math.min(95, baseStress + (Math.random() - 0.5) * 5));
        const nextDens = Math.max(0.4, Math.min(1.4, baseDens + (Math.random() - 0.5) * 0.1));

        setIntensity(nextInt);
        setPitch(nextPitch);
        setStress(nextStress);
        setDensity(nextDens);

        setIntensityHistory(prev => [...prev.slice(1), nextInt]);
        setPitchHistory(prev => [...prev.slice(1), nextPitch]);
        setStressHistory(prev => [...prev.slice(1), nextStress]);
        setDensityHistory(prev => [...prev.slice(1), nextDens * 50]); // scale for visual consistency
      } else {
        // Slow ambient static wave when standby
        const nextInt = Math.max(2, Math.min(12, 5 + (Math.random() - 0.5) * 4));
        const nextPitch = 0;
        const nextStress = Math.max(5, Math.min(15, 10 + (Math.random() - 0.5) * 2));
        const nextDens = 0.0;

        setIntensity(nextInt);
        setPitch(nextPitch);
        setStress(nextStress);
        setDensity(nextDens);

        setIntensityHistory(prev => [...prev.slice(1), nextInt]);
        setPitchHistory(prev => [...prev.slice(1), 0]);
        setStressHistory(prev => [...prev.slice(1), nextStress]);
        setDensityHistory(prev => [...prev.slice(1), 0]);
      }
    }, 300);

    return () => clearInterval(dataInterval);
  }, [isRecording, intensity, pitch, stress, density, selectedSample]);

  useEffect(() => {
    if (!isRecording) {
      setDisplayedTranscription("");
      return;
    }

    if (selectedSample) {
      setDisplayedTranscription("");
      const words = selectedSample.transcription.split(" ");
      let currentIdx = 0;

      const interval = setInterval(() => {
        if (currentIdx < words.length) {
          setDisplayedTranscription(prev => (prev ? prev + " " : "") + words[currentIdx]);
          currentIdx++;
        } else {
          clearInterval(interval);
        }
      }, 350);

      return () => clearInterval(interval);
    } else {
      setDisplayedTranscription("I've been trying to get this to work for some time now and it's starting to get really frustrating...");
    }
  }, [selectedSample, isRecording]);

  const getChartData = (history, color) => ({
    labels: Array(20).fill(''),
    datasets: [
      {
        data: history,
        borderColor: color,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: true,
        backgroundColor: `${color}0A`,
      }
    ]
  });

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
             onClick={() => {
               setIsRecording(!isRecording);
               if (!isRecording) {
                 setIntensity(45);
                 setPitch(220);
                 setStress(65);
                 setDensity(0.85);
               }
             }}
             className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-3 transition-all ${
               isRecording 
               ? 'bg-red-500/20 border border-red-500/30 text-red-500 neon-glow animate-pulse' 
               : 'bg-primary text-white shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98]'
             }`}
          >
            {isRecording ? <Square className="w-4 h-4 fill-current animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {isRecording ? 'STOP ANALYSIS' : 'START RECORDING'}
          </button>
          <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/50 hover:text-white transition-all active:scale-[0.95]">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visualizer Panel */}
        <GlassCard className="lg:col-span-2 flex flex-col justify-center min-h-[400px] border-white/5">
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/10 animate-ping'}`} />
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
          {/* Vocal Sample Soundboard */}
          <GlassCard className="border-white/5 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Mic className="w-5 h-5 text-violet-400 animate-pulse" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Vocal Simulator Board</h3>
            </div>
            <div className="space-y-3">
              {audioSamples.map((sample) => (
                <motion.button
                  key={sample.title}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.03)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedSample(sample);
                    setIsRecording(true);
                    setIntensity(sample.intensity);
                    setPitch(sample.pitch);
                    setStress(sample.stress);
                    setDensity(sample.density);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col ${
                    selectedSample?.title === sample.title && isRecording
                      ? 'border-violet-500 bg-violet-500/5'
                      : 'border-white/5 bg-white/[0.01] hover:border-white/25'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[11px] font-black text-white uppercase tracking-wider">{sample.title}</span>
                    {selectedSample?.title === sample.title && isRecording && (
                      <span className="text-[8px] font-mono text-violet-400 uppercase tracking-widest font-black animate-pulse">STREAMING</span>
                    )}
                  </div>
                  <span className="text-[9px] text-white/40 mt-1 font-semibold">{sample.desc}</span>
                </motion.button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Sentiment Confidence</h3>
              <Crosshair className="w-4 h-4 text-primary-neon animate-spin-slow" />
            </div>
            
            <div className="space-y-5">
              {[
                { label: 'Happy', val: isRecording ? (selectedSample ? selectedSample.happiness : Math.max(0, Math.round(15 + Math.sin(Date.now() / 2000) * 10))) : 0, color: 'bg-green-500' },
                { label: 'Frustrated', val: isRecording ? (selectedSample ? selectedSample.frustration : Math.max(0, Math.round(75 + Math.cos(Date.now() / 2000) * 12))) : 0, color: 'bg-orange-500' },
                { label: 'Neutral', val: isRecording ? (selectedSample ? selectedSample.neutrality : Math.max(0, Math.round(10 - Math.sin(Date.now() / 2000) * 5))) : 0, color: 'bg-blue-500' },
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
                      transition={{ duration: 0.3 }}
                      className={`h-full ${item.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="border-white/5 flex-1 min-h-[200px] relative overflow-hidden">
             <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
             <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Transcription Preview</h3>
             <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 h-[120px] overflow-y-auto">
               <p className={`text-sm leading-relaxed transition-all ${isRecording ? 'text-white/80' : 'text-white/10 italic'}`}>
                 {isRecording 
                   ? (displayedTranscription || "Waiting for stream text segment...") 
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
              <Line data={getChartData(intensityHistory, '#8b5cf6')} options={chartOptions} />
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
              <Line data={getChartData(pitchHistory, '#06b6d4')} options={chartOptions} />
           </div>
        </GlassCard>

        <GlassCard>
           <div className="flex items-center gap-3 mb-4">
             <Zap className="w-4 h-4 text-accent-neon" />
             <span className="text-[10px] font-bold text-white/40 uppercase">Stress Index</span>
           </div>
           <div className="flex items-end gap-2 text-accent-neon">
              <span className="text-3xl font-bold tracking-tighter">{isRecording ? 'HIGH' : 'LOW'}</span>
              <span className="text-[10px] text-white/30 font-bold mb-1.5 ml-2">LEVEL_{isRecording ? '3' : '1'} ({Math.round(stress)}%)</span>
           </div>
           <div className="h-12 mt-4">
              <Line data={getChartData(stressHistory, '#10b981')} options={chartOptions} />
           </div>
        </GlassCard>

        <GlassCard>
           <div className="flex items-center gap-3 mb-4">
             <BarChart className="w-4 h-4 text-amber-500" />
             <span className="text-[10px] font-bold text-white/40 uppercase">Information Density</span>
           </div>
           <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white tracking-tighter">{density.toFixed(2)}</span>
              <span className="text-[10px] text-white/30 font-bold mb-1.5">bits/s</span>
           </div>
           <div className="h-12 mt-4">
              <Line data={getChartData(densityHistory, '#f59e0b')} options={chartOptions} />
           </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default VoiceAnalysis;
