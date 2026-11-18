/* ================= router & shell ================= */
let route = { name: "map", params: {} }, viewEl, tabbar, droidFab, droidBubble;
const TABS = [["map", "Mapa", "map"], ["letters", "Cartas", "cards"], ["planets", "Planetas", "planets"], ["memories", "Recuerdos", "memories"], ["secrets", "Secretos", "secrets"]];
function go(name, params = {}, push = true) {
  closeModals(); droidBubble && droidBubble.remove();
  if (push) try { history.pushState({ name, params }, ""); } catch (e) { }
  const doIt = () => { route = { name, params }; render(); window.scrollTo(0, 0); rememberRoute(); };
  if (document.startViewTransition && !reduced() && route.name !== name && !$(".hyper[data-on]") && !go.noWipe) {
    document.documentElement.dataset.wipe = ["line", "iris", "line", "clock"][go.n = ((go.n || 0) + 1) % 4];
    try { document.startViewTransition(doIt); } catch (e) { doIt(); }
  } else doIt();
}
window.addEventListener("popstate", e => { const st = e.state || { name: "map", params: {} }; route = st; closeModals(); closeReader(); render(); });
function render() {
  const tabFor = { planet: "planets", settings: "map" }[route.name] || route.name;
  tabbar.querySelectorAll(".tab").forEach(t => t.toggleAttribute("aria-current", false) || (t.dataset.id === tabFor && t.setAttribute("aria-current", "page")));
  updateBadges();
  if (route.name !== "planet") stopAmbience();
  document.body.classList.toggle("hide-droid", !["map", "planet"].includes(route.name));
  if (route.name === "map") { render.last = "map"; viewEl.replaceChildren(); viewEl.style.display = "none"; MAP.show(document.getElementById("app")); return; }
  MAP.hide(); viewEl.style.display = "";
  const V = { letters: viewLetters, planets: viewPlanets, memories: viewMemories, secrets: viewSecrets, planet: viewPlanet, settings: viewSettings }[route.name] || viewPlanets;
  const key = route.name + JSON.stringify(route.params || {});
  viewEl.classList.toggle("noanim", key === render.last); render.last = key;
  viewEl.replaceChildren(V(route.params));
}
function rerender() { if (route.name === "map") MAP.refresh(); else if (!$(".modal") && !$(".reader")) { const y = scrollY; render(); scrollTo(0, y); } else updateBadges(); }
function updateBadges() {
  const un = unlockedSet(), unread = [...un].filter(id => !S.readLetters.includes(id)).length;
  const b = tabbar.querySelector('[data-id=letters] .badge'); b.textContent = unread; b.style.display = unread ? "" : "none";
  const c = claimable(), b2 = tabbar.querySelector('[data-id=secrets] .badge'); b2.textContent = c; b2.style.display = c ? "" : "none";
  if (droidFab && droidFab._eq !== JSON.stringify(dget().equipped) + (S.profile && S.profile.droid)) placeDroid();
  if (droidFab) { const dd = dget(), t = today(); droidFab.toggleAttribute("data-news", !dd.careDays.includes(t) || dd.pilotOn !== t); }
}
function buildTabbar() {
  tabbar = h("nav", { class: "tabbar", "aria-label": "Secciones" }, TABS.map(([id, label, ic]) => h("button", { class: "tab", "data-id": id, onclick: () => { SFX.tap(); go(id); } }, icon(ic), label, id === "letters" || id === "secrets" ? h("span", { class: "badge" }) : null)));
  document.body.append(tabbar);
}
function splitLetters(text, d0, step) { let k = 0; return text.split(" ").map((w, wi, arr) => [h("span", { class: "word" }, [...w].map(c => h("span", { class: "ch", style: { animationDelay: (d0 + (k++) * step) + "s" } }, c))), wi < arr.length - 1 ? " " : null]); }
const PAGE_ART = { letters: [52, "#7fe3ff"], planets: [55, "#ffd98a"], memories: [54, "#ffb38a"], secrets: [57, "#ffd98a"], settings: [21, "#9fb4ff"] };
function page(title, lead, ...kids) {
  const art = PAGE_ART[route.name];
  const t = h("h1", { class: "ptitle", "aria-label": title }, splitLetters(title, .15, .035));
  const head = h("header", { class: "phead" + (art ? " phead--art" : ""), style: art ? { "--pa": art[1] } : null },
    art ? h("div", { class: "phead-art", "aria-hidden": "true", html: SC.html(art[0]) }) : null,
    art ? h("div", { class: "ptop" }, route.name === "settings" ? null : h("div", { style: { flex: 1 } }), route.name === "settings" ? null : h("button", { class: "mtool", "aria-label": "Opciones", onclick: () => go("settings") }, icon("gear"))) : null,
    art ? h("div", { class: "eyebrow" }, lead[0]) : null, art ? t : null,
    art ? null : h("div", { class: "ptop" }, h("div", { class: "grow" }, h("div", { class: "eyebrow" }, lead[0]), t), h("button", { class: "mtool", "aria-label": "Opciones", onclick: () => go("settings") }, icon("gear"))),
    lead[1] ? h("p", { class: "plead" }, lead[1]) : null);
  return h("div", { class: "view" }, h("div", { class: "view-bg" }), h("div", { class: "page" }, head, ...kids));
}

/* ================= modal ================= */
function modal(head, body, onClose, ic) {
  const card = h("div", { class: "modal-card holo", role: "dialog", "aria-modal": "true" },
    h("div", { class: "modal-h" }, ic ? h("div", { style: { fontSize: "28px" } }, ic) : null, h("div", { class: "grow" }, head), h("button", { class: "modal-x", "aria-label": "Cerrar", onclick: () => close() }, "✕")), body);
  const m = h("div", { class: "modal", onclick: e => { if (e.target === m) close(); } }, card);
  const close = () => { if (!m.isConnected) return; m.remove(); onClose && onClose(); rerender(); document.removeEventListener("keydown", esc); };
  const esc = e => { if (e.key === "Escape") close(); };
  document.addEventListener("keydown", esc);
  document.body.append(m); setTimeout(() => card.querySelector("button,input,textarea") && card.querySelector(".modal-x").focus(), 30);
  return close;
}
function closeModals() { document.querySelectorAll(".modal").forEach(m => m.remove()); }

/* ================= letter visuals ================= */
function kindIcon(l, locked) {
  const k = kindOf(l).k, c = locked ? "rgba(255,255,255,.25)" : null;
  if (k === "holocron") return svgHTML(`<svg viewBox="0 0 40 40"><path d="M20 4l14 8v16l-14 8-14-8V12z" fill="${locked ? "none" : "rgba(255,217,138,.22)"}" stroke="${c || "#ffd98a"}" stroke-width="1.6"/><path d="M20 20l14-8M20 20v16M20 20L6 12" stroke="${c || "#ffd98a"}" stroke-width="1"/><circle cx="20" cy="20" r="3" fill="${c || "#fff2c8"}"/></svg>`);
  if (k === "archive") return svgHTML(`<svg viewBox="0 0 40 40"><rect x="9" y="6" width="22" height="28" rx="2" fill="${locked ? "none" : "#e9dcc0"}" stroke="${c || "#b89a6a"}" stroke-width="1.4"/><path d="M13 13h14M13 18h14M13 23h9" stroke="${c || "#7a5528"}" stroke-width="1.4"/><circle cx="9" cy="6" r="3" fill="${c || "#b89a6a"}"/><circle cx="31" cy="34" r="3" fill="${c || "#b89a6a"}"/></svg>`);
  return svgHTML(`<svg viewBox="0 0 40 40"><ellipse cx="20" cy="34" rx="9" ry="2.6" fill="${c || "#7fe3ff"}" opacity=".6"/><path d="M14 33L8 12h24l-6 21z" fill="${locked ? "none" : "rgba(127,227,255,.16)"}"/><circle cx="20" cy="16" r="7" fill="none" stroke="${c || "#7fe3ff"}" stroke-width="1.6"/><path d="M15 25h10" stroke="${c || "#7fe3ff"}" stroke-width="1.4"/></svg>`);
}
function hintFor(u) {
  if (!u) return "";
  switch (u.type) {
    case "flag": { const m = FLAG2M[u.flag]; return m ? `Misión «${m.t}» en ${P[m.pid].name}` : "Explora la galaxia"; }
    case "planet-visited": return `Visita ${P[u.planet].name}`;
    case "planets-visited": return `Visita ${u.min} planetas (llevas ${visitedCount()})`;
    case "all": return u.of.filter(o => !cond(o)).map(hintFor).join(" · ");
    case "any": return "Llega un día 21… o completa todas las misiones de Yavin 4";
    case "counter": return `Lee ${u.min} cartas (llevas ${readCount()})`;
    case "read-count": return `Lee las otras ${u.min} cartas (llevas ${Math.min(readCount(), u.min)})`;
  }
  return "Sigue explorando";
}
function letterCard(l, un) {
  const ok = un.has(l.id), read = S.readLetters.includes(l.id), fav = favs().includes(l.id), lang = LANG[l.language];
  return h("button", { class: "lcard", disabled: !ok, onclick: () => ok && openLetter(l.id), "aria-label": ok ? l.title : "Carta bloqueada" },
    h("div", { class: "lk kind-ic" }, kindIcon(l, !ok)),
    h("div", { class: "grow" }, h("b", null, ok ? l.title : "Señal cifrada"), h("span", null, ok ? `${kindOf(l).name} · ${CAT[l.category]}${lang ? " · " + lang : ""}` : hintFor(l.unlock))),
    ok && fav ? h("span", { class: "fav", "aria-label": "Favorita" }, "★") : null,
    ok && !read ? h("span", { class: "new", "aria-label": "Sin leer" }) : null);
}

/* ================= letter reader ================= */
let readerEl = null;
function closeReader() { if (readerEl) { readerEl.remove(); readerEl = null; document.body.classList.toggle("hide-droid", !["map", "planet"].includes(route.name)); rerender(); } }
function openLetter(id, fromList, noFinale) {
  const l = LBYID[id]; if (!l || !letterUnlocked(l)) return;
  if (id === "c57" && !noFinale && !S.readLetters.includes(id) && !isAdmin()) { closeModals(); closeReader(); return playFinale(() => openLetter(id, fromList, true)); }
  closeModals(); closeReader(); toastBox && toastBox.replaceChildren();
  const K = kindOf(l), firstTime = !S.readLetters.includes(id);
  const sib = (fromList || lettersOf(l.planet)).filter(x => letterUnlocked(x)), idx = sib.findIndex(x => x.id === id);
  const favBtn = h("button", { class: "btn btn--icon", "aria-label": "Marcar como favorita" });
  const paintFav = () => { const f = favs().includes(id); favBtn.textContent = f ? "★" : "☆"; favBtn.style.color = f ? "var(--gold)" : ""; favBtn.setAttribute("aria-pressed", f); };
  favBtn.onclick = () => { toggleFav(id); paintFav(); SFX.select(); };
  paintFav();
  const paper = h("article", { class: "paper paper--" + K.k },
    h("div", { class: "stamp" }, l.transmission),
    K.k === "archive" ? h("div", { class: "glyphs", "aria-hidden": "true" }, "✧ ⟁ ✦ ⟁ ✧") : null,
    h("h1", null, l.title),
    h("div", { class: "rule" }),
    l.body.map((p, i) => {
      if (/^[A-ZÁÉÍÓÚÑ ]{8,}$/.test(p)) return h("p", { class: "p-head" }, p);
      if (/^(Nombre del expediente|Clasificación|Observaciones registradas|Conclusión|Origen|Destino|Destinataria|Estado|Contenido|P\. D\.):/.test(p)) return h("p", { class: "p-field" }, p);
      if (/^(Te quiero muchísimo\.|Fin de la transmisión\.)$/.test(p) && i >= l.body.length - 2) return h("p", { class: "sign" }, p);
      return h("p", null, p);
    }),
    h("div", { class: "rule" }),
    h("div", { class: "stamp", style: { display: "flex", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" } }, h("span", null, `${P[l.planet].name} · ${CAT[l.category]}`), h("span", null, `Carta ${l.n || LETTERS.indexOf(l) + 1} de ${LETTERS.length}`)));
  const art = h("figure", { class: "scene-fig scene--" + K.k, html: SC.html(l.n) }); art.append(h("figcaption", null, SC.cap(l.n)));
  const intro = K.k === "holocron" ? h("div", null, h("div", { class: "cube" + (firstTime ? " opening" : "") }, h("div", { class: "cube-in" }, [1, 2, 3, 4, 5, 6].map(() => h("i"))))) :
    null;
  if (K.k === "holocron" && firstTime) { paper.style.animationDelay = "1.2s"; setTimeout(() => SFX.unlock(), 300); setTimeout(() => celebrate(), 1150); }
  else if (K.k === "holo") SFX.holo();
  const bg = h("div", { class: "reader-bg", style: { background: K.k === "holocron" ? "radial-gradient(800px 500px at 50% 0%,rgba(255,190,80,.18),transparent 60%),#05040a" : K.k === "archive" ? "radial-gradient(800px 500px at 50% 0%,rgba(200,160,100,.14),transparent 60%),#07060a" : `radial-gradient(800px 500px at 50% 0%,${LOOK[l.planet].atm}22,transparent 60%),radial-gradient(600px 400px at 50% 10%,rgba(127,227,255,.12),transparent 60%),#03040a` } });
  const nav = h("div", { class: "reader-actions" },
    h("button", { class: "btn", disabled: idx <= 0, onclick: () => openLetter(sib[idx - 1].id, fromList) }, "← Anterior"),
    h("button", { class: "btn", disabled: idx >= sib.length - 1, onclick: () => openLetter(sib[idx + 1].id, fromList) }, "Siguiente →"));
  readerEl = h("div", { class: "reader", role: "dialog", "aria-label": l.title },
    bg, h("div", { class: "reader-in" },
      h("div", { class: "reader-top" }, h("button", { class: "back", onclick: () => { closeReader(); } }, svgHTML(ICON.back), "Volver"), h("div", { class: "grow" }), h("span", { class: "chip " + (K.k === "holocron" ? "chip--gold" : "chip--accent") }, K.name), favBtn),
      art, intro, paper, h("div", { class: "saber" }), nav,
      h("button", { class: "btn btn--ghost", onclick: () => { closeReader(); go("planet", { id: l.planet }); } }, `Ir a ${P[l.planet].name}`)));
  document.body.append(readerEl); document.body.classList.add("hide-droid");
  readerEl.addEventListener("keydown", e => { if (e.key === "Escape") closeReader(); });
  readerEl.tabIndex = -1; readerEl.focus();
  markRead(id);
}

/* ================= cinematic planet header ================= */
const moon = (x, y, r, c = "#cfd6e2", dur = 60) => `<div class="cine-moon" style="left:${x}%;top:${y}%;width:${r}px;height:${r}px;--mc:${c};animation-duration:${dur}s"></div>`;
const CINE_X = {
  naboo: () => moon(80, 14, 34, "#e8eef4", 90) + moon(14, 30, 14, "#b8c4d0", 70),
  tatooine: () => `<div class="cine-sun" style="left:16%;top:12%;--s:58px;--c:#fff4c8"></div><div class="cine-sun" style="left:30%;top:20%;--s:38px;--c:#ffc46b"></div>`,
  coruscant: () => `<div class="cine-traffic">${Array.from({ length: 14 }, (_, i) => `<i style="top:${30 + (i * 37) % 40}%;animation-duration:${7 + (i * 5) % 9}s;animation-delay:-${(i * 3) % 11}s"></i>`).join("")}</div>`,
  hoth: () => moon(78, 12, 40, "#dfe8f4", 120) + moon(18, 22, 22, "#a8b8cc", 80) + moon(66, 34, 10, "#c8d4e4", 60),
  bespin: () => "",
  endor: () => `<div class="cine-giant" style="right:-12%;top:-6%;--s:min(62vw,340px);--a:#9fb4c8;--b:#3a4d6a"></div>`,
  dagobah: () => `<div class="cine-mist"></div><div class="cine-mist" style="top:46%;animation-duration:70s;opacity:.35"></div>` + moon(82, 16, 18, "#b8c8b0", 90),
  alderaan: () => moon(20, 14, 30, "#eef2f8", 100),
  kashyyyk: () => moon(84, 12, 26, "#d8e8d8", 80) + moon(70, 26, 12, "#b8c8b8", 60),
  "ahch-to": () => moon(18, 10, 44, "#e8eef8", 140),
  mustafar: () => `<div class="cine-sun" style="left:76%;top:10%;--s:30px;--c:#ff9a5a"></div>`,
  yavin: () => `<div class="cine-giant" style="right:-16%;top:-10%;--s:min(70vw,400px);--a:#ffcf9a;--b:#a0502a;--band:1"></div>`,
};
function cineHero(id) {
  const p = P[id], L = LOOK[id], D = Math.round(clamp(innerWidth * 1.18, 520, LITE() ? 700 : 980));
  const pw = h("div", { class: "cine-planet", style: { width: D + "px", height: D + "px", marginLeft: -D / 2 + "px" } });
  if (id === "bespin") pw.append(svgHTML(`<svg class="cine-ring back" viewBox="0 0 200 200"><g transform="rotate(-22 100 100)"><ellipse cx="100" cy="100" rx="96" ry="26" fill="none" stroke="rgba(255,220,205,.5)" stroke-width="7"/><ellipse cx="100" cy="100" rx="82" ry="22" fill="none" stroke="rgba(255,190,215,.32)" stroke-width="4"/></g></svg>`));
  pw.append(planetEl(id, D, { revealed: true, hi: true }));
  if (id === "bespin") pw.append(svgHTML(`<svg class="cine-ring front" viewBox="0 0 200 200"><g transform="rotate(-22 100 100)"><path d="M4 100 A96 26 0 0 0 196 100" fill="none" stroke="rgba(255,225,210,.75)" stroke-width="7"/><path d="M18 100 A82 22 0 0 0 182 100" fill="none" stroke="rgba(255,190,215,.5)" stroke-width="4"/></g></svg>`));
  const title = h("h1", { class: "cine-title", "aria-label": p.name }, splitLetters(p.name, .25, .07));
  const sec = h("section", { class: "pv-cine", style: { "--atm": L.atm } },
    h("div", { class: "cine-glow" }),
    h("div", { class: "cine-x", html: (CINE_X[id] || (() => ""))() }),
    h("div", { class: "cine-ship", html: `<svg viewBox="-30 -18 60 36" width="54" height="32"><path d="M-22 0 L18 -2 L24 0 L18 2Z" fill="#dfe6ef"/><path d="M-6 -2 L-16 -14 L-12 -14 L2 -2Z M-6 2 L-16 14 L-12 14 L2 2Z" fill="#c8d0dc"/><circle cx="-24" cy="0" r="3" fill="#ff8a5c"/><circle cx="-24" cy="0" r="7" fill="#ff8a5c" opacity=".35"/></svg>` }),
    pw,
    h("div", { class: "cine-text" }, h("div", { class: "eyebrow" }, `${ORDER.indexOf(id) + 1} de 12 · ${LAYOUT[id].sector}`), title, h("div", { class: "tag" }, p.tagline)));
  // gentle parallax while scrolling
  const onScroll = () => { if (!sec.isConnected) return removeEventListener("scroll", onScroll); const y = Math.min(scrollY, 600); pw.style.transform = `translateY(${y * .35}px)`; sec.querySelector(".cine-text").style.opacity = 1 - y / 420; };
  addEventListener("scroll", onScroll, { passive: true });
  return sec;
}

/* ================= planet view ================= */
function viewPlanet({ id }) {
  const p = P[id]; if (!p || !planetUnlocked(id)) return viewPlanets();
  if (!S.visited[id]) setTimeout(() => visit(id), 50); else if (S.lastPlanet !== id) { S.lastPlanet = id; save(); }
  ambience(id);
  const L = LOOK[id], ms = MISSIONS[id] || [], un = unlockedSet(), ls = lettersOf(id), got = ls.filter(l => un.has(l.id)).length, md = ms.filter(m => flag(m.flag)).length;
  const effs = activeEffects().filter(e => e.effect.planet === id);
  const sub = [`${got}/${ls.length} cartas`, `${md}/${ms.length} misiones`];
  return h("div", { class: "pv", style: { "--atm": L.atm } },
    ambientLayer(id),
    h("div", { class: "pv-inner" },
      h("div", { class: "ptop" }, h("button", { class: "back", onclick: () => go("map") }, svgHTML(ICON.back), "Mapa galáctico"), h("div", { class: "grow" }), h("span", { class: "chip" }, LAYOUT[id].region)),
      cineHero(id),
      h("section", { class: "pv-info holo" },
        h("p", { class: "desc" }, p.description),
        h("div", { class: "pv-stats" }, sub.map(t => h("span", { class: "chip chip--accent" }, t)), md === ms.length && ms.length ? h("span", { class: "chip chip--ok" }, "Planeta completado ✓") : null),
        h("p", { class: "pv-how" }, md === ms.length ? "Has hecho todas sus misiones. Puedes releer sus cartas o seguir el viaje." : "Completa las misiones para abrir las cartas de este planeta."),
        md === ms.length && nextPlanet() ? h("button", { class: "btn btn--primary btn--sm", onclick: () => { const np = nextPlanet(); SFX.jump(); hyperspace(() => go("planet", { id: np })); } }, `Siguiente destino: ${ORDER.indexOf(nextPlanet()) + 1} · ${P[nextPlanet()].name} →`) : null),
      effs.length ? h("div", { style: { display: "grid", gap: "8px" } }, effs.map(e => h("div", { class: "effect" }, h("div", { class: "ic" }, e.effect.kind === "transmission" ? "📡" : e.effect.kind === "hint" ? "🧭" : "✨"), h("div", null, h("b", null, e.effect.title), h("span", null, e.effect.body))))) : null,
      h("div", { class: "section-t" }, `Misiones · ${md}/${ms.length}`),
      h("div", { class: "missions" }, (() => { const first = ms.find(m => !flag(m.flag) && missionAvailable(m)); return ms.map((m, i) => {
        const dn = flag(m.flag), av = missionAvailable(m), isFirst = m === first, nL = lettersForFlag(m.flag).length;
        return h("button", { class: "mission holo", "data-done": dn ? "" : null, "data-first": isFirst ? "" : null, "data-locked": av ? null : "", onclick: () => { SFX.tap(); openMission(m); } },
          h("div", { class: "mi" }, dn ? "✓" : m.ic), h("div", { class: "grow" }, isFirst ? h("span", { class: "chip chip--gold", style: { marginBottom: "4px" } }, "▶ Empieza aquí") : null, h("b", null, `${i + 1}. ${m.t}`), h("span", null, av ? m.d : "🔒 " + m.reqText), nL ? h("small", { class: "mi-l" }, `✉ Abre ${nL} carta${nL > 1 ? "s" : ""}`) : null), h("span", { class: dn ? "chip chip--ok" : isFirst ? "chip chip--gold" : "chip" }, dn ? "Hecha" : av ? "Jugar" : "Bloqueada"));
      }); })()),
      h("div", { class: "section-t" }, `Cartas de este planeta · ${got}/${ls.length}`),
      h("div", { class: "lcards" }, ls.map(l => letterCard(l, un))),
      orbiCard(),
      (() => { const n = Object.keys(DATA2.npcs).find(k => DATA2.npcs[k].where === p.name); return n ? npcCard(n) : null; })(),
      h("button", { class: "btn", onclick: () => { MAP.select && setTimeout(() => MAP.select(id), 300); go("map"); } }, "Ver en el mapa")));
}

/* ================= letters (collection) ================= */
function viewLetters(params) {
  const un = unlockedSet(); let filter = params.f || (params.planet ? "all" : "all");
  const list = h("div", { style: { display: "grid", gap: "14px" } });
  const seg = h("div", { class: "seg", role: "group", "aria-label": "Filtro" });
  const opts = [["all", "Todas"], ["fav", "Favoritas ★"], ["unread", "Por leer"], ["locked", "Bloqueadas"]];
  const drawSeg = () => seg.replaceChildren(...opts.map(([k, t]) => h("button", { "aria-pressed": filter === k ? "true" : "false", onclick: () => { filter = k; SFX.tap(); drawSeg(); draw(); } }, t)));
  const draw = () => {
    const f = favs(); const planets = params.planet ? [params.planet] : ORDER;
    const groups = planets.map(pid => {
      let ls = lettersOf(pid);
      if (filter === "fav") ls = ls.filter(l => f.includes(l.id) && un.has(l.id));
      if (filter === "unread") ls = ls.filter(l => un.has(l.id) && !S.readLetters.includes(l.id));
      if (filter === "locked") ls = ls.filter(l => !un.has(l.id));
      if (!ls.length) return null;
      return h("section", { style: { display: "grid", gap: "10px" } }, h("div", { class: "section-t" }, h("span", { style: { width: "10px", height: "10px", borderRadius: "50%", background: LOOK[pid].atm, boxShadow: `0 0 8px ${LOOK[pid].atm}` } }), P[pid].name), h("div", { class: "lcards" }, ls.map(l => letterCard(l, un))));
    }).filter(Boolean);
    list.replaceChildren(...(groups.length ? groups : [h("div", { class: "empty" }, filter === "fav" ? "Aún no hay favoritas. Abre una carta y toca ☆ para guardarla aquí." : filter === "unread" ? "Lo has leído todo. ✨" : "Nada por aquí.")]));
  };
  drawSeg(); draw();
  const got = un.size, read = S.readLetters.filter(id => un.has(id)).length;
  return page(params.planet ? "Cartas de " + P[params.planet].name : "Archivo de cartas", ["Colección", "Transmisiones holográficas, documentos del Archivo Jedi y holocrones secretos. Todo lo que has encontrado está aquí."],
    h("div", { class: "summary holo" }, h("div", { class: "ring", style: { "--p": Math.round(got / LETTERS.length * 100) } }, h("span", null, Math.round(got / LETTERS.length * 100) + "%")), h("div", { class: "grow" }, h("b", null, `${got} de ${LETTERS.length} cartas encontradas`), h("span", null, `${read} leídas · ${favs().length} favoritas`))),
    params.planet ? h("button", { class: "btn btn--ghost btn--sm", onclick: () => go("letters") }, "Ver todas las cartas") : npcCard("archivista"),
    seg,
    h("div", { class: "m-row", style: { justifyContent: "flex-start" } }, [["holo", "Transmisión", "c01"], ["archive", "Archivo Jedi", "c11"], ["holocron", "Holocrón", "c57"]].map(([k, t, id]) => h("span", { class: "chip chip--kind" }, h("span", { class: "kind-ic mini" }, kindIcon(LBYID[id], false)), t))),
    list);
}

/* ================= planets ================= */
function viewPlanets() {
  const un = unlockedSet(), vis = visitedCount();
  return page("Planetas", ["Descubiertos", `Has visitado ${vis} de ${ORDER.length} sistemas. Cada planeta tiene sus propias misiones y cartas.`],
    h("div", { class: "pcards" }, ORDER.map(pid => {
      const ok = planetUnlocked(pid), ls = lettersOf(pid), got = ls.filter(l => un.has(l.id)).length, ms = MISSIONS[pid], md = ms.filter(m => flag(m.flag)).length;
      return h("button", { class: "pcard", "data-locked": ok ? null : "", onclick: () => { if (!ok) { SFX.bad(); toast("🔒", "Señal cifrada", `Visita ${10 - vis} planetas más para revelar este sistema.`); return; } SFX.jump(); hyperspace(() => go("planet", { id: pid })); } },
        h("div", { class: "pp" }, planetEl(pid, 64, { revealed: ok && S.visited[pid] })),
        h("b", null, ok ? P[pid].name : "¿?"), h("span", null, ok ? (S.visited[pid] ? `${got}/${ls.length} cartas · ${md}/${ms.length} misiones` : "Sin explorar") : "Más allá del mapa"),
        h("div", { class: "bar" }, h("i", { style: { width: (ok ? (got + md) / (ls.length + ms.length) * 100 : 0) + "%" } })));
    })));
}

/* ================= memories ================= */
function viewMemories() {
  const un = unlockedSet(), ds = daysSince();
  const linkL = (id, label) => un.has(id) ? h("button", { class: "btn btn--sm", onclick: () => openLetter(id) }, (label || LBYID[id].title)) : h("span", { class: "chip chip--lock" }, "Carta por descubrir");
  const T = [
    { d: "21 de junio de 2026", t: "El día más largo del año", p: "El solsticio de verano. Sin buscarlo, el principio de esta historia.", l: ["c54"] },
    { d: "Agosto de 2026", t: "El primer viaje", p: "Un avión de Tenerife a Valencia. Todo lo hablado desde lejos tuvo cara, voz y mirada.", l: ["c01", "c07"] },
    { d: "Entre agosto y octubre", t: "El tiempo de en medio", p: "Mensajes, llamadas, cuentas atrás. Lo que sostuvo todo.", l: ["c09", "c15"] },
    { d: "3 de octubre de 2026", t: "El segundo viaje", p: "La primera vez tienes la sorpresa; la segunda, la certeza.", l: ["c10", "c12"] },
    { d: "Cada día 21", t: "Una pequeña estación", p: "Un sitio donde parar, mirar atrás y comprobar cuánto camino llevamos.", l: ["c54"] },
    { d: "Hoy", t: `${ds} días después`, p: "Y la galaxia sigue creciendo.", l: [] },
  ];
  const diary = getData("diary", []), caps = getData("capsule", []), places = getData("places", []), posts = getData("postcards", []);
  const effs = activeEffects();
  return page("Recuerdos especiales", ["Archivo de la República", "Las fechas que importan, las señales que han viajado entre planetas y lo que tú has ido guardando."],
    h("div", { class: "counter" }, h("div", null, h("b", null, ds), h("span", null, "días")), h("div", null, h("b", null, Math.floor(ds / 7)), h("span", null, "semanas")), h("div", null, h("b", null, Math.max(0, Math.floor(ds / 30.44))), h("span", null, "meses"))),
    npcCard("narrador"),
    h("div", { class: "section-t" }, "Línea temporal"),
    h("div", { class: "timeline" }, T.map(x => h("div", { class: "tl" }, h("div", { class: "d" }, x.d), h("b", null, x.t), h("p", null, x.p), x.l.length ? h("div", { class: "m-row" }, x.l.map(id => linkL(id))) : null))),
    h("div", { class: "section-t" }, "Señales entre planetas"),
    effs.length ? h("div", { style: { display: "grid", gap: "8px" } }, effs.map(e => h("button", { class: "effect", style: { textAlign: "left", cursor: "pointer", color: "inherit", font: "inherit" }, onclick: () => go("planet", { id: e.effect.planet }) }, h("div", { class: "ic" }, "📡"), h("div", null, h("b", null, e.effect.title), h("span", null, e.effect.body))))) : h("div", { class: "empty" }, "Completa misiones y algunos planetas empezarán a enviarse señales entre sí."),
    h("div", { class: "section-t" }, "Lo que tú has guardado"),
    !(diary.length || caps.length || places.length || posts.length) ? h("div", { class: "empty" }, "Aquí aparecerán tus entradas del holodiario de Coruscant, la cápsula del tiempo de Alderaan, tus lugares soñados y tus postales de Bespin.") : null,
    diary.length ? h("div", { class: "tl", style: { marginLeft: 0 } }, h("div", { class: "d" }, "📓 Holodiario de Coruscant"), diary.slice().reverse().map(e => h("p", { style: { fontFamily: "var(--f-letter)", fontSize: "1.15rem", color: "var(--ink)" } }, "«" + e.text + "»"))) : null,
    caps.length ? h("div", { class: "tl", style: { marginLeft: 0 } }, h("div", { class: "d" }, "⏳ Cápsula del tiempo"), caps.map(e => h("p", { style: { fontFamily: "var(--f-letter)", fontSize: "1.15rem", color: "var(--ink)" } }, "«" + e.text + "» · ", h("span", { class: "muted", style: { fontFamily: "var(--f-body)", fontSize: "12px" } }, new Date(e.at).toLocaleDateString("es-ES")))) ) : null,
    places.length ? h("div", { class: "tl", style: { marginLeft: 0 } }, h("div", { class: "d" }, "🏔️ Lugares por conocer"), h("div", { class: "m-row", style: { justifyContent: "flex-start" } }, places.map(p => h("span", { class: "chip chip--gold" }, p)))) : null,
    posts.length ? h("div", { class: "tl", style: { marginLeft: 0 } }, h("div", { class: "d" }, "💌 Postales desde Bespin"), posts.map(p => h("p", null, `${p.v}: «${p.p}»`))) : null);
}

/* ================= secrets ================= */
function viewSecrets() {
  const un = unlockedSet(), secrets = LETTERS.filter(l => l.category === "secreta"), sGot = secrets.filter(l => un.has(l.id)).length;
  const locked = LETTERS.filter(l => !un.has(l.id) && l.category !== "secreta");
  const pending = ORDER.filter(planetUnlocked).flatMap(pid => MISSIONS[pid].filter(m => !flag(m.flag)));
  return page("Secretos por descubrir", ["Templos Jedi", "Holocrones escondidos, logros con premio y el último holocrón del viaje."],
    h("div", { class: "summary holo" }, h("div", { class: "kind-ic", style: { width: "56px", flex: "none" } }, kindIcon(LBYID["c57"], false)),
      h("div", { class: "grow" }, h("b", null, `${sGot} de ${secrets.length} holocrones abiertos`), h("span", null, `${locked.length} cartas cifradas · ${pending.length} misiones pendientes`))),
    h("div", { class: "section-t" }, "Logros"),
    h("p", { class: "muted", style: { margin: 0, fontSize: "13.5px" } }, `Cada logro reclamado da chispas para los accesorios de ${droidName()}.`),
    achievementsView(),
    h("div", { class: "section-t" }, "Holocrones"),
    h("div", { class: "lcards" }, secrets.map(l => letterCard(l, un))),
    h("div", { class: "section-t" }, "El último holocrón"),
    (() => { const rc = readCount(), fin = LBYID.c57, ok = un.has("c57"); return h("div", { class: "secret-row" }, h("div", { class: "kind-ic", style: { width: "44px" } }, kindIcon(fin, !ok)), h("div", { class: "grow" }, h("b", null, ok ? fin.title : "Un holocrón sellado en Yavin 4"), h("span", null, ok ? "Ya puedes abrirlo." : `Se abre al leer las otras 56 cartas (llevas ${Math.min(rc, 56)}).`)), ok ? h("div", { style: { display: "grid", gap: "6px" } }, h("button", { class: "btn btn--sm btn--gold", onclick: () => openLetter("c57") }, "Abrir"), S.readLetters.includes("c57") ? h("button", { class: "btn btn--sm btn--ghost", onclick: () => playFinale(() => openLetter("c57", null, true)) }, "▶ Ver el final") : null) : null); })(),
    h("div", { class: "bar" }, h("i", { style: { width: Math.min(100, readCount() / 56 * 100) + "%" } })),
    h("div", { class: "section-t" }, "Pistas del droide"),
    pending.length ? h("div", { style: { display: "grid", gap: "8px" } }, pending.slice(0, 8).map(m => h("button", { class: "secret-row", style: { textAlign: "left", cursor: "pointer", color: "inherit", font: "inherit" }, onclick: () => go("planet", { id: m.pid }) }, h("div", { style: { fontSize: "22px" } }, m.ic), h("div", { class: "grow" }, h("b", null, m.t), h("span", null, P[m.pid].name + (missionAvailable(m) ? "" : " · 🔒 " + m.reqText))), h("span", { class: "muted" }, "›"))),
      pending.length > 8 ? h("p", { class: "muted", style: { margin: 0, fontSize: "13px", textAlign: "center" } }, `Y ${pending.length - 8} misiones más repartidas por la galaxia.`) : null) : h("div", { class: "empty" }, "Has completado todas las misiones. Que la Fuerza te acompañe. ✨"));
}

/* ================= settings ================= */
function viewSettings() {
  const st = S.settings;
  const sw = (key, label, sub, after) => { const b = h("button", { class: "switch", role: "switch", "aria-checked": st[key] ? "true" : "false", "aria-label": label, onclick: () => { S.settings = { ...S.settings, [key]: !S.settings[key] }; b.setAttribute("aria-checked", S.settings[key]); applySettings(); emit(); after && after(); SFX.tap(); } }); return h("div", { class: "setrow" }, h("div", { class: "grow" }, h("b", null, label), h("span", null, sub)), b); };
  const saber = (S.profile && S.profile.saber) || "azul";
  const sabers = h("div", { class: "swatches" }, DATA.sabers.map(c => h("button", { class: "swatch", "aria-label": "Sable " + c.label, "aria-pressed": saber === c.id ? "true" : "false", style: { "--c": c.hex }, onclick: () => { S.profile = { ...(S.profile || {}), saber: c.id }; applySettings(); emit(); SFX.saber(); render(); } }, h("i"))));
  const droids = h("div", { class: "droid-pick" }, DATA.droids.map(d => h("button", { "aria-pressed": (S.profile && S.profile.droid || "chispa") === d.id ? "true" : "false", onclick: () => { S.profile = { ...(S.profile || {}), droid: d.id }; emit(); placeDroid(); SFX.beep(); render(); } }, droidSVG(d.id, 50), h("b", null, d.label), h("small", null, d.note))));
  const exp = () => { const blob = new Blob([JSON.stringify({ kind: "galaxia-de-arian-backup", version: 3, exportedAt: new Date().toISOString(), state: { ...S, wizard: null } }, null, 1)], { type: "application/json" }); const a = h("a", { href: URL.createObjectURL(blob), download: "galaxia-de-arian-copia.json" }); document.body.append(a); a.click(); a.remove(); toast("💾", "Copia creada", "Guarda el archivo en un sitio seguro."); };
  const file = h("input", { type: "file", accept: "application/json,.json", style: { display: "none" }, onchange: async () => { try { const j = JSON.parse(await file.files[0].text()); const stt = j.state || (j.data && j.data.state) || j.data; if (!stt || typeof stt !== "object") throw 0; for (const k in S) if (stt[k] !== undefined) S[k] = stt[k]; S.settings = { ...DEF_SETTINGS, ...S.settings }; emit(); applySettings(); toast("✅", "Progreso restaurado", "La galaxia vuelve a estar como la dejaste."); render(); } catch (e) { toast("⚠️", "No se pudo leer", "El archivo no es una copia válida de la galaxia."); } } });
  return page("Opciones", ["Panel de control", null],
    h("button", { class: "back", style: { justifySelf: "start" }, onclick: () => history.length > 1 ? history.back() : go("map") }, svgHTML(ICON.back), "Volver"),
    h("div", { class: "section-t" }, "Tu sable de luz"),
    h("div", { class: "setrow", style: { display: "grid" } }, h("span", { class: "muted" }, "El color de tu sable tiñe toda la galaxia."), sabers),
    h("div", { class: "section-t" }, "Tu droide"),
    droids,
    h("div", { class: "section-t" }, "Sonido y movimiento"),
    sw("muted", "Silenciar efectos", "Pitidos del droide, saltos y sables."),
    sw("ambience", "Ambiente de los planetas", "Una música suave distinta en cada planeta.", () => route.name === "planet" && ambience(route.params.id)),
    h("div", { class: "setrow" }, h("div", { class: "grow" }, h("b", null, "Volumen")), h("input", { type: "range", min: 0, max: 1, step: .05, value: st.volume, class: "range", style: { width: "50%" }, oninput: e => { S.settings = { ...S.settings, volume: +e.target.value }; save(); }, onchange: () => SFX.select() })),
    sw("reduceMotion", "Reducir animaciones", "Menos movimiento en pantalla.", applySettings),
    h("div", { class: "setrow", style: { display: "grid", gap: "8px" } }, h("div", null, h("b", null, "Calidad gráfica"), h("span", null, "«Automática» usa el modo ligero en móviles y tablets para que todo vaya fluido.")),
      h("div", { class: "seg" }, [["auto", "Automática"], ["lite", "Ligera"], ["high", "Máxima"]].map(([k, t]) => h("button", { "aria-pressed": (st.graphics || "auto") === k ? "true" : "false", onclick: () => { S.settings = { ...S.settings, graphics: k }; emit(); applySettings(); SFX.tap(); toast("⚙️", "Calidad gráfica: " + t, "Se aplica del todo al recargar la página."); render(); } }, t)))),
    h("div", { class: "setrow" }, h("div", { class: "grow" }, h("b", null, "Tamaño del texto de las cartas")), h("div", { class: "m-row" }, [.9, 1, 1.15, 1.3].map(v => h("button", { class: "btn btn--sm" + (Math.abs((st.textScale || 1) - v) < .01 ? " btn--primary" : ""), onclick: () => { S.settings = { ...S.settings, textScale: v }; applySettings(); emit(); render(); } }, v === 1 ? "A" : v < 1 ? "a" : v > 1.2 ? "A+" : "A·")))),
    h("div", { class: "section-t" }, "Historia"),
    h("button", { class: "btn", onclick: () => playIntro(() => go("map")) }, "▶ Ver la introducción otra vez"),
    h("div", { class: "section-t" }, "Copia de seguridad"),
    h("p", { class: "muted", style: { margin: 0, fontSize: "13.5px" } }, memOnly ? "⚠️ Este navegador no permite guardar: el progreso se perderá al cerrar. Usa una copia." : "El progreso se guarda solo en este dispositivo. Haz una copia si vas a cambiar de móvil."),
    h("div", { class: "m-row" }, h("button", { class: "btn", onclick: exp }, "Descargar copia"), h("button", { class: "btn", onclick: () => file.click() }, "Restaurar copia"), file),
    h("p", { class: "muted", style: { textAlign: "center", fontSize: "12px", marginTop: "18px" } }, "La galaxia de Arián · hecha con cariño desde Tenerife"));
}
function applySettings() {
  const st = S.settings, de = document.documentElement;
  de.dataset.accent = (S.profile && S.profile.saber) || "azul";
  de.dataset.motion = st.reduceMotion || (st.motion === "system" && matchMedia("(prefers-reduced-motion: reduce)").matches) ? "reduced" : "full";
  de.style.setProperty("--ts", st.textScale || 1);
  de.classList.toggle("lite", LITE());
  if (st.muted) stopAmbience();
}

/* ================= droid companion ================= */
const CHEER = ["Bip-bup. Hoy la galaxia brilla un poco más porque estás tú.", "Análisis completado: nivel de ternura del remitente… fuera de escala.", "Que la Fuerza te acompañe. Y yo también, por si acaso.", "No hay prisa, no hay examen. Todo te espera aquí.", "Bip. He detectado una transmisión de Tenerife. Contenido: «te quiero».", "Mis sensores dicen que eres la exploradora favorita de esta galaxia."];
function droidHint() {
  const nx = nextPlanet();
  if (!nx) return "Lo has encontrado todo. Ahora solo queda releer tus favoritas. ✨";
  const m = MISSIONS[nx].find(m => !flag(m.flag) && missionAvailable(m));
  if (!S.visited[nx]) return `Bip-bip. Propongo un salto a ${P[nx].name}: ${P[nx].tagline.toLowerCase()}.`;
  return m ? `En ${P[nx].name} te espera «${m.t}». ${m.d}` : `Sigue explorando ${P[nx].name}.`;
}
function droidSay(txt, ms = 5200) {
  droidBubble && droidBubble.remove();
  if (document.body.classList.contains("sheet-open") || document.body.classList.contains("hide-droid") || $(".modal") || $(".intro") || $(".setup")) return;
  SFX.beep();
  if (route.name !== "map" && !droidSay.force) return;
  droidBubble = h("div", { class: "droid-bubble holo", role: "status", onclick: () => droidBubble && droidBubble.remove() }, h("b", null, droidName()), txt, h("span", { class: "db-x", "aria-hidden": "true" }, "✕"));
  document.body.append(droidBubble); const b = droidBubble; setTimeout(() => b.classList.add("out"), ms - 400); setTimeout(() => b.remove(), ms);
}
let droidClicks = 0;
function placeDroid() {
  droidFab && droidFab.remove();
  droidFab = h("button", { class: "droid-fab", "aria-label": "Abrir el hangar de " + droidName(), onclick: () => { droidBubble && droidBubble.remove(); SFX.beep(); openDroid(); } }, droidFull(62));
  droidFab._eq = JSON.stringify(dget().equipped) + (S.profile && S.profile.droid);
  document.body.append(droidFab);
}

/* ================= intro & setup ================= */
function starfield(cv, warp) {
  const g = cv.getContext("2d"); let W, H; const dpr = Math.min(2, devicePixelRatio || 1);
  const size = () => { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); }; size();
  const st = Array.from({ length: 300 }, () => ({ x: Math.random(), y: Math.random(), s: Math.random() * 1.5 + .3, p: Math.random() * 6 }));
  let t = 0; (function fr() { if (!cv.isConnected) return; t++; g.fillStyle = "#000"; g.fillRect(0, 0, W, H); for (const s0 of st) { g.globalAlpha = .4 + .6 * Math.abs(Math.sin(t * .01 + s0.p)); g.fillStyle = "#fff"; g.fillRect(s0.x * W, s0.y * H, s0.s, s0.s); } g.globalAlpha = 1; requestAnimationFrame(fr); })();
}
function playIntro(done) {
  const cv = h("canvas"), stg = h("div", { class: "intro-stage" }), dots = h("div", { class: "dots", style: { width: "90px" } });
  const el = h("div", { class: "intro", role: "dialog", "aria-label": "Introducción" }, cv, stg, h("div", { class: "i-foot" }, dots, h("p", { class: "i-hint" }, "Toca para continuar"), h("button", { class: "i-skip", onclick: e => { e.stopPropagation(); end(); } }, "Saltar")));
  document.body.append(el); starfield(cv);
  let i = 0, tm; const steps = [
    () => h("div", null, h("div", { style: { width: "54px", height: "54px", margin: "0 auto 14px", borderRadius: "50%", border: "2px solid var(--holo)", boxShadow: "0 0 24px var(--holo)", animation: "breathe 2s infinite" } }), DATA.intro1.slice(0, 4).map((t, k) => h("p", { class: "i-meta", style: { animationDelay: `${.4 + k * .5}s` } }, t)), h("p", { class: "i-line", style: { animationDelay: "2.8s" } }, DATA.intro1[4]), h("p", { class: "i-line i-gold", style: { animationDelay: "4.6s" } }, DATA.intro1[5])),
    () => h("p", { class: "longago" }, "Hace no tanto tiempo, en una isla no muy, muy lejana…"),
    () => { const w = h("div", { class: "crawl-wrap" }, h("div", { class: "crawl" }, h("div", { class: "ep" }, "EPISODIO I"), h("h2", null, DATA.crawl[0]), DATA.crawl.slice(1).map(t => h("p", null, t)))); return w; },
    () => h("div", { class: "i-title" }, h("div", { style: { width: "90px", height: "90px", filter: "drop-shadow(0 0 20px rgba(127,227,255,.5))" } }, planetEl("naboo", 90)), h("h1", { class: "i-sw" }, "STAR WARS"), h("p", { class: "i-sub" }, "La galaxia de " + herName()), h("p", { class: "i-date" }, "Una historia que comenzó el 21 de junio de 2026"), h("button", { class: "btn btn--gold i-cta", onclick: e => { e.stopPropagation(); end(); } }, "Entrar en la galaxia")),
  ];
  const dur = [7200, 5000, 23000, 0];
  const show = () => {
    clearTimeout(tm); stg.replaceChildren(steps[i]()); dots.replaceChildren(...steps.map((_, k) => h("i", { "data-on": k <= i ? "" : null })));
    el.querySelector(".i-hint").style.visibility = i === steps.length - 1 || i === 2 ? "hidden" : "";
    if (i === 3) { SFX.saber(); fanfare(); }
    if (dur[i]) tm = setTimeout(next, dur[i]);
  };
  const next = () => { if (i < steps.length - 1) { i++; show(); } };
  const end = () => { clearTimeout(tm); el.remove(); if (!S.introSeen) { S.introSeen = true; emit(); } done && done(); };
  el.addEventListener("click", next);
  show();
}
function setup(done) {
  const draft = { name: "Arián", saber: "azul", droid: "chispa", ...(S.profile || {}) }; let step = 0;
  const box = h("div", { class: "setup-in" }), el = h("div", { class: "setup", role: "dialog" }, box);
  const draw = () => {
    document.documentElement.dataset.accent = draft.saber;
    const dots = h("div", { class: "dots" }, [0, 1, 2].map(k => h("i", { "data-on": k <= step ? "" : null })));
    const body = [
      () => [h("div", { class: "eyebrow" }, "Registro de piloto"), h("h1", null, "¿Cómo te llamamos?"), h("p", { class: "muted", style: { margin: 0 } }, "Así aparecerá tu nombre en los archivos de la galaxia."), h("input", { class: "field", value: draft.name, maxlength: 24, oninput: e => draft.name = e.target.value, "aria-label": "Nombre" })],
      () => [h("div", { class: "eyebrow" }, "Ceremonia del cristal"), h("h1", null, "Elige el color de tu sable"), h("p", { class: "muted", style: { margin: 0 } }, "Su luz teñirá toda la galaxia. Podrás cambiarlo después."), h("div", { class: "swatches", style: { justifyContent: "center", gap: "14px" } }, DATA.sabers.map(c => h("button", { class: "swatch", style: { "--c": c.hex, width: "54px", height: "54px" }, "aria-label": c.label, "aria-pressed": draft.saber === c.id ? "true" : "false", onclick: () => { draft.saber = c.id; SFX.saber(); draw(); } }, h("i")))), h("div", { class: "saber", style: { margin: "10px 20px" } })],
      () => [h("div", { class: "eyebrow" }, "Asignación de droide"), h("h1", null, "Tu compañero de viaje"), h("p", { class: "muted", style: { margin: 0 } }, "Te dará pistas y te recordará lo que falta por descubrir."), h("div", { class: "droid-pick" }, DATA.droids.map(d => h("button", { "aria-pressed": draft.droid === d.id ? "true" : "false", onclick: () => { draft.droid = d.id; SFX.beep(); draw(); } }, droidSVG(d.id, 56), h("b", null, d.label), h("small", null, d.note))))],
    ][step]();
    box.replaceChildren(dots, ...body, h("div", { style: { display: "flex", gap: "10px" } }, step ? h("button", { class: "btn", onclick: () => { step--; draw(); } }, "Atrás") : null, h("button", { class: "btn btn--primary", style: { flex: 1 }, onclick: () => { if (step < 2) { step++; SFX.select(); draw(); } else { S.profile = { avatar: "estrella", accent: "cielo", ship: "alba", createdAt: new Date().toISOString(), ...draft, name: (draft.name || "").trim() || "Arián" }; emit(); el.remove(); applySettings(); done(); } } }, step < 2 ? "Siguiente" : "Empezar la aventura")));
  };
  document.body.append(el); draw();
}
function whatsNew(after) {
  const returning = S.readLetters.length || Object.keys(S.visited).length;
  if (getData("v3seen") || !returning) { if (!getData("v3seen")) setData("v3seen", true); return after && after(); }
  setData("v3seen", true);
  const close = modal(h("div", null, h("div", { class: "eyebrow" }, "Transmisión prioritaria"), h("h2", null, "Cartas entre las estrellas")), [
    h("div", { class: "projector" }, droidSVG((S.profile && S.profile.droid) || "chispa", 50), h("div", { class: "beam", style: { height: "30px" } })),
    h("div", { class: "paper paper--holo", style: { padding: "18px" } },
      h("p", { style: { fontSize: "1.15rem" } }, `${herName()}, han llegado ${LETTERS.length} cartas nuevas a la galaxia.`),
      h("p", { style: { fontSize: "1.05rem", fontFamily: "var(--f-body)" } }, "✉️ Cada una habla de un momento de Star Wars y tiene su propia ilustración."),
      h("p", { style: { fontSize: "1.05rem", fontFamily: "var(--f-body)" } }, "🪐 Dos planetas nuevos en el mapa: Dagobah y Yavin 4."),
      h("p", { style: { fontSize: "1.05rem", fontFamily: "var(--f-body)" } }, "🗺️ Sigue el orden del 1 al 12: la flecha dorada te dice dónde ir."),
      h("p", { style: { fontSize: "1.05rem", fontFamily: "var(--f-body)" } }, "◈ Al final del viaje te espera el último holocrón."),
      h("p", { style: { fontSize: "1.05rem", fontFamily: "var(--f-body)" } }, "Las misiones que ya habías hecho siguen contando.")),
    h("button", { class: "btn btn--primary", onclick: () => close() }, "Explorar")], after, "📡");
}

/* ================= boot ================= */
function boot() {
  const app = h("div", { id: "app" }); viewEl = h("main", { id: "view" }); app.append(viewEl); document.body.append(app);
  applySettings(); buildTabbar(); placeDroid();
  onChange(() => { clearTimeout(boot.t); boot.t = setTimeout(rerender, 30); });
  try { history.replaceState({ name: "map", params: {} }, ""); } catch (e) { }
  const start = () => {
    const back = welcomeBack(); render(); rememberRoute();
    placeAdminBadge();
    const tour = () => { if (isAdmin()) return; if (!getData("tourDone")) { if (route.name !== "map") go("map"); setTimeout(startTour, 900); } else if (!back) setTimeout(() => droidSay(droidHint()), 1500); };
    setTimeout(() => whatsNew(tour), 2000);
  };
  const afterIntro = () => S.profile ? start() : setup(start);
  gate(() => { if (!S.introSeen) playIntro(afterIntro); else afterIntro(); });
  addEventListener("pagehide", () => { rememberRoute(); try { localStorage.setItem(KEY, JSON.stringify({ state: { ...S, wizard: null }, version: 3 })); } catch (e) { } });
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
