import { Mail, Phone, Clock, MapPin } from 'lucide-react'
import Seo, { crumbs, ORG_ID } from '../components/Seo.jsx'
import { PageHero } from '../components/Blocks.jsx'
import { Reveal, Stagger, Item, Magnetic } from '../components/Motion.jsx'
import { WhatsAppIcon } from '../components/Icons.jsx'
import ContactForm from '../components/ContactForm.jsx'
import { SITE, waLink } from '../data/site.js'

export default function Contact() {
  const path = '/contact'
  return (
    <>
      <Seo
        title="Contact Digifier UK | Free Consultation & WhatsApp"
        description={`Talk to Digifier UK about your website, SEO or marketing. WhatsApp ${SITE.phoneDisplay}, email ${SITE.email} or send an enquiry for a free consultation.`}
        path={path}
        schema={[
          crumbs([['Home', '/'], ['Contact', path]]),
          { '@context': 'https://schema.org', '@type': 'ContactPage', url: SITE.url + path, about: { '@id': ORG_ID } },
        ]}
      />
      <PageHero
        crumbs={[['Home', '/'], ['Contact', path]]}
        eyebrow="Contact"
        title="Let’s build something great together"
        text="Tell us about your project and we’ll reply within one working day. Prefer to chat? WhatsApp is the fastest way to reach us."
      />
      <section className="section pt-0">
        <div className="container contact-grid">
          <Stagger className="contact-cards" each={0.08}>
            <Item>
              <a className="contact-card wa-card-big" href={waLink()} target="_blank" rel="noopener noreferrer">
                <span className="icon-wrap"><WhatsAppIcon size={26} /></span>
                <div>
                  <h2 className="h4">WhatsApp</h2>
                  <p>{SITE.phoneDisplay}</p>
                  <span className="small">Fastest response</span>
                </div>
              </a>
            </Item>
            <Item>
              <a className="contact-card" href={`tel:${SITE.phoneE164}`}>
                <span className="icon-wrap"><Phone size={24} aria-hidden="true" /></span>
                <div><h2 className="h4">Call us</h2><p>{SITE.phoneDisplay}</p></div>
              </a>
            </Item>
            <Item>
              <a className="contact-card" href={`mailto:${SITE.email}`}>
                <span className="icon-wrap"><Mail size={24} aria-hidden="true" /></span>
                <div><h2 className="h4">Email</h2><p>{SITE.email}</p></div>
              </a>
            </Item>
            <Item>
              <div className="contact-card">
                <span className="icon-wrap"><Clock size={24} aria-hidden="true" /></span>
                <div><h2 className="h4">Hours</h2><p>{SITE.hours}</p></div>
              </div>
            </Item>
            <Item>
              <div className="contact-card">
                <span className="icon-wrap"><MapPin size={24} aria-hidden="true" /></span>
                <div><h2 className="h4">Where we work</h2><p>Remote-first, serving clients across the United Kingdom</p></div>
              </div>
            </Item>
          </Stagger>
          <Reveal className="form-panel">
            <h2 className="h3">Send us an enquiry</h2>
            <p className="muted">Fields marked * are required.</p>
            <ContactForm />
          </Reveal>
        </div>
        <div className="container center mt">
          <Magnetic>
            <a className="btn btn-whatsapp btn-lg" href={waLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={20} /> Start a WhatsApp chat
            </a>
          </Magnetic>
        </div>
      </section>
    </>
  )
}
