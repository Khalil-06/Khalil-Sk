/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Snowflake, Timer, Wind, Play, Layers } from 'lucide-react';

interface Particle {
  id: string;
  type: 'snowflakes' | 'balloons';
  x: number;          // horizontal percentage [5, 95]
  startY?: string;    // custom start position (for pre-populated elements)
  size: number;       // diameter in pixels
  duration: number;   // speed/duration in seconds
  drift: number;      // translation drift in pixels
  rotation: number;   // rotation angle in degrees
  color?: string;     // custom balloon gradient color
  opacity: number;    // translucent opacity
  createdAt: number;  // timestamp of creation
}

// Sophisticated corporate/formal color palette for balloons
const BALLOON_COLORS = [
  '#4a5568', // Slate Blue
  '#9b2c2c', // Crimson
  '#b7791f', // Muted Gold
  '#234e52', // Deep Teal
  '#2f855a', // Sage Green
  '#702459', // Soft Burgundy
];

const BalloonIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 30" fill="currentColor" className={className}>
    <ellipse cx="12" cy="11" rx="8" ry="10" />
    <polygon points="10,22 14,22 12,19" />
    <path d="M12,22 Q10,26 13,30" stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
);

export default function App() {
  const [activeEffect, setActiveEffect] = useState<'none' | 'snowflakes' | 'balloons'>('none');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [simActive, setSimActive] = useState<boolean>(false);
  
  // Keep track of statistics for a professional, analytical feeling
  const [totalSnowflakesSimulated, setTotalSnowflakesSimulated] = useState<number>(0);
  const [totalBalloonsSimulated, setTotalBalloonsSimulated] = useState<number>(0);

  // Trigger simulation state
  const startSimulation = (type: 'snowflakes' | 'balloons') => {
    // Clear any active layout
    setActiveEffect(type);
    setSimActive(true);

    const initialParticles: Particle[] = [];
    const count = type === 'snowflakes' ? 14 : 9; // Pre-populate density
    const now = Date.now();

    // Mathematically pre-populate the viewport to ensure instant immersion
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 12 + 24; // Medium size range (24px - 36px)
      const drift = Math.random() * 80 - 40; // Horizontal sway
      const rotation = Math.random() * 360;
      const duration = Math.random() * 1.5 + 3.0; // 3.0s - 4.5s
      const heightRatio = Math.random() * 0.7 + 0.15; // Spread vertically

      const startY = `${heightRatio * 100}vh`;
      let animDuration = duration;

      if (type === 'snowflakes') {
        const distanceRemaining = 1 - heightRatio;
        animDuration = Math.max(1.0, distanceRemaining * duration);
        setTotalSnowflakesSimulated((prev) => prev + 1);
      } else {
        const distanceRemaining = heightRatio;
        animDuration = Math.max(1.0, distanceRemaining * duration);
        setTotalBalloonsSimulated((prev) => prev + 1);
      }

      initialParticles.push({
        id: `pre-${i}-${Math.random().toString(36).substring(2, 5)}`,
        type,
        x: Math.random() * 90 + 5,
        startY,
        size,
        duration: animDuration,
        drift,
        rotation,
        color: type === 'balloons' ? BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)] : undefined,
        opacity: Math.random() * 0.15 + 0.85,
        createdAt: now,
      });
    }

    setParticles(initialParticles);
  };

  // High-precision Millisecond System Ticker
  useEffect(() => {
    if (!simActive || activeEffect === 'none') {
      setTimeLeft(0);
      return;
    }

    const startTime = Date.now();
    const duration = 5000; // Exact 5.0 seconds as specified

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, (duration - elapsed) / 1000);
      setTimeLeft(remaining);

      if (elapsed >= duration) {
        setSimActive(false);
        setActiveEffect('none');
        clearInterval(timer);
      }
    }, 35); // Rapid update for smooth UI text & progress bar

    return () => clearInterval(timer);
  }, [simActive, activeEffect]);

  // Particle Spawning Loop
  useEffect(() => {
    if (!simActive || activeEffect === 'none') return;

    // Snowflakes are lighter/smaller, spawn quicker. Balloons spawn with majestic poise.
    const intervalRate = activeEffect === 'snowflakes' ? 120 : 160;

    const spawnTimer = setInterval(() => {
      const size = Math.random() * 12 + 24; // 24px - 36px (medium size)
      const drift = Math.random() * 80 - 40;
      const rotation = Math.random() * 360;
      const duration = Math.random() * 1.5 + 3.0; // 3.0s - 4.5s

      const newParticle: Particle = {
        id: `spawn-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        type: activeEffect,
        x: Math.random() * 92 + 4,
        size,
        duration,
        drift,
        rotation,
        color: activeEffect === 'balloons' ? BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)] : undefined,
        opacity: Math.random() * 0.15 + 0.85,
        createdAt: Date.now(),
      };

      setParticles((prev) => [...prev, newParticle]);

      if (activeEffect === 'snowflakes') {
        setTotalSnowflakesSimulated((prev) => prev + 1);
      } else {
        setTotalBalloonsSimulated((prev) => prev + 1);
      }
    }, intervalRate);

    return () => clearInterval(spawnTimer);
  }, [simActive, activeEffect]);

  // Garbage Collector (Cleans up expired particles)
  useEffect(() => {
    if (particles.length === 0) return;

    const gcTimer = setInterval(() => {
      const now = Date.now();
      setParticles((prev) => prev.filter((p) => now - p.createdAt < p.duration * 1000));
    }, 200);

    return () => clearInterval(gcTimer);
  }, [particles.length]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-zinc-50 flex items-center justify-center font-sans select-none">
      
      {/* Explicit custom styles block to assure seamless high-performance keyframe rendering */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(var(--start-y, -60px)) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--max-opacity, 0.9);
          }
          90% {
            opacity: var(--max-opacity, 0.9);
          }
          100% {
            transform: translateY(110vh) translateX(var(--drift-x, 30px)) rotate(var(--rotation, 180deg));
            opacity: 0;
          }
        }

        @keyframes floatUp {
          0% {
            transform: translateY(var(--start-y, 110vh)) translateX(0) scale(0.95);
            opacity: 0;
          }
          5% {
            opacity: var(--max-opacity, 0.95);
          }
          90% {
            opacity: var(--max-opacity, 0.95);
            transform: translateY(-5vh) translateX(calc(var(--drift-x, -30px) * 0.9)) scale(1.03);
          }
          100% {
            transform: translateY(-20vh) translateX(var(--drift-x, -30px)) scale(1.05);
            opacity: 0;
          }
        }
      `}</style>

      {/* Floating Simulation Particles Layer (pointer-events-none to let clicks bleed through to dashboard) */}
      <div id="simulation-viewport" className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map((p) => {
          if (p.type === 'snowflakes') {
            return (
              <div
                key={p.id}
                id={`particle-${p.id}`}
                className="absolute text-sky-400/90"
                style={{
                  left: `${p.x}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  animation: `fall ${p.duration}s linear forwards`,
                  ['--start-y' as any]: p.startY || '-60px',
                  ['--drift-x' as any]: `${p.drift}px`,
                  ['--rotation' as any]: `${p.rotation}deg`,
                  ['--max-opacity' as any]: p.opacity,
                } as React.CSSProperties}
              >
                <Snowflake 
                  size={p.size} 
                  className="w-full h-full drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)] stroke-[1.25]" 
                />
              </div>
            );
          } else {
            return (
              <div
                key={p.id}
                id={`particle-${p.id}`}
                className="absolute"
                style={{
                  left: `${p.x}%`,
                  width: `${p.size}px`,
                  height: `${p.size * 1.5}px`,
                  animation: `floatUp ${p.duration}s cubic-bezier(0.12, 0.45, 0.2, 1) forwards`,
                  ['--start-y' as any]: p.startY || '110vh',
                  ['--drift-x' as any]: `${p.drift}px`,
                  ['--max-opacity' as any]: p.opacity,
                  color: p.color,
                } as React.CSSProperties}
              >
                <svg 
                  viewBox="0 0 30 45" 
                  width="100%" 
                  height="100%" 
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    <radialGradient id={`balloon-grad-${p.id}`} cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity={0.7} />
                      <stop offset="60%" stopColor={p.color} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={p.color} stopOpacity={1} />
                    </radialGradient>
                    
                    <filter id={`shadow-${p.id}`} x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodOpacity="0.12" />
                    </filter>
                  </defs>
                  
                  {/* Balloon Body */}
                  <ellipse 
                    cx="15" 
                    cy="16" 
                    rx="13" 
                    ry="15" 
                    fill={`url(#balloon-grad-${p.id})`}
                    filter={`url(#shadow-${p.id})`}
                  />
                  
                  {/* Tie Knot */}
                  <polygon 
                    points="13,31 17,31 15,28" 
                    fill={p.color} 
                  />
                  
                  {/* Organic Wave String */}
                  <path 
                    d="M15,31 Q13,36 17,40 T14,46" 
                    stroke="#52525b" 
                    strokeWidth="1" 
                    fill="none" 
                    opacity="0.5"
                  />
                </svg>
              </div>
            );
          }
        })}
      </div>

      {/* Main Control Center Console (Formal executive Card Design) */}
      <main 
        id="control-console-card"
        className="relative z-10 max-w-lg w-full mx-4 bg-white/80 backdrop-blur-xl border border-zinc-200/90 rounded-3xl p-8 shadow-[0_24px_50px_-12px_rgba(24,24,27,0.08)] flex flex-col gap-6"
      >
        {/* Card Header */}
        <section className="flex flex-col gap-1.5 border-b border-zinc-100 pb-5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-[0.25em] text-zinc-400 uppercase">
              Atmospheric Dynamics Suite
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-300"></span>
            <span className="text-[10px] font-mono text-zinc-400">
              V2.10
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-800">
            Vector Simulation Panel
          </h1>
          <p className="text-sm leading-relaxed text-zinc-500 font-light pr-2">
            Configure and run automated vertical drift calculations. Snowflakes fall downwards simulating gravity; balloons rise upwards representing thermal buoyancy.
          </p>
        </section>

        {/* Console Display/Monitor Section */}
        <section id="simulator-monitor" className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-inner flex flex-col gap-4 text-white">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                simActive 
                  ? activeEffect === 'snowflakes' 
                    ? 'bg-sky-400 animate-pulse'
                    : 'bg-amber-400 animate-pulse'
                  : 'bg-zinc-600'
              }`}></span>
              <span className="font-medium tracking-wide text-zinc-300">
                {simActive 
                  ? activeEffect === 'snowflakes' 
                    ? 'SIMULATING SNOWFLAKES'
                    : 'SIMULATING BALLOONS'
                  : 'SYSTEM STANDBY'
                }
              </span>
            </div>
            <div className="font-mono text-[10px] text-zinc-500">
              UTC SYNCHRONIZED
            </div>
          </div>

          {/* Time Counter Visualization */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-medium text-zinc-400 tracking-wider uppercase">Active Session Timer</span>
              <span className="font-mono text-xl font-semibold tracking-wider text-zinc-100">
                {simActive ? `${timeLeft.toFixed(2)}s` : '0.00s'}
              </span>
            </div>
            
            {/* Elegant thin progress bar */}
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-75 ${
                  activeEffect === 'snowflakes' ? 'bg-sky-400' : 'bg-amber-400'
                }`}
                style={{ width: simActive ? `${(timeLeft / 5) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </section>

        {/* Key Triggers Panel */}
        <section id="trigger-actions" className="grid grid-cols-2 gap-4">
          
          {/* Snowflakes Simulation Trigger */}
          <button
            id="snowflake-sim-trigger"
            onClick={() => startSimulation('snowflakes')}
            disabled={simActive && activeEffect === 'snowflakes'}
            className={`group h-14 relative flex items-center justify-center gap-2.5 px-4 rounded-xl border font-medium text-sm tracking-wide transition-all duration-300 select-none ${
              simActive && activeEffect === 'snowflakes'
                ? 'bg-sky-50 border-sky-200 text-sky-600 shadow-sm cursor-not-allowed scale-[0.98]'
                : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-zinc-900 active:scale-[0.98] shadow-sm hover:shadow-md cursor-pointer'
            }`}
          >
            <Snowflake 
              className={`w-4 h-4 transition-transform duration-500 ${
                simActive && activeEffect === 'snowflakes' 
                  ? 'animate-spin text-sky-500' 
                  : 'group-hover:rotate-45 text-zinc-400'
              }`} 
            />
            <span>Snowflakes</span>
          </button>

          {/* Balloons Simulation Trigger */}
          <button
            id="balloon-sim-trigger"
            onClick={() => startSimulation('balloons')}
            disabled={simActive && activeEffect === 'balloons'}
            className={`group h-14 relative flex items-center justify-center gap-2.5 px-4 rounded-xl border font-medium text-sm tracking-wide transition-all duration-300 select-none ${
              simActive && activeEffect === 'balloons'
                ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm cursor-not-allowed scale-[0.98]'
                : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-zinc-900 active:scale-[0.98] shadow-sm hover:shadow-md cursor-pointer'
            }`}
          >
            <div className={`transition-transform duration-500 ${
              simActive && activeEffect === 'balloons'
                ? 'scale-110 text-amber-500 animate-bounce'
                : 'group-hover:-translate-y-0.5 text-zinc-400'
            }`}>
              <BalloonIcon className="w-4 h-5" />
            </div>
            <span>Balloons</span>
          </button>
        </section>

        {/* Simulation Stats/Parameters Ledger */}
        <section id="telemetry-ledger" className="border-t border-zinc-100 pt-5 flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Simulation Parameters</span>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-2 mt-1 font-mono text-xs text-zinc-500">
            <div className="flex justify-between border-b border-zinc-100/60 pb-1.5">
              <span>Target Weight Class:</span>
              <span className="text-zinc-800 font-medium">Medium</span>
            </div>
            <div className="flex justify-between border-b border-zinc-100/60 pb-1.5">
              <span>Duration Horizon:</span>
              <span className="text-zinc-800 font-medium">5.00s</span>
            </div>
            <div className="flex justify-between border-b border-zinc-100/60 pb-1.5 sm:pb-0">
              <span>Total Snowflakes:</span>
              <span className="text-zinc-800 font-medium">{totalSnowflakesSimulated}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-100/60 pb-1.5 sm:pb-0">
              <span>Total Balloons:</span>
              <span className="text-zinc-800 font-medium">{totalBalloonsSimulated}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
