import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'
import { X, Send } from 'lucide-react'
import { SITE, waLink } from '../data/site.js'
import { WhatsAppIcon } from './Icons.jsx'

const TOPICS = [
  ['New website', "Hi Digifier, I'm interested in a new website."],
  ['Digital marketing', "Hi Digifier, I'd like to discuss a digital marketing plan."],
  ['SEO audit', "Hi Digifier, I'd like a free SEO audit."],
  ['E-commerce store', "Hi Digifier, I'd like to build an online store."],
  ['App development', "Hi Digifier, I have an app idea I'd like to discuss."],
  ['Something else', "Hi Digifier, I'd like to talk about a project."],
]

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false)
  const [nudge, setNudge] = useState(false)
  const card = useRef(null)
  const fab = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setNudge(true), 6000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!open) return
    card.current?.querySelector('.wa-topic')?.focus()
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      fab.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="wa">
      <AnimatePresence>
        {open && (
          <m.div
            ref={card}
            className="wa-card"
            role="dialog"
            aria-label="Chat with Digifier on WhatsApp"
            initial={{ opacity: 0, y: 20, scale: 0.92, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <div className="wa-head">
              <span className="wa-avatar"><WhatsAppIcon size={22} /></span>
              <div>
                <strong>Digifier UK</strong>
                <span className="wa-status"><span className="dot" /> Typically replies within an hour</span>
              </div>
              <button className="wa-close" onClick={() => { setOpen(false); fab.current?.focus() }} aria-label="Close chat">
                <X size={18} />
              </button>
            </div>
            <div className="wa-body">
              <m.div className="wa-bubble" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                Hi there 👋 What can we help you with today?
              </m.div>
              <m.div
                className="wa-topics"
                initial="h"
                animate="v"
                variants={{ v: { transition: { staggerChildren: 0.04, delayChildren: 0.25 } } }}
              >
                {TOPICS.map(([label, msg]) => (
                  <m.a
                    key={label}
                    href={waLink(msg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wa-topic"
                    variants={{ h: { opacity: 0, y: 8 }, v: { opacity: 1, y: 0 } }}
                    whileHover={{ x: 4 }}
                  >
                    {label} <Send size={14} aria-hidden="true" />
                  </m.a>
                ))}
              </m.div>
            </div>
            <p className="wa-foot">
              Opens WhatsApp ({SITE.phoneDisplay}). WhatsApp is operated by Meta — see our <Link to="/privacy-policy">privacy policy</Link>.
            </p>
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {nudge && !open && (
          <m.button
            className="wa-nudge"
            onClick={() => { setOpen(true); setNudge(false) }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            Questions? Chat with us
          </m.button>
        )}
      </AnimatePresence>

      <m.button
        ref={fab}
        className="wa-fab"
        aria-label={open ? 'Close WhatsApp chat' : 'Open WhatsApp chat'}
        aria-expanded={open}
        onClick={() => { setOpen((o) => !o); setNudge(false) }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.6 }}
      >
        <span className="wa-ring" aria-hidden="true" />
        <AnimatePresence mode="wait" initial={false}>
          <m.span
            key={open ? 'x' : 'wa'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ display: 'grid' }}
          >
            {open ? <X size={26} /> : <WhatsAppIcon size={30} />}
          </m.span>
        </AnimatePresence>
      </m.button>
    </div>
  )
}
