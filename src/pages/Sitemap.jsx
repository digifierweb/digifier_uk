import { Link } from 'react-router-dom'
import Seo, { crumbs } from '../components/Seo.jsx'
import { PageHero } from '../components/Blocks.jsx'
import { SERVICES } from '../data/services.js'

const GROUPS = [
  ['Main pages', [['Home', '/'], ['Services', '/services'], ['Pricing', '/pricing'], ['About us', '/about'], ['Contact', '/contact']]],
  ['Services', SERVICES.map((s) => [s.title, `/services/${s.slug}`])],
  [
    'Legal and help',
    [
      ['Privacy policy', '/privacy-policy'],
      ['Cookie policy', '/cookie-policy'],
      ['Terms of business', '/terms'],
      ['Accessibility statement', '/accessibility'],
    ],
  ],
]

export default function Sitemap() {
  const path = '/sitemap'
  return (
    <>
      <Seo title="Sitemap" description="Every page on the Digifier UK website: services, pricing, company information and legal pages." path={path} schema={[crumbs([['Home', '/'], ['Sitemap', path]])]} />
      <PageHero crumbs={[['Home', '/'], ['Sitemap', path]]} eyebrow="Sitemap" title="All pages" />
      <section className="section pt-0">
        <div className="container narrow prose">
          {GROUPS.map(([heading, links]) => (
            <div key={heading}>
              <h2>{heading}</h2>
              <ul>
                {links.map(([label, to]) => (
                  <li key={to}><Link to={to}>{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
