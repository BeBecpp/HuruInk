interface StartScreenProps {
  onStart: () => void
  loading?: boolean
  error?: string | null
}

export function StartScreen({ onStart, loading, error }: StartScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_top,#12313a_0,#07080a_38%,#050506_100%)] p-4 sm:p-6">
      <div className="w-full max-w-lg rounded-[8px] border border-white/10 bg-zinc-950/70 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
        <p className="text-center text-xs font-semibold uppercase text-cyan-200">
          HuruInk v2
        </p>
        <h1 className="mt-2 text-center text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Draw in the air
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-relaxed text-slate-400 sm:text-base">
          Use your webcam and hand gestures to sketch without touching the
          screen. Your drawings stay on your device.
        </p>

        <ol className="mt-7 grid gap-3 text-sm text-slate-300">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-cyan-500/20 text-xs font-bold text-cyan-200">
              1
            </span>
            Allow webcam access when your browser asks.
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-cyan-500/20 text-xs font-bold text-cyan-200">
              2
            </span>
            Raise one hand 30-60 cm from the camera.
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-pink-500/20 text-xs font-bold text-pink-200">
              3
            </span>
            Point with your index finger to use the selected Draw or Erase mode.
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-pink-500/20 text-xs font-bold text-pink-200">
              4
            </span>
            Save your canvas as a PNG when you like the result.
          </li>
        </ol>

        <div className="mt-6 rounded-[8px] border border-white/10 bg-white/5 p-4">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
            Shortcuts
          </p>
          <ul className="grid grid-cols-2 gap-2 text-sm text-slate-300">
            <li>D draw mode</li>
            <li>E erase mode</li>
            <li>C clear canvas</li>
            <li>S save PNG</li>
          </ul>
        </div>

        {error && (
          <p className="mt-6 rounded-[8px] border border-red-500/30 bg-red-950/60 px-4 py-3 text-sm leading-relaxed text-red-100">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={onStart}
          disabled={loading}
          className="mt-8 w-full rounded-[8px] border border-cyan-300/30 bg-cyan-400 px-6 py-4 text-base font-semibold text-zinc-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-70"
        >
          {loading ? 'Requesting camera access...' : 'Start camera'}
        </button>

        <p className="mt-4 text-center text-xs text-slate-500">
          Best with good lighting on localhost or HTTPS.
        </p>
      </div>
    </div>
  )
}
