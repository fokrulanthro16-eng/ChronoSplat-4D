'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Sparkles,
  Headphones,
  Maximize2,
  Sliders,
  Volume2,
  Activity,
  Layers,
  ChevronRight,
  Eye,
  Hand,
  Clock,
  Radio,
  Zap,
} from 'lucide-react';

const VolumetricCinemaViewer = dynamic(
  () => import('@/components/VolumetricCinemaViewer'),
  { ssr: false }
);

export default function ChronoSplatHome() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [timelineProgress, setTimelineProgress] = useState(0.35);
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
        'Pinch thumb and index fingertip together within 22mm. Lateral hand displacement micro-scrubs 4D volumetric temporal keyframes with millisecond precision.',
      accent: 'cyan',
      svgWireframe: (
        <svg viewBox="0 0 100 80" className="w-full h-24 stroke-cyan-400 fill-none stroke-[1.5]">
          {/* Thumb joint chain */}
          <circle cx="28" cy="55" r="3" className="fill-cyan-400" />
          <line x1="28" y1="55" x2="38" y2="40" />
          <circle cx="38" cy="40" r="2.5" className="fill-cyan-400" />
          <line x1="38" y1="40" x2="48" y2="34" />
          <circle cx="48" cy="34" r="3" className="fill-cyan-300 animate-ping opacity-60" />
          <circle cx="48" cy="34" r="3" className="fill-cyan-300" />

          {/* Index joint chain snapping to thumb */}
          <circle cx="70" cy="65" r="3" className="fill-cyan-400" />
          <line x1="70" y1="65" x2="65" y2="48" />
          <circle cx="65" cy="48" r="2.5" className="fill-cyan-400" />
          <line x1="65" y1="48" x2="56" y2="36" />
          <line x1="56" y1="36" x2="51" y2="34" />
          <circle cx="51" cy="34" r="3" className="fill-cyan-300" />

          {/* Caliper Measurement Rail */}
          <line x1="30" y1="20" x2="70" y2="20" strokeDasharray="3 3" className="stroke-cyan-500/60" />
          <circle cx="50" cy="20" r="2" className="fill-cyan-300" />
          <text x="50" y="14" textAnchor="middle" className="text-[7px] font-mono fill-cyan-300 stroke-none">
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
      accent: 'purple',
      svgWireframe: (
        <svg viewBox="0 0 100 80" className="w-full h-24 stroke-purple-400 fill-none stroke-[1.5]">
          {/* Left hand anchor */}
          <circle cx="20" cy="40" r="4" className="fill-purple-400" />
          <circle cx="20" cy="40" r="8" className="stroke-purple-500/40" />

          {/* Right hand anchor */}
          <circle cx="80" cy="40" r="4" className="fill-purple-400" />
          <circle cx="80" cy="40" r="8" className="stroke-purple-500/40" />

          {/* Dynamic Expansion Vector */}
          <line x1="26" y1="40" x2="74" y2="40" strokeDasharray="2 2" className="stroke-purple-300" />
          <polygon points="26,37 20,40 26,43" className="fill-purple-400 stroke-none" />
          <polygon points="74,37 80,40 74,43" className="fill-purple-400 stroke-none" />

          <text x="50" y="32" textAnchor="middle" className="text-[7px] font-mono fill-purple-300 stroke-none">
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
        'Extend your dominant index finger toward any volumetric performer. The acoustic raycast automatically cuts ambient beds by -12dB and isolates HRTF dialogue.',
      accent: 'emerald',
      svgWireframe: (
        <svg viewBox="0 0 100 80" className="w-full h-24 stroke-emerald-400 fill-none stroke-[1.5]">
          {/* Hand pointing */}
          <line x1="15" y1="50" x2="30" y2="45" />
          <line x1="30" y1="45" x2="45" y2="40" />
          <circle cx="45" cy="40" r="3" className="fill-emerald-400" />

          {/* Ray beam with snap cone */}
          <line x1="45" y1="40" x2="85" y2="28" className="stroke-emerald-300 stroke-[2]" />
          <circle cx="85" cy="28" r="6" className="fill-emerald-400/20 stroke-emerald-400" />
          <circle cx="85" cy="28" r="2" className="fill-emerald-300" />

          {/* Sound waves emitted from target */}
          <path d="M 88 23 A 8 8 0 0 1 88 33" strokeDasharray="2 2" className="stroke-emerald-300" />
          <text x="85" y="44" textAnchor="middle" className="text-[6.5px] font-mono fill-emerald-300 stroke-none">
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
      accent: 'cyan',
      svgWireframe: (
        <svg viewBox="0 0 100 80" className="w-full h-24 stroke-cyan-400 fill-none stroke-[1.5]">
          {/* Palm plane */}
          <path d="M 25 58 Q 50 63 75 58" className="stroke-cyan-500/80 stroke-[2]" />
          <line x1="50" y1="60" x2="50" y2="40" strokeDasharray="2 2" className="stroke-cyan-300" />

          {/* Floating UI Dock */}
          <rect x="30" y="24" width="40" height="18" rx="3" className="fill-cyan-950/70 stroke-cyan-400" />
          <line x1="35" y1="30" x2="45" y2="30" className="stroke-cyan-300 stroke-[1.5]" />
          <circle cx="58" cy="30" r="2.5" className="fill-cyan-400" />
          <line x1="35" y1="36" x2="65" y2="36" strokeDasharray="1 1" className="stroke-cyan-500" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#030712] text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden font-sans">
      {/* 1. Spatial OLED Mesh Gradient Aurora Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep cyan aurora */}
        <div className="absolute -top-[20%] left-[10%] w-[650px] h-[650px] rounded-full bg-cyan-600/15 blur-[140px] animate-aurora-1" />
        {/* Hyper-violet aurora */}
        <div className="absolute top-[25%] -right-[15%] w-[700px] h-[700px] rounded-full bg-purple-600/15 blur-[150px] animate-aurora-2" />
        {/* Emerald ambient core */}
        <div className="absolute -bottom-[20%] left-[30%] w-[600px] h-[600px] rounded-full bg-emerald-600/10 blur-[160px]" />
      </div>

      {/* 2. Embedded Three.js WebXR 3D Gaussian Splatting Canvas (Live Viewport) */}
      <div className="fixed inset-0 z-0 opacity-80 pointer-events-auto">
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

      {/* 3. Vision Pro Glassmorphic UI Layer */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen px-6 py-8 md:px-14 md:py-10 pointer-events-none">
        {/* Top Navigation & Status Bar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pointer-events-auto">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full rounded-2xl bg-[#030712] flex items-center justify-center">
                <Layers className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                  CHRONOSPLAT
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  4D
                </span>
              </div>
              <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                WebXR Volumetric Cinema
              </p>
            </div>
          </div>

          {/* WebXR Active Status Pill */}
          <div className="flex items-center gap-3">
            <div className="vision-glass flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono text-gray-300 border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-white font-medium">Meta Quest 3 Native</span>
              <span className="text-gray-500">•</span>
              <span className="text-cyan-400">90 FPS Volumetric 6DoF</span>
            </div>

            {/* GitHub Source Link */}
            <a
              href="https://github.com/fokrulanthro16-eng/ChronoSplat-4D"
              target="_blank"
              rel="noreferrer"
              className="vision-glass flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono text-gray-300 hover:text-white hover:border-cyan-500/40 transition"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>GitHub</span>
            </a>
          </div>
        </header>

        {/* Hero Pitch & WebXR Master Launch CTA */}
        <section className="my-auto py-12 max-w-3xl pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-300 tracking-wide uppercase font-semibold">
              Meta VR Start 2026 • Entertainment Track Finalist
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-white">
            Volumetric Cinema.
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
              Zero Controllers.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed font-normal">
            Step beyond flat 360° videos into true 6DoF Gaussian Splatting. 
            Micro-scrub temporal keyframes with physical caliper pinches, zoom with bimanual gestures, and snap binaural audio with effortless fingertip rays.
          </p>

          {/* Launch Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* Master WebXR Launch Button */}
            <button
              onClick={triggerWebXRLaunch}
              className="relative group p-[1px] rounded-2xl transition duration-300 shadow-[0_0_35px_rgba(6,182,212,0.35)] hover:shadow-[0_0_55px_rgba(6,182,212,0.55)]"
            >
              <div className="absolute inset-0 rounded-2xl shimmer-border" />
              <div className="relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#030712] hover:bg-slate-950 transition">
                <span className="text-base font-bold text-white tracking-wide">
                  Enter Volumetric XR Cinema
                </span>
                <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition duration-200" />
              </div>
            </button>

            {/* Desktop 3D Inspection Mode Notice */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl vision-glass text-xs font-mono text-gray-400">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>Desktop 3D Orbit: Click & Drag Scene</span>
            </div>
          </div>
        </section>

        {/* Hands-First Gesture Command Matrix (4-Column Glass Cards) */}
        <section className="my-8 pointer-events-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Hand className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-mono uppercase tracking-wider text-gray-300 font-semibold">
                Hands-First Spatial Gesture Deck (Airplane Seat Tested)
              </h2>
            </div>
            <span className="text-xs font-mono text-gray-500">2-Foot Stationary Operational Radius</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {gestureCards.map((card) => (
              <div
                key={card.id}
                onMouseEnter={() => setActiveGestureTab(card.id)}
                className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer ${
                  activeGestureTab === card.id
                    ? 'vision-glass-glow -translate-y-1'
                    : 'vision-glass hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-cyan-300 border border-white/[0.08]">
                    {card.tag}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-cyan-400/80 animate-pulse" />
                </div>

                <h3 className="text-base font-bold text-white mt-1">{card.title}</h3>
                <p className="text-xs font-medium text-cyan-300/80 mb-3">{card.subtitle}</p>

                {/* SVG Joint Wireframe Illustration */}
                <div className="p-2 rounded-xl bg-black/40 border border-white/[0.04] mb-3">
                  {card.svgWireframe}
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Live In-Cinema Spatial Audio & Frame Inspector HUD */}
        <footer className="mt-auto pt-6 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">
          {/* Audio Visualizer & Focus Tag */}
          <div className="vision-glass flex items-center gap-4 px-5 py-3 rounded-2xl w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-gray-300 font-semibold">HRTF Audio Snapping</span>
            </div>

            {/* Real-time Animated Audio Equalizer Bars */}
            <div className="flex items-end gap-1 h-7 px-2">
              <span className="w-1 bg-emerald-400 rounded-full animate-soundwave-1" />
              <span className="w-1 bg-cyan-400 rounded-full animate-soundwave-2" />
              <span className="w-1 bg-purple-400 rounded-full animate-soundwave-3" />
              <span className="w-1 bg-emerald-400 rounded-full animate-soundwave-4" />
              <span className="w-1 bg-cyan-400 rounded-full animate-soundwave-5" />
            </div>

            <div className="text-xs font-mono text-emerald-300 px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/30">
              {audioFocusActor ? 'TARGET: THE PROTAGONIST' : 'AMBIENT BED: 360°'}
            </div>
          </div>

          {/* Virtual Ambilight & Performance Telemetry */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {/* Ambilight Toggle Button */}
            <button
              onClick={() => setAmbilightActive(!ambilightActive)}
              className="vision-glass flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono text-gray-300 hover:text-white hover:border-cyan-400/40 transition"
            >
              <Radio className={`w-3.5 h-3.5 ${ambilightActive ? 'text-cyan-400' : 'text-gray-500'}`} />
              <span>Virtual Ambilight: {ambilightActive ? 'ACTIVE' : 'OFF'}</span>
            </button>

            {/* Performance Badge */}
            <div className="vision-glass flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono text-gray-300">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>250,000 Splats/Frame</span>
              <span className="text-gray-500">•</span>
              <span className="text-emerald-400">&lt;18ms M2P</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
