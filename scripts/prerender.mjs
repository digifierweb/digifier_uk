// Renders every route to static HTML so search engines get full content + meta without running JS.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf-8')
const { render, ROUTES } = await import(pathToFileURL(path.join(root, 'dist-server', 'entry-server.js')).href)
// Read settings directly: plain Node can't import JSON through site.js the way Vite does.
const settings = JSON.parse(fs.readFileSync(path.join(root, 'src', 'content', 'settings.json'), 'utf-8'))
const SITE = { url: settings.business.url.replace(/\/+$/, '') }

for (const url of ROUTES) {
  const { html, helmet } = render(url)
  const head = [helmet.title, helmet.meta, helmet.link, helmet.script].map((h) => h.toString()).join('\n    ')
  const page = template
    .replace('<!--head-->', head)
    .replace('<div id="root"><!--app-->', `<div id="root" data-path="${url}">${html}`)
  // /pricing -> pricing.html: Cloudflare Pages and Netlify serve it at /pricing and redirect /pricing/ to it,
  // so each page has one URL that matches its canonical tag.
  const file = url === '/' ? 'index.html' : url === '/404' ? '404.html' : `${url.slice(1)}.html`
  const out = path.join(dist, file)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, page)
  console.log('prerendered', url, '->', file)
}

// No <lastmod>: a build date on every URL is inaccurate, and search engines ignore lastmod they can't trust.
const urls = ROUTES.filter((r) => r !== '/404')
const priority = (r) => (r === '/' ? '1.0' : r.startsWith('/services') || r === '/pricing' ? '0.9' : /policy|terms/.test(r) ? '0.3' : '0.7')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((r) => `  <url><loc>${SITE.url}${r === '/' ? '/' : r}</loc><priority>${priority(r)}</priority></url>`).join('\n')}
</urlset>
`
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap)
fs.rmSync(path.join(root, 'dist-server'), { recursive: true, force: true })
console.log('sitemap.xml written with', urls.length, 'urls')
