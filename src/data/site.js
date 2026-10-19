// Central business config — edit here, everything else reads from it.
export const SITE = {
  name: 'Digifier',
  legalName: 'Digifier Consulting Limited', // as registered at Companies House
  // From Companies House (company 15014916). Empty values are left off the site rather than shown as placeholders.
  companyNumber: '15014916',
  registeredIn: 'England & Wales',
  registeredAddress: '11 Hadleigh Rise, Caversham, Reading, RG4 6RW, United Kingdom',
  icoNumber: '', // TODO: ICO data protection fee reference
  url: 'https://digifier.co.uk',
  email: 'hello@digifier.co.uk', // TODO: confirm mailbox
  privacyEmail: 'privacy@digifier.co.uk', // TODO: confirm mailbox
  phoneDisplay: '+44 7867 244213',
  phoneE164: '+447867244213',
  whatsapp: '447867244213',
  hours: 'Mon–Fri, 9:00–18:00 (UK time)',
  instagram: 'https://www.instagram.com/digifier_in/',
  tagline: 'Creativity meets performance to power digital growth.',
  // Optional: GA4 Measurement ID. Only loaded after the visitor grants analytics consent.
  ga4Id: '',
  // Optional: form endpoint (e.g. Formspree/Basin). If empty, the contact form hands off to WhatsApp.
  formEndpoint: '',
}

// "Digifier Consulting Limited, registered in England & Wales, company number 123. Registered office: …" with missing parts left out.
export function companyLine() {
  const parts = [SITE.legalName]
  if (SITE.registeredIn) parts.push(`registered in ${SITE.registeredIn}`)
  if (SITE.companyNumber) parts.push(`company number ${SITE.companyNumber}`)
  let line = parts.join(', ') + '.'
  if (SITE.registeredAddress) line += ` Registered office: ${SITE.registeredAddress}.`
  return line
}

// All prices include VAT (the company is VAT-registered and prices are shown VAT-inclusive for consumers).
export const VAT_LABEL = 'inc. VAT'

export const fmt = (n) => '£' + n.toLocaleString('en-GB')

export function waLink(message = "Hi Digifier, I'd like to talk about a project.") {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`
}
