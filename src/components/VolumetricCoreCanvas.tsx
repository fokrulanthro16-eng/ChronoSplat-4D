'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function VolumetricCoreCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 260;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 3.8);

    // Renderer with transparent background
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Group for rotation
    const pointGroup = new THREE.Group();
    scene.add(pointGroup);

    // 25,000 Volumetric Diorama Particles
    const PARTICLE_COUNT = 25000;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    const cyanColor = new THREE.Color(0x06b6d4);     // Cyan
    const magentaColor = new THREE.Color(0xd946ef);  // Magenta
    const purpleColor = new THREE.Color(0x818cf8);   // Neon Indigo

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Create a 3D volumetric diorama shape:
      // 60% core humanoid/actor volumetric silhouette, 40% orbiting spatial rings/nebula
      const isCore = Math.random() < 0.65;

      let x: number, y: number, z: number;
      let mixRatio: number;

      if (isCore) {
        // Volumetric cylinder/ellipsoid actor
        const theta = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), 0.5) * 0.75;
        const heightY = (Math.random() - 0.5) * 1.8;
        x = Math.cos(theta) * radius * (1 - Math.abs(heightY) * 0.3);
        y = heightY;
        z = Math.sin(theta) * radius * (1 - Math.abs(heightY) * 0.3);
        mixRatio = (y + 0.9) / 1.8;
      } else {
        // Orbiting spatial disk & ambient gaussian splats
        const angle = Math.random() * Math.PI * 2;
        const dist = 0.9 + Math.pow(Math.random(), 2) * 1.6;
        x = Math.cos(angle) * dist;
        y = (Math.random() - 0.5) * 0.45 + Math.sin(dist * 3 + angle) * 0.15;
        z = Math.sin(angle) * dist;
        mixRatio = (Math.sin(angle) + 1) * 0.5;
      }

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // Color gradient between Cyan and Magenta with Indigo highlights
      const tempColor = new THREE.Color();
      if (mixRatio < 0.5) {
        tempColor.lerpColors(cyanColor, purpleColor, mixRatio * 2);
      } else {
        tempColor.lerpColors(purpleColor, magentaColor, (mixRatio - 0.5) * 2);
      }

      colors[i3] = tempColor.r;
      colors[i3 + 1] = tempColor.g;
      colors[i3 + 2] = tempColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pointCloud = new THREE.Points(geometry, material);
    pointGroup.add(pointCloud);

    // Initial render
    renderer.render(scene, camera);

    // Interactive Drag / Orbit Mechanics
    let isDragging = false;
    let previousPointerPosition = { x: 0, y: 0 };
    let targetRotationX = 0.2;
    let targetRotationY = 0;
    let currentRotationX = 0.2;
    let currentRotationY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPointerPosition = { x: e.clientX, y: e.clientY };
      container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPointerPosition.x;
      const deltaY = e.clientY - previousPointerPosition.y;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;

      // Clamp X rotation to prevent flipping upside down
      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));

      previousPointerPosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
      container.style.cursor = 'grab';
    };

    container.style.cursor = 'grab';
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Gentle auto-rotation when not actively dragging
      if (!isDragging) {
        targetRotationY += 0.25 * delta;
      }

      // Smooth damping interpolation
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;

      pointGroup.rotation.x = currentRotationX;
      pointGroup.rotation.y = currentRotationY;

      // Breathing scale pulsation
      const time = clock.getElapsedTime();
      pointCloud.rotation.z = Math.sin(time * 0.4) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[260px] rounded-2xl overflow-hidden touch-none"
    />
  );
}
