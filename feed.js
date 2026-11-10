"use strict";
// Feed vertical: un ecran, o idee. Se încarcă înainte de app.js; folosește S, Q, CD abia la rulare.
const FD = { items: [], cur: -1, on: false, filter: "all", pi: 0, retry: [], voice: false, roVoice: null, tok: 0, timer: null, lastT: null, recent: [], ok: 0, tot: 0, ready: false, pool: null, lastTap: 0, io: null, seenThis: 0, sheet: false };
const FD_PATTERN = ["L", "L", "Q", "L", "T", "L", "S", "Q", "L", "C", "T"];
const FD_WIN = ["W", "Ai gătit 🔥", "Aura +100", "Sigma move", "Curat", "Absolute cinema", "Locked in", "Prea ușor"];
const FD_LOSE = ["L", "Cooked 💀", "Plot twist: nu", "Aura în minus", "Aproape, șefu'", "Skill issue, dar reparabil"];
const FD_COLORS = [["#16062e", "#c86bff"], ["#2a0620", "#ff5fa8"], ["#03232e", "#3fe0ff"], ["#2b1402", "#ffb02e"], ["#06270f", "#57f08a"], ["#10123a", "#7f8cff"]];

function fdState() { if (!S.feed) S.feed = { seen: {}, saved: [], xp: 0, best: 0, combo: 0 }; return S.feed; }
function fdEl(id) { return document.getElementById(id); }
function fdMark(s) { return s.replace(/\\\*/g, "\u0001").replace(/\*\*(.+?)\*\*/g, "<mark>$1</mark>").replace(/\u0001/g, "*"); }
function fdPlain(s) { return s.replace(/\\\*/g, "").replace(/\*\*/g, ""); }
function fdAny(a) { return a[Math.floor(Math.random() * a.length)]; }

/* Bazinele de conținut */
function fdFits(q) {
  if (!q.x) return true;
  const x = EXHIBITS[q.x];
  return x.type === "scatter" || x.type === "line" || x.type === "panels" || (x.type === "table" && x.rows.length <= 6 && x.head.length <= 5);
}
function fdSpssItems() {
  const out = [];
  ["t5", "bcc1", "bcc2", "tx"].forEach(key => {
    const x = EXHIBITS[key]; let k = 0;
    for (let i = 0; i < x.vars.length; i++) for (let j = i + 1; j < x.vars.length; j++, k++) {
      const base = { k: "S", t: "spss", a: x.vars[i], b: x.vars[j], r: x.r[k], sig: x.sig[k], n: x.n[k] };
      out.push(Object.assign({}, base, { id: `S-${key}-${k}-s`, mode: "sem" }));
      out.push(Object.assign({}, base, { id: `S-${key}-${k}-d`, mode: "dir" }));
    }
  });
  return out;
}
function fdBuild() {
  if (FD.pool) return;
  FD.pool = { L: REELS, T: TRAPS, Q: Q.filter(fdFits).map(o => Object.assign({ k: "Q" }, o)), C: CD.map(c => Object.assign({ k: "C" }, c)), S: fdSpssItems() };
  FD.byId = {};
  Object.values(FD.pool).forEach(p => p.forEach(it => { FD.byId[it.id] = it; }));
}
function fdPick(kind) {
  const st = fdState();
  let p = FD.pool[kind].filter(it => FD.recent.indexOf(it.id) < 0);
  if (FD.filter === "saved") p = p.filter(it => st.saved.indexOf(it.id) >= 0);
  else if (FD.filter !== "all") p = p.filter(it => it.t === FD.filter);
  if (!p.length) return null;
  const rank = it => {
    let v;
    if (kind === "Q") { const r = S.q[it.id]; v = !r ? 1 : r.c ? 3 + r.n : 0; }
    else if (kind === "C") { v = 1 + (S.c[it.id] || 0); }
    else v = 1 + (st.seen[it.id] || 0) * 2;
    if (kind !== "L" && it.t === FD.lastT) v -= .5;
    return v + (kind === "L" ? 0 : Math.random() * .4);
  };
  const scored = p.map((it, i) => [rank(it), i, it]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return scored[0][2];
}
function fdNext() {
  const n = FD.items.length;
  const due = FD.retry.findIndex(r => r.at <= n);
  if (due >= 0) return FD.retry.splice(due, 1)[0].it;
  if (n && n % 20 === 0) return { k: "M", id: "M" + n, t: "" };
  for (let tries = 0; tries < FD_PATTERN.length * 2; tries++) {
    const kind = FD_PATTERN[FD.pi++ % FD_PATTERN.length];
    const it = fdPick(kind);
    if (it) {
      FD.recent.push(it.id); if (FD.recent.length > 90) FD.recent.shift();
      if (kind === "L") FD.lastT = it.t;
      return it;
    }
  }
  FD.recent = [];
  return null;
}
function fdAppend(count) {
  const box = fdEl("fdScroll");
  for (let c = 0; c < count; c++) {
    const it = fdNext(); if (!it) break;
    const i = FD.items.length;
    FD.items.push({ it, ans: null, rev: false, opts: it.k === "Q" ? orderFor(it) : null });
    const a = document.createElement("article");
    a.className = "reel"; a.dataset.i = i;
    box.appendChild(a);
    FD.io.observe(a);
  }
  if (!FD.items.length) box.innerHTML = `<article class="reel"><div class="rmid"><h2 class="rhook">Nu ai nimic aici încă</h2><p class="rsub">Salvează reels cu ❤ sau alege alt capitol.</p></div></article>`;
}

/* Afișarea fiecărui reel */
function fdArt(i) { return document.querySelector(`.reel[data-i="${i}"]`); }
function fdRail(e) { const on = fdState().saved.indexOf(e.it.id) >= 0; return e.it.k === "M" ? "" : `<div class="rail"><button class="rb ${on ? "on" : ""}" data-fa="save" aria-label="Salvează">${on ? "❤️" : "🤍"}<small>Salvează</small></button></div>`; }
function fdTag(t) { return t ? `<span class="rtag">${TOPICS[t] || ""}</span>` : ""; }
function fdFill(i) {
  const a = fdArt(i), e = FD.items[i]; if (!a || a.dataset.f) return;
  a.dataset.f = "1"; a.dataset.k = e.it.k;
  const it = e.it, col = FD_COLORS[i % FD_COLORS.length][1];
  a.style.setProperty("--rc", col);
  let h = "";
  if (it.k === "L") {
    h = `<div class="rmid">${fdTag(it.t)}<h2 class="rhook">${it.h}</h2><div class="rbeats">${it.b.map(b => `<p class="bt">${fdMark(b)}</p>`).join("")}<p class="bt memo">${it.m}</p></div></div><div class="swipe">⌃ swipe</div>`;
  } else if (it.k === "C") {
    h = `<div class="rmid">${fdTag(it.t)}<p class="rkick">Știi asta?</p><h2 class="rhook">${it.f}</h2><div class="cback ${e.rev ? "on" : ""}">${it.b}</div>${e.rev ? fdCardBtns(e) : `<p class="rsub">Atinge ecranul pentru răspuns</p>`}</div>`;
  } else if (it.k === "T") {
    h = `<div class="rmid">${fdTag(it.t)}<p class="rkick">Adevăr sau minciună?</p><h2 class="rhook sm">${it.s}</h2><div class="two">${e.ans === null ? `<button class="tf no" data-fa="tf" data-v="0">MINCIUNĂ</button><button class="tf yes" data-fa="tf" data-v="1">ADEVĂR</button>` : ""}</div><div class="fb"></div></div>`;
  } else if (it.k === "S") {
    const q = it.mode === "sem" ? "Semnificativ la 0,05?" : "Ce sens are relația?";
    const shown = it.mode === "sem" ? it.r.replace(/\*/g, "") : it.r;
    const btns = it.mode === "sem" ? `<button class="tf no" data-fa="s" data-v="0">NU</button><button class="tf yes" data-fa="s" data-v="1">DA</button>` : `<button class="tf no" data-fa="s" data-v="0">NEGATIV</button><button class="tf yes" data-fa="s" data-v="1">POZITIV</button>`;
    h = `<div class="rmid">${fdTag("spss")}<p class="rkick">SPSS speedrun</p><div class="cell"><div class="cname">${it.a} <i>×</i> ${it.b}</div><div class="crow"><span>Pearson</span><b>${shown}</b></div><div class="crow"><span>Sig.</span><b>${it.sig}</b></div><div class="crow"><span>N</span><b>${it.n}</b></div></div><h2 class="rhook sm">${q}</h2><div class="two">${e.ans === null ? btns : ""}</div><div class="fb"></div></div>`;
  } else if (it.k === "Q") {
    h = `<div class="rq">${fdTag(it.t)}${it.x ? `<div class="rx">${exhibit(it.x)}</div>` : ""}<h2 class="qtx">${it.q}</h2>${e.opts.map((ai, n) => `<button class="ro" data-fa="q" data-v="${ai}"><b>${LET[n]}</b><span>${it.a[ai]}</span></button>`).join("")}<div class="fb"></div></div>`;
  } else if (it.k === "M") {
    const st = fdState();
    h = `<div class="rmid"><p class="rkick">Check-up rapid</p><h2 class="rhook">${FD.seenThis} reels. Fără să observi.</h2><p class="rstat">${FD.ok}/${FD.tot} corecte azi · ✨ ${st.xp} aură</p><a class="rcta" href="#simulare">Încearcă o simulare</a><p class="rsub">sau dă swipe mai departe</p></div>`;
  }
  a.innerHTML = h + fdRail(e);
  if (e.ans !== null) fdPaint(a, e);
  if (it.k === "L" && e.rev) a.querySelectorAll(".bt").forEach(b => b.classList.add("on"));
}
function fdCardBtns() { return `<div class="two"><button class="tf no" data-fa="card" data-v="0">Nu știam</button><button class="tf yes" data-fa="card" data-v="2">Știam</button></div>`; }
function fdEvict() { document.querySelectorAll(".reel[data-f]").forEach(a => { if (Math.abs(+a.dataset.i - FD.cur) > 5) { a.innerHTML = ""; delete a.dataset.f; } }); }
function fdPaint(a, e) {
  const it = e.it, fb = a.querySelector(".fb"), good = e.ok;
  if (it.k === "Q") {
    a.querySelectorAll(".ro").forEach(b => { const v = +b.dataset.v; b.disabled = true; if (v === 0) b.classList.add("right"); else if (v === e.ans) b.classList.add("wrong"); });
  }
  if (fb) {
    let exp = it.e;
    if (it.k === "S") exp = fdSpssExplain(it);
    fb.innerHTML = `<div class="verdict ${good ? "w" : "l"}">${e.word}</div><p>${exp}</p>`;
  }
}
function fdSpssAnswer(it) { return it.mode === "sem" ? (parseFloat(it.sig) < .05 ? 1 : 0) : (it.r.trim().startsWith("-") ? 0 : 1); }
function fdSpssExplain(it) {
  const s = parseFloat(it.sig);
  if (it.mode === "sem") return s < .05 ? `Sig. ${it.sig} e sub 0,05${it.sig === ".000" ? " (adică p < 0,001)" : ""}, deci semnificativ.` : `Sig. ${it.sig} e peste 0,05, deci nesemnificativ.`;
  return it.r.trim().startsWith("-") ? "Are minus: valorile mari ale uneia merg cu valorile mici ale celeilalte." : "Fără minus: valorile mari ale uneia merg cu valorile mari ale celeilalte.";
}

/* Povestirea unei lecții, o idee pe rând */
function fdHalt() { FD.tok++; clearTimeout(FD.timer); if (window.speechSynthesis) speechSynthesis.cancel(); }
function fdSay(text, done) {
  const tok = FD.tok;
  const fin = () => { if (tok === FD.tok) { clearTimeout(FD.timer); done(); } };
  if (FD.voice && FD.roVoice) {
    const u = new SpeechSynthesisUtterance(fdPlain(text));
    u.voice = FD.roVoice; u.lang = FD.roVoice.lang; u.rate = 1.12;
    u.onend = fin; u.onerror = fin;
    FD.timer = setTimeout(fin, 2500 + text.length * 130);
    speechSynthesis.speak(u);
  } else {
    FD.timer = setTimeout(fin, Math.max(1050, text.length * 46));
  }
}
function fdRun(i) {
  fdHalt();
  const e = FD.items[i]; if (!e || e.it.k !== "L") return;
  const a = fdArt(i); if (!a) return;
  const bs = [...a.querySelectorAll(".bt")];
  if (e.rev) { bs.forEach(b => b.classList.add("on")); if (FD.voice) { fdSay(e.it.h, () => {}); } return; }
  bs.forEach(b => b.classList.remove("on", "cur"));
  let s = 0;
  const step = () => {
    if (s >= bs.length) { e.rev = true; a.classList.add("fin"); return; }
    bs.forEach(b => b.classList.remove("cur"));
    bs[s].classList.add("on", "cur");
    const txt = bs[s].textContent; s++;
    fdSay(txt, step);
  };
  fdSay(e.it.h, step);
}
function fdRevealAll(i) {
  const e = FD.items[i], a = fdArt(i); if (!e || !a) return;
  fdHalt(); e.rev = true; a.classList.add("fin");
  a.querySelectorAll(".bt").forEach(b => { b.classList.add("on"); b.classList.remove("cur"); });
}
function fdActivate(i) {
  if (FD.cur === i) return;
  FD.cur = i;
  if (i >= FD.items.length - 4) fdAppend(8);
  for (let j = i - 2; j <= i + 3; j++) if (FD.items[j]) fdFill(j);
  fdEvict();
  const e = FD.items[i], st = fdState();
  if (e && e.it.k !== "M" && !e.counted) { e.counted = true; st.seen[e.it.id] = (st.seen[e.it.id] || 0) + 1; FD.seenThis++; if (e.it.k === "L") st.xp += 5; save(); }
  document.querySelectorAll(".reel.now").forEach(a => a.classList.remove("now"));
  const a = fdArt(i); if (a) a.classList.add("now");
  fdHud(); fdBgFor(i); fdRun(i);
}
function fdHud() { const st = fdState(); fdEl("fdCombo").textContent = `🔥 ${st.combo}`; fdEl("fdXp").textContent = `✨ ${st.xp}`; }

/* Reacții */
function fdBurst(a, good, word) {
  const box = document.createElement("div"); box.className = "burst";
  const set = good ? ["🔥", "💯", "⭐", "🧠", "✨"] : ["💀", "😭", "🫠"];
  let h = `<div class="bw ${good ? "w" : "l"}">${word}</div>`;
  for (let n = 0; n < (good ? 16 : 7); n++) h += `<i style="--x:${Math.round(Math.random() * 300 - 150)}px;--y:${Math.round(-120 - Math.random() * 300)}px;--d:${Math.round(Math.random() * 180)}ms">${fdAny(set)}</i>`;
  box.innerHTML = h; a.appendChild(box); setTimeout(() => box.remove(), 1100);
  if (!good) { a.classList.add("shake"); setTimeout(() => a.classList.remove("shake"), 420); }
  if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(good ? 25 : [60, 40, 60]);
}
function fdAnswer(i, e, ans, good) {
  const st = fdState(), a = fdArt(i);
  if (e.ans !== null) return;
  fdHalt();
  e.ans = ans; e.ok = good; e.word = good ? fdAny(FD_WIN) : fdAny(FD_LOSE);
  FD.tot++;
  if (good) { FD.ok++; st.combo++; st.best = Math.max(st.best, st.combo); st.xp += 100 + Math.min(st.combo, 10) * 20; }
  else { st.combo = 0; st.xp = Math.max(0, st.xp - 25); FD.retry.push({ it: e.it, at: FD.items.length + 3 + Math.floor(Math.random() * 3) }); }
  if (e.it.k === "Q") record(e.it.id, good);
  save();
  fdPaint(a, e);
  a.querySelectorAll(".two").forEach(t => { if (e.it.k !== "C") t.innerHTML = ""; });
  fdBurst(a, good, e.word);
  const body = a.querySelector(".rq"); if (body) body.scrollTop = body.scrollHeight;
  fdHud();
  if (good && st.combo && st.combo % 5 === 0) fdToast(`COMBO ${st.combo}! 🔥`);
}
function fdToast(t) { const el = fdEl("fdToast"); el.textContent = t; el.classList.remove("show"); void el.offsetWidth; el.classList.add("show"); }
function fdGo(d) { const s = fdEl("fdScroll"); s.scrollBy({ top: d * s.clientHeight, behavior: "smooth" }); }
function fdSaveToggle(e, btn) {
  const st = fdState(), n = st.saved.indexOf(e.it.id);
  if (n >= 0) st.saved.splice(n, 1); else st.saved.push(e.it.id);
  save();
  const on = n < 0;
  btn.classList.toggle("on", on);
  btn.innerHTML = `${on ? "❤️" : "🤍"}<small>Salvează</small>`;
}
function fdClick(ev) {
  const art = ev.target.closest(".reel"); if (!art || art.dataset.i === undefined) return;
  const i = +art.dataset.i, e = FD.items[i], btn = ev.target.closest("[data-fa]");
  if (btn) {
    const fa = btn.dataset.fa, v = +btn.dataset.v;
    if (fa === "save") fdSaveToggle(e, btn);
    else if (fa === "q") fdAnswer(i, e, v, v === 0);
    else if (fa === "tf") fdAnswer(i, e, v, (v === 1) === e.it.ok);
    else if (fa === "s") fdAnswer(i, e, v, v === fdSpssAnswer(e.it));
    else if (fa === "card") {
      S.c[e.it.id] = v === 2 ? Math.min(3, (S.c[e.it.id] || 0) + 1) : 0;
      if (v !== 2) FD.retry.push({ it: e.it, at: FD.items.length + 4 });
      save(); fdGo(1);
    }
    return;
  }
  if (ev.target.closest("a")) return;
  const t = Date.now();
  if (t - FD.lastTap < 300 && e.it.k !== "M") {
    const st = fdState();
    if (st.saved.indexOf(e.it.id) < 0) { st.saved.push(e.it.id); save(); const b = art.querySelector('[data-fa="save"]'); if (b) { b.classList.add("on"); b.innerHTML = "❤️<small>Salvează</small>"; } }
    const h = document.createElement("div"); h.className = "bigheart"; h.textContent = "❤️"; art.appendChild(h); setTimeout(() => h.remove(), 800);
    FD.lastTap = 0; return;
  }
  FD.lastTap = t;
  if (e.it.k === "L") fdRevealAll(i);
  else if (e.it.k === "C" && !e.rev) {
    e.rev = true;
    art.querySelector(".cback").classList.add("on");
    const sub = art.querySelector(".rsub"); if (sub) sub.outerHTML = fdCardBtns(e);
    fdSay(e.it.b, () => {});
  }
}

/* Fundalul animat din partea de jos */
const FDB = { c: null, x: 0, w: 0, h: 0, mode: 0, col: FD_COLORS[0], t: 0, last: 0, raf: 0, pl: { y: 0, v: 0, a: 0 }, ob: [], ball: null, trail: [], blocks: [], score: 0 };
const fdStill = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
function fdBgSize() {
  const c = FDB.c, r = Math.min(devicePixelRatio || 1, 2);
  FDB.w = c.clientWidth; FDB.h = c.clientHeight;
  c.width = FDB.w * r; c.height = FDB.h * r; FDB.x.setTransform(r, 0, 0, r, 0, 0);
  FDB.st = Math.max(96, Math.min(230, innerHeight * .24));
  FDB.ball = null; FDB.blocks = []; FDB.ob = [];
}
function fdBgFor(i) {
  const e = FD.items[i]; if (!e) return;
  FDB.col = FD_COLORS[i % FD_COLORS.length];
  FDB.mode = i % 3;
  FDB.c.parentElement.style.background = FDB.col[0];
  FDB.c.classList.toggle("dim", e.it.k !== "L");
  FDB.ball = null; FDB.trail = []; FDB.blocks = []; FDB.ob = [];
  if (fdStill()) fdBgDraw(0);
}
function fdRunner(dt) {
  const x = FDB.x, W = FDB.w, H = FDB.h, g = H - 34, P = FDB.pl, c = FDB.col[1], jump = Math.sqrt(2 * 1750 * Math.max(46, FDB.st - 76));
  x.strokeStyle = c; x.globalAlpha = .55; x.lineWidth = 2;
  for (let n = 0; n < 12; n++) { const px = W - ((FDB.t * 260 + n * 70) % (W + 70)); x.beginPath(); x.moveTo(px, g + 8); x.lineTo(px - 26, g + 8); x.stroke(); }
  x.globalAlpha = 1; x.beginPath(); x.moveTo(0, g); x.lineTo(W, g); x.lineWidth = 3; x.stroke();
  if (!FDB.ob.length || FDB.ob[FDB.ob.length - 1].x < W - 130 - Math.random() * 170) FDB.ob.push({ x: W + 20, h: 20 + Math.random() * 26 });
  FDB.ob.forEach(o => { o.x -= dt * 260; x.fillStyle = "#fff"; x.fillRect(o.x, g - o.h, 18, o.h); });
  FDB.ob = FDB.ob.filter(o => o.x > -30);
  const nearest = FDB.ob.find(o => o.x > 60 && o.x < 118);
  if (nearest && P.y === 0) { P.v = jump; FDB.score += 10; }
  P.v -= 1750 * dt; P.y = Math.max(0, P.y + P.v * dt); if (P.y === 0) P.v = 0;
  P.a = P.y > 0 ? P.a + dt * 9 : 0;
  x.save(); x.translate(76, g - 17 - P.y); x.rotate(P.a); x.fillStyle = c; x.fillRect(-17, -17, 34, 34); x.restore();
}
function fdBounce(dt) {
  const x = FDB.x, W = FDB.w, H = FDB.h, R = Math.min(112, FDB.st / 2 - 8), cx = W / 2, cy = H - R - 8, c = FDB.col[1];
  if (!FDB.ball) FDB.ball = { x: cx + 20, y: cy - 60, vx: 190, vy: 40, r: 9 };
  const b = FDB.ball;
  b.vy += 720 * dt; b.x += b.vx * dt; b.y += b.vy * dt;
  const dx = b.x - cx, dy = b.y - cy, d = Math.hypot(dx, dy);
  if (d + b.r > R) {
    const nx = dx / d, ny = dy / d, dot = b.vx * nx + b.vy * ny;
    b.vx -= 2 * dot * nx; b.vy -= 2 * dot * ny; b.x = cx + nx * (R - b.r); b.y = cy + ny * (R - b.r);
    b.r = b.r > R * .34 ? 9 : b.r + 1.4; const sp = Math.hypot(b.vx, b.vy); if (sp < 430) { b.vx *= 1.06; b.vy *= 1.06; }
  }
  FDB.trail.push([b.x, b.y, b.r]); if (FDB.trail.length > 26) FDB.trail.shift();
  x.strokeStyle = c; x.lineWidth = 4; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.stroke();
  FDB.trail.forEach((p, n) => { x.globalAlpha = n / 60; x.fillStyle = c; x.beginPath(); x.arc(p[0], p[1], p[2], 0, 7); x.fill(); });
  x.globalAlpha = 1; x.fillStyle = "#fff"; x.beginPath(); x.arc(b.x, b.y, b.r, 0, 7); x.fill();
}
function fdBlocks(dt) {
  const x = FDB.x, W = FDB.w, H = FDB.h, s = 26, cols = Math.floor(W / s), c = FDB.col[1], base = H - 14;
  if (!FDB.blocks.length) { FDB.heights = new Array(cols).fill(0); }
  if (Math.random() < dt * 14) { const col = Math.floor(Math.random() * cols); FDB.blocks.push({ col, y: H - FDB.st, v: 200, done: false, h: Math.random() < .3 }); }
  FDB.blocks.forEach(b => {
    if (b.done) return;
    b.v += 900 * dt; b.y += b.v * dt;
    const floor = base - (FDB.heights[b.col] + 1) * s;
    if (b.y >= floor) { b.y = floor; b.done = true; FDB.heights[b.col]++; }
  });
  if (Math.max(...FDB.heights) >= Math.floor((FDB.st - 26) / s)) { FDB.blocks = []; FDB.heights.fill(0); }
  FDB.blocks.forEach(b => { x.fillStyle = b.h ? "#fff" : c; x.globalAlpha = b.h ? 1 : .85; x.fillRect(b.col * s + 2, b.y, s - 3, s - 3); });
  x.globalAlpha = 1;
}
function fdBgDraw(dt) {
  const x = FDB.x; x.clearRect(0, 0, FDB.w, FDB.h);
  FDB.t += dt;
  [fdRunner, fdBounce, fdBlocks][FDB.mode](dt);
}
function fdBgLoop(ts) {
  if (!FD.on) { FDB.raf = 0; return; }
  FDB.raf = requestAnimationFrame(fdBgLoop);
  if (ts - FDB.last < 30 || document.hidden) return;
  const dt = Math.min(.05, (ts - FDB.last) / 1000); FDB.last = ts;
  fdBgDraw(dt);
}

/* Filtre, voce, rutare */
function fdReset() {
  fdHalt();
  FD.items = []; FD.cur = -1; FD.pi = 0; FD.retry = []; FD.recent = [];
  const box = fdEl("fdScroll"); FD.io.disconnect(); box.innerHTML = ""; box.scrollTop = 0;
  fdAppend(10);
  if (FD.items.length) fdActivate(0);
}
function fdSheet() {
  const box = fdEl("fdSheet"); box.hidden = !FD.sheet; if (!FD.sheet) return;
  const chip = (v, l) => `<button class="sc ${FD.filter === v ? "on" : ""}" data-sv="${v}">${l}</button>`;
  box.innerHTML = `<h3>Ce vrei să vezi?</h3><div class="scs">${chip("all", "🔥 Pentru tine")}${chip("saved", "❤️ Salvate")}${Object.keys(TOPICS).map(t => chip(t, TOPICS[t])).join("")}</div>`;
}
function fdLabel() { fdEl("fdFilter").textContent = (FD.filter === "all" ? "Pentru tine" : FD.filter === "saved" ? "Salvate" : TOPICS[FD.filter]) + " ▾"; }
function fdFindVoice() {
  if (!window.speechSynthesis) return null;
  const v = speechSynthesis.getVoices().filter(o => /^ro/i.test(o.lang));
  FD.roVoice = v[0] || null;
  return FD.roVoice;
}
function fdInit() {
  if (FD.ready) return; FD.ready = true;
  fdBuild();
  FDB.c = fdEl("fdBg"); FDB.x = FDB.c.getContext("2d"); fdBgSize();
  addEventListener("resize", () => { if (FD.on) fdBgSize(); });
  const box = fdEl("fdScroll");
  FD.io = new IntersectionObserver(es => { es.forEach(en => { if (en.isIntersecting && en.intersectionRatio > .6) fdActivate(+en.target.dataset.i); }); }, { root: box, threshold: [.6] });
  box.addEventListener("click", fdClick);
  fdEl("fdFilter").addEventListener("click", () => { FD.sheet = !FD.sheet; fdSheet(); });
  fdEl("fdSheet").addEventListener("click", ev => { const b = ev.target.closest("[data-sv]"); if (!b) return; FD.filter = b.dataset.sv; FD.sheet = false; fdSheet(); fdLabel(); fdReset(); });
  fdEl("fdVoice").addEventListener("click", () => {
    if (!window.speechSynthesis) { fdToast("Telefonul nu are voce"); return; }
    if (FD.voice) { FD.voice = false; speechSynthesis.cancel(); fdEl("fdVoice").textContent = "🔇"; return; }
    fdFindVoice();
    if (!FD.roVoice) { fdToast("N-am găsit voce în română pe telefon"); return; }
    FD.voice = true; fdEl("fdVoice").textContent = "🔊";
    const e = FD.items[FD.cur]; if (e && e.it.k === "L") { e.rev = false; fdRun(FD.cur); }
  });
  if (window.speechSynthesis) { fdFindVoice(); speechSynthesis.onvoiceschanged = fdFindVoice; }
  addEventListener("keydown", ev => { if (!FD.on) return; if (ev.key === "ArrowDown" || ev.key === "j") { ev.preventDefault(); fdGo(1); } if (ev.key === "ArrowUp" || ev.key === "k") { ev.preventDefault(); fdGo(-1); } });
  document.addEventListener("visibilitychange", () => { if (document.hidden && FD.on) fdHalt(); });
  fdLabel(); fdReset();
}
function fdShow() {
  fdEl("feed").hidden = false;
  fdInit();
  if (!FD.on) { FD.on = true; fdBgSize(); if (FD.cur >= 0) fdBgFor(FD.cur); if (!fdStill()) { FDB.last = performance.now(); FDB.raf = requestAnimationFrame(fdBgLoop); } }
  fdHud();
}
function fdHide() { if (!FD.on) { fdEl("feed").hidden = true; return; } FD.on = false; fdHalt(); fdEl("feed").hidden = true; }
