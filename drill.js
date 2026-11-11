"use strict";
// Exerciții generate: la fiecare întrebare, un tabel sau grafic nou. Răspunsul corect e calculat din datele afișate.
const DR = { n: 0 };
function drR(a, b) { return a + Math.random() * (b - a); }
function drI(a, b) { return Math.floor(drR(a, b + 1)); }
function drPick(a) { return a[Math.floor(Math.random() * a.length)]; }
function drMix(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function drF(x, d = 1) { return x.toFixed(d).replace(".", ",").replace("-", "−"); }

/* Sig. exact pentru r, din distribuția t */
function drLgamma(x) { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, .1208650973866179e-2, -.5395239384953e-5]; let y = x, tmp = x + 5.5; tmp -= (x + .5) * Math.log(tmp); let ser = 1.000000000190015; for (const v of c) ser += v / ++y; return -tmp + Math.log(2.5066282746310005 * ser / x); }
function drBetacf(a, b, x) {
  const FP = 1e-300, qab = a + b, qap = a + 1, qam = a - 1; let c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < FP) d = FP; d = 1 / d; let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m; let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d; h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < 3e-12) break;
  }
  return h;
}
function drIbeta(x, a, b) {
  if (x <= 0) return 0; if (x >= 1) return 1;
  const bt = Math.exp(drLgamma(a + b) - drLgamma(a) - drLgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? bt * drBetacf(a, b, x) / a : 1 - bt * drBetacf(b, a, 1 - x) / b;
}
function drP(r, n) { const df = n - 2, t2 = r * r * df / (1 - r * r); return drIbeta(df / (df + t2), df / 2, .5); }
function drSpssR(r, p) { const s = (r < 0 ? "-" : "") + Math.abs(r).toFixed(3).slice(1); return s + (p < .01 ? "**" : p < .05 ? "*" : ""); }
function drSpssSig(p) { return p >= .9995 ? "1.000" : p < .0005 ? ".000" : p.toFixed(3).slice(1); }
function drShowR(r) { return drF(r, 3); }

const DR_VARS = [
  { n: "Satisfacția cu viața", s: "Satisf." }, { n: "Fericire", s: "Feric." }, { n: "Sănătate", s: "Sănăt." }, { n: "Vârstă", s: "Vârstă" },
  { n: "Venit", s: "Venit" }, { n: "Educație", s: "Educ." }, { n: "Religiozitate", s: "Relig." }, { n: "Încredere în ceilalți", s: "Încred." },
  { n: "Ore de somn", s: "Somn" }, { n: "Stres", s: "Stres" }, { n: "Timp online", s: "Online" }, { n: "Gen feminin", s: "Gen F", d: ["femeile", "bărbații"] },
  { n: "Mediu urban", s: "Urban", d: ["orășenii", "sătenii"] }
];
const DR_COUNTRIES = ["Ardenia", "Borava", "Calmor", "Delvia", "Estria", "Folda", "Galmar", "Hesta", "Istra", "Jorvik", "Kalda", "Lumen", "Morvia", "Nordal", "Ostra", "Palen", "Quarn", "Rivon", "Sarel", "Tovia", "Ulma", "Varden", "Westra", "Ylva", "Zarin", "Aurel", "Brena", "Corvo"];

function drReg(t, q, a, e, ex, s) {
  const id = "D-" + Date.now().toString(36) + "-" + (DR.n++), xid = "DX" + id;
  EXHIBITS[xid] = ex;
  const it = { id, t, s: s || "Exercițiu generat", q, a, e, x: xid, gen: true };
  if (typeof QM !== "undefined") QM[id] = it;
  return it;
}
function drOpts(correct, pool) {
  const out = [correct];
  for (const p of drMix(pool)) { if (out.length >= 4) break; if (out.indexOf(p) < 0) out.push(p); }
  return out.length === 4 ? out : null;
}

/* 1. Tabel de corelații SPSS */
function drCorr() {
  const k = drPick([4, 4, 5]);
  const dummies = DR_VARS.filter(v => v.d), nums = DR_VARS.filter(v => !v.d);
  const vars = drMix(nums).slice(0, k - (Math.random() < .6 ? 1 : 0));
  if (vars.length < k) vars.push(drPick(dummies));
  const order = drMix(vars), base = drPick([drI(60, 180), drI(300, 900), drI(1200, 2500)]);
  const band = () => { const u = Math.random(); const m = u < .25 ? drR(0, .06) : u < .5 ? drR(.07, .2) : u < .8 ? drR(.2, .45) : drR(.45, .72); return (Math.random() < .5 ? -1 : 1) * m; };
  const pairs = [];
  for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) {
    const r = Math.round(band() * 1000) / 1000, n = base - drI(0, Math.round(base * .05)), p = drP(r, n);
    pairs.push({ i, j, a: order[i], b: order[j], r, n, p, lab: `${order[i].n} – ${order[j].n}` });
  }
  order.forEach(v => { SHORT[v.n] = v.s; });
  const ex = { type: "corr", title: "Corelații (date generate pentru exercițiu)", vars: order.map(v => v.n), r: pairs.map(x => drSpssR(x.r, x.p)), sig: pairs.map(x => drSpssSig(x.p)), n: pairs.map(x => x.n), diag: order.map(() => base), note: order.filter(v => v.d).map(v => `${v.n}: 1 = da, 0 = nu.`).join(" ") };
  const pr = x => `${x.lab} (${drSpssR(x.r, x.p).replace(/\*/g, "")})`;
  const tpl = drPick(["strong", "strong", "count5", "count1", "read", "n", "sig", "sig", "interp", "interp", "weak"]);
  if (tpl === "strong") {
    const s = pairs.slice().sort((x, y) => Math.abs(y.r) - Math.abs(x.r));
    if (Math.abs(s[0].r) - Math.abs(s[1].r) < .03) return null;
    return drReg("spss", "Care este cea mai puternică corelație din tabel?", drOpts(pr(s[0]), s.slice(1).map(pr)), `Se compară valorile absolute, fără semn. Cea mai mare este |${drShowR(s[0].r)}|.`, ex);
  }
  if (tpl === "weak") {
    const sig = pairs.filter(x => x.p < .05).sort((x, y) => Math.abs(x.r) - Math.abs(y.r));
    if (sig.length < 2 || Math.abs(sig[1].r) - Math.abs(sig[0].r) < .02) return null;
    return drReg("spss", "Dintre corelațiile semnificative la 0,05, care este cea mai slabă?", drOpts(pr(sig[0]), pairs.filter(x => x !== sig[0]).map(pr)), "Te uiți doar la corelațiile cu steluțe, apoi alegi valoarea absolută cea mai mică.", ex);
  }
  if (tpl === "count5" || tpl === "count1") {
    const lim = tpl === "count5" ? .05 : .01, c = pairs.filter(x => x.p < lim).length, m = pairs.length;
    const pool = [c - 2, c - 1, c + 1, c + 2, c + 3].filter(v => v >= 0 && v <= m).map(String);
    return drReg("spss", `Câte dintre cele ${m} corelații sunt semnificative la pragul ${lim === .05 ? "0,05" : "0,01"}?`, drOpts(String(c), pool), lim === .05 ? "Numeri corelațiile cu cel puțin o steluță, adică Sig. < 0,05." : "Numeri doar corelațiile cu două steluțe, adică Sig. < 0,01.", ex);
  }
  if (tpl === "read") {
    const x = drPick(pairs), vals = [...new Set(pairs.map(y => drShowR(y.r)))];
    return drReg("spss", `Cât este corelația dintre „${x.a.n}” și „${x.b.n}”?`, drOpts(drShowR(x.r), vals.filter(v => v !== drShowR(x.r))), "Găsești rândul unei variabile și coloana celeilalte. SPSS scrie fără zero în față.", ex);
  }
  if (tpl === "n") {
    const x = drPick(pairs), ns = [...new Set(pairs.map(y => String(y.n)).concat([String(base)]))];
    return drReg("spss", `Câte cazuri au intrat în corelația „${x.a.n}” – „${x.b.n}”?`, drOpts(String(x.n), ns.filter(v => v !== String(x.n))), "N este pe al treilea rând al celulei: câți au răspuns la ambele variabile.", ex);
  }
  if (tpl === "sig") {
    const x = drPick(pairs);
    const right = x.p < .01 ? "semnificativă la 0,01" : x.p < .05 ? "semnificativă la 0,05, dar nu la 0,01" : "nesemnificativă la 0,05";
    return drReg("spss", `Cum este corelația „${x.a.n}” – „${x.b.n}” (Sig. = ${drSpssSig(x.p)})?`, drOpts(right, ["semnificativă la 0,01", "semnificativă la 0,05, dar nu la 0,01", "nesemnificativă la 0,05", "puternică, pentru că Sig. e mic"]), `Sig. ${drSpssSig(x.p)} ${x.p < .05 ? "este sub 0,05" : "este peste 0,05"}${x.p < .05 ? (x.p < .01 ? " și sub 0,01" : ", dar peste 0,01") : ""}. Sig. nu arată tăria.`, ex);
  }
  const cands = pairs.filter(x => x.p < .05 && Math.abs(x.r) >= .1);
  if (!cands.length) return null;
  const x = drPick(cands), pos = x.r > 0;
  let right, wrong;
  const dv = x.a.d ? x.a : x.b.d ? x.b : null, ov = dv === x.a ? x.b : x.a;
  if (dv && !ov.d) {
    right = `${dv.d[0]} au, în medie, scoruri mai ${pos ? "mari" : "mici"} la „${ov.n}”`;
    wrong = [`${dv.d[0]} au, în medie, scoruri mai ${pos ? "mici" : "mari"} la „${ov.n}”`, `faptul că ești din grupul „${dv.n}” produce scoruri mai ${pos ? "mari" : "mici"} la „${ov.n}”`, `${Math.round(Math.abs(x.r) * 100)}% dintre ${dv.d[0]} au scoruri mari la „${ov.n}”`];
  } else if (!dv) {
    right = `cei cu scoruri mai mari la „${x.a.n}” tind să aibă scoruri mai ${pos ? "mari" : "mici"} la „${x.b.n}”`;
    wrong = [`cei cu scoruri mai mari la „${x.a.n}” tind să aibă scoruri mai ${pos ? "mici" : "mari"} la „${x.b.n}”`, `„${x.a.n}” produce schimbarea din „${x.b.n}”`, `${Math.round(Math.abs(x.r) * 100)}% dintre cazuri au aceeași valoare la ambele variabile`];
  } else return null;
  return drReg("spss", `Cum citești corelația „${x.a.n}” – „${x.b.n}” (${drSpssR(x.r, x.p)})?`, [right, ...wrong], `Semnul ${pos ? "plus" : "minus"} arată direcția. Corelația nu arată cauza și nu este un procent.${dv ? ` Pentru 0/1, 1 = ${dv.d[0]}.` : ""}`, ex);
}

/* 2. Nor de puncte cu țări */
const DR_PAIRS = [["PIB pe locuitor (indice)", "Satisfacție medie (0–10)"], ["Inegalitate (Gini)", "Încredere medie (1–10)"], ["Ore lucrate pe săptămână", "Speranța de viață (ani)"], ["Cheltuieli cu educația (% PIB)", "Scor mediu la teste"], ["Utilizatori de internet (%)", "Vârsta medie la căsătorie"]];
function drScatter() {
  const target = drPick([-.8, -.5, -.2, .2, .5, .8]), n = 22;
  let xs, ys, r = 0;
  for (let t = 0; t < 40; t++) {
    const g = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(6.283 * Math.random());
    xs = Array.from({ length: n }, g); ys = xs.map(x => target * x + Math.sqrt(1 - target * target) * g());
    const mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n;
    let sxy = 0, sxx = 0, syy = 0; xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) ** 2; syy += (ys[i] - my) ** 2; });
    r = sxy / Math.sqrt(sxx * syy);
    if (Math.abs(r - target) < .06) break;
  }
  if (Math.abs(r - target) >= .06) return null;
  const pair = drPick(DR_PAIRS), names = drMix(DR_COUNTRIES);
  const sx = v => 50 + v * 15, sy = v => 6.5 + v * .7;
  const pts = xs.map((x, i) => [Math.round(sx(x) * 10) / 10, Math.round(sy(ys[i]) * 100) / 100]);
  const lo = a => Math.floor(Math.min(...a) / 10) * 10, hi = a => Math.ceil(Math.max(...a) / 10) * 10;
  const X = pts.map(p => p[0]), Y = pts.map(p => p[1]);
  const ex = { type: "scatter", title: "Țări (date generate pentru exercițiu)", xl: pair[0], yl: pair[1], xr: [lo(X), hi(X), 10], yr: [Math.floor(Math.min(...Y) * 2) / 2, Math.ceil(Math.max(...Y) * 2) / 2, .5], pts, note: "Fiecare punct este o țară." };
  const tpl = drPick(["r", "r", "dir", "eco"]);
  if (tpl === "r") {
    const lab = v => drF(v, 1);
    return drReg("gra", "Cât este, aproximativ, coeficientul de corelație r?", [lab(target), ...drMix([-.8, -.5, -.2, .2, .5, .8].filter(v => v !== target)).slice(0, 3).map(lab)], `Norul ${target > 0 ? "urcă" : "coboară"}, deci r e ${target > 0 ? "pozitiv" : "negativ"}. ${Math.abs(target) >= .8 ? "Punctele sunt strânse în jurul unei drepte, deci legătura e puternică." : Math.abs(target) >= .5 ? "Punctele sunt destul de strânse: legătură moderată spre puternică." : "Norul e foarte împrăștiat: legătură slabă."}`, ex);
  }
  if (tpl === "dir") {
    const pos = target > 0, strong = Math.abs(target) >= .5;
    const opts = ["pozitivă și puternică", "pozitivă și slabă", "negativă și puternică", "negativă și slabă"];
    const right = `${pos ? "pozitivă" : "negativă"} și ${strong ? "puternică" : "slabă"}`;
    return drReg("gra", "Cum descrii asocierea din grafic?", [right, ...opts.filter(o => o !== right)], "Sensul: norul urcă sau coboară. Tăria: cât de strânse sunt punctele în jurul unei drepte.", ex);
  }
  const pos = target > 0;
  const right = `țările cu „${pair[0]}” mai mare tind să aibă „${pair[1]}” mai ${pos ? "mare" : "mic"}`;
  return drReg("gra", "Ce concluzie poți trage din grafic?", [right, `fiecare persoană cu „${pair[0]}” mai mare are „${pair[1]}” mai ${pos ? "mare" : "mic"}`, `„${pair[0]}” produce schimbarea din „${pair[1]}”`, `țările cu „${pair[0]}” mai mare tind să aibă „${pair[1]}” mai ${pos ? "mic" : "mare"}`], "Punctele sunt țări: concluzia e despre țări, nu despre oameni (eroarea ecologică), și nu arată cauza.", ex);
}

/* 3. Grafic de evoluție */
const DR_SERIES = [["Satisfacția medie (0–10)", 5.2, 8.2, 1], ["Încrederea în guvern (%)", 20, 70, 0], ["Rata de ocupare (%)", 55, 80, 0]];
function drLine() {
  const sv = drPick(DR_SERIES), dec = sv[3], step = dec ? .1 : 1;
  const years = drPick([[2014, 2016, 2018, 2020, 2022, 2024], [2013, 2015, 2017, 2019, 2021, 2023, 2025], [2010, 2012, 2014, 2016, 2018, 2020]]);
  const names = drMix(DR_COUNTRIES).slice(0, 3), span = sv[2] - sv[1];
  const series = names.map((nm, k) => {
    let v = sv[1] + span * drR(.15, .85); const d = [];
    years.forEach(y => { v = Math.max(sv[1], Math.min(sv[2], v + drR(-.12, .12) * span * .6)); d.push([y, Math.round(v / step) * step]); });
    return { n: nm, d: d.map(p => [p[0], +p[1].toFixed(dec)]), m: ["s", "c", "d"][k] };
  });
  const all = series.flatMap(s => s.d.map(p => p[1]));
  const ys = dec ? .5 : 10, lo = Math.floor(Math.min(...all) / ys) * ys, hi = Math.ceil(Math.max(...all) / ys) * ys;
  const ex = { type: "line", title: `${sv[0]} (date generate pentru exercițiu)`, yl: sv[0], xr: [years[0], years[years.length - 1], 2], xt: years, yr: [lo, hi === lo ? hi + ys : hi, ys], series, note: `Axa verticală începe de la ${drF(lo, dec)}.` };
  const fmtv = v => drF(v, dec);
  const tpl = drPick(["val", "val", "top", "grow", "gap"]);
  if (tpl === "val") {
    const s = drPick(series), yi = drI(0, years.length - 1), v = s.d[yi][1], gap = dec ? .5 : 6;
    const pool = [v - 2 * gap, v - gap, v + gap, v + 2 * gap].map(x => +x.toFixed(dec)).filter(x => x >= 0);
    return drReg("gra", `Ce valoare are ${s.n} în ${years[yi]}?`, drOpts(fmtv(v), pool.map(fmtv)), "Cauți anul pe axa orizontală, urci la linia țării și citești în dreptul axei verticale.", ex);
  }
  if (tpl === "top") {
    const yi = drI(0, years.length - 1), sorted = series.slice().sort((a, b) => b.d[yi][1] - a.d[yi][1]);
    if (sorted[0].d[yi][1] - sorted[1].d[yi][1] < (dec ? .3 : 4)) return null;
    return drReg("gra", `Ce țară are valoarea cea mai mare în ${years[yi]}?`, [sorted[0].n, sorted[1].n, sorted[2].n, "toate au aceeași valoare"], "Compari punctele din același an.", ex);
  }
  if (tpl === "grow") {
    const ch = series.map(s => [s, s.d[s.d.length - 1][1] - s.d[0][1]]).sort((a, b) => b[1] - a[1]);
    if (ch[0][1] - ch[1][1] < (dec ? .3 : 4)) return null;
    return drReg("gra", `Ce țară a crescut cel mai mult între ${years[0]} și ${years[years.length - 1]}?`, [ch[0][0].n, ch[1][0].n, ch[2][0].n, "niciuna nu a crescut"], `Scazi valoarea din primul an din cea din ultimul an, pentru fiecare țară. ${ch[0][0].n}: ${fmtv(ch[0][1])}.`, ex);
  }
  const [a, b] = drMix(series).slice(0, 2), d0 = Math.abs(a.d[0][1] - b.d[0][1]), d1 = Math.abs(a.d[a.d.length - 1][1] - b.d[b.d.length - 1][1]);
  if (Math.abs(d1 - d0) < (dec ? .4 : 5)) return null;
  const right = d1 > d0 ? "s-a mărit" : "s-a micșorat";
  return drReg("gra", `Cum a evoluat distanța dintre ${a.n} și ${b.n} de la ${years[0]} la ${years[years.length - 1]}?`, [right, d1 > d0 ? "s-a micșorat" : "s-a mărit", "a rămas aceeași", "nu se poate citi"], `Distanța în ${years[0]}: ${fmtv(d0)}. În ${years[years.length - 1]}: ${fmtv(d1)}.`, ex);
}

/* 4. Tabel de contingență, procente pe coloane */
const DR_GROUPS = [["Urban", "Rural"], ["Femei", "Bărbați"], ["18–34 ani", "55+ ani"], ["Cu studii superioare", "Fără studii superioare"]];
const DR_ACTS = ["merg la teatru", "citesc cărți", "fac sport", "merg la biserică", "folosesc rețelele sociale"];
function drCont() {
  const g = drPick(DR_GROUPS), act = drPick(DR_ACTS), assoc = Math.random() < .6;
  const col = () => { const a = drI(10, 45), b = drI(20, 45); return [a, b, 100 - a - b]; };
  const c1 = col(); let c2;
  if (assoc) { const sh = drI(12, 22) * (Math.random() < .5 ? 1 : -1); c2 = [c1[0] + sh, c1[1], c1[2] - sh]; } else { const sh = drI(-3, 3); c2 = [c1[0] + sh, c1[1] - sh, c1[2]]; }
  if (c2.some(v => v < 3) || c1.some(v => v < 3)) return null;
  const n1 = drI(300, 900), n2 = drI(300, 900);
  const ex = { type: "table", title: `Cât de des ${act}, după grup (procente pe coloane, date generate)`, head: ["Frecvența", g[0], g[1], ""], rows: [["Deloc", c1[0] + "%", c2[0] + "%", ""], ["Uneori", c1[1] + "%", c2[1] + "%", ""], ["Des", c1[2] + "%", c2[2] + "%", ""], ["Total", "100%", "100%", ""], ["N", String(n1), String(n2), ""]].map(r => r.slice(0, 3)) };
  ex.head = ex.head.slice(0, 3);
  const tpl = drPick(["cell", "cell", "more", "assoc"]);
  if (tpl === "cell") {
    const ri = drI(0, 2), gi = drI(0, 1), v = [c1, c2][gi][ri], lab = ["deloc", "uneori", "des"][ri];
    const pool = [c1[0], c1[1], c1[2], c2[0], c2[1], c2[2], v + 5, v - 5].filter(x => x > 0 && x !== v).map(x => x + "%");
    return drReg("cor", `Ce procent dintre „${g[gi]}” ${act} ${lab}?`, drOpts(v + "%", pool), "Procentele sunt pe coloane: citești coloana grupului și rândul categoriei.", ex);
  }
  if (tpl === "more") {
    if (Math.abs(c1[2] - c2[2]) < 5) return null;
    const hi = c1[2] > c2[2] ? g[0] : g[1], lo = hi === g[0] ? g[1] : g[0];
    return drReg("cor", `În care grup sunt mai mulți oameni care ${act} des?`, [hi, lo, "la fel în ambele grupuri", "nu se poate citi din tabel"], `Compari rândul „Des”: ${g[0]} ${c1[2]}%, ${g[1]} ${c2[2]}%.`, ex);
  }
  return drReg("cor", `Sunt asociate grupul și cât de des ${act}?`, assoc ? ["da, procentele diferă clar între coloane", "nu, procentele sunt aproape egale", "da, și grupul produce comportamentul", "nu se poate spune fără Sig."] : ["nu, procentele sunt aproape egale", "da, procentele diferă clar între coloane", "da, și grupul produce comportamentul", "nu se poate spune fără Sig."], "Asocierea se vede când distribuția diferă mult de la o coloană la alta. Tabelul nu arată cauza.", ex);
}

/* 5. Total Variance Explained */
function drEigen() {
  const m = drPick([8, 9, 10]), k = drI(2, 4);
  let kept = Array.from({ length: k }, () => drR(1.12, 3.2)).sort((a, b) => b - a);
  let rest = Array.from({ length: m - k }, () => drR(.2, .93)).sort((a, b) => b - a);
  const tot = kept.reduce((a, b) => a + b) + rest.reduce((a, b) => a + b), f = m / tot;
  kept = kept.map(v => v * f); rest = rest.map(v => v * f);
  if (kept[k - 1] <= 1.03 || rest[0] >= .97) return null;
  const eig = kept.concat(rest).map(v => Math.round(v * 100) / 100);
  let cum = 0;
  const rows = eig.map((v, i) => { const pc = v / m * 100; cum += pc; return [String(i + 1), drF(v, 2), drF(pc, 1), drF(cum, 1)]; });
  const ex = { type: "table", title: `Total Variance Explained (date generate, ${m} itemi)`, head: ["Componenta", "Eigenvalue", "% of Variance", "Cumulative %"], rows, note: "Extraction: PCA." };
  const tpl = drPick(["kaiser", "kaiser", "cum", "pct"]);
  if (tpl === "kaiser") return drReg("fac", "Câte componente păstrezi după regula Kaiser?", drOpts(String(k), [k - 1, k + 1, k + 2, m].filter(v => v > 0).map(String)), "Păstrezi componentele cu valoarea proprie (Eigenvalue) peste 1.", ex);
  if (tpl === "cum") return drReg("fac", "Ce procent din variație explică împreună componentele păstrate după regula Kaiser?", drOpts(rows[k - 1][3] + "%", [rows[k - 2] ? rows[k - 2][3] : null, rows[k][3], rows[0][2], rows[k - 1][2]].filter(Boolean).map(v => v + "%")), `Citești coloana Cumulative % la ultima componentă cu valoarea peste 1, adică la componenta ${k}.`, ex);
  const j = drI(1, k);
  return drReg("fac", `Ce procent din variație explică doar componenta ${j}?`, drOpts(rows[j - 1][2] + "%", [rows[j - 1][3], rows[j % m][2], rows[j - 1][1]].map(v => v + "%")), "Coloana % of Variance arată contribuția fiecărei componente. Cumulative % este suma până la ea.", ex);
}

/* 6. Matricea de structură */
const DR_ITEMS = [[["Încredere în parlament", "Încredere în guvern", "Încredere în partide"], ["Încredere în poliție", "Încredere în armată", "Încredere în justiție"]], [["Merge la teatru", "Merge la operă", "Merge la muzee"], ["Merge la discotecă", "Merge la concerte", "Merge la cinema"]], [["Fidelitate", "Copii", "Aceeași religie"], ["Împărțirea treburilor", "Acord politic", "Relație sexuală fericită"]]];
function drStruct() {
  const set = drPick(DR_ITEMS), items = [];
  set.forEach((grp, f) => grp.forEach(n => { const own = drR(.6, .87), other = drR(-.18, .24); items.push({ n, f, l: f ? [other, own] : [own, other] }); }));
  const rows = drMix(items).map(it => [it.n, drF(it.l[0], 3).replace(/^(−?)0/, "$1"), drF(it.l[1], 3).replace(/^(−?)0/, "$1")]);
  const ex = { type: "table", title: "Structure Matrix (date generate)", head: ["Item", "Comp. 1", "Comp. 2"], rows, note: "Corelații item–componentă." };
  const tpl = drPick(["top", "group", "group"]);
  if (tpl === "top") {
    const c = drI(0, 1), s = items.slice().sort((a, b) => b.l[c] - a.l[c]);
    if (s[0].l[c] - s[1].l[c] < .03) return null;
    return drReg("fac", `Ce item corelează cel mai puternic cu componenta ${c + 1}?`, drOpts(s[0].n, items.filter(i => i !== s[0]).map(i => i.n)), `Citești coloana „Comp. ${c + 1}” și alegi valoarea cea mai mare.`, ex);
  }
  const c = drI(0, 1), right = set[c].join(", "), other = set[1 - c].join(", ");
  const mix1 = [set[0][0], set[1][1], set[0][2]].join(", "), mix2 = [set[1][0], set[0][1], set[1][2]].join(", ");
  return drReg("fac", `Ce itemi formează componenta ${c + 1}?`, [right, other, mix1, mix2], `Pe coloana „Comp. ${c + 1}”, acești itemi au încărcări mari (peste 0,6). Ceilalți au valori mici.`, ex);
}

/* 7. Profilul clusterelor */
const DR_CRIT = ["Importanța banilor", "Importanța familiei", "Importanța carierei", "Importanța prietenilor", "Importanța religiei", "Importanța timpului liber"];
function drCluster() {
  const k = drPick([3, 4]), crit = drMix(DR_CRIT).slice(0, 5);
  const sizes = Array.from({ length: k }, () => drR(10, 40)), ss = sizes.reduce((a, b) => a + b);
  let pct = sizes.map(s => Math.round(s / ss * 100)); pct[0] += 100 - pct.reduce((a, b) => a + b);
  const means = crit.map(() => Array.from({ length: k }, () => Math.round(drR(1.4, 4.8) * 10) / 10));
  const ex = { type: "table", title: "K-means, medii pe tip (scala 1–5, date generate)", head: ["Criteriu", ...Array.from({ length: k }, (_, i) => `Tip ${i + 1}`)], rows: [["Total membri", ...pct.map(p => p + "%")], ...crit.map((c, i) => [c, ...means[i].map(v => drF(v, 1))])] };
  const tpl = drPick(["hi", "hi", "size", "diff"]);
  if (tpl === "hi") {
    const i = drI(0, crit.length - 1), row = means[i], mx = Math.max(...row), at = row.indexOf(mx);
    if (row.filter(v => v >= mx - .2).length > 1) return null;
    return drReg("clu", `Ce tip acordă cea mai mare importanță criteriului „${crit[i]}”?`, drOpts(`Tip ${at + 1}`, Array.from({ length: k }, (_, j) => `Tip ${j + 1}`).concat(["toate tipurile la fel"])), "Citești rândul criteriului și alegi coloana cu media cea mai mare.", ex);
  }
  if (tpl === "size") {
    const j = drI(0, k - 1);
    return drReg("clu", `Ce procent din respondenți sunt în Tipul ${j + 1}?`, drOpts(pct[j] + "%", pct.filter((p, x) => x !== j).map(p => p + "%").concat([(pct[j] + 10) + "%", Math.max(1, pct[j] - 7) + "%"])), "Rândul „Total membri” arată ponderea fiecărui tip.", ex);
  }
  const rng = means.map(r => Math.max(...r) - Math.min(...r)), mx = Math.max(...rng), i = rng.indexOf(mx);
  if (rng.filter(v => v >= mx - .3).length > 1) return null;
  return drReg("clu", "Ce criteriu deosebește cel mai mult tipurile între ele?", drOpts(crit[i], crit.filter((c, x) => x !== i)), `Cauți rândul cu cea mai mare diferență între cea mai mare și cea mai mică medie: ${drF(mx, 1)} puncte.`, ex);
}

/* 8. Regresie */
const DR_PRED = ["Vârstă", "Gen feminin", "Educație", "Venit", "Religiozitate", "Mărimea localității", "Timp online"];
const DR_Y = ["Satisfacția cu viața", "Încrederea în ceilalți", "Acordul cu o afirmație", "Scorul la un test"];
function drRegTable() {
  const y = drPick(DR_Y), preds = drMix(DR_PRED).slice(0, 4);
  const b = preds.map(() => { const u = Math.random(); return Math.round((u < .3 ? drR(-.03, .03) : (Math.random() < .5 ? -1 : 1) * drR(.06, .42)) * 100) / 100; });
  const sig = b.map(v => Math.abs(v) < .04 ? drR(.2, .85) : Math.abs(v) < .08 ? drR(.01, .2) : drR(0, .004));
  const r2 = drI(5, 35);
  const ex = { type: "table", title: `Regresie: ${y} (Beta standardizați, date generate)`, head: ["Predictor", "Beta", "Sig."], rows: [...preds.map((p, i) => [p, drF(b[i], 2), sig[i] < .001 ? "< 0,001" : drF(sig[i], 3)]), ["R²", r2 + "%", ""]] };
  const tpl = drPick(["top", "top", "count", "r2", "neg"]);
  if (tpl === "top") {
    const s = preds.map((p, i) => [p, Math.abs(b[i])]).sort((a, c) => c[1] - a[1]);
    if (s[0][1] - s[1][1] < .04) return null;
    return drReg("reg", `Ce predictor are cea mai puternică legătură cu „${y}”, la ceilalți predictori constanți?`, [s[0][0], s[1][0], s[2][0], s[3][0]], "Compari Beta în valoare absolută. Beta lucrează în abateri standard, deci se poate compara.", ex);
  }
  if (tpl === "count") {
    const c = sig.filter(v => v < .05).length;
    return drReg("reg", "Câți predictori sunt semnificativi la pragul 0,05?", drOpts(String(c), [0, 1, 2, 3, 4].filter(v => v !== c).map(String)), "Numeri predictorii cu Sig. sub 0,05.", ex);
  }
  if (tpl === "r2") return drReg("reg", `Ce înseamnă R² = ${r2}%?`, [`modelul explică ${r2}% din variația lui „${y}”`, `${r2}% dintre oameni au scoruri mari`, `cel mai puternic predictor are Beta 0,${String(r2).padStart(2, "0")}`, `probabilitatea ca modelul să fie cauzal e ${r2}%`], "R² este proporția din variația variabilei dependente explicată de model.", ex);
  const negs = preds.map((p, i) => [p, b[i], sig[i]]).filter(x => x[1] < -.05 && x[2] < .05 && x[0] !== "Gen feminin");
  if (!negs.length) return null;
  const x = negs[0];
  return drReg("reg", `Cum citești Beta = ${drF(x[1], 2)} pentru „${x[0]}”?`, [`la aceleași valori ale celorlalți predictori, cei cu „${x[0]}” mai mare au „${y}” mai mic`, `cei cu „${x[0]}” mai mare au „${y}” mai mare`, `„${x[0]}” explică ${Math.round(Math.abs(x[1]) * 100)}% din „${y}”`, `relația nu e semnificativă`], "Beta negativ: valori mai mari ale predictorului merg cu valori mai mici ale lui Y, cu ceilalți predictori ținuți constanți.", ex);
}

const DR_BY_TOPIC = { spss: [drCorr], gra: [drScatter, drLine], cor: [drCont, drScatter], fac: [drEigen, drStruct], clu: [drCluster], reg: [drRegTable] };
const DR_ALL = [drCorr, drCorr, drCorr, drScatter, drScatter, drLine, drLine, drCont, drEigen, drStruct, drCluster, drRegTable];
// Un exercițiu nou. `topic` restrânge tipul (de exemplu „spss”).
function drillMake(topic) {
  const gens = DR_BY_TOPIC[topic] || DR_ALL;
  for (let t = 0; t < 60; t++) { const it = drPick(gens)(); if (it && it.a && it.a.length === 4 && new Set(it.a).size === 4) return it; }
  return null;
}
function drillSnapshot(id) { const q = QM[id]; return q ? { q, ex: EXHIBITS[q.x] } : null; }
function drillRestore(map) { if (!map) return; Object.values(map).forEach(v => { if (v && v.q) { EXHIBITS[v.q.x] = v.ex; QM[v.q.id] = v.q; } }); }
