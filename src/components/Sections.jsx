import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

/* Motion (motion.dev) reveal: 3D flip-up + fade on scroll into view (auto-disabled for reduced motion) */
const Rv = ({ as = 'div', className = '', ...r }) => {
  const M = motion[as]
  return <M className={className} initial={{ opacity: 0, y: 50, rotateX: -20 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    viewport={{ once: true, amount: .3 }} transition={{ type: 'spring', stiffness: 70, damping: 16 }} {...r} />
}
const Ext = ({ href, children, className }) => href ? <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a> : null

/* ---------- Navigation: desktop links, active section, mobile menu, side progress dots ---------- */
const NAV = ['about', 'services', 'skills', 'work', 'contact']
export function Nav({ p, active }) {
  const [open, setOpen] = useState(false)
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  const cur = active === 'pipe' ? 'skills' : active
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <nav aria-label="Main">
      <a href="#home" className="logo">{p.name}<i>.</i></a>
      <div className="links">{NAV.map(s => <a key={s} href={'#' + s} className={cur === s ? 'on' : ''} aria-current={cur === s ? 'true' : undefined}>{s[0].toUpperCase() + s.slice(1)}</a>)}
        <a className="nav-cv" href={p.resume} target="_blank" rel="noopener">Resume ↗</a></div>
      <button className={'burger' + (open ? ' x' : '')} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
    </nav>
    <AnimatePresence>{open && <motion.div className="mnav" initial={{ clipPath: 'circle(0% at 95% 4%)' }} animate={{ clipPath: 'circle(150% at 95% 4%)' }} exit={{ clipPath: 'circle(0% at 95% 4%)' }} transition={{ duration: .5 }}>
      {NAV.map((s, i) => <motion.a key={s} href={'#' + s} onClick={() => setOpen(false)} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 + i * .06 }}>{s}</motion.a>)}
      <a className="btn" href={p.resume} target="_blank" rel="noopener" onClick={() => setOpen(false)}>View / download resume</a>
    </motion.div>}</AnimatePresence>
    <div className="dots" aria-hidden="true">{['home', ...NAV].map(s => <a key={s} href={'#' + s} tabIndex={-1} className={(cur === s || (s === 'home' && cur === 'hero')) ? 'on' : ''} />)}</div>
  </>
}

export const Hero = ({ p, stats, reduced }) => <section id="home" data-pose="hero" className="hero-pin"><div className="hero-in">
  <div className="name-bg" aria-hidden="true">{p.name.toUpperCase()}</div>
  {reduced && <img className="face-static" src="./face.png" alt={`Portrait of ${p.fullName}`} />}
  <div className="box">
    {p.available && <Rv className="avail"><i />Open to opportunities · {p.location}</Rv>}
    <Rv className="tag">{p.role}</Rv>
    <Rv as="h1">{p.headline.split('AI').map((t, i, a) => <span key={i} className="plain">{t}{i < a.length - 1 && <span>AI</span>}</span>)}</Rv>
    <Rv as="p">{p.intro}</Rv>
    <Rv className="cta"><a className="btn mag" href="#work">See my work</a><a className="btn ghost mag" href={p.resume} target="_blank" rel="noopener">Resume ↗</a></Rv>
    {stats?.length > 0 && <Rv className="stats">{stats.map(s => <div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>)}</Rv>}
  </div>
  <div className="scroll-hint" aria-hidden="true">Scroll</div>
</div></section>

export const About = ({ p }) => <section id="about" className="right" data-pose="about"><div className="box">
  <Rv className="tag">About me</Rv><Rv as="h2">From <span>commerce</span> to code.</Rv><Rv as="p">{p.about}</Rv>
  <Rv className="socials"><Ext href={p.linkedin}>LinkedIn ↗</Ext><Ext href={p.github}>GitHub ↗</Ext></Rv>
</div></section>

export const Marquee = ({ skills }) => <div className="mq" aria-hidden="true"><div>{[...skills, ...skills].map((s, i) => <span key={i}>{s} ✦</span>)}</div></div>

export const Services = ({ items }) => <section id="services" data-pose="services"><div className="box" style={{ maxWidth: 720 }}>
  <Rv className="tag">What I do</Rv><Rv as="h2" className="huge">SERVICES</Rv>
  <div className="svc">{items.map((s, i) => <Rv className="svc-row" key={s.title}><b>0{i + 1}</b><div><h3>{s.title}</h3><p>{s.text}</p></div></Rv>)}</div>
</div></section>

export const Skills = ({ skills }) => <section id="skills" className="center" data-pose="skills">
  <div className="box" style={{ margin: '0 auto' }}><Rv className="tag">Skills</Rv><Rv as="h2">My <span>toolkit</span></Rv>
    <Rv as="ul" className="skill-list">{skills.map(s => <li key={s}>{s}</li>)}</Rv></div>
</section>

export const Pipeline = ({ steps }) => <section id="pipe" data-pose="pipe"><div className="sticky">
  <div className="tag">How I automate</div><h2>Document in. <span>Work done.</span></h2>
  <ol className="flow"><div id="fl" aria-hidden="true" />{steps.map(([a, b]) => <li className="st" key={a}>{a}<small>{b}</small></li>)}</ol>
</div></section>

export const Projects = ({ items }) => <section id="work" data-pose="work" aria-label="Selected work"><div className="sticky">
  <div className="work-head"><div className="tag">Selected work</div><h2>Projects <span>with proof.</span></h2></div>
  <div id="track">
    {items.map((p, i) => <motion.a href={'#case/' + p.slug} key={p.slug} className="pj" data-n={'0' + (i + 1)} whileHover={{ y: -10, rotateY: 6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 200 }}>
      {p.image && <img src={p.image} alt="" loading="lazy" />}
      <div className="metric">{p.metric}</div>
      <h3>{p.title}</h3><p>{p.text}</p>
      <div className="t">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
      <span className="pl">Read case study →</span>
    </motion.a>)}
  </div>
</div></section>

export const Testimonials = ({ items }) => !items?.length ? null : <section id="voices" className="center" data-pose="voices" style={{ minHeight: '100vh' }}>
  <div className="box" style={{ margin: '0 auto', maxWidth: 900 }}><Rv className="tag">What people say</Rv>
    <div className="quotes">{items.map(q => <Rv as="figure" key={q.name} className="quote"><blockquote>“{q.quote}”</blockquote><figcaption><b>{q.name}</b> · {q.role}</figcaption></Rv>)}</div>
  </div></section>

export function Contact({ p }) {
  const [f, setF] = useState({ name: '', msg: '' }), [copied, setCopied] = useState(false)
  const send = e => { e.preventDefault(); location.href = `mailto:${p.email}?subject=${encodeURIComponent('Portfolio enquiry from ' + f.name)}&body=${encodeURIComponent(f.msg)}` }
  const copy = () => navigator.clipboard?.writeText(p.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800) })
  return <section id="contact" data-pose="contact"><div className="box" style={{ marginBottom: '20vh' }}>
    <Rv className="tag">Contact</Rv><Rv as="h2" className="big">Let's <span>build</span> it.</Rv>
    <Rv as="p">Have a manual process that eats your team's time? Let's automate it.</Rv>
    <Rv as="form" className="cf" onSubmit={send}>
      <label className="sr" htmlFor="cf-name">Your name</label><input id="cf-name" required placeholder="Your name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
      <label className="sr" htmlFor="cf-msg">Message</label><textarea id="cf-msg" required rows="3" placeholder="What do you want to automate?" value={f.msg} onChange={e => setF({ ...f, msg: e.target.value })} />
      <div><button className="btn mag">Send message</button><button type="button" className="btn ghost" onClick={copy}>{copied ? 'Copied ✓' : 'Copy email'}</button></div>
    </Rv>
  </div></section>
}

/* ---------- Case study overlay: opens at #case/<slug>, shareable, Esc to close ---------- */
export function CaseStudy({ items }) {
  const [slug, setSlug] = useState(null)
  useEffect(() => {
    const read = () => setSlug(location.hash.startsWith('#case/') ? location.hash.slice(6) : null)
    read(); addEventListener('hashchange', read); return () => removeEventListener('hashchange', read)
  }, [])
  const p = items.find(x => x.slug === slug)
  const close = () => history.pushState(null, '', '#work') || setSlug(null)
  useEffect(() => {
    if (!p) return; document.body.style.overflow = 'hidden'
    const k = e => e.key === 'Escape' && close(); addEventListener('keydown', k)
    return () => { document.body.style.overflow = ''; removeEventListener('keydown', k) }
  }, [p])
  return <AnimatePresence>{p && <motion.div className="case" role="dialog" aria-modal="true" aria-label={p.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.article initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ type: 'spring', damping: 22 }}>
      <button className="case-x" onClick={close} aria-label="Close case study" autoFocus>✕</button>
      <div className="tag">Case study</div><h2>{p.title}</h2><div className="metric big">{p.metric}</div>
      {p.image && <img src={p.image} alt={p.title + ' screenshot'} />}
      <h3>Problem</h3><p>{p.problem}</p>
      <h3>Approach</h3><p>{p.approach}</p>
      <h3>Architecture</h3><div className="arch">{p.architecture.map((a, i) => <span key={a}>{a}{i < p.architecture.length - 1 && <i>→</i>}</span>)}</div>
      <h3>Result</h3><p>{p.result}</p>
      <div className="t">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
      <div className="case-links"><Ext className="btn" href={p.live}>Live demo ↗</Ext><Ext className="btn ghost" href={p.github}>Code ↗</Ext></div>
    </motion.article>
  </motion.div>}</AnimatePresence>
}
