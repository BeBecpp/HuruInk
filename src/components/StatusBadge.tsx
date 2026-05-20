import type { TrackingStatus } from '../types/tracking'

interface StatusBadgeProps {
  status: TrackingStatus
  message?: string | null
}

const STATUS_CONFIG: Record<
  TrackingStatus,
  { label: string; className: string }
> = {
  idle: {
    label: 'Ready',
    className: 'bg-slate-800/80 text-slate-300 border-slate-600/50',
  },
  'camera-loading': {
    label: 'Starting camera…',
    className: 'bg-amber-900/50 text-amber-200 border-amber-600/40',
  },
  'no-hand': {
    label: 'No hand detected',
    className: 'bg-slate-800/80 text-slate-300 border-slate-600/50',
  },
  hover: {
    label: 'Hover — point index to draw',
    className: 'bg-cyan-900/40 text-cyan-200 border-cyan-500/40',
  },
  drawing: {
    label: 'Drawing',
    className: 'bg-pink-900/40 text-pink-200 border-pink-500/40',
  },
  erasing: {
    label: 'Erasing',
    className: 'bg-amber-900/40 text-amber-200 border-amber-500/40',
  },
  paused: {
    label: 'Paused',
    className: 'bg-violet-900/40 text-violet-200 border-violet-500/40',
  },
  error: {
    label: 'Error',
    className: 'bg-red-900/50 text-red-200 border-red-600/40',
  },
}

const HINTS: Partial<Record<TrackingStatus, string>> = {
  'no-hand':
    'Raise your hand 30–60 cm from the camera. Avoid bright light behind you.',
  hover: 'Point with index only to draw. ✌️ = eraser, 🖐 = pause, ✊ = undo.',
  drawing: 'Index finger drawing — curl other fingers to stop.',
  erasing: 'Index + middle up — move hand to erase.',
  paused: 'Close your palm to resume drawing.',
}

export function StatusBadge({ status, message }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const hint = message ?? HINTS[status]

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 max-w-xs rounded-2xl border px-4 py-3 backdrop-blur-xl ${config.className}`}
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-semibold tracking-wide">{config.label}</p>
      {hint && (
        <p className="mt-1 text-xs leading-relaxed text-white/70">{hint}</p>
      )}
    </div>
  )
}
