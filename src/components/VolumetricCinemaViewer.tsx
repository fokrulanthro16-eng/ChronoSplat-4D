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

  // References across render loop
  const streamerRef = useRef<ChronoSplat4DStreamer | null>(null);
  const audioEngineRef = useRef<SpatialAudioEngine | null>(null);
  const gestureRigRef = useRef<HandGestureController | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. WebGL & Scene Setup (Strictly transparent canvas)
    const scene = new THREE.Scene();
    scene.background = null; // Transparent scene

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.05, 50);
    camera.position.set(0, 1.2, 0.4); // Seated viewing distance

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent clear color
    renderer.domElement.style.backgroundColor = 'transparent';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
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

    // 5. Desktop Fallback Mouse Orbit Rotation
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

    // 6. Session Handlers
    renderer.xr.addEventListener('sessionstart', () => {
      setInXRSession(true);
      audio.resume();
      audio.createActorTrack('actor-lead', new THREE.Vector3(0, 1.1, -1.0));
    });

    renderer.xr.addEventListener('sessionend', () => {
      setInXRSession(false);
    });

    // 7. Animation Loop
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
    <div className="relative w-full h-full overflow-hidden bg-transparent">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing bg-transparent" />
    </div>
  );
}
