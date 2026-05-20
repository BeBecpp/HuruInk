import type { Point } from './drawing'

export type HandGesture =
  | 'none'
  | 'hover'
  | 'index-draw'
  | 'two-finger-eraser'
  | 'open-palm-pause'
  | 'fist'

export type TrackingStatus =
  | 'idle'
  | 'camera-loading'
  | 'no-hand'
  | 'hover'
  | 'drawing'
  | 'erasing'
  | 'paused'
  | 'error'

export type CursorMode = 'hover' | 'draw' | 'erase' | 'paused' | 'hidden'

export interface CursorState {
  x: number
  y: number
  visible: boolean
  mode: CursorMode
}

export interface HandTrackingDebug {
  fps: number
  handDetected: boolean
  pinchDistance: number
  gesture: HandGesture
  status: TrackingStatus
  cursorX: number
  cursorY: number
  strokeCount: number
  mediaPipeLoaded: boolean
  confidence: number
  rawHandCount: number
}

export interface NormalizedHandPoint {
  x: number
  y: number
}

export interface HandFrameResult {
  indexTip: Point | null
  isPinching: boolean
  pinchDistance: number
  confidence: number
  handDetected: boolean
  gesture: HandGesture
  isTwoFingerPinch: boolean
}
