# HuruInk v2

HuruInk is a browser-based gesture drawing app that lets you draw in the air using hand movements through your webcam.

## Live Demo

Live demo link placeholder: 
](https://bebecpp.github.io/HuruInk/)
## Screenshot

Screenshot placeholder:

```md
![HuruInk v2 screenshot](./public/screenshot.png)
```

You can also use the existing preview image:

```md
![HuruInk preview](./src/assets/hero.png)
```

## Features

- Webcam-powered hand tracking with MediaPipe Tasks Vision
- Air drawing with a mirrored camera preview
- Draw mode and erase mode
- Brush color presets plus custom color picker
- Brush size control
- Undo last stroke
- Clear canvas button
- Save drawing as PNG
- Local gallery/history saved in `localStorage`
- Camera permission loading and error states
- Responsive UI for desktop and mobile
- Keyboard shortcuts: `C` clear, `S` save, `D` draw, `E` erase
- Optional debug panel for tracking values

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS v4
- MediaPipe Tasks Vision
- HTML Canvas API
- Lucide React icons
- Browser `localStorage`

## How to Run Locally

```bash
npm install
npm run dev
```

Open the Vite local URL, usually:

```bash
http://localhost:5173
```

Camera access works on `localhost`. A deployed version must use HTTPS for webcam permissions.

Build the production version:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## What Changed in v2

- Upgraded the interface into a cleaner Stardance-ready release.
- Added explicit Draw and Erase modes.
- Added PNG saving that also stores recent saves in a local gallery.
- Added keyboard shortcuts for faster drawing.
- Improved the landing/start screen, header, camera states, and responsive controls.
- Updated project version to `2.0.0`.
- Added release documentation with changelog and release notes.

## What I Learned

- How to connect webcam hand tracking to a canvas drawing workflow.
- How to make gesture controls easier to understand with clear UI modes.
- How to export canvas drawings as PNG files in the browser.
- How to persist simple app history with `localStorage`.
- How to prepare a cleaner open-source release with docs, versioning, and release notes.

## Future Improvements

- Add brush styles such as glow, dotted, rainbow, or calligraphy.
- Add drawing replay from saved stroke data.
- Add optional camera-background export.
- Add PWA install support.
- Improve mobile hand tracking hints.
- Add automated UI tests for core drawing controls.

## Credits / AI Usage Note

Built by BeBe for Hack Club Stardance.

AI usage note: "I used Codex/ChatGPT to help plan the v2 upgrade, improve the UI, debug issues, and write documentation. I reviewed and tested the generated changes myself."

## Privacy

HuruInk runs in the browser. Webcam frames are processed client-side, drawings are exported locally, and gallery history is stored in your browser's `localStorage`.

## License

This project is open source. Add a license file if you want to define exact usage rights.
