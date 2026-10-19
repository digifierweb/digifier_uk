import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'
import { Check, Plus, ArrowRight, ArrowUpRight, Star } from 'lucide-react'
import { fmt, waLink, VAT_LABEL } from '../data/site.js'
import { priceOf } from '../data/services.js'
import { TESTIMONIALS } from '../data/content.js'
import { Reveal, Stagger, Item, SplitWords, Magnetic, MotionToggle } from './Motion.jsx'
import { WhatsAppIcon } from './Icons.jsx'

export function SectionHead({ eyebrow, title, text, center }) {
  return (
    <div className={`section-head ${center ? 'center' : ''}`}>
      {eyebrow && <Reveal as="p" className="eyebrow">{eyebrow}</Reveal>}
      <SplitWords as="h2" className="h2" text={title} />
      {text && <Reveal as="p" className="lead" delay={0.15}>{text}</Reveal>}
    </div>
  )
}

export function PricingCard({ pkg, service }) {
  const price = priceOf(pkg)
  const msg = `Hi Digifier, I'm interested in the ${service.title} – ${pkg.name} package${price ? ` (${fmt(price)})` : ''}.`
  return (
    <m.article
      className={`price-card ${pkg.popular ? 'popular' : ''}`}
      variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {pkg.popular && <span className="badge-popular"><Star size={12} aria-hidden="true" /> Most popular</span>}
      <h3 className="price-name">{pkg.name}</h3>
      <p className="price-blurb">{pkg.blurb}</p>
      <div className="price-amount">
        {price == null ? (
          <span className="amount">Custom quote</span>
        ) : (
          <>
            {pkg.from && <span className="from">from</span>}
            <span className="amount">{fmt(price)}</span>
            {pkg.per && <span className="per">{pkg.per}</span>}
            <span className="vat">{VAT_LABEL}</span>
          </>
        )}
      </div>
      <ul className="price-features">
        {pkg.features.map((f) => (
          <li key={f}><Check size={16} aria-hidden="true" /> {f}</li>
        ))}
      </ul>
      <div className="price-actions">
        <a className={`btn ${pkg.popular ? 'btn-primary' : 'btn-outline'} btn-block`} href={waLink(msg)} target="_blank" rel="noopener noreferrer" data-cta="pricing_package" data-service={service.slug} data-package={pkg.name}>
          <WhatsAppIcon size={18} /> {price == null ? 'Request a quote' : 'Get started'}
        </a>
      </div>
    </m.article>
  )
}

export function PricingGrid({ service }) {
  return (
    <>
      <Stagger className={`price-grid cols-${service.packages.length}`} each={0.1}>
        {service.packages.map((p) => (
          <PricingCard key={p.name} pkg={p} service={service} />
        ))}
      </Stagger>
      {service.addons && (
        <Reveal className="addons">
          <h3 className="h4">Add-on services</h3>
          <ul>
            {service.addons.map((a) => (
              <li key={a.name}>
                <span>{a.name}</span>
                <strong>
                  {a.from && <small>from </small>}
                  {fmt(a.price)}
                  {a.per && <small>{a.per}</small>}
                </strong>
              </li>
            ))}
          </ul>
        </Reveal>
      )}
      <p className="note">All prices in GBP and {VAT_LABEL.replace('inc.', 'include')}.</p>
      {service.note && <p className="note">{service.note}</p>}
    </>
  )
}

// ARIA tabs pattern. Every panel is rendered (inactive ones are `hidden`), so all
// packages are in the prerendered HTML and a <noscript> rule can reveal them without JS.
export function PricingTabs({ services, label, id, scroll, heading, children }) {
  const [tab, setTab] = useState(0)
  const refs = useRef([])
  const onKey = (e) => {
    const n = services.length
    const next = { ArrowRight: tab + 1, ArrowLeft: tab - 1 + n, Home: 0, End: n - 1 }[e.key]
    if (next == null) return
    e.preventDefault()
    setTab(next % n)
    refs.current[next % n]?.focus()
  }
  const H = heading
  return (
    <>
      <div className={`tabs ${scroll ? 'tabs-scroll' : ''}`} role="tablist" aria-label={label}>
        {services.map((s, i) => (
          <button
            key={s.slug}
            ref={(el) => (refs.current[i] = el)}
            id={`${id}-tab-${s.slug}`}
            role="tab"
            aria-selected={tab === i}
            aria-controls={`${id}-panel-${s.slug}`}
            tabIndex={tab === i ? 0 : -1}
            className="tab"
            onClick={() => setTab(i)}
            onKeyDown={onKey}
          >
            {tab === i && <m.span layoutId={`${id}-pill`} className="tab-pill" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
            <span className="tab-label">{s.title}</span>
          </button>
        ))}
      </div>
      {services.map((s, i) => (
        <div key={s.slug} id={`${id}-panel-${s.slug}`} role="tabpanel" aria-labelledby={`${id}-tab-${s.slug}`} hidden={tab !== i} className="tab-panel">
          {H && <H className="sr-only">{s.title} packages</H>}
          <m.div initial={false} animate={tab === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={{ duration: 0.35 }}>
            {children(s)}
          </m.div>
        </div>
      ))}
    </>
  )
}

export function Faq({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <Stagger className="faq" each={0.06}>
      {items.map(([q, a], i) => {
        const isOpen = open === i
        return (
          <Item key={q} className={`faq-item ${isOpen ? 'open' : ''}`}>
            <h3>
              <button aria-expanded={isOpen} aria-controls={`faq-${i}`} id={`faq-q-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                <span>{q}</span>
                <m.span className="faq-icon" animate={{ rotate: isOpen ? 45 : 0 }} aria-hidden="true">
                  <Plus size={20} />
                </m.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <m.div
                  id={`faq-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="faq-a"
                >
                  <p>{a}</p>
                </m.div>
              )}
            </AnimatePresence>
          </Item>
        )
      })}
    </Stagger>
  )
}

export function Marquee({ items, reverse }) {
  const row = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <div className={`marquee-track ${reverse ? 'reverse' : ''}`}>
        {row.map((t, i) => (
          <span key={i} className="marquee-item">{t}<span className="marquee-star">✦</span></span>
        ))}
      </div>
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="section" aria-labelledby="t-title">
      <div className="container">
        <SectionHead eyebrow="Testimonials" title="Loved by growing brands" text="Don't just take our word for it — here's what our clients say." center />
        <p className="center t-controls"><MotionToggle /></p>
      </div>
      <div className="t-marquee">
        <div className="t-track">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <figure className="t-card" key={i} aria-hidden={i >= TESTIMONIALS.length}>
              <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote>“{t.quote}”</blockquote>
              <figcaption>{t.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CtaBand({ title = 'Have a project? We’re ready to help.', text = 'Tell us about your goals and get a free, no-obligation consultation within one working day.' }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal className="cta-band">
          <div className="cta-orb" aria-hidden="true" />
          <SplitWords as="h2" className="h2" text={title} />
          <p className="lead">{text}</p>
          <div className="btn-row">
            <Magnetic>
              <a className="btn btn-whatsapp btn-lg" href={waLink()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={20} /> Chat on WhatsApp
              </a>
            </Magnetic>
            <Magnetic>
              <Link to="/contact" className="btn btn-light btn-lg">
                Request free consultation <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      <ol>
        {items.map(([name, path], i) => (
          <li key={path}>
            {i < items.length - 1 ? <Link to={path}>{name}</Link> : <span aria-current="page">{name}</span>}
            {i < items.length - 1 && <ArrowRight size={12} aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function PageHero({ eyebrow, title, text, crumbs, children }) {
  return (
    <section className="page-hero">
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="container">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {/* CSS entrance: plays from first paint, before JavaScript, so the page title isn't held back. */}
        {eyebrow && <p className="eyebrow enter" style={{ '--d': '0ms' }}>{eyebrow}</p>}
        <SplitWords as="h1" className="h1" text={title} delay={0.06} instant />
        {text && <p className="lead hero-lead enter" style={{ '--d': '380ms' }}>{text}</p>}
        {children}
      </div>
    </section>
  )
}
