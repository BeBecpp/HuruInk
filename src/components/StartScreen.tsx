interface StartScreenProps {
  onStart: () => void
  loading?: boolean
  error?: string | null
}

export function StartScreen({ onStart, loading, error }: StartScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#0a0a12] via-[#050508] to-[#0f0a14] p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">
        <h1 className="bg-gradient-to-r from-cyan-300 via-white to-pink-300 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent">
          HuruInk
        </h1>
        <p className="mt-2 text-center text-lg text-slate-400">
          Draw in the air.
        </p>

        <ol className="mt-8 space-y-3 text-sm text-slate-300">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-300">
              1
            </span>
            Raise your hand.
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-300">
              2
            </span>
            Move your index finger — the cursor follows.
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-500/20 text-xs font-bold text-pink-300">
              3
            </span>
            Point with index only (other fingers curled) to draw.
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-500/20 text-xs font-bold text-pink-300">
              4
            </span>
            Curl index finger to stop drawing.
          </li>
        </ol>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Extra gestures
          </p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>✌️ Index + middle up → eraser</li>
            <li>🖐 Open palm → pause</li>
            <li>✊ Fist (~1 sec) → undo last stroke</li>
          </ul>
        </div>

        {error && (
          <p className="mt-6 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={onStart}
          disabled={loading}
          className="mt-8 w-full rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-600/80 to-cyan-500/60 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-900/30 transition hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-60"
        >
          {loading ? 'Starting camera…' : 'Start Camera'}
        </button>

        <p className="mt-4 text-center text-xs text-slate-500">
          Requires webcam access. Best on desktop with good lighting.
        </p>
      </div>
    </div>
  )
}
