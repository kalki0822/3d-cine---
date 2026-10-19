import * as THREE from 'three';

/**
 * Creates a high-resolution canvas texture for pharmaceutical capsule imprint
 */
function createCapsuleImprintTexture(text, code) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Transparent background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Crisp pharmaceutical stamp
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Medical brand and dosage imprint
  ctx.fillText(text, canvas.width / 2, 210);
  ctx.font = '600 32px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(200, 245, 255, 0.75)';
  ctx.fillText(code, canvas.width / 2, 275);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

/**
 * Photorealistic Pharmaceutical Capsule Assembly with Component-Level Exploded Separation
 */
export class CapsuleModel {
  constructor() {
    this.group = new THREE.Group();
    this.pellets = [];
    this.pelletInitialPositions = [];
    this.pelletExplodedPositions = [];

    this.init();
  }

  init() {
    const radius = 0.52;
    const capLength = 1.15;
    const bodyLength = 1.45;

    // Gelatin Materials (Physically-Based with transmission and clearcoat)
    const capMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7, // Medical Cyan / Teal
      roughness: 0.08,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      transmission: 0.35,
      thickness: 0.75,
      ior: 1.52,
      specularIntensity: 1.0,
      specularColor: 0xffffff,
      transparent: true,
      opacity: 0.94
    });

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf1f9f9, // Crisp semi-translucent clinical pearl white
      roughness: 0.1,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transmission: 0.42,
      thickness: 0.65,
      ior: 1.50,
      specularIntensity: 0.9,
      specularColor: 0xffffff,
      transparent: true,
      opacity: 0.92
    });

    // 1. CAP ASSEMBLY (Top Half)
    this.capGroup = new THREE.Group();

    // Cap Cylinder Body
    const capCylGeo = new THREE.CylinderGeometry(radius, radius, capLength, 64, 1, true);
    const capCylMesh = new THREE.Mesh(capCylGeo, capMaterial);
    capCylMesh.position.y = capLength / 2;
    capCylMesh.castShadow = true;
    this.capGroup.add(capCylMesh);

    // Cap Hemispherical Dome (Top)
    const capDomeGeo = new THREE.SphereGeometry(radius, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const capDomeMesh = new THREE.Mesh(capDomeGeo, capMaterial);
    capDomeMesh.position.y = capLength;
    capDomeMesh.castShadow = true;
    this.capGroup.add(capDomeMesh);

    // Cap Locking Dimples / Sealing Ridge (Sub-millimeter indent around rim)
    const rimGrooveGeo = new THREE.TorusGeometry(radius * 1.012, 0.018, 16, 64);
    const rimGrooveMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.2,
      metalness: 0.1
    });
    const rimGroove = new THREE.Mesh(rimGrooveGeo, rimGrooveMat);
    rimGroove.rotation.x = Math.PI / 2;
    rimGroove.position.y = 0.02;
    this.capGroup.add(rimGroove);

    // Cap Imprint Stamp
    const imprintTex = createCapsuleImprintTexture('MEDSOURCE', '500 mg');
    const imprintMat = new THREE.MeshBasicMaterial({
      map: imprintTex,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const imprintGeo = new THREE.CylinderGeometry(radius * 1.008, radius * 1.008, capLength * 0.7, 48, 1, true);
    const imprintMesh = new THREE.Mesh(imprintGeo, imprintMat);
    imprintMesh.position.y = capLength * 0.55;
    imprintMesh.rotation.y = -Math.PI * 0.5;
    this.capGroup.add(imprintMesh);

    // Position Cap in neutral closed position
    this.capGroup.position.y = 0.12;
    this.group.add(this.capGroup);

    // 2. BODY ASSEMBLY (Bottom Half)
    this.bodyGroup = new THREE.Group();
    const bodyRadius = radius * 0.965; // Slightly narrower to slide into cap

    // Body Cylinder
    const bodyCylGeo = new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyLength, 64, 1, true);
    const bodyCylMesh = new THREE.Mesh(bodyCylGeo, bodyMaterial);
    bodyCylMesh.position.y = -bodyLength / 2;
    bodyCylMesh.castShadow = true;
    this.bodyGroup.add(bodyCylMesh);

    // Body Hemispherical Dome (Bottom)
    const bodyDomeGeo = new THREE.SphereGeometry(bodyRadius, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const bodyDomeMesh = new THREE.Mesh(bodyDomeGeo, bodyMaterial);
    bodyDomeMesh.position.y = -bodyLength;
    bodyDomeMesh.castShadow = true;
    this.bodyGroup.add(bodyDomeMesh);

    // Body Overlap Seam Ring
    const overlapRingGeo = new THREE.CylinderGeometry(bodyRadius * 1.008, bodyRadius * 1.008, 0.03, 64);
    const overlapRingMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.3
    });
    const overlapRing = new THREE.Mesh(overlapRingGeo, overlapRingMat);
    overlapRing.position.y = -0.05;
    this.bodyGroup.add(overlapRing);

    // Position Body in neutral closed position
    this.bodyGroup.position.y = 0.12;
    this.group.add(this.bodyGroup);

    // 3. INTERNAL CONTROLLED-RELEASE MICRO-PELLETS (Sustained-Release Beadlets)
    this.pelletsGroup = new THREE.Group();

    // Three distinct clinical pellet materials
    const matTealPellet = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      metalness: 0.05
    });

    const matWhitePellet = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.2,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      metalness: 0.02
    });

    const matGoldPellet = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b, // Amber API beadlet
      roughness: 0.18,
      clearcoat: 1.0,
      metalness: 0.15
    });

    const pelletMaterials = [matTealPellet, matWhitePellet, matGoldPellet];
    const pelletCount = 72;

    for (let i = 0; i < pelletCount; i++) {
      // Pellet radius between 0.055 and 0.082
      const pRadius = 0.055 + Math.random() * 0.027;
      const pGeo = new THREE.SphereGeometry(pRadius, 16, 16);
      const pMat = pelletMaterials[i % pelletMaterials.length];
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.castShadow = true;

      // Closed/compact packed distribution inside capsule body
      const angle = (i / pelletCount) * Math.PI * 12 + Math.random() * 0.5;
      const r = Math.pow(Math.random(), 0.6) * (bodyRadius * 0.72);
      const initX = Math.cos(angle) * r;
      const initZ = Math.sin(angle) * r;
      const initY = -bodyLength * 0.85 + (i / pelletCount) * (bodyLength * 1.3);

      pMesh.position.set(initX, initY, initZ);
      this.pelletsGroup.add(pMesh);

      // Store initial packed position
      this.pellets.push(pMesh);
      this.pelletInitialPositions.push(new THREE.Vector3(initX, initY, initZ));

      // Compute structured exploded position (outward radial constellation)
      const explodeAngle = (i / pelletCount) * Math.PI * 8;
      const explodeRadius = 0.9 + (i % 6) * 0.35 + Math.random() * 0.3;
      const explodeY = (i / pelletCount - 0.5) * 2.8 + (Math.random() - 0.5) * 0.4;
      const explodeX = Math.cos(explodeAngle) * explodeRadius;
      const explodeZ = Math.sin(explodeAngle) * explodeRadius;

      this.pelletExplodedPositions.push(new THREE.Vector3(explodeX, explodeY, explodeZ));
    }

    this.group.add(this.pelletsGroup);

    // Initial orientation: angled three-quarter hero pose
    this.group.rotation.set(0.35, -0.45, 0.25);
    this.group.position.set(1.4, 0.1, 0); // Positioned slightly to the right to frame hero text
  }

  /**
   * Explodes the capsule along its longitudinal axis and disperses micro-pellets
   * @param {number} progress - Float 0.0 (closed) to 1.0 (fully exploded)
   */
  setExplosion(progress) {
    const p = Math.max(0, Math.min(1, progress));

    // 1. Cap separates upwards along Y axis
    const capTravel = 1.25;
    this.capGroup.position.y = 0.12 + p * capTravel;
    this.capGroup.rotation.z = p * 0.12;

    // 2. Body separates downwards along Y axis
    const bodyTravel = 1.2;
    this.bodyGroup.position.y = 0.12 - p * bodyTravel;
    this.bodyGroup.rotation.z = -p * 0.1;

    // 3. Pellets expand from initial packed coordinates to exploded constellation
    for (let i = 0; i < this.pellets.length; i++) {
      const mesh = this.pellets[i];
      const initPos = this.pelletInitialPositions[i];
      const targetPos = this.pelletExplodedPositions[i];

      mesh.position.x = THREE.MathUtils.lerp(initPos.x, targetPos.x * 0.75, p);
      mesh.position.y = THREE.MathUtils.lerp(initPos.y, targetPos.y * 0.75, p);
      mesh.position.z = THREE.MathUtils.lerp(initPos.z, targetPos.z * 0.75, p);

      // Subtle individual rotational drift
      mesh.rotation.x = p * (i * 0.2);
      mesh.rotation.y = p * (i * 0.3);
    }
  }

  /**
   * Continuous subtle idle breathing/rotation
   */
  update(time) {
    // Gentle floating oscillation
    this.group.position.y += Math.sin(time * 1.5) * 0.0012;
  }
}
