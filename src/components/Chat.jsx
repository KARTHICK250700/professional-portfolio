import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

/* "Ask about Karthick" — tries the /api/chat serverless function (real LLM, see api/chat.js).
   If that isn't deployed it answers locally from data.js, so the widget works on any static host. */
function localAnswer(q, d) {
  const s = q.toLowerCase(), p = d.profile, has = (...w) => w.some(x => s.includes(x))
  const proj = d.projects.find(x => s.includes(x.title.toLowerCase().split(' ')[0]) || x.tags.some(t => s.includes(t.toLowerCase())))
  if (proj) return `${proj.title}: ${proj.text} Result — ${proj.metric}. Open the case study in the Projects section for details.`
  if (has('skill', 'stack', 'tech', 'know')) return `${p.name} works with ${d.skills.join(', ')}.`
  if (has('project', 'work', 'built', 'build')) return `Highlights: ${d.projects.map(x => `${x.title} (${x.metric})`).join('; ')}.`
  if (has('contact', 'email', 'hire', 'reach', 'available')) return `${p.available ? 'Yes, open to opportunities. ' : ''}Email ${p.email} or use the contact form below.`
  if (has('who', 'about', 'background', 'experience', 'commerce')) return p.about
  if (has('service', 'help', 'offer')) return d.services.map(x => `${x.title}: ${x.text}`).join(' ')
  return `I can answer about ${p.name}'s skills, projects, services or how to get in touch. Try "What has he built?"`
}

export default function Chat({ data }) {
  const [open, setOpen] = useState(false), [busy, setBusy] = useState(false), [input, setInput] = useState('')
  const [msgs, setMsgs] = useState([{ r: 'a', t: `Hi! I'm ${data.profile.name}'s AI assistant. Ask me about his projects, skills or availability.` }])
  const end = useRef()
  useEffect(() => end.current?.scrollIntoView({ behavior: 'smooth' }), [msgs, open])
  const ask = async q => {
    if (!q.trim() || busy) return
    const next = [...msgs, { r: 'u', t: q.trim() }]; setMsgs(next); setInput(''); setBusy(true)
    let answer
    try {
      const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next.slice(-8), profile: data }) })
      if (r.ok && (r.headers.get('content-type') || '').includes('json')) answer = (await r.json()).reply
    } catch { /* no backend — fall back */ }
    setMsgs([...next, { r: 'a', t: answer || localAnswer(q, data) }]); setBusy(false)
  }
  return <>
    <button className="chat-fab" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close assistant' : 'Ask my AI assistant'}>{open ? '✕' : 'Ask AI'}</button>
    <AnimatePresence>{open && <motion.div className="chat" role="dialog" aria-label="AI assistant" initial={{ opacity: 0, y: 20, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .96 }}>
      <div className="chat-h"><b>Ask about {data.profile.name}</b><small>AI assistant · answers from this portfolio</small></div>
      <div className="chat-b" aria-live="polite">{msgs.map((m, i) => <div key={i} className={'m ' + m.r}>{m.t}</div>)}{busy && <div className="m a typing"><i /><i /><i /></div>}<div ref={end} /></div>
      <div className="chat-q">{['What has he built?', 'Top skills?', 'Is he available?'].map(q => <button key={q} onClick={() => ask(q)}>{q}</button>)}</div>
      <form onSubmit={e => { e.preventDefault(); ask(input) }}><label className="sr" htmlFor="chat-in">Your question</label>
        <input id="chat-in" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a question…" maxLength={300} /><button className="btn" disabled={busy}>Send</button></form>
    </motion.div>}</AnimatePresence>
  </>
}
