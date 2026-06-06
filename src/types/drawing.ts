export interface Point {
  x: number
  y: number
  timestamp?: number
}

export interface Stroke {
  id: string
  points: Point[]
  color: string
  size: number
}

export interface BrushSettings {
  color: string
  size: number
}

export type DrawingMode = 'draw' | 'erase'

export interface GalleryItem {
  id: string
  dataUrl: string
  createdAt: string
  strokeCount: number
}
