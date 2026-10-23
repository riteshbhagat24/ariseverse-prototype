/* ARISEVERSE — public website behaviour */
(function () {
  const AV = window.AV;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n, cur) => {
    const v = Math.round(n);
    if (cur === 'INR') {
      if (v >= 1e7) return '₹' + (v / 1e7).toFixed(2) + ' Cr';
      if (v >= 1e5) return '₹' + (v / 1e5).toFixed(1) + ' L';
      return '₹' + v.toLocaleString('en-IN');
    }
    if (v >= 1e6) return 'AED ' + (v / 1e6).toFixed(2) + 'M';
    return 'AED ' + v.toLocaleString('en-US');
  };
  const pillarColor = { A: 'var(--p-a)', R: 'var(--p-r)', I: 'var(--p-i)', S: 'var(--p-s)', E: 'var(--p-e)' };

  function toast(html) {
    const t = $('.toast');
    t.innerHTML = html;
    t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { t.hidden = true; }, 3800);
  }

  /* ---------- Logo + local clocks ---------- */
  $$('[data-logo-mark]').forEach(el => { el.outerHTML = AV.logoSVG; });

  (function clocks() {
    const el = $('[data-clocks]'); if (!el) return;
    const zones = [['Dubai', 'Asia/Dubai'], ['Mumbai', 'Asia/Kolkata'], ['Riyadh', 'Asia/Riyadh']];
    const draw = () => {
      el.innerHTML = zones.map(([city, tz]) => {
        let t = '--:--';
        try { t = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(new Date()); } catch (e) { /* older browsers */ }
        return `<span>${city} <b class="num">${t}</b></span>`;
      }).join('');
    };
    draw(); setInterval(draw, 20000);
  })();

  /* ---------- Static renderers ---------- */
  const R = {};

  R.stats = el => {
    el.innerHTML = AV.stats.map(s => `<div class="stat"><b>${s.value}</b><p>${s.label}</p><span class="ev ev-v">Validated</span><small>${s.src}</small></div>`).join('');
  };

  R.arise = el => {
    el.innerHTML = `<div class="arise-tabs" role="tablist">${AV.pillars.map((p, i) => `
      <button class="arise-tab${i === 0 ? ' on' : ''}" role="tab" data-p="${p.key}"><span class="L">${p.key}</span><span><b>${p.name}</b><small>Phase ${p.phase}</small></span></button>`).join('')}
      </div><div class="arise-panel" role="tabpanel"></div>`;
    const panel = $('.arise-panel', el);
    const show = key => {
      const p = AV.pillar(key);
      const cats = AV.categories.filter(c => c.pillar === key);
      const count = AV.modules.filter(m => m.pillar === key).length;
      panel.innerHTML = `<p class="eyebrow" style="color:${pillarColor[key]}">${p.key} — ${p.name} · ${count} modules</p>
        <h3>${p.line}</h3>
        ${cats.map(c => `<div class="cat"><div class="cat-head"><h4>${c.framework}</h4><span>${c.name} · M${c.from}–${c.to}</span></div>
          <p class="cat-formula">${c.formula} = <b>${c.result}</b></p>
          <div class="mods">${AV.modules.filter(m => m.cat === c.id).map(m => `<span class="mod-chip"><i>M${m.n}</i>${m.tool}</span>`).join('')}</div></div>`).join('')}`;
      $$('.arise-tab', el).forEach(b => b.classList.toggle('on', b.dataset.p === key));
    };
    el.addEventListener('click', e => { const b = e.target.closest('.arise-tab'); if (b) show(b.dataset.p); });
    show('A');
  };

  const phaseAlt = ['A learner writing in a journal', 'Students attending a lecture', 'A learner practising on a laptop with a headset', 'Two professionals shaking hands across a desk', 'Professionals mingling at a networking event'];
  R.phases = el => {
    el.innerHTML = AV.phases.map((p, i) => `<div class="phase${i === 2 ? ' hl' : ''}"><div class="ph-img"><img src="${AV.media.phase[i]}" alt="${phaseAlt[i]}" loading="lazy"><span class="n">${p.n}</span></div><div class="ph-body"><h4>${p.name}</h4><div class="pp">${p.pillars}</div><p>${p.line}</p></div></div>`).join('');
  };

  R.sessions = el => {
    const S = [
      { img: 'dubai-marina-night', d: '29', m: 'Oct', tag: 'Masterclass · Live online', title: 'Dubai off-plan in 2026: what buyers are really asking', meta: 'Thu · 7:00 PM GST · Founder-led' },
      { img: 'mumbai-skyline', d: '07', m: 'Nov', tag: 'Workshop · Mumbai', title: 'RERA essentials for new agents', meta: 'Sat · 11:00 AM IST · In person' },
      { img: 'phone-call', d: 'Tue', m: 'Weekly', tag: 'Practice lab · ARIA X', title: 'Cold Call Rep Drill: 30 calls in 60 minutes', meta: 'Every Tuesday · 6:30 PM IST · Online' },
      { img: 'site-visit', d: '14', m: 'Nov', tag: 'Field session · Dubai', title: 'The Site Walk Protocol, in a real show apartment', meta: 'Sat · 10:00 AM GST · In person' }
    ];
    el.innerHTML = S.map(s => `<article class="session"><div class="s-img"><img src="${AV.media.img(s.img)}" alt="" loading="lazy"><span class="s-date"><b>${s.d}</b>${s.m}</span></div>
      <div class="s-body"><p class="eyebrow">${s.tag}</p><h4>${s.title}</h4><p class="s-meta">${s.meta}</p><a href="#apply" class="link-gold">Reserve a spot →</a></div></article>`).join('');
  };

  R['phase-detail'] = el => {
    el.innerHTML = AV.phases.map((p, i) => `<div class="pd${i === 2 ? ' hl' : ''}"><span class="n">${p.n}</span><div><h3>${p.name}</h3><div class="pp">${p.pillars}</div></div><p>${p.detail}</p></div>`).join('');
  };

  const ariaIcons = ['✦', '⇄', '☰', '%'];
  R['aria-live'] = el => {
    el.innerHTML = AV.ariaLive.map(f => `<li><b>${f.name}</b><span>${f.line}</span></li>`).join('');
  };
  R['aria-live-cards'] = el => {
    el.innerHTML = AV.ariaLive.map((f, i) => `<div class="feat"><span class="fi">${ariaIcons[i]}</span><div><b>${f.name}</b><span>${f.line}</span></div></div>`).join('');
  };
  R['aria-roadmap'] = el => {
    el.innerHTML = AV.ariaRoadmap.map(f => `<div class="feat"><span class="fi">◌</span><div><b>${f.name}</b><span>${f.line}</span></div></div>`).join('');
  };

  R.personas = el => {
    el.innerHTML = AV.personas.map(p => `<div class="persona"><figure><img src="${AV.media.img('persona-' + AV.media.persona[p.name])}" alt="Illustrative portrait for the ${p.name} learner profile" loading="lazy"><figcaption>${p.name}</figcaption></figure><p>${p.line}</p></div>`).join('');
  };

  const empTable = cls => `<table class="cmp ${cls}"><thead><tr><th>Metric</th><th>Traditional</th><th class="av">ARISEVERSE</th></tr></thead><tbody>${AV.employerMetrics.map(m => `<tr><td>${m.metric}</td><td class="old">${m.old}</td><td class="av">${m.next}</td></tr>`).join('')}</tbody></table>`;
  R['emp-table'] = el => { el.innerHTML = empTable('') + '<p class="small faint mt-16"><span class="ev ev-t">Target</span> Planning targets, to be validated by Cohort 1.</p>'; };
  R['emp-table-lg'] = el => { el.innerHTML = empTable('lg'); };

  R.ecosystem = el => {
    el.innerHTML = AV.ecosystem.map((e, i) => `<div class="eco-item"><svg class="tri" viewBox="0 0 28 24"><path d="M14 1 27 23H1Z" fill="${i === 0 ? '#B8925A' : 'none'}" stroke="#B8925A" stroke-width="1.5"/></svg><h4>${e.name}</h4><p>${e.line}</p></div>`).join('');
  };

  R.faq = el => {
    const qa = [
      ['Do I need real estate experience?', 'No. Phase 1 — Human Transformation — comes before any real estate content. The programme is built for fresh graduates, career switchers, informal agents, experienced agents, NRIs and team leaders.'],
      ['Which markets does the programme cover?', 'India, the UAE and Saudi Arabia. You learn the six pillars of every transaction once, then the local layer: RERA in India, Dubai RERA and the DLD in the UAE, and REGA in Saudi Arabia.'],
      ['How is it delivered?', 'Live sessions led by the founding trainer, self-paced modules with the ARIA X AI Teacher, practical reps (cold calls, mock meetings, site-visit simulations) and assignments — all inside the ARISEVERSE learning portal.'],
      ['Is placement included?', 'Ariseverse Careers connects graduates with our employer partners — more than 30 brokerages today — and supports you through interviews and your first 60 days on the job.'],
      ['What does it cost?', 'Programme fees are shared on your counselling call. The fee is designed to be recoverable within one to three months of placement.'],
      ['What happens after I graduate?', 'Phase 5 — Lifetime Growth. Alumni keep ARIA X coaching, market intelligence and the ARISEVERSE community for the rest of their career.']
    ];
    el.innerHTML = qa.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('');
  };

  /* ---------- Curriculum explorer ---------- */
  R.explorer = el => {
    const chips = $('[data-explorer-chips]');
    const search = $('[data-explorer-search]');
    let filter = 'all';
    chips.innerHTML = `<button class="chip on" data-f="all">All 52 modules</button>` + AV.pillars.map(p => `<button class="chip" data-f="${p.key}"><b>${p.key}</b>${p.name}</button>`).join('');
    const hl = (text, q) => {
      if (!q) return esc(text);
      const i = text.toLowerCase().indexOf(q);
      if (i < 0) return esc(text);
      return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
    };
    const draw = () => {
      const q = search.value.trim().toLowerCase();
      const cats = AV.categories.filter(c => filter === 'all' || c.pillar === filter);
      let html = '';
      cats.forEach((c, ci) => {
        const mods = AV.modules.filter(m => m.cat === c.id && (!q || m.title.toLowerCase().includes(q) || m.tool.toLowerCase().includes(q)));
        if (q && !mods.length) return;
        const open = q || (filter !== 'all' && ci === 0) || (filter === 'all' && ci === 0);
        html += `<div class="xcat${open ? ' open' : ''}"><button class="xcat-head" aria-expanded="${!!open}"><span class="pl" style="background:${pillarColor[c.pillar]}">${c.pillar}</span><span><h4>${c.name}</h4><small>${c.framework}</small></span><span class="cnt">M${c.from}–${c.to} · ${c.to - c.from + 1} modules</span><svg class="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button>
          <div class="xcat-body"><p class="xcat-formula">${c.formula} = <b>${c.result}</b></p>${mods.map(m => `<div class="xmod"><span class="mn">M${m.n}</span><span>${hl(m.title, q)}</span><span class="tool">${hl(m.tool, q)}</span></div>`).join('')}</div></div>`;
      });
      el.innerHTML = html || `<div class="empty">No modules match “${esc(search.value)}”.</div>`;
    };
    chips.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      filter = b.dataset.f;
      $$('.chip', chips).forEach(c => c.classList.toggle('on', c === b));
      draw();
    });
    search.addEventListener('input', draw);
    el.addEventListener('click', e => {
      const h = e.target.closest('.xcat-head'); if (!h) return;
      const x = h.parentElement; x.classList.toggle('open');
      h.setAttribute('aria-expanded', x.classList.contains('open'));
    });
    draw();
  };

  /* ---------- Home chat demo (auto-plays while visible) ---------- */
  R['chat-demo'] = el => {
    const script = [
      ['client', 'Investor · Dubai', 'I’ve seen the brochure. Why should I buy off-plan in Dubai now — and not wait for a ready unit?'],
      ['me', 'You', 'Good question. Before I answer — is this for rental income from day one, or capital growth by handover?'],
      ['coach', '✦ ARIA X · Discovery +12', 'You asked before you pitched. That’s The Discovery Compass (M31) in action.'],
      ['client', 'Investor · Dubai', 'Growth, mostly. But I’m worried about construction delays.'],
      ['me', 'You', 'That’s fair. Let’s look at this developer’s delivery record together, and how escrow protects your payments until completion.'],
      ['coach', '✦ ARIA X · Objection handling +9', 'You validated the fear and moved to evidence. Next: anchor value with the payment plan — The Payment Architect (M23).']
    ];
    el.innerHTML = `<div class="cd-head"><span class="cd-av">AX</span><div><b>ARIA X · Roleplay Partner</b><small>Scenario: Off-plan investor, Dubai</small></div><span class="cd-live">Live demo</span></div><div class="cd-body"></div>`;
    const body = $('.cd-body', el);
    // Open with the client's first line so the panel is never empty before it scrolls into view
    body.innerHTML = `<div class="msg client"><small>${script[0][1]}</small>${script[0][2]}</div>`;
    let i = 1, timer = null, running = false;
    const step = () => {
      if (!running) return;
      if (i >= script.length) { timer = setTimeout(() => { body.innerHTML = ''; i = 0; step(); }, 3600); return; }
      const [who, label, text] = script[i];
      const typing = document.createElement('div');
      typing.className = 'typing'; typing.innerHTML = '<i></i><i></i><i></i>';
      if (who === 'me') typing.style.marginLeft = 'auto';
      body.appendChild(typing);
      timer = setTimeout(() => {
        typing.remove();
        const m = document.createElement('div');
        m.className = 'msg ' + who;
        m.innerHTML = `<small>${label}</small>${text}`;
        body.appendChild(m);
        i++;
        timer = setTimeout(step, who === 'coach' ? 2400 : 1500);
      }, who === 'coach' ? 900 : 1100);
    };
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !running) { running = true; step(); }
      else if (!en.isIntersecting && running) { running = false; clearTimeout(timer); $$('.typing', body).forEach(t => t.remove()); }
    }, { threshold: .3 }) : null;
    if (io) io.observe(el); else { running = true; step(); }
  };

  /* ---------- ARIA page: interactive roleplay ---------- */
  R.roleplay = el => {
    const turns = [
      { client: 'My neighbour sold for ₹2.4 crore last year. I want ₹2.8 crore for mine — not a rupee less.',
        opts: [
          { t: 'Sir, that’s unrealistic. The market won’t pay that.', s: [2, 1, 3, 3], f: 'Direct, but it closes the conversation. Lead with curiosity before correction.' },
          { t: 'I understand — it’s your biggest asset. Can I ask what the ₹2.8 crore needs to cover for you?', s: [9, 9, 6, 5], f: 'Excellent discovery. You found the motive behind the number — The Motivation Map (M26).' },
          { t: 'Sure — let’s list at ₹2.8 crore and see what happens.', s: [2, 6, 1, 2], f: 'Agreeing to win the listing sets you both up for a stale listing. Days-on-market will work against him.' }
        ] },
      { client: 'We’re upgrading to a bigger flat in Powai. I need the difference covered.',
        opts: [
          { t: 'Buyers are very price-sensitive right now. You’ll have to adjust.', s: [3, 3, 4, 3], f: 'True, but it sounds like a verdict. Show the evidence instead.' },
          { t: 'Then let’s build your Powai plan on solid ground — I’ll show you the three closest comparable sales.', s: [7, 8, 9, 7], f: 'You tied the price conversation to his goal and moved to evidence — The Objection Judo (M33).' },
          { t: 'I’ll find you a buyer at ₹2.8 crore. Trust me.', s: [1, 5, 1, 2], f: 'Over-promising erodes trust. The Trust Ledger (M12): never promise what the market hasn’t confirmed.' }
        ] },
      { client: 'Fine. If the comparables make sense, what would you list it at?',
        opts: [
          { t: 'Whatever you’re comfortable with.', s: [2, 6, 2, 2], f: 'You handed back control at the moment he asked for your expertise.' },
          { t: 'Let me think about it and get back to you next week.', s: [3, 5, 3, 1], f: 'Momentum lost. Come prepared to recommend.' },
          { t: 'Based on the three closest sales, ₹2.55 crore with room to ₹2.45. Shall we sign the listing today and start viewings this weekend?', s: [7, 7, 8, 10], f: 'Clear anchor, clear ask — The Value Anchor (M36) and The Commitment Seal (M37).' }
        ] }
    ];
    const dims = ['Discovery', 'Empathy', 'Objection handling', 'Closing'];
    let t = 0, picks = [];
    const start = () => {
      t = 0; picks = [];
      el.innerHTML = `<div class="cd-head"><span class="cd-av">AX</span><div><b>Seller · Mumbai</b><small>Wants 15% above market</small></div><span class="cd-live">Your turn</span></div><div class="rp-body"></div><div class="rp-choices"></div>`;
      turn();
    };
    const add = (cls, label, text) => {
      const m = document.createElement('div');
      m.className = 'msg ' + cls; m.innerHTML = `<small>${label}</small>${text}`;
      $('.rp-body', el).appendChild(m);
    };
    const turn = () => {
      const tr = turns[t];
      add('client', 'Seller', tr.client);
      $('.rp-choices', el).innerHTML = tr.opts.map((o, i) => `<button class="rp-choice" data-i="${i}">${o.t}</button>`).join('');
    };
    const score = () => {
      const tot = dims.map((_, d) => Math.round(picks.reduce((a, p) => a + p.s[d], 0) / picks.length * 10));
      const overall = Math.round(tot.reduce((a, b) => a + b, 0) / tot.length);
      $('.rp-choices', el).innerHTML = '';
      const sc = document.createElement('div');
      sc.className = 'rp-score';
      sc.innerHTML = `<h4>Your scorecard · ${overall}/100</h4>${dims.map((d, i) => `<div class="sc-row"><span>${d}</span><div class="bar"><i style="width:0"></i></div><b>${tot[i]}</b></div>`).join('')}
        <div class="row-gap" style="margin-top:18px"><a href="portal.html#aria" class="btn btn-gold btn-sm">Continue in the portal — 4 scenarios</a><button class="btn btn-line btn-sm" data-restart>Try again</button></div>`;
      el.appendChild(sc);
      requestAnimationFrame(() => $$('.sc-row .bar i', sc).forEach((b, i) => { b.style.width = tot[i] + '%'; }));
    };
    el.addEventListener('click', e => {
      if (e.target.closest('[data-restart]')) { start(); return; }
      const b = e.target.closest('.rp-choice'); if (!b) return;
      const o = turns[t].opts[+b.dataset.i];
      picks.push(o);
      add('me', 'You', o.t);
      $('.rp-choices', el).innerHTML = '';
      setTimeout(() => {
        add('coach', '✦ ARIA X coaching', o.f);
        t++;
        setTimeout(() => { t < turns.length ? turn() : score(); }, 700);
      }, 500);
    });
    start();
  };

  /* ---------- Careers: six-pillar wheel ---------- */
  R['careers-wheel'] = el => {
    const P = [
      { n: 'Development', does: 'Buys land, rezones it, builds or renovates, then sells or leases the finished product — the primary market.', who: 'Developer, project manager, urban planner', careers: 'Land acquisition analyst, project manager, urban planner', entry: 'Construction or engineering background, or analyst roles inside a developer' },
      { n: 'Sales & Marketing', does: 'Sells a developer’s completed or off-plan units and earns commission for moving new inventory.', who: 'Sales agent, marketing manager, CRM lead', careers: 'Off-plan sales agent, digital marketer, CRM / lead manager', entry: 'Sales training plus product knowledge — a strong entry point for career-changers' },
      { n: 'Brokerage', does: 'Represents buyers and sellers, landlords and tenants, on the resale and leasing side — the secondary market.', who: 'Real estate agent, broker, team leader', careers: 'Real estate agent, team leader, listings specialist', entry: 'Market-specific licensing exam plus a brokerage to work under' },
      { n: 'Property Management', does: 'Runs the asset after handover: rent, tenants and repairs, for a fee.', who: 'Property manager, facilities coordinator', careers: 'Property manager, leasing consultant, facilities coordinator', entry: 'Operations or customer-service background' },
      { n: 'Lending', does: 'Supplies the debt that makes almost every purchase and development possible.', who: 'Mortgage advisor, bank relationship manager', careers: 'Mortgage advisor, credit analyst, bank relationship manager', entry: 'Finance or banking background' },
      { n: 'Professional Services', does: 'Everyone else who makes a transaction legally sound and physically real.', who: 'Lawyer, valuer, interior designer, contractor', careers: 'Valuer, real estate lawyer, interior designer, contractor', entry: 'Specialist qualification in the relevant profession' }
    ];
    const cx = 210, cy = 210, r1 = 200, r0 = 92, n = P.length;
    const pt = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const segs = P.map((p, i) => {
      const a0 = -Math.PI / 2 + i * 2 * Math.PI / n + 0.012, a1 = -Math.PI / 2 + (i + 1) * 2 * Math.PI / n - 0.012;
      const [x0, y0] = pt(r1, a0), [x1, y1] = pt(r1, a1), [x2, y2] = pt(r0, a1), [x3, y3] = pt(r0, a0);
      const am = (a0 + a1) / 2, [tx, ty] = pt((r0 + r1) / 2, am);
      const words = p.n.split(' ');
      const label = words.length > 1 && p.n.length > 11
        ? `<tspan x="${tx}" dy="-0.5em">${words.slice(0, Math.ceil(words.length / 2)).join(' ')}</tspan><tspan x="${tx}" dy="1.2em">${words.slice(Math.ceil(words.length / 2)).join(' ')}</tspan>`
        : p.n;
      return `<g class="seg" data-i="${i}" opacity=".78"><path d="M${x0},${y0} A${r1},${r1} 0 0 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 0 0 ${x3},${y3} Z" fill="${i % 2 ? '#26241F' : '#121110'}" stroke="#B8925A" stroke-opacity=".35"/><text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="middle" fill="#F3EEE4" font-size="13" font-weight="600" font-family="Inter, sans-serif">${label}</text></g>`;
    }).join('');
    el.innerHTML = `<svg class="wheel-svg" viewBox="0 0 420 420" role="img" aria-label="The six pillars of real estate">${segs}<circle cx="${cx}" cy="${cy}" r="${r0 - 8}" fill="#B8925A"/><text x="${cx}" y="${cy - 8}" text-anchor="middle" font-family="Source Serif 4, Georgia, serif" font-size="20" font-weight="700" fill="#121110">One</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" font-family="Source Serif 4, Georgia, serif" font-size="20" font-weight="700" fill="#121110">transaction</text></svg><div class="wheel-info"></div>`;
    const info = $('.wheel-info', el);
    const show = i => {
      const p = P[i];
      $$('.seg', el).forEach(s => { const on = +s.dataset.i === i; s.classList.toggle('on', on); s.setAttribute('opacity', on ? 1 : .78); $('path', s).setAttribute('fill', on ? '#B8925A' : (+s.dataset.i % 2 ? '#26241F' : '#121110')); $('text', s).setAttribute('fill', on ? '#121110' : '#F3EEE4'); });
      info.innerHTML = `<p class="eyebrow">Pillar ${i + 1} of 6</p><h3>${p.n}</h3><p class="muted">${p.does}</p>
        <div class="wi-row"><small>Who you'd meet</small>${p.who}</div>
        <div class="wi-row"><small>Example careers</small>${p.careers}</div>
        <div class="wi-row"><small>Typical entry point</small>${p.entry}</div>`;
    };
    el.addEventListener('click', e => { const s = e.target.closest('.seg'); if (s) show(+s.dataset.i); });
    show(2);
  };

  /* ---------- Careers: commission illustrator ---------- */
  R.commission = el => {
    const cfg = {
      AED: { price: [500000, 10000000, 50000, 1500000], rate: [1, 3, 0.25, 2] },
      INR: { price: [5000000, 100000000, 500000, 12000000], rate: [0.5, 2, 0.25, 1] }
    };
    let cur = 'AED';
    const draw = () => {
      const c = cfg[cur];
      el.innerHTML = `<h4>Commission illustrator</h4>
        <div class="seg-toggle"><button data-cur="AED" class="${cur === 'AED' ? 'on' : ''}">UAE · AED</button><button data-cur="INR" class="${cur === 'INR' ? 'on' : ''}">India · INR</button></div>
        <div class="field"><div class="calc-row"><span>Property price</span><output data-o="price"></output></div><input type="range" data-k="price" min="${c.price[0]}" max="${c.price[1]}" step="${c.price[2]}" value="${c.price[3]}"></div>
        <div class="field"><div class="calc-row"><span>Commission rate</span><output data-o="rate"></output></div><input type="range" data-k="rate" min="${c.rate[0]}" max="${c.rate[1]}" step="${c.rate[2]}" value="${c.rate[3]}"></div>
        <div class="field"><div class="calc-row"><span>Deals closed per year</span><output data-o="deals"></output></div><input type="range" data-k="deals" min="1" max="30" step="1" value="6"></div>
        <div class="calc-out"><small>Gross commission per deal</small><b data-o="per"></b><small data-o="year"></small></div>
        <p class="small faint mt-16">Illustrative only. Gross commission before brokerage split.</p>`;
      upd();
    };
    const upd = () => {
      const v = k => +$(`[data-k="${k}"]`, el).value;
      const per = v('price') * v('rate') / 100;
      $('[data-o="price"]', el).textContent = fmt(v('price'), cur);
      $('[data-o="rate"]', el).textContent = v('rate') + '%';
      $('[data-o="deals"]', el).textContent = v('deals');
      $('[data-o="per"]', el).textContent = fmt(per, cur);
      $('[data-o="year"]', el).textContent = `${fmt(per * v('deals'), cur)} generated across ${v('deals')} deals a year`;
    };
    el.addEventListener('input', upd);
    el.addEventListener('click', e => { const b = e.target.closest('[data-cur]'); if (b && b.dataset.cur !== cur) { cur = b.dataset.cur; draw(); } });
    draw();
  };

  /* ---------- Employers: attrition calculator ---------- */
  R.attrition = el => {
    let cur = 'INR';
    const prod = { INR: [600000, 6000000, 100000, 1200000], AED: [100000, 1500000, 25000, 300000] };
    const draw = () => {
      const p = prod[cur];
      el.innerHTML = `<div class="seg-toggle"><button data-cur="INR" class="${cur === 'INR' ? 'on' : ''}">India · INR</button><button data-cur="AED" class="${cur === 'AED' ? 'on' : ''}">UAE · AED</button></div>
        <div class="field"><div class="calc-row"><span>Team size (agents)</span><output data-o="team"></output></div><input type="range" data-k="team" min="5" max="200" step="1" value="20"></div>
        <div class="field"><div class="calc-row"><span>Annual attrition</span><output data-o="attr"></output></div><input type="range" data-k="attr" min="10" max="70" step="1" value="40"></div>
        <div class="field"><div class="calc-row"><span>Avg. annual production per agent</span><output data-o="prod"></output></div><input type="range" data-k="prod" min="${p[0]}" max="${p[1]}" step="${p[2]}" value="${p[3]}"></div>
        <div class="field"><div class="calc-row"><span>Turnover cost (% of production)</span><output data-o="factor"></output></div><input type="range" data-k="factor" min="50" max="200" step="5" value="75"></div>
        <div class="attr-out"><div class="dark"><small>Annual cost of turnover today</small><b data-o="now"></b></div><div><small>At target 15–20% attrition</small><b data-o="tgt"></b></div></div>
        <p class="small muted mt-16" data-o="save"></p>`;
      upd();
    };
    const upd = () => {
      const v = k => +$(`[data-k="${k}"]`, el).value;
      const leavers = v('team') * v('attr') / 100;
      const per = v('prod') * v('factor') / 100;
      const now = leavers * per;
      const tgt = v('team') * 0.175 * per;
      $('[data-o="team"]', el).textContent = v('team');
      $('[data-o="attr"]', el).textContent = v('attr') + '%';
      $('[data-o="prod"]', el).textContent = fmt(v('prod'), cur);
      $('[data-o="factor"]', el).textContent = v('factor') + '%';
      $('[data-o="now"]', el).textContent = fmt(now, cur);
      $('[data-o="tgt"]', el).textContent = fmt(Math.min(tgt, now), cur);
      $('[data-o="save"]', el).innerHTML = now > tgt
        ? `≈ <b>${Math.round(leavers)}</b> agents leave each year. Reaching the target range could protect roughly <b>${fmt(now - tgt, cur)}</b> a year.`
        : 'Your attrition is already at or below the ARISEVERSE target range.';
    };
    el.addEventListener('input', upd);
    el.addEventListener('click', e => { const b = e.target.closest('[data-cur]'); if (b && b.dataset.cur !== cur) { cur = b.dataset.cur; draw(); } });
    draw();
  };

  /* ---------- Research: Market Health Diagnostic ---------- */
  R.diagnostic = el => {
    const D = AV.diagnostic;
    const vals = Object.assign({}, ...D.metrics.map(m => ({ [m.id]: m.def })));
    const label = { ok: 'Healthy', watch: 'Watch', warn: 'Warning' };
    const show = (m, v) => m.unit === '×' ? (+v).toFixed(1) + '×' : m.id === 'dom' ? (v == 0 ? 'Stable / falling' : `Rising ${v} qtr${v > 1 ? 's' : ''}`) : `${(+v).toFixed(m.step < 1 ? 1 : 0)}${m.unit.startsWith('%') ? m.unit : ' ' + m.unit}`;
    el.innerHTML = `<div class="diag-in">
        <div class="presets"><span>Try a scenario:</span>${Object.entries(D.presets).map(([k, p]) => `<button class="chip" data-preset="${k}">${p.label}</button>`).join('')}</div>
        ${D.metrics.map((m, i) => `<div class="metric"><div class="metric-top"><b>${i + 1}. ${m.name}<span class="st" data-st="${m.id}"></span></b><output data-v="${m.id}"></output></div><p>${m.q}</p>
          <input type="range" data-m="${m.id}" min="${m.min}" max="${m.max}" step="${m.step}" value="${m.def}" aria-label="${m.name}">
          <div class="thr"><span>Healthy: ${m.healthy}</span><span>Warning: ${m.warning}</span></div></div>`).join('')}
      </div>
      <div class="diag-out">
        <p class="eyebrow">Diagnosis</p>
        <svg class="gauge" viewBox="0 0 200 116" aria-hidden="true">
          <path d="M20 100 A80 80 0 0 1 57.61 32.16" stroke="#7FB07F" stroke-width="14" fill="none"/>
          <path d="M62.44 29.36 A80 80 0 0 1 137.56 29.36" stroke="#B7842F" stroke-width="14" fill="none"/>
          <path d="M142.39 32.16 A80 80 0 0 1 180 100" stroke="#D0735A" stroke-width="14" fill="none"/>
          <g class="needle" style="transform-origin:100px 100px;transition:transform .6s cubic-bezier(.2,.7,.2,1)"><line x1="100" y1="100" x2="100" y2="34" stroke="#F3EEE4" stroke-width="3" stroke-linecap="round"/></g>
          <circle cx="100" cy="100" r="7" fill="#F3EEE4"/>
        </svg>
        <div class="verdict"><h3></h3><span class="wc"></span><p></p></div>
        <div class="diag-list"></div>
        <form class="diag-cta" data-form="diag"><p class="small" style="color:var(--on-dark-2)">Get the full guide with data sources and how to re-score quarterly.</p><input class="input" type="email" required placeholder="you@email.com" aria-label="Email"><button class="btn btn-gold" type="submit">Email me the guide</button></form>
      </div>`;
    const upd = () => {
      D.metrics.forEach(m => { vals[m.id] = +$(`[data-m="${m.id}"]`, el).value; });
      const r = D.verdict(vals);
      D.metrics.forEach((m, i) => {
        $(`[data-v="${m.id}"]`, el).textContent = show(m, vals[m.id]);
        const st = $(`[data-st="${m.id}"]`, el); st.className = 'st ' + r.ratings[i]; st.textContent = label[r.ratings[i]];
      });
      // needle: gauge is three equal zones on a 0–6 scale (0–1 warnings | 2–3 | 4–5); watches nudge within the zone
      const pos = r.warnings + 0.5 + Math.min(0.45, r.watches * 0.12);
      $('.needle', el).style.transform = `rotate(${-90 + pos / 6 * 180}deg)`;
      const v = $('.verdict', el);
      v.className = 'verdict ' + r.band.key;
      $('h3', v).textContent = r.band.name;
      $('.wc', v).textContent = `${r.warnings} warning signal${r.warnings === 1 ? '' : 's'} · ${r.watches} to watch`;
      $('p', v).textContent = r.band.line;
      $('.diag-list', el).innerHTML = D.metrics.map((m, i) => `<div><span class="dot ${r.ratings[i]}"></span>${m.name}</div>`).join('');
    };
    el.addEventListener('input', e => { if (e.target.matches('[data-m]')) upd(); });
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-preset]'); if (!b) return;
      const p = D.presets[b.dataset.preset].values;
      Object.keys(p).forEach(k => { $(`[data-m="${k}"]`, el).value = p[k]; });
      $$('[data-preset]', el).forEach(x => x.classList.toggle('on', x === b));
      upd();
    });
    upd();
  };

  /* ---------- About: flywheel ---------- */
  R.flywheel = el => {
    const roles = {
      Academy: 'Creates graduates', Careers: 'Places them', Research: 'Gives them intelligence', Media: 'Builds the brand',
      Corporate: 'Trains at scale', 'ARIA X': 'Serves everyone, permanently', Foundation: 'Builds trust, expands the pipeline'
    };
    const order = ['Academy', 'Careers', 'Research', 'Media', 'Corporate', 'ARIA X', 'Foundation'];
    const cx = 230, cy = 230, r = 170, n = order.length;
    const nodes = order.map((name, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / n;
      return { name, x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    });
    const arcs = nodes.map((p, i) => {
      const q = nodes[(i + 1) % n];
      const a0 = Math.atan2(p.y - cy, p.x - cx) + 0.26, a1 = Math.atan2(q.y - cy, q.x - cx) - 0.26;
      const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      return `<path d="M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}" fill="none" stroke="#B8925A" stroke-width="1.5" marker-end="url(#arr)"/>`;
    }).join('');
    el.innerHTML = `<svg class="fw-svg" viewBox="0 0 460 460" role="img" aria-label="ARISEVERSE ecosystem flywheel">
      <defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B8925A"/></marker></defs>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#E3DACA" stroke-dasharray="2 6"/>
      ${arcs}
      <circle cx="${cx}" cy="${cy}" r="86" fill="#121110"/>
      <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-family="Source Serif 4, Georgia, serif" font-size="19" font-weight="700" fill="#F3EEE4" letter-spacing="2">ARISEVERSE</text>
      <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#D4B27C" letter-spacing="1.5">ONE FLYWHEEL</text>
      ${nodes.map((p, i) => `<g><circle cx="${p.x}" cy="${p.y}" r="38" fill="${i === 0 ? '#B8925A' : '#FFFFFF'}" stroke="#B8925A" stroke-width="1.5"/><text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#121110">${p.name}</text></g>`).join('')}
    </svg>
    <div class="fw-list">${order.map(name => `<div><b>${name}</b><span>${roles[name]} — ${AV.ecosystem.find(e => e.name === name).line}</span></div>`).join('')}</div>`;
  };

  /* ---------- Apply wizard → hands off to the portal ---------- */
  R.apply = el => {
    const TRAITS = ['Confidence', 'Communication', 'Resilience', 'Discipline', 'Learning agility', 'Empathy'];
    const Q = [
      { q: 'A prospect hangs up on you mid-sentence. What’s your next move?', o: [
        ['Take a breath, note what I’d change, and dial the next number.', { Resilience: 14, Discipline: 6 }],
        ['Call back later with a sharper opening line.', { Confidence: 10, 'Learning agility': 8 }],
        ['Take a short break — that one stung.', { Empathy: 4, Resilience: -6 }] ] },
      { q: 'A buyer asks a legal question you’re not sure about.', o: [
        ['Tell them I’ll confirm with a specialist and come back today.', { Communication: 8, 'Learning agility': 8 }],
        ['Give my best answer so I don’t look unprepared.', { Confidence: 8, Communication: -4 }],
        ['First ask what’s behind the question.', { Empathy: 10, Communication: 6 }] ] },
      { q: 'You have three free hours on a Sunday.', o: [
        ['Plan my week and review my goals.', { Discipline: 14 }],
        ['Learn something new — a course, a book, a podcast.', { 'Learning agility': 14 }],
        ['Catch up with people — friends, family, my network.', { Empathy: 8, Communication: 8 }] ] },
      { q: 'Your manager gives blunt feedback on your pitch in front of the team.', o: [
        ['Thank them, and ask for the one thing to fix first.', { 'Learning agility': 12, Resilience: 6 }],
        ['Explain why I pitched it that way.', { Confidence: 10, Communication: 4 }],
        ['Feel it, then practise privately until it’s right.', { Discipline: 10, Resilience: 4 }] ] },
      { q: 'A family is torn between two homes and asks what you’d do.', o: [
        ['Ask what matters most to each of them, then compare against that.', { Empathy: 12, Communication: 8 }],
        ['Recommend the better long-term value — with the numbers.', { Confidence: 8, 'Learning agility': 6 }],
        ['Tell them to take their time — no pressure.', { Empathy: 6, Confidence: -4 }] ] },
      { q: 'It’s the 25th and you’re 40% short of your monthly target.', o: [
        ['Double my calls for the last five days.', { Discipline: 10, Resilience: 8 }],
        ['Review what’s working and focus only on the warmest leads.', { 'Learning agility': 10, Discipline: 4 }],
        ['Accept it and plan a stronger next month.', { Resilience: 6, Confidence: -4 }] ] }
    ];
    const ARCH = {
      advisor: { name: 'The Trusted Advisor', line: 'You lead with understanding — clients will trust you quickly. We’ll sharpen your closing and negotiation so that trust converts.' },
      closer: { name: 'The Driven Closer', line: 'You bounce back fast and you’re not afraid to ask for the decision. We’ll deepen your discovery and market knowledge so every close is well-founded.' },
      builder: { name: 'The Disciplined Builder', line: 'You build results through routine. We’ll grow your confidence in live conversations so your consistency compounds.' },
      analyst: { name: 'The Market Analyst', line: 'You learn fast and think in evidence. We’ll build your communication and presence so your insight lands with clients.' }
    };
    const FOCUS = { Confidence: 6, Communication: 5, Resilience: 3, Discipline: 4, 'Learning agility': 1, Empathy: 25 };
    const MARKETS = [['India', 'RERA · Indian metros'], ['UAE', 'Dubai RERA · DLD'], ['Saudi Arabia', 'REGA · Vision 2030'], ['Cross-border', 'India ↔ GCC investors']];

    const s = { step: 0, q: 0, name: '', email: '', phone: '', market: '', persona: '', answers: [], intake: '', consent: false };

    const traits = () => {
      const t = Object.fromEntries(TRAITS.map(k => [k, 52]));
      s.answers.forEach((a, qi) => { if (a == null) return; Object.entries(Q[qi].o[a][1]).forEach(([k, d]) => { t[k] += d; }); });
      TRAITS.forEach(k => { t[k] = Math.max(22, Math.min(96, t[k])); });
      return t;
    };
    const archetype = t => {
      const top = TRAITS.slice().sort((a, b) => t[b] - t[a])[0];
      return ARCH[{ Empathy: 'advisor', Communication: 'advisor', Confidence: 'closer', Resilience: 'closer', Discipline: 'builder', 'Learning agility': 'analyst' }[top]];
    };
    const setSteps = () => {
      $$('[data-apply-steps] li').forEach((li, i) => { li.className = i < s.step ? 'done' : i === s.step ? 'on' : ''; });
    };

    const views = {
      0: () => `<p class="eyebrow">Step 1 of 4 · About 5 minutes</p><h3>Let’s start with you.</h3><p class="intro">Your application includes a short Ascent assessment. There are no right answers — it personalises your learning.</p>
        <p class="small faint" style="margin:-16px 0 24px">Prototype: what you enter stays in this browser and is not sent anywhere.</p>
        <div class="ap-grid">
          <div class="field"><label for="ap-name">Full name</label><input class="input" id="ap-name" data-f="name" value="${esc(s.name)}" placeholder="e.g. Priya Shah" autocomplete="name"></div>
          <div class="field"><label for="ap-email">Email</label><input class="input" id="ap-email" type="email" data-f="email" value="${esc(s.email)}" placeholder="you@email.com" autocomplete="email"></div>
          <div class="field"><label for="ap-phone">Mobile / WhatsApp</label><input class="input" id="ap-phone" data-f="phone" value="${esc(s.phone)}" placeholder="+971 or +91" autocomplete="tel"></div>
        </div>
        <span class="ap-label">Which market do you want to build your career in?</span>
        <div class="opt-grid" data-group="market" style="grid-template-columns:repeat(4,1fr)">${MARKETS.map(([m, d]) => `<button class="opt${s.market === m ? ' on' : ''}" data-v="${m}"><b>${m}</b><span>${d}</span></button>`).join('')}</div>
        <span class="ap-label">Which best describes you today?</span>
        <div class="opt-grid" data-group="persona">${AV.personas.map(p => `<button class="opt${s.persona === p.name ? ' on' : ''}" data-v="${p.name}"><b>${p.name}</b><span>${p.line}</span></button>`).join('')}</div>
        <p class="err" data-err></p>
        <div class="ap-actions"><a href="#home" class="btn btn-ghost">Cancel</a><button class="btn btn-dark" data-next>Continue to assessment →</button></div>`,

      1: () => {
        const it = Q[s.q];
        return `<p class="eyebrow">Step 2 of 4 · Ascent assessment</p>
          <div class="q-progress">${Q.map((_, i) => `<i class="${i <= s.q ? 'on' : ''}"></i>`).join('')}</div>
          <div class="q-card"><p class="small faint">Question ${s.q + 1} of ${Q.length}</p><h4>${it.q}</h4>
          <div class="q-opts">${it.o.map((o, i) => `<button class="opt${s.answers[s.q] === i ? ' on' : ''}" data-ans="${i}">${o[0]}</button>`).join('')}</div></div>
          <div class="ap-actions"><button class="btn btn-ghost" data-back>← Back</button><span class="small faint">Choose the answer closest to what you’d really do.</span></div>`;
      },

      2: () => {
        const t = traits(), a = archetype(t);
        const low = TRAITS.slice().sort((x, y) => t[x] - t[y]).slice(0, 2);
        return `<p class="eyebrow">Step 3 of 4 · Your Ascent Profile</p><h3>${s.name ? esc(s.name.split(' ')[0]) + ', meet' : 'Meet'} your starting point.</h3>
          <p class="intro">This is a baseline, not a judgement. You’ll re-take it at the end of each phase and watch it move.</p>
          <div class="profile-card"><div><p class="eyebrow">Your archetype</p><h4>${a.name}</h4><p>${a.line}</p></div>
            <div>${TRAITS.map(k => `<div class="trait"><span>${k}</span><div class="bar"><i style="width:${t[k]}%"></i></div><b>${t[k]}</b></div>`).join('')}</div></div>
          <span class="ap-label">Where ARISEVERSE will focus first for you</span>
          <div class="focus">${low.map(k => { const m = AV.moduleById(FOCUS[k]); return `<div><small>${k}</small><b>M${m.n} · ${m.title}</b><span>${m.tool}</span></div>`; }).join('')}</div>
          <div class="ap-actions"><button class="btn btn-ghost" data-back>← Retake</button><button class="btn btn-dark" data-next>Reserve my seat →</button></div>`;
      },

      3: () => {
        if (!s.intake) s.intake = s.market === 'India' ? 'Cohort 1 · India' : 'Cohort 1 · UAE (Dubai)';
        return `<p class="eyebrow">Step 4 of 4 · Reserve your seat</p><h3>Choose your intake.</h3><p class="intro">Cohort 1 is founder-led and deliberately small. A counsellor will call you within two working days to confirm fees and dates.</p>
          <div class="opt-grid" data-group="intake" style="grid-template-columns:1fr 1fr">
            ${[['Cohort 1 · India', 'Live sessions in IST · India placement partners'], ['Cohort 1 · UAE (Dubai)', 'Live sessions in GST · Dubai placement partners']].map(([v, d]) => `<button class="opt${s.intake === v ? ' on' : ''}" data-v="${v}"><b>${v}</b><span>${d}</span></button>`).join('')}
          </div>
          <label class="check"><input type="checkbox" data-consent ${s.consent ? 'checked' : ''}> I agree to be contacted by ARISEVERSE about my application, and to my Ascent Profile being used to personalise my learning.</label>
          <p class="err" data-err></p>
          <div class="ap-actions"><button class="btn btn-ghost" data-back>← Back</button><button class="btn btn-gold btn-lg" data-submit>Submit application</button></div>`;
      },

      4: () => {
        const t = traits(), a = archetype(t);
        return `<div class="done-card"><div class="done-mark"><svg viewBox="0 0 24 24" fill="none" stroke="#D4B27C" stroke-width="2"><path d="m5 12 5 5L20 7"/></svg></div>
          <p class="eyebrow">Application received</p><h3>You’re on your way, ${esc(s.name.split(' ')[0])}.</h3>
          <p>Your learning portal account is ready. Start with your Ascent Profile and Module 1 — The Mirror Method — while we schedule your counselling call.</p>
          <div class="portal-ticket"><div class="pt-head">${AV.logoSVG}<div><b>ARISEVERSE Learning Portal</b><small>learn.ariseverse.com</small></div></div>
            <ul><li><span>Login</span>${esc(s.email)}</li><li><span>Intake</span>${esc(s.intake)}</li><li><span>Ascent archetype</span>${a.name}</li><li><span>First module</span>M1 · The Mirror Method</li></ul></div>
          <div class="row-gap center"><a href="portal.html#welcome" class="btn btn-gold btn-lg">Enter the learning portal →</a><a href="#home" class="btn btn-line btn-lg">Back to website</a></div></div>`;
      }
    };

    const draw = () => { el.innerHTML = views[s.step](); setSteps(); };
    const err = m => { const e = $('[data-err]', el); if (e) e.textContent = m; };

    el.addEventListener('input', e => {
      const f = e.target.dataset.f; if (f) s[f] = e.target.value;
      if (e.target.matches('[data-consent]')) s.consent = e.target.checked;
    });
    el.addEventListener('change', e => { if (e.target.matches('[data-consent]')) s.consent = e.target.checked; });
    el.addEventListener('click', e => {
      const opt = e.target.closest('[data-group] .opt');
      if (opt) {
        const g = opt.parentElement.dataset.group;
        s[g] = opt.dataset.v;
        $$('.opt', opt.parentElement).forEach(o => o.classList.toggle('on', o === opt));
        err('');
        return;
      }
      const ans = e.target.closest('[data-ans]');
      if (ans) {
        s.answers[s.q] = +ans.dataset.ans;
        $$('[data-ans]', el).forEach(o => o.classList.toggle('on', o === ans));
        setTimeout(() => { if (s.q < Q.length - 1) s.q++; else s.step = 2; draw(); }, 260);
        return;
      }
      if (e.target.closest('[data-back]')) {
        if (s.step === 1 && s.q > 0) s.q--;
        else if (s.step === 2) { s.step = 1; s.q = 0; s.answers = []; }
        else s.step = Math.max(0, s.step - 1);
        draw(); return;
      }
      if (e.target.closest('[data-next]')) {
        if (s.step === 0) {
          if (!s.name.trim()) return err('Please add your name.');
          if (!/^\S+@\S+\.\S+$/.test(s.email)) return err('Please add a valid email address.');
          if (!s.market) return err('Please choose a market.');
          if (!s.persona) return err('Please choose what describes you best.');
          s.step = 1; s.q = 0;
        } else if (s.step === 2) s.step = 3;
        draw(); el.scrollIntoView({ block: 'start' }); window.scrollTo(0, 0); return;
      }
      if (e.target.closest('[data-submit]')) {
        if (!s.consent) return err('Please confirm you’re happy to be contacted.');
        const t = traits();
        AVStore.set('applicant', { name: s.name.trim(), email: s.email.trim(), phone: s.phone.trim(), market: s.market, persona: s.persona, intake: s.intake, archetype: archetype(t), traits: t });
        s.step = 4; draw(); window.scrollTo(0, 0);
      }
    });
    R.apply.reset = () => { Object.assign(s, { step: 0, q: 0, answers: [], consent: false, intake: '' }); draw(); };
    draw();
  };

  /* ---------- Forms (prototype — nothing is sent) ---------- */
  document.addEventListener('submit', e => {
    const f = e.target.closest('[data-form]'); if (!f) return;
    e.preventDefault();
    const msg = { partner: '<b>Thank you.</b> Our placement team will be in touch within two working days.', subscribe: '<b>You’re on the list.</b> We’ll email you when the first report is published.', diag: '<b>On its way.</b> Check your inbox for the Market Health Diagnostic guide.' }[f.dataset.form];
    toast(msg + ' <span class="faint">(Prototype — nothing was sent.)</span>');
    f.reset();
  });

  /* ---------- Render all ---------- */
  $$('[data-render]').forEach(el => { const fn = R[el.dataset.render]; if (fn) fn(el); });

  /* ---------- Router ---------- */
  const PAGES = $$('[data-page]').map(p => p.dataset.page);
  const burger = $('.burger'), mm = $('.mobile-menu');
  const closeMenu = () => { mm.hidden = true; burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => { const open = mm.hidden; mm.hidden = !open; burger.setAttribute('aria-expanded', String(open)); });

  function route() {
    const h = location.hash.replace('#', '') || 'home';
    const page = PAGES.includes(h) ? h : 'home';
    $$('[data-page]').forEach(p => p.classList.toggle('active', p.dataset.page === page));
    $$('.nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + page));
    document.body.classList.toggle('on-apply', page === 'apply');
    if (page === 'apply' && R.apply.reset && route.last !== 'apply') R.apply.reset();
    closeMenu();
    // Background videos play only on the page in view (and never with reduced motion)
    const still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    $$('video[data-ambient]').forEach(v => {
      if (!still && v.closest('.page.active')) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
      else v.pause();
    });
    if (route.last !== page) window.scrollTo(0, 0);
    route.last = page;
    document.title = page === 'home' ? 'ARISEVERSE — Real Estate Career Transformation' : `${{ academy: 'Academy', aria: 'ARIA X', careers: 'Careers', employers: 'For Employers', research: 'Research', about: 'About', apply: 'Apply' }[page]} — ARISEVERSE`;
    revealIn();
  }
  window.addEventListener('hashchange', route);

  // Links that should land on a section within a page
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-scroll]'); if (!a) return;
    e.preventDefault();
    const target = a.getAttribute('href');
    if (location.hash !== target) location.hash = target;
    setTimeout(() => { const t = document.getElementById(a.dataset.scroll); if (t) t.scrollIntoView({ behavior: 'smooth' }); }, 60);
  });

  /* ---------- Reveal on scroll ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12 }) : null;
  function revealIn() {
    $$('.page.active .reveal:not(.in)').forEach(el => io ? io.observe(el) : el.classList.add('in'));
  }
  // Fallback for fast scrolling / throttled observers: anything already above the fold bottom is shown
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    setTimeout(() => {
      ticking = false;
      const vh = window.innerHeight;
      $$('.page.active .reveal:not(.in)').forEach(el => { if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add('in'); });
    }, 120);
  }, { passive: true });
  window.addEventListener('beforeprint', () => $$('.reveal').forEach(el => el.classList.add('in')));

  route();
})();
