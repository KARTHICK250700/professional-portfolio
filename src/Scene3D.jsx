import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* One particle cloud that morphs into a new shape for every section ("neural core" theme). */
/* fewer particles on phones / low-core devices */
const N = typeof window !== 'undefined' && (innerWidth < 820 || (navigator.hardwareConcurrency || 8) <= 4) ? 8000 : 14000
const rnd = (a = 1) => (Math.random() - .5) * 2 * a
function shapes() {
  const S = {}, mk = f => { const a = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const [x, y, z] = f(i); a[i * 3] = x; a[i * 3 + 1] = y; a[i * 3 + 2] = z } return a }
  // hero: sphere shell (the AI "core")
  S.hero = mk(i => { const p = Math.acos(1 - 2 * (i + .5) / N), t = Math.PI * (1 + 5 ** .5) * i, r = 2.6 + rnd(.05); return [r * Math.cos(t) * Math.sin(p), r * Math.sin(t) * Math.sin(p), r * Math.cos(p)] })
  // about: torus knot (connected thinking)
  S.about = mk(i => { const t = i / N * Math.PI * 2 * 3, p = 2, q = 3, r = 1.6 + .5 * Math.cos(q * t / 3 * 1); const u = t / 3 * p; return [r * Math.cos(u) * 1.2 + rnd(.12), r * Math.sin(u) * 1.2 + rnd(.12), .7 * Math.sin(q * t / 3) + rnd(.12)] })
  // services: cube lattice (structured systems)
  S.services = mk(() => { const g = 9, s = 3.4 / g; const f = () => (Math.floor(Math.random() * g) - (g - 1) / 2) * s; const a = [f(), f(), f()]; const k = Math.floor(Math.random() * 3); a[k] += rnd(s / 2); return a })
  // skills: double helix (DNA of the stack)
  S.skills = mk(i => { const t = (i / N) * 26, side = i % 2 ? Math.PI : 0, r = 1.4; return [Math.cos(t + side) * r + rnd(.08), (i / N - .5) * 7.5, Math.sin(t + side) * r + rnd(.08)] })
  // pipe: flowing stream left → right
  S.pipe = mk(i => { const x = (i / N - .5) * 14; return [x, Math.sin(x * .9) * .5 + rnd(.25), rnd(.4)] })
  // work: wave plane
  S.work = mk(i => { const gx = i % 100, gz = Math.floor(i / 100); const x = (gx / 99 - .5) * 12, z = (gz / 69 - .5) * 8; return [x, Math.sin(x * .8) * Math.cos(z * .8) * .6 - 1.2, z] })
  // contact: ring / portal
  S.contact = mk(i => { const t = i / N * Math.PI * 2 * 7, r = 2.7 + rnd(.25); return [Math.cos(t) * r, Math.sin(t) * r, rnd(.3)] })
  return S
}
/* Sample N points from a canvas drawing: brighter pixel = more particles, brightness = depth */
function sample(draw, { size = 220, w = 6, depth = .6, gamma = 1.2, base = .15 } = {}) {
  const c = document.createElement('canvas'); c.width = c.height = size
  const g = c.getContext('2d'); draw(g, size)
  const d = g.getImageData(0, 0, size, size).data, cand = []
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4, a = d[i + 3] / 255; if (a < .1) continue
    const l = d[i] / 255, wt = a * (base + (1 - base) * l ** gamma); cand.push([x, y, l, wt])
  }
  const tot = cand.reduce((s, c) => s + c[3], 0), out = new Float32Array(N * 3), px = w / size, lum = new Float32Array(N)
  const cum = new Float32Array(cand.length); let acc = 0; cand.forEach((c, k) => { acc += c[3]; cum[k] = acc })
  for (let i = 0; i < N; i++) {
    const r = Math.random() * tot; let lo = 0, hi = cand.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; cum[m] < r ? lo = m + 1 : hi = m }
    const [x, y, l] = cand[lo]; lum[i] = l
    out.set([(x - size / 2 + Math.random()) * px, -(y - size / 2 + Math.random()) * px, (l - .5) * depth + rnd(.04)], i * 3)
  }
  out.lum = lum; return out
}
const text = (t, font) => (g, s) => { g.fillStyle = '#fff'; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, s / 2, s / 2) }
const gear = (g, s) => {
  g.translate(s / 2, s / 2); g.fillStyle = '#fff'; g.beginPath()
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, r = i % 2 ? 72 : 95; g.lineTo(Math.cos(a - .14) * r, Math.sin(a - .14) * r); g.lineTo(Math.cos(a + .14) * r, Math.sin(a + .14) * r) }
  g.closePath(); g.fill(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(0, 0, 34, 0, 7); g.fill()
}
function loadImg(src) { return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src }) }

/* Where each shape sits: [x, y, scale] desktop / mobile. Text sits on the opposite side. */
const VIEW = { hero: [2.7, -.1, 1], about: [-2.7, 0, 1], services: [3.3, 0, .85], skills: [0, 0, .9], pipe: [0, -.8, 1], work: [0, .5, 1], contact: [3.5, 0, 1], voices: [-4.6, 0, .7] }
const VIEW_M = { hero: [0, 1.75, .62], about: [0, 0, .62], services: [0, 0, .6], skills: [0, 0, .55], pipe: [0, -1.2, .6], work: [0, .5, .6], contact: [0, -1.6, .6], voices: [0, 2, .5] }
const DUR = 1.4 // seconds for one morph

/* Trigger-based morph: when a section enters the viewport the particles travel (with a swirl)
   from wherever they are now to the new shape. All per-frame motion runs in the vertex shader. */
const vert = `
attribute vec3 aShape; attribute vec3 aPrev; attribute vec3 aCol; attribute vec3 aFaceCol; attribute float aDelay; attribute float aSw; attribute vec2 aSy;
uniform float uT, uTime, uSpin, uWave, uSize, uFace, uPix; uniform vec3 uView;
varying vec3 vCol;
float ease(float t){ return t < .5 ? 4.*t*t*t : 1. - pow(-2.*t + 2., 3.) / 2.; }
void main(){
  vec3 p = aShape; float c = cos(uSpin), s = sin(uSpin);
  p = vec3(p.x*c + p.z*s, p.y, -p.x*s + p.z*c);
  p.y += uWave * sin(p.x*.8 + uTime) * .15;
  p = vec3(p.x*uView.z + uView.x, p.y*uView.z + uView.y, p.z*uView.z);
  float e = ease(clamp((uT - aDelay * .5) / .6, 0., 1.));
  float arc = sin(e * 3.14159);
  p = mix(aPrev, p, e) + vec3(arc * aSw * .35, arc * aSw * .8, arc * aSy.y * .6);
  p.xy += sin(uTime*1.2 + aDelay*100.) * .006;
  vCol = mix(aCol, aFaceCol, uFace);
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPix / -mv.z;
}`
const frag = `
varying vec3 vCol;
void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, .0, d); a *= a; gl_FragColor = vec4(vCol * a, a); }`

const easeJ = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
const spinFor = (key, T) => key === 'skills' ? T * .5 : key === 'work' || key === 'pipe' ? 0 : Math.sin(T * .35) * (key === 'hero' ? .05 : .12)

function Cloud({ poseRef }) {
  const S = useMemo(shapes, []), pts = useRef(), mouse = useRef([0, 0]), face = useRef(0)
  const st = useRef({ key: null, t: 1, view: [2.7, -.1, 1] })
  const { geo, mat, R } = useMemo(() => {
    const g = new THREE.BufferGeometry(), col = new Float32Array(N * 3), d = new Float32Array(N), sw = new Float32Array(N), sy = new Float32Array(N * 2), prev = new Float32Array(N * 3)
    const o = new THREE.Color('#ff6a00'), w = new THREE.Color('#ffffff')
    for (let i = 0; i < N; i++) {
      const c = Math.random() < .72 ? o : w; col.set([c.r, c.g, c.b], i * 3)
      d[i] = Math.random() * .6; sw[i] = rnd(1.6); sy[i * 2] = rnd(3.5); sy[i * 2 + 1] = rnd(2.5)
      prev.set([12 + Math.random() * 4, sy[i * 2], sy[i * 2 + 1]], i * 3) // intro: stream in from the right
    }
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3))
    g.setAttribute('aShape', new THREE.BufferAttribute(S.hero, 3)); g.setAttribute('aPrev', new THREE.BufferAttribute(prev, 3))
    g.setAttribute('aCol', new THREE.BufferAttribute(col, 3)); g.setAttribute('aFaceCol', new THREE.BufferAttribute(col.slice(), 3))
    g.setAttribute('aDelay', new THREE.BufferAttribute(d, 1)); g.setAttribute('aSw', new THREE.BufferAttribute(sw, 1)); g.setAttribute('aSy', new THREE.BufferAttribute(sy, 2))
    const u = { uT: { value: 0 }, uTime: { value: 0 }, uSpin: { value: 0 }, uWave: { value: 0 }, uSize: { value: .085 }, uFace: { value: 0 }, uPix: { value: 400 }, uView: { value: new THREE.Vector3(2.7, -.1, 1) } }
    const m = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms: u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    return { geo: g, mat: m, R: { d, sw, sy } }
  }, [S])

  /* Where every particle is right now (same maths as the shader) — used as the start of the next morph */
  const snapshot = T => {
    const u = mat.uniforms, sh = geo.attributes.aShape.array, pv = geo.attributes.aPrev.array, out = new Float32Array(N * 3)
    const c = Math.cos(u.uSpin.value), s = Math.sin(u.uSpin.value), v = u.uView.value, t = u.uT.value, wv = u.uWave.value
    for (let i = 0, j = 0; i < N; i++, j += 3) {
      let x = sh[j], y = sh[j + 1], z = sh[j + 2]; const rx = x * c + z * s; z = -x * s + z * c; x = rx
      y += wv * Math.sin(x * .8 + T) * .15; x = x * v.z + v.x; y = y * v.z + v.y; z *= v.z
      const e = easeJ(Math.min(1, Math.max(0, (t - R.d[i] * .5) / .6))), arc = Math.sin(e * Math.PI)
      out[j] = pv[j] + (x - pv[j]) * e + arc * R.sw[i] * .35; out[j + 1] = pv[j + 1] + (y - pv[j + 1]) * e + arc * R.sw[i] * .8; out[j + 2] = pv[j + 2] + (z - pv[j + 2]) * e + arc * R.sy[i * 2 + 1] * .6
    }
    return out
  }
  const go = (key, T) => { // start a morph to `key` from the current positions
    if (!S[key]) return
    if (st.current.key !== null) geo.setAttribute('aPrev', new THREE.BufferAttribute(snapshot(T), 3))
    geo.setAttribute('aShape', new THREE.BufferAttribute(S[key], 3))
    st.current.key = key; mat.uniforms.uT.value = 0
  }

  useEffect(() => {
    // Meaningful art per section: face → </> (commerce to code) → gear (automation) → helix → stream → wave → quotes → THANKS!
    S.about = sample(text('</>', '900 120px Inter, Arial'), { w: 4.6, depth: .3, base: 1 })
    S.services = sample(gear, { w: 5, depth: .4, base: 1 })
    S.voices = sample(text('“”', '900 160px Georgia, serif'), { w: 4, depth: .3, base: 1 })
    S.contact = sample(text('THANKS!', '900 36px Inter, Arial'), { w: 5.4, depth: .3, base: 1 }) // change the word here
    loadImg('./face.png').then(img => {
      if (!img) return
      S.hero = sample((g, s) => g.drawImage(img, 0, 0, s, s), { size: 240, w: 4.8, depth: .35, gamma: 2, base: .05 })
      const fc = new Float32Array(N * 3), o = new THREE.Color('#ff6a00'), w = new THREE.Color('#fff'), t = new THREE.Color()
      for (let i = 0; i < N; i++) { t.copy(o).lerp(w, Math.pow(S.hero.lum[i], 2.5)); fc.set([t.r, t.g, t.b], i * 3) }
      geo.setAttribute('aFaceCol', new THREE.BufferAttribute(fc, 3))
      if (st.current.key === 'hero' || st.current.key === null) { geo.setAttribute('aShape', new THREE.BufferAttribute(S.hero, 3)); st.current.key = st.current.key ?? 'hero' }
    })
  }, [S, geo])

  useFrame(({ clock, viewport, pointer, gl }, dt) => {
    const key = poseRef.current.key || 'hero', T = clock.elapsedTime, u = mat.uniforms
    if (st.current.key === null) st.current.key = 'hero'
    else if (key !== st.current.key) go(key, T)
    u.uT.value = Math.min(1, u.uT.value + dt / (st.current.key === 'hero' && u.uT.value < 1 && T < 3 ? 2.2 : DUR))
    const k = st.current.key, v = (viewport.width < 8 ? VIEW_M : VIEW)[k] || VIEW.hero
    u.uView.value.set(v[0], v[1], v[2]); u.uTime.value = T; u.uSpin.value = spinFor(k, T); u.uWave.value = k === 'work' ? 1 : 0
    u.uPix.value = gl.domElement.height / 2
    face.current += ((k === 'hero' ? 1 : 0) - face.current) * Math.min(1, dt * 2.5); u.uFace.value = face.current
    mouse.current[0] += (pointer.x - mouse.current[0]) * .05; mouse.current[1] += (pointer.y - mouse.current[1]) * .05
    pts.current.rotation.y = mouse.current[0] * .12; pts.current.rotation.x = -mouse.current[1] * .08 + (k === 'work' ? .3 : 0)
  })
  return <points ref={pts} geometry={geo} material={mat} frustumCulled={false} />
}

export default function Scene3D({ poseRef }) {
  return <div id="scene" aria-hidden="true"><Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 9], fov: 45 }} gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}>
    <Cloud poseRef={poseRef} />
  </Canvas></div>
}
