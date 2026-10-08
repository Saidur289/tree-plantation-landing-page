# Verdant — Tree Plantation Landing Page

A plant-shop landing page with a motion-design concept: sage studio photography, split-text headline reveals, scroll-driven parallax, spring-physics hover on plants, and a dotted path that draws itself as you scroll.

## Pages

| Page | Description |
|---|---|
| `animated.html` | The main site — layered hero photo, glowing carousel card, orbiting thumbnails, "Art of Placement" panel, GSAP + ScrollTrigger animations |
| `index.html` | The original static version (Tailwind CSS) |

## Run locally

```bash
npm install
npm start
```

Then open <http://localhost:8080/> (serves `animated.html`) or <http://localhost:8080/index.html>.

`npm start` runs a tiny dependency-free static server (`serve.js`). Any static server works too.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Serve the project on port 8080 |
| `npm run compare` | Render `animated.html` beside `design/mockup.jpg` → `compare.png` |
| `npm run responsive` | Screenshot ten device sizes (320px phone → 4K) into `screenshots/responsive/` and report horizontal overflow |
| `node screenshot.js` / `node screenshot-animated.js` | Full-page screenshots (needs `npm start` running) |

The capture scripts use [Puppeteer](https://pptr.dev/).

## Features

- Fully responsive: phones (portrait and landscape), tablets, laptops, and wide screens
- Respects `prefers-reduced-motion`; content stays visible if the animation library fails to load
- Touch-friendly navigation (tap-to-open dropdowns, slide-out menu with Escape to close)
- Fonts: Arial (system font, no web-font download)

## Tech

- HTML + CSS (container query units for scalable scenes)
- [GSAP 3](https://gsap.com/) with ScrollTrigger for animation
- Tailwind CSS (CDN) on `index.html`

## Credits

- `images/hero-studio.webp` (hero and placement panel) and `design/mockup.jpg`: supplied for this project
- Other plant photography from [Unsplash](https://unsplash.com/); the cutouts in `images/cutouts/` were made from Unsplash photos
