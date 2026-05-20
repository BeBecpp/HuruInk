import type { HandTrackingDebug } from '../types/tracking'

interface DebugPanelProps {
  debug: HandTrackingDebug
}

export function DebugPanel({ debug }: DebugPanelProps) {
  return (
    <div className="fixed right-4 top-4 z-50 w-56 rounded-xl border border-white/10 bg-black/70 p-3 font-mono text-xs text-slate-300 backdrop-blur-md">
      <p className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-widest text-cyan-400/90">
        Debug
      </p>
      <dl className="space-y-1">
        <Row label="FPS" value={debug.fps.toFixed(1)} />
        <Row
          label="Hand"
          value={debug.handDetected ? 'yes' : 'no'}
        />
        <Row label="Raw hands" value={String(debug.rawHandCount)} />
        <Row label="Confidence" value={debug.confidence.toFixed(2)} />
        <Row label="Pinch" value={debug.pinchDistance.toFixed(4)} />
        <Row label="Gesture" value={debug.gesture} />
        <Row label="Status" value={debug.status} />
        <Row
          label="Cursor"
          value={`${debug.cursorX.toFixed(0)}, ${debug.cursorY.toFixed(0)}`}
        />
        <Row label="Strokes" value={String(debug.strokeCount)} />
        <Row
          label="MediaPipe"
          value={debug.mediaPipeLoaded ? 'yes' : 'no'}
        />
      </dl>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right text-slate-200">{value}</dd>
    </div>
  )
}
