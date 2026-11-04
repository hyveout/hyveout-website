// ===================================================================
// HYVEOUT — Xbox-style dashboard
// One emblem that flies between positions, a stack of screens,
// keyboard / mouse / touch all drive the same focus system.
// ===================================================================
// site content lives in data/site.json
(async () => {
const D = await (await fetch('data/site.json')).json();


const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// asset references used in data/site.json -> file paths
const src = (ref) => {
  if (ref.startsWith('thumb:')) return `assets/thumbs/${ref.slice(6)}.webp`;
  if (ref.startsWith('graphic:')) return `assets/graphics/${ref.slice(8)}.webp`;
  if (ref.startsWith('clip:')) return `assets/games/${ref.slice(5)}.mp4`;
  if (ref.startsWith('gclip:')) return `assets/thumbs/game_${ref.slice(6)}.webp`;
  return ref;
};
const fmtViews = n => n == null ? '' : new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n) + ' views';
const ago = iso => { if (!iso) return ''; const d = Math.floor((Date.now() - new Date(iso)) / 864e5); if (d < 30) return d + 'd ago'; const m = Math.floor(d / 30); return m < 12 ? m + 'mo ago' : Math.floor(d / 365) + 'y ago'; };

// ---------- accent per section ----------
const ACCENT = { media: '#9b5af3', mind: '#fd395e', about: '#0ea1ec', games: '#00c600', shop: '#9aa0ac', contact: '#f4cc2e', latest: '#e5323c' };

// ===================================================================
// Emblem: position + drag-to-spin
// ===================================================================
const emblemWrap = $('#emblemWrap');
const emblem = $('#emblem');
const ORB = {
  hub:    { x: '50%',  y: '50%', size: 'clamp(180px, 34vmin, 360px)' },
  corner: { x: '50%', y: 'clamp(54px, 8.5vh, 84px)', size: 'clamp(50px, 7.5vmin, 76px)' },
};
function placeOrb(where) {
  const o = ORB[where];
  document.documentElement.style.setProperty('--orb-x', o.x);
  document.documentElement.style.setProperty('--orb-y', o.y);
  document.documentElement.style.setProperty('--orb-size', o.size);
}
(function spin() {
  let ry = 0, rx = 0, vy = 0, vx = 0, dragging = false, lastX = 0, lastY = 0, lastT = 0, raf = null, downAt = null;
  const render = () => { emblem.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; };
  const tick = () => {
    if (dragging) return;
    vy *= 0.965; vx *= 0.92; ry += vy; rx += vx; rx += (0 - rx) * 0.05;
    const home = Math.round(ry / 360) * 360;
    if (Math.abs(vy) < 0.12) ry += (home - ry) * 0.035;
    render();
    if (Math.abs(vy) < .02 && Math.abs(vx) < .02 && Math.abs(ry - home) < .1 && Math.abs(rx) < .1) { ry = home; rx = 0; render(); emblemWrap.classList.remove('spinning'); raf = null; return; }
    raf = requestAnimationFrame(tick);
  };
  emblemWrap.addEventListener('pointerdown', e => {
    dragging = true; downAt = [e.clientX, e.clientY];
    emblemWrap.classList.add('grabbing', 'spinning');
    lastX = e.clientX; lastY = e.clientY; lastT = performance.now(); vy = vx = 0;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    emblemWrap.setPointerCapture(e.pointerId);
  });
  emblemWrap.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY, now = performance.now(), dt = Math.max(1, now - lastT);
    ry += dx * .6; rx = Math.max(-40, Math.min(40, rx - dy * .3));
    vy = dx * .6 / dt * 16; vx = -dy * .3 / dt * 16;
    lastX = e.clientX; lastY = e.clientY; lastT = now; render();
  });
  const up = e => {
    if (!dragging) return;
    dragging = false; emblemWrap.classList.remove('grabbing');
    try { emblemWrap.releasePointerCapture(e.pointerId); } catch {}
    const moved = downAt ? Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) : 0;
    if (moved < 6) {
      // a plain tap: on the hub give it a flick; elsewhere it's the BACK button
      if (state.screen === 'hub') vy = 18; else { goBack(); return; }
    }
    raf = requestAnimationFrame(tick);
  };
  emblemWrap.addEventListener('pointerup', up);
  emblemWrap.addEventListener('pointercancel', up);
  emblemWrap.addEventListener('dragstart', e => e.preventDefault());
})();

// ===================================================================
// Screen stack
// ===================================================================
const state = { screen: 'hub', stack: [], focus: 0 };
const screens = $('#screens');
const crumbs = $('#crumbs');
const promptB = $('#promptB'), promptA = $('#promptA');

function setAccent(k) { document.documentElement.style.setProperty('--accent', ACCENT[k] || '#1e8cff'); }

function focusables() {
  const s = $('.screen.on'); if (!s) return [];
  return [...s.querySelectorAll('[data-focus]')];
}
function setFocus(i, scroll = true) {
  const f = focusables(); if (!f.length) return;
  state.focus = (i + f.length) % f.length;
  f.forEach((e, j) => e.classList.toggle('focus', j === state.focus));
  if (scroll) f[state.focus].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
function activateFocus() {
  const f = focusables()[state.focus]; if (!f) return;
  f.click();
}

// Transition: current screen leaves, emblem flies through camera, new screen enters
let busy = false;
function show(build, { crumb, accent, orb, push = true, fly = true } = {}) {
  if (busy) return; busy = true;
  const old = $('.screen.on');
  const next = el('div', 'screen');
  build(next);
  screens.appendChild(next);
  setAccent(accent || 'hub');
  crumbs.innerHTML = crumb || '';
  document.body.dataset.screen = orb === 'hub' ? 'hub' : 'section';
  const finish = () => {
    if (old) old.remove();
    next.classList.add('on', 'enter');
    placeOrb(orb);
    emblemWrap.classList.remove('flythrough'); emblemWrap.classList.add('flyback');
    setTimeout(() => { emblemWrap.classList.remove('flyback'); busy = false; }, 500);
    state.focus = 0; setFocus(0, false);
    promptB.classList.toggle('show', orb !== 'hub');
    promptA.classList.add('show');
    // autoplay clip previews
    next.querySelectorAll('video[autoplay]').forEach(v => v.play().catch(() => {}));
  };
  if (fly && old) {
    old.classList.add('leave');
    emblemWrap.classList.add('flythrough');
    setTimeout(finish, 420);
  } else finish();
}

// Router --------------------------------------------------------------
function go(route, params = {}) {
  const r = ROUTES[route]; if (!r) return;
  state.stack.push({ route, params });
  state.screen = route;
  r(params);
}
function goBack() {
  if (busy) { setTimeout(goBack, 120); return; }
  if (state.stack.length <= 1) return;
  state.stack.pop();
  const top = state.stack[state.stack.length - 1];
  state.screen = top.route;
  ROUTES[top.route](top.params);
}
function replaceTop(route, params = {}) { state.stack.pop(); go(route, params); }

// Panel helper --------------------------------------------------------
function panel(root, title, count, bodyBuild, cls = '') {
  const wrap = el('div', 'panel-wrap');
  const p = el('div', 'panel' + (cls ? ' ' + cls : ''));
  p.appendChild(el('div', 'panel-head', `<div class="panel-title">${esc(title)}</div><div class="panel-count">${esc(count || '')}</div>`));
  const body = el('div', 'panel-body'); bodyBuild(body); p.appendChild(body);
  // custom scrollbar: always visible (phones hide native ones), draggable
  const bar = el('div', 'sbar'), thumb = document.createElement('i'); bar.appendChild(thumb); p.appendChild(bar);
  const sync = () => {
    const H = body.clientHeight, S = body.scrollHeight;
    bar.classList.toggle('hide', S - H < 4);
    bar.style.top = body.offsetTop + 8 + 'px'; bar.style.height = H - 16 + 'px';
    const th = Math.max(28, (H - 16) * H / S);
    thumb.style.height = th + 'px';
    thumb.style.top = ((H - 16 - th) * (body.scrollTop / Math.max(1, S - H))) + 'px';
  };
  body.addEventListener('scroll', sync, { passive: true });
  new ResizeObserver(sync).observe(body); new MutationObserver(sync).observe(body, { childList: true, subtree: true });
  requestAnimationFrame(sync); setTimeout(sync, 600);
  let dragY = null, dragTop = 0;
  bar.addEventListener('pointerdown', e => {
    e.preventDefault(); bar.setPointerCapture(e.pointerId);
    const r = bar.getBoundingClientRect(), th = thumb.offsetHeight;
    if (e.target !== thumb) { const f = (e.clientY - r.top - th / 2) / (r.height - th); body.scrollTop = f * (body.scrollHeight - body.clientHeight); }
    dragY = e.clientY; dragTop = body.scrollTop;
  });
  bar.addEventListener('pointermove', e => {
    if (dragY == null) return;
    const r = bar.getBoundingClientRect(), th = thumb.offsetHeight;
    body.scrollTop = dragTop + (e.clientY - dragY) * (body.scrollHeight - body.clientHeight) / Math.max(1, r.height - th);
  });
  bar.addEventListener('pointerup', () => { dragY = null; });
  wrap.appendChild(p); root.appendChild(wrap);
  return body;
}
function rowsList(body, items, onPick, { numbered = true } = {}) {
  const ul = el('ul', 'rows');
  items.forEach((it, i) => {
    if (it.sep) { ul.appendChild(el('li', 'row sep', esc(it.sep))); return; }
    const li = el('li', 'row' + (it.disabled ? ' disabled' : ''));
    if (!it.disabled) li.dataset.focus = '1';
    let html = '';
    if (it.thumb) html += `<img class="th${it.square ? ' sq' : ''}" src="${it.thumb}" alt="" loading="lazy">`;
    html += `<span class="txt"><span class="t">${esc(it.title)}</span>${it.meta ? `<span class="m">${esc(it.meta)}</span>` : ''}</span>`;
    if (it.thumb) html += `<span class="th-spacer${it.square ? ' sq' : ''}"></span>`;
    li.innerHTML = html;
    if (!it.disabled) li.addEventListener('click', () => onPick(it, i));
    ul.appendChild(li);
  });
  body.appendChild(ul);
}
function viewerFor(item, { autoplay = false } = {}) {
  const v = el('div', 'viewer');
  if (item.type === 'youtube') {
    v.innerHTML = `<iframe src="https://www.youtube.com/embed/${item.id}?rel=0${autoplay ? '&autoplay=1' : ''}" title="${esc(item.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  } else if (item.type === 'video') {
    v.innerHTML = `<video src="${src(item.src)}" poster="${src(item.thumb)}" controls playsinline preload="metadata" ${item.loop ? 'loop muted autoplay' : (autoplay ? 'autoplay' : '')}></video>`;
  } else if (item.type === 'site') {
    v.innerHTML = `<video src="${src('clip:' + item.clip)}" autoplay loop muted playsinline></video>`;
  } else {
    v.innerHTML = `<img src="${src(item.src)}" alt="${esc(item.title)}">`;
  }
  return v;
}
function thumbFor(item) {
  if (item.type === 'youtube') return `https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`;
  if (item.type === 'site') return src('gclip:' + item.clip);
  if (item.type === 'video') return src(item.thumb);
  return src(item.src);
}
// A "player screen": viewer on top, prev/next, thumbnail strip
function playerScreen(root, { title, items, index, crumb, accent }) {
  let i = index;
  const body = panel(root, title, `${i + 1} / ${items.length}`, () => {});
  const render = (auto) => {
    body.innerHTML = '';
    const it = items[i];
    body.appendChild(viewerFor(it, { autoplay: auto }));
    body.appendChild(el('div', 'viewer-title', esc(it.title)));
    const meta = [it.views != null && fmtViews(it.views), it.date && ago(it.date), it.label].filter(Boolean).join(' • ');
    if (meta) body.appendChild(el('div', 'viewer-meta', esc(meta)));
    if (it.url) { const a = el('a', 'btn primary', '&gt;VISIT SITE&lt;'); a.href = it.url; a.target = '_blank'; a.rel = 'noopener'; a.style.marginBottom = '12px'; a.dataset.focus = '1'; body.appendChild(a); }
    if (items.length > 1) {
      const ar = el('div', 'arrows');
      const prev = el('button', 'arrow-btn', '◀ PREV'); prev.dataset.focus = '1'; prev.onclick = () => { i = (i - 1 + items.length) % items.length; render(true); };
      const nxt = el('button', 'arrow-btn', 'NEXT ▶'); nxt.dataset.focus = '1'; nxt.onclick = () => { i = (i + 1) % items.length; render(true); };
      ar.append(prev, el('span', 'panel-count', `${i + 1} / ${items.length}`), nxt); body.appendChild(ar);
      const strip = el('div', 'strip');
      items.forEach((x, j) => { const b = el('button', j === i ? 'on' : ''); b.innerHTML = `<img src="${thumbFor(x)}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">`; b.title = x.title; b.onclick = () => { i = j; render(true); }; strip.appendChild(b); });
      body.appendChild(strip);
    }
    $('.panel-count', root).textContent = `${i + 1} / ${items.length}`;
    state.focus = 0; setFocus(0, false);
  };
  render(false);
}

// A "gallery screen": player on top, title under it, list of rows below; a row loads into the player
function galleryScreen(root, { title, items, index = 0, numbered = true, cls = '' }) {
  let i = index;
  const body = panel(root, title, `${items.length} ${items.length === 1 ? 'ITEM' : 'ITEMS'}`, () => {}, cls);
  const stage = el('div', 'stage'); body.appendChild(stage);
  const list = el('div', 'stage-list'); body.appendChild(list);
  const render = (auto) => {
    stage.innerHTML = '';
    const it = items[i];
    stage.appendChild(viewerFor(it, { autoplay: auto }));
    stage.appendChild(el('div', 'viewer-title', esc(it.title)));
    const meta = [it.views != null && fmtViews(it.views), it.date && ago(it.date), it.label].filter(Boolean).join(' • ');
    if (meta) stage.appendChild(el('div', 'viewer-meta', esc(meta)));
    if (it.url) { const a = el('a', 'btn primary', '&gt;VISIT SITE&lt;'); a.href = it.url; a.target = '_blank'; a.rel = 'noopener'; a.dataset.focus = '1'; stage.appendChild(a); }
    [...list.querySelectorAll('.row')].forEach((r, j) => r.classList.toggle('on', j === i));
  };
  rowsList(list, items.map(x => ({ title: x.title, meta: [x.views != null && fmtViews(x.views), x.date && ago(x.date)].filter(Boolean).join(' • '), thumb: thumbFor(x), square: x.type === 'image' })),
    (it, j) => { i = j; render(true); body.scrollTo({ top: 0, behavior: 'smooth' }); }, { numbered });
  render(false);
}

// ===================================================================
// ROUTES
// ===================================================================
const ROUTES = {
  hub() {
    show(root => {
      const hub = el('div', 'hub');
      const glows = $('#glows'); glows.innerHTML = '';
      const field = el('div', 'sat-field');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'sat-lines');
      field.appendChild(svg);
      // satellite positions: angle around the emblem + distance (as a fraction of the shorter screen side)
      const SATS = [
        { k: 'media',   label: 'MEDIA',   a: 232, d: .31, go: () => go('media') },
        { k: 'mind',    label: 'MIND',    a: 180, d: .37, go: () => go('mind') },
        { k: 'about',   label: 'ABOUT',   a: 128, d: .31, go: () => go('about') },
        { k: 'games',   label: 'GAMES',   a: -52, d: .31, go: () => go('games') },
        { k: 'shop',    label: 'SHOP',    a: 0,   d: .37 },
        { k: 'contact', label: 'CONTACT', a: 52,  d: .31, go: () => go('contact') },
      ];
      const nodes = SATS.map((s, i) => {
        const a = el('a', 'sat'); a.dataset.k = s.k; if (s.go) { a.dataset.focus = '1'; a.addEventListener('click', s.go); }
        a.style.setProperty('--dur', (5.5 + (i % 3)) + 's'); a.style.setProperty('--delay', (-i * 1.3) + 's');
        a.innerHTML = `<span class="orbit"><span class="halo h1"></span><span class="halo h2"></span><span class="halo h3"></span><img class="icon" src="assets/icons/${s.k}.webp" alt=""></span><span class="label">${s.label}</span>`;
        field.appendChild(a);
        const under = document.createElementNS('http://www.w3.org/2000/svg', 'line'); under.setAttribute('class', 'under');
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        svg.append(under, line, dot);
        return { s, a, line, dot, under };
      });
      hub.append(field); root.appendChild(hub);

      // lay out: positions depend on viewport, so compute and redo on resize
      const layout = () => {
        const W = innerWidth, H = innerHeight, m = Math.min(W, H);
        const phone = W <= 720;
        const cx = W / 2, cy = phone ? H * .5 : H / 2;
        const orbR = (phone ? Math.min(150, Math.max(110, W * .30)) : Math.min(360, Math.max(180, m * .34))) / 2;
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        nodes.forEach(({ s, a, line, dot, under }, i) => {
          let x, y;
          if (phone) {
            // same ring on phones, just tighter: sides level with the emblem, two above, two below
            const PA = { about: 118, contact: 62, mind: 180, shop: 0, media: 242, games: 298 }[s.k];
            const side = PA === 180 || PA === 0;
            const D = side ? Math.min(W * .345, 150) : Math.min(H * .215, 185);
            const rad = PA * Math.PI / 180;
            x = cx + Math.cos(rad) * D; y = cy - Math.sin(rad) * D;
          } else {
            const rad = s.a * Math.PI / 180;
            const dist = orbR + m * s.d * .55;
            x = cx + Math.cos(rad) * dist * 1.35; y = cy - Math.sin(rad) * dist;
          }
          a.style.setProperty('--x', x + 'px'); a.style.setProperty('--y', y + 'px');
          let g = glows.querySelector(`[data-k="${s.k}"]`);
          if (!g) { g = el('div', 'glow'); g.dataset.k = s.k; g.style.setProperty('--accent', ACCENT[s.k] || '#1e8cff'); g.style.setProperty('--delay', (i * .7) + 's'); glows.appendChild(g); }
          g.style.left = x + 'px'; g.style.top = y + 'px';
          if (!a.dataset.glowBound) { a.dataset.glowBound = '1'; a.addEventListener('pointerenter', () => g.classList.add('hot')); a.addEventListener('pointerleave', () => g.classList.remove('hot')); }
          // line from the emblem's edge toward the satellite, stopping short of its ring
          const dx = x - cx, dy = y - cy, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
          const x1 = cx + ux * (orbR * .96), y1 = cy + uy * (orbR * .96);
          const ringR = (phone ? 66 : Math.min(180, Math.max(110, W * .135))) / 2 + 8;
          const x2 = x - ux * ringR, y2 = y - uy * ringR;
          const col = ACCENT[s.k] || '#1e8cff';
          for (const l of [line, under]) { l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', x2); l.setAttribute('y2', y2); }
          line.setAttribute('stroke', col);
          dot.setAttribute('cx', x1); dot.setAttribute('cy', y1); dot.setAttribute('fill', col); dot.setAttribute('stroke', '#000'); dot.setAttribute('stroke-width', '2'); dot.setAttribute('r', '5');
        });
      };
      layout();
      root._layout = layout;
      window.addEventListener('resize', layout);
    }, { orb: 'hub', accent: 'hub', crumb: '', fly: state.stack.length > 1 });
  },

  // ---------------- MEDIA ----------------
  media() {
    show(root => {
      panel(root, 'MEDIA', '3 SECTIONS', body => rowsList(body, [
        { title: 'MUSIC VIDEOS', k: 'mv' },
        { title: 'VISUALIZERS', k: 'vis' },
        { title: 'GRAPHICS / PHOTOS', k: 'gfx' },
      ], it => go(it.k)), 'menu');
    }, { orb: 'corner', accent: 'media', crumb: '<b>MEDIA</b>' });
  },
  mv() {
    show(root => {
      galleryScreen(root, { title: 'MUSIC VIDEOS', items: D.musicVideos, cls: 'tall' });
    }, { orb: 'corner', accent: 'media', crumb: 'MEDIA › <b>MUSIC VIDEOS</b>' });
  },
  mvPlay({ index }) {
    show(root => playerScreen(root, { title: 'MUSIC VIDEOS', items: D.musicVideos, index }), { orb: 'corner', accent: 'media', crumb: 'MEDIA › MUSIC VIDEOS › <b>NOW PLAYING</b>' });
  },
  vis() {
    show(root => {
      galleryScreen(root, { title: 'VISUALIZERS', items: D.visualizers, cls: 'tall' });
    }, { orb: 'corner', accent: 'media', crumb: 'MEDIA › <b>VISUALIZERS</b>' });
  },
  visPlay({ index }) {
    show(root => playerScreen(root, { title: 'VISUALIZERS', items: D.visualizers, index }), { orb: 'corner', accent: 'media', crumb: 'MEDIA › VISUALIZERS › <b>NOW PLAYING</b>' });
  },
  gfx() {
    show(root => {
      galleryScreen(root, { title: 'GRAPHICS / PHOTOS', items: D.graphics, cls: 'tall' });
    }, { orb: 'corner', accent: 'media', crumb: 'MEDIA › <b>GRAPHICS / PHOTOS</b>' });
  },
  gfxView({ index }) {
    show(root => playerScreen(root, { title: 'GRAPHICS / PHOTOS', items: D.graphics, index }), { orb: 'corner', accent: 'media', crumb: 'MEDIA › GRAPHICS / PHOTOS › <b>VIEWING</b>' });
  },

  // ---------------- MIND ----------------
  mind() {
    show(root => {
      panel(root, 'MIND', '', body => rowsList(body, [
        { sep: 'CREATIVE DIRECTION' },
        ...D.creative.map(c => ({ title: c.name, meta: c.project, c })),
        { sep: 'COLLABORATED ARTISTS' },
        ...D.artists.map(([n, u]) => ({ title: n, url: u, ext: true })),
      ], it => { if (it.c) go('cd', { slug: it.c.slug }); else window.open(it.url, '_blank', 'noopener'); }, { numbered: false }), 'menu');
    }, { orb: 'corner', accent: 'mind', crumb: '<b>MIND</b>' });
  },
  cd({ slug }) {
    show(root => {
      const body = panel(root, 'CREATIVE DIRECTION', '', () => {}, 'tall cd');
      const KIND = { youtube: 'MUSIC VIDEO', image: 'COVER ART', video: 'VISUALIZER', site: 'WEBSITE' };
      let current = slug;
      const render = () => {
        const c = D.creative.find(x => x.slug === current);
        body.innerHTML = '';
        // artist tabs
        const tabs = el('div', 'cd-tabs');
        D.creative.forEach(a => {
          const t = el('button', 'cd-tab' + (a.slug === current ? ' on' : ''), esc(a.name)); t.dataset.focus = '1';
          t.onclick = () => { if (a.slug !== current) { current = a.slug; render(); body.scrollTo({ top: 0 }); } };
          tabs.appendChild(t);
        });
        body.appendChild(tabs);
        body.appendChild(el('div', 'cd-name', esc(c.name)));
        body.appendChild(el('div', 'cd-role', 'CREATIVE DIRECTION • ' + esc(c.project)));
        // featured piece
        const feat = el('div', 'cd-feat');
        feat.appendChild(viewerFor(c.featured));
        feat.appendChild(el('div', 'cd-badge', 'FEATURED'));
        feat.appendChild(el('div', 'cd-ftitle', esc(c.featured.title)));
        feat.appendChild(el('div', 'cd-fkind', KIND[c.featured.type] || ''));
        body.appendChild(feat);
        body.appendChild(el('p', 'cd-desc', esc(c.description)));
        // collapsible sections
        const secs = el('div', 'cd-secs');
        c.sections.forEach(s => {
          const sec = el('div', 'cd-sec');
          const head = el('button', 'cd-sec-head', `<span class="nm">${esc(s.name)}</span><span class="ct">${s.items.length}</span><span class="cd-arr"></span>`); head.dataset.focus = '1';
          const inner = el('div', 'cd-sec-body');
          let i = 0;
          const draw = (auto) => {
            inner.innerHTML = '';
            const stage = el('div', 'cd-stage');
            const many = s.items.length > 1;
            if (many) { const p = el('button', 'cd-nav prev', '<span class="cd-arr"></span>'); p.dataset.focus = '1'; p.onclick = () => { i = (i - 1 + s.items.length) % s.items.length; draw(true); }; stage.appendChild(p); }
            const pl = el('div', 'cd-player'); pl.appendChild(viewerFor(s.items[i], { autoplay: auto })); stage.appendChild(pl);
            if (many) { const n = el('button', 'cd-nav next', '<span class="cd-arr"></span>'); n.dataset.focus = '1'; n.onclick = () => { i = (i + 1) % s.items.length; draw(true); }; stage.appendChild(n); }
            inner.appendChild(stage);
            const it = s.items[i];
            inner.appendChild(el('div', 'cd-ptitle', esc(it.title)));
            if (many) inner.appendChild(el('div', 'cd-fkind', `${i + 1}/${s.items.length}`));
            if (it.url) { const a = el('a', 'btn primary', '&gt;VISIT SITE&lt;'); a.href = it.url; a.target = '_blank'; a.rel = 'noopener'; a.dataset.focus = '1'; a.style.marginTop = '10px'; inner.appendChild(a); }
            if (many) {
              const strip = el('div', 'strip');
              s.items.forEach((x, j) => { const b = el('button', j === i ? 'on' : ''); b.innerHTML = `<img src="${thumbFor(x)}" alt="" loading="lazy">`; b.title = x.title; b.onclick = () => { i = j; draw(true); }; strip.appendChild(b); });
              inner.appendChild(strip);
            }
          };
          head.onclick = () => {
            const open = sec.classList.contains('open');
            secs.querySelectorAll('.cd-sec.open').forEach(o => { o.classList.remove('open'); o.querySelector('.cd-sec-body').innerHTML = ''; });
            if (!open) { sec.classList.add('open'); i = 0; draw(false); setTimeout(() => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); }
          };
          sec.append(head, inner); secs.appendChild(sec);
        });
        body.appendChild(secs);
      };
      render();
    }, { orb: 'corner', accent: 'mind', crumb: '' });
  },
  cdSection({ slug, section }) {
    const c = D.creative.find(x => x.slug === slug); const s = c.sections[section];
    show(root => galleryScreen(root, { title: `${c.name}: ${s.name}`, items: s.items, cls: 'tall' }), { orb: 'corner', accent: 'mind', crumb: `MIND › ${c.name} › <b>${s.name}</b>` });
  },

  // ---------------- GAMES ----------------
  games() {
    show(root => {
      panel(root, 'GAMES', `${D.games.length} PROJECTS`, body => {
        const grid = el('div', 'cards');
        D.games.forEach(g => {
          const a = el('a', 'card'); a.href = g.url; a.target = '_blank'; a.rel = 'noopener'; a.dataset.focus = '1';
          a.innerHTML = `<video data-src="${src('clip:' + g.clip)}" poster="${src('gclip:' + g.clip)}" loop muted playsinline preload="none"></video><div class="t">${esc(g.title)}</div>`;
          grid.appendChild(a);
        });
        body.appendChild(grid);
        // all clips get their source right away (already cached if the prefetch ran); visibility only decides play/pause
        grid.querySelectorAll('video').forEach(v => { v.src = clipCache.get(v.dataset.src) || v.dataset.src; v.preload = 'auto'; });
        const io = new IntersectionObserver(es => es.forEach(e => {
          const v = e.target;
          if (e.isIntersecting) v.play().catch(() => {}); else v.pause();
        }), { root: body, threshold: .15 });
        grid.querySelectorAll('video').forEach(v => io.observe(v));
        const fit = () => { const c = grid.querySelector('.card'); if (!c || c.offsetHeight < 60) return; body.style.height = Math.round(c.offsetHeight * 1.32 + 32) + 'px'; };
        new ResizeObserver(fit).observe(grid.querySelector('.card'));
      }, 'wide');
    }, { orb: 'corner', accent: 'games', crumb: '<b>GAMES</b>' });
  },

  // ---------------- ABOUT ----------------
  about() {
    show(root => {
      panel(root, 'ABOUT', '', body => {
        const d = el('div', 'prose big centered');
        d.innerHTML = D.about.map(l => `<p>${esc(l)}</p>`).join('');
        body.appendChild(d);
      });
    }, { orb: 'corner', accent: 'about', crumb: '<b>ABOUT</b>' });
  },

  // ---------------- CONTACT ----------------
  contact() {
    show(root => {
      panel(root, 'CONTACT', '', body => {
        const d = el('div', 'contact-only');
        d.innerHTML = `<a class="btn primary" data-focus="1" href="mailto:${D.contact.email}">${D.contact.email}</a>`;
        body.appendChild(d);
      });
    }, { orb: 'corner', accent: 'contact', crumb: '<b>CONTACT</b>' });
  },

  // ---------------- LATEST ----------------
  latest() {
    show(root => {
      panel(root, 'LATEST', D.latest.date, body => {
        body.appendChild(viewerFor({ type: 'site', clip: D.latest.clip }));
        body.appendChild(el('div', 'viewer-title', esc(D.latest.title)));
        body.appendChild(el('div', 'viewer-meta', esc(D.latest.blurb)));
        const a = el('a', 'btn primary', '&gt;VISIT SITE&lt;'); a.href = D.latest.url; a.target = '_blank'; a.rel = 'noopener'; a.dataset.focus = '1'; body.appendChild(a);
        const b = el('button', 'btn', 'ALL PROJECTS'); b.style.marginLeft = '10px'; b.dataset.focus = '1'; b.onclick = () => replaceTop('games'); body.appendChild(b);
      });
    }, { orb: 'corner', accent: 'latest', crumb: '<b>LATEST</b>' });
  },
};

// ===================================================================
// Input: keyboard + prompts
// ===================================================================
document.addEventListener('keydown', e => {
  const k = e.key;
  if (k === 'Escape' || k === 'Backspace') { e.preventDefault(); goBack(); return; }
  if (busy) return;
  if (k === 'Enter' || k === ' ') { e.preventDefault(); activateFocus(); return; }
  if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); setFocus(state.focus + 1); }
  if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); setFocus(state.focus - 1); }
});
promptB.addEventListener('click', goBack);
promptA.addEventListener('click', activateFocus);
// mouse hover also moves focus (so Enter matches what's under the cursor)
document.addEventListener('touchstart', () => {}, { passive: true }); // lets :active fire on iOS
// iOS ignores user-scalable=no; block pinch and double-tap zoom by hand
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('touchmove', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
let lastTap = 0;
document.addEventListener('touchend', e => { const t = Date.now(); if (t - lastTap < 300 && !e.target.closest('video, iframe')) e.preventDefault(); lastTap = t; }, { passive: false });
document.addEventListener('contextmenu', e => { if (!e.target.closest('a')) e.preventDefault(); });
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', () => { document.body.dataset.input = 'keys'; });
document.addEventListener('mousemove', () => { document.body.dataset.input = 'mouse'; });
document.addEventListener('mouseover', e => { const f = e.target.closest('[data-focus]'); if (!f) return; const i = focusables().indexOf(f); if (i >= 0) setFocus(i, false); });

// ===================================================================
// Boot
// ===================================================================
const boot = $('#boot');
function start() {
  if (boot.classList.contains('done')) return;
  boot.classList.add('done');
  emblemWrap.style.opacity = '1';
  go('hub');
  prefetchClips();
}
// Warm the browser cache with the game clips (1.6 MB total) while the hub is idle,
// one at a time so it never competes with the page; the Games page then plays them instantly.
const clipCache = new Map();
async function prefetchClips() {
  if (navigator.connection && navigator.connection.saveData) return;
  for (const g of D.games) {
    const url = src('clip:' + g.clip);
    if (clipCache.has(url)) continue;
    try { const r = await fetch(url, { priority: 'low' }); clipCache.set(url, URL.createObjectURL(await r.blob())); } catch { /* ignore */ }
  }
}
$('#enterBtn').addEventListener('click', start);
document.addEventListener('keydown', e => { if (e.key === 'Enter' && !boot.classList.contains('done')) start(); });
placeOrb('hub');

})();
