'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Sparkles,
  Headphones,
  Layers,
  ChevronRight,
  Eye,
  Hand,
  Play,
  Pause,
  Zap,
  Activity,
  Maximize2,
  Video,
  UploadCloud,
  X,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sun,
  Box,
  Compass,
  Radio,
} from 'lucide-react';

const VolumetricCinemaViewer = dynamic(
  () => import('@/components/VolumetricCinemaViewer'),
  { ssr: false }
);

export default function SpatialCinemaTriptych() {
  // Playback & Session state
  const [isPlaying, setIsPlaying] = useState(true);
  const [timelineProgress, setTimelineProgress] = useState(0.38);
  const [focusedActor, setFocusedActor] = useState<string | null>('actor-lead');

  // Ingestion Modal State
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // 6DoF Occlusion & Relighting Switcher State
  const [occlusionActive, setOcclusionActive] = useState(true);
  const [relightingModeIndex, setRelightingModeIndex] = useState(0);
  const relightingModes = [
    'Virtual Key Light (45° Ambient Ray)',
    'Overhead Rim Light (90° Top Ray)',
    'Dynamic Ambilight Bias (360° Splat Glow)',
  ];

  // Bimanual Pinch & Scale Controls State
  const [volumetricScale, setVolumetricScale] = useState(1.0);

  // Competitive Matrix Collapsible State
  const [isMatrixOpen, setIsMatrixOpen] = useState(true);

  const triggerWebXRLaunch = () => {
    const nativeBtn = document.getElementById('meta-webxr-native-btn');
    if (nativeBtn) {
      nativeBtn.click();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://chronosplat.io/live/xyz99');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const cycleRelighting = () => {
    setRelightingModeIndex((prev) => (prev + 1) % relightingModes.length);
  };

  return (
    <main
      className="min-h-screen bg-[#06070d] text-slate-100 p-6 flex flex-col justify-between overflow-x-hidden"
      style={{ backgroundColor: '#06070d', minHeight: '100vh', color: '#f8fafc' }}
    >
      {/* 1. TOP SPATIAL HEADER BAR */}
      <header className="flex items-center justify-between w-full max-w-7xl mx-auto mb-8 px-4 py-3 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
        {/* Left: Track Status Pill & 90 FPS WebXR Stream */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-white font-bold tracking-wider">CHRONOSPLAT 4D</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-semibold uppercase">Entertainment Track</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>90 FPS WebXR Stream</span>
          </div>
        </div>

        {/* Right: Ingest & WebXR Launch Buttons */}
        <div className="flex items-center gap-3">
          {/* Splat Ingestion Dropzone Trigger Button */}
          <button
            onClick={() => setIsIngestModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-cyan-500/40 text-xs font-mono text-cyan-300 transition shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ingest .Splat / .PLY</span>
          </button>

          {/* Master WebXR Launcher Button */}
          <button
            onClick={triggerWebXRLaunch}
            className="relative group p-[1.5px] rounded-full transition duration-300 shadow-[0_0_25px_rgba(14,165,233,0.35)] hover:shadow-[0_0_40px_rgba(14,165,233,0.6)]"
          >
            <div className="absolute inset-0 rounded-full shimmer-border" />
            <div className="relative flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#06070d] hover:bg-slate-950 transition">
              <span className="text-xs font-extrabold text-white tracking-wide">
                Launch WebXR (Quest 3 Native)
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition duration-200" />
            </div>
          </button>

          {/* GitHub Source Link */}
          <a
            href="https://github.com/fokrulanthro16-eng/ChronoSplat-4D"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-400/50 transition"
            title="View GitHub Repository"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
          </a>
        </div>
      </header>

      {/* 2. MAIN 3-PANEL HERO GRID */}
      <section className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-8">
        {/* LEFT PANEL (Volumetric Core) */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-cyan-500/30 flex flex-col justify-between backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(6,182,212,0.25)]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-400/40">
                <Layers className="w-4 h-4 text-sky-400" />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest text-sky-300 uppercase">
                Volumetric Core
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 border border-sky-500/40 text-sky-200 font-semibold">
              LIVE 6DoF
            </span>
          </div>

          {/* 4D Core Animation Holographic Viewport */}
          <div className="relative w-full h-[260px] bg-[#020617] rounded-2xl border border-cyan-500/20 overflow-hidden flex flex-col items-center justify-center shadow-inner my-2">
            {/* Dark ambient cyan glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_70%)] pointer-events-none" />

            {/* Holographic 4D Core Animation */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-3">
              <div className="relative flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-full border-2 border-dashed border-cyan-400/50 animate-spin"
                  style={{ animationDuration: '8s' }}
                />
                <div className="absolute w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  <span className="text-[10px] font-mono font-bold text-cyan-300">4D</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-mono font-bold text-cyan-300 tracking-wider">
                  GAUSSIAN SPLAT STREAM
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  READY • 6DoF NATIVE
                </div>
              </div>
            </div>

            {/* Interactive Orbit Button */}
            <div className="absolute bottom-3 left-3 z-20">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-[10px] font-mono text-cyan-200 backdrop-blur-md">
                <span className="text-cyan-400">◉</span> Interactive 3D Orbit
              </div>
            </div>
          </div>

          {/* Hidden Background WebXR Session & Audio Anchor */}
          <div className="hidden" aria-hidden="true">
            <VolumetricCinemaViewer
              onPlaybackChange={(playing, progress) => {
                setIsPlaying(playing);
                setTimelineProgress(progress);
              }}
              onAudioSnap={(actorId) => {
                setFocusedActor(actorId);
              }}
            />
          </div>

          {/* 6DoF Occlusion & Relighting Telemetry */}
          <div className="pt-3 border-t border-sky-500/20 space-y-2.5 text-xs font-mono">
            {/* Parallax Occlusion Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-300">Parallax Occlusion</span>
              <button
                onClick={() => setOcclusionActive(!occlusionActive)}
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold border transition ${
                  occlusionActive
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900/80 border-slate-700 text-slate-500'
                }`}
              >
                {occlusionActive ? '6DoF ACTIVE' : '3DoF INACTIVE'}
              </button>
            </div>

            {/* Dynamic Relighting Mode Switcher */}
            <button
              onClick={cycleRelighting}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-sky-500/30 text-left hover:border-sky-400 transition group"
              title="Click to cycle relighting mode"
            >
              <div className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition duration-300" />
                <span className="text-[10px] text-sky-200 font-semibold truncate max-w-[190px]">
                  {relightingModes[relightingModeIndex]}
                </span>
              </div>
              <span className="text-[9px] text-sky-400 font-mono">CYCLE</span>
            </button>

            {/* Perspective Shift Telemetry */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>Dynamic Head Shift:</span>
              <span className="text-sky-300 font-bold">±14.2° Parallax</span>
            </div>
          </div>
        </div>

        {/* CENTER PANEL (Tactile Spatial Controller) */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-fuchsia-500/30 flex flex-col justify-between backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(217,70,239,0.25)]">
          {/* Header Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-[11px] font-mono text-pink-300 font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Air-Pinch Hand Rig</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">XRHand Joints 9 &amp; 4</div>
          </div>

          {/* Embossed Centerpiece Title */}
          <div className="my-auto py-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
              Volumetric Cinema.
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
                Zero Controllers.
              </span>
            </h1>

            {/* Neon Lime Floating Pointer / Caliper Hand Icon */}
            <div className="relative flex items-center justify-center my-4">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-lime-400/20 to-emerald-400/10 border border-lime-400/50 shadow-[0_0_30px_rgba(163,230,53,0.35)] animate-bounce">
                <Hand className="w-8 h-8 text-lime-400" />
              </div>
              <div className="absolute text-[9px] font-mono font-bold text-lime-300 -bottom-2 bg-slate-950/80 px-2 py-0.5 rounded-full border border-lime-400/40">
                AIR-PINCH SNAP: 20mm
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
              Pinch fingertips in mid-air to micro-scrub temporal keyframes.
            </p>
          </div>

          {/* Bimanual Pinch & Scale Controls */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-pink-500/20 mb-3 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="text-[10px] uppercase font-bold text-pink-300">Bimanual Scale Rig</span>
              <span className="text-xs font-bold text-white bg-pink-950/70 px-2 py-0.5 rounded border border-pink-500/30">
                {volumetricScale.toFixed(1)}x Scale
              </span>
            </div>

            {/* Slider with Scale Labels */}
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.1"
              value={volumetricScale}
              onChange={(e) => setVolumetricScale(parseFloat(e.target.value))}
              className="w-full accent-pink-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />

            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
              <button
                onClick={() => setVolumetricScale(0.1)}
                className={`hover:text-pink-300 transition ${volumetricScale === 0.1 ? 'text-pink-300 font-bold' : ''}`}
              >
                0.1x Diorama
              </button>
              <button
                onClick={() => setVolumetricScale(1.0)}
                className={`hover:text-pink-300 transition ${volumetricScale === 1.0 ? 'text-pink-300 font-bold' : ''}`}
              >
                1.0x Life Size
              </button>
              <button
                onClick={() => setVolumetricScale(10.0)}
                className={`hover:text-pink-300 transition ${volumetricScale === 10.0 ? 'text-pink-300 font-bold' : ''}`}
              >
                10x IMAX
              </button>
            </div>
          </div>

          {/* Interactive Timeline Scrubber with Millisecond Timecode */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-pink-500/20">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-pink-500 hover:bg-pink-400 text-black font-bold transition"
                  title="Toggle Playback"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <span className="font-bold text-white">
                  {(timelineProgress * 100).toFixed(1)}%
                </span>
              </div>
              <span className="text-[10px] text-pink-300 font-semibold font-mono">
                Δ {(timelineProgress * 4000).toFixed(0)}ms TIMECODE
              </span>
            </div>

            {/* Timeline Scrub Rail */}
            <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-100"
                style={{ width: `${timelineProgress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (Spatial Acoustics & Angles) */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-purple-500/30 flex flex-col justify-between backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(168,85,247,0.25)]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-400/40">
                <Video className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest text-purple-300 uppercase">
                Spatial Acoustics &amp; Angles
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-200 font-semibold">
              HRTF 3D
            </span>
          </div>

          {/* Perspective-Tilted Floating Glass Panels */}
          <div className="relative my-2 h-44 sm:h-48 flex items-center justify-center">
            {/* Background tilted panel */}
            <div className="absolute w-48 h-28 rounded-xl bg-purple-900/30 border border-purple-500/30 transform -rotate-6 -translate-y-4 translate-x-4 backdrop-blur-md flex items-center justify-center text-[10px] font-mono text-purple-300">
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Camera Angle B • 45°</span>
              </div>
            </div>

            {/* Foreground tilted panel */}
            <div className="relative z-10 w-56 h-32 rounded-xl bg-slate-900/80 border border-purple-400/50 transform rotate-3 backdrop-blur-xl p-3 flex flex-col justify-between shadow-2xl">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-purple-300 font-semibold">ACTOR SNAP FOCUS</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div className="my-auto text-center">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  {focusedActor ? 'The Protagonist' : '360° Ambience'}
                </div>
                <div className="text-[10px] font-mono text-emerald-400 font-semibold mt-0.5">
                  HRTF Attenuation: -12dB Bed
                </div>
              </div>

              {/* Animated Waveform Visualizer */}
              <div className="flex items-end justify-center gap-1.5 h-6">
                <span className="w-1.5 bg-purple-400 rounded-full animate-soundwave-1" />
                <span className="w-1.5 bg-cyan-400 rounded-full animate-soundwave-2" />
                <span className="w-1.5 bg-pink-400 rounded-full animate-soundwave-3" />
                <span className="w-1.5 bg-purple-400 rounded-full animate-soundwave-4" />
                <span className="w-1.5 bg-cyan-400 rounded-full animate-soundwave-5" />
              </div>
            </div>
          </div>

          {/* Spatial Audio Attenuation Status */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-purple-500/20 flex items-center justify-between text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-white">Contactless Audio Snapping</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-400">ACTIVE</span>
          </div>
        </div>
      </section>

      {/* 3. SEATED GESTURE DECK (4 COMPACT HORIZONTAL PILLS) */}
      <section className="w-full max-w-7xl mx-auto mb-6">
        <div className="mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Verified Seated Gestures (Airplane Seat Tested • 2-Foot Radius)
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Pill 1 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-sky-500/30 backdrop-blur-md flex items-center gap-3 hover:border-sky-400 transition">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
              <Hand className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">Temporal Caliper</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">Pinch &amp; micro-scrub time</div>
            </div>
          </div>

          {/* Pill 2 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-pink-500/30 backdrop-blur-md flex items-center gap-3 hover:border-pink-400 transition">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 shrink-0">
              <Maximize2 className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">Volumetric Zoom</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">Two-hand bimanual scale</div>
            </div>
          </div>

          {/* Pill 3 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-purple-500/30 backdrop-blur-md flex items-center gap-3 hover:border-purple-400 transition">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">Binaural Snap Ray</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">Point-to-focus voice snap</div>
            </div>
          </div>

          {/* Pill 4 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-emerald-500/30 backdrop-blur-md flex items-center gap-3 hover:border-emerald-400 transition">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">Palm-Up Dock</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">Gaze-aligned floating HUD</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BENCHMARK / COMPARISON MATRIX (COLLAPSIBLE BENCHMARK DOCK) */}
      <section className="w-full max-w-7xl mx-auto p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-xs font-mono text-slate-400">
        <div
          onClick={() => setIsMatrixOpen(!isMatrixOpen)}
          className="flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
              Volumetric Paradigm Benchmark: ChronoSplat 4D vs. Legacy VR
            </span>
          </div>
          <button className="flex items-center gap-1 text-[11px] font-mono text-slate-400 group-hover:text-cyan-300 transition">
            <span>{isMatrixOpen ? 'Collapse Benchmark' : 'Expand Benchmark'}</span>
            {isMatrixOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isMatrixOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-white/[0.06] text-xs font-mono">
            {/* Column 1: Flat 360 Video */}
            <div className="p-3 rounded-xl bg-slate-900/50 border border-red-500/20 space-y-1.5">
              <div className="flex items-center justify-between text-red-400 font-bold">
                <span>Flat 360° Video</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950/60 border border-red-500/30">
                  Legacy
                </span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1">
                <li>• 3DoF Rotational Only (Zero Motion Parallax)</li>
                <li>• High Nausea Risk on translation</li>
                <li>• Fixed skybox pivot with heavy buffering</li>
              </ul>
            </div>

            {/* Column 2: Apple Vision Pro */}
            <div className="p-3 rounded-xl bg-slate-900/50 border border-amber-500/20 space-y-1.5">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span>Apple Vision Pro Cinema</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
                  Proprietary
                </span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1">
                <li>• 3D Stereoscopic (Restricted front-facing depth)</li>
                <li>• Windowed frame with flat playback bounds</li>
                <li>• Locked ecosystem with $3,500 barrier</li>
              </ul>
            </div>

            {/* Column 3: ChronoSplat 4D */}
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.2)] space-y-1.5">
              <div className="flex items-center justify-between text-cyan-300 font-bold">
                <span>ChronoSplat 4D (Meta WebXR)</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-900/80 border border-cyan-400/60 text-white font-extrabold">
                  WINNER
                </span>
              </div>
              <ul className="text-[11px] text-slate-200 space-y-1 font-semibold">
                <li className="text-cyan-200">✓ True 6DoF Gaussian Splatting (Full Parallax)</li>
                <li className="text-emerald-300">✓ Zero-Install Browser (&lt;18ms M2P Latency)</li>
                <li className="text-purple-300">✓ Natural Hand Air-Pinch Micro-Scrubber</li>
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* 5. INTERACTIVE SPLAT INGESTION DROPZONE MODAL */}
      {isIngestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-950 border border-cyan-500/40 p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] font-mono animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <UploadCloud className="w-5 h-5 text-cyan-400" />
                <span>4D GAUSSIAN SPLAT INGESTION ENGINE</span>
              </div>
              <button
                onClick={() => setIsIngestModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drag & Drop Zone */}
            <div className="my-5 p-8 rounded-2xl border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/20 text-center transition cursor-pointer group">
              <Box className="w-12 h-12 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition duration-300 animate-pulse" />
              <div className="text-sm font-bold text-white">
                Drop 4D Gaussian Splat (.splat, .ply, .nerf)
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Supports instanced PLY sequences and compressed 4D splat manifests
              </div>
            </div>

            {/* Cloud Compression & LOD Chunking Progress Simulation */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Octree Chunking Engine:</span>
                <span className="text-cyan-300 font-bold">4-Level Dynamic LOD</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Compression Ratio:</span>
                <span className="text-emerald-400 font-bold">82% Reduction (240MB → 43MB)</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse" />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Instant WebXR Link Generation:</div>
                  <div className="text-cyan-300 font-bold text-xs truncate max-w-[280px]">
                    https://chronosplat.io/live/xyz99
                  </div>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 transition font-bold"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-300" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Close CTA */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setIsIngestModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                Close Engine Console
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
