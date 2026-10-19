import { Helmet } from 'react-helmet-async'
import { SITE } from '../data/site.js'
import { trackPageView } from '../lib/analytics.js'

export const ORG_ID = `${SITE.url}/#organization`

export const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': ORG_ID,
  name: SITE.name,
  alternateName: 'Digifier UK',
  legalName: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
  image: `${SITE.url}/og.png`,
  description:
    'Digital marketing, website design, SEO, e-commerce, app development and AI solutions agency serving businesses across the United Kingdom.',
  email: SITE.email,
  telephone: SITE.phoneE164,
  areaServed: { '@type': 'Country', name: 'United Kingdom' },
  priceRange: '££',
  currenciesAccepted: 'GBP',
  sameAs: [SITE.instagram, 'https://digifier.in'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: SITE.phoneE164,
    contactType: 'sales',
    areaServed: 'GB',
    availableLanguage: ['English'],
  },
}

export const crumbs = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: SITE.url + path,
  })),
})

export const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
})

export default function Seo({ title, description, path = '/', schema = [], noindex = false, type = 'website' }) {
  const full = title.includes('Digifier') ? title : `${title} | Digifier UK`
  const url = SITE.url + (path === '/' ? '/' : path)
  return (
    <Helmet onChangeClientState={(state) => trackPageView(state.title)}>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="en-GB" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Digifier UK" />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${SITE.url}/og.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE.url}/og.png`} />
      {schema.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Helmet>
  )
}
