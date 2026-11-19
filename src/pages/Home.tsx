import { BestSellers } from '../components/home/BestSellers'
import { BrandStory } from '../components/home/BrandStory'
import { CategoryShowcase } from '../components/home/CategoryShowcase'
import { EditorialCollection } from '../components/home/EditorialCollection'
import { FestiveEdit } from '../components/home/FestiveEdit'
import { Hero } from '../components/home/Hero'
import { NewArrivals } from '../components/home/NewArrivals'
import { Newsletter } from '../components/home/Newsletter'
import { ServiceBar } from '../components/home/ServiceBar'
import { StyleGrid } from '../components/home/StyleGrid'
import { TrendingNow } from '../components/home/TrendingNow'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Home() {
  useDocumentTitle()
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <NewArrivals />
      <BrandStory />
      <BestSellers />
      <EditorialCollection />
      <FestiveEdit />
      <TrendingNow />
      <StyleGrid />
      <ServiceBar />
      <Newsletter />
    </>
  )
}
