import { MessageCircle, RefreshCcw, ShieldCheck, Truck } from 'lucide-react'
import { cn } from '../../utils/cn'

const services = [
  { icon: Truck, title: 'Free delivery', text: 'On orders above ৳2,500' },
  { icon: RefreshCcw, title: 'Easy exchange', text: '7-day exchange, in store or by courier' },
  { icon: ShieldCheck, title: 'Secure payment', text: 'bKash, Nagad, cards & COD' },
  { icon: MessageCircle, title: 'Support', text: '7 days a week, 10am – 9pm' },
]

export function ServiceBar({ className }: { className?: string }) {
  return (
    <section aria-label="Our service" className={cn('border-y border-line', className)}>
      <ul className="container-x grid grid-cols-2 lg:grid-cols-4">
        {services.map(({ icon: Icon, title, text }, i) => (
          <li
            key={title}
            className={cn(
              'flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:gap-4 md:py-10',
              i % 2 === 1 && 'border-l border-line pl-4 sm:pl-6',
              i >= 2 && 'border-t border-line lg:border-t-0',
              i === 2 && 'lg:border-l lg:pl-6',
              i > 0 && 'lg:pl-8',
            )}
          >
            <Icon className="h-6 w-6 shrink-0" strokeWidth={1.2} aria-hidden="true" />
            <div>
              <h3 className="label text-ink">{title}</h3>
              <p className="mt-1 text-[0.8125rem] leading-snug text-smoke">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
