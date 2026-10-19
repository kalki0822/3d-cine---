import * as THREE from 'three';

/**
 * Photorealistic 3D Multiparameter Patient Telemetry Monitor
 * Detailed Professional Product Teardown:
 * 1. Articulated Mounting Stand & Pivot Arm (drops -Y)
 * 2. Rear ABS Enclosure with Carry Handle, Cooling Louvers & I/O Plate (separates -Z)
 * 3. Power Supply Module, Cooling Blower & Aluminum Heatsink Unit (slides +X, -Z)
 * 4. Multi-Layer Green PCB Motherboard with AFE Telemetry Chip & EMI Shield Can (center layer -Z)
 * 5. Flexible Internal Data Ribbon Bus (unfolds between PCB and LCD)
 * 6. High-Definition LCD Display Panel with Active 60fps ECG Telemetry (steps +Z)
 * 7. Outer Structural Bezel Frame with Dual-Tone Alarm LED Bar (steps ++Z)
 * 8. Rotary Optical Encoder Knob & Keypad Controls Array (separates +X, ++Z)
 * 9. Holographic 3D Telemetry Waveforms extending outward into the viewport
 */
const MONITOR_WIDTH = 5.0;
const MONITOR_HEIGHT = 3.7;
const MONITOR_DEPTH = 1.1;

export class PatientMonitorModel {
  constructor(dynamicEcgScreen) {
    this.dynamicEcgScreen = dynamicEcgScreen;
    this.group = new THREE.Group();
    this.waveformCurves = [];
    this.init();
  }

  init() {
    const width = MONITOR_WIDTH;
    const height = MONITOR_HEIGHT;
    const depth = MONITOR_DEPTH;

    // ----------------------------------------------------
    // MATERIALS
    // ----------------------------------------------------
    const medicalWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.28,
      metalness: 0.08
    });

    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x091224,
      roughness: 0.25,
      metalness: 0.35
    });

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.28,
      metalness: 0.85
    });

    const silverMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.92
    });

    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b, // Medical green multi-layer substrate
      roughness: 0.38,
      metalness: 0.22
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.95
    });

    const chipMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.5
    });

    const copperRibbonMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.35,
      metalness: 0.8,
      side: THREE.DoubleSide
    });

    // ----------------------------------------------------
    // 1. ARTICULATED MOUNTING STAND (-Y)
    // ----------------------------------------------------
    this.standGroup = new THREE.Group();

    // Heavy weighted cast medical base plate
    const basePlate = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.22, 2.8), medicalWhiteMat);
    basePlate.position.set(0, -height / 2 - 0.75, 0);
    basePlate.castShadow = true;
    basePlate.receiveShadow = true;
    this.standGroup.add(basePlate);

    // Rubber anti-vibration foot pads
    const footMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    [[-1.6, -1.2], [1.6, -1.2], [-1.6, 1.2], [1.6, 1.2]].forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16), footMat);
      foot.position.set(fx, -height / 2 - 0.88, fz);
      this.standGroup.add(foot);
    });

    // Vertical articulated post
    const standPost = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.32, 0.85, 24), silverMat);
    standPost.position.set(0, -height / 2 - 0.35, -0.15);
    this.standGroup.add(standPost);

    // Quick-release monitor tilt gimbal joint
    const gimbal = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.6), darkMetalMat);
    gimbal.position.set(0, -height / 2 - 0.05, -0.2);
    this.standGroup.add(gimbal);

    this.group.add(this.standGroup);

    // ----------------------------------------------------
    // 2. REAR HOUSING ASSEMBLY (-Z)
    // ----------------------------------------------------
    this.rearHousingGroup = new THREE.Group();

    // Main rear shell
    const rearShell = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth * 0.55), medicalWhiteMat);
    rearShell.position.z = -depth * 0.38;
    rearShell.castShadow = true;
    rearShell.receiveShadow = true;
    this.rearHousingGroup.add(rearShell);

    // Top integrated carry handle
    const handleBar = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.28, 0.38), medicalWhiteMat);
    handleBar.position.set(0, height / 2 + 0.32, -depth * 0.38);
    const handleStemL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.42, 0.38), medicalWhiteMat);
    handleStemL.position.set(-1.15, height / 2 + 0.14, -depth * 0.38);
    const handleStemR = handleStemL.clone();
    handleStemR.position.set(1.15, height / 2 + 0.14, -depth * 0.38);
    this.rearHousingGroup.add(handleBar, handleStemL, handleStemR);

    // Rear cooling vent louvers
    for (let i = 0; i < 7; i++) {
      const louver = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 0.06), darkMetalMat);
      louver.position.set(0, height * 0.16 - i * 0.22, -depth * 0.66);
      this.rearHousingGroup.add(louver);
    }

    // Rear I/O connectivity terminal panel
    const ioPanel = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.9, 0.08), darkMetalMat);
    ioPanel.position.set(-1.1, -height * 0.25, -depth * 0.66);
    this.rearHousingGroup.add(ioPanel);

    // Gold/Silver interface connectors (Ethernet, Nurse Call, Defib Sync, DVI)
    [-0.5, -0.15, 0.2, 0.55].forEach((px, idx) => {
      const conn = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 0.14, 16),
        idx % 2 === 0 ? goldMat : silverMat
      );
      conn.rotation.x = Math.PI / 2;
      conn.position.set(-1.1 + px, -height * 0.25, -depth * 0.7);
      this.rearHousingGroup.add(conn);
    });

    this.group.add(this.rearHousingGroup);

    // ----------------------------------------------------
    // 3. POWER SUPPLY & COOLING UNIT (+X, -Z)
    // ----------------------------------------------------
    this.coolingGroup = new THREE.Group();

    // Isolated internal power supply sub-chassis
    const psuCase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 0.45), darkMetalMat);
    psuCase.position.set(1.4, -0.4, -0.05);
    this.coolingGroup.add(psuCase);

    // High-performance extruded aluminum heatsink fin stack
    for (let f = 0; f < 8; f++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.4, 0.48), silverMat);
      fin.position.set(0.85 + f * 0.14, 0.65, -0.05);
      this.coolingGroup.add(fin);
    }

    // Dual mini centrifugal cooling fan blowers
    const fanCylGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.22, 24);
    [-0.2, 0.7].forEach((fy) => {
      const fanBlower = new THREE.Mesh(fanCylGeo, chipMat);
      fanBlower.rotation.x = Math.PI / 2;
      fanBlower.position.set(1.8, fy, 0.02);
      this.coolingGroup.add(fanBlower);
    });

    this.group.add(this.coolingGroup);

    // ----------------------------------------------------
    // 4. MULTI-LAYER PCB MOTHERBOARD & AFE PROCESSOR (Center Layer)
    // ----------------------------------------------------
    this.circuitGroup = new THREE.Group();

    // Main multi-layer motherboard substrate
    const pcbGeo = new THREE.BoxGeometry(width * 0.88, height * 0.84, 0.07);
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    this.circuitGroup.add(pcbMesh);

    // Gold edge fingers and bus rails
    const goldRailGeo = new THREE.BoxGeometry(width * 0.82, 0.1, 0.08);
    const goldRail = new THREE.Mesh(goldRailGeo, goldMat);
    goldRail.position.set(0, -height * 0.38, 0.01);
    this.circuitGroup.add(goldRail);

    // Main central BGA digital signal processor chip
    const dspChip = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.14), chipMat);
    dspChip.position.set(-0.8, 0.2, 0.08);
    this.circuitGroup.add(dspChip);

    // Shiny metallic chip die center
    const die = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.16), silverMat);
    die.position.set(-0.8, 0.2, 0.08);
    this.circuitGroup.add(die);

    // Perforated EMI isolation shield can
    const shieldCan = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 0.28), silverMat);
    shieldCan.position.set(0.6, -0.2, 0.16);
    this.circuitGroup.add(shieldCan);

    // Solid-state electrolytic capacitor bank
    const capGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.38, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.25 });
    for (let c = 0; c < 6; c++) {
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(-1.6 + (c % 3) * 0.35, 0.8 - Math.floor(c / 3) * 0.45, 0.18);
      this.circuitGroup.add(cap);
    }

    // Micro surface-mount capacitors and resistors (array of tiny components)
    const smdMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
    for (let s = 0; s < 18; s++) {
      const smd = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.06), smdMat);
      smd.position.set(-0.2 + (s % 6) * 0.15, -0.6 - Math.floor(s / 6) * 0.15, 0.06);
      this.circuitGroup.add(smd);
    }

    this.group.add(this.circuitGroup);

    // ----------------------------------------------------
    // 5. FLEXIBLE DATA RIBBON BUS
    // ----------------------------------------------------
    this.ribbonGroup = new THREE.Group();
    const ribbonGeo = new THREE.BoxGeometry(1.2, 0.65, 0.02);
    const ribbonMesh = new THREE.Mesh(ribbonGeo, copperRibbonMat);
    ribbonMesh.position.set(-0.4, -0.3, 0.35);
    this.ribbonGroup.add(ribbonMesh);
    this.group.add(this.ribbonGroup);

    // ----------------------------------------------------
    // 6. HIGH-DEFINITION LCD PANEL (+Z)
    // ----------------------------------------------------
    this.displayGroup = new THREE.Group();

    // Aluminum LCD backing tray
    const lcdTray = new THREE.Mesh(new THREE.BoxGeometry(4.0, 3.2, 0.08), silverMat);
    lcdTray.position.set(-0.35, 0, 0);
    this.displayGroup.add(lcdTray);

    // Active Dynamic Telemetry Screen Plane
    const screenWidth = 3.9;
    const screenHeight = 3.1;
    const screenGeo = new THREE.PlaneGeometry(screenWidth, screenHeight);
    const screenMat = new THREE.MeshBasicMaterial({
      map: this.dynamicEcgScreen.texture
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(-0.35, 0, 0.05);
    this.displayGroup.add(screenMesh);

    this.group.add(this.displayGroup);

    // ----------------------------------------------------
    // 7. FRONT BEZEL FRAME (++Z)
    // ----------------------------------------------------
    this.bezelGroup = new THREE.Group();

    // Top bezel bar with alarm light
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(width, 0.36, 0.14), bezelMat);
    topBar.position.set(0, height / 2 - 0.18, 0);
    this.bezelGroup.add(topBar);

    // Dual-tone Clinical Alarm LED light bar across top
    const alarmLedMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const alarmBar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.04), alarmLedMat);
    alarmBar.position.set(0, height / 2 - 0.12, 0.08);
    this.bezelGroup.add(alarmBar);

    // Bottom bezel bar
    const btmBar = new THREE.Mesh(new THREE.BoxGeometry(width, 0.36, 0.14), bezelMat);
    btmBar.position.set(0, -height / 2 + 0.18, 0);
    this.bezelGroup.add(btmBar);

    // Left bezel bar
    const leftBar = new THREE.Mesh(new THREE.BoxGeometry(0.36, height - 0.72, 0.14), bezelMat);
    leftBar.position.set(-width / 2 + 0.18, 0, 0);
    this.bezelGroup.add(leftBar);

    // Right control panel frame
    const rightStripWidth = width - screenWidth - 0.35;
    const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(rightStripWidth, height - 0.72, 0.14), bezelMat);
    rightFrame.position.set(width / 2 - rightStripWidth / 2, 0, 0);
    this.bezelGroup.add(rightFrame);

    this.group.add(this.bezelGroup);

    // ----------------------------------------------------
    // 8. ROTARY ENCODER & SOFT-TOUCH BUTTON CONTROLS (+X, ++Z)
    // ----------------------------------------------------
    this.controlsGroup = new THREE.Group();
    const ctrlX = width / 2 - rightStripWidth / 2;

    // Optical encoder rotary dial
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.85, roughness: 0.18 });
    const knobGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.32, 32);
    this.knob = new THREE.Mesh(knobGeo, knobMat);
    this.knob.rotation.x = Math.PI / 2;
    this.knob.position.set(ctrlX, -height / 2 + 0.8, 0.22);
    this.controlsGroup.add(this.knob);

    // Knurled grip ring on knob
    const knobRing = new THREE.Mesh(new THREE.TorusGeometry(0.285, 0.03, 16, 32), silverMat);
    knobRing.position.set(ctrlX, -height / 2 + 0.8, 0.35);
    this.controlsGroup.add(knobRing);

    // 5 Tactile soft-touch silicone buttons
    this.buttons = [];
    const keyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35 });
    for (let k = 0; k < 5; k++) {
      const keyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.22, 0.12), keyMat);
      keyMesh.position.set(ctrlX, -height / 2 + 1.35 + k * 0.36, 0.14);
      this.controlsGroup.add(keyMesh);
      this.buttons.push(keyMesh);
    }

    this.group.add(this.controlsGroup);

    // ----------------------------------------------------
    // 9. HOLOGRAPHIC 3D TELEMETRY WAVEFORMS (Spread around viewport)
    // ----------------------------------------------------
    this.waveGroup = new THREE.Group();

    // A. 3D ECG Lead II Ribbon Waveform
    const ecgPoints = [];
    const segments = 90;
    for (let s = 0; s <= segments; s++) {
      const x = -3.2 + (s / segments) * 6.4;
      let y = 0;
      const mod = s % 18;
      if (mod === 4) y = 0.22;
      else if (mod === 5) y = -0.35;
      else if (mod === 6) y = 1.15; // R peak
      else if (mod === 7) y = -0.45; // S wave
      else if (mod === 10) y = 0.28; // T wave
      const z = Math.sin(s * 0.15) * 0.4;
      ecgPoints.push(new THREE.Vector3(x, y, z));
    }
    const ecgCurve = new THREE.CatmullRomCurve3(ecgPoints);
    const ecgGeo = new THREE.TubeGeometry(ecgCurve, 80, 0.045, 8, false);
    const ecgMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.0
    });
    this.ecgWaveMesh = new THREE.Mesh(ecgGeo, ecgMat);
    this.ecgWaveMesh.position.set(0, 2.2, 1.2);
    this.waveGroup.add(this.ecgWaveMesh);

    // B. Plethysmogram / SpO2 Pulse Waveform
    const plethPoints = [];
    for (let p = 0; p <= 80; p++) {
      const x = -3.0 + (p / 80) * 6.0;
      const t = (p % 16) / 16;
      const y = Math.sin(t * Math.PI) * 0.65 + (t > 0.4 ? Math.sin((t - 0.4) * Math.PI * 2) * 0.18 : 0);
      const z = Math.cos(p * 0.12) * 0.35;
      plethPoints.push(new THREE.Vector3(x, y, z));
    }
    const plethCurve = new THREE.CatmullRomCurve3(plethPoints);
    const plethGeo = new THREE.TubeGeometry(plethCurve, 70, 0.04, 8, false);
    const plethMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.0
    });
    this.plethWaveMesh = new THREE.Mesh(plethGeo, plethMat);
    this.plethWaveMesh.position.set(0, -2.1, 1.5);
    this.waveGroup.add(this.plethWaveMesh);

    this.group.add(this.waveGroup);

    // Initial neutral pose
    this.group.rotation.set(0.12, -0.32, 0.04);
    this.group.position.set(2.2, 0, 0);
  }

  /**
   * Substantial, component-level product teardown driven directly by scroll progress
   * 100% reversible on upward scroll. Zero heap allocations.
   */
  setExplosion(progress) {
    const p = Math.max(0, Math.min(1, progress));
    const width = MONITOR_WIDTH;
    const height = MONITOR_HEIGHT;
    const depth = MONITOR_DEPTH;

    // 1. Articulated Mounting Stand drops down and rotates outward
    this.standGroup.position.y = -p * 1.85;
    this.standGroup.position.z = -p * 0.6;
    this.standGroup.rotation.x = -p * 0.22;

    // 2. Rear Enclosure slides far back along -Z and tilts slightly
    this.rearHousingGroup.position.z = -depth * 0.38 - p * 2.6;
    this.rearHousingGroup.position.x = p * 0.5;
    this.rearHousingGroup.rotation.y = -p * 0.25;

    // 3. Power Supply & Cooling Fan Unit slides to the right (+X, -Z)
    this.coolingGroup.position.x = p * 1.55;
    this.coolingGroup.position.z = -p * 1.1;
    this.coolingGroup.position.y = -p * 0.35;
    this.coolingGroup.rotation.y = p * 0.3;

    // 4. Multi-Layer Green PCB Motherboard slides left and rotates for inspection
    this.circuitGroup.position.x = -p * 0.95;
    this.circuitGroup.position.z = -0.05 - p * 0.45;
    this.circuitGroup.rotation.y = -p * 0.35;

    // 5. Copper Data Ribbon stretches between PCB and LCD
    this.ribbonGroup.position.z = 0.35 + p * 0.4;
    this.ribbonGroup.position.x = -p * 0.45;
    this.ribbonGroup.scale.z = 1.0 + p * 2.2;

    // 6. LCD Display Panel steps forward (+Z) and holds clear center stage
    this.displayGroup.position.z = depth * 0.15 + p * 1.45;
    this.displayGroup.position.x = -p * 0.25;
    this.displayGroup.rotation.y = p * 0.12;

    // 7. Outer Front Bezel Frame steps far forward (++Z) and glides upward
    this.bezelGroup.position.z = depth * 0.25 + p * 2.85;
    this.bezelGroup.position.x = p * 0.45;
    this.bezelGroup.position.y = p * 0.28;
    this.bezelGroup.rotation.y = p * 0.2;

    // 8. Rotary Knob & Keypad Controls detaches and spreads into controlled array
    this.controlsGroup.position.z = depth * 0.25 + p * 3.4;
    this.controlsGroup.position.x = p * 1.15;
    this.controlsGroup.rotation.y = p * 0.25;
    this.knob.rotation.z = p * Math.PI * 3.0; // Dynamic rotation of dial

    // Fan button spacing outward
    for (let k = 0; k < this.buttons.length; k++) {
      const btn = this.buttons[k];
      btn.position.x = (width / 2 - 0.45) + (k - 2) * p * 0.18;
      btn.position.z = 0.14 + p * (0.2 + k * 0.08);
    }

    // 9. Holographic Telemetry Waveforms project outward across the viewport
    const waveOpacity = Math.max(0, Math.min(0.95, (p - 0.15) * 1.8));
    this.ecgWaveMesh.material.opacity = waveOpacity;
    this.plethWaveMesh.material.opacity = waveOpacity;

    this.ecgWaveMesh.position.y = 2.0 + p * 0.8;
    this.ecgWaveMesh.position.z = 1.0 + p * 1.6;
    this.ecgWaveMesh.scale.x = 0.6 + p * 0.55;

    this.plethWaveMesh.position.y = -1.8 - p * 0.7;
    this.plethWaveMesh.position.z = 1.2 + p * 1.5;
    this.plethWaveMesh.scale.x = 0.6 + p * 0.55;

    // Whole assembly subtle dynamic inspection rotation
    this.group.rotation.y = -0.32 + p * 0.58;
    this.group.rotation.x = 0.12 + p * 0.08;
  }

  update(time) {
    if (this.dynamicEcgScreen) {
      this.dynamicEcgScreen.update(time);
    }

    // Gentle floating breath
    this.group.position.y += Math.sin(time * 1.4 + 2.0) * 0.0008;

    // Subtle holographic waveform shimmer
    if (this.ecgWaveMesh && this.ecgWaveMesh.material.opacity > 0.05) {
      this.ecgWaveMesh.position.x = Math.sin(time * 2.0) * 0.04;
      this.plethWaveMesh.position.x = Math.cos(time * 2.2) * 0.04;
    }
  }
}
