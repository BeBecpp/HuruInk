import type { Point, Stroke } from '../types/drawing'

export interface CanvasSize {
  width: number
  height: number
}

export function setupCanvasForDPR(
  canvas: HTMLCanvasElement,
  displayWidth: number,
  displayHeight: number,
): CanvasSize {
  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.floor(displayWidth * dpr)
  canvas.height = Math.floor(displayHeight * dpr)
  canvas.style.width = `${displayWidth}px`
  canvas.style.height = `${displayHeight}px`

  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  return { width: displayWidth, height: displayHeight }
}

export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  ctx.clearRect(0, 0, width, height)
}

export function drawSmoothPath(
  ctx: CanvasRenderingContext2D,
  points: Point[],
): void {
  if (points.length < 2) {
    if (points.length === 1) {
      const p = points[0]
      ctx.beginPath()
      ctx.arc(p.x, p.y, ctx.lineWidth / 2, 0, Math.PI * 2)
      ctx.fill()
    }
    return
  }

  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)

  if (points.length === 2) {
    ctx.lineTo(points[1].x, points[1].y)
    ctx.stroke()
    return
  }

  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2
    const midY = (points[i].y + points[i + 1].y) / 2
    ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY)
  }

  const last = points[points.length - 1]
  const prev = points[points.length - 2]
  ctx.quadraticCurveTo(prev.x, prev.y, last.x, last.y)
  ctx.stroke()
}

export function drawStroke(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
): void {
  if (stroke.points.length === 0) return

  ctx.save()
  ctx.strokeStyle = stroke.color
  ctx.fillStyle = stroke.color
  ctx.lineWidth = stroke.size
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  drawSmoothPath(ctx, stroke.points)
  ctx.restore()
}

export function drawAllStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: Stroke[],
  width: number,
  height: number,
): void {
  clearCanvas(ctx, width, height)
  for (const stroke of strokes) {
    drawStroke(ctx, stroke)
  }
}
