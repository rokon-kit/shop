import { ButtonLink } from '../components/common/Button'
import { Mark } from '../components/common/Logo'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <Mark className="h-10 w-16 text-ink" />
      <p className="label mt-8 text-taupe">Error 404</p>
      <h1 className="display mt-4 text-[clamp(3rem,10vw,8rem)]">Lost the thread.</h1>
      <p className="mt-5 max-w-md text-[0.9375rem] text-smoke">The page you’re looking for has moved, sold out, or never existed. Let’s get you somewhere useful.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/">Back to home</ButtonLink>
        <ButtonLink to="/new-arrivals" variant="secondary">
          New arrivals
        </ButtonLink>
      </div>
    </section>
  )
}
