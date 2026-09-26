'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const VolumetricCinemaViewer = dynamic(
  () => import('@/components/VolumetricCinemaViewer'),
  { ssr: false }
);

export default function SpatialCinemaTriptych() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [volumetricScale, setVolumetricScale] = useState(1.0);
  const [relightingIndex, setRelightingIndex] = useState(0);
  const relightingModes = [
    'Virtual Key Light (45° Ambient Ray)',
    'Overhead Rim Light (90° Top Ray)',
    'Dynamic Ambilight Bias (360° Splat Glow)',
  ];

  const triggerWebXRLaunch = () => {
    const nativeBtn = document.getElementById('meta-webxr-native-btn');
    if (nativeBtn) {
      nativeBtn.click();
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#06070d] text-slate-100 p-4 md:p-8 flex flex-col justify-between gap-8">
      {/* Hidden WebXR Engine & Audio Anchor */}
      <div className="hidden" aria-hidden="true">
        <VolumetricCinemaViewer />
      </div>

      {/* Top Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
            CHRONOSPLAT 4D • Entertainment Track
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
            ⚡ 90 FPS WebXR Stream
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-cyan-500/30 transition"
          >
            ☁ Ingest .Splat / .PLY
          </button>
          <button
            onClick={triggerWebXRLaunch}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-mono font-bold text-white shadow-lg transition"
          >
            Launch WebXR (Quest 3 Native) ›
          </button>
        </div>
      </header>

      {/* 3-Panel Spatial Hero Grid */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Panel 1: Left (Volumetric Core) */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-cyan-500/30 flex flex-col justify-between backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] min-h-[480px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400">VOLUMETRIC CORE</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
              LIVE 6DoF
            </span>
          </div>

          {/* 3D Hologram / Viewport Box */}
          <div className="relative w-full h-[260px] bg-[#020617] rounded-2xl border border-cyan-500/30 overflow-hidden flex flex-col items-center justify-center my-4">
            <div className="w-16 h-16 rounded-full border border-dashed border-cyan-400/40 animate-spin flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-400 flex items-center justify-center font-mono font-bold text-cyan-300 text-xs">
                4D
              </div>
            </div>
            <div className="mt-3 text-xs font-mono font-bold text-cyan-300 tracking-wider">
              GAUSSIAN SPLAT STREAM
            </div>
            <div className="text-[10px] font-mono text-slate-400">READY • 6DoF NATIVE</div>
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-900/80 border border-white/10 text-[10px] font-mono text-cyan-300">
              25k Volumetric Splats
            </div>
            <button className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-slate-900/90 border border-cyan-500/40 text-[10px] font-mono text-cyan-200">
              ◉ Click &amp; Drag 6DoF Orbit
            </button>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-white/10 text-xs font-mono">
            <div className="flex justify-between text-slate-300">
              <span>Parallax Occlusion:</span>{' '}
              <span className="text-emerald-400 font-bold">6DoF ACTIVE</span>
            </div>
            <button
              onClick={() => setRelightingIndex((prev) => (prev + 1) % relightingModes.length)}
              className="w-full py-1.5 rounded-xl bg-slate-800/60 border border-white/10 text-[11px] text-slate-300 hover:text-white transition"
            >
              {relightingModes[relightingIndex]} CYCLE
            </button>
            <div className="text-slate-400 text-[11px]">
              Dynamic Head Shift: <span className="text-cyan-300">±14.2° Parallax</span>
            </div>
          </div>
        </div>

        {/* Panel 2: Center (Tactile Hand Rig Controller) */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-pink-500/30 flex flex-col justify-between backdrop-blur-xl shadow-[0_0_30px_rgba(236,72,153,0.15)] min-h-[480px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-pink-400">AIR-PINCH HAND RIG</span>
            <span className="text-[10px] font-mono text-slate-400">XRHand Joints 9 &amp; 4</span>
          </div>

          <div className="text-center my-4">
            <h2 className="text-2xl font-black text-white tracking-tight">Volumetric Cinema.</h2>
            <h3 className="text-2xl font-black bg-gradient-to-r from-pink-400 to-amber-300 bg-clip-text text-transparent">
              Zero Controllers.
            </h3>
            <div className="w-16 h-16 mx-auto my-4 rounded-full border border-emerald-500/40 bg-emerald-950/30 flex items-center justify-center text-emerald-400 text-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              ✋
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
              AIR-PINCH SNAP: 20mm
            </div>
            <p className="text-slate-400 text-xs mt-2">
              Pinch fingertips in mid-air to micro-scrub temporal keyframes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-pink-300 font-bold">Bimanual Scale Rig</span>
              <span className="px-2 py-0.5 rounded bg-pink-950/80 border border-pink-500/40 text-pink-300 font-bold">
                {volumetricScale.toFixed(1)}x Scale
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={volumetricScale}
              onChange={(e) => setVolumetricScale(parseFloat(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setVolumetricScale(0.1)}
                className="flex-1 py-1 rounded bg-slate-800 text-[10px] font-mono text-slate-300 hover:text-white"
              >
                0.1x Diorama
              </button>
              <button
                onClick={() => setVolumetricScale(1.0)}
                className="flex-1 py-1 rounded bg-pink-900/60 border border-pink-500/40 text-[10px] font-mono text-pink-200"
              >
                1.0x Life Size
              </button>
              <button
                onClick={() => setVolumetricScale(10.0)}
                className="flex-1 py-1 rounded bg-slate-800 text-[10px] font-mono text-slate-300 hover:text-white"
              >
                10x IMAX
              </button>
            </div>
          </div>
        </div>

        {/* Panel 3: Right (Spatial Acoustics & Angles) */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-purple-500/30 flex flex-col justify-between backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.15)] min-h-[480px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-purple-400">
              SPATIAL ACOUSTICS &amp; ANGLES
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-[10px] font-mono text-purple-300">
              HRTF 3D
            </span>
          </div>

          <div className="p-4 my-4 rounded-2xl bg-slate-950/60 border border-purple-500/20 text-center">
            <div className="text-[10px] font-mono text-purple-300 uppercase tracking-widest mb-1">
              Actor Snap Focus
            </div>
            <div className="text-base font-bold text-white">360° AMBIENCE</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">HRTF Attenuation: -12dB Bed</div>
            <div className="flex items-center justify-center gap-1.5 h-8 mt-3">
              <div className="w-1.5 bg-purple-500 rounded-full animate-pulse h-4" />
              <div
                className="w-1.5 bg-cyan-400 rounded-full animate-pulse h-7"
                style={{ animationDelay: '150ms' }}
              />
              <div
                className="w-1.5 bg-pink-400 rounded-full animate-pulse h-5"
                style={{ animationDelay: '300ms' }}
              />
              <div
                className="w-1.5 bg-indigo-400 rounded-full animate-pulse h-8"
                style={{ animationDelay: '450ms' }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-xs font-mono">
              <span className="text-slate-300">Contactless Audio Snapping</span>
              <span className="text-emerald-400 font-bold">ACTIVE</span>
            </div>
            {/* Dual-LLM Copilot Badge */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">AI Copilot Core</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                ● Gemini 1.5 ↔ Nemotron Failover
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Seated Gestures Deck */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/10 text-xs font-mono">
          <span className="text-cyan-400 font-bold">Temporal Caliper:</span>{' '}
          <span className="text-slate-400">Pinch &amp; scrub time</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/10 text-xs font-mono">
          <span className="text-pink-400 font-bold">Volumetric Zoom:</span>{' '}
          <span className="text-slate-400">Two-hand bimanual scale</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/10 text-xs font-mono">
          <span className="text-purple-400 font-bold">Binaural Snap:</span>{' '}
          <span className="text-slate-400">Point to focus actor voice</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/10 text-xs font-mono">
          <span className="text-emerald-400 font-bold">Palm-Up Dock:</span>{' '}
          <span className="text-slate-400">Gaze-aligned UI floating</span>
        </div>
      </div>

      {/* Benchmark & Roadmap Matrix */}
      <div className="w-full max-w-7xl mx-auto p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-xs font-mono text-slate-400">
        <div className="text-cyan-300 font-bold mb-2">
          VOLUMETRIC PARADIGM BENCHMARK: CHRONOSPLAT 4D VS. LEGACY VR
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-red-500/20">
            <div className="text-red-400 font-bold mb-1">Flat 360° Video (Legacy)</div>
            <p className="text-[11px] text-slate-400">
              3DoF rotational only. Zero parallax translation. High motion sickness risk.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-amber-500/20">
            <div className="text-amber-400 font-bold mb-1">Apple Vision Pro Cinema</div>
            <p className="text-[11px] text-slate-400">
              3D stereoscopic windowed frame. High $3,500 hardware barrier.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-cyan-500/30 bg-cyan-950/20">
            <div className="text-cyan-300 font-bold mb-1">ChronoSplat 4D (Meta WebXR) [WINNER]</div>
            <p className="text-[11px] text-slate-300">
              True 6DoF Gaussian Splatting. 90 FPS browser native. Zero-install.
            </p>
          </div>
        </div>
      </div>

      {/* Splat Ingestion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-cyan-500/40 p-6 shadow-2xl font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-cyan-300 font-bold text-sm">4D GAUSSIAN SPLAT INGESTION</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <div className="my-6 p-6 rounded-2xl border-2 border-dashed border-cyan-500/40 bg-cyan-950/20 text-center">
              <div className="text-2xl mb-2">☁</div>
              <div className="text-sm font-bold text-white">Drop 4D Gaussian Splat (.splat, .ply, .nerf)</div>
              <div className="text-xs text-slate-400 mt-1">Direct Client-to-R2 Cloud Bypass (Zero Serverless Limits)</div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Octree Chunking Engine:</span>
                <span className="text-cyan-300 font-bold">4-Level Dynamic LOD</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Compression Ratio:</span>
                <span className="text-emerald-400 font-bold">82% Reduction (240MB → 43MB)</span>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Close Console
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
