export function formatExportFilename(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `huruink-doodle-${y}-${m}-${d}.png`
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}

export function canvasToPngDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png')
}

export function exportCanvasAsPng(
  canvas: HTMLCanvasElement,
  filename?: string,
): Promise<boolean> {
  return canvasToPngBlob(canvas).then((blob) => {
    if (!blob) return false
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename ?? formatExportFilename()
    link.click()
    URL.revokeObjectURL(url)
    return true
  })
}
