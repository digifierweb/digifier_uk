// Homepage content lives in src/content/home.json, edited through the admin panel (/admin).
import home from '../content/home.json'

export const HERO = home.hero
export const STATS = home.stats
export const TESTIMONIALS = home.testimonials
export const WHY = home.why.map((w) => [w.title, w.text])
export const PROCESS = home.process.map((p) => [p.title, p.time, p.text])
export const HOME_FAQS = home.faqs.map((f) => [f.question, f.answer])
