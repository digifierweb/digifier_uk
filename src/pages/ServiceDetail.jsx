import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, ArrowUpRight } from 'lucide-react'
import Seo, { crumbs, faqSchema, ORG_ID } from '../components/Seo.jsx'
import { PageHero, PricingGrid, SectionHead, Faq, CtaBand } from '../components/Blocks.jsx'
import { Reveal, Stagger, Item, Magnetic } from '../components/Motion.jsx'
import { ServiceIcon, WhatsAppIcon } from '../components/Icons.jsx'
import { SERVICES, getService, priceOf } from '../data/services.js'
import { SITE, fmt, waLink, VAT_LABEL } from '../data/site.js'
import { PROCESS } from '../data/content.js'
import NotFound from './NotFound.jsx'

function offers(s) {
  if (s.fromPrice) {
    return [{ '@type': 'Offer', priceCurrency: 'GBP', priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'GBP', valueAddedTaxIncluded: true }, price: s.fromPrice.price, description: `From ${fmt(s.fromPrice.price)}${s.fromPrice.per}` }]
  }
  return (s.packages || [])
    .filter((p) => p.price != null)
    .map((p) => ({ '@type': 'Offer', name: p.name, priceCurrency: 'GBP', priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'GBP', valueAddedTaxIncluded: true }, price: priceOf(p), url: `${SITE.url}/services/${s.slug}#pricing` }))
}

// Services without hand-written FAQs get questions answered straight from their package data.
function dataFaqs(s) {
  const priced = (s.packages || []).filter((p) => priceOf(p) != null)
  const cost = priced.length
    ? `Packages start at ${fmt(Math.min(...priced.map(priceOf)))} (${VAT_LABEL}): ${priced.map((p) => `${p.name} ${fmt(priceOf(p))}${p.per || ''}`).join(', ')}. Your written quote confirms the final price before any work starts.`
    : s.fromPrice
      ? `Plans start from ${fmt(s.fromPrice.price)}${s.fromPrice.per} (${VAT_LABEL}). Your written quote confirms the final price before any work starts.`
      : `Every project is scoped individually. After a free consultation we send a fixed GBP quote${SITE.pricesIncludeVat ? ', including VAT,' : ''} before any work starts.`
  const faqs = [[`How much does ${s.title.toLowerCase()} cost?`, cost]]
  const pkg = (s.packages || []).find((p) => p.popular) || s.packages?.[0]
  if (pkg) faqs.push([`What is included in the ${pkg.name} package?`, `${pkg.features.join('; ')}.`])
  faqs.push([
    'How do I get started?',
    `Message us on WhatsApp (${SITE.phoneDisplay}) or send an enquiry through our contact page. We will arrange a free consultation, then send a written quote.`,
  ])
  return faqs
}

export default function ServiceDetail() {
  const { slug } = useParams()
  const s = getService(slug)
  if (!s) return <NotFound />
  const path = `/services/${s.slug}`
  const faqs = s.faqs
    ? s.faqs.map(([q, a]) => [q, a.replace('{from}', fmt(s.fromPrice?.price || 0)).replace('{to}', fmt(s.fromPrice?.upTo || 0))])
    : dataFaqs(s)
  const process = s.process || PROCESS.map(([t, , d]) => [t, d])
  const related = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3)

  const schema = [
    crumbs([['Home', '/'], ['Services', '/services'], [s.title, path]]),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: s.title,
      serviceType: s.title,
      description: s.seoDescription,
      url: SITE.url + path,
      provider: { '@id': ORG_ID },
      areaServed: { '@type': 'Country', name: 'United Kingdom' },
      offers: offers(s),
    },
  ]
  if (faqs.length) schema.push(faqSchema(faqs))

  return (
    <>
      <Seo title={s.seoTitle} description={s.seoDescription} path={path} schema={schema} />
      <PageHero crumbs={[['Home', '/'], ['Services', '/services'], [s.title, path]]} eyebrow={s.title} title={s.short} text={s.intro}>
        <Reveal className="btn-row" delay={0.3}>
          <Magnetic>
            <a className="btn btn-whatsapp btn-lg" href={waLink(`Hi Digifier, I'd like to discuss ${s.title}.`)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={20} /> Discuss on WhatsApp
            </a>
          </Magnetic>
          {s.packages && (
            <a href="#pricing" className="btn btn-outline btn-lg">View pricing</a>
          )}
        </Reveal>
      </PageHero>

      <section className="section pt-0">
        <div className="container detail-grid">
          <div>
            <SectionHead eyebrow="What's included" title={`Our ${s.title.toLowerCase()} service`} />
            <Stagger as="ul" className="check-list" each={0.06}>
              {s.features.map((f) => (
                <Item as="li" key={f}><CheckCircle2 size={20} aria-hidden="true" /> {f}</Item>
              ))}
            </Stagger>
          </div>
          <Reveal className="detail-card">
            <span className="icon-wrap lg"><ServiceIcon name={s.icon} size={34} /></span>
            {s.benefits ? (
              <>
                <h2 className="h4">Why it works</h2>
                <ul className="benefit-list">
                  {s.benefits.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </>
            ) : (
              <>
                <h2 className="h4">Free consultation</h2>
                <p>Not sure which package fits? We'll review your goals and recommend the right plan — no obligation.</p>
              </>
            )}
            <Link to="/contact" className="btn btn-primary btn-block">Get a free consultation <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </Reveal>
        </div>
      </section>

      {process && (
        <section className="section alt">
          <div className="container">
            <SectionHead eyebrow="Approach" title="How we deliver" />
            <Stagger className={`steps cols-${process.length}`} each={0.08}>
              {process.map(([t, d], i) => (
                <Item key={t} className="step-card">
                  <span className="why-num">0{i + 1}</span>
                  <h3 className="h4">{t}</h3>
                  <p>{d}</p>
                </Item>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <section className="section" id="pricing">
        <div className="container">
          {s.packages ? (
            <>
              <SectionHead eyebrow="Pricing" title={`${s.title} packages`} text="Click a package to start the conversation on WhatsApp." center />
              <PricingGrid service={s} />
            </>
          ) : s.fromPrice ? (
            <Reveal className="quote-card">
              <p className="eyebrow">Pricing</p>
              <h2 className="h2">From <span className="grad-text">{fmt(s.fromPrice.price)}</span>{s.fromPrice.per}</h2>
              <p className="lead">Plans are tailored to your goals, competition and website. Start with a free audit so you know exactly what needs doing and why.</p>
              <a className="btn btn-whatsapp btn-lg" href={waLink(`Hi Digifier, I'd like a free ${s.title} audit.`)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={20} /> Get your free audit
              </a>
            </Reveal>
          ) : (
            <Reveal className="quote-card">
              <p className="eyebrow">Pricing</p>
              <h2 className="h2">Tailored to your project</h2>
              <p className="lead">Every {s.title.toLowerCase()} project is scoped individually. Tell us what you need and we’ll send a fixed GBP quote.</p>
              <a className="btn btn-whatsapp btn-lg" href={waLink(`Hi Digifier, I'd like a quote for ${s.title}.`)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={20} /> Request a quote
              </a>
            </Reveal>
          )}
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="section">
          <div className="container narrow">
            <SectionHead eyebrow="FAQs" title="Frequently asked questions" center />
            <Faq items={faqs} />
          </div>
        </section>
      )}

      <section className="section pt-0">
        <div className="container">
          <SectionHead eyebrow="Explore more" title="Related services" />
          <Stagger className="related" each={0.08}>
            {related.map((r) => (
              <Item key={r.slug}>
                <Link to={`/services/${r.slug}`} className="related-card">
                  <span className="icon-wrap"><ServiceIcon name={r.icon} /></span>
                  <h3 className="h4">{r.title}</h3>
                  <p>{r.short}</p>
                </Link>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
