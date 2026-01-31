import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import GUI from 'lil-gui';
import { createRocket } from './rocket';
import { PARTS_BY_ID } from './partsData';

const app = document.getElementById('app')!;
const info = document.getElementById('info')!;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x070b14, 90, 260);

// Global environment lighting (IBL)
{
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  scene.environment = envTex;
  pmrem.dispose();
}

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(60, 45, 90);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 25;
controls.maxDistance = 400;
controls.target.set(0, 45, 0);
controls.update();

// Background stars
{
  const starGeom = new THREE.BufferGeometry();
  const N = 1800;
  const positions = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 900 * (0.6 + Math.random() * 0.4);
    const theta = Math.random() * Math.PI * 2;
    const u = Math.random() * 2 - 1;
    const s = Math.sqrt(1 - u * u);
    positions[i * 3 + 0] = r * s * Math.cos(theta);
    positions[i * 3 + 1] = r * u;
    positions[i * 3 + 2] = r * s * Math.sin(theta);
  }
  starGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starMat = new THREE.PointsMaterial({ color: 0x9fb0ff, size: 1.2, transparent: true, opacity: 0.55 });
  scene.add(new THREE.Points(starGeom, starMat));
}

// Lights
scene.add(new THREE.AmbientLight(0x8aa2ff, 0.35));
const key = new THREE.DirectionalLight(0xffffff, 1.1);
key.position.set(120, 140, 80);
scene.add(key);

// Ground reference (subtle)
{
  const grid = new THREE.GridHelper(260, 52, 0x142048, 0x0d1430);
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.22;
  grid.position.y = 0;
  scene.add(grid);
}

const rocket = createRocket();
scene.add(rocket.root);

// --- Flow visualization (how it works) ---
// Animated points along simplified propellant paths.
// These are conceptual, not physically accurate.

type StageKey = 'S-IC' | 'S-II' | 'S-IVB';

type FlowPath = {
  stage: StageKey;
  id: string;
  color: number;
  curve: THREE.CatmullRomCurve3;
  points: THREE.Points;
  speed: number;
};

function makeFlowPoints(curve: THREE.CatmullRomCurve3, color: number) {
  const N = 120;
  const geom = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3);
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color,
    size: 0.6,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    depthTest: false
  });
  const pts = new THREE.Points(geom, mat);
  pts.frustumCulled = false;
  return { pts, N, pos };
}

// Build a few representative curves in model space.
const flowPaths: FlowPath[] = [];
{
  // Stage 1: tank area down to engine bay
  const s1_lox = new THREE.CatmullRomCurve3([
    new THREE.Vector3(4.5, 40, 0),
    new THREE.Vector3(5.2, 26, 0),
    new THREE.Vector3(4.0, 14, 0),
    new THREE.Vector3(1.5, 8, 0),
    new THREE.Vector3(0, 4.5, 0)
  ]);
  const s1_fuel = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4.5, 18, 0),
    new THREE.Vector3(-5.2, 14, 0),
    new THREE.Vector3(-4.0, 10, 0),
    new THREE.Vector3(-1.5, 8, 0),
    new THREE.Vector3(0, 4.5, 0)
  ]);

  for (const [id, curve, color, speed] of [
    ['s1_lox', s1_lox, 0x7fd0ff, 0.35],
    ['s1_fuel', s1_fuel, 0xffb86b, 0.35]
  ] as const) {
    const { pts, N, pos } = makeFlowPoints(curve, color);
    pts.visible = false;
    scene.add(pts);
    flowPaths.push({ stage: 'S-IC', id, color, curve, points: pts, speed });
    // stash buffer for updates
    (pts.userData as any).N = N;
    (pts.userData as any).pos = pos;
  }

  // Stage 2
  const s2_lox = new THREE.CatmullRomCurve3([
    new THREE.Vector3(3.7, 86, 0),
    new THREE.Vector3(4.2, 78, 0),
    new THREE.Vector3(3.2, 70, 0),
    new THREE.Vector3(1.2, 66, 0)
  ]);
  const s2_fuel = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.7, 76, 0),
    new THREE.Vector3(-4.2, 72, 0),
    new THREE.Vector3(-3.2, 68, 0),
    new THREE.Vector3(-1.2, 66, 0)
  ]);

  for (const [id, curve, color, speed] of [
    ['s2_lox', s2_lox, 0x7fd0ff, 0.28],
    ['s2_fuel', s2_fuel, 0xd7ddff, 0.28]
  ] as const) {
    const { pts, N, pos } = makeFlowPoints(curve, color);
    pts.visible = false;
    scene.add(pts);
    flowPaths.push({ stage: 'S-II', id, color, curve, points: pts, speed });
    (pts.userData as any).N = N;
    (pts.userData as any).pos = pos;
  }

  // Stage 3
  const s3_lox = new THREE.CatmullRomCurve3([
    new THREE.Vector3(3.1, 124, 0),
    new THREE.Vector3(3.3, 118, 0),
    new THREE.Vector3(2.0, 112, 0),
    new THREE.Vector3(0.8, 106, 0)
  ]);
  const s3_fuel = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.1, 116, 0),
    new THREE.Vector3(-3.3, 112, 0),
    new THREE.Vector3(-2.0, 108, 0),
    new THREE.Vector3(-0.8, 106, 0)
  ]);

  for (const [id, curve, color, speed] of [
    ['s3_lox', s3_lox, 0x7fd0ff, 0.22],
    ['s3_fuel', s3_fuel, 0xd7ddff, 0.22]
  ] as const) {
    const { pts, N, pos } = makeFlowPoints(curve, color);
    pts.visible = false;
    scene.add(pts);
    flowPaths.push({ stage: 'S-IVB', id, color, curve, points: pts, speed });
    (pts.userData as any).N = N;
    (pts.userData as any).pos = pos;
  }
}

// Selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selected: THREE.Mesh | null = null;

function setInfo(partId: string | null) {
  if (!partId) {
    info.innerHTML = '<div class="muted">Click a part to see details.</div>';
    return;
  }
  const spec = PARTS_BY_ID.get(partId);
  if (!spec) {
    info.innerHTML = `<div class="name">${escapeHtml(partId)}</div>`;
    return;
  }
  info.innerHTML = `
    <div class="name">${escapeHtml(spec.name)}</div>
    ${spec.desc.map(d => `<div>• ${escapeHtml(d)}</div>`).join('')}
    <div class="muted" style="margin-top:6px">id: ${escapeHtml(spec.id)}</div>
  `;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>\"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

function clearHighlight() {
  if (!selected) return;
  const mat = selected.material;
  if (mat instanceof THREE.MeshStandardMaterial) {
    mat.emissive.setHex(0x000000);
    mat.emissiveIntensity = 0;
  }
  selected = null;
}

function highlight(mesh: THREE.Mesh) {
  clearHighlight();
  selected = mesh;
  const mat = mesh.material;
  if (mat instanceof THREE.MeshStandardMaterial) {
    mat.emissive.setHex(0x57d0ff);
    mat.emissiveIntensity = 0.55;
  }
}

renderer.domElement.addEventListener('pointerdown', (ev) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -(((ev.clientY - rect.top) / rect.height) * 2 - 1);
  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObjects(rocket.meshes, false);
  if (!hits.length) {
    clearHighlight();
    setInfo(null);
    return;
  }

  const hit = hits[0].object as THREE.Mesh;
  const partId = (hit.userData.partId as string) || hit.name;
  highlight(hit);
  setInfo(partId);
});

// GUI
const state = {
  autoRotate: true,
  rotateSpeed: 0.35,
  explode: 0,
  cutaway: 0.0,
  flow: false,
  activeStage: 'S-IC' as 'S-IC' | 'S-II' | 'S-IVB'
};

const gui = new GUI({ width: 320, title: 'Controls' });
gui.add(state, 'autoRotate').name('Auto rotate');
gui.add(state, 'rotateSpeed', 0, 2, 0.01).name('Rotate speed');
gui.add(state, 'explode', 0, 1, 0.01).name('Explode view');
gui.add(state, 'cutaway', 0, 1, 0.01).name('Cutaway');
gui.add(state, 'flow').name('Flow (how it works)');
gui.add(state, 'activeStage', ['S-IC', 'S-II', 'S-IVB']).name('Active stage');

// Simple explode view: offsets groups along Y
const explodeOffsets = new Map<string, number>([
  // engines
  ['stage1_engines', 0],
  ['stage2_engines', 0],
  ['stage3_engine', 0],

  // shells / structures
  ['s_ic_shell', 0],
  ['interstage_1_2', 0],
  ['s_ii_shell', 0],
  ['interstage_2_3', 0],
  ['instrument_unit', 0],
  ['s_ivb_shell', 0],

  // spacecraft
  ['service_module', 0],
  ['command_module', 0],
  ['les', 0],

  // stage 1 internals
  ['s_ic_fuel_tank', 0],
  ['s_ic_lox_tank', 0],
  ['s_ic_feed_lines', 0],
  ['s_ic_valves', 0],
  ['s_ic_turbopumps', 0],
  ['s_ic_gas_generator', 0],
  ['s_ic_thrust_structure', 0],
  ['s_ic_gimbals', 0],
  ['s_ic_copv', 0],

  // stage 2 internals
  ['s_ii_lh2_tank', 0],
  ['s_ii_lox_tank', 0],
  ['s_ii_feed_lines', 0],
  ['s_ii_copv', 0],

  // stage 3 internals
  ['s_ivb_lh2_tank', 0],
  ['s_ivb_lox_tank', 0],
  ['s_ivb_feed_lines', 0],
  ['s_ivb_copv', 0],

  // avionics
  ['iu_imu', 0],
  ['iu_flight_computer', 0],
  ['iu_power_bus', 0],
  ['wiring_harness', 0]
]);

function applyExplode(t: number) {
  // We use mesh names / partIds; spread them upward
  for (const m of rocket.meshes) {
    const id = (m.userData.partId as string) || m.name;
    if (!explodeOffsets.has(id)) continue;

    let k = 0;
    switch (id) {
      // engines move down a bit
      case 'stage1_engines':
        k = -10;
        break;
      case 'stage2_engines':
        k = -6;
        break;
      case 'stage3_engine':
        k = -4;
        break;

      // stage 1 block
      case 's_ic_shell':
      case 's_ic_fuel_tank':
      case 's_ic_lox_tank':
      case 's_ic_feed_lines':
      case 's_ic_valves':
      case 's_ic_turbopumps':
      case 's_ic_gas_generator':
      case 's_ic_thrust_structure':
      case 's_ic_gimbals':
      case 's_ic_copv':
      case 'wiring_harness':
        k = 0;
        break;

      // stage 2 block
      case 'interstage_1_2':
        k = 10;
        break;
      case 's_ii_shell':
      case 's_ii_lh2_tank':
      case 's_ii_lox_tank':
      case 's_ii_feed_lines':
      case 's_ii_copv':
        k = 18;
        break;

      // stage 3 block
      case 'interstage_2_3':
        k = 28;
        break;
      case 'instrument_unit':
      case 'iu_imu':
      case 'iu_flight_computer':
      case 'iu_power_bus':
        k = 34;
        break;
      case 's_ivb_shell':
      case 's_ivb_lh2_tank':
      case 's_ivb_lox_tank':
      case 's_ivb_feed_lines':
      case 's_ivb_copv':
        k = 38;
        break;

      // spacecraft
      case 'service_module':
        k = 52;
        break;
      case 'command_module':
        k = 58;
        break;
      case 'les':
        k = 66;
        break;
    }

    // store base pos once
    if (m.userData.baseY === undefined) m.userData.baseY = m.position.y;
    m.position.y = m.userData.baseY + k * t;
  }
}

// loop
let last = performance.now();
function tick(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  if (state.autoRotate) {
    rocket.root.rotation.y += dt * state.rotateSpeed;
  }

  applyExplode(state.explode);

  // Cutaway: make exterior shells more transparent to reveal internals
  for (const m of rocket.meshes) {
    const id = (m.userData.partId as string) || m.name;
    const mat = m.material;
    if (!(mat instanceof THREE.MeshStandardMaterial)) continue;

    const isShell =
      id === 's_ic_shell' ||
      id === 's_ii_shell' ||
      id === 's_ivb_shell' ||
      id === 'interstage_1_2' ||
      id === 'interstage_2_3' ||
      id === 'instrument_unit';

    if (isShell) {
      mat.transparent = state.cutaway > 0;
      mat.opacity = 1 - 0.85 * state.cutaway;
    }
  }

  // Flow update
  for (const fp of flowPaths) {
    const active = state.flow && fp.stage === state.activeStage;
    fp.points.visible = active;
    if (!active) continue;

    const N = (fp.points.userData as any).N as number;
    const pos = (fp.points.userData as any).pos as Float32Array;
    const t0 = (now * 0.0001 * fp.speed) % 1;

    for (let i = 0; i < N; i++) {
      const tt = (t0 + i / N) % 1;
      const p = fp.curve.getPointAt(tt);
      pos[i * 3 + 0] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;
    }

    (fp.points.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
