import * as THREE from 'three';
import { createBlisterFoilTexture } from '../textures/TextureGenerators';

/**
 * Photorealistic 3D Medicine Blister Pack with Component-Level Exploded Separation
 * Components:
 * 1. Aluminum Foil Backing
 * 2. Thermoformed PVC Blister Tray with Pockets
 * 3. 10 Individual Coated Tablets that lift out and rotate
 */
export class BlisterPackModel {
  constructor() {
    this.group = new THREE.Group();
    this.tablets = [];
    this.tabletInitialPositions = [];
    this.init();
  }

  init() {
    const width = 3.8;
    const height = 5.4;

    // 1. ALUMINUM FOIL BACKPLATE (Layer 1)
    this.foilGroup = new THREE.Group();
    const foilTex = createBlisterFoilTexture();
    const foilMat = new THREE.MeshStandardMaterial({
      map: foilTex,
      metalness: 0.9,
      roughness: 0.25,
      side: THREE.DoubleSide
    });
    const foilGeo = new THREE.PlaneGeometry(width, height);
    const foilMesh = new THREE.Mesh(foilGeo, foilMat);
    foilMesh.receiveShadow = true;
    this.foilGroup.add(foilMesh);
    this.group.add(this.foilGroup);

    // 2. THERMOFORMED CLEAR PVC BLISTER TRAY (Layer 2)
    this.trayGroup = new THREE.Group();
    const pvcMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      roughness: 0.05,
      ior: 1.5,
      thickness: 0.35,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      transparent: true,
      opacity: 0.7
    });

    // Flat border flange of PVC tray
    const flangeGeo = new THREE.PlaneGeometry(width, height);
    const flangeMesh = new THREE.Mesh(flangeGeo, pvcMat);
    flangeMesh.position.z = 0.02;
    this.trayGroup.add(flangeMesh);

    // Grid of 2 columns x 5 rows = 10 pockets
    const cols = 2;
    const rows = 5;
    const colSpacing = 1.7;
    const rowSpacing = 0.96;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = (c - (cols - 1) / 2) * colSpacing;
        const y = (r - (rows - 1) / 2) * rowSpacing;

        // Thermoformed dome pocket
        const domeGeo = new THREE.CapsuleGeometry(0.34, 0.46, 16, 24);
        const domeMesh = new THREE.Mesh(domeGeo, pvcMat);
        domeMesh.rotation.z = Math.PI / 2;
        domeMesh.position.set(x, y, 0.24);
        this.trayGroup.add(domeMesh);
      }
    }
    this.group.add(this.trayGroup);

    // 3. COATED MEDICINE TABLETS (Layer 3 - Lift out of pockets)
    this.tabletsGroup = new THREE.Group();

    const tabletMatTeal = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7, // Medical cyan tablet
      roughness: 0.15,
      clearcoat: 0.9,
      clearcoatRoughness: 0.05,
      metalness: 0.02
    });

    const tabletMatWhite = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc, // Pearl white tablet
      roughness: 0.2,
      clearcoat: 0.85,
      clearcoatRoughness: 0.06
    });

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const idx = c * rows + r;
        const x = (c - (cols - 1) / 2) * colSpacing;
        const y = (r - (rows - 1) / 2) * rowSpacing;

        const tabGroup = new THREE.Group();

        // Biconvex elongated caplet shape
        const capletGeo = new THREE.CapsuleGeometry(0.24, 0.38, 16, 20);
        const tabMat = idx % 2 === 0 ? tabletMatTeal : tabletMatWhite;
        const capletMesh = new THREE.Mesh(capletGeo, tabMat);
        capletMesh.rotation.z = Math.PI / 2;
        capletMesh.castShadow = true;
        tabGroup.add(capletMesh);

        // Center debossed pill score line
        const scoreGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.025, 20);
        const scoreMat = new THREE.MeshStandardMaterial({ color: 0x0f2b38, roughness: 0.4 });
        const scoreMesh = new THREE.Mesh(scoreGeo, scoreMat);
        scoreMesh.rotation.z = Math.PI / 2;
        tabGroup.add(scoreMesh);

        tabGroup.position.set(x, y, 0.16);
        this.tabletsGroup.add(tabGroup);

        this.tablets.push(tabGroup);
        this.tabletInitialPositions.push(new THREE.Vector3(x, y, 0.16));
      }
    }
    this.group.add(this.tabletsGroup);

    // Initial pose
    this.group.rotation.set(0.25, -0.4, 0.12);
    this.group.position.set(2.2, 0, 0);
  }

  setExplosion(progress) {
    const p = Math.max(0, Math.min(1, progress));

    // 1. Foil backing moves backward (-Z)
    this.foilGroup.position.z = -p * 1.1;

    // 2. PVC blister tray advances forward (+Z)
    this.trayGroup.position.z = p * 0.4;

    // 3. Tablets lift out of their pockets forward (+Z) and tilt
    for (let i = 0; i < this.tablets.length; i++) {
      const tab = this.tablets[i];
      const initPos = this.tabletInitialPositions[i];

      tab.position.z = initPos.z + p * (1.6 + (i % 3) * 0.25);
      // Gentle individual flare tilt
      tab.rotation.x = p * (0.35 + (i % 2) * 0.2);
      tab.rotation.y = p * 0.4;
    }
  }

  update(time) {
    this.group.position.y += Math.sin(time * 1.6 + 1.0) * 0.001;
  }
}
