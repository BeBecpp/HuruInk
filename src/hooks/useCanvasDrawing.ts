import { useCallback, useRef, useState } from 'react'
import type { BrushSettings, Point, Stroke } from '../types/drawing'
import {
  drawAllStrokes,
  drawStroke,
  setupCanvasForDPR,
} from '../utils/drawing'
import { exportCanvasAsPng } from '../utils/exportImage'

function createStrokeId(): string {
  return `stroke-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const MIN_POINT_DISTANCE = 2
const DEFAULT_ERASER_RADIUS = 28

export interface UseCanvasDrawingResult {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  strokes: Stroke[]
  strokeCount: number
  brush: BrushSettings
  setBrushColor: (color: string) => void
  setBrushSize: (size: number) => void
  resizeCanvas: (width: number, height: number) => void
  beginStrokeIfNeeded: (point: Point) => void
  addPoint: (point: Point) => void
  endStroke: () => void
  cancelCurrentStroke: () => void
  undo: () => void
  clear: () => void
  savePng: () => void
  redraw: () => void
  eraseAtPoint: (point: Point, radius?: number) => void
}

export function useCanvasDrawing(
  initialBrush: BrushSettings = { color: '#22d3ee', size: 6 },
): UseCanvasDrawingResult {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const strokesRef = useRef<Stroke[]>([])
  const currentStrokeRef = useRef<Stroke | null>(null)
  const displaySizeRef = useRef({ width: 0, height: 0 })

  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [brush, setBrush] = useState<BrushSettings>(initialBrush)

  const syncStrokesState = useCallback(() => {
    setStrokes([...strokesRef.current])
  }, [])

  const getContext = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    return canvas.getContext('2d')
  }, [])

  const redraw = useCallback(() => {
    const ctx = getContext()
    const { width, height } = displaySizeRef.current
    if (!ctx || width <= 0 || height <= 0) return

    drawAllStrokes(ctx, strokesRef.current, width, height)

    const current = currentStrokeRef.current
    if (current && current.points.length > 0) {
      drawStroke(ctx, current)
    }
  }, [getContext])

  const resizeCanvas = useCallback(
    (width: number, height: number) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const prev = displaySizeRef.current
      const scaleX = prev.width > 0 ? width / prev.width : 1
      const scaleY = prev.height > 0 ? height / prev.height : 1

      if (prev.width > 0 && prev.height > 0 && (scaleX !== 1 || scaleY !== 1)) {
        const scalePoints = (points: Point[]) =>
          points.map((p) => ({
            ...p,
            x: p.x * scaleX,
            y: p.y * scaleY,
          }))

        strokesRef.current = strokesRef.current.map((s) => ({
          ...s,
          points: scalePoints(s.points),
        }))
        if (currentStrokeRef.current) {
          currentStrokeRef.current = {
            ...currentStrokeRef.current,
            points: scalePoints(currentStrokeRef.current.points),
          }
        }
      }

      displaySizeRef.current = { width, height }
      setupCanvasForDPR(canvas, width, height)
      redraw()
      syncStrokesState()
    },
    [redraw, syncStrokesState],
  )

  const beginStrokeIfNeeded = useCallback(
    (point: Point) => {
      if (currentStrokeRef.current) return

      currentStrokeRef.current = {
        id: createStrokeId(),
        points: [{ ...point, timestamp: point.timestamp ?? Date.now() }],
        color: brush.color,
        size: brush.size,
      }
    },
    [brush.color, brush.size],
  )

  const addPoint = useCallback(
    (point: Point) => {
      const stroke = currentStrokeRef.current
      if (!stroke) return

      const last = stroke.points[stroke.points.length - 1]
      if (
        last &&
        Math.hypot(point.x - last.x, point.y - last.y) < MIN_POINT_DISTANCE
      ) {
        return
      }

      stroke.points.push({
        ...point,
        timestamp: point.timestamp ?? Date.now(),
      })

      const ctx = getContext()
      if (!ctx) return

      if (stroke.points.length === 1) {
        redraw()
        return
      }

      const pts = stroke.points
      const len = pts.length
      if (len >= 2) {
        ctx.save()
        ctx.strokeStyle = stroke.color
        ctx.fillStyle = stroke.color
        ctx.lineWidth = stroke.size
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        if (len === 2) {
          ctx.beginPath()
          ctx.moveTo(pts[0].x, pts[0].y)
          ctx.lineTo(pts[1].x, pts[1].y)
          ctx.stroke()
        } else {
          const i = len - 2
          const midX = (pts[i].x + pts[i + 1].x) / 2
          const midY = (pts[i].y + pts[i + 1].y) / 2
          ctx.beginPath()
          ctx.moveTo(pts[i - 1].x, pts[i - 1].y)
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY)
          ctx.stroke()
        }
        ctx.restore()
      }
    },
    [getContext, redraw],
  )

  const endStroke = useCallback(() => {
    const stroke = currentStrokeRef.current
    if (!stroke || stroke.points.length === 0) {
      currentStrokeRef.current = null
      return
    }
    strokesRef.current.push(stroke)
    currentStrokeRef.current = null
    syncStrokesState()
  }, [syncStrokesState])

  const cancelCurrentStroke = useCallback(() => {
    if (currentStrokeRef.current) {
      currentStrokeRef.current = null
      redraw()
    }
  }, [redraw])

  const undo = useCallback(() => {
    strokesRef.current.pop()
    currentStrokeRef.current = null
    redraw()
    syncStrokesState()
  }, [redraw, syncStrokesState])

  const clear = useCallback(() => {
    strokesRef.current = []
    currentStrokeRef.current = null
    redraw()
    syncStrokesState()
  }, [redraw, syncStrokesState])

  const savePng = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    exportCanvasAsPng(canvas)
  }, [])

  const eraseAtPoint = useCallback(
    (point: Point, radius = DEFAULT_ERASER_RADIUS) => {
      const r2 = radius * radius
      let changed = false

      strokesRef.current = strokesRef.current
        .map((stroke) => {
          const filtered = stroke.points.filter((p) => {
            const dx = p.x - point.x
            const dy = p.y - point.y
            return dx * dx + dy * dy > r2
          })
          if (filtered.length !== stroke.points.length) changed = true
          return { ...stroke, points: filtered }
        })
        .filter((s) => s.points.length >= 2)

      if (currentStrokeRef.current) {
        const filtered = currentStrokeRef.current.points.filter((p) => {
          const dx = p.x - point.x
          const dy = p.y - point.y
          return dx * dx + dy * dy > r2
        })
        if (filtered.length !== currentStrokeRef.current.points.length) {
          changed = true
          if (filtered.length >= 2) {
            currentStrokeRef.current = {
              ...currentStrokeRef.current,
              points: filtered,
            }
          } else {
            currentStrokeRef.current = null
          }
        }
      }

      if (changed) {
        redraw()
        syncStrokesState()
      }
    },
    [redraw, syncStrokesState],
  )

  const setBrushColor = useCallback((color: string) => {
    setBrush((b) => ({ ...b, color }))
  }, [])

  const setBrushSize = useCallback((size: number) => {
    setBrush((b) => ({ ...b, size }))
  }, [])

  return {
    canvasRef,
    strokes,
    strokeCount: strokes.length,
    brush,
    setBrushColor,
    setBrushSize,
    resizeCanvas,
    beginStrokeIfNeeded,
    addPoint,
    endStroke,
    cancelCurrentStroke,
    undo,
    clear,
    savePng,
    redraw,
    eraseAtPoint,
  }
}
