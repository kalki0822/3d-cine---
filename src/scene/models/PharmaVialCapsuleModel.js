import * as THREE from 'three';

/**
 * Photorealistic 3D Pharmaceutical Vial and Capsule Assembly
 * Replaces conventional blister pack with a distinctive, luxury-grade
 * pharmaceutical composition featuring:
 * 1. Borosilicate glass injection vial with liquid meniscus
 * 2. Butyl rubber stopper
 * 3. Aluminum crimp collar
 * 4. Flip-off protective seal cap
 * 5. Two-piece hero pharmaceutical capsule (shell halves separate)
 * 6. Internal micro-pellet multi-particulate constellation
 * 7. Subtle pharmaceutical molecular lattice nodes
 */
export class PharmaVialCapsuleModel {
  constructor() {
    this.group = new THREE.Group();
    this.pellets = [];
    this.pelletInitialPositions = [];
    this.pelletExplodedPositions = [];
    this.molecularNodes = [];
    this.init();
  }

  init() {
    // ----------------------------------------------------
    // MATERIALS
    // ----------------------------------------------------
    // 1. Clear Borosilicate Glass (Translucent, refractive, high gloss)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      roughness: 0.04,
      ior: 1.52,
      thickness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      transparent: true,
      opacity: 0.65,
      specularIntensity: 1.0,
      specularColor: 0xffffff
    });

    // 2. Liquid Therapeutic Formulation inside vial
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      transmission: 0.75,
      roughness: 0.08,
      ior: 1.34,
      transparent: true,
      opacity: 0.82,
      clearcoat: 1.0
    });

    // 3. Medical Butyl Rubber Stopper
    const rubberMat = new THREE.MeshStandardMaterial({
      color: 0x243447,
      roughness: 0.65,
      metalness: 0.05
    });

    // 4. Aluminum Crimp Collar
    const aluminumMat = new THREE.MeshStandardMaterial({
      color: 0xd1d9df,
      metalness: 0.92,
      roughness: 0.22
    });

    // 5. Flip-Off Protective Seal Cap (Medical Royal Blue / Teal)
    const capSealMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      roughness: 0.18,
      clearcoat: 0.9,
      metalness: 0.08
    });

    // 6. Hero Capsule Materials
    const capGelatinMat = new THREE.MeshPhysicalMaterial({
      color: 0x0369a1, // Deep sapphire cyan
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      transmission: 0.38,
      thickness: 0.7,
      ior: 1.52,
      transparent: true,
      opacity: 0.92
    });

    const bodyGelatinMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc, // Crystal pearl white
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transmission: 0.45,
      thickness: 0.6,
      ior: 1.5,
      transparent: true,
      opacity: 0.9
    });

    // ----------------------------------------------------
    // PART A: PHARMACEUTICAL INJECTION VIAL
    // ----------------------------------------------------
    this.vialRoot = new THREE.Group();
    this.vialRoot.position.set(-1.3, -1.5, -0.2);
    this.vialRoot.rotation.set(0.12, 0.35, -0.08);

    const vialRadius = 1.05;
    const vialHeight = 2.8;

    // Glass body cylinder
    const vialBodyGeo = new THREE.CylinderGeometry(vialRadius, vialRadius * 0.98, vialHeight, 48, 1, false);
    const vialBodyMesh = new THREE.Mesh(vialBodyGeo, glassMat);
    vialBodyMesh.position.y = vialHeight / 2;
    vialBodyMesh.castShadow = true;
    vialBodyMesh.receiveShadow = true;
    this.vialRoot.add(vialBodyMesh);

    // Vial shoulder
    const shoulderGeo = new THREE.CylinderGeometry(vialRadius * 0.62, vialRadius, 0.45, 48);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, glassMat);
    shoulderMesh.position.y = vialHeight + 0.225;
    this.vialRoot.add(shoulderMesh);

    // Vial neck
    const neckGeo = new THREE.CylinderGeometry(vialRadius * 0.58, vialRadius * 0.62, 0.5, 48);
    const neckMesh = new THREE.Mesh(neckGeo, glassMat);
    neckMesh.position.y = vialHeight + 0.45 + 0.25;
    this.vialRoot.add(neckMesh);

    // Vial mouth lip
    const lipGeo = new THREE.TorusGeometry(vialRadius * 0.58, 0.08, 16, 48);
    const lipMesh = new THREE.Mesh(lipGeo, glassMat);
    lipMesh.rotation.x = Math.PI / 2;
    lipMesh.position.y = vialHeight + 0.95;
    this.vialRoot.add(lipMesh);

    // Vial internal liquid contents
    const liquidGeo = new THREE.CylinderGeometry(vialRadius * 0.92, vialRadius * 0.9, vialHeight * 0.68, 36);
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.y = vialHeight * 0.38;
    this.vialRoot.add(liquidMesh);

    // Vial graduation markings / micro label strip
    const gradTex = this.createGraduationTexture();
    const gradMat = new THREE.MeshStandardMaterial({
      map: gradTex,
      transparent: true,
      roughness: 0.4,
      side: THREE.DoubleSide
    });
    const gradGeo = new THREE.CylinderGeometry(vialRadius + 0.012, vialRadius + 0.012, vialHeight * 0.6, 48, 1, true, 0, Math.PI * 1.6);
    const gradMesh = new THREE.Mesh(gradGeo, gradMat);
    gradMesh.position.y = vialHeight * 0.42;
    gradMesh.rotation.y = -Math.PI * 0.3;
    this.vialRoot.add(gradMesh);

    // ----------------------------------------------------
    // SEPARABLE VIAL CLOSURE COMPONENTS
    // ----------------------------------------------------
    // Rubber stopper (separates upward)
    this.stopperGroup = new THREE.Group();
    const stopperGeo = new THREE.CylinderGeometry(vialRadius * 0.54, vialRadius * 0.52, 0.4, 32);
    const stopperMesh = new THREE.Mesh(stopperGeo, rubberMat);
    stopperMesh.position.y = vialHeight + 0.85;
    this.stopperGroup.add(stopperMesh);
    this.vialRoot.add(this.stopperGroup);

    // Aluminum crimp collar (separates higher)
    this.crimpGroup = new THREE.Group();
    const crimpGeo = new THREE.CylinderGeometry(vialRadius * 0.64, vialRadius * 0.64, 0.35, 36, 1, true);
    const crimpMesh = new THREE.Mesh(crimpGeo, aluminumMat);
    crimpMesh.position.y = vialHeight + 0.98;
    this.crimpGroup.add(crimpMesh);
    this.vialRoot.add(this.crimpGroup);

    // Flip-off seal cap button (separates highest with tilt)
    this.sealCapGroup = new THREE.Group();
    const capGeo = new THREE.CylinderGeometry(vialRadius * 0.68, vialRadius * 0.68, 0.16, 36);
    const capMesh = new THREE.Mesh(capGeo, capSealMat);
    capMesh.position.y = vialHeight + 1.2;
    this.sealCapGroup.add(capMesh);
    this.vialRoot.add(this.sealCapGroup);

    this.group.add(this.vialRoot);

    // ----------------------------------------------------
    // PART B: HERO PHARMACEUTICAL CAPSULE (Main Exploding Subject)
    // ----------------------------------------------------
    this.capsuleRoot = new THREE.Group();
    this.capsuleRoot.position.set(1.4, -0.2, 0.4);
    this.capsuleRoot.rotation.set(0.32, -0.42, 0.22);

    const capR = 0.58;
    const capL = 1.25;
    const bodyL = 1.55;

    // Capsule Cap Half
    this.capsuleCapGroup = new THREE.Group();
    const capCyl = new THREE.Mesh(new THREE.CylinderGeometry(capR, capR, capL, 48, 1, true), capGelatinMat);
    capCyl.position.y = capL / 2;
    capCyl.castShadow = true;
    const capDome = new THREE.Mesh(new THREE.SphereGeometry(capR, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), capGelatinMat);
    capDome.position.y = capL;
    capDome.castShadow = true;
    this.capsuleCapGroup.add(capCyl, capDome);

    // Sealing ridge on cap rim
    const ringGeo = new THREE.TorusGeometry(capR * 1.012, 0.018, 16, 48);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.02;
    this.capsuleCapGroup.add(ring);

    this.capsuleCapGroup.position.y = 0.15;
    this.capsuleRoot.add(this.capsuleCapGroup);

    // Capsule Body Half
    this.capsuleBodyGroup = new THREE.Group();
    const bodyR = capR * 0.965;
    const bodyCyl = new THREE.Mesh(new THREE.CylinderGeometry(bodyR, bodyR, bodyL, 48, 1, true), bodyGelatinMat);
    bodyCyl.position.y = -bodyL / 2;
    bodyCyl.castShadow = true;
    const bodyDome = new THREE.Mesh(new THREE.SphereGeometry(bodyR, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), bodyGelatinMat);
    bodyDome.position.y = -bodyL;
    bodyDome.castShadow = true;
    this.capsuleBodyGroup.add(bodyCyl, bodyDome);

    this.capsuleBodyGroup.position.y = 0.15;
    this.capsuleRoot.add(this.capsuleBodyGroup);

    // Internal Sustained-Release Micro-Pellets (64 spheres)
    this.pelletsGroup = new THREE.Group();

    const pelletMatCyan = new THREE.MeshPhysicalMaterial({ color: 0x00f0ff, roughness: 0.12, clearcoat: 1.0, metalness: 0.08 });
    const pelletMatWhite = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.2, clearcoat: 0.9 });
    const pelletMatGold = new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.15, clearcoat: 1.0, metalness: 0.15 });
    const pelletMats = [pelletMatCyan, pelletMatWhite, pelletMatGold];

    const pelletCount = 64;
    for (let i = 0; i < pelletCount; i++) {
      const pr = 0.055 + Math.random() * 0.028;
      const pMesh = new THREE.Mesh(new THREE.SphereGeometry(pr, 16, 16), pelletMats[i % pelletMats.length]);
      pMesh.castShadow = true;

      // Packed inside capsule body
      const angle = (i / pelletCount) * Math.PI * 10 + Math.random() * 0.5;
      const r = Math.pow(Math.random(), 0.6) * (bodyR * 0.75);
      const initX = Math.cos(angle) * r;
      const initZ = Math.sin(angle) * r;
      const initY = -bodyL * 0.8 + (i / pelletCount) * (bodyL * 1.25);

      pMesh.position.set(initX, initY, initZ);
      this.pelletsGroup.add(pMesh);

      this.pellets.push(pMesh);
      this.pelletInitialPositions.push(new THREE.Vector3(initX, initY, initZ));

      // Exploded 3D formation (helical orbital dispersion)
      const explodeAngle = (i / pelletCount) * Math.PI * 7.5;
      const explodeDist = 0.95 + (i % 5) * 0.32 + Math.random() * 0.25;
      const expX = Math.cos(explodeAngle) * explodeDist;
      const expZ = Math.sin(explodeAngle) * explodeDist;
      const expY = (i / pelletCount - 0.5) * 2.8 + (Math.random() - 0.5) * 0.35;

      this.pelletExplodedPositions.push(new THREE.Vector3(expX, expY, expZ));
    }
    this.capsuleRoot.add(this.pelletsGroup);

    // ----------------------------------------------------
    // PART C: SUBTLE MOLECULAR LATTICE PARTICLES (Supporting Depth Elements)
    // ----------------------------------------------------
    this.molecularGroup = new THREE.Group();
    const molMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.15,
      clearcoat: 1.0,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.75
    });

    const molCount = 20;
    for (let m = 0; m < molCount; m++) {
      const molGeo = new THREE.SphereGeometry(0.045, 12, 12);
      const molMesh = new THREE.Mesh(molGeo, molMat);

      const mAngle = (m / molCount) * Math.PI * 2;
      const mRadius = 2.2 + (m % 3) * 0.5;
      const mx = Math.cos(mAngle) * mRadius;
      const my = (m / molCount - 0.5) * 3.2;
      const mz = Math.sin(mAngle) * mRadius;

      molMesh.position.set(mx, my, mz);
      this.molecularGroup.add(molMesh);
      this.molecularNodes.push({ mesh: molMesh, basePos: new THREE.Vector3(mx, my, mz), speed: 0.5 + Math.random() * 0.5 });
    }
    this.capsuleRoot.add(this.molecularGroup);

    this.group.add(this.capsuleRoot);

    // Initial position in SceneManager
    this.group.position.set(2.2, 0, 0);
  }

  createGraduationTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 3;

    // Measurement marks
    const levels = [
      { y: 380, label: '2 mL' },
      { y: 300, label: '4 mL' },
      { y: 220, label: '6 mL' },
      { y: 140, label: '8 mL' },
      { y: 60, label: '10 mL' }
    ];

    levels.forEach(({ y, label }) => {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(90, y);
      ctx.stroke();

      ctx.font = 'bold 22px "JetBrains Mono", monospace';
      ctx.fillText(label, 105, y + 7);
    });

    // Medical brand vertical strip
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('MEDSOURCE STERILE', 40, 440);
    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
    ctx.fillText('USP INJECTION GRADE', 40, 470);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  }

  /**
   * Explodes the vial and hero capsule components based on scroll progress
   * @param {number} progress - Float 0.0 to 1.0 within the pharmaceutical section
   */
  setExplosion(progress) {
    const p = Math.max(0, Math.min(1, progress));

    // 1. VIAL SEPARATION:
    // Flip-off seal cap lifts high with a slight release tilt
    this.sealCapGroup.position.y = p * 1.5;
    this.sealCapGroup.rotation.x = -p * 0.35;

    // Aluminum crimp collar lifts moderately
    this.crimpGroup.position.y = p * 0.9;

    // Rubber stopper elevates slightly out of neck
    this.stopperGroup.position.y = p * 0.5;

    // Glass vial shifts slightly left/down to frame the scene
    this.vialRoot.position.x = -1.4 - p * 0.35;
    this.vialRoot.rotation.y = 0.35 + p * 0.25;

    // 2. HERO CAPSULE SEPARATION:
    // Cap half moves upwards (+Y) with subtle release angle
    const capTravel = 1.35;
    this.capsuleCapGroup.position.y = 0.15 + p * capTravel;
    this.capsuleCapGroup.rotation.z = p * 0.14;

    // Body half moves downwards (-Y)
    const bodyTravel = 1.25;
    this.capsuleBodyGroup.position.y = 0.15 - p * bodyTravel;
    this.capsuleBodyGroup.rotation.z = -p * 0.1;

    // Internal sustained-release micro-pellets expand outward into 3D constellation
    for (let i = 0; i < this.pellets.length; i++) {
      const mesh = this.pellets[i];
      const initPos = this.pelletInitialPositions[i];
      const targetPos = this.pelletExplodedPositions[i];

      mesh.position.x = THREE.MathUtils.lerp(initPos.x, targetPos.x * 0.85, p);
      mesh.position.y = THREE.MathUtils.lerp(initPos.y, targetPos.y * 0.85, p);
      mesh.position.z = THREE.MathUtils.lerp(initPos.z, targetPos.z * 0.85, p);

      mesh.rotation.x = p * (i * 0.18);
      mesh.rotation.y = p * (i * 0.24);
    }

    // 3. MOLECULAR NODES: Expand and hover outward
    for (let m = 0; m < this.molecularNodes.length; m++) {
      const node = this.molecularNodes[m];
      node.mesh.position.x = node.basePos.x * (1 + p * 0.4);
      node.mesh.position.y = node.basePos.y * (1 + p * 0.3);
      node.mesh.position.z = node.basePos.z * (1 + p * 0.4);
    }

    // Dynamic rotation of hero capsule assembly
    this.capsuleRoot.rotation.y = -0.42 + p * 0.65;
    this.capsuleRoot.rotation.x = 0.32 + p * 0.15;
  }

  update(time) {
    // Subtle idle float
    this.group.position.y += Math.sin(time * 1.5 + 1.2) * 0.0012;

    // Molecular nodes gentle breathing
    for (let m = 0; m < this.molecularNodes.length; m++) {
      const node = this.molecularNodes[m];
      node.mesh.position.y = (node.basePos.y) + Math.sin(time * node.speed + m) * 0.08;
    }
  }
}
