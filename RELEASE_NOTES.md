# HuruInk v2.0.0 - Stardance Upgrade

HuruInk v2 upgrades the original webcam gesture drawing app into a more polished release for Hack Club Stardance.

## Highlights

- Draw in the air with webcam hand tracking.
- Switch between Draw and Erase modes.
- Pick brush colors and adjust brush size.
- Clear the canvas, undo strokes, and save drawings as PNG files.
- Keep recent saved drawings in a local browser gallery.
- Use keyboard shortcuts: `C` clear, `S` save, `D` draw, `E` erase.
- Enjoy a cleaner responsive UI with better camera permission and error states.

## Upgrade Summary

This release keeps the original v1 architecture: React, TypeScript, Vite, MediaPipe Tasks Vision, and the canvas drawing pipeline. The v2 work focuses on visible product improvements, a clearer interface, local persistence, documentation, and release readiness.

## Verification

Before publishing, run:

```bash
npm run lint
npm run build
```

## Known Notes

- Webcam access requires `localhost` during development or HTTPS in production.
- Gallery history is stored locally in the user's browser and is not synced across devices.
- Tracking quality depends on camera quality, lighting, and how clearly the hand is visible.

## GitHub Release Description

HuruInk v2 is the Stardance upgrade of the browser-based air drawing app. It keeps the original webcam hand-tracking foundation and adds a polished release experience with Draw and Erase modes, brush controls, PNG export, local gallery history, keyboard shortcuts, improved camera states, responsive UI, and updated documentation.
