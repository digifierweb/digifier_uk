import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'
import { Cookie } from 'lucide-react'
import { readConsent, saveConsent, applyConsent } from '../lib/consent.js'

function Toggle({ id, label, desc, checked, disabled, onChange }) {
  return (
    <div className="cc-row">
      <div>
        <label htmlFor={id} className="cc-label">{label}</label>
        <p className="cc-desc">{desc}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`switch ${checked ? 'on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <m.span className="knob" layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
        <span className="sr-only">{checked ? 'On' : 'Off'}</span>
      </button>
    </div>
  )
}

export default function CookieConsent() {
  const [show, setShow] = useState(false)
  const [custom, setCustom] = useState(false)
  const [prefs, setPrefs] = useState({ analytics: false })

  useEffect(() => {
    const c = readConsent()
    if (c) {
      applyConsent(c)
      setPrefs({ analytics: c.analytics })
    } else {
      const t = setTimeout(() => setShow(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const open = () => {
      const c = readConsent()
      if (c) setPrefs({ analytics: c.analytics })
      setCustom(true)
      setShow(true)
    }
    window.addEventListener('digifier:cookie-settings', open)
    return () => window.removeEventListener('digifier:cookie-settings', open)
  }, [])

  const decide = (p) => {
    saveConsent(p)
    setPrefs(p)
    setShow(false)
    setCustom(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <m.section
          className="cc"
          role="dialog"
          aria-modal="false"
          aria-labelledby="cc-title"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        >
          <div className="cc-top">
            <span className="cc-icon"><Cookie size={20} aria-hidden="true" /></span>
            <h2 id="cc-title">Your privacy, your choice</h2>
          </div>
          <p className="cc-text">
            We use strictly necessary storage to run this site. With your permission we'd also like to use analytics
            cookies to understand how the site is used and improve our services. Nothing optional is set unless
            you say yes. Read our <Link to="/cookie-policy">cookie policy</Link>.
          </p>
          <AnimatePresence initial={false}>
            {custom && (
              <m.div
                className="cc-prefs"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <Toggle id="cc-n" label="Strictly necessary" desc="Remembers your cookie choice. Always on." checked disabled onChange={() => {}} />
                <Toggle id="cc-a" label="Analytics" desc="Anonymous usage statistics (Google Analytics 4)." checked={prefs.analytics} onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))} />
              </m.div>
            )}
          </AnimatePresence>
          <div className="cc-actions">
            <button className="btn btn-outline btn-sm" onClick={() => decide({ analytics: false })}>Reject all</button>
            {custom ? (
              <button className="btn btn-outline btn-sm" onClick={() => decide(prefs)}>Save choices</button>
            ) : (
              <button className="btn btn-outline btn-sm" onClick={() => setCustom(true)}>Customise</button>
            )}
            <button className="btn btn-outline btn-sm" onClick={() => decide({ analytics: true })}>Accept all</button>
          </div>
        </m.section>
      )}
    </AnimatePresence>
  )
}
