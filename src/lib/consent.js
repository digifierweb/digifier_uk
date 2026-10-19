import { SITE } from '../data/site.js'

// Consent-first storage (UK GDPR + PECR): nothing non-essential runs until the visitor opts in.
const KEY = 'digifier-consent'
// v2: marketing category removed until ad tags exist; earlier choices are asked again.
const VERSION = 2
const listeners = new Set()

export function readConsent() {
  try {
    const c = JSON.parse(localStorage.getItem(KEY))
    return c && c.v === VERSION ? c : null
  } catch {
    return null
  }
}

export function saveConsent({ analytics }) {
  const c = { v: VERSION, necessary: true, analytics: !!analytics, marketing: false, ts: new Date().toISOString() }
  try {
    localStorage.setItem(KEY, JSON.stringify(c))
  } catch {}
  applyConsent(c)
  listeners.forEach((fn) => fn(c))
  return c
}

export function onConsentChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent('digifier:cookie-settings'))
}

let gaLoaded = false
export function applyConsent(c) {
  if (!c || typeof window === 'undefined') return
  if (SITE.ga4Id) {
    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments) }
    const state = {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied',
    }
    if (c.analytics && !gaLoaded) {
      gaLoaded = true
      window.gtag('consent', 'default', state)
      const s = document.createElement('script')
      s.async = true
      s.src = `https://www.googletagmanager.com/gtag/js?id=${SITE.ga4Id}`
      document.head.appendChild(s)
      window.gtag('js', new Date())
      // GA4 always truncates IPs, so no anonymize flag is needed.
      window.gtag('config', SITE.ga4Id)
    } else if (gaLoaded) {
      window.gtag('consent', 'update', state)
    }
  }
  // Withdrawal: clear analytics cookies when consent is removed.
  const withdrawn = !c.analytics && gaLoaded
  if (!c.analytics) {
    document.cookie.split(';').forEach((ck) => {
      const name = ck.split('=')[0].trim()
      if (/^_ga|^_gid|^_gat/.test(name)) {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname.replace(/^www\./, '')}`
        document.cookie = `${name}=; Max-Age=0; path=/`
      }
    })
  }
  // gtag can't be unloaded, so reload once to make sure nothing from GA keeps running.
  if (withdrawn) location.reload()
}
