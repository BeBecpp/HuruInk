import { useCallback, useEffect, useState } from 'react'
import { CameraCanvas } from './components/CameraCanvas'
import { GalleryPanel } from './components/GalleryPanel'
import { StartScreen } from './components/StartScreen'
import { Toolbar } from './components/Toolbar'
import { useCamera } from './hooks/useCamera'
import { useCanvasDrawing } from './hooks/useCanvasDrawing'
import { useLocalGallery } from './hooks/useLocalGallery'
import type { DrawingMode } from './types/drawing'

function App() {
  const camera = useCamera()
  const drawing = useCanvasDrawing()
  const gallery = useLocalGallery()
  const [showStartScreen, setShowStartScreen] = useState(true)
  const [cameraActive, setCameraActive] = useState(false)
  const [debugEnabled, setDebugEnabled] = useState(false)
  const [toolMode, setToolMode] = useState<DrawingMode>('draw')
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const handleStartFromWelcome = useCallback(async () => {
    const ok = await camera.startCamera()
    if (ok) setShowStartScreen(false)
  }, [camera])

  const handleStartCamera = useCallback(async () => {
    const ok = await camera.startCamera()
    if (ok) setShowStartScreen(false)
  }, [camera])

  const handleStopCamera = useCallback(() => {
    camera.stopCamera()
    setShowStartScreen(true)
    drawing.clear()
  }, [camera, drawing])

  const handleSave = useCallback(async () => {
    const dataUrl = await drawing.savePng()
    if (!dataUrl) return

    gallery.addItem({
      id: `${Date.now()}`,
      dataUrl,
      createdAt: new Date().toISOString(),
      strokeCount: drawing.strokeCount,
    })
    setSaveMessage('Saved PNG and added to local gallery')
    window.setTimeout(() => setSaveMessage(null), 2200)
  }, [drawing, gallery])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const tagName = target?.tagName.toLowerCase()
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        return
      }

      const key = event.key.toLowerCase()
      if (key === 'c') {
        drawing.clear()
      } else if (key === 's') {
        event.preventDefault()
        void handleSave()
      } else if (key === 'e') {
        setToolMode('erase')
      } else if (key === 'd') {
        setToolMode('draw')
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [drawing, handleSave])

  const startLoading = camera.status === 'loading'

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#07080a]">
      <header className="pointer-events-none fixed left-0 right-0 top-0 z-20 px-4 pt-4">
        <div className="mx-auto flex max-w-5xl items-start justify-between gap-4 rounded-[8px] border border-white/10 bg-zinc-950/65 px-4 py-3 shadow-2xl backdrop-blur-xl">
          <div>
            <p className="text-[11px] font-semibold uppercase text-cyan-200">
              Hack Club Stardance release
            </p>
            <h1 className="text-xl font-bold text-white sm:text-2xl">HuruInk v2</h1>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-400 sm:text-sm">
              Draw in the air with your webcam. Use Draw or Erase mode, tune
              the brush, save PNGs, and keep recent sketches in your browser.
            </p>
          </div>
          <div className="hidden text-right text-xs text-slate-500 sm:block">
            <p>C clear</p>
            <p>S save</p>
            <p>D draw / E erase</p>
          </div>
        </div>
      </header>

      <CameraCanvas
        showStartScreen={showStartScreen}
        debugEnabled={debugEnabled}
        toolMode={toolMode}
        onCameraActiveChange={setCameraActive}
        drawing={drawing}
        camera={camera}
      />

      {showStartScreen && (
        <StartScreen
          onStart={handleStartFromWelcome}
          loading={startLoading}
          error={camera.error}
        />
      )}

      <Toolbar
        cameraActive={cameraActive}
        brush={drawing.brush}
        mode={toolMode}
        canUndo={drawing.strokeCount > 0}
        debugEnabled={debugEnabled}
        onStartCamera={handleStartCamera}
        onStopCamera={handleStopCamera}
        onModeChange={setToolMode}
        onColorChange={drawing.setBrushColor}
        onSizeChange={drawing.setBrushSize}
        onUndo={drawing.undo}
        onClear={drawing.clear}
        onSave={handleSave}
        onToggleDebug={() => setDebugEnabled((d) => !d)}
      />

      <GalleryPanel
        items={gallery.items}
        onRemove={gallery.removeItem}
        onClear={gallery.clearGallery}
      />

      {saveMessage && (
        <div className="fixed left-1/2 top-28 z-50 -translate-x-1/2 rounded-[8px] border border-emerald-400/30 bg-emerald-950/80 px-4 py-2 text-sm text-emerald-100 shadow-2xl backdrop-blur-xl">
          {saveMessage}
        </div>
      )}
    </div>
  )
}

export default App
