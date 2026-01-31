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
// More internal structure is added for "how it works" cutaway.
export function createRocket(): RocketBuild {
  const root = new THREE.Object3D();
  const meshes: THREE.Mesh[] = [];

  // Proportions (not exact; tuned to look recognizable)
  const R1 = 7.2; // S-IC radius
  const H1 = 58; // S-IC height

  const R2 = 6.2; // S-II radius
  const H2 = 36; // S-II height

  const R3 = 5.0; // S-IVB radius
  const H3 = 20; // S-IVB height

  const H12 = 9; // Interstage 1-2
  const H23 = 5.5; // Interstage 2-3
  const HIU = 3.0; // Instrument Unit

  const baseY = 0;

  // Shared colors (conceptual)
  const COLOR_RP1 = 0xffb86b;
  const COLOR_LH2 = 0xd7ddff;
  const COLOR_LOX = 0x7fd0ff;
  const COLOR_STRUCT = 0x3b415a;
  const COLOR_VALVE = 0xff6b8a;
  const COLOR_AVIONICS = 0x47ff9a;

  // -----------------
  // S-IC (Stage 1)
  // -----------------
  {
    const shell = tag(new THREE.Mesh(new THREE.CylinderGeometry(R1, R1, H1, 72, 1), stdMat(0xf2f5ff)), 's_ic_shell');
    shell.position.y = baseY + H1 / 2;
    root.add(shell);
    meshes.push(shell);

    addBand(root, meshes, R1, baseY + H1 - 6, 3.0, 0x0b0f1a, 's_ic_shell');
    addCheckerRoll(root, meshes, R1, baseY + 18, 18, 's_ic_shell');

    // Tanks: RP-1 (lower) + LOX (upper). Not to scale.
    const innerR = R1 * 0.82;

    const rp1 = tag(new THREE.Mesh(new THREE.CylinderGeometry(innerR, innerR, 22, 48, 1), stdMat(COLOR_RP1)), 's_ic_fuel_tank');
    rp1.position.y = baseY + 16;
    root.add(rp1);
    meshes.push(rp1);

    const lox = tag(new THREE.Mesh(new THREE.CylinderGeometry(innerR, innerR, 20, 48, 1), stdMat(COLOR_LOX)), 's_ic_lox_tank');
    lox.position.y = baseY + 41;
    root.add(lox);
    meshes.push(lox);

    // COPVs (pressurant bottles)
    const bottleGeom = new THREE.SphereGeometry(1.15, 20, 14);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const b = tag(new THREE.Mesh(bottleGeom, stdMat(COLOR_AVIONICS)), 's_ic_copv');
      b.position.set(Math.cos(a) * (innerR * 0.55), baseY + 30, Math.sin(a) * (innerR * 0.55));
      root.add(b);
      meshes.push(b);
    }

    // Downcomer/feed lines (two vertical pipes): one LOX, one fuel.
    const pipeGeom = new THREE.CylinderGeometry(0.32, 0.32, 30, 16, 1);

    const loxPipe = tag(new THREE.Mesh(pipeGeom, stdMat(COLOR_LOX)), 's_ic_feed_lines');
    loxPipe.position.set(innerR * 0.55, baseY + 18, 0);
    loxPipe.rotation.z = 0.15;
    root.add(loxPipe);
    meshes.push(loxPipe);

    const fuelPipe = tag(new THREE.Mesh(pipeGeom, stdMat(COLOR_RP1)), 's_ic_feed_lines');
    fuelPipe.position.set(-innerR * 0.55, baseY + 18, 0);
    fuelPipe.rotation.z = -0.15;
    root.add(fuelPipe);
    meshes.push(fuelPipe);

    // Valve/manifold blocks near engine bay
    const valve = tag(new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 2.2), stdMat(COLOR_VALVE)), 's_ic_valves');
    valve.position.set(0, baseY + 8.4, 0);
    root.add(valve);
    meshes.push(valve);

    // Turbopump blocks
    const pump = tag(new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.0, 2.6), stdMat(COLOR_AVIONICS)), 's_ic_turbopumps');
    pump.position.set(0, baseY + 6.4, 0);
    root.add(pump);
    meshes.push(pump);

    // Gas generator (concept)
    const gg = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.8, 18, 1), stdMat(COLOR_VALVE)), 's_ic_gas_generator');
    gg.position.set(2.8, baseY + 6.2, 0);
    root.add(gg);
    meshes.push(gg);

    // Thrust structure (engine mount plate)
    const thrust = tag(new THREE.Mesh(new THREE.CylinderGeometry(R1 * 0.75, R1 * 0.75, 1.0, 64, 1), stdMat(COLOR_STRUCT)), 's_ic_thrust_structure');
    thrust.position.y = baseY + 5.2;
    root.add(thrust);
    meshes.push(thrust);

    // Gimbal actuators (concept cylinders around mount)
    const actGeom = new THREE.CylinderGeometry(0.22, 0.22, 3.2, 12, 1);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const act = tag(new THREE.Mesh(actGeom, stdMat(0x8aa2ff)), 's_ic_gimbals');
      act.position.set(Math.cos(a) * (R1 * 0.55), baseY + 6.2, Math.sin(a) * (R1 * 0.55));
      act.rotation.z = Math.PI / 2;
      act.rotation.y = a;
      root.add(act);
      meshes.push(act);
    }

    // Wiring harness (concept as thin ring)
    const harness = tag(new THREE.Mesh(new THREE.TorusGeometry(innerR * 0.6, 0.12, 10, 48), stdMat(0xffffff)), 'wiring_harness');
    harness.rotation.x = Math.PI / 2;
    harness.position.y = baseY + 35;
    root.add(harness);
    meshes.push(harness);
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
      const chamber = tag(new THREE.Mesh(chamberGeom, stdMat(COLOR_STRUCT)), 'stage1_engines');
      chamber.position.set(x, 3.2, z);
      cluster.add(chamber);
      meshes.push(chamber);

      const bell = tag(new THREE.Mesh(bellGeom, bellMat.clone()), 'stage1_engines');
      bell.position.set(x, 0.6, z);
      bell.rotation.x = Math.PI;
      cluster.add(bell);
      meshes.push(bell);
    }

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

    // Tanks (concept): LH2 large + LOX smaller.
    const innerR = R2 * 0.82;

    const lh2 = tag(new THREE.Mesh(new THREE.CylinderGeometry(innerR, innerR, 18, 44, 1), stdMat(COLOR_LH2)), 's_ii_lh2_tank');
    lh2.position.y = y2Base + 12;
    root.add(lh2);
    meshes.push(lh2);

    const lox = tag(new THREE.Mesh(new THREE.CylinderGeometry(innerR, innerR, 12, 44, 1), stdMat(COLOR_LOX)), 's_ii_lox_tank');
    lox.position.y = y2Base + 26;
    root.add(lox);
    meshes.push(lox);

    // Feed lines (two pipes)
    const pipeGeom = new THREE.CylinderGeometry(0.26, 0.26, 18, 16, 1);
    const loxPipe = tag(new THREE.Mesh(pipeGeom, stdMat(COLOR_LOX)), 's_ii_feed_lines');
    loxPipe.position.set(innerR * 0.55, y2Base + 12, 0);
    loxPipe.rotation.z = 0.12;
    root.add(loxPipe);
    meshes.push(loxPipe);

    const fuelPipe = tag(new THREE.Mesh(pipeGeom, stdMat(COLOR_LH2)), 's_ii_feed_lines');
    fuelPipe.position.set(-innerR * 0.55, y2Base + 12, 0);
    fuelPipe.rotation.z = -0.12;
    root.add(fuelPipe);
    meshes.push(fuelPipe);

    // COPVs
    const bottleGeom = new THREE.SphereGeometry(0.95, 18, 12);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const b = tag(new THREE.Mesh(bottleGeom, stdMat(COLOR_AVIONICS)), 's_ii_copv');
      b.position.set(Math.cos(a) * (innerR * 0.55), y2Base + 20, Math.sin(a) * (innerR * 0.55));
      root.add(b);
      meshes.push(b);
    }

    const harness = tag(new THREE.Mesh(new THREE.TorusGeometry(innerR * 0.6, 0.1, 10, 48), stdMat(0xffffff)), 'wiring_harness');
    harness.rotation.x = Math.PI / 2;
    harness.position.y = y2Base + 20;
    root.add(harness);
    meshes.push(harness);
  }

  // Stage 2 engines (5 bells)
  {
    const bellGeom = new THREE.ConeGeometry(1.2, 5.0, 26, 1);
    const chamberGeom = new THREE.CylinderGeometry(0.65, 0.9, 1.8, 22, 1);

    const r = 2.3;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;

      const chamber = tag(new THREE.Mesh(chamberGeom, stdMat(COLOR_STRUCT)), 'stage2_engines');
      chamber.position.set(x, y2Base + 1.9, z);
      root.add(chamber);
      meshes.push(chamber);

      const bell = tag(new THREE.Mesh(bellGeom, stdMat(0x12192e)), 'stage2_engines');
      bell.position.set(x, y2Base - 0.9, z);
      bell.rotation.x = Math.PI;
      root.add(bell);
      meshes.push(bell);
    }

    const ring = tag(new THREE.Mesh(new THREE.TorusGeometry(R2 * 0.6, 0.35, 12, 64), stdMat(0x8aa2ff)), 'stage2_engines');
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y2Base + 3.2;
    root.add(ring);
    meshes.push(ring);
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

  // Instrument unit (ring + internal modules)
  const yIUBase = y2Top + H23;
  {
    const iu = tag(new THREE.Mesh(new THREE.CylinderGeometry(R3 * 1.02, R3 * 1.02, HIU, 56, 1), stdMat(0x0b0f1a)), 'instrument_unit');
    iu.position.y = yIUBase + HIU / 2;
    root.add(iu);
    meshes.push(iu);

    // avionics modules (concept boxes)
    const imu = tag(new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.6), stdMat(COLOR_AVIONICS)), 'iu_imu');
    imu.position.set(0, yIUBase + 1.6, R3 * 0.55);
    root.add(imu);
    meshes.push(imu);

    const fc = tag(new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 1.6), stdMat(0xffd36a)), 'iu_flight_computer');
    fc.position.set(0, yIUBase + 1.6, -R3 * 0.55);
    root.add(fc);
    meshes.push(fc);

    const bus = tag(new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.0, 1.2), stdMat(0xffffff)), 'iu_power_bus');
    bus.position.set(R3 * 0.55, yIUBase + 1.6, 0);
    root.add(bus);
    meshes.push(bus);

    const harness = tag(new THREE.Mesh(new THREE.TorusGeometry(R3 * 0.62, 0.08, 10, 64), stdMat(0xffffff)), 'wiring_harness');
    harness.rotation.x = Math.PI / 2;
    harness.position.y = yIUBase + 1.5;
    root.add(harness);
    meshes.push(harness);
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

    const innerR = R3 * 0.82;

    const lh2 = tag(new THREE.Mesh(new THREE.CylinderGeometry(innerR, innerR, 8.5, 40, 1), stdMat(COLOR_LH2)), 's_ivb_lh2_tank');
    lh2.position.y = y3Base + 6.2;
    root.add(lh2);
    meshes.push(lh2);

    const lox = tag(new THREE.Mesh(new THREE.CylinderGeometry(innerR, innerR, 6.5, 40, 1), stdMat(COLOR_LOX)), 's_ivb_lox_tank');
    lox.position.y = y3Base + 14.5;
    root.add(lox);
    meshes.push(lox);

    // Feed lines
    const pipeGeom = new THREE.CylinderGeometry(0.22, 0.22, 10, 16, 1);
    const loxPipe = tag(new THREE.Mesh(pipeGeom, stdMat(COLOR_LOX)), 's_ivb_feed_lines');
    loxPipe.position.set(innerR * 0.55, y3Base + 7.5, 0);
    loxPipe.rotation.z = 0.1;
    root.add(loxPipe);
    meshes.push(loxPipe);

    const fuelPipe = tag(new THREE.Mesh(pipeGeom, stdMat(COLOR_LH2)), 's_ivb_feed_lines');
    fuelPipe.position.set(-innerR * 0.55, y3Base + 7.5, 0);
    fuelPipe.rotation.z = -0.1;
    root.add(fuelPipe);
    meshes.push(fuelPipe);

    // COPVs
    const bottleGeom = new THREE.SphereGeometry(0.8, 18, 12);
    for (let i = 0; i < 2; i++) {
      const a = (i / 2) * Math.PI * 2;
      const b = tag(new THREE.Mesh(bottleGeom, stdMat(COLOR_AVIONICS)), 's_ivb_copv');
      b.position.set(Math.cos(a) * (innerR * 0.55), y3Base + 11, Math.sin(a) * (innerR * 0.55));
      root.add(b);
      meshes.push(b);
    }

    const harness = tag(new THREE.Mesh(new THREE.TorusGeometry(innerR * 0.62, 0.07, 10, 64), stdMat(0xffffff)), 'wiring_harness');
    harness.rotation.x = Math.PI / 2;
    harness.position.y = y3Base + 12;
    root.add(harness);
    meshes.push(harness);
  }

  // Stage 3 single engine
  {
    const chamber = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.95, 1.7, 22, 1), stdMat(COLOR_STRUCT)), 'stage3_engine');
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
    const sm = tag(new THREE.Mesh(new THREE.CylinderGeometry(R3 * 0.72, R3 * 0.72, 10, 40, 1), stdMat(0xd7ddff)), 'service_module');
    sm.position.y = y3Top + 5.0;
    root.add(sm);
    meshes.push(sm);

    const cm = tag(new THREE.Mesh(new THREE.ConeGeometry(R3 * 0.68, 6.2, 40, 1), stdMat(0xffd36a)), 'command_module');
    cm.position.y = y3Top + 10 + 3.1;
    root.add(cm);
    meshes.push(cm);

    // LES tower
    const towerMat = stdMat(0xf2f5ff);
    const legGeom = new THREE.CylinderGeometry(0.12, 0.12, 10.5, 10, 1);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const leg = tag(new THREE.Mesh(legGeom, towerMat.clone()), 'les');
      leg.position.set(Math.cos(a) * 0.55, y3Top + 10 + 6.2 + 5.0, Math.sin(a) * 0.55);
      root.add(leg);
      meshes.push(leg);
    }

    const cap = tag(new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.2, 22, 1), stdMat(0x0b0f1a)), 'les');
    cap.position.y = y3Top + 10 + 6.2 + 10.8;
    root.add(cap);
    meshes.push(cap);
  }

  root.rotation.y = 0.45;

  return { root, meshes };
}
