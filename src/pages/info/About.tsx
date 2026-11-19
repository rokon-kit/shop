import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '../../components/common/Button'
import { Breadcrumb } from '../../components/common/Breadcrumb'
import { ImageReveal, Reveal } from '../../components/common/Reveal'
import { SmartImage } from '../../components/common/SmartImage'
import { Newsletter } from '../../components/home/Newsletter'
import { JamdaniRule } from '../../components/home/FestiveEdit'
import { photo } from '../../data/photos'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const principles = [
  {
    n: '01',
    title: 'Fabric first',
    text: 'We design backwards from the weather. Linen, slub cotton and open weaves for nine months; brushed twill and loopback for the other three.',
  },
  {
    n: '02',
    title: 'Cut for us',
    text: 'Our blocks are drafted on South Asian bodies — shorter sleeves, a more forgiving shoulder, rises that sit where men actually wear their trousers.',
  },
  {
    n: '03',
    title: 'Made close to home',
    text: 'Four partner workshops in Narayanganj, Gazipur and Mirpur. We visit every month, pay on time, and put their names on our labels.',
  },
  {
    n: '04',
    title: 'Fewer, better',
    text: 'Four drops a year, no endless discounting. We would rather you buy one shirt you wear for five years than five you forget.',
  },
]

export default function About() {
  useDocumentTitle('Our story')
  return (
    <div>
      <section className="container-x pt-8 pb-16 md:pt-12 md:pb-24">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Our story' }]} />
        <Reveal className="mt-10 md:mt-16">
          <p className="label mb-6 text-taupe">সুতো — Suto — thread</p>
          <h1 className="display max-w-6xl text-[clamp(3.25rem,10vw,9.5rem)]">
            Every garment starts with a <span className="serif tracking-normal normal-case italic text-brick">single</span> thread.
          </h1>
        </Reveal>
      </section>

      <section className="relative">
        <ImageReveal className="aspect-[16/10] max-h-[48rem] w-full md:aspect-[21/9]">
          <SmartImage src={photo.dhakaAerial} alt="Aerial view of Dhaka with a canal winding between buildings" className="h-full w-full" sizes="100vw" widths={[960, 1600, 2400]} />
        </ImageReveal>
      </section>

      <section className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="label text-taupe">Founded 2024 · Banani, Dhaka</p>
        </Reveal>
        <div className="space-y-6 text-lg leading-relaxed lg:col-span-7 lg:col-start-6">
          <Reveal>
            <p className="serif text-3xl leading-snug md:text-4xl">
              SUTO began with a simple frustration: the shirts we wanted didn’t exist here, and the ones that did weren’t made for this weather — or for us.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-base text-smoke">
              Bangladesh dresses half the world. The factories outside Dhaka make clothes for the biggest names in fashion, yet walking into a shop at home
              meant choosing between fast fashion that fell apart and formalwear that felt like a costume. We wanted the middle: considered, modern menswear,
              designed and made entirely in Bangladesh, at prices that make sense here.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-base text-smoke">
              So we started where everything starts — with the thread. We source cotton and linen yarns we can trace, weave and dye with partners we know
              by name, and cut every pattern in our Banani studio. The panjabi our fathers wore, recut. The oxford shirt, made to breathe. Trousers with a
              rise that actually fits.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-bone py-20 md:py-28">
        <div className="container-x">
          <JamdaniRule className="mb-16 opacity-70" />
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <h2 className="display text-5xl md:text-7xl">What we believe</h2>
            </Reveal>
            <ol className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-8">
              {principles.map((p, i) => (
                <Reveal as="li" key={p.n} delay={i * 0.06} className="border-t border-ink/20 pt-6">
                  <p className="label tabular text-taupe">{p.n}</p>
                  <h3 className="serif mt-3 text-3xl">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-smoke">{p.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-4 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-7">
          <ImageReveal className="aspect-[4/3]">
            <SmartImage src={photo.atelier} alt="Pattern-cutting studio with dress forms and work tables" className="h-full w-full" sizes="(min-width: 768px) 58vw, 100vw" />
          </ImageReveal>
          <p className="label mt-3 text-taupe">The cutting room, Banani</p>
        </div>
        <div className="md:col-span-4 md:col-start-9 md:mt-32">
          <ImageReveal className="aspect-[4/5]" delay={0.1}>
            <SmartImage src={photo.tailorHands} alt="Tailor’s hands cutting fabric on a wooden table" className="h-full w-full" sizes="(min-width: 768px) 33vw, 100vw" />
          </ImageReveal>
          <p className="label mt-3 text-taupe">Hand-finishing, Mirpur</p>
          <Reveal className="mt-10">
            <p className="serif text-2xl leading-snug">“A good shirt should feel like it was made for you. Ours were made for here.”</p>
            <p className="label mt-4 text-taupe">— Ayaan Chowdhury, founder</p>
            <ButtonLink to="/new-arrivals" className="mt-8" icon={<ArrowRight className="h-4 w-4" strokeWidth={1.5} />}>
              Shop the collection
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <Newsletter />
    </div>
  )
}
