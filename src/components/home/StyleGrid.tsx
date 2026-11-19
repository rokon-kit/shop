import { Heart } from 'lucide-react'
import { instagramPosts, social } from '../../data/content'
import { cn } from '../../utils/cn'
import { InstagramIcon } from '../common/Icons'
import { Reveal } from '../common/Reveal'
import { SmartImage } from '../common/SmartImage'

export function StyleGrid() {
  const ig = social[0]
  return (
    <section className="overflow-hidden border-t border-line py-20 md:py-28" aria-labelledby="ig-title">
      <div className="container-x">
        <Reveal className="mb-10 flex flex-col items-start gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label mb-4 flex items-center gap-3 text-taupe">
              <span className="tabular">08</span>
              <span className="h-px w-8 bg-current opacity-50" aria-hidden="true" />
              Community
            </p>
            <h2 id="ig-title" className="display text-[2.5rem] sm:text-6xl lg:text-7xl">
              Worn <span className="serif tracking-normal normal-case italic">your</span> way
            </h2>
          </div>
          <a href={ig.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3">
            <InstagramIcon className="h-5 w-5" />
            <span className="serif text-2xl link-u md:text-3xl">{ig.handle}</span>
          </a>
        </Reveal>

        <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-6">
          {instagramPosts.map((post, i) => (
            <Reveal as="li" key={post.image} delay={i * 0.05} className={cn(i % 2 === 1 && 'lg:mt-14', i % 3 === 2 && 'md:mt-8 lg:mt-0')}>
              <a href={ig.href} target="_blank" rel="noreferrer" className="group relative block aspect-[4/5] overflow-hidden" aria-label={`Instagram post: ${post.caption}`}>
                <SmartImage
                  src={post.image}
                  alt={post.caption}
                  className="absolute inset-0"
                  imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                  sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                  widths={[360, 540, 720]}
                />
                <div className="absolute inset-0 flex flex-col justify-between bg-ink/0 p-3 text-paper opacity-0 transition-all duration-500 group-hover:bg-ink/55 group-hover:opacity-100 group-focus-visible:bg-ink/55 group-focus-visible:opacity-100">
                  <InstagramIcon className="h-4 w-4 self-end" />
                  <div>
                    <p className="text-xs leading-snug">{post.caption}</p>
                    <p className="mt-2 flex items-center gap-1 text-[0.6875rem] text-paper/80">
                      <Heart className="h-3 w-3 fill-current" strokeWidth={0} /> {post.likes}
                    </p>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </ul>
        <p className="mt-10 text-center text-sm text-smoke">
          Tag <span className="font-medium text-ink">{ig.handle}</span> or <span className="font-medium text-ink">#WornYourWay</span> to be featured.
        </p>
      </div>
    </section>
  )
}
