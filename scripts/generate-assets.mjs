// One-off: builds icons and the 1200x630 social share image from the digifier.in logo files.
// Sources: scripts/mark-source.webp (the "D" mark) and public/logo-wordmark.webp (mark + "Digifier").
import sharp from 'sharp'

const mark = 'scripts/mark-source.webp'
const BG = '#07070d'
// Transparent icons: browser tab favicons and the Organization schema logo.
for (const [name, size] of [['favicon-32.png', 32], ['favicon-48.png', 48], ['logo.png', 512]]) {
  await sharp(mark).resize(size, size).png().toFile(`public/${name}`)
}
// Padded on the site background: home-screen and app icons (iOS fills transparency with black anyway).
for (const [name, size] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  const inner = Math.round(size * 0.72)
  const pad = Math.round((size - inner) / 2)
  await sharp(mark).resize(inner, inner)
    .extend({ top: pad, bottom: size - inner - pad, left: pad, right: size - inner - pad, background: BG })
    .flatten({ background: BG }).png().toFile(`public/${name}`)
}

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
<radialGradient id="a" cx="85%" cy="10%" r="60%"><stop offset="0" stop-color="#8b5cf6" stop-opacity=".75"/><stop offset="1" stop-color="#07070d" stop-opacity="0"/></radialGradient>
<radialGradient id="b" cx="5%" cy="100%" r="55%"><stop offset="0" stop-color="#ec4899" stop-opacity=".55"/><stop offset="1" stop-color="#07070d" stop-opacity="0"/></radialGradient>
<linearGradient id="t" x1="0" x2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset=".55" stop-color="#ec4899"/><stop offset="1" stop-color="#f59e0b"/></linearGradient>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#ec4899"/></linearGradient>
</defs>
<rect width="1200" height="630" fill="#07070d"/><rect width="1200" height="630" fill="url(#a)"/><rect width="1200" height="630" fill="url(#b)"/>
<text x="352" y="130" font-family="Segoe UI, Arial, sans-serif" font-weight="500" font-size="40" fill="#a6a6bd">.co.uk</text>
<text x="80" y="330" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="84" fill="#fff" letter-spacing="-3">We help brands</text>
<text x="80" y="425" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="84" fill="url(#t)" letter-spacing="-3">stand out online.</text>
<text x="80" y="520" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#c9c9d9">Web Design · SEO · Digital Marketing · E-Commerce · Apps · AI</text>
<rect x="80" y="555" width="300" height="4" rx="2" fill="#d4ff3a"/>
</svg>`
const word = await sharp('public/logo-wordmark.webp').resize({ height: 72 }).png().toBuffer()
await sharp(Buffer.from(og)).composite([{ input: word, left: 80, top: 72 }]).png().toFile('public/og.png')
console.log('assets generated')
