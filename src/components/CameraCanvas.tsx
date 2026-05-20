import { useCallback, useEffect, useRef, useState } from 'react'
import { useCamera } from '../hooks/useCamera'
import { useCanvasDrawing } from '../hooks/useCanvasDrawing'
import { useHandTracking } from '../hooks/useHandTracking'
import type { CursorMode, CursorState } from '../types/tracking'
import type { HandTrackingDebug, TrackingStatus } from '../types/tracking'
import { CursorIndicator } from './CursorIndicator'
import { DebugPanel } from './DebugPanel'
import { GestureHints } from './GestureHints'
import { StatusBadge } from './StatusBadge'

interface CameraCanvasProps {
  showStartScreen: boolean
  debugEnabled: boolean
  onCameraActiveChange: (active: boolean) => void
  drawing: ReturnType<typeof useCanvasDrawing>
  camera: ReturnType<typeof useCamera>
}

const FIST_FRAMES_FOR_UNDO = 10
const UNDO_COOLDOWN_MS = 1500

function cursorModeFromGesture(gesture: string): CursorMode {
  if (gesture === 'open-palm-pause') return 'paused'
  if (gesture === 'two-finger-eraser') return 'erase'
  if (gesture === 'index-draw') return 'draw'
  if (gesture === 'fist') return 'hidden'
  if (gesture === 'hover') return 'hover'
  return 'hidden'
}

export function CameraCanvas({
  showStartScreen,
  debugEnabled,
  onCameraActiveChange,
  drawing,
  camera,
}: CameraCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wasDrawingRef = useRef(false)
  const fistFrameCountRef = useRef(0)
  const lastUndoAtRef = useRef(0)
  const lastErasePointRef = useRef<{ x: number; y: number } | null>(null)

  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 })
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>('idle')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    visible: false,
    mode: 'hidden',
  })
  const [debug, setDebug] = useState<HandTrackingDebug>({
    fps: 0,
    handDetected: false,
    pinchDistance: 0,
    gesture: 'none',
    status: 'idle',
    cursorX: 0,
    cursorY: 0,
    strokeCount: 0,
    mediaPipeLoaded: false,
    confidence: 0,
    rawHandCount: 0,
  })

  const fpsFramesRef = useRef(0)
  const fpsLastTimeRef = useRef(performance.now())
  const fpsValueRef = useRef(0)

  const { videoRef, isActive, error: cameraError } = camera

  const handTracking = useHandTracking({
    videoRef,
    enabled: isActive && !showStartScreen,
    canvasWidth: displaySize.width,
    canvasHeight: displaySize.height,
  })

  const resizeCanvas = drawing.resizeCanvas
  const eraseAtPoint = drawing.eraseAtPoint

  const measureAndResize = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const w = Math.floor(rect.width)
    const h = Math.floor(rect.height)
    if (w <= 0 || h <= 0) return

    setDisplaySize((prev) => {
      if (prev.width === w && prev.height === h) return prev
      return { width: w, height: h }
    })
    resizeCanvas(w, h)
  }, [resizeCanvas])

  useEffect(() => {
    onCameraActiveChange(isActive)
  }, [isActive, onCameraActiveChange])

  useEffect(() => {
    if (!isActive) {
      setTrackingStatus('idle')
      wasDrawingRef.current = false
      fistFrameCountRef.current = 0
      drawing.cancelCurrentStroke()
      return
    }
    setTrackingStatus('camera-loading')
  }, [isActive, drawing])

  useEffect(() => {
    if (cameraError) {
      setTrackingStatus('error')
      setStatusMessage(cameraError)
    }
  }, [cameraError])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(() => {
      measureAndResize()
    })
    observer.observe(container)

    const video = videoRef.current
    if (video) {
      video.addEventListener('loadedmetadata', measureAndResize)
    }

    measureAndResize()

    return () => {
      observer.disconnect()
      video?.removeEventListener('loadedmetadata', measureAndResize)
    }
  }, [isActive, measureAndResize, videoRef])

  useEffect(() => {
    if (!isActive) return

    let rafId: number
    let lastUiUpdate = 0
    const UI_INTERVAL_MS = 80

    const tick = (now: number) => {
      fpsFramesRef.current += 1
      const elapsed = now - fpsLastTimeRef.current
      if (elapsed >= 1000) {
        fpsValueRef.current = (fpsFramesRef.current * 1000) / elapsed
        fpsFramesRef.current = 0
        fpsLastTimeRef.current = now
      }

      const refs = handTracking.refs
      const handDetected = refs.handDetected.current
      const gesture = refs.gesture.current
      const tip = refs.cursor.current
      const isPaused = gesture === 'open-palm-pause'

      if (!handDetected || !tip) {
        if (wasDrawingRef.current) {
          drawing.endStroke()
          wasDrawingRef.current = false
        }
        fistFrameCountRef.current = 0
        refs.trackingStatus.current = 'no-hand'
      } else if (gesture === 'fist') {
        if (wasDrawingRef.current) {
          drawing.endStroke()
          wasDrawingRef.current = false
        }
        fistFrameCountRef.current += 1
        if (
          fistFrameCountRef.current >= FIST_FRAMES_FOR_UNDO &&
          now - lastUndoAtRef.current > UNDO_COOLDOWN_MS
        ) {
          drawing.undo()
          lastUndoAtRef.current = now
          fistFrameCountRef.current = 0
          setStatusMessage('Undo — fist gesture')
        }
        refs.trackingStatus.current = 'hover'
      } else {
        fistFrameCountRef.current = 0

        if (isPaused) {
          if (wasDrawingRef.current) {
            drawing.endStroke()
            wasDrawingRef.current = false
          }
          refs.trackingStatus.current = 'paused'
        } else if (gesture === 'two-finger-eraser') {
          if (wasDrawingRef.current) {
            drawing.endStroke()
            wasDrawingRef.current = false
          }
          refs.trackingStatus.current = 'erasing'

          const last = lastErasePointRef.current
          const moved =
            !last ||
            Math.hypot(tip.x - last.x, tip.y - last.y) > 6
          if (moved) {
            const radius = Math.max(20, drawing.brush.size * 4)
            eraseAtPoint(tip, radius)
            lastErasePointRef.current = { x: tip.x, y: tip.y }
          }
        } else if (gesture === 'index-draw') {
          lastErasePointRef.current = null
          if (!wasDrawingRef.current) {
            drawing.beginStrokeIfNeeded(tip)
            wasDrawingRef.current = true
          }
          drawing.addPoint(tip)
          refs.trackingStatus.current = 'drawing'
        } else {
          lastErasePointRef.current = null
          if (wasDrawingRef.current) {
            drawing.endStroke()
            wasDrawingRef.current = false
          }
          refs.trackingStatus.current = 'hover'
        }
      }

      const status = isActive
        ? handDetected
          ? refs.trackingStatus.current
          : 'no-hand'
        : 'idle'

      if (now - lastUiUpdate >= UI_INTERVAL_MS) {
        lastUiUpdate = now

        let hint: string | null = null
        if (!handTracking.mediaPipeLoaded) {
          hint = 'Loading hand tracking model…'
        } else if (!handDetected && refs.rawHandCount.current === 0) {
          hint =
            'Move hand 30–60 cm from camera. Avoid backlight. Show full hand + wrist if possible.'
        } else if (!handDetected && refs.rawHandCount.current > 0) {
          hint = 'Hand seen but low confidence — improve lighting or move slightly back.'
        } else if (gesture === 'fist') {
          hint = 'Undo — fist gesture'
        }

        setStatusMessage(hint)
        setTrackingStatus(
          !handTracking.mediaPipeLoaded && isActive
            ? 'camera-loading'
            : status,
        )
        setCursor({
          x: tip?.x ?? 0,
          y: tip?.y ?? 0,
          visible:
            handDetected && !!tip && gesture !== 'fist',
          mode: handDetected
            ? cursorModeFromGesture(gesture)
            : 'hidden',
        })
        setDebug({
          fps: fpsValueRef.current,
          handDetected,
          pinchDistance: refs.pinchDistance.current,
          gesture,
          status,
          cursorX: tip?.x ?? 0,
          cursorY: tip?.y ?? 0,
          strokeCount: drawing.strokeCount,
          mediaPipeLoaded: handTracking.mediaPipeLoaded,
          confidence: refs.confidence.current,
          rawHandCount: refs.rawHandCount.current,
        })
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [
    isActive,
    handTracking.refs,
    handTracking.mediaPipeLoaded,
    drawing.beginStrokeIfNeeded,
    drawing.addPoint,
    drawing.endStroke,
    drawing.undo,
    drawing.brush.size,
    eraseAtPoint,
  ])

  useEffect(() => {
    if (isActive && handTracking.mediaPipeLoaded) {
      setTrackingStatus((s) =>
        s === 'camera-loading' ? 'no-hand' : s,
      )
    }
    if (handTracking.mediaPipeError) {
      setTrackingStatus('error')
      setStatusMessage(handTracking.mediaPipeError)
    }
  }, [isActive, handTracking.mediaPipeLoaded, handTracking.mediaPipeError])

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
        playsInline
        muted
        autoPlay
      />

      <canvas
        ref={drawing.canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        aria-label="Drawing canvas"
      />

      <CursorIndicator
        x={cursor.x}
        y={cursor.y}
        visible={cursor.visible && isActive}
        mode={cursor.mode}
        eraserSize={Math.max(20, drawing.brush.size * 4)}
      />

      {isActive && !showStartScreen && <GestureHints />}

      {isActive && (
        <StatusBadge status={trackingStatus} message={statusMessage} />
      )}

      {debugEnabled && isActive && <DebugPanel debug={debug} />}
    </div>
  )
}
