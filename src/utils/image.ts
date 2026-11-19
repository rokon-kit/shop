/**
 * Image helpers. Photography is served from Unsplash's imgix CDN so we can
 * request exactly the widths each layout needs (responsive srcset) instead of
 * shipping one oversized file.
 *
 * A source can carry a focal-point crop: `photo-id|x,y,zoom` (x/y in 0–1).
 * Those are rendered at a 4:5 product ratio and let a single photograph yield
 * extra "detail" frames for the gallery — collar, cuff, fabric.
 */
const UNSPLASH = 'https://images.unsplash.com/'

export const DEFAULT_WIDTHS = [360, 540, 720, 960, 1280, 1600]

interface Parsed {
  id: string
  focal?: { x: number; y: number; z: number }
}

function parse(src: string): Parsed {
  const [id, spec] = src.split('|')
  if (!spec) return { id }
  const [x, y, z] = spec.split(',').map(Number)
  return { id, focal: { x, y, z } }
}

function isUnsplash(id: string) {
  return id.startsWith('photo-') || id.startsWith(UNSPLASH)
}

export function imageUrl(src: string, width: number, quality = 72): string {
  const { id, focal } = parse(src)
  if (!isUnsplash(id)) return id
  const base = id.startsWith('photo-') ? `${UNSPLASH}${id}` : id.split('?')[0]
  let url = `${base}?auto=format&fit=crop&w=${width}&q=${quality}`
  if (focal) {
    url += `&h=${Math.round(width * 1.25)}&crop=focalpoint&fp-x=${focal.x}&fp-y=${focal.y}&fp-z=${focal.z}`
  }
  return url
}

export function imageSrcSet(src: string, widths: number[] = DEFAULT_WIDTHS, quality?: number): string | undefined {
  if (!isUnsplash(parse(src).id)) return undefined
  return widths.map((w) => `${imageUrl(src, w, quality)} ${w}w`).join(', ')
}
