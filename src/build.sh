#!/bin/sh
cd "$(dirname "$0")"
{
cat <<'H'
<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Galaxia de Arián</title>
<meta name="theme-color" content="#03040a">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/svg+xml" href="icons/icon.svg"><link rel="icon" type="image/png" sizes="48x48" href="icons/favicon-48.png">
<link rel="apple-touch-icon" sizes="180x180" href="icons/icon-180.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Galaxia">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&display=swap">
<style>
H
cat styles.css
echo '</style></head><body><script>'
cat data.public.js data.enc.js data2.js core.js i18n.data.js i18n.js missions.js map.js droid.js guide.js sync.js scenes.js fauna.js enciclo.js views.js
echo '</script></body></html>'
} > ../index.html
