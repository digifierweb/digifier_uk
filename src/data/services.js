// Services, packages and prices live in src/content/services.json, edited through the admin panel (/admin).
// Prices are GBP round figures; `price: null` means quote-based.
import data from '../content/services.json'

const bySlug = Object.fromEntries(data.services.map((s) => [s.slug, s]))

export const SERVICES = data.services.map((s) => {
  // `packagesFrom` reuses another service's packages and add-ons (e.g. rebuilds use website packages).
  const source = s.packagesFrom ? bySlug[s.packagesFrom] : s
  return {
    ...s,
    packages: source?.packages?.length ? source.packages : undefined,
    addons: source?.addons?.length ? source.addons : undefined,
    benefits: s.benefits?.length ? s.benefits : undefined,
    // The admin may save an empty object or nulls for unused optional fields.
    fromPrice: s.fromPrice?.price != null ? { per: '', ...s.fromPrice } : undefined,
    note: s.note || undefined,
    packagesFrom: s.packagesFrom || undefined,
    // Components expect [title, text] and [question, answer] pairs.
    process: s.process?.length ? s.process.map((p) => [p.title, p.text]) : undefined,
    faqs: s.faqs?.length ? s.faqs.map((f) => [f.question, f.answer]) : undefined,
  }
})

export const getService = (slug) => SERVICES.find((s) => s.slug === slug)

export const priceOf = (pkg) => pkg.price ?? null
