import * as THREE from 'three';

/**
 * Photorealistic 3D Pharmaceutical Medicine / Tonic Bottle Model
 * Features:
 * 1. Translucent medicinal sapphire glass bottle with realistic transmission & reflections
 * 2. Liquid elixir inside with visible meniscus and dynamic displacement during explosion
 * 3. Knurled screw cap with authentic unscrewing rotation, vertical lift, and tilt hold
 * 4. Tamper-evident collar ring at neck
 * 5. High-resolution pharmaceutical label with graduations (25-150 mL), lot number & barcode
 * 6. Explosive liquid-droplet animation with 240+ individually visible, rounded liquid beads
 *    bursting in 360-degree 3D space across the entire viewport
 * 7. Zero-allocation InstancedMesh updates on scroll for silky 60fps performance
 */
export class MedicineBottleModel {
  constructor() {
    this.group = new THREE.Group();
    this.dropletCount = 160;
    this.microDropletCount = 80;
    this.dropletData = [];
    this.microDropletData = [];
    this.dummy = new THREE.Object3D();
    this.lastExplosionP = 0;
    this.init();
  }

  init() {
    // ----------------------------------------------------
    // MATERIALS
    // ----------------------------------------------------
    // 1. Medicinal Glass (Translucent, refractive, deep clinical cyan/sapphire)
    this.glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transmission: 0.90,
      roughness: 0.05,
      ior: 1.52,
      thickness: 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      transparent: true,
      opacity: 0.70,
      specularIntensity: 1.0,
      specularColor: 0xffffff
    });

    // 2. Liquid Elixir Formulation inside bottle
    this.liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      transmission: 0.82,
      roughness: 0.08,
      ior: 1.34,
      transparent: true,
      opacity: 0.85,
      clearcoat: 1.0
    });

    // 3. Knurled Screw Cap (Medical deep navy slate)
    this.capMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.28,
      metalness: 0.25
    });

    // 4. Tamper-evident Collar Ring (Teal clinical polymer)
    this.tamperMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.35,
      metalness: 0.2
    });

    // 5. Translucent Liquid Droplets Material (Primary)
    this.dropletMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      transmission: 0.88,
      roughness: 0.05,
      ior: 1.34,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.94,
      specularIntensity: 1.0,
      specularColor: 0xffffff
    });

    // 6. Secondary Micro-Droplets Material (Sparkling Mist)
    this.microDropletMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.84,
      roughness: 0.07,
      ior: 1.33,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.90
    });

    // ----------------------------------------------------
    // BOTTLE ROOT & GEOMETRY
    // ----------------------------------------------------
    this.bottleRoot = new THREE.Group();
    this.bottleRoot.position.set(0, -1.9, 0);

    const bottleRadius = 0.95;
    const bodyHeight = 2.4;
    const shoulderHeight = 0.55;
    const neckRadius = 0.52;
    const neckHeight = 0.75;

    // A. Main Glass Body (Cylinder)
    const bodyGeo = new THREE.CylinderGeometry(bottleRadius, bottleRadius * 0.97, bodyHeight, 48, 1, false);
    const bodyMesh = new THREE.Mesh(bodyGeo, this.glassMat);
    bodyMesh.position.y = bodyHeight / 2;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.bottleRoot.add(bodyMesh);

    // Rounded bottom curve
    const bottomGeo = new THREE.CylinderGeometry(bottleRadius * 0.97, bottleRadius * 0.88, 0.15, 48);
    const bottomMesh = new THREE.Mesh(bottomGeo, this.glassMat);
    bottomMesh.position.y = -0.075;
    this.bottleRoot.add(bottomMesh);

    // B. Bottle Shoulder (Tapered cone)
    const shoulderGeo = new THREE.CylinderGeometry(neckRadius * 1.15, bottleRadius, shoulderHeight, 48);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, this.glassMat);
    shoulderMesh.position.y = bodyHeight + shoulderHeight / 2;
    this.bottleRoot.add(shoulderMesh);

    // C. Bottle Neck with Thread Ridge
    const neckGeo = new THREE.CylinderGeometry(neckRadius, neckRadius * 1.05, neckHeight, 48);
    const neckMesh = new THREE.Mesh(neckGeo, this.glassMat);
    neckMesh.position.y = bodyHeight + shoulderHeight + neckHeight / 2;
    this.bottleRoot.add(neckMesh);

    // Helical thread rings on neck
    const threadGeo = new THREE.TorusGeometry(neckRadius * 1.02, 0.03, 16, 48);
    for (let t = 0; t < 2; t++) {
      const threadMesh = new THREE.Mesh(threadGeo, this.glassMat);
      threadMesh.rotation.x = Math.PI / 2 + 0.08;
      threadMesh.position.y = bodyHeight + shoulderHeight + 0.28 + t * 0.22;
      this.bottleRoot.add(threadMesh);
    }

    // Mouth Rim Torus
    const lipGeo = new THREE.TorusGeometry(neckRadius * 1.02, 0.06, 16, 48);
    const lipMesh = new THREE.Mesh(lipGeo, this.glassMat);
    lipMesh.rotation.x = Math.PI / 2;
    lipMesh.position.y = bodyHeight + shoulderHeight + neckHeight;
    this.bottleRoot.add(lipMesh);

    // D. Liquid Elixir inside bottle
    this.liquidHeight = bodyHeight * 0.82;
    const liquidGeo = new THREE.CylinderGeometry(bottleRadius * 0.88, bottleRadius * 0.85, this.liquidHeight, 36);
    this.liquidMesh = new THREE.Mesh(liquidGeo, this.liquidMat);
    this.liquidMesh.position.y = this.liquidHeight / 2 + 0.1;
    this.bottleRoot.add(this.liquidMesh);

    // Liquid top surface / meniscus
    const meniscusGeo = new THREE.CircleGeometry(bottleRadius * 0.88, 36);
    this.meniscusMesh = new THREE.Mesh(meniscusGeo, this.liquidMat);
    this.meniscusMesh.rotation.x = -Math.PI / 2;
    this.meniscusMesh.position.y = this.liquidHeight + 0.1;
    this.bottleRoot.add(this.meniscusMesh);

    // E. High-Resolution Pharmaceutical Tonic Label
    const labelTex = this.createLabelTexture();
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTex,
      transparent: true,
      roughness: 0.35,
      metalness: 0.05,
      side: THREE.DoubleSide
    });
    const labelGeo = new THREE.CylinderGeometry(
      bottleRadius + 0.015,
      bottleRadius + 0.015,
      bodyHeight * 0.72,
      48,
      1,
      true,
      -Math.PI * 0.45,
      Math.PI * 0.9
    );
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = bodyHeight * 0.46;
    labelMesh.rotation.y = Math.PI;
    this.bottleRoot.add(labelMesh);

    // F. Authentic Screw Cap with Knurled Ribs & Tamper Ring
    this.neckMouthY = bodyHeight + shoulderHeight + neckHeight;
    this.capRoot = new THREE.Group();
    this.capRoot.position.set(0, this.neckMouthY + 0.22, 0);

    const capHeight = 0.48;
    const capGeo = new THREE.CylinderGeometry(neckRadius * 1.12, neckRadius * 1.12, capHeight, 36);
    const capMesh = new THREE.Mesh(capGeo, this.capMat);
    capMesh.castShadow = true;
    this.capRoot.add(capMesh);

    // Cap top dome disc
    const capTopGeo = new THREE.CylinderGeometry(neckRadius * 1.12, neckRadius * 1.12, 0.04, 36);
    const capTop = new THREE.Mesh(capTopGeo, this.capMat);
    capTop.position.y = capHeight / 2 + 0.02;
    this.capRoot.add(capTop);

    // 16 Vertical knurled grip ribs around cap perimeter
    const ribGeo = new THREE.CylinderGeometry(0.015, 0.015, capHeight * 0.85, 8);
    for (let r = 0; r < 16; r++) {
      const angle = (r / 16) * Math.PI * 2;
      const rib = new THREE.Mesh(ribGeo, this.capMat);
      rib.position.set(Math.cos(angle) * (neckRadius * 1.13), 0, Math.sin(angle) * (neckRadius * 1.13));
      this.capRoot.add(rib);
    }

    // Tamper-evident collar ring
    this.tamperRing = new THREE.Mesh(
      new THREE.CylinderGeometry(neckRadius * 1.09, neckRadius * 1.09, 0.12, 36, 1, true),
      this.tamperMat
    );
    this.tamperRing.position.set(0, -capHeight / 2 - 0.08, 0);
    this.capRoot.add(this.tamperRing);

    this.bottleRoot.add(this.capRoot);

    // ----------------------------------------------------
    // EXPLOSIVE LIQUID DROPLET INSTANCED MESHES
    // ----------------------------------------------------
    this.initLiquidDroplets();

    this.group.add(this.bottleRoot);
  }

  initLiquidDroplets() {
    // 1. Primary Droplets InstancedMesh (160 rounded liquid beads)
    const primaryGeo = new THREE.SphereGeometry(1, 20, 20);
    this.primaryDroplets = new THREE.InstancedMesh(primaryGeo, this.dropletMaterial, this.dropletCount);
    this.primaryDroplets.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Color palette for translucent fluid realism
    const dropletColors = [
      new THREE.Color(0x00f0ff), // Luminous cyan
      new THREE.Color(0x0ea5e9), // Deep clinical teal
      new THREE.Color(0x38bdf8), // Sky blue highlight
      new THREE.Color(0x7dd3fc), // Translucent clear aqua
      new THREE.Color(0xa5f3fc)  // Crystalline highlight
    ];

    const mouthOrigin = new THREE.Vector3(0, this.neckMouthY, 0);

    // Generate wide, cinematic 3D explosion trajectories for primary droplets
    for (let i = 0; i < this.dropletCount; i++) {
      // Golden spiral distribution across 3D sphere with energetic full-screen coverage
      const phi = Math.acos(1 - 2 * (i / this.dropletCount)); // 0 to PI
      const theta = Math.PI * (1 + Math.sqrt(5)) * i; // Golden angle

      // Explode outward in every direction across the viewport
      // Wide spread covering screen: left, right, upward, downward, and toward/away from camera
      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi) * 0.9 + 0.18, // slightly biased upward out of bottle mouth
        Math.sin(phi) * Math.sin(theta)
      ).normalize();

      // Varied burst distance (2.4 to 8.5 units to fill entire viewport edge-to-edge)
      const distance = 2.4 + Math.pow(Math.random(), 0.7) * 6.2;
      const targetPos = new THREE.Vector3(
        dir.x * distance * 1.35, // Wider horizontal spread
        this.neckMouthY + dir.y * distance * 1.05,
        dir.z * distance * 1.15  // Deep depth towards and away from camera
      );

      // Droplet radius between 0.045 and 0.165
      const baseRadius = 0.045 + Math.random() * 0.12;
      // Slight aerodynamic elongation along velocity vector (1.05 to 1.38x)
      const elongation = 1.05 + Math.random() * 0.33;

      const baseScale = new THREE.Vector3(
        baseRadius,
        baseRadius * elongation,
        baseRadius
      );

      // Calculate orientation quaternion looking along velocity vector
      const baseQuat = new THREE.Quaternion();
      const up = new THREE.Vector3(0, 1, 0);
      baseQuat.setFromUnitVectors(up, dir);

      // Random spin axis for organic rotation during flight
      const spinAxis = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();

      // Sequential staggered release
      const startP = 0.14 + (i / this.dropletCount) * 0.22; // 0.14 to 0.36
      const endP = Math.min(0.70, startP + 0.28 + Math.random() * 0.08);

      const color = dropletColors[i % dropletColors.length];
      this.primaryDroplets.setColorAt(i, color);

      // Slight origin jitter inside bottle mouth
      const originJitter = new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        this.neckMouthY - Math.random() * 0.2,
        (Math.random() - 0.5) * 0.3
      );

      this.dropletData.push({
        origin: originJitter,
        target: targetPos,
        baseScale: baseScale,
        baseQuat: baseQuat,
        spinAxis: spinAxis,
        spinSpeed: 2.0 + Math.random() * 4.0,
        arcHeight: (Math.random() - 0.3) * 0.4,
        startP: startP,
        endP: endP
      });

      // Initially closed / zero scale
      this.dummy.position.copy(originJitter);
      this.dummy.scale.set(0, 0, 0);
      this.dummy.updateMatrix();
      this.primaryDroplets.setMatrixAt(i, this.dummy.matrix);
    }
    this.primaryDroplets.instanceMatrix.needsUpdate = true;
    if (this.primaryDroplets.instanceColor) {
      this.primaryDroplets.instanceColor.needsUpdate = true;
    }
    this.bottleRoot.add(this.primaryDroplets);

    // 2. Secondary Micro-Droplets InstancedMesh (80 fine sparkling mist droplets)
    const microGeo = new THREE.SphereGeometry(1, 14, 14);
    this.microDroplets = new THREE.InstancedMesh(microGeo, this.microDropletMaterial, this.microDropletCount);
    this.microDroplets.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    for (let j = 0; j < this.microDropletCount; j++) {
      const phi = Math.acos(1 - 2 * (j / this.microDropletCount));
      const theta = Math.PI * (1 + Math.sqrt(5)) * j * 1.5;

      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi) * 0.85 + 0.25,
        Math.sin(phi) * Math.sin(theta)
      ).normalize();

      const distance = 3.0 + Math.random() * 6.5;
      const targetPos = new THREE.Vector3(
        dir.x * distance * 1.4,
        this.neckMouthY + dir.y * distance * 1.1,
        dir.z * distance * 1.2
      );

      const radius = 0.02 + Math.random() * 0.035; // tiny micro-droplets
      const startP = 0.16 + (j / this.microDropletCount) * 0.24;
      const endP = Math.min(0.70, startP + 0.26);

      const originJitter = new THREE.Vector3(
        (Math.random() - 0.5) * 0.35,
        this.neckMouthY - Math.random() * 0.25,
        (Math.random() - 0.5) * 0.35
      );

      this.microDropletData.push({
        origin: originJitter,
        target: targetPos,
        radius: radius,
        arcHeight: (Math.random() - 0.5) * 0.5,
        startP: startP,
        endP: endP
      });

      this.dummy.position.copy(originJitter);
      this.dummy.scale.set(0, 0, 0);
      this.dummy.updateMatrix();
      this.microDroplets.setMatrixAt(j, this.dummy.matrix);
    }
    this.microDroplets.instanceMatrix.needsUpdate = true;
    this.bottleRoot.add(this.microDroplets);
  }

  createLabelTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');

    // High-contrast clean pharmaceutical label backdrop
    ctx.fillStyle = '#09152b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clinical borders
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Teal top brand banner
    ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
    ctx.fillRect(20, 20, canvas.width - 40, 110);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('MEDSOURCE PHARMACEUTICALS', 50, 75);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px "JetBrains Mono", monospace';
    ctx.fillText('INSTITUTIONAL SUPPLY & FORMULATION', 50, 110);

    // Product Name
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 62px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ORAL TONIC ELIXIR', 50, 215);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.fillText('ACTIVE COMPOUND: 150 mg / 5 mL · 150 mL NET', 50, 265);

    // Divider line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 295);
    ctx.lineTo(canvas.width - 50, 295);
    ctx.stroke();

    // Dosage & Specifications
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('USP Standard Hydrolytic Type III Medical Amber Matrix', 50, 340);
    ctx.fillText('Formulated for controlled absorption and continuous release.', 50, 375);

    // Graduation marks on right side of label
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
    ctx.lineWidth = 4;
    const graduations = [
      { y: 640, ml: '25 mL' },
      { y: 580, ml: '50 mL' },
      { y: 520, ml: '75 mL' },
      { y: 460, ml: '100 mL' },
      { y: 400, ml: '125 mL' },
      { y: 340, ml: '150 mL' }
    ];

    graduations.forEach(({ y, ml }) => {
      ctx.beginPath();
      ctx.moveTo(760, y);
      ctx.lineTo(820, y);
      ctx.stroke();

      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 22px "JetBrains Mono", monospace';
      ctx.fillText(ml, 835, y + 7);
    });

    // Simulated Barcode
    ctx.fillStyle = '#ffffff';
    const barStartX = 50;
    const barY = 460;
    const barWidth = 340;
    const barHeight = 85;

    ctx.fillRect(barStartX, barY, barWidth, barHeight);
    ctx.fillStyle = '#09152b';
    for (let b = 0; b < 45; b++) {
      const bw = (b % 4 === 0) ? 5 : (b % 3 === 0) ? 3 : 2;
      const bx = barStartX + 10 + b * 7;
      if (bx < barStartX + barWidth - 10) {
        ctx.fillRect(bx, barY + 5, bw, barHeight - 10);
      }
    }

    ctx.fillStyle = '#64748b';
    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillText('LOT #MS-84920 · EXP 2029-08 · cGMP VERIFIED', 50, 580);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  }

  /**
   * Root-Level Scroll Progress Animation (0.0 to 1.0 within pharmaceutical section)
   * Purely driven by scroll progress. 100% reversible upon reverse scroll.
   * Zero memory allocations: updates pre-allocated buffers and object transforms.
   */
  setExplosion(progress) {
    const p = Math.max(0, Math.min(1, progress));
    this.lastExplosionP = p;

    // ----------------------------------------------------
    // STAGE A & B: SCREW CAP OPENING & UNSCREWING (p: 0.12 -> 0.45)
    // ----------------------------------------------------
    if (p <= 0.12) {
      // Bottle completely closed
      this.capRoot.position.set(0, this.neckMouthY + 0.22, 0);
      this.capRoot.rotation.set(0, 0, 0);
      this.tamperRing.position.set(0, -0.24 - 0.08, 0);
    } else if (p > 0.12 && p <= 0.45) {
      // Unscrew cap: 2 rotations around Y as it rises vertically
      const unscrewT = (p - 0.12) / 0.33; // 0.0 -> 1.0
      const unscrewRotation = -unscrewT * Math.PI * 4; // 2 full rotations
      const capLift = unscrewT * 0.45; // Lifts 0.45 units up neck

      this.capRoot.position.set(0, this.neckMouthY + 0.22 + capLift, 0);
      this.capRoot.rotation.set(0, unscrewRotation, 0);

      // Tamper seal ring breaks and drops slightly onto neck collar
      this.tamperRing.position.set(0, -0.24 - 0.08 - unscrewT * 0.20, 0);
    } else {
      // Cap lifts higher and tilts away gracefully to the right, staying separated
      const floatT = Math.min(1.0, (p - 0.45) / 0.35); // 0.0 -> 1.0
      const capLift = 0.45 + floatT * 0.55; // Total lift ~1.0 units
      const capTiltZ = -floatT * 0.35; // tilt slightly right
      const capTiltX = -floatT * 0.15;

      this.capRoot.position.set(floatT * 0.55, this.neckMouthY + 0.22 + capLift, floatT * 0.10);
      this.capRoot.rotation.set(capTiltX, -Math.PI * 4, capTiltZ);
      this.tamperRing.position.set(0, -0.24 - 0.08 - 0.20, 0);
    }

    // ----------------------------------------------------
    // INTERNAL LIQUID LEVEL DISPLACEMENT
    // ----------------------------------------------------
    if (p <= 0.14) {
      this.liquidMesh.scale.set(1, 1, 1);
      this.liquidMesh.position.y = this.liquidHeight / 2 + 0.1;
      this.meniscusMesh.position.y = this.liquidHeight + 0.1;
    } else {
      const dropT = Math.min(1.0, (p - 0.14) / 0.45);
      const scaleY = 1.0 - dropT * 0.22;
      this.liquidMesh.scale.set(1, scaleY, 1);
      this.liquidMesh.position.y = (this.liquidHeight * scaleY) / 2 + 0.1;
      this.meniscusMesh.position.y = this.liquidHeight * scaleY + 0.1;
    }

    // ----------------------------------------------------
    // LIQUID DROPLETS EXPLOSION (Zero allocations, pure matrix updates)
    // ----------------------------------------------------
    // 1. Primary Droplets (160 instances)
    for (let i = 0; i < this.dropletCount; i++) {
      const d = this.dropletData[i];
      let t = 0;

      if (p <= d.startP) {
        t = 0;
      } else if (p > d.startP && p < d.endP) {
        const rawT = (p - d.startP) / (d.endP - d.startP);
        t = 1 - Math.pow(1 - rawT, 2.5); // Energetic ease-out explosion
      } else if (p >= d.endP && p <= 0.82) {
        t = 1.0; // Full cinematic hero hold across screen
      } else if (p > 0.82 && p <= 0.90) {
        const returnT = (p - 0.82) / 0.08;
        t = 1.0 - returnT; // Smooth symmetrical reassembly into bottle
      } else {
        t = 0;
      }

      if (t <= 0.001) {
        this.dummy.position.copy(d.origin);
        this.dummy.scale.set(0, 0, 0);
      } else {
        // Interpolate along 3D trajectory
        this.dummy.position.lerpVectors(d.origin, d.target, t);
        this.dummy.position.y += Math.sin(t * Math.PI) * d.arcHeight;

        // Rapid initial bead formation upon emergence
        const scaleFactor = Math.min(1.0, t * 3.5);
        this.dummy.scale.set(
          d.baseScale.x * scaleFactor,
          d.baseScale.y * scaleFactor,
          d.baseScale.z * scaleFactor
        );

        // Aerodynamic alignment & continuous organic spin
        this.dummy.quaternion.copy(d.baseQuat);
        this.dummy.rotateOnAxis(d.spinAxis, t * d.spinSpeed);
      }

      this.dummy.updateMatrix();
      this.primaryDroplets.setMatrixAt(i, this.dummy.matrix);
    }
    this.primaryDroplets.instanceMatrix.needsUpdate = true;

    // 2. Secondary Micro-Droplets (80 instances)
    for (let j = 0; j < this.microDropletCount; j++) {
      const md = this.microDropletData[j];
      let t = 0;

      if (p <= md.startP) {
        t = 0;
      } else if (p > md.startP && p < md.endP) {
        const rawT = (p - md.startP) / (md.endP - md.startP);
        t = 1 - Math.pow(1 - rawT, 2.2);
      } else if (p >= md.endP && p <= 0.82) {
        t = 1.0;
      } else if (p > 0.82 && p <= 0.90) {
        const returnT = (p - 0.82) / 0.08;
        t = 1.0 - returnT;
      } else {
        t = 0;
      }

      if (t <= 0.001) {
        this.dummy.position.copy(md.origin);
        this.dummy.scale.set(0, 0, 0);
      } else {
        this.dummy.position.lerpVectors(md.origin, md.target, t);
        this.dummy.position.y += Math.sin(t * Math.PI) * md.arcHeight;

        const scaleFactor = Math.min(1.0, t * 4.0);
        this.dummy.scale.set(
          md.radius * scaleFactor,
          md.radius * scaleFactor,
          md.radius * scaleFactor
        );
      }

      this.dummy.updateMatrix();
      this.microDroplets.setMatrixAt(j, this.dummy.matrix);
    }
    this.microDroplets.instanceMatrix.needsUpdate = true;

    // Subtle dynamic rotation of whole bottle composition for 3D inspection
    this.bottleRoot.rotation.y = 0.25 + p * 0.55;
    this.bottleRoot.rotation.x = 0.08 + p * 0.06;
  }

  update(time) {
    // Subtle idle fluid shimmer & floating drift when exploded
    if (this.lastExplosionP > 0.25 && this.lastExplosionP <= 0.85) {
      this.bottleRoot.position.y = -1.9 + Math.sin(time * 1.8) * 0.03;
    }

    // Subtle floating breath of whole bottle
    this.group.position.y += Math.sin(time * 1.4) * 0.0008;
  }
}
