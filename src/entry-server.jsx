import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import { SERVICES } from './data/services.js'

export const ROUTES = [
  '/',
  '/services',
  ...SERVICES.map((s) => `/services/${s.slug}`),
  '/pricing',
  '/about',
  '/contact',
  '/privacy-policy',
  '/cookie-policy',
  '/terms',
  '/accessibility',
  '/sitemap',
  '/404',
]

export function render(url) {
  const helmetContext = {}
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  )
  return { html, helmet: helmetContext.helmet }
}
