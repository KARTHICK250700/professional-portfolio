# Karthick M — Portfolio (React + Vite + Three.js)

Scroll-driven 3D portfolio. 8–14k GPU particles form your face, then stream into a new
meaning-shape for every section (</>, gear, DNA helix, data stream, wave, quotes, HI!).

## Run
```
npm install
npm run dev        # http://localhost:5173  (yellow bar = dummy content still in data.js)
npm run build      # production build in dist/
npm run preview    # test the build
```

## Edit content — `src/data.js`
Profile, stats, services, skills, projects (+ case studies), testimonials.
Items marked DUMMY / `todo: true` are sample content: replace before going live.
Live editor: `/#admin` or Ctrl+Shift+E (saves to your browser only → Export → paste into data.js).

## Files to swap
- `public/face.png`   – grayscale face map for the particles (front-facing, plain background)
- `public/resume.pdf` – your CV (generated from LinkedIn; add phone + email)
- `public/og.png`     – 1200×630 link-preview image
- `index.html`        – replace every `https://YOUR-DOMAIN` after deploying

## AI assistant ("Ask AI" button)
Works on any static host (answers from data.js). For real LLM answers deploy to **Vercel**:
`api/chat.js` runs automatically — add `ANTHROPIC_API_KEY` (and optional `CHAT_MODEL`) in
Vercel → Settings → Environment Variables.

## Built in
Accessibility: skip link, focus rings, labelled forms, single h1, reduced-motion + no-WebGL fallback.
Performance: particles animate in a vertex shader, Three.js lazy-loaded after text, fewer particles on phones.
SEO: meta + Open Graph + JSON-LD Person schema, noscript fallback, robots.txt.

## Deploy
Vercel: `npx vercel` (framework Vite) · Netlify: build `npm run build`, publish `dist`.
