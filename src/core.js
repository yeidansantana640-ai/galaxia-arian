/* ================= utilities ================= */
const $ = (s, r = document) => r.querySelector(s);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const reduced = () => document.documentElement.dataset.motion === "reduced";
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) for (const k in props) {
    const v = props[k];
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "style" && typeof v === "object") { for (const sk in v) sk.startsWith("--") ? el.style.setProperty(sk, v[sk]) : (el.style[sk] = v[sk]); }
    else if (k === "html") el.innerHTML = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k.startsWith("--")) el.style.setProperty(k, v);
    else if (v === true) el.setAttribute(k, "");
    else el.setAttribute(k, v);
  }
  for (const c of kids.flat(9)) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(c));
  return el;
}
const svgNS = "http://www.w3.org/2000/svg";
function s(tag, attrs, ...kids) {
  const el = document.createElementNS(svgNS, tag);
  for (const k in attrs || {}) el.setAttribute(k, attrs[k]);
  for (const c of kids.flat(9)) if (c) el.append(c);
  return el;
}
function svgHTML(markup, cls) { const d = document.createElement("span"); d.innerHTML = markup.trim(); const el = d.firstChild; if (cls) el.classList.add(cls); return el; }
function hash(str) { let x = 2166136261; for (let i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; }
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const START = new Date(2026, 5, 21);
function daysSince() { const n = new Date(); n.setHours(0, 0, 0, 0); return Math.round((n - START) / 864e5); }

/* ================= icons ================= */
const ICON = {
  map: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3.5 9.5c4 2 13 2 17 0M3.5 14.5c4-2 13-2 17 0"/><circle cx="12" cy="12" r="2.2"/></svg>',
  cards: '<svg viewBox="0 0 24 24"><path d="M4 7l8 5 8-5"/><rect x="3" y="5" width="18" height="14" rx="2.5"/></svg>',
  planets: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5.5"/><path d="M3 15.5c2.5 2.3 15.5-3.7 18-8.5-1.4-1.4-5 .1-8.3 2"/></svg>',
  memories: '<svg viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.1 1.2 6L12 16.4 6.6 19.4l1.2-6L3.3 9.3l6.1-.7z"/></svg>',
  secrets: '<svg viewBox="0 0 24 24"><path d="M12 2.8l8 4.6v9.2l-8 4.6-8-4.6V7.4z"/><path d="M12 12l8-4.6M12 12v9.2M12 12L4 7.4"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
  target: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="1.5"/></svg>',
  galaxy: '<svg viewBox="0 0 24 24"><path d="M12 12c0-3 3-4.5 5-3s1.5 6-3 7.5S5 15 5.5 10 11 3 15.5 4"/><path d="M12 12c0 3-3 4.5-5 3"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>',
  back: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg>',
  sound: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/></svg>',
  mute: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
};
const icon = (n, cls) => svgHTML(ICON[n], cls);

/* ================= store (compatible with galaxia-arian:v1) ================= */
const KEY = "galaxia-arian:v1";
const DEF_SETTINGS = { graphics: "auto", motion: "system", muted: false, volume: .5, textScale: 1, devOpenAll: false, ambience: false };
const S = {
  profile: null, wizard: null, tutorialDone: false, readLetters: [], settings: { ...DEF_SETTINGS }, introSeen: false,
  visited: {}, story: { chapter: 0, complete: false }, lastPlanet: null, flags: {}, counters: {}, data: {},
};
let memOnly = false;
(function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const j = JSON.parse(raw); const st = j && j.state || {};
      for (const k in S) if (st[k] !== undefined && st[k] !== null) S[k] = st[k];
      if (st.profile) S.profile = st.profile;
      S.settings = { ...DEF_SETTINGS, ...(st.settings || {}) };
    }
  } catch (e) { memOnly = true; }
})();
const listeners = new Set();
let saveT = 0;
function save() {
  clearTimeout(saveT);
  saveT = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ state: { ...S, wizard: null }, version: 3 })); } catch (e) { memOnly = true; }
  }, 120);
}
function emit() { save(); listeners.forEach(f => { try { f(); } catch (e) { console.error(e); } }); }
const onChange = f => (listeners.add(f), () => listeners.delete(f));
const getData = (k, d) => S.data[k] ?? d;
function setData(k, v) { S.data = { ...S.data, [k]: v }; emit(); }
const flag = f => !!S.flags[f];
const favs = () => getData("favorites", []);
function toggleFav(id) { const f = favs(); setData("favorites", f.includes(id) ? f.filter(x => x !== id) : [...f, id]); }

/* ================= world data ================= */
const PLANETS = DATA.planets;
const P = Object.fromEntries(PLANETS.map(p => [p.id, p]));
const LETTERS = DATA.letters;
const LBYID = Object.fromEntries(LETTERS.map(l => [l.id, l]));
const ORDER = ["naboo", "coruscant", "tatooine", "endor", "ahch-to", "mustafar", "alderaan", "hoth", "bespin", "kashyyyk", "jedha", "desconocido"];
/* galactic layout (world units 2400 x 1700) */
const WORLD = { w: 2400, h: 1700 };
const LAYOUT = {
  naboo: { x: 640, y: 1290, r: 58, region: "Borde Medio", sector: "Sector Chommell · O-17" },
  coruscant: { x: 1060, y: 1130, r: 62, region: "Núcleo", sector: "Sector Corusca · 0-0-0" },
  tatooine: { x: 1480, y: 1300, r: 54, region: "Borde Exterior", sector: "Sector Arkanis · R-16" },
  endor: { x: 1880, y: 1120, r: 42, region: "Borde Exterior", sector: "Sector Moddell · H-16" },
  "ahch-to": { x: 2080, y: 770, r: 50, region: "Regiones Desconocidas", sector: "Sistema Ahch-To · ?" },
  mustafar: { x: 1700, y: 600, r: 46, region: "Borde Exterior", sector: "Sistema Mustafar · L-19" },
  alderaan: { x: 1270, y: 760, r: 50, region: "Núcleo", sector: "Sector Alderaan · M-10" },
  hoth: { x: 860, y: 640, r: 50, region: "Borde Exterior", sector: "Sistema Hoth · K-18" },
  bespin: { x: 440, y: 820, r: 62, region: "Borde Exterior", sector: "Sistema Anoat · K-18" },
  kashyyyk: { x: 380, y: 400, r: 54, region: "Borde Medio", sector: "Sistema Kashyyyk · P-9" },
  jedha: { x: 830, y: 250, r: 40, region: "Borde Medio", sector: "Sistema NaJedha · M-7" },
  desconocido: { x: 1350, y: 230, r: 48, region: "Más allá del mapa", sector: "Coordenadas: desconocidas" },
};
const REGIONS = [
  { x: 1060, y: 1530, t: "Borde Medio", s: "Aquí empieza el viaje" },
  { x: 2050, y: 1450, t: "Borde Exterior", s: "Tatooine · Endor" },
  { x: 1240, y: 940, t: "Núcleo Profundo", s: "Coruscant · Alderaan" },
  { x: 2050, y: 420, t: "Regiones Desconocidas", s: "Ahch-To" },
  { x: 380, y: 1150, t: "Sistema Anoat", s: "Bespin" },
];
/* each planet's look */
const LOOK = {
  naboo: { kind: "terran", c: ["#2b6fae", "#3d9b6a", "#9fe3c0", "#f4fff8"], atm: "#a8ffe0", rot: 70 },
  coruscant: { kind: "city", c: ["#2a1b2e", "#4a2f3a", "#ffcf7a", "#ffefc0"], atm: "#ffc16b", rot: 90 },
  tatooine: { kind: "desert", c: ["#b8763c", "#d9a35e", "#f2d39a", "#fff0cf"], atm: "#ffd38a", rot: 80 },
  endor: { kind: "forest", c: ["#163c22", "#2f6b33", "#5fa04a", "#cfe9b0"], atm: "#b6ff9a", rot: 60 },
  "ahch-to": { kind: "ocean", c: ["#0f3560", "#1f5f9a", "#3f86c4", "#dfefff"], atm: "#a8d0ff", rot: 100 },
  mustafar: { kind: "lava", c: ["#1a0a0a", "#3a1410", "#ff5a1f", "#ffd06b"], atm: "#ff7a4d", rot: 55 },
  alderaan: { kind: "terran", c: ["#2f6fb8", "#5fa8e0", "#a9c98a", "#ffffff"], atm: "#b0dcff", rot: 75 },
  hoth: { kind: "ice", c: ["#8fb3d4", "#cfe2f2", "#f4faff", "#ffffff"], atm: "#e3f4ff", rot: 110 },
  bespin: { kind: "gas", c: ["#d9849f", "#f0b48a", "#ffe2c4", "#c06a9a"], atm: "#ffb8d2", rot: 45 },
  kashyyyk: { kind: "forest", c: ["#0e3a2a", "#1f6b44", "#3fa06a", "#a8e8b8"], atm: "#8affc0", rot: 65 },
  jedha: { kind: "moon", c: ["#8a6a4a", "#b89670", "#e8d3b0", "#fff4dc"], atm: "#ffe0b0", rot: 95 },
  desconocido: { kind: "void", c: ["#120a2a", "#3a1f7a", "#8a5cd8", "#e5c9ff"], atm: "#c9a0ff", rot: 40 },
};
/* hyperspace lane: story order */
const LANE = ["naboo", "coruscant", "tatooine", "endor", "ahch-to", "mustafar", "alderaan", "hoth", "bespin", "kashyyyk", "jedha", "desconocido"];
const LANE_EDGES = LANE.slice(1).map((b, i) => [LANE[i], b]);

/* ================= unlock logic ================= */
const visitedCount = () => Object.keys(S.visited).filter(k => S.visited[k]).length;
function cond(u) {
  if (!u) return true;
  switch (u.type) {
    case "always": return true;
    case "flag": return !!S.flags[u.flag];
    case "planet-visited": return !!S.visited[u.planet];
    case "planets-visited": return visitedCount() >= u.min;
    case "all": return u.of.every(cond);
    case "any": return u.of.some(cond);
    case "counter": return (S.counters[u.key] || 0) >= u.min;
    case "day-of-month": return new Date().getDate() === u.day;
  }
  return false;
}
function letterUnlocked(l) {
  if (S.settings.devOpenAll) return true;
  if (cond(l.unlock)) { if (l.unlock.type === "any" && l.unlock.of.some(o => o.type === "day-of-month")) rememberDay(l.id); return true; }
  return getData("seenUnlock", []).includes(l.id) && l.unlock.type === "any";
}
function rememberDay(id) { const s = getData("seenUnlock", []); if (!s.includes(id)) S.data.seenUnlock = [...s, id]; }
const unlockedSet = () => new Set(LETTERS.filter(letterUnlocked).map(l => l.id));
const lettersOf = pid => LETTERS.filter(l => l.planet === pid);
function planetUnlocked(pid) {
  if (pid !== "desconocido") return true;
  return S.settings.devOpenAll || visitedCount() >= 10 || !!S.visited.desconocido;
}
const markRead = id => {
  if (S.readLetters.includes(id)) return;
  S.readLetters = [...S.readLetters, id]; S.counters = { ...S.counters, "letters.read": S.readLetters.length }; emit();
};
function visit(pid) {
  const before = unlockedSet();
  S.visited = { ...S.visited, [pid]: true }; S.lastPlanet = pid; emit(); announce(before);
}
function raise(f) {
  if (S.flags[f]) return;
  const before = unlockedSet();
  const effBefore = activeEffects().map(e => e.id);
  S.flags = { ...S.flags, [f]: true }; payFlag(f); emit();
  SFX.unlock();
  for (const e of activeEffects()) if (!effBefore.includes(e.id)) toast("📡", e.effect.title, e.effect.body, () => go("planet", { id: e.effect.planet }));
  announce(before);
}
function announce(before) {
  const now = unlockedSet(), fresh = [...now].filter(id => !before.has(id));
  if (!fresh.length || document.querySelector(".modal")) return;
  const l = LBYID[fresh[0]];
  setTimeout(() => fresh.length === 1 ? toast(kindOf(l).glyph, kindOf(l).arrive, l.title, () => openLetter(l.id))
    : toast("📡", `${fresh.length} cartas nuevas`, fresh.map(i => LBYID[i].title).join(" · "), () => go("letters", { f: "unread" })), 450);
}
const activeEffects = () => DATA.effects.filter(e => e.requires.every(f => S.flags[f]));
function kindOf(l) {
  if (l.category === "secreta") return { k: "holocron", name: "Holocrón", arrive: "Holocrón desbloqueado", glyph: "◈" };
  if (l.category === "fe-valores") return { k: "archive", name: "Archivo Jedi", arrive: "Documento del Archivo Jedi", glyph: "📜" };
  return { k: "holo", name: "Transmisión", arrive: "Nueva transmisión holográfica", glyph: "📡" };
}
const CAT = { historia: "Nuestra historia", admiracion: "Admiración", recuerdos: "Recuerdos", suenos: "Sueños", distancia: "Distancia", momentos: "Momentos", "fe-valores": "Fe y valores", secreta: "Secreta" };
const LANG = { es: null, va: "Valencià", bilingue: "Bilingüe" };

/* ================= audio ================= */
let AC = null, ambNodes = null;
function ac() {
  if (S.settings.muted) return null;
  if (!AC) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); }
  if (AC.state === "suspended") AC.resume();
  return AC;
}
function tone(list) {
  const a = ac(); if (!a) return; const vol = S.settings.volume ?? .5, t0 = a.currentTime;
  for (const o of list) {
    const osc = a.createOscillator(), g = a.createGain(), t = t0 + (o.start || 0);
    osc.type = o.type || "sine"; osc.frequency.setValueAtTime(o.f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + o.d);
    const pk = (o.g ?? .18) * vol;
    g.gain.setValueAtTime(1e-4, t); g.gain.exponentialRampToValueAtTime(Math.max(pk, 2e-4), t + (o.a || .015)); g.gain.exponentialRampToValueAtTime(1e-4, t + o.d);
    osc.connect(g).connect(a.destination); osc.start(t); osc.stop(t + o.d + .05);
  }
}
function noise(d, f0, f1, g = .2) {
  const a = ac(); if (!a) return; const vol = S.settings.volume ?? .5;
  const len = a.sampleRate * d, buf = a.createBuffer(1, len, a.sampleRate), ch = buf.getChannelData(0);
  for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource(); src.buffer = buf;
  const bp = a.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.2;
  bp.frequency.setValueAtTime(f0, a.currentTime); bp.frequency.exponentialRampToValueAtTime(f1, a.currentTime + d);
  const gn = a.createGain(); gn.gain.setValueAtTime(1e-4, a.currentTime); gn.gain.exponentialRampToValueAtTime(g * vol, a.currentTime + d * .4); gn.gain.exponentialRampToValueAtTime(1e-4, a.currentTime + d);
  src.connect(bp).connect(gn).connect(a.destination); src.start();
}
const SFX = {
  tap: () => tone([{ f: 660, to: 880, d: .07, type: "triangle", g: .1 }]),
  select: () => tone([{ f: 520, d: .12, g: .12 }, { f: 780, start: .07, d: .18, g: .1 }]),
  beep: () => { const r = Math.random; tone([{ f: 900 + r() * 900, to: 1400 + r() * 900, d: .08, type: "square", g: .04 }, { f: 1200 + r() * 600, start: .1, to: 700, d: .1, type: "square", g: .04 }, { f: 1600, start: .22, d: .06, type: "square", g: .03 }]); },
  unlock: () => tone([{ f: 523, d: .2, type: "triangle" }, { f: 659, start: .1, d: .2, type: "triangle" }, { f: 784, start: .2, d: .35, type: "triangle" }, { f: 1046, start: .3, d: .5, g: .1 }]),
  saber: () => { tone([{ f: 90, to: 150, d: .7, type: "sawtooth", g: .06, a: .05 }, { f: 180, to: 300, d: .6, type: "sawtooth", g: .03 }]); noise(.5, 400, 2400, .05); },
  jump: () => { noise(1.4, 200, 4000, .25); tone([{ f: 80, to: 900, d: 1.2, type: "sawtooth", g: .05, a: .3 }]); },
  holo: () => tone([{ f: 1320, d: .05, type: "square", g: .03 }, { f: 1760, start: .06, d: .05, type: "square", g: .03 }, { f: 2200, start: .12, d: .09, g: .05 }]),
  good: () => tone([{ f: 784, d: .15 }, { f: 1175, start: .09, d: .3, g: .12 }]),
  bad: () => tone([{ f: 220, to: 160, d: .25, type: "triangle", g: .14 }]),
  note: f => tone([{ f, d: .45, g: .16 }, { f: f * 2, d: .3, g: .04 }]),
};
const AMB = {
  naboo: [220, 277, 330], coruscant: [196, 247, 294], tatooine: [174, 220, 261], endor: [196, 233, 294], "ahch-to": [147, 185, 220], mustafar: [110, 131, 165],
  alderaan: [262, 330, 392], hoth: [294, 370, 440], bespin: [233, 294, 349], kashyyyk: [165, 208, 247], jedha: [185, 220, 277], desconocido: [123, 156, 185],
};
let ambPid = null;
function ambience(pid) {
  if (pid && pid === ambPid && ambNodes) return;
  stopAmbience(); ambPid = pid;
  if (!pid || !S.settings.ambience) return;
  const a = ac(); if (!a) return;
  const master = a.createGain(); master.gain.value = 0; master.connect(a.destination);
  master.gain.linearRampToValueAtTime(.05 * (S.settings.volume ?? .5) * 2, a.currentTime + 3);
  const lp = a.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900; lp.connect(master);
  const oscs = (AMB[pid] || AMB.naboo).map((f, i) => {
    const o = a.createOscillator(); o.type = i ? "sine" : "triangle"; o.frequency.value = f; o.detune.value = (i - 1) * 6;
    const g = a.createGain(); g.gain.value = .33; const lfo = a.createOscillator(); lfo.frequency.value = .07 + i * .05; const lg = a.createGain(); lg.gain.value = .2;
    lfo.connect(lg).connect(g.gain); o.connect(g).connect(lp); o.start(); lfo.start(); return [o, lfo];
  });
  ambNodes = { master, oscs };
}
function stopAmbience() {
  ambPid = null;
  if (!ambNodes || !AC) return; const { master, oscs } = ambNodes; ambNodes = null;
  try { master.gain.cancelScheduledValues(AC.currentTime); master.gain.setTargetAtTime(0, AC.currentTime, .4); setTimeout(() => oscs.flat().forEach(o => { try { o.stop(); } catch (e) { } }), 1500); } catch (e) { }
}

/* ================= procedural planet textures ================= */
const TEX = {};
function vnoise(r) {
  const G = 64, g = []; for (let i = 0; i < G * G; i++) g.push(r());
  const at = (x, y) => g[((y % G + G) % G) * G + ((x % G + G) % G)];
  const sm = t => t * t * (3 - 2 * t);
  return (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi); return lerp(lerp(at(xi, yi), at(xi + 1, yi), xf), lerp(at(xi, yi + 1), at(xi + 1, yi + 1), xf), yf); };
}
function hex2rgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function mix(c1, c2, t) { return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)]; }
function ramp(cols, t) { t = clamp(t, 0, .9999) * (cols.length - 1); const i = Math.floor(t); return mix(cols[i], cols[i + 1], t - i); }
function texture(pid) {
  if (TEX[pid]) return TEX[pid];
  const L = LOOK[pid], W = 256, H = 128, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const cx = cv.getContext("2d"), img = cx.createImageData(W, H), r = rng(hash(pid)), n = vnoise(r), n2 = vnoise(r);
  const C = L.c.map(hex2rgb);
  // tileable horizontally: sample on a cylinder
  const fbm = (u, v, oct, f) => { let a = 0, amp = .5, fr = f; for (let o = 0; o < oct; o++) { const ang = u * Math.PI * 2, R = fr * 1.6; a += amp * n(Math.cos(ang) * R + 32, Math.sin(ang) * R + 32 + v * fr * 3.2); amp *= .5; fr *= 2; } return a; };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const u = x / W, v = y / H, lat = Math.abs(v - .5) * 2; let col;
    const e = fbm(u, v, 5, 1.6);
    switch (L.kind) {
      case "terran": {
        const land = e > .52; col = land ? ramp([C[1], C[2]], (e - .52) * 3) : ramp([C[0], mix(C[0], [255, 255, 255], .25)], e * 1.4);
        const cl = fbm(u + .3, v * 1.3, 4, 2.4); if (cl > .55) col = mix(col, C[3], clamp((cl - .55) * 3.2, 0, .85));
        if (lat > .86) col = mix(col, [250, 255, 255], (lat - .86) * 7);
        break;
      }
      case "city": {
        const blk = (Math.floor(x / 3) * 7 + Math.floor(y / 3) * 13) % 5 === 0;
        col = ramp([C[0], C[1]], e); const lights = n2(x * .9, y * .9) > .62 || (blk && e > .45);
        if (lights) col = mix(col, C[2], .55 + r() * .4); if (r() > .985) col = C[3];
        break;
      }
      case "desert": { const b = Math.sin(v * 24 + e * 6) * .5 + .5; col = ramp([C[0], C[1], C[2], C[3]], e * .7 + b * .3); break; }
      case "forest": { col = ramp([C[0], C[1], C[2]], e * 1.15); const cl = fbm(u + .5, v, 4, 2.2); if (cl > .6) col = mix(col, C[3], (cl - .6) * 2.2); break; }
      case "ocean": { col = ramp([C[0], C[1], C[2]], e); if (e > .64) col = mix([60, 90, 70], [120, 130, 110], (e - .64) * 4); const cl = fbm(u + .2, v, 4, 2.6); if (cl > .56) col = mix(col, C[3], clamp((cl - .56) * 2.8, 0, .8)); break; }
      case "lava": { col = ramp([C[0], C[1]], e); const cr = Math.abs(fbm(u, v, 4, 2.2) - .5); if (cr < .05) col = mix(C[3], C[2], cr * 20); else if (cr < .09) col = mix(col, C[2], (.09 - cr) * 14); break; }
      case "ice": { col = ramp([C[0], C[1], C[2], C[3]], e * 1.1); const cr = Math.abs(fbm(u + .4, v, 3, 3) - .5); if (cr < .03) col = mix(col, [140, 180, 220], .6); break; }
      case "gas": { const b = Math.sin(v * 30 + fbm(u, v, 3, 1.4) * 5) * .5 + .5; col = ramp([C[3], C[0], C[1], C[2]], b * .8 + e * .2); break; }
      case "moon": { col = ramp([C[0], C[1], C[2]], e); const cr = n2(x * .25, y * .25); if (cr > .72) col = mix(col, C[0], .5); if (cr > .78) col = mix(col, C[3], .3); break; }
      case "void": { const sw = Math.sin(u * 12 + v * 8 + e * 9) * .5 + .5; col = ramp([C[0], C[1], C[2]], sw * .7 + e * .3); if (r() > .995) col = C[3]; break; }
    }
    const i = (y * W + x) * 4; img.data[i] = col[0]; img.data[i + 1] = col[1]; img.data[i + 2] = col[2]; img.data[i + 3] = 255;
  }
  cx.putImageData(img, 0, 0);
  return TEX[pid] = cv.toDataURL("image/jpeg", .86);
}
/* planet DOM: textured sphere + extras */
function planetEl(pid, d, opts = {}) {
  const L = LOOK[pid];
  const wrap = h("div", { class: "pwrap", style: { position: "relative", width: d + "px", height: d + "px" } });
  const pl = h("div", { class: "planet", "--d": d + "px", "--atm": L.atm, "--rot": (opts.fast ? L.rot / 3 : L.rot) + "s", style: { backgroundImage: `url(${texture(pid)})` } });
  if (pid === "bespin") {
    wrap.append(svgHTML(`<svg class="p-extra" viewBox="0 0 100 100" style="left:-35%;top:-35%;width:170%;height:170%"><ellipse cx="50" cy="50" rx="46" ry="11" fill="none" stroke="rgba(255,220,200,.35)" stroke-width="3" transform="rotate(-16 50 50)"/><ellipse cx="50" cy="50" rx="40" ry="9" fill="none" stroke="rgba(255,200,220,.25)" stroke-width="1.5" transform="rotate(-16 50 50)"/></svg>`));
  }
  wrap.append(pl);
  if (pid === "tatooine") wrap.append(svgHTML(`<svg class="p-extra" viewBox="0 0 100 100" style="left:-80%;top:-70%;width:120%;height:120%"><circle cx="40" cy="40" r="9" fill="#fff4c8"/><circle cx="62" cy="30" r="6" fill="#ffd27a"/><circle cx="40" cy="40" r="18" fill="rgba(255,230,160,.25)"/><circle cx="62" cy="30" r="13" fill="rgba(255,200,120,.2)"/></svg>`));
  if (pid === "endor") wrap.append(svgHTML(`<svg class="p-extra" viewBox="0 0 100 100" style="left:55%;top:-95%;width:130%;height:130%;z-index:-1"><defs><radialGradient id="gg" cx=".35" cy=".35"><stop offset="0" stop-color="#9fb4c8"/><stop offset=".7" stop-color="#4a5d7a"/><stop offset="1" stop-color="#1a2234"/></radialGradient></defs><circle cx="50" cy="50" r="38" fill="url(#gg)" opacity=".55"/></svg>`));
  if (pid === "jedha") wrap.append(svgHTML(`<svg class="p-extra" viewBox="0 0 100 100" style="left:52%;top:18%;width:30%;height:30%"><path d="M50 10 L62 50 L50 90 L38 50Z" fill="#bfefff" opacity=".9"/><circle cx="50" cy="50" r="30" fill="rgba(160,230,255,.25)"/></svg>`));
  if (pid === "desconocido" && !opts.revealed) wrap.append(h("div", { class: "p-extra", style: { inset: 0, display: "grid", placeItems: "center", font: `700 ${d * .45}px var(--f-display)`, color: "rgba(230,210,255,.75)", textShadow: "0 0 12px #a070ff" } }, "?"));
  return wrap;
}

/* ================= droid drawing ================= */
function droidSVG(id, size = 64) {
  const col = (DATA.droids.find(d => d.id === id) || DATA.droids[0]).color;
  if (id === "brujula") // dome astromech
    return svgHTML(`<svg viewBox="0 0 64 72" width="${size}" height="${size * 72 / 64}"><g class="bb-head"><path d="M14 30a18 18 0 0136 0z" fill="#e8eef8" stroke="#9aa8c0"/><rect x="26" y="16" width="12" height="7" rx="2" fill="${col}"/><circle cx="32" cy="19.5" r="2.2" fill="#0a1022"/><circle cx="40.5" cy="25" r="1.6" fill="#ff5a6a"/></g><rect x="15" y="31" width="34" height="30" rx="5" fill="#f2f6fc" stroke="#9aa8c0"/><rect x="21" y="36" width="22" height="4" rx="2" fill="${col}"/><rect x="21" y="44" width="9" height="9" rx="2" fill="${col}" opacity=".7"/><rect x="34" y="44" width="9" height="3" rx="1.5" fill="#9aa8c0"/><rect x="34" y="50" width="9" height="3" rx="1.5" fill="#9aa8c0"/><rect x="7" y="34" width="7" height="30" rx="3" fill="#dfe6f2" stroke="#9aa8c0"/><rect x="50" y="34" width="7" height="30" rx="3" fill="#dfe6f2" stroke="#9aa8c0"/><rect x="5" y="62" width="11" height="6" rx="2" fill="#9aa8c0"/><rect x="48" y="62" width="11" height="6" rx="2" fill="#9aa8c0"/></svg>`);
  if (id === "tuerca") // tall slim service droid
    return svgHTML(`<svg viewBox="0 0 64 72" width="${size}" height="${size * 72 / 64}"><g class="bb-head"><rect x="20" y="6" width="24" height="18" rx="9" fill="#f4eef0" stroke="#b49aa4"/><circle cx="27" cy="15" r="3.4" fill="#0a1022"/><circle cx="37" cy="15" r="3.4" fill="#0a1022"/><circle cx="27" cy="15" r="1.2" fill="${col}"/><circle cx="37" cy="15" r="1.2" fill="${col}"/><path d="M32 6V1" stroke="#b49aa4" stroke-width="2"/><circle cx="32" cy="1" r="2" fill="${col}"/></g><rect x="22" y="27" width="20" height="26" rx="6" fill="#f4eef0" stroke="#b49aa4"/><path d="M26 34h12M26 39h8" stroke="${col}" stroke-width="2.5" stroke-linecap="round"/><path d="M22 32l-8 10M42 32l8 10" stroke="#b49aa4" stroke-width="3" stroke-linecap="round"/><path d="M27 53v12M37 53v12" stroke="#b49aa4" stroke-width="3.5" stroke-linecap="round"/><path d="M23 66h8M33 66h8" stroke="#b49aa4" stroke-width="3" stroke-linecap="round"/></svg>`);
  // ball droid (default "chispa")
  return svgHTML(`<svg viewBox="0 0 64 72" width="${size}" height="${size * 72 / 64}"><g class="bb-head"><path d="M19 27a13 12 0 0126 0z" fill="#f4f6fa" stroke="#a8b0c0"/><path d="M19 27h26" stroke="${col}" stroke-width="2.4"/><circle cx="35" cy="19" r="4" fill="#0a1022"/><circle cx="36" cy="18" r="1.3" fill="#7fb8ff"/><circle cx="27" cy="22" r="1.6" fill="#0a1022"/><path d="M28 15V6M33 15V9" stroke="#a8b0c0" stroke-width="1.4"/></g><g class="bb-body"><circle cx="32" cy="50" r="19" fill="#f4f6fa" stroke="#a8b0c0"/><circle cx="32" cy="50" r="9" fill="none" stroke="${col}" stroke-width="4"/><circle cx="32" cy="50" r="3.4" fill="#c8ced8"/><path d="M14 46a19 19 0 008 18M50 46a19 19 0 01-8 18M24 33a19 19 0 0116 0" fill="none" stroke="${col}" stroke-width="3.4"/></g><ellipse cx="32" cy="70" rx="14" ry="2" fill="rgba(0,0,0,.4)"/></svg>`);
}
const droidName = () => (DATA.droids.find(d => d.id === (S.profile && S.profile.droid)) || DATA.droids[0]).label;
const herName = () => (S.profile && S.profile.name) || "Arián";

/* ================= toasts ================= */
let toastBox;
function toast(ic, title, body, onClick) {
  if (!toastBox) { toastBox = h("div", { class: "toasts", "aria-live": "polite" }); document.body.append(toastBox); }
  const t = h("div", { class: "toast holo", role: "status", onclick: () => { close(); onClick && onClick(); } }, h("div", { class: "ic" }, ic), h("div", null, h("b", null, title), h("span", null, body.length > 90 ? body.slice(0, 88) + "…" : body)));
  const close = () => { t.classList.add("out"); setTimeout(() => t.remove(), 400); };
  toastBox.append(t); SFX.holo(); setTimeout(close, 5200);
  while (toastBox.children.length > 2) toastBox.firstChild.remove();
}
