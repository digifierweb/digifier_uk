import { SITE } from '../data/site.js'
import { readConsent } from './consent.js'

// GA4 events. Nothing is sent unless a GA4 ID is configured, gtag has loaded and the visitor
// has granted analytics consent. Parameters never contain form contents or WhatsApp URLs,
// because those carry the visitor's name, email and message.

const allowed = () => typeof window !== 'undefined' && !!SITE.ga4Id && typeof window.gtag === 'function' && !!readConsent()?.analytics

export function track(name, params = {}) {
  if (allowed()) window.gtag('event', name, params)
}

// Called by <Seo> once Helmet has applied the new page's title, so the view carries the right title.
// The landing page is counted by gtag('config'), hence starting from the current path.
// In GA4, turn OFF "Page changes based on browser history events" so views aren't counted twice.
let lastPath = typeof window === 'undefined' ? null : location.pathname
export function trackPageView(title) {
  if (location.pathname === lastPath) return
  lastPath = location.pathname
  if (allowed()) window.gtag('event', 'page_view', { page_location: location.origin + location.pathname, page_title: title })
}

// First-touch campaign source, read from the landing URL and kept in memory only (no cookie or storage).
const landing = typeof window === 'undefined' ? null : new URLSearchParams(location.search)
const firstTouch = landing && ['utm_source', 'utm_medium', 'utm_campaign'].map((k) => landing.get(k)?.slice(0, 60)).filter(Boolean).join(' / ')

// Shown inside the WhatsApp message the visitor sends, so the source is visible to them; only with analytics consent.
export function campaignNote() {
  return firstTouch && readConsent()?.analytics ? `Source: ${firstTouch}` : ''
}

function area(el) {
  if (el.closest('.site-header')) return 'header'
  if (el.closest('.mobile-menu')) return 'mobile_menu'
  if (el.closest('.site-footer')) return 'footer'
  if (el.closest('.wa')) return 'chat_widget'
  if (el.closest('.price-card')) return 'pricing_card'
  if (el.closest('.cta-band')) return 'cta_band'
  return 'page'
}

// One delegated listener covers every WhatsApp, phone and email link on the site.
export function initClickTracking() {
  const onClick = (e) => {
    const a = e.target.closest?.('a[href]')
    if (!a) return
    const href = a.getAttribute('href')
    const base = { link_area: area(a), page_path: location.pathname }
    if (href.startsWith('https://wa.me/')) {
      track('whatsapp_click', { ...base, cta: a.dataset.cta || a.textContent.trim().slice(0, 40), service: a.dataset.service, package: a.dataset.package })
    } else if (href.startsWith('tel:')) {
      track('phone_click', base)
    } else if (href.startsWith('mailto:')) {
      track('email_click', base)
    }
  }
  document.addEventListener('click', onClick, { capture: true })
  return () => document.removeEventListener('click', onClick, { capture: true })
}
