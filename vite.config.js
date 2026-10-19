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

export default defineConfig({
  plugins: [react(), cleanUrls],
  ssr: { noExternal: ['react-helmet-async'] },
  build: { cssCodeSplit: false },
})
