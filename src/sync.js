/* ================= SYNC: la misma galaxia en el móvil, el iPad y el ordenador ================= */
// El progreso se guarda cifrado (AES-GCM, con una clave derivada de la de las cartas) en una tabla de Supabase.
// Sin la contraseña de entrada nadie puede saber qué fila es ni leer lo que hay dentro.
const SYNC_CFG = { url: "", key: "" }; // ← URL del proyecto y clave pública (anon / publishable) de Supabase
const SYNC_META = "galaxia-arian:sync";
const SYNC_UNION = ["seenUnlock", "fauna", "porgs", "diary", "postcards", "places", "capsule", "missions", "beacons", "trips"];
const syncOn = () => !!(SYNC_CFG.url && SYNC_CFG.key) && !isAdmin();
const syncState = { status: "off", at: 0, busy: null, again: false, ready: false };
function syncMeta(patch) {
  let m = {}; try { m = JSON.parse(localStorage.getItem(SYNC_META) || "{}"); } catch (e) { m = syncMeta.mem || {}; }
  if (patch) { m = { ...m, ...patch }; try { localStorage.setItem(SYNC_META, JSON.stringify(m)); } catch (e) { syncMeta.mem = m; } }
  return m;
}
async function syncKeys() {
  if (syncKeys.v) return syncKeys.v;
  let raw; try { raw = localStorage.getItem(KKEY) || (openLetters.mem && b64u(openLetters.mem)); } catch (e) { }
  if (!raw) return null;
  const C = crypto.subtle, K = ub64(raw), enc = new TextEncoder();
  const dig = async tag => new Uint8Array(await C.digest("SHA-256", new Uint8Array([...enc.encode(tag), ...K])));
  const id = [...await dig("galaxia-sync-id|")].map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 40);
  const key = await C.importKey("raw", await dig("galaxia-sync-key|"), "AES-GCM", false, ["encrypt", "decrypt"]);
  return (syncKeys.v = { id, key });
}
function syncHeaders(extra) {
  const k = SYNC_CFG.key, hd = { apikey: k, "Content-Type": "application/json", ...extra };
  if (k.startsWith("eyJ")) hd.Authorization = "Bearer " + k;
  return hd;
}
const syncBase = () => SYNC_CFG.url.replace(/\/+$/, "") + "/rest/v1/galaxia";
function syncTimeout(ms) { const c = new AbortController(); setTimeout(() => c.abort(), ms); return c.signal; }
async function syncFetch(K) {
  const r = await fetch(`${syncBase()}?id=eq.${K.id}&select=data`, { headers: syncHeaders(), signal: syncTimeout(8000), cache: "no-store" });
  if (!r.ok) throw new Error("pull " + r.status);
  const rows = await r.json(); if (!rows.length) return null;
  const [iv, ct] = rows[0].data.split(".");
  return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: ub64(iv) }, K.key, ub64(ct))));
}
async function syncPush(K, doc, keepalive) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, K.key, new TextEncoder().encode(JSON.stringify(doc))));
  const r = await fetch(syncBase(), { method: "POST", keepalive: !!keepalive, signal: keepalive ? undefined : syncTimeout(8000), headers: syncHeaders({ Prefer: "resolution=merge-duplicates,return=minimal" }), body: JSON.stringify({ id: K.id, data: b64u(iv) + "." + b64u(ct), updated_at: new Date().toISOString() }) });
  if (!r.ok) throw new Error("push " + r.status);
}
/* --- mezclar dos progresos: nunca se pierde nada de lo conseguido --- */
const SYNC_FIELDS = ["profile", "tutorialDone", "readLetters", "introSeen", "visited", "story", "lastPlanet", "flags", "counters", "data"];
function syncLocal() { const o = {}; for (const k of SYNC_FIELDS) o[k] = S[k]; return o; }
const uniq = a => { const seen = new Set(), out = []; for (const x of a) { const k = typeof x === "object" ? JSON.stringify(x) : x; if (!seen.has(k)) { seen.add(k); out.push(x); } } return out; };
function syncMerge(a, ta, b, tb) { // a/b: estados; ta/tb: cuándo cambiaron por última vez
  const [N, O] = ta >= tb ? [a, b] : [b, a], m = { ...O, ...N };
  m.profile = N.profile || O.profile;
  m.introSeen = !!(a.introSeen || b.introSeen); m.tutorialDone = !!(a.tutorialDone || b.tutorialDone);
  m.readLetters = uniq([...(O.readLetters || []), ...(N.readLetters || [])]);
  m.visited = { ...(O.visited || {}), ...(N.visited || {}) };
  m.flags = { ...(O.flags || {}) }; for (const k in N.flags || {}) m.flags[k] = N.flags[k] || m.flags[k];
  m.counters = { ...(O.counters || {}) }; for (const k in N.counters || {}) m.counters[k] = Math.max(+N.counters[k] || 0, +m.counters[k] || 0);
  m.story = (N.story && N.story.complete) || !(O.story && O.story.complete) ? N.story : O.story;
  const od = O.data || {}, nd = N.data || {}; m.data = { ...od, ...nd };
  for (const k of SYNC_UNION) if (Array.isArray(od[k]) || Array.isArray(nd[k])) m.data[k] = uniq([...(od[k] || []), ...(nd[k] || [])]);
  for (const k of ["v3seen", "tourDone"]) if (od[k] || nd[k]) m.data[k] = true;
  if (od.droid || nd.droid) {
    const dO = od.droid || {}, dN = nd.droid || {}, d = { ...dO, ...dN };
    for (const k in d) if (Array.isArray(dO[k]) || Array.isArray(dN[k])) d[k] = uniq([...(dO[k] || []), ...(dN[k] || [])]);
    for (const k of ["xp", "best", "bestLights"]) if (k in d) d[k] = Math.max(+dO[k] || 0, +dN[k] || 0);
    m.data.droid = d;
  }
  return m;
}
const syncSame = (x, y) => JSON.stringify(x) === JSON.stringify(y);
function syncApply(m) {
  if (syncSame(m, syncLocal())) return false;
  for (const k of SYNC_FIELDS) S[k] = m[k];
  try { localStorage.setItem(KEY, JSON.stringify({ state: { ...S, wizard: null }, version: 3 })); } catch (e) { }
  return true;
}
/* --- ciclo: traer, mezclar, guardar --- */
async function syncNow(opts = {}) {
  if (!syncOn()) return;
  if (syncState.busy) { syncState.again = true; return syncState.busy; }
  syncState.busy = (async () => {
    try {
      const K = await syncKeys(); if (!K) return;
      const meta = syncMeta(), remote = await syncFetch(K);
      let doc = syncLocal(), t = meta.t || 0, changed = false;
      if (remote && remote.s) {
        const merged = syncMerge(doc, t, remote.s, remote.t || 0);
        t = Math.max(t, remote.t || 0);
        changed = syncApply(merged); doc = merged;
        if (!syncSame(merged, remote.s)) t = Date.now();
      }
      if (!remote || !syncSame(doc, remote.s)) await syncPush(K, { s: doc, t });
      syncMeta({ t, synced: Date.now() });
      syncState.status = "ok"; syncState.at = Date.now();
      if (changed && syncState.ready && !opts.quiet) { syncTouch.mute = true; try { emit(); applySettings(); } catch (e) { } syncTouch.mute = false; }
    } catch (e) { syncState.status = navigator.onLine === false ? "offline" : "error"; syncState.err = String(e && e.message || e); }
    finally { syncState.busy = null; syncPaint(); if (syncState.again) { syncState.again = false; setTimeout(syncNow, 400); } }
  })();
  return syncState.busy;
}
let syncT = 0;
function syncTouch() { // llamado en cada guardado local
  if (!syncOn() || syncTouch.mute) return;
  syncMeta({ t: Date.now() });
  clearTimeout(syncT); syncT = setTimeout(syncNow, 2500);
}
async function syncBoot() { // antes de la intro: en un dispositivo nuevo trae el progreso que ya existe
  if (!syncOn()) return;
  syncState.status = "busy"; syncTouch.mute = true;
  try { await Promise.race([syncNow({ quiet: true }), new Promise(r => setTimeout(r, 6000))]); } finally { syncTouch.mute = false; syncState.ready = true; }
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") syncNow(); else if (syncMeta().t > (syncMeta().synced || 0)) syncNow(); });
  addEventListener("online", () => syncNow());
  setInterval(() => { if (document.visibilityState === "visible" && !$(".modal") && !$(".reader")) syncNow(); }, 90000);
}
/* --- indicador en Opciones --- */
function syncPaint() { document.querySelectorAll(".sync-st").forEach(el => el.replaceWith(syncBadge())); }
function syncBadge() {
  const st = syncState.status, ago = syncState.at ? Math.max(0, Math.round((Date.now() - syncState.at) / 60000)) : null;
  const txt = !SYNC_CFG.url ? "Sincronización aún no activada" : isAdmin() ? "Modo administrador: no se sincroniza" : st === "ok" ? (ago < 1 ? "Sincronizado ahora mismo" : `Sincronizado hace ${ago} min`) : st === "busy" ? "Sincronizando…" : st === "offline" ? "Sin conexión: se sincronizará al volver" : st === "error" ? "No se pudo sincronizar. Se reintentará sola." : "Sincronizando…";
  return h("span", { class: "sync-st", "data-st": st }, st === "ok" ? "☁️ " : "⏳ ", txt);
}
