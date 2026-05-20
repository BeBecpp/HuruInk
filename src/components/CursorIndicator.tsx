import type { CursorMode } from '../types/tracking'

interface CursorIndicatorProps {
  x: number
  y: number
  visible: boolean
  mode: CursorMode
  eraserSize?: number
}

export function CursorIndicator({
  x,
  y,
  visible,
  mode,
  eraserSize = 28,
}: CursorIndicatorProps) {
  if (!visible || mode === 'hidden') return null

  if (mode === 'erase') {
    const size = eraserSize
    return (
      <div
        className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-amber-300/80 bg-amber-400/25 shadow-[0_0_20px_6px_rgba(251,191,36,0.35)] transition-all duration-150"
        style={{ left: x, top: y, width: size, height: size }}
        aria-hidden
      />
    )
  }

  const isDrawing = mode === 'draw'
  const isPaused = mode === 'paused'
  const size = isDrawing ? 28 : 20

  const colorClass = isPaused
    ? 'bg-violet-400 shadow-[0_0_20px_6px_rgba(167,139,250,0.5)]'
    : isDrawing
      ? 'bg-pink-500 shadow-[0_0_24px_8px_rgba(244,114,182,0.65)]'
      : 'bg-cyan-400 shadow-[0_0_20px_6px_rgba(34,211,238,0.55)]'

  return (
    <div
      className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,box-shadow] duration-150"
      style={{ left: x, top: y, width: size, height: size }}
      aria-hidden
    >
      <div
        className={`h-full w-full rounded-full border-2 border-white/30 ${colorClass}`}
      />
      {!isPaused && (
        <div
          className={`absolute inset-1 rounded-full ${isDrawing ? 'bg-pink-300/40' : 'bg-cyan-200/30'}`}
        />
      )}
    </div>
  )
}
