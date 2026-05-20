import { cpSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'node_modules', '@mediapipe', 'tasks-vision', 'wasm')
const dest = join(root, 'public', 'mediapipe', 'wasm')

if (!existsSync(src)) {
  console.warn('[huruink] MediaPipe wasm not found, skip copy')
  process.exit(0)
}

mkdirSync(dest, { recursive: true })
cpSync(src, dest, { recursive: true })
console.log('[huruink] Copied MediaPipe wasm to public/mediapipe/wasm')
