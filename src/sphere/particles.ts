import * as THREE from 'three'

// ── Constants ─────────────────────────────────────────────────────────────────
const N = 5200
const R = 2.0
const SPRING = 0.08
const DAMP = 0.86
const REPEL_STR = 0.88
const REPEL_RAD = 1.0
const SWAY_AMP = 0.06
const SWAY_F1 = 0.31
const SWAY_F2 = 0.19

// ── UI Data & Types ───────────────────────────────────────────────────────────
interface PlanetSpec {
  label: string;
  val: string;
}

interface PlanetInfo {
  title: string;
  desc: string;
  glowColor: string;
  accentColor: string;
  specs: PlanetSpec[];
}

const planetData: Record<string, PlanetInfo> = {
  nebula: {
    title: "STELLAR NURSERY",
    desc: "A vast cloud of dust and gas; the birthplace of stars.",
    glowColor: "#16102b",
    accentColor: "#9d7cff",
    specs: [
      { label: "COMPOSITION", val: "H, He, DUST" },
      { label: "TEMP", val: "-260°C TO 10,000°C" },
      { label: "SCALE", val: "LIGHT-YEARS" }
    ]
  },
  mercury: {
    title: "MERCURY",
    desc: "The smallest planet, scorched and closest to our sun.",
    glowColor: "#1a1310",
    accentColor: "#b8b8b8",
    specs: [
      { label: "RADIUS", val: "2,439 KM" },
      { label: "DIST", val: "58M KM" },
      { label: "ORBIT", val: "88 DAYS" }
    ]
  },
  venus: {
    title: "VENUS",
    desc: "A toxic atmosphere causing a runaway greenhouse effect.",
    glowColor: "#1f1606",
    accentColor: "#ffc16b",
    specs: [
      { label: "RADIUS", val: "6,052 KM" },
      { label: "DIST", val: "108M KM" },
      { label: "SURFACE TEMP", val: "465°C" }
    ]
  },
  earth: {
    title: "EARTH",
    desc: "Our home, the only known harbor of life.",
    glowColor: "#06131c",
    accentColor: "#6bb0ff",
    specs: [
      { label: "RADIUS", val: "6,371 KM" },
      { label: "DIST", val: "150M KM" },
      { label: "AGE", val: "4.5B YEARS" }
    ]
  },
  mars: {
    title: "MARS",
    desc: "The Red Planet, dusty, cold, and desert-like.",
    glowColor: "#1f0804",
    accentColor: "#ff5e40",
    specs: [
      { label: "RADIUS", val: "3,390 KM" },
      { label: "DIST", val: "228M KM" },
      { label: "MOONS", val: "2" }
    ]
  },
  jupiter: {
    title: "JUPITER",
    desc: "A massive gas giant, the largest planet in our system.",
    glowColor: "#1c120a",
    accentColor: "#ffaa70",
    specs: [
      { label: "RADIUS", val: "69,911 KM" },
      { label: "DIST", val: "778M KM" },
      { label: "MOONS", val: "95" }
    ]
  },
  saturn: {
    title: "SATURN",
    desc: "Adorned with a dazzling, complex ring system of ice and rock.",
    glowColor: "#1a1708",
    accentColor: "#ffe170",
    specs: [
      { label: "RADIUS", val: "58,232 KM" },
      { label: "DIST", val: "1.4B KM" },
      { label: "MAIN RINGS", val: "7" }
    ]
  },
  uranus: {
    title: "URANUS",
    desc: "An ice giant that rotates almost completely on its side.",
    glowColor: "#061517",
    accentColor: "#70fffa",
    specs: [
      { label: "RADIUS", val: "25,362 KM" },
      { label: "DIST", val: "2.9B KM" },
      { label: "TILT", val: "97.7°" }
    ]
  },
  neptune: {
    title: "NEPTUNE",
    desc: "Dark, incredibly cold, and whipped by supersonic winds.",
    glowColor: "#070a24",
    accentColor: "#708cff",
    specs: [
      { label: "RADIUS", val: "24,622 KM" },
      { label: "DIST", val: "4.5B KM" },
      { label: "WIND SPEED", val: "2,000 KM/H" }
    ]
  }
}

const hudTitle = document.getElementById('hud-title') as HTMLElement | null
const hudDesc = document.getElementById('hud-desc') as HTMLElement | null
const hudSpecs = document.getElementById('hud-specs') as HTMLElement | null
const bgGlow = document.getElementById('bg-glow') as HTMLElement | null

//Text Shape generator
const textPoints: { x: number, y: number }[] = [];
function generateTextPixels() {
  const c = document.createElement('canvas');
  c.width = 200; c.height = 80;
  const ctx = c.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 200, 80);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 65px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('xee', 100, 45);

  const data = ctx.getImageData(0, 0, 200, 80).data;
  for (let y = 0; y < 80; y++) {
    for (let x = 0; x < 200; x++) {
      // If the pixel is white, save its coordinate
      if (data[(y * 200 + x) * 4] > 128) {
        textPoints.push({ x: (x - 100) * 0.04, y: -(y - 40) * 0.04 });
      }
    }
  }
}
generateTextPixels();

export function updateText(str: string): void {
  textPoints.length = 0
  const c = document.createElement('canvas')
  c.width = 200; c.height = 80
  const ctx = c.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, 200, 80)
  ctx.fillStyle = 'white'
  ctx.font = 'bold 65px "Inter", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(str || 'XEE', 100, 45)
  const data = ctx.getImageData(0, 0, 200, 80).data
  for (let y = 0; y < 80; y++)
    for (let x = 0; x < 200; x++)
      if (data[(y * 200 + x) * 4] > 128)
        textPoints.push({ x: (x - 100) * 0.04, y: -(y - 40) * 0.04 })
  // Reset so morphTo('text') fires even if text shape is already active
  currentPlanet = ''
}

export function refreshText(str: string): void {
  // Rebuild the pixel map
  textPoints.length = 0
  const c = document.createElement('canvas')
  c.width = 200; c.height = 80
  const ctx = c.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, 200, 80)
  ctx.fillStyle = 'white'
  ctx.font = 'bold 65px "Inter", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(str || 'XEE', 100, 45)
  const data = ctx.getImageData(0, 0, 200, 80).data
  for (let y = 0; y < 80; y++)
    for (let x = 0; x < 200; x++)
      if (data[(y * 200 + x) * 4] > 128)
        textPoints.push({ x: (x - 100) * 0.04, y: -(y - 40) * 0.04 })

  // Only retarget particles if already in text mode (no burst, just smooth spring)
  if (currentPlanet !== 'text') return
  const colTmp = new THREE.Color(0x222222)
  for (let i = 0; i < N; i++) {
    const ix = i * 3
    if (textPoints.length > 0) {
      const pt = textPoints[Math.floor(Math.random() * textPoints.length)]
      targetOrig[ix] = pt.x + (Math.random() - 0.5) * 0.05
      targetOrig[ix + 1] = pt.y + (Math.random() - 0.5) * 0.05
      targetOrig[ix + 2] = (Math.random() - 0.5) * 0.3
    }
    targetCols[ix] = colTmp.r
    targetCols[ix + 1] = colTmp.g
    targetCols[ix + 2] = colTmp.b
  }
}

const root = document.documentElement

let typeTimeouts: number[] = []

function clearTyper(): void {
  typeTimeouts.forEach(clearTimeout)
  typeTimeouts = []
}

function typeText(element: HTMLElement, text: string, speed: number, callback?: () => void): void {
  element.innerHTML = ""
  let i = 0
  function nextChar() {
    if (i < text.length) {
      const cursor = Math.random() > 0.5 ? '█' : '<span style="opacity:0">█</span>'
      element.innerHTML = text.substring(0, i + 1) + cursor
      i++
      typeTimeouts.push(window.setTimeout(nextChar, speed))
    } else {
      element.innerHTML = text
      if (callback) callback()
    }
  }
  nextChar()
}

function animateFact(planetName: string): void {
  clearTyper()
  const data = planetData[planetName]
  if (!data) return

  // Sync the background ambient glow
  if (bgGlow) bgGlow.style.color = data.glowColor

  // Sync the HUD text glow/accent color via CSS Variables
  if (root) root.style.setProperty('--accent', data.accentColor)

  if (hudTitle) hudTitle.innerHTML = ""
  if (hudDesc) hudDesc.innerHTML = ""
  if (hudSpecs) {
    hudSpecs.innerHTML = ""
    hudSpecs.classList.remove('visible')
  }

  if (hudTitle && hudDesc && hudSpecs) {
    typeText(hudTitle, data.title, 40, () => {
      typeText(hudDesc, data.desc, 20, () => {
        const specsHtml = data.specs.map(s =>
          `<div class="spec-item">${s.label} // <span>${s.val}</span></div>`
        ).join('')

        hudSpecs.innerHTML = specsHtml
        setTimeout(() => hudSpecs.classList.add('visible'), 50)
      })
    })
  }
}

// ── Renderer + scene setup ────────────────────────────────────────────────────
const canvas = document.getElementById('canvas') as HTMLCanvasElement
export const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

export const scene = new THREE.Scene()
export const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 200)
camera.position.z = 10

export function resize(): void {
  renderer.setSize(window.innerWidth, window.innerHeight, false)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)
resize()

// ── Particle buffers ──────────────────────────────────────────────────────────
const pos = new Float32Array(N * 3)
const orig = new Float32Array(N * 3)
const targetOrig = new Float32Array(N * 3)
const vel = new Float32Array(N * 3)
const sizes = new Float32Array(N)
const cols = new Float32Array(N * 3)
const targetCols = new Float32Array(N * 3)

const nA = new Float32Array(N * 3)
const nP = new Float32Array(N * 3)
const nF = new Float32Array(N * 3)

for (let i = 0; i < N; i++) {
  const r = R * (1.5 + Math.random() * 0.5)
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)

  pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
  pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
  pos[i * 3 + 2] = r * Math.cos(phi)

  orig[i * 3] = pos[i * 3]
  orig[i * 3 + 1] = pos[i * 3 + 1]
  orig[i * 3 + 2] = pos[i * 3 + 2]
  targetOrig[i * 3] = pos[i * 3]
  targetOrig[i * 3 + 1] = pos[i * 3 + 1]
  targetOrig[i * 3 + 2] = pos[i * 3 + 2]

  for (let a = 0; a < 3; a++) {
    nA[i * 3 + a] = 0.03 + Math.random() * 0.05
    nP[i * 3 + a] = Math.random() * Math.PI * 2
    nF[i * 3 + a] = 0.2 + Math.random() * 0.5
  }

  sizes[i] = 0.022 + Math.random() * 0.026
  cols[i * 3] = 0.5
  cols[i * 3 + 1] = 0.5
  cols[i * 3 + 2] = 1.0
  targetCols[i * 3] = cols[i * 3]
  targetCols[i * 3 + 1] = cols[i * 3 + 1]
  targetCols[i * 3 + 2] = cols[i * 3 + 2]
}

// ── Geometry + shader material ────────────────────────────────────────────────
const geo = new THREE.BufferGeometry()
geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
geo.setAttribute('color', new THREE.BufferAttribute(cols, 3))

const mat = new THREE.ShaderMaterial({
  vertexColors: true,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  uniforms: { uPR: { value: renderer.getPixelRatio() } },
  vertexShader: `
    attribute float aSize;
    varying vec3  vCol;
    varying float vA;
    uniform float uPR;
    void main(){
      vCol = color;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
      vA = length(position) < 1.0 ? 0.45 : 0.90;
      gl_PointSize = aSize * uPR * 800.0 / -mv.z;
    }`,
  fragmentShader: `
    varying vec3  vCol;
    varying float vA;
    void main(){
      float d = length(gl_PointCoord - vec2(0.5));
      if(d > 0.5) discard;
      
      // Kept the soft edge, but removed the harsh exponential falloff
      float a = smoothstep(0.5, 0.1, d) * vA; 
      
      // Boosted the final alpha multiplier from 0.8 to 1.2 to make them pop
      gl_FragColor = vec4(vCol, a * 2.8); 
    }`,
})

export const group = new THREE.Group()
group.add(new THREE.Points(geo, mat))
scene.add(group)

// ── Helpers ───────────────────────────────────────────────────────────────────
function spherical(r: number, theta: number, phi: number) {
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ]
}

// ── Morphology ────────────────────────────────────────────────────────────────
let currentPlanet: string = ''

export function morphTo(planetName: string): void {
  if (currentPlanet === planetName) return
  currentPlanet = planetName

  const colTmp = new THREE.Color()

  // Trigger the UI animation!
  animateFact(planetName)

  for (let i = 0; i < N; i++) {
    const isSurface = i < N * 0.6
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const ix = i * 3, iy = ix + 1, iz = ix + 2
    let r

    // only twitch on planet switch
    const cx = pos[ix], cy = pos[iy], cz = pos[iz]
    const len = Math.sqrt(cx * cx + cy * cy + cz * cz) || 1
    const burst = 0.2 + Math.random() * 0.4
    vel[ix] += (cx / len) * burst
    vel[iy] += (cy / len) * burst
    vel[iz] += (cz / len) * burst

    switch (planetName) {
      case 'mercury':
        r = R * (0.35 + Math.random() * 0.1)
        sizes[i] = 0.016 + Math.random() * 0.018
        colTmp.setHSL(0.1 + Math.random() * 0.1, 0.2, 0.4 + Math.random() * 0.2)
        break

      case 'venus':
        r = R * (0.85 + Math.random() * 0.05)
        sizes[i] = 0.024 + Math.random() * 0.028
        colTmp.setHSL(0.08 + Math.random() * 0.05, 0.8, 0.6 + Math.random() * 0.3)
        break

      case 'earth': {
        r = isSurface ? R * (1.0 + Math.random() * 0.05) : R * 0.9 * Math.cbrt(Math.random())
        sizes[i] = 0.020 + Math.random() * 0.024
        const noise = Math.sin(theta * 10 + phi * 10) + Math.sin(phi * 20)
        const [ex, ey] = spherical(r, theta, phi)
        if (Math.abs(ey) > R * 0.85) colTmp.setHex(0xffffff)
        else if (noise > 0.4) colTmp.setHex(0x2b7a3e)
        else if (noise < -0.4) colTmp.setHex(0xffffff)
        else colTmp.setHex(0x1a5b82)
        break
      }

      case 'mars':
        r = R * (0.5 + Math.random() * 0.05)
        sizes[i] = 0.018 + Math.random() * 0.022
        colTmp.setHSL(0.02 + Math.random() * 0.04, 0.9, 0.4 + Math.random() * 0.3)
        break

      case 'jupiter': {
        r = R * (1.1 + Math.random() * 0.1)
        sizes[i] = 0.028 + Math.random() * 0.034
        const band = Math.sin(phi * 12 + Math.sin(theta * 5))
        if (band > 0.6) colTmp.setHex(0xc9b09a)
        else if (band > -0.2) colTmp.setHex(0xa59186)
        else if (band > -0.6) colTmp.setHex(0xff0000)
        else colTmp.setHex(0xe3dccb)
        break
      }

      case 'saturn':
        if (i < N * 0.7) {
          r = R * (0.9 + Math.random() * 0.1)
          sizes[i] = 0.026 + Math.random() * 0.032
          colTmp.setHSL(0.12 + Math.random() * 0.06, 0.8, 0.5 + Math.random() * 0.3)
          const [tx, ty, tz] = spherical(r, theta, phi)
          targetOrig[ix] = tx; targetOrig[iy] = ty; targetOrig[iz] = tz
        } else {
          const ringR = R * 1.5 + Math.random() * R * 0.5
          sizes[i] = 0.026 + Math.random() * 0.032
          colTmp.setHex(0xb5a886)
          targetOrig[ix] = ringR * Math.cos(theta)
          targetOrig[iy] = (Math.random() - 0.5) * 0.3
          targetOrig[iz] = ringR * Math.sin(theta)
        }
        targetCols[ix] = colTmp.r; targetCols[iy] = colTmp.g; targetCols[iz] = colTmp.b
        geo.attributes.aSize.needsUpdate = true
        continue

      case 'uranus':
        r = R * (1.3 + Math.random() * 0.1)
        sizes[i] = 0.024 + Math.random() * 0.028
        colTmp.setHSL(0.54 + Math.random() * 0.04, 0.7, 0.7 + Math.random() * 0.2)
        break

      case 'neptune':
        r = R * (1.2 + Math.random() * 0.1)
        sizes[i] = 0.022 + Math.random() * 0.026
        colTmp.setHSL(0.62 + Math.random() * 0.06, 0.9, 0.6 + Math.random() * 0.3)
        break

      case 'cube':
        targetOrig[ix] = (Math.random() - 0.5) * 3;
        targetOrig[iy] = (Math.random() - 0.5) * 3;
        targetOrig[iz] = (Math.random() - 0.5) * 3;
        colTmp.setHex(0x222222); // Sleek Black/Dark Grey
        targetCols[ix] = colTmp.r; targetCols[iy] = colTmp.g; targetCols[iz] = colTmp.b;
        continue;

      case 'torus': {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        const rMaj = 1.8, rMin = 0.6;
        targetOrig[ix] = (rMaj + rMin * Math.cos(v)) * Math.cos(u);
        targetOrig[iy] = rMin * Math.sin(v) + (Math.random() - 0.5) * 0.1;
        targetOrig[iz] = (rMaj + rMin * Math.cos(v)) * Math.sin(u);
        colTmp.setHex(0x222222);
        targetCols[ix] = colTmp.r; targetCols[iy] = colTmp.g; targetCols[iz] = colTmp.b;
        continue;
      }

      case 'galaxy': {
        const rad = Math.random() * 3.5;
        const angle = rad * 1.5 + (Math.random() > 0.5 ? 0 : Math.PI);
        targetOrig[ix] = Math.cos(angle) * rad;
        targetOrig[iy] = (Math.random() - 0.5) * 0.3;
        targetOrig[iz] = Math.sin(angle) * rad;
        colTmp.setHex(0x222222);
        targetCols[ix] = colTmp.r; targetCols[iy] = colTmp.g; targetCols[iz] = colTmp.b;
        continue;
      }

      case 'dna': {
        const h = (Math.random() - 0.5) * 6;
        const phase = h * 2;
        const rand = Math.random();
        if (rand < 0.4) {
          targetOrig[ix] = Math.cos(phase) * 0.8;
          targetOrig[iy] = h;
          targetOrig[iz] = Math.sin(phase) * 0.8;
        } else if (rand < 0.8) {
          targetOrig[ix] = Math.cos(phase + Math.PI) * 0.8;
          targetOrig[iy] = h;
          targetOrig[iz] = Math.sin(phase + Math.PI) * 0.8;
        } else {
          const rungLen = (Math.random() - 0.5) * 1.6;
          targetOrig[ix] = Math.cos(phase) * rungLen;
          targetOrig[iy] = h;
          targetOrig[iz] = Math.sin(phase) * rungLen;
        }
        colTmp.setHex(0x222222);
        targetCols[ix] = colTmp.r; targetCols[iy] = colTmp.g; targetCols[iz] = colTmp.b;
        continue;
      }

      case 'heart': {
        const t = Math.random() * Math.PI * 2;
        const r = Math.random(); // Uniform distribution for volume

        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

        // Pushes more particles towards the center for density
        const fill = Math.pow(r, 0.6);

        targetOrig[ix] = hx * 0.12 * fill;
        targetOrig[iy] = hy * 0.12 * fill;

        // 3D Bulge: Thicker in the middle, tapering to 0 at the smooth edges
        const bulge = Math.sqrt(1 - fill * fill);
        targetOrig[iz] = (Math.random() - 0.5) * 1.5 * bulge;

        colTmp.setHex(0x222222);
        targetCols[ix] = colTmp.r; targetCols[iy] = colTmp.g; targetCols[iz] = colTmp.b;
        continue;
      }

      case 'text': {
        // Pulls from the canvas text 
        if (textPoints.length > 0) {
          const pt = textPoints[Math.floor(Math.random() * textPoints.length)];
          targetOrig[ix] = pt.x + (Math.random() - 0.5) * 0.05;
          targetOrig[iy] = pt.y + (Math.random() - 0.5) * 0.05;
          targetOrig[iz] = (Math.random() - 0.5) * 0.3; // Adds a little 3D depth to the letters
        }
        colTmp.setHex(0x222222);
        targetCols[ix] = colTmp.r; targetCols[iy] = colTmp.g; targetCols[iz] = colTmp.b;
        continue;
      }

      default:
        r = isSurface ? R : R * 0.9 * Math.cbrt(Math.random())
        sizes[i] = isSurface
          ? 0.022 + Math.random() * 0.026
          : 0.014 + Math.random() * 0.016
        colTmp.setHex(0x222222);
        break;
    }

    const [tx, ty, tz] = spherical(r, theta, phi)
    targetOrig[ix] = tx; targetOrig[iy] = ty; targetOrig[iz] = tz
    targetCols[ix] = colTmp.r; targetCols[iy] = colTmp.g; targetCols[iz] = colTmp.b
  }

  geo.attributes.aSize.needsUpdate = true
}

// ── Per-frame update (called from main loop) ──────────────────────────────────
const raycaster = new THREE.Raycaster()
const zPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
const invMat = new THREE.Matrix4()

export function tick(t: number, mouseX: number, mouseY: number, isDrag: boolean): void {
  invMat.copy(group.matrixWorld).invert()

  const swayX = SWAY_AMP * Math.sin(t * SWAY_F1) + SWAY_AMP * 0.5 * Math.sin(t * SWAY_F2 * 1.37)
  const swayY = SWAY_AMP * Math.cos(t * SWAY_F2) + SWAY_AMP * 0.5 * Math.cos(t * SWAY_F1 * 0.83)

  group.userData.swayX = swayX
  group.userData.swayY = swayY

  let lh = null
  // FIX: removed `!isDrag` check so Gravity Well physics trigger even while dragging
  if (mouseX !== -99) {
    const mouseVec = new THREE.Vector2(mouseX, mouseY)
    raycaster.setFromCamera(mouseVec, camera)
    const targetVec = new THREE.Vector3()
    if (raycaster.ray.intersectPlane(zPlane, targetVec)) {
      lh = targetVec.applyMatrix4(invMat)
    }
  }

  const arr = geo.attributes.position.array
  const carr = geo.attributes.color.array

  for (let i = 0; i < N; i++) {
    const ix = i * 3, iy = ix + 1, iz = ix + 2

    carr[ix] += (targetCols[ix] - carr[ix]) * 0.03
    carr[iy] += (targetCols[iy] - carr[iy]) * 0.03
    carr[iz] += (targetCols[iz] - carr[iz]) * 0.03

    orig[ix] += (targetOrig[ix] - orig[ix]) * 0.02
    orig[iy] += (targetOrig[iy] - orig[iy]) * 0.02
    orig[iz] += (targetOrig[iz] - orig[iz]) * 0.02

    let fx = 0, fy = 0, fz = 0

    if (lh) {
      const dx = arr[ix] - lh.x;
      const dy = arr[iy] - lh.y;
      const dz = arr[iz] - lh.z;
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq > 0.0001) {
        const dist = Math.sqrt(distSq);
        const interactionRadius = 2.0;
        const repelRadiusSq = interactionRadius * interactionRadius;

        // Smooth, gentle repel that doesn't freak out on click/drag
        if (distSq < repelRadiusSq) {
          const force = 0.6 * Math.pow(1 - dist / interactionRadius, 2);

          // Gently push particles out of the way of the mouse
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
          fz += (dz / dist) * force;
        }
      }
    }

    const ox = orig[ix] + nA[ix] * Math.sin(t * nF[ix] + nP[ix])
    const oy = orig[iy] + nA[iy] * Math.sin(t * nF[iy] + nP[iy])
    const oz = orig[iz] + nA[iz] * Math.sin(t * nF[iz] + nP[iz])

    fx += (ox - arr[ix]) * SPRING
    fy += (oy - arr[iy]) * SPRING
    fz += (oz - arr[iz]) * SPRING

    vel[ix] = (vel[ix] + fx) * DAMP
    vel[iy] = (vel[iy] + fy) * DAMP
    vel[iz] = (vel[iz] + fz) * DAMP

    arr[ix] += vel[ix]
    arr[iy] += vel[iy]
    arr[iz] += vel[iz]
  }

  geo.attributes.position.needsUpdate = true
  geo.attributes.color.needsUpdate = true
}