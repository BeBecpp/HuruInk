import { useCallback, useState } from 'react'
import type { GalleryItem } from '../types/drawing'

const GALLERY_KEY = 'huruink:v2:gallery'
const MAX_GALLERY_ITEMS = 9

function readGallery(): GalleryItem[] {
  try {
    const raw = window.localStorage.getItem(GALLERY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeGallery(items: GalleryItem[]) {
  window.localStorage.setItem(GALLERY_KEY, JSON.stringify(items))
}

export function useLocalGallery() {
  const [items, setItems] = useState<GalleryItem[]>(readGallery)

  const addItem = useCallback((item: GalleryItem) => {
    setItems((current) => {
      const next = [item, ...current].slice(0, MAX_GALLERY_ITEMS)
      writeGallery(next)
      return next
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((current) => {
      const next = current.filter((item) => item.id !== id)
      writeGallery(next)
      return next
    })
  }, [])

  const clearGallery = useCallback(() => {
    writeGallery([])
    setItems([])
  }, [])

  return { items, addItem, removeItem, clearGallery }
}
