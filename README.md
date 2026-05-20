<<<<<<< HEAD
# HuruInk

**Draw in the air.** — A webcam-based air drawing app using MediaPipe hand tracking.

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`). Use **HTTPS** or **localhost** for camera access.

## How to use

1. Click **Start Camera** and allow webcam access.
2. Raise your hand in front of the camera.
3. Move your **index finger** — the glowing cursor follows.
4. **Pinch** thumb and index finger together to draw.
5. **Release** the pinch to stop drawing.
6. Use the toolbar to change color, brush size, undo, clear, or save a transparent PNG.

### Hand gestures

| Gesture | Action |
|---------|--------|
| ☝️ Index finger point (others curled) | Draw |
| ✌️ Index + middle up (ring/pinky down) | Eraser — move hand over strokes |
| 🖐 Open palm (4 fingers up) | Pause drawing |
| ✊ Closed fist (~0.2s hold) | Undo last stroke |

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS v4
- `@mediapipe/tasks-vision` HandLandmarker
- HTML Canvas API

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Project structure

```
src/
  components/   UI (CameraCanvas, Toolbar, …)
  hooks/        useCamera, useHandTracking, useCanvasDrawing
  utils/        geometry, smoothing, drawing, exportImage
  types/        drawing, tracking
```

## Known limitations

- Hand tracking quality depends on lighting, background, and camera quality — not 100% accurate.
- Requires network on first load (MediaPipe WASM + model from CDN).
- GPU delegate is attempted first; falls back to CPU if unavailable.
- Save exports **drawing canvas only** (transparent PNG), not the webcam frame.

## Suggested improvements

- Eraser (two-finger gesture), pause (open palm), undo (fist)
- Optional composite export (video + drawing)
- Local WASM bundling for offline use
- Multi-stroke pressure simulation
- Mobile/tablet layout polish
=======
# HuruInk
>>>>>>> 84c57538f301e00ad7609986749f1f8eba5439a6
