import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { MotionConfig } from 'motion/react'
import { DEFAULT_DATA } from './data.js'
import { useStoredData } from './useStorage.js'
import { useScrollEngine } from './useScrollEngine.js'
import { Nav, Hero, About, Marquee, Services, Skills, Pipeline, Projects, Testimonials, Contact, CaseStudy, Footer } from './components/Sections.jsx'
import Admin from './components/Admin.jsx'
import Chat from './components/Chat.jsx'
const Scene3D = lazy(() => import('./Scene3D.jsx')) // 3D loads after the text is on screen

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const hasWebGL = () => { try { return !!document.createElement('canvas').getContext('webgl2') } catch { return false } }

/* Magnetic buttons (desktop pointers only) */
function useMagnetic() {
  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches || reducedMotion()) return
    const mv = e => {
      const b = e.target.closest?.('.mag')
      document.querySelectorAll('.mag').forEach(el => { if (el !== b) el.style.transform = '' })
      if (b) { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)` }
    }
    addEventListener('pointermove', mv); return () => { removeEventListener('pointermove', mv) }
  }, [])
}

export default function App() {
  const [data, setData, reset] = useStoredData(DEFAULT_DATA)
  const [pose, setPose] = useState('hero')
  const poseRef = useRef({ key: 'hero', q: .3, y: 0 })
  const [admin, setAdmin] = useState(location.hash === '#admin')
  const [reduced] = useState(() => reducedMotion() || !hasWebGL())
  useScrollEngine(data, setPose, poseRef, reduced)
  useMagnetic()
  useEffect(() => {
    const k = e => { if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') setAdmin(a => !a) }
    const h = () => location.hash === '#admin' && setAdmin(true)
    addEventListener('keydown', k); addEventListener('hashchange', h)
    return () => { removeEventListener('keydown', k); removeEventListener('hashchange', h) }
  }, [])
  const p = data.profile
  return <MotionConfig reducedMotion="user">
    <div id="bar" aria-hidden="true" /><div id="floor" aria-hidden="true" /><div className="grain" aria-hidden="true" />
    <Nav p={p} active={pose} />
    {!reduced && <Suspense fallback={null}><Scene3D poseRef={poseRef} /></Suspense>}
    <main id="main">
      <Hero p={p} stats={data.stats} reduced={reduced} /><About p={p} /><Marquee skills={data.skills} />
      <Services items={data.services} /><Skills skills={data.skills} /><Pipeline steps={data.pipeline} />
      <Projects items={data.projects} /><Testimonials items={data.testimonials} /><Contact p={p} />
    </main>
    <Footer p={p} />
    <CaseStudy items={data.projects} />
    <Chat data={data} />
    {admin && <Admin data={data} setData={setData} reset={reset} close={() => { setAdmin(false); history.replaceState(null, '', ' ') }} />}
  </MotionConfig>
}
