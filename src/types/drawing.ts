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
