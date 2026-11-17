/* ================= DROID: care, chat, accessories, Orbi, achievements ================= */
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const DROID_DEF = { energy: 70, clean: 80, repair: 85, xp: 0, cred: 5, owned: [], equipped: {}, careDays: [], xpDay: {}, paidFlags: [], fragments: [], greetedOn: null, bestLights: 0, pilotOn: null, sphereOn: null };
const ACC = Object.fromEntries(DATA2.acc.map(a => [a.id, a]));
function dget() { return { ...DROID_DEF, ...(S.data.droid || {}) }; }
function dset(patch) { const d = { ...dget(), ...patch }; setData("droid", d); return d; }
const dLevel = d => Math.min(10, 1 + Math.floor((d || dget()).xp / 15));
function dMood(d) { d = d || dget(); const avg = (d.energy + d.clean + d.repair) / 3; return avg < 40 ? "sleepy" : avg > 85 ? "celebrate" : (hash(today()) % 2 ? "happy" : "curious"); }
function dTick() { // gentle decay since last visit, never below 25
  const d = dget(), t = today(); if (d.greetedOn === t) return;
  const days = d.greetedOn ? Math.max(0, Math.round((new Date(t) - new Date(d.greetedOn)) / 864e5)) : 0, k = Math.min(days, 6) * 8;
  S.data = { ...S.data, droid: { ...d, energy: Math.max(25, d.energy - k), clean: Math.max(25, d.clean - k), repair: Math.max(25, d.repair - k / 2), greetedOn: t } }; save();
}
function payFlag(f) { const d = dget(); if (d.paidFlags.includes(f)) return; S.data = { ...S.data, droid: { ...d, cred: d.cred + 2, paidFlags: [...d.paidFlags, f] } }; }
const fill = (t, d) => t.replace(/\{n\}/g, herName());
const pick = (arr, seed) => arr[hash(seed + today()) % arr.length];

/* accessories drawn over our droid art (viewBox 64x72) */
function accSVG(a) {
  const c = a.color;
  switch (a.shape) {
    case "antena": return `<path transform="translate(-20,-2)" d="M50 2 l1.6 3.6 3.8.4 -2.9 2.5 .9 3.8 -3.4 -2 -3.4 2 .9 -3.8 -2.9 -2.5 3.8 -.4z" fill="${c}"/>`;
    case "corona": return `<path transform="translate(5,-4)" d="M22 22 L25 11 L31 18 L36 8 L41 18 L47 11 L50 22 Z" fill="${c}" stroke="#0b0f21" stroke-width="1" stroke-linejoin="round"/>`;
    case "lazo": return `<g transform="translate(-2,0)" fill="${c}" stroke="#0b0f21" stroke-width=".8"><path d="M24 14 L16 9 L16 19 Z"/><path d="M24 14 L32 9 L32 19 Z"/><circle cx="24" cy="14" r="2.4"/></g>`;
    case "gorra": return `<g transform="translate(-4,-9)"><path d="M18 27 A18 15 0 0 1 54 27 Z" fill="${c}" stroke="#0b0f21" stroke-width="1"/><path d="M46 26 L62 28 L46 30 Z" fill="${c}"/></g>`;
    case "gafas": return `<g transform="translate(-4,-11)" fill="rgba(5,6,12,.55)" stroke="${c}" stroke-width="1.8"><circle cx="29" cy="30" r="5"/><circle cx="40" cy="30" r="5"/><path d="M34 30 h1"/></g>`;
    case "bufanda": return `<g transform="translate(-4,-8)" fill="${c}" stroke="#0b0f21" stroke-width=".8"><rect x="15" y="35" width="42" height="6" rx="3"/><rect x="44" y="39" width="6" height="12" rx="2.5"/></g>`;
    case "insignia": return `<g transform="translate(-4,-6)"><circle cx="27" cy="52" r="4.5" fill="${c}" stroke="#0b0f21" stroke-width=".8"/><path d="M27 48.6 l1 2 2.2.3 -1.6 1.5 .4 2.2 -2-1.1 -2 1.1 .4-2.2 -1.6-1.5 2.2-.3z" fill="#0b0f21"/></g>`;
    case "panel": return `<g transform="translate(-4,6)"><rect x="26" y="48" width="20" height="7" rx="2" fill="#0b0f21" stroke="${c}" stroke-width="1.2"/><circle cx="31" cy="51.5" r="1.6" fill="${c}"/><circle cx="36" cy="51.5" r="1.6" fill="#fff" opacity=".85"/><circle cx="41" cy="51.5" r="1.6" fill="${c}"/></g>`;
    case "alas": return `<g fill="${c}" stroke="#0b0f21" stroke-width=".8" transform="translate(-4,2)"><path d="M18 44 L3 36 L6 52 Z"/><path d="M54 44 L69 36 L66 52 Z"/></g>`;
    case "aro": return `<circle cx="32" cy="50" r="22" fill="none" stroke="${c}" stroke-width="2" opacity=".8" style="filter:drop-shadow(0 0 4px ${c})"/>`;
  }
  return "";
}
function droidFull(size = 64, d) {
  d = d || dget();
  const el = droidSVG((S.profile && S.profile.droid) || "chispa", size);
  const eq = Object.values(d.equipped || {}).map(id => ACC[id]).filter(Boolean);
  if (eq.length) {
    const back = eq.filter(a => a.shape === "alas" || a.shape === "aro").map(accSVG).join(""), front = eq.filter(a => a.shape !== "alas" && a.shape !== "aro").map(accSVG).join("");
    const tmp = document.createElementNS(svgNS, "g"); tmp.innerHTML = back; el.insertBefore(tmp, el.firstChild);
    const head = el.querySelector(".bb-head") || el; const f = document.createElementNS(svgNS, "g"); f.innerHTML = front; head.append(f);
  }
  const m = dMood(d); if (m === "sleepy") el.style.filter = "saturate(.5) brightness(.85)";
  return el;
}

/* ---------- achievements board ---------- */
const PREW = { a: 2, b: 3, c: 5 };
function achievements() {
  const d = dget(), list = [];
  for (const pid of ORDER) {
    const def = DATA2.pach[pid], ms = MISSIONS[pid]; if (!def) continue;
    const steps = { a: [ms[0].flag], b: [ms[1].flag], c: ms.map(m => m.flag) };
    for (const k of ["a", "b", "c"]) list.push({ id: `${pid}-${k}`, group: P[pid].name, title: def[k][0], desc: def[k][1], reward: PREW[k], prog: () => [steps[k].filter(flag).length, steps[k].length] });
  }
  const allMap = ORDER.filter(p => p !== "desconocido").flatMap(p => MISSIONS[p].map(m => m.flag));
  const claimedN = () => (getData("missions", { claimed: [] }).claimed || []).length;
  const G = [
    ["galaxia-1", "Tres mundos", "Visita tres planetas distintos.", 3, () => [visitedCount(), 3]],
    ["galaxia-2", "Medio camino", "Visita seis planetas.", 5, () => [visitedCount(), 6]],
    ["galaxia-3", "Toda la galaxia", "Visita los once planetas del mapa.", 8, () => [ORDER.filter(p => p !== "desconocido" && S.visited[p]).length, 11]],
    ["galaxia-4", "Lectora de cartas", "Lee diez cartas con calma.", 4, () => [S.readLetters.length, 10]],
    ["galaxia-5", "Mitad de la historia", "Lee treinta cartas.", 6, () => [S.readLetters.length, 30]],
    ["galaxia-6", "Cada interacción cuenta", "Completa todas las misiones de los once planetas del mapa.", 10, () => [allMap.filter(flag).length, allMap.length]],
    ["galaxia-7", "Cazadora de estrellas", "Reclama diez logros.", 6, () => [claimedN(), 10]],
    ["galaxia-8", "Constelación de logros", "Reclama veinticinco logros.", 10, () => [claimedN(), 25]],
  ];
  for (const [id, title, desc, reward, prog] of G) list.push({ id, group: "La galaxia", title, desc, reward, prog });
  const D = [
    ["droide-1", "Primer cuidado", "Cuida a tu droide un día.", 2, () => [d.careDays.length, 1]],
    ["droide-2", "Tres días distintos", "Cuídalo en tres días distintos, sin prisa y sin que tengan que ser seguidos.", 5, () => [d.careDays.length, 3]],
    ["droide-3", "Buenos amigos", "Sube la amistad con tu droide hasta el nivel 3.", 4, () => [dLevel(d), 3]],
    ["droide-4", "Estilo propio", "Consigue tres accesorios para tu droide.", 4, () => [d.owned.length, 3]],
    ["droide-5", "Siguiendo las luces", "Juega a «Sigue las luces» hasta repetir cuatro luces.", 4, () => [d.bestLights, 4]],
    ["droide-6", "Mensajes de Orbi", "Reúne cinco fragmentos de los mensajes escondidos de Orbi.", 5, () => [d.fragments.length, 5]],
    ["droide-7", "Colección completa de Orbi", "Encuentra los quince fragmentos. Orbi aparece cuando quiere; no hay prisa.", 10, () => [d.fragments.length, 15]],
  ];
  for (const [id, title, desc, reward, prog] of D) list.push({ id, group: "Tu droide", title, desc, reward, prog });
  const claimed = new Set(getData("missions", { claimed: [] }).claimed || []);
  for (const a of list) { const [n, t] = a.prog(); a.n = Math.min(n, t); a.t = t; a.state = claimed.has(a.id) ? "hecho" : n >= t ? "reclamar" : "activo"; }
  return list;
}
const claimable = () => achievements().filter(a => a.state === "reclamar").length;
function claim(a) {
  const m = getData("missions", { claimed: [] }); if ((m.claimed || []).includes(a.id)) return;
  S.data = { ...S.data, missions: { ...m, claimed: [...(m.claimed || []), a.id] } };
  const d = dget(); S.data.droid = { ...d, cred: d.cred + a.reward, xp: d.xp + 2 };
  S.counters = { ...S.counters, "missions.done": (S.data.missions.claimed || []).length };
  emit(); SFX.unlock(); celebrate(); toast("🏅", "Logro reclamado: " + a.title, `+${a.reward} chispas para tu droide`);
}
function achievementsView() {
  const list = achievements(), box = h("div", { style: { display: "grid", gap: "8px" } });
  const groups = [...new Set(list.map(a => a.group))];
  const order = { reclamar: 0, activo: 1, hecho: 2 };
  for (const g of groups) {
    const items = list.filter(a => a.group === g).sort((x, y) => order[x.state] - order[y.state]);
    const done = items.filter(a => a.state === "hecho").length;
    const det = h("details", { class: "ach-group", open: items.some(a => a.state === "reclamar") ? true : null },
      h("summary", null, h("b", null, g), h("span", { class: "chip" + (done === items.length ? " chip--ok" : "") }, `${done}/${items.length}`), items.some(a => a.state === "reclamar") ? h("span", { class: "chip chip--gold" }, "¡Reclamar!") : null),
      items.map(a => h("div", { class: "secret-row" },
        h("div", { style: { fontSize: "20px", width: "28px", textAlign: "center" } }, a.state === "hecho" ? "🏅" : a.state === "reclamar" ? "✨" : "◌"),
        h("div", { class: "grow" }, h("b", null, a.title), h("span", null, a.desc), a.state === "activo" ? h("div", { class: "bar", style: { marginTop: "6px" } }, h("i", { style: { width: a.n / a.t * 100 + "%" } })) : null),
        a.state === "reclamar" ? h("button", { class: "btn btn--gold btn--sm", onclick: () => claim(a) }, `+${a.reward} ✦`) : h("span", { class: "muted", style: { fontSize: "12px", whiteSpace: "nowrap" } }, a.state === "hecho" ? "Hecho" : `${a.n}/${a.t}`))));
    box.append(det);
  }
  return box;
}

/* ---------- NPC cards ---------- */
function npcCard(id, extra) {
  const n = DATA2.npcs[id]; if (!n) return null;
  let i = hash(today() + id) % n.lines.length;
  const txt = h("span", null, n.lines[i]);
  const card = h("button", { class: "npc holo", onclick: () => { i = (i + 1) % n.lines.length; txt.textContent = n.lines[i]; SFX.beep(); } },
    h("div", { class: "npc-face", style: { "--c": n.color } }, h("i"), h("b")),
    h("div", { class: "grow" }, h("div", { class: "eyebrow", style: { color: n.color } }, n.role), h("b", null, n.name), txt, extra || null));
  return card;
}

/* ---------- Orbi ---------- */
function orbiCard() {
  const d = dget(); if (d.fragments.length >= DATA2.frags.length || d.sphereOn === today()) return null;
  const out = h("p", { class: "bubble", style: { display: "none" } });
  const card = h("div", { class: "orbi holo" }, h("div", { class: "sphere-ball", "aria-hidden": "true" }, h("span")),
    h("div", { class: "grow" }, h("b", null, "Orbi ha pasado rodando por aquí"), h("span", { class: "muted", style: { fontSize: "13px", display: "block" } }, "Una pequeña esfera con un mensaje dentro."), out,
      h("button", { class: "btn btn--sm btn--gold", style: { marginTop: "8px" }, onclick: e => {
        const dd = dget(); const idx = [...Array(DATA2.frags.length).keys()].find(k => !dd.fragments.includes(k));
        if (idx == null) return; dset({ fragments: [...dd.fragments, idx], sphereOn: today(), cred: dd.cred + 3 });
        out.textContent = DATA2.frags[idx] + "  (+3 chispas)"; out.style.display = ""; e.target.remove(); SFX.beep();
      } }, "Escuchar el mensaje")));
  return card;
}

/* ---------- droid hangar (modal) ---------- */
function openDroid(tab = "hablar") {
  dTick();
  const body = h("div", { style: { display: "grid", gap: "14px" } });
  const close = modal(h("div", null, h("div", { class: "eyebrow" }, "Hangar del droide"), h("h2", null, droidName())), [body], null, null);
  const did = (S.profile && S.profile.droid) || "chispa", D = DATA2.dialog[did] || DATA2.dialog.chispa;
  const draw = () => {
    const d = dget(), lv = dLevel(d), mood = dMood(d);
    const head = h("div", { class: "dr-head" }, h("div", { class: "dr-ava" }, droidFull(84, d)),
      h("div", { class: "dr-stats" },
        h("div", { class: "m-row", style: { justifyContent: "flex-start", gap: "6px" } }, h("span", { class: "chip chip--accent" }, `Amistad nv. ${lv}`), h("span", { class: "chip chip--gold" }, `✦ ${d.cred} chispas`)),
        [["⚡ Energía", d.energy], ["✨ Limpieza", d.clean], ["🔧 Reparación", d.repair]].map(([l, v]) => h("div", null, h("div", { style: { display: "flex", justifyContent: "space-between" } }, h("span", null, l), h("span", null, Math.round(v) + "%")), h("div", { class: "bar" }, h("i", { style: { width: v + "%" } }))))));
    const tabs = h("div", { class: "seg" }, [["hablar", "Hablar"], ["cuidar", "Cuidar"], ["tienda", "Accesorios"], ["juegos", "Juegos"]].map(([k, t]) => h("button", { "aria-pressed": tab === k ? "true" : "false", onclick: () => { tab = k; SFX.tap(); draw(); } }, t)));
    let pane;
    if (tab === "hablar") {
      const bub = h("p", { class: "bubble" }, fill(pick(D.hola, "h")));
      const say = id => {
        let t;
        if (id === "pista") t = droidHint();
        else if (id === "pendientes") { const un = unlockedSet(), pend = ORDER.filter(planetUnlocked).flatMap(p => MISSIONS[p].filter(m => !flag(m.flag))); t = `Llevas ${un.size} de ${LETTERS.length} cartas. Quedan ${pend.length} misiones y ${claimable()} logros por reclamar.`; }
        else if (id === "estado") t = fill(pick(D.estado[mood] || D.estado.happy, "e"));
        else t = fill(D[id][Math.floor(Math.random() * D[id].length)]);
        bub.textContent = t; SFX.beep();
      };
      const pilot = d.pilotOn !== today();
      pane = h("div", { style: { display: "grid", gap: "12px" } }, bub,
        h("div", { class: "chips-wrap" }, DATA2.topics.map(tp => h("button", { class: "topic", onclick: () => say(tp.id) }, tp.label))),
        npcCard("piloto", pilot ? h("button", { class: "btn btn--sm btn--gold", style: { marginTop: "8px" }, onclick: e => { e.stopPropagation(); const dd = dget(); dset({ pilotOn: today(), cred: dd.cred + 2 }); SFX.holo(); toast("📡", "Holonoticia del día", (new Date().getDate() === 21 ? "Hoy es 21. Para esta galaxia, los días 21 son un poco especiales." : pick(DATA2.news, "n")) + " (+2 chispas)"); draw(); } }, "Recoger la transmisión de hoy") : h("span", { class: "muted", style: { display: "block", fontSize: "12px", marginTop: "6px" } }, "Holonoticia de hoy: " + (new Date().getDate() === 21 ? "Hoy es 21. Para esta galaxia, los días 21 son un poco especiales." : pick(DATA2.news, "n")))));
    } else if (tab === "cuidar") {
      const act = (key, label) => h("button", { class: "care", disabled: d[key] >= 100, onclick: () => {
        const dd = dget(), t = today(), xd = dd.xpDay[t] || 0;
        const patch = { [key]: Math.min(100, dd[key] + 30) };
        if (xd < 3) { patch.xp = dd.xp + 4; patch.xpDay = { [t]: xd + 1 }; }
        if (!dd.careDays.includes(t)) { patch.careDays = [...dd.careDays, t]; patch.cred = dd.cred + 1; }
        const before = dLevel(dd); const nd = dset(patch); SFX.good();
        if (dLevel(nd) > before) toast("⬆️", "¡Más amistad!", `${droidName()} sube al nivel ${dLevel(nd)}.`);
        draw();
      } }, label[0], h("small", null, label[1]));
      pane = h("div", { style: { display: "grid", gap: "10px" } }, h("div", { class: "care-grid" }, act("energy", ["⚡ Recargar", "Una siesta en el hangar"]), act("clean", ["🫧 Limpiar", "Quitar el polvo del desierto"]), act("repair", ["🔧 Reparar", "Ajustar tuercas y circuitos"])),
        h("p", { class: "muted", style: { margin: 0, fontSize: "13px" } }, `Cuidarle cada día suma amistad. Días cuidándole: ${d.careDays.length}. Sin castigos: si un día no puedes, no pasa nada.`));
    } else if (tab === "tienda") {
      const slots = { cabeza: "Cabeza", cuerpo: "Cuerpo", luz: "Luz" };
      pane = h("div", { style: { display: "grid", gap: "12px" } }, npcCard("comerciante"),
        Object.entries(slots).map(([slot, name]) => h("div", { style: { display: "grid", gap: "8px" } }, h("div", { class: "section-t" }, name),
          h("div", { class: "acc-grid" }, DATA2.acc.filter(a => a.slot === slot).map(a => {
            const own = d.owned.includes(a.id) || a.cost === 0, eq = d.equipped[slot] === a.id, lock = lv < a.level;
            return h("button", { class: "acc", "aria-pressed": eq ? "true" : "false", disabled: !own && (lock || d.cred < a.cost), title: a.description, onclick: () => {
              const dd = dget();
              if (!own) { dset({ owned: [...new Set([...dd.owned, a.id])], cred: dd.cred - a.cost, equipped: { ...dd.equipped, [slot]: a.id } }); SFX.unlock(); }
              else { const e2 = { ...dd.equipped }; if (eq) delete e2[slot]; else e2[slot] = a.id; dset({ equipped: e2, owned: [...new Set([...dd.owned, a.id])] }); SFX.select(); }
              draw();
            } }, h("span", { style: { display: "flex", alignItems: "center", gap: "8px" } }, h("i", { style: { width: "12px", height: "12px", borderRadius: "50%", background: a.color, boxShadow: `0 0 8px ${a.color}`, flex: "none" } }), a.name),
              h("small", null, eq ? "Puesto · tocar para quitar" : own ? "Tuyo · tocar para poner" : lock ? `🔒 Amistad nivel ${a.level}` : `✦ ${a.cost} chispas`));
          })))));
    } else {
      const frags = d.fragments.slice().sort((a, b) => a - b);
      pane = h("div", { style: { display: "grid", gap: "12px" } },
        h("div", { class: "section-t" }, "Sigue las luces"),
        lightsGame(),
        h("div", { class: "section-t" }, `Mensajes de Orbi · ${frags.length}/${DATA2.frags.length}`),
        frags.length ? h("div", { style: { display: "grid", gap: "6px" } }, frags.map(i => h("p", { class: "bubble", style: { margin: 0, fontSize: "14px" } }, DATA2.frags[i]))) : h("div", { class: "empty" }, "Orbi aparece de vez en cuando rodando por los planetas. Cada vez que lo encuentres, te dará un fragmento."));
    }
    body.replaceChildren(head, tabs, pane);
  };
  draw();
}
function lightsGame() {
  const cols = ["#7fd6ff", "#ffd98a", "#ff9bc0", "#8dffc4"], notes = [523, 659, 784, 1046];
  const pads = h("div", { class: "pads" }); const ps = cols.map((c, i) => { const p = h("button", { class: "pad", "--c": c, style: { "--c": c, aspectRatio: "2.2" }, "aria-label": "Luz " + (i + 1) }); pads.append(p); return p; });
  const lab = h("p", { class: "m-note", style: { textAlign: "center", margin: 0 } }, `Récord: ${dget().bestLights} luces`);
  let seq = [], inp = [], busy = true;
  const flash = (i, d = 340) => new Promise(r => { ps[i].setAttribute("data-lit", ""); SFX.note(notes[i]); setTimeout(() => { ps[i].removeAttribute("data-lit"); setTimeout(r, 120); }, d); });
  const play = async () => { busy = true; inp = []; lab.textContent = `${seq.length} luces · mira…`; await new Promise(r => setTimeout(r, 450)); for (const i of seq) await flash(i); busy = false; lab.textContent = `${seq.length} luces · tu turno`; };
  ps.forEach((p, i) => p.onclick = async () => {
    if (busy) return; await flash(i, 180); inp.push(i);
    if (inp[inp.length - 1] !== seq[inp.length - 1]) { const best = Math.max(dget().bestLights, seq.length - 1); dset({ bestLights: best }); SFX.bad(); lab.textContent = `¡Casi! Llegaste a ${seq.length - 1}. Récord: ${best}`; busy = true; start.style.display = ""; return; }
    if (inp.length === seq.length) { const best = Math.max(dget().bestLights, seq.length); if (best > dget().bestLights) dset({ bestLights: best }); seq.push(Math.floor(Math.random() * 4)); setTimeout(play, 500); }
  });
  const start = h("button", { class: "btn btn--primary btn--sm", onclick: () => { start.style.display = "none"; seq = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)]; play(); } }, "Jugar");
  return h("div", { style: { display: "grid", gap: "10px" } }, pads, lab, start);
}
