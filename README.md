# Custom Auto Gates — 3D Gate Designer

Interactive 3D gate configurator for [Custom Auto Gates & Fencing](https://customautogates.com.au/) Brisbane.

Customers can design their custom gate in real-time 3D, choose materials, colours, dimensions, and extras — then submit an inquiry for a reviewed email quote.

## Features

- **Real-time 3D** — Three.js powered gate visualization with PBR materials, shadows, and cinematic lighting
- **4 Gate Types** — Sliding, Swing Single, Swing Double, Pedestrian
- **3 Materials** — Aluminium, Steel, Colorbond® with accurate metalness/roughness
- **5 Infill Patterns** — Horizontal Slat, Vertical Slat, Louvre, Spear Top, Flat Panel
- **8 Colorbond Colours** — Australian standard colour palette
- **Live Dimensions** — Width 1.5m–8m, Height 0.9m–2.4m
- **Add-ons** — Gate motor, solar power, intercom/keypad, safety sensors (all visible in 3D)
- **Reviewed Email Quotes** — Inquiry details are emailed for manual quote review
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

## Email Inquiry Setup

This app uses the EmailJS REST API for browser-based inquiry notifications. EmailJS expects a `POST` request to `https://api.emailjs.com/api/v1.0/email/send` with a `service_id`, `template_id`, public key (`user_id`), and `template_params`.

1. Create an EmailJS account and connect your email service.
2. Create a template that sends to your inbox and includes variables such as `{{from_name}}`, `{{from_email}}`, `{{phone}}`, `{{address}}`, `{{design_summary}}`, `{{notes}}`, and `{{message}}`.
3. Copy `.env.example` to `.env.local` and fill in your EmailJS IDs plus your recipient email.
4. Add the same environment variables in Vercel before deploying.

```bash
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_INQUIRY_TO_EMAIL=your@email.com
```

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
│   └── config.js            # Gate types, materials, colours
└── three/
    ├── scene.js             # Three.js scene, lights, ground
    └── gateBuilder.js       # 3D gate geometry builder
```

## License

Built for Custom Auto Gates Pty Ltd. All rights reserved.
