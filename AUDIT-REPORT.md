# Digifier UK: pre-launch verification report

**Build audited:** local production build (`npm run build`), served by `vite preview` on localhost:4173. Audited 19 Oct 2026.
**Not audited:** a live deployment. None exists yet, so anything that depends on the host (HTTPS, TLS, response headers, CDN/WAF, real 404 status codes, field Core Web Vitals, Search Console) is listed as **Blocked**.

**Legend:** ✅ Pass · ⚠️ Partial · ❌ Fail / missing · ⛔ Blocked (needs a deployment, credentials or a business decision)

## Summary

The site is strong in a few areas: static pages, on-page SEO, consent-first cookie handling, and an accessibility baseline. It is **not ready to launch as a full lead-generation site**. The P0 blockers are:

1. **No lead backend.** The contact form only opens WhatsApp with the enquiry pre-filled, so no lead is captured unless the visitor presses Send in WhatsApp. There is no CRM, email notification, acknowledgement, server-side validation, rate limiting, UTM capture or consent record (§7).
2. **Placeholder legal identity.** `[Company number]`, `[Registered office address]` and `[ICO registration number]` appear on every page footer and in the privacy policy (§4, §9).
3. **Missing pages:** portfolio/case studies, blog, accessibility statement, HTML sitemap, a booking flow, and most of the specialist service pages in brief §6.
4. **Unverified claims.** The stats (18+ projects, 91% success, 4.9★, 50+ clients), the testimonials, and service promises ("replies within an hour", "one working day") come from digifier.in or were written by me. They need approval before they can be presented as UK facts. Separately, I drafted the business terms (deposit, payment terms, notice period) and they need your sign-off (§5, §9).
5. **Pricing hidden without JavaScript.** Pricing cards are prerendered at `opacity:0`, so prices are invisible if JavaScript fails (§4).

## Fixes applied (19 Oct 2026, same day)

Rebuilt and re-checked in the local preview. axe-core now reports **0 violations** on `/` and `/pricing`; no console errors.

| # | Status | What changed |
|---|---|---|
| F3 | ✅ Fixed | `ContactForm.jsx` checks whether WhatsApp actually opened. If the popup is blocked, it shows an alert saying the enquiry has **not** been sent, with an "Open WhatsApp" link and the email address. Tested both paths with a stubbed `window.open`. |
| F4 | ✅ Fixed | Every pricing panel is now prerendered (inactive ones use `hidden`). A `<noscript>` style in `index.html` reveals all panels and any animation-hidden content, and hides the tabs and menu button, which need JS. Raw `/pricing` HTML now has 5 panels and 16 cards. |
| F7 | ✅ Fixed | Marketing toggle removed from the banner. `_gcl_*`/`_fbp` row removed from the cookie policy, which now says no ad cookies are used. The consent record version was bumped to 2, so earlier choices are asked again. |
| F9 | ⚠️ Partly fixed | `react-router-dom` 6.28.0 → 6.30.6. High-severity advisories are cleared. 2 moderate advisories remain and are only fixed in v7.18+ (a breaking upgrade). |
| F12 | ✅ Fixed | New site-wide "Pause animations" button in the hero and the testimonials. It stops both marquees, the rotating word, the floating chips, the CTA orb and the WhatsApp ring, and the choice is remembered. The button is hidden for reduced-motion users, since nothing moves for them. |
| F13 | ✅ Fixed | The accessible name is now on the `<h1>` itself ("…stand out with Design, Marketing, SEO, AI, Growth"). |
| F14 | ✅ Fixed | Shared `PricingTabs` component (home and pricing): `aria-controls`/`aria-labelledby`, roving tabindex, Arrow/Home/End keys. Each pricing-page panel has a visually hidden h2, so headings no longer skip from h1 to h3. |
| F15 | ✅ Fixed | While the mobile menu is open, the main content, footer, chat widget and skip link are made `inert`, and focus moves to the first menu link. The chat panel focuses its first topic on open and returns focus to the button on Escape or close. |
| F16 | ✅ Fixed | "Book free consultation" → "Request free consultation". |
| F18 | ⚠️ Added | `public/.well-known/security.txt` (expires 19 Oct 2027). It uses `hello@digifier.co.uk`, which is still unconfirmed (F17). |

### Second round (19 Oct 2026)

| # | Status | What changed |
|---|---|---|
| Logo | ✅ Done | The logo from digifier.in (the "D" mark plus the white "Digifier" wordmark) is now used in the header, footer, favicons (32/48 px), home-screen icons, the schema `logo.png` and `og.png`. `npm run assets` regenerates them from `scripts/mark-source.webp`. The old SVG favicon was removed. |
| F2 | ✅ Mostly fixed | Details taken from Companies House: **Digifier Consulting Limited**, registered in England & Wales, company number 15014916, registered office 11 Hadleigh Rise, Caversham, Reading, RG4 6RW. These now appear in the footer of every page, the privacy policy (data controller), the terms and schema `legalName`. No officer or director names are used. **Still missing: the ICO registration number**, which isn't on the Companies House record. It is left off the site until you provide it. |
| F8 | ✅ Fixed | Every price card shows "inc. VAT". The pricing notes, terms and footer say prices include VAT, and schema Offers carry `valueAddedTaxIncluded: true`. |
| F10 | ✅ Fixed (verify after deploy) | Pages are now prerendered as `pricing.html` etc. instead of `pricing/index.html`. Cloudflare Pages and Netlify serve these at `/pricing` and redirect `/pricing/` there, so there's one URL per page and it matches the canonical. `vite preview` now copies that behaviour: `/pricing/` → 301, unknown URLs → **404** status with the 404 page. |
| F11 | ⚠️ Partly fixed | Added `/accessibility` (accessibility statement) and `/sitemap` (HTML sitemap), both linked from the footer and listed in sitemap.xml (19 URLs). Portfolio, case studies, blog, careers and industries still need real content from you. |
| F19 | ✅ Fixed | Framer Motion now loads its animation features after first paint (`LazyMotion`). Main JS is **117 KB gzipped (was 127 KB)**, plus a 16 KB chunk loaded afterwards. |
| F20 | ✅ Fixed | sitemap.xml no longer uses the build date as `lastmod`. Every service page now has FAQs (5 pages generate theirs from package data: cost, what's included, how to start) and a "How we deliver" section. |

Re-verified: axe-core finds **0 violations** on 8 pages (home, pricing, SEO, app development, contact, terms, accessibility, sitemap). No console errors. No horizontal scroll at 320 px.

### Third round: sections 15–19 (20 Oct 2026)

| # | Status | What changed |
|---|---|---|
| F21 | ✅ Resolved by you | Git repository with `.gitignore`, pushed to GitHub (`digifierweb/digifier_uk`). |
| F22 | ⛔ Needs you | GA4 is still not installed (`ga4Id` empty), and Search Console isn't verified. Both need your Google account. |
| F23 | ✅ Fixed | Consent-gated GA4 events in `src/lib/analytics.js`: `whatsapp_click` (area, CTA, service, package), `phone_click`, `email_click` and `generate_lead` (method, service, budget band). Tested with a fake GA4 ID (§16). |
| F24 | ✅ Fixed | The blocked-popup fallback is now a button, not a link, so there's no URL containing the visitor's details for GA4's outbound-click tracking to record. Analytics parameters never include form contents or WhatsApp URLs (tested). |
| F25 | ✅ Fixed | Each in-app navigation sends one `page_view` with the correct title, fired after the new page's title is applied. `anonymize_ip` (a no-op in GA4) removed. **GA4 setting needed:** turn off "Page changes based on browser history events" in the web stream's enhanced measurement, or views are double-counted. |
| F26 | ✅ Fixed | Withdrawing analytics consent reloads the page once, so the GA script stops running, and cookies are cleared (tested). |
| F27 | ✅ Fixed | First-touch `utm_source / medium / campaign` is read from the landing URL and kept in memory only (no cookie or storage). With analytics consent, it's added as a visible "Source:" line to the WhatsApp enquiry. |
| F28 | ⚠️ Partly fixed | Added `.github/workflows/ci.yml` (on every push and pull request: build, high-severity `npm audit`, prerender check) and `.github/dependabot.yml` (monthly). Not pushed yet. Uptime monitoring and host deploy/rollback need a deployment. |
| F30 | ⛔ Needs you | **The GitHub repo is public**: the GitHub API returns it without logging in. Public source code is fine (there are no secrets), but this report, which lists compliance gaps, and your commit email are visible to anyone. Make the repo private, or move the report out of it. |

Still open, by your decision or needing your input:
- **F1:** WhatsApp-only enquiries, by your choice.
- **F2:** ICO registration number (pay the ICO data protection fee if you haven't already).
- **F5:** unverified stats and testimonials.
- **F6:** solicitor review of the terms.
- **F11:** content for portfolio, case studies and blog.
- **F17:** UK Instagram account and confirmed mailboxes.
- **F22:** create GA4 and Search Console, set `ga4Id`, and change the GA4 setting noted under F25.
- **F28:** push the CI files, connect hosting, add uptime checks.
- **F30:** make the GitHub repo private.

## Findings (ranked)

| # | Sev | Component | Issue | How to reproduce | Fix |
|---|---|---|---|---|---|
| F1 | **P0** | `ContactForm.jsx`, `site.js` (`formEndpoint: ''`) | No backend receives enquiries. A lead exists only if the visitor sends the pre-filled WhatsApp message. | Submit the contact form with valid test data: `window.open` gets a wa.me URL and nothing is sent to a server. | Connect a form backend or CRM (e.g. HubSpot Forms, Formspree, or a serverless function) with server-side validation, rate limiting, email notification and an auto-acknowledgement. Keep WhatsApp as a secondary option. |
| F2 | **P0** | Footer, `Legal.jsx`, `site.js` | Placeholder company number, address and ICO number are visible on every page. | Scroll to the footer on any page, or open /privacy-policy §1. | Fill in the real details, or remove the claims, before launch. |
| F3 | **P0** | `ContactForm.jsx` | The success message ("We have opened WhatsApp…") shows even when the WhatsApp window was blocked (`window.open` returned `null`). | Stub `window.open` to return `null`, then submit valid data: "Thank you!" still appears. | Check the return value. If blocked, show a direct "Open WhatsApp" link and an email fallback instead of the success state. |
| F4 | **P0** | Pricing cards (`Blocks.jsx` `PricingCard`, tab panels in `Pricing.jsx` / `Home.jsx`) | With JavaScript disabled or failing, pricing cards stay at `opacity:0` and the price tabs do nothing. | Load /pricing without scripts: all 3 cards have computed opacity 0. | Render cards visible on the server (`initial={false}` on first render, or a `.js`-class gate). Consider listing all packages without tabs. |
| F5 | **P0** | Content | Stats, testimonials and ratings come from the Indian business. "50+ happy clients" contradicts "18+ projects delivered". The cards show 5 stars, but the source rating is 4.9. Under UK consumer-protection law (DMCC Act 2024), presenting these as UK track record risks being misleading. | Home hero, stats band, testimonials. | Confirm or replace with UK-verifiable figures, label group-wide stats as such, and show real ratings with their source. |
| F6 | **P1** | `Legal.jsx` (Terms, Privacy, Cookies) | I drafted the business terms myself: 50% deposit, 14-day payment, 30-day notice, liability cap, and "Registered in England & Wales". The privacy retention periods (12 months, 14 months GA4) are also assumptions. | /terms, /privacy-policy §7. | Director approval plus solicitor review. |
| F7 | **P1** | Cookie banner and cookie policy | The "Marketing" category controls nothing because no marketing tags exist. The cookie policy lists `_gcl_*` and `_fbp` cookies that the site never sets. | Accept all: no cookies or third-party requests appear. | Remove the category and table rows until the tags exist, or add the tags behind consent. |
| F8 | **P1** | Pricing display | Prices don't say whether VAT is included. For consumers, prices must be shown VAT-inclusive. | Any pricing card. | Add "ex. VAT (business clients)" or show consumer prices including VAT. Confirm VAT registration status. |
| F9 | **P1** | `react-router-dom@6.28.0` | `npm audit` reports 3 high-severity production advisories (open-redirect class). Low practical risk here, because no user-controlled navigation targets exist. | `npm audit --omit=dev` | Upgrade to `react-router-dom@6.30.6` (non-breaking) now. Plan for v7 later, since 2 advisories are only fixed in v7.18+. |
| F10 | **P1** | Hosting | 404 handling and trailing slashes depend on the host. The preview server returns **200** with the homepage HTML for unknown URLs (soft 404), and `/pricing/` duplicates `/pricing`. | `curl -I /does-not-exist`, `/pricing/` | On Netlify or Cloudflare Pages, confirm `404.html` is served with status 404 and add redirects from trailing-slash URLs to the canonical. |
| F11 | **P1** | Missing routes | No `/portfolio`, `/case-studies`, `/blog`, `/accessibility` (statement), HTML `/sitemap`, `/careers`, `/industries` or booking page. All fall through to 404. | Visit each path. | Build the ones that are in scope (the accessibility statement and portfolio are strongly recommended). |
| F12 | **P1** | Accessibility | Three motion elements play automatically with no pause control: the services marquee, the testimonial marquee (pauses only on mouse hover) and the rotating hero word. This fails WCAG 2.2.2 for users who haven't enabled reduced motion. | Home page. | Add a visible pause button, or stop after 5 seconds. Reduced-motion users are already handled. |
| F13 | **P2** | Accessibility | The homepage h1 has `aria-label` on a plain `<span>` (axe: serious, `aria-prohibited-attr`). Chrome still computes the right name; other screen readers may not. | axe-core on `/`. | Move the label onto the `<h1>`, or render a visually hidden full-text copy. |
| F14 | **P2** | Accessibility | Price tabs lack `aria-controls`/`aria-labelledby` and arrow-key support. The pricing page jumps from h1 to h3 (axe `heading-order`). | /pricing | Complete the ARIA tabs pattern and add an h2 per panel. |
| F15 | **P2** | Accessibility | The open mobile menu doesn't make the page behind it inert, so Tab can move focus under the overlay. The WhatsApp panel doesn't move focus into itself when it opens. | Mobile viewport: open the menu and press Tab repeatedly. | Set `inert` on `<main>`/`<footer>` while the menu is open, and focus the first topic when the chat panel opens. |
| F16 | **P2** | CTAs | "Book free consultation" implies a booking system, but it links to the contact form. | CTA band. | Rename it to "Request free consultation", or add Calendly/Cal.com (behind consent). |
| F17 | **P2** | Identity / GEO | The Instagram link and the schema `sameAs` point to the Indian account (`digifier_in`). Mailboxes `hello@` and `privacy@digifier.co.uk` haven't been confirmed. | Footer, JSON-LD. | Create UK profiles or label them as the group account. Confirm the mailboxes receive mail. |
| F18 | **P2** | Security | No `/.well-known/security.txt`. Security headers exist only in `public/_headers` and haven't been verified on a live host. | — | Add security.txt. After deployment, verify the headers with `curl -I` and securityheaders.com. |
| F19 | **P2** | Performance | The JS bundle is 127 KB gzipped (React, Framer Motion, Router). Fonts total 270 KB across 10 subsets, of which only the latin subsets are normally fetched. | `dist/assets` | Lazy-load below-the-fold motion components. Use `LazyMotion` with `domAnimation` (saves about 25 KB). |
| F20 | **P3** | SEO | Every sitemap entry uses the build date as `lastmod`. Service pages are fairly thin (about 400–800 words). Only the SEO and home pages have FAQs. | sitemap.xml, crawl. | Use real modified dates. Add FAQs, use cases and proof to each service page. |
| F21 | **P0** | Operations | (Resolved.) There was no version control or off-machine copy. | — | Done: Git plus GitHub. Keep pushing after every change; this is now the backup. |
| F22 | **P1** | Analytics | GA4 isn't installed (`ga4Id` empty), and Search Console isn't verified. | `src/data/site.js` | Create a GA4 property and set `ga4Id`. Verify the domain with a DNS TXT record and submit `sitemap.xml`. |
| F23 | **P1** | Analytics | There were no conversion events for WhatsApp, form, phone or email. | — | Fixed (third round). Mark `generate_lead` and `whatsapp_click` as key events in GA4. |
| F24 | **P1** | Privacy | The form's fallback link put the visitor's name, email, phone and message in its URL. GA4's outbound-click tracking would have sent that URL to Google. | — | Fixed: a button instead of a link. |
| F25 | **P2** | Analytics | Page views after the first depended on an undocumented GA4 setting. | — | Fixed in code; one GA4 setting is still needed (see the third round). |
| F26 | **P2** | Privacy | The GA script stayed loaded after consent was withdrawn. | — | Fixed: the page reloads once. |
| F27 | **P2** | Attribution | Leads couldn't be traced to a campaign. | — | Fixed: a source line in WhatsApp enquiries. A CRM (F1) would allow proper reporting. |
| F28 | **P2** | Operations | No CI/CD, dependency updates, monitoring, or documented deploy and rollback. | — | CI and Dependabot added; push them. Connect the host to GitHub and add uptime checks. |
| F29 | **P3** | Content workflow | (Resolved 20 Oct.) There was no CMS. | — | Admin panel at `/admin/` (§15). |
| F30 | **P1** | Operations | The GitHub repo is public, exposing this report and the commit email. | The unauthenticated GitHub API returns the repo | Make it private: GitHub → Settings → General → Danger Zone. |

## 4. Core pages and functionality

| Item | Status | Notes |
|---|---|---|
| Home, About, Services overview, 9 service pages, Contact | ✅ | All 200, prerendered, unique content |
| Industries / Portfolio / Case studies / Blog / Careers | ❌ | Not built (F11) |
| Testimonials | ⚠️ | Present, provenance unverified (F5) |
| FAQs | ⚠️ | Home and SEO page only |
| Contact form / Quote requests / Booking | ❌ | Client-side only, WhatsApp hand-off; no booking (F1, F3, F16). Quote requests go via WhatsApp buttons |
| Privacy, Cookie policy, Cookie preferences, Terms | ⚠️ | Present and working; placeholders and assumed terms (F2, F6, F7) |
| Accessibility statement | ❌ | Missing |
| Data rights info | ✅ | Privacy policy §8; requests by email only, no workflow |
| Custom 404 | ⚠️ | Page exists (`404.html`, noindex); correct status depends on host (F10) |
| XML sitemap / robots.txt / HTML sitemap | ✅ / ✅ / ❌ | 17 URLs, references sitemap |
| Internal links | ✅ | 21 unique internal targets, all resolve to the right prerendered page |
| Primary nav and CTAs | ✅ | No dead links; every WhatsApp CTA builds a valid `wa.me/447867244213` link with context |
| Form validation | ✅ | Required fields, email and phone format, consent box (unticked by default), `aria-invalid`, focus moves to first error, honeypot |
| Server-side validation / backend receipt | ❌ | No backend (F1) |
| Error messages leak internals | ✅ | Generic messages only |
| Mobile / tablet / desktop | ✅ | No horizontal overflow at 320, 375 or 768 px or on desktop |
| Works without JS | ⚠️ | Text, nav and footer links render; pricing hidden, tabs and mobile menu inert (F4) |
| Live deployment matches release | ⛔ | Not deployed |

## 5. Design and UX

✅ Consistent tokens, type scale and spacing; visible lime focus ring; hover and active states; reduced motion (MotionConfig `reducedMotion="user"` plus CSS); CLS measured at **0**; mobile menu and dialogs close with Escape; touch targets ≥ 24 px (WCAG 2.5.8 AA; footer links are 36 px).
❌/⚠️ Placeholder legal text (F2), misleading success state (F3), "Book" CTA (F16), unverified claims (F5), no photography or portfolio imagery (no visual proof of work). No inert buttons or fake controls were found: every button triggers a real action.

## 6. Service completeness

The approved scope mirrors digifier.in's 9 services. Items marked "within" are covered as features on a broader page, not on their own page.

| Requested service | Status |
|---|---|
| SEO, Website development, E-commerce, Marketplace mgmt, AI content creation | ✅ Dedicated page |
| Digital marketing strategy, Social media, Google Ads, Meta Ads, Content marketing, Email marketing, CRO, Analytics & reporting | ⚠️ Within the Digital Marketing page and packages |
| AEO | ⚠️ Within the SEO page (feature plus FAQ) |
| Website maintenance | ⚠️ Add-on (£20/mo) only |
| Marketing automation, AI consulting | ⚠️ Within AI Solutions |
| GEO, CRM automation, Staff augmentation, Managed tech services | ❌ Not offered. **Decision needed:** a genuine exclusion, or planned? |

Per-page quality: value proposition ✅, deliverables ✅, CTA ✅, unique title and description ✅, Service + Offer + Breadcrumb schema ✅. **Gaps:** target audience is only implied by package labels, there are no use cases or proof (case studies), process is shown on only 4 of 9 pages, and FAQs appear on 1 of 9.

## 7. Lead generation and CRM

| Item | Status |
|---|---|
| Client-side validation, honeypot spam trap | ✅ |
| Server validation, rate limiting, duplicate prevention, CRM sync, email delivery, internal notifications, auto-acknowledgement, lead assignment, source and UTM attribution, status management, newsletter, consent records, export, retention and deletion | ❌ Not implemented. ⛔ **Blocked test:** end-to-end delivery can't be verified until `formEndpoint` (or a CRM) is configured. Then: submit `TEST — Audit Bot / audit-test@example.invalid`, confirm the CRM record, the notification email, the acknowledgement email and the stored consent text, then delete the record. |

Test performed: valid test enquiry submitted, WhatsApp hand-off intercepted in the page so nothing was sent externally. The message was built correctly, and HTML in the message stayed inert text (no XSS).

## 8. Application security (OWASP ASVS baseline)

This is a static site with no authentication, sessions, database, API, uploads or server code. ASVS V2–V4 (auth, session, access control), V5 server-side injection, V12 files and V13 API are **N/A**. Reassess them when a form backend is added.

| Area | Status |
|---|---|
| Secrets in source or bundle | ✅ None (scanned for key patterns; no env usage) |
| Source maps in production | ✅ None |
| XSS sinks (`dangerouslySetInnerHTML`, `eval`, `innerHTML`) | ✅ None in source. JSON-LD is serialised from static data only |
| External links | ✅ All `target=_blank` links have `rel="noopener noreferrer"` |
| Open redirects | ✅ No redirect parameters. Router advisories noted (F9) |
| Dependencies | ⚠️ F9 (prod). Dev-only: `sharp` (libvips CVEs) and `esbuild` dev-server advisory, both build-time only. All major frameworks are 1–3 majors behind |
| HTTPS / TLS / HSTS / CSP / headers / WAF / CDN | ⛔ Defined in `public/_headers` (HSTS preload, CSP, nosniff, frame DENY, Referrer and Permissions policy), but not verifiable until deployment. The CSP already allows GA4 and Formspree; update it if another form or CRM endpoint is chosen |
| Vulnerability disclosure, logging, alerting, incident response, backups, rollback | ❌ / ⛔ No security.txt. Operational processes are not documented. On Netlify or Cloudflare Pages, rollback is one click through atomic deploys |

## 9. GDPR and privacy (UK GDPR, DPA 2018, PECR)

**Consent tests (clean session, storage and network inspected):**

| Scenario | Result |
|---|---|
| 1. No choice | ✅ Banner shown, nothing in storage, no cookies, **zero third-party requests** |
| 2. Reject | ✅ Stored `analytics:false, marketing:false`; no requests |
| 3. Accept | ✅ Stored `true/true`. ⛔ No GA4 ID configured, so tag firing could only be verified by code review: GA loads only on analytics consent, Consent Mode v2 signals are set, and `_ga` cookies are cleared on withdrawal |
| 4. Customise | ✅ Categories default off; "Strictly necessary" locked on; choice saved |
| 5. Withdraw or change | ✅ The footer "Cookie settings" reopens the banner with the current state; changes are saved |
| 6. Return visit | ✅ Choice persists; banner not shown again |

**Strengths:** privacy by default; Reject, Customise and Accept are equally prominent; fonts are self-hosted, so the site makes no Google Fonts requests; WhatsApp only opens on click; the form's consent box is unticked, linked to the policy and required.

**Gaps:** F2 (controller identity, needed for the Art. 13 notice), F7 (inaccurate cookie inventory), no server-side consent or enquiry records (Art. 7(1) "demonstrate consent"), no DSAR intake or identity-verification procedure, no retention enforcement (especially WhatsApp chat history), no documented breach-response procedure, and processor agreements are not verifiable.

**For qualified counsel (not a legal certification):**
1. Lawful basis for enquiries. The policy cites both consent and pre-contract steps; pre-contract steps alone may be the better fit.
2. Transfers to the India team. This needs a Transfer Risk Assessment plus an IDTA or Addendum. Also consider India's DPDP Act 2023 and the DPDP Rules 2025 (phased commencement), which apply to the Indian entity's processing.
3. Using WhatsApp (Meta) for client communication: controller roles and the retention position.
4. ICO data protection fee registration.
5. Applicability of the DMCC Act 2024 to the testimonials and stats (F5).

## 10. Technical SEO

| Check (17 indexable URLs) | Status |
|---|---|
| HTTP 200, no redirect chains | ✅ |
| Self-canonical (non-trailing-slash), unique titles (27–76 chars) and descriptions (83–176 chars) | ✅ (3 descriptions over 160 chars may be truncated in search results) |
| Exactly one h1 per page; heading order | ✅ except /pricing h1→h3 (F14) |
| Robots meta / robots.txt / XML sitemap | ✅ Indexable; 404 is `noindex` |
| Breadcrumbs (visible plus BreadcrumbList) | ✅ |
| Broken internal links, duplicates, orphans | ✅ None. Legal pages are linked from the footer |
| Images and alt text | ✅ No content `<img>` tags; icons are decorative and hidden from screen readers |
| Open Graph / Twitter cards | ✅ 1200×630 `og.png` (107 KB). ⛔ Preview cards need a live URL to test |
| JS rendering / crawlability | ✅ Full HTML is prerendered, so no JavaScript is needed to index content |
| Hreflang | ✅ `en-GB` plus `x-default` self-reference (single locale) |
| HTTPS / trailing slashes / 404 status | ⛔ F10 |
| Structured data | ✅ Valid JSON-LD on all pages (parsed): ProfessionalService, WebSite, FAQPage, Service with GBP Offers, OfferCatalog, BreadcrumbList, ContactPage, ItemList. **No review or rating markup.** Prices match the visible prices. Note: FAQ rich results are now limited to government and health sites, so FAQPage markup is harmless but won't show as a rich result. ⛔ Google Rich Results Test and Search Console require a live URL |

## 11–12. AEO / GEO

✅ Question-style FAQs with direct answers (home, SEO), a pricing table in plain GBP, consistent service names, Organization schema, crawlable prerendered HTML, robots.txt allows all crawlers.
⚠️ No author or expert attribution, no case studies or evidence, no sources for claims, no glossary or comparison content, no blog or topic clusters, identity split with digifier.in (F17). llms.txt is not implemented (optional). Featured-snippet or AI-citation outcomes can't be promised.

## 13. Performance (**lab only**, no field data)

| Metric | Result | Notes |
|---|---|---|
| LCP | 1.72 s (element: hero h1) | Built-in browser, localhost, no throttling. Indicative only |
| CLS | 0.000 | Full-page scroll |
| TTFB | 18 ms | Localhost, not representative |
| INP | Not measured | Needs field data or a Lighthouse timespan run |
| JS / CSS / HTML | 127 KB gz / 7.8 KB gz / 10 KB gz | One JS bundle, one CSS file |
| Fonts | woff2, self-hosted, `font-display: swap` | — |
| Third-party scripts | None by default | — |

**Lighthouse 12.2.1** (19 Oct 2026, after the fixes; default simulated mobile with throttling, against the local preview):

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Home | 92 | 100 | 100 | 100 | 2.5 s | 160 ms | 0.001 |
| Pricing | 93 | 100 | 100 | 100 | 2.5 s | 170 ms | 0.002 |
| Contact | 92 | 100 | 100 | 100 | 2.6 s | 140 ms | 0.001 |
| SEO service | 91 | 100 | 100 | 100 | 2.6 s | 220 ms | 0.016 |

Lighthouse flagged the logo link's accessible name for not containing its visible text (WCAG 2.5.3). That is now fixed: the name is "Digifier.co.uk home", and accessibility scores 100 on re-test. The remaining opportunities are about 40 KB of unused JS (mostly animation code) and LCP sitting right on the 2.5 s line under throttling. Field CWV (p75 LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1) still needs a live site with traffic (CrUX or a RUM tool).

## 14. Accessibility (WCAG 2.2 AA)

**Automated (axe-core 4.10.2, 9 pages, WCAG 2.0/2.1/2.2 A+AA plus best practices):** 1 serious violation (F13) and 1 moderate (F14). All other pages had zero violations, including contrast. Automated tools catch roughly a third of WCAG issues; they can't judge gradient-text contrast, meaning, focus order quality or screen-reader experience.

**Manual:**

| Check | Result |
|---|---|
| Skip link, `lang="en-GB"`, landmarks (header, nav, main, footer) | ✅ |
| Logical tab order, no positive tabindex, visible focus ring | ✅ |
| Form labels, required markers, inline errors with `role="alert"` and `aria-describedby`, focus moves to first error | ✅ |
| Consent controls (`role="switch"` with labels, keyboard operable) | ✅ |
| Escape closes the menu and chat; FAQ uses `aria-expanded` and `aria-controls` | ✅ |
| Reflow at 320 px | ✅ No horizontal scroll |
| Reduced motion | ✅ |
| Auto-moving content | ❌ F12 |
| Focus hidden behind overlay | ⚠️ F15 |
| Screen-reader testing (NVDA, VoiceOver), 200%/400% text zoom | ⛔ Not performed. Recommend a manual pass before launch |
| Video captions | N/A (no video) |

## 15. CMS and administration

**Updated 20 Oct 2026: there is now an admin panel at `/admin/`** (Sveltia CMS 0.229.0, pinned and served from the site itself). Settings, homepage content, and services and pricing live in `src/content/*.json`. Every save is a Git commit; CI validates it and the host deploys. There's still no server or database. The guide for editors is `ADMIN.md`.

| Item | Status | Notes |
|---|---|---|
| Content models | ✅ | Three typed models (settings, homepage, services) with field-level formats in the admin and a build-time check (`scripts/validate-content.mjs`). A coverage check confirmed every content field is editable and every dropdown value is valid |
| Editorial roles, authentication, permissions | ✅ | GitHub accounts: Write = editor, Read = view only. Sign-in by fine-grained access token (works now), local folder (Chrome/Edge), or GitHub OAuth (needs a small auth worker once hosting is chosen). People without write access can't save anything; the admin page itself holds no secrets |
| Draft and published states, previews | ⚠️ | GitHub sign-in publishes on save. Drafts: local-folder mode plus `npm run preview`, or branches with host preview deploys |
| Revision history, audit trail | ✅ | Each save is a named commit ("Content: update … via admin") by the editor; revert on GitHub |
| Publication scheduling | ❌ | Not supported (not needed for this site) |
| Media library | N/A | No content images yet; `public/uploads` is configured for later |
| SEO fields | ✅ | Per service: SEO title and description with length guidance; site name and structured data come from settings |
| Redirect management | ⚠️ | No redirect editor. The admin warns that changing a slug breaks links; add `_redirects` when needed |
| Structured data generation | ✅ | Built from the same content: prices, VAT flag, social profiles (`sameAs`), legal name |
| Global content | ✅ | Settings drive every WhatsApp link, phone link, email, footer, legal pages and VAT labels (tested: one edit updated all 15 WhatsApp links and all 19 price labels) |
| Localisation | N/A | en-GB only |
| Secure configuration changes | ✅ | Format checks in the admin and the build. A form endpoint not allowed by the CSP fails the build. `/admin/` is `noindex`, disallowed in robots.txt and sent with `no-cache` |
| Content deletion | ⚠️ | Removing a service deletes its page; the admin hint says to add a redirect |

**Not tested end to end:** saving through GitHub sign-in, because that needs your GitHub credentials. Verified instead: the admin loads with its config and the production CSP (no violations); every content field is editable; the build check rejects 7 deliberate errors; and simulated edits flow through to every page.

## 16. Analytics and measurement

**Analytics works in code but isn't running yet, because GA4 isn't installed (F22).** I didn't take the tracking script's presence as proof. Instead I built a test copy with a fake ID (`G-TEST000000`), blocked the real Google script in the browser, and recorded every gtag call. Nothing was sent to Google.

| Step | What happened | Correct? |
|---|---|---|
| Landing with `?utm_source=newsletter…`, no cookie choice yet | No gtag, no script, no `dataLayer`, no cookies. A WhatsApp click sent nothing | ✅ |
| Accept all | `consent default` (analytics granted; ad_storage, ad_user_data and ad_personalization denied), then the script loads, then `config` | ✅ |
| Click header WhatsApp, a pricing card, footer phone and footer email | `whatsapp_click {link_area: header, cta: WhatsApp}`, `whatsapp_click {link_area: pricing_card, service: website-design, package: Starter}`, `phone_click {link_area: footer}`, `email_click {link_area: footer}` | ✅ |
| Navigate Home → Pricing → Contact | One `page_view` per page, with the right title | ✅ (after I fixed a bug where it carried the previous page's title) |
| Submit the form with test data | One `generate_lead {method: whatsapp_form, service: seo, budget_band: £250 – £500}`. The WhatsApp message ends with "Source: newsletter / email / oct-test" | ✅ |
| Submit without ticking the consent box | Blocked with an error; no event | ✅ |
| Popup blocked | No event until the visitor clicks "Open WhatsApp to send it" (a button, so the page holds no URL with their details). Then exactly one lead | ✅ |
| Any personal data in analytics? | I searched every recorded call for the name, email, phone, message and `wa.me`. None found | ✅ |
| Withdraw consent | The page reloads. No script and no `_ga` cookies; later clicks and navigations send nothing | ✅ |

| Item | Status |
|---|---|
| Analytics installation / tag manager | ⛔ No GA4 ID yet (F22). No GTM; this site doesn't need one |
| Consent integration | ✅ Tested above |
| Page view accuracy | ✅ In code. ⚠️ Turn off GA4's history-based page changes (F25) |
| Form, click-to-call and WhatsApp events | ✅ Tested above |
| Consultation booking events | N/A: there's no booking system (F16) |
| UTM attribution | ✅ First touch, kept in memory only and visible in the enquiry (F27). GA4 also attributes the landing session itself |
| Conversion deduplication | ✅ `generate_lead` fires once per successful hand-off, never per click and never on failure |
| CRM linkage | ❌ No CRM (F1, your choice) |
| Search Console | ⛔ F22 |
| Privacy-safe parameters, form contents excluded | ✅ Tested above |
| Error and uptime monitoring | ❌ F28 |
| Reporting documentation | ⚠️ Event names and parameters are documented at the top of `src/lib/analytics.js` and in this section. Write a one-page GA4 guide once the property exists |

## 17. AI and automation

**The site has no AI features.** There are no AI API calls, model SDKs, API keys, server functions or agents. The WhatsApp widget is static links with pre-filled text, and nothing is sent on the visitor's behalf. The "AI Content Creation" and "AI Solutions" pages describe services sold to clients, not features of the site.

So every check in this section (key handling, prompt injection, tool permissions, rate and cost limits, retention and the rest) is **not applicable**, and, as the brief requires, I didn't add any. If an AI assistant is added later, it needs at least the following before launch:
- API keys kept server-side only;
- no access to client records;
- no tool that sends, publishes or books anything without human approval;
- per-IP rate limits and a spend cap;
- a timeout, with WhatsApp as the fallback;
- disclosure in the privacy policy, including the provider's data-retention terms;
- conversation logs kept no longer than enquiries.

## 18. Scalability and reliability

**Architecture:** prerendered static HTML, CSS and JS served from a CDN. There's no server code, database, queue or background job, and the site stores no user data.

| Item | Status |
|---|---|
| Modular architecture | ✅ Data, components and pages are separate, with shared pricing-tabs and analytics modules |
| Database indexes, queries, connections | N/A (no database) |
| Caching and invalidation | ✅ `/assets/*` is cached for a year as immutable. That's safe because filenames are content-hashed. HTML uses the host's default revalidation, so each deploy goes live at once without purging |
| CDN behaviour | ⛔ To verify after deployment: cache headers, HTTP/2 or 3, compression |
| Background jobs, retries, idempotency | N/A |
| Error handling | ✅ Form validation, the blocked-popup fallback, and a custom 404 page with a real 404 status |
| Health checks, logging, monitoring | ❌ F28. A static site needs only uptime checks on `/` and `/contact` |
| Rate limiting | N/A for static pages; needed if a form backend is added (F1) |
| Storage and resource limits | ✅ `dist/` is about 2.0 MB, far inside the free tiers of Cloudflare Pages and Netlify |
| Load testing | **Not performed**: there's no deployment and no authorised test environment. Scalability is **not proven**. The assumption is that a CDN serving static files scales with the provider. The practical bottleneck is how fast the team answers WhatsApp |
| Backups, restore, RTO/RPO, disaster recovery | ⚠️ The source is now on GitHub, so the recovery point is the last push. Once hosting is connected, recovery takes minutes (redeploy any commit). This isn't written down as a procedure yet. Enquiries live only in WhatsApp, so back up WhatsApp on the phone |

## 19. Integrations and operations

| Integration | Status | Notes |
|---|---|---|
| CRM | ❌ | None (F1, your choice) |
| Email delivery | ⚠️ | The site sends no email. `hello@` and `privacy@digifier.co.uk` are only `mailto:` links, and the mailboxes are still unconfirmed (F17). Set SPF, DKIM and DMARC on the domain |
| Calendar booking | N/A | None; the CTA was renamed (F16) |
| WhatsApp | ✅ | `wa.me/447867244213` links built in one function (`waLink`), with click tracking (§16) |
| Analytics / Search Console | ⛔ | F22 |
| CMS | N/A | §15 |
| Payments | N/A | No online payments |
| Webhooks, external APIs, scheduled jobs | N/A | None |
| Error notifications | ❌ | F28 |
| Environment variables | ✅ | None needed, and there are no secrets in the code (checked). `.env*` is gitignored anyway |
| CI/CD | ⚠️ | CI workflow added (build, audit, prerender check) but not pushed yet. No deployment pipeline until hosting is connected |
| Deployment and rollback | ⛔ | Not deployed. With Git-connected hosting, every push to `main` deploys, and rollback is one click to a previous deploy. The README covers build steps and post-deploy checks |
| DNS and TLS | ⛔ | At go-live: point the apex domain and `www` at the host, make `digifier.co.uk` canonical and 301 `www` to it, keep the host's automatic TLS, and confirm the HSTS header from `_headers`. Only then consider HSTS preload |
| Monitoring / backups | ⚠️ | GitHub is the source backup; no monitoring yet (F28) |
| Dependency updates | ✅ | Dependabot runs monthly, and CI runs a high-severity audit on every change. Current state: 2 moderate react-router advisories, fixed only in v7 |

## Test data and safety

All test enquiries used `TEST — Audit Bot` and `audit-test@example.invalid`. WhatsApp hand-offs were intercepted inside the page, so no message reached WhatsApp or any real person. No external systems were written to. One script (axe-core 4.10.2) was loaded from cdnjs into the local preview only. The analytics tests used a fake GA4 ID in a throwaway build, with Google's script blocked in the page, so nothing reached Google.
