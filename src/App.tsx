import { useCallback, useState } from 'react'
import { CameraCanvas } from './components/CameraCanvas'
import { StartScreen } from './components/StartScreen'
import { Toolbar } from './components/Toolbar'
import { useCamera } from './hooks/useCamera'
import { useCanvasDrawing } from './hooks/useCanvasDrawing'

function App() {
  const camera = useCamera()
  const drawing = useCanvasDrawing()
  const [showStartScreen, setShowStartScreen] = useState(true)
  const [cameraActive, setCameraActive] = useState(false)
  const [debugEnabled, setDebugEnabled] = useState(false)

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

  const startLoading = camera.status === 'loading'

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#050508] via-[#0a0a12] to-[#120a14]">
      <header className="pointer-events-none fixed left-0 right-0 top-0 z-20 flex justify-center pt-5">
        <div className="text-center">
          <h1 className="text-lg font-bold tracking-tight text-white/90 sm:text-xl">
            HuruInk
          </h1>
          <p className="text-xs text-slate-500">Draw in the air.</p>
        </div>
      </header>

      <CameraCanvas
        showStartScreen={showStartScreen}
        debugEnabled={debugEnabled}
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
        canUndo={drawing.strokeCount > 0}
        debugEnabled={debugEnabled}
        onStartCamera={handleStartCamera}
        onStopCamera={handleStopCamera}
        onColorChange={drawing.setBrushColor}
        onSizeChange={drawing.setBrushSize}
        onUndo={drawing.undo}
        onClear={drawing.clear}
        onSave={drawing.savePng}
        onToggleDebug={() => setDebugEnabled((d) => !d)}
      />
    </div>
  )
}

export default App
