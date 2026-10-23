/* ARISEVERSE — shared content model.
   Source: client documents in /Ariseverse (ARISE Method IP deck, Master Business Document Jul 2026,
   "New Learning Model" note, Module 1/2 decks, Real Estate Ecosystem module, Market Health Diagnostic).
   Anything labelled "sample" is prototype placeholder data, not client fact. */

window.AV = (function () {
  const pillars = [
    { key: 'A', name: 'Awaken',    color: 'var(--p-a)', phase: 1, line: 'Mindset, identity, and confidence — before any real estate content.' },
    { key: 'R', name: 'Root',      color: 'var(--p-r)', phase: 2, line: 'Deep market, product, and industry knowledge — the factual bedrock.' },
    { key: 'I', name: 'Influence', color: 'var(--p-i)', phase: 2, line: 'Reading clients, selling, and negotiating with precision.' },
    { key: 'S', name: 'Systemize', color: 'var(--p-s)', phase: 3, line: 'AI tools, professional systems, and repetition-based practical training.' },
    { key: 'E', name: 'Elevate',   color: 'var(--p-e)', phase: 4, line: 'Interview-ready, placement, and long-term career growth.' }
  ];

  const categories = [
    { id: 'identity',  pillar: 'A', name: 'Personal Transformation',     framework: 'The IDENTITY RESET Framework',   from: 1,  to: 6,  formula: 'Awareness + Purpose + Mindset + Discipline + Communication + Confidence', result: 'Transformation-Ready Professional' },
    { id: 'bedrock',   pillar: 'R', name: 'Real Estate Foundation',      framework: 'The BEDROCK Framework',          from: 7,  to: 12, formula: 'Industry Knowledge + Terminology + Property Types + Legal Literacy + Business Models + Ethics', result: 'Unshakeable Foundation' },
    { id: 'lens',      pillar: 'R', name: 'Market Knowledge — Dubai & Global', framework: 'The 360° MARKET LENS Framework', from: 13, to: 18, formula: 'Dubai + India + Global + Trends + Location + Economics', result: 'Complete Market Vision' },
    { id: 'dna',       pillar: 'R', name: 'Products & Projects',         framework: 'The PROJECT DNA Framework',      from: 19, to: 24, formula: 'Residential + Commercial + Off-Plan Literacy + Lifecycle + Payment Structuring + Developer Intelligence', result: 'Product Mastery' },
    { id: 'mind',      pillar: 'I', name: 'Buyer Psychology',            framework: 'The MINDREADER Framework',       from: 25, to: 27, formula: 'Buyer Mindset + Needs & Motivation + Decision Mapping', result: 'Predictive Client Insight' },
    { id: 'magnetic',  pillar: 'I', name: 'Sales Mastery',               framework: 'The MAGNETIC SELLING System',    from: 28, to: 34, formula: 'Process + Lead Gen + Prospecting + Discovery + Presentation + Objection Handling + Closing', result: 'Magnetic Conversion' },
    { id: 'deallock',  pillar: 'I', name: 'Negotiation & Closing',       framework: 'The DEAL LOCK Framework',        from: 35, to: 37, formula: 'Negotiation Skill + Price Strategy + Commitment Securing', result: 'Locked Deals' },
    { id: 'aria',      pillar: 'S', name: 'AI & Technology',             framework: 'The ARIA ADVANTAGE Framework',   from: 38, to: 41, formula: 'AI Overview + Productivity Tools + AI Marketing + CRM & Analytics', result: 'Augmented Agent Advantage' },
    { id: 'image',     pillar: 'S', name: 'Professional Excellence',     framework: 'The IMAGE OF SUCCESS Framework', from: 42, to: 46, formula: 'Daily Discipline + Presentation + Personal Branding + Time Mastery + Network Equity', result: 'Market-Ready Image' },
    { id: 'realrep',   pillar: 'S', name: 'Practical Training',          framework: 'The REAL REP Framework',         from: 47, to: 50, formula: 'Cold Call Reps + Mock Meetings + Site Simulations + Field Exposure', result: 'Client-Ready Confidence' },
    { id: 'launchpad', pillar: 'E', name: 'Career & Placement',          framework: 'The LAUNCHPAD Framework',        from: 51, to: 52, formula: 'Interview Readiness + First 60-Day Execution', result: 'Career Launch' }
  ];

  const moduleList = [
    ['Self-Awareness & Personal Transformation', 'The Mirror Method'],
    ['Goal Setting & Life Purpose', 'The North Star Blueprint'],
    ['Positive Mindset & Attitude', 'The Altitude Shift'],
    ['Discipline, Habits & Time Management', 'The 1% Discipline Loop'],
    ['Communication Mastery', 'The Clarity Code'],
    ['Confidence & Motivation', 'The Ignition Formula'],
    ['Real Estate Industry Overview', 'The Big Picture Map'],
    ['Real Estate Terminology', 'The Fluency Deck'],
    ['Types of Properties', 'The Property Spectrum'],
    ['Real Estate Laws & Regulations', 'The Compliance Shield'],
    ['Real Estate Business Models', 'The Revenue Blueprint'],
    ['Ethics & Professionalism', 'The Trust Ledger'],
    ['Dubai Real Estate Market Overview', 'The Dubai Radar'],
    ['India Real Estate Market Overview', 'The India Radar'],
    ['Global Real Estate Markets', 'The Global Compass'],
    ['Market Analysis & Trends', 'The Trendline Tracker'],
    ['Location Analysis', 'The Micro-Market Grid'],
    ['Economic Factors Impacting Real Estate', 'The Macro Pulse'],
    ['Residential Real Estate', 'The Home Matrix'],
    ['Commercial Real Estate', 'The Yield Grid'],
    ['Off-Plan vs Ready Properties', 'The Risk-Reward Ledger'],
    ['Project Lifecycle', 'The Lifecycle Wheel'],
    ['Payment Plans & Structures', 'The Payment Architect'],
    ['Developer Analysis', 'The Developer Scorecard'],
    ['Understanding Buyer Mindset', 'The Client Lens'],
    ['Buyer Needs & Motivation', 'The Motivation Map'],
    ['Buying Decision Process', 'The Decision Funnel'],
    ['Sales Process in Real Estate', 'The Sales Spine'],
    ['Lead Generation Strategies', 'The Pipeline Engine'],
    ['Prospecting Skills', 'The Outreach Multiplier'],
    ['Meeting & Discovery', 'The Discovery Compass'],
    ['Presentation Skills', 'The Signature Pitch'],
    ['Objection Handling', 'The Objection Judo'],
    ['Closing Techniques', 'The Close Code'],
    ['Negotiation Skills', 'The Win-Win Lever'],
    ['Price Discussions', 'The Value Anchor'],
    ['Closing & Commitments', 'The Commitment Seal'],
    ['AI in Real Estate — Overview', 'The AI Edge Map'],
    ['AI Tools for Productivity', 'The Time Multiplier Stack'],
    ['AI for Marketing & Content', 'The Content Amplifier'],
    ['CRM, Automation & Data Analytics', 'The Pipeline Intelligence Grid'],
    ['Daily Routine for Sales Agent', 'The Hour-by-Hour Blueprint'],
    ['How to Dress & Grooming', 'The First Impression Code'],
    ['Professional Image & Personal Branding', 'The Signature Brand Formula'],
    ['Time Management', 'The Priority Matrix'],
    ['Networking & Relationship Building', 'The Relationship Compounding Loop'],
    ['Mock Training: Cold Calls', 'The Cold Call Rep Drill'],
    ['Mock Meetings & Role Plays', 'The Live-Fire Simulator'],
    ['Site Visit Simulations', 'The Site Walk Protocol'],
    ['Practical Insights & Industry Exposure', 'The Field Intelligence Debrief'],
    ['Interview Preparation', 'The Interview-Ready Protocol'],
    ['First 60 Days in New Job', 'The 60-Day Launch Sequence']
  ];

  const modules = moduleList.map(([title, tool], i) => {
    const n = i + 1;
    const cat = categories.find(c => n >= c.from && n <= c.to);
    return { n, title, tool, cat: cat.id, pillar: cat.pillar };
  });

  const phases = [
    { n: '01', name: 'Human Transformation', pillars: 'A — Awaken', line: 'Confidence, identity, EQ, discipline — before any real estate content.', detail: 'Purpose, identity, confidence, discipline, emotional intelligence, communication and leadership.' },
    { n: '02', name: 'Professional Excellence', pillars: 'R — Root · I — Influence', line: 'Full market mastery: India, UAE, Saudi — investment, legal, finance, negotiation.', detail: 'India, UAE and Saudi Arabia markets, investment advisory, sales, legal knowledge, finance and customer experience.' },
    { n: '03', name: 'AI-Powered Practice', pillars: 'S — Systemize · ARIA X', line: 'Hundreds of simulated buyer, seller and investor sessions before the first real client.', detail: 'Real-world simulations, AI role plays, mock interviews, assignments, investment analysis and continuous coaching through ARIA X.' },
    { n: '04', name: 'Career Launch', pillars: 'E — Elevate · Careers', line: 'Ariseverse Careers connects graduates directly with employer partners.', detail: 'Placement preparation, employer matching, leadership development and entrepreneurship.' },
    { n: '05', name: 'Lifetime Growth', pillars: 'Alumni', line: 'Alumni network — ongoing AI coaching, intelligence and career advancement.', detail: 'Lifetime access to ARIA X, market intelligence, the alumni community and advanced programmes.' }
  ];

  const personas = [
    { name: 'Fresh Graduate', line: 'Start a career with structure, not survival-mode learning on live clients.' },
    { name: 'Career Switcher', line: 'Move from banking, hospitality, retail or tech into advisory with a proven system.' },
    { name: 'Informal Agent', line: 'Turn street experience into a recognised, RERA-ready professional practice.' },
    { name: 'Experienced Agent', line: 'Upgrade to investment-grade advisory across India, UAE and Saudi Arabia.' },
    { name: 'NRI', line: 'Build a cross-border practice serving Indian and GCC investors.' },
    { name: 'Team Leader', line: 'Coach a team with one shared method instead of one-week inductions.' }
  ];

  /* Validated figures only, with their source line from the Master Business Document §14 */
  const stats = [
    { value: '1,05,712', label: 'RERA-registered agents in India, 2025 — up from 27,073 in 2018', ev: 'v', src: 'MoHUA data via eXp Realty India, 2025' },
    { value: '23,536', label: 'Registered brokers in Dubai (Q4 2024)', ev: 'v', src: 'Dubai Pulse Q4 2024' },
    { value: '94.9%', label: "of Dubai's 6,784 brokerage firms have 1–10 agents — no training department", ev: 'v', src: 'Dubai Pulse Q4 2024' },
    { value: 'AED 917B', label: 'Dubai transaction value in 2025, up 20% year on year', ev: 'v', src: 'Dubai Land Department, Jan 2026' }
  ];

  const ecosystem = [
    { name: 'Academy',    line: 'The flagship five-phase career transformation programme.' },
    { name: 'ARIA X',     line: 'AI mentor and digital human — with every learner, permanently.' },
    { name: 'Careers',    line: 'Placement engine connecting graduates with employer partners.' },
    { name: 'Media',      line: 'Thought leadership, podcasts and guest sessions with industry leaders.' },
    { name: 'Research',   line: 'Market intelligence reports across India, UAE and Saudi Arabia.' },
    { name: 'Corporate',  line: 'Enterprise training for brokerages and developers.' },
    { name: 'Foundation', line: 'Scholarships and social impact that widen the talent pipeline.' }
  ];

  const ariaLive = [
    { name: 'AI Teacher',            line: 'Structured, self-paced delivery of every module — explained your way.' },
    { name: 'Roleplay Partner',      line: 'Buyer, seller and investor simulations with instant feedback.' },
    { name: 'Daily Planner',         line: 'Task tracking and accountability built on your North Star goals.' },
    { name: 'Investment Calculator', line: 'ROI, mortgage and rental-yield tools for client conversations.' }
  ];
  const ariaRoadmap = [
    { name: 'Mock Interviewer',  line: 'AI-scored interviews with feedback tracking.' },
    { name: 'AI News Engine',    line: 'Auto-curated regulatory and launch updates.' },
    { name: 'Motivation Coach',  line: 'Personalised daily mindset support.' },
    { name: 'Knowledge Hub',     line: 'Live intelligence for India, UAE and Saudi Arabia.' }
  ];

  /* Planning targets from the Master Business Document §5 — present as targets, not results */
  const employerMetrics = [
    { metric: 'Onboarding time',      old: '3–6 months',  next: '2–4 weeks' },
    { metric: 'Training investment',  old: '₹30K–80K per hire', next: 'Absorbed in programme fee' },
    { metric: 'First transaction',    old: 'Month 3–6',   next: 'Month 1–2' },
    { metric: 'Year-1 attrition',     old: '40–60%',      next: 'Target 15–20%' }
  ];

  /* Market Health Diagnostic — thresholds from "Market_Health_Diagnostic.docx" */
  const diagnostic = {
    metrics: [
      { id: 'resale', name: 'Resale-to-Primary Ratio', unit: '%', min: 0, max: 100, step: 1, def: 45,
        q: 'Share of transactions that are investor-to-investor resales',
        healthy: 'Below 40%', warning: 'Above 60%', src: 'DLD / RERA transaction data',
        rate: v => v < 40 ? 'ok' : v > 60 ? 'warn' : 'watch' },
      { id: 'pipeline', name: 'Absorption vs Completion Pipeline', unit: '×', min: 0.5, max: 3.5, step: 0.1, def: 1.4,
        q: 'Units completing in 12–18 months vs monthly absorption',
        healthy: '≤ 1.2×', warning: '≥ 2×', src: 'Developer launch calendars',
        rate: v => v <= 1.2 ? 'ok' : v >= 2 ? 'warn' : 'watch' },
      { id: 'cash', name: 'Cash-to-Mortgage Ratio', unit: '% cash', min: 0, max: 100, step: 1, def: 58,
        q: 'Share of purchases made in cash',
        healthy: 'Above 55% cash', warning: 'Below 30% cash', src: 'Registration / mortgage filings',
        rate: v => v > 55 ? 'ok' : v < 30 ? 'warn' : 'watch' },
      { id: 'yield', name: 'Rental Yield', unit: '% gross', min: 1, max: 10, step: 0.1, def: 6.2,
        q: 'Gross rental yield on capital value',
        healthy: '5% – 7%', warning: 'Below 3.5%', src: 'Rent index vs sale price index',
        rate: v => v < 3.5 ? 'warn' : v >= 5 ? 'ok' : 'watch' },
      { id: 'dom', name: 'Secondary Days-on-Market', unit: 'qtrs rising', min: 0, max: 6, step: 1, def: 1,
        q: 'Consecutive quarters of rising resale days-on-market',
        healthy: 'Stable or falling', warning: 'Rising 3+ quarters', src: 'Portal listing data',
        rate: v => v === 0 ? 'ok' : v >= 3 ? 'warn' : 'watch' }
    ],
    verdict(values) {
      const ratings = this.metrics.map(m => m.rate(Number(values[m.id])));
      const warnings = ratings.filter(r => r === 'warn').length;
      const watches = ratings.filter(r => r === 'watch').length;
      let band;
      if (warnings <= 1) band = { key: 'growth', name: 'Growth Market', line: 'Price follows GDP, jobs and population. Lower volatility, slower but compounding returns. Safe to hold medium-to-long term.' };
      else if (warnings <= 3) band = { key: 'transitional', name: 'Transitional Market', line: 'Fundamentals still present but speculation is building. Reduce leverage, shorten holding-period assumptions, watch the next two quarters closely.' };
      else band = { key: 'speculative', name: 'Speculative Market', line: 'Price is following sentiment, not utility. High short-term returns are still possible, but tail-risk of correction is high. Exit-plan discipline becomes essential.' };
      return { ratings, warnings, watches, band };
    },
    presets: {
      healthy:     { label: 'Healthy scenario',     values: { resale: 32, pipeline: 1.1, cash: 62, yield: 6.4, dom: 0 } },
      building:    { label: 'Speculation building', values: { resale: 55, pipeline: 1.8, cash: 41, yield: 4.6, dom: 2 } },
      speculative: { label: 'Speculative scenario', values: { resale: 68, pipeline: 2.6, cash: 24, yield: 3.1, dom: 4 } }
    }
  };

  /* Free stock media (Unsplash photos, Pexels videos — see media/CREDITS.md). Placeholders for the client's own shoots.
     Stock faces are for illustration only: never caption them as real ARISEVERSE students, graduates or staff. */
  const img = n => 'media/img/' + n + '.webp';
  const media = {
    img,
    person: n => 'media/people/av-' + n + '.webp',
    video: n => ({ src: 'media/video/' + n + '.mp4', poster: 'media/video/' + n + '.webp' }),
    phase: ['journal', 'classroom', 'headset-laptop', 'handshake', 'networking'].map(img),
    persona: { 'Fresh Graduate': 'graduate', 'Career Switcher': 'switcher', 'Informal Agent': 'informal', 'Experienced Agent': 'experienced', NRI: 'nri', 'Team Leader': 'leader' },
    category: { identity: 'journal', bedrock: 'listings', lens: 'dubai-interchange', dna: 'residential-towers', mind: 'site-visit', magnetic: 'office-presentation', deallock: 'signing', aria: 'headset-laptop', image: 'persona-experienced', realrep: 'phone-call', launchpad: 'interview' },
    market: { India: 'mumbai-skyline', UAE: 'dubai-interchange', 'Saudi Arabia': 'riyadh-kingdom' },
    // sample people shown in the portal (fictional names, stock portraits)
    people: { 'Rohan Mehta': 'rohan', 'Simran Kaur': 'simran', 'Aman Verma': 'aman', 'Neha Sharma': 'neha', 'Vikram Singh': 'vikram', 'Pooja Iyer': 'pooja', 'Sameer Khan': 'sameer', 'Meera Nair': 'meera', 'Rajiv Menon': 'rajiv', 'Khalid Al Mansoori': 'khalid', 'Ananya Rao': 'ananya', 'Kabir Shah': 'kabir' }
  };

  const logoSVG = '<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3.5 37 35H3Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 16.5 27.4 30.5H12.6Z" fill="#B8925A"/><path d="M29.5 6.5l4 7.2h-8z" fill="#E9DFCB" opacity=".9"/></svg>';

  function moduleById(n) { return modules[n - 1]; }
  function category(id) { return categories.find(c => c.id === id); }
  function pillar(key) { return pillars.find(p => p.key === key); }

  return { pillars, categories, modules, phases, personas, stats, ecosystem, ariaLive, ariaRoadmap, employerMetrics, diagnostic, media, logoSVG, moduleById, category, pillar };
})();

/* Small shared helpers */
window.AVStore = {
  get(k, fallback) { try { const v = localStorage.getItem('av:' + k); return v == null ? fallback : JSON.parse(v); } catch (e) { return fallback; } },
  set(k, v) { try { localStorage.setItem('av:' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable — prototype still works */ } }
};
