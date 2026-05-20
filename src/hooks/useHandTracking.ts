import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  FilesetResolver,
  HandLandmarker,
  type HandLandmarkerResult,
} from '@mediapipe/tasks-vision'
import type { Point } from '../types/drawing'
import type { HandFrameResult, HandGesture, TrackingStatus } from '../types/tracking'
import {
  detectHandGesture,
  gestureToTrackingStatus,
} from '../utils/gestures'
import {
  computeHandConfidence,
  getHandednessScore,
  isHandAcceptable,
} from '../utils/handQuality'
import { createPointSmoother, type PointSmoother } from '../utils/smoothing'

const WASM_CDN =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
const WASM_LOCAL = `${import.meta.env.BASE_URL}mediapipe/wasm`
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

const MP_CONFIDENCE = 0.25

export interface HandTrackingRefs {
  cursor: React.MutableRefObject<Point | null>
  isPinching: React.MutableRefObject<boolean>
  pinchDistance: React.MutableRefObject<number>
  handDetected: React.MutableRefObject<boolean>
  confidence: React.MutableRefObject<number>
  trackingStatus: React.MutableRefObject<TrackingStatus>
  gesture: React.MutableRefObject<HandGesture>
  isTwoFingerPinch: React.MutableRefObject<boolean>
  rawHandCount: React.MutableRefObject<number>
}

export interface UseHandTrackingOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>
  enabled: boolean
  canvasWidth: number
  canvasHeight: number
  onFrame?: (result: HandFrameResult) => void
}

export interface UseHandTrackingResult {
  refs: HandTrackingRefs
  mediaPipeLoaded: boolean
  mediaPipeError: string | null
  startLoop: () => void
  stopLoop: () => void
  resetTracking: () => void
}

function pickBestHand(result: HandLandmarkerResult): number {
  if (result.landmarks.length === 0) return -1
  if (result.landmarks.length === 1) return 0

  let bestIdx = 0
  let bestScore = -1
  for (let i = 0; i < result.landmarks.length; i++) {
    const score = getHandednessScore(result, i)
    if (score > bestScore) {
      bestScore = score
      bestIdx = i
    }
  }
  return bestIdx
}

async function loadWasmFileset() {
  try {
    return await FilesetResolver.forVisionTasks(WASM_LOCAL)
  } catch {
    return await FilesetResolver.forVisionTasks(WASM_CDN)
  }
}

export function useHandTracking(
  options: UseHandTrackingOptions,
): UseHandTrackingResult {
  const { videoRef, enabled, canvasWidth, canvasHeight, onFrame } = options

  const landmarkerRef = useRef<HandLandmarker | null>(null)
  const rafRef = useRef<number | null>(null)
  const smootherRef = useRef<PointSmoother>(createPointSmoother())
  const lastVideoTimeRef = useRef(-1)
  const detectTimestampRef = useRef(0)

  const [mediaPipeLoaded, setMediaPipeLoaded] = useState(false)
  const [mediaPipeError, setMediaPipeError] = useState<string | null>(null)

  const cursorRef = useRef<Point | null>(null)
  const isPinchingRef = useRef(false)
  const pinchDistanceRef = useRef(0)
  const handDetectedRef = useRef(false)
  const confidenceRef = useRef(0)
  const trackingStatusRef = useRef<TrackingStatus>('idle')
  const gestureRef = useRef<HandGesture>('none')
  const isTwoFingerPinchRef = useRef(false)
  const rawHandCountRef = useRef(0)

  const refs = useMemo<HandTrackingRefs>(
    () => ({
      cursor: cursorRef,
      isPinching: isPinchingRef,
      pinchDistance: pinchDistanceRef,
      handDetected: handDetectedRef,
      confidence: confidenceRef,
      trackingStatus: trackingStatusRef,
      gesture: gestureRef,
      isTwoFingerPinch: isTwoFingerPinchRef,
      rawHandCount: rawHandCountRef,
    }),
    [],
  )

  const resetTracking = useCallback(() => {
    smootherRef.current.reset()
    cursorRef.current = null
    isPinchingRef.current = false
    pinchDistanceRef.current = 0
    handDetectedRef.current = false
    confidenceRef.current = 0
    trackingStatusRef.current = 'no-hand'
    gestureRef.current = 'none'
    isTwoFingerPinchRef.current = false
    rawHandCountRef.current = 0
    lastVideoTimeRef.current = -1
    detectTimestampRef.current = 0
  }, [])

  useEffect(() => {
    let cancelled = false

    async function createLandmarker(delegate: 'GPU' | 'CPU') {
      const wasm = await loadWasmFileset()
      return HandLandmarker.createFromOptions(wasm, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate,
        },
        runningMode: 'VIDEO',
        numHands: 2,
        minHandDetectionConfidence: MP_CONFIDENCE,
        minHandPresenceConfidence: MP_CONFIDENCE,
        minTrackingConfidence: MP_CONFIDENCE,
      })
    }

    async function init() {
      try {
        let landmarker: HandLandmarker
        try {
          landmarker = await createLandmarker('GPU')
        } catch {
          landmarker = await createLandmarker('CPU')
        }
        if (cancelled) {
          landmarker.close()
          return
        }
        landmarkerRef.current = landmarker
        setMediaPipeLoaded(true)
        setMediaPipeError(null)
      } catch (err) {
        if (cancelled) return
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load hand tracking. Check your connection.'
        setMediaPipeError(message)
        setMediaPipeLoaded(false)
      }
    }

    init()

    return () => {
      cancelled = true
      landmarkerRef.current?.close()
      landmarkerRef.current = null
      setMediaPipeLoaded(false)
    }
  }, [])

  const processFrame = useCallback(() => {
    const video = videoRef.current
    const landmarker = landmarkerRef.current

    if (!enabled || !video || !landmarker) {
      return
    }

    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      return
    }

    if (canvasWidth <= 0 || canvasHeight <= 0) return

    if (video.currentTime === lastVideoTimeRef.current) return
    lastVideoTimeRef.current = video.currentTime

    detectTimestampRef.current += 33
    const timestamp = detectTimestampRef.current

    let result: HandLandmarkerResult
    try {
      result = landmarker.detectForVideo(video, timestamp)
    } catch {
      handDetectedRef.current = false
      trackingStatusRef.current = 'no-hand'
      gestureRef.current = 'none'
      rawHandCountRef.current = 0
      return
    }

    rawHandCountRef.current = result.landmarks.length

    const handIdx = pickBestHand(result)

    if (handIdx < 0) {
      handDetectedRef.current = false
      isPinchingRef.current = false
      cursorRef.current = null
      trackingStatusRef.current = 'no-hand'
      gestureRef.current = 'none'
      isTwoFingerPinchRef.current = false
      smootherRef.current.reset()
      onFrame?.({
        indexTip: null,
        isPinching: false,
        pinchDistance: 0,
        confidence: 0,
        handDetected: false,
        gesture: 'none',
        isTwoFingerPinch: false,
      })
      return
    }

    const landmarks = result.landmarks[handIdx]
    const handednessScore = getHandednessScore(result, handIdx)
    const confidence = computeHandConfidence(landmarks, handednessScore)
    confidenceRef.current = confidence

    if (!isHandAcceptable(landmarks, handednessScore)) {
      handDetectedRef.current = false
      isPinchingRef.current = false
      trackingStatusRef.current = 'no-hand'
      gestureRef.current = 'none'
      isTwoFingerPinchRef.current = false
      smootherRef.current.reset()
      onFrame?.({
        indexTip: null,
        isPinching: false,
        pinchDistance: pinchDistanceRef.current,
        confidence,
        handDetected: false,
        gesture: 'none',
        isTwoFingerPinch: false,
      })
      return
    }

    const detected = detectHandGesture(landmarks, canvasWidth, canvasHeight)
    gestureRef.current = detected.gesture
    isPinchingRef.current = detected.isPinching
    pinchDistanceRef.current = detected.pinchDistance
    isTwoFingerPinchRef.current = detected.isTwoFingerPinch

    let smoothed: Point | null = null
    if (detected.cursorPoint && detected.gesture !== 'fist') {
      smoothed = smootherRef.current.smooth({
        ...detected.cursorPoint,
        timestamp,
      })
    } else {
      smootherRef.current.reset()
    }

    handDetectedRef.current = true
    cursorRef.current = smoothed
    trackingStatusRef.current = gestureToTrackingStatus(
      detected.gesture,
      true,
    )

    onFrame?.({
      indexTip: smoothed,
      isPinching: detected.isPinching,
      pinchDistance: detected.pinchDistance,
      confidence,
      handDetected: true,
      gesture: detected.gesture,
      isTwoFingerPinch: detected.isTwoFingerPinch,
    })
  }, [videoRef, enabled, canvasWidth, canvasHeight, onFrame])

  const loop = useCallback(() => {
    processFrame()
    rafRef.current = requestAnimationFrame(loop)
  }, [processFrame])

  const startLoop = useCallback(() => {
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  const stopLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    resetTracking()
  }, [resetTracking])

  useEffect(() => {
    if (enabled) {
      startLoop()
    } else {
      stopLoop()
    }
    return () => stopLoop()
  }, [enabled, startLoop, stopLoop])

  return {
    refs,
    mediaPipeLoaded,
    mediaPipeError,
    startLoop,
    stopLoop,
    resetTracking,
  }
}
