# La galaxia de Arián

Una galaxia inspirada en Star Wars: mapa galáctico interactivo, 12 planetas con misiones y 60 cartas.

- `index.html`: la web publicada (un solo archivo).
- `src/`: código fuente. Para regenerar `index.html`, ejecuta `sh src/build.sh`.

## Cartas (cifradas)

El texto y los títulos de las cartas están cifrados con AES-GCM. Solo se abren con la contraseña de entrada o con el código de administrador.

- `src/data.enc.js`: las cartas cifradas. `src/data.public.js`: el resto de datos, sin texto.
- Para editar las cartas: `node src/cartas/descifrar.mjs <contraseña>` crea `src/data.js` (no se sube). Después `node src/cartas/cifrar.mjs` y `sh src/build.sh`.
- `src/cartas/cartas-57.txt.cifrado` y `backup/*.cifrado`: el texto original y la copia de las 60 cartas anteriores, cifrados. Se recuperan con `node src/cartas/archivo.mjs descifrar <archivo> <contraseña>`.
