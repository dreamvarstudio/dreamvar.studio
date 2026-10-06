# dreamvar.studio

Sitio oficial de **DreamVar Studio**, estudio independiente de videojuegos.

Por ahora el sitio presenta el primer juego del estudio, *Duermevela: Rem y el Mar de Sueños*
(metroidvania 2D): demo en el Steam Next Fest de febrero de 2027 (tentativo) y juego completo a mediados
de 2027. Cuando haya más juegos, cada uno podrá tener su propia sección o página.

Hecho con [Astro](https://astro.build) (sitio estático) y publicado en Vercel.

## Comandos

```bash
npm install        # la primera vez
npm run dev        # servidor local en http://localhost:4321 (se recarga al guardar)
npm run build      # genera el sitio en dist/
npm run preview    # sirve dist/ para revisar el build final
```

Para verlo en el celular (misma red Wi-Fi): `npm run dev -- --host` y abrir la dirección "Network" que imprime.

Astro 7 deja el servidor de desarrollo corriendo en segundo plano: `npx astro dev status` para verlo,
`npx astro dev stop` para apagarlo y `npx astro dev logs` para ver sus mensajes.

## Estructura

```
src/
  data/site.ts            Fechas, enlaces de redes y Steam, correo. Lo que más se edita.
  content/devlog/*.md     Entradas del devlog (una por archivo)
  content.config.ts       Campos de cada entrada del devlog
  pages/index.astro       La landing (arma las secciones)
  pages/devlog/[id].astro Página de cada entrada del devlog
  layouts/Base.astro      <head>, metadatos para redes, header y footer
  components/             Una sección por archivo: Hero, Prologue, Game, Zones, Studio, Devlog, Footer…
  styles/global.css       Paleta, tipografías y piezas compartidas (botones, notas de papel)
  assets/                 Imágenes fuente; Astro las convierte a WebP en varios tamaños al compilar
public/
  fonts/                  Tipografías y sus licencias OFL
  video/                  Prólogo animado (webm + mp4 para Safari)
  img/                    Favicon, íconos, imagen para redes (og.jpg), póster del video
design/                   Diseño original y logos fuente (no se publica)
```

## Tareas comunes

### Cambiar fechas o desbloquear Steam, YouTube o Discord

Todo está en `src/data/site.ts`. Los botones bloqueados son los que tienen `null`; al poner el enlace se
desbloquean solos en todo el sitio (menú, portada y pie):

```ts
steam: 'https://store.steampowered.com/app/XXXXXX/',
```

En `socials` puedes poner el usuario que se muestra junto a cada red (`handle`).

### Escribir en el devlog

Crea un archivo en `src/content/devlog/`, por ejemplo `demo-next-fest.md`. El nombre del archivo es la
dirección de la página (`/devlog/demo-next-fest`).

```md
---
title: La demo llega al Next Fest
date: 2027-01-15
tag: Anuncio
summary: Una frase que aparece en la lista y al compartir el enlace.
---

Texto en Markdown. **Negritas**, *cursivas*, listas y subtítulos con `##`.
```

Con `draft: true` en la cabecera la entrada no se publica. La portada muestra las 4 más recientes.

### Cambiar o agregar capturas de zonas

Pon el PNG en `src/assets/shots/` y agrégalo a la lista `zones` de `src/components/Zones.astro`
(importación + nombre + lema). Astro se encarga de convertirlo y de generar los tamaños.

### Reemplazar el video del prólogo

```bash
ffmpeg -i entrada.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 37 public/video/prologo.webm
ffmpeg -i entrada.mp4 -an -c:v libx264 -crf 25 -pix_fmt yuv420p -movflags +faststart public/video/prologo.mp4
```

El marco usa la proporción del video actual (1440×646, sin franjas negras). Si el nuevo tiene otra, cambia
`aspect-ratio` en `src/components/Prologue.astro`, y el póster en `public/img/avance-poster.webp`.

## Publicar en Vercel

**Con GitHub (recomendado):** sube el repo e impórtalo en vercel.com → Add New → Project. Vercel detecta
Astro solo (comando `astro build`, carpeta `dist`). Cada push a `main` se publica; cada rama tiene su
vista previa.

**Desde la terminal:**

```bash
npx vercel          # inicia sesión y crea el proyecto (vista previa)
npx vercel --prod   # publica a producción
```

El dominio `dreamvar.studio` se conecta en Vercel → Settings → Domains.

## Diseño

La página es un descenso: empieza en la noche del cuarto de Nico y se oscurece hasta el fondo del mar
de sueños.

- **Paleta:** azules nocturnos y tinta, papel para las notas (como el HUD del juego), luz cálida de
  lámpara para lo que se puede tocar. El violeta es solo de Rem.
- **Tipografías:** Patrick Hand (la misma del juego) para títulos y notas; Alegreya para el texto;
  Alegreya SC para etiquetas pequeñas. Las tres tienen licencia **SIL Open Font License**: son gratuitas,
  también para uso comercial, y se sirven desde el propio sitio (sin Google Fonts). Las licencias están en
  `public/fonts/`.
- **Responsive:** probado de 360 px a 1920 px. Debajo de 900 px el menú pasa a hamburguesa; debajo de
  700 px la portada se reorganiza con Rem arriba y el texto abajo.
- Respeta "reducir movimiento" del sistema: se apagan animaciones, motas de bruma y el video en bucle.
