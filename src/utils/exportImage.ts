export function formatExportFilename(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `huruink-doodle-${y}-${m}-${d}.png`
}

export function exportCanvasAsPng(
  canvas: HTMLCanvasElement,
  filename?: string,
): void {
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename ?? formatExportFilename()
    link.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}
