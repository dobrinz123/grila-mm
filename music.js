"use strict";
// Muzică originală, generată în browser. Nu folosește fișiere audio.
const FM_STYLES = {
  lofi: { name: "Lo-fi", bpm: 78, swing: .14, vol: .95, chords: [[57, 60, 64, 67], [53, 57, 60, 64], [48, 55, 59, 64], [55, 59, 62, 65]], kick: [0, 7, 10], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], bass: [0, 10], bassLen: 1.5, pad: true, keys: [3, 6, 11, 14] },
  phonk: { name: "Phonk", bpm: 140, swing: 0, vol: .8, chords: [[45, 48, 52], [45, 48, 52], [41, 45, 48], [43, 47, 50]], kick: [0, 3, 6, 10, 13], snare: [8], hat: [0, 2, 3, 4, 6, 8, 10, 11, 12, 14], bass: [0, 3, 6, 10, 13], bassLen: 2.6, cow: [0, 3, 6, 8, 11, 14] },
  arcade: { name: "Arcade", bpm: 116, swing: 0, vol: .8, chords: [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]], kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14], bass: [0, 3, 6, 8, 11, 14], bassLen: .7, arp: true }
};
const FM_ORDER = ["", "lofi", "phonk", "arcade"];
const FM = { ctx: null, env: null, master: null, timer: null, step: 0, next: 0, style: "", duck: false };

function fmHz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
function fmNoise(ctx) {
  const b = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}
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
  if (st.bass.includes(s)) fmTone(E, t, ch[0] - 12, sd * st.bassLen * 2, st.cow ? "sine" : "triangle", .42 * st.vol, 600, .006);
  if (st.pad && s === 0) ch.forEach(m => fmTone(E, t, m, sd * 16, "triangle", .06, 950, .22));
  if (st.keys && st.keys.includes(s)) fmTone(E, t, ch[(s + bar) % ch.length] + 12, .55, "sine", .085, 1800, .008);
  if (st.cow && st.cow.includes(s)) { const m = ch[s % ch.length] + 24; fmTone(E, t, m, .16, "square", .075, 2500, .002); fmTone(E, t, m + .35, .16, "square", .05, 2500, .002); }
  if (st.arp) fmTone(E, t, ch[(s + (s >> 2)) % ch.length] + 12, sd * 1.6, "square", .055, 2600, .003);
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
  const st = FM_STYLES[FM.style]; if (!st) return;
  const sd = 60 / st.bpm / 4;
  while (FM.next < FM.ctx.currentTime + .28) { fmStep(FM.env, st, FM.step++, FM.next); FM.next += sd; }
}
function fmRun() {
  if (!FM.style || !fmEnsure()) return;
  FM.ctx.resume();
  if (FM.timer) return;
  FM.master.gain.cancelScheduledValues(FM.ctx.currentTime);
  FM.master.gain.setValueAtTime(fmGain(), FM.ctx.currentTime);
  FM.next = FM.ctx.currentTime + .06;
  FM.timer = setInterval(fmTick, 90);
  fmTick();
}
function fmPause() { clearInterval(FM.timer); FM.timer = null; if (FM.ctx) { FM.master.gain.setValueAtTime(0, FM.ctx.currentTime); FM.ctx.suspend(); } }
function fmDuck(on) { FM.duck = on; if (FM.ctx && FM.timer) FM.master.gain.setTargetAtTime(fmGain(), FM.ctx.currentTime, .08); }
function fmSet(style) {
  fmPause();
  FM.style = style; FM.step = 0;
  if (style) fmRun();
}
// Pentru „Pornește muzica” după repornirea aplicației: browserul cere o atingere înainte de sunet.
function fmNextStyle() { return FM_ORDER[(FM_ORDER.indexOf(FM.style) + 1) % FM_ORDER.length]; }
