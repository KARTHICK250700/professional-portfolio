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
  return <section id="contact" data-pose="contact"><div className="box">
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

/* ---------- Footer: contact on the left, © in the middle, socials on the right ---------- */
const I = {
  phone: <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />,
  mail: <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z" />,
  linkedin: <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.3 18.3V10H5.7v8.3zM7 8.8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11.3 9.5v-4.6c0-2.4-.5-4.2-3.3-4.2a2.9 2.9 0 0 0-2.6 1.4V10h-2.5v8.3h2.6v-4.1c0-1.1.2-2.1 1.5-2.1s1.4 1.2 1.4 2.2v4z" />,
  github: <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />,
  instagram: <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21 8.3c-.1-1.6-.4-3-1.6-4.2S16.8 2.6 15.2 2.5C13.6 2.4 10.4 2.4 8.8 2.5 7.2 2.6 5.8 2.9 4.6 4.1S3.1 6.7 3 8.3C2.9 9.9 2.9 13.1 3 14.7c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.6.1 4.8.1 6.4 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.6.1-4.8 0-6.4zm-2 8.4a3.3 3.3 0 0 1-1.8 1.8c-1.3.5-4.3.4-5.7.4s-4.4.1-5.7-.4a3.3 3.3 0 0 1-1.8-1.8c-.5-1.3-.4-4.3-.4-5.7s-.1-4.4.4-5.7a3.3 3.3 0 0 1 1.8-1.8c1.3-.5 4.3-.4 5.7-.4s4.4-.1 5.7.4a3.3 3.3 0 0 1 1.8 1.8c.5 1.3.4 4.3.4 5.7s.1 4.4-.4 5.7z" />
}
const Ico = ({ n }) => <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">{I[n]}</svg>

export function Footer({ p }) {
  const social = [['linkedin', p.linkedin, 'LinkedIn'], ['github', p.github, 'GitHub'], ['instagram', p.instagram, 'Instagram']].filter(x => x[1])
  return <footer className="foot">
    <div className="foot-l">
      {p.phone && <a className="ico" href={'tel:' + p.phone.replace(/\s/g, '')} aria-label={'Call ' + p.phone} title={p.phone}><Ico n="phone" /></a>}
      {p.email && <a className="ico" href={'mailto:' + p.email} aria-label={'Email ' + p.email} title={p.email}><Ico n="mail" /></a>}
    </div>
    <div className="foot-c">© {new Date().getFullYear()} {p.fullName}. All rights reserved.</div>
    <div className="foot-r">{social.map(([n, href, label]) => <a key={n} className="ico" href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}><Ico n={n} /></a>)}</div>
  </footer>
}
