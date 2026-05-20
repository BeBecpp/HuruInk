import type { ReactNode } from 'react'
import {
  Bug,
  Camera,
  CameraOff,
  Download,
  Eraser,
  Palette,
  Undo2,
} from 'lucide-react'
import type { BrushSettings } from '../types/drawing'

const PRESET_COLORS = [
  '#22d3ee',
  '#f472b6',
  '#a78bfa',
  '#fbbf24',
  '#4ade80',
  '#ffffff',
]

interface ToolbarProps {
  cameraActive: boolean
  brush: BrushSettings
  canUndo: boolean
  debugEnabled: boolean
  onStartCamera: () => void
  onStopCamera: () => void
  onColorChange: (color: string) => void
  onSizeChange: (size: number) => void
  onUndo: () => void
  onClear: () => void
  onSave: () => void
  onToggleDebug: () => void
}

export function Toolbar({
  cameraActive,
  brush,
  canUndo,
  debugEnabled,
  onStartCamera,
  onStopCamera,
  onColorChange,
  onSizeChange,
  onUndo,
  onClear,
  onSave,
  onToggleDebug,
}: ToolbarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 shadow-2xl backdrop-blur-xl sm:gap-3">
      {cameraActive ? (
        <ToolbarButton
          label="Stop camera"
          onClick={onStopCamera}
          icon={<CameraOff className="h-4 w-4" />}
        />
      ) : (
        <ToolbarButton
          label="Start camera"
          onClick={onStartCamera}
          icon={<Camera className="h-4 w-4" />}
        />
      )}

      <div className="hidden h-8 w-px bg-white/10 sm:block" />

      <div className="flex items-center gap-1.5">
        <Palette className="h-4 w-4 text-slate-400" aria-hidden />
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            title={`Color ${color}`}
            onClick={() => onColorChange(color)}
            className={`h-7 w-7 rounded-full border-2 transition hover:scale-110 ${
              brush.color === color
                ? 'border-white scale-110'
                : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Brush color ${color}`}
          />
        ))}
        <input
          type="color"
          value={brush.color}
          onChange={(e) => onColorChange(e.target.value)}
          className="h-7 w-7 cursor-pointer rounded-lg border-0 bg-transparent p-0"
          title="Custom color"
          aria-label="Custom brush color"
        />
      </div>

      <div className="flex min-w-[120px] items-center gap-2 px-1">
        <span className="text-xs text-slate-400">Size</span>
        <input
          type="range"
          min={2}
          max={24}
          value={brush.size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="h-1.5 w-20 cursor-pointer accent-cyan-400 sm:w-28"
          aria-label="Brush size"
        />
        <span className="w-5 text-xs tabular-nums text-slate-300">
          {brush.size}
        </span>
      </div>

      <div className="hidden h-8 w-px bg-white/10 sm:block" />

      <ToolbarButton
        label="Undo"
        onClick={onUndo}
        disabled={!canUndo}
        icon={<Undo2 className="h-4 w-4" />}
      />
      <ToolbarButton
        label="Clear"
        onClick={onClear}
        icon={<Eraser className="h-4 w-4" />}
      />
      <ToolbarButton
        label="Save PNG"
        onClick={onSave}
        icon={<Download className="h-4 w-4" />}
      />
      <ToolbarButton
        label="Debug"
        onClick={onToggleDebug}
        active={debugEnabled}
        icon={<Bug className="h-4 w-4" />}
      />
    </div>
  )
}

function ToolbarButton({
  label,
  onClick,
  icon,
  disabled,
  active,
}: {
  label: string
  onClick: () => void
  icon: ReactNode
  disabled?: boolean
  active?: boolean
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
        active
          ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-200'
          : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10'
      } disabled:cursor-not-allowed disabled:opacity-40`}
      aria-label={label}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  )
}
