'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { ChronoSplat4DStreamer } from '../engine/splat-engine';
import { HandGestureController } from '../gestures/HandGestureController';
import { SpatialAudioEngine } from '../audio/spatial-audio';

interface VolumetricCinemaViewerProps {
  onPlaybackChange?: (isPlaying: boolean, progress: number) => void;
  onAudioSnap?: (actorId: string | null) => void;
  isAmbilightActive?: boolean;
}

export default function VolumetricCinemaViewer({
  onPlaybackChange,
  onAudioSnap,
  isAmbilightActive = true,
}: VolumetricCinemaViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [inXRSession, setInXRSession] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  // References across render loop
  const streamerRef = useRef<ChronoSplat4DStreamer | null>(null);
  const audioEngineRef = useRef<SpatialAudioEngine | null>(null);
  const gestureRigRef = useRef<HandGestureController | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Check WebXR support
    if (typeof navigator !== 'undefined' && 'xr' in navigator && (navigator as any).xr) {
      (navigator as any).xr.isSessionSupported('immersive-vr').then((supported: boolean) => {
        setIsSupported(supported);
      }).catch(() => setIsSupported(false));
    } else {
      setIsSupported(false);
    }

    // 1. WebGL & Scene Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.05, 50);
    camera.position.set(0, 1.25, 0.4); // Seated viewing distance

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // 2. WebXR Native VR Button (Hidden container with ID for master CTA dispatch)
    const vrBtn = VRButton.createButton(renderer);
    vrBtn.id = 'meta-webxr-native-btn';
    vrBtn.style.display = 'none'; // Controlled via master UI CTA
    document.body.appendChild(vrBtn);

    // 3. Engine Subsystems
    const streamer = new ChronoSplat4DStreamer('/splats/scene_manifest.json', scene);
    streamerRef.current = streamer;
    streamer.initialize().then(() => {
      streamer.setPlaying(true);
    });

    const audio = new SpatialAudioEngine();
    audioEngineRef.current = audio;

    const gestures = new HandGestureController(scene);
    gestureRigRef.current = gestures;

    // 4. WebXR Hands
    const hand0 = renderer.xr.getHand(0);
    const hand1 = renderer.xr.getHand(1);
    scene.add(hand0);
    scene.add(hand1);

    // 5. Palm-Up Lean-Back Floating Dock Mesh
    const dockGeo = new THREE.PlaneGeometry(0.24, 0.10);
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
    const caliperMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.045), caliperMat);
    scene.add(caliperMesh);

    const updateDockTexture = (playing: boolean, progress: number, scale: number) => {
      dockCtx.clearRect(0, 0, 512, 210);
      dockCtx.fillStyle = 'rgba(8, 12, 22, 0.88)';
      dockCtx.beginPath();
      dockCtx.roundRect(4, 4, 504, 202, 24);
      dockCtx.fill();

      dockCtx.strokeStyle = '#06b6d4';
      dockCtx.lineWidth = 4;
      dockCtx.stroke();

      dockCtx.fillStyle = '#ffffff';
      dockCtx.font = 'bold 30px system-ui, sans-serif';
      dockCtx.fillText(playing ? 'VOLUMETRIC: PLAYING' : 'VOLUMETRIC: PAUSED', 32, 60);

      dockCtx.font = '22px monospace';
      dockCtx.fillStyle = '#8b5cf6';
      dockCtx.fillText(`SCALE: ${(scale * 100).toFixed(0)}%`, 32, 105);

      dockCtx.fillStyle = '#1e293b';
      dockCtx.beginPath();
      dockCtx.roundRect(32, 135, 448, 20, 10);
      dockCtx.fill();

      dockCtx.fillStyle = '#06b6d4';
      dockCtx.beginPath();
      dockCtx.roundRect(32, 135, Math.max(12, 448 * progress), 20, 10);
      dockCtx.fill();

      dockTexture.needsUpdate = true;
    };

    const updateCaliperHUD = (progress: number) => {
      caliperCtx.clearRect(0, 0, 256, 128);
      caliperCtx.fillStyle = 'rgba(6, 182, 212, 0.2)';
      caliperCtx.beginPath();
      caliperCtx.roundRect(0, 0, 256, 128, 16);
      caliperCtx.fill();

      caliperCtx.strokeStyle = '#06b6d4';
      caliperCtx.lineWidth = 3;
      caliperCtx.stroke();

      caliperCtx.fillStyle = '#ffffff';
      caliperCtx.font = 'bold 36px monospace';
      caliperCtx.fillText(`${(progress * 100).toFixed(1)}%`, 45, 75);
      caliperTexture.needsUpdate = true;
    };

    // 7. Desktop Fallback Mouse Orbit Rotation
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (inXRSession) return;
      isMouseDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown || inXRSession) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      const group = streamer.getTransformNode();
      group.rotation.y += deltaX * 0.008;
      group.rotation.x += deltaY * 0.004;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 8. Session Handlers
    renderer.xr.addEventListener('sessionstart', () => {
      setInXRSession(true);
      audio.resume();
      audio.createActorTrack('actor-lead', new THREE.Vector3(0, 1.1, -1.0));
    });

    renderer.xr.addEventListener('sessionend', () => {
      setInXRSession(false);
    });

    // 9. Animation Loop
    const clock = new THREE.Clock();
    let currentNorm = 0;

    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();

      audio.updateListener(camera);

      const activeActors = streamer.getActiveActors();
      for (const actor of activeActors) {
        audio.updateActorPosition(actor.id, actor.centroid);
      }

      // Hands processing
      const gesturesState = gestures.processHands(
        hand0 as unknown as THREE.XRHandSpace,
        hand1 as unknown as THREE.XRHandSpace,
        camera,
        activeActors
      );

      // Caliper Scrubbing
      if (gesturesState.isScrubbing) {
        streamer.setPlaying(false);
        currentNorm = THREE.MathUtils.clamp(
          currentNorm + gesturesState.scrubDeltaNorm * 0.008,
          0,
          1
        );
        streamer.seekNormalized(currentNorm);

        if (gesturesState.caliperIndexPos) {
          caliperMesh.position.copy(gesturesState.caliperIndexPos).add(new THREE.Vector3(0, 0.05, 0));
          caliperMat.opacity = THREE.MathUtils.lerp(caliperMat.opacity, 1.0, 0.2);
          updateCaliperHUD(currentNorm);
        }
      } else {
        caliperMat.opacity = THREE.MathUtils.lerp(caliperMat.opacity, 0.0, 0.2);
      }

      // Two-Hand Scale Zoom
      if (gesturesState.isScaling) {
        streamer.getTransformNode().scale.setScalar(gesturesState.scaleFactor);
      }

      // Binaural Acoustic Snapping
      audio.applyAudioSnapFocus(gesturesState.snappedActor);
      if (onAudioSnap) {
        onAudioSnap(gesturesState.snappedActor);
      }

      // Palm-Up Media Dock
      if (gesturesState.dockVisible) {
        dockMat.opacity = THREE.MathUtils.lerp(dockMat.opacity, 1.0, 0.15);
        dockMesh.matrix.copy(gesturesState.dockTransform);
        dockMesh.matrixAutoUpdate = false;
        updateDockTexture(streamer.isPlaying(), streamer.getCurrentProgress(), streamer.getTransformNode().scale.x);
      } else {
        dockMat.opacity = THREE.MathUtils.lerp(dockMat.opacity, 0.0, 0.25);
      }

      // Update streamer
      streamer.update(delta);
      currentNorm = streamer.getCurrentProgress();
      if (onPlaybackChange) {
        onPlaybackChange(streamer.isPlaying(), currentNorm);
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
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      gestures.dispose();
      renderer.dispose();
      const existingBtn = document.getElementById('meta-webxr-native-btn');
      if (existingBtn && existingBtn.parentNode) {
        existingBtn.parentNode.removeChild(existingBtn);
      }
    };
  }, [onPlaybackChange, onAudioSnap]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
