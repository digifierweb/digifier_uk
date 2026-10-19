import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { SERVICES } from '../data/services.js'
import { SITE, waLink } from '../data/site.js'

const empty = { name: '', email: '', phone: '', company: '', service: '', budget: '', message: '', consent: false, website: '' }

function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Please enter a valid email address.'
  if (v.phone && !/^[+\d][\d\s()-]{6,}$/.test(v.phone)) e.phone = 'Please enter a valid phone number.'
  if (!v.service) e.service = 'Please choose a service.'
  if (!v.consent) e.consent = 'We need your permission to process your enquiry.'
  return e
}

function Field({ id, label, error, hint, required, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>
        {label} {required ? <span aria-hidden="true">*</span> : <span className="optional">(optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="hint" id={`${id}-hint`}>{hint}</p>}
      <AnimatePresence>
        {error && (
          <m.p className="error" id={`${id}-err`} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ContactForm() {
  const [v, setV] = useState(empty)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [waHref, setWaHref] = useState('')
  const set = (k) => (e) => setV({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const aria = (k) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${k}-err` : undefined })

  const submit = async (e) => {
    e.preventDefault()
    if (v.website) return // honeypot
    const errs = validate(v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0])?.focus()
      return
    }
    setStatus('sending')
    const serviceTitle = SERVICES.find((s) => s.slug === v.service)?.title || 'Other'
    if (SITE.formEndpoint) {
      try {
        const r = await fetch(SITE.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...v, service: serviceTitle, consentText: 'Agreed to privacy policy', submittedAt: new Date().toISOString() }),
        })
        if (!r.ok) throw new Error()
        setStatus('done')
        setV(empty)
      } catch {
        setStatus('error')
      }
      return
    }
    // No backend configured: hand the enquiry over to WhatsApp, which the visitor sends themselves.
    const text = [
      `Hi Digifier, new enquiry from the website:`,
      `Name: ${v.name}`,
      `Email: ${v.email}`,
      v.phone && `Phone: ${v.phone}`,
      v.company && `Company: ${v.company}`,
      `Service: ${serviceTitle}`,
      v.budget && `Budget: ${v.budget}`,
      v.message && `Message: ${v.message}`,
    ]
      .filter(Boolean)
      .join('\n')
    const href = waLink(text)
    // With 'noopener' window.open always returns null, so open without it and detach the opener ourselves.
    const win = window.open(href, '_blank')
    if (win) {
      win.opener = null
      setStatus('done')
    } else {
      setWaHref(href)
      setStatus('blocked')
    }
  }

  return (
    <div className="form-wrap">
      <AnimatePresence mode="wait">
        {status === 'done' ? (
          <m.div key="ok" className="form-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} role="status">
            <m.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.1 }}>
              <CheckCircle2 size={56} aria-hidden="true" />
            </m.span>
            <h3 className="h3">Thank you!</h3>
            <p>
              {SITE.formEndpoint
                ? 'Your enquiry has been received. We will reply within one working day.'
                : 'We have opened WhatsApp with your enquiry pre-filled — just press send and we will reply shortly.'}
            </p>
            <button className="btn btn-outline" onClick={() => setStatus('idle')}>Send another enquiry</button>
          </m.div>
        ) : (
          <m.form key="form" onSubmit={submit} noValidate className="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="form-grid">
              <Field id="name" label="Full name" error={errors.name} required>
                <input id="name" autoComplete="name" value={v.name} onChange={set('name')} {...aria('name')} />
              </Field>
              <Field id="email" label="Email" error={errors.email} required>
                <input id="email" type="email" autoComplete="email" inputMode="email" value={v.email} onChange={set('email')} {...aria('email')} />
              </Field>
              <Field id="phone" label="Phone" error={errors.phone} hint="UK or international format">
                <input id="phone" type="tel" autoComplete="tel" inputMode="tel" value={v.phone} onChange={set('phone')} {...aria('phone')} />
              </Field>
              <Field id="company" label="Company">
                <input id="company" autoComplete="organization" value={v.company} onChange={set('company')} />
              </Field>
              <Field id="service" label="Service needed" error={errors.service} required>
                <select id="service" value={v.service} onChange={set('service')} {...aria('service')}>
                  <option value="">Select a service</option>
                  {SERVICES.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.title}</option>
                  ))}
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field id="budget" label="Budget">
                <select id="budget" value={v.budget} onChange={set('budget')}>
                  <option value="">Prefer not to say</option>
                  <option>Under £250</option>
                  <option>£250 – £500</option>
                  <option>£500 – £1,000</option>
                  <option>£1,000+</option>
                  <option>Monthly retainer</option>
                </select>
              </Field>
            </div>
            <Field id="message" label="Tell us about your project">
              <textarea id="message" rows={5} value={v.message} onChange={set('message')} />
            </Field>
            <div className="hp" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} />
            </div>
            <div className={`consent ${errors.consent ? 'has-error' : ''}`}>
              <input id="consent" type="checkbox" checked={v.consent} onChange={set('consent')} {...aria('consent')} />
              <label htmlFor="consent">
                I agree that Digifier may use the details I've provided to respond to my enquiry, as described in the{' '}
                <Link to="/privacy-policy">privacy policy</Link>. We never sell your data or add you to marketing lists without asking.
              </label>
            </div>
            <AnimatePresence>
              {errors.consent && (
                <m.p className="error" id="consent-err" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {errors.consent}
                </m.p>
              )}
            </AnimatePresence>
            {status === 'blocked' && (
              <div className="error" role="alert">
                <p>
                  Your browser blocked WhatsApp from opening, so your enquiry has <strong>not</strong> been sent yet.{' '}
                  <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => setStatus('done')}>Open WhatsApp to send it</a>, or email{' '}
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
                </p>
              </div>
            )}
            {status === 'error' && <p className="error" role="alert">Sorry, something went wrong. Please try WhatsApp or email {SITE.email}.</p>}
            <m.button type="submit" className="btn btn-primary btn-lg" whileTap={{ scale: 0.97 }} disabled={status === 'sending'}>
              {status === 'sending' ? <><Loader2 className="spin" size={18} aria-hidden="true" /> Sending…</> : 'Send enquiry'}
            </m.button>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  )
}
