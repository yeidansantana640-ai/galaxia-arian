/* ================= ENCICLOPEDIA GALÁCTICA ================= */
const RACE = {
  nadador: ["1,9 m", "Una lengua de burbujas y muchas onomatopeyas", "Alegres, algo torpes y muy leales", "Agitan las orejas", "Pueden aguantar la respiración casi una hora bajo el lago."],
  chatarrero: ["1 m", "Un idioma rapidísimo lleno de «utini»", "Regateadores y curiosos", "Te enseñan lo último que han encontrado", "Nadie les ha visto nunca la cara. Dicen que es por timidez."],
  cabezacola: ["1,7 m", "Básico galáctico y un idioma secreto hecho con las colas de la cabeza", "Elegantes, sociables y grandes bailarines", "Mueven las colas de la cabeza", "Por la postura de sus colas se sabe si están contentos, tristes o enamorados."],
  yeti: ["3 m", "Gruñidos suaves y rugidos graves", "Tímidos y tranquilos (estos, al menos)", "Te regalan una bola de nieve", "Su pelo es tan espeso que duermen sobre el hielo sin notar el frío."],
  porcino: ["1,2 m", "Gruñidos y silbidos de máquina", "Trabajadores incansables", "Te prestan una herramienta para que ayudes", "Llevan generaciones manteniendo en el aire la Ciudad de las Nubes."],
  peludito: ["1 m", "Una lengua alegre llena de «yub»", "Valientes, curiosos y muy fiesteros", "Te ofrecen bayas", "Construyen aldeas enteras en las copas de los árboles, unidas por puentes."],
  sabio: ["0,7 m", "Básico galáctico… con las palabras un poco al revés", "Pacientes, sabios y algo bromistas", "Una pequeña reverencia con el bastón", "Viven muchísimos años. Por eso nunca tienen prisa."],
  cumbres: ["1,7 m", "Básico galáctico con acento de montaña", "Pacíficos, cultos y amantes del arte", "Una inclinación con la mano en el corazón", "En su planeta no había armas: preferían la música, los jardines y las bibliotecas."],
  "peludo-alto": ["2,3 m", "Rugidos que solo entienden los buenos amigos", "Leales hasta el final", "Un abrazo muy, muy fuerte", "Pueden vivir varios siglos y nunca olvidan un favor."],
  guardiana: ["1,4 m", "Un idioma suave parecido al canto de las gaviotas", "Trabajadoras, ordenadas y un poco gruñonas", "Te dan un trapo para ayudar a limpiar", "Llevan miles de años cuidando las cabañas de piedra de la isla."],
  "mineros-fuego": ["1,8 m", "Zumbidos y chasquidos", "Resistentes y muy unidos", "Chocan las antenas", "Montan criaturas que nadan por la lava sin quemarse."],
  constructores: ["2,2 m", "Una lengua antigua grabada en la piedra de los templos", "Misteriosos y sabios", "Dibujan un símbolo en el aire", "Construyeron los templos de la selva. Nadie sabe cuántos años tienen."],
};
const WORLD_INFO = {
  naboo: ["Templado y suave", "Lagos, praderas y ciudades de cúpulas", "1 sol · 3 lunas", "Bajo sus lagos hay ciudades enteras dentro de burbujas."],
  tatooine: ["Árido y caluroso", "Dunas y cañones de roca", "2 soles · 3 lunas", "Con dos soles, sus atardeceres duran el doble de bonitos."],
  coruscant: ["Controlado por la ciudad", "Una sola ciudad que cubre todo el planeta", "1 sol · 4 lunas", "Nunca es de noche del todo: siempre hay millones de luces encendidas."],
  hoth: ["Helado", "Glaciares, cuevas de hielo y tormentas de nieve", "1 sol · 3 lunas", "Su cielo es tan limpio que se ven las tres lunas a la vez."],
  bespin: ["Ventoso, entre nubes", "Un gigante de gas sin suelo firme", "1 sol · muchas lunas", "La ciudad flota sobre las nubes y nunca toca el suelo."],
  endor: ["Templado y húmedo", "Bosques de árboles gigantes", "Luna de un gigante gaseoso", "Es una luna verde que gira alrededor de un planeta enorme."],
  dagobah: ["Húmedo y brumoso", "Pantanos, raíces y cuevas", "1 sol", "La niebla casi nunca se levanta. Un buen sitio para pensar."],
  alderaan: ["Templado de montaña", "Cumbres nevadas, prados y lagos", "1 sol · 1 luna", "Era famoso por sus universidades, sus jardines y su paz."],
  kashyyyk: ["Cálido y selvático", "Árboles de varios kilómetros de altura", "1 sol · 3 lunas", "Las ciudades se construyen dentro de los árboles, no en el suelo."],
  "ahch-to": ["Oceánico y ventoso", "Mar inmenso e islas de roca", "1 sol · 1 luna", "En una de sus islas estaba el primer templo de los Jedi."],
  mustafar: ["Volcánico", "Ríos de lava y montañas de ceniza", "1 sol", "Su cielo siempre está rojo por el brillo de la lava."],
  yavin: ["Tropical", "Selva espesa y templos antiguos", "Luna de un gigante gaseoso", "Desde su base despegó la esperanza de toda la galaxia."],
};
let encTab = "planetas";
const ENC_TABS = [["planetas", "🪐 Planetas"], ["razas", "👽 Razas"], ["droides", "🤖 Droides"], ["fauna", "🦎 Fauna"], ["porgs", "🐧 Porgs"]];
function encCounts() {
  const ff = faunaFound(), by = c => FA.ALL.filter(x => x.cat === c);
  return { planetas: [ORDER.filter(p => S.visited[p]).length, 12], razas: [by("raza").filter(x => ff.includes(x.id)).length, by("raza").length], droides: [by("droide").filter(x => ff.includes(x.id)).length, by("droide").length], fauna: [by("fauna").filter(x => ff.includes(x.id)).length, by("fauna").length], porgs: [porgsFound().length, 12] };
}
function viewEnciclo(params) {
  if (params && params.tab) encTab = params.tab;
  const C = encCounts(), tot = Object.values(C).reduce((a, [n, t]) => [a[0] + n, a[1] + t], [0, 0]);
  const tabs = h("div", { class: "admin-tabs enc-tabs" }, ENC_TABS.map(([k, t]) => h("button", { "aria-pressed": encTab === k ? "true" : "false", onclick: () => { encTab = k; SFX.tap(); render(); } }, `${t} ${C[k][0]}/${C[k][1]}`)));
  const ff = faunaFound(); let cards;
  if (encTab === "planetas") cards = ORDER.map((pid, i) => { const ok = !!S.visited[pid]; return encCard(ok, planetEl(pid, 70, { revealed: true }), `${i + 1}. ${P[pid].name}`, ok ? WORLD_INFO[pid][1] : "Visita el planeta para abrir su ficha", () => encPlanet(pid)); });
  else if (encTab === "porgs") cards = ORDER.map(pid => { const ok = porgsFound().includes(pid); return encCard(ok, porgEl(70, pid), ok ? PORG[pid].n : "Porg sin descubrir", P[pid].name, () => porgCard(pid)); });
  else { const cat = { razas: "raza", droides: "droide", fauna: "fauna" }[encTab]; cards = FA.ALL.filter(x => x.cat === cat).map(x => { const ok = ff.includes(x.id); return encCard(ok, FA.svg(x, 76), ok ? x.n : "Sin descubrir", P[x.pid].name, () => cat === "raza" ? encRace(x) : faunaCard(x)); }); }
  return page("Enciclopedia Galáctica", ["Archivos de la República", "Todo lo que se sabe de los mundos, pueblos, droides y criaturas de esta galaxia. Cada entrada se abre cuando la descubres."],
    h("div", { class: "summary holo" }, h("div", { class: "ring", style: { "--p": Math.round(tot[0] / tot[1] * 100) } }, h("span", null, Math.round(tot[0] / tot[1] * 100) + "%")), h("div", { class: "grow" }, h("b", null, `${tot[0]} de ${tot[1]} entradas descubiertas`), h("span", null, "Explora los planetas y toca a sus habitantes para completarla."))),
    tabs, h("div", { class: "enc-grid" }, cards));
}
function encCard(ok, art, title, sub, onclick) {
  return h("button", { class: "enc-card" + (ok ? "" : " locked"), onclick: () => { SFX.tap(); onclick(); } }, h("div", { class: "enc-art" }, art), h("b", null, title), h("small", null, sub));
}
const encRows = rows => h("dl", { class: "enc-dl" }, rows.map(([k, v]) => [h("dt", null, k), h("dd", null, v)]));
function encRace(x) {
  const ok = faunaFound().includes(x.id), R = RACE[x.id] || [];
  modal(h("div", null, h("div", { class: "eyebrow" }, `Enciclopedia · Razas · ${P[x.pid].name}`), h("h2", null, ok ? x.n : "Raza sin descubrir")), [
    h("div", { class: "porg-stage" + (ok ? "" : " locked") }, h("div", { class: "fauna fauna--show" }, FA.svg(x, 160))),
    ok ? h("p", { class: "m-quote", style: { fontSize: "1.2rem" } }, x.d) : h("p", { class: "m-note", style: { textAlign: "center" } }, `Viven en ${P[x.pid].name}. Visita el planeta y toca al habitante que pasea por su portada.`),
    ok ? encRows([["Planeta", P[x.pid].name], ["Altura media", R[0]], ["Idioma", R[1]], ["Carácter", R[2]], ["Cómo saludan", R[3]], ["Dato curioso", R[4]]]) : null,
    ok ? h("p", { class: "bubble" }, "«" + x.say[0] + "»") : null,
    h("div", { class: "m-row" }, ok ? h("button", { class: "btn btn--sm", onclick: () => faunaSound(x) }, "🔊 Escuchar") : null, h("button", { class: "btn btn--sm btn--primary", onclick: () => { closeModals(); go("planet", { id: x.pid }); } }, `Ir a ${P[x.pid].name}`)),
  ], null, "📖");
}
function encPlanet(pid) {
  const ok = !!S.visited[pid], W = WORLD_INFO[pid], un = unlockedSet(), ls = lettersOf(pid), got = ls.filter(l => un.has(l.id)).length;
  const who = FA.L[pid] || [], ff = faunaFound();
  modal(h("div", null, h("div", { class: "eyebrow" }, `Enciclopedia · Planeta ${ORDER.indexOf(pid) + 1} de 12`), h("h2", null, P[pid].name)), [
    h("div", { class: "enc-planet" }, planetEl(pid, 150, { revealed: true, hi: true })),
    h("p", { class: "m-quote", style: { fontSize: "1.2rem" } }, P[pid].tagline),
    ok ? encRows([["Región", LAYOUT[pid].region], ["Sector", LAYOUT[pid].sector], ["Clima", W[0]], ["Terreno", W[1]], ["Cielo", W[2]], ["Dato curioso", W[3]], ["Cartas", `${got} de ${ls.length} encontradas`]]) : h("p", { class: "m-note", style: { textAlign: "center" } }, "Visita el planeta para completar su ficha."),
    h("div", { class: "section-t" }, "Quién vive aquí"),
    h("div", { class: "enc-who" }, [...who.map(x => { const f = ff.includes(x.id); return h("button", { class: "pd" + (f ? " f" : ""), onclick: () => { closeModals(); x.cat === "raza" ? encRace(x) : faunaCard(x); } }, FA.svg(x, 44), h("small", null, f ? x.n : "¿?")); }),
      h("button", { class: "pd" + (porgsFound().includes(pid) ? " f" : ""), onclick: () => { closeModals(); porgCard(pid); } }, porgEl(44, pid), h("small", null, porgsFound().includes(pid) ? PORG[pid].n : "¿?"))]),
    h("div", { class: "m-row" }, h("button", { class: "btn btn--sm btn--primary", onclick: () => { closeModals(); SFX.jump(); hyperspace(() => go("planet", { id: pid })); } }, `🚀 Viajar a ${P[pid].name}`)),
  ], null, "📖");
}
