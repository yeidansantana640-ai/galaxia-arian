# La galaxia de Arián

Una galaxia inspirada en Star Wars: mapa galáctico interactivo, 12 planetas con misiones y 60 cartas.

- `index.html`: la web publicada (un solo archivo).
- `src/`: código fuente. Para regenerar `index.html`, ejecuta `sh src/build.sh`.

## Cartas

- `src/cartas/cartas-57.txt`: el texto original de las 57 cartas, tal cual lo escribió el autor.
- `src/cartas/build_data.py`: convierte ese texto en `src/data.js` (sin modificar ninguna palabra).
- `backup/`: copia de seguridad de las 60 cartas y los planetas anteriores.
