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

  // Stage 1 tank (bottom large cylinder)
  {
    const geom = new THREE.CylinderGeometry(R, R, 40, 48, 1);
    const mesh = tag(new THREE.Mesh(geom, stdMat(0x9fb0ff)), 'stage1_tank');
    mesh.position.y = 20;
    root.add(mesh);
    meshes.push(mesh);
  }

  // Interstage (slightly narrower)
  {
    const geom = new THREE.CylinderGeometry(R * 0.92, R * 0.92, 7, 42, 1);
    const mesh = tag(new THREE.Mesh(geom, stdMat(0x5567aa)), 'interstage');
    mesh.position.y = 40 + 3.5;
    root.add(mesh);
    meshes.push(mesh);
  }

  // Stage 2 tank
  {
    const geom = new THREE.CylinderGeometry(R * 0.8, R * 0.8, 22, 42, 1);
    const mesh = tag(new THREE.Mesh(geom, stdMat(0x7fd0ff)), 'stage2_tank');
    mesh.position.y = 40 + 7 + 11;
    root.add(mesh);
    meshes.push(mesh);
  }

  // Payload fairing
  {
    const geom = new THREE.CylinderGeometry(R * 0.82, R * 0.82, 16, 42, 1);
    const mesh = tag(new THREE.Mesh(geom, stdMat(0xf2f5ff)), 'payload_fairing');
    mesh.position.y = 40 + 7 + 22 + 8;
    root.add(mesh);
    meshes.push(mesh);
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

  // Engine cluster (bottom)
  {
    const cluster = new THREE.Object3D();
    cluster.name = 'engine_cluster:group';

    const n = 7;
    const radius = R * 0.55;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const x = Math.cos(a) * radius * 0.55;
      const z = Math.sin(a) * radius * 0.55;

      const geom = new THREE.CylinderGeometry(0.6, 1.0, 4.6, 20, 1);
      const mesh = tag(new THREE.Mesh(geom, stdMat(0x3b415a)), 'engine_cluster');
      mesh.position.set(x, 1.8, z);
      cluster.add(mesh);
      meshes.push(mesh);

      // nozzle flare
      const cone = new THREE.Mesh(new THREE.ConeGeometry(1.15, 2.2, 20, 1), stdMat(0x2a2f45));
      cone.position.set(x, 0.0, z);
      cone.rotation.x = Math.PI;
      cluster.add(cone);
    }

    cluster.position.y = 0;
    root.add(cluster);
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
