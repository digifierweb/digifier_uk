import { Link } from 'react-router-dom'
import { Mail, Phone, Clock, Instagram } from 'lucide-react'
import { SERVICES } from '../data/services.js'
import { SITE, waLink, companyLine } from '../data/site.js'
import { openCookieSettings } from '../lib/consent.js'
import { Logo } from './Header.jsx'
import { WhatsAppIcon } from './Icons.jsx'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="container">
        <div className="footer-big" aria-hidden="true">Let's grow.</div>
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p className="muted">{SITE.tagline} Serving businesses across the United Kingdom.</p>
            <div className="footer-social">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Digifier">
                <WhatsAppIcon size={20} />
              </a>
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Digifier on Instagram">
                <Instagram size={20} />
              </a>
              <a href={`mailto:${SITE.email}`} aria-label="Email Digifier">
                <Mail size={20} />
              </a>
            </div>
          </div>
          <div>
            <h2 className="footer-h">Services</h2>
            <ul className="footer-list">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="footer-h">Company</h2>
            <ul className="footer-list">
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy-policy">Privacy policy</Link></li>
              <li><Link to="/cookie-policy">Cookie policy</Link></li>
              <li><Link to="/terms">Terms of business</Link></li>
              <li><Link to="/accessibility">Accessibility</Link></li>
              <li><Link to="/sitemap">Sitemap</Link></li>
              <li><button type="button" className="link-btn" onClick={openCookieSettings}>Cookie settings</button></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-h">Get in touch</h2>
            <ul className="footer-list footer-contact">
              <li><Phone size={16} aria-hidden="true" /><a href={`tel:${SITE.phoneE164}`}>{SITE.phoneDisplay}</a></li>
              <li><WhatsAppIcon size={16} /><a href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp chat</a></li>
              <li><Mail size={16} aria-hidden="true" /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li><Clock size={16} aria-hidden="true" /><span>{SITE.hours}</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {companyLine()} All rights reserved.
          </p>
          <p>Prices in GBP, including VAT. Part of the Digifier group — <a href="https://digifier.in" target="_blank" rel="noopener">digifier.in</a></p>
        </div>
      </div>
    </footer>
  )
}
