# Genera data.js a partir de cartas-57.txt (texto literal del autor, sin cambios).
import re, json, pathlib
here = pathlib.Path(__file__).parent
raw = (here / "cartas-57.txt").read_text(encoding="utf-8")
old = json.loads((here.parent.parent / "backup" / "cartas-anteriores-60.json").read_text(encoding="utf-8"))
oldP = {p["id"]: p for p in old["planetas"]}

PIDS = ["naboo", "tatooine", "coruscant", "hoth", "bespin", "endor", "dagobah", "alderaan", "kashyyyk", "ahch-to", "mustafar", "yavin"]
NAMES = {"yavin": "Yavin 4", "dagobah": "Dagobah", "ahch-to": "Ahch-To"}
DESC = {
  "dagobah": "Un pantano envuelto en niebla, con raíces gigantes y un silencio que enseña. Aquí se aprende sin prisa.",
  "yavin": "Una luna selvática con templos antiguos bajo un gigante gaseoso. Desde aquí despegó la esperanza.",
}
planets, letters = [], []
cur = None; L = None
blocks = [b.strip() for b in re.split(r"\n\s*\n", raw) if b.strip()]
for b in blocks:
    m = re.match(r"^PLANETA (\d+) — (.+)$", b)
    if m:
        pid = PIDS[int(m.group(1)) - 1]; cur = {"id": pid, "name": NAMES.get(pid, m.group(2).title()), "tagline": None,
              "description": DESC.get(pid) or oldP.get(pid, {}).get("description", "")}
        planets.append(cur); L = None; continue
    if cur and cur["tagline"] is None:
        cur["tagline"] = b; continue
    m = re.match(r"^Carta (\d+) — (.+)$", b)
    if m:
        L = {"n": int(m.group(1)), "title": m.group(2), "planet": cur["id"], "body": []}; letters.append(L); continue
    L["body"].append(b)
assert len(planets) == 12 and len(letters) == 57, (len(planets), len(letters))
assert [l["n"] for l in letters] == list(range(1, 58))

# presentation: holocron / archive / holo transmission
HOLOCRON = {26, 44, 57}
ARCHIVE = {11, 12, 13, 14, 29, 31, 42, 45}
CATS = {"naboo": "recuerdos", "tatooine": "distancia", "coruscant": "admiracion", "hoth": "momentos", "bespin": "momentos", "endor": "recuerdos",
        "dagobah": "fe-valores", "alderaan": "admiracion", "kashyyyk": "fe-valores", "ahch-to": "admiracion", "mustafar": "fe-valores", "yavin": "suenos"}
# missions per planet (order matters) -> must match missions.js
MF = {
  "naboo": ["naboo.garden", "naboo.fountain", "naboo.bench"],
  "tatooine": ["tatooine.trips3", "tatooine.suns", "tatooine.beacon"],
  "coruscant": ["coruscant.lights", "coruscant.daynight", "coruscant.inbox", "coruscant.diary"],
  "hoth": ["hoth.stars", "hoth.constellation", "hoth.planets"],
  "bespin": ["bespin.postcard", "bespin.balloons", "bespin.landmarks"],
  "endor": ["endor.holocron", "endor.fireflies", "endor.creature", "endor.chest"],
  "dagobah": ["dagobah.lift", "dagobah.cave", "dagobah.stones"],
  "alderaan": ["alderaan.places", "alderaan.capsule", "alderaan.calendar"],
  "kashyyyk": ["kashyyyk.tulip", "kashyyyk.creatures", "kashyyyk.plants"],
  "ahch-to": ["ahch-to.books", "ahch-to.calm", "ahch-to.note"],
  "mustafar": ["mustafar.sequence", "mustafar.vents", "mustafar.temple"],
  "yavin": ["yavin.cipher", "yavin.symbols", "yavin.xwing"],
}
flag = lambda f: {"type": "flag", "flag": f}
allm = lambda pid: {"type": "all", "of": [flag(f) for f in MF[pid]]}
for pid in PIDS:
    ls = [l for l in letters if l["planet"] == pid]; ms = MF[pid]
    for i, l in enumerate(ls):
        if i == 0: l["unlock"] = {"type": "planet-visited", "planet": pid}
        elif i <= len(ms): l["unlock"] = flag(ms[i - 1])
        else: l["unlock"] = allm(pid)
OVR = {
  26: flag("endor.chest"), 27: flag("endor.fireflies"), 28: flag("endor.creature"),
  54: {"type": "any", "of": [{"type": "day-of-month", "day": 21}, allm("yavin")]},
  55: allm("yavin"),
  56: {"type": "planets-visited", "min": 12},
  57: {"type": "read-count", "min": 56},
}
for l in letters:
    if l["n"] in OVR: l["unlock"] = OVR[l["n"]]

out = []
for l in letters:
    n = l["n"]
    out.append({"id": f"c{n:02d}", "n": n, "title": l["title"], "planet": l["planet"],
                "category": "secreta" if n in HOLOCRON else CATS[l["planet"]], "kind": "holocron" if n in HOLOCRON else "archive" if n in ARCHIVE else "holo",
                "language": "es", "transmission": f"Carta {n} · {next(p['name'] for p in planets if p['id']==l['planet'])}", "unlock": l["unlock"], "body": l["body"]})

eff = []
for e in old["efectos"]:
    req = [f for f in e["requires"]]
    if any(f.split(".")[0] not in PIDS for f in req): continue
    e = json.loads(json.dumps(e))
    if e["effect"]["planet"] == "desconocido": e["effect"]["planet"] = "yavin"
    if e["effect"]["planet"] not in PIDS: continue
    eff.append(e)

prev = (here.parent / "data.js").read_text(encoding="utf-8")
prevD = json.loads(prev[len("const DATA="):].rstrip().rstrip(";"))
prevD.update({"planets": planets, "letters": out, "effects": eff})
(here.parent / "data.js").write_text("const DATA=" + json.dumps(prevD, ensure_ascii=False) + ";\n", encoding="utf-8")
print(len(planets), len(out), len(eff), [ (p["id"], len([l for l in out if l["planet"]==p["id"]])) for p in planets])
