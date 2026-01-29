import * as THREE from 'three';

export type RocketBuild = {
  root: THREE.Object3D;
  meshes: THREE.Mesh[];
};

function stdMat(color: number) {
  const m = new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0.08 });
  m.envMapIntensity = 1.1;
  return m;
}

function tag(mesh: THREE.Mesh, id: string) {
  mesh.userData.partId = id;
  mesh.name = id;
  return mesh;
}

function addBand(root: THREE.Object3D, meshes: THREE.Mesh[], r: number, y: number, h: number, color: number, id: string) {
  const band = tag(new THREE.Mesh(new THREE.CylinderGeometry(r * 1.001, r * 1.001, h, 64, 1), stdMat(color)), id);
  band.position.y = y;
  root.add(band);
  meshes.push(band);
}

function addCheckerRoll(root: THREE.Object3D, meshes: THREE.Mesh[], r: number, y: number, h: number, id: string) {
  // Saturn V style "roll pattern" hint: alternating black/white bands.
  const n = 6;
  const seg = h / n;
  for (let i = 0; i < n; i++) {
    const isBlack = i % 2 === 0;
    addBand(root, meshes, r, y - h / 2 + seg / 2 + i * seg, seg * 0.92, isBlack ? 0x0b0f1a : 0xf2f5ff, id);
  }
}

// Saturn V–inspired educational rocket built from primitives.
export function createRocket(): RocketBuild {
  const root = new THREE.Object3D();
  const meshes: THREE.Mesh[] = [];

  // Proportions (not exact; tuned to look "NASA/Saturn V" recognizable)
  const R1 = 7.2;      // S-IC radius
  const H1 = 58;       // S-IC height

  const R2 = 6.2;      // S-II radius
  const H2 = 36;       // S-II height

  const R3 = 5.0;      // S-IVB radius
  const H3 = 20;       // S-IVB height

  const H12 = 9;       // Interstage 1-2
  const H23 = 5.5;     // Interstage 2-3
  const HIU = 3.0;     // Instrument Unit

  const baseY = 0;

  // -----------------
  // S-IC (Stage 1)
  // -----------------
  {
    const shell = tag(new THREE.Mesh(new THREE.CylinderGeometry(R1, R1, H1, 72, 1), stdMat(0xf2f5ff)), 's_ic_shell');
    shell.position.y = baseY + H1 / 2;
    root.add(shell);
    meshes.push(shell);

    // black stripe near top + roll pattern lower section
    addBand(root, meshes, R1, baseY + H1 - 6, 3.0, 0x0b0f1a, 's_ic_shell');
    addCheckerRoll(root, meshes, R1, baseY + 18, 18, 's_ic_shell');

    // internal tanks (generic)
    const innerR = R1 * 0.82;
    const fuel = tag(new THREE.Mesh(new THREE.CylinderGeometry(innerR, innerR, 22, 48, 1), stdMat(0xffb86b)), 'fuel_tank');
    fuel.position.y = baseY + 18;
    root.add(fuel);
    meshes.push(fuel);

    const lox = tag(new THREE.Mesh(new THREE.CylinderGeometry(innerR, innerR, 20, 48, 1), stdMat(0x7fd0ff)), 'lox_tank');
    lox.position.y = baseY + 42;
    root.add(lox);
    meshes.push(lox);

    // pressurant bottles
    const bottleGeom = new THREE.SphereGeometry(1.25, 20, 14);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const b = tag(new THREE.Mesh(bottleGeom, stdMat(0x47ff9a)), 'pressurant_bottles');
      b.position.set(Math.cos(a) * (innerR * 0.55), baseY + 32, Math.sin(a) * (innerR * 0.55));
      root.add(b);
      meshes.push(b);
    }

    // feed lines (two pipes)
    const pipeGeom = new THREE.CylinderGeometry(0.38, 0.38, 26, 16, 1);
    for (let i = 0; i < 2; i++) {
      const s = i === 0 ? 1 : -1;
      const pipe = tag(new THREE.Mesh(pipeGeom, stdMat(0xd7ddff)), 'feed_lines');
      pipe.position.set(s * (innerR * 0.55), baseY + 18, 0);
      pipe.rotation.z = 0.18 * s;
      root.add(pipe);
      meshes.push(pipe);
    }
  }

  // Stage 1 engines (F-1 style: 5 bells)
  {
    const cluster = new THREE.Object3D();
    const bellMat = stdMat(0x12192e);

    const bellGeom = new THREE.ConeGeometry(1.55, 5.8, 28, 1);
    const chamberGeom = new THREE.CylinderGeometry(0.85, 1.15, 2.0, 24, 1);

    const positions: Array<[number, number]> = [
      [0, 0],
      [2.8, 0],
      [-2.8, 0],
      [0, 2.8],
      [0, -2.8]
    ];

    for (const [x, z] of positions) {
      const chamber = tag(new THREE.Mesh(chamberGeom, stdMat(0x3b415a)), 'stage1_engines');
      chamber.position.set(x, 3.2, z);
      cluster.add(chamber);
      meshes.push(chamber);

      const bell = tag(new THREE.Mesh(bellGeom, bellMat.clone()), 'stage1_engines');
      bell.position.set(x, 0.6, z);
      bell.rotation.x = Math.PI;
      cluster.add(bell);
      meshes.push(bell);
    }

    // engine mount ring
    const ring = tag(new THREE.Mesh(new THREE.TorusGeometry(R1 * 0.62, 0.45, 14, 64), stdMat(0x8aa2ff)), 'stage1_engines');
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 6.0;
    root.add(ring);
    meshes.push(ring);

    cluster.position.y = 0;
    root.add(cluster);
  }

  // -----------------
  // Interstage 1-2
  // -----------------
  const y1Top = H1;
  {
    const inter = tag(new THREE.Mesh(new THREE.CylinderGeometry(R1 * 0.98, R2 * 1.02, H12, 64, 1), stdMat(0xf2f5ff)), 'interstage_1_2');
    inter.position.y = y1Top + H12 / 2;
    root.add(inter);
    meshes.push(inter);

    // thin black band
    addBand(root, meshes, R1 * 0.98, y1Top + H12 - 1.2, 1.0, 0x0b0f1a, 'interstage_1_2');
  }

  // -----------------
  // S-II (Stage 2)
  // -----------------
  const y2Base = y1Top + H12;
  {
    const shell = tag(new THREE.Mesh(new THREE.CylinderGeometry(R2, R2, H2, 64, 1), stdMat(0xf2f5ff)), 's_ii_shell');
    shell.position.y = y2Base + H2 / 2;
    root.add(shell);
    meshes.push(shell);

    addCheckerRoll(root, meshes, R2, y2Base + 10, 14, 's_ii_shell');

    // internal tanks (generic; Stage 2 is LH2/LOX in real Saturn V)
    const innerR = R2 * 0.82;
    const fuel = tag(new THREE.Mesh(new THREE.CylinderGeometry(innerR, innerR, 16, 44, 1), stdMat(0xffb86b)), 'fuel_tank');
    fuel.position.y = y2Base + 12;
    root.add(fuel);
    meshes.push(fuel);

    const lox = tag(new THREE.Mesh(new THREE.CylinderGeometry(innerR, innerR, 14, 44, 1), stdMat(0x7fd0ff)), 'lox_tank');
    lox.position.y = y2Base + 26;
    root.add(lox);
    meshes.push(lox);
  }

  // Stage 2 engines (5 bells)
  {
    const cluster = new THREE.Object3D();
    const bellGeom = new THREE.ConeGeometry(1.2, 5.0, 26, 1);
    const chamberGeom = new THREE.CylinderGeometry(0.65, 0.9, 1.8, 22, 1);

    const r = 2.3;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;

      const chamber = tag(new THREE.Mesh(chamberGeom, stdMat(0x3b415a)), 'stage2_engines');
      chamber.position.set(x, y2Base + 1.9, z);
      root.add(chamber);
      meshes.push(chamber);

      const bell = tag(new THREE.Mesh(bellGeom, stdMat(0x12192e)), 'stage2_engines');
      bell.position.set(x, y2Base - 0.9, z);
      bell.rotation.x = Math.PI;
      root.add(bell);
      meshes.push(bell);
    }

    // mount ring
    const ring = tag(new THREE.Mesh(new THREE.TorusGeometry(R2 * 0.6, 0.35, 12, 64), stdMat(0x8aa2ff)), 'stage2_engines');
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y2Base + 3.2;
    root.add(ring);
    meshes.push(ring);

    root.add(cluster);
  }

  // -----------------
  // Interstage 2-3
  // -----------------
  const y2Top = y2Base + H2;
  {
    const inter = tag(new THREE.Mesh(new THREE.CylinderGeometry(R2 * 0.98, R3 * 1.02, H23, 56, 1), stdMat(0xf2f5ff)), 'interstage_2_3');
    inter.position.y = y2Top + H23 / 2;
    root.add(inter);
    meshes.push(inter);

    addBand(root, meshes, R2 * 0.98, y2Top + 1.2, 1.0, 0x0b0f1a, 'interstage_2_3');
  }

  // Instrument unit (black ring)
  const yIUBase = y2Top + H23;
  {
    const iu = tag(new THREE.Mesh(new THREE.CylinderGeometry(R3 * 1.02, R3 * 1.02, HIU, 56, 1), stdMat(0x0b0f1a)), 'instrument_unit');
    iu.position.y = yIUBase + HIU / 2;
    root.add(iu);
    meshes.push(iu);
  }

  // -----------------
  // S-IVB (Stage 3)
  // -----------------
  const y3Base = yIUBase + HIU;
  {
    const shell = tag(new THREE.Mesh(new THREE.CylinderGeometry(R3, R3, H3, 56, 1), stdMat(0xf2f5ff)), 's_ivb_shell');
    shell.position.y = y3Base + H3 / 2;
    root.add(shell);
    meshes.push(shell);

    addBand(root, meshes, R3, y3Base + 4.0, 1.1, 0x0b0f1a, 's_ivb_shell');

    // internal tanks
    const innerR = R3 * 0.82;
    const fuel = tag(new THREE.Mesh(new THREE.CylinderGeometry(innerR, innerR, 7.5, 40, 1), stdMat(0xffb86b)), 'fuel_tank');
    fuel.position.y = y3Base + 6.5;
    root.add(fuel);
    meshes.push(fuel);

    const lox = tag(new THREE.Mesh(new THREE.CylinderGeometry(innerR, innerR, 7.0, 40, 1), stdMat(0x7fd0ff)), 'lox_tank');
    lox.position.y = y3Base + 14.5;
    root.add(lox);
    meshes.push(lox);
  }

  // Stage 3 single engine
  {
    const chamber = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.95, 1.7, 22, 1), stdMat(0x3b415a)), 'stage3_engine');
    chamber.position.y = y3Base + 1.8;
    root.add(chamber);
    meshes.push(chamber);

    const bell = tag(new THREE.Mesh(new THREE.ConeGeometry(1.35, 6.2, 28, 1), stdMat(0x12192e)), 'stage3_engine');
    bell.position.y = y3Base - 1.1;
    bell.rotation.x = Math.PI;
    root.add(bell);
    meshes.push(bell);

    const ring = tag(new THREE.Mesh(new THREE.TorusGeometry(R3 * 0.55, 0.28, 12, 64), stdMat(0x8aa2ff)), 'stage3_engine');
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y3Base + 3.0;
    root.add(ring);
    meshes.push(ring);
  }

  // -----------------
  // Apollo spacecraft (simplified)
  // -----------------
  const y3Top = y3Base + H3;
  {
    // Service module (cylinder)
    const sm = tag(new THREE.Mesh(new THREE.CylinderGeometry(R3 * 0.72, R3 * 0.72, 10, 40, 1), stdMat(0xd7ddff)), 'service_module');
    sm.position.y = y3Top + 5.0;
    root.add(sm);
    meshes.push(sm);

    // Command module (cone)
    const cm = tag(new THREE.Mesh(new THREE.ConeGeometry(R3 * 0.68, 6.2, 40, 1), stdMat(0xffd36a)), 'command_module');
    cm.position.y = y3Top + 10 + 3.1;
    root.add(cm);
    meshes.push(cm);

    // LES tower (thin cylinders)
    const towerMat = stdMat(0xf2f5ff);
    const tower = new THREE.Object3D();
    const legGeom = new THREE.CylinderGeometry(0.12, 0.12, 10.5, 10, 1);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const leg = tag(new THREE.Mesh(legGeom, towerMat.clone()), 'les');
      leg.position.set(Math.cos(a) * 0.55, y3Top + 10 + 6.2 + 5.0, Math.sin(a) * 0.55);
      root.add(leg);
      meshes.push(leg);
    }

    // escape motor "cap"
    const cap = tag(new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.2, 22, 1), stdMat(0x0b0f1a)), 'les');
    cap.position.y = y3Top + 10 + 6.2 + 10.8;
    root.add(cap);
    meshes.push(cap);

    root.add(tower);
  }

  // slight yaw for nicer composition
  root.rotation.y = 0.45;

  return { root, meshes };
}
