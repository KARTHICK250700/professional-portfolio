/* ============================================================================
   ALL PORTFOLIO CONTENT LIVES HERE.
   Anything marked DUMMY / todo:true is sample content — a yellow banner reminds you in
   `npm run dev` only (never in the production build). Replace before going live.
   Live edits from the Admin panel (Ctrl+Shift+E) are stored in localStorage and
   override this file in that browser only.
   ========================================================================== */
export const DEFAULT_DATA = {
  profile: {
    name: 'Karthick', fullName: 'Karthick M', role: 'Python & AI Developer',
    headline: 'I build AI that does the boring work.',
    intro: 'AI systems, automation workflows and full-stack web apps that turn manual business work into automated pipelines.',
    about: "I'm an AI developer at Avaniko Technologies, Chennai. I came from an M.Com background and taught myself Python, web development and machine learning — so I understand the business problem and the code that solves it.",
    location: 'Chennai, India',
    available: true,                           // shows the green "Open to opportunities" badge
    email: 'karthick.dev@example.com',        // DUMMY: replace with real email
    linkedin: 'https://www.linkedin.com/in/karthick250700/',
    github: 'https://github.com/',             // DUMMY: replace with your GitHub
    resume: '/resume.pdf'                      // generated from LinkedIn — add phone/email in the source file
  },
  // DUMMY numbers — replace with true ones before going live.
  stats: [
    { value: '6+', label: 'AI pipelines in production' },
    { value: '20K', label: 'Documents processed / month' },
    { value: '1,200h', label: 'Manual work saved / year' }
  ],
  services: [
    { title: 'AI Systems', text: 'RAG over company docs, OCR pipelines, LLM deployment and LangGraph agents.' },
    { title: 'Automation', text: 'Connect AI to real business processes — invoices, reports, approvals, no manual steps.' },
    { title: 'Full-Stack Web', text: 'React frontends and Node / Python APIs that put your AI in front of real users.' },
    { title: 'Deployment', text: 'From prototype to production — reliable, monitored, ready to scale.' }
  ],
  skills: ['Prompt Engineering', 'Machine Learning', 'AI Agents', 'RAG', 'LangGraph', 'OCR', 'LLMs', 'React.js', 'Web Development'],
  pipeline: [['Documents', 'PDF / scans'], ['OCR', 'extract text'], ['LLM + RAG', 'understand'], ['AI Agent', 'decide & act'], ['Automated', 'work done']],
  /* Projects: one card each + a full case study (opens at #case/<slug>).
     image: put screenshots in public/projects/ and reference './projects/x.png' */
  projects: [
    {
      slug: 'invoice-ai', title: 'Invoice AI Pipeline', todo: true,
      text: 'PDF invoices to structured JSON for ERP integration using OCR + LLM.',
      metric: '4 hrs → 10 min per batch', tags: ['OCR', 'LLM', 'Python'],
      image: '', github: '', live: '',
      problem: 'The accounts team typed 300+ supplier invoices a day into the ERP by hand. Each batch took about 4 hours and typos caused payment mismatches every week.',
      approach: 'OCR extracts the text, an LLM maps it to ERP fields with a strict JSON schema, and rule checks (totals, tax, vendor match) flag anything uncertain for a 1-click human review.',
      architecture: ['PDF upload', 'OCR', 'LLM field extraction', 'Validation rules', 'ERP JSON'],
      result: 'Batch time dropped from 4 hours to 10 minutes, field accuracy reached 96%, and the team now only reviews flagged invoices.'
    },
    {
      slug: 'knowledge-rag', title: 'Company Knowledge RAG', todo: true,
      text: 'Chat assistant that answers from internal docs with source citations.',
      metric: 'Answers 80% of internal questions', tags: ['RAG', 'LangChain', 'Vector DB'],
      image: '', github: '', live: '',
      problem: 'Staff spent hours searching SOPs, manuals and old emails for answers, and the same questions reached senior people again and again.',
      approach: 'Documents are chunked and embedded into a vector DB; a retriever pulls the top passages and the LLM answers only from them, always with clickable sources.',
      architecture: ['Docs', 'Chunk + embed', 'Vector DB', 'Retriever', 'LLM answer + sources'],
      result: 'Around 80% of routine questions are answered instantly with sources; average lookup time went from 15 minutes to under 30 seconds.'
    },
    {
      slug: 'langgraph-agent', title: 'LangGraph Agent', todo: true,
      text: 'Multi-step, tool-using agent that automates a business workflow end to end.',
      metric: '3-day process → same day', tags: ['LangGraph', 'Agents', 'APIs'],
      image: '', github: '', live: '',
      problem: 'Purchase requests moved between email, spreadsheets and the ERP, so a simple approval took about 3 days of follow-ups.',
      approach: 'A LangGraph agent reads the request, checks budget and stock through tool calls, drafts the PO and pauses for a human approval step before posting.',
      architecture: ['Trigger', 'Planner node', 'Tool calls', 'Human approval', 'Done'],
      result: 'Most requests now close the same day, with a full audit trail of every step the agent took.'
    }
  ],
  // Real quotes only (manager, client, colleague). Section stays hidden while empty.
  testimonials: [ // DUMMY quotes — replace with real ones (or empty the list to hide the section)
    { quote: 'Karthick turned a messy manual process into a pipeline the whole team trusts. He understands the business side, not just the code.', name: 'Team Lead', role: 'Avaniko Technologies', todo: true },
    { quote: 'Fast, careful and always explains the trade-offs. Our invoice backlog disappeared within weeks.', name: 'Finance Manager', role: 'Client', todo: true }
  ]
}
