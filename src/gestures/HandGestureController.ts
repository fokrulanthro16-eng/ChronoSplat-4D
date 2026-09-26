import * as THREE from 'three';
import { SplatActorTrack } from '../engine/types';

export interface GestureFrameState {
  isScrubbing: boolean;
  scrubDeltaNorm: number;
  isScaling: boolean;
  scaleFactor: number;
  snappedActor: string | null;
  dockVisible: boolean;
  dockTransform: THREE.Matrix4;
  caliperIndexPos: THREE.Vector3 | null;
  dominantRayActive: boolean;
}

export class HandGestureController {
  // WebXR XRHand standard joint indices
  public static readonly WRIST = 0;
  public static readonly THUMB_METACARPAL = 1;
  public static readonly THUMB_PHALANX_PROXIMAL = 2;
  public static readonly THUMB_PHALANX_DISTAL = 3;
  public static readonly THUMB_TIP = 4;
  public static readonly INDEX_METACARPAL = 5;
  public static readonly INDEX_PHALANX_PROXIMAL = 6;
  public static readonly INDEX_PHALANX_INTERMEDIATE = 7;
  public static readonly INDEX_PHALANX_DISTAL = 8;
  public static readonly INDEX_TIP = 9;
  public static readonly MIDDLE_TIP = 14;
  public static readonly RING_TIP = 19;
  public static readonly PINKY_TIP = 24;

  // Caliper State
  private isCaliperPinching: boolean = false;
  private caliperAnchorX: number = 0;
  private readonly PINCH_THRESHOLD_METERS = 0.022; // 22mm pinch snap threshold

  // Volumetric Two-Hand Zoom State
  private isTwoHandScaling: boolean = false;
  private initialHandDistance: number = 0;
  private baseVolumetricScale: number = 1.0;

  // Visual Targeting & Snapping Ray
  private snappingRay: THREE.Line;
  private rayMaterial: THREE.LineBasicMaterial;

  constructor(private scene: THREE.Scene) {
    const rayGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -2.0),
    ]);
    this.rayMaterial = new THREE.LineBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.0,
      linewidth: 2,
    });
    this.snappingRay = new THREE.Line(rayGeometry, this.rayMaterial);
    this.scene.add(this.snappingRay);
  }

  /**
   * Evaluates hand joints each frame within a strict 2-foot seated boundary
   */
  public processHands(
    leftHand: THREE.XRHandSpace | null,
    rightHand: THREE.XRHandSpace | null,
    camera: THREE.Camera,
    actors: SplatActorTrack[]
  ): GestureFrameState {
    const state: GestureFrameState = {
      isScrubbing: false,
      scrubDeltaNorm: 0,
      isScaling: false,
      scaleFactor: this.baseVolumetricScale,
      snappedActor: null,
      dockVisible: false,
      dockTransform: new THREE.Matrix4(),
      caliperIndexPos: null,
      dominantRayActive: false,
    };

    // -------------------------------------------------------------
    // 1. NON-DOMINANT HAND (LEFT): Temporal Caliper & Palm-Up Dock
    // -------------------------------------------------------------
    if (leftHand && (leftHand as any).joints) {
      const thumbTip = this.getJointWorldPosition(leftHand, HandGestureController.THUMB_TIP);
      const indexTip = this.getJointWorldPosition(leftHand, HandGestureController.INDEX_TIP);
      const wrist = this.getJointWorldPosition(leftHand, HandGestureController.WRIST);
      const middleTip = this.getJointWorldPosition(leftHand, HandGestureController.MIDDLE_TIP);

      if (thumbTip && indexTip && wrist && middleTip) {
        // --- 1A. Temporal Caliper Micro-Scrubber ---
        const pinchDistance = thumbTip.distanceTo(indexTip);
        if (pinchDistance < this.PINCH_THRESHOLD_METERS) {
          state.caliperIndexPos = indexTip;
          if (!this.isCaliperPinching) {
            this.isCaliperPinching = true;
            this.caliperAnchorX = indexTip.x;
          } else {
            // Horizontal micro-displacement in seated radius: +/- 0.15m corresponds to -1.0 to +1.0
            const deltaX = indexTip.x - this.caliperAnchorX;
            state.isScrubbing = true;
            state.scrubDeltaNorm = THREE.MathUtils.clamp(deltaX / 0.15, -1.0, 1.0);
          }
        } else {
          this.isCaliperPinching = false;
        }

        // --- 1B. Palm-Up Lean-Back Media Dock ---
        // Compute Palm normal vector: cross((index - wrist), (middle - wrist))
        const vIndex = new THREE.Vector3().subVectors(indexTip, wrist).normalize();
        const vMiddle = new THREE.Vector3().subVectors(middleTip, wrist).normalize();
        const palmNormal = new THREE.Vector3().crossVectors(vIndex, vMiddle).normalize();

        const cameraPos = new THREE.Vector3();
        camera.getWorldPosition(cameraPos);
        const palmCenter = new THREE.Vector3().addVectors(wrist, indexTip).multiplyScalar(0.5);
        const palmToHmd = new THREE.Vector3().subVectors(cameraPos, palmCenter).normalize();

        // Dot product test: is palm facing directly toward user's eyes?
        const alignment = palmNormal.dot(palmToHmd);
        if (alignment > 0.72) {
          state.dockVisible = true;
          // Position dock floating 70mm above palm surface, billboarded toward user
          const dockPos = palmCenter.clone().add(palmNormal.clone().multiplyScalar(0.07));
          const lookMatrix = new THREE.Matrix4().lookAt(dockPos, cameraPos, new THREE.Vector3(0, 1, 0));
          state.dockTransform.makeTranslation(dockPos.x, dockPos.y, dockPos.z).multiply(lookMatrix);
        }
      }
    }

    // -------------------------------------------------------------
    // 2. TWO-HAND VOLUMETRIC ORBIT & BOUNDING ZOOM
    // -------------------------------------------------------------
    if (leftHand && rightHand && (leftHand as any).joints && (rightHand as any).joints) {
      const leftIndex = this.getJointWorldPosition(leftHand, HandGestureController.INDEX_TIP);
      const leftThumb = this.getJointWorldPosition(leftHand, HandGestureController.THUMB_TIP);
      const rightIndex = this.getJointWorldPosition(rightHand, HandGestureController.INDEX_TIP);
      const rightThumb = this.getJointWorldPosition(rightHand, HandGestureController.THUMB_TIP);

      if (leftIndex && leftThumb && rightIndex && rightThumb) {
        const leftPinching = leftIndex.distanceTo(leftThumb) < this.PINCH_THRESHOLD_METERS;
        const rightPinching = rightIndex.distanceTo(rightThumb) < this.PINCH_THRESHOLD_METERS;

        if (leftPinching && rightPinching) {
          const currentSpan = leftIndex.distanceTo(rightIndex);
          if (!this.isTwoHandScaling) {
            this.isTwoHandScaling = true;
            this.initialHandDistance = currentSpan;
          } else {
            const ratio = currentSpan / (this.initialHandDistance || 1.0);
            state.isScaling = true;
            // Bound between 0.3x (tabletop diorama) and 1.0x (full theatrical scale)
            const clamped = THREE.MathUtils.clamp(this.baseVolumetricScale * ratio, 0.3, 1.0);
            state.scaleFactor = clamped;
          }
        } else {
          if (this.isTwoHandScaling) {
            this.baseVolumetricScale = state.scaleFactor;
            this.isTwoHandScaling = false;
          }
        }
      }
    }

    // -------------------------------------------------------------
    // 3. DOMINANT HAND (RIGHT): Binaural Audio Snapping Ray
    // -------------------------------------------------------------
    if (rightHand && (rightHand as any).joints && !state.isScaling) {
      const rightIndexTip = this.getJointWorldPosition(rightHand, HandGestureController.INDEX_TIP);
      const rightIndexDistal = this.getJointWorldPosition(rightHand, HandGestureController.INDEX_PHALANX_DISTAL);

      if (rightIndexTip && rightIndexDistal) {
        state.dominantRayActive = true;
        // Direction pointing outward from index finger
        const rayDir = new THREE.Vector3().subVectors(rightIndexTip, rightIndexDistal).normalize();
        this.updateRayVisual(rightIndexTip, rayDir);

        // Acoustic cone raycast against volumetric actors
        let closestActor: string | null = null;
        let minAngularSpread = 0.24; // ~14 degrees snap cone

        for (const actor of actors) {
          const toActor = new THREE.Vector3().subVectors(actor.centroid, rightIndexTip).normalize();
          const angle = rayDir.angleTo(toActor);
          if (angle < minAngularSpread) {
            minAngularSpread = angle;
            closestActor = actor.id;
          }
        }

        state.snappedActor = closestActor;
        if (closestActor) {
          this.rayMaterial.color.setHex(0x00ff88); // Emerald audio snap confirmation
          this.rayMaterial.opacity = 0.85;
        } else {
          this.rayMaterial.color.setHex(0x00f3ff);
          this.rayMaterial.opacity = 0.2;
        }
      }
    } else {
      this.rayMaterial.opacity = 0.0;
    }

    return state;
  }

  private updateRayVisual(origin: THREE.Vector3, direction: THREE.Vector3): void {
    const end = origin.clone().add(direction.clone().multiplyScalar(2.2));
    const pos = this.snappingRay.geometry.attributes.position as THREE.BufferAttribute;
    pos.setXYZ(0, origin.x, origin.y, origin.z);
    pos.setXYZ(1, end.x, end.y, end.z);
    pos.needsUpdate = true;
  }

  private getJointWorldPosition(hand: THREE.XRHandSpace, jointIndex: number): THREE.Vector3 | null {
    const joints = (hand as any).joints;
    if (!joints) return null;
    const joint = joints[jointIndex];
    if (!joint) return null;

    const pos = new THREE.Vector3();
    pos.setFromMatrixPosition(joint.matrixWorld);
    return pos;
  }

  public dispose(): void {
    this.snappingRay.geometry.dispose();
    this.rayMaterial.dispose();
    this.scene.remove(this.snappingRay);
  }
}
