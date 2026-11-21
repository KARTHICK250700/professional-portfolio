/* Vercel serverless function: POST /api/chat
   Set ANTHROPIC_API_KEY in Vercel → Project → Settings → Environment Variables.
   Optional: CHAT_MODEL (defaults below). Without a key the frontend answers locally instead. */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return res.status(503).json({ error: 'not configured' })
  const { messages = [], profile = {} } = req.body || {}
  const history = messages.slice(-8).map(m => ({ role: m.r === 'u' ? 'user' : 'assistant', content: String(m.t).slice(0, 600) }))
  while (history.length && history[0].role !== 'user') history.shift()
  if (!history.length) return res.status(400).json({ error: 'empty' })
  const system = `You are the portfolio assistant for ${profile?.profile?.fullName || 'the site owner'}. Answer in 1-3 short sentences, friendly and factual, ONLY from this JSON. If it is not in the data, say you don't know and suggest the contact form. Never invent numbers.\n${JSON.stringify(profile).slice(0, 12000)}`
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: process.env.CHAT_MODEL || 'claude-haiku-4-5', max_tokens: 300, system, messages: history })
    })
    const j = await r.json()
    if (!r.ok) return res.status(502).json({ error: j?.error?.message || 'upstream error' })
    res.status(200).json({ reply: j.content?.map(c => c.text).join('') || '' })
  } catch (e) { res.status(500).json({ error: 'failed' }) }
}
