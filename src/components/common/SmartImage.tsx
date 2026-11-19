import { useCallback, useState, type ImgHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'
import { imageSrcSet, imageUrl } from '../../utils/image'
import { Emblem } from './Logo'

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string
  alt: string
  /** Tailwind classes for the wrapper (controls size/aspect) */
  className?: string
  imgClassName?: string
  widths?: number[]
  sizes?: string
  priority?: boolean
  quality?: number
  /** Default width used for the plain `src` attribute */
  baseWidth?: number
}

/**
 * Responsive, lazy-loaded image with a soft fade-in and a branded fallback
 * if the remote photo fails to load.
 */
export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  widths,
  sizes = '100vw',
  priority = false,
  quality,
  baseWidth = 960,
  ...rest
}: SmartImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  // Cached images can finish before React attaches onLoad
  const ref = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) setStatus('loaded')
  }, [])

  // Defaults yield to caller-supplied positioning/background so classes never fight
  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className ?? '')
  const hasBg = /(^|\s)bg-/.test(className ?? '')

  return (
    <div className={cn('overflow-hidden', !positioned && 'relative', !hasBg && 'bg-bone', className)}>
      {status !== 'error' ? (
        <img
          ref={ref}
          src={imageUrl(src, baseWidth, quality)}
          srcSet={imageSrcSet(src, widths, quality)}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-700 ease-out',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
          {...rest}
        />
      ) : (
        <div role="img" aria-label={alt} className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bone text-sand">
          <Emblem className="h-10 w-10" />
          <span className="label text-taupe">SUTO</span>
        </div>
      )}
    </div>
  )
}
