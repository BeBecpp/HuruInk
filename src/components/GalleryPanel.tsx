import { Download, Trash2 } from 'lucide-react'
import type { GalleryItem } from '../types/drawing'

interface GalleryPanelProps {
  items: GalleryItem[]
  onRemove: (id: string) => void
  onClear: () => void
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function GalleryPanel({ items, onRemove, onClear }: GalleryPanelProps) {
  return (
    <>
      <aside className="fixed right-3 top-24 z-30 hidden w-64 rounded-[8px] border border-white/10 bg-zinc-950/75 p-3 shadow-2xl backdrop-blur-xl xl:block">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Gallery</p>
            <p className="text-xs text-slate-400">
              {items.length} saved locally
            </p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-[6px] border border-white/10 px-2 py-1 text-xs text-slate-300 transition hover:bg-white/10"
            >
              Clear
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="rounded-[8px] border border-dashed border-white/10 px-3 py-8 text-center text-sm text-slate-500">
            Saved PNGs will appear here.
          </p>
        ) : (
          <div className="grid max-h-[52vh] gap-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <GalleryCard key={item.id} item={item} onRemove={onRemove} />
            ))}
          </div>
        )}
      </aside>

      {items.length > 0 && (
        <section className="fixed left-3 right-3 top-[5.5rem] z-30 rounded-[8px] border border-white/10 bg-zinc-950/75 p-2 shadow-2xl backdrop-blur-xl xl:hidden">
          <div className="flex gap-2 overflow-x-auto">
            {items.slice(0, 5).map((item) => (
              <a
                key={item.id}
                href={item.dataUrl}
                download={`huruink-gallery-${item.id}.png`}
                className="group relative h-16 w-24 shrink-0 overflow-hidden rounded-[6px] border border-white/10 bg-black"
                title="Download saved drawing"
              >
                <img
                  src={item.dataUrl}
                  alt={`Saved HuruInk drawing from ${formatTime(item.createdAt)}`}
                  className="h-full w-full object-contain"
                />
                <span className="absolute inset-x-0 bottom-0 bg-black/70 px-1 py-0.5 text-center text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                  Download
                </span>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

function GalleryCard({
  item,
  onRemove,
}: {
  item: GalleryItem
  onRemove: (id: string) => void
}) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.03]">
      <img
        src={item.dataUrl}
        alt={`Saved HuruInk drawing from ${formatTime(item.createdAt)}`}
        className="aspect-video w-full bg-black object-contain"
      />
      <div className="flex items-center justify-between gap-2 px-2 py-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-200">
            {formatTime(item.createdAt)}
          </p>
          <p className="text-[11px] text-slate-500">{item.strokeCount} strokes</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <a
            href={item.dataUrl}
            download={`huruink-gallery-${item.id}.png`}
            className="rounded-[6px] border border-white/10 p-2 text-slate-300 transition hover:bg-white/10"
            aria-label="Download saved drawing"
            title="Download"
          >
            <Download className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="rounded-[6px] border border-white/10 p-2 text-slate-300 transition hover:bg-white/10"
            aria-label="Remove saved drawing"
            title="Remove"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
