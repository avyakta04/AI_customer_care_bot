import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Database, 
  BrainCircuit, 
  MessageSquare, 
  ShieldCheck, 
  History,
  Cpu,
  Zap,
  Network,
  RotateCw
} from 'lucide-react';

const SUBSYSTEMS = [
  {
    name: "Emotion Detection",
    icon: Activity,
    color: "#7C3AED", // Deep Purple
    accent: "#A855F7", // Electric Violet
    desc: "Acoustic & textual sentiment mapping",
    metric: "94.6% ACC",
    progress: 85,
    led: "bg-emerald-500 shadow-[0_0_8px_#10b981]"
  },
  {
    name: "Memory Retrieval",
    icon: Database,
    color: "#2563EB", // Electric Blue
    accent: "#06B6D4", // Cyan
    desc: "Vector memory search hit sequence",
    metric: "98.2% CONF",
    progress: 92,
    led: "bg-emerald-500 shadow-[0_0_8px_#10b981]"
  },
  {
    name: "Context Builder",
    icon: BrainCircuit,
    color: "#A855F7", // Electric Violet
    accent: "#7C3AED", // Deep Purple
    desc: "Active dialogue state compilation",
    metric: "12ms LAT",
    progress: 78,
    led: "bg-cyan-500 shadow-[0_0_8px_#06b6d4]"
  },
  {
    name: "Response Engine",
    icon: MessageSquare,
    color: "#7C3AED", // Deep Purple
    accent: "#2563EB", // Electric Blue
    desc: "Tailored agent synthesis loops",
    metric: "68ms SPEED",
    progress: 88,
    led: "bg-emerald-500 shadow-[0_0_8px_#10b981]"
  },
  {
    name: "AI Supervisor",
    icon: ShieldCheck,
    color: "#2563EB", // Electric Blue
    accent: "#06B6D4", // Cyan
    desc: "Safe state prompt verification",
    metric: "99.89% SAFE",
    progress: 99,
    led: "bg-cyan-500 shadow-[0_0_8px_#06b6d4]"
  },
  {
    name: "Hindsight Learning",
    icon: History,
    color: "#A855F7", // Electric Violet
    accent: "#7C3AED", // Deep Purple
    desc: "Post-event backpropagation optimization",
    metric: "92.4% ADAPT",
    progress: 70,
    led: "bg-amber-500 shadow-[0_0_8px_#f59e0b]"
  }
];

// 12 Arc Reactor Chamber Segments
const ARC_CHAMBERS = Array.from({ length: 12 }, (_, i) => i);

const AICoreVisualizer = () => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  // Core dimensions
  const radiusX = 340;
  const radiusY = 120;

  // Handle mouse movement for 3D container tilt (Jarvis interface effect)
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xVal = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const yVal = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    
    // Tilt angle calculations (max 15 degrees)
    setMouseTilt({
      x: -yVal * 15,
      y: xVal * 15
    });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
    setHoveredIdx(null);
  };

  // 60fps tick rate for rotation
  useEffect(() => {
    const tick = () => {
      setTime(prev => {
        const speed = hoveredIdx !== null ? 0.0008 : 0.0022;
        return prev + speed;
      });
      animationRef.current = requestAnimationFrame(tick);
    };
    animationRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationRef.current);
  }, [hoveredIdx]);

  // Compute 3D node coordinates
  const computedNodes = SUBSYSTEMS.map((sub, index) => {
    // Distribute the 6 nodes around the orbit
    const baseAngle = time + (index * (Math.PI * 2 / 6));
    
    // Define unique 3D tilted orbit planes for visual complexity
    const tiltZ = (index * 30) * Math.PI / 180;

    const x0 = radiusX * Math.cos(baseAngle);
    const y0 = radiusY * Math.sin(baseAngle);
    const z0 = radiusX * Math.sin(baseAngle);

    // Rotate local orbit coordinates to get global mechanical node positions
    const x = x0 * Math.cos(tiltZ) - y0 * Math.sin(tiltZ);
    const y = x0 * Math.sin(tiltZ) + y0 * Math.cos(tiltZ);
    const z = z0;

    // Normalizing Z depth (-radiusX to +radiusX)
    const normZ = (z + radiusX) / (2 * radiusX); // 0 (back) to 1 (front)
    const scale = 0.75 + normZ * 0.35;
    const opacity = 0.35 + normZ * 0.65;
    const zIndex = Math.round(normZ * 100) + 10;
    const isBehind = z < -40;
    const blurAmount = isBehind ? Math.min(3, -z / 60) : 0;

    return {
      ...sub,
      index,
      x,
      y,
      z,
      scale,
      opacity,
      zIndex,
      blurAmount,
      isBehind
    };
  });

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[750px] flex items-center justify-center overflow-hidden bg-transparent select-none"
      style={{ perspective: 1200 }}
    >
      {/* 3D ROTATABLE CAMERA INNER WRAPPER */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${mouseTilt.x}deg) rotateY(${mouseTilt.y}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* LIGHT AMBIENT RAYS & PARTICLES */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.035)_0%,transparent_60%)] pointer-events-none" />

        {/* 1. OUTER SCI-FI GRID RINGS (Jarvis HUD style) */}
        <div 
          style={{ transform: `rotateZ(${time * 8}deg) translateZ(-150px)`, transformStyle: 'preserve-3d' }}
          className="absolute w-[680px] h-[680px] border border-slate-200/50 rounded-full pointer-events-none opacity-40"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-350">
            <circle cx="50" cy="50" r="49.5" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="5 15 30 10 5" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 3" />
          </svg>
        </div>

        <div 
          style={{ transform: `rotateZ(${-time * 12}deg) translateZ(-80px)`, transformStyle: 'preserve-3d' }}
          className="absolute w-[580px] h-[580px] border border-violet-200/40 rounded-full pointer-events-none opacity-50"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-violet-500">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="40 10 20 5 10" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="2" />
          </svg>
        </div>

        {/* 2. PHYSICAL STRUCTURE TRUSSES (SVG Lines) */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}
        >
          <defs>
            <filter id="jarvisGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Centering G group */}
          <g transform="translate(500, 375)" id="jarvis-center-svg">
            <script type="text/javascript">
              {`
                document.addEventListener("DOMContentLoaded", () => {
                  const group = document.getElementById("jarvis-center-svg");
                  const resize = () => {
                    if(!group || !group.ownerSVGElement) return;
                    const rect = group.ownerSVGElement.getBoundingClientRect();
                    group.setAttribute("transform", \`translate(\${rect.width / 2}, \${rect.height / 2})\`);
                  };
                  window.addEventListener("resize", resize);
                  resize();
                  setTimeout(resize, 100);
                });
              `}
            </script>

            {computedNodes.map((node) => {
              const isHovered = hoveredIdx === node.index;
              const pathD = `M 0 0 L ${node.x} ${node.y}`;
              
              const strokeColor = isHovered ? "#2563EB" : "rgba(124, 58, 237, 0.18)";
              const strokeWidth = isHovered ? 3 : 1.2;

              return (
                <g key={node.index} style={{ opacity: node.isBehind ? 0.3 : 0.9 }}>
                  {/* Heavy Structural Link */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    filter={isHovered ? "url(#jarvisGlow)" : undefined}
                    className="transition-all duration-300"
                  />
                  {/* Floating Micro Nodes along path */}
                  <line
                    x1="0"
                    y1="0"
                    x2={node.x}
                    y2={node.y}
                    stroke="rgba(6, 182, 212, 0.3)"
                    strokeWidth="0.5"
                    strokeDasharray="8 8"
                  />

                  {/* Flowing energy particles */}
                  <circle r={isHovered ? 5.5 : 3.5} fill={isHovered ? "#06B6D4" : node.color}>
                    <animateMotion
                      dur={isHovered ? "1.2s" : "2.4s"}
                      repeatCount="indefinite"
                      path={pathD}
                    />
                  </circle>
                  <circle r="2" fill="#FFFFFF">
                    <animateMotion
                      dur={isHovered ? "1.2s" : "2.4s"}
                      begin="0.6s"
                      repeatCount="indefinite"
                      path={pathD}
                    />
                  </circle>
                </g>
              );
            })}
          </g>
        </svg>

        {/* 3. CENTRAL AI ARC REACTOR */}
        <div 
          style={{ transform: 'translateZ(100px)', zIndex: 90 }}
          className="absolute flex items-center justify-center pointer-events-none"
        >
          {/* Breathing glow fields */}
          <div className="absolute w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.12)_0%,rgba(6,182,212,0.04)_50%,transparent_70%)] filter blur-xl animate-pulse" />
          
          <motion.div 
            animate={{ scale: [1, 1.05, 0.98, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-72 h-72 rounded-full border border-slate-200/80 bg-white/75 backdrop-blur-xl shadow-[0_20px_60px_rgba(124,58,237,0.1),0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-center"
          >
            {/* Concentric rotating mechanical gear ring (Clockwise) */}
            <div 
              style={{ transform: `rotate(${time * 45}deg)` }}
              className="absolute inset-2 border border-dashed border-violet-400/40 rounded-full"
            />
            
            {/* Concentric counter-rotating segmented gear ring (Counter-clockwise) */}
            <div 
              style={{ transform: `rotate(${-time * 30}deg)` }}
              className="absolute inset-5 border-2 border-dotted border-cyan-400/40 rounded-full"
            />

            {/* 12 RADIAL ENERGY CHAMBERS (Arc Reactor Nodes) */}
            <div className="absolute inset-0 flex items-center justify-center">
              {ARC_CHAMBERS.map((i) => {
                const angle = i * (360 / 12);
                return (
                  <div
                    key={i}
                    style={{
                      transform: `rotate(${angle}deg) translateY(-108px)`
                    }}
                    className="absolute w-3.5 h-7 rounded-sm border border-slate-200/60 bg-gradient-to-t from-violet-500/10 via-cyan-400/30 to-white flex flex-col justify-between p-0.5 shadow-sm"
                  >
                    {/* Micro indicators inside energy pods */}
                    <span className="w-full h-1 bg-cyan-400 animate-pulse rounded-full" style={{ animationDelay: `${i * 0.15}s` }} />
                    <span className="w-full h-1 bg-violet-400 rounded-full" />
                  </div>
                );
              })}
            </div>

            {/* INNER QUANTUM CORE NUCLEUS */}
            <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-white via-slate-50 to-white border border-slate-200 flex items-center justify-center shadow-lg relative overflow-hidden">
              {/* Internal grid patterns */}
              <div 
                className="absolute inset-0 opacity-[0.25]"
                style={{
                  transform: `rotate(${time * 15}deg)`,
                  backgroundImage: 'radial-gradient(circle, #7C3AED 1px, transparent 1.5px)',
                  backgroundSize: '12px 12px'
                }}
              />

              {/* Pulsating blue core nucleus */}
              <motion.div 
                animate={{ scale: [1, 1.15, 0.95, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.5),_inset_0_0_20px_rgba(255,255,255,0.4)] flex flex-col items-center justify-center p-4"
              >
                <Cpu className="w-9 h-9 text-white animate-pulse" />
                <span className="text-[7px] font-mono font-black text-white tracking-[0.25em] mt-1.5 animate-pulse">SINGULARITY</span>
              </motion.div>

              {/* Micro Status Indicators around the processor */}
              <div className="absolute inset-1 flex items-center justify-between p-2 pointer-events-none opacity-60">
                <span className="text-[7px] font-mono font-bold text-violet-600">AC_PWR_ON</span>
                <span className="text-[7px] font-mono font-bold text-cyan-600">SYS_NOM</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4. TILTED ROTATING SUBSYSTEM NODE CARDS */}
        <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          {computedNodes.map((node) => {
            const NodeIcon = node.icon;
            const isHovered = hoveredIdx === node.index;

            return (
              <div
                key={node.index}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(calc(-50% + ${node.x}px), calc(-50% + ${node.y}px)) translateZ(${isHovered ? '80px' : '30px'}) scale(${isHovered ? 1.12 : node.scale})`,
                  zIndex: isHovered ? 250 : node.zIndex,
                  opacity: node.opacity,
                  filter: `blur(${node.blurAmount}px)`,
                  pointerEvents: 'auto',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s, filter 0.3s'
                }}
              >
                {/* HOLOGRAPHIC MACHINE NODE PANEL */}
                <div
                  onMouseEnter={() => setHoveredIdx(node.index)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`w-56 p-4.5 rounded-2xl bg-white/80 backdrop-blur-lg border border-slate-200/90 shadow-[0_15px_40px_rgba(15,23,42,0.06)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.12)] cursor-pointer transition-all duration-300 ${
                    isHovered ? 'border-blue-500 ring-2 ring-blue-500/10' : ''
                  }`}
                >
                  {/* Ledger Header & LED status */}
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100/60">
                    <div className="flex items-center gap-2">
                      <div 
                        className="p-2 rounded-xl bg-slate-50 border border-slate-100 transition-all duration-300"
                        style={{ 
                          color: node.color,
                          boxShadow: isHovered ? `0 0 12px ${node.color}44` : 'none'
                        }}
                      >
                        <NodeIcon className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">
                        {node.name}
                      </span>
                    </div>
                    {/* Status LED */}
                    <div className={`w-2 h-2 rounded-full ${node.led}`} />
                  </div>

                  <p className="text-[9px] text-slate-400 leading-normal mb-3">{node.desc}</p>

                  {/* Dynamic Progress Bar (Telemetry meter) */}
                  <div className="space-y-1 mb-2">
                    <div className="flex justify-between text-[7px] font-mono font-bold text-slate-450 uppercase">
                      <span>Telemetry Status</span>
                      <span>{node.progress}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${node.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: node.color }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[8px] font-mono font-bold">
                    <span className="text-slate-400 uppercase">TELEMETRY_VAL</span>
                    <span className="text-slate-800">{node.metric}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. TELEMETRY DETAILS HUD MODAL */}
        <AnimatePresence>
          {hoveredIdx !== null && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95, translateZ: '120px' }}
              animate={{ opacity: 1, y: 0, scale: 1, translateZ: '120px' }}
              exit={{ opacity: 0, y: 15, scale: 0.95, translateZ: '120px' }}
              className="absolute bottom-6 left-6 right-6 md:right-auto md:w-[420px] p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] z-[300]"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <div 
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100"
                  style={{ color: SUBSYSTEMS[hoveredIdx].color }}
                >
                  {React.createElement(SUBSYSTEMS[hoveredIdx].icon, { className: "w-5.5 h-5.5" })}
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest leading-none">
                    {SUBSYSTEMS[hoveredIdx].name}
                  </h3>
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block mt-1">
                    JARVIS_CORE_CORE_MODULE_TELEMETRY
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed mb-4">
                {SUBSYSTEMS[hoveredIdx].desc}. Neural mapping is actively compiling state loops.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-[8px] font-mono text-slate-400 uppercase block">Process Rate</span>
                  <span className="text-xs font-bold text-slate-800">{SUBSYSTEMS[hoveredIdx].metric}</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-slate-400 uppercase block">Quantum Index</span>
                  <span className="text-xs font-bold text-slate-800">{SUBSYSTEMS[hoveredIdx].progress * 12} QP</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-slate-400 uppercase block">Signal Integrity</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    NOMINAL
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default AICoreVisualizer;
