'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Sparkles,
  Headphones,
  Layers,
  ChevronRight,
  Eye,
  Hand,
  Radio,
  Activity,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Volume2,
} from 'lucide-react';

const VolumetricCinemaViewer = dynamic(
  () => import('@/components/VolumetricCinemaViewer'),
  { ssr: false }
);

export default function ZeroGSpatialCinemaStudio() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [timelineProgress, setTimelineProgress] = useState(0.42);
  const [audioFocusActor, setAudioFocusActor] = useState<string | null>('actor-lead');
  const [ambilightActive, setAmbilightActive] = useState(true);
  const [activeGestureTab, setActiveGestureTab] = useState<number>(0);
  const [isWebXRSupported, setIsWebXRSupported] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator && (navigator as any).xr) {
      (navigator as any).xr.isSessionSupported('immersive-vr')
        .then((supported: boolean) => setIsWebXRSupported(supported))
        .catch(() => setIsWebXRSupported(false));
    } else {
      setIsWebXRSupported(false);
    }
  }, []);

  const triggerWebXRLaunch = () => {
    const nativeBtn = document.getElementById('meta-webxr-native-btn');
    if (nativeBtn) {
      nativeBtn.click();
    }
  };

  const gestureCards = [
    {
      id: 0,
      title: 'Temporal Caliper',
      subtitle: 'Pinch & Micro-Scrub Timeline',
      tag: 'Left Hand (22mm Snap)',
      description:
        'Pinch thumb and index finger within 22mm. Lateral hand displacement micro-scrubs 4D volumetric temporal keyframes with millisecond precision.',
      svgWireframe: (
        <svg viewBox="0 0 100 80" className="w-full h-20 stroke-cyan-400 fill-none stroke-[2]">
          <circle cx="28" cy="55" r="3.5" className="fill-cyan-400" />
          <line x1="28" y1="55" x2="38" y2="40" />
          <circle cx="38" cy="40" r="3" className="fill-cyan-400" />
          <line x1="38" y1="40" x2="48" y2="34" />
          <circle cx="48" cy="34" r="3.5" className="fill-cyan-300 animate-ping opacity-75" />
          <circle cx="48" cy="34" r="3.5" className="fill-cyan-300" />

          <circle cx="70" cy="65" r="3.5" className="fill-cyan-400" />
          <line x1="70" y1="65" x2="65" y2="48" />
          <circle cx="65" cy="48" r="3" className="fill-cyan-400" />
          <line x1="65" y1="48" x2="56" y2="36" />
          <line x1="56" y1="36" x2="51" y2="34" />
          <circle cx="51" cy="34" r="3.5" className="fill-cyan-300" />

          <line x1="28" y1="20" x2="72" y2="20" strokeDasharray="3 3" className="stroke-cyan-300" />
          <circle cx="50" cy="20" r="3" className="fill-cyan-300" />
          <text x="50" y="14" textAnchor="middle" className="text-[8px] font-mono font-bold fill-cyan-300 stroke-none">
            Δ 12.4ms
          </text>
        </svg>
      ),
    },
    {
      id: 1,
      title: 'Volumetric Zoom & Orbit',
      subtitle: 'Two-Hand Distance Scaling',
      tag: 'Bimanual 0.3x – 1.0x',
      description:
        'Pinch with both hands simultaneously and stretch or compress your hands to scale the holographic performance from a tabletop diorama to life-size theater.',
      svgWireframe: (
        <svg viewBox="0 0 100 80" className="w-full h-20 stroke-purple-400 fill-none stroke-[2]">
          <circle cx="20" cy="40" r="4.5" className="fill-purple-400" />
          <circle cx="20" cy="40" r="9" className="stroke-purple-400/60" />

          <circle cx="80" cy="40" r="4.5" className="fill-purple-400" />
          <circle cx="80" cy="40" r="9" className="stroke-purple-400/60" />

          <line x1="26" y1="40" x2="74" y2="40" strokeDasharray="3 3" className="stroke-purple-300 stroke-[2]" />
          <polygon points="26,36 19,40 26,44" className="fill-purple-300 stroke-none" />
          <polygon points="74,36 81,40 74,44" className="fill-purple-300 stroke-none" />

          <text x="50" y="32" textAnchor="middle" className="text-[8px] font-mono font-bold fill-purple-300 stroke-none">
            SCALE 0.85x
          </text>
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Binaural Snap Ray',
      subtitle: 'Point-to-Focus Voice Snapping',
      tag: 'Dominant Index Raycast',
      description:
        'Extend your dominant index finger toward any volumetric performer. The acoustic raycast automatically attenuates ambient beds by -12dB and isolates HRTF dialogue.',
      svgWireframe: (
        <svg viewBox="0 0 100 80" className="w-full h-20 stroke-emerald-400 fill-none stroke-[2]">
          <line x1="15" y1="52" x2="30" y2="46" />
          <line x1="30" y1="46" x2="45" y2="40" />
          <circle cx="45" cy="40" r="3.5" className="fill-emerald-400" />

          <line x1="45" y1="40" x2="85" y2="28" className="stroke-emerald-300 stroke-[2.5]" />
          <circle cx="85" cy="28" r="7" className="fill-emerald-400/30 stroke-emerald-400" />
          <circle cx="85" cy="28" r="3" className="fill-emerald-300" />

          <path d="M 88 21 A 9 9 0 0 1 88 35" strokeDasharray="2 2" className="stroke-emerald-300 stroke-[2]" />
          <text x="85" y="46" textAnchor="middle" className="text-[7.5px] font-mono font-bold fill-emerald-300 stroke-none">
            +3dB VOCAL
          </text>
        </svg>
      ),
    },
    {
      id: 3,
      title: 'Palm-Up Media Dock',
      subtitle: 'Gaze-Aligned Floating HUD',
      tag: 'Dot(n, gaze) > 0.72',
      description:
        'Turn your non-dominant hand palm-up toward your face. A lightweight glassmorphic control dock instantly floats 70mm above your hand for effortless playback access.',
      svgWireframe: (
        <svg viewBox="0 0 100 80" className="w-full h-20 stroke-cyan-400 fill-none stroke-[2]">
          <path d="M 25 58 Q 50 64 75 58" className="stroke-cyan-400 stroke-[2.5]" />
          <line x1="50" y1="60" x2="50" y2="38" strokeDasharray="3 3" className="stroke-cyan-300 stroke-[2]" />

          <rect x="28" y="20" width="44" height="20" rx="4" className="fill-slate-900/90 stroke-cyan-400 stroke-[2]" />
          <line x1="34" y1="27" x2="46" y2="27" className="stroke-cyan-300 stroke-[2]" />
          <circle cx="62" cy="27" r="3" className="fill-cyan-400" />
          <line x1="34" y1="33" x2="66" y2="33" strokeDasharray="2 2" className="stroke-cyan-400" />
        </svg>
      ),
    },
  ];

  return (
    <main
      className="min-h-screen bg-[#0a0a0f] text-slate-100 relative overflow-hidden font-sans select-none"
      style={{ backgroundColor: '#0a0a0f', minHeight: '100vh', color: '#f8fafc' }}
    >
      {/* 1. TOP SPATIAL HEADER */}
      <header className="relative z-30 w-full px-6 py-4 md:px-12 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full rounded-xl bg-[#0a0a0f] flex items-center justify-center">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-300 bg-clip-text text-transparent">
                CHRONOSPLAT
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                4D STUDIO
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Zero-G Volumetric Cinema Engine
            </p>
          </div>
        </div>

        {/* Status Pill & Master Enter XR CTA */}
        <div className="flex items-center gap-3">
          {/* Hardware Telemetry Badge */}
          <div className="studio-glass hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-mono text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-90" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-white font-semibold">Meta Quest 3 Native</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-medium">90 FPS 6DoF</span>
          </div>

          {/* Master CTA */}
          <button
            onClick={triggerWebXRLaunch}
            className="relative group p-[1.5px] rounded-xl transition duration-300 shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]"
          >
            <div className="absolute inset-0 rounded-xl shimmer-border" />
            <div className="relative flex items-center gap-2.5 px-5 py-2 rounded-xl bg-[#0a0a0f] hover:bg-slate-900 transition">
              <span className="text-xs font-extrabold text-white tracking-wide">
                Enter Volumetric XR Cinema
              </span>
              <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition duration-200" />
            </div>
          </button>

          {/* GitHub Source Link */}
          <a
            href="https://github.com/fokrulanthro16-eng/ChronoSplat-4D"
            target="_blank"
            rel="noreferrer"
            className="studio-glass flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white hover:border-cyan-400/40 transition"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">GitHub</span>
          </a>
        </div>
      </header>

      {/* 2. ZERO-G SPATIAL CINEMA STAGE & VIEWPORT */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-6 md:px-12 flex flex-col items-center">
        {/* Stage Headline */}
        <div className="text-center max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full studio-glass mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span className="text-[11px] font-mono text-cyan-200 tracking-wider uppercase font-semibold">
              Zero-G Volumetric Cinema Stage
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Volumetric Cinema.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Zero Controllers.
            </span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Step beyond flat 360° panoramas into true 6DoF Gaussian Splatting. 
            Micro-scrub temporal keyframes with physical caliper pinches and snap binaural audio with fingertip rays.
          </p>
        </div>

        {/* Central Spatial Cinema Stage Container */}
        <div className="relative w-full max-w-5xl h-[380px] sm:h-[460px] md:h-[500px] flex items-center justify-center">
          {/* Ambient Backlight Aura Glow */}
          <div
            className={`absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500/25 via-purple-600/25 to-pink-500/20 blur-2xl transition-opacity duration-700 pointer-events-none ${
              ambilightActive ? 'animate-aura' : 'opacity-0'
            }`}
          />

          {/* Bezel-less Floating Spatial Viewport Frame */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden studio-glass border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.8)]">
            {/* Embedded Three.js 3D Volumetric Canvas */}
            <div className="absolute inset-0 w-full h-full">
              <VolumetricCinemaViewer
                onPlaybackChange={(playing, progress) => {
                  setIsPlaying(playing);
                  setTimelineProgress(progress);
                }}
                onAudioSnap={(actorId) => {
                  setAudioFocusActor(actorId);
                }}
                isAmbilightActive={ambilightActive}
              />
            </div>

            {/* Desktop 3D Inspection Watermark */}
            <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              <span>Desktop 3D Orbit: Click &amp; Drag Scene</span>
            </div>

            {/* Performance Telemetry HUD */}
            <div className="absolute top-4 right-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>250,000 Splats/Frame</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">&lt;18ms M2P</span>
            </div>

            {/* Floating Prop A: Interactive Timeline Caliper Pill (Levitating Bottom-Left) */}
            <div className="absolute bottom-5 left-5 pointer-events-auto animate-float">
              <div className="studio-glass-glow flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono text-slate-200">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition"
                  title="Toggle Playback"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <div>
                  <div className="text-[10px] text-cyan-300 font-bold tracking-wider uppercase">
                    TEMPORAL CALIPER
                  </div>
                  <div className="text-xs font-bold text-white">
                    {(timelineProgress * 100).toFixed(1)}% <span className="text-slate-500 font-normal">TIMECODE</span>
                  </div>
                </div>
                {/* Visual mini-rail */}
                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden ml-1">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-150"
                    style={{ width: `${timelineProgress * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Floating Prop B: Binaural Acoustic Node Badge (Levitating Bottom-Right) */}
            <div className="absolute bottom-5 right-5 pointer-events-auto animate-float-delayed">
              <div className="studio-glass flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono text-slate-200">
                <div className="flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase text-emerald-300 tracking-wider">
                    HRTF FOCUS
                  </span>
                </div>

                {/* Animated EQ Bars */}
                <div className="flex items-end gap-1 h-5 px-1">
                  <span className="w-1 bg-emerald-400 rounded-full animate-soundwave-1" />
                  <span className="w-1 bg-cyan-400 rounded-full animate-soundwave-2" />
                  <span className="w-1 bg-purple-400 rounded-full animate-soundwave-3" />
                  <span className="w-1 bg-emerald-400 rounded-full animate-soundwave-4" />
                  <span className="w-1 bg-cyan-400 rounded-full animate-soundwave-5" />
                </div>

                <div className="text-[11px] font-bold text-white px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40">
                  {audioFocusActor ? 'THE PROTAGONIST' : '360° AMBIENT'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LEVITATING GESTURE COMMAND TILES (4-COLUMN FROSTED GLASS DECK) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-6 md:px-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Hand className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Hands-First Spatial Gesture Deck (Airplane Seat Tested)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">2-Foot Stationary Operational Radius</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gestureCards.map((card, idx) => (
            <div
              key={card.id}
              onMouseEnter={() => setActiveGestureTab(card.id)}
              className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer ${
                idx % 2 === 0 ? 'animate-float-slow' : 'animate-float-delayed'
              } ${
                activeGestureTab === card.id
                  ? 'studio-glass-glow -translate-y-1'
                  : 'studio-glass hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-200 border border-slate-700">
                  {card.tag}
                </span>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              <h3 className="text-sm font-bold text-white mt-1">{card.title}</h3>
              <p className="text-[11px] font-semibold text-cyan-300 mb-2.5">{card.subtitle}</p>

              {/* SVG Joint Wireframe Illustration */}
              <div className="p-2 rounded-xl bg-black/60 border border-white/[0.04] mb-3">
                {card.svgWireframe}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. STUDIO BOTTOM DOCK TELEMETRY */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.06] text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAmbilightActive(!ambilightActive)}
            className="studio-glass flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-slate-200 hover:text-white hover:border-cyan-400/40 transition font-semibold"
          >
            <Radio className={`w-3.5 h-3.5 ${ambilightActive ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span>Virtual Ambilight: {ambilightActive ? 'ACTIVE' : 'OFF'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span>Meta Quest Browser WebXR Compliance</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-300">Target Award: Best New Entertainment ($100k)</span>
        </div>
      </footer>
    </main>
  );
}
