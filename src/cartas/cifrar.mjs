// Cifra el texto de las cartas con AES-GCM. La clave de datos se guarda envuelta
// con la contraseña de Arián, la de Yeidan (YyA) y el código de administrador (PBKDF2-SHA256).
// Uso:  node src/cartas/cifrar.mjs          (lee src/data.js -> escribe src/data.public.js y src/data.enc.js)
import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto as C } from "node:crypto";
const dir = new URL("..", import.meta.url).pathname;
const src = readFileSync(dir + "data.js", "utf8");
const DATA = JSON.parse(src.slice(src.indexOf("=") + 1).trim().replace(/;$/, ""));
const PASSWORDS = ["AyY", "Yeidan21", "YyA"], ITER = 150000;
const b64 = u => Buffer.from(u).toString("base64");
const rnd = n => C.getRandomValues(new Uint8Array(n));
const enc = new TextEncoder();
const bodies = Object.fromEntries(DATA.letters.map(l => [l.id, { t: l.title, b: l.body }]));
const K = rnd(32), kKey = await C.subtle.importKey("raw", K, "AES-GCM", false, ["encrypt"]);
const iv = rnd(12), ct = new Uint8Array(await C.subtle.encrypt({ name: "AES-GCM", iv }, kKey, enc.encode(JSON.stringify(bodies))));
const wraps = [];
for (const p of PASSWORDS) {
  const salt = rnd(16), base = await C.subtle.importKey("raw", enc.encode(p), "PBKDF2", false, ["deriveKey"]);
  const wk = await C.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
  const wiv = rnd(12), w = new Uint8Array(await C.subtle.encrypt({ name: "AES-GCM", iv: wiv }, wk, K));
  wraps.push({ salt: b64(salt), iv: b64(wiv), w: b64(w) });
}
const pub = { ...DATA, letters: DATA.letters.map(l => ({ ...l, title: "", body: [] })) };
writeFileSync(dir + "data.public.js", "const DATA=" + JSON.stringify(pub) + ";\n");
writeFileSync(dir + "data.enc.js", "const ENC=" + JSON.stringify({ v: 1, iter: ITER, iv: b64(iv), ct: b64(ct), wraps }) + ";\n");
console.log("cifradas", DATA.letters.length, "cartas ·", ct.length, "bytes");
