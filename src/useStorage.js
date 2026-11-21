import { useState, useEffect } from 'react'
const KEY = 'portfolio-data-v2'
export function useStoredData(defaults) {
  const [data, setData] = useState(() => {
    try { const s = localStorage.getItem(KEY); return s ? { ...defaults, ...JSON.parse(s) } : defaults } catch { return defaults }
  })
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {} }, [data])
  const reset = () => { try { localStorage.removeItem(KEY) } catch {}; setData(defaults) }
  return [data, setData, reset]
}
