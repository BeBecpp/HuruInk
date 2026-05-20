import { useCallback, useEffect, useRef, useState } from 'react'

export type CameraStatus = 'idle' | 'loading' | 'active' | 'error'

export interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement | null>
  status: CameraStatus
  error: string | null
  isActive: boolean
  startCamera: () => Promise<boolean>
  stopCamera: () => void
}

function getCameraErrorMessage(err: unknown): string {
  if (err instanceof DOMException) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      return 'Camera permission is required to draw in the air.'
    }
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      return 'No webcam available. Connect a camera and try again.'
    }
    if (err.name === 'NotReadableError') {
      return 'Your camera is in use by another application.'
    }
    if (err.name === 'SecurityError') {
      return 'Camera access requires a secure connection (HTTPS or localhost).'
    }
    return err.message || 'Could not access the camera.'
  }
  if (err instanceof Error) return err.message
  return 'Could not access the camera.'
}

export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<CameraStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const stopCamera = useCallback(() => {
    const stream = streamRef.current
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    const video = videoRef.current
    if (video) {
      video.srcObject = null
    }
    setStatus('idle')
    setError(null)
  }, [])

  const startCamera = useCallback(async (): Promise<boolean> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error')
      setError('Your browser does not support camera access.')
      return false
    }

    setStatus('loading')
    setError(null)

    try {
      stopCamera()
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })
      streamRef.current = stream

      const video = videoRef.current
      if (!video) {
        stream.getTracks().forEach((t) => t.stop())
        setStatus('error')
        setError('Video element is not ready.')
        return false
      }

      video.srcObject = stream
      video.muted = true
      video.playsInline = true

      await new Promise<void>((resolve, reject) => {
        const onReady = () => {
          video.removeEventListener('loadeddata', onReady)
          resolve()
        }
        const onError = () => {
          video.removeEventListener('error', onError)
          reject(new Error('Video failed to load.'))
        }
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          resolve()
          return
        }
        video.addEventListener('loadeddata', onReady)
        video.addEventListener('error', onError)
      })

      await video.play()
      setStatus('active')
      return true
    } catch (err) {
      stopCamera()
      setStatus('error')
      setError(getCameraErrorMessage(err))
      return false
    }
  }, [stopCamera])

  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  return {
    videoRef,
    status,
    error,
    isActive: status === 'active',
    startCamera,
    stopCamera,
  }
}
