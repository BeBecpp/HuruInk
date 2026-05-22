<div align="center">

# HuruInk

### Draw in the air with your hand

HuruInk is a browser-based computer vision drawing app that lets users draw on a digital canvas using hand gestures.

It uses webcam-based hand tracking to detect finger movement and turn natural hand gestures into drawing actions.

<br/>

<img src="./src/assets/hero.png" alt="HuruInk preview" width="100%" />

<br/><br/>

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/MediaPipe-FF6F00?style=for-the-badge" />
<img src="https://img.shields.io/badge/HTML_Canvas-000000?style=for-the-badge" />

</div>

---

## What It Does

HuruInk turns your hand into a drawing tool.

Instead of using a mouse, tablet, or stylus, users can draw directly in the air using their index finger and simple hand gestures.

The app tracks the hand through the webcam, detects gestures, and renders strokes on an HTML canvas in real time.

---

## Why I Built It

I wanted to build something visual, interactive, and fun — not just another normal web app.

HuruInk helped me explore:

- computer vision
- hand tracking
- gesture-based interfaces
- real-time interaction
- creative coding
- canvas rendering
- user experience design

This project taught me how difficult but exciting it is to make software feel natural and physical.

---

## Features

| Feature | Description |
|---|---|
| Webcam hand tracking | Tracks the user's hand through the camera |
| Finger cursor | Uses the index finger as a cursor |
| Pinch to draw | Draws when the user pinches thumb and index finger |
| Brush controls | Supports brush color and size changes |
| Eraser mode | Allows users to erase strokes |
| Undo | Removes the last stroke |
| Clear canvas | Clears the full drawing |
| PNG export | Saves the drawing as an image |
| Smooth drawing | Uses smoothing logic for better stroke quality |

---

## Hand Gestures

| Gesture | Action |
|---|---|
| Index finger up | Move cursor |
| Pinch thumb + index finger | Start drawing |
| Release pinch | Stop drawing |
| Two fingers up | Eraser mode |
| Open palm | Pause drawing |
| Closed fist | Undo last stroke |

---

## Tech Stack

| Area | Tools |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Computer Vision | MediaPipe Tasks Vision |
| Drawing | HTML Canvas API |
| Interaction | Gesture detection, hand landmark tracking |
| Export | Transparent PNG export |

---

## How It Works

1. The user starts the webcam.
2. MediaPipe detects hand landmarks from the video feed.
3. HuruInk tracks the index finger position.
4. The app detects gestures such as pinch, open palm, or fist.
5. Drawing starts when the pinch gesture is active.
6. Canvas strokes are rendered in real time.
7. The user can erase, undo, clear, or export the drawing.

## Demo

<div align="center">

<img src="./src/assets/hero.png" alt="HuruInk app preview" width="100%" />

</div>

> Demo GIF/video coming soon.

Recommended demo flow:

1. Start camera
2. Show finger cursor tracking
3. Pinch thumb + index finger to draw
4. Change brush color or brush size
5. Use undo / clear
6. Export the drawing as PNG

## Quick Start

```bash
npm install
npm run dev

Open the local development URL shown in the terminal.

Usually:

http://localhost:5173

```

Camera access requires localhost or HTTPS.

Project Structure
src/
  components/   UI components
  hooks/        Camera, hand tracking, and canvas logic
  utils/        Gesture, geometry, smoothing, and drawing helpers
  types/        TypeScript types
What I Learned

While building HuruInk, I learned how to connect computer vision output with real-time user interaction.

The hardest parts were:

making gestures feel stable
smoothing hand movement
mapping webcam coordinates to canvas coordinates
avoiding accidental drawing
designing controls that feel natural

This project helped me understand that good interactive software is not only about code. It also needs careful UX thinking.

Future Improvements
Better gesture calibration
Mobile/tablet support
Multi-hand drawing
Shape recognition
Offline MediaPipe model support
Better brush styles
Save drawing history
Add tutorial overlay for first-time users
