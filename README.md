# Digifier UK — digifier.co.uk

React 18 + Vite + Framer Motion. Every route is prerendered to static HTML at build time, so search engines get the full content and meta tags.

## Commands

```bash
npm install
npm run dev        # local development
npm run build      # client + SSR build, then prerender all routes into dist/
npm run preview    # serve dist/ on http://localhost:4173
npm run assets     # regenerate icons + og.png from the digifier.in logo (scripts/mark-source.webp, public/logo-wordmark.webp)
```

Deploy the `dist/` folder to Cloudflare Pages or Netlify. Pages are built as `/pricing.html` etc., which both hosts serve at `/pricing` (and redirect `/pricing/` to it); `404.html` is served with a 404 status. After deploying, check with `curl -I https://digifier.co.uk/pricing/` (expect a redirect) and `curl -I https://digifier.co.uk/nope` (expect 404). `public/_headers` sets security headers on Netlify and Cloudflare.

## Admin panel

Content and settings are edited at **`/admin/`** (Sveltia CMS). It saves to `src/content/*.json` in GitHub, and CI validates every change. See [ADMIN.md](ADMIN.md) for sign-in, roles and the publishing workflow. `npm run validate` runs the content check on its own.

## Before going live: fill these in (admin → Site settings, or `src/content/settings.json`)

- `companyNumber`, `registeredIn`, `registeredAddress`, `icoNumber` (empty values are left off the site) (needed for UK GDPR and the Companies Act; shown in the footer and privacy policy)
- `email` / `privacyEmail` (confirm the mailboxes exist)
- `ga4Id` (optional; GA4 only loads after the visitor accepts analytics cookies)
- `formEndpoint` (optional, e.g. Formspree). If it is empty, the contact form opens WhatsApp with the enquiry already filled in.

## Pricing

All prices are fixed GBP round figures, edited in the admin under **Services & pricing** (stored in `src/content/services.json`). Each package and add-on has a `price`; an empty price means quote-based. If you change a starting price, also update that service's SEO title and description, and the homepage intro paragraph if it quotes the price.

## WhatsApp

+44 7867 244213 is used by the floating chat widget (with topic shortcuts), the header, every pricing card (the message includes the package name), the CTAs, the footer and the contact page.

## GDPR / PECR

- Consent-first cookie banner: Reject all, Customise and Accept all get equal weight. Nothing optional loads before consent, consent can be withdrawn, and the footer has a "Cookie settings" link.
- Fonts are self-hosted, so the site makes no requests to Google Fonts.
- Contact form: the consent box starts unticked, it links to the privacy policy, and it has a honeypot instead of a CAPTCHA.
- Privacy policy, cookie policy and terms are in `src/pages/Legal.jsx`. They are templates: have them reviewed by a solicitor.
