/* ================= GATE, HELP, TOUR, MEMORY ================= */
const GATE_KEY = "galaxia-arian:gate", GATE_H = 840749505, KKEY = "galaxia-arian:k";
/* letters are encrypted (AES-GCM); the data key is wrapped with the password and with the admin code */
const ub64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0)), b64u = u => btoa(String.fromCharCode(...u));
async function unwrapKey(pass) {
  const C = crypto.subtle, enc = new TextEncoder();
  for (const w of ENC.wraps) try {
    const base = await C.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
    const wk = await C.deriveKey({ name: "PBKDF2", salt: ub64(w.salt), iterations: ENC.iter, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    return new Uint8Array(await C.decrypt({ name: "AES-GCM", iv: ub64(w.iv) }, wk, ub64(w.w)));
  } catch (e) { }
  return null;
}
async function openLetters(K) {
  try {
    const k = await crypto.subtle.importKey("raw", K, "AES-GCM", false, ["decrypt"]);
    const bodies = JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: ub64(ENC.iv) }, k, ub64(ENC.ct))));
    for (const l of LETTERS) if (bodies[l.id]) { l.title = bodies[l.id].t; l.body = bodies[l.id].b; }
    try { localStorage.setItem(KKEY, b64u(K)); } catch (e) { openLetters.mem = K; }
    return true;
  } catch (e) { return false; }
}
async function storedKeyOk() { try { const k = localStorage.getItem(KKEY) || (openLetters.mem && b64u(openLetters.mem)); return k ? await openLetters(ub64(k)) : false; } catch (e) { return false; } }
function gateOk() { try { return localStorage.getItem(GATE_KEY) === String(GATE_H); } catch (e) { return !!gateOk.mem; } }
async function gate(done) {
  if (gateOk() && await storedKeyOk()) return done();
  const again = gateOk();
  const cv = h("canvas");
  const inp = h("input", { class: "gate-in", type: "password", autocomplete: "off", autocapitalize: "off", spellcheck: "false", "aria-label": "Contraseña", placeholder: "Código de acceso" });
  const msg = h("p", { class: "gate-msg", role: "status" });
  const lock = h("div", { class: "gate-lock" }, h("div", { class: "cube" }, h("div", { class: "cube-in" }, [1, 2, 3, 4, 5, 6].map(() => h("i")))));
  const saber = h("div", { class: "saber gate-saber" });
  const form = h("form", { class: "gate-form", onsubmit: async e => {
    e.preventDefault();
    const okCode = adminCode(inp.value) || hash("galaxia|" + inp.value) === GATE_H;
    if (okCode) { msg.textContent = "Abriendo el holocrón…"; msg.className = "gate-msg ok"; const K = await unwrapKey(inp.value); if (!K || !(await openLetters(K))) { msg.textContent = "No se pudieron abrir las cartas. Inténtalo otra vez."; msg.className = "gate-msg"; return; } }
    if (adminCode(inp.value)) { try { localStorage.setItem(GATE_KEY, String(GATE_H)); } catch (er) { gateOk.mem = true; } el.remove(); setAdmin(true); toast("⚙", "Modo administrador activado", "Todo está desbloqueado en este dispositivo."); return done(); }
    if (hash("galaxia|" + inp.value) === GATE_H) {
      try { localStorage.setItem(GATE_KEY, String(GATE_H)); } catch (er) { gateOk.mem = true; }
      msg.textContent = "Acceso concedido. Bienvenida al archivo."; msg.className = "gate-msg ok";
      lock.querySelector(".cube").classList.add("opening"); SFX.saber(); saber.style.display = "block";
      setTimeout(() => { el.classList.add("out"); setTimeout(() => { el.remove(); done(); }, 700); }, 1300);
    } else {
      SFX.bad(); form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake");
      msg.textContent = inp.value ? "Código incorrecto. Los archivos siguen sellados." : "Escribe el código de acceso."; msg.className = "gate-msg";
      inp.select();
    }
  } }, inp, h("button", { class: "btn btn--gold", type: "submit" }, "Desbloquear"));
  const el = h("div", { class: "gate", role: "dialog", "aria-label": "Acceso protegido" }, cv,
    h("div", { class: "gate-card" }, lock,
      h("div", { class: "eyebrow", style: { color: "var(--gold)" } }, "Archivo Jedi · acceso restringido"),
      h("h1", null, "Holocrón sellado"),
      h("p", { class: "muted", style: { margin: 0 } }, again ? "Las cartas ahora viajan cifradas. Introduce el código una vez más para abrirlas en este dispositivo." : "Esta galaxia guarda transmisiones privadas. Introduce el código para abrirla."),
      form, msg, saber,
      h("p", { class: "gate-foot" }, "Solo hace falta una vez en cada dispositivo.")));
  document.body.append(el); starfield(cv); setTimeout(() => inp.focus(), 300);
}

/* ---------- help ---------- */
function openHelp() {
  const sec = (ic, t, ...p) => h("details", { class: "help-s" }, h("summary", null, h("span", { class: "help-ic" }, ic), h("b", null, t)), h("div", { class: "help-b" }, p.map(x => h("p", null, x))));
  modal(h("div", null, h("div", { class: "eyebrow" }, "Manual del explorador"), h("h2", null, "¿Cómo funciona?")), [
    h("p", { class: "m-note", style: { margin: 0 } }, `Esta galaxia es un regalo. Hay ${LETTERS.length} cartas escondidas en ${ORDER.length} planetas y el objetivo es encontrarlas todas, ${herName()}, a tu ritmo. No hay prisa ni se pierde nada.`),
    sec("🗺️", "1. El mapa", "Cada planeta tiene un número del 1 al 12: es el orden recomendado del viaje.", "La flecha dorada ▼ y el botón ▶ de arriba a la izquierda te dicen siempre a dónde ir ahora.", "Arrastra con un dedo para moverte y pellizca para acercar. Los botones de la derecha acercan, alejan, centran y muestran toda la galaxia."),
    sec("🪐", "2. Los planetas", "Toca un planeta en el mapa y luego «Saltar al hiperespacio» para viajar.", "Dentro, cada planeta tiene su paisaje y 3 o 4 misiones. La misión marcada con «▶ Empieza aquí» es la siguiente."),
    sec("🎮", "3. Las misiones", "Son pequeños juegos: encender una ciudad, pilotar una nave, descifrar un mensaje, respirar con la Fuerza…", "Al terminar una misión se abren cartas nuevas. Si una misión está bloqueada, te dice qué hacer antes."),
    sec("✉️", "4. Las cartas", "Llegan de tres formas: 📡 transmisiones holográficas, 📜 documentos del Archivo Jedi y ◈ holocrones secretos.", "En la pestaña «Cartas» están todas. Toca ☆ dentro de una carta para guardarla en Favoritas. Las cartas bloqueadas te dicen cómo abrirlas."),
    sec("🤖", "5. Tu droide", "El droide de abajo a la derecha te acompaña. Tócalo para pedir pistas, hablar, cuidarlo, ponerle accesorios y jugar a «Sigue las luces».", "Ganas chispas ✦ al completar misiones y logros, y con ellas compras accesorios."),
    sec("🏅", "6. Logros, Orbi y secretos", "En «Secretos» están los holocrones, los logros (reclámalos para ganar chispas) y el último holocrón, que se abre al leer todas las demás cartas.", "Orbi, una esfera pequeña, aparece a veces en los planetas con un mensaje escondido.", "Cada planeta tiene sus propios habitantes: su raza, sus droides y sus criaturas, que caminan sobre la superficie del planeta en su portada. Tócalos para conocerlos. Los porgs, por ejemplo, solo viven en Ahch-To.", "Todo lo que descubras se guarda en la Enciclopedia Galáctica (en la pestaña Planetas)."),
    sec("⭐", "7. Recuerdos", "La línea temporal de vuestra historia, los días que lleváis y todo lo que tú escribas: el holodiario, la cápsula del tiempo, los lugares soñados y las postales."),
    sec("💾", "8. Todo se recuerda", "La galaxia guarda tu progreso sola en este dispositivo: cartas leídas, misiones, favoritas, droide y dónde te quedaste.", "Cada móvil u ordenador tiene su propio progreso. Para pasarlo a otro, usa ⚙️ Opciones → Copia de seguridad."),
    h("div", { class: "m-row" }, h("button", { class: "btn btn--primary", onclick: () => { closeModals(); if (route.name !== "map") go("map"); setTimeout(startTour, 500); } }, "Ver la visita guiada"), h("button", { class: "btn", onclick: () => closeModals() }, "Entendido")),
  ], null, "❔");
}

/* ---------- guided tour (coach marks) ---------- */
function startTour() {
  const steps = [
    { sel: ".nextbtn", t: "Tu siguiente destino", b: "Este botón te dice siempre a dónde ir. Tócalo y el mapa te lleva directo al planeta." },
    { sel: ".pnode[data-next]", t: "Planetas numerados", b: "El viaje va del 1 al 12. La flecha dorada ▼ marca el planeta donde seguir. Toca uno para ver sus cartas y viajar." },
    { sel: ".map-tools", t: "Moverte por la galaxia", b: "Acerca, aleja, centra o vuelve a ver toda la galaxia. También puedes arrastrar con el dedo y pellizcar." },
    { sel: ".droid-fab", t: `${droidName()}, tu droide`, b: "Tócalo cuando quieras una pista. También puedes cuidarlo, ponerle accesorios y jugar con él." },
    { sel: '.tab[data-id="letters"]', t: "Cartas", b: "Aquí se guardan todas las cartas que encuentres, con tus favoritas ★." },
    { sel: '.tab[data-id="planets"]', t: "Planetas", b: "Los 12 planetas y cuánto llevas de cada uno." },
    { sel: '.tab[data-id="memories"]', t: "Recuerdos", b: "Vuestra línea temporal y todo lo que escribas en la galaxia." },
    { sel: '.tab[data-id="secrets"]', t: "Secretos", b: "Holocrones, logros con premio y el último holocrón del viaje." },
    { sel: '.mtool[aria-label^="Ayuda"]', t: "Si te pierdes", b: "Este botón «?» lo explica todo otra vez. ¡Que la Fuerza te acompañe!" },
  ];
  let i = 0;
  const spot = h("div", { class: "tour-spot" }), card = h("div", { class: "tour-card holo", role: "dialog", "aria-live": "polite" });
  const wrap = h("div", { class: "tour" }, spot, card);
  document.body.append(wrap); document.body.classList.add("touring");
  const end = () => { wrap.remove(); document.body.classList.remove("touring"); setData("tourDone", true); removeEventListener("resize", show); };
  function show() {
    const st = steps[i], t = $(st.sel);
    if (!t) { if (++i < steps.length) return show(); return end(); }
    const r = t.getBoundingClientRect(), pad = 8;
    Object.assign(spot.style, { left: r.left - pad + "px", top: r.top - pad + "px", width: r.width + pad * 2 + "px", height: r.height + pad * 2 + "px" });
    card.replaceChildren(h("div", { class: "eyebrow" }, `Visita guiada · ${i + 1}/${steps.length}`), h("b", null, st.t), h("p", null, st.b),
      h("div", { class: "m-row", style: { justifyContent: "space-between" } }, h("button", { class: "btn btn--ghost btn--sm", onclick: end }, "Saltar"), h("button", { class: "btn btn--primary btn--sm", onclick: () => { SFX.tap(); if (++i < steps.length) show(); else end(); } }, i < steps.length - 1 ? "Siguiente →" : "¡A explorar!")));
    const below = r.top + r.height / 2 < innerHeight / 2, cw = Math.min(340, innerWidth - 24);
    card.style.width = cw + "px"; card.style.left = clamp(r.left + r.width / 2 - cw / 2, 12, innerWidth - cw - 12) + "px";
    card.style.top = below ? r.bottom + 16 + "px" : ""; card.style.bottom = below ? "" : innerHeight - r.top + 16 + "px";
  }
  addEventListener("resize", show); show();
}

/* ---------- memory: where you left off ---------- */
const REMEMBER = ["map", "letters", "planets", "memories", "secrets", "planet", "enciclo"];
function rememberRoute() { if (REMEMBER.includes(route.name)) { S.data = { ...S.data, lastRoute: { name: route.name, params: route.params || {} }, lastSeen: new Date().toISOString() }; save(); } }
function welcomeBack() {
  const lr = getData("lastRoute"), seen = getData("lastSeen");
  if (!seen) return false;
  const days = Math.floor((Date.now() - new Date(seen)) / 864e5);
  const where = lr && lr.name === "planet" && P[lr.params.id] ? P[lr.params.id].name : null;
  const did = (S.profile && S.profile.droid) || "chispa", D = DATA2.dialog[did] || DATA2.dialog.chispa;
  setTimeout(() => toast("🤖", days >= 1 ? `¡Bienvenida de nuevo, ${herName()}!` : `Hola otra vez, ${herName()}`, (where ? `Te quedaste en ${where}. ` : "") + fill(pick(D.vuelta, "v"), null), () => openDroid()), 900);
  if (lr && lr.name && lr.name !== "map" && (lr.name !== "planet" || planetUnlocked(lr.params.id))) { route = { name: lr.name, params: lr.params || {} }; try { history.replaceState(route, ""); } catch (e) { } }
  return true;
}

/* ---------- the finale: cinematic sequence before the last holocron ---------- */
function playFinale(done) {
  stopAmbience(); closeModals();
  const cv = h("canvas"), stage = h("div", { class: "fin-stage" });
  const el = h("div", { class: "finale", role: "dialog", "aria-label": "El final del viaje" }, cv, stage,
    h("button", { class: "i-skip fin-skip", onclick: () => end() }, "Saltar"));
  document.body.append(el); starfield(cv); document.body.classList.add("hide-droid");
  let tms = [], ended = false;
  const at = (ms, f) => tms.push(setTimeout(f, ms));
  const end = () => { if (ended) return; ended = true; tms.forEach(clearTimeout); el.classList.add("out"); setTimeout(() => { el.remove(); done && done(); }, 700); };
  const show = node => { stage.replaceChildren(node); };
  const missionsDone = ORDER.flatMap(p => MISSIONS[p]).filter(m => flag(m.flag)).length, total = ORDER.flatMap(p => MISSIONS[p]).length;
  // 1 · incoming transmission
  show(h("div", { class: "fin-block" }, h("div", { class: "fin-rings" }, h("i"), h("i"), h("i")), h("p", { class: "i-meta", style: { animationDelay: ".2s" } }, "Transmisión final entrante"), h("p", { class: "i-line", style: { animationDelay: ".9s" } }, `${herName()}, has recorrido toda la galaxia.`)));
  SFX.holo();
  // 2 · the twelve planets align
  at(4200, () => {
    const R = Math.min(innerWidth, innerHeight) * .36, cx = 0, cy = 0;
    const pts = ORDER.map((pid, i) => { const a = -Math.PI / 2 + i / ORDER.length * Math.PI * 2; return [Math.cos(a) * R, Math.sin(a) * R]; });
    const sv = s("svg", { class: "fin-lines", viewBox: `${-R - 40} ${-R - 40} ${2 * R + 80} ${2 * R + 80}` }, s("polyline", { points: [...pts, pts[0]].map(p => p.join(",")).join(" "), fill: "none", stroke: "#ffd98a", "stroke-width": 2, "stroke-linejoin": "round" }));
    const ring = h("div", { class: "fin-ring", style: { width: 2 * R + 80 + "px", height: 2 * R + 80 + "px" } }, sv,
      ORDER.map((pid, i) => h("div", { class: "fin-p", style: { left: `calc(50% + ${pts[i][0]}px)`, top: `calc(50% + ${pts[i][1]}px)`, animationDelay: (i * .28) + "s" } }, planetEl(pid, Math.max(34, R * .2), { revealed: true }), h("small", null, P[pid].name))),
      h("div", { class: "fin-center" }, h("b", null, "12"), h("span", null, "planetas")));
    show(ring);
    ORDER.forEach((_, i) => at(4200 + i * 280, () => SFX.note(392 + i * 40)));
  });
  // 3 · the numbers of the journey
  at(10200, () => {
    const stat = (n, l) => { const b = h("b", null, "0"); const t0 = performance.now(); (function f(t) { const k = Math.min(1, (t - t0) / 1400); b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1 && (b.isConnected || t - t0 < 300)) requestAnimationFrame(f); })(t0); return h("div", { class: "fin-stat" }, b, h("span", null, l)); };
    show(h("div", { class: "fin-block" }, h("p", { class: "i-meta" }, "Registro del viaje"),
      h("div", { class: "fin-stats" }, stat(readCount(), "cartas leídas"), stat(missionsDone, `de ${total} misiones`), stat(daysSince(), "días desde el 21 de junio")),
      h("p", { class: "i-line", style: { animationDelay: "1.6s" } }, "Solo queda un holocrón por abrir.")));
    SFX.select();
  });
  // 4 · the holocron opens
  at(15600, () => {
    show(h("div", { class: "fin-block" }, h("div", { class: "cube fin-cube" }, h("div", { class: "cube-in" }, [1, 2, 3, 4, 5, 6].map(() => h("i")))), h("p", { class: "i-line i-gold", style: { animationDelay: ".6s" } }, "El último holocrón")));
    SFX.saber(); fanfare();
  });
  at(19200, () => { stage.querySelector(".cube") && stage.querySelector(".cube").classList.add("opening"); celebrate(); });
  at(20600, () => { const f = $(".flash") || h("div", { class: "flash" }); if (!f.isConnected) document.body.append(f); f.removeAttribute("data-on"); void f.offsetWidth; f.setAttribute("data-on", ""); end(); });
}

/* ---------- ADMIN MODE (for Yeidan: see everything without playing) ---------- */
const ADMIN_KEY = "galaxia-arian:admin", ADMIN_H = 302948241;
function isAdmin() { try { return localStorage.getItem(ADMIN_KEY) === String(ADMIN_H); } catch (e) { return !!isAdmin.mem; } }
function setAdmin(on) {
  try { on ? localStorage.setItem(ADMIN_KEY, String(ADMIN_H)) : localStorage.removeItem(ADMIN_KEY); } catch (e) { isAdmin.mem = on; }
  S.settings = { ...S.settings, devOpenAll: !!on }; emit(); applySettings(); placeAdminBadge();
  if (route.name === "map") MAP.refresh(); else render();
}
const adminCode = v => hash("admin|" + v) === ADMIN_H;
function placeAdminBadge() {
  $(".admin-badge") && $(".admin-badge").remove();
  if (!isAdmin()) return;
  document.body.append(h("button", { class: "admin-badge", onclick: () => adminPanel(), "aria-label": "Abrir panel de administrador" }, "⚙ MODO ADMIN"));
}
let adminTaps = [];
function adminTap() {
  const t = Date.now(); adminTaps = adminTaps.filter(x => t - x < 3000); adminTaps.push(t);
  if (adminTaps.length >= 7) { adminTaps = []; isAdmin() ? adminPanel() : adminPrompt(); }
}
function adminPrompt() {
  const inp = h("input", { class: "gate-in", type: "password", autocomplete: "off", placeholder: "Código de administrador", "aria-label": "Código de administrador" });
  const msg = h("p", { class: "gate-msg" });
  const close = modal(h("div", null, h("div", { class: "eyebrow" }, "Acceso restringido"), h("h2", null, "Modo administrador")), [
    h("p", { class: "muted", style: { margin: 0 } }, "Introduce el código para ver toda la galaxia sin tener que jugarla."),
    h("form", { class: "gate-form", onsubmit: e => { e.preventDefault(); if (adminCode(inp.value)) { close(); SFX.saber(); setAdmin(true); toast("⚙", "Modo administrador activado", "Todo está desbloqueado en este dispositivo."); setTimeout(adminPanel, 400); } else { SFX.bad(); msg.textContent = "Código incorrecto."; inp.select(); } } }, inp, h("button", { class: "btn btn--primary", type: "submit" }, "Entrar")), msg], null, "⚙");
  setTimeout(() => inp.focus(), 80);
}
let adminTab = "escenas";
function adminPanel(tab) {
  if (!isAdmin()) return adminPrompt();
  if (tab) adminTab = tab;
  const body = h("div", { style: { display: "grid", gap: "12px" } });
  const close = modal(h("div", null, h("div", { class: "eyebrow" }, "Solo para Yeidan · centro de control"), h("h2", null, "Panel de administrador")), [body], null, "⚙");
  const btn = (t, f, cls = "btn btn--sm") => h("button", { class: cls, onclick: f }, t);
  const row = (...k) => h("div", { class: "m-row", style: { justifyContent: "flex-start" } }, ...k);
  const sec = t => h("div", { class: "section-t" }, t);
  const run = f => () => { close(); setTimeout(f, 120); };
  const ok = (t, b) => { toast("⚙", t, b || "Hecho."); draw(); };
  const TABS = [["escenas", "🎬 Escenas"], ["planetas", "🪐 Planetas"], ["cartas", "✉️ Cartas"], ["droide", "🤖 Droide"], ["progreso", "🏅 Progreso"], ["ajustes", "⚙ Ajustes"]];
  function draw() {
    const d = dget(), tabs = h("div", { class: "admin-tabs" }, TABS.map(([k, t]) => h("button", { "aria-pressed": adminTab === k ? "true" : "false", onclick: () => { adminTab = k; SFX.tap(); draw(); } }, t)));
    let pane;
    if (adminTab === "escenas") pane = [
      sec("Inicio"),
      row(btn("🔒 Contraseña de entrada", run(() => { try { localStorage.removeItem(GATE_KEY); localStorage.removeItem(KKEY); } catch (e) { } gate(() => { }); })),
        btn("▶ Introducción completa", run(() => playIntro(() => { }))),
        btn("🪪 Registro de piloto (nombre, sable, droide)", run(() => setup(() => go("map"))))),
      sec("Ayuda"),
      row(btn("🧭 Visita guiada", run(() => { go("map"); setTimeout(startTour, 700); })), btn("❔ Manual «¿Cómo funciona?»", run(openHelp)), btn("📡 Mensaje de novedades", run(whatsNewForce)), btn("👋 Bienvenida de vuelta", run(() => { setData("lastSeen", new Date(Date.now() - 2 * 864e5).toISOString()); welcomeBack(); }))),
      sec("Efectos"),
      row(btn("🚀 Salto al hiperespacio", run(() => { SFX.jump(); hyperspace(() => { }); })), btn("✨ Celebración", run(() => celebrate())), btn("🎺 Fanfarria", () => fanfare()), btn("⚔️ Sable", () => SFX.saber()), btn("🔔 Aviso de prueba", () => toast("📡", "Nueva transmisión holográfica", "Así se ven los avisos que recibe Arián.")), btn("🤖 Frase del droide", run(() => { droidSay.force = true; droidSay(droidHint()); droidSay.force = false; }))),
      sec("El final"),
      row(btn("◈ Final del viaje + último holocrón", run(() => playFinale(() => openLetter("c57", null, true))), "btn btn--sm btn--gold"), btn("◈ Solo la carta 57", run(() => openLetter("c57", null, true)))),
    ];
    else if (adminTab === "planetas") pane = [
      sec("Mapa"),
      row(btn("🗺️ Ir al mapa", run(() => go("map"))), btn("🌌 Ver toda la galaxia", run(() => { go("map"); setTimeout(() => MAP.fitAll(), 500); })), btn("▶ Siguiente destino", run(() => { go("map"); const n = nextPlanet(); n && setTimeout(() => MAP.select(n), 600); }))),
      sec("Planetas y sus misiones (toca una misión para jugarla)"),
      h("div", { class: "admin-plist" }, ORDER.map((pid, i) => h("div", { class: "admin-prow" },
        h("button", { class: "admin-p", onclick: run(() => go("planet", { id: pid })) }, planetEl(pid, 40), h("span", null, `${i + 1}. ${P[pid].name}`)),
        h("div", { class: "m-row", style: { justifyContent: "flex-start", gap: "6px" } },
          MISSIONS[pid].map(m => h("button", { class: "admin-m" + (flag(m.flag) ? " done" : ""), title: m.t, onclick: run(() => { go("planet", { id: pid }); setTimeout(() => openMission({ ...m, req: null }), 500); }) }, m.ic, " ", m.t)),
          btn("🚀 Saltar", run(() => { SFX.jump(); hyperspace(() => go("planet", { id: pid })); })))))),
    ];
    else if (adminTab === "cartas") pane = [
      sec("Secciones"),
      row(btn("📖 Enciclopedia Galáctica", run(() => go("enciclo"))), btn("✉️ Archivo de cartas", run(() => go("letters"))), btn("⭐ Recuerdos", run(() => go("memories"))), btn("◈ Secretos", run(() => go("secrets"))), btn("🖼️ Galería de las 57 ilustraciones", () => { adminTab = "galeria"; draw(); })),
      sec(`Las ${LETTERS.length} cartas (toca para leer)`),
      h("div", { class: "admin-letters" }, ORDER.map(pid => h("div", null, h("b", null, `${ORDER.indexOf(pid) + 1}. ${P[pid].name}`),
        h("div", { style: { display: "grid", gap: "4px" } }, lettersOf(pid).map(l => h("button", { class: "admin-lrow", onclick: run(() => openLetter(l.id, lettersOf(pid), true)) }, h("span", { class: "n" }, l.n), h("span", null, l.title), h("small", null, kindOf(l).name))))))),
    ];
    else if (adminTab === "galeria") pane = [
      row(btn("← Volver a cartas", () => { adminTab = "cartas"; draw(); })),
      h("div", { class: "admin-gallery" }, LETTERS.map(l => h("button", { onclick: run(() => openLetter(l.id, null, true)), html: SC.html(l.n) + `<small>${l.n}. ${SC.cap(l.n)}</small>` }))),
    ];
    else if (adminTab === "droide") pane = [
      h("div", { class: "dr-head" }, h("div", { class: "dr-ava" }, droidFull(84, d)), h("div", { class: "dr-stats" }, h("b", null, droidName()), h("span", null, `Amistad nv. ${dLevel(d)} · ✦ ${d.cred} chispas · ${d.owned.length} accesorios · Orbi ${d.fragments.length}/${DATA2.frags.length}`))),
      sec("Abrir el hangar"),
      row(btn("💬 Hablar", run(() => openDroid("hablar"))), btn("🔧 Cuidar", run(() => openDroid("cuidar"))), btn("🛍️ Tienda", run(() => openDroid("tienda"))), btn("🎮 Juegos", run(() => openDroid("juegos")))),
      sec("Cambiar de droide"),
      row(...DATA.droids.map(x => btn((S.profile && S.profile.droid) === x.id ? "✓ " + x.label : x.label, () => { S.profile = { ...(S.profile || {}), droid: x.id }; emit(); placeDroid(); ok("Droide: " + x.label); }))),
      sec("Trucos"),
      row(btn("✦ +50 chispas", () => { dset({ cred: dget().cred + 50 }); ok("+50 chispas"); }), btn("🤖 Amistad al máximo", () => { dset({ xp: 200 }); ok("Amistad nivel 10"); }), btn("🔋 Energía, limpieza y reparación al 100%", () => { dset({ energy: 100, clean: 100, repair: 100 }); ok("Droide a tope"); }), btn("🪫 Droide cansado (ver estado triste)", () => { dset({ energy: 20, clean: 25, repair: 30 }); ok("Droide cansado"); })),
      row(btn("🎁 Todos los accesorios", () => { dset({ owned: DATA2.acc.map(a => a.id) }); ok("Todos los accesorios", "Ya puedes ponérselos en la tienda."); }), btn("🧹 Quitar accesorios", () => { dset({ equipped: {} }); placeDroid(); ok("Accesorios quitados"); }), btn("🔵 Hacer aparecer a Orbi", () => { dset({ sphereOn: null }); ok("Orbi aparecerá en el próximo planeta"); }), btn("🦎 Conocer a todos los habitantes", () => { setData("fauna", FA.ALL.map(x => x.id)); ok("24 habitantes en la guía"); }), btn("🦎 Olvidar a los habitantes", () => { setData("fauna", []); ok("Guía de habitantes vacía"); }), btn("📜 Todos los mensajes de Orbi", () => { dset({ fragments: DATA2.frags.map((_, i) => i) }); ok("15 fragmentos de Orbi"); }), btn("📡 Holonoticia de nuevo", () => { dset({ pilotOn: null }); ok("El Capitán Rumbo tiene noticia nueva"); })),
      sec("Personajes"),
      h("div", { style: { display: "grid", gap: "8px" } }, Object.keys(DATA2.npcs).map(k => npcCard(k))),
    ];
    else if (adminTab === "progreso") {
      const ach = achievements(), claimable = ach.filter(a => a.state === "reclamar").length;
      pane = [
        h("p", { class: "muted", style: { margin: 0, fontSize: "13px" } }, `Este dispositivo: ${visitedCount()}/12 planetas · ${ORDER.flatMap(p => MISSIONS[p]).filter(m => flag(m.flag)).length}/${ORDER.flatMap(p => MISSIONS[p]).length} misiones · ${readCount()}/${LETTERS.length} cartas leídas · ${ach.filter(a => a.state === "hecho").length}/${ach.length} logros`),
        sec("Ver el juego como Arián"),
        row(btn(S.settings.devOpenAll ? "🔓 Todo abierto (tocar para ver como Arián)" : "🔒 Viendo como Arián (tocar para abrirlo todo)", () => { S.settings = { ...S.settings, devOpenAll: !S.settings.devOpenAll }; emit(); ok(S.settings.devOpenAll ? "Todo abierto" : "Ahora ves solo lo que Arián tendría desbloqueado"); }, "btn btn--sm btn--primary")),
        sec("Completar"),
        row(btn("🪐 Visitar los 12 planetas", () => { for (const p of ORDER) S.visited = { ...S.visited, [p]: true }; emit(); ok("12 planetas visitados"); }),
          btn("✓ Completar todas las misiones", () => { for (const p of ORDER) { S.visited = { ...S.visited, [p]: true }; for (const m of MISSIONS[p]) { S.flags = { ...S.flags, [m.flag]: true }; payFlag(m.flag); } } emit(); ok("Todas las misiones completadas"); }),
          btn("✉️ Marcar 56 cartas como leídas", () => { S.readLetters = LETTERS.filter(l => l.n < 57).map(l => l.id); emit(); ok("56 cartas leídas", "Ya se puede abrir el último holocrón."); }),
          btn(`🏅 Reclamar logros (${claimable})`, () => { for (const a of achievements()) if (a.state === "reclamar") claim(a); draw(); })),
        sec("Reiniciar"),
        row(btn("↺ Misiones", () => { S.flags = {}; emit(); ok("Misiones reiniciadas"); }, "btn btn--sm btn--ghost"), btn("↺ Cartas leídas", () => { S.readLetters = []; emit(); ok("Cartas sin leer"); }, "btn btn--sm btn--ghost"), btn("↺ Logros", () => { setData("missions", { claimed: [] }); ok("Logros reiniciados"); }, "btn btn--sm btn--ghost"), btn("↺ Favoritas", () => { setData("favorites", []); ok("Favoritas borradas"); }, "btn btn--sm btn--ghost")),
        row(btn("↺ TODO el progreso de este dispositivo", () => { if (!confirm("¿Borrar el progreso de ESTE dispositivo? El de Arián no se toca.")) return; Object.assign(S, { readLetters: [], visited: {}, flags: {}, counters: {}, lastPlanet: null, data: { v3seen: true, tourDone: true } }); emit(); close(); go("map"); toast("↺", "Progreso reiniciado", "Este dispositivo empieza de cero."); }, "btn btn--sm btn--ghost")),
      ];
    } else {
      const st = S.settings;
      pane = [
        sec("Calidad gráfica"),
        row(...[["auto", "Automática"], ["lite", "Ligera"], ["high", "Máxima"]].map(([k, t]) => btn(((st.graphics || "auto") === k ? "✓ " : "") + t, () => { S.settings = { ...S.settings, graphics: k }; emit(); applySettings(); ok("Calidad: " + t, "Recarga la página para verlo del todo."); }))),
        sec("Color del sable"),
        row(...DATA.sabers.map(c => btn(((S.profile && S.profile.saber) === c.id ? "✓ " : "") + c.label, () => { S.profile = { ...(S.profile || {}), saber: c.id }; emit(); applySettings(); SFX.saber(); draw(); }))),
        sec("Sonido y movimiento"),
        row(btn(st.muted ? "🔇 Sonido apagado" : "🔊 Sonido encendido", () => { S.settings = { ...S.settings, muted: !st.muted }; emit(); draw(); }), btn(st.ambience ? "🎵 Ambiente encendido" : "🎵 Ambiente apagado", () => { S.settings = { ...S.settings, ambience: !st.ambience }; emit(); draw(); }), btn(st.reduceMotion ? "🐢 Animaciones reducidas" : "🐇 Animaciones completas", () => { S.settings = { ...S.settings, reduceMotion: !st.reduceMotion }; emit(); applySettings(); draw(); })),
        sec("Nombre"),
        h("form", { class: "gate-form", onsubmit: e => { e.preventDefault(); const v = e.target.querySelector("input").value.trim(); if (v) { S.profile = { ...(S.profile || {}), name: v }; emit(); ok("Nombre: " + v); } } }, h("input", { class: "field", value: herName(), maxlength: 24, "aria-label": "Nombre" }), h("button", { class: "btn btn--sm", type: "submit" }, "Guardar nombre")),
        sec("Página completa"),
        row(btn("⚙ Opciones normales", run(() => go("settings"))), btn("💾 Descargar copia de seguridad", run(() => { go("settings"); setTimeout(() => [...document.querySelectorAll(".btn")].find(b => b.textContent === "Descargar copia")?.click(), 400); })), btn("🔄 Recargar la página", () => location.reload())),
        sec("Salir"),
        btn("Salir del modo administrador", () => { close(); setAdmin(false); toast("⚙", "Modo administrador desactivado", "La galaxia vuelve a funcionar como para Arián."); }, "btn"),
      ];
    }
    body.replaceChildren(tabs, ...pane.flat());
  }
  draw();
}
function whatsNewForce() { setData("v3seen", false); const keep = S.readLetters; if (!keep.length) S.readLetters = ["c01"]; whatsNew(() => { S.readLetters = keep; }); }
