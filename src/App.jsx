import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, LazyMotion, MotionConfig, m, useScroll, useSpring } from 'framer-motion'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppWidget from './components/WhatsAppWidget.jsx'
import CookieConsent from './components/CookieConsent.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import ServiceDetail from './pages/ServiceDetail.jsx'
import Pricing from './pages/Pricing.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import { PrivacyPolicy, CookiePolicy, Terms, AccessibilityStatement } from './pages/Legal.jsx'
import Sitemap from './pages/Sitemap.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })
  return <m.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
}

const loadFeatures = () => import('./lib/motion-features.js').then((r) => r.default)

const page = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0 })
  }, [location.pathname, location.hash])

  return (
    // LazyMotion + `m` components keep unused animation features out of the bundle; strict flags any stray `motion.*`.
    <LazyMotion features={loadFeatures} strict>
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <m.main id="main" key={location.pathname} variants={page} initial="initial" animate="animate" exit="exit">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/accessibility" element={<AccessibilityStatement />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </m.main>
      </AnimatePresence>
      <Footer />
      <WhatsAppWidget />
      <CookieConsent />
    </MotionConfig>
    </LazyMotion>
  )
}
