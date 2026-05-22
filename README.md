<div align="center">

# HuruInk

### Draw in the air with your hand

HuruInk is a browser-based computer vision drawing app that lets users draw on a digital canvas using hand gestures.

It uses webcam-based hand tracking to detect the user's finger movement and turns gestures into drawing actions.

<br/>

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
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

---

## Demo

Demo video coming soon.

Recommended demo:

- Start camera
- Show finger cursor tracking
- Draw using pinch gesture
- Change brush color
- Use eraser or undo
- Export the drawing as PNG

---

## Quick Start

```bash
npm install
npm run dev
