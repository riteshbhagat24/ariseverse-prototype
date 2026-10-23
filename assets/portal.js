/* ARISEVERSE — Learning Portal prototype.
   Single-page app with hash routes. Content model comes from assets/data.js (window.AV).
   Everything marked "sample" is placeholder data for the client presentation. */
(function () {
  'use strict';

  const D = window.AV;
  const S = window.AVStore;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- Icons (24px stroke set) ---------- */
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3z"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    checksq: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v4"/>',
    brief: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 13h20"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    trend: '<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    play: '<path d="M6 4l14 8-14 8z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    diamond: '<path d="M12 2 22 12 12 22 2 12z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M8.2 13.2 7 22l5-3 5 3-1.2-8.8"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
    flame: '<path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 3-5 5-5 8 0 4 3 7 7 7z"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    refresh: '<path d="M23 4v6h-6"/><path d="M20.5 15a9 9 0 1 1-2.1-9.4L23 10"/>',
    pin: '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    land: '<path d="M2 20h20"/><path d="M4 20l5-8 4 5 3-4 4 7"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 21v-4h6v4M8 7h2M14 7h2M8 11h2M14 11h2"/>',
    house: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
    factory: '<path d="M2 20V10l6 4V10l6 4V6l8 4v10z"/><path d="M2 20h20"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'
  };
  const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

  /* ---------- Learner identity ---------- */
  const DEFAULT_ARCH = { name: 'The Trusted Advisor', line: 'Calm, curious and client-first. You build confidence through preparation and win through relationships.' };
  const DEFAULT_TRAITS = { 'Confidence': 64, 'Communication': 78, 'Resilience': 70, 'Discipline': 66, 'Learning agility': 84, 'Empathy': 81 };
  const TRACKS = { 'India': 'India track', 'UAE': 'Dubai track', 'Saudi Arabia': 'Saudi Arabia track', 'Cross-border': 'Cross-border track' };

  function student() {
    const a = S.get('applicant', null);
    const name = (a && a.name && String(a.name).trim()) || 'Arjun Nair';
    const parts = name.split(/\s+/);
    const first = parts[0];
    const initials = (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
    const market = (a && a.market) || 'UAE';
    return {
      a, name, first, initials, market,
      track: TRACKS[market] || 'Dubai track',
      persona: (a && a.persona) || 'Career Switcher',
      email: (a && a.email) || 'arjun.nair@example.com',
      phone: (a && a.phone) || '+971 50 000 0000',
      archetype: (a && a.archetype && a.archetype.name) ? a.archetype : DEFAULT_ARCH,
      traits: (a && a.traits && Object.keys(a.traits).length) ? a.traits : DEFAULT_TRAITS
    };
  }

  /* ---------- Demo progress (consistent everywhere) ---------- */
  const DONE = new Set([...range(1, 18), ...range(38, 47)]);   // 28 modules
  const PROG = { 19: 75 };
  const OPEN = new Set([20, 21, 22, 23, 24, 48]);
  const KPI = { modules: 28, live: 15, assignments: 24, certs: 3, ascent: 68 };

  function mstatus(n) { return DONE.has(n) ? 'done' : PROG[n] ? 'progress' : OPEN.has(n) ? 'open' : 'locked'; }
  function pillarProgress(key) {
    const ms = D.modules.filter(m => m.pillar === key);
    const v = ms.reduce((s, m) => s + (DONE.has(m.n) ? 1 : PROG[m.n] ? PROG[m.n] / 100 : 0), 0);
    return Math.round(v / ms.length * 100);
  }
  function catProgress(id) {
    const c = D.category(id); const ms = range(c.from, c.to);
    return Math.round(ms.reduce((s, n) => s + (DONE.has(n) ? 1 : PROG[n] ? PROG[n] / 100 : 0), 0) / ms.length * 100);
  }
  function statusPill(n) {
    const st = mstatus(n);
    if (st === 'done') return `<span class="pill pill-green">${icon('check', 'ic-sm')} Completed</span>`;
    if (st === 'progress') return `<span class="pill pill-gold">In progress · ${PROG[n]}%</span>`;
    if (st === 'open') return `<span class="pill pill-dark">Start</span>`;
    return `<span class="pill">${icon('lock', 'ic-sm')} Locked</span>`;
  }

  /* ---------- Stock media ----------
     Free Unsplash photos and Pexels videos (media/CREDITS.md) standing in for the client's own shoots.
     Stock people appear only as fictional sample learners, guests and roleplay clients — never as the founder. */
  const M = D.media;
  const ALT = {
    'mumbai-skyline': 'Mumbai skyline', 'mumbai-sealink': 'Bandra–Worli Sea Link, Mumbai', 'dubai-interchange': 'Downtown Dubai skyline',
    'dubai-marina-day': 'Dubai Marina towers', 'dubai-marina-night': 'Dubai Marina at night', 'riyadh-kingdom': 'Kingdom Centre, Riyadh',
    'riyadh-city': 'Riyadh skyline', 'residential-towers': 'Residential towers', 'construction-aerial': 'Aerial view of a construction site',
    'house-model': 'Advisor holding a model house', 'signing': 'Signing a property document', 'apartment-luxury': 'Luxury apartment living room',
    'apartment-evening': 'Apartment interior in the evening', 'analytics': 'Analytics dashboard on a laptop', 'site-visit': 'Agent showing an apartment to clients',
    'listings': 'Agent pointing at property listings', 'interview': 'Interview in an office', 'keys': 'Handing over house keys',
    'headset-laptop': 'Learner with headphones at a laptop', 'cohort-group': 'Professionals in a training room', 'certificate': 'Certificate presentation',
    'lecture-hall': 'Audience in a lecture hall', 'journal': 'Writing in a journal', 'office-presentation': 'Team presentation in an office',
    'phone-call': 'Professional on a phone call', 'persona-experienced': 'Professional in a suit', 'mentoring': 'One-to-one mentoring conversation',
    'classroom': 'Classroom training session', 'handshake': 'Business handshake', 'dubai-sunset': 'Dubai skyline at sunset'
  };
  // Sample people outside AV.media.people: roleplay clients and two guest experts
  const EXTRA_FACES = {
    'Dana Haddad': M.img('persona-leader'), 'Karan Bhatia': M.img('persona-experienced'),
    'Riya': M.person('ananya'), 'Imran': M.person('kabir'), 'Mr. Desai': M.person('rajiv'), 'Anil': M.img('persona-informal')
  };
  function initialsOf(name) { const p = String(name).trim().split(/\s+/); return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase(); }
  function face(name, cls = '') {
    const src = M.people[name] ? M.person(M.people[name]) : EXTRA_FACES[name];
    if (!src) return `<span class="avatar ${cls}">${esc(initialsOf(name))}</span>`;
    return `<span class="avatar photo ${cls}"><img src="${src}" alt="${esc(name)}" loading="lazy" decoding="async"></span>`;
  }
  function photo(name, cls = '', eager = false) {
    return `<img class="${cls}" src="${M.img(name)}" alt="${esc(ALT[name] || name.replace(/-/g, ' '))}" ${eager ? '' : 'loading="lazy" '}decoding="async">`;
  }
  function poster(name, alt, cls = '') {
    return `<img class="${cls}" src="${M.video(name).poster}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
  }
  function bgVideo(name) {
    const v = M.video(name);
    return `<video class="bg-video" src="${v.src}" poster="${v.poster}" autoplay muted loop playsinline preload="auto" aria-hidden="true" tabindex="-1"></video>`;
  }
  function player(name, label, cls = '') {
    const v = M.video(name);
    return `<video class="player ${cls}" src="${v.src}" poster="${v.poster}" controls preload="none" playsinline aria-label="${esc(label)}"></video>`;
  }
  function playVideo(name, title, note) {
    openDrawer(icon('play') + ' ' + esc(title), `<div class="drawer-pad">${player(name, title, 'big')}<p class="note mt-s">${esc(note || 'Preview clip · stock footage placeholder')}</p></div>`,
      { after: b => { const v = $('video', b); if (v) v.play().catch(() => {}); } });
  }

  function ring(pct, size = 96, stroke = 9, color = 'var(--gold)', label = '', sub = '') {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    return `<div class="ring" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--sand)" stroke-width="${stroke}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" style="transition:stroke-dashoffset .8s"/></svg>
      <div class="ring-t"><b>${label || pct + '%'}</b>${sub ? `<small>${sub}</small>` : ''}</div></div>`;
  }

  /* sets: [{ values: [...], stroke, fill }] */
  function radar(labels, sets, max = 10, size = 300) {
    const pad = 70, cx = size / 2, cy = size / 2, r = size / 2 - 24, n = labels.length;
    const pt = (i, v) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / n;
      return [cx + Math.cos(a) * r * v / max, cy + Math.sin(a) * r * v / max];
    };
    let g = '';
    for (let l = 1; l <= 4; l++) g += `<polygon class="grid-l" points="${labels.map((_, i) => pt(i, max * l / 4).join(',')).join(' ')}"/>`;
    labels.forEach((_, i) => { const [x, y] = pt(i, max); g += `<line class="axis" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`; });
    const shapes = sets.map(s => `<polygon points="${s.values.map((v, i) => pt(i, clamp(v, 0, max)).map(z => z.toFixed(1)).join(',')).join(' ')}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="2" stroke-linejoin="round" style="transition:all .3s"/>` +
      s.values.map((v, i) => { const [x, y] = pt(i, clamp(v, 0, max)); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="${s.stroke}"/>`; }).join('')).join('');
    const text = labels.map((t, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / n, cos = Math.cos(a), sin = Math.sin(a);
      const x = cx + cos * (r + 12), y = cy + sin * (r + 12) + (sin > 0.3 ? 9 : sin < -0.3 ? -3 : 4);
      const anchor = Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end';
      return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}">${esc(t)}</text>`;
    }).join('');
    return `<svg class="radar" viewBox="${-pad} -4 ${size + pad * 2} ${size + 8}" role="img" aria-label="Radar chart">${g}${shapes}${text}</svg>`;
  }

  function evTag(k) { return k === 'v' ? '<span class="ev ev-v">Validated</span>' : k === 't' ? '<span class="ev ev-t">Target</span>' : '<span class="ev ev-a">Assumption</span>'; }

  let toastTimer;
  function toast(msg, ic = 'check') {
    const t = $('#toast');
    t.innerHTML = icon(ic) + '<span>' + esc(msg) + '</span>';
    t.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('on'), 2600);
  }

  /* ---------- Drawer ---------- */
  function openDrawer(title, html, opts = {}) {
    $('#drawer-title').innerHTML = title;
    const b = $('#drawer-body');
    b.className = 'drawer-b' + (opts.flush ? ' flush' : '');
    b.innerHTML = html;
    $('#drawer').classList.add('open');
    $('#drawer').setAttribute('aria-hidden', 'false');
    $('#scrim').classList.add('on');
    if (opts.after) opts.after(b);
  }
  function closeDrawer() {
    $$('#drawer video').forEach(v => v.pause());
    $('#drawer').classList.remove('open');
    $('#drawer').setAttribute('aria-hidden', 'true');
    $('#scrim').classList.remove('on');
  }

  /* =========================================================
     Market Health Diagnostic (shared by Module 16 + Market page)
     ========================================================= */
  const RATE_PILL = { ok: '<span class="pill pill-green">Healthy</span>', watch: '<span class="pill pill-amber">Watch</span>', warn: '<span class="pill pill-red">Warning</span>' };
  function diagValues() {
    const saved = S.get('diag', null);
    const v = {};
    D.diagnostic.metrics.forEach(m => { v[m.id] = saved && saved[m.id] != null ? saved[m.id] : m.def; });
    return v;
  }
  function fmtMetric(m, v) {
    v = Number(v);
    if (m.id === 'pipeline') return v.toFixed(1) + '×';
    if (m.id === 'yield') return v.toFixed(1) + '%';
    if (m.id === 'dom') return v === 0 ? 'Stable / falling' : v + (v === 1 ? ' qtr rising' : ' qtrs rising');
    if (m.id === 'cash') return v + '% cash';
    return v + '%';
  }
  function diagHTML() {
    const vals = diagValues();
    const presets = Object.entries(D.diagnostic.presets).map(([k, p]) => `<button class="chip" data-action="diag-preset" data-preset="${k}">${esc(p.label)}</button>`).join('');
    return `<div class="diag">
      <div class="diag-presets"><span>Try a scenario:</span>${presets}</div>
      <div class="diag-grid">
        <div>${D.diagnostic.metrics.map((m, i) => `
          <div class="dm" data-m="${m.id}">
            <div class="dm-top"><div><b>${i + 1}. ${esc(m.name)}</b><small>${esc(m.q)}</small></div><output>${fmtMetric(m, vals[m.id])}</output></div>
            <input type="range" min="${m.min}" max="${m.max}" step="${m.step}" value="${vals[m.id]}" data-input="diag" data-id="${m.id}" aria-label="${esc(m.name)}">
            <div class="dm-th"><span>Healthy: <b>${esc(m.healthy)}</b></span><span>Warning: <b>${esc(m.warning)}</b></span><span class="rate"></span></div>
          </div>`).join('')}
          <p class="note mt-s">Data sources: DLD / RERA transaction data, developer launch calendars, registration & mortgage filings, rent vs sale indices, portal listings.</p>
        </div>
        <div class="verdict">
          <small class="k">Market verdict</small>
          <h3 class="v-name"></h3>
          <p class="v-line"></p>
          <div class="gauge">${'<i></i>'.repeat(5)}</div>
          <div class="gauge-l"><span class="v-count"></span><span>0–1 Growth · 2–3 Transitional · 4–5 Speculative</span></div>
          <div class="v-list"></div>
        </div>
      </div>
    </div>`;
  }
  function diagUpdate(root, persist) {
    const vals = {};
    D.diagnostic.metrics.forEach(m => { vals[m.id] = Number($(`input[data-id="${m.id}"]`, root).value); });
    const v = D.diagnostic.verdict(vals);
    D.diagnostic.metrics.forEach((m, i) => {
      const row = $(`.dm[data-m="${m.id}"]`, root);
      $('output', row).textContent = fmtMetric(m, vals[m.id]);
      $('.rate', row).innerHTML = RATE_PILL[v.ratings[i]];
    });
    const box = $('.verdict', root);
    box.className = 'verdict ' + v.band.key;
    $('.v-name', box).textContent = v.band.name;
    $('.v-line', box).textContent = v.band.line;
    $$('.gauge i', box).forEach((g, i) => g.classList.toggle('on', i < v.warnings));
    $('.v-count', box).textContent = v.warnings + ' warning signal' + (v.warnings === 1 ? '' : 's') + (v.watches ? ' · ' + v.watches + ' to watch' : '');
    $('.v-list', box).innerHTML = D.diagnostic.metrics.map((m, i) => `<div><span>${esc(m.name)}</span>${RATE_PILL[v.ratings[i]]}</div>`).join('');
    if (persist) S.set('diag', vals);
  }

  /* =========================================================
     ARIA X — scripted mentor engine (prototype)
     ========================================================= */
  const KB = [
    { k: ['mirror method', 'mirror', 'life wheel', 'module 1'], a: 'The <b>Mirror Method</b> (Module 1) runs in five stages: <b>M</b>easure yourself with the Life Wheel, <b>I</b>dentify limiting beliefs, <b>R</b>ewrite your identity, <b>R</b>epeat daily, and <b>O</b>wn everything. Your Life Wheel is saved in <a href="#module/1">Module 1 → Stage 1</a> — re-score it every few weeks to see your Transformation Score move.' },
    { k: ['north star', 'goal', 'purpose', 'vision', 'module 2'], a: 'The <b>North Star Blueprint</b> (Module 2) turns purpose into a plan: Discover your WHY → Define your vision → Create goals → Prioritise (80/20) → Build an execution plan → Review & adjust. Try the goal cascade in <a href="#module/2">Module 2</a>: one annual goal broken down to quarterly, monthly, weekly and daily actions.' },
    { k: ['arise method', 'arise', 'pillar', 'framework', '52'], a: 'The <b>ARISE Method</b> is the master framework behind all 52 modules: <b>A</b>waken (mindset, identity, confidence), <b>R</b>oot (industry, market and product knowledge), <b>I</b>nfluence (buyer psychology, sales, negotiation), <b>S</b>ystemize (AI, professional systems, practical reps) and <b>E</b>levate (interviews, placement, career growth). 1 method → 11 frameworks → 52 named tools.' },
    { k: ['off-plan', 'off plan', 'offplan', 'ready propert', 'ready unit', 'handover', 'module 21'], a: 'Off-plan vs ready is a risk–reward trade (<b>The Risk-Reward Ledger</b>). <b>Off-plan:</b> lower entry price, staged payment plan, potential capital growth by handover — but delivery, developer and market risk. <b>Ready:</b> rental income from day one and what-you-see-is-what-you-get — but more capital upfront. Always start with one question: <i>is the client optimising for capital growth or cash flow?</i>' },
    { k: ['too expensive', 'objection', 'push back', 'pushback', 'expensive', 'discount'], a: 'Use <b>The Objection Judo</b> (Module 33): <b>Acknowledge</b> the concern sincerely → <b>Ask</b> what sits behind it (budget, value, timing, trust?) → <b>Reframe</b> with evidence — comparables, payment plan, yield → <b>Confirm</b> you have answered it before moving on. Never argue; redirect the energy.' },
    { k: ['market health', 'module 16', 'bubble', 'speculat', 'crash', 'correction', 'overvalued'], a: 'Run the <b>Market Health Diagnostic</b>: (1) resale-to-primary ratio, (2) completion pipeline vs absorption, (3) cash-to-mortgage ratio, (4) rental yield, (5) secondary days-on-market. 0–1 warnings = Growth market, 2–3 = Transitional, 4–5 = Speculative. Try it in <a href="#market">Market Intelligence</a>.' },
    { k: ['rera', 'regulat', 'dld', 'rega', 'licen', 'law', 'compliance'], a: 'Same wheel, different regulator. <b>India:</b> RERA, state-level — agents and projects register with the state authority (1,05,712 RERA-registered agents in 2025). <b>Dubai:</b> RERA, an arm of the Dubai Land Department; deals run on an SPA or MOU. <b>Saudi Arabia:</b> the Real Estate General Authority (REGA), with Ejar-style tenancy contracts introduced under Vision 2030. Module 10 — <i>The Compliance Shield</i> — goes deeper.' },
    { k: ['yield', 'rental', 'rent'], a: 'Gross rental yield = annual rent ÷ property price. In the Market Health Diagnostic, <b>5–7% gross is healthy</b> — the asset earns its keep; <b>below 3.5%</b> suggests buyers are betting purely on the next buyer paying more. For client advice, quote <i>net</i> yield after service charges and management. Try the <a href="#aria" data-aria-tab="calc">Investment Calculator</a>.' },
    { k: ['emi', 'mortgage', 'loan', 'interest rate', 'finance'], a: 'EMI = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1), where P is the loan, r the monthly rate and n the number of months. Leverage of 60–80%+ is what makes real estate different from stocks or gold — but it also amplifies risk. Open the EMI tab in the <a href="#aria" data-aria-tab="calc">Investment Calculator</a> to run a client scenario.' },
    { k: ['reject', 'confiden', 'fear', 'nervous', 'scared', 'motivat', 'demotivat', 'cold call'], a: 'Remember Rahul from Module 1: same market, same product — he went from 10 to 60 calls a day when his belief changed from <i>"I disturb people"</i> to <i>"I\'m helping clients make better investment decisions."</i> Rejection is data, not identity. Today: read your Identity Statement, then do 10 calls before 11 AM. I\'ll track them in your Daily Planner.' },
    { k: ['saudi', 'riyadh', 'vision 2030', 'neom', 'diriyah', 'red sea', 'ksa'], a: 'Saudi Arabia is the next frontier: real estate is ~12% of GDP (2024, roughly doubled since 2022). Vision 2030 projects include NEOM / The Line ($500B), Diriyah Gate ($63B), the Red Sea Project ($25B) and 1M new housing units targeted. Market entry timing for ARISEVERSE graduates is a planning assumption.' },
    { k: ['dubai', 'uae', 'emirates'], a: 'Dubai recorded <b>AED 917B</b> in transactions in 2025 (+20% YoY, 270,000+ deals). There were 23,536 registered brokers in Q4 2024, and 94.9% of the 6,784 brokerage firms have 1–10 agents — which is why structured training is rare. Real estate was 8.2% of Dubai\'s GDP in the first nine months of 2025.' },
    { k: ['india', 'mumbai', 'pune', 'bengaluru', 'delhi', 'hyderabad'], a: 'India\'s RERA-registered agents grew from 27,073 (2018) to 1,05,712 (2025), +19% YoY — yet an estimated 10 lakh brokers operate in total. Real estate is ~7–8% of GDP today, with a government ambition of 18% by 2047. Module 14 — <i>The India Radar</i> — covers city-level micro-markets.' },
    { k: ['interview', 'placement', 'job', 'career', 'cv', 'resume', 'hire'], a: 'Your Career Launch runs on <b>The LAUNCHPAD Framework</b>: Interview Readiness (Module 51 — The Interview-Ready Protocol) + First 60-Day Execution (Module 52). You\'re at 72% placement readiness — next step is a mock interview. See <a href="#careers">Career & Placement</a>.' },
    { k: ['negotiat', 'price', 'close', 'closing'], a: 'The <b>DEAL LOCK Framework</b>: Negotiation Skill (The Win-Win Lever) + Price Strategy (The Value Anchor) + Commitment Securing (The Commitment Seal) = Locked Deals. A good close is always a specific next step with a date — a site visit, a call with the decision-maker, an EOI.' },
    { k: ['ai ', 'ai?', 'artificial', 'chatgpt', 'crm', 'automation', 'prompt'], a: 'The <b>ARIA ADVANTAGE Framework</b> (Modules 38–41): AI overview, productivity tools, AI for marketing & content, CRM & analytics. You completed all four — your Time Multiplier Stack is set up. Want a prompt template for a listing description?' },
    { k: ['hello', 'hi ', 'hey', 'salaam', 'namaste', 'good morning'], a: 'Hello! I\'m ARIA X, your AI mentor. Ask me about any module, a market (India, Dubai, Saudi), a client situation, or your progress.' }
  ];
  function ariaReply(q) {
    const t = q.toLowerCase() + ' ';
    const re = k => new RegExp('(^|[^a-z])' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (/\d$/.test(k) ? '(?!\\d)' : ''));
    const hit = KB.find(e => e.k.some(k => re(k).test(t)));
    if (hit) return hit.a;
    const mm = t.match(/module\s*(\d{1,2})/);
    if (mm && +mm[1] >= 1 && +mm[1] <= 52) {
      const m = D.moduleById(+mm[1]), c = D.category(m.cat), st = mstatus(m.n);
      const where = st === 'done' ? 'You completed it — revisit any tool at any time.' : st === 'progress' ? `You're ${PROG[m.n]}% through it.` : st === 'open' ? 'It\'s unlocked and ready to start.' : 'It unlocks later in your path.';
      return `<b>Module ${m.n} · ${esc(m.title)}</b> — proprietary tool <b>${esc(m.tool)}</b>, inside <b>${esc(c.framework)}</b>: ${esc(c.formula)} = <i>${esc(c.result)}</i>. ${where} Want me to quiz you on it, or set up a roleplay that applies it? <a href="#module/${m.n}">Open Module ${m.n}</a>`;
    }
    return 'Good question — in this prototype I\'m scripted for a set of topics. Try asking about <b>the ARISE Method</b>, <b>off-plan vs ready</b>, <b>RERA</b>, <b>rental yield</b>, <b>handling "too expensive"</b>, <b>market health</b>, or <b>Saudi Vision 2030</b>.';
  }
  const SUGGEST = ['Explain the ARISE Method', 'Off-plan vs ready?', 'How do I handle "too expensive"?', 'Is a market speculative?', 'RERA in India vs Dubai', 'I\'m nervous on cold calls'];
  const CHATS = {};
  function chatInit(id) {
    if (!CHATS[id]) {
      const st = student();
      CHATS[id] = [{ who: 'bot', html: `Hi ${esc(st.first)}, I'm <b>ARIA X</b> — your AI mentor across every phase. You're 75% through <b>Module 19 · Residential Real Estate</b>. Ask me about any module, a market, or a client situation.` }];
    }
    return CHATS[id];
  }
  function chatMsgsHTML(id) {
    return chatInit(id).map(m => m.who === 'bot'
      ? `<div class="msg bot"><div class="who-l">${icon('spark', 'ic-sm')} ARIA X</div>${m.html}</div>`
      : `<div class="msg me">${esc(m.text)}</div>`).join('');
  }
  function chatHTML(id, inline) {
    return `<div class="chat ${inline ? 'inline' : ''}" data-chat="${id}">
      <div class="msgs">${chatMsgsHTML(id)}</div>
      <div class="sugg">${SUGGEST.map(s => `<button class="chip" data-action="chat-ask" data-q="${esc(s)}">${esc(s)}</button>`).join('')}</div>
      <form class="chat-in" data-form="chat"><input class="input" name="q" placeholder="Ask ARIA X anything…" autocomplete="off" aria-label="Message ARIA X"><button class="btn btn-dark" aria-label="Send">${icon('send', 'ic-sm')}</button></form>
      <div class="chat-note">Prototype: ARIA X replies are scripted for this demo.</div>
    </div>`;
  }
  function chatSend(root, q) {
    q = String(q || '').trim();
    if (!q) return;
    const id = root.dataset.chat;
    const list = chatInit(id);
    list.push({ who: 'me', text: q });
    const msgs = $('.msgs', root);
    msgs.innerHTML = chatMsgsHTML(id) + '<div class="msg bot typing"><i></i><i></i><i></i></div>';
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(() => {
      list.push({ who: 'bot', html: ariaReply(q) });
      if (!document.body.contains(root)) return;
      msgs.innerHTML = chatMsgsHTML(id);
      msgs.scrollTop = msgs.scrollHeight;
    }, 650 + Math.random() * 400);
  }
  function openAria(q) {
    openDrawer(icon('spark') + ' ARIA X Assistant', chatHTML('drawer'), {
      flush: true,
      after: b => {
        const root = $('.chat', b);
        $('.msgs', root).scrollTop = 1e6;
        if (q) chatSend(root, q); else setTimeout(() => $('input', root).focus(), 300);
      }
    });
  }

  /* =========================================================
     Shell
     ========================================================= */
  const NAV = [
    { r: 'dashboard', label: 'Dashboard', ic: 'home' },
    { r: 'learning', label: 'My Learning', ic: 'book' },
    { r: 'live', label: 'Live Classes', ic: 'video' },
    { r: 'assignments', label: 'Assignments', ic: 'edit', count: 2 },
    { r: 'assessments', label: 'Assessments', ic: 'checksq' },
    { r: 'aria', label: 'ARIA X Learning Hub', ic: 'spark' },
    { r: 'market', label: 'Market Intelligence', ic: 'chart' },
    { r: 'experts', label: 'Industry Experts', ic: 'mic' },
    { r: 'careers', label: 'Career & Placement', ic: 'brief' },
    { r: 'community', label: 'Community', ic: 'users' },
    { r: 'progress', label: 'My Progress', ic: 'trend' },
    { r: 'account', label: 'Settings', ic: 'sliders' }
  ];
  const NAV_FOR = { module: 'learning', welcome: 'dashboard' };

  const NOTIFS = [
    ['Assignment graded: M7 · GDP target note — A (90)', '2 hrs ago'],
    ['Live class tomorrow: Investment Opportunities in Dubai — 2026 Outlook', '5 hrs ago'],
    ['New ARIA X roleplay scenario: NRI investor · Riyadh → Dubai', 'Yesterday'],
    ['Placement Cell: 3 new roles match your profile', 'Yesterday'],
    ['You unlocked Module 48 — Mock Meetings & Role Plays', '2 days ago']
  ];
  const MSGS = [
    ['Praveen P. Singh · Trainer', 'Strong cold-call reps this week. Bring two objections to Monday\'s workshop.', '1 hr ago'],
    ['Placement Cell', 'Your profile was shared with an employer partner in Business Bay.', '3 hrs ago'],
    ['Cohort 1 · Dubai track', 'Study group on Sunday, 8 PM GST — Module 19 recap.', 'Yesterday']
  ];

  function renderShell() {
    const st = student();
    $('#side').innerHTML = `
      <div class="side-head">
        <a class="logo" href="#dashboard">${D.logoSVG}<span class="logo-word"><b>ARISEVERSE</b><small>Learn. Transform. Get Placed. Grow.</small></span></a>
        <button class="side-close" data-action="nav-close" aria-label="Close menu">${icon('x')}</button>
      </div>
      <nav>${NAV.map(n => `<a class="nav-a" href="#${n.r}" data-nav="${n.r}">${icon(n.ic)}<span>${n.label}</span>${n.count ? `<em class="nav-count">${n.count}</em>` : ''}</a>`).join('')}</nav>
      <div class="side-foot">
        <div class="keep">
          <h4>Keep going, ${esc(st.first)}</h4>
          <p>Your success is our mission.</p>
          <div class="keep-row"><b>${KPI.ascent}%</b><span>Overall<br>Ascent</span></div>
          <div class="bar mt-s" style="background:rgba(255,255,255,.1)"><i style="width:${KPI.ascent}%"></i></div>
        </div>
        <a class="back-site" href="index.html">${icon('arrowL', 'ic-sm')} Back to website</a>
      </div>`;
    $('#top').innerHTML = `
      <button class="hamb" data-action="nav-open" aria-label="Open menu">${icon('menu')}</button>
      <form class="search" data-form="search" role="search">${icon('search')}<input name="q" placeholder="Search modules, news, projects, topics…" aria-label="Search" autocomplete="off"></form>
      <div class="top-r">
        <button class="aria-btn" data-action="aria-open">${icon('spark')}<span>ARIA X Assistant</span></button>
        <div class="pop-wrap">
          <button class="icon-btn" data-action="pop" data-pop="notif" aria-label="Notifications">${icon('bell')}<span class="badge">8</span></button>
          <div class="pop" id="pop-notif"><div class="pop-h"><b>Notifications</b><button class="link" data-action="toast" data-msg="All notifications marked as read">Mark all read</button></div>
            ${NOTIFS.map(n => `<div class="pop-i"><span class="dot"></span><div><p>${esc(n[0])}</p><small>${n[1]}</small></div></div>`).join('')}</div>
        </div>
        <div class="pop-wrap">
          <button class="icon-btn" data-action="pop" data-pop="msg" aria-label="Messages">${icon('chat')}<span class="badge">3</span></button>
          <div class="pop" id="pop-msg"><div class="pop-h"><b>Messages</b><a class="link" href="#community">Open inbox ${icon('arrow', 'ic-sm')}</a></div>
            ${MSGS.map(m => `<div class="pop-i"><span class="avatar sm dark">${m[0].split(' ').map(w => w[0]).slice(0, 2).join('')}</span><div><p><b>${esc(m[0])}</b><br>${esc(m[1])}</p><small>${m[2]}</small></div></div>`).join('')}</div>
        </div>
        <a class="me" href="#account"><span class="avatar">${esc(st.initials)}</span><span class="who"><b>Hello, ${esc(st.first)}!</b><small>Student · ${esc(st.track)}</small></span></a>
      </div>`;
    $('#fstrip').innerHTML = [
      ['spark', 'AI-Powered Learning', 'Personalised by ARIA X'],
      ['mic', 'Industry Experts', 'Learn from the best'],
      ['target', 'Practical Training', 'Real-world simulation'],
      ['brief', 'Placement Support', 'India & UAE network'],
      ['diamond', 'Lifetime Access', 'Learn anytime, anywhere'],
      ['globe', 'Global Community', 'Network with professionals']
    ].map(f => `<div>${icon(f[0], 'ic-lg')}<span><b>${f[1]}</b><small>${f[2]}</small></span></div>`).join('');
  }

  /* =========================================================
     #login
     ========================================================= */
  function pageLogin() {
    return `<div class="auth-wrap">
      <aside class="auth-brand">
        ${bgVideo('dubai-timelapse')}<span class="auth-shade" aria-hidden="true"></span>
        <a class="logo" href="index.html">${D.logoSVG}<span class="logo-word"><b>ARISEVERSE</b><small>Learn. Transform. Get Placed. Grow.</small></span></a>
        <div class="auth-copy">
          <div class="eyebrow">ARISEVERSE Academy</div>
          <h1>Transform the Human First. <em>Train the Professional Next.</em></h1>
          <div class="arise-letters">${D.pillars.map(p => `<div><b style="color:${p.color}">${p.key}</b><span>${p.name}</span></div>`).join('')}</div>
        </div>
        <div class="auth-foot">Cohort 1 · India · UAE · Saudi Arabia</div>
      </aside>
      <main class="auth-form">
        <div class="auth-card">
          <a class="back" href="index.html">${icon('arrowL', 'ic-sm')} Back to website</a>
          <div class="eyebrow">Learning portal</div>
          <h2 class="mt-s">Sign in to continue your Ascent</h2>
          <p class="muted mt-s">Your next module, live class and ARIA X practice sessions are waiting.</p>
          <form data-form="login">
            <div class="field"><label for="lg-email">Demo learner</label><input class="input" id="lg-email" type="email" value="arjun.nair@example.com" readonly></div>
            <div class="auth-row"><label><input type="checkbox" checked> Keep me signed in</label></div>
            <button class="btn btn-dark btn-lg" type="submit">Enter as demo learner ${icon('arrow', 'ic-sm')}</button>
            <div class="divider">or</div>
            <button class="btn btn-line btn-google btn-lg" type="button" data-action="login">
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
              Continue with Google</button>
          </form>
          <div class="auth-new">New here? <a href="index.html#apply">Apply for Cohort 1 ${icon('arrow', 'ic-sm')}</a></div>
          <p class="demo-note">Prototype: no password is needed and no account is created. The live portal would use real sign-in here.</p>
        </div>
      </main>
    </div>`;
  }

  /* =========================================================
     #welcome — onboarding after the website's apply flow
     ========================================================= */
  const WEEK1 = [
    ['Orientation live class with Praveen P. Singh', 'Mon · 7:00 PM GST'],
    ['Module 1 — The Mirror Method', '~45 min'],
    ['Score your Life Wheel baseline', '10 min'],
    ['Meet ARIA X — your first roleplay session', '15 min'],
    ['Write your Identity Statement', '10 min']
  ];
  function pageWelcome() {
    const st = student();
    const done = S.get('week1', {});
    const labels = Object.keys(st.traits);
    const vals = labels.map(k => Number(st.traits[k]) || 0);
    return `
      <section class="welcome-hero">
        ${photo('cohort-group', 'hero-bg', true)}<span class="hero-shade" aria-hidden="true"></span>
        <div class="eyebrow">Cohort 1 · ${esc(st.track)}</div>
        <h1>Welcome to Cohort 1, <em>${esc(st.first)}</em>.</h1>
        <p>Your journey starts where every ARISEVERSE professional starts — with <b style="color:var(--on-dark)">you</b>. Phase 1 (Awaken) builds identity, purpose and confidence before any real estate content.</p>
        <div class="row-flex mt">
          <a class="btn btn-gold" href="#module/1">${icon('play', 'ic-sm')} Start Module 1 · The Mirror Method</a>
          <a class="btn btn-line" style="color:var(--on-dark)" href="#dashboard">Preview my dashboard (mid-programme sample)</a>
        </div>
      </section>
      <div class="grid c-21 mt">
        <div class="card box">
          <div class="box-h"><div><h3>Your Ascent Profile</h3><div class="sub">From your application assessment</div></div><span class="pill pill-gold">${esc(st.persona)}</span></div>
          <div class="grid c2" style="align-items:center">
            <div>
              <div class="eyebrow">Archetype</div>
              <h3 class="serif" style="font-size:26px;margin-top:6px">${esc(st.archetype.name)}</h3>
              <p class="muted mt-s">${esc(st.archetype.line)}</p>
              <div class="mt">${labels.map((k, i) => `<div class="trait"><span>${esc(k)}</span><div class="bar"><i style="width:${vals[i]}%"></i></div><b>${vals[i]}</b></div>`).join('')}</div>
            </div>
            <div>${radar(labels, [{ values: vals, stroke: 'var(--gold)', fill: 'rgba(184,146,90,.22)' }], 100, 280)}</div>
          </div>
          <p class="note mt">Your profile personalises your learning path and ARIA X coaching. It is not used to predict success.</p>
        </div>
        <div class="stack">
          <div class="card box">
            <div class="box-h"><h3>Your first 7 days</h3><span class="pill">${Object.values(done).filter(Boolean).length}/${WEEK1.length}</span></div>
            <div class="checklist">${WEEK1.map((w, i) => checkItem('week1', 'w' + i, w[0], done['w' + i], w[1])).join('')}</div>
          </div>
          <div class="card box">
            <div class="box-h"><h3>Your track</h3></div>
            <div class="rows">
              <div class="r"><div><b>${esc(st.track)}</b><small>Market focus: ${esc(st.market)}</small></div>${icon('pin')}</div>
              <div class="r"><div><b>12-week core programme</b><small>52 modules · 5 phases · live + self-paced</small></div>${icon('cal')}</div>
              <div class="r"><div><b>Founding trainer</b><small>Praveen P. Singh, Founder & CEO</small></div>${icon('mic')}</div>
            </div>
            <a class="link mt" href="index.html#academy">Programme overview ${icon('arrow', 'ic-sm')}</a>
          </div>
        </div>
      </div>`;
  }

  function checkItem(store, key, label, on, meta) {
    return `<label class="check ${on ? 'on' : ''}"><input type="checkbox" data-check="${store}" data-k="${key}" ${on ? 'checked' : ''}><span class="box-i">${icon('check')}</span><span class="t">${esc(label)}</span>${meta ? `<small>${esc(meta)}</small>` : ''}</label>`;
  }

  /* =========================================================
     #dashboard — mirrors the client's reference layout
     ========================================================= */
  const NEWS = {
    india: [['RERA authorities publish updated project disclosure guidance', 'New guidelines aim for more transparency for homebuyers.', '2 hrs ago', 'mumbai-skyline'], ['Housing demand strengthens in Tier-2 cities', 'Pune, Indore and Coimbatore see rising enquiries.', '3 hrs ago', 'residential-towers'], ['Home-loan rates hold steady this quarter', 'Lenders keep benchmark rates unchanged.', '5 hrs ago', 'house-model']],
    dubai: [['Off-plan launches continue to lead transaction volumes', 'Payment plans remain the key buyer driver.', '1 hr ago', 'dubai-marina-day'], ['New escrow reminders for off-plan payment plans', 'Agents advised to brief buyers on escrow protection.', '4 hrs ago', 'signing'], ['Prime waterfront rents hold firm', 'Leasing demand steady across established communities.', '6 hrs ago', 'apartment-luxury']],
    global: [['Cross-border buyers increase allocations to Gulf markets', 'Investors cite infrastructure and residency policy.', '2 hrs ago', 'riyadh-city'], ['Global REIT valuations stabilise as rates ease', 'Listed real estate recovers from recent lows.', '7 hrs ago', 'analytics'], ['Logistics real estate demand stays strong', 'E-commerce keeps warehouse occupancy high.', '9 hrs ago', 'construction-aerial']]
  };
  // A row with a small photo thumbnail: [title, sub, image name, right-hand html]
  const thumbRow = (t, sub, img, right = '') => `<div class="r tr">${photo(img, 'thumb')}<div style="flex:1;min-width:0"><b>${t}</b><small>${sub}</small></div>${right}</div>`;
  function newsList(k) {
    return `<div class="rows">${NEWS[k].map(n => thumbRow(n[0], `${n[1]} · ${n[2]}`, n[3])).join('')}</div>`;
  }
  function tabsHTML(group, tabs, panels, active = 0) {
    return `<div data-tabs="${group}"><div class="tabs" role="tablist">${tabs.map((t, i) => `<button class="tab ${i === active ? 'on' : ''}" data-action="tab" data-i="${i}" role="tab">${t}</button>`).join('')}</div>
      ${panels.map((p, i) => `<div class="tpanel ${i === active ? 'on' : ''}" data-i="${i}">${p}</div>`).join('')}</div>`;
  }

  // Sample class: Sat 24 Oct 2026, 7:00 PM GST (15:00 UTC). Shows a live countdown while it is within the week.
  const NEXT_CLASS_UTC = Date.UTC(2026, 9, 24, 15, 0);
  function countdownTick() {
    const el = $('[data-countdown]'); if (!el) return;
    const ms = NEXT_CLASS_UTC - Date.now();
    if (ms <= 0 || ms > 6 * 864e5) return;
    const h = Math.floor(ms / 36e5), m = Math.floor(ms % 36e5 / 6e4);
    el.innerHTML = `<i class="live-dot"></i>Live in ${h >= 24 ? `${Math.floor(h / 24)}d ${h % 24}h` : `${h}h ${m}m`}`;
  }
  function pageDashboard() {
    const st = student();
    onMount(() => { countdownTick(); const t = setInterval(countdownTick, 30000); MOUNT_CLEANUP.push(() => clearInterval(t)); });
    const kpis = [
      ['Modules Completed', `${KPI.modules} <span>/ 52</span>`],
      ['Live Classes Attended', KPI.live],
      ['Assignments Submitted', KPI.assignments],
      ['Certificates Earned', '03'],
      ['Placement Status', '<span class="ok">Active</span>']
    ];
    return `
      <div class="ph"><div><div class="eyebrow">Friday, 23 October 2026</div><h1 class="mt-s">Good afternoon, ${esc(st.first)}.</h1><p>Week 7 of 12 · You're ahead of 72% of Cohort 1 on practice reps this week.</p></div>
        <div class="ph-actions"><a class="btn btn-dark" href="#module/19">${icon('play', 'ic-sm')} Resume Module 19</a></div></div>

      <div class="grid c2">
        <div class="panel-gold">
          <h3>${icon('trophy')} Top 3 Scorers of the Month</h3>
          <div class="medals">
            <div class="medal">${face('Rohan Mehta', 'md g')}<div><small class="g">① Gold</small><b>Rohan Mehta</b><span>95.6%</span></div></div>
            <div class="medal">${face('Simran Kaur', 'md s')}<div><small class="s">② Silver</small><b>Simran Kaur</b><span>93.2%</span></div></div>
            <div class="medal">${face('Aman Verma', 'md bz')}<div><small class="bz">③ Bronze</small><b>Aman Verma</b><span>91.8%</span></div></div>
          </div>
        </div>
        <div class="panel-green">
          <h3>${icon('award')} Placement Cell — Recent Placements</h3>
          <div class="medals">
            <div class="medal">${face('Neha Sharma', 'md')}<div><b>Neha Sharma</b><span>Luxury brokerage · Dubai Marina</span><span class="tag">Placed</span></div></div>
            <div class="medal">${face('Vikram Singh', 'md')}<div><b>Vikram Singh</b><span>Off-plan sales · Business Bay</span><span class="tag">Placed</span></div></div>
            <div class="medal">${face('Pooja Iyer', 'md')}<div><b>Pooja Iyer</b><span>Residential brokerage · Mumbai</span><span class="tag">Placed</span></div></div>
          </div>
        </div>
      </div>
      <p class="note sample-note">Sample learners for the prototype · stock portraits</p>

      <div class="grid c5 mt">${kpis.map(k => `<div class="card kpi"><small>${k[0]}</small><b>${k[1]}</b></div>`).join('')}</div>

      <div class="grid c2 mt">
        <div class="card box">
          <div class="box-h"><h3>Continue Learning</h3><a class="link" href="#learning">All modules ${icon('arrow', 'ic-sm')}</a></div>
          <a class="media" href="#module/19" aria-label="Resume Module 19">${photo(M.category.dna, 'cover', true)}<span class="shade"></span><span class="pill pill-gold">In progress</span><span class="play">${icon('play')}</span></a>
          <b style="display:block;margin-top:14px;font-size:15px">Module 19 — Residential Real Estate</b>
          <small class="faint">The Home Matrix · Products & Projects · PROJECT DNA</small>
          <div class="bar mt-s"><i style="width:75%"></i></div>
          <div class="spread mt-s"><small class="faint">75% complete · 12 min left</small><a class="btn btn-dark btn-sm" href="#module/19">Resume</a></div>
        </div>
        <div class="card box">
          <div class="box-h"><h3>Upcoming Live Class</h3><a class="link" href="#live">View Calendar ${icon('arrow', 'ic-sm')}</a></div>
          <div class="media">${photo('dubai-marina-night', 'cover', true)}<span class="shade"></span><span class="pill pill-gold" data-countdown>Tomorrow · 7:00 PM GST</span><button class="play" data-action="video" data-v="dubai-timelapse" data-t="Session trailer · Dubai 2026 Outlook" aria-label="Play session trailer">${icon('play')}</button></div>
          <div class="host">${face('Sameer Khan', 'sm')}<div><b>Investment Opportunities in Dubai — 2026 Outlook</b><small>Sameer Khan · Guest expert (sample) · 8:30 PM IST</small></div></div>
          <div class="spread" style="margin-top:22px"><small class="faint">${icon('users', 'ic-sm')} 86 learners registered</small><button class="btn btn-dark btn-sm" data-action="toast" data-msg="You'll get a join link 15 minutes before class">Join Live Class</button></div>
        </div>
      </div>

      <div class="card box mt">
        <div class="box-h"><div><h3>Your ARISE Method progress</h3><div class="sub">One master framework · 11 systems · 52 tools</div></div><a class="link" href="#progress">My Progress ${icon('arrow', 'ic-sm')}</a></div>
        <div class="pillar-strip">${D.pillars.map(p => { const v = pillarProgress(p.key); return `<div class="ps"><div class="ps-top"><b style="color:${p.color}">${p.key}</b><span>${p.name}</span><em>${v}%</em></div><small>${esc(p.line)}</small><div class="bar"><i style="width:${v}%;background:${p.color}"></i></div></div>`; }).join('')}</div>
      </div>

      <div class="grid c2 mt">
        <div class="card box">
          ${tabsHTML('news', ['India Real Estate', 'Dubai Real Estate', 'Global Real Estate'], [newsList('india'), newsList('dubai'), newsList('global')])}
          <p class="note mt-s">Sample headlines. In production, the ARIA X News Engine (roadmap) curates regulatory and launch updates.</p>
        </div>
        <div class="card box">
          <div class="box-h"><h3>AI-Powered Market Insights</h3><a class="link" href="#market">View Full Report ${icon('arrow', 'ic-sm')}</a></div>
          <div class="mini-stats">
            <div class="mini"><small>Dubai transactions, 2025</small><b>AED 917B</b><span>+20% YoY · DLD</span></div>
            <div class="mini"><small>RERA-registered agents, India</small><b>1,05,712</b><span>+19% YoY · 2025</span></div>
            <div class="mini"><small>Real estate share of GDP</small><b style="color:var(--text)">8.2%</b><span>Dubai · 9M 2025</span></div>
          </div>
          <div class="callout navy" style="font-size:13px"><b>ARIA X insight:</b> 94.9% of Dubai brokerages have 1–10 agents — your structured training is a differentiator in interviews. Mention it.</div>
        </div>
      </div>

      <div class="grid c3 mt">
        <div class="card box">
          <div class="box-h"><h3>My Study Plan</h3><a class="link" href="#assignments">Full Plan ${icon('arrow', 'ic-sm')}</a></div>
          <div class="rows">
            <div class="r"><div><b>Finish Module 19 — Residential Real Estate</b><small>Due in 2 days</small></div></div>
            <div class="r"><div><b>Assignment: Market Health scoring of a micro-market</b><small>Due in 3 days</small></div></div>
            <div class="r"><div><b>ARIA X: 3 off-plan investor roleplays</b><small>This week · 1 of 3 done</small></div></div>
            <div class="r"><div><b>Live Class: Investment Opportunities in Dubai</b><small>Tomorrow, 7:00 PM GST</small></div></div>
          </div>
        </div>
        <div class="card box">
          <div class="box-h"><h3>Career & Placement</h3><a class="link" href="#careers">All Jobs ${icon('arrow', 'ic-sm')}</a></div>
          <div class="rows">
            ${thumbRow('Property Consultant', 'Dubai, UAE · AED 8K–15K + commission', 'dubai-marina-night', '<span class="pill pill-green">New</span>')}
            ${thumbRow('Sales Executive', 'Dubai, UAE · AED 6K–12K', 'dubai-marina-day', '<span class="pill pill-green">New</span>')}
            ${thumbRow('Relationship Manager', 'Mumbai, India · ₹4L–7L PA', 'mumbai-sealink', '<span class="pill pill-green">New</span>')}
          </div>
        </div>
        <div class="card box">
          <div class="box-h"><h3>Announcements</h3><a class="link" href="#community">All ${icon('arrow', 'ic-sm')}</a></div>
          <div class="rows">
            ${thumbRow('New ARIA X roleplay scenarios', 'Practise with an NRI investor and a seller who wants above-market price.', 'headset-laptop')}
            ${thumbRow('Dubai Market Webinar', 'This Saturday, 5:00 PM GST.', 'dubai-interchange')}
            ${thumbRow('Placement Drive — November', 'Employer partners hiring across Dubai and Mumbai.', 'handshake')}
          </div>
        </div>
      </div>`;
  }

  /* =========================================================
     #learning — the 52-module curriculum
     ========================================================= */
  const LEARN = { filter: 'all', pillar: null, q: '' };

  function moduleRow(m) {
    const st = mstatus(m.n);
    const right = st === 'progress'
      ? `<div class="mstat"><div class="bar"><i style="width:${PROG[m.n]}%"></i></div>${statusPill(m.n)}</div>`
      : `<div class="mstat">${statusPill(m.n)}</div>`;
    return `<div class="mrow ${st}" ${st === 'locked' ? '' : `data-go="#module/${m.n}"`} role="link" tabindex="0">
      <span class="mnum">${st === 'done' ? icon('check', 'ic-sm') : st === 'locked' ? icon('lock', 'ic-sm') : m.n}</span>
      <div><div class="mt-title">Module ${m.n} · ${esc(m.title)}</div><div class="mt-tool">${esc(m.tool)}</div></div>
      ${right}
    </div>`;
  }
  function curriculumHTML() {
    const q = LEARN.q.trim().toLowerCase();
    const match = m => {
      const st = mstatus(m.n);
      if (LEARN.filter === 'progress' && st !== 'progress') return false;
      if (LEARN.filter === 'done' && st !== 'done') return false;
      if (LEARN.filter === 'open' && st !== 'open' && st !== 'progress') return false;
      if (LEARN.filter === 'locked' && st !== 'locked') return false;
      if (LEARN.pillar && m.pillar !== LEARN.pillar) return false;
      if (q) {
        const c = D.category(m.cat);
        const hay = (m.title + ' ' + m.tool + ' ' + c.name + ' ' + c.framework + ' module ' + m.n).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    };
    let any = false;
    const html = D.pillars.map(p => {
      const cats = D.categories.filter(c => c.pillar === p.key).map(c => {
        const ms = D.modules.filter(m => m.cat === c.id && match(m));
        if (!ms.length) return '';
        any = true;
        return `<div class="card cat">
          <div class="cat-h"><div class="cat-cover">${photo(M.category[c.id], '')}</div><div class="cat-t"><div class="fw">${esc(c.framework)}</div><h3 class="mt-s">${esc(c.name)} <span class="faint" style="font-family:var(--sans);font-size:13px;font-weight:500">· M${c.from}–${c.to}</span></h3>
            <div class="formula">${esc(c.formula)} = <b>${esc(c.result)}</b></div></div>
            <div class="cat-p"><small class="faint">${catProgress(c.id)}% complete</small><div class="bar mt-s"><i style="width:${catProgress(c.id)}%;background:${p.color}"></i></div></div></div>
          ${ms.map(moduleRow).join('')}
        </div>`;
      }).join('');
      if (!cats) return '';
      const v = pillarProgress(p.key);
      return `<section class="pillar-block">
        <div class="pillar-head"><div class="pl-letter" style="color:${p.color}">${p.key}</div><div><div class="eyebrow">Pillar ${'ARISE'.indexOf(p.key) + 1} · Phase ${p.phase}</div><h2>${p.name}</h2><p>${esc(p.line)}</p></div>
          <div class="pp"><b>${v}%</b><div class="bar mt-s"><i style="width:${v}%;background:${p.color}"></i></div></div></div>
        ${cats}
      </section>`;
    }).join('');
    return any ? html : `<div class="card empty"><b>No modules match${q ? ` “${esc(LEARN.q)}”` : ''}.</b><p class="mt-s">Try another filter or search term.</p><button class="btn btn-dark btn-sm mt" data-action="learn-reset">Clear filters</button></div>`;
  }
  function pageLearning() {
    const filters = [['all', 'All modules'], ['progress', 'In progress'], ['open', 'Available'], ['done', 'Completed'], ['locked', 'Locked']];
    return `
      <div class="ph"><div><div class="eyebrow">The ARISE Method</div><h1 class="mt-s">My Learning</h1><p>One master framework, eleven proprietary systems, fifty-two named tools. Every module decodes upward — tool → framework → The ARISE Method.</p></div>
        <div class="ph-actions"><a class="btn btn-line" href="index.html#academy">Programme overview</a><a class="btn btn-dark" href="#module/19">${icon('play', 'ic-sm')} Resume M19</a></div></div>
      <div class="card box learn-sum">
        ${ring(Math.round(KPI.modules / 52 * 100), 110, 10, 'var(--gold)', KPI.modules + '/52', 'modules')}
        <div class="learn-bars">${D.pillars.map(p => { const v = pillarProgress(p.key); return `<div class="lb"><small><span><b style="color:${p.color};font-family:var(--serif);font-size:15px">${p.key}</b> ${p.name}</span><b>${v}%</b></small><div class="bar"><i style="width:${v}%;background:${p.color}"></i></div></div>`; }).join('')}</div>
      </div>
      <div class="filters">
        <div class="seg" role="tablist">${filters.map(f => `<button class="${LEARN.filter === f[0] ? 'on' : ''}" data-action="learn-filter" data-f="${f[0]}">${f[1]}</button>`).join('')}</div>
        <div class="chips">${D.pillars.map(p => `<button class="chip ${LEARN.pillar === p.key ? 'on' : ''}" data-action="learn-pillar" data-p="${p.key}"><span class="lt" style="color:${LEARN.pillar === p.key ? 'inherit' : p.color}">${p.key}</span>${p.name}</button>`).join('')}</div>
      </div>
      ${LEARN.q ? `<div class="callout" style="margin:0 0 18px">Showing results for <b>“${esc(LEARN.q)}”</b> · <button class="link" data-action="learn-reset">Clear search</button></div>` : ''}
      <div id="curriculum">${curriculumHTML()}</div>`;
  }

  /* =========================================================
     Lesson building blocks
     ========================================================= */
  const MOUNT = [];
  const onMount = fn => MOUNT.push(fn);

  const sec = (id, eyebrow, title, body) => ({ id, t: title, html: `<div class="eyebrow">${eyebrow}</div><h2>${title}</h2>${body}` });
  const flow = (items, last) => `<div class="flow">${items.map((x, i) => `<span class="${i === items.length - 1 && last ? last : ''}">${esc(x)}</span>`).join('<i>→</i>')}</div>`;
  const ul = items => `<ul class="clean">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;

  function assignmentBox(key, brief, practical) {
    const done = S.get('sub-' + key, null);
    return `<div class="assign">
      <div class="a1"><h5>Assignment — submitted work</h5><p>${brief}</p></div>
      <div class="a2"><h5>Practical work — live activity</h5><p>${practical}</p></div>
    </div>
    <div class="submit-box" data-submit="${key}">
      ${done ? `<div class="submitted">${icon('check')} Submitted ${esc(done.when)} · awaiting trainer feedback</div>`
        : `<div class="field"><label for="sub-${key}">Your submission</label><textarea class="textarea" id="sub-${key}" placeholder="Paste your one-page answer here, or attach a file."></textarea></div>
           <div class="row-flex mt-s"><button class="btn btn-dark btn-sm" data-action="submit-lesson" data-key="${key}">${icon('upload', 'ic-sm')} Submit assignment</button><button class="btn btn-line btn-sm" data-action="toast" data-msg="File picker opens here (prototype)">Attach file</button></div>`}
    </div>`;
  }
  function outcomes(key, items) {
    const st = S.get(key, {});
    return `<div class="checklist">${items.map((o, i) => checkItem(key, 'o' + i, o, st['o' + i])).join('')}</div>`;
  }

  /* ---------- Module 1 tools ---------- */
  const LW_AREAS = ['Health', 'Career', 'Finance', 'Confidence', 'Communication', 'Learning', 'Relationships', 'Spirituality'];
  const LW_DEFAULT = [6, 5, 4, 5, 6, 7, 6, 5];
  function lwScore(v) { const s = v.reduce((a, b) => a + b, 0); return { sum: s, avg: (s / 8).toFixed(1) }; }
  function lifeWheelHTML() {
    const v = S.get('lifewheel', LW_DEFAULT);
    const sc = lwScore(v);
    return `<div class="tool" data-lifewheel>
      <div class="tool-h"><b>Interactive · Your Life Wheel</b><span class="pill">Saved automatically</span></div>
      <div class="wheel">
        <div>${LW_AREAS.map((a, i) => `<div class="sl"><label for="lw${i}">${a}</label><input id="lw${i}" type="range" min="1" max="10" step="1" value="${v[i]}" data-input="lifewheel" data-i="${i}"><output>${v[i]}</output></div>`).join('')}
          <p class="note mt-s">Score yourself honestly, 1–10, across all eight life areas.</p></div>
        <div><div class="lw-radar">${radar(LW_AREAS, [{ values: v, stroke: 'var(--navy)', fill: 'rgba(15,33,64,.14)' }], 10, 290)}</div>
          <div class="score-card"><small>Transformation Score</small><b class="lw-score">${sc.avg} / 10</b><span class="lw-sum">${sc.sum} ÷ 8 — your baseline for the 12-week programme</span></div></div>
      </div>
    </div>`;
  }
  function lifeWheelUpdate(root) {
    const v = $$('input[data-input="lifewheel"]', root).map(i => Number(i.value));
    $$('.sl output', root).forEach((o, i) => { o.textContent = v[i]; });
    $('.lw-radar', root).innerHTML = radar(LW_AREAS, [{ values: v, stroke: 'var(--navy)', fill: 'rgba(15,33,64,.14)' }], 10, 290);
    const sc = lwScore(v);
    $('.lw-score', root).textContent = sc.avg + ' / 10';
    $('.lw-sum', root).textContent = sc.sum + ' ÷ 8 — your baseline for the 12-week programme';
    S.set('lifewheel', v);
  }

  const BELIEFS_DEFAULT = [["I can't sell luxury homes.", 'I can master luxury sales through learning and daily practice.'], ['I disturb people when I call them.', "I'm helping clients make better investment decisions."]];
  const beliefRow = b => `<div class="belief-row"><input class="input old" value="${esc(b[0])}" placeholder="Old belief" data-input="belief" aria-label="Old belief"><span class="arrow">→</span><input class="input new" value="${esc(b[1])}" placeholder="New, specific, empowering belief" data-input="belief" aria-label="New belief"><button class="del" data-action="belief-del" aria-label="Remove belief">${icon('x', 'ic-sm')}</button></div>`;
  function beliefsHTML() {
    const rows = S.get('beliefs', BELIEFS_DEFAULT);
    return `<div class="tool" data-beliefs>
      <div class="tool-h"><b>Interactive · Belief Rewriter</b><span class="pill belief-count">${rows.length} / 20 written</span></div>
      <div class="belief-rows">${rows.map(beliefRow).join('')}</div>
      <button class="btn btn-line btn-sm mt" data-action="belief-add">${icon('plus', 'ic-sm')} Add a belief</button>
    </div>`;
  }
  function beliefsSave(root) {
    const rows = $$('.belief-row', root).map(r => [$('.old', r).value, $('.new', r).value]);
    $('.belief-count', root).textContent = rows.length + ' / 20 written';
    S.set('beliefs', rows);
  }

  const ID_DEFAULT = { role: 'a trusted global real estate advisor', value: 'creates value, inspires confidence', growth: 'continuously improves every day' };
  function identityText(v) { return `I am ${v.role || '…'} who ${v.value || '…'}, and ${v.growth || '…'}.`; }
  function identityHTML() {
    const v = S.get('identity', ID_DEFAULT);
    return `<div class="tool" data-identity>
      <div class="tool-h"><b>Interactive · Identity Statement Builder</b><span class="pill">Read it every morning</span></div>
      <div class="grid c3">
        <div class="field"><label>I am…</label><input class="input" data-input="identity" data-k="role" value="${esc(v.role)}"></div>
        <div class="field"><label>who…</label><input class="input" data-input="identity" data-k="value" value="${esc(v.value)}"></div>
        <div class="field"><label>and…</label><input class="input" data-input="identity" data-k="growth" value="${esc(v.growth)}"></div>
      </div>
      <div class="id-preview"><small>Your identity statement</small><span class="id-text">“${esc(identityText(v))}”</span></div>
    </div>`;
  }
  function identityUpdate(root) {
    const v = {};
    $$('input[data-input="identity"]', root).forEach(i => { v[i.dataset.k] = i.value.trim(); });
    $('.id-text', root).textContent = '“' + identityText(v) + '”';
    S.set('identity', v);
  }

  function routineHTML(key, morning, evening) {
    const st = S.get(key, {});
    return `<div class="routine">
      <div><h5>${icon('sun', 'ic-sm')} Morning</h5><div class="checklist">${morning.map((m, i) => checkItem(key, 'm' + i, m, st['m' + i])).join('')}</div></div>
      <div><h5>${icon('moon', 'ic-sm')} Evening</h5><div class="checklist">${evening.map((m, i) => checkItem(key, 'e' + i, m, st['e' + i])).join('')}</div></div>
    </div>`;
  }

  const ICEBERG = `<svg viewBox="0 0 300 260" aria-hidden="true">
    <rect x="0" y="92" width="300" height="168" rx="12" fill="rgba(15,33,64,.07)"/>
    <path d="M0 92 Q 25 86 50 92 T 100 92 T 150 92 T 200 92 T 250 92 T 300 92" fill="none" stroke="#6F8BA4" stroke-width="1.5"/>
    <path d="M112 92 L138 34 L156 18 L174 40 L186 60 L198 92 Z" fill="#E9E2D2" stroke="#CFC4AE"/>
    <path d="M78 96 L222 96 L258 150 L226 226 L132 250 L52 196 Z" fill="#0F2140"/>
    <text x="150" y="80" text-anchor="middle" font-size="11" font-weight="700" fill="#8A6A3A" letter-spacing="2">VISIBLE</text>
    <text x="155" y="175" text-anchor="middle" font-size="12" font-weight="700" fill="#D4B27C" letter-spacing="3">HIDDEN</text>
  </svg>`;

  /* =========================================================
     Lesson content — real content from the client's decks
     ========================================================= */
  const LESSONS = {};

  LESSONS[1] = () => ({
    minutes: 45,
    quote: 'You cannot outperform the person you believe you are.',
    sections: [
      sec('why', 'Why most people fail', 'The sequence most people get backwards', `
        <p class="lead">Most people assume success comes from knowledge. ARISEVERSE teaches that it starts much earlier — with identity.</p>
        <h4>What most people assume</h4>${flow(['Knowledge', 'Action', 'Success'])}
        <h4>What ARISEVERSE teaches</h4>${flow(['Identity', 'Beliefs', 'Thoughts', 'Emotions', 'Actions', 'Habits', 'Results', 'Success'], 'end')}
        <div class="formula-box">Success = <b>Identity</b> × <b>Daily Habits</b> × <b>Consistency</b><small>If identity is weak, success is temporary — which is why this module comes before any real estate content.</small></div>`),
      sec('iceberg', 'The iceberg principle', 'What everyone sees. What actually holds it up.', `
        <div class="iceberg">${ICEBERG}
          <div class="ice-list">
            <h5 style="color:var(--gold-ink)">Visible</h5><div class="chips">${['Income', 'Career', 'Luxury lifestyle', 'Awards', 'Recognition'].map(x => `<span class="chip">${x}</span>`).join('')}</div>
            <h5 style="color:var(--navy)">Hidden</h5><div class="chips">${['Beliefs', 'Self-image', 'Habits', 'Discipline', 'Emotional control', 'Character'].map(x => `<span class="chip" style="background:var(--navy);color:#fff;border-color:var(--navy)">${x}</span>`).join('')}</div>
            <p class="muted">Most people try to improve the visible part without ever changing the hidden part. ARISEVERSE transforms the hidden foundation first.</p>
          </div></div>`),
      sec('method', 'The Mirror Method', 'Five stages, in order', `
        <div class="stages">${[['M', 'Measure Yourself', 'Score your life honestly.'], ['I', 'Identify Limiting Beliefs', 'Find what holds you back.'], ['R', 'Rewrite Identity', 'Decide who you are.'], ['R', 'Repeat Daily', 'Turn it into routine.'], ['O', 'Own Everything', 'No blame. Only growth.']].map(s => `<div class="stage"><b>${s[0]}</b><span>${s[1]}</span><small>${s[2]}</small></div>`).join('')}</div>
        <p class="muted mt">Measure honestly → identify what's holding you back → rewrite who you are → repeat it daily → own the outcome.</p>`),
      sec('measure', 'Stage 1 — Measure yourself', 'The Life Wheel', `
        <p class="lead">Your score becomes your baseline — not a judgement, a starting point to track against over the 12-week programme.</p>${lifeWheelHTML()}`),
      sec('beliefs', 'Stage 2 — Identify limiting beliefs', 'Replace the story, not just the behaviour', `
        <div class="compare"><div class="bad"><h5>Old belief</h5><p class="serif" style="font-size:19px;font-style:italic">“I can't sell luxury homes.”</p></div><div class="good"><h5>New belief</h5><p class="serif" style="font-size:19px;font-style:italic">“I can master luxury sales through learning and daily practice.”</p></div></div>
        <h4>The exercise</h4>${ul(['Write <b>20</b> negative beliefs you hold about yourself or your career.', 'For each: what\'s the evidence <b>for</b> it? What\'s the evidence <b>against</b> it?', 'Replace it with a <b>specific</b>, empowering belief — not a vague one.'])}
        ${beliefsHTML()}`),
      sec('identity', 'Stage 3 — Rewrite identity', 'Identity drives behaviour — not the other way around', `
        <div class="compare"><div class="bad"><h5>“I'm lazy”</h5>${flow(['Wake up late', 'Delay work', 'Miss opportunities'])}</div><div class="good"><h5>“I am disciplined”</h5><p>The behaviour naturally changes.</p></div></div>
        ${identityHTML()}`),
      sec('repeat', 'Stage 4 — Repeat daily', 'Transformation is repetition, not intensity', `
        ${routineHTML('routine1', ['Meditation (10 min)', 'Exercise (30 min)', 'Read (20 pages)', 'Gratitude journal', 'Goal review', 'Skill practice'], ['Review wins', 'Identify mistakes', 'Plan tomorrow', 'Read', 'Sleep early'])}
        <div class="formula-box">Small Improvement × <b>365 Days</b> = Massive Transformation</div>`),
      sec('own', 'Stage 5 — Own everything', 'Ownership vs. victim thinking', `
        <div class="compare"><div class="bad"><h5>Victim thinking</h5>${ul(['Blames the economy', 'Blames clients', 'Blames the company', 'Blames government', 'Blames family'])}<p class="mt-s"><b>→ Creates stagnation</b></p></div>
          <div class="good"><h5>Ownership</h5><p>Asks one question instead:</p><p class="serif" style="font-size:21px;font-style:italic;margin-top:8px">“What can I do differently?”</p><p class="mt-s"><b>→ Creates growth</b></p></div></div>`),
      sec('cycle', 'The psychology behind the module', 'A cycle that feeds itself', `
        <div class="cycle"><span>Thoughts</span><i>→</i><span>Feelings</span><i>→</i><span>Actions</span><i>→</i><span>Results</span><i>→</i><span style="background:var(--navy);color:#fff">Reinforced Beliefs</span><i>↻</i></div>
        <div class="callout navy">If results are poor, the fix starts with the <b>thoughts and beliefs</b> feeding the cycle — not just the actions at the end of it.</div>`),
      sec('case', 'Case study', 'Rahul, age 24 — the market didn\'t change. His identity did.', `
        <div class="case"><div class="before"><h5>Before the Mirror Method</h5><div class="big">10</div><p>calls / day</p><p class="mt-s">Belief: <i>“I disturb people.”</i></p><p class="mt-s">Income: <b>AED 4,000 / month</b></p></div>
          <div class="after"><h5>After the Mirror Method</h5><div class="big">60</div><p>calls / day</p><p class="mt-s">New belief: <i>“I'm helping clients make better investment decisions.”</i></p><p class="mt-s" style="color:#B9C3D6">Confidence rises → more meetings → more sales → income increases.</p></div></div>
        <h4>Real-world example — Wayne Dyer</h4>
        <div class="timeline"><div><b>Childhood</b><small>Placed in orphanages and foster homes after his father abandoned the family.</small></div><div><b>1974</b><small>Sat at his father's unmarked grave and said everything he'd never said.</small></div><div><b>The shift</b><small>Described that act of forgiveness as the moment his life changed direction.</small></div><div><b>Legacy</b><small>40+ books, including 21 New York Times bestsellers.</small></div></div>
        <p class="note mt-s">Stages 1 and 2 of the Mirror Method, lived in real life: he had to measure the pattern honestly before he could rewrite it.</p>`),
      sec('formula', 'Transformation formula', 'Five elements. No shortcuts.', `
        <div class="formula-box"><b>Awareness</b> + <b>Acceptance</b> + <b>Accountability</b> + <b>Action</b> + <b>Consistency</b> = Personal Transformation<small>Without awareness, there is no growth. Without action, there is no change. Without consistency, there are no lasting results.</small></div>`),
      sec('assign', 'Before the next session', 'Assignment & practical work', assignmentBox('m1',
        'Complete your own Life Wheel (score all 8 areas). Calculate your Transformation Score. Write your Identity Statement (2–3 sentences). List 5 limiting beliefs with an empowering replacement for each. Submit as one page before the next session.',
        'In pairs, read your Identity Statement out loud. Share ONE limiting belief and its new replacement. Your partner gives one honest reaction: does this sound like something you\'d actually act on this week — or still generic? Revise it live, on the spot.')),
      sec('outcomes', 'End-of-module outcome', 'The mindset the other 51 modules build on', outcomes('outcomes1', ['Know my strengths and weaknesses', 'Identify and replace limiting beliefs', 'Build a powerful personal identity', 'Follow a daily success routine', 'Take ownership of my life and career', 'Begin thinking like a high-performing professional']) + '<p class="note mt">This aligns with the AWAKEN pillar of The ARISE Method — mindset, identity and confidence before any technical real estate learning begins.</p>')
    ]
  });

  /* ---------- Module 2 ---------- */
  const CASCADE_LEVELS = [['Life goal', '10 years', '#B8925A'], ['Strategic', '3–5 years', '#A3814F'], ['Annual', 'This year', '#7E6A4C'], ['Quarterly', 'This quarter', '#4F5A62'], ['Monthly', 'This month', '#2D4262'], ['Weekly', 'This week', '#1C3254'], ['Daily', 'Today', '#0F2140']];
  const CASCADE_AGENT = ['Lead a luxury advisory team in Dubai and mentor 50 new agents', 'Become a top-10 advisor in my brokerage with an India–UAE client base', 'Close 30 property transactions', 'Close 8 deals · 25 site visits · complete Phase 2', 'Close 3 deals · 1,300 prospecting calls · 20 client meetings', '300 calls · 5 client meetings · 2 site visits · Sunday review', '60 calls · 1 hour market study · plan tomorrow'];
  const CASCADE_DECK = ['Build a global academy', 'Launch in five countries; train 10,000 professionals', 'Publish one book; deliver 50 workshops', 'Complete Modules 1–10; build the website', 'Record 8 training videos; 50 new leads', 'Finish Module 2; 2 LinkedIn posts', 'Exercise, read, study, prospect, reflect'];
  function cascadeRows(vals) {
    return CASCADE_LEVELS.map((l, i) => `<div class="cas"><div class="lvl" style="background:${l[2]}">${l[0]}<small>${l[1]}</small></div><input class="input" data-input="cascade" data-i="${i}" value="${esc(vals[i] || '')}" aria-label="${l[0]} goal"></div>`).join('');
  }

  LESSONS[2] = () => ({
    minutes: 50,
    quote: 'When your purpose is clear, your decisions become simple.',
    sections: [
      sec('bridge', 'From Module 1 to Module 2', 'Two questions, in order', `
        <div class="compare"><div style="background:#F4F1EB"><h5 style="color:var(--text-3)">Module 1</h5><p class="serif" style="font-size:24px">“Who am I?”</p></div><div style="background:var(--navy);color:#fff"><h5 style="color:var(--gold-2)">Module 2</h5><p class="serif" style="font-size:24px">“Where am I going, and why?”</p></div></div>
        <p class="lead mt">Many people work hard but feel stuck because they have activity without direction. The North Star Blueprint turns a vague sense of purpose into a measurable plan.</p>`),
      sec('stages', 'The North Star Blueprint', 'Six stages, in order', `
        <div class="stages six">${['Discover your WHY', 'Define your vision', 'Create goals', 'Prioritise', 'Build execution plan', 'Review & adjust'].map((s, i) => `<div class="stage"><b>${i + 1}</b><span>${s}</span></div>`).join('')}</div>
        <p class="muted mt">Just as sailors navigate by the North Star, every successful person needs a fixed direction that guides decisions during uncertainty.</p>`),
      sec('why', 'Stage 1 — Discover your WHY', 'A goal without a WHY runs out of fuel', `
        <div class="grid c2 mt-s"><div><h4 style="margin-top:0">The goal</h4><p class="serif" style="font-size:22px">“Earn AED 100,000 / month”</p>${flow(['Financial freedom', 'Support my family', 'Build an academy', 'Create jobs', 'Educate thousands'], 'end')}</div>
          <div><h4 style="margin-top:0">Ask yourself</h4>${ul(['Why do I want success?', 'Why do I want wealth?', 'Who benefits if I succeed?', 'What legacy do I want to leave?'])}</div></div>
        <div class="callout"><b>A strong ‘why’ creates resilience.</b></div>`),
      sec('vision', 'Stage 2 — Define your vision', 'Imagine yourself, 10 years from today', `
        <div class="grid c2 mt-s">${['Where do you live?', 'What work do you do?', 'What impact do you create?', 'How much do you earn?', 'How do people describe you?'].map((q, i) => `<div class="field"><label>${i + 1}. ${q}</label><input class="input" data-input="vision" data-k="q${i}" value="${esc((S.get('vision2', {}))['q' + i] || '')}" placeholder="Write freely…"></div>`).join('')}</div>
        <div class="id-preview"><small>Example vision statement</small>“I lead one of the world's most respected real estate academies, transforming professionals across multiple countries while building innovative businesses that create opportunities for others.”</div>`),
      sec('cascade', 'Stage 3 — Create goals', 'The ARISE Goal Formula', `
        ${flow(['Vision', 'Mission', 'Goals', 'Daily Actions', 'Results'], 'end')}
        <div class="tool" data-cascade><div class="tool-h"><b>Interactive · Goal cascade — from 10-year vision to today</b>
          <div class="row-flex"><button class="chip" data-action="cascade-load" data-set="agent">Agent example</button><button class="chip" data-action="cascade-load" data-set="deck">Founder's example</button></div></div>
          <div class="cascade">${cascadeRows(S.get('cascade', CASCADE_AGENT))}</div>
          <p class="note mt-s">Edit any level — it saves automatically and feeds your ARIA X Daily Planner.</p></div>`),
      sec('prioritise', 'Stage 4 — Prioritise', 'The 80/20 principle', `
        <div class="pareto"><div>20%</div><div>80% — everything else</div></div>
        <p class="muted mt-s">20% of activities create 80% of results.</p>
        <div class="compare"><div class="good"><h5>High-value activities</h5>${ul(['Client meetings', 'Prospecting', 'Negotiation', 'Follow-ups'])}</div><div class="bad"><h5>Low-value activities</h5>${ul(['Excessive scrolling', 'Unnecessary meetings', 'Constant email checking'])}</div></div>`),
      sec('execute', 'Stage 5 — Build an execution plan', 'Goals without execution remain wishes', `
        <div class="callout navy"><b>Goal:</b> Close 30 property transactions this year</div>
        <div class="stages mt">${[['60', 'prospecting calls', 'every day'], ['5', 'client meetings', 'weekly'], ['2', 'site visits', 'every week'], ['1h', 'market study', 'daily'], ['Sun', 'progress review', 'every week']].map(s => `<div class="stage light"><b>${s[0]}</b><span>${s[1]}</span><small>${s[2]}</small></div>`).join('')}</div>
        <p class="muted mt">Every goal needs: a deadline, resources, skills required, possible obstacles, a backup plan, and accountability.</p>`),
      sec('review', 'Stage 6 — Review & adjust', 'Success comes from continuous adjustment', `
        <div class="cycle"><span>What did I achieve?</span><i>→</i><span>What slowed me down?</span><i>→</i><span>What should I improve?</span><i>→</i><span>What's the next priority?</span><i>↻</i></div>
        <div class="callout">Success comes from continuous adjustment, <b>not perfection</b>.</div>`),
      sec('pyramid', 'The purpose pyramid', 'If the top is unclear, everything beneath it is unstable', `
        <div class="pyramid">${['Purpose', 'Vision', 'Mission', 'Goals', 'Projects', 'Daily Habits', 'Results'].map((p, i) => `<div style="width:${30 + i * 10}%">${p}</div>`).join('')}</div>`),
      sec('case', 'Case study', 'Sarah — new real estate advisor', `
        <div class="case"><div class="before"><h5>Before</h5>${ul(['Wanted ‘success’ with no clear direction', 'Changed companies frequently', 'Started projects, never finished them'])}</div>
          <div class="after"><h5>After the North Star Blueprint</h5>${ul(['Purpose: help families decide with confidence', 'Vision: luxury property advisor in Dubai', 'Annual goal: AED 50M in sales'])}<p class="mt-s" style="color:#B9C3D6">Daily: 50 prospecting calls · two property presentations · one hour of market study.</p></div></div>
        <h4>Real-world example — Iyanla Vanzant</h4>
        <div class="timeline"><div><b>The crisis</b><small>Left an abusive marriage as a single mother, on welfare.</small></div><div><b>The vision</b><small>Enrolled at Medgar Evers College — graduated summa cum laude.</small></div><div><b>The goal chain</b><small>Law degree from CUNY; public defender in Philadelphia.</small></div><div><b>The result</b><small>Bestselling author; founded Inner Visions Institute; hosted <i>Iyanla: Fix My Life</i>.</small></div></div>`),
      sec('routine', 'Daily success routine', 'Purpose has to be revisited, not just written once', routineHTML('routine2', ['Read your purpose statement', 'Read your vision', 'Review your annual goals', 'Identify the 3 most important tasks', 'Visualise success for 5 minutes'], ['Review completed tasks', 'Record lessons learned', 'Plan tomorrow', 'Express gratitude'])),
      sec('formula', 'The North Star formula', 'Five elements. Extraordinary results.', `
        <div class="formula-box"><b>Purpose</b> + <b>Vision</b> + <b>Goals</b> + <b>Focus</b> + <b>Consistent Action</b> = Extraordinary Results<small>Purpose gives meaning. Vision gives direction. Goals create clarity. Action creates progress. Consistency creates success.</small></div>`),
      sec('assign', 'Before the next session', 'Assignment & practical work', assignmentBox('m2',
        'Write your Purpose statement and your 10-year Vision statement. Take ONE annual goal and break it down through the Goal Pyramid: Quarterly → Monthly → Weekly → Daily. Submit as one page before the next session.',
        'In pairs, read your Vision statement out loud. Your partner asks: ‘What\'s the ONE goal for this week that actually moves this vision forward?’ Write that weekly goal down together, out loud, and commit to it in front of your partner.')),
      sec('outcomes', 'End-of-module outcome', 'Working hard isn\'t enough — work with direction', outcomes('outcomes2', ['Discover a meaningful life purpose', 'Build a compelling long-term vision', 'Break vision into actionable goals', 'Prioritise high-impact activities', 'Create a disciplined execution system', 'Stay committed through challenges']))
    ]
  });

  /* ---------- Module 7 — The Real Estate Ecosystem ---------- */
  const SIX = [
    ['Development', 'Buys land, rezones it, builds or renovates, then sells or leases the finished product. Creates the “primary market”.', 'Developer, project manager, urban planner', 'Developer, land acquisition analyst', 'Construction / engineering background, or analyst roles inside a developer'],
    ['Sales & Marketing', 'Sells a developer\'s completed or off-plan units. Earns commission for marketing and moving new inventory.', 'Sales agent, marketing manager, CRM lead', 'Off-plan sales agent, digital marketer, CRM / lead manager', 'Sales training + product knowledge; strong entry point for career-changers'],
    ['Brokerage', 'Represents buyers and sellers (or landlords and tenants) on the resale and leasing side — the “secondary market”.', 'Real estate agent / broker, team leader', 'Agent, team leader, listings specialist', 'Licensing exam (market-specific) + a brokerage to work under'],
    ['Property Management', 'Runs the asset after handover: collecting rent, managing tenants, coordinating repairs, for a fee.', 'Property manager, facilities coordinator', 'Property manager, leasing consultant', 'Operations / customer-service background'],
    ['Lending', 'Supplies the debt that makes almost every purchase and every development possible.', 'Mortgage advisor, bank relationship manager', 'Mortgage advisor, credit analyst', 'Finance / banking background'],
    ['Professional Services', 'Everyone else who makes a transaction legally sound and physically real.', 'Lawyer, valuer, interior designer, contractor', 'Valuer, real estate lawyer, interior designer', 'Specialist qualification in the relevant profession']
  ];
  function sixWheel() {
    const cx = 170, cy = 170, R = 118;
    const nodes = SIX.map((s, i) => {
      const a = -Math.PI / 2 + i * Math.PI / 3, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
      const words = s[0].split(' ');
      const lines = words.length > 1 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : [s[0]];
      return `<g><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="46" fill="${i % 2 ? '#B8925A' : '#0F2140'}"/>
        <text x="${x.toFixed(1)}" y="${(y - (lines.length - 1) * 6 + 4).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="${i % 2 ? '#0F2140' : '#fff'}">${lines.map((l, j) => `<tspan x="${x.toFixed(1)}" dy="${j ? 13 : 0}">${esc(l)}</tspan>`).join('')}</text></g>`;
    }).join('');
    return `<svg viewBox="0 0 340 340" style="width:100%;max-width:340px;margin:0 auto" role="img" aria-label="Six pillars of a real estate transaction">
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#D4B27C" stroke-width="2" stroke-dasharray="4 6"/>
      <circle cx="${cx}" cy="${cy}" r="54" fill="#F5F1E8" stroke="#E3DACA"/>
      <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="12" font-weight="700" fill="#1A1917">One</text>
      <text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="12" font-weight="700" fill="#1A1917">transaction</text>
      ${nodes}</svg>`;
  }

  LESSONS[7] = () => ({
    minutes: 55,
    quote: 'Find the six pillars first, then learn the local vocabulary layered on top.',
    note: 'Source document is titled “Module 1: The Real Estate Ecosystem (L1: Learn)” — mapped to M7 for the prototype.',
    sections: [
      sec('question', 'The real question this module answers', 'What real estate is, who makes it work, and why it behaves differently', `
        <p class="lead">Most people can point at a building and call it “real estate.” Very few can explain why real estate as an investment behaves nothing like a stock, why a national GDP figure moves when property transactions move, or how many professionals stand behind a single signed deal.</p>
        <div class="callout">By the end, you will be able to <b>name every stakeholder</b> in a transaction, <b>explain why real estate is its own asset class</b>, and <b>read GDP and growth data</b> across India, the UAE and Saudi Arabia like an analyst — not a spectator.</div>`),
      sec('what', '1 · In plain English', 'What is real estate?', `
        <p class="lead">Property that cannot be moved: land, plus anything permanently attached to it — buildings, roads, utilities, fixtures. Owning it gives you legal rights over the land, whatever is built on it, and the natural resources tied to it.</p>
        <div class="buckets">${[['land', 'Land', 'Undeveloped ground — the raw material developers buy, combine and rezone.'], ['house', 'Residential', 'Homes for people to live in: apartments, villas, townhouses.'], ['building', 'Commercial', 'Property businesses operate from: offices, malls, hotels, clinics.'], ['factory', 'Industrial', 'Built for making and moving things: factories, warehouses, logistics parks.']].map(b => `<div class="bucket">${icon(b[0], 'ic-lg')}<b>${b[1]}</b><small>${b[2]}</small></div>`).join('')}</div>`),
      sec('pillars', '2 · The ecosystem', 'Six pillars, one transaction', `
        <div class="wheel7">${sixWheel()}<div><p class="lead">Every property transaction — Mumbai, Dubai or Riyadh — passes through some combination of the same six professional pillars. The names on the business cards change by country; the six functions do not.</p>
          <div class="callout navy">The six pillars are six <b>stages the same property passes through</b>, from raw land (Development) to a rented-out, professionally managed asset (Property Management). Every career in real estate sits somewhere on this wheel.</div></div></div>
        <div class="tbl-wrap mt"><table class="tbl"><thead><tr><th>Pillar</th><th>What it actually does</th><th>Who you'd meet</th></tr></thead><tbody>${SIX.map(s => `<tr><td><b>${s[0]}</b></td><td>${s[1]}</td><td>${s[2]}</td></tr>`).join('')}</tbody></table></div>`),
      sec('countries', 'Student insight', 'One wheel, three countries', `
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Market</th><th>Regulator</th><th>Paperwork</th></tr></thead><tbody>
          <tr><td><b>India</b></td><td>RERA (state-level)</td><td>Sale / Purchase Agreements under the Transfer of Property Act</td></tr>
          <tr><td><b>UAE (Dubai)</b></td><td>Dubai RERA — an arm of the Dubai Land Department</td><td>SPA or MOU</td></tr>
          <tr><td><b>Saudi Arabia</b></td><td>Real Estate General Authority (REGA)</td><td>Ejar-style tenancy contracts introduced under Vision 2030 reforms</td></tr>
        </tbody></table></div>
        <div class="callout">The wheel is identical. The regulator's name, the paperwork's name and the language on the contract are the only things that change. <b>Find the six pillars first, then learn the local vocabulary layered on top.</b></div>`),
      sec('asset', '3 · An asset class of its own', 'How real estate differs from every other asset', `
        <div class="fact"><b>$393.3T</b><p>Global real estate is worth more than the world's stock markets, all bonds and debt, and every ounce of gold ever mined — combined. That is why banks, governments and pension funds treat real estate as core, not speculative, exposure.</p></div>
        <div class="tbl-wrap mt"><table class="tbl"><thead><tr><th>Dimension</th><th>Real estate</th><th>Stocks</th><th>Gold</th></tr></thead><tbody>
          ${[['Liquidity', 'Low — weeks to months to sell', 'High — sold in seconds', 'High — sold quickly'], ['Leverage available', 'High — mortgages of 60–80%+', 'Limited (margin trading)', 'Minimal'], ['Income while holding', 'Yes — rental yield', 'Sometimes — dividends', 'No'], ['Tangibility', 'Fully tangible; usable asset', 'Intangible ownership share', 'Tangible, non-productive'], ['Typical volatility', 'Low — moves slowly', 'High — daily price swings', 'Moderate — safe-haven swings'], ['Value-add by owner', 'Yes — renovation, rezoning, management', 'No — passive holding only', 'No']].map(r => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}
        </tbody></table></div>`),
      sec('gdp', '4 · Real estate and GDP', 'India, UAE & Saudi Arabia', `
        <p class="lead">In these three markets real estate is one of the government's chosen engines for growing the economy on purpose.</p>
        <div class="tbl-wrap mt-s"><table class="tbl"><thead><tr><th>Market</th><th>Current contribution</th><th>Near-term outlook</th></tr></thead><tbody>
          <tr><td><b>India</b></td><td>~7–8% of GDP (2024/25, MoHUA) ${evTag('v')}</td><td>Industry bodies projected 13% by 2025; government ambition of 18% by 2047 ${evTag('t')}</td></tr>
          <tr><td><b>UAE (Dubai)</b></td><td>8.2% of Dubai's GDP (first 9 months of 2025) ${evTag('v')}</td><td>Dubai Real Estate Sector Strategy 2033 targets doubling the sector's contribution and AED 1 trillion in market value ${evTag('t')}</td></tr>
          <tr><td><b>Saudi Arabia</b></td><td>~12% of GDP (2024 — roughly doubled since 2022) ${evTag('v')}</td><td>Vision 2030 Real Estate Sector Strategy targets continued growth; no single fixed % published yet ${evTag('a')}</td></tr>
        </tbody></table></div>
        <div class="callout navy"><b>Why the same country reports two GDP numbers:</b> a narrow figure counts only real estate services; a broader one adds construction, cement, steel and financing. Before quoting a number, always ask — <i>“contribution of what, exactly, and measured how?”</i></div>`),
      sec('drivers', '5 · What drives growth', 'Five forces under every price movement', `
        <div class="forces">${[['Population & urbanisation', 'More people, and more of them moving to cities.'], ['Income & affordability', 'Rising incomes move buyers from renting to owning.'], ['Policy & regulation', 'Foreign ownership, visas, escrow and tax switch buyer segments on or off.'], ['Infrastructure', 'A new metro line or airport reprices everything within reach.'], ['Capital & interest rates', 'Cheaper financing expands who can buy — tighter credit does the opposite.']].map((f, i) => `<div class="force ${i === 4 ? 'fin' : ''}"><b>${f[0]}</b><small>${f[1]}</small></div>`).join('')}</div>
        <p class="muted mt">Only one of the five — capital & interest rates — is primarily financial. The strongest analysts read population data and policy releases as closely as price indices.</p>`),
      sec('careers', '6 · Careers in real estate', 'Where you could fit', `
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Pillar</th><th>Example careers</th><th>Typical entry point</th></tr></thead><tbody>${SIX.map(s => `<tr><td><b>${s[0]}</b></td><td>${s[3]}</td><td>${s[4]}</td></tr>`).join('')}</tbody></table></div>
        <p class="muted mt">The Academy exists to compress the time it normally takes to become genuinely good at any one of these six pillars — with placement support from established brokerage partners once you're ready.</p>`),
      sec('assign', 'Synthesis & assignment', 'The full loop', `
        ${ul(['Real estate is land plus everything permanently attached to it — Land, Residential, Commercial, Industrial.', 'Every transaction passes through the same six pillars — only the regulator\'s name changes.', 'Real estate is the world\'s largest asset class ($393.3T) because it offers leverage, income and tangibility.', 'India, UAE and Saudi Arabia are growing real estate\'s GDP share as a policy choice.', 'Five forces explain almost every price movement you will be asked to analyse.'])}
        <div class="mt">${assignmentBox('m7',
          'Pick one of the six pillars. Interview or research one real professional in that role in your target market (India, UAE or Saudi Arabia) and write 200 words on how their day-to-day work matches — or differs from — this module.',
          'Using the GDP table, choose one market and write a 250-word note on whether its stated target is realistic, citing at least one growth force from Section 5.')}</div>`)
    ]
  });

  /* ---------- Module 16 — Market Health Diagnostic ---------- */
  const METRIC_DEEP = [
    ['Resale-to-Primary Ratio', 'The share of transactions that are investor-to-investor resales versus developer-to-end-user sales — whether demand is real (people who want to occupy) or synthetic (paper trading).', 'Below 40% resale is healthy. Above 60% means the market is running on flip momentum, not occupancy.', 'In Dubai\'s 2007–08 off-plan boom, units in some towers were resold three to four times before completion. When new buyers stopped entering in 2008, there was no end-user floor under those prices.'],
    ['Absorption Velocity vs Completion Pipeline', 'How many units actually sell per month compared with how many complete in the next 12–18 months.', 'Pipeline at roughly 1–1.2× monthly absorption is healthy. At 2× or more, oversupply is already locked in.', 'Chinese Tier-1 and Tier-2 cities kept launching mega-projects through the 2010s because earlier phases “sold out” — largely to investors, not families. The oversupply was visible in construction data years before prices cracked.'],
    ['Cash-to-Mortgage Transaction Ratio', 'The share of purchases made in cash versus with leverage. Leverage amplifies booms and collapses, because highly leveraged owners become forced sellers at the same time.', 'Above 55% cash is resilient. Below 30% cash means rate hikes or income shocks can destabilise the market quickly.', 'US 2006: subprime and low-documentation mortgages left buyers with almost no equity cushion — the foreclosure cascade took national prices down roughly 27%.'],
    ['Rental Yield Compression', 'Whether rents keep pace with capital values, or prices rise purely on appreciation expectations.', '5–7% gross yield is healthy — the asset earns its keep. Below 3.5% means buyers are betting purely on the next buyer.', 'Core Manhattan and Central London have stayed stable near 3% yields thanks to deep, wealthy end-user demand — the exception, not the rule.'],
    ['Secondary Market Days-on-Market Trend', 'How long resale listings take to sell, tracked quarter by quarter — the earliest leading indicator.', 'Stable or falling is healthy. Three or more consecutive quarters of rising days-on-market signals smart money is exiting.', 'Before Dubai\'s 2008 correction, secondary listings sat noticeably longer two to three quarters before the correction made headlines.']
  ];
  LESSONS[16] = () => ({
    minutes: 60,
    quote: 'Real estate does not crash because prices are high.',
    sections: [
      sec('principle', 'The core principle', 'Fundamentals-led or speculation-led?', `
        <p class="lead">Real estate crashes when buyers stop being end-users and become exit-dependent investors. Once a market depends on a continuous supply of new buyers rather than genuine occupancy, it has shifted from an asset class to a <b>liquidity chain</b> — and liquidity chains break.</p>
        <div class="formula-box"><b>Law of motion:</b> if price growth outpaces income growth + infrastructure growth, the system becomes speculative.<small>If speculation exceeds end-user absorption, volatility becomes inevitable.</small></div>`),
      sec('tool', 'Interactive tool', 'The Real Estate Market Health Diagnostic', `<p class="lead">Score any market on five metrics using public data. Move the sliders — the verdict updates live.</p><div class="mt">${diagHTML()}</div>`),
      sec('metrics', 'Deep dive', 'The five metrics explained', METRIC_DEEP.map((m, i) => `<details class="acc" ${i === 0 ? 'open' : ''}><summary>${i + 1}. ${m[0]}</summary><div class="acc-b"><p><b>What it measures:</b> ${m[1]}</p><p><b>How to read it:</b> ${m[2]}</p><p><b>Example:</b> ${m[3]}</p></div></details>`).join('')),
      sec('read', 'How to read the result', 'Three market states', `
        <div class="bands"><div class="band g"><span class="k">0–1 warning signals</span><b>Growth Market</b><small>Price follows GDP, jobs and population. Lower volatility, compounding returns. Safe to hold medium-to-long term.</small></div>
          <div class="band t"><span class="k">2–3 warning signals</span><b>Transitional Market</b><small>Fundamentals present but speculation building. Reduce leverage, shorten holding assumptions, watch the next two quarters.</small></div>
          <div class="band s"><span class="k">4–5 warning signals</span><b>Speculative Market</b><small>Price follows sentiment, not utility. High tail-risk of correction. Exit-plan discipline becomes essential.</small></div></div>`),
      sec('geo', 'The geopolitical overlay', 'Shocks compress time horizons', `
        <p class="lead">Geopolitical shocks rarely change fundamentals in the short term — they compress time horizons. A conflict headline turns a five-year holder into a “get liquid now” seller overnight.</p>
        <div class="callout">Transaction volume typically drops <b>2–3 quarters before price</b> during regional tension. Track velocity, not just price.</div>`),
      sec('dubai', 'Case reference', 'Why Dubai 2008 ≠ Dubai today', `
        <div class="compare"><div class="bad"><h5>2008</h5><p>High leverage, heavy investor-to-investor flipping, off-plan units traded multiple times pre-completion. Prices fell ~50% in some segments.</p></div>
          <div class="good"><h5>Today</h5><p>Materially higher cash-transaction share, broader end-user and long-term investor base, continued infrastructure and population inflow.</p></div></div>
        <div class="callout navy"><b>Key distinction:</b> Dubai's post-2009 recovery came from outgrowing speculation with real economic expansion — not from speculation resolving itself.</div>`),
      sec('use', 'How to use this tool', 'A trend tool, not a snapshot', `
        ${ul(['Score any market against the 5 metrics using public data (DLD, RERA, portal listings, developer disclosures).', 'Re-score quarterly.', 'Use it <b>before</b> committing capital — not after a deal has already excited you emotionally.'])}
        <div class="mt">${assignmentBox('m16', 'Choose one micro-market (e.g. Business Bay, Hinjewadi, North Riyadh). Score it on all five metrics with cited public sources and write a 300-word verdict.', 'In the live session, present your score in 2 minutes. The group challenges one metric; defend or revise it with evidence.')}</div>`)
    ]
  });

  /* ---------- Generic template for every other module ---------- */
  const SEGMENTS = ['Concept', 'Framework walkthrough', 'Case study', 'Real-world example', 'Assignment', 'Practical activity', 'Outcome check'];
  function genericLesson(m, c) {
    const st = mstatus(m.n);
    const doneCount = st === 'done' ? SEGMENTS.length : st === 'progress' ? Math.round(SEGMENTS.length * PROG[m.n] / 100) : 0;
    return {
      minutes: 45,
      sections: [
        sec('overview', 'Overview', `Inside ${c.framework.replace(/^The /, 'the ')}`, `
          <p class="lead">Module ${m.n} sits in <b>${esc(c.name)}</b> (Modules ${c.from}–${c.to}). Its proprietary tool is <b>${esc(m.tool)}</b>.</p>
          <div class="formula-box">${esc(c.formula)} = <b>${esc(c.result)}</b></div>
          <div class="callout">Every module decodes upward: <b>${esc(m.tool)}</b> → <b>${esc(c.framework)}</b> → <b>The ARISE Method</b>.</div>`),
        sec('segments', 'Lesson path', 'Seven segments', `
          <div class="seg-list">${SEGMENTS.map((s, i) => `<div class="seg-i"><span class="on-n ${i < doneCount ? 'ok' : ''}">${i < doneCount ? icon('check', 'ic-sm') : i + 1}</span><span>${s}</span>${i < doneCount ? '<span class="pill pill-green">Done</span>' : i === doneCount && st !== 'done' ? '<span class="pill pill-gold">Up next</span>' : '<span class="pill">Content to be loaded</span>'}</div>`).join('')}</div>
          <p class="note mt">Prototype: lesson content for this module will be loaded from the ARISEVERSE curriculum (Phase 1–2 content is complete; Phase 3–5 in build).</p>`),
        sec('aria', 'Practise with ARIA X', 'Make it real before the client is real', `
          <p class="lead">Every module ends with practice: ask ARIA X to explain the tool your way, or run a roleplay that applies it.</p>
          <div class="row-flex mt"><button class="btn btn-dark" data-action="aria-open" data-q="Explain ${esc(m.tool)} from Module ${m.n}">${icon('spark', 'ic-sm')} Ask ARIA X about ${esc(m.tool)}</button><a class="btn btn-line" href="#aria" data-aria-tab="roleplay">Open Roleplay Partner</a></div>`)
      ]
    };
  }

  /* =========================================================
     #module/N — lesson player
     ========================================================= */
  function pageModule(p) {
    const n = clamp(parseInt(p, 10) || 1, 1, 52);
    const m = D.moduleById(n), c = D.category(m.cat), pl = D.pillar(m.pillar);
    const st = mstatus(n);
    const L = st === 'locked' ? null : (LESSONS[n] ? LESSONS[n](m, c) : genericLesson(m, c));
    const pct = st === 'done' ? 100 : st === 'progress' ? PROG[n] : 0;
    const prev = n > 1 ? D.moduleById(n - 1) : null, next = n < 52 ? D.moduleById(n + 1) : null;

    const hero = `<section class="lesson-hero">
      ${photo(M.category[c.id], 'hero-bg', true)}<span class="hero-shade" aria-hidden="true"></span>
      <div class="eyebrow">Phase ${pl.phase} — ${pl.key}: ${pl.name.toUpperCase()} · Module ${n}</div>
      <h1>${esc(m.title)}</h1>
      <span class="tool-tag">Proprietary tool: ${esc(m.tool)}</span>
      ${L && L.quote ? `<blockquote>“${esc(L.quote)}”</blockquote><div class="rule"></div>` : ''}
      <div class="lesson-meta"><span class="pill gold">Level L1 · Learn</span><span class="pill">${esc(c.framework)}</span>${L ? `<span class="pill">${icon('clock', 'ic-sm')} ~${L.minutes} min</span>` : ''}<span class="pill">${st === 'done' ? 'Completed' : st === 'progress' ? 'In progress' : st === 'open' ? 'Available' : 'Locked'}</span></div>
      ${st !== 'locked' ? `<div class="lesson-progress"><div class="bar"><i style="width:${pct}%"></i></div><span>${pct}% complete</span></div>` : ''}
      ${L && L.note ? `<p class="note" style="color:#9AA6BC;margin-top:14px">${esc(L.note)}</p>` : ''}
    </section>`;

    const crumbs = `<div class="crumbs"><a href="#learning">My Learning</a><i>›</i><span style="color:${pl.color};font-weight:700">${pl.key} · ${pl.name}</span><i>›</i><span>${esc(c.framework)}</span><i>›</i><b style="color:var(--text)">Module ${n}</b></div>`;
    const nav = `<div class="lesson-nav">${prev ? `<a class="card" href="#module/${prev.n}"><small>← Previous</small><b>M${prev.n} · ${esc(prev.title)}</b></a>` : ''}${next ? `<a class="card next" href="#module/${next.n}"><small>Next →</small><b>M${next.n} · ${esc(next.title)}</b></a>` : ''}</div>`;

    if (!L) {
      const pre = D.moduleById(n - 1);
      const siblings = range(c.from, c.to).map(D.moduleById);
      return `${crumbs}${hero}
        <div class="card locked-card mt"><div class="lk">${icon('lock', 'ic-lg')}</div><h2 style="font-size:24px">This module is locked</h2>
          <p class="muted mt-s">Module ${n} unlocks when you complete <b>Module ${pre.n} — ${esc(pre.title)}</b>. The ARISE Method is sequenced so every tool builds on the one before it.</p>
          <div class="row-flex mt" style="justify-content:center"><a class="btn btn-dark" href="#module/${pre.n}">Go to Module ${pre.n}</a><a class="btn btn-line" href="#learning">Back to curriculum</a></div></div>
        <div class="card box mt"><div class="box-h"><div><h3>${esc(c.framework)} — preview</h3><div class="sub">${esc(c.formula)} = ${esc(c.result)}</div></div></div>
          <div class="rows">${siblings.map(s => `<div class="r"><div><b>Module ${s.n} · ${esc(s.title)}</b><small class="mt-tool">${esc(s.tool)}</small></div>${statusPill(s.n)}</div>`).join('')}</div></div>
        ${nav}`;
    }

    onMount(() => {
      const secs = $$('.sec');
      if (!('IntersectionObserver' in window) || !secs.length) return;
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) $$('.outline button').forEach(b => b.classList.toggle('on', b.dataset.target === e.target.id));
        });
      }, { rootMargin: '-35% 0px -55% 0px' });
      secs.forEach(s => io.observe(s));
      MOUNT_CLEANUP.push(() => io.disconnect());
    });

    return `${crumbs}${hero}
      <div class="lesson mt">
        <aside class="card outline"><h4>Lesson outline</h4>
          ${L.sections.map((s, i) => `<button data-action="scroll-to" data-target="${s.id}" class="${i === 0 ? 'on' : ''}"><span class="on-n ${st === 'done' ? 'ok' : ''}">${st === 'done' ? icon('check', 'ic-sm') : i + 1}</span><span>${s.t}</span></button>`).join('')}
          <div class="outline-foot"><button class="btn btn-dark btn-sm" style="width:100%" data-action="aria-open" data-q="Give me a 2-minute recap of Module ${n} — ${esc(m.tool)}">${icon('spark', 'ic-sm')} Ask ARIA X about this module</button></div>
        </aside>
        <div>
          <div class="card vid-card">
            <div class="box-h"><div><h3>${icon('video')} Lesson video</h3><div class="sub">Module ${n} · ${esc(m.tool)}</div></div><span class="pill">${icon('clock', 'ic-sm')} Part 1</span></div>
            ${player('lesson-diagram', `Lesson video for Module ${n}`)}
            <p class="note mt-s">Sample lesson video · stock footage</p>
          </div>
          ${L.sections.map(s => `<section class="card sec" id="${s.id}">${s.html}</section>`).join('')}
          <div class="card box mt row-flex" style="justify-content:space-between">
            <div><b>${st === 'done' ? 'You completed this module.' : 'Finished the lesson?'}</b><div class="note">${st === 'done' ? 'Revisit any tool at any time — your work is saved.' : 'Mark it complete to unlock the next module.'}</div></div>
            ${st === 'done' ? `<span class="pill pill-green">${icon('check', 'ic-sm')} Completed</span>` : `<button class="btn btn-gold" data-action="toast" data-msg="Module ${n} marked complete (prototype — progress is sample data)">Mark complete</button>`}
          </div>
          ${nav}
        </div>
      </div>`;
  }
  const MOUNT_CLEANUP = [];

  /* =========================================================
     #aria — ARIA X Learning Hub
     ========================================================= */
  let ariaTab = 0;
  const ARIA_TABS = { teacher: 0, roleplay: 1, planner: 2, calc: 3 };

  /* Roleplay scenarios — each option scores Discovery (d), Empathy (e), Objection handling (o), Closing (c) on 0–3 */
  const SCEN = [
    { id: 'pune', tag: 'India · Residential', title: 'First-time buyer · Pune', who: 'Riya, 29', face: 'Riya', img: 'site-visit', role: 'IT professional, budget around ₹70L, nervous about her first purchase.',
      turns: [
        { say: 'Hi, I saw your listing for the 2BHK in Hinjewadi. Honestly, I\'m just looking — I\'m not sure I can afford to buy yet.', opts: [
          ['No problem! This unit is ₹68L and it\'s going fast — shall I block it for you today?', { d: 0, e: 1, o: 0, c: 1 }, 'bad', 'Closing before discovery. Use The Discovery Compass (M31) before you present anything.'],
          ['That\'s completely fine — most first-time buyers feel that way. What\'s prompting you to look now, and what monthly amount would feel comfortable?', { d: 3, e: 3, o: 0, c: 0 }, 'good', 'Strong discovery with empathy — you named the feeling, then asked about motive and budget.'],
          ['Affordability is easy — banks give 90% loans these days.', { d: 0, e: 1, o: 0, c: 0 }, 'bad', 'Oversimplifying finance erodes trust. See The Trust Ledger (M12).']] },
        { say: 'My rent is ₹28,000 a month, so I\'d want the EMI close to that. But everyone says prices will fall next year.', opts: [
          ['Prices never fall in Pune — don\'t worry about that.', { d: 0, e: 0, o: 1, c: 0 }, 'bad', 'Over-promising on price direction. Never guarantee the market.'],
          ['Let\'s use numbers. A ₹28,000 EMI over 20 years at around 8.5% supports a loan of roughly ₹32 lakh — with your down payment, that sets a clear range. On prices, nobody can promise direction, but I can show you supply and absorption data for this micro-market so you decide on evidence.', { d: 1, e: 2, o: 3, c: 0 }, 'good', 'The Objection Judo in action: acknowledge, reframe with evidence, hand the decision back to the client.'],
          ['If you wait, you might miss out — waiting is usually a mistake.', { d: 0, e: 0, o: 1, c: 1 }, 'mid', 'Fear-based urgency. It may work once; it doesn\'t build referrals.']] },
        { say: 'Okay, that actually helps. What would the next step be?', opts: [
          ['Let\'s sign the booking form today and pay the token.', { d: 0, e: 0, o: 0, c: 1 }, 'mid', 'Too big a step for a nervous first-time buyer. Close on the next step, not the whole deal.'],
          ['Let\'s book two site visits on Saturday — this unit and one ready-to-move option — and I\'ll send a full cost sheet with registration and stamp duty, so there are no surprises.', { d: 1, e: 2, o: 0, c: 3 }, 'good', 'The Commitment Seal: a specific next step, a date, and transparency on total cost.'],
          ['Think about it and call me whenever you\'re ready.', { d: 0, e: 1, o: 0, c: 0 }, 'bad', 'No next step = no deal. Always leave with a date.']] }
      ] },
    { id: 'dubai', tag: 'UAE · Off-plan', title: 'Off-plan investor · Dubai', who: 'Imran, 45', face: 'Imran', img: 'dubai-marina-day', role: 'Investor weighing an off-plan 1-bedroom in Business Bay.',
      turns: [
        { say: 'Why should I buy off-plan when I could buy a ready unit and rent it out immediately?', opts: [
          ['Off-plan is always better — prices go up before handover.', { d: 0, e: 0, o: 1, c: 0 }, 'bad', '“Always” is a red flag. Present trade-offs, not slogans.'],
          ['It depends on your goal. Off-plan gives a lower entry price and a staged payment plan; ready gives rental income from day one. Are you optimising for capital growth or cash flow?', { d: 3, e: 2, o: 2, c: 0 }, 'good', 'The Risk-Reward Ledger (M21): frame both sides, then let the client\'s goal decide.'],
          ['Ready units are overpriced right now.', { d: 0, e: 0, o: 1, c: 0 }, 'bad', 'An unsupported claim. Bring comparables or don\'t say it.']] },
        { say: 'Capital growth, mainly. But I remember 2008 — people lost a lot on off-plan flips.', opts: [
          ['That won\'t happen again.', { d: 0, e: 0, o: 0, c: 0 }, 'bad', 'Dismissing a valid fear loses credibility instantly.'],
          ['That\'s a fair concern. Today\'s market is structurally different — a materially higher cash share and a broader end-user base — but I\'d still check the developer\'s delivery record and the escrow arrangement, and we can score the area on the five Market Health metrics together.', { d: 1, e: 3, o: 3, c: 0 }, 'good', 'Excellent: validated the fear, used the Market Health Diagnostic and The Developer Scorecard (M24).'],
          ['Let\'s not talk about the past — let\'s focus on this launch.', { d: 0, e: 0, o: 0, c: 1 }, 'bad', 'Avoiding the objection leaves it alive in the client\'s mind.']] },
        { say: 'If the numbers work, I\'d consider two units. What do you need from me?', opts: [
          ['Just transfer the booking amount now and I\'ll handle the rest.', { d: 0, e: 0, o: 0, c: 1 }, 'mid', 'Rushing money before analysis is a trust risk for you and the client.'],
          ['I\'ll prepare a side-by-side: payment plan, handover date, comparable resale and rental data, and the developer scorecard. If it holds up, we reserve on Thursday.', { d: 1, e: 1, o: 1, c: 3 }, 'good', 'Analysis-led close with a dated commitment — The Commitment Seal.'],
          ['Two units? I can get you a discount if you sign today.', { d: 0, e: 0, o: 0, c: 2 }, 'mid', 'Discount-led pressure. Use The Value Anchor (M36) instead.']] }
      ] },
    { id: 'mumbai', tag: 'India · Listing', title: 'Seller wanting above-market price · Mumbai', who: 'Mr. Desai, 60', face: 'Mr. Desai', img: 'listings', role: 'Selling a renovated 3BHK in Andheri West. Comparables suggest ₹2.7–2.8 Cr.',
      turns: [
        { say: 'My neighbour sold for ₹3.1 Cr last year, and mine is renovated. I want ₹3.2 Cr — no less.', opts: [
          ['Sure, we\'ll list at ₹3.2 Cr.', { d: 0, e: 1, o: 0, c: 1 }, 'bad', 'Winning the listing with a price you can\'t defend costs you the seller\'s trust later.'],
          ['Your renovation definitely adds value. Before we set a price, may I walk you through the last six months of registered sales in your building and the two next to it?', { d: 3, e: 3, o: 1, c: 0 }, 'good', 'Acknowledge, then anchor in evidence — The Value Anchor (M36).'],
          ['₹3.2 Cr is unrealistic — the market is ₹2.7 Cr.', { d: 0, e: 0, o: 1, c: 0 }, 'mid', 'Right data, wrong delivery. Lead with empathy.']] },
        { say: 'Those numbers are lower than I expected. Are you saying my flat isn\'t worth it?', opts: [
          ['Buyers decide what it\'s worth, not us.', { d: 0, e: 0, o: 1, c: 0 }, 'bad', 'Technically true, emotionally cold.'],
          ['Your flat is one of the better units here. The data shows where buyers are transacting today. Listed close to the evidence — say ₹2.95 Cr — we attract serious buyers and room for competition. At ₹3.2 Cr it may sit, and listings that sit tend to sell lower.', { d: 1, e: 3, o: 3, c: 1 }, 'good', 'The Objection Judo: you redirected his pride into a strategy he can own.'],
          ['Fine, let\'s try ₹3.2 Cr for a month and see.', { d: 0, e: 1, o: 0, c: 1 }, 'mid', 'Avoiding the conversation now makes it harder in 30 days.']] },
        { say: 'Let me think. My son also wants to be involved in the decision.', opts: [
          ['No problem — call me when you\'ve decided.', { d: 0, e: 1, o: 0, c: 0 }, 'bad', 'You lost control of the next step.'],
          ['Of course. Shall we set up a 30-minute call with both of you on Sunday? I\'ll bring the comparables and a 60-day marketing plan so you can decide together.', { d: 2, e: 2, o: 0, c: 3 }, 'good', 'You brought the decision-maker in and secured a dated next step.'],
          ['We should lock this in before other agents approach you.', { d: 0, e: 0, o: 0, c: 1 }, 'mid', 'Scarcity pressure on a seller rarely works — and it\'s noticed.']] }
      ] },
    { id: 'nri', tag: 'Cross-border · NRI', title: 'NRI investor · Riyadh → Dubai or India', who: 'Anil, 38', face: 'Anil', img: 'riyadh-city', role: 'Engineer working in Riyadh, choosing between Pune and Dubai for an investment property.',
      turns: [
        { say: 'I work in Riyadh. Should I invest back home in India or in Dubai? Everyone gives me different advice.', opts: [
          ['Dubai, definitely — no tax!', { d: 0, e: 0, o: 1, c: 0 }, 'bad', 'A one-line answer to a life decision. Discover first.'],
          ['Both can work — it depends on your goals. Do you plan to live in either city, how important is rental income versus growth, and how comfortable are you managing a property remotely?', { d: 3, e: 3, o: 0, c: 0 }, 'good', 'The Discovery Compass: goals, timeline, involvement — before any recommendation.'],
          ['India is always safer for Indians.', { d: 0, e: 1, o: 0, c: 0 }, 'bad', 'Bias, not advice. Investment-grade advisors stay neutral.']] },
        { say: 'Rental income matters. I can\'t manage tenants from Riyadh.', opts: [
          ['Tenants are easy, don\'t worry about it.', { d: 0, e: 0, o: 0, c: 0 }, 'bad', 'Dismissing a real constraint.'],
          ['Then let\'s compare net yield after service charges and management fees — not headline yield — and include a property manager from day one. I\'ll run both cities in the ARIA X yield calculator.', { d: 1, e: 2, o: 3, c: 1 }, 'good', 'Net-yield thinking and a practical solution to his real constraint.'],
          ['Just buy first and figure out management later.', { d: 0, e: 0, o: 0, c: 1 }, 'bad', 'Pushing the problem downstream creates an unhappy client.']] },
        { say: 'Okay. Can you send me something I can review with my wife?', opts: [
          ['Sure, I\'ll send a brochure.', { d: 0, e: 1, o: 0, c: 1 }, 'mid', 'A brochure isn\'t advice. Send analysis.'],
          ['I\'ll send a one-page comparison — net yield, total purchase cost, financing and repatriation notes, and management cost — and book a video call this Friday evening, Riyadh time, with both of you.', { d: 1, e: 2, o: 1, c: 3 }, 'good', 'Includes the co-decision-maker and a dated next step.'],
          ['Sure, let me know what you decide.', { d: 0, e: 1, o: 0, c: 0 }, 'bad', 'No next step.']] }
      ] }
  ];
  const DIMS = [['d', 'Discovery', 'Open with The Discovery Compass (M31): ask about goal, timeline, budget and decision-makers before presenting anything.'], ['e', 'Empathy', 'The Client Lens (M25): name the feeling before you answer the fact.'], ['o', 'Objection handling', 'The Objection Judo (M33): acknowledge → ask → reframe with evidence → confirm.'], ['c', 'Closing', 'The Commitment Seal (M37): always close on a specific next step with a date.']];
  const RP = { scen: null, turn: 0, picks: [], fb: null };

  function rpHTML() {
    if (!RP.scen) {
      return `<p class="muted" style="margin-bottom:16px">Pick a client. ARIA X plays them; you choose how to respond. You'll get a scorecard across four selling skills.</p>
        <div class="scen">${SCEN.map(s => `<button class="scen-c" data-action="rp-start" data-id="${s.id}">${photo(s.img, 'scen-img')}<span class="scen-b"><span class="pill pill-gold">${s.tag}</span><b>${s.title}</b><span class="scen-who">${face(s.face, 'sm')}<small>${s.who} — ${s.role}</small></span></span></button>`).join('')}</div>
        <p class="note mt">Roleplay clients are fictional · stock portraits.</p>`;
    }
    const s = RP.scen;
    if (RP.turn >= s.turns.length) {
      const score = {}; const max = {};
      DIMS.forEach(([k]) => {
        score[k] = RP.picks.reduce((a, p, i) => a + s.turns[i].opts[p][1][k], 0);
        max[k] = s.turns.reduce((a, t) => a + Math.max(...t.opts.map(o => o[1][k])), 0);
      });
      const pct = k => max[k] ? Math.round(score[k] / max[k] * 100) : 100;
      const overall = Math.round(DIMS.reduce((a, [k]) => a + pct(k), 0) / DIMS.length);
      const tips = DIMS.filter(([k]) => pct(k) < 70);
      S.set('rp-last', { title: s.title, overall });
      return `<div class="rp">
        <div class="card box"><div class="box-h"><div><h3>Session scorecard</h3><div class="sub">${s.title} · ${s.who}</div></div>${ring(overall, 92, 8, overall >= 75 ? 'var(--green)' : overall >= 50 ? 'var(--gold)' : 'var(--red)', overall + '%', 'overall')}</div>
          <div class="score-bars">${DIMS.map(([k, name]) => `<div class="sb"><small><span>${name}</span><span>${pct(k)}%</span></small><div class="bar"><i style="width:${pct(k)}%;background:${pct(k) >= 70 ? 'var(--green)' : pct(k) >= 40 ? 'var(--gold)' : 'var(--red)'}"></i></div></div>`).join('')}</div>
          <div class="row-flex mt"><button class="btn btn-dark btn-sm" data-action="rp-restart">${icon('refresh', 'ic-sm')} Try again</button><button class="btn btn-line btn-sm" data-action="rp-menu">Choose another client</button></div></div>
        <div class="card box"><div class="box-h"><h3>ARIA X coaching</h3></div>
          ${tips.length ? `<div class="rows">${tips.map(([, name, tip]) => `<div class="r"><div><b>${name}</b><small>${tip}</small></div></div>`).join('')}</div>` : '<p class="muted">Excellent session — every skill scored 70% or higher. Try a harder client next.</p>'}
          <p class="note mt">Sessions logged: 1 of 3 this week toward your study plan.</p></div>
      </div>`;
    }
    const t = s.turns[RP.turn];
    return `<div class="rp">
      <div>
        <div class="rp-steps">${s.turns.map((_, i) => `<i class="${i <= RP.turn ? 'on' : ''}"></i>`).join('')}</div>
        <div class="rp-client">${face(s.face)}<div style="flex:1"><small class="faint">${s.who} · ${s.title}</small><div class="rp-bubble mt-s">“${esc(t.say)}”</div></div></div>
        ${RP.fb ? `<div class="rp-fb ${RP.fb[0]}"><b>${RP.fb[0] === 'good' ? 'Strong response.' : RP.fb[0] === 'mid' ? 'Partly there.' : 'Missed opportunity.'}</b> ${esc(RP.fb[1])}</div>
          <button class="btn btn-dark mt" data-action="rp-next">${RP.turn === s.turns.length - 1 ? 'See scorecard' : 'Continue'} ${icon('arrow', 'ic-sm')}</button>`
          : `<div class="rp-opts">${t.opts.map((o, i) => `<button class="rp-opt" data-action="rp-pick" data-i="${i}"><span class="k">${'ABC'[i]}</span><span>${esc(o[0])}</span></button>`).join('')}</div>`}
      </div>
      <div class="card box"><div class="box-h"><h3>Client brief</h3><span class="pill pill-gold">${s.tag}</span></div>
        <p><b>${s.who}</b> — ${esc(s.role)}</p>
        <p class="note mt">Scored on: Discovery · Empathy · Objection handling · Closing. Turn ${RP.turn + 1} of ${s.turns.length}.</p>
        <button class="link mt" data-action="rp-menu">${icon('arrowL', 'ic-sm')} Change client</button></div>
    </div>`;
  }
  function rpRefresh() { const el = $('#rp-root'); if (el) el.innerHTML = rpHTML(); }

  /* Daily planner */
  function plannerHTML() {
    const p = S.get('planner', { mits: ['Finish Module 19 — Residential Real Estate', 'Score Business Bay on the Market Health Diagnostic', '3 off-plan investor roleplays'], calls: 24, checks: {} });
    const goal = 60;
    return `<div class="grid c2">
      <div class="card box"><div class="box-h"><div><h3>Today's 3 most important tasks</h3><div class="sub">From Module 2 · The North Star Blueprint</div></div></div>
        ${[0, 1, 2].map(i => `<div class="field" style="margin-top:${i ? 10 : 0}px"><label>Task ${i + 1}</label><input class="input" data-input="planner" data-k="mit" data-i="${i}" value="${esc(p.mits[i] || '')}"></div>`).join('')}
        <div class="callout mt" style="font-size:13px">Your annual goal: <b>${esc((S.get('cascade', CASCADE_AGENT))[2] || 'Close 30 property transactions')}</b> — edit it in <a class="link" href="#module/2">Module 2</a>.</div></div>
      <div class="card box"><div class="box-h"><div><h3>Prospecting calls</h3><div class="sub">Target: ${goal} calls a day</div></div></div>
        <div class="calls"><div class="calls-ring">${ring(Math.min(100, Math.round(p.calls / goal * 100)), 120, 11, 'var(--gold)', p.calls, 'of ' + goal)}</div>
          <div class="stack"><div class="row-flex"><button class="btn btn-dark btn-sm" data-action="calls" data-d="1">+1 call</button><button class="btn btn-line btn-sm" data-action="calls" data-d="5">+5</button><button class="btn btn-ghost btn-sm" data-action="calls" data-d="0">Reset</button></div>
            <p class="note">Rahul went from 10 to 60 calls a day when his belief changed. Log every call — ARIA X tracks your streak.</p></div></div></div>
    </div>
    <div class="card box mt"><div class="box-h"><h3>Daily success routine</h3><span class="pill">Modules 1 & 2</span></div>
      ${routineHTML('planner-routine', ['Read your Identity Statement', 'Read your purpose & vision', 'Identify the 3 most important tasks', 'Visualise success for 5 minutes', 'Exercise (30 min)'], ['Review completed tasks', 'Record lessons learned', 'Plan tomorrow', 'Express gratitude'])}</div>`;
  }

  /* Investment calculator */
  const CALC = { cur: 'AED', tab: 0 };
  const CALC_DEF = {
    AED: { price: 1500000, rent: 105000, costs: 18000, down: 20, rate: 4.5, years: 25, buyCost: 6, sale: 1850000, hold: 4, rentTotal: 300000 },
    INR: { price: 8500000, rent: 264000, costs: 36000, down: 20, rate: 8.5, years: 20, buyCost: 7, sale: 10500000, hold: 5, rentTotal: 900000 }
  };
  let calcVals = JSON.parse(JSON.stringify(CALC_DEF));
  function money(v) {
    if (!isFinite(v)) return '—';
    return CALC.cur === 'INR' ? '₹' + Math.round(v).toLocaleString('en-IN') : 'AED ' + Math.round(v).toLocaleString('en-US');
  }
  function calcField(k, label, suffix) {
    return `<div class="field"><label>${label}${suffix ? ` <span class="faint">(${suffix})</span>` : ''}</label><input class="input" type="number" inputmode="decimal" data-input="calc" data-k="${k}" value="${calcVals[CALC.cur][k]}"></div>`;
  }
  function calcOut() {
    const v = calcVals[CALC.cur];
    if (CALC.tab === 0) {
      const gross = v.rent / v.price * 100, net = (v.rent - v.costs) / v.price * 100;
      const msg = gross >= 5 ? 'Healthy band (5–7% gross) on the Market Health Diagnostic — the asset earns its keep.' : gross >= 3.5 ? 'Between bands — fine for growth-led strategies, but show the client the trade-off.' : 'Below 3.5% gross — the return relies on appreciation. Present it as a growth play, not an income play.';
      return `<small>Gross rental yield</small><div class="main-n">${gross.toFixed(2)}%</div>
        <div class="kv"><span>Net yield (after costs)</span><b>${net.toFixed(2)}%</b></div><div class="kv"><span>Net annual income</span><b>${money(v.rent - v.costs)}</b></div><div class="kv"><span>Monthly rent</span><b>${money(v.rent / 12)}</b></div>
        <div class="verdict-s">${msg}</div>`;
    }
    if (CALC.tab === 1) {
      const loan = v.price * (1 - v.down / 100), r = v.rate / 1200, n = v.years * 12;
      const emi = r ? loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : loan / n;
      return `<small>Monthly instalment (EMI)</small><div class="main-n">${money(emi)}</div>
        <div class="kv"><span>Loan amount</span><b>${money(loan)}</b></div><div class="kv"><span>Down payment</span><b>${money(v.price - loan)}</b></div><div class="kv"><span>Total interest</span><b>${money(emi * n - loan)}</b></div><div class="kv"><span>Total repaid</span><b>${money(emi * n)}</b></div>
        <div class="verdict-s">EMI = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1). Excludes insurance and fees.</div>`;
    }
    const invested = v.price * (1 + v.buyCost / 100), back = v.sale + v.rentTotal, profit = back - invested;
    const roi = profit / invested * 100, ann = v.hold > 0 ? (Math.pow(back / invested, 1 / v.hold) - 1) * 100 : 0;
    return `<small>Total return on investment</small><div class="main-n">${roi.toFixed(1)}%</div>
      <div class="kv"><span>Annualised</span><b>${isFinite(ann) ? ann.toFixed(1) + '% / yr' : '—'}</b></div><div class="kv"><span>Total invested (incl. costs)</span><b>${money(invested)}</b></div><div class="kv"><span>Net profit</span><b>${money(profit)}</b></div>
      <div class="verdict-s">Unleveraged, before tax. Purchase costs cover registration / DLD fees, stamp duty and agency fees.</div>`;
  }
  function calcHTML() {
    const tabs = ['Rental Yield', 'Mortgage EMI', 'ROI'];
    const fields = [
      [calcField('price', 'Property price', CALC.cur), calcField('rent', 'Annual rent', CALC.cur), calcField('costs', 'Annual costs — service charge, maintenance, management', CALC.cur)],
      [calcField('price', 'Property price', CALC.cur), calcField('down', 'Down payment', '%'), calcField('rate', 'Interest rate', '% p.a.'), calcField('years', 'Tenure', 'years')],
      [calcField('price', 'Purchase price', CALC.cur), calcField('buyCost', 'Purchase costs', '%'), calcField('sale', 'Expected sale price', CALC.cur), calcField('hold', 'Holding period', 'years'), calcField('rentTotal', 'Net rent received over the period', CALC.cur)]
    ][CALC.tab];
    return `<div class="spread" style="margin-bottom:16px;flex-wrap:wrap">
        <div class="seg">${tabs.map((t, i) => `<button class="${CALC.tab === i ? 'on' : ''}" data-action="calc-tab" data-i="${i}">${t}</button>`).join('')}</div>
        <div class="seg">${['AED', 'INR'].map(c => `<button class="${CALC.cur === c ? 'on' : ''}" data-action="calc-cur" data-c="${c}">${c === 'AED' ? 'AED · UAE' : '₹ INR · India'}</button>`).join('')}</div></div>
      <div class="calc"><div>${fields.join('')}<button class="link mt" data-action="calc-reset">${icon('refresh', 'ic-sm')} Reset to example</button></div><div class="calc-out" id="calc-out">${calcOut()}</div></div>`;
  }
  function calcRefresh() { const el = $('#calc-root'); if (el) el.innerHTML = calcHTML(); }

  function pageAria() {
    const panels = [
      `<div class="grid c-21"><div>${chatHTML('teacher', true)}</div>
        <div class="card box"><div class="box-h"><h3>Ask about your modules</h3></div>
          <div class="rows">${[['M21 · The Risk-Reward Ledger', 'Off-plan vs ready — what do I tell an investor?'], ['M10 · The Compliance Shield', 'RERA in India vs Dubai'], ['M33 · The Objection Judo', 'How do I handle "too expensive"?'], ['M16 · Market Health', 'Is a market speculative?'], ['Saudi Arabia', 'What is happening with Vision 2030?']].map(x => `<div class="r"><div><b>${x[0]}</b><small>${x[1]}</small></div><button class="link" data-action="chat-ask" data-chat-target="teacher" data-q="${esc(x[1])}">Ask ${icon('arrow', 'ic-sm')}</button></div>`).join('')}</div></div></div>`,
      `<div id="rp-root">${rpHTML()}</div>`,
      plannerHTML(),
      `<div class="card box"><div class="box-h"><div><h3>Investment Calculator</h3><div class="sub">Use it live in client conversations — ROI, mortgage and rental yield</div></div></div><div id="calc-root">${calcHTML()}</div></div>`
    ];
    return `
      <section class="aria-hero">
        <div><div class="eyebrow">${icon('spark', 'ic-sm')} ARIA X · AI mentor</div>
          <h1>Not a chatbot. A companion across every phase.</h1>
          <p>ARIA X teaches each module your way, plays your toughest clients, keeps you accountable to your daily plan, and runs the numbers with you — before your first real client.</p>
          <div class="feat-grid">${D.ariaLive.map(f => `<div class="feat"><b>${f.name}</b><small>${esc(f.line)}</small></div>`).join('')}</div></div>
        <div class="orb" aria-hidden="true"></div>
      </section>
      <div class="card box mt" data-tabs="aria">
        <div class="tabs" role="tablist">${['AI Teacher', 'Roleplay Partner', 'Daily Planner', 'Investment Calculator'].map((t, i) => `<button class="tab ${i === ariaTab ? 'on' : ''}" data-action="tab" data-i="${i}" data-remember="aria">${t}</button>`).join('')}</div>
        ${panels.map((p, i) => `<div class="tpanel ${i === ariaTab ? 'on' : ''}" data-i="${i}">${p}</div>`).join('')}
      </div>
      <div class="mt-l"><div class="spread" style="margin-bottom:14px"><div><div class="eyebrow">Roadmap</div><h2 style="font-size:24px;margin-top:6px">Coming to ARIA X in 2027</h2></div><span class="pill">Sequenced to platform growth</span></div>
        <div class="road">${D.ariaRoadmap.map(r => `<div class="road-c"><span class="pill">Coming 2027</span><b>${r.name}</b><small>${esc(r.line)}</small></div>`).join('')}</div></div>`;
  }

  /* =========================================================
     #market — Market Intelligence
     ========================================================= */
  function pageMarket() {
    const card = (flag, name, img, rows, foot) => `<div class="card city"><div class="city-img">${photo(img, '', true)}<span class="shade"></span><div class="city-t"><div class="eyebrow">${flag}</div><h3>${name}</h3></div></div>
      <div class="city-b"><div class="rows">${rows.map(r => `<div class="r"><div><b style="font-size:20px;font-family:var(--serif)">${r[0]}</b><small>${r[1]}</small></div>${evTag(r[2])}</div>`).join('')}</div>${foot ? `<p class="note mt">${foot}</p>` : ''}</div></div>`;
    return `
      <div class="ph"><div><div class="eyebrow">Research · Market Intelligence</div><h1 class="mt-s">Market Intelligence</h1><p>India, UAE and Saudi Arabia — with every figure labelled Validated, Target or Assumption, the same evidence standard as our research reports.</p></div>
        <div class="ph-actions"><a class="btn btn-line" href="index.html#research">Free Market Health tool on our website</a></div></div>
      <div class="grid c3">
        ${card('India', 'The fastest-growing major market', M.market.India, [['1,05,712', 'RERA-registered agents, 2025 (from 27,073 in 2018)', 'v'], ['+19%', 'YoY growth in registrations, 2025', 'v'], ['~7–8%', 'Real estate share of GDP (2024/25, MoHUA)', 'v'], ['~10 lakh', 'Estimated total brokers, incl. unregistered', 'a']], 'Government ambition: 18% of GDP by 2047 (target).')}
        ${card('UAE · Dubai', 'The most dynamic cross-border market', M.market.UAE, [['AED 917B', 'Transaction value 2025, +20% YoY (270,000+ deals)', 'v'], ['23,536', 'Registered brokers (Q4 2024)', 'v'], ['94.9%', 'of 6,784 brokerage firms have 1–10 agents', 'v'], ['8.2%', 'of Dubai GDP, first 9 months of 2025', 'v']], 'Sources: Dubai Land Department; Dubai Pulse; Dubai Dept. of Economy & Tourism.')}
        ${card('Saudi Arabia', 'Vision 2030 — the new frontier', M.market['Saudi Arabia'], [['~12%', 'Real estate share of GDP, 2024 (roughly doubled since 2022)', 'v'], ['1M', 'New housing units targeted under Vision 2030', 't'], ['$500B', 'NEOM / The Line — international luxury specialists', 't']], 'Entry timing for ARISEVERSE graduates is a planning assumption.')}
      </div>
      <div class="card box mt"><div class="box-h"><div><h3>Saudi Arabia — Vision 2030 projects</h3><div class="sub">Per public developer announcements</div></div>${evTag('a')}</div>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Project</th><th>Scale</th><th>Agent demand</th><th>Timeline</th></tr></thead><tbody>
          ${[['NEOM / The Line', '$500B megacity', 'International luxury specialists', '2025–2035'], ['Diriyah Gate', '$63B heritage city', 'Cultural & boutique real estate', '2024–2030'], ['Red Sea Project', '$25B tourism resort', 'Luxury resort property sales', '2024–2030'], ['Riyadh Urban Expansion', 'Major city growth', 'Residential & commercial', 'Ongoing'], ['Vision 2030 Housing', '1M new units targeted', 'All levels of agents', '2025–2030']].map(r => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}
        </tbody></table></div></div>
      <div class="grid c-12 mt">
        <div class="card box">${tabsHTML('mnews', ['India', 'Dubai', 'Global'], [newsList('india'), newsList('dubai'), newsList('global')])}<p class="note mt-s">Sample headlines — the ARIA X News Engine is on the 2027 roadmap.</p></div>
        <div class="card box"><div class="box-h"><div><h3>Market Health Diagnostic</h3><div class="sub">Is a market fundamentals-led or speculation-led — before it corrects? From Module 16.</div></div><a class="link" href="#module/16">Open lesson ${icon('arrow', 'ic-sm')}</a></div>${diagHTML()}</div>
      </div>`;
  }

  /* =========================================================
     #live — Live classes
     ========================================================= */
  // [day, date, title, host, role, times, tag, isNext, cover image]
  const CLASSES = [
    ['Sat', 24, 'Investment Opportunities in Dubai — 2026 Outlook', 'Sameer Khan', 'Guest expert (sample)', '7:00 PM GST · 8:30 PM IST', 'Root · Market Knowledge', true, 'dubai-marina-night'],
    ['Mon', 26, 'Workshop: Residential Real Estate — The Home Matrix', 'Praveen P. Singh', 'Founding trainer', '6:30 PM GST · 8:00 PM IST', 'M19 · Products & Projects', false, 'residential-towers'],
    ['Wed', 28, 'Live-Fire Simulator: Mock Meetings & Role Plays', 'Praveen P. Singh', 'with ARIA X', '7:00 PM GST · 8:30 PM IST', 'M48 · Practical Training', false, 'mentoring'],
    ['Fri', 30, 'Payment Plans & Structures — The Payment Architect', 'Praveen P. Singh', 'Founding trainer', '5:00 PM GST · 6:30 PM IST', 'M23 · Products & Projects', false, 'signing'],
    ['Sat', 31, 'Saudi Vision 2030: Where the Demand Is', 'Khalid Al Mansoori', 'Guest expert (sample)', '11:00 AM GST · 12:30 PM IST', 'Root · Global Markets', false, 'riyadh-kingdom']
  ];
  function calendarHTML() {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const startOffset = 3; // 1 Oct 2026 is a Thursday
    const has = new Set([2, 5, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 30, 31]);
    let cells = days.map(d => `<div class="dh">${d}</div>`).join('') + '<div></div>'.repeat(startOffset);
    for (let d = 1; d <= 31; d++) cells += `<div class="d ${d === 23 ? 'today' : d < 23 ? 'past' : ''} ${has.has(d) ? 'has' : ''}">${d}</div>`;
    return `<div class="cal">${cells}</div>`;
  }
  function pageLive() {
    // Recordings play short stock clips as placeholders for the real session videos
    const recs = [[1, 'Orientation · The Mirror Method', '58 min', 'trainer-room'], [7, 'The Big Picture Map — six pillars', '64 min', 'lesson-diagram'], [13, 'The Dubai Radar', '71 min', 'dubai-timelapse'], [16, 'The Trendline Tracker · Market Health', '66 min', 'mumbai-street'], [38, 'The AI Edge Map', '52 min', 'presenter-mic'], [47, 'Cold Call Rep Drill — live reps', '80 min', 'office-team']];
    return `
      <div class="ph"><div><div class="eyebrow">Live classes</div><h1 class="mt-s">Live Classes</h1><p>Live-taught by the founding trainer, with guest sessions from industry practitioners. Times shown in Gulf Standard Time and India Standard Time.</p></div>
        <div class="ph-actions"><span class="pill pill-green">${KPI.live} attended · 94% attendance</span></div></div>
      <div class="grid c-21">
        <div class="card box"><div class="box-h"><h3>Upcoming</h3><span class="sub">Week of 24 October 2026</span></div>
          ${CLASSES.map(c => `<div class="class-row"><div class="date-b ${c[7] ? 'live' : ''}"><small>${c[0]}</small><b>${c[1]}</b></div>
            <div class="class-thumb">${photo(c[8], '')}</div>
            <div><b style="display:block;font-size:14.5px">${c[2]}</b><div class="class-host">${face(c[3], 'xs' + (c[3] === 'Praveen P. Singh' ? ' dark' : ''))}<small class="faint">${c[3]} · ${c[4]} · ${c[5]}</small></div><div class="mt-s"><span class="pill">${c[6]}</span>${c[7] ? ' <span class="pill pill-gold">Tomorrow</span>' : ''}</div></div>
            <div class="row-flex">${c[7] ? `<button class="btn btn-dark btn-sm" data-action="toast" data-msg="Join link opens 15 minutes before class">Join</button>` : ''}<button class="btn btn-line btn-sm" data-action="toast" data-msg="Reminder set — we'll notify you 30 minutes before" >Remind me</button></div></div>`).join('')}
        </div>
        <div class="stack">
          <div class="card box"><div class="box-h"><h3>October 2026</h3></div>${calendarHTML()}</div>
          <div class="card box"><div class="box-h"><h3>Your trainer</h3></div>
            <div class="person"><span class="avatar lg dark">PS</span><div><b>Praveen P. Singh</b><small>Founder & CEO, ARISEVERSE · Founding trainer, Cohort 1</small></div></div>
            <p class="muted mt" style="font-size:13.5px">20 years in the industry, Dubai-based. Delivers all live-taught content for Cohort 1.</p></div>
        </div>
      </div>
      <div class="mt-l"><div class="spread" style="margin-bottom:14px"><h2 style="font-size:24px">Recordings library</h2><span class="sub faint">Every session, on demand — lifetime access</span></div>
        <div class="grid c3 swipe">${recs.map(r => `<div class="rec"><button class="media" data-action="video" data-v="${r[3]}" data-t="M${r[0]} · ${esc(r[1])}" aria-label="Play recording: ${esc(r[1])}">${poster(r[3], r[1], 'cover')}<span class="shade"></span><span class="pill pill-dark">M${r[0]}</span><span class="play">${icon('play')}</span></button>
          <div class="rec-b"><b>${r[1]}</b><small>${r[2]} · Live class recording</small></div></div>`).join('')}</div>
        <p class="note mt-s">Prototype: recordings open short stock-footage clips in place of the real sessions.</p></div>`;
  }

  /* =========================================================
     #assignments
     ========================================================= */
  const ASSIGN = [
    ['M1', 'Mirror Method one-pager — Life Wheel, Identity Statement, 5 beliefs', 'Graded', 'A · 92', 'Strong identity statement. Make belief #4 more specific — attach a number to it.'],
    ['M2', 'North Star goal cascade — annual goal to daily actions', 'Graded', 'A− · 88', 'Clear cascade. Your weekly level needs a review ritual.'],
    ['M7', 'Interview a professional in one pillar (200 words)', 'Graded', 'B+ · 84', 'Good choice of a property manager. Compare more directly with the module description.'],
    ['M7', 'GDP target note — is it realistic? (250 words)', 'Graded', 'A · 90', 'Excellent use of the “contribution of what?” question.'],
    ['M13', 'The Dubai Radar — community profile', 'Graded', 'A− · 87', 'Add DLD transaction data next time.'],
    ['M47', 'Cold Call Rep Drill — log of 20 recorded calls', 'Submitted', 'Awaiting', 'Trainer feedback due Monday.'],
    ['M16', 'Market Health scoring of a micro-market', 'Due', 'Due in 3 days', ''],
    ['M19', 'The Home Matrix — match three client briefs to residential product types', 'Due', 'Due in 5 days', '']
  ];
  function pageAssignments() {
    const pill = s => s === 'Graded' ? 'pill-green' : s === 'Submitted' ? 'pill-gold' : 'pill-red';
    return `
      <div class="ph"><div><div class="eyebrow">Coursework</div><h1 class="mt-s">Assignments</h1><p>Every module ends with submitted work and a live practical. Trainers grade against a shared rubric.</p></div></div>
      <div class="grid c4">${[['Submitted', KPI.assignments], ['Average grade', '87%'], ['Due this week', 2], ['On-time rate', '96%']].map(k => `<div class="card kpi"><small>${k[0]}</small><b>${k[1]}</b></div>`).join('')}</div>
      <div class="card box mt"><div class="box-h"><h3>Recent & upcoming</h3><span class="sub">Click a row to open it</span></div>
        <div class="tbl-wrap"><table class="tbl hover"><thead><tr><th>Module</th><th>Assignment</th><th>Status</th><th>Grade</th></tr></thead><tbody>
          ${ASSIGN.map((a, i) => `<tr data-action="assign-open" data-i="${i}"><td><span class="pill pill-dark">${a[0]}</span></td><td><b>${a[1]}</b>${a[4] ? `<div class="note">${a[4]}</div>` : ''}</td><td><span class="pill ${pill(a[2])}">${a[2]}</span></td><td style="white-space:nowrap">${a[3]}</td></tr>`).join('')}
        </tbody></table></div></div>`;
  }
  function openAssignment(i) {
    const a = ASSIGN[i];
    const graded = a[2] === 'Graded';
    openDrawer(icon('edit') + ' ' + a[0] + ' assignment', `<div class="drawer-pad">
      <h3 style="font-size:20px">${a[1]}</h3>
      <div class="row-flex mt-s"><span class="pill ${graded ? 'pill-green' : a[2] === 'Submitted' ? 'pill-gold' : 'pill-red'}">${a[2]}</span><span class="pill">${a[3]}</span></div>
      <h4 style="margin-top:20px;font-size:15px">Rubric</h4>
      <div class="rows mt-s">${[['Accuracy & evidence', '30%'], ['Application of the module tool', '30%'], ['Clarity & structure', '20%'], ['Reflection & next action', '20%']].map(r => `<div class="r"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div>
      ${graded ? `<div class="callout mt"><b>Trainer feedback:</b> ${a[4]}</div>` : a[2] === 'Submitted' ? `<div class="submitted mt">${icon('check')} Submitted · ${a[4]}</div>` : `
        <div class="field mt"><label for="as-text">Your answer</label><textarea class="textarea" id="as-text" rows="7" placeholder="Write or paste your answer…"></textarea></div>
        <button class="btn btn-line btn-sm mt-s" data-action="toast" data-msg="File picker opens here (prototype)">${icon('upload', 'ic-sm')} Attach file</button>
        <button class="btn btn-dark mt" style="width:100%" data-action="assign-submit" data-i="${i}">Submit assignment</button>`}
    </div>`);
  }

  /* =========================================================
     #assessments
     ========================================================= */
  function pageAssessments() {
    const st = student();
    const B = ['Emotional intelligence', 'Learning agility', 'Coachability', 'Mental resilience', 'Under pressure', 'Persistence after rejection', 'Ethical judgement', 'Growth mindset'];
    const now = [74, 84, 88, 70, 66, 72, 90, 85], base = [62, 78, 80, 58, 52, 55, 86, 74];
    const quizzes = [...range(1, 18), ...range(38, 47)].map(n => [n, D.moduleById(n).tool, 78 + ((n * 37) % 21)]);
    return `
      <div class="ph"><div><div class="eyebrow">Assessments</div><h1 class="mt-s">Assessments</h1><p>A behavioural profile that grows with you, plus module quizzes and pillar assessments.</p></div></div>
      <div class="grid c-21">
        <div class="card box"><div class="box-h"><div><h3>Behavioural profile</h3><div class="sub">What a 20-minute interview can't measure</div></div><span class="pill pill-gold">${esc(st.archetype.name)}</span></div>
          ${radar(B, [{ values: base, stroke: '#B5AEA2', fill: 'rgba(181,174,162,.12)' }, { values: now, stroke: 'var(--gold)', fill: 'rgba(184,146,90,.22)' }], 100, 300)}
          <div class="legend mt-s"><span><i style="background:#B5AEA2"></i>Week 1 baseline</span><span><i style="background:var(--gold)"></i>Now · Week 7</span></div>
          <p class="note mt">Used to personalise learning and ARIA X coaching — not to predict success with certainty.</p></div>
        <div class="stack">
          <div class="card box"><div class="box-h"><h3>Up next</h3></div>
            <div class="rows"><div class="r"><div><b>ROOT pillar assessment — Products & Projects</b><small>M19–M24 · unlocks after Module 24</small></div><span class="pill">${icon('lock', 'ic-sm')} Locked</span></div>
              <div class="r"><div><b>Module 19 quiz — The Home Matrix</b><small>10 questions · 12 min</small></div><button class="btn btn-dark btn-sm" data-action="toast" data-msg="Quiz opens after you finish Module 19">Start</button></div>
              <div class="r"><div><b>Behavioural check-in · Week 8</b><small>Re-take to update your profile</small></div><button class="btn btn-line btn-sm" data-action="toast" data-msg="Check-in scheduled for Monday">Schedule</button></div></div></div>
          <div class="card box"><div class="box-h"><h3>Pillar assessments passed</h3></div>
            <div class="rows"><div class="r"><div><b>A · Awaken</b><small>Identity Reset · 6 modules</small></div><span class="pill pill-green">91%</span></div>
              <div class="r"><div><b>S · AI & Technology</b><small>ARIA Advantage · 4 modules</small></div><span class="pill pill-green">88%</span></div></div></div>
        </div>
      </div>
      <div class="card box mt"><div class="box-h"><h3>Module quizzes</h3><span class="sub">${quizzes.length} completed · average ${Math.round(quizzes.reduce((a, q) => a + q[2], 0) / quizzes.length)}%</span></div>
        <div class="grid c4">${quizzes.map(q => `<div class="spread" style="padding:10px 12px;border:1px solid var(--line);border-radius:10px"><div><b style="font-size:13px">M${q[0]}</b><div class="mt-tool" style="font-size:12px">${esc(q[1])}</div></div><b style="color:${q[2] >= 90 ? 'var(--green)' : 'var(--text)'}">${q[2]}%</b></div>`).join('')}</div></div>`;
  }

  /* =========================================================
     #careers — Career & Placement
     ========================================================= */
  const JOBS = [
    ['Property Consultant', 'Luxury brokerage · Dubai Marina', 'Dubai, UAE', 'AED 8K–15K + commission', 'UAE', 'dubai-marina-night'],
    ['Sales Executive', 'Off-plan developer sales · Business Bay', 'Dubai, UAE', 'AED 6K–12K + commission', 'UAE', 'dubai-marina-day'],
    ['Off-plan Sales Advisor', 'Developer sales team · Business Bay', 'Dubai, UAE', 'AED 7K–12K + commission', 'UAE', 'dubai-interchange'],
    ['Relationship Manager', 'Residential brokerage · Mumbai', 'Mumbai, India', '₹4L–7L PA + incentives', 'India', 'mumbai-sealink'],
    ['Leasing Consultant', 'Residential leasing · North Riyadh', 'Riyadh, KSA', 'SAR 6K–9K + commission', 'Saudi', 'riyadh-city']
  ];
  let jobFilter = 'All';
  function jobsHTML() {
    const applied = S.get('applied', {});
    return JOBS.filter(j => jobFilter === 'All' || j[4] === jobFilter).map(j => {
      const key = j[0] + j[1];
      return `<div class="job"><span class="lg">${photo(j[5], '')}</span><div><b>${j[0]}</b><small>${j[1]} · ${j[3]}</small><div class="mt-s"><span class="pill pill-green">Matches your profile</span></div></div>
        ${applied[key] ? `<span class="pill pill-gold">${icon('check', 'ic-sm')} Applied</span>` : `<button class="btn btn-dark btn-sm" data-action="job-apply" data-key="${esc(key)}">Apply</button>`}</div>`;
    }).join('') || '<p class="muted">No roles in this market right now.</p>';
  }
  function pageCareers() {
    const steps = [['Profile', 'Complete', 'ok'], ['CV', 'Reviewed', 'ok'], ['Mock interviews', 'M51', 'cur'], ['Employer matching', '', ''], ['Offer', '', ''], ['First 60 days', 'M52', '']];
    return `
      <div class="ph"><div><div class="eyebrow">Ariseverse Careers</div><h1 class="mt-s">Career & Placement</h1><p>The LAUNCHPAD Framework — Interview Readiness + First 60-Day Execution = Career Launch. Founder-led matching with 30+ employer partners for Cohort 1.</p></div>
        <div class="ph-actions"><button class="btn btn-dark" data-action="toast" data-msg="Mock interview booked · Tue 27 Oct, 6:00 PM GST">${icon('cal', 'ic-sm')} Book a mock interview</button></div></div>
      <div class="grid c-12">
        <div class="card box" style="text-align:center"><div class="box-h"><h3>Placement readiness</h3></div>${ring(72, 150, 13, 'var(--green)', '72%', 'ready')}
          <div class="rows mt" style="text-align:left">${[['Modules completed', '28 / 52'], ['Roleplay average', '78%'], ['Mock interviews', '0 / 2'], ['Profile strength', 'Strong']].map(r => `<div class="r"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div></div>
        <div class="card box"><div class="box-h"><div><h3>The LAUNCHPAD journey</h3><div class="sub">Status: Active · ${esc(student().track)}</div></div></div>
          <div class="steps-h">${steps.map((s, i) => `<div class="st ${s[2]}"><span class="dot">${s[2] === 'ok' ? icon('check', 'ic-sm') : i + 1}</span><b>${s[0]}</b><small>${s[1]}</small></div>`).join('')}</div>
          <div class="callout mt"><b>Next:</b> Complete two mock interviews (Module 51 · The Interview-Ready Protocol) to unlock employer matching.</div>
          <h4 style="margin:20px 0 10px;font-size:15px">Application tracker</h4>
          <div class="pipe">${[['Applied', [['Property Consultant', 'Luxury brokerage · Dubai Marina']]], ['Shortlisted', [['Sales Executive', 'Off-plan sales · Business Bay']]], ['Interview', []], ['Offer', []]].map(c => `<div class="pipe-col"><h5>${c[0]}<span>${c[1].length}</span></h5>${c[1].map(x => `<div class="pipe-card"><b>${x[0]}</b><small>${x[1]}</small></div>`).join('')}</div>`).join('')}</div>
        </div>
      </div>
      <div class="grid c2 mt">
        <div class="card feature">${photo('interview', 'fc-img')}<div class="fc-b"><div class="eyebrow">Module 51 · The Interview-Ready Protocol</div><h3>Mock interviews before the real ones</h3><p class="muted">Two scored mock interviews unlock employer matching. Rehearse with ARIA X, then book a live session with your trainer.</p><button class="btn btn-dark btn-sm" data-action="toast" data-msg="Mock interview booked · Tue 27 Oct, 6:00 PM GST">${icon('cal', 'ic-sm')} Book a mock interview</button></div></div>
        <div class="card feature">${photo('keys', 'fc-img')}<div class="fc-b"><div class="eyebrow">Module 52 · The 60-Day Launch Sequence</div><h3>Your first 60 days, planned before day one</h3><p class="muted">Week-by-week targets for prospecting, viewings and a first closed deal, reviewed with the Placement Cell.</p><a class="btn btn-line btn-sm" href="#module/52">Preview Module 52</a></div></div>
      </div>
      <div class="card box mt"><div class="box-h"><div><h3>Job board</h3><div class="sub">Roles from employer partners · sample listings</div></div>
        <div class="seg">${['All', 'UAE', 'India', 'Saudi'].map(f => `<button class="${jobFilter === f ? 'on' : ''}" data-action="job-filter" data-f="${f}">${f}</button>`).join('')}</div></div>
        <div id="jobs">${jobsHTML()}</div>
        <p class="note mt">30+ brokerage partnerships secured through the founder's 20-year network. Employer names are shown to learners once partner agreements allow.</p></div>`;
  }

  /* =========================================================
     #experts, #community, #progress, #account
     ========================================================= */
  function pageExperts() {
    const ex = [['dubai-interchange', 'Sameer Khan', 'Investment advisor · Dubai', 'Investment Opportunities in Dubai — 2026 Outlook', 'Sat 24 Oct · 7:00 PM GST'], ['riyadh-kingdom', 'Khalid Al Mansoori', 'Vision 2030 projects · Riyadh', 'Saudi Vision 2030: Where the Demand Is', 'Sat 31 Oct · 11:00 AM GST'], ['house-model', 'Meera Nair', 'Mortgage & lending · Mumbai', 'Financing for first-time buyers and NRIs', 'Thu 5 Nov · 7:30 PM IST'], ['apartment-luxury', 'Dana Haddad', 'Luxury brokerage · Dubai', 'Selling above AED 10M: the luxury client', 'Sat 7 Nov · 6:00 PM GST'], ['analytics', 'Karan Bhatia', 'PropTech & AI', 'AI tools that top agents actually use', 'Wed 11 Nov · 7:00 PM GST'], ['dubai-sunset', 'Praveen P. Singh', 'Founder & CEO · Founding trainer', 'Founder Q&A — Cohort 1', 'Mon 16 Nov · 7:00 PM GST']];
    return `
      <div class="ph"><div><div class="eyebrow">ARISEVERSE Media</div><h1 class="mt-s">Industry Experts</h1><p>Guest sessions and fireside chats with practitioners across India, the UAE and Saudi Arabia. Ask a question in advance — the best ones open the session.</p></div></div>
      <div class="grid c3 swipe">${ex.map(e => `<div class="card expert"><div class="ex-cover">${photo(e[0], '')}<span class="shade"></span><span class="pill pill-dark">${icon('cal', 'ic-sm')} ${e[4]}</span></div>
        <div class="ex-b">${face(e[1], 'lg ring' + (e[1] === 'Praveen P. Singh' ? ' dark' : ''))}<b>${e[1]}</b><small>${e[2]}</small>
        <p>${e[3]}</p>
        <div class="row-flex mt"><button class="btn btn-dark btn-sm" data-action="toast" data-msg="Seat reserved — added to your calendar">Reserve seat</button><button class="btn btn-line btn-sm" data-action="toast" data-msg="Question sent to the host">Ask a question</button></div></div></div>`).join('')}</div>
      <p class="note mt">Sample guest line-up for the prototype — guest names, portraits (stock) and sessions are placeholders.</p>`;
  }

  function pageCommunity() {
    const liked = S.get('likes', {});
    // [author, meta, text, likes, replies, attached image]
    const posts = [['Simran Kaur', 'Cohort 1 · Dubai track · 2 hrs ago', 'Did 60 calls today for the first time. Identity Statement on a sticky note on my laptop — it works. Thanks @Rohan for the Objection Judo tip on “I\'ll think about it.”', 42, 9], ['Rohan Mehta', 'Cohort 1 · India track · 5 hrs ago', 'Scored Hinjewadi on the Market Health Diagnostic: 1 warning (yield). Growth market but income-weak. Anyone scored Baner?', 31, 14, 'analytics'], ['Neha Sharma', 'Placed · Luxury brokerage, Dubai Marina · 8 hrs ago', 'Hosted my first solo viewing today. Ran the Site Walk Protocol (M49) checklist start to finish — the client asked for a second visit with her husband.', 57, 12, 'apartment-luxury'], ['Praveen P. Singh', 'Trainer · Yesterday', 'Reminder: the best advisors are investment-grade, not order-takers. Bring one live client question to Monday\'s workshop.', 88, 21]];
    return `
      <div class="ph"><div><div class="eyebrow">Community</div><h1 class="mt-s">Community</h1><p>Your cohort, your track and — after graduation — the alumni network (Phase 5 · Lifetime Growth).</p></div></div>
      <div class="grid c-21">
        <div>
          <div class="card box"><div class="row-flex" style="flex-wrap:nowrap"><span class="avatar">${esc(student().initials)}</span><input class="input" placeholder="Share a win, a question or a market insight…" aria-label="New post"><button class="btn btn-dark btn-sm" data-action="toast" data-msg="Posted to Cohort 1 (prototype)">Post</button></div></div>
          ${posts.map((p, i) => `<div class="card post mt"><div class="post-h">${face(p[0], p[0] === 'Praveen P. Singh' ? 'dark' : '')}<div><b>${p[0]}</b><small>${p[1]}</small></div></div><p>${esc(p[2])}</p>
            ${p[5] ? `<div class="post-img">${photo(p[5], '')}</div>` : ''}
            <div class="post-f"><button class="${liked[i] ? 'on' : ''}" data-action="like" data-i="${i}">${icon('heart', 'ic-sm')} ${p[3] + (liked[i] ? 1 : 0)}</button><button data-action="toast" data-msg="Replies open in the thread (prototype)">${icon('chat', 'ic-sm')} ${p[4]} replies</button></div></div>`).join('')}
        </div>
        <div class="stack">
          <div class="card box"><div class="box-h"><h3>Your groups</h3></div><div class="rows">${[['Cohort 1 · All', '100 members', 'lecture-hall'], ['Dubai track', '40 members', 'dubai-marina-day'], ['India track', '60 members', 'mumbai-skyline'], ['Saudi Arabia interest group', '18 members', 'riyadh-kingdom']].map(g => thumbRow(g[0], g[1], g[2], icon('arrow', 'ic-sm'))).join('')}</div></div>
          <div class="card box"><div class="box-h"><h3>Alumni network</h3><span class="pill">Phase 5</span></div><p class="muted" style="font-size:13.5px">After graduation you keep ARIA X, market intelligence and this community for life — plus advanced programmes and mentoring the next cohort.</p></div>
          <div class="card box"><div class="box-h"><h3>Study group</h3></div><div class="person">${face('Simran Kaur')}<p style="font-size:13.5px"><b>Sunday, 8:00 PM GST</b><br><span class="muted">Module 19 recap · hosted by Simran Kaur</span></p></div><button class="btn btn-line btn-sm mt" data-action="toast" data-msg="You're in — see you Sunday">Join</button></div>
        </div>
      </div>
      <p class="note mt">Sample posts and stock portraits for the prototype. Cohort sizes reflect Cohort 1 enrolment targets (60 India, 40 UAE).</p>`;
  }

  function pageProgress() {
    const lw = S.get('lifewheel', LW_DEFAULT);
    const nowLw = lw.map((v, i) => clamp(v + [1, 2, 1, 2, 2, 1, 1, 1][i], 1, 10));
    const certs = [['Awaken Pillar', 'Identity Reset · M1–6', true], ['Real Estate Foundation', 'BEDROCK · M7–12', true], ['ARIA Advantage', 'AI & Technology · M38–41', true], ['360° Market Lens', 'M13–18 · pending assessment', false], ['Project DNA', 'M19–24', false], ['ARISEVERSE-Certified Professional', 'All 5 pillars', false]];
    const heat = Array.from({ length: 42 }, (_, i) => i > 38 ? 0 : [0, 1, 2, 3, 4, 2, 3, 1, 4, 3][(i * 7) % 10]);
    return `
      <div class="ph"><div><div class="eyebrow">My Progress</div><h1 class="mt-s">My Ascent</h1><p>AWAKEN + ROOT + INFLUENCE + SYSTEMIZE + ELEVATE = the ARISEVERSE-Certified Professional.</p></div></div>
      <div class="grid c-12">
        <div class="card box" style="text-align:center"><div class="box-h"><h3>Overall Ascent</h3></div>${ring(KPI.ascent, 160, 14, 'var(--gold)', KPI.ascent + '%', 'Ascent')}
          <div class="rows mt" style="text-align:left">${[['Modules', '40%', '54%'], ['Assignments', '20%', '87%'], ['Live attendance', '15%', '94%'], ['Assessments', '15%', '86%'], ['Practice reps', '10%', '62%']].map(r => `<div class="r"><div><b>${r[0]}</b><small>weight ${r[1]}</small></div><b>${r[2]}</b></div>`).join('')}</div>
          <p class="note mt">Ascent weighting is a prototype assumption for discussion.</p></div>
        <div class="card box"><div class="box-h"><h3>Pillar progress</h3><a class="link" href="#learning">Curriculum ${icon('arrow', 'ic-sm')}</a></div>
          ${D.pillars.map(p => { const v = pillarProgress(p.key); return `<div style="margin-bottom:16px"><div class="spread"><span><b style="font-family:var(--serif);font-size:20px;color:${p.color}">${p.key}</b> <b>${p.name}</b> <span class="faint" style="font-size:12.5px">· ${esc(p.line)}</span></span><b>${v}%</b></div><div class="bar mt-s" style="height:8px"><i style="width:${v}%;background:${p.color}"></i></div></div>`; }).join('')}
          <div class="grid c2 mt">
            <div><h4 style="font-size:15px;margin-bottom:6px">Life Wheel — baseline vs now</h4>${radar(LW_AREAS, [{ values: lw, stroke: '#B5AEA2', fill: 'rgba(181,174,162,.12)' }, { values: nowLw, stroke: 'var(--navy)', fill: 'rgba(15,33,64,.14)' }], 10, 260)}
              <div class="legend"><span><i style="background:#B5AEA2"></i>Week 1 · ${lwScore(lw).avg}</span><span><i style="background:var(--navy)"></i>Week 7 · ${lwScore(nowLw).avg}</span></div></div>
            <div><h4 style="font-size:15px;margin-bottom:10px">${icon('flame', 'ic-sm')} 12-day learning streak</h4><div class="heat">${heat.map(h => `<i class="${h ? 'l' + h : ''}"></i>`).join('')}</div><p class="note mt-s">Last 6 weeks of activity.</p>
              <div class="callout mt" style="font-size:13px">You're <b>3 modules</b> away from completing the ROOT pillar.</div></div>
          </div></div>
      </div>
      <div class="mt-l"><h2 style="font-size:24px;margin-bottom:14px">Certificates · ${KPI.certs} earned</h2>
        <div class="grid c3">${certs.map(c => `<div class="cert ${c[2] ? 'earned' : ''}">${c[2] ? photo('certificate', 'cert-bg') : ''}${icon(c[2] ? 'award' : 'lock', 'ic-lg')}<b>${c[0]}</b><small>${c[1]}</small>${c[2] ? `<button class="link mt" style="color:var(--gold-2)" data-action="toast" data-msg="Certificate PDF downloads here (prototype)">Download ${icon('arrow', 'ic-sm')}</button>` : ''}</div>`).join('')}</div></div>`;
  }

  function pageSettings() {
    const st = student();
    const n = S.get('notify', { classes: true, assign: true, aria: true, jobs: true, wa: false });
    const tg = (k, label, sub) => `<div class="r"><div><b>${label}</b><small>${sub}</small></div><button class="toggle ${n[k] ? 'on' : ''}" data-action="notify" data-k="${k}" aria-label="${label}" aria-pressed="${n[k] ? 'true' : 'false'}"></button></div>`;
    return `
      <div class="ph"><div><div class="eyebrow">Account</div><h1 class="mt-s">Settings</h1></div></div>
      <div class="grid c2">
        <div class="card box"><div class="box-h"><h3>Profile</h3></div>
          <div class="person"><span class="avatar lg">${esc(st.initials)}</span><div><b>${esc(st.name)}</b><small>Cohort 1 · ${esc(st.track)} · ${esc(st.persona)}</small></div></div>
          <div class="grid c2 mt"><div class="field"><label>Full name</label><input class="input" value="${esc(st.name)}" readonly></div><div class="field"><label>Email</label><input class="input" value="${esc(st.email)}" readonly></div>
            <div class="field"><label>Phone</label><input class="input" value="${esc(st.phone)}" readonly></div><div class="field"><label>Market track</label><input class="input" value="${esc(st.market)}" readonly></div></div>
          <p class="note mt">Profile details come from your application on the website.</p></div>
        <div class="card box"><div class="box-h"><h3>Notifications</h3></div>
          <div class="rows">${tg('classes', 'Live class reminders', '30 minutes before each session')}${tg('assign', 'Assignment deadlines', '48 hours and 24 hours before')}${tg('aria', 'ARIA X daily nudges', 'Morning routine and call targets')}${tg('jobs', 'New matching roles', 'From the Placement Cell')}${tg('wa', 'WhatsApp updates', 'Class links and announcements')}</div></div>
      </div>
      <div class="card box mt"><div class="box-h"><div><h3>Prototype controls</h3><div class="sub">For the client walkthrough</div></div></div>
        <div class="row-flex"><button class="btn btn-dark" data-action="reset-demo">${icon('refresh', 'ic-sm')} Reset demo</button><a class="btn btn-line" href="index.html">${icon('arrowL', 'ic-sm')} Back to website</a><button class="btn btn-ghost" data-action="logout">${icon('logout', 'ic-sm')} Sign out</button></div>
        <p class="note mt">Reset demo clears the applicant profile and everything saved in this browser (Life Wheel, beliefs, planner…) and returns to sign-in.</p></div>`;
  }

  /* =========================================================
     Router
     ========================================================= */
  const ROUTES = {
    login: pageLogin, welcome: pageWelcome, dashboard: pageDashboard, learning: pageLearning, module: pageModule,
    live: pageLive, assignments: pageAssignments, assessments: pageAssessments, aria: pageAria, market: pageMarket,
    experts: pageExperts, careers: pageCareers, community: pageCommunity, progress: pageProgress, account: pageSettings
  };
  const TITLES = { login: 'Sign in', welcome: 'Welcome', dashboard: 'Dashboard', learning: 'My Learning', module: 'Module', live: 'Live Classes', assignments: 'Assignments', assessments: 'Assessments', aria: 'ARIA X Learning Hub', market: 'Market Intelligence', experts: 'Industry Experts', careers: 'Career & Placement', community: 'Community', progress: 'My Progress', account: 'Settings' };
  let current = { r: 'login' };

  function parse() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    const [r, p] = h.split('/');
    return ROUTES[r] ? { r, p } : null;
  }
  function closePops() { $$('.pop.open').forEach(p => p.classList.remove('open')); }

  function paint(keepScroll) {
    const { r, p } = current;
    MOUNT_CLEANUP.splice(0).forEach(f => f());
    const isAuth = r === 'login';
    $('#auth').hidden = !isAuth;
    $('#app').hidden = isAuth;
    if (isAuth) {
      $('#auth').innerHTML = pageLogin();
    } else {
      const y = window.scrollY;
      if (!keepScroll) renderShell();
      $('#view').innerHTML = ROUTES[r](p);
      const navKey = NAV_FOR[r] || r;
      $$('.nav-a').forEach(a => a.classList.toggle('active', a.dataset.nav === navKey));
      if (keepScroll) window.scrollTo({ top: y, behavior: 'instant' });
    }
    const m = r === 'module' ? D.moduleById(clamp(parseInt(p, 10) || 1, 1, 52)) : null;
    document.title = (m ? `M${m.n} · ${m.title}` : TITLES[r]) + ' · ARISEVERSE Learning Portal';
    MOUNT.splice(0).forEach(f => f());
    $$('.diag').forEach(d => diagUpdate(d, false));
    // Decorative background videos: play muted, or hold on the poster frame for reduced motion
    const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    $$('video.bg-video').forEach(v => { if (still) { v.removeAttribute('autoplay'); v.pause(); } else { v.muted = true; v.play().catch(() => {}); } });
  }
  function render() {
    let route = parse();
    if (!route) { history.replaceState(null, '', '#login'); route = { r: 'login' }; }
    current = route;
    closeDrawer(); closePops();
    document.body.classList.remove('nav-open');
    paint(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  const refreshView = () => paint(true);

  /* =========================================================
     Actions (event delegation)
     ========================================================= */
  function resetDemo() {
    try { Object.keys(localStorage).filter(k => k.indexOf('av:') === 0).forEach(k => localStorage.removeItem(k)); } catch (e) { /* storage unavailable */ }
    Object.keys(CHATS).forEach(k => delete CHATS[k]);
    Object.assign(RP, { scen: null, turn: 0, picks: [], fb: null });
    Object.assign(LEARN, { filter: 'all', pillar: null, q: '' });
    calcVals = JSON.parse(JSON.stringify(CALC_DEF));
    ariaTab = 0; jobFilter = 'All';
    location.hash = '#login';
    toast('Demo reset — sign in to start again', 'refresh');
  }

  const ACTIONS = {
    'nav-open': () => document.body.classList.add('nav-open'),
    'nav-close': () => document.body.classList.remove('nav-open'),
    'pop': el => {
      const p = $('#pop-' + el.dataset.pop);
      const open = p.classList.contains('open');
      closePops();
      if (!open) p.classList.add('open');
    },
    'aria-open': el => openAria(el.dataset.q),
    'drawer-close': () => closeDrawer(),
    'video': el => playVideo(el.dataset.v, el.dataset.t, el.dataset.note),
    'toast': el => toast(el.dataset.msg),
    'login': () => { location.hash = '#dashboard'; },
    'logout': () => { location.hash = '#login'; toast('Signed out', 'logout'); },
    'reset-demo': () => resetDemo(),
    'tab': el => {
      const root = el.closest('[data-tabs]');
      const i = el.dataset.i;
      $$(':scope > .tabs > .tab', root).forEach(t => t.classList.toggle('on', t.dataset.i === i));
      $$(':scope > .tpanel', root).forEach(t => t.classList.toggle('on', t.dataset.i === i));
      if (el.dataset.remember === 'aria') ariaTab = Number(i);
    },
    'chat-ask': el => {
      const root = el.dataset.chatTarget ? $(`.chat[data-chat="${el.dataset.chatTarget}"]`) : el.closest('.chat');
      if (root) chatSend(root, el.dataset.q);
    },
    'scroll-to': el => {
      const s = document.getElementById(el.dataset.target);
      if (!s) return;
      s.scrollIntoView({ behavior: 'smooth', block: 'start' });
      $$('.outline button').forEach(b => b.classList.toggle('on', b === el));
    },
    'learn-filter': el => { LEARN.filter = el.dataset.f; refreshView(); },
    'learn-pillar': el => { LEARN.pillar = LEARN.pillar === el.dataset.p ? null : el.dataset.p; refreshView(); },
    'learn-reset': () => { Object.assign(LEARN, { filter: 'all', pillar: null, q: '' }); refreshView(); },
    'belief-add': el => {
      const root = el.closest('[data-beliefs]');
      $('.belief-rows', root).insertAdjacentHTML('beforeend', beliefRow(['', '']));
      beliefsSave(root);
      $$('.belief-row .old', root).pop().focus();
    },
    'belief-del': el => { const root = el.closest('[data-beliefs]'); el.closest('.belief-row').remove(); beliefsSave(root); },
    'submit-lesson': el => {
      const key = el.dataset.key, box = el.closest('.submit-box');
      const txt = $('textarea', box).value.trim();
      if (!txt) { toast('Write your answer first', 'edit'); $('textarea', box).focus(); return; }
      S.set('sub-' + key, { when: 'today', text: txt });
      box.innerHTML = `<div class="submitted">${icon('check')} Submitted today · awaiting trainer feedback</div>`;
      toast('Assignment submitted to your trainer');
    },
    'cascade-load': el => {
      const vals = el.dataset.set === 'deck' ? CASCADE_DECK : CASCADE_AGENT;
      const root = el.closest('[data-cascade]');
      $$('input[data-input="cascade"]', root).forEach((inp, i) => { inp.value = vals[i]; });
      S.set('cascade', vals.slice());
    },
    'diag-preset': el => {
      const root = el.closest('.diag'), pv = D.diagnostic.presets[el.dataset.preset].values;
      Object.keys(pv).forEach(k => { $(`input[data-id="${k}"]`, root).value = pv[k]; });
      diagUpdate(root, true);
    },
    'rp-start': el => { Object.assign(RP, { scen: SCEN.find(s => s.id === el.dataset.id), turn: 0, picks: [], fb: null }); rpRefresh(); },
    'rp-pick': el => {
      const o = RP.scen.turns[RP.turn].opts[Number(el.dataset.i)];
      RP.picks[RP.turn] = Number(el.dataset.i);
      RP.fb = [o[2], o[3]];
      rpRefresh();
    },
    'rp-next': () => { RP.turn++; RP.fb = null; rpRefresh(); },
    'rp-restart': () => { Object.assign(RP, { turn: 0, picks: [], fb: null }); rpRefresh(); },
    'rp-menu': () => { Object.assign(RP, { scen: null, turn: 0, picks: [], fb: null }); rpRefresh(); },
    'calls': el => {
      const p = S.get('planner', { mits: [], calls: 24, checks: {} });
      const d = Number(el.dataset.d);
      p.calls = d === 0 ? 0 : (p.calls || 0) + d;
      S.set('planner', p);
      const ringEl = $('.calls-ring');
      if (ringEl) ringEl.innerHTML = ring(Math.min(100, Math.round(p.calls / 60 * 100)), 120, 11, 'var(--gold)', p.calls, 'of 60');
      if (p.calls >= 60 && d) toast('60 calls — daily target hit. That\'s the Rahul effect.', 'trophy');
    },
    'calc-tab': el => { CALC.tab = Number(el.dataset.i); calcRefresh(); },
    'calc-cur': el => { CALC.cur = el.dataset.c; calcRefresh(); },
    'calc-reset': () => { calcVals[CALC.cur] = JSON.parse(JSON.stringify(CALC_DEF[CALC.cur])); calcRefresh(); },
    'assign-open': el => openAssignment(Number(el.dataset.i)),
    'assign-submit': () => {
      const t = $('#as-text');
      if (t && !t.value.trim()) { toast('Write your answer first', 'edit'); t.focus(); return; }
      closeDrawer();
      toast('Assignment submitted to your trainer');
    },
    'job-filter': el => { jobFilter = el.dataset.f; refreshView(); },
    'job-apply': el => {
      const a = S.get('applied', {}); a[el.dataset.key] = true; S.set('applied', a);
      $('#jobs').innerHTML = jobsHTML();
      toast('Application sent — the Placement Cell will be in touch');
    },
    'like': el => { const l = S.get('likes', {}); l[el.dataset.i] = !l[el.dataset.i]; S.set('likes', l); refreshView(); },
    'notify': el => {
      const n = S.get('notify', { classes: true, assign: true, aria: true, jobs: true, wa: false });
      n[el.dataset.k] = !n[el.dataset.k]; S.set('notify', n);
      el.classList.toggle('on', n[el.dataset.k]);
      el.setAttribute('aria-pressed', n[el.dataset.k] ? 'true' : 'false');
    }
  };

  document.addEventListener('click', e => {
    const t = e.target;
    if (!t.closest('.pop-wrap')) closePops();
    const a = t.closest('a[href]');
    if (a) {
      if (a.dataset.ariaTab) {
        ariaTab = ARIA_TABS[a.dataset.ariaTab] || 0;
        if (current.r === 'aria') { e.preventDefault(); closeDrawer(); refreshView(); return; }
      }
      if (a.closest('#drawer')) closeDrawer();
      return;
    }
    const go = t.closest('[data-go]');
    if (go) { location.hash = go.dataset.go; return; }
    const act = t.closest('[data-action]');
    if (act && ACTIONS[act.dataset.action]) ACTIONS[act.dataset.action](act, e);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDrawer(); closePops(); document.body.classList.remove('nav-open'); }
    if (e.key === 'Enter' && e.target.matches('[data-go]')) location.hash = e.target.dataset.go;
  });

  document.addEventListener('input', e => {
    const el = e.target;
    switch (el.dataset.input) {
      case 'diag': diagUpdate(el.closest('.diag'), true); break;
      case 'lifewheel': lifeWheelUpdate(el.closest('[data-lifewheel]')); break;
      case 'belief': beliefsSave(el.closest('[data-beliefs]')); break;
      case 'identity': identityUpdate(el.closest('[data-identity]')); break;
      case 'vision': { const v = S.get('vision2', {}); v[el.dataset.k] = el.value; S.set('vision2', v); break; }
      case 'cascade': { const v = $$('input[data-input="cascade"]', el.closest('[data-cascade]')).map(i => i.value); S.set('cascade', v); break; }
      case 'planner': { const p = S.get('planner', { mits: [], calls: 24, checks: {} }); p.mits = p.mits || []; p.mits[Number(el.dataset.i)] = el.value; S.set('planner', p); break; }
      case 'calc': { calcVals[CALC.cur][el.dataset.k] = parseFloat(el.value) || 0; const o = $('#calc-out'); if (o) o.innerHTML = calcOut(); break; }
    }
  });

  document.addEventListener('change', e => {
    const el = e.target;
    if (!el.dataset.check) return;
    const store = S.get(el.dataset.check, {});
    store[el.dataset.k] = el.checked;
    S.set(el.dataset.check, store);
    el.closest('.check').classList.toggle('on', el.checked);
    if (el.dataset.check === 'week1') {
      const pill = el.closest('.card').querySelector('.box-h .pill');
      if (pill) pill.textContent = Object.values(store).filter(Boolean).length + '/' + WEEK1.length;
    }
  });

  document.addEventListener('submit', e => {
    const f = e.target;
    const kind = f.dataset.form;
    if (!kind) return;
    e.preventDefault();
    if (kind === 'login') {
      const b = $('button[type="submit"]', f);
      b.disabled = true; b.textContent = 'Signing in…';
      setTimeout(() => { location.hash = '#dashboard'; }, 450);
    } else if (kind === 'search') {
      LEARN.q = f.q.value.trim();
      if (current.r === 'learning') refreshView(); else location.hash = '#learning';
    } else if (kind === 'chat') {
      chatSend(f.closest('.chat'), f.q.value);
      f.q.value = '';
    }
  });

  window.addEventListener('hashchange', render);
  render();
})();
