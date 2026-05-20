import type { Point } from '../types/drawing'
import { distance } from './geometry'

export interface PointSmoother {
  smooth: (point: Point) => Point
  reset: () => void
}

const BASE_ALPHA = 0.35
const LARGE_MOVE_THRESHOLD = 40
const FAST_ALPHA = 0.55
const SLOW_ALPHA = 0.22

export function createPointSmoother(): PointSmoother {
  let previous: Point | null = null

  return {
    smooth(current: Point): Point {
      if (!previous) {
        previous = { ...current }
        return { ...current }
      }

      const moveDist = distance(previous.x, previous.y, current.x, current.y)
      let alpha = BASE_ALPHA
      if (moveDist > LARGE_MOVE_THRESHOLD) {
        alpha = FAST_ALPHA
      } else if (moveDist < 3) {
        alpha = SLOW_ALPHA
      }

      const smoothed: Point = {
        x: previous.x + alpha * (current.x - previous.x),
        y: previous.y + alpha * (current.y - previous.y),
        timestamp: current.timestamp,
      }
      previous = smoothed
      return smoothed
    },
    reset() {
      previous = null
    },
  }
}

export function smoothPoint(
  current: Point,
  previous: Point | null,
  alpha = BASE_ALPHA,
): Point {
  if (!previous) return { ...current }
  return {
    x: previous.x + alpha * (current.x - previous.x),
    y: previous.y + alpha * (current.y - previous.y),
    timestamp: current.timestamp,
  }
}

export function resetSmoother(smoother: PointSmoother): void {
  smoother.reset()
}
