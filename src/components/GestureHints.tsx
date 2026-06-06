export function GestureHints() {
  return (
    <div className="pointer-events-none fixed left-4 bottom-24 z-30 hidden max-w-[220px] rounded-[8px] border border-white/10 bg-zinc-950/70 p-3 text-xs text-slate-300 backdrop-blur-md lg:block">
      <p className="mb-2 font-semibold text-white/90">Gestures</p>
      <ul className="space-y-1.5 leading-relaxed">
        <li>
          <span className="text-cyan-200">Index point</span> uses selected tool
        </li>
        <li>
          <span className="text-amber-200">Two fingers</span> erases quickly
        </li>
        <li>
          <span className="text-violet-200">Open palm</span> pauses
        </li>
        <li>
          <span className="text-slate-200">Fist</span> undoes last stroke
        </li>
      </ul>
    </div>
  )
}
