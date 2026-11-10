"use strict";
// Feed vertical: un ecran, o idee. Se încarcă înainte de app.js; folosește S, Q, CD abia la rulare.
const FD = { lastScroll: 0, items: [], cur: -1, on: false, filter: "story", si: 0, ended: false, pi: 0, retry: [], voice: false, au: null, tok: 0, timer: null, lastT: null, recent: [], ok: 0, tot: 0, ready: false, pool: null, lastTap: 0, io: null, seenThis: 0, sheet: false };
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
  STORY.forEach(it => { FD.byId[it.id] = it; });
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
  if (FD.filter === "story") {
    if (FD.si < STORY.length) return STORY[FD.si++];
    if (!FD.ended) { FD.ended = true; return { k: "E", id: "END", t: "" }; }
    return null;
  }
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
    FD.items.push({ it, ans: null, rev: false, opts: it.k === "Q" || it.k === "K" ? orderFor(it) : null });
    const a = document.createElement("article");
    a.className = "reel"; a.dataset.i = i;
    a.style.background = FD_COLORS[i % FD_COLORS.length][0];
    box.appendChild(a);
    FD.io.observe(a);
  }
  if (!FD.items.length) box.innerHTML = `<article class="reel"><div class="rmid"><h2 class="rhook">Nu ai nimic aici încă</h2><p class="rsub">Salvează reels cu ❤ sau alege alt capitol.</p></div></article>`;
}

/* Afișarea fiecărui reel */
function fdArt(i) { return document.querySelector(`.reel[data-i="${i}"]`); }
function fdRail(e) { const on = fdState().saved.indexOf(e.it.id) >= 0; return e.it.k === "M" || e.it.k === "E" ? "" : `<div class="rail"><button class="rb ${on ? "on" : ""}" data-fa="save" aria-label="Salvează">${on ? "❤️" : "🤍"}<small>Salvează</small></button></div>`; }
function fdTag(t) { return t ? `<span class="rtag">${TOPICS[t] || ""}</span>` : ""; }
function fdFill(i) {
  const a = fdArt(i), e = FD.items[i]; if (!a || a.dataset.f) return;
  a.dataset.f = "1"; a.dataset.k = e.it.k;
  const it = e.it, col = FD_COLORS[i % FD_COLORS.length][1];
  a.style.setProperty("--rc", col);
  let h = "";
  if (it.k === "P") {
    const ep = EPISODES[it.ep - 1], parts = STORY.filter(s => s.k === "P").length, n = fdStages(it).length;
    h = `<div class="stg ${it.x ? "x" : ""}"><div class="segs">${"<i></i>".repeat(n)}</div><div class="sth"><b>PART ${it.part}</b><span>din ${parts} · Episodul ${it.ep}: ${ep.title}</span></div>${it.x ? `<div class="rx">${exhibit(it.x)}</div>` : ""}<div class="stb"></div><div class="tap">Atinge: înainte · marginea stângă: înapoi</div></div>`;
  } else if (it.k === "K") {
    h = `<div class="rq"><div class="sth"><b>VERIFICARE</b><span>Episodul ${it.ep}: ${EPISODES[it.ep - 1].title}</span></div><h2 class="qtx">${it.q}</h2>${e.opts.map((ai, n) => `<button class="ro" data-fa="q" data-v="${ai}"><b>${LET[n]}</b><span>${it.a[ai]}</span></button>`).join("")}<div class="fb"></div></div>`;
  } else if (it.k === "E") {
    h = `<div class="rmid"><p class="rkick">Finalul serialului</p><h2 class="rhook">Ai parcurs toată materia.</h2><p class="rsub">Acum încearcă o simulare sau recapitulează cu reels-urile din Mix.</p><a class="rcta" href="#simulare">Începe o simulare</a></div>`;
  } else if (it.k === "L") {
    h = `<div class="rmid">${fdTag(it.t)}<h2 class="rhook">${it.h}</h2><div class="rbeats">${it.b.map(b => `<p class="bt">${fdMark(b)}</p>`).join("")}<p class="bt memo">${it.m}</p></div></div><div class="swipe">⌃ swipe</div>`;
  } else if (it.k === "C") {
    h = `<div class="rmid">${fdTag(it.t)}<p class="rkick">Știi asta?</p><h2 class="rhook">${it.f}</h2><div class="cback ${e.rev ? "on" : ""}">${it.b}</div>${e.rev ? fdCardBtns(e) : `<p class="rsub">Atinge ecranul pentru răspuns</p>`}</div>`;
  } else if (it.k === "T") {
    h = `<div class="rmid">${fdTag(it.t)}<p class="rkick">Adevăr sau minciună?</p><h2 class="rhook sm">${it.s}</h2><div class="two">${e.ans === null ? `<button class="tf no" data-fa="tf" data-v="0">MINCIUNĂ</button><button class="tf yes" data-fa="tf" data-v="1">ADEVĂR</button>` : ""}</div><div class="fb"></div></div>`;
  } else if (it.k === "S") {
    const q = it.mode === "sem" ? "Semnificativ la 0,05?" : "Ce sens are relația?";
    const shown = it.mode === "sem" ? it.r.replace(/\*/g, "") : it.r;
    const btns = it.mode === "sem" ? `<button class="tf no" data-fa="s" data-v="0">NU</button><button class="tf yes" data-fa="s" data-v="1">DA</button>` : `<button class="tf no" data-fa="s" data-v="0">NEGATIV</button><button class="tf yes" data-fa="s" data-v="1">POZITIV</button>`;
    h = `<div class="rmid">${fdTag("spss")}<p class="rkick">Citește celula SPSS</p><div class="cell"><div class="cname">${it.a} <i>×</i> ${it.b}</div><div class="crow"><span>Pearson</span><b>${shown}</b></div><div class="crow"><span>Sig.</span><b>${it.sig}</b></div><div class="crow"><span>N</span><b>${it.n}</b></div></div><h2 class="rhook sm">${q}</h2><div class="two">${e.ans === null ? btns : ""}</div><div class="fb"></div></div>`;
  } else if (it.k === "Q") {
    h = `<div class="rq">${fdTag(it.t)}${it.x ? `<div class="rx">${exhibit(it.x)}</div>` : ""}<h2 class="qtx">${it.q}</h2>${e.opts.map((ai, n) => `<button class="ro" data-fa="q" data-v="${ai}"><b>${LET[n]}</b><span>${it.a[ai]}</span></button>`).join("")}<div class="fb"></div></div>`;
  } else if (it.k === "M") {
    const st = fdState();
    h = `<div class="rmid"><p class="rkick">Check-up rapid</p><h2 class="rhook">${FD.seenThis} reels. Fără să observi.</h2><p class="rstat">${FD.ok}/${FD.tot} corecte azi · ✨ ${st.xp} aură</p><p class="rstat">Lecții văzute: ${REELS.filter(r => st.seen[r.id]).length}/${REELS.length}</p><a class="rcta" href="#simulare">Încearcă o simulare</a><p class="rsub">sau dă swipe mai departe</p></div>`;
  }
  a.innerHTML = h + fdRail(e);
  if (e.ans !== null) fdPaint(a, e);
  if (it.k === "P") fdPartShow(i, false);
  if (it.k === "L" && e.rev) a.querySelectorAll(".bt").forEach(b => b.classList.add("on"));
}
function fdCardBtns() { return `<div class="two"><button class="tf no" data-fa="card" data-v="0">Nu știam</button><button class="tf yes" data-fa="card" data-v="2">Știam</button></div>`; }
function fdEvict() { document.querySelectorAll(".reel[data-f]").forEach(a => { if (Math.abs(+a.dataset.i - FD.cur) > 5) { a.innerHTML = ""; delete a.dataset.f; } }); }
function fdPaint(a, e) {
  const it = e.it, fb = a.querySelector(".fb"), good = e.ok;
  if (it.k === "Q" || it.k === "K") {
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


/* Serial: etapele unei părți */
const FD_W = { "Valorile extreme": "out", "Tăria lui r": "r", "De ce depinde Sig.": "sig" };
function fdTerms(it) {
  const out = [];
  it.b.forEach(b => { const re = /\*\*([^*]{3,26})\*\*/g; let m; while ((m = re.exec(b.replace(/\\\*/g, "")))) { const t = m[1].trim(); if (!/[\d=≈:.,]/.test(t) && t.split(" ").length <= 3) out.push({ t, b }); } });
  return out;
}
// Completări alese manual: propoziția are sens singură, iar variantele greșite sunt plauzibile.
const FD_CL = { "datele": ["variabila", "cazul"], "dummy": ["ordinale", "nominale"], "corelează": ["compun constructul", "au medii egale"], "validitatea": ["fidelitatea", "amplitudinea"], "distribuția": ["media", "variabila"], "Modul": ["Mediana", "Media"], "variabilitate": ["medie", "asociere"], "Abaterea standard": ["Amplitudinea", "Mediana"], "coincid": ["diferă mult", "sunt zero"], "asociate": ["egale", "independente"], "r negativ": ["r pozitiv", "r = 0"], "Teoretic": ["Simplu aleatoriu", "Sistematic"], "doar din întâmplare": ["din cauza unei terțe variabile", "pentru că relația este puternică"], "ambele": ["una singură", "niciuna"], "la întâmplare": ["din cauza vârstei", "prin tragere la sorți"], "accesul la educație": ["genul", "vârsta"], "bogăția țării": ["ciocolata", "numărul de magazine"], "cartierul": ["numărul de camere", "prețul"], "verigă intermediară": ["cauză comună", "corelație coincidentală"], "pe coloane": ["pe diagonală", "pe ultimul rând"], "cazuri": ["variabile", "factori"], "unui singur": ["fiecărui", "mai multor"], "Beta": ["R²", "Sig."], "Homofilie": ["Contagiune", "Centralitate"], "clasificare": ["demonstrație", "interpretare"] };
function fdCloze(it) {
  if (it.part < 2 || it.x) return null;
  const prev = STORY.filter(s => s.k === "P" && s.part === it.part - 1)[0]; if (!prev || prev.ep !== it.ep) return null;
  const ts = fdTerms(prev).filter(x => FD_CL[x.t] && !(x.t === "pe coloane" && /^Se citește/.test(x.b))); if (!ts.length) return null;
  const c = ts[ts.length - 1], r = fmRng(it.idx + 5);
  const opts = [c.t, ...FD_CL[c.t]].map(x => [r(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  const text = c.b.replace(/\\\*/g, "").replace("**" + c.t + "**", "@@").replace(/\*\*/g, "").replace("@@", '<u class="blank">?</u>');
  return { t: "cl", x: text, ok: c.t, opts, from: prev.part };
}
function fdStages(it) {
  if (it._st) return it._st;
  const s = [], cl = fdCloze(it);
  if (cl) s.push(cl);
  s.push({ t: "h", x: it.h });
  it.b.forEach(b => s.push({ t: "b", x: b }));
  if (it.v) s.push({ t: "v", x: it.v });
  if (FD_W[it.h]) s.push({ t: "w", w: FD_W[it.h] });
  if (it.m) s.push({ t: "n", x: it.m });
  return (it._st = s);
}
function fdMed(a) { const v = a.slice().sort((x, y) => x - y), m = v.length >> 1; return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2; }
function fdWidget(e, w) {
  if (w === "out") {
    const base = [21, 22, 22, 23, 24], v = e.wg ? base.concat(1000) : base, mean = v.reduce((x, y) => x + y, 0) / v.length;
    return `<div class="wg"><p class="wgt">Atinge butonul și urmărește cele două numere.</p><p class="bigv">${v.join(" · ")}</p><div class="wgr"><div><small>Media</small><b>${fmt(mean)}</b></div><div><small>Mediana</small><b>${fmt(fdMed(v))}</b></div></div><button class="tf yes" data-fa="wout">${e.wg ? "Scoate valoarea 1000" : "Adaugă valoarea 1000"}</button></div>`;
  }
  if (w === "r") return `<div class="wg"><p class="wgt">Trage de buton. Urmărește cum se schimbă norul.</p><div class="wplot" data-w="r"></div><p class="wval" id="wrv"></p><input class="wr" id="wrR" type="range" min="-100" max="100" step="5" value="${e.wr === undefined ? 60 : e.wr}" data-wid="r" aria-label="Valoarea lui r"></div>`;
  return `<div class="wg"><p class="wgt">Corelația rămâne r = −0,071. Mărește eșantionul.</p><p class="wval" id="wsv"></p><input class="wr" id="wrS" type="range" min="0" max="100" step="1" value="${e.ws === undefined ? 20 : e.ws}" data-wid="sig" aria-label="Mărimea eșantionului"></div>`;
}
function fdPhi(z) { const t = 1 / (1 + .2316419 * z), d = .3989423 * Math.exp(-z * z / 2); return 1 - d * t * (.3193815 + t * (-.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); }
function fdWidgetLive(a, e) {
  const sr = a.querySelector("#wrR"), ss = a.querySelector("#wrS");
  if (sr) {
    const r = +sr.value / 100; e.wr = +sr.value;
    const g = fmRng(9), gauss = () => Math.sqrt(-2 * Math.log(1 - g())) * Math.cos(6.283 * g());
    let d = "";
    for (let n = 0; n < 45; n++) { const x = gauss(), y = r * x + Math.sqrt(1 - r * r) * gauss(); d += `<circle cx="${(100 + x * 36).toFixed(1)}" cy="${(55 - y * 19).toFixed(1)}" r="2.6" fill="var(--rc)"/>`; }
    a.querySelector(".wplot").innerHTML = `<svg viewBox="0 0 200 110" role="img" aria-label="Nor de puncte">${d}</svg>`;
    const m = Math.abs(r), w = m === 1 ? "perfectă" : m > .5 ? "puternică" : m >= .3 ? "moderată" : m >= .1 ? "slabă" : "aproape nulă";
    a.querySelector("#wrv").innerHTML = `<b>r = ${fmt(r, 2)}</b> · ${r === 0 ? "fără legătură liniară" : (r > 0 ? "pozitivă" : "negativă") + ", " + w}`;
  }
  if (ss) {
    e.ws = +ss.value;
    const N = Math.round(20 * Math.pow(250, e.ws / 100)), r = .071, z = r * Math.sqrt(N - 2) / Math.sqrt(1 - r * r), p = 2 * (1 - fdPhi(z)), ok = p < .05;
    a.querySelector("#wsv").innerHTML = `<b>N = ${N.toLocaleString("ro-RO")}</b><br>Sig. ${p < .001 ? "< 0,001" : "= " + fmt(p, 3)}<br><span class="${ok ? "gd" : "bd"}">${ok ? "semnificativă, dar tot slabă" : "nesemnificativă"}</span>`;
  }
}
function fdPartShow(i, speak) {
  const e = FD.items[i], a = fdArt(i); if (!a) return;
  const list = fdStages(e.it); e.stage = Math.max(0, Math.min(e.stage || 0, list.length - 1));
  const s = list[e.stage], body = a.querySelector(".stb"); if (!body) return;
  a.querySelectorAll(".segs i").forEach((x, n) => x.classList.toggle("on", n <= e.stage));
  const hint = a.querySelector(".tap"), part = e.it.part;
  let h = "", say = "";
  if (s.t === "h") { h = `<h2 class="rhook">${s.x}</h2>`; say = s.x; }
  else if (s.t === "b") { h = `<p class="bigb">${fdMark(s.x)}</p>`; say = fdPlain(s.x); }
  else if (s.t === "v") { h = `<p class="bigv">${s.x}</p>`; say = s.x; }
  else if (s.t === "n") { h = `<p class="rkick">Urmează</p><h2 class="rhook">Part ${part + 1}</h2><p class="bigb">${s.x}</p>`; say = s.x; }
  else if (s.t === "w") { h = fdWidget(e, s.w); }
  else if (s.t === "cl") {
    const done = e.cl !== undefined;
    h = `<p class="rkick">Din Part ${s.from}: completează</p><p class="bigb">${done ? s.x.replace('<u class="blank">?</u>', `<mark>${s.ok}</mark>`) : s.x}</p><div class="cls">${s.opts.map(o => `<button class="ro cl ${done ? (o === s.ok ? "right" : o === e.cl ? "wrong" : "") : ""}" data-fa="cl" data-v="${o}" ${done ? "disabled" : ""}><span>${o}</span></button>`).join("")}</div>`;
  }
  body.innerHTML = h; body.classList.remove("in"); void body.offsetWidth; body.classList.add("in");
  if (hint) hint.textContent = s.t === "cl" && e.cl === undefined ? "Alege varianta corectă" : s.t === "n" ? "Atinge sau dă swipe la următoarea parte" : "Atinge: înainte · marginea stângă: înapoi";
  if (s.t === "w") fdWidgetLive(a, e);
  if (speak && i === FD.cur) { fdHalt(); if (FD.voice) fdVoiceNow(); }
}
function fdPartStep(i, d) {
  const e = FD.items[i], list = fdStages(e.it), cur = e.stage || 0, s = list[cur];
  if (d > 0 && s.t === "cl" && e.cl === undefined) return;
  if (d > 0 && cur >= list.length - 1) { fdGo(1); return; }
  if (d < 0 && cur === 0) return;
  e.stage = cur + d; fdPartShow(i, true);
}
function fdClozeAnswer(i, e, v) {
  if (e.cl !== undefined) return;
  const st = fdState(), s = fdStages(e.it)[e.stage || 0], good = v === s.ok;
  e.cl = v; FD.tot++;
  if (good) { FD.ok++; st.combo++; st.best = Math.max(st.best, st.combo); st.xp += 100 + Math.min(st.combo, 10) * 20; } else { st.combo = 0; st.xp = Math.max(0, st.xp - 25); }
  save(); fdPartShow(i, false); fdBurst(fdArt(i), good, good ? fdAny(FD_WIN) : fdAny(FD_LOSE)); fdHud();
}

/* Povestirea unei lecții, o idee pe rând */
function fdHalt() { FD.tok++; clearTimeout(FD.timer); if (FD.au) FD.au.pause(); }
function fdAudio(name) {
  if (!FD.au) { FD.au = new Audio(); FD.au.preload = "auto"; }
  FD.au.src = `audio/${name}.mp3`;
  const p = FD.au.play(); if (p) p.catch(() => {});
}
function fdVoiceNow() {
  const e = FD.items[FD.cur]; if (!e) return;
  if (e.it.k === "P") { const s = fdStages(e.it)[e.stage || 0]; if (s.t !== "w") fdAudio(`${e.it.id}-${e.stage || 0}`); }
  else if (e.it.k === "K") fdAudio(`${e.it.id}-q`);
}
function fdSay(text, done) {
  const tok = FD.tok;
  const fin = () => { if (tok === FD.tok) { clearTimeout(FD.timer); done(); } };
  FD.timer = setTimeout(fin, Math.max(1050, text.length * 46));
}
function fdRun(i) {
  fdHalt();
  const e = FD.items[i]; if (!e) return;
  if (e.it.k === "P") { fdPartShow(i, true); return; }
  if (e.it.k === "K") { if (FD.voice) fdVoiceNow(); return; }
  if (e.it.k !== "L") return;
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
  if (e && e.it.idx !== undefined && e.it.idx >= (st.pos || 0)) { st.pos = e.it.idx; save(); }
  if (e && e.it.k !== "M" && e.it.k !== "E" && !e.counted) { e.counted = true; st.seen[e.it.id] = (st.seen[e.it.id] || 0) + 1; FD.seenThis++; if (e.it.k === "L" || e.it.k === "P") st.xp += 5; save(); }
  document.querySelectorAll(".reel.now").forEach(a => a.classList.remove("now"));
  const a = fdArt(i); if (a) a.classList.add("now");
  fdHud(); fdBgFor(i); fdRun(i); fmChange(i);
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
  else { st.combo = 0; st.xp = Math.max(0, st.xp - 25); FD.retry.push({ it: e.it, at: FD.items.length + (e.it.k === "K" ? 0 : 3 + Math.floor(Math.random() * 3)) }); }
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
    else if (fa === "cl") fdClozeAnswer(i, e, btn.dataset.v);
    else if (fa === "wout") { e.wg = !e.wg; fdPartShow(i, false); }
    else if (fa === "card") {
      S.c[e.it.id] = v === 2 ? Math.min(3, (S.c[e.it.id] || 0) + 1) : 0;
      if (v !== 2) FD.retry.push({ it: e.it, at: FD.items.length + 4 });
      save(); fdGo(1);
    }
    return;
  }
  if (ev.target.closest("a")) return;
  const t = Date.now();
  if (t - FD.lastTap < 300 && e.it.k !== "M" && e.it.k !== "E") {
    const st = fdState();
    if (st.saved.indexOf(e.it.id) < 0) { st.saved.push(e.it.id); save(); const b = art.querySelector('[data-fa="save"]'); if (b) { b.classList.add("on"); b.innerHTML = "❤️<small>Salvează</small>"; } }
    const h = document.createElement("div"); h.className = "bigheart"; h.textContent = "❤️"; art.appendChild(h); setTimeout(() => h.remove(), 800);
    FD.lastTap = 0; return;
  }
  FD.lastTap = t;
  if (e.it.k === "P") {
    if (ev.target.closest(".wg")) return;
    const r = art.getBoundingClientRect(), back = ev.clientX - r.left < r.width * .28;
    fdPartStep(i, back ? -1 : 1); return;
  }
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
  const c = FDB.c, W = fdEl("fdScroll").clientWidth, st = Math.max(96, Math.min(230, innerHeight * .24));
  if (!W || (W === FDB.w && Math.abs(st - FDB.st) < 40)) return;
  const r = Math.min(devicePixelRatio || 1, 1.5);
  FDB.w = W; FDB.h = st; FDB.st = st;
  fdEl("feed").style.setProperty("--st", st + "px");
  c.width = W * r; c.height = st * r; FDB.x.setTransform(r, 0, 0, r, 0, 0);
  FDB.ball = null; FDB.blocks = []; FDB.ob = [];
}
function fdBgFor(i) {
  const e = FD.items[i]; if (!e) return;
  FDB.col = FD_COLORS[i % FD_COLORS.length];
  FDB.mode = i % 3;
  FDB.active = e.it.k === "L" || (e.it.k === "P" && !e.it.x);
  FDB.ball = null; FDB.trail = []; FDB.blocks = []; FDB.ob = []; FDB.pl.y = 0; FDB.pl.v = 0; FDB.pl.a = 0;
  FDB.c.classList.remove("show");
  if (!FDB.active) return;
  const a = fdArt(i); if (!a) return;
  a.appendChild(FDB.c);
  FDB.x.clearRect(0, 0, FDB.w, FDB.h);
  if (fdStill()) fdBgDraw(0);
  setTimeout(() => { if (FDB.active && FDB.c.parentElement === a) FDB.c.classList.add("show"); }, 40);
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
  if (!FDB.active || performance.now() - FD.lastScroll < 140) { FDB.last = ts; return; }
  const dt = Math.min(.05, (ts - FDB.last) / 1000); FDB.last = ts;
  fdBgDraw(dt);
}

/* Filtre, voce, rutare */
function fdReset() {
  fdHalt();
  FD.items = []; FD.cur = -1; FD.pi = 0; FD.retry = []; FD.recent = []; FD.ended = false;
  if (FD.filter === "story") FD.si = Math.min(fdState().pos || 0, STORY.length - 1);
  const box = fdEl("fdScroll"); FD.io.disconnect(); box.innerHTML = ""; box.scrollTop = 0;
  fdAppend(10);
  if (FD.items.length) fdActivate(0);
}
function fdSheet() {
  const box = fdEl("fdSheet"); box.hidden = !FD.sheet; if (!FD.sheet) return;
  const st = fdState(), cur = STORY[Math.min(st.pos || 0, STORY.length - 1)];
  const chip = (v, l) => `<button class="sc ${FD.filter === v ? "on" : ""}" data-sv="${v}">${l}</button>`;
  box.innerHTML = `<h3>Serialul, de la zero</h3><p class="rsub">Ai ajuns în Episodul ${cur.ep}. Atinge un episod ca să sari la el.</p><div class="scs">${chip("story", "▶ Continuă serialul")}<button class="sc" data-ep="0">↺ De la început</button></div><div class="scs">${EPISODES.map((x, i) => `<button class="sc ${cur.ep === x.n ? "cur" : ""}" data-ep="${i}">${x.n}. ${x.title}</button>`).join("")}</div><h3>Recapitulare</h3><p class="rsub">Lecții scurte amestecate, pentru când știi deja materia.</p><div class="scs">${chip("all", "🔀 Mix")}${chip("saved", "❤️ Salvate")}${Object.keys(TOPICS).map(t => chip(t, TOPICS[t])).join("")}</div>`;
}
function fdLabel() { fdEl("fdFilter").textContent = (FD.filter === "story" ? "Serial" : FD.filter === "all" ? "Mix" : FD.filter === "saved" ? "Salvate" : TOPICS[FD.filter]) + " ▾"; }
function fdInit() {
  if (FD.ready) return; FD.ready = true;
  fdBuild();
  FDB.c = fdEl("fdBg"); FDB.x = FDB.c.getContext("2d"); FDB.w = 0; FDB.st = 0; fdBgSize();
  addEventListener("resize", () => { if (FD.on) fdBgSize(); });
  const box = fdEl("fdScroll");
  FD.io = new IntersectionObserver(es => { es.forEach(en => { if (en.isIntersecting && en.intersectionRatio > .6) fdActivate(+en.target.dataset.i); }); }, { root: box, threshold: [.6] });
  box.addEventListener("click", fdClick);
  box.addEventListener("input", ev => { const t = ev.target.closest("[data-wid]"); if (!t) return; const a = t.closest(".reel"); fdWidgetLive(a, FD.items[+a.dataset.i]); });
  box.addEventListener("scroll", () => { FD.lastScroll = performance.now(); }, { passive: true });
  fdEl("fdFilter").addEventListener("click", () => { FD.sheet = !FD.sheet; fdSheet(); });
  fdEl("fdSheet").addEventListener("click", ev => {
    const ep = ev.target.closest("[data-ep]");
    if (ep) { const st = fdState(); st.pos = EPISODES[+ep.dataset.ep].start; save(); FD.filter = "story"; FD.sheet = false; fdSheet(); fdLabel(); fdReset(); return; }
    const b = ev.target.closest("[data-sv]"); if (!b) return; FD.filter = b.dataset.sv; FD.sheet = false; fdSheet(); fdLabel(); fdReset();
  });
  const voiceBtn = () => { fdEl("fdVoice").textContent = FD.voice ? "🔊" : "🔇"; };
  fdEl("fdVoice").addEventListener("click", () => {
    FD.voice = !FD.voice; S.voice = FD.voice; save(); voiceBtn(); fmDuck(FD.voice);
    if (!FD.voice) { fdHalt(); return; }
    if (FD.filter !== "story") { fdToast("Vocea citește serialul"); return; }
    fdVoiceNow();
  });
  if (S.voice) { FD.voice = true; fmDuck(true); }
  voiceBtn();
  fdEl("fdMusic").addEventListener("click", ev => {
    ev.stopPropagation();
    if (!FM.on && !fmEnsure()) { fdToast("Telefonul nu poate reda muzica"); return; }
    const on = fmToggle(); S.music = on ? "auto" : ""; save(); fdMusicBtn();
    fdToast(on ? "Muzică: alta la fiecare swipe" : "Muzică oprită");
  });
  // După repornire, browserul cere o atingere înainte să permită sunetul.
  if (S.music) { FM.on = true; }
  fdMusicBtn();
  const unlock = () => { if (FD.on && FM.on && !FM.timer) fmRun(); };
  document.addEventListener("click", unlock); document.addEventListener("touchend", unlock);
  addEventListener("keydown", ev => { if (!FD.on) return; if (ev.key === "ArrowDown" || ev.key === "j") { ev.preventDefault(); fdGo(1); } if (ev.key === "ArrowUp" || ev.key === "k") { ev.preventDefault(); fdGo(-1); } });
  document.addEventListener("visibilitychange", () => { if (!FD.on) return; if (document.hidden) { fdHalt(); fmPause(); } else if (FM.on && FM.ctx) fmRun(); });
  fdLabel(); fdReset();
}
function fdShow() {
  fdEl("feed").hidden = false;
  fdInit();
  if (!FD.on) { FD.on = true; fdBgSize(); if (FD.cur >= 0) fdBgFor(FD.cur); if (!fdStill()) { FDB.last = performance.now(); FDB.raf = requestAnimationFrame(fdBgLoop); } if (FM.on && FM.ctx) fmRun(); }
  fdHud();
}
function fdHide() { if (!FD.on) { fdEl("feed").hidden = true; return; } FD.on = false; fdHalt(); fmPause(); fdEl("feed").hidden = true; }
function fdMusicBtn() { const b = fdEl("fdMusic"); b.textContent = FM.on ? "🎶" : "🎵"; b.classList.toggle("off", !FM.on); }
