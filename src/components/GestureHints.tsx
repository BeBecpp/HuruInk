export function GestureHints() {
  return (
    <div className="pointer-events-none fixed right-4 bottom-24 z-30 hidden max-w-[200px] rounded-2xl border border-white/10 bg-black/55 p-3 text-xs text-slate-300 backdrop-blur-md lg:block">
      <p className="mb-2 font-semibold text-white/90">Gestures</p>
      <ul className="space-y-1.5 leading-relaxed">
        <li>
          <span className="text-pink-300">☝️ Index</span> point — draw
        </li>
        <li>
          <span className="text-amber-300">✌️ Two fingers</span> — eraser
        </li>
        <li>
          <span className="text-violet-300">🖐 Palm open</span> — pause
        </li>
        <li>
          <span className="text-slate-200">✊ Fist</span> — undo
        </li>
      </ul>
    </div>
  )
}
