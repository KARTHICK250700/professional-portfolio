import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, useProgress, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

/* Which animation plays in each section once the character arrives */
const CLIP = { hero: 'Wave', about: 'Idle', services: 'Yes', skills: 'ThumbsUp', pipe: 'Walking', work: 'Idle', contact: 'Wave' }
const H = 4.4 // model height in world units at scale 1
const MODEL = './models/robot.glb'

function Character({ poseRef, bubbleRef }) {
  const group = useRef(), { scene, animations } = useGLTF(MODEL)
  const { actions } = useAnimations(animations, group)
  const { viewport, camera, size } = useThree()
  const st = useRef({ x: 2, y: 0, s: 1, ry: 0, clip: '' })

  useEffect(() => {
    scene.traverse(o => {
      if (!o.isMesh) return
      o.castShadow = true
      const n = o.material.name
      o.material = o.material.clone()
      if (n === 'Main') o.material.color = new THREE.Color('#ff6a00')
      if (n === 'Grey') o.material.color = new THREE.Color('#f2f2f2')
      if (n === 'Black') o.material.color = new THREE.Color('#111111')
      o.material.roughness = .45
    })
  }, [scene])

  const play = name => {
    const s = st.current; if (s.clip === name || !actions[name]) return
    const next = actions[name], prev = actions[s.clip]
    next.reset().setLoop(THREE.LoopRepeat).fadeIn(.35).play(); prev?.fadeOut(.35); s.clip = name
  }

  const head = new THREE.Vector3()
  useFrame((_, dt) => {
    const p = poseRef.current, s = st.current, k = 1 - Math.pow(.002, dt)
    const vw = viewport.width, vh = viewport.height
    const tx = (p.x / 100 - .5) * vw, ty = -(p.y / 100 - .5) * vh
    const scale = Math.min(vh / H * .52, vw / H * .42) * p.s
    const dx = tx - s.x
    s.x += dx * k; s.y += (ty - s.y) * k; s.s += (scale - s.s) * k
    const moving = Math.abs(dx) > .08 || p.key === 'pipe' && p.v > .5
    // face travel direction while walking, otherwise face the pose angle
    const face = moving ? (dx > 0 || p.key === 'pipe' ? Math.PI / 2.2 : -Math.PI / 2.2) : p.ry * Math.PI / 180
    s.ry += (face - s.ry) * Math.min(1, dt * 6)
    play(moving ? 'Walking' : CLIP[p.key] || 'Idle')
    const g = group.current
    g.position.set(s.x, s.y - s.s * H / 2, 0); g.scale.setScalar(s.s); g.rotation.y = s.ry
    // speech bubble follows the head
    head.set(s.x + s.s * .6, s.y + s.s * H * .55, 0).project(camera)
    if (bubbleRef.current) bubbleRef.current.style.transform = `translate(${(head.x + 1) / 2 * size.width}px,${(1 - head.y) / 2 * size.height - 40}px)`
  })
  return <group ref={group}><primitive object={scene} /></group>
}
useGLTF.preload(MODEL)

function Loader() {
  const { progress, active } = useProgress()
  return <div id="loader" className={!active && progress === 100 ? 'done' : ''}><b>LOADING {Math.round(progress)}%</b></div>
}

export default function Robot3D({ poseRef, bubble, skills }) {
  const bubbleRef = useRef()
  return <>
    <Loader />
    <div id="stage" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 6, perspective: 1200 }}>
      <div id="ring">{skills.map(s => <div className="chip" key={s}>{s}</div>)}</div>
    </div>
    <div id="scene">
      <Canvas shadows dpr={[1, 1.75]} camera={{ position: [0, 0, 12], fov: 35 }} gl={{ antialias: true, alpha: true }}>
        <hemisphereLight args={['#ffffff', '#1a1a1a', 1.4]} /><ambientLight intensity={.4} />
        <directionalLight position={[4, 8, 6]} intensity={1.6} castShadow />
        <pointLight position={[-6, 2, 4]} intensity={30} color="#ff6a00" />
        <Sparkles count={70} scale={[16, 9, 6]} size={2.2} speed={.35} color="#ff6a00" opacity={.7} />
        <Suspense fallback={null}>
          <Character poseRef={poseRef} bubbleRef={bubbleRef} />
        </Suspense>
      </Canvas>
    </div>
    <div id="bubble3d" ref={bubbleRef}><span key={bubble}>{bubble}</span></div>
  </>
}
