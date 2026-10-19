// Checks src/content/*.json before every build (and so in CI on every admin save).
// A failed check stops the build, so a broken edit can't reach the live site.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dir = path.join(root, 'src', 'content')
const errors = []
const warnings = []

function load(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, name), 'utf-8'))
  } catch (e) {
    errors.push(`${name}: not valid JSON (${e.message})`)
    return null
  }
}

const isStr = (v) => typeof v === 'string' && v.trim() !== ''
const optStr = (v) => v == null || typeof v === 'string'
const isNum = (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0
const wholePounds = (v) => Number.isInteger(v) && v >= 0
function need(cond, where, msg) {
  if (!cond) errors.push(`${where}: ${msg}`)
}
function match(v, re, where, msg, optional = false) {
  if (optional && (v == null || v === '')) return
  need(typeof v === 'string' && re.test(v), where, `${msg} (got ${JSON.stringify(v)})`)
}

// ---------- settings.json
const settings = load('settings.json')
if (settings) {
  const { business: b = {}, contact: c = {}, social = {}, integrations: i = {}, legal = {} } = settings
  const w = 'settings'
  for (const k of ['name', 'siteName', 'legalName', 'tagline']) need(isStr(b[k]), `${w}.business.${k}`, 'is required')
  match(b.url, /^https:\/\/[^/\s]+$/, `${w}.business.url`, 'must be https:// with no trailing slash')
  match(b.companyNumber, /^([0-9]{8}|[A-Z]{2}[0-9]{6})$/, `${w}.business.companyNumber`, 'must be an 8-character company number', true)
  match(b.icoNumber, /^[A-Z0-9]{8}$/, `${w}.business.icoNumber`, 'must be 8 characters', true)
  need(typeof b.pricesIncludeVat === 'boolean', `${w}.business.pricesIncludeVat`, 'must be true or false')
  match(b.groupSiteUrl, /^https:\/\/.+/, `${w}.business.groupSiteUrl`, 'must start with https://', true)
  if (b.companyNumber && (!b.registeredAddress || !b.registeredIn)) {
    warnings.push(`${w}.business: a company website must show its registered office and place of registration`)
  }
  if (!b.icoNumber) warnings.push(`${w}.business.icoNumber is empty (needed in the privacy policy once registered)`)

  const email = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
  match(c.email, email, `${w}.contact.email`, 'must be an email address')
  match(c.privacyEmail, email, `${w}.contact.privacyEmail`, 'must be an email address')
  match(c.phoneE164, /^\+[1-9][0-9]{7,14}$/, `${w}.contact.phoneE164`, 'must look like +447867244213')
  match(c.whatsapp, /^[1-9][0-9]{7,14}$/, `${w}.contact.whatsapp`, 'digits only with country code, no +')
  for (const k of ['phoneDisplay', 'whatsappDefaultMessage', 'hours']) need(isStr(c[k]), `${w}.contact.${k}`, 'is required')
  if (c.phoneE164 && c.phoneDisplay && c.phoneE164.replace(/\D/g, '') !== c.phoneDisplay.replace(/\D/g, '')) {
    warnings.push(`${w}.contact: phoneDisplay and phoneE164 are different numbers`)
  }

  for (const [k, v] of Object.entries(social)) match(v, /^https:\/\/.+/, `${w}.social.${k}`, 'must start with https://', true)

  match(i.ga4Id, /^G-[A-Z0-9]{6,12}$/, `${w}.integrations.ga4Id`, 'must look like G-XXXXXXXXXX', true)
  match(i.formEndpoint, /^https:\/\/.+/, `${w}.integrations.formEndpoint`, 'must start with https://', true)
  if (/^https:\/\/.+/.test(i.formEndpoint || '')) {
    // The site's Content-Security-Policy must allow the form service, or submissions are silently blocked.
    const origin = new URL(i.formEndpoint).origin
    const headers = fs.readFileSync(path.join(root, 'public', '_headers'), 'utf-8')
    if (!headers.includes(origin)) errors.push(`${w}.integrations.formEndpoint: ${origin} must be added to connect-src in public/_headers`)
  }

  need(isStr(legal.lastUpdated), `${w}.legal.lastUpdated`, 'is required')
}

// ---------- home.json
const home = load('home.json')
if (home) {
  const h = home.hero || {}
  for (const k of ['eyebrow', 'headline', 'lead']) need(isStr(h[k]), `home.hero.${k}`, 'is required')
  need(Array.isArray(h.rotatingWords) && h.rotatingWords.length > 0 && h.rotatingWords.every(isStr), 'home.hero.rotatingWords', 'needs at least one word')
  need(optStr(h.proofHighlight) && optStr(h.proofText), 'home.hero.proof', 'must be text')

  const list = (key, fields) => {
    need(Array.isArray(home[key]), `home.${key}`, 'must be a list')
    ;(home[key] || []).forEach((item, n) => {
      for (const f of fields) need(isStr(item?.[f]), `home.${key}[${n + 1}].${f}`, 'is required')
    })
  }
  list('testimonials', ['name', 'quote'])
  list('why', ['title', 'text'])
  list('process', ['title', 'time', 'text'])
  list('faqs', ['question', 'answer'])
  need((home.process || []).length >= 2, 'home.process', 'needs at least 2 steps (the timeline spans them)')

  need(Array.isArray(home.stats), 'home.stats', 'must be a list')
  ;(home.stats || []).forEach((s, n) => {
    need(isNum(s.value), `home.stats[${n + 1}].value`, 'must be a number')
    need(isStr(s.label), `home.stats[${n + 1}].label`, 'is required')
  })
}

// ---------- services.json
const data = load('services.json')
if (data) {
  const services = data.services || []
  need(services.length > 0, 'services', 'needs at least one service')
  const icons = ['Sparkles', 'PenTool', 'ShoppingBag', 'RefreshCw', 'Megaphone', 'Search', 'Building2', 'Smartphone', 'Store']
  const slugs = services.map((s) => s.slug)
  slugs.forEach((s, n) => {
    if (slugs.indexOf(s) !== n) errors.push(`services: slug "${s}" is used twice`)
  })

  services.forEach((s, n) => {
    const w = `services[${n + 1}] (${s.title || s.slug || 'untitled'})`
    match(s.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${w}.slug`, 'lowercase letters, numbers and hyphens only')
    need(icons.includes(s.icon), `${w}.icon`, `must be one of ${icons.join(', ')}`)
    for (const k of ['title', 'short', 'intro', 'seoTitle', 'seoDescription']) need(isStr(s[k]), `${w}.${k}`, 'is required')
    need(Array.isArray(s.features) && s.features.length > 0, `${w}.features`, 'needs at least one feature')

    if (s.packagesFrom) {
      const src = services.find((x) => x.slug === s.packagesFrom)
      need(src && src !== s, `${w}.packagesFrom`, `"${s.packagesFrom}" is not another service`)
      need(!src?.packagesFrom, `${w}.packagesFrom`, 'cannot point at a service that itself reuses packages')
    }

    const pkgs = s.packages || []
    pkgs.forEach((p, k) => {
      const pw = `${w}.packages[${k + 1}]`
      need(isStr(p.name), `${pw}.name`, 'is required')
      need(p.price == null || wholePounds(p.price), `${pw}.price`, 'must be whole pounds, or empty for a quote')
      need(isStr(p.blurb), `${pw}.blurb`, 'is required')
      need(Array.isArray(p.features) && p.features.length > 0, `${pw}.features`, 'needs at least one item')
    })
    if (pkgs.filter((p) => p.popular).length > 1) errors.push(`${w}: only one package can be marked most popular`)

    ;(s.addons || []).forEach((a, k) => {
      need(isStr(a.name), `${w}.addons[${k + 1}].name`, 'is required')
      need(wholePounds(a.price), `${w}.addons[${k + 1}].price`, 'must be whole pounds')
    })
    if (s.fromPrice && s.fromPrice.price != null) need(wholePounds(s.fromPrice.price), `${w}.fromPrice.price`, 'must be whole pounds')

    ;(s.process || []).forEach((p, k) => need(isStr(p.title) && isStr(p.text), `${w}.process[${k + 1}]`, 'needs a step and a description'))
    ;(s.faqs || []).forEach((f, k) => {
      need(isStr(f.question) && isStr(f.answer), `${w}.faqs[${k + 1}]`, 'needs a question and an answer')
      if (/\{(from|to)\}/.test(f.answer || '') && s.fromPrice?.price == null) {
        errors.push(`${w}.faqs[${k + 1}]: uses {from}/{to} but the service has no starting price`)
      }
    })

    if (s.seoTitle && s.seoTitle.length > 62) warnings.push(`${w}.seoTitle is ${s.seoTitle.length} characters (aim for under 60)`)
    if (s.seoDescription && (s.seoDescription.length < 70 || s.seoDescription.length > 165)) {
      warnings.push(`${w}.seoDescription is ${s.seoDescription.length} characters (aim for 120–160)`)
    }
  })
}

for (const w of warnings) console.warn(`content warning: ${w}`)
if (errors.length) {
  console.error(`\nContent check failed (${errors.length}):\n${errors.map((e) => `  - ${e}`).join('\n')}\n`)
  process.exit(1)
}
console.log(`content ok (${warnings.length} warning${warnings.length === 1 ? '' : 's'})`)
