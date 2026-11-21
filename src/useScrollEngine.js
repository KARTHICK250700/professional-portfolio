import { useEffect } from 'react'
import Lenis from 'lenis'
const lerp = (a, b, t) => a + (b - a) * t
const prog = el => { const r = el.getBoundingClientRect(); return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight || 1))) }

/* Drives everything scroll-related: smooth scroll, progress bar, which section is active,
   per-section progress `q` (0→1) for the particle timeline, pipeline + projects scrubbing. */
export function useScrollEngine(data, setPose, poseRef, reduced) {
  useEffect(() => {
    const $ = s => document.querySelector(s)
    const lenis = new Lenis({ lerp: .09, smoothWheel: false }); let raf
    { const tick = t => { lenis.raf(t); raf = requestAnimationFrame(tick) }; raf = requestAnimationFrame(tick) }

    /* ---- Gesture stepping: one swipe = next stop, keep scrolling = keep moving ----
       Stops = top of every section + every screen inside tall pinned sections (pipeline, projects). */
    let stops = [], busy = false, queued = 0, lastT = 0
    const buildStops = () => {
      const H = innerHeight, max = document.documentElement.scrollHeight - H, set = new Set([0, max])
      document.querySelectorAll('main > section, main > .mq').forEach(s => {
        if (s.classList.contains('mq')) return
        const top = s.getBoundingClientRect().top + scrollY, h = s.offsetHeight
        set.add(Math.round(top)); for (let y = top + H; y < top + h - H * .5; y += H) set.add(Math.round(y))
      })
      stops = [...set].filter(y => y <= max).sort((a, b) => a - b)
    }
    const step = dir => {
      const y = busy ? target : scrollY
      const next = dir > 0 ? stops.find(s => s > y + 4) : [...stops].reverse().find(s => s < y - 4)
      if (next === undefined) return
      target = next; busy = true
      lenis.scrollTo(next, { duration: reduced ? 0 : 1.05, easing: t => 1 - Math.pow(1 - t, 4), lock: true, force: true,
        onComplete: () => { busy = false; doneAt = performance.now(); if (queued) { const d = queued; queued = 0; step(d) } } })
    }
    let target = 0
    let doneAt = 0
    const onWheel = e => {
      if (e.ctrlKey || e.target.closest?.('.case,.chat,.admin,.mnav') || document.body.style.overflow === 'hidden') return
      e.preventDefault()
      const now = performance.now(), d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : 0, abs = Math.abs(d)
      const gap = now - lastT; lastT = now
      if (busy || abs < 4) return                         // never chain while moving (kills trackpad momentum jumps)
      if (gap > 220) return step(Math.sign(d))             // a brand-new swipe / wheel flick
      if (abs >= 60 && now - doneAt > 150) step(Math.sign(d)) // still scrolling hard after arriving = keep going
    }
    const onKey = e => {
      if (e.target.closest?.('input,textarea,.case,.chat,.admin')) return
      const k = { ArrowDown: 1, PageDown: 1, ' ': e.shiftKey ? -1 : 1, ArrowUp: -1, PageUp: -1 }[e.key]
      if (k) { e.preventDefault(); busy ? (queued = k) : step(k) }
      if (e.key === 'Home') { e.preventDefault(); lenis.scrollTo(0) } else if (e.key === 'End') { e.preventDefault(); lenis.scrollTo(stops[stops.length - 1]) }
    }
    const fine = matchMedia('(pointer:fine)').matches // phones keep their natural swipe scrolling
    if (fine) { addEventListener('wheel', onWheel, { passive: false }); addEventListener('keydown', onKey) }
    buildStops(); const ro = new ResizeObserver(buildStops); ro.observe(document.body)
    const secs = [...document.querySelectorAll('section[data-pose]')]
    let lastKey = ''
    function update() {
      const y = scrollY, H = innerHeight, max = document.body.scrollHeight - H, mob = innerWidth < 820
      $('#bar').style.transform = `scaleX(${y / max})`
      $('#floor').style.backgroundPosition = `0 ${y * .6}px`
      // active section = the last one whose top has entered 35% into the viewport (triggers the particle morph)
      let i = 0; secs.forEach((s, k) => { if (s.getBoundingClientRect().top < H * .65) i = k })
      const s = secs[i], key = s.dataset.pose, r = s.getBoundingClientRect()
      poseRef.current = { key, y, q: Math.min(1, Math.max(0, (H * .5 - r.top) / r.height)) }
      if (key === 'pipe') {
        const p = prog(s), sts = s.querySelectorAll('.st'), n = Math.floor(p * sts.length * 1.05)
        sts.forEach((e, k) => e.classList.toggle('on', k < n)); $('#fl').style.transform = `scaleX(${p})`
      }
      const w = $('#work'), tr = $('#track'); if (w && tr) tr.style.transform = `translateX(${-prog(w) * Math.max(0, tr.scrollWidth - innerWidth * .7)}px)`
      const sc = $('#scene'); if (sc) sc.classList.toggle('dim', mob && key !== 'hero')
      if (key !== lastKey) { lastKey = key; setPose(key) }
    }
    const onAnchor = e => {
      const a = e.target.closest('a[href^="#"]'); if (!a) return
      const id = a.getAttribute('href'); if (id.startsWith('#case/') || id === '#' || id === '#admin') return
      const t = $(id); if (t) { e.preventDefault(); lenis.scrollTo(t); history.replaceState(null, '', id) }
    }
    lenis.on('scroll', update)
    addEventListener('resize', update); document.addEventListener('click', onAnchor)
    const stopForModal = new MutationObserver(() => { const m = document.body.style.overflow === 'hidden'; m ? lenis.stop() : lenis.start() })
    stopForModal.observe(document.body, { attributes: true, attributeFilter: ['style'] })
    update()
    return () => { cancelAnimationFrame(raf); lenis.destroy(); removeEventListener('wheel', onWheel); removeEventListener('keydown', onKey); ro.disconnect(); removeEventListener('scroll', update); removeEventListener('resize', update); document.removeEventListener('click', onAnchor); stopForModal.disconnect() }
  }, [data, setPose, poseRef, reduced])
}
