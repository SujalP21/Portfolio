/**
 * Every repo URL below was verified against github.com/SujalP21 — none are guessed.
 * `primary: true` items carry résumé-verified impact bullets; the rest are
 * summarised from their own repository READMEs.
 *
 * `live` is taken from each repository's own `homepage` field and was checked
 * for a 200 response. Projects without a deployment keep `live: null` rather
 * than a guessed URL — a dead demo link costs more than an absent one.
 */
export const projects = [
  {
    id: 'nexusmeet',
    name: 'NexusMeet',
    domain: 'Real-time systems',
    primary: true,
    tagline: 'Peer-to-peer video conferencing with screen sharing and persisted meeting history.',
    stack: ['React.js', 'Node.js', 'Express.js', 'Socket.IO', 'WebRTC', 'MongoDB'],
    bullets: [
      'Developed a live video conferencing platform with peer-to-peer audio/video and screen sharing.',
      'Verified support for 4+ concurrent participants with sub-100ms signaling connection time across client tests.',
      'Implemented JWT authentication and persisted meeting history in MongoDB for secure sessions.',
    ],
    repo: 'https://github.com/SujalP21/NexusMeet',
    live: 'https://nexusmeet-delta.vercel.app/',
  },
  {
    id: 'docututor-rag',
    name: 'DocuTutor-RAG',
    domain: 'Applied AI / RAG',
    primary: true,
    tagline: 'A local RAG engine that turns technical PDFs into an interactive AI tutor.',
    stack: ['Python', 'LangChain', 'FastAPI', 'Redis', 'Vector Database'],
    bullets: [
      'Engineered a RAG platform indexing 1,000+ document chunks in a vector store for LangChain-based question answering, achieving 92% retrieval relevance across a manually evaluated benchmark of 50 domain-specific queries.',
      'Added an async pipeline with Redis caching and concurrency locking for simultaneous document queries.',
      'Instrumented the service with performance metrics and added test coverage for pipeline reliability.',
    ],
    repo: 'https://github.com/SujalP21/DocuTutor-RAG',
    // Runs locally against a self-hosted vector store; no public deployment.
    live: null,
  },
  {
    id: 'voxcode',
    name: 'VoxCode',
    domain: 'Agentic AI',
    primary: true,
    tagline: 'A voice-driven web IDE where an autonomous agent plans, calls tools, and writes code.',
    stack: ['Python', 'FastAPI', 'WebSockets', 'JavaScript'],
    bullets: [
      'Designed a voice-driven web IDE where an autonomous LLM agent runs a PLAN-TOOL-OBSERVE-OUTPUT loop over WebSockets, validated across 25+ development prompts for reliable task execution.',
      'Sandboxed agent file execution to a restricted workspace directory, blocking path traversal and absolute-path access for safe autonomous operation.',
      'Enabled optional text-to-speech narration of agent output alongside live streamed UI updates.',
    ],
    repo: 'https://github.com/SujalP21/VoxCode',
    // Sandboxed agent needs a writable workspace; no public deployment.
    live: null,
  },
  {
    id: 'conversai',
    name: 'ConversAI',
    domain: 'Applied AI',
    primary: false,
    tagline: 'A streaming conversational AI client with threaded history and rate-limited access.',
    stack: ['React 19', 'Vite', 'Node.js', 'Express 5', 'MongoDB', 'OpenAI API', 'JWT'],
    bullets: [
      'Streams model output token-by-token over Server-Sent Events, rendering markdown with syntax-highlighted, copyable code blocks.',
      'Thread management with AI-generated titles plus search, rename and delete, persisted per user in MongoDB.',
      'JWT + bcrypt authentication with per-user rate limiting at 30 messages/hour.',
    ],
    repo: 'https://github.com/SujalP21/ConversAI',
    live: 'https://convers-ai-chi.vercel.app/',
  },
  {
    id: 'sharplearn',
    name: 'SharpLearn',
    domain: 'Full-stack platform',
    primary: false,
    tagline: 'A two-sided ed-tech marketplace connecting instructors and learners.',
    stack: [
      'React.js',
      'Redux',
      'Tailwind CSS',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Razorpay',
      'Cloudinary',
    ],
    bullets: [
      'Student-side course catalog with ratings and wishlists, paired with instructor dashboards carrying course analytics and authoring tools.',
      'RESTful API covering authentication, course management and payment processing.',
      'OTP verification and password reset, Razorpay checkout, and a Cloudinary media pipeline.',
    ],
    repo: 'https://github.com/SujalP21/SharpLearn',
    live: null,
  },
  {
    id: 'wanderlust',
    name: 'WanderLust',
    domain: 'Full-stack platform',
    primary: false,
    tagline: 'An Airbnb-inspired platform for listing, exploring and reviewing places to stay.',
    stack: [
      'Node.js',
      'Express.js',
      'MongoDB',
      'Mongoose',
      'Passport.js',
      'EJS',
      'Bootstrap 5',
      'Mapbox',
      'Cloudinary',
    ],
    bullets: [
      'Full CRUD property listings with Multer/Cloudinary image uploads and category-based browsing.',
      'Passport.js local-strategy authentication with a per-listing review and rating system.',
      'Per-property interactive maps and geocoding through Mapbox.',
    ],
    repo: 'https://github.com/SujalP21/WanderLust',
    // Render free tier — first request after idle can take ~60s to wake.
    live: 'https://wanderlust-pcwu.onrender.com/listings',
  },
]
