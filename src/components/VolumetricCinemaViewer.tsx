'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { ChronoSplat4DStreamer } from '../engine/splat-engine';
import { HandGestureController } from '../gestures/HandGestureController';
import { SpatialAudioEngine } from '../audio/spatial-audio';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Hand, Compass } from 'lucide-react';

export default function VolumetricCinemaViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [inXRSession, setInXRSession] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [activeScale, setActiveScale] = useState(1.0);
  const [focusedActor, setFocusedActor] = useState<string | null>(null);

  // References across render loop
  const streamerRef = useRef<ChronoSplat4DStreamer | null>(null);
  const audioEngineRef = useRef<SpatialAudioEngine | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. WebGL & Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06070c);

    // Seated camera baseline (approx 1.25m seated eye height)
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.05, 50);
    camera.position.set(0, 1.25, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // 2. WebXR VR Button
    const vrBtn = VRButton.createButton(renderer);
    vrBtn.className = 'custom-webxr-btn';
    vrBtn.style.position = 'absolute';
    vrBtn.style.bottom = '32px';
    vrBtn.style.left = '50%';
    vrBtn.style.transform = 'translateX(-50%)';
    vrBtn.style.padding = '14px 32px';
    vrBtn.style.borderRadius = '9999px';
    vrBtn.style.background = 'linear-gradient(135deg, #00f3ff 0%, #9d4edd 100%)';
    vrBtn.style.color = '#ffffff';
    vrBtn.style.fontWeight = 'bold';
    vrBtn.style.fontSize = '15px';
    vrBtn.style.boxShadow = '0 0 25px rgba(0, 243, 255, 0.4)';
    vrBtn.style.border = 'none';
    vrBtn.style.cursor = 'pointer';
    vrBtn.style.zIndex = '50';
    mountRef.current.appendChild(vrBtn);

    // 3. Engine Subsystems
    const streamer = new ChronoSplat4DStreamer('/splats/scene_manifest.json', scene);
    streamerRef.current = streamer;
    streamer.initialize().then(() => {
      streamer.setPlaying(true);
    });

    const audio = new SpatialAudioEngine();
    audioEngineRef.current = audio;

    const gestures = new HandGestureController(scene);

    // 4. WebXR Hand Controller Attachment
    const hand0 = renderer.xr.getHand(0); // Left / Non-Dominant
    const hand1 = renderer.xr.getHand(1); // Right / Dominant
    scene.add(hand0);
    scene.add(hand1);

    // 5. Palm-Up Lean-Back Floating Dock
    const dockGeo = new THREE.PlaneGeometry(0.22, 0.09);
    const dockCanvas = document.createElement('canvas');
    dockCanvas.width = 512;
    dockCanvas.height = 210;
    const dockCtx = dockCanvas.getContext('2d')!;
    const dockTexture = new THREE.CanvasTexture(dockCanvas);
    const dockMat = new THREE.MeshBasicMaterial({
      map: dockTexture,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
    });
    const dockMesh = new THREE.Mesh(dockGeo, dockMat);
    scene.add(dockMesh);

    // 6. Holographic Caliper Visual Feedback HUD
    const caliperCanvas = document.createElement('canvas');
    caliperCanvas.width = 256;
    caliperCanvas.height = 128;
    const caliperCtx = caliperCanvas.getContext('2d')!;
    const caliperTexture = new THREE.CanvasTexture(caliperCanvas);
    const caliperMat = new THREE.MeshBasicMaterial({
      map: caliperTexture,
      transparent: true,
      opacity: 0.0,
    });
    const caliperMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.04), caliperMat);
    scene.add(caliperMesh);

    const updateDockTexture = (playing: boolean, progress: number, scale: number) => {
      dockCtx.clearRect(0, 0, 512, 210);

      // Glassmorphic translucent panel
      dockCtx.fillStyle = 'rgba(12, 16, 26, 0.88)';
      dockCtx.beginPath();
      dockCtx.roundRect(4, 4, 504, 202, 24);
      dockCtx.fill();

      // Neon outline
      dockCtx.strokeStyle = '#00f3ff';
      dockCtx.lineWidth = 4;
      dockCtx.stroke();

      // Status text
      dockCtx.fillStyle = '#ffffff';
      dockCtx.font = 'bold 30px system-ui, sans-serif';
      dockCtx.fillText(playing ? 'VOLUMETRIC: PLAYING' : 'VOLUMETRIC: PAUSED', 32, 60);

      // Scale readout
      dockCtx.font = '22px monospace';
      dockCtx.fillStyle = '#9d4edd';
      dockCtx.fillText(`SCALE: ${(scale * 100).toFixed(0)}%`, 32, 105);

      // Progress bar rail
      dockCtx.fillStyle = '#222836';
      dockCtx.beginPath();
      dockCtx.roundRect(32, 135, 448, 20, 10);
      dockCtx.fill();

      // Progress bar fill
      dockCtx.fillStyle = '#00f3ff';
      dockCtx.beginPath();
      dockCtx.roundRect(32, 135, Math.max(12, 448 * progress), 20, 10);
      dockCtx.fill();

      dockTexture.needsUpdate = true;
    };

    const updateCaliperHUD = (progress: number) => {
      caliperCtx.clearRect(0, 0, 256, 128);
      caliperCtx.fillStyle = 'rgba(0, 243, 255, 0.15)';
      caliperCtx.beginPath();
      caliperCtx.roundRect(0, 0, 256, 128, 16);
      caliperCtx.fill();

      caliperCtx.strokeStyle = '#00f3ff';
      caliperCtx.lineWidth = 3;
      caliperCtx.stroke();

      caliperCtx.fillStyle = '#ffffff';
      caliperCtx.font = 'bold 36px monospace';
      caliperCtx.fillText(`${(progress * 100).toFixed(1)}%`, 45, 75);
      caliperTexture.needsUpdate = true;
    };

    // 7. Session Lifecycle Handlers
    renderer.xr.addEventListener('sessionstart', () => {
      setInXRSession(true);
      audio.resume();
      audio.createActorTrack('actor-lead', new THREE.Vector3(0, 1.1, -1.0));
    });

    renderer.xr.addEventListener('sessionend', () => {
      setInXRSession(false);
    });

    // 8. Animation & Render Loop
    const clock = new THREE.Clock();
    let currentNormProgress = 0;

    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();

      // Continuous HRTF HMD listener sync
      audio.updateListener(camera);

      // Update positions of actors for spatial audio
      const activeActors = streamer.getActiveActors();
      for (const actor of activeActors) {
        audio.updateActorPosition(actor.id, actor.centroid);
      }

      // Process 6DoF hand tracking joints
      const gesturesState = gestures.processHands(
        hand0 as unknown as THREE.XRHandSpace,
        hand1 as unknown as THREE.XRHandSpace,
        camera,
        activeActors
      );

      // Caliper Scrubbing Handling
      if (gesturesState.isScrubbing) {
        streamer.setPlaying(false);
        setIsPlaying(false);
        currentNormProgress = THREE.MathUtils.clamp(
          currentNormProgress + gesturesState.scrubDeltaNorm * 0.008,
          0,
          1
        );
        streamer.seekNormalized(currentNormProgress);
        setPlaybackProgress(currentNormProgress);

        if (gesturesState.caliperIndexPos) {
          caliperMesh.position.copy(gesturesState.caliperIndexPos).add(new THREE.Vector3(0, 0.05, 0));
          caliperMat.opacity = THREE.MathUtils.lerp(caliperMat.opacity, 1.0, 0.2);
          updateCaliperHUD(currentNormProgress);
        }
      } else {
        caliperMat.opacity = THREE.MathUtils.lerp(caliperMat.opacity, 0.0, 0.2);
      }

      // Two-Hand Scale Zoom Handling
      if (gesturesState.isScaling) {
        streamer.getTransformNode().scale.setScalar(gesturesState.scaleFactor);
        setActiveScale(gesturesState.scaleFactor);
      }

      // Contactless Binaural Audio Raycast Snapping
      audio.applyAudioSnapFocus(gesturesState.snappedActor);
      setFocusedActor(gesturesState.snappedActor);

      // Palm-Up Media Dock Projection
      if (gesturesState.dockVisible) {
        dockMat.opacity = THREE.MathUtils.lerp(dockMat.opacity, 1.0, 0.15);
        dockMesh.matrix.copy(gesturesState.dockTransform);
        dockMesh.matrixAutoUpdate = false;
        updateDockTexture(streamer.isPlaying(), streamer.getCurrentProgress(), streamer.getTransformNode().scale.x);
      } else {
        dockMat.opacity = THREE.MathUtils.lerp(dockMat.opacity, 0.0, 0.25);
      }

      // Advance volumetric sequence
      streamer.update(delta);
      if (streamer.isPlaying()) {
        currentNormProgress = streamer.getCurrentProgress();
        setPlaybackProgress(currentNormProgress);
      }

      renderer.render(scene, camera);
    });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      gestures.dispose();
      renderer.dispose();
    };
  }, []);

  const togglePlayback = () => {
    if (!streamerRef.current) return;
    const nextState = !streamerRef.current.isPlaying();
    streamerRef.current.setPlaying(nextState);
    setIsPlaying(nextState);
  };

  const resetTimeline = () => {
    if (!streamerRef.current) return;
    streamerRef.current.seekNormalized(0);
    setPlaybackProgress(0);
  };

  return (
    <div className="relative w-screen h-screen bg-[#050508] overflow-hidden select-none">
      {/* 3D WebXR Canvas Mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Desktop / Spectator Fallback Overlay */}
      {!inXRSession && (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12">
          {/* Header */}
          <div className="flex items-start justify-between max-w-5xl">
            <div className="space-y-2 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                META VR START 2026 • ENTERTAINMENT TRACK
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-500 tracking-tight">
                ChronoSplat 4D
              </h1>
              <p className="text-sm md:text-base text-gray-400 max-w-lg leading-relaxed">
                Zero-install 6DoF volumetric spatial cinema running natively in Meta Quest Browser. 
                Experience contactless 4D Gaussian Splatting with temporal caliper scrubbing.
              </p>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl pointer-events-auto">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Hand className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Temporal Caliper</span>
              </div>
              <p className="text-xs text-gray-400">
                Pinch non-dominant thumb and index to micro-scrub temporal keyframes with sub-frame accuracy.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Compass className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Airplane Seat Tested</span>
              </div>
              <p className="text-xs text-gray-400">
                100% seated-optimized within a 2-foot stationary radius. Zero controllers or roomscale walking required.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Volume2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Acoustic Snap Ray</span>
              </div>
              <p className="text-xs text-gray-400">
                Point at any volumetric performer to isolate HRTF vocal stems while attenuating ambient beds by -12dB.
              </p>
            </div>
          </div>

          {/* Desktop Preview Controls */}
          <div className="flex items-center justify-between pointer-events-auto bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl p-4 rounded-2xl max-w-2xl">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayback}
                className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={resetTimeline}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <div className="text-xs font-mono text-gray-300">
                TIMECODE: {(playbackProgress * 100).toFixed(1)}% | SCALE: {(activeScale * 100).toFixed(0)}%
              </div>
            </div>

            {focusedActor && (
              <div className="text-xs font-mono text-emerald-400 flex items-center gap-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                AUDIO FOCUS: {focusedActor}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
