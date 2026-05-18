# Particle Sphere

An interactive 3D particle sphere built with Three.js and Vite. Features planet morphology, mouse repulsion, organic sway, and smooth colour transitions.

## Getting Started

### Prerequisites
- Node.js (v18+)
- A terminal (VSCode's built-in terminal works great)

### Install & Run

```bash
# 1. Clone or download this repo
git clone https://github.com/YOUR_USERNAME/particle-sphere.git
cd particle-sphere

# 2. Install dependencies
npm install

# 3. Start the dev server (hot-reload included)
npm run dev
```

Then open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

Output goes to `dist/`. You can preview it locally with:

```bash
npm run preview
```

---

## Deploying to GitHub Pages

### Option A — Manual (simplest)

1. Run `npm run build`
2. Push the `dist/` folder contents to the `gh-pages` branch
3. In your repo: **Settings → Pages → Source → Deploy from branch → gh-pages / root**

### Option B — Automated with gh-pages package (recommended)

```bash
npm install --save-dev gh-pages
```

Add this to `package.json` scripts:
```json
"deploy": "npm run build && gh-pages -d dist"
```

Then deploy anytime with:
```bash
npm run deploy
```

> **Note:** If your repo is at `github.com/you/particle-sphere` (not `you.github.io`),
> open `vite.config.js` and change `base: '/'` to `base: '/particle-sphere/'`

---

## Project Structure

```
particle-sphere/
├── index.html              # HTML shell
├── package.json
├── vite.config.js
└── src/
    ├── main.js             # Entry point — wires everything together
    ├── style.css           # All styles
    ├── data/
    │   └── planets.js      # Planet facts, colours, specs — edit here to add planets
    └── sphere/
        ├── particles.js    # Three.js scene, geometry, shaders, morph, physics
        ├── controls.js     # Mouse, touch, drag, zoom, inertia
        └── ui.js           # HUD typewriter, accent colour, dropdown events
```

## Controls

| Action | Effect |
|--------|--------|
| Drag   | Rotate the sphere |
| Scroll | Zoom in / out |
| Hover  | Repel particles |
| Planets ▼ | Morph between celestial bodies |

## Customisation

- **Add a planet:** Add an entry to `src/data/planets.js` and a `case` in the `morphTo` switch in `src/sphere/particles.js`
- **Change particle count:** Edit `const N = 5200` in `src/sphere/particles.js`
- **Adjust repulsion feel:** Tweak `REPEL_STR` and `REPEL_RAD` constants at the top of `particles.js`
