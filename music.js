"use strict";
// Muzică originală, generată în browser. La fiecare reel se compune altă piesă.
const FM_GENRES = [
  { name: "Lo-fi", bpm: [72, 86], swing: .14, vol: .95, kick: [0, 7, 10], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], bass: [0, 10], bassLen: 1.5, pad: 1, lead: "sine", dens: .3, oct: 12 },
  { name: "Phonk", bpm: [130, 150], swing: 0, vol: .8, kick: [0, 3, 6, 10, 13], snare: [8], hat: [0, 2, 3, 4, 6, 8, 10, 11, 12, 14], bass: [0, 3, 6, 10, 13], bassLen: 2.6, sub: 1, lead: "cow", dens: .42, oct: 24 },
  { name: "Arcade", bpm: [110, 126], swing: 0, vol: .8, kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14], bass: [0, 3, 6, 8, 11, 14], bassLen: .7, arp: 1, lead: "square", dens: .2, oct: 24 },
  { name: "House", bpm: [120, 128], swing: 0, vol: .85, kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14], bass: [2, 6, 10, 14], bassLen: 1, stab: [3, 6, 11], lead: "triangle", dens: .15, oct: 24 },
  { name: "Trap", bpm: [136, 150], swing: 0, vol: .8, kick: [0, 7, 11], snare: [8], hat: [0, 1, 2, 4, 6, 7, 8, 10, 12, 13, 14, 15], bass: [0, 7, 11], bassLen: 3, sub: 1, pad: 1, lead: "triangle", dens: .25, oct: 24 },
  { name: "Chill", bpm: [88, 100], swing: .08, vol: .9, kick: [0, 8], snare: [4, 12], hat: [2, 6, 10, 14], bass: [0, 6, 8], bassLen: 1.6, pad: 1, lead: "sine", dens: .38, oct: 12 },
  { name: "Drum & bass", bpm: [165, 176], swing: 0, vol: .72, kick: [0, 10], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], bass: [0, 3, 8, 11], bassLen: 1.4, sub: 1, pad: 1, lead: "square", dens: .14, oct: 24 },
  { name: "Dembow", bpm: [92, 102], swing: 0, vol: .85, kick: [0, 4, 8, 12], snare: [3, 6, 11, 14], hat: [2, 6, 10, 14], bass: [0, 3, 8, 11], bassLen: 1.4, lead: "triangle", dens: .3, oct: 24 }
];
const FM_PROG = [[[0, 0], [8, 1], [3, 1], [10, 1]], [[0, 0], [5, 0], [10, 1], [3, 1]], [[0, 1], [7, 1], [9, 0], [5, 1]], [[0, 0], [3, 1], [10, 1], [5, 0]], [[0, 1], [5, 1], [9, 0], [7, 1]], [[0, 0], [10, 1], [8, 1], [7, 1]], [[0, 0], [7, 0], [8, 1], [10, 1]], [[0, 1], [9, 0], [5, 1], [7, 1]]];
const FM = { ctx: null, env: null, master: null, timer: null, step: 0, next: 0, on: false, track: null, duck: false, base: Math.floor(Math.random() * 1e5), lastGenre: -1, pending: null, lastSwitch: 0 };

function fmRng(a) { return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function fmMake(seed, notGenre) {
  const r = fmRng(seed * 7919 + 13);
  let gi = Math.floor(r() * FM_GENRES.length);
  if (gi === notGenre) gi = (gi + 1 + Math.floor(r() * (FM_GENRES.length - 1))) % FM_GENRES.length;
  const g = FM_GENRES[gi], key = 45 + Math.floor(r() * 10);
  const prog = FM_PROG[Math.floor(r() * FM_PROG.length)];
  const chords = prog.map(([iv, maj]) => { const root = key + (iv > 6 ? iv - 12 : iv); return [root, root + (maj ? 4 : 3), root + 7]; });
  const minor = prog[0][1] === 0, scale = minor ? [0, 3, 5, 7, 10] : [0, 2, 4, 7, 9];
  const lead = [];
  let pos = Math.floor(r() * scale.length);
  for (let n = 0; n < 32; n++) {
    if (r() < g.dens) { pos = Math.max(0, Math.min(scale.length * 2 - 1, pos + Math.floor(r() * 5) - 2)); lead.push(key + g.oct + scale[pos % scale.length] + 12 * Math.floor(pos / scale.length)); } else lead.push(null);
  }
  const bpm = g.bpm[0] + Math.floor(r() * (g.bpm[1] - g.bpm[0] + 1));
  return Object.assign({}, g, { bpm, chords, leadNotes: lead, genre: gi });
}
function fmHz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
function fmNoise(ctx) { const b = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; }
function fmEnv(ctx, out) { return { ctx, out, noise: fmNoise(ctx) }; }
function fmKick(E, t, lvl) {
  const o = E.ctx.createOscillator(), g = E.ctx.createGain();
  o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(45, t + .11);
  g.gain.setValueAtTime(lvl, t); g.gain.exponentialRampToValueAtTime(.001, t + .26);
  o.connect(g); g.connect(E.out); o.start(t); o.stop(t + .28);
}
function fmHit(E, t, dur, type, freq, lvl) {
  const s = E.ctx.createBufferSource(), f = E.ctx.createBiquadFilter(), g = E.ctx.createGain();
  s.buffer = E.noise; f.type = type; f.frequency.value = freq;
  g.gain.setValueAtTime(lvl, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  s.connect(f); f.connect(g); g.connect(E.out); s.start(t, Math.random() * .8, dur + .02);
}
function fmTone(E, t, midi, dur, type, lvl, cut, att) {
  const o = E.ctx.createOscillator(), f = E.ctx.createBiquadFilter(), g = E.ctx.createGain();
  o.type = type; o.frequency.value = fmHz(midi); f.type = "lowpass"; f.frequency.value = cut;
  g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(lvl, t + att); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(f); f.connect(g); g.connect(E.out); o.start(t); o.stop(t + dur + .03);
}
function fmStep(E, st, n, time) {
  const s = n % 16, bar = Math.floor(n / 16) % 4, ch = st.chords[bar], sd = 60 / st.bpm / 4;
  const t = time + (s % 2 ? st.swing * sd : 0);
  if (st.kick.includes(s)) fmKick(E, t, .8 * st.vol);
  if (st.snare.includes(s)) { fmHit(E, t, .17, "bandpass", 1900, .34 * st.vol); fmTone(E, t, 55, .1, "triangle", .1 * st.vol, 900, .002); }
  if (st.hat.includes(s)) fmHit(E, t, .045, "highpass", 7500, .1 * st.vol);
  if (st.bass.includes(s)) fmTone(E, t, ch[0] - 12, sd * st.bassLen * 2, st.sub ? "sine" : "triangle", .42 * st.vol, 600, .006);
  if (st.pad && s === 0) ch.forEach(m => fmTone(E, t, m, sd * 16, "triangle", .06, 950, .22));
  if (st.stab && st.stab.includes(s)) ch.forEach(m => fmTone(E, t, m + 12, .16, "sawtooth", .035, 1800, .004));
  if (st.arp) fmTone(E, t, ch[(s + (s >> 2)) % ch.length] + 12, sd * 1.6, "square", .05, 2600, .003);
  const note = st.leadNotes[n % 32];
  if (note !== null) {
    if (st.lead === "cow") { fmTone(E, t, note, .16, "square", .07, 2500, .002); fmTone(E, t, note + .35, .16, "square", .05, 2500, .002); }
    else fmTone(E, t, note, st.lead === "sine" ? .55 : .24, st.lead, st.lead === "sine" ? .09 : .055, 2400, .006);
  }
}
function fmGain() { return FM.duck ? .16 : .42; }
function fmEnsure() {
  if (FM.ctx) return true;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  FM.ctx = new AC();
  FM.master = FM.ctx.createGain(); FM.master.gain.value = fmGain();
  const lim = FM.ctx.createDynamicsCompressor(); lim.threshold.value = -10; lim.ratio.value = 8;
  FM.master.connect(lim); lim.connect(FM.ctx.destination);
  FM.env = fmEnv(FM.ctx, FM.master);
  return true;
}
function fmTick() {
  if (!FM.track) return;
  const sd = 60 / FM.track.bpm / 4;
  while (FM.next < FM.ctx.currentTime + .28) { fmStep(FM.env, FM.track, FM.step++, FM.next); FM.next += sd; }
}
function fmRun() {
  if (!FM.on || !fmEnsure()) return;
  FM.ctx.resume();
  if (FM.timer) return;
  if (!FM.track) fmPick(0);
  FM.master.gain.cancelScheduledValues(FM.ctx.currentTime);
  FM.master.gain.setValueAtTime(fmGain(), FM.ctx.currentTime);
  FM.next = FM.ctx.currentTime + .06;
  FM.timer = setInterval(fmTick, 90);
  fmTick();
}
function fmPause() { clearInterval(FM.timer); FM.timer = null; if (FM.ctx) { FM.master.gain.setValueAtTime(0, FM.ctx.currentTime); FM.ctx.suspend(); } }
function fmDuck(on) { FM.duck = on; if (FM.ctx && FM.timer) FM.master.gain.setTargetAtTime(fmGain(), FM.ctx.currentTime, .08); }
function fmPick(i) { FM.track = fmMake(FM.base + i, FM.lastGenre); FM.lastGenre = FM.track.genre; FM.step = 0; }
// Piesa se schimbă când ajungi pe alt reel; la swipe rapid se schimbă o singură dată.
function fmChange(i) {
  if (!FM.on) return;
  clearTimeout(FM.pending);
  FM.pending = setTimeout(() => {
    fmPick(i);
    if (!FM.timer || !FM.ctx) return;
    const t = FM.ctx.currentTime;
    FM.master.gain.cancelScheduledValues(t);
    FM.master.gain.setValueAtTime(FM.master.gain.value, t);
    FM.master.gain.linearRampToValueAtTime(0, t + .07);
    FM.master.gain.linearRampToValueAtTime(fmGain(), t + .22);
    FM.next = t + .08;
  }, 260);
}
function fmToggle() { FM.on = !FM.on; if (FM.on) { FM.track = null; fmRun(); } else fmPause(); return FM.on; }
