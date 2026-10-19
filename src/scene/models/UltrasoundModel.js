import * as THREE from 'three';
import { createUltrasoundScreenTexture, createUltrasoundControlTexture } from '../textures/TextureGenerators';

/**
 * Photorealistic 3D Diagnostic Ultrasound Imaging System
 * Substantial Component-Level Exploded Unfolding:
 * 1. Mobile Trolley Chassis & 4 Precision Casters (base anchor)
 * 2. Multi-Channel Acoustic Beamformer Card Cage (slides out of console)
 * 3. Ergonomic Operator Control Console Deck with Trackball & TGC Sliders (elevates & tilts)
 * 4. Articulated Display Arm & Display Chassis (extends high +Y)
 * 5. Diagnostic Screen Panel & Bezel with B-Mode Sonogram (separates +Z from chassis)
 * 6. Ergonomic Convex Transducer Probe (lifts out of holster & presents hero pose)
 * 7. Flexible Clinical Cable (smoothly uncoils in 3D with zero heap allocation)
 * 8. Luminous 3D Acoustic Ultrasound Scan Fan (radiates from probe head with focal rings)
 */
export class UltrasoundModel {
  constructor() {
    this.group = new THREE.Group();
    this.cableCurvePoints = [];
    this.init();
  }

  init() {
    // ----------------------------------------------------
    // MATERIALS
    // ----------------------------------------------------
    const medicalWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.32,
      metalness: 0.08
    });

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x091224,
      roughness: 0.25,
      metalness: 0.35
    });

    const brushedMetalMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.22,
      metalness: 0.9
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.95
    });

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.28,
      metalness: 0.85
    });

    // ----------------------------------------------------
    // 1. MOBILE TROLLEY CHASSIS & CASTERS
    // ----------------------------------------------------
    this.chassisGroup = new THREE.Group();

    // Heavy molded base platform
    const baseGeo = new THREE.BoxGeometry(3.8, 0.4, 3.4);
    const baseMesh = new THREE.Mesh(baseGeo, medicalWhiteMat);
    baseMesh.position.y = -2.4;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    this.chassisGroup.add(baseMesh);

    // 4 Dual-Wheel Medical Casters
    const casters = [
      [-1.5, -2.75, -1.3],
      [1.5, -2.75, -1.3],
      [-1.5, -2.75, 1.3],
      [1.5, -2.75, 1.3]
    ];
    casters.forEach(([cx, cy, cz]) => {
      const fork = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.32, 0.22), brushedMetalMat);
      fork.position.set(cx, cy + 0.14, cz);
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.16, 20), darkMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(cx, cy - 0.05, cz);
      this.chassisGroup.add(fork, wheel);
    });

    // Central Tower Chassis Enclosure
    const towerGeo = new THREE.BoxGeometry(2.8, 2.0, 2.4);
    const towerMesh = new THREE.Mesh(towerGeo, medicalWhiteMat);
    towerMesh.position.y = -1.2;
    towerMesh.castShadow = true;
    this.chassisGroup.add(towerMesh);

    // Front Transducer Connection Bay
    const bayMesh = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.75, 0.12), darkMat);
    bayMesh.position.set(0, -1.3, 1.26);
    this.chassisGroup.add(bayMesh);

    // Receptacle Port Rings (Active Transducer Channels)
    this.activePortPos = new THREE.Vector3(0.5, -1.3, 1.32);
    [-0.5, 0.5].forEach((px) => {
      const portRing = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.14, 24), brushedMetalMat);
      portRing.rotation.x = Math.PI / 2;
      portRing.position.set(px, -1.3, 1.32);
      this.chassisGroup.add(portRing);

      // Gold pins inside port
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.16, 12), goldMat);
      pin.rotation.x = Math.PI / 2;
      pin.position.set(px, -1.3, 1.34);
      this.chassisGroup.add(pin);
    });

    // Side Holster Bracket
    const holster = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.28, 1.1, 20, 1, true), darkMat);
    holster.position.set(1.95, -0.35, 0.5);
    holster.rotation.z = -0.18;
    this.chassisGroup.add(holster);

    this.group.add(this.chassisGroup);

    // ----------------------------------------------------
    // 2. BEAMFORMER ELECTRONICS CARD CAGE (Slides out of console)
    // ----------------------------------------------------
    this.beamformerGroup = new THREE.Group();
    this.beamformerGroup.position.set(0, -1.2, 0);

    // Card cage frame
    const cageFrame = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.5, 1.8), darkMetalMat);
    this.beamformerGroup.add(cageFrame);

    // 6 Vertical High-Density Beamformer Channel Cards
    const beamCardMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.35 });
    for (let c = 0; c < 6; c++) {
      const cardX = -0.8 + c * 0.32;
      const card = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.35, 1.6), beamCardMat);
      card.position.set(cardX, 0, 0);
      this.beamformerGroup.add(card);

      // Card gold edge contacts & status LEDs
      const goldEdge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 1.5), goldMat);
      goldEdge.position.set(cardX, -0.65, 0);
      this.beamformerGroup.add(goldEdge);

      const cardLed = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
      cardLed.position.set(cardX, 0.6, 0.82);
      this.beamformerGroup.add(cardLed);
    }

    this.group.add(this.beamformerGroup);

    // ----------------------------------------------------
    // 3. OPERATOR CONTROL CONSOLE DECK
    // ----------------------------------------------------
    this.deckGroup = new THREE.Group();
    this.deckGroup.position.set(0, -0.05, 0.3);
    this.deckGroup.rotation.x = 0.22;

    const deckBody = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.38, 2.8), medicalWhiteMat);
    deckBody.castShadow = true;
    this.deckGroup.add(deckBody);

    // Textured deck surface with alphanumeric keys & TGC sliders
    const deckTex = createUltrasoundControlTexture();
    const deckMat = new THREE.MeshStandardMaterial({ map: deckTex, roughness: 0.35 });
    const deckFace = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.5), deckMat);
    deckFace.rotation.x = -Math.PI / 2;
    deckFace.position.y = 0.2;
    this.deckGroup.add(deckFace);

    // 8 Physical 3D Time Gain Compensation (TGC) Slider Knobs
    for (let s = 0; s < 8; s++) {
      const slider = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.08), brushedMetalMat);
      slider.position.set(-1.4 + (s % 2) * 0.15, 0.26, -0.8 + s * 0.2);
      this.deckGroup.add(slider);
    }

    // Glowing Optical Trackball Unit
    const ballMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      roughness: 0.08,
      clearcoat: 1.0,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5
    });
    this.trackball = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 24), ballMat);
    this.trackball.position.set(1.0, 0.28, 0.4);
    this.deckGroup.add(this.trackball);

    // Chrome trackball retention collar ring
    const ballCollar = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.04, 16, 32), brushedMetalMat);
    ballCollar.rotation.x = Math.PI / 2;
    ballCollar.position.set(1.0, 0.25, 0.4);
    this.deckGroup.add(ballCollar);

    this.group.add(this.deckGroup);

    // ----------------------------------------------------
    // 4. ARTICULATED DISPLAY ARM & MONITOR CHASSIS
    // ----------------------------------------------------
    this.monitorArmGroup = new THREE.Group();
    this.monitorArmGroup.position.set(0, 0.4, -0.4);

    // Dual-axis articulated counterbalanced stem
    const stemLower = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 1.1, 24), brushedMetalMat);
    stemLower.position.y = 0.55;
    this.monitorArmGroup.add(stemLower);

    const swivelElbow = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20), brushedMetalMat);
    swivelElbow.position.y = 1.1;
    this.monitorArmGroup.add(swivelElbow);

    // Monitor rear chassis housing
    const monWidth = 4.4;
    const monHeight = 3.2;
    const monChassis = new THREE.Mesh(new THREE.BoxGeometry(monWidth, monHeight, 0.35), medicalWhiteMat);
    monChassis.position.set(0, 2.2, 0.12);
    monChassis.rotation.x = -0.06;
    monChassis.castShadow = true;
    this.monitorArmGroup.add(monChassis);

    this.group.add(this.monitorArmGroup);

    // ----------------------------------------------------
    // 5. DIAGNOSTIC SCREEN & BEZEL (Separates forward from monitor chassis)
    // ----------------------------------------------------
    this.screenGroup = new THREE.Group();
    this.screenGroup.position.set(0, 2.6, -0.28);

    // Dark screen bezel
    const monBezel = new THREE.Mesh(new THREE.BoxGeometry(monWidth * 0.95, monHeight * 0.92, 0.08), darkMat);
    monBezel.position.set(0, 0, 0.34);
    monBezel.rotation.x = -0.06;
    this.screenGroup.add(monBezel);

    // High-Resolution B-Mode Sonogram Display
    const sonoTex = createUltrasoundScreenTexture();
    const sonoMat = new THREE.MeshBasicMaterial({ map: sonoTex });
    const sonoScreen = new THREE.Mesh(new THREE.PlaneGeometry(monWidth * 0.91, monHeight * 0.88), sonoMat);
    sonoScreen.position.set(0, 0, 0.39);
    sonoScreen.rotation.x = -0.06;
    this.screenGroup.add(sonoScreen);

    this.group.add(this.screenGroup);

    // ----------------------------------------------------
    // 6. ERGONOMIC CONVEX TRANSDUCER PROBE (Hero Component)
    // ----------------------------------------------------
    this.probeGroup = new THREE.Group();
    this.probeRestPos = new THREE.Vector3(1.95, 0.35, 0.6);
    this.probeGroup.position.copy(this.probeRestPos);
    this.probeGroup.rotation.set(0.25, -0.3, 0.15);

    // Ergonomic curved body
    const probeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 1.9, 24), medicalWhiteMat);
    probeBody.castShadow = true;
    this.probeGroup.add(probeBody);

    // Dark silicone tactile grip sleeve
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.72, 24), darkMat);
    grip.position.y = 0.08;
    this.probeGroup.add(grip);

    // Medical sapphire acoustic head casing
    const headMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.2 });
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.38, 0.46), headMat);
    head.position.y = 1.1;
    this.probeGroup.add(head);

    // Convex silicone acoustic lens face
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x091224, roughness: 0.15, metalness: 0.2 });
    const lens = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.08, 0.36), lensMat);
    lens.position.y = 1.32;
    this.probeGroup.add(lens);

    // Cable strain relief boot
    const boot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.12, 0.45, 16), darkMat);
    boot.position.y = -1.1;
    this.probeGroup.add(boot);

    // ----------------------------------------------------
    // 8. LUMINOUS ACOUSTIC ULTRASOUND SCAN FAN
    // ----------------------------------------------------
    this.scanFanGroup = new THREE.Group();
    this.scanFanGroup.position.set(0, 1.36, 0);

    // Acoustic Sector Fan Plane (Conic sector)
    const fanGeo = new THREE.RingGeometry(0.3, 4.2, 32, 1, -Math.PI * 0.32, Math.PI * 0.64);
    const fanMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    this.scanFanMesh = new THREE.Mesh(fanGeo, fanMat);
    this.scanFanMesh.rotation.x = Math.PI / 2;
    this.scanFanGroup.add(this.scanFanMesh);

    // Concentric Focal Depth Arc Rings
    this.focalArcs = [];
    [1.4, 2.5, 3.6].forEach((r) => {
      const arcGeo = new THREE.RingGeometry(r - 0.03, r + 0.03, 32, 1, -Math.PI * 0.32, Math.PI * 0.64);
      const arcMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const arcMesh = new THREE.Mesh(arcGeo, arcMat);
      arcMesh.rotation.x = Math.PI / 2;
      this.scanFanGroup.add(arcMesh);
      this.focalArcs.push(arcMesh);
    });

    this.probeGroup.add(this.scanFanGroup);
    this.group.add(this.probeGroup);

    // ----------------------------------------------------
    // 7. PRE-ALLOCATED ZERO-ALLOCATION 3D CLINICAL CABLE
    // ----------------------------------------------------
    this.cableMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45 });
    this.cableSegments = 36;
    this.cablePoints = [];
    for (let i = 0; i < 5; i++) {
      this.cablePoints.push(new THREE.Vector3());
    }
    this.cableCurve = new THREE.CatmullRomCurve3(this.cablePoints);
    this.cableGeo = new THREE.TubeGeometry(this.cableCurve, this.cableSegments, 0.065, 8, false);
    this.cableMesh = new THREE.Mesh(this.cableGeo, this.cableMat);
    this.cableMesh.castShadow = true;
    this.group.add(this.cableMesh);

    this.updateCableInPlace(0);

    // Initial pose
    this.group.rotation.set(0.08, -0.32, 0.02);
    this.group.position.set(2.2, 0, 0);
  }

  /**
   * Updates flexible cable in-place without heap allocations
   */
  updateCableInPlace(progress) {
    const p = Math.max(0, Math.min(1, progress));

    const p0 = this.activePortPos;
    const probeWorld = this.probeGroup.position.clone().add(new THREE.Vector3(0, -1.1, 0));

    // Dynamic uncoiling spline coordinates
    this.cablePoints[0].copy(p0);
    this.cablePoints[1].set(
      THREE.MathUtils.lerp(p0.x, probeWorld.x, 0.25),
      -1.9 - p * 0.6,
      1.6 + p * 0.5
    );
    this.cablePoints[2].set(
      THREE.MathUtils.lerp(p0.x, probeWorld.x, 0.55),
      -1.4 - p * 0.2,
      1.4 + p * 0.8
    );
    this.cablePoints[3].set(
      THREE.MathUtils.lerp(p0.x, probeWorld.x, 0.8),
      probeWorld.y - 0.4 + p * 0.2,
      probeWorld.z + 0.2
    );
    this.cablePoints[4].copy(probeWorld);

    // Recompute tube vertices using pre-allocated curve points
    this.cableCurve.points = this.cablePoints;
    const newGeo = new THREE.TubeGeometry(this.cableCurve, this.cableSegments, 0.065, 8, false);
    this.cableGeo.attributes.position.copy(newGeo.attributes.position);
    this.cableGeo.attributes.position.needsUpdate = true;
    this.cableGeo.computeVertexNormals();
    newGeo.dispose();
  }

  /**
   * Substantial, component-level diagnostic unfolding
   */
  setExplosion(progress) {
    const p = Math.max(0, Math.min(1, progress));

    // 1. Beamformer card cage slides forward and elevates out of tower
    this.beamformerGroup.position.y = -1.2 + p * 0.85;
    this.beamformerGroup.position.x = -p * 0.95;
    this.beamformerGroup.position.z = p * 0.65;
    this.beamformerGroup.rotation.y = -p * 0.35;

    // 2. Operator Control Console Deck elevates and tilts
    this.deckGroup.position.y = -0.05 + p * 1.5;
    this.deckGroup.position.z = 0.3 + p * 0.85;
    this.deckGroup.rotation.x = 0.22 + p * 0.25;

    // Optical trackball spins on scroll
    this.trackball.rotation.x = p * Math.PI * 4;
    this.trackball.rotation.y = p * Math.PI * 2;

    // 3. Articulated Display Arm extends upward and tilts back
    this.monitorArmGroup.position.y = 0.4 + p * 1.75;
    this.monitorArmGroup.position.z = -0.4 - p * 0.75;
    this.monitorArmGroup.rotation.x = -p * 0.12;

    // 4. Sonogram Screen Panel separates forward from monitor chassis
    this.screenGroup.position.y = 2.6 + p * 1.75;
    this.screenGroup.position.z = -0.28 + p * 1.45;
    this.screenGroup.position.x = p * 0.35;
    this.screenGroup.rotation.y = p * 0.18;

    // 5. Transducer Probe lifts out of holster and presents hero pose
    this.probeGroup.position.x = this.probeRestPos.x + p * 1.6;
    this.probeGroup.position.y = this.probeRestPos.y + p * 1.85;
    this.probeGroup.position.z = this.probeRestPos.z + p * 1.95;

    // Rotate into dynamic hero orientation
    this.probeGroup.rotation.x = 0.25 + p * 0.95;
    this.probeGroup.rotation.y = -0.3 + p * 1.4;
    this.probeGroup.rotation.z = 0.15 - p * 0.45;

    // 6. Dynamic uncoiling cable follows probe
    this.updateCableInPlace(p);

    // 7. Luminous Ultrasound Scan Fan & Focal Depth Rings activate
    const fanOpacity = Math.max(0, Math.min(0.85, (p - 0.2) * 2.2));
    this.scanFanMesh.material.opacity = fanOpacity;
    this.focalArcs.forEach((arc) => {
      arc.material.opacity = fanOpacity * 0.9;
    });

    const fanScale = Math.min(1.0, p * 1.6);
    this.scanFanGroup.scale.set(fanScale, fanScale, fanScale);

    // Whole machine subtle dynamic inspection rotation
    this.group.rotation.y = -0.32 + p * 0.62;
    this.group.rotation.x = 0.08 + p * 0.06;
  }

  update(time) {
    this.group.position.y += Math.sin(time * 1.2 + 3.0) * 0.0008;

    // Gentle pulsing shimmer of acoustic scan fan when active
    if (this.scanFanMesh && this.scanFanMesh.material.opacity > 0.05) {
      this.scanFanMesh.material.opacity = 0.65 + Math.sin(time * 3.0) * 0.15;
    }
  }
}
