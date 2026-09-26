import * as THREE from 'three';

export class SpatialAudioEngine {
  private audioContext: AudioContext | null = null;
  private listener: AudioListener | null = null;
  private actorNodes: Map<string, { panner: PannerNode; gain: GainNode; synthOsc?: OscillatorNode }> = new Map();
  private ambientGain: GainNode | null = null;

  public async initialize(): Promise<void> {
    if (this.audioContext) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioContext = new AudioContextClass();
    this.listener = this.audioContext.listener;

    // Ambient room bed
    this.ambientGain = this.audioContext.createGain();
    this.ambientGain.gain.setValueAtTime(0.4, this.audioContext.currentTime);

    // Synthetic soft cinematic drone generator
    const osc = this.audioContext.createOscillator();
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, this.audioContext.currentTime);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, this.audioContext.currentTime); // A1 bass
    osc.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.audioContext.destination);
    osc.start();
  }

  public async resume(): Promise<void> {
    if (!this.audioContext) {
      await this.initialize();
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  public createActorTrack(id: string, initialPos: THREE.Vector3): void {
    if (!this.audioContext) return;

    const panner = this.audioContext.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 0.8;
    panner.maxDistance = 10.0;
    panner.rolloffFactor = 1.2;

    panner.positionX.setValueAtTime(initialPos.x, this.audioContext.currentTime);
    panner.positionY.setValueAtTime(initialPos.y, this.audioContext.currentTime);
    panner.positionZ.setValueAtTime(initialPos.z, this.audioContext.currentTime);

    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0.8, this.audioContext.currentTime);

    // Synthetic tonal vocal actor layer
    const osc = this.audioContext.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, this.audioContext.currentTime);
    osc.connect(gain);
    gain.connect(panner);
    panner.connect(this.audioContext.destination);
    osc.start();

    this.actorNodes.set(id, { panner, gain, synthOsc: osc });
  }

  public updateListener(camera: THREE.Camera): void {
    if (!this.audioContext || !this.listener) return;

    const pos = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const up = new THREE.Vector3();

    camera.getWorldPosition(pos);
    camera.getWorldDirection(forward);
    up.copy(camera.up).applyQuaternion(camera.quaternion);

    const time = this.audioContext.currentTime;

    if (this.listener.positionX) {
      this.listener.positionX.setValueAtTime(pos.x, time);
      this.listener.positionY.setValueAtTime(pos.y, time);
      this.listener.positionZ.setValueAtTime(pos.z, time);
      this.listener.forwardX.setValueAtTime(forward.x, time);
      this.listener.forwardY.setValueAtTime(forward.y, time);
      this.listener.forwardZ.setValueAtTime(forward.z, time);
      this.listener.upX.setValueAtTime(up.x, time);
      this.listener.upY.setValueAtTime(up.y, time);
      this.listener.upZ.setValueAtTime(up.z, time);
    } else {
      this.listener.setPosition(pos.x, pos.y, pos.z);
      this.listener.setOrientation(forward.x, forward.y, forward.z, up.x, up.y, up.z);
    }
  }

  public updateActorPosition(id: string, pos: THREE.Vector3): void {
    if (!this.audioContext) return;
    const node = this.actorNodes.get(id);
    if (!node) return;
    const time = this.audioContext.currentTime;
    node.panner.positionX.setTargetAtTime(pos.x, time, 0.05);
    node.panner.positionY.setTargetAtTime(pos.y, time, 0.05);
    node.panner.positionZ.setTargetAtTime(pos.z, time, 0.05);
  }

  public applyAudioSnapFocus(snappedActorId: string | null): void {
    if (!this.audioContext || !this.ambientGain) return;
    const time = this.audioContext.currentTime;

    if (snappedActorId) {
      // Attenuate ambient by -12dB (gain * 0.25)
      this.ambientGain.gain.setTargetAtTime(0.1, time, 0.08);
      this.actorNodes.forEach((node, id) => {
        if (id === snappedActorId) {
          node.gain.gain.setTargetAtTime(1.3, time, 0.05);
        } else {
          node.gain.gain.setTargetAtTime(0.25, time, 0.08);
        }
      });
    } else {
      this.ambientGain.gain.setTargetAtTime(0.4, time, 0.2);
      this.actorNodes.forEach((node) => {
        node.gain.gain.setTargetAtTime(0.8, time, 0.2);
      });
    }
  }
}
