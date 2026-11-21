/* ============================================================================
   ALL PORTFOLIO CONTENT LIVES HERE.
   Anything marked DUMMY / todo:true is sample content — a yellow banner reminds you in
   `npm run dev` only (never in the production build). Replace before going live.
   Live edits from the Admin panel (Ctrl+Shift+E) are stored in localStorage and
   override this file in that browser only.
   ========================================================================== */
export const DEFAULT_DATA = {
  profile: {
    name: 'Karthick', fullName: 'Karthick M', role: 'AI Engineer | Python & LLM Developer',
    headline: 'I build AI that reads invoices so people don\'t have to.',
    intro: 'Self-hosted LLMs, OCR and RAG pipelines that take documents from email straight into SAP Business One — no manual data entry.',
    about: "I'm an AI Engineer at Avaniko Technologies, Chennai, with 1+ year of hands-on experience building production document AI. I built an end-to-end invoice automation system: it reads invoices directly from email, extracts data with PaddleOCR and a self-hosted, quantized Qwen 3.6 35B LLM, converts it to structured JSON and stores it in SAP Business One and the database automatically. I come from an M.Com background, so I understand the accounting process and the code that automates it.",
    location: 'Chennai, India',
    available: true,                           // shows the green "Open to opportunities" badge
    email: 'karthickweb6@gmail.com',
    phone: '+91 63825 51412',                 // shown as an icon in the footer ('' to hide)
    linkedin: 'https://www.linkedin.com/in/karthick250700/',
    github: 'https://github.com/KARTHICK250700',
    instagram: 'https://instagram.com/',      // DUMMY: replace with your Instagram (or '' to hide)
    resume: '/resume.pdf'                      // ATS resume (Nov 2026)
  },
  // Real facts only — add measured numbers (invoices/month, accuracy %) when available.
  stats: [
    { value: '1+ yr', label: 'Building production AI' },
    { value: '35B', label: 'Self-hosted Qwen LLM' },
    { value: 'Email → SAP', label: 'Invoices posted with zero manual entry' }
  ],
  services: [
    { title: 'Document AI', text: 'Invoice and document extraction with PaddleOCR + LLM into clean, structured JSON.' },
    { title: 'LLM & RAG', text: 'Self-hosted, quantized LLMs (Qwen 3.6 35B), RAG with ChromaDB, and LangGraph agents with tool calling.' },
    { title: 'ERP Automation', text: 'Email-to-ERP pipelines that post invoices straight into SAP Business One and the database.' },
    { title: 'Deployment', text: 'LLM inference APIs with FastAPI and Docker — from prototype to production.' }
  ],
  skills: ['Python', 'LLMs', 'Qwen 3.6 35B', 'RAG', 'ChromaDB', 'LangGraph', 'AI Agents', 'PaddleOCR', 'OCR', 'FastAPI', 'Docker', 'REST APIs', 'SAP Business One', 'Prompt Engineering', 'Email Automation', 'React.js'],
  pipeline: [['Email', 'invoice arrives'], ['PaddleOCR', 'extract text'], ['Qwen LLM', 'fields to JSON'], ['Validate', 'structured data'], ['SAP B1 + DB', 'stored automatically']],
  /* Projects: one card each + a full case study (opens at #case/<slug>).
     image: put screenshots in public/projects/ and reference './projects/x.png' */
  projects: [
    {
      slug: 'invoice-ai', title: 'Invoice AI: Email to SAP Business One',
      text: 'Reads invoices from email, extracts them with OCR + a self-hosted LLM, and posts structured JSON into SAP Business One.',
      metric: 'Zero manual data entry', tags: ['PaddleOCR', 'Qwen LLM', 'FastAPI', 'Docker', 'SAP B1'],
      image: '', github: '', live: '',
      problem: 'Supplier invoices arrived by email as PDFs and had to be typed into SAP Business One by hand — slow, repetitive and error-prone.',
      approach: 'The pipeline reads the mailbox, picks up invoice attachments, extracts text with PaddleOCR, and a self-hosted, quantized Qwen 3.6 35B LLM converts it to structured JSON (header, line items, tax, totals). The LLM runs as a FastAPI service in Docker.',
      architecture: ['Email inbox', 'Invoice PDF', 'PaddleOCR', 'Qwen 3.6 35B → JSON', 'SAP Business One + DB'],
      result: 'Invoices go from email to SAP Business One and the database automatically, with no manual data entry.'
    },
    {
      slug: 'knowledge-rag', title: 'Company Knowledge RAG',
      text: 'Assistant that answers questions from company documents, grounded in retrieved content.',
      metric: 'Grounded answers from company docs', tags: ['RAG', 'ChromaDB', 'LLM', 'Python'],
      image: '', github: '', live: '',
      problem: 'Answers were buried across company documents, so staff spent time searching or asking senior colleagues.',
      approach: 'Documents are chunked and embedded into ChromaDB; a retriever pulls the most relevant passages and the LLM answers only from them.',
      architecture: ['Docs', 'Chunk + embed', 'ChromaDB', 'Retriever', 'LLM answer'],
      result: 'Staff get answers grounded in company documents instead of searching manually.'
    },
    {
      slug: 'langgraph-agent', title: 'LangGraph Agent', todo: true,
      text: 'Multi-step agent with tool calling that automates a business workflow.',
      metric: 'Multi-step, tool-using agent', tags: ['LangGraph', 'Agents', 'Tool Calling'],
      image: '', github: '', live: '',
      problem: 'TODO: describe the real business workflow this agent automates.',
      approach: 'A LangGraph agent plans the steps, calls tools (APIs / database) and moves the workflow forward, with a human check where needed.',
      architecture: ['Trigger', 'Planner node', 'Tool calls', 'Human check', 'Done'],
      result: 'TODO: add the real outcome.'
    }
  ],
  // Real quotes only (manager, client, colleague). Section stays hidden while empty.
  testimonials: [] // add real quotes only (manager, client, colleague) — section stays hidden while empty

}
