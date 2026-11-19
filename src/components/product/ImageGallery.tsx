import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Expand, X, ZoomIn, ZoomOut } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { useEscape } from '../../hooks/useEscape'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useLockBody } from '../../hooks/useLockBody'
import { cn } from '../../utils/cn'
import { imageSrcSet, imageUrl } from '../../utils/image'
import { SmartImage } from '../common/SmartImage'

interface ImageGalleryProps {
  images: string[]
  alt: string
  badges?: React.ReactNode
}

const pad = (n: number) => String(n).padStart(2, '0')

export function ImageGallery({ images, alt, badges }: ImageGalleryProps) {
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null)
  const track = useRef<HTMLDivElement>(null)

  // Reset when the colourway (and so the image set) changes
  useEffect(() => {
    setIndex(0)
    track.current?.scrollTo({ left: 0 })
  }, [images])

  const go = useCallback((i: number) => setIndex((i + images.length) % images.length), [images.length])

  const onLens = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setLens({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  // Mobile: sync index from swipe position
  const onTrackScroll = () => {
    const el = track.current
    if (!el) return
    setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div className="lg:grid lg:grid-cols-[4.5rem_1fr] lg:gap-4">
      {/* Thumbnails (desktop) */}
      <ul className="hidden flex-col gap-2 lg:flex" aria-label="Product images">
        {images.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={cn('relative block w-full transition-opacity', i === index ? 'opacity-100' : 'opacity-50 hover:opacity-90')}
            >
              <SmartImage src={src} alt="" className="aspect-[4/5]" sizes="72px" widths={[160]} baseWidth={160} />
              <span className={cn('absolute inset-x-0 -bottom-1 h-px bg-ink transition-transform duration-300', i === index ? 'scale-x-100' : 'scale-x-0')} />
            </button>
          </li>
        ))}
      </ul>

      {/* Main image (desktop) with hover lens */}
      <div className="relative hidden lg:block">
        <div
          className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-bone"
          onMouseMove={onLens}
          onMouseLeave={() => setLens(null)}
          onClick={() => setLightbox(true)}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={images[index]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0"
            >
              <SmartImage
                src={images[index]}
                alt={`${alt} — image ${index + 1} of ${images.length}`}
                className="h-full w-full"
                imgClassName="transition-transform duration-300 ease-out"
                style={lens ? { transform: 'scale(1.9)', transformOrigin: `${lens.x}% ${lens.y}%` } : undefined}
                sizes="(min-width: 1280px) 46vw, 55vw"
                widths={[720, 960, 1280, 1600, 2000]}
                baseWidth={1280}
                priority={index === 0}
              />
            </motion.div>
          </AnimatePresence>
          {badges && <div className="pointer-events-none absolute top-4 left-4 z-[3] flex flex-col items-start gap-1.5">{badges}</div>}
          <span className="label pointer-events-none absolute bottom-4 left-4 z-[3] bg-paper/85 px-2 py-1 text-ink">
            <span className="tabular">{pad(index + 1)}</span> / {pad(images.length)}
          </span>
          <span className="pointer-events-none absolute right-4 bottom-4 z-[3] grid h-9 w-9 place-items-center bg-paper/85 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
            <Expand className="h-4 w-4" strokeWidth={1.5} />
          </span>
        </div>
        {images.length > 1 && (
          <div className="absolute top-1/2 right-4 left-4 z-[3] flex -translate-y-1/2 justify-between">
            <button type="button" onClick={() => go(index - 1)} className="grid h-11 w-11 place-items-center bg-paper/85 transition-colors hover:bg-paper" aria-label="Previous image">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => go(index + 1)} className="grid h-11 w-11 place-items-center bg-paper/85 transition-colors hover:bg-paper" aria-label="Next image">
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      {/* Mobile swipe gallery */}
      <div className="relative -mx-4 sm:-mx-6 lg:hidden">
        <div ref={track} onScroll={onTrackScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => {
                setIndex(i)
                setLightbox(true)
              }}
              className="w-full shrink-0 snap-center"
              aria-label={`Open image ${i + 1} fullscreen`}
            >
              <SmartImage src={src} alt={`${alt} — image ${i + 1}`} className="aspect-[4/5]" sizes="100vw" priority={i === 0} />
            </button>
          ))}
        </div>
        {badges && <div className="pointer-events-none absolute top-4 left-4 flex flex-col items-start gap-1.5">{badges}</div>}
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5" aria-hidden="true">
          {images.map((_, i) => (
            <span key={i} className={cn('h-[3px] rounded-full bg-paper transition-all duration-300', i === index ? 'w-6 opacity-100' : 'w-3 opacity-50')} />
          ))}
        </div>
      </div>

      <Lightbox open={lightbox} onClose={() => setLightbox(false)} images={images} index={index} onIndex={go} alt={alt} />
    </div>
  )
}

function Lightbox({
  open,
  onClose,
  images,
  index,
  onIndex,
  alt,
}: {
  open: boolean
  onClose: () => void
  images: string[]
  index: number
  onIndex: (i: number) => void
  alt: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  useLockBody(open)
  useEscape(open, onClose)
  useFocusTrap(ref, open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onIndex(index + 1)
      if (e.key === 'ArrowLeft') onIndex(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, index, onIndex])

  useEffect(() => setZoom(false), [index])

  const src = images[index]

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} — image viewer`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[120] flex flex-col bg-ivory"
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
            <span className="label tabular text-smoke">
              {pad(index + 1)} / {pad(images.length)}
            </span>
            <div className="flex gap-1">
              <button type="button" onClick={() => setZoom((z) => !z)} className="grid h-11 w-11 place-items-center hover:bg-bone" aria-label={zoom ? 'Zoom out' : 'Zoom in'}>
                {zoom ? <ZoomOut className="h-5 w-5" strokeWidth={1.4} /> : <ZoomIn className="h-5 w-5" strokeWidth={1.4} />}
              </button>
              <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center hover:bg-bone" aria-label="Close image viewer">
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>
          </div>

          <div
            className={cn('relative min-h-0 flex-1 overflow-hidden', zoom ? 'cursor-zoom-out' : 'cursor-zoom-in')}
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
              setZoom((z) => !z)
            }}
            onMouseMove={(e) => {
              if (!zoom) return
              const r = e.currentTarget.getBoundingClientRect()
              setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={src}
                src={imageUrl(src, 1600, 80)}
                srcSet={imageSrcSet(src, [960, 1600, 2400], 80)}
                sizes="100vw"
                alt={`${alt} — image ${index + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: zoom ? 2.2 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: origin }}
                className="mx-auto h-full w-auto max-w-full object-contain"
                draggable={false}
              />
            </AnimatePresence>
            {images.length > 1 && !zoom && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onIndex(index - 1)
                  }}
                  className="absolute top-1/2 left-3 grid h-12 w-12 -translate-y-1/2 place-items-center bg-paper/90 hover:bg-paper sm:left-6"
                  aria-label="Previous image"
                >
                  <ArrowLeft className="h-5 w-5" strokeWidth={1.4} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onIndex(index + 1)
                  }}
                  className="absolute top-1/2 right-3 grid h-12 w-12 -translate-y-1/2 place-items-center bg-paper/90 hover:bg-paper sm:right-6"
                  aria-label="Next image"
                >
                  <ArrowRight className="h-5 w-5" strokeWidth={1.4} />
                </button>
              </>
            )}
          </div>

          <ul className="flex shrink-0 justify-center gap-2 p-4">
            {images.map((s, i) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => onIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={cn('block w-12 transition-opacity', i === index ? 'opacity-100 outline outline-1 outline-offset-2 outline-ink' : 'opacity-50')}
                >
                  <SmartImage src={s} alt="" className="aspect-[4/5]" sizes="48px" widths={[120]} baseWidth={120} />
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
