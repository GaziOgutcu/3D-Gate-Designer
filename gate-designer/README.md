# Custom Auto Gates — 3D Gate Designer

Interactive 3D gate configurator for [Custom Auto Gates & Fencing](https://customautogates.com.au/) Brisbane.

Customers can design their custom gate in real-time 3D, choose materials, colours, dimensions, and extras — then submit a quote request directly.

## Features

- **Real-time 3D** — Three.js powered gate visualization with PBR materials, shadows, and cinematic lighting
- **4 Gate Types** — Sliding, Swing Single, Swing Double, Pedestrian
- **3 Materials** — Aluminium, Steel, Colorbond® with accurate metalness/roughness
- **5 Infill Patterns** — Horizontal Slat, Vertical Slat, Louvre, Spear Top, Flat Panel
- **8 Colorbond Colours** — Australian standard colour palette
- **Live Dimensions** — Width 1.5m–8m, Height 0.9m–2.4m
- **Add-ons** — Gate motor, solar power, intercom/keypad, safety sensors (all visible in 3D)
- **Dynamic Pricing** — Real-time estimate based on all selections
- **Quote Form** — Inline inquiry submission with full configuration summary

## Tech Stack

- **React 18** + **Vite 6**
- **Three.js** (r170) — WebGL 3D rendering
- **Vercel** — Deployment

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Deploy to Vercel

1. Push to GitHub
2. Import in [vercel.com/new](https://vercel.com/new)
3. Framework preset: **Vite** (auto-detected)
4. Deploy — done

## Project Structure

```
src/
├── App.jsx                  # Root layout
├── main.jsx                 # Entry point
├── index.css                # Global styles
├── components/
│   ├── Header.jsx           # Top bar with logo & phone
│   ├── ConfigPanel.jsx      # Left sidebar — all config options
│   ├── Viewport3D.jsx       # Center — Three.js canvas + overlays
│   ├── QuotePanel.jsx       # Right sidebar — summary + form
│   └── Toggle.jsx           # Reusable toggle switch
├── data/
│   └── config.js            # Gate types, materials, colours, pricing
└── three/
    ├── scene.js             # Three.js scene, lights, ground
    └── gateBuilder.js       # 3D gate geometry builder
```

## License

Built for Custom Auto Gates Pty Ltd. All rights reserved.
