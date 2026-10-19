import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `vite preview`: behave like Cloudflare Pages / Netlify with the prerendered files, so local checks match production:
// /pricing serves dist/pricing.html, /pricing/ redirects to /pricing, unknown paths get 404.html with status 404.
const cleanUrls = {
  name: 'clean-urls',
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      const [url, query = ''] = req.url.split('?')
      // Folders with an index.html (the /admin panel) are served at /folder/, as the hosts do.
      const dirIndex = path.join('dist', url, 'index.html')
      if (url.endsWith('/') && url !== '/' && fs.existsSync(dirIndex)) {
        req.url = `${url}index.html${query ? `?${query}` : ''}`
        return next()
      }
      if (!url.endsWith('/') && !path.extname(url) && fs.existsSync(dirIndex)) {
        res.statusCode = 301
        res.setHeader('Location', `${url}/${query ? `?${query}` : ''}`)
        return res.end()
      }
      if (url !== '/' && url.endsWith('/')) {
        res.statusCode = 301
        res.setHeader('Location', url.replace(/\/+$/, '') + (query ? `?${query}` : ''))
        return res.end()
      }
      if (url === '/' || path.extname(url)) {
        if (url === '/' || fs.existsSync(path.join('dist', url))) return next()
      } else if (fs.existsSync(path.join('dist', `${url}.html`))) {
        req.url = `${url}.html${query ? `?${query}` : ''}`
        return next()
      }
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end(fs.readFileSync(path.join('dist', '404.html')))
    })
  },
}

// Admin panel: serve the pinned Sveltia CMS bundle from our own origin (so the strict CSP needs no CDN),
// straight from node_modules in dev and copied into dist/admin on client builds.
const CMS_DIR = path.join('node_modules', '@sveltia', 'cms', 'dist')
const CMS_FILES = ['sveltia-cms.js', 'chunks/react-dom.js']
let isSsrBuild = false
const adminCms = {
  name: 'admin-cms',
  configResolved(config) {
    isSsrBuild = !!config.build.ssr
  },
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const file = CMS_FILES.find((f) => req.url.split('?')[0] === `/admin/${f}`)
      if (!file) return next()
      res.setHeader('Content-Type', 'text/javascript; charset=utf-8')
      res.end(fs.readFileSync(path.join(CMS_DIR, file)))
    })
  },
  writeBundle(options) {
    if (isSsrBuild) return
    for (const f of CMS_FILES) {
      const out = path.join(options.dir, 'admin', f)
      fs.mkdirSync(path.dirname(out), { recursive: true })
      fs.copyFileSync(path.join(CMS_DIR, f), out)
    }
  },
}

export default defineConfig({
  plugins: [react(), cleanUrls, adminCms],
  ssr: { noExternal: ['react-helmet-async'] },
  build: { cssCodeSplit: false },
})
