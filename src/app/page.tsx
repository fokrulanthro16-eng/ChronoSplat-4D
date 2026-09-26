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
  Play,
  Pause,
  RotateCcw,
  Zap,
  Activity,
  Sliders,
  Maximize2,
  Video,
  Radio,
} from 'lucide-react';

const VolumetricCinemaViewer = dynamic(
  () => import('@/components/VolumetricCinemaViewer'),
  { ssr: false }
);

export default function SpatialCinemaTriptych() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [timelineProgress, setTimelineProgress] = useState(0.38);
  const [focusedActor, setFocusedActor] = useState<string | null>('actor-lead');
  const [volumetricScale, setVolumetricScale] = useState(0.85);

  const triggerWebXRLaunch = () => {
    const nativeBtn = document.getElementById('meta-webxr-native-btn');
    if (nativeBtn) {
      nativeBtn.click();
    }
  };

  return (
    <main
      className="min-h-screen bg-[#06070d] text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans select-none overflow-x-hidden"
      style={{ backgroundColor: '#06070d', minHeight: '100vh', color: '#f8fafc' }}
    >
      {/* 1. TOP SPATIAL NAVBAR */}
      <header className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        {/* Track Status Pill */}
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

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>90 FPS WebXR Stream</span>
          </div>
        </div>

        {/* Master WebXR Launcher Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={triggerWebXRLaunch}
            className="relative group p-[1.5px] rounded-full transition duration-300 shadow-[0_0_25px_rgba(14,165,233,0.35)] hover:shadow-[0_0_40px_rgba(14,165,233,0.6)]"
          >
            <div className="absolute inset-0 rounded-full shimmer-border" />
            <div className="relative flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#06070d] hover:bg-slate-950 transition">
              <span className="text-xs font-extrabold text-white tracking-wide">
                Launch WebXR (Meta Quest 3 Native)
              </span>
              <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition duration-200" />
            </div>
          </button>

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

      {/* 2. HERO TRIPTYCH (3-COLUMN 3D MOTION GRID) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-6 items-stretch">
        {/* LEFT PANEL (COL 1-4): Electric Blue Volumetric Core */}
        <div className="lg:col-span-4 rounded-3xl spatial-card-blue p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl animate-float-slow">
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between mb-4">
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

          {/* Pure CSS Dark Holographic Viewport */}
          <div className="relative w-full h-[280px] bg-[#020617] rounded-2xl border border-cyan-500/20 overflow-hidden flex flex-col items-center justify-center shadow-inner my-2">
            {/* Dark ambient cyan glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_70%)] pointer-events-none" />
            
            {/* Holographic 4D Core Animation */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-cyan-400/50 animate-spin" style={{ animationDuration: '8s' }} />
                <div className="absolute w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  <span className="text-[10px] font-mono font-bold text-cyan-300">4D</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-mono font-bold text-cyan-300 tracking-wider">GAUSSIAN SPLAT STREAM</div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">READY • 6DoF NATIVE</div>
              </div>
            </div>

            {/* Interactive Orbit Button */}
            <div className="absolute bottom-3 left-3 z-20">
              <button className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-[10px] font-mono text-cyan-200 hover:text-white backdrop-blur-md transition">
                <span className="text-cyan-400">◉</span> Interactive 3D Orbit
              </button>
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

          {/* Telemetry Footer */}
          <div className="relative z-10 pt-4 border-t border-sky-500/20 flex items-center justify-between text-xs font-mono text-slate-300">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Active Radiance Fields</div>
              <div className="text-sm font-bold text-sky-200">250,000 Splats</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase">Motion-to-Photon</div>
              <div className="text-sm font-bold text-emerald-400">&lt;16ms Latency</div>
            </div>
          </div>
        </div>

        {/* CENTER PANEL (COL 5-8): Tactile Spatial Controller */}
        <div className="lg:col-span-4 rounded-3xl spatial-card-pink p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl">
          {/* Header Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-[11px] font-mono text-pink-300 font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Air-Pinch Hand Rig</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">XRHand Joints 9 &amp; 4</div>
          </div>

          {/* Embossed Centerpiece Title */}
          <div className="my-auto py-4 text-center">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              Volumetric Cinema.
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
                Zero Controllers.
              </span>
            </h1>

            {/* Neon Lime Floating Pointer / Caliper Hand Icon */}
            <div className="relative flex items-center justify-center my-6">
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-lime-400/20 to-emerald-400/10 border border-lime-400/50 shadow-[0_0_35px_rgba(163,230,53,0.35)] animate-bounce">
                <Hand className="w-10 h-10 text-lime-400" />
              </div>
              <div className="absolute text-[10px] font-mono font-bold text-lime-300 -bottom-2 bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-lime-400/40">
                CALIPER PINCH SNAP: 20mm
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
              Pinch fingertips in mid-air to micro-scrub temporal keyframes. Two hands scale from desktop diorama to theater.
            </p>
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
              <span className="text-[11px] text-pink-300 font-semibold font-mono">
                Δ {(timelineProgress * 4000).toFixed(0)}ms TIMECODE
              </span>
            </div>

            {/* Timeline Scrub Rail */}
            <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-100"
                style={{ width: `${timelineProgress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (COL 9-12): Multi-Angle Floating Viewports & HRTF Sound */}
        <div className="lg:col-span-4 rounded-3xl spatial-card-purple p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl animate-float-delayed">
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

          {/* Isometric Perspective-Tilted Floating Glass Panels */}
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

      {/* 3. SEATED GESTURE MATRIX (BOTTOM DECK - 4 COMPACT HORIZONTAL PILLS) */}
      <footer className="w-full pt-2">
        <div className="text-center sm:text-left mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Verified Seated Gestures (Airplane Seat Tested • 2-Foot Radius)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Pill 1 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-sky-500/30 backdrop-blur-md flex items-center gap-3 hover:border-sky-400 transition">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Hand className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Temporal Caliper</div>
              <div className="text-[10px] text-slate-400 font-mono">Pinch &amp; micro-scrub time</div>
            </div>
          </div>

          {/* Pill 2 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-pink-500/30 backdrop-blur-md flex items-center gap-3 hover:border-pink-400 transition">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
              <Maximize2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Volumetric Zoom</div>
              <div className="text-[10px] text-slate-400 font-mono">Two-hand bimanual scale</div>
            </div>
          </div>

          {/* Pill 3 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-purple-500/30 backdrop-blur-md flex items-center gap-3 hover:border-purple-400 transition">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Binaural Snap Ray</div>
              <div className="text-[10px] text-slate-400 font-mono">Point-to-focus voice snap</div>
            </div>
          </div>

          {/* Pill 4 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-emerald-500/30 backdrop-blur-md flex items-center gap-3 hover:border-emerald-400 transition">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Palm-Up Media Dock</div>
              <div className="text-[10px] text-slate-400 font-mono">Gaze-aligned floating HUD</div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
