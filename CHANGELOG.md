# Changelog

All notable changes to HuruInk will be documented in this file.

## [2.0.0] - 2026-06-06

### Added

- Draw mode and erase mode controls.
- Brush color picker and brush size controls in the main toolbar.
- PNG export with automatic local gallery/history storage.
- Local gallery powered by browser `localStorage`.
- Keyboard shortcuts: `C` clear, `S` save, `D` draw, `E` erase.
- Cleaner landing/start screen with webcam permission guidance.
- Responsive header, toolbar, gallery, and status UI for desktop and mobile.
- Release documentation in `README.md` and `RELEASE_NOTES.md`.

### Changed

- Polished the visual design for a modern, minimal Stardance-ready v2 release.
- Updated in-app gesture hints to match explicit tool modes.
- Improved camera and hand-tracking status copy.
- Bumped package version to `2.0.0`.

### Fixed

- Removed stray text from `index.html`.
- Kept the existing webcam drawing flow while making the controls clearer.

## [1.0.0] - Initial release

### Added

- Webcam preview.
- MediaPipe hand tracking.
- Canvas drawing with hand gestures.
- Brush controls.
- Undo, clear, save PNG, and debug panel.
