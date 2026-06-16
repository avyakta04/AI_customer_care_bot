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

<<<<<<< HEAD
  // Sentiment values returned by model
  const [happyVal, setHappyVal] = useState(0);
  const [frustratedVal, setFrustratedVal] = useState(0);
  const [neutralVal, setNeutralVal] = useState(0);

=======
>>>>>>> 987d03ae86da3d6ad18815118b36c0ed046b6776
  // Chart data histories for rolling charts
  const [intensityHistory, setIntensityHistory] = useState(Array(20).fill(0));
  const [pitchHistory, setPitchHistory] = useState(Array(20).fill(0));
  const [stressHistory, setStressHistory] = useState(Array(20).fill(12));
  const [densityHistory, setDensityHistory] = useState(Array(20).fill(0));

<<<<<<< HEAD
  const createWavBlob = (pitchHz, intensityDb, stressPercent) => {
    const sampleRate = 16000;
    const duration = 2.0;
    const numSamples = sampleRate * duration;
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);
    
    // Write WAV header
    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 36 + numSamples * 2, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, numSamples * 2, true);
    
    const noiseLevel = stressPercent / 250.0;
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let val = Math.sin(2 * Math.PI * pitchHz * t);
      val += 0.5 * np.sin(2 * np.pi * (pitchHz * 2) * t); // Add harmonic
      val += noiseLevel * (Math.random() * 2 - 1);
      val = Math.max(-1, Math.min(1, val / 1.5));
      view.setInt16(44 + i * 2, val * 32767, true);
    }
    return new Blob([buffer], { type: 'audio/wav' });
  };

  const np = { sin: Math.sin, pi: Math.PI }; // simple math mapping for python snippet compatibility

  const runAudioMLAnalysis = async (pHz, iDb, sP) => {
    try {
      const wavBlob = createWavBlob(pHz, iDb, sP);
      const audioFile = new File([wavBlob], "simulation.wav", { type: 'audio/wav' });
      
      const formData = new FormData();
      formData.append("file", audioFile);
      
      const response = await fetch("http://localhost:8000/api/voice/analyze", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      
      setIntensity(data.intensity);
      setPitch(data.pitch);
      setStress(data.stress_score);
      setDensity(data.density);
      
      setHappyVal(data.emotion === 'happy' ? Math.round(data.confidence * 100) : 4);
      setFrustratedVal(data.emotion === 'frustrated' || data.emotion === 'angry' ? Math.round(data.confidence * 100) : 5);
      setNeutralVal(data.emotion === 'neutral' ? Math.round(data.confidence * 100) : 10);
      
    } catch (e) {
      console.error("Voice ML API connection error:", e);
    }
  };

  useEffect(() => {
    let interval;
    if (isRecording) {
=======
  useEffect(() => {
    let interval;
    
    if (isRecording) {
      // Fast updates for active pipeline step
>>>>>>> 987d03ae86da3d6ad18815118b36c0ed046b6776
      interval = setInterval(() => {
        setPipelineStep(prev => (prev + 1) % 4);
      }, 1000);
    } else {
      setPipelineStep(-1);
    }
<<<<<<< HEAD
=======
    
>>>>>>> 987d03ae86da3d6ad18815118b36c0ed046b6776
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    const dataInterval = setInterval(() => {
<<<<<<< HEAD
      if (isRecording) {
        // Add live variance based on active values
        const nextInt = Math.max(25, Math.min(95, intensity + (Math.random() - 0.5) * 8));
        const nextPitch = Math.max(140, Math.min(380, pitch + (Math.random() - 0.5) * 15));
        const nextStress = Math.max(5, Math.min(98, stress + (Math.random() - 0.5) * 4));
        const nextDens = Math.max(0.4, Math.min(1.5, density + (Math.random() - 0.5) * 0.08));
=======
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
>>>>>>> 987d03ae86da3d6ad18815118b36c0ed046b6776

        setIntensityHistory(prev => [...prev.slice(1), nextInt]);
        setPitchHistory(prev => [...prev.slice(1), nextPitch]);
        setStressHistory(prev => [...prev.slice(1), nextStress]);
<<<<<<< HEAD
        setDensityHistory(prev => [...prev.slice(1), nextDens * 50]);
      } else {
        setIntensityHistory(prev => [...prev.slice(1), 5 + (Math.random() - 0.5) * 2]);
        setPitchHistory(prev => [...prev.slice(1), 0]);
        setStressHistory(prev => [...prev.slice(1), 8 + (Math.random() - 0.5) * 2]);
=======
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
>>>>>>> 987d03ae86da3d6ad18815118b36c0ed046b6776
        setDensityHistory(prev => [...prev.slice(1), 0]);
      }
    }, 300);

    return () => clearInterval(dataInterval);
<<<<<<< HEAD
  }, [isRecording, intensity, pitch, stress, density]);
=======
  }, [isRecording, intensity, pitch, stress, density, selectedSample]);
>>>>>>> 987d03ae86da3d6ad18815118b36c0ed046b6776

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
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ECHOMIND Voice Intelligence</h1>
          <p className="text-slate-500 mt-1">Real-time spectral analysis and sentiment extraction.</p>
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
               ? 'bg-red-50 border border-red-200 text-red-600 animate-pulse shadow-sm' 
               : 'bg-primary text-white shadow-sm hover:brightness-110 active:scale-[0.98]'
             }`}
          >
            {isRecording ? <Square className="w-4 h-4 fill-current animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {isRecording ? 'STOP ANALYSIS' : 'START RECORDING'}
          </button>
          <button className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-800 transition-all active:scale-[0.95]">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visualizer Panel */}
        <GlassCard className="lg:col-span-2 flex flex-col justify-center min-h-[400px] border-slate-200/80 bg-white/70 shadow-sm">
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-200 animate-ping'}`} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
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
          <GlassCard className="border-slate-200/80 p-6 bg-white/70 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Mic className="w-5 h-5 text-primary animate-pulse" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Vocal Simulator Board</h3>
            </div>
            <div className="space-y-3">
              {audioSamples.map((sample) => (
                <motion.button
                  key={sample.title}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(15,23,42,0.02)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedSample(sample);
                    setIsRecording(true);
<<<<<<< HEAD
                    runAudioMLAnalysis(sample.pitch, sample.intensity, sample.stress);
=======
                    setIntensity(sample.intensity);
                    setPitch(sample.pitch);
                    setStress(sample.stress);
                    setDensity(sample.density);
>>>>>>> 987d03ae86da3d6ad18815118b36c0ed046b6776
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col ${
                    selectedSample?.title === sample.title && isRecording
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{sample.title}</span>
                    {selectedSample?.title === sample.title && isRecording && (
                      <span className="text-[8px] font-mono text-primary uppercase tracking-widest font-black animate-pulse">STREAMING</span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-550 mt-1 font-semibold">{sample.desc}</span>
                </motion.button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="border-slate-200/80 bg-white/70 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Sentiment Confidence</h3>
              <Crosshair className="w-4 h-4 text-primary animate-spin-slow" />
            </div>
            
            <div className="space-y-5">
              {[
<<<<<<< HEAD
                { label: 'Happy', val: isRecording ? happyVal : 0, color: 'bg-green-500' },
                { label: 'Frustrated', val: isRecording ? frustratedVal : 0, color: 'bg-orange-500' },
                { label: 'Neutral', val: isRecording ? neutralVal : 0, color: 'bg-blue-500' },
=======
                { label: 'Happy', val: isRecording ? (selectedSample ? selectedSample.happiness : Math.max(0, Math.round(15 + Math.sin(Date.now() / 2000) * 10))) : 0, color: 'bg-green-500' },
                { label: 'Frustrated', val: isRecording ? (selectedSample ? selectedSample.frustration : Math.max(0, Math.round(75 + Math.cos(Date.now() / 2000) * 12))) : 0, color: 'bg-orange-500' },
                { label: 'Neutral', val: isRecording ? (selectedSample ? selectedSample.neutrality : Math.max(0, Math.round(10 - Math.sin(Date.now() / 2000) * 5))) : 0, color: 'bg-blue-500' },
>>>>>>> 987d03ae86da3d6ad18815118b36c0ed046b6776
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-550">
                    <span>{item.label}</span>
                    <span>{item.val}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.val}%` }}
                      transition={{ duration: 0.3 }}
                      className={`h-full ${item.color} shadow-[0_1px_3px_rgba(15,23,42,0.1)]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="border-slate-200/80 bg-white/70 shadow-sm flex-1 min-h-[200px] relative overflow-hidden">
             <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
             <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">Transcription Preview</h3>
             <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 h-[120px] overflow-y-auto">
               <p className={`text-sm leading-relaxed transition-all ${isRecording ? 'text-slate-700 font-medium' : 'text-slate-300 italic'}`}>
                 {isRecording 
                   ? (displayedTranscription || "Waiting for stream text segment...") 
                   : "Waiting for voice input stream..."}
                 {isRecording && <span className="inline-block w-1 h-4 bg-primary ml-1 animate-pulse" />}
               </p>
             </div>
          </GlassCard>
        </div>
      </div>

      {/* Monitoring Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard>
           <div className="flex items-center gap-3 mb-4">
             <Volume2 className="w-4 h-4 text-primary" />
             <span className="text-[10px] font-bold text-slate-400 uppercase">Speech Intensity</span>
           </div>
           <div className="flex items-end gap-2">
             <span className="text-3xl font-bold text-slate-900 tracking-tighter">{Math.round(intensity)}</span>
             <span className="text-[10px] text-slate-400 font-bold mb-1.5">dB</span>
           </div>
           <div className="h-12 mt-4">
              <Line data={getChartData(intensityHistory, '#1E3A8A')} options={chartOptions} />
           </div>
        </GlassCard>

        <GlassCard>
           <div className="flex items-center gap-3 mb-4">
             <Wifi className="w-4 h-4 text-secondary" />
             <span className="text-[10px] font-bold text-slate-400 uppercase">Fundamental Pitch</span>
           </div>
           <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900 tracking-tighter">{Math.round(pitch)}</span>
              <span className="text-[10px] text-slate-400 font-bold mb-1.5">Hz</span>
           </div>
           <div className="h-12 mt-4">
              <Line data={getChartData(pitchHistory, '#D4AF37')} options={chartOptions} />
           </div>
        </GlassCard>

        <GlassCard>
           <div className="flex items-center gap-3 mb-4">
             <Zap className="w-4 h-4 text-emerald-600" />
             <span className="text-[10px] font-bold text-slate-400 uppercase">Stress Index</span>
           </div>
           <div className="flex items-end gap-2 text-emerald-600">
              <span className="text-3xl font-bold tracking-tighter">{isRecording ? 'HIGH' : 'LOW'}</span>
              <span className="text-[10px] text-slate-450 font-bold mb-1.5 ml-2">LEVEL_{isRecording ? '3' : '1'} ({Math.round(stress)}%)</span>
           </div>
           <div className="h-12 mt-4">
              <Line data={getChartData(stressHistory, '#10b981')} options={chartOptions} />
           </div>
        </GlassCard>

        <GlassCard>
           <div className="flex items-center gap-3 mb-4">
             <BarChart className="w-4 h-4 text-amber-600" />
             <span className="text-[10px] font-bold text-slate-400 uppercase">Information Density</span>
           </div>
           <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900 tracking-tighter">{density.toFixed(2)}</span>
              <span className="text-[10px] text-slate-400 font-bold mb-1.5">bits/s</span>
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
