# Admin panel guide

The admin panel is at **`/admin/`** (for example `https://digifier.co.uk/admin/`). It edits the site's content files in GitHub, so there's no database or server to maintain.

## What you can change

| Section | What's in it |
|---|---|
| **Site settings** | Brand and site name, registered company name, company number, place of registration, registered office, ICO number, website address, tagline, whether prices include VAT, group website link · enquiries and privacy emails, phone, WhatsApp number and default message, opening hours · Instagram, LinkedIn, Facebook, X, YouTube and TikTok links (empty ones are hidden) · Google Analytics 4 ID and contact-form endpoint · "Policies last updated" date |
| **Homepage** | Hero label, headline, rotating words, intro paragraph and proof line · stats band (also on About) · testimonials · "Why choose us" · "How we work" steps (also the default on service pages) · homepage FAQs |
| **Services & pricing** | Every service: URL slug, icon, name, card text, page introduction, features, benefits, delivery steps, packages (name, price, "from", suffix, most popular, description, what's included), add-ons, starting price for quote-based services, FAQs, pricing note, SEO title and description. Services can reuse another service's packages, as Website Rebuilding does |

Changes appear everywhere they're used. Change the WhatsApp number once, for example, and every WhatsApp button, the chat widget and the contact form use it. Prices also update in structured data.

**Still edited in code, on purpose:**
- **Legal page wording** (privacy, cookies, terms, accessibility): changes should go through your solicitor.
- **About and Contact page copy, the navigation and the cookie banner text**: rarely change. Ask a developer, or they can be added to the admin later.

## Signing in

You need a GitHub account with **Write** access to `digifierweb/digifier_uk`.

### Option 1: access token (works now, any browser)

1. On GitHub, go to **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Fill it in:
   - **Repository access:** only `digifierweb/digifier_uk`.
   - **Permissions:** Contents → **Read and write** (Metadata read-only is added automatically).
   - **Expiration:** 90 days or less.
3. Open `/admin/`, choose **Sign In Using Access Token** and paste the token.

The token stays in that browser only. Never share it, or paste it anywhere other than your own admin page. Revoke it on GitHub when it's no longer needed, or when someone leaves.

### Option 2: work with the local copy (Chrome or Edge, on a computer with the project)

Open `/admin/` from `npm run dev` or `npm run preview`, choose **Work with Local Repository**, and select the `digifier-uk` folder. Edits are saved straight to the files. Commit and push them yourself. This is the way to draft changes privately and preview them with `npm run build && npm run preview` before publishing.

### Option 3: "Sign In with GitHub" button (needs setting up once)

This needs a small OAuth service, because GitHub requires a server-side secret. Once hosting is chosen, deploy Sveltia's free [`sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth) Cloudflare Worker, create a GitHub OAuth App pointing at it, and add `base_url: <worker URL>` under `backend` in `public/admin/config.yml`.

## Who can do what

- **Access is controlled in GitHub:** repo → Settings → Collaborators.
- **Write:** can edit content through the admin.
- **Read:** can view but not save.
- **Admin:** keep this to the owner.
- Remove people from the repo when they leave, and revoke their tokens.

## How publishing works

1. **Save** in the admin. This creates a commit on `main` named "Content: update … via admin", with your name.
2. **GitHub Actions CI** builds the site and runs the content check (`scripts/validate-content.mjs`).
3. **The host deploys `main`** once it's connected to the repo. If the build fails, the host keeps the previous version live, so a mistake can't take the site down.

The content check blocks, for example:
- a malformed WhatsApp number or email
- a GA4 ID in the wrong format
- a URL slug with spaces
- prices that aren't whole pounds
- two "most popular" packages
- a package link to a service that doesn't exist
- a form service that the site's security policy would block

It also warns about over-long SEO text and a missing ICO number.

**History and undo:**
- Every save is a commit, so GitHub shows who changed what and when.
- To undo a change, revert the commit on GitHub.
- To roll back the live site, redeploy an earlier deploy from the host's dashboard.

**Drafts and scheduling:** the GitHub sign-in publishes on save; there's no separate draft state. For a private draft, use Option 2, or edit on a branch and use the host's preview deploys. Scheduled publishing isn't supported.

## Good practice

- **Only publish claims you can evidence:** stats, ratings and testimonials (UK consumer law). Testimonials need the client's permission.
- **Changing a service's URL slug breaks existing links.** Ask a developer to add a redirect.
- **Update "Policies last updated"** whenever the legal pages change.
- **If you set a contact-form endpoint on a new service,** its domain must be added to `connect-src` in `public/_headers`. The content check tells you if it's missing.
