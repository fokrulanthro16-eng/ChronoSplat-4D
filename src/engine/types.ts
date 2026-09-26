import * as THREE from 'three';

export interface SplatActorTrack {
  id: string;
  name: string;
  centroid: THREE.Vector3;
  audioTrackId: string;
}

export interface Splat4DFrame {
  index: number;
  timestampMs: number;
  buffer: ArrayBuffer;
  actors: SplatActorTrack[];
  dominantColor: THREE.Color;
}

export interface SplatManifest {
  title: string;
  fps: number;
  totalDurationMs: number;
  frames: string[];
}
