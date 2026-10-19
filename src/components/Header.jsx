import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { SERVICES } from '../data/services.js'
import { waLink } from '../data/site.js'
import { WhatsAppIcon } from './Icons.jsx'

export function Logo() {
  return (
    <Link to="/" className="logo">
      {/* Accessible name "Digifier.co.uk home" contains the visible text (WCAG 2.5.3). */}
      <img className="logo-img" src="/logo-wordmark.webp" alt="Digifier" width="435" height="116" decoding="async" />
      <span className="logo-uk">.co.uk</span>
      <span className="sr-only"> home</span>
    </Link>
  )
}

const NAV = [
  ['Services', '/services'],
  ['Pricing', '/pricing'],
  ['About', '/about'],
  ['Contact', '/contact'],
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()
  const { pathname } = useLocation()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > 400 && y > prev && !open)
  })

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    // Keep keyboard and screen-reader focus inside the open menu.
    const behind = document.querySelectorAll('#main, .site-footer, .wa, .skip-link, .header-inner > .logo')
    behind.forEach((el) => (el.inert = open))
    if (open) document.querySelector('#mobile-menu a')?.focus()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      behind.forEach((el) => (el.inert = false))
    }
  }, [open])

  return (
    <m.header
      className={`site-header ${scrolled ? 'is-scrolled' : ''}`}
      animate={{ y: hidden ? '-110%' : 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="container header-inner">
        <Logo />
        <nav className="nav-desktop" aria-label="Main">
          {NAV.map(([label, to]) => (
            <NavLink key={to} to={to} className="nav-link">
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && <m.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="header-cta">
          <a className="btn btn-ghost btn-sm hide-sm" href={waLink()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={18} /> WhatsApp
          </a>
          <Link to="/contact" className="btn btn-primary btn-sm hide-sm">
            Free consultation <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button
            className="menu-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)', transition: { duration: 0.35 } }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <m.nav
              aria-label="Mobile"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}
            >
              {[...NAV, ['Home', '/']].map(([label, to]) => (
                <m.div key={to} variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } }}>
                  <NavLink to={to} className="mobile-link">{label}</NavLink>
                </m.div>
              ))}
              <m.p className="mobile-sub" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                Services
              </m.p>
              <m.div className="mobile-services" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                {SERVICES.map((s) => (
                  <Link key={s.slug} to={`/services/${s.slug}`}>{s.title}</Link>
                ))}
              </m.div>
              <m.a
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="btn btn-whatsapp btn-block"
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon size={20} /> Chat on WhatsApp
              </m.a>
            </m.nav>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  )
}
