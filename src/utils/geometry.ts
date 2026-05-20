import type { Point } from '../types/drawing'

export function distance(
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const dx = ax - bx
  const dy = ay - by
  return Math.sqrt(dx * dx + dy * dy)
}

export function mirrorNormalizedX(x: number): number {
  return 1 - x
}

export function normalizedToCanvasPoint(
  nx: number,
  ny: number,
  canvasWidth: number,
  canvasHeight: number,
): Point {
  return {
    x: canvasWidth - nx * canvasWidth,
    y: ny * canvasHeight,
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function calculatePinchDistance(
  indexX: number,
  indexY: number,
  thumbX: number,
  thumbY: number,
): number {
  return distance(indexX, indexY, thumbX, thumbY)
}

/** Scale pinch threshold by hand size (wrist to index MCP). */
export function dynamicPinchThreshold(
  wristX: number,
  wristY: number,
  mcpX: number,
  mcpY: number,
  baseThreshold = 0.055,
): number {
  const handSpan = distance(wristX, wristY, mcpX, mcpY)
  const scale = clamp(handSpan / 0.25, 0.75, 1.35)
  return baseThreshold * scale
}
