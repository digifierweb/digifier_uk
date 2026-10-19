import Seo, { crumbs, orgSchema } from '../components/Seo.jsx'
import { PageHero, SectionHead, Testimonials, CtaBand } from '../components/Blocks.jsx'
import { Reveal, Stagger, Item, Counter } from '../components/Motion.jsx'
import { STATS, WHY } from '../data/content.js'

const VALUES = [
  ['Strategy before screens', 'Research into your goals, audience and competitors comes first. Every design decision has a reason.'],
  ['Performance you can measure', 'We report on what matters — leads, sales and rankings — not vanity metrics.'],
  ['Privacy by design', 'Consent-first analytics, secure forms and UK GDPR-ready builds as standard.'],
]

export default function About() {
  const path = '/about'
  return (
    <>
      <Seo
        title="About Digifier UK | Creative, Performance-Led Digital Agency"
        description="Digifier is a creative, performance-led digital agency helping UK brands grow with websites, SEO, social media, paid ads, e-commerce and AI content."
        path={path}
        schema={[crumbs([['Home', '/'], ['About', path]]), { ...orgSchema, '@type': 'ProfessionalService' }]}
      />
      <PageHero
        crumbs={[['Home', '/'], ['About', path]]}
        eyebrow="About Digifier"
        title="We build brands that speak louder"
        text="Digifier brings together designers, marketers and engineers to help businesses grow online. Our UK practice, digifier.co.uk, builds on the work of our team at digifier.in to serve British brands with the same strategy-first approach."
      />
      <section className="stats-band">
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
      <section className="section">
        <div className="container about-grid">
          <div>
            <SectionHead eyebrow="Our story" title="Creativity meets performance" />
          </div>
          <div className="prose">
            <Reveal as="p" className="lead">
              We started Digifier to give growing businesses access to the kind of joined-up digital thinking usually reserved for big
              brands: design, content, advertising and technology working together towards one goal — growth.
            </Reveal>
            <Reveal as="p">
              Today we deliver websites, e-commerce stores, apps, SEO, social media and paid campaigns for clients across retail,
              fashion, education, healthcare and professional services. Whether you're a startup or an established company, our
              solutions scale with you.
            </Reveal>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <SectionHead eyebrow="What we believe" title="Our principles" />
          <Stagger className="steps cols-3" each={0.1}>
            {VALUES.map(([t, d], i) => (
              <Item key={t} className="step-card">
                <span className="why-num">0{i + 1}</span>
                <h3 className="h4">{t}</h3>
                <p>{d}</p>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Why Digifier" title="Six reasons clients stay with us" />
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
      <Testimonials />
      <CtaBand />
    </>
  )
}
