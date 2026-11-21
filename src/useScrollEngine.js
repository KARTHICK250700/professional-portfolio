import { useEffect } from 'react'
import Lenis from 'lenis'
const lerp = (a, b, t) => a + (b - a) * t
const prog = el => { const r = el.getBoundingClientRect(); return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight || 1))) }

/* Drives everything scroll-related: smooth scroll, progress bar, which section is active,
   per-section progress `q` (0→1) for the particle timeline, pipeline + projects scrubbing. */
export function useScrollEngine(data, setPose, poseRef, reduced) {
  useEffect(() => {
    const $ = s => document.querySelector(s)
    const lenis = reduced ? null : new Lenis({ lerp: .09 }); let raf
    if (lenis) { const tick = t => { lenis.raf(t); raf = requestAnimationFrame(tick) }; raf = requestAnimationFrame(tick) }
    const secs = [...document.querySelectorAll('section[data-pose]')]
    let lastKey = ''
    function update() {
      const y = scrollY, H = innerHeight, max = document.body.scrollHeight - H, mob = innerWidth < 820
      $('#bar').style.transform = `scaleX(${y / max})`
      $('#floor').style.backgroundPosition = `0 ${y * .6}px`
      let i = secs.findIndex(s => s.getBoundingClientRect().bottom > H * .5); if (i < 0) i = secs.length - 1
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
      const t = $(id); if (t) { e.preventDefault(); lenis ? lenis.scrollTo(t) : t.scrollIntoView(); history.replaceState(null, '', id) }
    }
    lenis ? lenis.on('scroll', update) : addEventListener('scroll', update, { passive: true })
    addEventListener('resize', update); document.addEventListener('click', onAnchor)
    const stopForModal = new MutationObserver(() => { const m = document.body.style.overflow === 'hidden'; lenis && (m ? lenis.stop() : lenis.start()) })
    stopForModal.observe(document.body, { attributes: true, attributeFilter: ['style'] })
    update()
    return () => { cancelAnimationFrame(raf); lenis?.destroy(); removeEventListener('scroll', update); removeEventListener('resize', update); document.removeEventListener('click', onAnchor); stopForModal.disconnect() }
  }, [data, setPose, poseRef, reduced])
}
