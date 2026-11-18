// Cifra o descifra un archivo con la contraseña (AES-GCM + PBKDF2).
// Cifrar:    node src/cartas/archivo.mjs cifrar   ruta/archivo  AyY   -> ruta/archivo.cifrado
// Descifrar: node src/cartas/archivo.mjs descifrar ruta/archivo.cifrado AyY -> ruta/archivo
import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto as C } from "node:crypto";
const [mode, file, pass] = process.argv.slice(2), ITER = 150000;
const key = async salt => C.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" }, await C.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveKey"]), { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
if (mode === "cifrar") {
  const salt = C.getRandomValues(new Uint8Array(16)), iv = C.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await C.subtle.encrypt({ name: "AES-GCM", iv }, await key(salt), readFileSync(file)));
  writeFileSync(file + ".cifrado", Buffer.concat([Buffer.from("GALAXIA1"), salt, iv, ct]));
  console.log("cifrado:", file + ".cifrado");
} else {
  const b = readFileSync(file), salt = b.subarray(8, 24), iv = b.subarray(24, 36), ct = b.subarray(36);
  const pt = await C.subtle.decrypt({ name: "AES-GCM", iv }, await key(salt), ct).catch(() => { console.error("Contraseña incorrecta"); process.exit(1); });
  writeFileSync(file.replace(/\.cifrado$/, ""), Buffer.from(pt)); console.log("descifrado:", file.replace(/\.cifrado$/, ""));
}
