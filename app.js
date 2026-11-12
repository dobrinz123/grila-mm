"use strict";
const app = document.getElementById("app");
const EXAM_DAY = new Date(2026, 10, 12);
const EXAM_LEN = 30, EXAM_SEC = 30 * 60;
// Câte întrebări din fiecare temă intră într-o simulare de 30.
const BLUEPRINT = { mas: 3, dist: 2, cor: 2, spss: 5, err: 3, esa: 3, fac: 3, clu: 2, reg: 1, ret: 1, gra: 3, caz: 1, c1: 1 };
const KEY = "grila-mm-v1";
let S = { q: {}, c: {}, ex: null, last: null, hist: [], c1: true };
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) {}
let syncDoc = null, syncTimer = null;
function save() {
  S.at = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  if (syncDoc) { clearTimeout(syncTimer); syncTimer = setTimeout(() => { syncDoc.set({ json: JSON.stringify(S), at: S.at }).catch(() => {}); }, 1500); }
}
// Când rulează pe contul Claude, progresul se sincronizează între dispozitive.
async function connectSync() {
  if (!window.claude || !window.claude.use) return;
  try {
    const [user, db] = await Promise.all([window.claude.use("user"), window.claude.use("db")]);
    if (!user || !db) return;
    const id = await user.id();
    if (!id) return;
    const doc = db.collection("data/users/" + id).doc("progres");
    const snap = await doc.get();
    syncDoc = doc;
    const remote = snap.exists ? snap.data() : null;
    if (remote && remote.at > (S.at || 0)) {
      S = Object.assign(S, JSON.parse(remote.json));
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
      F.queue = null; P.queue = null;
      if (S.ex) startTick();
      render();
    } else if (S.at) { doc.set({ json: JSON.stringify(S), at: S.at }).catch(() => {}); }
  } catch (e) {}
}

const QM = Object.fromEntries(Q.map(o => [o.id, o]));
const CD = CARDS.map((c, i) => ({ id: "k" + i, t: c[0], f: c[1], b: c[2] }));
const LET = "ABCD";
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pct(a, b) { return b ? Math.round(100 * a / b) : 0; }
function fmt(n, d = 1) { return n.toFixed(d).replace(".", ","); }
function daysLeft() { const n = new Date(); n.setHours(0, 0, 0, 0); return Math.round((EXAM_DAY - n) / 864e5); }
function barClass(p) { return p < 50 ? "low" : p >= 80 ? "ok" : ""; }

/* Tabele și grafice */
function xbox(inner, note, title) { return `<div class="xbox">${title ? `<div class="xt">${title}</div>` : ""}${inner}${note ? `<div class="xn">${note}</div>` : ""}</div>`; }
function exhibit(id) {
  const x = EXHIBITS[id]; if (!x) return "";
  if (x.type === "corr") return corrTable(x);
  if (x.type === "table") return xbox(`<div class="xs"><table><thead><tr>${x.head.map(h => `<th class="h">${h}</th>`).join("")}</tr></thead><tbody>${x.rows.map(r => `<tr>${r.map((c, i) => i ? `<td>${c}</td>` : `<th class="st">${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`, x.note, x.title);
  if (x.type === "scatter") return xbox(scatter(x, id), x.note, x.title);
  if (x.type === "line") return xbox(line(x) + legend(x), x.note, x.title);
  if (x.type === "panels") return xbox(panels(), "", x.title);
  return "";
}
const SHORT = { "Satisfacția cu viața": "Satisf.", "Fericire": "Feric.", "Sănătate": "Sănăt.", "Gen feminin": "Gen F", "Merge la biserică": "Biser.", "Mediu urban": "Urban", "Merge la hipermarket": "Hiper", "În cuplu": "Cuplu", "Ore de somn": "Somn", "Ore de studiu": "Studiu" };
function corrTable(x) {
  const v = x.vars, n = v.length;
  const at = (arr, i, j) => { const a = Math.min(i, j), b = Math.max(i, j); let k = 0; for (let p = 0; p < a; p++) k += n - p - 1; return arr[k + b - a - 1]; };
  let b = "";
  v.forEach((name, i) => {
    const cell = (kind, j) => i === j ? (kind === "r" ? "1" : kind === "n" ? x.diag[i] : "") : at(x[kind], i, j);
    b += `<tr class="grp"><th colspan="${n + 1}">${name}</th></tr>`;
    b += `<tr><td class="lab">r</td>${v.map((_, j) => `<td>${cell("r", j)}</td>`).join("")}</tr>`;
    b += `<tr><td class="lab">Sig.</td>${v.map((_, j) => `<td>${cell("sig", j)}</td>`).join("")}</tr>`;
    b += `<tr class="gs"><td class="lab">N</td>${v.map((_, j) => `<td>${cell("n", j)}</td>`).join("")}</tr>`;
  });
  const foot = "**. Correlation is significant at the 0.01 level (2-tailed). *. Correlation is significant at the 0.05 level (2-tailed).";
  return xbox(`<div class="xs"><table class="corr"><thead><tr><th></th>${v.map(h => `<th class="h">${SHORT[h] || h}</th>`).join("")}</tr></thead><tbody>${b}</tbody></table></div>`, `${foot} ${x.note || ""}`, x.title);
}
const LABELS = {
  fig6: { România: "t", Finlanda: "t", Elveția: "t", Irlanda: "t", Luxemburg: "l", Germania: "b" },
  fig7: { Slovenia: "t", Finlanda: "t", Slovacia: "b", Bulgaria: "l", Turcia: "l" }
};
function frame(x, W, H, L, R, T, B) {
  const sx = v => L + (v - x.xr[0]) / (x.xr[1] - x.xr[0]) * (W - L - R);
  const sy = v => H - B - (v - x.yr[0]) / (x.yr[1] - x.yr[0]) * (H - T - B);
  let s = "";
  const yd = (x.yr[2] < 1) ? 1 : 0;
  for (let v = x.yr[0]; v <= x.yr[1] + 1e-9; v += x.yr[2]) { s += `<line class="grid" x1="${L}" x2="${W - R}" y1="${sy(v)}" y2="${sy(v)}"/><text x="${L - 5}" y="${sy(v) + 3.5}" text-anchor="end">${fmt(v, yd)}</text>`; }
  const xt = x.xt || (() => { const a = []; for (let v = x.xr[0]; v <= x.xr[1]; v += x.xr[2]) a.push(v); return a; })();
  xt.forEach(v => { s += `<line class="axis" x1="${sx(v)}" x2="${sx(v)}" y1="${H - B}" y2="${H - B + 4}"/><text x="${sx(v)}" y="${H - B + 15}" text-anchor="middle" ${x.xt ? 'font-size="9"' : ""}>${v}</text>`; });
  s += `<line class="axis" x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}"/><line class="axis" x1="${L}" x2="${L}" y1="${T}" y2="${H - B}"/>`;
  return { sx, sy, s };
}
function scatter(x, id) {
  const W = 370, H = 290, F = frame(x, W, H, 38, 12, 20, 40);
  const pos = LABELS[id] || {};
  let s = F.s;
  x.pts.forEach(p => {
    const cx = F.sx(p[0]), cy = F.sy(p[1]);
    s += `<circle cx="${cx}" cy="${cy}" r="3.4" fill="var(--surface)" stroke="var(--accent)" stroke-width="1.6"/>`;
    if (p[2]) {
      const a = pos[p[2]] || "r";
      const m = { r: [cx + 6, cy + 3.5, "start"], l: [cx - 6, cy + 3.5, "end"], t: [cx, cy - 7, "middle"], b: [cx, cy + 14, "middle"] }[a];
      s += `<text class="pl" x="${m[0]}" y="${m[1]}" text-anchor="${m[2]}">${p[2]}</text>`;
    }
  });
  s += `<text x="${(38 + W - 12) / 2}" y="${H - 6}" text-anchor="middle">${x.xl}</text><text transform="translate(10 ${(20 + H - 40) / 2}) rotate(-90)" text-anchor="middle">${x.yl}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${x.title}">${s}</svg>`;
}
function marker(m, x, y, c) {
  const f = `fill="var(--surface)" stroke="${c}" stroke-width="1.7"`;
  if (m === "s") return `<rect x="${x - 3.4}" y="${y - 3.4}" width="6.8" height="6.8" fill="${c}"/>`;
  if (m === "c") return `<circle cx="${x}" cy="${y}" r="3.7" ${f}/>`;
  if (m === "t") return `<path d="M${x} ${y - 4.5}L${x + 4.3} ${y + 3}L${x - 4.3} ${y + 3}Z" ${f}/>`;
  if (m === "v") return `<path d="M${x} ${y + 4.5}L${x + 4.3} ${y - 3}L${x - 4.3} ${y - 3}Z" ${f}/>`;
  if (m === "d") return `<path d="M${x} ${y - 4.6}L${x + 4.6} ${y}L${x} ${y + 4.6}L${x - 4.6} ${y}Z" ${f}/>`;
  return "";
}
const SC = ["var(--s1)", "var(--s2)", "var(--s3)", "var(--s4)", "var(--s5)"];
const DASH = ["", "6 3", "2 3", "8 3 2 3", "4 2"];
function line(x) {
  const W = 370, H = 270, F = frame(x, W, H, 38, 14, 12, 26);
  let s = F.s;
  x.series.forEach((se, i) => {
    s += `<path d="M${se.d.map(p => F.sx(p[0]).toFixed(1) + " " + F.sy(p[1]).toFixed(1)).join("L")}" fill="none" stroke="${SC[i]}" stroke-width="1.9" stroke-dasharray="${DASH[i]}"/>`;
    se.d.forEach(p => { s += marker(se.m, F.sx(p[0]), F.sy(p[1]), SC[i]); });
  });
  s += `<text transform="translate(10 ${(12 + H - 26) / 2}) rotate(-90)" text-anchor="middle">${x.yl}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${x.title}">${s}</svg>`;
}
function legend(x) { return `<div class="legend">${x.series.map((se, i) => `<span><i style="background:${SC[i]}"></i>${se.n}</span>`).join("")}</div>`; }
function rng(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function panelData() {
  const gauss = r => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
  const mk = (seed, f) => { const r = rng(seed), o = []; for (let i = 0; i < 60; i++) { const x = r() * 2 - 1; o.push([x, f(x, gauss(r))]); } return o; };
  return { A: mk(11, (x, e) => x + e * .12), B: mk(23, (x, e) => -.35 * x + e * .55), C: mk(37, (x, e) => 1.5 * x * x - .75 + e * .08), D: mk(41, (x, e) => e * .5) };
}
function panels() {
  const d = panelData(); let o = "";
  Object.keys(d).forEach((k, i) => {
    const X = (i % 2) * 180, Y = Math.floor(i / 2) * 170, S2 = 150;
    o += `<rect x="${X + 18}" y="${Y + 14}" width="${S2}" height="${S2 - 10}" fill="none" stroke="var(--line)"/><text class="pl" x="${X + 2}" y="${Y + 24}" style="font-size:14px">${k}</text>`;
    d[k].forEach(p => { const cx = X + 18 + S2 / 2 + p[0] * 68, cy = Y + 14 + (S2 - 10) / 2 - Math.max(-1.25, Math.min(1.25, p[1])) * 54; o += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="2.3" fill="var(--accent)"/>`; });
  });
  return `<svg viewBox="0 0 360 340" role="img" aria-label="Patru nori de puncte, A, B, C și D">${o}</svg>`;
}

/* Panou */
function topicStats(t) {
  const list = Q.filter(o => o.t === t);
  let seen = 0, ok = 0;
  list.forEach(o => { const r = S.q[o.id]; if (r) { seen++; if (r.c) ok++; } });
  return { n: list.length, seen, ok, p: pct(ok, list.length) };
}
function viewHome() {
  const d = daysLeft();
  const all = Object.values(S.q), right = all.filter(r => r.c).length;
  const known = CD.filter(c => (S.c[c.id] || 0) >= 2).length;
  const best = S.hist.length ? Math.max(...S.hist.map(h => h.s)) : null;
  const when = d > 1 ? `Examen în ${d} zile, 12 noiembrie` : d === 1 ? "Examen mâine, 12 noiembrie" : d === 0 ? "Examenul e azi" : "Examenul din 12 noiembrie a trecut";
  const rows = Object.keys(TOPICS).map(t => { const s = topicStats(t); return `<button class="topic" data-go="grile" data-topic="${t}"><span class="row spread"><span>${TOPICS[t]}</span><span class="mono mute">${s.ok}/${s.n}</span></span><span class="bar"><i class="${barClass(s.p)}" style="width:${s.p}%"></i></span></button>`; }).join("");
  let weak = "";
  const seen = Object.keys(TOPICS).map(t => [t, topicStats(t)]).filter(a => a[1].seen >= 3).sort((a, b) => a[1].ok / a[1].seen - b[1].ok / b[1].seen);
  if (seen.length) weak = `<button class="btn" data-go="grile" data-topic="${seen[0][0]}">Exersează capitolul cel mai slab: ${TOPICS[seen[0][0]]}</button>`;
  app.innerHTML = `
  <section class="hero">
    <div class="sig">p &lt; 0,05 · ${when}</div>
    <h1>Grilă Modelare Matematică</h1>
    <div class="stats">
      <div class="stat"><b>${right}/${Q.length}</b><span>grile corecte</span></div>
      <div class="stat"><b>${known}/${CD.length}</b><span>carduri știute</span></div>
      <div class="stat"><b>${best === null ? "–" : best + "/30"}</b><span>cea mai bună simulare</span></div>
    </div>
    <a class="big" href="#simulare">${S.ex ? "Continuă simularea începută" : "Simulare: 30 de întrebări, 30 de minute"}</a>
  </section>
  <button class="big" data-go="grile" data-mode="tabele">📊 Antrenament nelimitat: tabele și grafice</button>
  ${weak}
  <div class="row"><a class="btn grow" href="#flash" style="text-align:center;text-decoration:none;color:inherit">Flashcarduri</a><a class="btn grow" href="#grile" style="text-align:center;text-decoration:none;color:inherit">Grile pe capitole</a></div>
  ${installBox()}
  <section class="panel"><h2>Progres pe capitole</h2><p class="mute">Atinge un capitol ca să exersezi din el.</p><div>${rows}</div></section>`;
}
let deferredInstall = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredInstall = e; if (route() === "panou" && !S.ex) render(); });
function installBox() {
  if (window.claude) return "";
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  if (standalone) return "";
  if (deferredInstall) return `<button class="btn pri" data-act="install">Instalează aplicația pe telefon</button>`;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  return `<p class="mute">${ios ? "Pe iPhone: în Safari apasă Share, apoi Add to Home Screen." : "Pe telefon: din meniul browserului alege Instalează aplicația sau Adaugă pe ecranul de pornire."}</p>`;
}

/* Flashcarduri */
let F = { t: "toate", queue: null, flip: false, done: 0 };
function buildDeck() {
  let d = CD.filter(c => F.t === "toate" ? true : c.t === F.t);
  d = shuffle(d).sort((a, b) => (S.c[a.id] || 0) - (S.c[b.id] || 0));
  F.queue = d.map(c => c.id); F.flip = false; F.done = 0;
}
function chips(cur, act) { return `<div class="chips"><button class="chip ${cur === "toate" ? "on" : ""}" data-act="${act}" data-v="toate">Toate</button>${Object.keys(TOPICS).map(t => `<button class="chip ${cur === t ? "on" : ""}" data-act="${act}" data-v="${t}">${TOPICS[t]}</button>`).join("")}</div>`; }
function fcActions() {
  return F.flip ? `<div class="rate"><button class="btn n" data-act="fc-rate" data-v="0">Nu știam</button><button class="btn" data-act="fc-rate" data-v="1">Greu</button><button class="btn y" data-act="fc-rate" data-v="2">Știam</button></div>` : `<button class="btn pri" data-act="fc-flip">Arată răspunsul</button>`;
}
function viewFlash() {
  if (!F.queue) buildDeck();
  const total = F.queue.length + F.done;
  let body;
  if (!F.queue.length) {
    body = `<section class="panel"><h2>Ai terminat acest pachet</h2><p>Reia-l sau alege alt capitol. Cardurile pe care le-ai marcat „Nu știam” au apărut până când le-ai știut.</p><button class="btn pri" data-act="fc-restart">Reia pachetul</button></section>`;
  } else {
    const c = CD.find(x => x.id === F.queue[0]);
    body = `<div class="qmeta"><span>${F.done + 1} din ${total}</span><span>${TOPICS[c.t]}</span></div>
    <div><button class="flash ${F.flip ? "flip" : ""}" data-act="fc-flip" aria-label="Întoarce cardul">
      <span class="face front"><span class="tag">Întrebare</span><span class="f">${c.f}</span><span class="hint">Atinge ca să vezi răspunsul</span></span>
      <span class="face back"><span class="tag">${c.f}</span><span class="b">${c.b}</span></span>
    </button></div>
    <div id="fcActions" class="stack">${fcActions()}</div>`;
  }
  app.innerHTML = `<h1>Flashcarduri</h1>${chips(F.t, "fc-topic")}${body}`;
}
function rateCard(v) {
  const id = F.queue.shift();
  if (v === 2) { S.c[id] = Math.min(3, (S.c[id] || 0) + 1); F.done++; }
  else if (v === 1) { S.c[id] = Math.max(1, S.c[id] || 1); F.queue.push(id); }
  else { S.c[id] = 0; F.queue.splice(Math.min(3, F.queue.length), 0, id); }
  F.flip = false; save(); render();
}

/* Grile pe capitole */
let P = { t: "toate", mode: "tot", queue: null, cur: null, ans: null, ok: 0, n: 0 };
function buildPractice() {
  if (P.mode === "tabele") { P.queue = []; P.ok = 0; P.n = 0; nextPractice(); return; }
  let l = Q.filter(o => P.t === "toate" ? true : o.t === P.t);
  if (P.mode === "gresite") l = l.filter(o => S.q[o.id] && !S.q[o.id].c);
  if (P.mode === "noi") l = l.filter(o => !S.q[o.id]);
  const rank = o => { const r = S.q[o.id]; return !r ? 1 : r.c ? 2 : 0; };
  P.queue = shuffle(l).sort((a, b) => rank(a) - rank(b)).map(o => o.id);
  P.ok = 0; P.n = 0; nextPractice();
}
function nextPractice() {
  P.ans = null;
  let id = P.queue.shift();
  if (!id && P.mode === "tabele") { const it = drillMake(P.t === "toate" ? null : P.t); id = it ? it.id : null; }
  P.cur = id ? { id, o: orderFor(QM[id]) } : null;
}
function orderFor(q) { return q.x === "panels" ? [0, 1, 2, 3].sort((a, b) => q.a[a] < q.a[b] ? -1 : 1) : shuffle([0, 1, 2, 3]); }
function optsHTML(q, order, chosen, reveal, act) {
  return `<div class="opts">${order.map((ai, i) => {
    let c = "";
    if (reveal) { if (ai === 0) c = "right"; else if (ai === chosen) c = "wrong"; }
    else if (ai === chosen) c = "sel";
    return `<button class="opt ${c}" data-act="${act}" data-v="${ai}"><span class="l">${LET[i]}</span><span>${q.a[ai]}</span></button>`;
  }).join("")}</div>`;
}
function viewPractice() {
  if (!P.queue) buildPractice();
  const modes = [["tabele", "📊 Tabele și grafice ∞"], ["tot", "Toate"], ["noi", "Nevăzute"], ["gresite", "Greșite"]];
  const head = `<h1>Grile</h1>${chips(P.t, "p-topic")}<div class="chips">${modes.map(m => `<button class="chip ${P.mode === m[0] ? "on" : ""}" data-act="p-mode" data-v="${m[0]}">${m[1]}</button>`).join("")}</div>`;
  if (!P.cur) {
    const msg = P.n ? `Ai răspuns corect la ${P.ok} din ${P.n}.` : P.mode === "gresite" ? "Nu ai nicio întrebare greșită aici." : "Nu mai sunt întrebări nevăzute aici.";
    app.innerHTML = `${head}<section class="panel"><h2>Gata cu această serie</h2><p>${msg}</p><button class="btn pri" data-act="p-restart">Începe din nou</button></section>`;
    return;
  }
  const q = QM[P.cur.id], done = P.ans !== null;
  app.innerHTML = `${head}
  <div class="qmeta"><span>${TOPICS[q.t]} · ${P.mode === "tabele" ? "exercițiu nou, generat" : "mai sunt " + (P.queue.length + 1)}</span><span>${P.n ? `${P.ok}/${P.n} corecte` : ""}</span></div>
  ${q.x ? exhibit(q.x) : ""}
  <p class="qt">${q.q}</p>
  ${optsHTML(q, P.cur.o, P.ans, done, "p-ans")}
  ${done ? `<div class="ex ${P.ans === 0 ? "ok" : "no"}"><b>${P.ans === 0 ? "Corect" : "Greșit"}</b><p>${q.e}</p><p class="mute">Sursa: ${q.s}</p></div><button class="btn pri" data-act="p-next">Următoarea întrebare</button>` : ""}`;
}
function record(id, ok) { if (String(id).startsWith("D-")) return; const r = S.q[id] || { n: 0 }; r.n++; r.c = ok ? 1 : 0; S.q[id] = r; }

/* Simulare */
// Format examen: 20 de întrebări pe tabele și grafice (12 din bancă, 8 generate) și 10 de concepte.
function makeExamData() {
  const seen = o => (S.q[o.id] || { n: 0 }).n;
  const ex = shuffle(Q.filter(o => o.x && (S.c1 || o.t !== "c1"))).sort((a, b) => seen(a) - seen(b));
  const ids = [], usedX = {};
  for (const o of ex) { if (ids.length >= 12) break; if ((usedX[o.x] || 0) >= 1) continue; usedX[o.x] = 1; ids.push(o.id); }
  const gen = {}, kinds = ["spss", "spss", "spss", "gra", "gra", "cor", "fac", "clu", "reg"];
  for (const k of shuffle(kinds).slice(0, 8)) { const it = drillMake(k); if (it) { ids.push(it.id); gen[it.id] = drillSnapshot(it.id); } }
  const bp = { mas: 2, dist: 1, cor: 1, err: 2, esa: 2, fac: 1, ret: 1 };
  if (S.c1) { bp.c1 = 1; bp.ret = 0; }
  Object.keys(bp).forEach(t => {
    const pool = shuffle(Q.filter(o => o.t === t && !o.x)).sort((a, b) => seen(a) - seen(b));
    pool.slice(0, bp[t]).forEach(o => ids.push(o.id));
  });
  return { items: shuffle(ids).map(id => ({ id, o: orderFor(QM[id]), a: null, f: false })), gen };
}
function makeExam() {
  const bp = Object.assign({}, BLUEPRINT);
  if (!S.c1) { delete bp.c1; bp.spss += 1; }
  const ids = [];
  Object.keys(bp).forEach(t => {
    const pool = shuffle(Q.filter(o => o.t === t)).sort((a, b) => ((S.q[a.id] || { n: 0 }).n) - ((S.q[b.id] || { n: 0 }).n));
    const usedX = {}; let got = 0;
    for (const o of pool) {
      if (got >= bp[t]) break;
      if (o.x) { if ((usedX[o.x] || 0) >= 2) continue; usedX[o.x] = (usedX[o.x] || 0) + 1; }
      ids.push(o.id); got++;
    }
  });
  return shuffle(ids).map(id => ({ id, o: orderFor(QM[id]), a: null, f: false }));
}
let confirmEnd = false, showGrid = false, review = false;
function viewExamStart() {
  const res = S.last && review ? viewResults() : null;
  if (res) return;
  const hist = S.hist.slice(-5).reverse().map(h => `<div class="row spread"><span class="mono">${h.s}/30</span><span class="mono mute">${fmt(h.s / 30 * 2.5, 2)} p</span><span class="mute">${new Date(h.d).toLocaleDateString("ro-RO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span></div>`).join("");
  app.innerHTML = `<h1>Simulare de examen</h1>
  <section class="panel">
    <h2>30 de întrebări, 30 de minute</h2>
    <p>Întrebările sunt amestecate după capitole, cu accent pe tabele SPSS, corelație, semnificație și grafice. Vezi răspunsurile doar la final. Prioritate au întrebările pe care le-ai văzut mai rar.</p>
    <label class="toggle" for="c1"><input id="c1" type="checkbox" ${S.c1 ? "checked" : ""} data-act="toggle-c1"><span>Include și Cursul 1. Fișa de notare trece grila doar pe cursurile 2, 4, 5 și 6.</span></label>
    <p class="mute">Cursul 3 (Cauzalitate) nu apare. Am presupus câte un singur răspuns corect pe întrebare.</p>
    <label class="toggle" for="fmt"><input id="fmt" type="checkbox" ${S.fmt !== false ? "checked" : ""} data-act="toggle-fmt"><span>Format examen: aproximativ două treimi întrebări pe tabele și grafice, inclusiv tabele noi, generate.</span></label>
    <button class="big" data-act="ex-start">Începe simularea</button>
    <button class="btn pri" data-act="ex-curs">Test în formatul din curs: tabele, matrici, grafice</button>
    <button class="btn pri" data-act="ex-greu">Test greu: capcanele din curs (30 de întrebări)</button>
  </section>
  ${S.last ? `<button class="btn" data-act="ex-review">Vezi corectura ultimei simulări</button>` : ""}
  ${hist ? `<section class="panel"><h2>Ultimele simulări</h2>${hist}</section>` : ""}`;
}
function timeLeft() { return Math.max(0, EXAM_SEC - Math.floor((Date.now() - S.ex.start) / 1000)); }
function mmss(s) { return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }
function viewExam() {
  const E = S.ex, it = E.items[E.i], q = QM[it.id], left = timeLeft();
  const answered = E.items.filter(x => x.a !== null).length;
  const grid = `<section class="panel"><div class="row spread"><h2>Toate întrebările</h2><span class="mono mute">${answered}/30</span></div><div class="gridq">${E.items.map((x, i) => `<button class="${x.a !== null ? "a" : ""} ${x.f ? "f" : ""} ${i === E.i ? "cur" : ""}" data-act="ex-go" data-v="${i}">${i + 1}</button>`).join("")}</div>
  ${confirmEnd ? `<p>${answered < 30 ? `Ai ${30 - answered} întrebări fără răspuns.` : "Ai răspuns la toate întrebările."} Predai testul?</p><div class="row"><button class="btn grow" data-act="ex-cancel">Mă mai uit</button><button class="btn pri grow" data-act="ex-finish">Da, predau</button></div>` : `<button class="btn" data-act="ex-end">Predă testul</button>`}</section>`;
  app.innerHTML = `<div class="topbar"><span class="timer ${left < 300 ? "warn" : ""}" id="tm">${mmss(left)}</span><span class="mono mute">${E.i + 1}/30</span><button class="btn" data-act="ex-grid">${showGrid ? "Închide" : "Toate"}</button></div>
  ${showGrid ? grid : ""}
  <div class="qmeta"><span>${TOPICS[q.t]}</span></div>
  ${q.x ? exhibit(q.x) : ""}
  <p class="qt">${q.q}</p>
  ${optsHTML(q, it.o, it.a, false, "ex-ans")}
  <div class="dock"><div><button class="btn grow" data-act="ex-prev" ${E.i === 0 ? "disabled" : ""}>Înapoi</button><button class="btn" data-act="ex-flag" aria-pressed="${it.f}">${it.f ? "★" : "☆"}</button>${E.i === 29 ? `<button class="btn pri grow" data-act="ex-grid-end">Predă</button>` : `<button class="btn pri grow" data-act="ex-next">Înainte</button>`}</div></div>`;
}
function finishExam() {
  const E = S.ex; let s = 0; const by = {};
  E.items.forEach(x => { const q = QM[x.id], ok = x.a === 0; if (ok) s++; if (x.a !== null) record(x.id, ok); else record(x.id, false); by[q.t] = by[q.t] || [0, 0]; by[q.t][1]++; if (ok) by[q.t][0]++; });
  S.last = { items: E.items, gen: E.gen || {}, s, by, d: Date.now(), sec: Math.min(EXAM_SEC, Math.floor((Date.now() - E.start) / 1000)) };
  S.hist.push({ s, d: Date.now() });
  S.ex = null; review = true; confirmEnd = false; showGrid = false; save(); render(); window.scrollTo(0, 0);
}
function viewResults() {
  const L = S.last;
  const wrong = L.items.filter(x => x.a !== 0);
  const bars = Object.keys(L.by).sort((a, b) => L.by[a][0] / L.by[a][1] - L.by[b][0] / L.by[b][1]).map(t => { const v = L.by[t], p = pct(v[0], v[1]); return `<div class="stack" style="gap:3px"><div class="row spread"><span>${TOPICS[t]}</span><span class="mono mute">${v[0]}/${v[1]}</span></div><div class="bar"><i class="${barClass(p)}" style="width:${p}%"></i></div></div>`; }).join("");
  const items = L.items.map((x, i) => { const q = QM[x.id], c = x.a === 0; return `<div class="rev"><div class="qmeta"><span>${i + 1} · ${TOPICS[q.t]}</span><span>${x.a === null ? "fără răspuns" : c ? "corect" : "greșit"}</span></div>${q.x ? exhibit(q.x) : ""}<p class="qt">${q.q}</p>${optsHTML(q, x.o, x.a, true, "noop")}<div class="ex"><p>${q.e}</p><p class="mute">Sursa: ${q.s}</p></div></div>`; }).join("");
  app.innerHTML = `<h1>Rezultat</h1>
  <section class="panel"><div class="score">${L.s}/30</div><p class="mono">${fmt(L.s / 30 * 2.5, 2)} din 2,5 puncte · ${mmss(L.sec)} folosite</p><p class="mute">Calculat fără penalizare pentru răspunsuri greșite.</p>
  <div class="row"><button class="btn pri grow" data-act="ex-new">Simulare nouă</button>${wrong.length ? `<button class="btn grow" data-act="ex-wrong">Exersează greșelile</button>` : ""}</div></section>
  <section class="panel"><h2>Pe capitole</h2>${bars}</section>
  <section class="stack"><h2>Corectură</h2>${items}</section>`;
  return true;
}

/* Rutare și acțiuni */
function route() { const h = location.hash.slice(1); return ["feed", "panou", "flash", "grile", "simulare"].includes(h) ? h : "feed"; }
function render() {
  const r = route();
  const inExam = r === "simulare" && !!S.ex;
  document.body.classList.toggle("exam", inExam);
  document.querySelectorAll("#nav a").forEach(a => a.classList.toggle("on", a.dataset.r === r));
  document.body.classList.toggle("feedmode", r === "feed");
  app.hidden = r === "feed";
  if (r === "feed") { fdShow(); return; }
  fdHide();
  if (r === "panou") viewHome();
  else if (r === "flash") viewFlash();
  else if (r === "grile") viewPractice();
  else if (S.ex) viewExam();
  else viewExamStart();
}
function toTop() { window.scrollTo(0, 0); }
app.addEventListener("click", ev => {
  const el = ev.target.closest("[data-act],[data-go]"); if (!el) return;
  if (el.dataset.go) { P.t = el.dataset.topic || "toate"; P.mode = el.dataset.mode || "tot"; P.queue = null; location.hash = el.dataset.go; if (route() === el.dataset.go) render(); return; }
  const a = el.dataset.act, v = el.dataset.v, E = S.ex;
  if (a === "toggle-c1") { S.c1 = el.checked; save(); return; }
  if (a === "toggle-fmt") { S.fmt = el.checked; save(); return; }
  if (a === "noop") return;
  if (a === "install" && deferredInstall) { deferredInstall.prompt(); deferredInstall = null; render(); return; }
  if (a === "fc-topic") { F.t = v; F.queue = null; }
  else if (a === "fc-flip") { F.flip = !F.flip; document.querySelector(".flash").classList.toggle("flip", F.flip); document.getElementById("fcActions").innerHTML = fcActions(); return; }
  else if (a === "fc-rate") { rateCard(+v); return; }
  else if (a === "fc-restart") { F.queue = null; }
  else if (a === "p-topic") { P.t = v; P.queue = null; }
  else if (a === "p-mode") { P.mode = v; P.queue = null; }
  else if (a === "p-restart") { P.queue = null; }
  else if (a === "p-ans") {
    if (P.ans !== null) return;
    P.ans = +v; P.n++; const ok = P.ans === 0; if (ok) P.ok++;
    record(P.cur.id, ok);
    if (!ok) P.queue.splice(Math.min(4, P.queue.length), 0, P.cur.id);
    save();
  }
  else if (a === "p-next") { nextPractice(); render(); toTop(); return; }
  else if (a === "ex-greu") {
    S.ex = { items: shuffle(HC_IDS).map(id => ({ id, o: orderFor(QM[id]), a: null, f: false })), gen: {}, i: 0, start: Date.now() };
    review = false; save(); render(); toTop(); startTick(); return;
  }
  else if (a === "ex-curs") {
    const extra = Q.filter(o => o.x === "panels").slice(0, 2).concat(Q.filter(o => o.x === "fig20").slice(0, 3), Q.filter(o => o.x === "prac").slice(0, 2));
    const ids = TC_IDS.concat(extra.map(o => o.id)).slice(0, 30);
    S.ex = { items: shuffle(ids).map(id => ({ id, o: orderFor(QM[id]), a: null, f: false })), gen: {}, i: 0, start: Date.now() };
    review = false; save(); render(); toTop(); startTick(); return;
  }
  else if (a === "ex-start") { let items, gen = {}; if (S.fmt !== false) { const d = makeExamData(); items = d.items; gen = d.gen; } else items = makeExam(); S.ex = { items, gen, i: 0, start: Date.now() }; review = false; save(); render(); toTop(); startTick(); return; }
  else if (a === "ex-ans") { const it = E.items[E.i], n = +v; it.a = it.a === n ? null : n; save(); }
  else if (a === "ex-next") { E.i = Math.min(29, E.i + 1); confirmEnd = false; save(); render(); toTop(); return; }
  else if (a === "ex-prev") { E.i = Math.max(0, E.i - 1); confirmEnd = false; save(); render(); toTop(); return; }
  else if (a === "ex-go") { E.i = +v; showGrid = false; confirmEnd = false; save(); render(); toTop(); return; }
  else if (a === "ex-flag") { E.items[E.i].f = !E.items[E.i].f; save(); }
  else if (a === "ex-grid") { showGrid = !showGrid; confirmEnd = false; render(); toTop(); return; }
  else if (a === "ex-grid-end") { showGrid = true; confirmEnd = true; render(); toTop(); return; }
  else if (a === "ex-end") { confirmEnd = true; }
  else if (a === "ex-cancel") { confirmEnd = false; }
  else if (a === "ex-finish") { finishExam(); return; }
  else if (a === "ex-review") { review = true; render(); toTop(); return; }
  else if (a === "ex-new") { review = false; }
  else if (a === "ex-wrong") { P.t = "toate"; P.mode = "gresite"; P.queue = null; location.hash = "grile"; return; }
  const y = window.scrollY; render(); window.scrollTo(0, y);
});
document.getElementById("nav").addEventListener("click", ev => { if (ev.target.closest('a[href="#simulare"]') && !S.ex) review = false; });
let tick = null;
function startTick() {
  if (tick) return;
  tick = setInterval(() => {
    if (!S.ex) { clearInterval(tick); tick = null; return; }
    const left = timeLeft();
    if (left <= 0) { if (route() !== "simulare") location.hash = "simulare"; finishExam(); return; }
    const el = document.getElementById("tm");
    if (el) { el.textContent = mmss(left); el.classList.toggle("warn", left < 300); }
  }, 1000);
}
window.addEventListener("hashchange", () => { render(); toTop(); });
drillRestore(S.ex && S.ex.gen); drillRestore(S.last && S.last.gen);
if (S.ex) { if (timeLeft() <= 0) finishExam(); else startTick(); }
render();
connectSync();
if (!window.claude && "serviceWorker" in navigator && location.protocol === "https:") {
  const hadWorker = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (hadWorker && !reloaded) { reloaded = true; location.reload(); } });
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
