# HuruInk

<p align="center">
  <img src="./src/assets/hero.png" alt="HuruInk preview" width="820" />
</p>

<p align="center">
  <strong>Draw in the air.</strong><br />
  A webcam-powered air drawing app that lets you doodle with your finger using real-time hand tracking.
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#demo">Demo</a> ·
  <a href="#quick-start">Quick Start</a> ·
  <a href="#how-it-works">How It Works</a> ·
  <a href="#project-architecture">Architecture</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

---

## Overview

**HuruInk** is a browser-based computer vision drawing app. It opens your webcam, tracks your hand in real time, follows your index finger, and lets you draw on a digital canvas using natural hand gestures.

The main interaction is simple:

- Move your **index finger** to move the cursor.
- Pinch your **thumb + index finger** to draw.
- Release the pinch to stop drawing.
- Use the toolbar to undo, clear, change brush settings, and save your artwork.

HuruInk runs fully in the browser. No backend, no database, and no account system are required.

---

## Demo

> Add your screenshot or GIF here after recording the app.

```md
![HuruInk Demo](./public/demo.gif)
```

You can also use a static preview image:

```md
![HuruInk Preview](./src/assets/hero.png)
```

---

## Features

### Camera + Tracking

- Real-time webcam input
- Mirrored camera preview for natural movement
- MediaPipe hand landmark detection
- Index fingertip tracking
- Thumb-to-index pinch detection
- Hand lost detection
- Tracking status feedback

### Drawing

- Pinch-to-draw interaction
- Smooth stroke rendering
- Brush color selection
- Brush size control
- Undo last stroke
- Clear canvas
- Save drawing as PNG
- Transparent drawing canvas export

### User Interface

- Full-screen camera-first layout
- Dark premium interface
- Glassmorphism toolbar
- Status badge
- Gesture helper card
- Debug panel
- Glowing cursor indicator

### Performance

- Client-side processing
- `requestAnimationFrame` tracking loop
- Canvas-based rendering
- Lightweight React state usage
- No server dependency

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Vite** | Frontend build tool and dev server |
| **React** | UI framework |
| **TypeScript** | Type-safe codebase |
| **Tailwind CSS v4** | Styling system |
| **MediaPipe Tasks Vision** | Hand landmark detection |
| **HTML Canvas API** | Drawing surface |
| **Lucide React** | UI icons |

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/BeBecpp/HuruInk.git
cd HuruInk
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Open the local app

Vite usually starts at:

```bash
http://localhost:5173
```

Camera access works on `localhost`. For deployed versions, the site must be served over HTTPS.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |
| `npm install` | Install dependencies and run the MediaPipe WASM copy script |

---

## How to Use

1. Open HuruInk in the browser.
2. Click **Start Camera**.
3. Allow webcam permission.
4. Raise your hand in front of the camera.
5. Move your index finger to control the glowing cursor.
6. Pinch your thumb and index finger together to draw.
7. Release the pinch to stop drawing.
8. Use the toolbar to:
   - change brush color
   - change brush size
   - undo
   - clear
   - save PNG
   - open debug mode

---

## Gesture Controls

| Gesture | Action |
|---|---|
| Move index finger | Move cursor |
| Pinch thumb + index finger | Draw |
| Release pinch | Stop drawing |
| No hand detected | Pause drawing safely |
| Two fingers | Eraser mode, if enabled |
| Open palm | Pause mode, if enabled |
| Fist | Undo, if enabled |

> The core MVP gesture is **pinch-to-draw**. Other gestures can be extended depending on the current implementation.

---

## How It Works

HuruInk processes webcam frames in real time and detects hand landmarks using MediaPipe.

The app mainly uses these hand landmarks:

| Landmark | Meaning |
|---|---|
| `0` | Wrist |
| `4` | Thumb tip |
| `5` | Index MCP |
| `8` | Index fingertip |
| `12` | Middle fingertip |
| `16` | Ring fingertip |
| `20` | Pinky fingertip |

The drawing logic is based on the distance between the thumb tip and the index fingertip.

```ts
const pinchDistance = distance(indexTip, thumbTip)

if (pinchDistance < pinchThreshold) {
  // draw
} else {
  // hover
}
```

Because the camera preview is mirrored, the x coordinate is flipped before drawing:

```ts
canvasX = canvasWidth - landmark.x * canvasWidth
canvasY = landmark.y * canvasHeight
```

---

## Drawing Pipeline

```txt
Webcam frame
    ↓
MediaPipe HandLandmarker
    ↓
Hand landmarks
    ↓
Index fingertip + thumb tip
    ↓
Pinch detection
    ↓
Coordinate mapping
    ↓
Smoothing
    ↓
Canvas stroke rendering
```

---

## Project Architecture

```txt
src/
  main.tsx
  App.tsx
  index.css

  components/
    CameraCanvas.tsx
    CursorIndicator.tsx
    DebugPanel.tsx
    GestureHints.tsx
    StartScreen.tsx
    StatusBadge.tsx
    Toolbar.tsx

  hooks/
    useCamera.ts
    useCanvasDrawing.ts
    useHandTracking.ts

  types/
    drawing.ts
    tracking.ts

  utils/
    drawing.ts
    exportImage.ts
    geometry.ts
    gestures.ts
    handQuality.ts
    smoothing.ts
```

---

## Main Modules

### `useCamera`

Handles webcam access.

Responsibilities:

- request camera permission
- attach stream to video element
- stop camera stream
- expose camera loading/error state

### `useHandTracking`

Handles hand detection and gesture state.

Responsibilities:

- initialize MediaPipe
- process video frames
- detect hand landmarks
- track index fingertip
- calculate pinch distance
- determine hover/drawing/no-hand status
- expose debug values

### `useCanvasDrawing`

Handles all drawing behavior.

Responsibilities:

- store strokes
- start current stroke
- append points
- render smooth paths
- undo last stroke
- clear canvas
- export PNG

### `CameraCanvas`

Main visual component.

Responsibilities:

- display mirrored webcam
- overlay drawing canvas
- show cursor indicator
- connect tracking state to drawing state

### `Toolbar`

User controls.

Responsibilities:

- start/stop camera
- change brush color
- change brush size
- undo
- clear
- save PNG
- toggle debug panel

---

## State Machine

```txt
idle
  ↓ start camera
camera-loading
  ↓ camera ready
no-hand
  ↓ hand detected
hover
  ↓ pinch detected
drawing
  ↓ pinch released
hover
  ↓ hand lost
no-hand
```

Error state can happen if:

- camera permission is denied
- webcam is missing
- browser blocks camera access
- MediaPipe fails to initialize
- video stream is not ready

---

## Tracking Status

| Status | Meaning |
|---|---|
| `idle` | Camera is not running |
| `camera-loading` | Camera is starting |
| `no-hand` | No valid hand detected |
| `hover` | Hand detected, cursor is moving, not drawing |
| `drawing` | Pinch gesture is active and stroke is being drawn |
| `error` | Camera or tracking error |

---

## Privacy

HuruInk is designed to run locally in the browser.

- Camera frames are processed client-side.
- No webcam video is uploaded to a server.
- No account is required.
- No backend is used.
- Saved PNG files are generated locally from the drawing canvas.

---

## Browser Requirements

Recommended:

- Latest Google Chrome
- Latest Microsoft Edge
- Latest Firefox
- A working webcam
- Good lighting
- `localhost` or HTTPS

Camera access may not work on insecure origins such as plain HTTP deployed sites.

---

## Tips for Better Tracking

For the best drawing experience:

- Use a bright room.
- Avoid strong backlight.
- Keep your hand clearly visible.
- Keep your full palm and wrist inside the camera frame.
- Avoid fast hand movement.
- Use a simple background.
- Keep only one hand in frame for best MVP behavior.

---

## Known Limitations

HuruInk uses real-time webcam hand tracking, so it is not perfect in every environment.

Tracking quality can be affected by:

- low light
- blurry webcam feed
- fast hand movement
- hand leaving the frame
- multiple hands
- complex background
- camera resolution
- browser performance

The app is optimized for a smooth demo experience, but it should not be treated as 100% accurate computer vision.

---

## Troubleshooting

### Camera does not start

Try:

- allow camera permission in the browser
- close other apps using the webcam
- refresh the page
- use Chrome or Edge
- run on `localhost`
- use HTTPS if deployed online

### Hand is not detected

Try:

- move your hand closer to the camera
- improve lighting
- show your full hand and wrist
- avoid backlight
- keep your hand inside the frame

### Drawing is shaky

Try:

- move your finger slower
- use a larger brush size
- improve lighting
- reduce background clutter

### Save PNG is blank

Make sure you have drawn on the canvas first. The default export saves only the drawing layer, not the camera video.

---

## Build for Production

```bash
npm run build
```

The production output will be generated in:

```txt
dist/
```

Preview the production build:

```bash
npm run preview
```

---

## Deployment

You can deploy HuruInk to any static hosting provider.

Recommended options:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

Important: camera access requires HTTPS on deployed sites.

---

## Roadmap

### Version 0.1

- [x] Webcam preview
- [x] Hand tracking
- [x] Index finger cursor
- [x] Pinch-to-draw
- [x] Brush controls
- [x] Undo
- [x] Clear canvas
- [x] Save PNG

### Version 0.2

- [ ] Better no-hand guide overlay
- [ ] Pinch hysteresis
- [ ] Improved debug state reset
- [ ] Smoother cursor animation
- [ ] Keyboard shortcuts
- [ ] Better mobile layout

### Version 0.3

- [ ] Eraser gesture
- [ ] Open palm pause
- [ ] Fist undo
- [ ] Neon brush
- [ ] Glow brush
- [ ] Rainbow brush
- [ ] Dotted brush

### Version 1.0

- [ ] Gallery
- [ ] Doodle replay animation
- [ ] Draw over captured camera photo
- [ ] Composite export with camera background
- [ ] PWA install support
- [ ] Desktop build with Tauri or Electron

---

## Contributing

Contributions are welcome.

Suggested contribution areas:

- hand tracking improvements
- gesture recognition
- UI polish
- brush effects
- mobile support
- performance optimization
- accessibility improvements
- documentation

Basic workflow:

```bash
git checkout -b feature/my-feature
git add .
git commit -m "Add my feature"
git push origin feature/my-feature
```

Then open a pull request.

---

## License

This project is open source. Add a license file if you want to define exact usage rights.

Recommended:

```txt
MIT License
```

---

## Author

Built by **BeBe**.

GitHub: [@BeBecpp](https://github.com/BeBecpp)

---

## Final Note

HuruInk is built around one simple idea:

> Drawing should feel magical.

Raise your hand.  
Pinch your fingers.  
Draw in the air.
