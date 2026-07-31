import { mkdirSync } from 'fs'
import { join } from 'path'

// Resolves to <repo>/apps/api/uploads regardless of ts-node (src) or compiled (dist) execution
export const UPLOADS_DIR = join(__dirname, '..', '..', 'uploads')

mkdirSync(UPLOADS_DIR, { recursive: true })
