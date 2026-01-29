import * as THREE from 'three';

export type RocketBuild = {
  root: THREE.Object3D;
  meshes: THREE.Mesh[];
};

function stdMat(color: number) {
  const m = new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.1 });
  m.envMapIntensity = 1.1;
  return m;
}

function tag(mesh: THREE.Mesh, id: string) {
  mesh.userData.partId = id;
  mesh.name = id;
  return mesh;
}

// Generic educational rocket built from primitives.
export function createRocket(): RocketBuild {
  const root = new THREE.Object3D();
  const meshes: THREE.Mesh[] = [];

  // Dimensions (scene units)
  const R = 6;

  // Stage 1 outer shell
  {
    const geom = new THREE.CylinderGeometry(R, R, 40, 48, 1);
    const mat = stdMat(0x9fb0ff);
    const mesh = tag(new THREE.Mesh(geom, mat), 'stage1_shell');
    mesh.position.y = 20;
    root.add(mesh);
    meshes.push(mesh);
  }

  // Stage 1 internal tanks (generic: LOX on top, fuel below)
  {
    const innerR = R * 0.82;

    const fuel = tag(new THREE.Mesh(new THREE.CylinderGeometry(innerR, innerR, 18, 40, 1), stdMat(0xffb86b)), 'stage1_fuel_tank');
    fuel.position.y = 11;
    root.add(fuel);
    meshes.push(fuel);

    const bulk = tag(new THREE.Mesh(new THREE.CylinderGeometry(innerR * 1.01, innerR * 1.01, 1.2, 40, 1), stdMat(0x5567aa)), 'common_bulkhead');
    bulk.position.y = 20;
    root.add(bulk);
    meshes.push(bulk);

    const lox = tag(new THREE.Mesh(new THREE.CylinderGeometry(innerR, innerR, 18, 40, 1), stdMat(0x7fd0ff)), 'stage1_lox_tank');
    lox.position.y = 29;
    root.add(lox);
    meshes.push(lox);

    // domes (simplified caps)
    const domeMat = stdMat(0xd7ddff);
    const domeTop = tag(new THREE.Mesh(new THREE.SphereGeometry(innerR, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), domeMat), 'tank_domes');
    domeTop.scale.y = 0.45;
    domeTop.position.y = 38.5;
    root.add(domeTop);
    meshes.push(domeTop);

    const domeBottom = tag(new THREE.Mesh(new THREE.SphereGeometry(innerR, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), domeMat.clone()), 'tank_domes');
    domeBottom.scale.y = 0.45;
    domeBottom.position.y = 1.5;
    root.add(domeBottom);
    meshes.push(domeBottom);
  }

  // Interstage (slightly narrower)
  {
    const geom = new THREE.CylinderGeometry(R * 0.92, R * 0.92, 7, 42, 1);
    const mesh = tag(new THREE.Mesh(geom, stdMat(0x5567aa)), 'interstage');
    mesh.position.y = 40 + 3.5;
    root.add(mesh);
    meshes.push(mesh);
  }

  // Stage 2 outer shell
  {
    const geom = new THREE.CylinderGeometry(R * 0.8, R * 0.8, 22, 42, 1);
    const mesh = tag(new THREE.Mesh(geom, stdMat(0x90a4ff)), 'stage2_shell');
    mesh.position.y = 40 + 7 + 11;
    root.add(mesh);
    meshes.push(mesh);
  }

  // Stage 2 internal tanks (generic)
  {
    const r2 = R * 0.8 * 0.82;
    const baseY = 40 + 7;

    const fuel2 = tag(new THREE.Mesh(new THREE.CylinderGeometry(r2, r2, 9, 36, 1), stdMat(0xffb86b)), 'stage2_fuel_tank');
    fuel2.position.y = baseY + 5.5;
    root.add(fuel2);
    meshes.push(fuel2);

    const bulk2 = tag(new THREE.Mesh(new THREE.CylinderGeometry(r2 * 1.01, r2 * 1.01, 0.9, 36, 1), stdMat(0x5567aa)), 'common_bulkhead');
    bulk2.position.y = baseY + 11;
    root.add(bulk2);
    meshes.push(bulk2);

    const lox2 = tag(new THREE.Mesh(new THREE.CylinderGeometry(r2, r2, 9, 36, 1), stdMat(0x7fd0ff)), 'stage2_lox_tank');
    lox2.position.y = baseY + 16.5;
    root.add(lox2);
    meshes.push(lox2);

    // avionics bay (ring)
    const av = tag(new THREE.Mesh(new THREE.TorusGeometry(r2 * 0.9, 0.6, 12, 48), stdMat(0x47ff9a)), 'avionics_bay');
    av.rotation.x = Math.PI / 2;
    av.position.y = baseY + 20.5;
    root.add(av);
    meshes.push(av);

    const bat = tag(new THREE.Mesh(new THREE.BoxGeometry(r2 * 0.8, 1.6, r2 * 0.6), stdMat(0xff6b8a)), 'battery_pack');
    bat.position.y = baseY + 19.2;
    root.add(bat);
    meshes.push(bat);

    // RCS (tiny pods)
    const rcsMat = stdMat(0xffffff);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const pod = tag(new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), rcsMat.clone()), 'rcs_thrusters');
      pod.position.set(Math.cos(a) * (r2 + 1.3), baseY + 18.5, Math.sin(a) * (r2 + 1.3));
      root.add(pod);
      meshes.push(pod);
    }
  }

  // Payload fairing
  {
    const geom = new THREE.CylinderGeometry(R * 0.82, R * 0.82, 16, 42, 1);
    const mesh = tag(new THREE.Mesh(geom, stdMat(0xf2f5ff)), 'payload_fairing');
    mesh.position.y = 40 + 7 + 22 + 8;
    root.add(mesh);
    meshes.push(mesh);
  }

  // Payload adapter (ring)
  {
    const adapter = tag(new THREE.Mesh(new THREE.TorusGeometry(R * 0.45, 0.6, 12, 64), stdMat(0x5567aa)), 'payload_adapter');
    adapter.rotation.x = Math.PI / 2;
    adapter.position.y = 40 + 7 + 22 + 1.5;
    root.add(adapter);
    meshes.push(adapter);
  }

  // Nose cone
  {
    const geom = new THREE.ConeGeometry(R * 0.82, 12, 48, 1);
    const mesh = tag(new THREE.Mesh(geom, stdMat(0xf7d36a)), 'nose_cone');
    mesh.position.y = 40 + 7 + 22 + 16 + 6;
    root.add(mesh);
    meshes.push(mesh);
  }

  // Payload (inside fairing, placeholder)
  {
    const geom = new THREE.CylinderGeometry(R * 0.35, R * 0.35, 10, 24, 1);
    const mat = stdMat(0xff6b8a);
    mat.roughness = 0.55;
    const mesh = tag(new THREE.Mesh(geom, mat), 'payload');
    mesh.position.y = 40 + 7 + 22 + 8;
    root.add(mesh);
    meshes.push(mesh);
  }

  // Engine section (bottom): cluster + simplified gimbal/turbopump/feed lines
  {
    const cluster = new THREE.Object3D();
    cluster.name = 'engine_cluster:group';

    // gimbal mount ring
    const gimbal = tag(new THREE.Mesh(new THREE.TorusGeometry(R * 0.45, 0.55, 14, 64), stdMat(0x8aa2ff)), 'gimbal_mount');
    gimbal.rotation.x = Math.PI / 2;
    gimbal.position.y = 5.0;
    root.add(gimbal);
    meshes.push(gimbal);

    // feed lines (two pipes)
    const pipeMat = stdMat(0xd7ddff);
    const pipeGeom = new THREE.CylinderGeometry(0.35, 0.35, 18, 16, 1);
    for (let i = 0; i < 2; i++) {
      const s = i === 0 ? 1 : -1;
      const pipe = tag(new THREE.Mesh(pipeGeom, pipeMat.clone()), 'feed_lines');
      pipe.position.set(s * (R * 0.35), 12, 0);
      pipe.rotation.z = 0.2 * s;
      root.add(pipe);
      meshes.push(pipe);
    }

    // turbopump block
    {
      const pump = tag(new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 2.6), stdMat(0x47ff9a)), 'engine_turbopump');
      pump.position.y = 6.6;
      root.add(pump);
      meshes.push(pump);
    }

    const n = 7;
    const radius = R * 0.55;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const x = Math.cos(a) * radius * 0.55;
      const z = Math.sin(a) * radius * 0.55;

      // thrust chamber
      const chamber = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 2.2, 20, 1), stdMat(0x3b415a)), 'engine_thrust_chamber');
      chamber.position.set(x, 2.9, z);
      cluster.add(chamber);
      meshes.push(chamber);

      // nozzle
      const cone = tag(new THREE.Mesh(new THREE.ConeGeometry(1.15, 3.2, 20, 1), stdMat(0x2a2f45)), 'engine_cluster');
      cone.position.set(x, 0.5, z);
      cone.rotation.x = Math.PI;
      cluster.add(cone);
      meshes.push(cone);
    }

    cluster.position.y = 0;
    root.add(cluster);
  }

  // Stage separation system (simplified ring)
  {
    const sep = tag(new THREE.Mesh(new THREE.TorusGeometry(R * 0.92, 0.45, 12, 64), stdMat(0xff6b8a)), 'stage_separation');
    sep.rotation.x = Math.PI / 2;
    sep.position.y = 40 + 1.2;
    root.add(sep);
    meshes.push(sep);
  }

  // Pressurant bottles (COPVs) - simplified spheres inside stage 1
  {
    const bottleMat = stdMat(0x47ff9a);
    const bottleGeom = new THREE.SphereGeometry(1.2, 20, 14);
    for (let i = 0; i < 3; i++) {
      const b = tag(new THREE.Mesh(bottleGeom, bottleMat.clone()), 'pressurant_bottles');
      b.position.set(-2.2 + i * 2.2, 26, 2.2);
      root.add(b);
      meshes.push(b);
    }
  }

  // Fins (simple plates)
  {
    const finMat = stdMat(0xffffff);
    finMat.roughness = 0.9;
    const finGeom = new THREE.BoxGeometry(0.4, 6.0, 3.5);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const x = Math.cos(a) * (R + 0.1);
      const z = Math.sin(a) * (R + 0.1);
      const mesh = tag(new THREE.Mesh(finGeom, finMat.clone()), 'fins');
      mesh.position.set(x, 7, z);
      mesh.rotation.y = a;
      root.add(mesh);
      meshes.push(mesh);
    }
  }

  // slight tilt for nicer composition
  root.rotation.y = 0.35;

  return { root, meshes };
}
