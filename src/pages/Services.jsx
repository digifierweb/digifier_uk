import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Seo, { crumbs } from '../components/Seo.jsx'
import { PageHero, CtaBand } from '../components/Blocks.jsx'
import { Stagger, Tilt } from '../components/Motion.jsx'
import { ServiceIcon } from '../components/Icons.jsx'
import { SERVICES, priceOf } from '../data/services.js'
import { fmt, SITE } from '../data/site.js'

export function startingPrice(s) {
  if (s.fromPrice) return `From ${fmt(s.fromPrice.price)}${s.fromPrice.per}`
  const prices = (s.packages || []).map(priceOf).filter((p) => p != null)
  if (!prices.length) return 'Custom quote'
  const per = s.packages.find((p) => priceOf(p) === Math.min(...prices))?.per || ''
  return `From ${fmt(Math.min(...prices))}${per}`
}

export default function Services() {
  const path = '/services'
  return (
    <>
      <Seo
        title="Digital Marketing & Web Services UK"
        description="Explore Digifier's services: website design, e-commerce, SEO, digital marketing, AI content, app development, marketplace management and custom software for UK businesses."
        path={path}
        schema={[
          crumbs([['Home', '/'], ['Services', path]]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: SERVICES.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE.url}/services/${s.slug}`, name: s.title })),
          },
        ]}
      />
      <PageHero
        crumbs={[['Home', '/'], ['Services', path]]}
        eyebrow="Our services"
        title="Everything you need to grow online"
        text="From your first website to full-funnel marketing and custom software — one strategic partner, transparent GBP pricing."
      />
      <section className="section pt-0">
        <div className="container">
          <Stagger className="service-list" each={0.07}>
            {SERVICES.map((s, i) => (
              <Tilt key={s.slug} className="service-row" max={3}>
                <Link to={`/services/${s.slug}`} className="service-row-link">
                  <span className="bento-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="icon-wrap"><ServiceIcon name={s.icon} size={26} /></span>
                  <div className="service-row-body">
                    <h2 className="h3">{s.title}</h2>
                    <p>{s.short}</p>
                    <ul className="tag-list">
                      {s.features.slice(0, 4).map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                  <div className="service-row-price">
                    <span>{startingPrice(s)}</span>
                    <span className="round-arrow"><ArrowUpRight size={20} aria-hidden="true" /></span>
                  </div>
                </Link>
              </Tilt>
            ))}
          </Stagger>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
