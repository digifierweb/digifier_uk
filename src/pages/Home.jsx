import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, m, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ArrowRight, TrendingUp, Zap, ShieldCheck } from 'lucide-react'
import Seo, { orgSchema, faqSchema } from '../components/Seo.jsx'
import { Reveal, Stagger, Item, SplitWords, ScrollWords, Counter, Magnetic, Spotlight, MotionToggle } from '../components/Motion.jsx'
import { useMotionPaused } from '../lib/motion.js'
import { SectionHead, PricingCard, PricingTabs, Faq, Marquee, Testimonials, CtaBand } from '../components/Blocks.jsx'
import { ServiceIcon, WhatsAppIcon } from '../components/Icons.jsx'
import { SERVICES } from '../data/services.js'
import { HERO, STATS, WHY, PROCESS, HOME_FAQS, TESTIMONIALS } from '../data/content.js'
import { SITE, waLink } from '../data/site.js'

const WORDS = HERO.rotatingWords

function RotatingWord() {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()
  const paused = useMotionPaused()
  useEffect(() => {
    if (reduce || paused) return
    const t = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2200)
    return () => clearInterval(t)
  }, [reduce, paused])
  return (
    <span className="rotator">
      <AnimatePresence initial={false}>
        <m.span
          key={WORDS[i]}
          className="rotator-word grad-text"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {WORDS[i]}
        </m.span>
      </AnimatePresence>
    </span>
  )
}

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 160])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -120])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const paused = useMotionPaused()
  const float = (ys) => (paused ? { y: 0 } : { y: ys })
  // Cursor spotlight: CSS variables only (smoothed by a registered @property transition), no React re-render.
  const onPointerMove = (e) => {
    if (e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--sx', `${((e.clientX - r.left) / r.width) * 100}%`)
    e.currentTarget.style.setProperty('--sy', `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  return (
    <section className="hero" ref={ref} onPointerMove={onPointerMove}>
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="hero-spot" aria-hidden="true" />
      <m.div className="orb orb-a" style={{ y: y1 }} aria-hidden="true" />
      <m.div className="orb orb-b" style={{ y: y2 }} aria-hidden="true" />
      <m.div className="container hero-inner" style={{ opacity: fade }}>
        {/* Entrance is CSS (.enter / .word-rise) so it plays from first paint, before JavaScript loads. */}
        <p className="pill enter" style={{ '--d': '0ms' }}>
          <span className="pill-dot" /> {HERO.eyebrow}
        </p>
        <h1 className="display" aria-label={`${HERO.headline} ${WORDS.join(', ')}`}>
          <SplitWords text={HERO.headline} delay={0.08} labelled={false} instant />
          <span className="enter-mask"><span className="enter-rise" style={{ '--d': '420ms' }}><RotatingWord /></span></span>
        </h1>
        {/* Text column + chips column: the chips sit beside the copy, never over the headline. */}
        <div className="hero-body">
          <div className="hero-copy">
            <p className="lead hero-lead enter" style={{ '--d': '520ms' }}>
              {HERO.lead}
            </p>
            <div className="btn-row enter" style={{ '--d': '620ms' }}>
              <Magnetic>
                <Link to="/contact" className="btn btn-primary btn-lg">
                  Get a free consultation <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </Magnetic>
              <Magnetic>
                <a href={waLink()} className="btn btn-whatsapp btn-lg" target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon size={20} /> WhatsApp us
                </a>
              </Magnetic>
            </div>
            <div className="hero-proof enter" style={{ '--d': '760ms' }}>
              <div className="avatars" aria-hidden="true">
                {TESTIMONIALS.slice(0, 4).map((t) => (
                  <span key={t.name}>{t.name[0]}</span>
                ))}
              </div>
              {(HERO.proofHighlight || HERO.proofText) && (
                <p>
                  <strong>{HERO.proofHighlight}</strong> {HERO.proofText}
                </p>
              )}
              <MotionToggle className="hero-motion" />
            </div>
          </div>
          <div className="hero-chips" aria-hidden="true">
            {[
              ['chip-1', '900ms', [0, -10, 0], 5, <><TrendingUp size={18} /> <span><strong>SEO-first</strong> builds</span></>],
              ['chip-2', '1020ms', [0, 12, 0], 6, <><Zap size={18} /> <span><strong>5–7 day</strong> launches</span></>],
              ['chip-3', '1140ms', [0, -8, 0], 4.5, <><ShieldCheck size={18} /> <span>UK GDPR ready</span></>],
            ].map(([cls, d, ys, duration, body]) => (
              // Outer: CSS entrance. Inner: Framer's gentle float (pausable). Separate elements so the transforms don't fight.
              <div key={cls} className="enter enter-x" style={{ '--d': d }}>
                <m.div className={`chip ${cls}`} animate={float(ys)} transition={{ y: { repeat: Infinity, duration, ease: 'easeInOut' } }}>
                  {body}
                </m.div>
              </div>
            ))}
          </div>
        </div>
      </m.div>

    </section>
  )
}

function About() {
  return (
    <section className="section" aria-labelledby="about-title">
      <div className="container about-grid">
        <div>
          <Reveal as="p" className="eyebrow">01 · About us</Reveal>
          <SplitWords as="h2" className="h2" text="Creativity meets performance to power digital growth." />
        </div>
        <div>
          <ScrollWords
            className="lead statement"
            text="We help brands grow through smart strategy, compelling content and performance-focused campaigns. From social media to SEO, we craft tailored solutions that deliver real, measurable results."
          />
          <div className="bars">
            {[
              ['Digital marketing', 95],
              ['Websites with SEO', 98],
              ['Client satisfaction', 91],
            ].map(([label, pct]) => (
              <div className="bar" key={label}>
                <div className="bar-top"><span>{label}</span><span>{pct}%</span></div>
                <div className="bar-track">
                  <m.div
                    className="bar-fill"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: pct / 100 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Reveal>
            <Link to="/about" className="text-link">More about Digifier <ArrowRight size={16} aria-hidden="true" /></Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ServicesGrid() {
  return (
    <section className="section" id="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHead eyebrow="02 · Services" title="A full suite of digital services" text="Nine specialist services, one accountable team. Pick one or let us build your whole growth engine." />
        <Stagger className="bento" each={0.07}>
          {SERVICES.map((s, i) => (
            <Spotlight key={s.slug} className={`bento-card ${i === 0 || i === 4 ? 'wide' : ''}`}>
              <Link to={`/services/${s.slug}`} className="bento-link">
                <span className="bento-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="icon-wrap"><ServiceIcon name={s.icon} size={26} /></span>
                <h3 className="h4">{s.title}</h3>
                <p>{s.short}</p>
                <span className="bento-more">Explore <ArrowUpRight size={16} aria-hidden="true" /></span>
              </Link>
            </Spotlight>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="stats-band" aria-label="Digifier in numbers">
      <div className="container">
        <Stagger className="stats" each={0.1}>
          {STATS.map((s) => (
            <Item key={s.label} className="stat">
              <span className="stat-num grad-text"><Counter value={s.value} decimals={s.decimals} suffix={s.suffix} /></span>
              <span className="stat-label">{s.label}</span>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

// The dot fills with the brand gradient as the progress line reaches its step.
function ProcessDot({ progress, at, n }) {
  const fill = useTransform(progress, [Math.max(0, at - 0.12), at], [0, 1])
  const scale = useTransform(progress, [Math.max(0, at - 0.12), at], [0.6, 1])
  return (
    <span className="process-dot">
      <m.span className="process-dot-fill" style={{ opacity: fill, scale }} aria-hidden="true" />
      <span className="process-dot-num">{n}</span>
    </span>
  )
}

function Process() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  return (
    <section className="section" aria-labelledby="process-title">
      <div className="container">
        <SectionHead eyebrow="How we work" title="From first call to measurable growth" center />
        <div className="process" ref={ref}>
          <div className="process-line" aria-hidden="true">
            <m.div className="process-line-fill" style={{ scaleY: scrollYProgress }} />
          </div>
          {PROCESS.map(([t, time, d], i) => (
            <Reveal key={t} className="process-step" delay={i * 0.05}>
              <ProcessDot progress={scrollYProgress} at={i / (PROCESS.length - 1)} n={i + 1} />
              <div>
                <span className="process-time">{time}</span>
                <h3 className="h3">{t}</h3>
                <p>{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Why() {
  return (
    <section className="section alt" aria-labelledby="why-title">
      <div className="container">
        <SectionHead eyebrow="03 · Why choose us" title="We combine creative storytelling with strategy" />
        <Stagger className="why-grid" each={0.08}>
          {WHY.map(([t, d], i) => (
            <Item key={t} className="why-card">
              <span className="why-num">0{i + 1}</span>
              <h3 className="h4">{t}</h3>
              <p>{d}</p>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

const TABS = ['website-design', 'digital-marketing', 'ecommerce']

function PricingTeaser() {
  return (
    <section className="section" aria-labelledby="pricing-title">
      <div className="container">
        <SectionHead eyebrow="04 · Pricing" title="Transparent pricing in GBP" text="No hidden fees. Pick a package, message us on WhatsApp and we’ll get started." center />
        <PricingTabs services={TABS.map((t) => SERVICES.find((x) => x.slug === t))} label="Pricing category" id="home-pricing">
          {(service) => (
            <Stagger className={`price-grid cols-${service.packages.length}`} each={0.08}>
              {service.packages.map((p) => (
                <PricingCard key={p.name} pkg={p} service={service} />
              ))}
            </Stagger>
          )}
        </PricingTabs>
        <Reveal className="center mt">
          <Link to="/pricing" className="btn btn-outline">See all pricing <ArrowRight size={16} aria-hidden="true" /></Link>
        </Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Seo
        title="Digifier UK | Digital Marketing, Web Design & SEO Agency"
        description="Digifier is a UK digital marketing agency for websites, SEO, social media, Google & Meta ads, e-commerce, apps and AI content. Websites from £150. Free consultation."
        path="/"
        schema={[
          orgSchema,
          { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Digifier UK', url: SITE.url, inLanguage: 'en-GB', publisher: { '@id': orgSchema['@id'] } },
          faqSchema(HOME_FAQS),
        ]}
      />
      <Hero />
      <Marquee items={['Web Design', 'SEO', 'Social Media', 'Google Ads', 'Meta Ads', 'E-Commerce', 'App Development', 'AI Content', 'Branding']} />
      <About />
      <ServicesGrid />
      <Stats />
      <Process />
      <Why />
      <PricingTeaser />
      <Testimonials />
      <section className="section" aria-labelledby="faq-title">
        <div className="container narrow">
          <SectionHead eyebrow="FAQs" title="Questions, answered" center />
          <Faq items={HOME_FAQS} />
        </div>
      </section>
      <CtaBand />
    </>
  )
}
