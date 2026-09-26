import * as THREE from 'three';
import { Splat4DFrame, SplatActorTrack, SplatManifest } from './types';

export class ChronoSplat4DStreamer {
  private frameBuffer: Map<number, Splat4DFrame> = new Map();
  private totalFrames: number = 0;
  private currentFrameIndex: number = 0;
  private isStreaming: boolean = false;
  private playbackFps: number = 30;
  private lastFrameTick: number = 0;

  // Scene ambient & volumetric containers
  private ambilightPointLight: THREE.PointLight;
  private ambilightAmbientLight: THREE.AmbientLight;
  private splatGroup: THREE.Group;
  private placeholderParticles: THREE.Points;

  constructor(
    private manifestUrl: string,
    private scene: THREE.Scene
  ) {
    // Virtual Ambilight Setup
    this.ambilightPointLight = new THREE.PointLight(0x00f3ff, 2.5, 6.0, 1.2);
    this.ambilightPointLight.position.set(0, 1.2, -0.6);
    this.ambilightAmbientLight = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(this.ambilightPointLight);
    this.scene.add(this.ambilightAmbientLight);

    // Root Volumetric Group
    this.splatGroup = new THREE.Group();
    this.splatGroup.position.set(0, 1.0, -1.0); // Directly in comfortable 2ft arm-reach
    this.scene.add(this.splatGroup);

    // Volumetric 3D Gaussian Splatting Point Representation / Quad surrogate
    const count = 12000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Gaussian distribution for volumetric performer envelope
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 0.45;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = (Math.random() - 0.5) * 0.9;
      const z = r * Math.sin(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Initial chromatic palette
      colors[i * 3] = 0.2 + Math.random() * 0.4;
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
      colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.014,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.placeholderParticles = new THREE.Points(geometry, material);
    this.splatGroup.add(this.placeholderParticles);
  }

  public async initialize(): Promise<void> {
    try {
      const res = await fetch(this.manifestUrl);
      if (!res.ok) throw new Error('Failed to load splat manifest');
      const manifest: SplatManifest = await res.json();
      this.totalFrames = manifest.frames.length;
      this.playbackFps = manifest.fps || 30;

      // Warm up initial frames
      for (let i = 0; i < Math.min(5, this.totalFrames); i++) {
        this.cacheMockFrame(i);
      }
    } catch {
      // Fallback synthetic 4D frames for zero-friction standalone launch
      this.totalFrames = 120;
      this.playbackFps = 30;
      for (let i = 0; i < this.totalFrames; i++) {
        this.cacheMockFrame(i);
      }
    }
  }

  private cacheMockFrame(index: number): void {
    const t = index / this.totalFrames;
    const dominantColor = new THREE.Color().setHSL(0.5 + Math.sin(t * Math.PI * 2) * 0.2, 0.9, 0.6);
    const actors: SplatActorTrack[] = [
      {
        id: 'actor-lead',
        name: 'The Volumetric Performer',
        centroid: new THREE.Vector3(
          Math.sin(t * Math.PI * 2) * 0.15,
          1.1,
          -1.0 + Math.cos(t * Math.PI * 2) * 0.1
        ),
        audioTrackId: 'actor_vocal_stem'
      }
    ];

    this.frameBuffer.set(index, {
      index,
      timestampMs: (index / this.playbackFps) * 1000,
      buffer: new ArrayBuffer(0),
      actors,
      dominantColor
    });
  }

  public update(delta: number): void {
    // Dynamic breathing/rotation effect on volumetric performer
    if (this.placeholderParticles) {
      this.placeholderParticles.rotation.y += delta * 0.15;
    }

    if (!this.isStreaming) return;

    this.lastFrameTick += delta;
    const interval = 1 / this.playbackFps;
    if (this.lastFrameTick >= interval) {
      this.lastFrameTick -= interval;
      this.currentFrameIndex = (this.currentFrameIndex + 1) % this.totalFrames;
      this.displayFrame(this.currentFrameIndex);
    }
  }

  public displayFrame(frameIndex: number): void {
    this.currentFrameIndex = frameIndex;
    const frame = this.frameBuffer.get(frameIndex);
    if (!frame) return;

    // Real-time Ambilight chromatic injection
    this.ambilightPointLight.color.lerp(frame.dominantColor, 0.2);
    this.ambilightAmbientLight.color.lerp(frame.dominantColor, 0.1);
  }

  public seekNormalized(progress: number): void {
    const target = Math.floor(THREE.MathUtils.clamp(progress, 0, 0.999) * this.totalFrames);
    this.displayFrame(target);
  }

  public getActiveActors(): SplatActorTrack[] {
    const frame = this.frameBuffer.get(this.currentFrameIndex);
    return frame ? frame.actors : [];
  }

  public getTransformNode(): THREE.Group {
    return this.splatGroup;
  }

  public setPlaying(play: boolean): void {
    this.isStreaming = play;
  }

  public isPlaying(): boolean {
    return this.isStreaming;
  }

  public getCurrentProgress(): number {
    return this.totalFrames > 0 ? this.currentFrameIndex / this.totalFrames : 0;
  }
}
