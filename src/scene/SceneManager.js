import * as THREE from 'three';
import { CapsuleModel } from './models/CapsuleModel';
import { MedicineBottleModel } from './models/MedicineBottleModel';
import { PatientMonitorModel } from './models/PatientMonitorModel';
import { UltrasoundModel } from './models/UltrasoundModel';
import { LogisticsShipperModel } from './models/LogisticsShipperModel';
import { DynamicEcgScreen } from './textures/TextureGenerators';

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.clock = new THREE.Clock();

    this.activeStage = 0;
    this.mouseTarget = new THREE.Vector2(0, 0);
    this.mouseCurrent = new THREE.Vector2(0, 0);

    this.initRenderer();
    this.initScene();
    this.initLighting();
    this.initModels();
    this.setupEventListeners();
    this.animate = this.animate.bind(this);
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x060b18, 0.035);

    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 8.5);
    this.camera.lookAt(0, 0, 0);

    // Studio Environment Grid / subtle reflection floor
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x040813,
      roughness: 0.88,
      metalness: 0.18
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -5.5;
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);
  }

  initLighting() {
    // 1. Ambient Light
    const ambientLight = new THREE.AmbientLight(0xd9eaf5, 0.95);
    this.scene.add(ambientLight);

    // 2. High-contrast Studio Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(7, 10, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.radius = 3.5;
    this.scene.add(keyLight);

    // 3. Clinical Cyan / Teal Rim Light
    const tealRim = new THREE.DirectionalLight(0x00f0ff, 3.6);
    tealRim.position.set(-8, 3, -6);
    this.scene.add(tealRim);

    // 4. Warm Soft Fill Light
    const fillLight = new THREE.PointLight(0x7dd3fc, 1.4, 25);
    fillLight.position.set(-4, -2, 4);
    this.scene.add(fillLight);

    // 5. Overhead Softbox Light
    const overheadLight = new THREE.DirectionalLight(0xffffff, 1.2);
    overheadLight.position.set(0, 12, 0);
    this.scene.add(overheadLight);
  }

  initModels() {
    // 1. Dynamic LCD Screen Engine for Patient Monitor
    try {
      this.dynamicEcg = new DynamicEcgScreen();
    } catch (e) {
      console.warn('Failed to initialize DynamicEcgScreen:', e);
      this.dynamicEcg = null;
    }

    // Helper for resilient model initialization
    const safeInitModel = (name, factory) => {
      try {
        const model = factory();
        if (model && model.group) {
          this.scene.add(model.group);
          return model;
        }
      } catch (err) {
        console.error(`Error initializing 3D model [${name}]:`, err);
      }
      // Return a safe dummy fallback object so downstream methods never throw
      const dummyGroup = new THREE.Group();
      dummyGroup.visible = false;
      this.scene.add(dummyGroup);
      return {
        group: dummyGroup,
        setExplosion: () => {},
        update: () => {},
      };
    };

    // 2. Instantiate all 5 product assemblies defensively
    this.capsule = safeInitModel('CapsuleModel', () => new CapsuleModel());
    this.pharma = safeInitModel('MedicineBottleModel', () => new MedicineBottleModel());
    this.monitor = safeInitModel('PatientMonitorModel', () => new PatientMonitorModel(this.dynamicEcg));
    this.ultrasound = safeInitModel('UltrasoundModel', () => new UltrasoundModel());
    this.shipper = safeInitModel('LogisticsShipperModel', () => new LogisticsShipperModel());

    // Initially, show only hero capsule, others hidden
    if (this.pharma?.group) this.pharma.group.visible = false;
    if (this.monitor?.group) this.monitor.group.visible = false;
    if (this.ultrasound?.group) this.ultrasound.group.visible = false;
    if (this.shipper?.group) this.shipper.group.visible = false;

    this.updateLayout();
  }

  updateLayout() {
    const isMobile = this.width < 960;
    const desktopX = isMobile ? 0 : 2.2;
    const desktopY = isMobile ? 1.35 : 0.0;
    const scaleFactor = isMobile ? 0.62 : 1.12;

    // Apply responsive positions and scales
    if (this.capsule) {
      this.capsule.group.position.set(desktopX, desktopY, 0);
      this.capsule.group.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
    if (this.pharma) {
      this.pharma.group.position.set(desktopX, isMobile ? desktopY - 0.1 : desktopY - 0.2, 0);
      this.pharma.group.scale.set(scaleFactor * 0.68, scaleFactor * 0.68, scaleFactor * 0.68);
    }
    if (this.monitor) {
      this.monitor.group.position.set(desktopX, isMobile ? desktopY - 0.1 : desktopY, 0);
      this.monitor.group.scale.set(scaleFactor * 0.78, scaleFactor * 0.78, scaleFactor * 0.78);
    }
    if (this.ultrasound) {
      this.ultrasound.group.position.set(desktopX, isMobile ? desktopY : desktopY + 0.15, 0);
      this.ultrasound.group.scale.set(scaleFactor * 0.68, scaleFactor * 0.68, scaleFactor * 0.68);
    }
    if (this.shipper) {
      this.shipper.group.position.set(desktopX, isMobile ? desktopY - 0.15 : desktopY - 0.25, 0);
      this.shipper.group.scale.set(scaleFactor * 0.76, scaleFactor * 0.76, scaleFactor * 0.76);
    }
  }

  setupEventListeners() {
    this.onMouseMove = (e) => {
      this.mouseTarget.x = (e.clientX / this.width) * 2 - 1;
      this.mouseTarget.y = -(e.clientY / this.height) * 2 + 1;
    };
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
  }

  /**
   * Root-Level Section Synchronization:
   * Sets progress (0.0 to 1.0) within a specific stage (0: Hero, 1: Pharma, 2: Devices, 3: Diagnostics, 4: Sourcing, 5: Enquiry)
   *
   * @param {number} stageIndex - 0: Hero, 1: Pharma, 2: Devices, 3: Diagnostics, 4: Sourcing, 5: Enquiry
   * @param {number} progress - Float 0.0 to 1.0 strictly within this section's scroll range
   */
  setStageProgress(stageIndex, progress) {
    const p = Math.max(0, Math.min(1, progress));
    this.activeStage = stageIndex;

    const isMobile = this.width < 960;
    const desktopX = isMobile ? 0 : 2.2;
    const baseZ = isMobile ? 10.2 : 8.5;

    const allModels = [this.capsule, this.pharma, this.monitor, this.ultrasound, this.shipper];

    // Sub-stage progress mapping:
    // 0.00 -> 0.12: Entrance hold in closed state
    // 0.12 -> 0.70: Component-level animation / unscrewing & liquid ribbon reveal (0.0 -> 1.0)
    // 0.70 -> 0.82: Hero hold for inspection
    // 0.82 -> 0.90: Reassembly / liquid return & cap screw down (1.0 -> 0.0)
    // 0.90 -> 1.00: Smooth lateral handoff transition to next model
    let explosionP = 0;
    if (p <= 0.12) {
      explosionP = 0;
    } else if (p > 0.12 && p <= 0.70) {
      explosionP = (p - 0.12) / 0.58;
    } else if (p > 0.70 && p <= 0.82) {
      explosionP = 1.0;
    } else if (p > 0.82 && p <= 0.90) {
      explosionP = 1.0 - (p - 0.82) / 0.08;
    } else {
      explosionP = 0;
    }

    // Default: hide all models except active
    allModels.forEach((m, idx) => {
      if (m) m.group.visible = (idx === stageIndex);
    });

    // Smooth lateral glide transition:
    // When in the final stretch of stage i (p > 0.90) approaching stage i+1:
    // Active model glides off to the left, next model glides in from the right
    if (stageIndex < 4 && p > 0.90) {
      const handoffT = (p - 0.90) / 0.10;
      const currentModel = allModels[stageIndex];
      const nextModel = allModels[stageIndex + 1];

      if (currentModel) {
        currentModel.group.position.x = desktopX - handoffT * 6.0;
      }
      if (nextModel) {
        nextModel.group.visible = true;
        nextModel.setExplosion(0);
        nextModel.group.position.x = desktopX + (1 - handoffT) * 6.0;
      }
    } else {
      // Centered at standard position
      const active = allModels[stageIndex];
      if (active) {
        active.group.position.x = desktopX;
      }
    }

    // Camera positioning based on active section
    this.camera.position.y = 0;

    switch (stageIndex) {
      case 0: { // HERO: Pharmaceutical Capsule
        this.capsule?.setExplosion?.(explosionP);
        this.camera.position.z = baseZ - p * 1.0;
        if (this.capsule?.group) {
          this.capsule.group.rotation.y = -0.45 + p * 0.75;
          this.capsule.group.rotation.x = 0.35 + p * 0.18;
        }
        break;
      }

      case 1: { // PHARMACEUTICAL PRODUCTS: Medicine Bottle with Unscrewing Cap & Floating Tonic
        this.pharma?.setExplosion?.(explosionP);
        this.camera.position.z = baseZ + 0.1 - p * 0.2;
        if (this.pharma?.group) {
          this.pharma.group.rotation.y = 0.15 + p * 0.45;
          this.pharma.group.rotation.x = 0.08 + p * 0.05;
        }
        break;
      }

      case 2: { // MEDICAL DEVICES: Multiparameter Patient Monitor
        this.monitor?.setExplosion?.(explosionP);
        this.camera.position.z = baseZ + 0.3 - p * 0.2;
        if (this.monitor?.group) {
          this.monitor.group.rotation.y = -0.32 + p * 0.55;
          this.monitor.group.rotation.x = 0.12 + p * 0.08;
        }
        break;
      }

      case 3: { // DIAGNOSTIC EQUIPMENT: Ultrasound System
        this.ultrasound?.setExplosion?.(explosionP);
        this.camera.position.z = baseZ + 0.5 - p * 0.2;
        if (this.ultrasound?.group) {
          this.ultrasound.group.rotation.y = -0.32 + p * 0.60;
        }
        break;
      }

      case 4: { // PRODUCT SOURCING & LOGISTICS: Cold-Chain Shipper
        this.shipper?.setExplosion?.(explosionP);
        this.camera.position.z = baseZ + 0.2 - p * 0.2;
        if (this.shipper?.group) {
          this.shipper.group.rotation.y = -0.38 + p * 0.65;
          this.shipper.group.rotation.x = 0.18 + p * 0.10;
        }
        break;
      }

      case 5: { // ENQUIRY & FOOTER
        allModels.forEach((m) => m && m.group && (m.group.visible = false));
        if (this.shipper?.group) {
          this.shipper.group.visible = true;
          this.shipper?.setExplosion?.(0);
        }
        this.camera.position.z = baseZ + p * 3.2;
        this.camera.position.y = p * 1.4;
        break;
      }
    }
  }

  /**
   * Continuous Global Scrubbed Scroll Progress:
   * Maps 0.0 to 1.0 smoothly across all 5 showcase stages
   */
  setScrollProgress(globalProgress) {
    const p = Math.max(0, Math.min(1, globalProgress));
    const totalStages = 5;
    const scaled = p * totalStages;
    const stageIndex = Math.min(totalStages - 1, Math.floor(scaled));
    const localProgress = scaled - stageIndex;
    this.setStageProgress(stageIndex, localProgress);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.updateLayout();
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate);
    const elapsedTime = this.clock.getElapsedTime();

    // Mouse parallax lerping
    this.mouseCurrent.lerp(this.mouseTarget, 0.05);
    this.camera.position.x = this.mouseCurrent.x * 0.35;
    this.camera.lookAt(0, 0, 0);

    // Update models and live dynamic canvas textures
    if (this.capsule?.group?.visible && typeof this.capsule.update === 'function') {
      this.capsule.update(elapsedTime);
    }
    if (this.pharma?.group?.visible && typeof this.pharma.update === 'function') {
      this.pharma.update(elapsedTime);
    }
    if (this.monitor?.group?.visible && typeof this.monitor.update === 'function') {
      this.monitor.update(elapsedTime);
    }
    if (this.ultrasound?.group?.visible && typeof this.ultrasound.update === 'function') {
      this.ultrasound.update(elapsedTime);
    }
    if (this.shipper?.group?.visible && typeof this.shipper.update === 'function') {
      this.shipper.update(elapsedTime);
    }

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('mousemove', this.onMouseMove);
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
