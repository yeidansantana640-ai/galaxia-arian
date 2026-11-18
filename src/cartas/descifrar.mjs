// Recupera el texto de las cartas (para poder editarlas) a partir de src/data.enc.js.
// Uso:  node src/cartas/descifrar.mjs AyY      -> escribe src/data.js (no se sube a GitHub)
import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto as C } from "node:crypto";
const dir = new URL("..", import.meta.url).pathname, pass = process.argv[2];
const grab = (f, name) => { const s = readFileSync(dir + f, "utf8"); return JSON.parse(s.slice(s.indexOf("=") + 1).trim().replace(/;$/, "")); };
const ENC = grab("data.enc.js"), DATA = grab("data.public.js");
const u = s => Uint8Array.from(Buffer.from(s, "base64")), enc = new TextEncoder();
let K;
for (const w of ENC.wraps) try {
  const base = await C.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
  const wk = await C.subtle.deriveKey({ name: "PBKDF2", salt: u(w.salt), iterations: ENC.iter, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  K = new Uint8Array(await C.subtle.decrypt({ name: "AES-GCM", iv: u(w.iv) }, wk, u(w.w))); break;
} catch (e) { }
if (!K) { console.error("Contraseña incorrecta"); process.exit(1); }
const kKey = await C.subtle.importKey("raw", K, "AES-GCM", false, ["decrypt"]);
const bodies = JSON.parse(new TextDecoder().decode(await C.subtle.decrypt({ name: "AES-GCM", iv: u(ENC.iv) }, kKey, u(ENC.ct))));
DATA.letters.forEach(l => { l.title = bodies[l.id].t; l.body = bodies[l.id].b; });
writeFileSync(dir + "data.js", "const DATA=" + JSON.stringify(DATA) + ";\n");
console.log("descifradas", DATA.letters.length, "cartas en src/data.js");
