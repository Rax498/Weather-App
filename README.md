# Weather App

A simple weather dashboard built with plain HTML, CSS and JavaScript — no frameworks, no packages.

**Live:** https://rax498.github.io/Weather-App/

## Features

- Current weather, air conditions and a 7-day forecast for any city
- Two themes with a one-click switcher:
  - **Neobrutalism** (default) — flat colors, thick borders, hard shadows
  - **Glassmorphism** — frosted glass cards with a gradient or photo background toggle
- Theme and background choices are remembered between visits

## Run locally

No build step. Just open `index.html` in a browser, or serve the folder (e.g. VS Code Live Server).

## Tweak the themes

Each theme is one self-contained file in `themes/`. All colors, borders, shadows and fonts are CSS variables in the `:root` block at the top of each file.

## APIs

- [Open-Meteo](https://open-meteo.com/) — weather data (no API key needed)
- [Photon](https://photon.komoot.io/) — city name to coordinates
