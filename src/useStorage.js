import { useState } from 'react'
/* Admin-panel edits are saved to localStorage and override src/data.js in this browser.
   Only explicit saves are stored, so normal edits to data.js always show up. */
const KEY = 'portfolio-data-v3'
export function useStoredData(defaults) {
  const [data, setData] = useState(() => {
    try {
      const s = localStorage.getItem(KEY); if (!s) return defaults
      // merge one level deep so new fields added to data.js (e.g. profile.phone) still appear
      const st = JSON.parse(s), out = { ...defaults, ...st }
      for (const k in defaults) if (defaults[k] && !Array.isArray(defaults[k]) && typeof defaults[k] === 'object') out[k] = { ...defaults[k], ...(st[k] || {}) }
      return out
    } catch { return defaults }
  })
  const save = d => { setData(d); try { localStorage.setItem(KEY, JSON.stringify(d)) } catch {} }
  const reset = () => { try { localStorage.removeItem(KEY) } catch {}; setData(defaults) }
  return [data, save, reset]
}
