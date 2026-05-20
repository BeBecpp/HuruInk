import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import type { Point } from '../types/drawing'
import type { HandGesture, TrackingStatus } from '../types/tracking'
import { calculatePinchDistance, distance, dynamicPinchThreshold } from './geometry'

/** MediaPipe hand landmark indices */
export const LM = {
  WRIST: 0,
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,
  INDEX_MCP: 5,
  INDEX_PIP: 6,
  INDEX_DIP: 7,
  INDEX_TIP: 8,
  MIDDLE_MCP: 9,
  MIDDLE_PIP: 10,
  MIDDLE_DIP: 11,
  MIDDLE_TIP: 12,
  RING_MCP: 13,
  RING_PIP: 14,
  RING_DIP: 15,
  RING_TIP: 16,
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20,
} as const

export interface GestureDetectionResult {
  gesture: HandGesture
  cursorPoint: Point | null
  isPinching: boolean
  pinchDistance: number
  /** Index + middle tips pinched together (eraser active stroke) */
  isTwoFingerPinch: boolean
}

/** Wrist off-frame when hand is very close to camera — use finger MCP instead. */
function fingerAnchor(
  lm: NormalizedLandmark[],
  fingerMcp: number,
): NormalizedLandmark {
  const wrist = lm[LM.WRIST]
  const mcp = lm[fingerMcp]
  const wristUnreliable =
    (wrist.visibility ?? 0) < 0.12 ||
    wrist.x < 0.03 ||
    wrist.x > 0.97 ||
    wrist.y < 0.03 ||
    wrist.y > 0.97
  return wristUnreliable ? mcp : wrist
}

function fingerExtended(
  lm: NormalizedLandmark[],
  tip: number,
  pip: number,
  fingerMcp: number,
): boolean {
  const anchor = fingerAnchor(lm, fingerMcp)
  const tipDist = distance(lm[tip].x, lm[tip].y, anchor.x, anchor.y)
  const pipDist = distance(lm[pip].x, lm[pip].y, anchor.x, anchor.y)
  return tipDist > pipDist * 1.04
}

function fingerCurled(
  lm: NormalizedLandmark[],
  tip: number,
  pip: number,
  fingerMcp: number,
): boolean {
  const anchor = fingerAnchor(lm, fingerMcp)
  const tipDist = distance(lm[tip].x, lm[tip].y, anchor.x, anchor.y)
  const pipDist = distance(lm[pip].x, lm[pip].y, anchor.x, anchor.y)
  return tipDist < pipDist * 0.94
}

function midpointCanvas(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  canvasWidth: number,
  canvasHeight: number,
): Point {
  const mx = (ax + bx) / 2
  const my = (ay + by) / 2
  return {
    x: canvasWidth - mx * canvasWidth,
    y: my * canvasHeight,
  }
}

function indexTipCanvas(
  lm: NormalizedLandmark[],
  canvasWidth: number,
  canvasHeight: number,
): Point {
  const tip = lm[LM.INDEX_TIP]
  return {
    x: canvasWidth - tip.x * canvasWidth,
    y: tip.y * canvasHeight,
  }
}

/**
 * Detect active hand gesture with priority:
 * open palm (pause) > fist (undo) > two-finger (eraser) > index point (draw) > hover
 */
export function detectHandGesture(
  landmarks: NormalizedLandmark[],
  canvasWidth: number,
  canvasHeight: number,
): GestureDetectionResult {
  const indexExt = fingerExtended(
    landmarks,
    LM.INDEX_TIP,
    LM.INDEX_PIP,
    LM.INDEX_MCP,
  )
  const middleExt = fingerExtended(
    landmarks,
    LM.MIDDLE_TIP,
    LM.MIDDLE_PIP,
    LM.MIDDLE_MCP,
  )
  const ringExt = fingerExtended(
    landmarks,
    LM.RING_TIP,
    LM.RING_PIP,
    LM.RING_MCP,
  )
  const pinkyExt = fingerExtended(
    landmarks,
    LM.PINKY_TIP,
    LM.PINKY_PIP,
    LM.PINKY_MCP,
  )

  const indexCurled = fingerCurled(
    landmarks,
    LM.INDEX_TIP,
    LM.INDEX_PIP,
    LM.INDEX_MCP,
  )
  const middleCurled = fingerCurled(
    landmarks,
    LM.MIDDLE_TIP,
    LM.MIDDLE_PIP,
    LM.MIDDLE_MCP,
  )
  const ringCurled = fingerCurled(
    landmarks,
    LM.RING_TIP,
    LM.RING_PIP,
    LM.RING_MCP,
  )
  const pinkyCurled = fingerCurled(
    landmarks,
    LM.PINKY_TIP,
    LM.PINKY_PIP,
    LM.PINKY_MCP,
  )

  const pinchDist = calculatePinchDistance(
    landmarks[LM.INDEX_TIP].x,
    landmarks[LM.INDEX_TIP].y,
    landmarks[LM.THUMB_TIP].x,
    landmarks[LM.THUMB_TIP].y,
  )
  const pinchThreshold = dynamicPinchThreshold(
    landmarks[LM.WRIST].x,
    landmarks[LM.WRIST].y,
    landmarks[LM.INDEX_MCP].x,
    landmarks[LM.INDEX_MCP].y,
  )
  const twoFingerDist = calculatePinchDistance(
    landmarks[LM.INDEX_TIP].x,
    landmarks[LM.INDEX_TIP].y,
    landmarks[LM.MIDDLE_TIP].x,
    landmarks[LM.MIDDLE_TIP].y,
  )
  const twoFingerThreshold = pinchThreshold * 1.15
  const isTwoFingerPinch = twoFingerDist < twoFingerThreshold

  const extendedCount = [indexExt, middleExt, ringExt, pinkyExt].filter(Boolean).length

  // Open palm: 4 fingers extended
  if (extendedCount >= 4) {
    return {
      gesture: 'open-palm-pause',
      cursorPoint: indexTipCanvas(landmarks, canvasWidth, canvasHeight),
      isPinching: false,
      pinchDistance: pinchDist,
      isTwoFingerPinch: false,
    }
  }

  // Fist: all four fingers curled
  if (indexCurled && middleCurled && ringCurled && pinkyCurled) {
    return {
      gesture: 'fist',
      cursorPoint: null,
      isPinching: false,
      pinchDistance: pinchDist,
      isTwoFingerPinch: false,
    }
  }

  // Two-finger eraser: index + middle up, ring + pinky down
  if (indexExt && middleExt && !ringExt && !pinkyExt) {
    const cursorPoint = midpointCanvas(
      landmarks[LM.INDEX_TIP].x,
      landmarks[LM.INDEX_TIP].y,
      landmarks[LM.MIDDLE_TIP].x,
      landmarks[LM.MIDDLE_TIP].y,
      canvasWidth,
      canvasHeight,
    )
    return {
      gesture: 'two-finger-eraser',
      cursorPoint,
      isPinching: isTwoFingerPinch,
      pinchDistance: pinchDist,
      isTwoFingerPinch,
    }
  }

  // Index-only draw: point with index, other fingers curled
  if (indexExt && middleCurled && ringCurled && pinkyCurled) {
    return {
      gesture: 'index-draw',
      cursorPoint: indexTipCanvas(landmarks, canvasWidth, canvasHeight),
      isPinching: true,
      pinchDistance: pinchDist,
      isTwoFingerPinch: false,
    }
  }

  // Hover — index visible but not in point pose
  if (indexExt) {
    return {
      gesture: 'hover',
      cursorPoint: indexTipCanvas(landmarks, canvasWidth, canvasHeight),
      isPinching: false,
      pinchDistance: pinchDist,
      isTwoFingerPinch: false,
    }
  }

  return {
    gesture: 'none',
    cursorPoint: null,
    isPinching: false,
    pinchDistance: pinchDist,
    isTwoFingerPinch: false,
  }
}

export function gestureToTrackingStatus(
  gesture: HandGesture,
  handDetected: boolean,
): TrackingStatus {
  if (!handDetected) return 'no-hand'
  switch (gesture) {
    case 'open-palm-pause':
      return 'paused'
    case 'two-finger-eraser':
      return 'erasing'
    case 'index-draw':
      return 'drawing'
    case 'hover':
      return 'hover'
    case 'fist':
      return 'hover'
    default:
      return 'no-hand'
  }
}
