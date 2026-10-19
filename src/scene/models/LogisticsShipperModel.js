import * as THREE from 'three';
import { createCargoLabelTexture } from '../textures/TextureGenerators';

/**
 * Photorealistic 3D Pharmaceutical Cold-Chain Logistics Shipper
 * Substantial Component-Level Exploded Container Reveal:
 * 1. Heavy-Duty Insulated Container Lid with Latches (lifts high +Y)
 * 2. 4 Outer Composite Shipper Crate Walls (separate in 4 cardinal directions)
 * 3. 4 Vacuum Insulated Panels (VIP) with Reflective Barrier Film (slide outward)
 * 4. Internal Polyurethane Payload Core & Elevated Tray (rises +Y out of crate)
 * 5. Digital Cold-Chain Temperature Data Logger with Active LCD Display (lifts & floats forward)
 * 6. Broad 3D Array of 12 Pharmaceutical Vaccine Vials (spreads in a wide, elegant multi-tiered constellation)
 * 7. Luminous Translucent Thermal Envelope & Isothermal Contour Rings (visualizing +2°C to +8°C protection)
 */
const SHIPPER_WIDTH = 3.6;
const SHIPPER_HEIGHT = 2.5;
const SHIPPER_DEPTH = 3.2;

export class LogisticsShipperModel {
  constructor() {
    this.group = new THREE.Group();
    this.vials = [];
    this.vialRestPos = [];
    this.vialExplodePos = [];
    this.init();
  }

  init() {
    const width = SHIPPER_WIDTH;
    const height = SHIPPER_HEIGHT;
    const depth = SHIPPER_DEPTH;

    // ----------------------------------------------------
    // MATERIALS
    // ----------------------------------------------------
    const crateMat = new THREE.MeshStandardMaterial({
      color: 0x091e36, // Deep clinical cargo navy
      roughness: 0.35,
      metalness: 0.18
    });

    const bumperMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.28,
      metalness: 0.75
    });

    const vipFoilMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Silver vacuum insulation barrier film
      metalness: 0.92,
      roughness: 0.15
    });

    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.42,
      metalness: 0.05
    });

    const medicalWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.28,
      metalness: 0.08
    });

    const amberGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xd97706, // Amber USP Type I borosilicate glass
      roughness: 0.08,
      metalness: 0.05,
      transmission: 0.78,
      thickness: 0.6,
      ior: 1.52,
      transparent: true,
      opacity: 0.88,
      clearcoat: 1.0
    });

    const clearGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff, // Crystalline sterile borosilicate
      roughness: 0.06,
      metalness: 0.02,
      transmission: 0.90,
      thickness: 0.5,
      ior: 1.51,
      transparent: true,
      opacity: 0.82,
      clearcoat: 1.0
    });

    const tealCapMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.25,
      metalness: 0.15
    });

    const cyanCapMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      roughness: 0.22,
      metalness: 0.2
    });

    // ----------------------------------------------------
    // 1. CONTAINER CRATE BASE FLOOR & CORNER BUMPERS
    // ----------------------------------------------------
    this.crateBaseGroup = new THREE.Group();

    // Floor base tray
    const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(width, 0.35, depth), crateMat);
    floorMesh.position.y = -height / 2;
    floorMesh.castShadow = true;
    floorMesh.receiveShadow = true;
    this.crateBaseGroup.add(floorMesh);

    // Bottom corner bumpers
    [
      [-width / 2, -height / 2, -depth / 2],
      [width / 2, -height / 2, -depth / 2],
      [-width / 2, -height / 2, depth / 2],
      [width / 2, -height / 2, depth / 2]
    ].forEach(([cx, cy, cz]) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.38), bumperMat);
      b.position.set(cx, cy, cz);
      this.crateBaseGroup.add(b);
    });

    this.group.add(this.crateBaseGroup);

    // ----------------------------------------------------
    // 2. 4 SEPARABLE CRATE WALLS (Disperse in 4 cardinal directions)
    // ----------------------------------------------------
    this.wallsGroup = new THREE.Group();

    // Front Wall with Cargo Placard Label (+Z)
    this.wallFront = new THREE.Group();
    const frontPanel = new THREE.Mesh(new THREE.BoxGeometry(width, height * 0.82, 0.16), crateMat);
    frontPanel.position.set(0, -height * 0.05, depth / 2 - 0.08);
    this.wallFront.add(frontPanel);

    const labelTex = createCargoLabelTexture();
    const labelMat = new THREE.MeshStandardMaterial({ map: labelTex, roughness: 0.3 });
    const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.9), labelMat);
    labelMesh.position.set(0, -height * 0.05, depth / 2 + 0.01);
    this.wallFront.add(labelMesh);
    this.wallsGroup.add(this.wallFront);

    // Back Wall (-Z)
    this.wallBack = new THREE.Mesh(new THREE.BoxGeometry(width, height * 0.82, 0.16), crateMat);
    this.wallBack.position.set(0, -height * 0.05, -depth / 2 + 0.08);
    this.wallsGroup.add(this.wallBack);

    // Left Wall (-X)
    this.wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.16, height * 0.82, depth - 0.32), crateMat);
    this.wallLeft.position.set(-width / 2 + 0.08, -height * 0.05, 0);
    this.wallsGroup.add(this.wallLeft);

    // Right Wall (+X)
    this.wallRight = new THREE.Mesh(new THREE.BoxGeometry(0.16, height * 0.82, depth - 0.32), crateMat);
    this.wallRight.position.set(width / 2 - 0.08, -height * 0.05, 0);
    this.wallsGroup.add(this.wallRight);

    this.group.add(this.wallsGroup);

    // ----------------------------------------------------
    // 3. 4 VACUUM INSULATED PANELS (VIP) (Slide outward beyond walls)
    // ----------------------------------------------------
    this.vipGroup = new THREE.Group();

    // VIP Front & Back
    const vipFBGeo = new THREE.BoxGeometry(width * 0.85, height * 0.72, 0.1);
    this.vipFront = new THREE.Mesh(vipFBGeo, vipFoilMat);
    this.vipFront.position.set(0, -height * 0.05, depth * 0.36);

    this.vipBack = new THREE.Mesh(vipFBGeo, vipFoilMat);
    this.vipBack.position.set(0, -height * 0.05, -depth * 0.36);

    // VIP Left & Right
    const vipLRGeo = new THREE.BoxGeometry(0.1, height * 0.72, depth * 0.75);
    this.vipLeft = new THREE.Mesh(vipLRGeo, vipFoilMat);
    this.vipLeft.position.set(-width * 0.39, -height * 0.05, 0);

    this.vipRight = new THREE.Mesh(vipLRGeo, vipFoilMat);
    this.vipRight.position.set(width * 0.39, -height * 0.05, 0);

    this.vipGroup.add(this.vipFront, this.vipBack, this.vipLeft, this.vipRight);
    this.group.add(this.vipGroup);

    // ----------------------------------------------------
    // 4. HEAVY INSULATED CONTAINER LID (+Y)
    // ----------------------------------------------------
    this.lidGroup = new THREE.Group();
    this.lidGroup.position.set(0, height / 2 + 0.12, 0);

    const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(width * 1.02, 0.42, depth * 1.02), crateMat);
    lidMesh.castShadow = true;
    this.lidGroup.add(lidMesh);

    // Tension Latches & Hinges
    [-1.2, 1.2].forEach((lx) => {
      const latch = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.32, 0.09), bumperMat);
      latch.position.set(lx, -0.12, depth / 2 + 0.04);
      this.lidGroup.add(latch);
    });

    this.group.add(this.lidGroup);

    // ----------------------------------------------------
    // 5. INTERNAL POLYURETHANE PAYLOAD CORE & ELEVATED TRAY
    // ----------------------------------------------------
    this.payloadGroup = new THREE.Group();
    this.payloadGroup.position.set(0, -height * 0.06, 0);

    // Internal insulated chamber box
    const chamberGeo = new THREE.BoxGeometry(2.4, 1.4, 2.0);
    const chamberMesh = new THREE.Mesh(chamberGeo, coreMat);
    chamberMesh.position.y = -0.25;
    chamberMesh.castShadow = true;
    this.payloadGroup.add(chamberMesh);

    // Clinical Blue Tamper Sealing Band
    const sealBandMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.3 });
    const sealBand = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.1, 2.02), sealBandMat);
    sealBand.position.y = 0.42;
    this.payloadGroup.add(sealBand);

    // Internal Acrylic Payload Vials Rack / Tray
    const rackMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      roughness: 0.15,
      transparent: true,
      opacity: 0.75
    });
    const trayRack = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.15, 1.8), rackMat);
    trayRack.position.y = 0.48;
    this.payloadGroup.add(trayRack);

    this.group.add(this.payloadGroup);

    // ----------------------------------------------------
    // 6. DIGITAL TEMPERATURE DATA LOGGER (Sensitech / TempTale style)
    // ----------------------------------------------------
    this.dataLoggerGroup = new THREE.Group();
    this.dataLoggerGroup.position.set(0.65, 0.65, 0.7);

    // Logger polymer housing
    const loggerBody = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.1, 0.18), medicalWhiteMat);
    this.dataLoggerGroup.add(loggerBody);

    // USB Cap at bottom
    const usbCap = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.19), tealCapMat);
    usbCap.position.y = -0.62;
    this.dataLoggerGroup.add(usbCap);

    // High-Contrast Active LCD Display Texture
    const loggerTex = this.createLoggerTexture();
    const loggerScreenMat = new THREE.MeshBasicMaterial({ map: loggerTex });
    const loggerScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.78), loggerScreenMat);
    loggerScreen.position.set(0, 0.08, 0.1);
    this.dataLoggerGroup.add(loggerScreen);

    // Status Indicator LED (Luminous Green)
    const loggerLed = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    loggerLed.position.set(0.24, 0.42, 0.1);
    this.dataLoggerGroup.add(loggerLed);

    this.payloadGroup.add(this.dataLoggerGroup);

    // ----------------------------------------------------
    // 7. BROAD 3D ARRAY OF 12 PHARMACEUTICAL VACCINE VIALS
    // ----------------------------------------------------
    this.vialsGroup = new THREE.Group();
    this.vialsGroup.position.set(0, 0.55, 0);

    const rows = 3;
    const cols = 4;
    let vialIdx = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const vx = (c - 1.5) * 0.52;
        const vz = (r - 1.0) * 0.55;

        const vial = new THREE.Group();

        // Alternating Amber and Clear borosilicate glass vials
        const isAmber = (r + c) % 2 === 0;
        const vGlass = isAmber ? amberGlassMat : clearGlassMat;

        // Vial cylinder body
        const vialBody = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.68, 24), vGlass);
        vialBody.position.y = 0.34;
        vialBody.castShadow = true;
        vial.add(vialBody);

        // Aluminum crimp collar
        const crimp = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.14, 20), bumperMat);
        crimp.position.y = 0.74;
        vial.add(crimp);

        // Clinical flip-off cap button (Teal or Cyan)
        const vCapMat = (c % 2 === 0) ? tealCapMat : cyanCapMat;
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.155, 0.06, 20), vCapMat);
        cap.position.y = 0.83;
        vial.add(cap);

        // Liquid volume inside vial
        const liqMat = new THREE.MeshBasicMaterial({
          color: isAmber ? 0xf59e0b : 0x00f0ff,
          transparent: true,
          opacity: 0.65
        });
        const liq = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.45, 16), liqMat);
        liq.position.y = 0.25;
        vial.add(liq);

        vial.position.set(vx, 0, vz);
        this.vialsGroup.add(vial);

        this.vials.push(vial);
        this.vialRestPos.push(new THREE.Vector3(vx, 0, vz));

        // Broad, cinematic tiered exploded constellation
        const spreadAngle = (vialIdx / 12) * Math.PI * 2;
        const spreadR = 1.35 + (vialIdx % 3) * 0.65;
        const explodeY = 0.8 + (vialIdx % 4) * 0.42;
        const explodeX = Math.cos(spreadAngle) * spreadR * 1.3;
        const explodeZ = Math.sin(spreadAngle) * spreadR * 0.95;

        this.vialExplodePos.push(new THREE.Vector3(explodeX, explodeY, explodeZ));
        vialIdx++;
      }
    }
    this.payloadGroup.add(this.vialsGroup);

    // ----------------------------------------------------
    // 8. LUMINOUS TRANSLUCENT THERMAL ENVELOPE
    // ----------------------------------------------------
    this.thermalGroup = new THREE.Group();
    this.thermalGroup.position.set(0, 0.8, 0);

    // Rounded isothermal protection dome
    const thermalGeo = new THREE.CylinderGeometry(1.9, 1.9, 1.8, 32, 1, true);
    const thermalMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      transmission: 0.88,
      roughness: 0.1,
      ior: 1.25,
      transparent: true,
      opacity: 0.0,
      clearcoat: 1.0,
      side: THREE.DoubleSide
    });
    this.thermalMesh = new THREE.Mesh(thermalGeo, thermalMat);
    this.thermalGroup.add(this.thermalMesh);

    // Concentric Temperature Wave Rings (+2°C to +8°C barrier markers)
    this.tempRings = [];
    [-0.7, 0, 0.7].forEach((ry) => {
      const ringGeo = new THREE.TorusGeometry(1.92, 0.025, 16, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.0
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = ry;
      this.thermalGroup.add(ring);
      this.tempRings.push(ring);
    });

    this.payloadGroup.add(this.thermalGroup);

    // Initial neutral pose
    this.group.rotation.set(0.18, -0.38, 0.08);
    this.group.position.set(2.2, -0.3, 0);
  }

  createLoggerTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');

    // LCD Background
    ctx.fillStyle = '#0a192f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Header
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 32px "JetBrains Mono", monospace';
    ctx.fillText('COLD-CHAIN LOG', 35, 65);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillText('STATUS: OK [✓]', 35, 105);

    // Big Temperature Readout
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 84px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('+4.2°C', 35, 215);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillText('RANGE: +2.0°C to +8.0°C', 35, 275);

    // Stats
    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px "JetBrains Mono", monospace';
    ctx.fillText('MKT: 4.8°C · HIGH: 5.1°C', 35, 345);
    ctx.fillText('LOW: 3.8°C · SAMPLES: 2,410', 35, 385);
    ctx.fillText('BATTERY: 100% · NIST CAL', 35, 425);

    // Mini Temperature Curve
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(35, 540);
    ctx.bezierCurveTo(120, 520, 240, 560, 360, 530);
    ctx.lineTo(470, 535);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillText('USP/WHO GMP QUALIFIED LOGGER', 35, 600);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    return texture;
  }

  /**
   * Substantial, component-level cold-chain container reveal
   */
  setExplosion(progress) {
    const p = Math.max(0, Math.min(1, progress));
    const width = SHIPPER_WIDTH;
    const height = SHIPPER_HEIGHT;
    const depth = SHIPPER_DEPTH;

    // 1. Heavy Insulated Container Lid lifts high and tilts back
    this.lidGroup.position.y = 1.4 + p * 2.85;
    this.lidGroup.rotation.x = -p * 0.35;
    this.lidGroup.rotation.y = p * 0.15;

    // 2. Base tray drops slightly
    this.crateBaseGroup.position.y = -p * 0.45;

    // 3. 4 Crate Walls separate in 4 cardinal directions
    this.wallFront.position.z = p * 1.65;
    this.wallFront.rotation.x = p * 0.18;

    this.wallBack.position.z = -depth / 2 + 0.08 - p * 1.65;
    this.wallBack.rotation.x = -p * 0.18;

    this.wallLeft.position.x = -width / 2 + 0.08 - p * 1.85;
    this.wallLeft.rotation.z = p * 0.18;

    this.wallRight.position.x = width / 2 - 0.08 + p * 1.85;
    this.wallRight.rotation.z = -p * 0.18;

    // 4. 4 Vacuum Insulated Panels (VIP) slide outward further
    this.vipFront.position.z = depth * 0.36 + p * 2.15;
    this.vipBack.position.z = -depth * 0.36 - p * 2.15;
    this.vipLeft.position.x = -width * 0.39 - p * 2.35;
    this.vipRight.position.x = width * 0.39 + p * 2.35;

    // 5. Internal Payload Core & Chamber elevates high above crate
    this.payloadGroup.position.y = -0.15 + p * 1.85;
    this.payloadGroup.rotation.y = p * 0.2;

    // 6. Digital Data Logger lifts out and rotates towards camera
    this.dataLoggerGroup.position.x = 0.65 + p * 1.45;
    this.dataLoggerGroup.position.y = 0.65 + p * 1.75;
    this.dataLoggerGroup.position.z = 0.7 + p * 1.35;
    this.dataLoggerGroup.rotation.y = p * 0.45;
    this.dataLoggerGroup.rotation.x = -p * 0.22;

    // 7. Broad 3D Array of 12 Vials elevates and fans out into wide constellation
    for (let i = 0; i < this.vials.length; i++) {
      const v = this.vials[i];
      const rest = this.vialRestPos[i];
      const target = this.vialExplodePos[i];

      // Smooth interpolation from tray into 3D constellation
      v.position.lerpVectors(rest, target, p);
      v.rotation.y = p * (0.4 + (i % 3) * 0.3);
      v.rotation.x = Math.sin(p * Math.PI * 0.5) * ((i % 2 === 0 ? 0.15 : -0.15));
    }

    // 8. Luminous Thermal Envelope & Isothermal Rings activate
    const envOpacity = Math.max(0, Math.min(0.75, (p - 0.22) * 2.2));
    this.thermalMesh.material.opacity = envOpacity;
    this.tempRings.forEach((ring) => {
      ring.material.opacity = envOpacity * 0.95;
    });

    const envScale = Math.min(1.0, p * 1.45);
    this.thermalGroup.scale.set(envScale, envScale, envScale);

    // Whole composition subtle dynamic inspection rotation
    this.group.rotation.y = -0.38 + p * 0.68;
    this.group.rotation.x = 0.18 + p * 0.08;
  }

  update(time) {
    this.group.position.y += Math.sin(time * 1.3 + 4.0) * 0.0008;

    // Subtle thermal wave pulsation when active
    if (this.thermalMesh && this.thermalMesh.material.opacity > 0.05) {
      this.thermalMesh.material.opacity = 0.55 + Math.sin(time * 2.5) * 0.12;
      this.tempRings.forEach((ring, idx) => {
        ring.rotation.z = time * 0.3 * (idx % 2 === 0 ? 1 : -1);
      });
    }
  }
}
