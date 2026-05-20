import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { LM } from './gestures'

const MIN_HAND_CONFIDENCE = 0.25

/**
 * MediaPipe hand landmarks often report visibility ≈ 0 even when the hand is
 * clearly visible. Combine handedness score + visibility with a safe fallback.
 */
export function computeHandConfidence(
  landmarks: NormalizedLandmark[],
  handednessScore: number,
): number {
  if (!landmarks?.length) return 0

  const tips = [LM.INDEX_TIP, LM.MIDDLE_TIP, LM.RING_TIP, LM.PINKY_TIP, LM.THUMB_TIP]
  let maxVis = 0
  let sumVis = 0
  for (const idx of tips) {
    const v = landmarks[idx]?.visibility ?? 0
    maxVis = Math.max(maxVis, v)
    sumVis += v
  }
  const avgVis = sumVis / tips.length

  // Visibility not populated — trust handedness + valid landmark bounds
  if (maxVis < 0.05 && avgVis < 0.05) {
    return handednessScore
  }

  return Math.max(handednessScore, maxVis * 0.55 + avgVis * 0.45)
}

export function isHandAcceptable(
  landmarks: NormalizedLandmark[] | undefined,
  handednessScore: number,
): boolean {
  if (!landmarks || landmarks.length < 21) return false

  const index = landmarks[LM.INDEX_TIP]
  if (
    index.x < -0.05 ||
    index.x > 1.05 ||
    index.y < -0.05 ||
    index.y > 1.05
  ) {
    return false
  }

  return computeHandConfidence(landmarks, handednessScore) >= MIN_HAND_CONFIDENCE
}

export function getHandednessScore(
  result: { handedness: { score: number }[][] },
  handIdx: number,
): number {
  return result.handedness[handIdx]?.[0]?.score ?? 0.65
}
