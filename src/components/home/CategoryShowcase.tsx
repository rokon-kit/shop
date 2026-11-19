import { categoryBySlug } from '../../data/categories'
import { photo } from '../../data/photos'
import { byCategory } from '../../data/products'
import { Reveal } from '../common/Reveal'
import { SectionHeader } from '../common/SectionHeader'
import { CategoryCard } from './CategoryCard'

const tiles = [
  { slug: 'shirts', image: photo.campSage1, position: '50% 30%' },
  { slug: 'pants', image: photo.wideTrouser, position: '60% 70%' },
  { slug: 'panjabi', image: photo.pjRust, position: '50% 30%' },
  { slug: 't-shirts', image: photo.boxyStone1, position: '50% 30%' },
  { slug: 'outerwear', image: photo.suedeTrucker, position: '50% 25%' },
] as const

export function CategoryShowcase() {
  const [lead, ...rest] = tiles
  const leadCat = categoryBySlug[lead.slug]
  return (
    <section className="container-x py-20 md:py-28" aria-labelledby="categories-title">
      <SectionHeader
        index="01"
        eyebrow="Shop by category"
        title={<span id="categories-title">The wardrobe</span>}
        description="Five pillars, cut for this city. Everything we make starts with how it feels at four in the afternoon in Dhaka."
        action={{ label: 'Shop all', to: '/shop' }}
      />
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-12 lg:gap-4">
        <Reveal className="col-span-2 lg:col-span-6 lg:row-span-2">
          <CategoryCard
            to={`/shop/${lead.slug}`}
            name={leadCat.name}
            image={lead.image}
            imgPosition={lead.position}
            index="01"
            meta={`${byCategory(lead.slug).length} styles — ${leadCat.tagline}`}
            className="aspect-[4/3] h-full sm:aspect-[16/10] lg:aspect-auto"
            sizes="(min-width: 1024px) 50vw, 100vw"
            large
          />
        </Reveal>
        {rest.map((t, i) => {
          const cat = categoryBySlug[t.slug]
          return (
            <Reveal key={t.slug} delay={0.08 * (i + 1)} className="lg:col-span-3">
              <CategoryCard
                to={`/shop/${t.slug}`}
                name={cat.name}
                image={t.image}
                imgPosition={t.position}
                index={`0${i + 2}`}
                meta={`${byCategory(t.slug).length} styles`}
                className="aspect-[4/5]"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
