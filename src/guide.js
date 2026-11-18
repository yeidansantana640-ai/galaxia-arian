/* ================= GATE, HELP, TOUR, MEMORY ================= */
const GATE_KEY = "galaxia-arian:gate", GATE_H = 840749505;
function gateOk() { try { return localStorage.getItem(GATE_KEY) === String(GATE_H); } catch (e) { return !!gateOk.mem; } }
function gate(done) {
  if (gateOk()) return done();
  const cv = h("canvas");
  const inp = h("input", { class: "gate-in", type: "password", autocomplete: "off", autocapitalize: "off", spellcheck: "false", "aria-label": "Contraseña", placeholder: "Código de acceso" });
  const msg = h("p", { class: "gate-msg", role: "status" });
  const lock = h("div", { class: "gate-lock" }, h("div", { class: "cube" }, h("div", { class: "cube-in" }, [1, 2, 3, 4, 5, 6].map(() => h("i")))));
  const saber = h("div", { class: "saber gate-saber" });
  const form = h("form", { class: "gate-form", onsubmit: e => {
    e.preventDefault();
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
      h("p", { class: "muted", style: { margin: 0 } }, "Esta galaxia guarda transmisiones privadas. Introduce el código para abrirla."),
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
    sec("🏅", "6. Logros, Orbi y secretos", "En «Secretos» están los holocrones, los logros (reclámalos para ganar chispas) y el último holocrón, que se abre al leer todas las demás cartas.", "Orbi, una esfera pequeña, aparece a veces en los planetas con un mensaje escondido."),
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
const REMEMBER = ["map", "letters", "planets", "memories", "secrets", "planet"];
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
function adminPanel() {
  if (!isAdmin()) return adminPrompt();
  const d = dget();
  const btn = (t, f, cls = "btn btn--sm") => h("button", { class: cls, onclick: f }, t);
  const close = modal(h("div", null, h("div", { class: "eyebrow" }, "Solo para Yeidan"), h("h2", null, "Panel de administrador")), [
    h("p", { class: "muted", style: { margin: 0, fontSize: "13.5px" } }, "Con el modo administrador todo está abierto en este dispositivo y leer cartas no cuenta como leídas. No afecta al móvil de Arián: cada dispositivo guarda su propio progreso."),
    h("div", { class: "section-t" }, "Ver escenas"),
    h("div", { class: "m-row", style: { justifyContent: "flex-start" } },
      btn("▶ Contraseña de entrada", () => { close(); try { localStorage.removeItem(GATE_KEY); } catch (e) { } gate(() => { }); }),
      btn("▶ Introducción", () => { close(); playIntro(() => { }); }),
      btn("▶ Visita guiada", () => { close(); go("map"); setTimeout(startTour, 700); }),
      btn("▶ Mensaje de novedades", () => { close(); setData("v3seen", false); const r = S.readLetters; whatsNewForce(); }),
      btn("▶ Final del viaje", () => { close(); playFinale(() => openLetter("c57", null, true)); }, "btn btn--sm btn--gold")),
    h("div", { class: "section-t" }, "Ir a un planeta"),
    h("div", { class: "admin-planets" }, ORDER.map((pid, i) => h("button", { class: "admin-p", onclick: () => { close(); go("planet", { id: pid }); } }, planetEl(pid, 40), h("span", null, `${i + 1}. ${P[pid].name}`)))),
    h("div", { class: "section-t" }, `Las ${LETTERS.length} cartas`),
    h("div", { class: "admin-letters" }, ORDER.map(pid => h("div", null, h("b", null, P[pid].name), h("div", { class: "m-row", style: { justifyContent: "flex-start", gap: "6px" } }, lettersOf(pid).map(l => h("button", { class: "admin-l", title: l.title, onclick: () => { close(); openLetter(l.id, lettersOf(pid), true); } }, l.n)))))),
    h("div", { class: "section-t" }, "Probar el juego"),
    h("div", { class: "m-row", style: { justifyContent: "flex-start" } },
      btn("✓ Completar todas las misiones", () => { for (const p of ORDER) for (const m of MISSIONS[p]) S.flags = { ...S.flags, [m.flag]: true }; for (const p of ORDER) S.visited = { ...S.visited, [p]: true }; emit(); toast("✓", "Misiones completadas", "Todas las misiones y planetas marcados."); }),
      btn("✦ +50 chispas", () => { dset({ cred: dget().cred + 50 }); toast("✦", "+50 chispas", `Ahora tienes ${dget().cred}.`); }),
      btn("🤖 Amistad al máximo", () => { dset({ xp: 200 }); toast("🤖", "Amistad nivel 10", "Todos los accesorios disponibles."); }),
      btn("🔵 Hacer aparecer a Orbi", () => { dset({ sphereOn: null }); toast("🔵", "Orbi está de camino", "Aparecerá en el próximo planeta que visites."); }),
      btn("↺ Reiniciar progreso de este dispositivo", () => { if (!confirm("¿Borrar el progreso de ESTE dispositivo? (cartas, misiones, droide). El de Arián no se toca.")) return; Object.assign(S, { readLetters: [], visited: {}, flags: {}, counters: {}, lastPlanet: null, data: { v3seen: true, tourDone: true } }); emit(); close(); go("map"); toast("↺", "Progreso reiniciado", "Este dispositivo empieza de cero."); }, "btn btn--sm btn--ghost")),
    h("div", { class: "section-t" }, "Salir"),
    btn("Salir del modo administrador", () => { close(); setAdmin(false); toast("⚙", "Modo administrador desactivado", "La galaxia vuelve a funcionar como para Arián."); }, "btn"),
  ], null, "⚙");
}
function whatsNewForce() { setData("v3seen", false); const keep = S.readLetters; if (!keep.length) S.readLetters = ["c01"]; whatsNew(() => { S.readLetters = keep; }); }
