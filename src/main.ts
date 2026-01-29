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
};

const gui = new GUI({ width: 320, title: 'Controls' });
gui.add(state, 'autoRotate').name('Auto rotate');
gui.add(state, 'rotateSpeed', 0, 2, 0.01).name('Rotate speed');
gui.add(state, 'explode', 0, 1, 0.01).name('Explode view');

// Simple explode view: offsets groups along Y
const explodeOffsets = new Map<string, number>([
  ['engine_cluster', 0],
  ['stage1_tank', 0],
  ['interstage', 0],
  ['stage2_tank', 0],
  ['payload_fairing', 0],
  ['payload', 0],
  ['nose_cone', 0],
  ['fins', 0]
]);

function applyExplode(t: number) {
  // We use mesh names / partIds; spread them upward
  for (const m of rocket.meshes) {
    const id = (m.userData.partId as string) || m.name;
    if (!explodeOffsets.has(id)) continue;

    let k = 0;
    switch (id) {
      case 'engine_cluster': k = -10; break;
      case 'fins': k = -3; break;
      case 'stage1_tank': k = 0; break;
      case 'interstage': k = 8; break;
      case 'stage2_tank': k = 18; break;
      case 'payload_fairing': k = 28; break;
      case 'payload': k = 32; break;
      case 'nose_cone': k = 40; break;
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
