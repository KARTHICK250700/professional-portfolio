import { useState } from 'react'
/* Content editor — open with Ctrl+Shift+E or /#admin. Saves to this browser's localStorage. */
export default function Admin({ data, setData, reset, close }) {
  const [txt, setTxt] = useState(JSON.stringify(data, null, 2)), [err, setErr] = useState('')
  const save = () => { try { setData(JSON.parse(txt)); setErr('Saved ✓') } catch (e) { setErr('Invalid JSON: ' + e.message) } }
  const exp = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'application/json' })); a.download = 'portfolio-data.json'; a.click() }
  const imp = e => { const f = e.target.files[0]; if (f) f.text().then(setTxt) }
  return <div className="admin"><div className="admin-in">
    <div className="ah"><b>Content editor</b><button onClick={close}>✕</button></div>
    <p className="an">Saved in this browser only. To publish changes for everyone: Export → replace <code>src/data.js</code> → rebuild.</p>
    <textarea value={txt} onChange={e => setTxt(e.target.value)} spellCheck="false" />
    <div className="ab"><button className="btn" onClick={save}>Save</button><button onClick={exp}>Export JSON</button>
      <label>Import<input type="file" accept=".json" hidden onChange={imp} /></label>
      <button onClick={() => { reset(); close() }}>Reset to default</button><span>{err}</span></div>
  </div></div>
}
