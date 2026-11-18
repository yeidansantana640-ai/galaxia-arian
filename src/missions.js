/* ================= MISSIONS ================= */
const MISSIONS = {
  naboo: [
    { flag: "naboo.garden", ic: "🌷", t: "Jardín de dedicatorias", d: "Haz florecer los capullos del jardín de palacio.", k: "bloom", words: ["calma", "risa", "luz", "ternura", "paciencia", "hogar"] },
    { flag: "naboo.fountain", ic: "⛲", t: "La fuente de las frases", d: "Mantén pulsado para llenar la fuente.", k: "hold", ms: 3200, label: "Llenar", quote: "Lo bonito se cuida despacio." },
    { flag: "naboo.bench", ic: "🪷", t: "El banco junto al lago", d: "Siéntate un momento y mira el atardecer.", k: "bench" },
  ],
  coruscant: [
    { flag: "coruscant.lights", ic: "🏙️", t: "Enciende la ciudad", d: "Cada edificio iluminado guarda un recuerdo.", k: "city" },
    { flag: "coruscant.daynight", ic: "🌗", t: "La torre del amanecer", d: "Cambia la ciudad del día a la noche y vuelta.", k: "daynight" },
    { flag: "coruscant.inbox", ic: "📡", t: "Transmisiones holográficas", d: "Lee los mensajes que llegan a la torre.", k: "inbox" },
    { flag: "coruscant.diary", ic: "📓", t: "El holodiario", d: "Deja una entrada en el archivo de la ciudad.", k: "write", key: "diary", ph: "Hoy me he acordado de…", btn: "Guardar en el holodiario" },
  ],
  tatooine: [
    { flag: "tatooine.trips3", ic: "🚀", t: "Ruta Tenerife – Valencia", d: "Pilota la nave entre los dos puertos espaciales.", k: "trips" },
    { flag: "tatooine.suns", ic: "🌅", t: "La puesta de los dos soles", d: "Acompaña a los dos soles hasta el horizonte.", k: "suns" },
    { flag: "tatooine.beacon", ic: "📶", t: "La baliza del desierto", d: "Sintoniza la frecuencia de una señal secreta.", k: "tune" },
  ],
  endor: [
    { flag: "endor.holocron", ic: "◈", t: "El holocrón escondido", d: "Busca entre los arbustos del bosque.", k: "search" },
    { flag: "endor.fireflies", ic: "✨", t: "Bosque de luciérnagas", d: "Atrapa las luces que vuelan entre los árboles.", k: "fireflies" },
    { flag: "endor.creature", ic: "🐻", t: "Un habitante del bosque", d: "Gánate la confianza de una criatura tímida.", k: "care", set: [{ id: "osito", e: "🐻", n: "Osito peludo" }, { id: "erizo", e: "🦔", n: "Erizo de musgo" }, { id: "ardilla", e: "🐿️", n: "Ardilla planeadora" }], acts: [["🍓", "Darle bayas"], ["🤲", "Acariciarle"], ["🎵", "Cantarle bajito"]] },
    { flag: "endor.chest", ic: "🧰", t: "El cofre del bosque", d: "Un cofre antiguo escondido entre los árboles.", k: "chest", req: ["endor.holocron", "endor.fireflies"], reqText: "Encuentra antes el holocrón y las luciérnagas: ellos señalan dónde está el cofre." },
  ],
  "ahch-to": [
    { flag: "ahch-to.books", ic: "📚", t: "La biblioteca de piedra", d: "Abre los textos sagrados de la isla.", k: "read", key: "books", items: [
      { t: "Primer texto · La quietud", b: "Los antiguos maestros escribían que la Fuerza no se escucha gritando, sino en silencio. Que quien sabe esperar ve cosas que los demás no ven." },
      { t: "Segundo texto · El equilibrio", b: "Ni todo luz ni todo sombra: un buen corazón es el que sabe cuidar lo que ama sin apretarlo demasiado." },
      { t: "Tercer texto · La raíz", b: "El árbol que más resiste no es el más alto, sino el que tiene la raíz más honda. Lo que crees es tu raíz." }] },
    { flag: "ahch-to.calm", ic: "🌊", t: "Respirar con la Fuerza", d: "Tres respiraciones lentas frente al mar.", k: "breath" },
    { flag: "ahch-to.note", ic: "🪨", t: "Una nota en la roca", d: "Algo está grabado en la roca más alta.", k: "rock" },
  ],
  mustafar: [
    { flag: "mustafar.sequence", ic: "🌋", t: "Cruzar el río de lava", d: "Repite el camino de piedras que se encienden.", k: "simon" },
    { flag: "mustafar.vents", ic: "♨️", t: "Respiraderos de vapor", d: "Libera la presión en el momento justo.", k: "vents" },
    { flag: "mustafar.temple", ic: "🗝️", t: "El templo escondido", d: "Enciende tu sable para abrir la puerta.", k: "temple", req: ["mustafar.sequence", "mustafar.vents"], reqText: "Cruza el río y libera los respiraderos primero." },
  ],
  alderaan: [
    { flag: "alderaan.places", ic: "🏔️", t: "Lugares por conocer", d: "Elige sitios a los que te gustaría ir juntos.", k: "places" },
    { flag: "alderaan.capsule", ic: "⏳", t: "La cápsula del tiempo", d: "Guarda un deseo para el futuro.", k: "write", key: "capsule", ph: "Dentro de un año me gustaría…", btn: "Sellar la cápsula" },
    { flag: "alderaan.calendar", ic: "📅", t: "El calendario de los 21", d: "Encuentra el día que se repite cada mes.", k: "calendar" },
  ],
  hoth: [
    { flag: "hoth.stars", ic: "⭐", t: "Estrellas escondidas", d: "Encuentra las estrellas que apenas brillan.", k: "stars" },
    { flag: "hoth.constellation", ic: "✦", t: "Una constelación nueva", d: "Une las estrellas en orden y descubre su forma.", k: "connect" },
    { flag: "hoth.planets", ic: "🔭", t: "El telescopio del observatorio", d: "Mueve la lente y encuentra tres planetas.", k: "lens" },
  ],
  bespin: [
    { flag: "bespin.postcard", ic: "💌", t: "Postal desde las nubes", d: "Diseña una postal para enviarla a Tenerife.", k: "postcard" },
    { flag: "bespin.balloons", ic: "🎈", t: "Globos de recuerdos", d: "Atrapa los globos antes de que se pierdan en las nubes.", k: "balloons" },
    { flag: "bespin.landmarks", ic: "🛰️", t: "El mirador panorámico", d: "Desliza la vista y encuentra los tres miradores.", k: "pano" },
  ],
  kashyyyk: [
    { flag: "kashyyyk.tulip", ic: "🌷", t: "Plantar un tulipán", d: "Cuida una semilla hasta que florezca.", k: "tulip" },
    { flag: "kashyyyk.creatures", ic: "🦋", t: "Criaturas del santuario", d: "Cuida a una criatura del bosque.", k: "care", set: [{ id: "lumi", e: "🦉", n: "Lumi" }, { id: "musgo", e: "🐸", n: "Musgo" }, { id: "brisa", e: "🦋", n: "Brisa" }], acts: [["💧", "Darle agua"], ["🍃", "Hacerle un nido"], ["☀️", "Llevarla al sol"]] },
    { flag: "kashyyyk.plants", ic: "🌿", t: "Colección de plantas", d: "Encuentra las seis plantas del bosque.", k: "plants" },
  ],
  dagobah: [
    { flag: "dagobah.lift", ic: "🛸", t: "Levantar la nave del pantano", d: "Mantén pulsado y usa la Fuerza para sacar la nave del agua.", k: "hold", ms: 3600, label: "Usar la Fuerza", quote: "Con calma. La Fuerza no tiene prisa." },
    { flag: "dagobah.cave", ic: "🕯️", t: "La cueva", d: "Mueve la luz por la cueva y encuentra lo que se esconde dentro.", k: "lens", items: [["🔦", 22, 34], ["🪞", 70, 28], ["🌱", 48, 72]], hint: "Arrastra el dedo para mover la luz.", end: "Dentro de la cueva solo había un espejo… y una pequeña planta creciendo." },
    { flag: "dagobah.stones", ic: "🪨", t: "Piedras en equilibrio", d: "Repite el orden en que se iluminan las piedras, como en el entrenamiento.", k: "simon", cols: ["#7a9a7a", "#a8c8a0", "#5a7a6a", "#c8d8b0"], end: "Equilibrio conseguido. Paso a paso se aprende todo." },
  ],
  yavin: [
    { flag: "yavin.cipher", ic: "🔐", t: "El mensaje del templo", d: "Gira el disco hasta que la inscripción tenga sentido.", k: "cipher" },
    { flag: "yavin.symbols", ic: "🔣", t: "Los símbolos del templo", d: "Empareja los símbolos grabados en la piedra.", k: "pairs" },
    { flag: "yavin.xwing", ic: "🎯", t: "El vuelo por la trinchera", d: "Pulsa cuando la mira esté en la zona blanca. Tres aciertos.", k: "vents", icon: "🎯", btn: "¡Disparar!", lab: "Pulsa cuando la mira esté en la zona blanca.", end: "Impacto perfecto. Confiar en lo aprendido funciona." },
  ],
};
const FLAG2M = {}; for (const pid in MISSIONS) for (const m of MISSIONS[pid]) { m.pid = pid; FLAG2M[m.flag] = m; }
const lettersForFlag = f => LETTERS.filter(l => JSON.stringify(l.unlock).includes(`"${f}"`));
const missionAvailable = m => !m.req || m.req.every(f => flag(f));

/* ================= mission runner ================= */
function openMission(m) {
  const box = h("div", { style: { display: "grid", gap: "14px" } });
  const done = flag(m.flag);
  const opens = lettersForFlag(m.flag);
  const close = modal(h("div", null, h("div", { class: "eyebrow" }, P[m.pid].name + " · Misión"), h("h2", null, m.t)), [
    h("div", { class: "howto" }, h("b", null, "Qué hay que hacer"), h("span", null, m.d)),
    opens.length ? h("p", { class: "muted", style: { margin: 0, fontSize: "13px" } }, `🔓 Al completarla te acercas a ${opens.length === 1 ? "1 carta" : opens.length + " cartas"} de este planeta.`) : null,
    box], () => { }, m.ic);
  let finished = false;
  const finish = (msg) => {
    if (finished) return; finished = true;
    const wasDone = flag(m.flag); raise(m.flag); SFX.good(); if (!wasDone) celebrate();
    const newL = LETTERS.filter(l => l.planet === m.pid || true).filter(l => JSON.stringify(l.unlock).includes(`"${m.flag}"`) && letterUnlocked(l));
    box.append(h("div", { class: "m-done" }, h("div", { style: { fontSize: "30px" } }, "✓"), h("b", null, wasDone ? "Misión completada" : "¡Misión completada!"), msg ? h("p", { class: "m-quote", style: { fontSize: "1.15rem" } }, msg) : null,
      newL.length ? h("div", { class: "m-row" }, newL.map(l => h("button", { class: "btn btn--gold btn--sm", onclick: () => { close(); openLetter(l.id); } }, kindOf(l).glyph + " " + l.title))) : null,
      (() => {
        const nm = (MISSIONS[m.pid] || []).find(x => x !== m && !flag(x.flag) && missionAvailable(x));
        if (nm) return h("button", { class: "btn btn--primary btn--sm", onclick: () => { close(); openMission(nm); } }, `Siguiente misión: ${nm.ic} ${nm.t} →`);
        const np = nextPlanet();
        if (np && np !== m.pid) return h("button", { class: "btn btn--primary btn--sm", onclick: () => { close(); SFX.jump(); hyperspace(() => go("planet", { id: np })); } }, `¡Planeta terminado! Viajar a ${ORDER.indexOf(np) + 1} · ${P[np].name} →`);
        return null;
      })(),
      h("button", { class: "btn btn--ghost btn--sm", onclick: close }, "Volver al planeta")));
    setTimeout(() => box.lastChild && box.lastChild.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
  };
  if (!missionAvailable(m)) { box.append(h("div", { class: "empty" }, "🔒 " + m.reqText)); return; }
  (KINDS[m.k] || KINDS.hold)(box, m, finish, done);
}

const stage = (cls, style) => h("div", { class: "stage " + (cls || ""), style });
const KINDS = {
  bloom(box, m, fin, done) {
    const got = new Set(); const st = stage("", { background: "linear-gradient(180deg,#bfe9ff,#e9fff4 55%,#7fc79a 56%,#3e8f63)" });
    const words = h("div", { class: "m-row" });
    const pos = [[18, 70], [36, 80], [52, 68], [68, 82], [82, 70], [44, 90]];
    m.words.forEach((w, i) => {
      const b = h("button", { class: "it", style: { left: pos[i][0] + "%", top: pos[i][1] + "%", fontSize: "30px" }, "aria-label": "Capullo" }, done ? "🌷" : "🌱");
      b.onclick = () => { if (got.has(i)) return; got.add(i); b.textContent = ["🌷", "🌸", "🌼", "🌺", "💮", "🌹"][i]; b.style.transform = "translate(-50%,-50%) scale(1.25)"; SFX.note(392 + i * 60); words.append(h("span", { class: "chip chip--gold" }, w)); if (got.size === m.words.length) fin("Seis flores, seis cosas que traes contigo a todas partes."); };
      st.append(b);
    });
    st.append(h("div", { style: { position: "absolute", left: "8%", top: "12%", fontSize: "34px" } }, "🏛️"), h("div", { style: { position: "absolute", right: "10%", top: "16%", fontSize: "20px", opacity: .8 } }, "🦋"));
    box.append(st, words);
  },
  hold(box, m, fin) {
    const r = 70, C = 2 * Math.PI * r; let t = 0, raf = 0, last = 0;
    const prog = s("circle", { cx: 81, cy: 81, r, stroke: "var(--accent)", "stroke-dasharray": C, "stroke-dashoffset": C, "stroke-linecap": "round" });
    const btn = h("button", { class: "holdbtn" }, s("svg", { viewBox: "0 0 162 162" }, s("circle", { cx: 81, cy: 81, r, stroke: "rgba(255,255,255,.12)" }), prog), h("span", null, m.label || "Mantén"));
    const q = h("p", { class: "m-quote", style: { opacity: 0, transition: "opacity 1s" } }, m.quote || "");
    const step = now => { t += now - last; last = now; prog.setAttribute("stroke-dashoffset", C * (1 - clamp(t / m.ms, 0, 1))); if (t >= m.ms) { q.style.opacity = 1; fin(); return; } raf = requestAnimationFrame(step); };
    const down = e => { e.preventDefault(); last = performance.now(); SFX.tap(); cancelAnimationFrame(raf); raf = requestAnimationFrame(step); };
    const up = () => { cancelAnimationFrame(raf); if (t < m.ms) { t = Math.max(0, t - 400); prog.setAttribute("stroke-dashoffset", C * (1 - t / m.ms)); } };
    btn.addEventListener("pointerdown", down); btn.addEventListener("pointerup", up); btn.addEventListener("pointerleave", up); btn.addEventListener("pointercancel", up);
    box.append(btn, q);
  },
  bench(box, m, fin) {
    const st = stage("", { background: "linear-gradient(180deg,#2a3b7a,#ff9f7a 55%,#ffd29a 62%,#2c6a7a 63%,#183c4c)", transition: "filter 5s" });
    const sun = h("div", { style: { position: "absolute", left: "50%", top: "40%", width: "60px", height: "60px", borderRadius: "50%", background: "#ffe9b0", boxShadow: "0 0 50px #ffb36b", transform: "translate(-50%,-50%)", transition: "top 6s ease-in" } });
    st.append(sun, h("div", { style: { position: "absolute", left: 0, right: 0, top: "63%", bottom: 0, background: "repeating-linear-gradient(180deg,rgba(255,220,160,.12) 0 2px,transparent 2px 9px)" } }), h("div", { style: { position: "absolute", left: "50%", bottom: "8%", transform: "translateX(-50%)", fontSize: "44px" } }, "🪑"));
    const q = h("p", { class: "m-quote", style: { opacity: 0, transition: "opacity 1.5s" } }, "Un banco, un lago y nada de prisa. Aquí siempre hay sitio para dos.");
    const b = h("button", { class: "btn btn--primary" }, "Sentarse");
    b.onclick = () => { b.disabled = true; b.textContent = "Mirando el lago…"; sun.style.top = "66%"; st.style.filter = "brightness(.8) saturate(1.2)"; ambienceChime(); setTimeout(() => { q.style.opacity = 1; fin(); b.remove(); }, 5600); };
    box.append(st, q, b);
  },
  city(box, m, fin) {
    const st = stage("", { background: "linear-gradient(180deg,#05061a,#1a1240 60%,#3a1f4a)" }); let lit = 0;
    const B = [[6, 40, 12], [19, 28, 10], [30, 52, 14], [44, 18, 12], [57, 36, 11], [68, 24, 13], [80, 46, 10], [90, 30, 9]];
    B.forEach(([x, top, w], i) => {
      const b = h("button", { "aria-label": "Edificio " + (i + 1), style: { position: "absolute", left: x + "%", top: top + "%", bottom: 0, width: w + "%", transform: "translateX(-50%)", border: 0, borderRadius: "4px 4px 0 0", background: "linear-gradient(180deg,#2a2440,#141024)", cursor: "pointer", backgroundImage: "repeating-linear-gradient(0deg,transparent 0 9px,rgba(0,0,0,.4) 9px 11px),repeating-linear-gradient(90deg,transparent 0 6px,rgba(0,0,0,.4) 6px 8px)", transition: "background-color .5s, box-shadow .5s" } });
      b.onclick = () => { if (b.dataset.on) return; b.dataset.on = 1; lit++; b.style.background = "linear-gradient(180deg,#ffe2a0,#ff9f5a)"; b.style.backgroundBlendMode = "multiply"; b.style.boxShadow = "0 0 24px rgba(255,190,100,.6)"; SFX.note(330 + lit * 55); if (lit === B.length) fin("Una ciudad que nunca se apaga, como lo que guardamos."); };
      st.append(b);
    });
    st.append(h("div", { class: "sc-float", style: { position: "absolute", left: "20%", top: "14%", fontSize: "18px", animation: "fly 9s linear infinite" } }, "🛸"));
    box.append(st, h("p", { class: "m-note" }, "Toca cada edificio para encender sus ventanas."));
  },
  daynight(box, m, fin) {
    let n = 0, night = false;
    const st = stage("", { background: "linear-gradient(180deg,#7fc4ff,#ffe7c0)", transition: "background 1.2s" });
    const orb = h("div", { style: { position: "absolute", left: "70%", top: "18%", width: "54px", height: "54px", borderRadius: "50%", background: "#fff3c0", boxShadow: "0 0 50px #ffd27a", transition: "all 1.2s" } });
    const sky = h("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "55%", background: "repeating-linear-gradient(90deg,#3a3550 0 18px,#2c2840 18px 30px,#46405e 30px 52px)", clipPath: "polygon(0 40%,8% 40%,8% 10%,16% 10%,16% 50%,26% 50%,26% 0,34% 0,34% 30%,46% 30%,46% 15%,54% 15%,54% 45%,66% 45%,66% 5%,74% 5%,74% 35%,86% 35%,86% 20%,100% 20%,100% 100%,0 100%)", transition: "filter 1.2s" } });
    st.append(orb, sky);
    const b = h("button", { class: "btn btn--primary" }, "Hacer de noche");
    b.onclick = () => {
      night = !night; n++; SFX.select();
      st.style.background = night ? "linear-gradient(180deg,#02030f,#1a1240)" : "linear-gradient(180deg,#7fc4ff,#ffe7c0)";
      orb.style.background = night ? "#e8ecff" : "#fff3c0"; orb.style.boxShadow = night ? "0 0 30px #9fb0ff" : "0 0 50px #ffd27a"; orb.style.left = night ? "20%" : "70%";
      sky.style.filter = night ? "brightness(.6) drop-shadow(0 0 6px #ffb86b)" : "none";
      sky.style.backgroundImage = night ? "radial-gradient(2px 2px at 20% 60%,#ffd27a,transparent),radial-gradient(2px 2px at 45% 70%,#ffd27a,transparent),radial-gradient(2px 2px at 70% 55%,#ffd27a,transparent),radial-gradient(2px 2px at 85% 80%,#ffd27a,transparent),repeating-linear-gradient(90deg,#3a3550 0 18px,#2c2840 18px 30px,#46405e 30px 52px)" : "repeating-linear-gradient(90deg,#3a3550 0 18px,#2c2840 18px 30px,#46405e 30px 52px)";
      b.textContent = night ? "Hacer de día" : "Hacer de noche";
      if (n >= 2) fin("De día te pienso, de noche te escribo. La ciudad no descansa, y yo tampoco de quererte.");
    };
    box.append(st, b);
  },
  inbox(box, m, fin) {
    const msgs = false ? [{ id: "sys", t: "Señal sin remitente", b: "Este sistema no aparece en ningún mapa. Las balizas sirven para que las transmisiones lo encuentren." }, { id: "sys2", t: "Coordenadas de origen", b: "Origen de la señal: una isla en el Atlántico. Destino: una ciudad entre naranjos. Distancia: la que haga falta." }, { id: "sys3", t: "Fin de la transmisión", b: "Todo lo que se ha encontrado aquí es tuyo. Puedes volver siempre que quieras." }]
      : [{ id: "base", t: "Señal de bienvenida", b: "Transmisión de la torre de Coruscant: el archivo de las estrellas perdidas está recibiendo señales de todos los planetas. Si exploras, llegarán más." }, ...activeEffects().filter(e => e.effect.planet === "coruscant").map(e => ({ id: e.effect.id, t: e.effect.title, b: e.effect.body }))];
    const key = "inbox." + m.pid, read = new Set(getData(key, []));
    const list = h("div", { style: { display: "grid", gap: "8px" } });
    const draw = () => {
      list.replaceChildren(...msgs.map(x => h("div", { class: "secret-row" }, h("div", { style: { fontSize: "20px" } }, read.has(x.id) ? "📖" : "📡"), h("div", { class: "grow" }, h("b", null, x.t), read.has(x.id) ? h("span", { style: { color: "var(--ink2)", fontSize: "14px" } }, x.b) : h("span", null, "Transmisión pendiente")),
        read.has(x.id) ? null : h("button", { class: "btn btn--sm", onclick: () => { read.add(x.id); setData(key, [...read]); SFX.holo(); draw(); if (msgs.every(y => read.has(y.id))) fin(); } }, "Leer"))));
    };
    draw(); box.append(list);
    if (msgs.every(y => read.has(y.id))) fin();
  },
  write(box, m, fin) {
    const entries = getData(m.key, []);
    const ta = h("textarea", { class: "field", placeholder: m.ph, maxlength: 600 });
    const list = h("div", { style: { display: "grid", gap: "8px" } });
    const draw = () => list.replaceChildren(...getData(m.key, []).slice().reverse().map(e => h("div", { class: "secret-row" }, h("div", { class: "grow" }, h("span", null, new Date(e.at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })), h("b", { style: { fontWeight: 400, fontFamily: "var(--f-letter)", fontSize: "1.15rem" } }, e.text)))));
    const b = h("button", { class: "btn btn--primary", onclick: () => { const v = ta.value.trim(); if (!v) { ta.focus(); return; } setData(m.key, [...getData(m.key, []), { text: v, at: new Date().toISOString() }]); ta.value = ""; draw(); fin(m.key === "capsule" ? "Cápsula sellada. La encontrarás en «Recuerdos»." : "Guardado en el holodiario. Lo verás también en «Recuerdos»."); } }, m.btn);
    draw(); box.append(ta, b, entries.length ? h("div", { class: "section-t" }, "Guardado") : null, list);
    if (entries.length && !flag(m.flag)) fin();
  },
  trips(box, m, fin) {
    let n = getData("trips", 0), at = n % 2;
    const st = stage("", { background: "linear-gradient(180deg,#0a2a4a,#123a5e)" });
    st.append(h("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 70%,rgba(255,200,120,.25),transparent 30%),radial-gradient(circle at 80% 30%,rgba(255,170,90,.25),transparent 30%)" } }));
    const pin = (x, y, n1, n2) => h("div", { style: { position: "absolute", left: x + "%", top: y + "%", transform: "translate(-50%,-50%)", textAlign: "center" } }, h("div", { style: { width: "16px", height: "16px", margin: "0 auto", borderRadius: "50%", background: "var(--gold)", boxShadow: "0 0 16px var(--gold)" } }), h("div", { style: { fontWeight: 700, fontSize: "13px", marginTop: "4px" } }, n1), h("div", { class: "muted", style: { fontSize: "11px" } }, n2));
    st.append(svgHTML(`<svg viewBox="0 0 100 75" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%"><path d="M20 52 Q50 0 80 22" fill="none" stroke="rgba(255,217,138,.55)" stroke-width=".6" stroke-dasharray="1.5 2"/></svg>`));
    st.append(pin(20, 74, "Tenerife", "Puerto de la isla"), pin(80, 30, "Valencia", "Puerto de los naranjos"));
    const ship = h("div", { style: { position: "absolute", left: at ? "80%" : "20%", top: at ? "30%" : "70%", transform: "translate(-50%,-50%) rotate(" + (at ? 200 : 20) + "deg)", fontSize: "28px", transition: "left 1.6s cubic-bezier(.6,0,.4,1),top 1.6s cubic-bezier(.6,0,.4,1)", filter: "drop-shadow(0 0 8px #7fe3ff)" } }, "🚀");
    st.append(ship);
    const lab = h("p", { class: "m-note", style: { textAlign: "center" } });
    const upd = () => lab.textContent = `Viajes completados: ${Math.min(Math.floor(n / 2), 3)} / 3 (ida y vuelta)`;
    const b = h("button", { class: "btn btn--primary" }); const txt = () => b.textContent = at ? "Volver a Tenerife" : "Despegar hacia Valencia";
    b.onclick = () => {
      b.disabled = true; SFX.jump(); at = 1 - at; n++; setData("trips", n);
      ship.style.left = at ? "80%" : "20%"; ship.style.top = at ? "30%" : "70%";
      setTimeout(() => { ship.style.transform = "translate(-50%,-50%) rotate(" + (at ? 200 : 20) + "deg)"; b.disabled = false; txt(); upd(); if (n >= 6) { fin("Ida y vuelta, las veces que haga falta."); b.disabled = true; } }, 1650);
    };
    txt(); upd(); box.append(st, lab, b);
    if (n >= 6) fin();
  },
  suns(box, m, fin) {
    const st = stage("", { background: "linear-gradient(180deg,#ffb36b,#ffe0a0 60%,#d99a4e 61%,#8a5a2e)" });
    const s1 = h("div", { style: { position: "absolute", left: "38%", width: "46px", height: "46px", borderRadius: "50%", background: "#fff4c8", boxShadow: "0 0 40px #ffd27a", transform: "translate(-50%,-50%)" } });
    const s2 = h("div", { style: { position: "absolute", left: "60%", width: "32px", height: "32px", borderRadius: "50%", background: "#ffc46b", boxShadow: "0 0 30px #ff9a3d", transform: "translate(-50%,-50%)" } });
    const shade = h("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(180deg,#1a1240,#3a2050)", opacity: 0 } });
    st.append(shade, s1, s2, h("div", { style: { position: "absolute", left: 0, right: 0, top: "61%", bottom: 0, background: "linear-gradient(180deg,#c48a48,#6a3a1e)", clipPath: "polygon(0 20%,20% 0,45% 25%,70% 5%,100% 22%,100% 100%,0 100%)" } }), h("div", { style: { position: "absolute", left: "16%", top: "72%", fontSize: "22px" } }, "🏠"));
    const r = h("input", { type: "range", min: 0, max: 100, value: 0, class: "range", "aria-label": "Altura de los soles" });
    const set = v => { s1.style.top = lerp(18, 64, v / 100) + "%"; s2.style.top = lerp(26, 66, v / 100) + "%"; shade.style.opacity = v / 130; };
    r.oninput = () => { set(+r.value); if (+r.value >= 97) fin("Dos soles que se van juntos. Como cuando, a la vez, miramos la misma luz desde lejos."); };
    set(0); box.append(st, r, h("p", { class: "m-note" }, "Desliza para bajar los soles."));
  },
  tune(box, m, fin) {
    const target = 62, wave = h("canvas", { width: 600, height: 160, style: { width: "100%", height: "120px", borderRadius: "14px", background: "#070a14", border: "1px solid var(--hair2)" } });
    const g = wave.getContext("2d"); let v = 20, hold = 0, last = performance.now(), raf, ok = false;
    const r = h("input", { type: "range", min: 0, max: 100, value: v, class: "range", "aria-label": "Frecuencia" });
    const lab = h("p", { class: "m-note", style: { textAlign: "center", fontFamily: "var(--f-display)", letterSpacing: ".1em" } });
    r.oninput = () => { v = +r.value; };
    const frame = t => {
      if (!wave.isConnected) return;
      const d = Math.abs(v - target), clear = clamp(1 - d / 25, 0, 1);
      g.clearRect(0, 0, 600, 160); g.strokeStyle = `hsl(${lerp(0, 160, clear)} 90% 65%)`; g.lineWidth = 2.4; g.beginPath();
      for (let x = 0; x < 600; x++) { const y = 80 + Math.sin(x * .05 + t * .006) * 40 * clear + (Math.random() - .5) * 60 * (1 - clear); x ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke();
      lab.textContent = `Frecuencia ${(107 + v * .9).toFixed(1)} MHz · ${clear > .85 ? "SEÑAL CLARA" : clear > .5 ? "señal débil" : "ruido"}`;
      if (clear > .85) { hold += t - last; if (hold > 1400 && !ok) { ok = true; SFX.beep(); lab.textContent = "· – · · –   mensaje: «Te echo de menos» "; fin("La señal decía, en el idioma de las balizas: «Te echo de menos». Y su respuesta: «Y yo a ti»."); } } else hold = 0;
      last = t; raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame); box.append(wave, lab, r);
  },
  search(box, m, fin, done) {
    const st = stage("", { background: "linear-gradient(180deg,#0c2416,#1d4a2a)" }); const hidden = 7; let tries = 0;
    const junk = ["🐞", "🍂", "🪲", "🍄", "🐌", "🌰", "🪺", "🦗"];
    for (let i = 0; i < 9; i++) {
      const b = h("button", { class: "it", style: { left: (18 + (i % 3) * 32) + "%", top: (22 + Math.floor(i / 3) * 28) + "%", fontSize: "40px" }, "aria-label": "Arbusto" }, "🌳");
      b.onclick = () => { if (b.dataset.o) return; b.dataset.o = 1; tries++; if (i === hidden || (tries >= 6 && !st.querySelector("[data-h]"))) { b.dataset.h = 1; b.innerHTML = '<span style="font-size:34px;color:#ffd98a;text-shadow:0 0 18px #ffd98a">◈</span>'; SFX.unlock(); fin("Un holocrón entre los árboles: guardaba un fragmento de la transmisión."); } else { b.textContent = junk[i % junk.length]; SFX.tap(); } };
      st.append(b);
    }
    box.append(st);
  },
  fireflies(box, m, fin) {
    const st = stage("", { background: "radial-gradient(circle at 50% 120%,#1d4a2a,#06120a 70%)" }); let got = 0; const N = 7;
    st.append(h("div", { style: { position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg,transparent 0 14%,rgba(0,0,0,.45) 14% 17%)" } }));
    for (let i = 0; i < N; i++) {
      const f = h("button", { class: "it", "aria-label": "Luciérnaga", style: { left: (10 + Math.random() * 80) + "%", top: (10 + Math.random() * 75) + "%", transition: "left 2.4s ease-in-out,top 2.4s ease-in-out,opacity .4s" } }, h("span", { style: { display: "block", width: "12px", height: "12px", borderRadius: "50%", background: "#eaff8a", boxShadow: "0 0 14px 6px rgba(220,255,120,.6)" } }));
      const wander = () => { if (!f.isConnected || f.dataset.got) return; f.style.left = (8 + Math.random() * 84) + "%"; f.style.top = (8 + Math.random() * 78) + "%"; setTimeout(wander, 2400); };
      setTimeout(wander, 300 + i * 200);
      f.onclick = () => { if (f.dataset.got) return; f.dataset.got = 1; f.setAttribute("data-got", ""); got++; SFX.note(523 + got * 40); lab.textContent = `${got} / ${N} luciérnagas`; if (got === N) fin("Siete luces pequeñas. Juntas, iluminan un bosque entero."); };
      st.append(f);
    }
    const lab = h("p", { class: "m-note", style: { textAlign: "center" } }, `0 / ${N} luciérnagas`);
    box.append(st, lab);
  },
  care(box, m, fin) {
    const key = "care." + m.flag, saved = getData(key, null);
    const area = h("div", { style: { display: "grid", gap: "12px" } });
    const pick = id => {
      setData(key, { id, done: [] }); draw();
    };
    const draw = () => {
      const st = getData(key, null);
      if (!st) { area.replaceChildren(h("p", { class: "m-note" }, "¿A quién quieres cuidar?"), h("div", { class: "optgrid" }, m.set.map(c => h("button", { class: "opt", onclick: () => { SFX.select(); pick(c.id); } }, h("span", { style: { fontSize: "30px" } }, c.e), c.n)))); return; }
      const c = m.set.find(x => x.id === st.id), hearts = st.done.length;
      const face = h("div", { style: { fontSize: "84px", textAlign: "center", transition: "transform .3s", filter: `drop-shadow(0 0 ${hearts * 8}px rgba(255,200,150,.6))` } }, c.e);
      area.replaceChildren(
        h("div", { class: "stage", style: { aspectRatio: "16/9", display: "grid", placeItems: "center", background: "radial-gradient(circle at 50% 70%,rgba(140,220,160,.25),transparent 60%),linear-gradient(180deg,#0e2a1e,#163a28)" } }, face),
        h("p", { class: "m-note", style: { textAlign: "center" } }, `${c.n} · confianza ${"♥".repeat(hearts)}${"♡".repeat(3 - hearts)}`),
        h("div", { class: "m-row" }, m.acts.map(([e, t], i) => h("button", { class: "btn btn--sm", disabled: st.done.includes(i), onclick: () => { face.style.transform = "scale(1.15) rotate(-6deg)"; setTimeout(() => face.style.transform = "", 300); SFX.note(440 + i * 110); const nd = [...st.done, i]; setData(key, { ...st, done: nd }); if (nd.length === 3) { draw(); fin(`${c.n} ya confía en ti. Pasa con todos: es imposible no estar a gusto a tu lado.`); } else draw(); } }, e + " " + t))));
    };
    draw(); box.append(area);
    if (saved && saved.done && saved.done.length >= 3) fin();
  },
  chest(box, m, fin) {
    const c = h("div", { style: { fontSize: "92px", textAlign: "center", transition: "transform .6s", filter: "drop-shadow(0 0 20px rgba(255,217,138,.4))" } }, flag(m.flag) ? "📭" : "🧰");
    box.append(h("div", { class: "effect" }, h("div", { class: "ic" }, "🗺️"), h("div", null, h("b", null, "El bosque te guía"), h("span", null, "El holocrón y las luciérnagas señalan el rincón donde está el cofre."))), c);
    KINDS.hold(box, { ms: 2400, label: "Abrir", quote: "Dentro hay un holocrón dorado con un secreto para ti." }, () => { c.textContent = "📭"; c.style.transform = "scale(1.1)"; fin(); });
  },
  read(box, m, fin) {
    const key = "read." + m.key, seen = new Set(getData(key, []));
    const list = h("div", { style: { display: "grid", gap: "10px" } });
    const draw = () => list.replaceChildren(...m.items.map((it, i) => h("div", { class: "secret-row", style: m.key === "books" || m.key === "legends" ? { background: seen.has(i) ? "linear-gradient(180deg,#e9dcc0,#d8c5a0)" : "", color: seen.has(i) ? "#2b1f12" : "" } : {} },
      h("div", { style: { fontSize: "22px" } }, seen.has(i) ? "📖" : "📕"),
      h("div", { class: "grow" }, h("b", null, it.t), seen.has(i) ? h("span", { style: { color: "inherit", fontFamily: "var(--f-letter)", fontSize: "1.12rem", lineHeight: 1.45 } }, it.b) : h("span", null, "Sin abrir")),
      seen.has(i) ? null : h("button", { class: "btn btn--sm", onclick: () => { seen.add(i); setData(key, [...seen]); SFX.select(); draw(); if (seen.size === m.items.length) fin(); } }, "Abrir"))));
    draw(); box.append(list); if (seen.size === m.items.length) fin();
  },
  breath(box, m, fin) {
    const orb = h("div", { style: { width: "150px", height: "150px", margin: "8px auto", borderRadius: "50%", border: "2px solid var(--accent)", background: "radial-gradient(circle,var(--accent-soft),transparent 70%)", transition: "transform 4s ease-in-out", boxShadow: "0 0 30px var(--accent-glow)" } });
    const lab = h("p", { class: "m-quote" }, "Pulsa «Empezar» y respira con el círculo.");
    const b = h("button", { class: "btn btn--primary" }, "Empezar");
    b.onclick = () => {
      b.remove(); let c = 0;
      const cycle = () => {
        if (!orb.isConnected) return;
        if (c === 3) { lab.textContent = "Bien. La Fuerza también es esto: calma."; fin("Aquí no hay prisa. Todo te espera."); return; }
        lab.textContent = `Inspira… (${c + 1}/3)`; orb.style.transform = "scale(1.4)";
        setTimeout(() => { lab.textContent = "Suelta el aire despacio…"; orb.style.transform = "scale(1)"; c++; setTimeout(cycle, 4200); }, 4200);
      };
      cycle();
    };
    box.append(orb, lab, b);
  },
  rock(box, m, fin) {
    const r = h("button", { "aria-label": "Roca", style: { display: "block", margin: "0 auto", width: "180px", height: "130px", border: 0, borderRadius: "45% 55% 40% 60%", background: "radial-gradient(circle at 35% 30%,#8a96a8,#3a4454 70%)", cursor: "pointer", boxShadow: "inset -10px -14px 24px rgba(0,0,0,.5)", color: "transparent", font: "600 15px var(--f-letter)", transition: "color 1.4s" } }, "No todos los días tienen que ser fáciles. Basta con que sean nuestros.");
    let taps = 0; const lab = h("p", { class: "m-note", style: { textAlign: "center" } }, "Toca la roca para limpiar el musgo.");
    r.onclick = () => { taps++; SFX.tap(); r.style.background = `radial-gradient(circle at 35% 30%,#a8b4c4,#4a5464 70%)`; if (taps >= 3) { r.style.color = "#ffefc8"; r.style.textShadow = "0 0 8px #ffd98a"; lab.textContent = "La nota estaba grabada a mano."; fin(); } };
    box.append(r, lab);
  },
  simon(box, m, fin) {
    const cols = m.cols || ["#ff5a1f", "#ffb347", "#ff2f6a", "#ffd06b"], notes = [262, 330, 392, 523];
    const pads = h("div", { class: "pads" }); const ps = cols.map((c, i) => { const p = h("button", { class: "pad", "--c": c, "aria-label": "Piedra " + (i + 1) }); pads.append(p); return p; });
    const lab = h("p", { class: "m-note", style: { textAlign: "center" } }, "Observa el camino y repítelo. 4 rondas.");
    let seq = [], inp = [], busy = true, round = 0;
    const flash = (i, d = 380) => new Promise(r => { ps[i].setAttribute("data-lit", ""); SFX.note(notes[i]); setTimeout(() => { ps[i].removeAttribute("data-lit"); setTimeout(r, 140); }, d); });
    const play = async () => { busy = true; inp = []; lab.textContent = `Ronda ${round + 1} de 4 · mira…`; await new Promise(r => setTimeout(r, 500)); for (const i of seq) await flash(i); busy = false; lab.textContent = `Ronda ${round + 1} de 4 · tu turno`; };
    const next = () => { seq.push(Math.floor(Math.random() * 4)); play(); };
    ps.forEach((p, i) => p.onclick = async () => {
      if (busy) return; await flash(i, 200); inp.push(i);
      if (inp[inp.length - 1] !== seq[inp.length - 1]) { SFX.bad(); lab.textContent = "La piedra tembló. Vuelve a mirar."; busy = true; setTimeout(play, 900); return; }
      if (inp.length === seq.length) { round++; if (round >= 4) { busy = true; lab.textContent = m.end ? "¡Conseguido!" : "Has cruzado el río."; fin(m.end || "Paso a paso, sin miedo a la lava. Así se cruza todo."); } else setTimeout(next, 500); }
    });
    const b = h("button", { class: "btn btn--primary" }, "Empezar");
    b.onclick = () => { b.remove(); seq = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)]; play(); };
    box.append(pads, lab, b);
  },
  vents(box, m, fin) {
    let ok = 0, p = 0, dir = 1, raf;
    const meter = h("div", { style: { position: "relative", height: "34px", borderRadius: "12px", background: "linear-gradient(90deg,#3a1410,#ff5a1f 70%,#ffd06b 78%,#ff2f2f 92%)", overflow: "hidden", border: "1px solid var(--hair2)" } });
    const zone = h("div", { style: { position: "absolute", left: "72%", width: "16%", top: 0, bottom: 0, border: "2px solid #fff", borderRadius: "8px", boxShadow: "0 0 12px #fff" } });
    const needle = h("div", { style: { position: "absolute", top: "-4px", bottom: "-4px", width: "4px", background: "#fff", borderRadius: "2px", left: "0%" } });
    meter.append(zone, needle);
    const steam = h("div", { style: { fontSize: "54px", textAlign: "center", height: "70px", transition: "opacity .4s, transform .8s", opacity: .2 } }, m.icon || "♨️");
    const LAB = m.lab || "Suelta la presión cuando la aguja esté en la zona blanca.";
    const lab = h("p", { class: "m-note", style: { textAlign: "center" } }, LAB + " 0 / 3");
    const b = h("button", { class: "btn btn--primary" }, m.btn || "Liberar vapor");
    const tick = () => { if (!meter.isConnected) return; p += dir * (1.1 + ok * .35); if (p >= 100 || p <= 0) dir *= -1; needle.style.left = clamp(p, 0, 99) + "%"; raf = requestAnimationFrame(tick); };
    b.onclick = () => {
      if (p >= 70 && p <= 90) { ok++; SFX.good(); noise(.8, 3000, 300, .15); steam.style.opacity = 1; steam.style.transform = "translateY(-14px) scale(1.3)"; setTimeout(() => { steam.style.opacity = .2; steam.style.transform = ""; }, 800); }
      else { SFX.bad(); }
      lab.textContent = `${LAB} ${ok} / 3`;
      if (ok >= 3) { cancelAnimationFrame(raf); b.disabled = true; fin(m.end || "Respirar, soltar, seguir. La presión no manda: mandas tú."); }
    };
    raf = requestAnimationFrame(tick); box.append(steam, meter, lab, b);
  },
  temple(box, m, fin) {
    const door = h("div", { style: { position: "relative", height: "180px", borderRadius: "16px", overflow: "hidden", background: "linear-gradient(180deg,#2a0a0f,#120406)", border: "1px solid rgba(255,120,80,.4)" } });
    const L = h("div", { style: { position: "absolute", left: 0, top: 0, bottom: 0, width: "50%", background: "linear-gradient(90deg,#3a1a14,#4a2218)", borderRight: "1px solid #ff7a4d", transition: "transform 1.6s var(--ease)" } });
    const R = h("div", { style: { position: "absolute", right: 0, top: 0, bottom: 0, width: "50%", background: "linear-gradient(270deg,#3a1a14,#4a2218)", borderLeft: "1px solid #ff7a4d", transition: "transform 1.6s var(--ease)" } });
    door.append(h("div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--gold)", fontFamily: "var(--f-letter)", fontSize: "1.2rem", textAlign: "center", padding: "20px" } }, "«Elegir hacer las cosas bien, aunque cueste.»"), L, R);
    const saber = h("div", { class: "saber", style: { width: "0%", transition: "width .4s", margin: "0 auto" } });
    box.append(door, h("div", { style: { padding: "8px 20px" } }, saber));
    KINDS.hold(box, { ms: 2200, label: "Encender" }, () => { SFX.saber(); saber.style.width = "100%"; setTimeout(() => { L.style.transform = "translateX(-100%)"; R.style.transform = "translateX(100%)"; fin(); }, 400); });
  },
  places(box, m, fin) {
    const opts = ["Un mirador para ver atardecer", "Un pueblo de montaña", "Un mercado antiguo", "Una playa en invierno", "Un museo pequeño", "Un parque con lago", "Una ciudad nueva para los dos", "Un sitio sin nombre todavía"];
    const key = "places", sel = new Set(getData(key, []));
    const grid = h("div", { class: "optgrid" });
    const lab = h("p", { class: "m-note" });
    const draw = () => { grid.replaceChildren(...[...opts, ...[...sel].filter(x => !opts.includes(x))].map(o => h("button", { class: "opt", "aria-pressed": sel.has(o) ? "true" : "false", onclick: () => { sel.has(o) ? sel.delete(o) : sel.add(o); setData(key, [...sel]); SFX.tap(); draw(); if (sel.size >= 3) fin("Apuntado en el mapa de Alderaan. Sin fecha, pero con muchas ganas."); } }, o))); lab.textContent = `Elegidos: ${sel.size} (mínimo 3)`; };
    const inp = h("input", { class: "field", placeholder: "Añadir otro lugar…", maxlength: 60 });
    const add = h("button", { class: "btn btn--sm", onclick: () => { const v = inp.value.trim(); if (v) { sel.add(v); setData(key, [...sel]); inp.value = ""; draw(); if (sel.size >= 3) fin(); } } }, "Añadir");
    draw(); box.append(lab, grid, h("div", { style: { display: "flex", gap: "8px" } }, inp, add));
  },
  calendar(box, m, fin) {
    const now = new Date(), y = now.getFullYear(), mo = now.getMonth(), first = (new Date(y, mo, 1).getDay() + 6) % 7, dim = new Date(y, mo + 1, 0).getDate();
    const cal = h("div", { class: "cal" }, ["L", "M", "X", "J", "V", "S", "D"].map(d => h("b", null, d)));
    for (let i = 0; i < first; i++) cal.append(h("span"));
    for (let d = 1; d <= dim; d++) cal.append(h("button", { "data-21": d === 21 ? "" : null, "data-today": d === now.getDate() ? "" : null, onclick: () => { if (d === 21) fin(`Cada día 21 es una pequeña estación. Llevamos ${daysSince()} días desde el primero.`); else SFX.tap(); } }, d));
    const next21 = new Date(y, now.getDate() > 21 ? mo + 1 : mo, 21), left = Math.ceil((next21 - new Date(y, mo, now.getDate())) / 864e5);
    box.append(h("p", { class: "m-note", style: { textAlign: "center", textTransform: "capitalize" } }, now.toLocaleDateString("es-ES", { month: "long", year: "numeric" })), cal,
      h("div", { class: "counter" }, h("div", null, h("b", null, daysSince()), h("span", null, "días juntos")), h("div", null, h("b", null, left || "¡Hoy!"), h("span", null, left ? "para el próximo 21" : "es día 21")), h("div", null, h("b", null, Math.floor(daysSince() / 30.44)), h("span", null, "meses"))));
  },
  stars(box, m, fin) {
    const st = stage("", { background: "radial-gradient(circle at 50% 120%,#1a2a4a,#02040c 70%)" }); let got = 0; const N = 6;
    for (let i = 0; i < 40; i++) st.append(h("i", { style: { position: "absolute", left: Math.random() * 100 + "%", top: Math.random() * 70 + "%", width: "2px", height: "2px", background: "#fff", opacity: Math.random() * .7 } }));
    for (let i = 0; i < N; i++) {
      const s0 = h("button", { class: "it", "aria-label": "Estrella tenue", style: { left: (10 + Math.random() * 80) + "%", top: (8 + Math.random() * 60) + "%" } }, h("span", { style: { display: "block", width: "5px", height: "5px", borderRadius: "50%", background: "#cfe8ff", boxShadow: "0 0 6px #cfe8ff", animation: `breathe ${2 + Math.random() * 2}s ease-in-out infinite`, opacity: .55 } }));
      s0.onclick = () => { if (s0.dataset.g) return; s0.dataset.g = 1; s0.firstChild.style.cssText += ";width:12px;height:12px;opacity:1;box-shadow:0 0 18px 6px #bfe0ff"; got++; SFX.note(600 + got * 70); lab.textContent = `${got} / ${N} estrellas`; if (got === N) fin("Las que menos brillan también cuentan. A veces son las que más."); };
      st.append(s0);
    }
    st.append(h("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "26%", background: "linear-gradient(180deg,#cfe2f2,#f4faff)", clipPath: "polygon(0 40%,15% 10%,30% 45%,50% 0,70% 40%,85% 15%,100% 35%,100% 100%,0 100%)" } }));
    const lab = h("p", { class: "m-note", style: { textAlign: "center" } }, `0 / ${N} estrellas`);
    box.append(st, lab);
  },
  connect(box, m, fin) {
    const pts = [[50, 82], [26, 58], [22, 34], [36, 22], [50, 34], [64, 22], [78, 34], [74, 58]];
    const st = stage("", { background: "radial-gradient(circle at 50% 50%,#0e1a3a,#02040c 75%)" });
    const sv = s("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none", style: "position:absolute;inset:0;width:100%;height:100%" });
    st.append(sv); let k = 0;
    const btns = pts.map(([x, y], i) => { const b = h("button", { class: "it", "aria-label": "Estrella " + (i + 1), style: { left: x + "%", top: y + "%" } }, h("span", { style: { display: "grid", placeItems: "center", width: "22px", height: "22px", borderRadius: "50%", background: "radial-gradient(circle,#fff,#9fc8ff 40%,transparent 70%)", font: "700 9px var(--f-body)", color: "#02040c" } }, i + 1)); st.append(b); return b; });
    btns.forEach((b, i) => b.onclick = () => {
      if (i !== k % pts.length || k > pts.length) { if (i !== k) SFX.bad(); return; }
      SFX.note(523 + i * 50);
      if (k > 0) { const [x1, y1] = pts[(k - 1)], [x2, y2] = pts[i]; sv.append(s("line", { x1, y1, x2, y2, stroke: "#bfe0ff", "stroke-width": .7, "stroke-linecap": "round", style: "filter:drop-shadow(0 0 2px #7fb8ff)" })); }
      b.firstChild.style.boxShadow = "0 0 16px 4px #9fc8ff"; k++;
      if (k === pts.length) { const [x1, y1] = pts[pts.length - 1], [x2, y2] = pts[0]; sv.append(s("line", { x1, y1, x2, y2, stroke: "#ffd98a", "stroke-width": .9 })); sv.querySelectorAll("line").forEach(l => l.setAttribute("stroke", "#ffd98a")); fin("Un corazón en el cielo de Hoth. Se ve desde Tenerife y desde Valencia."); }
    });
    box.append(st, h("p", { class: "m-note", style: { textAlign: "center" } }, "Toca las estrellas del 1 al 8."));
  },
  lens(box, m, fin) {
    const st = stage("stage--lens", { background: "#02040c", touchAction: "none" }); let got = 0;
    const items = (m.items || [["🪐", 22, 30], ["🌕", 72, 24], ["🌍", 52, 72]]).map(([e, x, y]) => { const b = h("button", { class: "it", "aria-label": "Objeto lejano", style: { left: x + "%", top: y + "%", opacity: .04, fontSize: "30px" } }, e); st.append(b); return b; });
    if (flag("coruscant.lights")) st.append(h("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "14%", background: "linear-gradient(0deg,rgba(255,190,100,.35),transparent)" } }), h("div", { class: "muted", style: { position: "absolute", left: "8px", bottom: "6px", fontSize: "11px", color: "#ffd27a" } }, "Resplandor de Coruscant en el horizonte"));
    const lensEl = h("div", { style: { position: "absolute", width: "110px", height: "110px", borderRadius: "50%", border: "2px solid rgba(160,210,255,.8)", boxShadow: "0 0 0 2000px rgba(0,0,0,.55),inset 0 0 20px rgba(160,210,255,.4)", transform: "translate(-50%,-50%)", left: "50%", top: "50%", pointerEvents: "none" } });
    st.append(lensEl);
    const move = e => { const r = st.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; lensEl.style.left = x + "px"; lensEl.style.top = y + "px"; for (const b of items) { const br = b.getBoundingClientRect(), d = Math.hypot(br.left + br.width / 2 - e.clientX, br.top + br.height / 2 - e.clientY); if (!b.dataset.g) b.style.opacity = d < 55 ? 1 : .04; } };
    st.addEventListener("pointermove", move); st.addEventListener("pointerdown", move);
    items.forEach(b => b.onclick = () => { if (b.dataset.g || +b.style.opacity < .5) return; b.dataset.g = 1; b.style.opacity = 1; b.style.filter = "drop-shadow(0 0 10px #9fc8ff)"; got++; SFX.good(); lab.textContent = `${got} / 3 encontrados`; if (got === 3) fin(m.end || "Desde el observatorio todo parece cerca. Ojalá la distancia funcionara igual."); });
    const lab = h("p", { class: "m-note", style: { textAlign: "center" } }, (m.hint || "Arrastra el dedo para mover la lente.") + " 0 / 3");
    box.append(st, lab);
  },
  postcard(box, m, fin) {
    const views = [["☁️", "Nubes al atardecer", "linear-gradient(180deg,#ff9fb8,#ffd6a8)"], ["🏙️", "La ciudad flotante", "linear-gradient(180deg,#e88fb0,#6a3a7a)"], ["🌅", "Dos soles en el horizonte", "linear-gradient(180deg,#ffb36b,#c06a9a)"]];
    const phrases = ["Ojalá estuvieras aquí.", "Desde las nubes se te ve más cerca.", "Te mando un trozo de cielo.", "Guárdame un abrazo para la vuelta."];
    let v = 0, p = 0;
    const card = h("div", { class: "stage", style: { aspectRatio: "3/2", display: "grid", placeItems: "center", textAlign: "center", padding: "18px", transition: "background .4s" } });
    const draw = () => { card.style.background = views[v][2]; card.replaceChildren(h("div", null, h("div", { style: { fontSize: "46px" } }, views[v][0]), h("div", { style: { fontFamily: "var(--f-letter)", fontSize: "1.4rem", color: "#2a1030", fontWeight: 600 } }, phrases[p]), h("div", { style: { font: "600 10px var(--f-display)", letterSpacing: ".2em", color: "#4a2050", marginTop: "8px" } }, "BESPIN → TENERIFE"))); };
    const vs = h("div", { class: "m-row" }, views.map((x, i) => h("button", { class: "btn btn--sm", onclick: () => { v = i; draw(); SFX.tap(); } }, x[0] + " " + x[1])));
    const ps = h("div", { class: "m-row" }, phrases.map((x, i) => h("button", { class: "btn btn--sm btn--ghost", onclick: () => { p = i; draw(); SFX.tap(); } }, x)));
    const send = h("button", { class: "btn btn--primary", onclick: () => { setData("postcards", [...getData("postcards", []), { v: views[v][1], p: phrases[p], at: new Date().toISOString() }]); card.style.transform = "translateY(-30px) rotate(-6deg) scale(.8)"; card.style.opacity = .3; card.style.transition = "all 1s"; SFX.jump(); fin("Postal enviada. Viaja con el viento de Bespin."); } }, "Enviar postal");
    draw(); box.append(card, vs, ps, send);
  },
  balloons(box, m, fin) {
    const words = ["Agosto", "Las flores", "El 3 de octubre", "Las risas", "Tus perritos"];
    const st = stage("stage--tall", { background: "linear-gradient(180deg,#ffd1e0,#ffb8d2 40%,#e88fb0)" }); let got = 0;
    const lab = h("div", { class: "m-row" });
    const launch = i => {
      if (!st.isConnected || got >= words.length) return;
      const b = h("button", { class: "it", "aria-label": "Globo", style: { left: (12 + Math.random() * 76) + "%", top: "112%", fontSize: "38px", transition: "top 7s linear" } }, "🎈");
      st.append(b); requestAnimationFrame(() => requestAnimationFrame(() => b.style.top = "-12%"));
      b.onclick = () => { if (b.dataset.g) return; b.dataset.g = 1; b.textContent = "✨"; SFX.note(600 + got * 60); lab.append(h("span", { class: "chip chip--gold" }, words[got])); got++; setTimeout(() => b.remove(), 400); if (got === words.length) fin("Cinco recuerdos que no se pierden en las nubes."); };
      setTimeout(() => b.remove(), 7200);
      setTimeout(() => launch(i + 1), 1300);
    };
    st.append(h("div", { style: { position: "absolute", left: "50%", top: "62%", transform: "translateX(-50%)", fontSize: "56px", opacity: .9 } }, "🏙️"));
    const b = h("button", { class: "btn btn--primary", onclick: () => { b.remove(); launch(0); } }, "Soltar globos");
    box.append(st, lab, b);
  },
  pano(box, m, fin) {
    const wrap = h("div", { style: { overflowX: "auto", borderRadius: "18px", border: "1px solid var(--hair2)", scrollbarWidth: "none" } });
    const st = h("div", { style: { position: "relative", width: "300%", height: "240px", background: "linear-gradient(180deg,#ff9fb8,#ffd6a8 60%,#fff0e0)" } });
    for (let i = 0; i < 14; i++) st.append(h("div", { style: { position: "absolute", left: i * 7.4 + "%", top: (50 + Math.sin(i) * 12) + "%", width: "18%", height: "60px", borderRadius: "40px", background: "rgba(255,255,255,.65)", filter: "blur(4px)" } }));
    const marks = [["🏛️", 14, 40, "Mirador del Este"], ["🗼", 52, 30, "Torre de las nubes"], ["🎡", 86, 46, "La noria del oeste"]]; let got = 0;
    for (const [e, x, y, n] of marks) { const b = h("button", { class: "it", "aria-label": n, style: { left: x + "%", top: y + "%", fontSize: "34px" } }, e); b.onclick = () => { if (b.dataset.g) return; b.dataset.g = 1; b.append(h("div", { class: "chip chip--gold", style: { position: "absolute", top: "100%", whiteSpace: "nowrap" } }, n)); got++; SFX.good(); lab.textContent = `${got} / 3 miradores`; if (got === 3) fin("Desde aquí se ve toda la ciudad. Y en cada mirador, una excusa para pensar en ti."); }; st.append(b); }
    wrap.append(st);
    const lab = h("p", { class: "m-note", style: { textAlign: "center" } }, "Desliza la vista a los lados. 0 / 3 miradores");
    box.append(wrap, lab);
  },
  tulip(box, m, fin) {
    const steps = [["🟤", "Plantar la semilla", "🌰"], ["💧", "Regar", "🌱"], ["☀️", "Darle sol", "🌿"], ["🎶", "Cantarle", "🌷"]];
    let k = getData("tulip", 0);
    const pot = h("div", { style: { fontSize: "80px", textAlign: "center", transition: "transform .4s" } });
    const lab = h("p", { class: "m-note", style: { textAlign: "center" } });
    const b = h("button", { class: "btn btn--primary" });
    const draw = () => { pot.textContent = k ? steps[k - 1][2] : "🪴"; if (k < steps.length) { b.textContent = steps[k][0] + " " + steps[k][1]; lab.textContent = `Paso ${k + 1} de ${steps.length}`; } else { b.remove(); lab.textContent = "Ha florecido un tulipán."; } };
    b.onclick = () => { k++; setData("tulip", k); pot.style.transform = "scale(1.2)"; setTimeout(() => pot.style.transform = "", 300); SFX.note(392 + k * 80); draw(); if (k >= steps.length) fin("Un tulipán, porque sé que te encantan. Sus semillas viajarán hasta Naboo."); };
    draw(); box.append(pot, lab, b); if (k >= steps.length) fin();
  },
  plants(box, m, fin) {
    const P0 = [["🌿", "Helecho gigante"], ["🍀", "Trébol de sombra"], ["🌸", "Orquídea del tronco"], ["🍄", "Seta luminosa"], ["🎋", "Bambú"], ["🌵", "Cacto pequeño"]];
    const st = stage("stage--tall", { background: "linear-gradient(180deg,#0a2e2a,#1f6b44)" }); let got = 0;
    for (let i = 0; i < 5; i++) st.append(h("div", { style: { position: "absolute", left: (i * 22 - 4) + "%", top: 0, bottom: 0, width: "12%", background: "linear-gradient(90deg,#2a1a10,#4a2e18,#2a1a10)", opacity: .9 } }));
    const list = h("div", { class: "m-row" });
    P0.forEach(([e, n], i) => { const b = h("button", { class: "it", "aria-label": n, style: { left: (14 + (i * 37) % 76) + "%", top: (18 + i * 13) + "%", fontSize: "28px", filter: "brightness(.75)" } }, e); b.onclick = () => { if (b.dataset.g) return; b.dataset.g = 1; b.setAttribute("data-got", ""); got++; SFX.note(440 + got * 50); list.append(h("span", { class: "chip chip--ok" }, e + " " + n)); if (got === P0.length) fin("Colección completa. Cuidar algo pequeño también es una forma de querer."); }; st.append(b); });
    box.append(st, list);
  },
  cipher(box, m, fin) {
    const plain = "DESDE EL 21 DE JUNIO", A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", KEY = 7;
    const enc = (t, k) => t.replace(/[A-Z]/g, c => A[(A.indexOf(c) + k) % 26]);
    const coded = enc(plain, KEY); let shift = 0;
    const wheel = h("div", { class: "cipher-wheel" });
    A.split("").forEach((c, i) => { const a = i / 26 * Math.PI * 2; wheel.append(h("span", { style: { transform: `translate(-50%,-50%) translate(${Math.sin(a) * 92}px,${-Math.cos(a) * 92}px)` } }, c)); });
    wheel.append(h("div", { style: { position: "absolute", inset: "34%", borderRadius: "50%", border: "1px solid rgba(255,217,138,.5)", display: "grid", placeItems: "center", fontSize: "26px", color: "var(--gold)" } }, "⟁"));
    const out = h("div", { class: "cipher-out" });
    const upd = () => { const dec = enc(coded, (26 - shift) % 26); out.textContent = dec; wheel.style.transform = `rotate(${-shift / 26 * 360}deg)`; if (dec === plain) { out.style.color = "var(--gold)"; out.style.textShadow = "0 0 16px rgba(255,217,138,.6)"; fin("Desde el 21 de junio. La inscripción del templo guardaba vuestra fecha."); } };
    const row = h("div", { class: "m-row" }, h("button", { class: "btn btn--icon", "aria-label": "Girar a la izquierda", onclick: () => { shift = (shift + 25) % 26; SFX.tap(); upd(); } }, "↺"), h("div", { class: "chip chip--gold", style: { alignSelf: "center" } }, () => ""), h("button", { class: "btn btn--icon", "aria-label": "Girar a la derecha", onclick: () => { shift = (shift + 1) % 26; SFX.tap(); upd(); } }, "↻"));
    row.children[1].textContent = "Gira el disco";
    upd(); box.append(h("div", { class: "cipher" }, h("p", { class: "m-note", style: { fontFamily: "var(--f-display)", letterSpacing: ".12em", textAlign: "center" } }, "Mensaje grabado: " + coded), wheel, out, row));
  },
  pairs(box, m, fin) {
    const G = ["✦", "☾", "☀", "❦", "✧", "❂"]; const deck = [...G, ...G].sort(() => Math.random() - .5);
    const grid = h("div", { class: "memgrid" }); let open = [], ok = 0, lock = false;
    deck.forEach(g => { const b = h("button", { class: "mem", "aria-label": "Piedra grabada" }, h("span", null, g)); b.onclick = () => {
      if (lock || b.dataset.open !== undefined) return; b.dataset.open = ""; b.setAttribute("data-open", ""); open.push([b, g]); SFX.tap();
      if (open.length === 2) { lock = true; const [[b1, g1], [b2, g2]] = open; if (g1 === g2) { b1.setAttribute("data-ok", ""); b2.setAttribute("data-ok", ""); ok++; SFX.good(); open = []; lock = false; if (ok === G.length) fin("Los símbolos encajan: sol, luna, hoja, estrella… cada uno con su pareja."); } else setTimeout(() => { delete b1.dataset.open; delete b2.dataset.open; b1.removeAttribute("data-open"); b2.removeAttribute("data-open"); open = []; lock = false; }, 800); }
    }; grid.append(b); });
    box.append(grid);
  },
  beacons(box, m, fin) {
    let on = getData("beacons", 0);
    const row = h("div", { class: "m-row", style: { gap: "18px" } });
    const draw = () => row.replaceChildren(...[0, 1, 2].map(i => h("div", { style: { width: "56px", height: "90px", borderRadius: "10px 10px 4px 4px", background: i < on ? "linear-gradient(180deg,#e5c9ff,#8a5cd8)" : "#1a1040", boxShadow: i < on ? "0 0 30px #a070ff" : "none", border: "1px solid rgba(200,160,255,.4)", transition: "all .6s" } })));
    draw(); box.append(row);
    const go1 = () => KINDS.hold(box, { ms: 1600, label: `Baliza ${on + 1}` }, () => { on++; setData("beacons", on); draw(); box.querySelectorAll(".holdbtn,.m-quote").forEach(x => x.remove()); if (on >= 3) fin("Las tres balizas brillan. Ahora las señales pueden encontrar este sistema."); else go1(); });
    if (on < 3) go1(); else fin();
  },
  crystals(box, m, fin) {
    const st = stage("", { background: "radial-gradient(circle,#1a1040,#05030f 70%)" }); let got = 0; const N = 5; const cols = ["#7fd6ff", "#4dff8a", "#b06aff", "#ffb347", "#f0f6ff"];
    for (let i = 0; i < N; i++) { const b = h("button", { class: "it", "aria-label": "Cristal", style: { left: (12 + i * 19) + "%", top: (30 + Math.sin(i * 2) * 25) + "%", animation: `bob ${2 + i * .4}s ease-in-out infinite` } }, h("span", { style: { display: "block", width: "14px", height: "26px", clipPath: "polygon(50% 0,100% 40%,50% 100%,0 40%)", background: cols[i], filter: `drop-shadow(0 0 8px ${cols[i]})` } })); b.onclick = () => { if (b.dataset.g) return; b.dataset.g = 1; b.setAttribute("data-got", ""); got++; SFX.saber(); if (got === N) fin("Cinco cristales, cinco colores de sable. Todos con la misma luz."); }; st.append(b); }
    box.append(st);
  },
};
function ambienceChime() { SFX.note(523); setTimeout(() => SFX.note(659), 300); setTimeout(() => SFX.note(784), 600); }

/* ================= planet ambience ================= */
const AMBI = {
  naboo: { sky: "linear-gradient(180deg,#0b2a4a 0%,#2f7fa0 45%,#9fe3c0 80%)", parts: ["petal", "#ffd1e8", 26], scape: `<path d="M0 70 Q15 55 30 62 T60 58 T100 60 V100 H0Z" fill="#1f5a4a"/><path d="M0 80 Q25 72 50 78 T100 76 V100 H0Z" fill="#2c7f6a" opacity=".9"/><rect x="0" y="86" width="100" height="14" fill="#1a4a6a" opacity=".7"/><path d="M40 60 v-14 h3 v-6 l5 -6 l5 6 v6 h3 v14z" fill="#e8f0e0" opacity=".85"/><circle cx="48" cy="38" r="3" fill="#ffd98a" opacity=".8"/>` },
  coruscant: { sky: "linear-gradient(180deg,#05061a 0%,#2a1240 50%,#ff9a5a 100%)", parts: ["speeder", "#ffd27a", 18], scape: `<g fill="#120a24"><rect x="2" y="40" width="8" height="60"/><rect x="12" y="28" width="6" height="72"/><rect x="20" y="50" width="10" height="50"/><rect x="32" y="18" width="7" height="82"/><rect x="41" y="34" width="12" height="66"/><rect x="55" y="10" width="6" height="90"/><rect x="63" y="44" width="10" height="56"/><rect x="75" y="24" width="8" height="76"/><rect x="85" y="38" width="13" height="62"/></g><g fill="#ffcf7a" opacity=".7"><rect x="13" y="34" width="1" height="1"/><rect x="33" y="30" width="1" height="1"/><rect x="56" y="20" width="1" height="1"/><rect x="44" y="40" width="1" height="1"/><rect x="77" y="32" width="1" height="1"/><rect x="88" y="44" width="1" height="1"/><rect x="5" y="48" width="1" height="1"/><rect x="66" y="50" width="1" height="1"/></g>` },
  tatooine: { sky: "linear-gradient(180deg,#3a6aa8 0%,#f2b77a 60%,#ffe3a1 85%)", parts: ["sand", "#ffe3a1", 40], scape: `<circle cx="70" cy="30" r="6" fill="#fff4c8"/><circle cx="82" cy="36" r="4" fill="#ffc46b"/><path d="M0 70 Q20 58 40 68 T80 62 T100 66 V100 H0Z" fill="#d99a4e"/><path d="M0 82 Q30 72 60 80 T100 78 V100 H0Z" fill="#b8763c"/><path d="M18 70 a6 6 0 0 1 12 0z" fill="#e8c890"/><rect x="22" y="66" width="1.5" height="4" fill="#3a2a1a"/>` },
  endor: { sky: "linear-gradient(180deg,#05140c 0%,#10301f 50%,#2f6b33 100%)", parts: ["firefly", "#eaff8a", 30], scape: `<g fill="#0a2014"><rect x="6" y="0" width="5" height="100"/><rect x="22" y="0" width="7" height="100"/><rect x="44" y="0" width="4" height="100"/><rect x="62" y="0" width="8" height="100"/><rect x="84" y="0" width="6" height="100"/></g><path d="M0 84 Q25 76 50 82 T100 80 V100 H0Z" fill="#163c22"/><circle cx="80" cy="14" r="10" fill="#4a5d7a" opacity=".6"/>` },
  "ahch-to": { sky: "linear-gradient(180deg,#12294a 0%,#4f7fb5 55%,#b9d6ff 100%)", parts: ["mist", "#e0f0ff", 14], scape: `<path d="M10 70 L22 40 L30 52 L40 30 L52 70Z" fill="#2a3a4a"/><path d="M60 72 L72 50 L84 72Z" fill="#344a5a"/><rect x="0" y="70" width="100" height="30" fill="#1f5f9a"/><path d="M0 76 Q10 73 20 76 T40 76 T60 76 T80 76 T100 76" stroke="#bfe0ff" stroke-width=".5" fill="none" opacity=".6"/>` },
  mustafar: { sky: "linear-gradient(180deg,#120406 0%,#3a1410 50%,#b3341d 100%)", parts: ["ember", "#ff9a3d", 45], scape: `<path d="M0 60 L15 40 L25 55 L40 30 L55 58 L70 42 L85 60 L100 48 V100 H0Z" fill="#1a0808"/><path d="M0 84 Q20 78 40 84 T80 82 T100 84 V100 H0Z" fill="#ff5a1f"/><path d="M0 88 Q25 84 50 88 T100 88" stroke="#ffd06b" stroke-width="1" fill="none"/>` },
  alderaan: { sky: "linear-gradient(180deg,#1b3f66 0%,#5aa0d8 55%,#c8e6ff 100%)", parts: ["cloud", "#ffffff", 8], scape: `<path d="M0 72 L18 40 L28 52 L42 26 L56 50 L68 34 L84 56 L100 44 V100 H0Z" fill="#6a8aa8"/><path d="M38 34 L42 26 L46 34Z" fill="#fff"/><path d="M64 40 L68 34 L72 40Z" fill="#fff"/><path d="M0 84 Q30 76 60 82 T100 80 V100 H0Z" fill="#5a8a5a"/>` },
  hoth: { sky: "linear-gradient(180deg,#0a1a2a 0%,#4a6a8a 55%,#e3f4ff 100%)", parts: ["snow", "#ffffff", 70], scape: `<path d="M0 66 L16 48 L30 62 L48 40 L64 60 L80 46 L100 58 V100 H0Z" fill="#b7d4ea"/><path d="M0 80 Q30 72 60 78 T100 76 V100 H0Z" fill="#f4faff"/><path d="M70 62 a8 8 0 0 1 16 0z" fill="#dfe8f0"/>` },
  bespin: { sky: "linear-gradient(180deg,#6a3a7a 0%,#e88fb0 50%,#ffd1e0 100%)", parts: ["cloud", "#ffe8f0", 10], scape: `<ellipse cx="50" cy="62" rx="22" ry="5" fill="#f4e0e8"/><rect x="47" y="62" width="6" height="14" fill="#e8c8d8"/><path d="M38 62 v-8 h4 v-4 h4 v-6 h8 v6 h4 v4 h4 v8z" fill="#fff0f6"/><path d="M0 86 Q20 78 40 84 T80 80 T100 84 V100 H0Z" fill="#ffffff" opacity=".7"/>` },
  kashyyyk: { sky: "linear-gradient(180deg,#0a2e2a 0%,#1f6b44 60%,#7fe0a0 100%)", parts: ["leaf", "#8affc0", 22], scape: `<g fill="#3a2414"><rect x="4" y="10" width="12" height="90"/><rect x="38" y="0" width="16" height="100"/><rect x="78" y="14" width="14" height="86"/></g><g fill="#1f5a3a"><circle cx="10" cy="12" r="14"/><circle cx="46" cy="4" r="18"/><circle cx="85" cy="14" r="15"/></g><path d="M0 88 Q50 80 100 88 V100 H0Z" fill="#0e3a2a"/>` },
  dagobah: { sky: "linear-gradient(180deg,#0e1612 0%,#24342c 55%,#4a5a48 100%)", parts: ["mist", "#cfe8d8", 16], scape: `<path d="M0 40 q10 30 4 60 h10 q2 -40 -6 -60z M86 30 q-8 40 2 70 h10 q-6 -30 0 -70z" fill="#1a2418"/><path d="M60 78 a12 10 0 0 1 24 0z" fill="#3a2e22"/><circle cx="70" cy="74" r="1.5" fill="#ffcf8a"/><rect y="80" width="100" height="20" fill="#1c2a24"/><path d="M10 86 q8 -2 16 0 M50 92 q8 -2 16 0" stroke="#5a7a6a" stroke-width=".5" fill="none"/>` },
  yavin: { sky: "linear-gradient(180deg,#1a2a4a 0%,#ff9a7a 55%,#ffd9a0 100%)", parts: ["firefly", "#ffe8a0", 18], scape: `<circle cx="78" cy="22" r="16" fill="#e8a070" opacity=".6"/><path d="M0 66 Q30 58 60 64 T100 62 V100 H0Z" fill="#1d4a2a"/><path d="M38 64 v-6 h24 v6z M41 58 v-6 h18 v6z M44 52 v-6 h12 v6z M47 46 v-5 h6 v5z" fill="#6a7a5a"/><path d="M0 76 Q50 68 100 76 V100 H0Z" fill="#14361e"/>` },
};
function ambientLayer(pid) {
  const A = AMBI[pid], cv = h("canvas");
  const el = h("div", { class: "pv-amb", "aria-hidden": "true" }, h("div", { class: "sky", style: { background: A.sky } }), cv, svgHTML(`<svg class="scape" viewBox="0 0 100 100" preserveAspectRatio="none">${A.scape}</svg>`), h("div", { class: "veil" }));
  const g = cv.getContext("2d"); let W, H, dpr; const [type, col, n] = A.parts;
  const size = () => { dpr = Math.min(LITE() ? 1 : 1.5, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size(); addEventListener("resize", size);
  const ps = Array.from({ length: reduced() ? Math.ceil(n / 4) : LITE() ? Math.ceil(n / 2) : n }, () => ({ x: Math.random(), y: Math.random(), v: .3 + Math.random(), p: Math.random() * 6.3, s: .6 + Math.random() }));
  let t = 0, skip = 0;
  (function fr() {
    if (!cv.isConnected) { removeEventListener("resize", size); return; }
    if (LITE() && (++skip & 1)) { requestAnimationFrame(fr); return; }
    t += LITE() ? 2 : 1; g.clearRect(0, 0, W, H);
    for (const p of ps) {
      let x = p.x * W, y = p.y * H;
      switch (type) {
        case "snow": p.y += .0012 * p.v; p.x += Math.sin(t * .01 + p.p) * .0006; g.fillStyle = col; g.globalAlpha = .7; g.beginPath(); g.arc(x, y, 1.6 * p.s, 0, 7); g.fill(); break;
        case "ember": p.y -= .0011 * p.v; p.x += Math.sin(t * .02 + p.p) * .0008; g.fillStyle = col; g.globalAlpha = .5 + .5 * Math.sin(t * .05 + p.p); g.beginPath(); g.arc(x, y, 1.6 * p.s, 0, 7); g.fill(); break;
        case "firefly": case "spark": p.x += Math.cos(t * .01 + p.p) * .0006; p.y += Math.sin(t * .013 + p.p) * .0005; g.fillStyle = col; g.globalAlpha = .35 + .65 * Math.abs(Math.sin(t * .02 + p.p)); g.beginPath(); g.arc(x, y, 1.8 * p.s, 0, 7); g.fill(); g.globalAlpha *= .25; g.beginPath(); g.arc(x, y, 5 * p.s, 0, 7); g.fill(); break;
        case "petal": case "leaf": p.y += .0007 * p.v; p.x += Math.sin(t * .01 + p.p) * .0009; g.save(); g.translate(x, y); g.rotate(t * .01 * p.v + p.p); g.fillStyle = col; g.globalAlpha = .7; g.beginPath(); g.ellipse(0, 0, 4 * p.s, 2 * p.s, 0, 0, 7); g.fill(); g.restore(); break;
        case "sand": p.x += .0016 * p.v; p.y += Math.sin(t * .01 + p.p) * .0003; g.fillStyle = col; g.globalAlpha = .45; g.fillRect(x, y, 2 * p.s, 1); break;
        case "cloud": case "mist": p.x += .00016 * p.v; g.fillStyle = col; g.globalAlpha = type === "mist" ? .05 : .08; g.beginPath(); g.ellipse(x, y * .7, 120 * p.s, 30 * p.s, 0, 0, 7); g.fill(); break;
        case "speeder": p.x += .0018 * p.v; g.fillStyle = col; g.globalAlpha = .8; g.fillRect(x, (.2 + p.y * .5) * H, 3, 1.4); g.globalAlpha = .25; g.fillRect(x - 14, (.2 + p.y * .5) * H + .3, 14, .8); break;
      }
      if (p.y > 1.05) p.y = -.05; if (p.y < -.05) p.y = 1.05; if (p.x > 1.1) p.x = -.1; if (p.x < -.1) p.x = 1.1;
    }
    g.globalAlpha = 1;
    if (!reduced()) requestAnimationFrame(fr);
  })();
  return el;
}
