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

## Before going live: fill these in (`src/data/site.js`)

- `companyNumber`, `registeredIn`, `registeredAddress`, `icoNumber` (empty values are left off the site) (needed for UK GDPR and the Companies Act; shown in the footer and privacy policy)
- `email` / `privacyEmail` (confirm the mailboxes exist)
- `ga4Id` (optional; GA4 only loads after the visitor accepts analytics cookies)
- `formEndpoint` (optional, e.g. Formspree). If it is empty, the contact form opens WhatsApp with the enquiry already filled in.

## Pricing

All prices are fixed GBP round figures in `src/data/services.js` (`price` on each package and add-on; `price: null` means quote-based). Edit the numbers there and rebuild. If you change a starting price, also update that service's `seoTitle`/`seoDescription` and the hero line in `src/pages/Home.jsx`.

## WhatsApp

+44 7867 244213 is used by the floating chat widget (with topic shortcuts), the header, every pricing card (the message includes the package name), the CTAs, the footer and the contact page.

## GDPR / PECR

- Consent-first cookie banner: Reject all, Customise and Accept all get equal weight. Nothing optional loads before consent, consent can be withdrawn, and the footer has a "Cookie settings" link.
- Fonts are self-hosted, so the site makes no requests to Google Fonts.
- Contact form: the consent box starts unticked, it links to the privacy policy, and it has a honeypot instead of a CAPTCHA.
- Privacy policy, cookie policy and terms are in `src/pages/Legal.jsx`. They are templates: have them reviewed by a solicitor.
