import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Seo, { crumbs, ORG_ID } from '../components/Seo.jsx'
import { PageHero, PricingGrid, PricingTabs, CtaBand } from '../components/Blocks.jsx'
import { Reveal } from '../components/Motion.jsx'
import { SERVICES, priceOf } from '../data/services.js'
import { SITE, fmt } from '../data/site.js'
import { startingPrice } from './Services.jsx'

const WITH_PACKAGES = SERVICES.filter((s) => s.packages && s.slug !== 'website-rebuilding')
const OTHERS = SERVICES.filter((s) => !s.packages)

export default function Pricing() {
  const path = '/pricing'

  return (
    <>
      <Seo
        title="Pricing | Website, SEO & Marketing Packages in GBP"
        description="Transparent GBP pricing for UK businesses: websites from £150, e-commerce from £300, digital marketing from £150/month, SEO from £50/month and apps from £200."
        path={path}
        schema={[
          crumbs([['Home', '/'], ['Pricing', path]]),
          {
            '@context': 'https://schema.org',
            '@type': 'OfferCatalog',
            name: 'Digifier UK packages',
            provider: { '@id': ORG_ID },
            itemListElement: WITH_PACKAGES.flatMap((svc) =>
              svc.packages.filter((p) => p.price != null).map((p) => ({
                '@type': 'Offer',
                name: `${svc.title} – ${p.name}`,
                price: priceOf(p),
                priceCurrency: 'GBP',
                priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'GBP', valueAddedTaxIncluded: true },
                url: `${SITE.url}/services/${svc.slug}#pricing`,
              }))
            ),
          },
        ]}
      />
      <PageHero
        crumbs={[['Home', '/'], ['Pricing', path]]}
        eyebrow="Pricing"
        title="Simple, transparent pricing in GBP"
        text="Choose a package or ask for a custom plan. Every project starts with a free consultation."
      />
      <section className="section pt-0">
        <div className="container">
          <PricingTabs services={WITH_PACKAGES} label="Service" id="pricing" scroll heading="h2">
            {(s) => (
              <>
                <PricingGrid service={s} />
                {s.slug === 'website-design' && (
                  <p className="note">Website rebuilds use the same packages — <Link to="/services/website-rebuilding">learn about rebuilding</Link>.</p>
                )}
              </>
            )}
          </PricingTabs>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <Reveal as="h2" className="h2 center">Other services</Reveal>
          <div className="other-prices">
            {OTHERS.map((o) => (
              <Reveal key={o.slug}>
                <Link to={`/services/${o.slug}`} className="other-price">
                  <span className="h4">{o.title}</span>
                  <span className="op-right">{startingPrice(o)} <ArrowRight size={16} aria-hidden="true" /></span>
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="note center">
            All prices are in pounds sterling (GBP) and include VAT. SEO plans typically range £50–£500/month depending on scope.
            Final quotes are confirmed in writing before any work begins.
          </p>
        </div>
      </section>
      <CtaBand title="Not sure which plan fits?" text="Send us a WhatsApp message and we'll recommend the right package for your goals and budget." />
    </>
  )
}
