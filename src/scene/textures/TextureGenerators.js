import * as THREE from 'three';

/**
 * Creates high-res aluminum foil backing texture with authentic crosshatch knurl and lot markings
 */
export function createBlisterFoilTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Brushed aluminum metallic base
  ctx.fillStyle = '#dbe4e8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Micro crosshatch embossing grid
  ctx.strokeStyle = '#c8d4da';
  ctx.lineWidth = 1;
  const step = 8;
  for (let x = 0; x < canvas.width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Printed pharmaceutical lot numbers and push-through markings repeated across pockets
  ctx.fillStyle = '#0f2938';
  ctx.font = 'bold 22px "JetBrains Mono", monospace';

  for (let col = 0; col < 2; col++) {
    for (let row = 0; row < 5; row++) {
      const px = col === 0 ? 120 : 620;
      const py = 120 + row * 180;

      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = '#0f2b38';
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('MEDSOURCE PHARMA', 0, 0);
      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#0284c7';
      ctx.fillText('AMIDOPYRINE ER 500mg', 0, 26);
      ctx.font = '14px "JetBrains Mono", monospace';
      ctx.fillStyle = '#475569';
      ctx.fillText('LOT: MS-90422  EXP: 11/2028', 0, 50);
      ctx.fillText('PUSH TO OPEN  NDC 70412-402', 0, 70);
      ctx.restore();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

/**
 * Dynamic Controller for Real-Time Illustrative ECG & Vital Signs Telemetry Screen
 */
export class DynamicEcgScreen {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024;
    this.canvas.height = 768;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.anisotropy = 8;

    this.sweepX = 0;
    this.historyPoints = [];
    this.spo2Points = [];
    this.lastTime = 0;

    // Immediately render initial frame so texture is never black
    this.update(0);
  }

  update(time) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Background
    ctx.fillStyle = '#030814';
    ctx.fillRect(0, 0, w, h);

    // Subtle 10mm clinical grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Top Clinical Status Bar
    ctx.fillStyle = 'rgba(10, 20, 40, 0.8)';
    ctx.fillRect(0, 0, w, 56);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('MEDSOURCE M-8000 TELEMETRY', 24, 36);

    ctx.fillStyle = '#00f0ff';
    ctx.font = '600 14px "JetBrains Mono", monospace';
    ctx.fillText('BED 04  |  ADULT PACED  |  LEAD II', 400, 36);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('[ ILLUSTRATIVE SIMULATED TELEMETRY ]', 720, 36);

    // Sweep position calculation
    const speed = 180; // pixels per sec
    const waveAreaWidth = 700;
    const currentX = (time * speed) % waveAreaWidth;

    // 1. ECG WAVEFORM (Lead II)
    const ecgBaseY = 220;
    const ecgT = (time * 1.2) % 1.0; // 72 bpm cycle (~0.83s)

    let ecgSample = 0;
    // P wave (0.1 - 0.2)
    if (ecgT > 0.1 && ecgT < 0.2) {
      ecgSample = Math.sin((ecgT - 0.1) / 0.1 * Math.PI) * 16;
    }
    // QRS complex (0.22 - 0.30)
    else if (ecgT > 0.22 && ecgT < 0.24) {
      ecgSample = -14; // Q
    } else if (ecgT >= 0.24 && ecgT < 0.27) {
      ecgSample = 95; // R spike
    } else if (ecgT >= 0.27 && ecgT < 0.30) {
      ecgSample = -28; // S
    }
    // T wave (0.42 - 0.58)
    else if (ecgT > 0.42 && ecgT < 0.58) {
      ecgSample = Math.sin((ecgT - 0.42) / 0.16 * Math.PI) * 26;
    }

    this.historyPoints.push({ x: currentX, y: ecgBaseY - ecgSample });
    if (this.historyPoints.length > 500) this.historyPoints.shift();

    // Draw ECG trace with phosphor glow
    ctx.save();
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < this.historyPoints.length; i++) {
      const p = this.historyPoints[i];
      if (Math.abs(p.x - currentX) > waveAreaWidth - 20) continue;
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText('ECG II 1mV', 24, 130);

    // 2. SpO2 Plethysmograph Waveform (Cyan)
    const spo2BaseY = 430;
    const spo2Sample = Math.pow(Math.sin(ecgT * Math.PI), 2) * 55;
    this.spo2Points.push({ x: currentX, y: spo2BaseY - spo2Sample });
    if (this.spo2Points.length > 500) this.spo2Points.shift();

    ctx.save();
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < this.spo2Points.length; i++) {
      const p = this.spo2Points[i];
      if (Math.abs(p.x - currentX) > waveAreaWidth - 20) continue;
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText('SpO2 PLETH', 24, 350);

    // 3. Respiration Waveform (Yellow)
    const respBaseY = 620;
    const respY = respBaseY + Math.sin(time * 1.8) * 35;
    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText('RESP 16 rpm', 24, 550);

    ctx.save();
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, respY);
    for (let x = 0; x < waveAreaWidth; x += 10) {
      ctx.lineTo(x, respBaseY + Math.sin((time * 1.8) + (x * 0.02)) * 35);
    }
    ctx.stroke();
    ctx.restore();

    // 4. Telemetry Readouts Column (Right side)
    const colX = 730;

    // HR Box
    ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
    ctx.fillRect(colX, 80, 270, 150);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.strokeRect(colX, 80, 270, 150);
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText('HEART RATE  bpm', colX + 18, 115);
    ctx.font = 'bold 78px "JetBrains Mono", monospace';
    ctx.fillText('72', colX + 18, 195);

    // SpO2 Box
    ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.fillRect(colX, 250, 270, 150);
    ctx.strokeStyle = '#00f0ff';
    ctx.strokeRect(colX, 250, 270, 150);
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText('SpO2  %', colX + 18, 285);
    ctx.font = 'bold 78px "JetBrains Mono", monospace';
    ctx.fillText('98', colX + 18, 365);

    // NIBP Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(colX, 420, 270, 150);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(colX, 420, 270, 150);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText('NIBP  mmHg (SYS/DIA)', colX + 18, 455);
    ctx.font = 'bold 54px "JetBrains Mono", monospace';
    ctx.fillText('120/80', colX + 18, 525);
    ctx.font = '500 18px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('MEAN (93)', colX + 18, 555);

    // Temp & Resp Box
    ctx.fillStyle = 'rgba(234, 179, 8, 0.1)';
    ctx.fillRect(colX, 590, 270, 150);
    ctx.strokeStyle = '#eab308';
    ctx.strokeRect(colX, 590, 270, 150);
    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText('TEMP: 37.0°C  |  RESP: 16', colX + 18, 630);
    ctx.font = 'bold 36px "JetBrains Mono", monospace';
    ctx.fillText('STABLE', colX + 18, 690);

    this.texture.needsUpdate = true;
  }
}

/**
 * High-Resolution Sonogram Screen Texture for Diagnostic Ultrasound
 */
export function createUltrasoundScreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Sonogram dark monitor background
  ctx.fillStyle = '#020610';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top Diagnostic Info Banner
  ctx.fillStyle = '#0a1628';
  ctx.fillRect(0, 0, canvas.width, 50);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('MEDSOURCE SONOVUE 900 — CONVEX 3.5MHz', 30, 32);

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.fillText('[ ILLUSTRATIVE DIAGNOSTIC DEMONSTRATION ]', 650, 32);

  // Acoustic Sector Fan Shape (Ultrasound B-Mode Beam)
  const centerX = canvas.width / 2;
  const startY = 120;
  const radius = 540;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(centerX, startY);
  ctx.arc(centerX, startY, radius, Math.PI * 0.32, Math.PI * 0.68, false);
  ctx.closePath();
  ctx.clip();

  // Acoustic tissue speckle pattern
  const grad = ctx.createRadialGradient(centerX, startY, 40, centerX, startY, radius);
  grad.addColorStop(0, '#102838');
  grad.addColorStop(0.3, '#1e485e');
  grad.addColorStop(0.6, '#0f2736');
  grad.addColorStop(1, '#020610');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Simulated anatomical acoustic contours
  ctx.strokeStyle = 'rgba(200, 240, 255, 0.45)';
  ctx.lineWidth = 3;
  for (let r = 120; r < 480; r += 70) {
    ctx.beginPath();
    ctx.arc(centerX, startY, r, Math.PI * 0.36, Math.PI * 0.64);
    ctx.stroke();
  }

  // Tissue density variations
  for (let i = 0; i < 400; i++) {
    const angle = (Math.PI * 0.34) + Math.random() * (Math.PI * 0.32);
    const dist = 80 + Math.random() * 420;
    const sx = centerX + Math.cos(angle) * dist;
    const sy = startY + Math.sin(angle) * dist;
    const brightness = Math.floor(Math.random() * 180 + 75);
    ctx.fillStyle = `rgba(${brightness}, ${brightness + 20}, ${brightness + 30}, 0.6)`;
    ctx.fillRect(sx, sy, Math.random() * 6 + 1, Math.random() * 4 + 1);
  }

  ctx.restore();

  // Depth scale ticks along the side
  ctx.strokeStyle = '#00f0ff';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px "JetBrains Mono", monospace';
  for (let d = 0; d <= 18; d += 2) {
    const y = 140 + d * 28;
    ctx.beginPath();
    ctx.moveTo(180, y);
    ctx.lineTo(195, y);
    ctx.stroke();
    ctx.fillText(`${d}cm`, 140, y + 4);
  }

  // Diagnostic Readout Overlay
  ctx.fillStyle = '#00f0ff';
  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillText('FREQ: 3.5 MHz  |  GAIN: 64 dB  |  DEPTH: 18 cm', 30, 725);
  ctx.fillText('DYNAMIC RANGE: 75 dB  |  FPS: 38 Hz', 620, 725);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

/**
 * Control Console Texture for Ultrasound System
 */
export function createUltrasoundControlTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Ergonomic matte medical console deck
  ctx.fillStyle = '#111b2b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Keyboard and soft key deck
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 40, 520, 430);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('DIAGNOSTIC WORKSTATION', 60, 75);

  // Backlit Alphanumeric keys
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 10; c++) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(60 + c * 48, 110 + r * 42, 40, 32);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.strokeRect(60 + c * 48, 110 + r * 42, 40, 32);
    }
  }

  // 8-Zone TGC Slider Array
  ctx.fillStyle = '#00f0ff';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.fillText('TGC SLIDERS', 620, 75);

  for (let s = 0; s < 8; s++) {
    const sx = 620 + s * 42;
    // Slider groove
    ctx.fillStyle = '#0a101d';
    ctx.fillRect(sx, 100, 8, 220);
    // Slider knob position
    const knobY = 140 + Math.sin(s * 0.6) * 60;
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(sx - 8, knobY, 24, 14);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(sx - 8, knobY + 5, 24, 4);
  }

  // Trackball Well border (Right quadrant)
  ctx.beginPath();
  ctx.arc(880, 380, 80, 0, Math.PI * 2);
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('OPTICAL TRACKBALL', 810, 485);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

/**
 * Logistics Cold-Chain Placard Texture
 */
export function createCargoLabelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Heavy duty thermal label background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cyan Cold Chain Header
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, canvas.width, 140);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('COLD CHAIN SECURE CARGO', 50, 90);

  // Critical Temperature Badge
  ctx.fillStyle = '#eff6ff';
  ctx.fillRect(50, 180, 924, 200);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 4;
  ctx.strokeRect(50, 180, 924, 200);

  ctx.fillStyle = '#0369a1';
  ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CRITICAL TEMPERATURE SPECIFICATION', 90, 240);

  ctx.fillStyle = '#0f172a';
  ctx.font = '800 68px "JetBrains Mono", monospace';
  ctx.fillText('+2.0°C TO +8.0°C', 90, 320);

  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillStyle = '#d97706';
  ctx.fillText('[ ILLUSTRATIVE DEMO SPECIFICATION ]', 560, 320);

  // Logistics Consignment specs
  ctx.fillStyle = '#334155';
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CONSIGNMENT: STERILE PHARMACEUTICAL INJECTABLES', 90, 440);
  ctx.fillText('MONITORING: CONTINUOUS CRYOGENIC DATA LOGGER', 90, 480);
  ctx.fillText('PACKAGING: VACUUM INSULATED PANEL (VIP) SHIPPER', 90, 520);
  ctx.fillText('VALIDATION: IATA / GDP COMPLIANT INTEGRITY PROTOCOL', 90, 560);

  // Barcode
  ctx.fillStyle = '#0f172a';
  const startX = 90;
  const barcodeY = 620;
  const barcodeHeight = 130;
  for (let x = startX; x < startX + 750; x += 6) {
    if (Math.random() > 0.25) {
      const bw = Math.random() > 0.6 ? 4.5 : 2;
      ctx.fillRect(x, barcodeY, bw, barcodeHeight);
    }
  }

  ctx.font = '22px "JetBrains Mono", monospace';
  ctx.fillText('AWB 849-29104820  (01)90412849201948', 90, 790);

  // Security Hologram simulation
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(90, 830, 840, 130);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(90, 830, 840, 130);

  ctx.fillStyle = '#0369a1';
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('MEDSOURCE VERIFIED COLD CHAIN SHIPMENT', 130, 885);
  ctx.font = '16px "JetBrains Mono", monospace';
  ctx.fillText('TAMPER-EVIDENT CRYOGENIC SEAL VERIFIED', 130, 920);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}
