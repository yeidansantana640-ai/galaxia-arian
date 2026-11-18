/* ================= i18n runtime ================= */
// La interfaz se traduce al vuelo; las cartas de Yeidan (títulos y textos) se quedan siempre tal cual.
const isVA = () => S.settings.lang === "va";
let I18N_PROT = null, I18N_LOW = null;
const I18N_CACHE = new Map();
function i18nProt() {
  if (!I18N_PROT && typeof LETTERS !== "undefined" && LETTERS.some(l => l.body && l.body.length && l.title)) {
    I18N_PROT = new Set();
    for (const l of LETTERS) { if (l.title) I18N_PROT.add(String(l.title).trim()); for (const p of l.body || []) I18N_PROT.add(String(p).trim()); }
  }
  return I18N_PROT;
}
function trCore(c, depth = 0) {
  if (I18N_CACHE.has(c)) return I18N_CACHE.get(c);
  let r = I18N_VA[c];
  if (r == null && depth < 3) for (const [re, va] of I18N_PAT) {
    const m = c.match(re); if (!m) continue;
    r = va.replace(/\{(\d)\}/g, (_, i) => { const g = m[+i + 1] ?? ""; return g ? (trCore(g.trim(), depth + 1) ?? g) : g; });
    break;
  }
  if (r == null && depth < 3 && c.includes(" · ")) {
    const ps = c.split(" · "), ts = ps.map(x => trCore(x.trim(), depth + 1));
    if (ts.some(x => x != null)) r = ps.map((x, i) => ts[i] ?? x).join(" · ");
  }
  if (r == null && depth < 3) {
    let m = c.match(/^([^A-Za-zÀ-ÿ¡¿«"]+)(\S[\s\S]*)$/);
    if (m) { const t = trCore(m[2], depth + 1); if (t != null) r = m[1] + t; }
    if (r == null && (m = c.match(/^([\s\S]*?\S)(\s*\d+\s*\/\s*\d+)$/))) { const t = trCore(m[1], depth + 1); if (t != null) r = t + m[2]; }
  }
  if (r == null && /^[a-záéíóúñ]/.test(c)) {
    if (!I18N_LOW) { I18N_LOW = {}; for (const k in I18N_VA) I18N_LOW[k.toLowerCase()] = I18N_VA[k].toLowerCase(); }
    r = I18N_LOW[c] ?? null;
  }
  if (r == null) r = null; else r = r.replace(/\b(\d+) cartas\b/g, "$1 cartes");
  if (I18N_CACHE.size < 5000) I18N_CACHE.set(c, r);
  return r;
}
function tr(str) {
  if (!isVA() || !str || typeof str !== "string") return str;
  const m = str.match(/^(\s*)([\s\S]*?)(\s*)$/), c = m[2];
  if (!c || !/[A-Za-zÀ-ÿ]/.test(c)) return str;
  const p = i18nProt(); if (p && p.has(c)) return str;
  const r = trCore(c);
  return r == null ? str : m[1] + r + m[3];
}
const I18N_ATTRS = ["placeholder", "aria-label", "title"];
function i18nNode(n) {
  if (n.nodeType === 3) {
    const pe = n.parentElement; if (!pe || pe.closest("script,style,textarea,.paper,[data-noi18n]")) return;
    const v = tr(n.data); if (v !== n.data) n.data = v;
    return;
  }
  if (n.nodeType !== 1 || n.matches("script,style,[data-noi18n]")) return;
  const walk = el => {
    for (const a of I18N_ATTRS) { const v = el.getAttribute && el.getAttribute(a); if (v) { const t = tr(v); if (t !== v) el.setAttribute(a, t); } }
  };
  walk(n); n.querySelectorAll("[placeholder],[aria-label],[title]").forEach(walk);
  const tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); let t; const list = [];
  while ((t = tw.nextNode())) list.push(t);
  list.forEach(i18nNode);
}
function i18nStart() {
  document.documentElement.lang = isVA() ? "ca-valencia" : "es";
  if (!isVA()) return;
  document.title = tr(document.title);
  i18nNode(document.body);
  new MutationObserver(ms => {
    for (const m of ms) {
      if (m.type === "childList") m.addedNodes.forEach(i18nNode);
      else if (m.type === "characterData") i18nNode(m.target);
      else if (m.type === "attributes") { const v = m.target.getAttribute(m.attributeName); if (v) { const t = tr(v); if (t !== v) m.target.setAttribute(m.attributeName, t); } }
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: I18N_ATTRS });
}
function setLang(l) {
  if (S.settings.lang === l) return;
  S.settings = { ...S.settings, lang: l };
  try { localStorage.setItem(KEY, JSON.stringify({ state: { ...S, wizard: null }, version: 3 })); } catch (e) { }
  document.documentElement.classList.add("lang-out");
  setTimeout(() => location.reload(), 260);
}
function langToggle(cls) {
  const b = h("div", { class: "langsw " + (cls || ""), role: "group", "aria-label": "Idioma" },
    ["es", "va"].map(l => h("button", { "data-on": (S.settings.lang || "es") === l ? "" : null, "aria-pressed": String((S.settings.lang || "es") === l), onclick: e => { e.stopPropagation(); setLang(l); } }, l === "es" ? "ES" : "VAL")));
  b.setAttribute("data-noi18n", ""); return b;
}
i18nStart();
