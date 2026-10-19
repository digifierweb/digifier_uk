// Business settings live in src/content/settings.json, which the admin panel (/admin) edits.
// This module keeps the flat SITE shape the rest of the code uses.
import settings from '../content/settings.json'

const { business: b, contact: c, social, integrations, legal } = settings

export const SITE = {
  name: b.name,
  siteName: b.siteName,
  legalName: b.legalName,
  companyNumber: b.companyNumber,
  registeredIn: b.registeredIn,
  registeredAddress: b.registeredAddress,
  icoNumber: b.icoNumber,
  url: b.url.replace(/\/+$/, ''),
  tagline: b.tagline,
  pricesIncludeVat: b.pricesIncludeVat,
  groupSiteName: b.groupSiteName,
  groupSiteUrl: b.groupSiteUrl,
  email: c.email,
  privacyEmail: c.privacyEmail,
  phoneDisplay: c.phoneDisplay,
  phoneE164: c.phoneE164,
  whatsapp: c.whatsapp,
  whatsappDefaultMessage: c.whatsappDefaultMessage,
  hours: c.hours,
  social,
  instagram: social.instagram,
  // GA4 only loads after the visitor accepts analytics cookies.
  ga4Id: integrations.ga4Id,
  // If empty, the contact form hands the enquiry to WhatsApp.
  formEndpoint: integrations.formEndpoint,
  legalUpdated: legal.lastUpdated,
}

// Non-empty social profile URLs, in display order.
export const SOCIAL_LINKS = [
  ['instagram', 'Instagram'],
  ['linkedin', 'LinkedIn'],
  ['facebook', 'Facebook'],
  ['x', 'X'],
  ['youtube', 'YouTube'],
  ['tiktok', 'TikTok'],
]
  .filter(([key]) => social[key])
  .map(([key, label]) => ({ key, label, url: social[key] }))

// "Digifier Consulting Limited, registered in England & Wales, company number 123. Registered office: …" with missing parts left out.
export function companyLine() {
  const parts = [SITE.legalName]
  if (SITE.registeredIn) parts.push(`registered in ${SITE.registeredIn}`)
  if (SITE.companyNumber) parts.push(`company number ${SITE.companyNumber}`)
  let line = parts.join(', ') + '.'
  if (SITE.registeredAddress) line += ` Registered office: ${SITE.registeredAddress}.`
  return line
}

// Prices are shown VAT-inclusive (required when selling to consumers) unless switched off in settings.
export const VAT_LABEL = SITE.pricesIncludeVat ? 'inc. VAT' : '+ VAT'

export const fmt = (n) => '£' + n.toLocaleString('en-GB')

export function waLink(message = SITE.whatsappDefaultMessage) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`
}
