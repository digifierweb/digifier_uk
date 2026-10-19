import { Fragment, useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useMotionPaused, setMotionPaused } from '../lib/motion.js'
import { m, useInView, useMotionValue, useSpring, useScroll, useTransform, animate, useReducedMotion } from 'framer-motion'

// Motion tokens: every animation on the site draws from these so it all shares one rhythm.
// CSS mirrors them as --ease-out / --dur-* in styles.css.
export const EASE = {
  out: [0.22, 1, 0.36, 1], // arriving: fast start, long gentle settle
  in: [0.55, 0, 1, 0.45], // leaving
  inOut: [0.65, 0, 0.35, 1],
}
export const DUR = { fast: 0.2, base: 0.55, slow: 0.8 }
export const SPRING = {
  soft: { type: 'spring', stiffness: 220, damping: 28, mass: 0.6 },
  snappy: { type: 'spring', stiffness: 420, damping: 32 },
}
export const STAGGER = 0.05

const ease = EASE.out
// Reveal as content approaches, not after it is already mid-screen.
const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' }

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.base, ease } },
}

export const stagger = (each = STAGGER, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: each, delayChildren: delay } },
})

export function Reveal({ as = 'div', children, delay = 0, y = 18, className, ...rest }) {
  const M = m[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.base, ease, delay }}
      {...rest}
    >
      {children}
    </M>
  )
}

export function Stagger({ as = 'div', children, className, each = STAGGER, ...rest }) {
  const M = m[as]
  return (
    <M className={className} variants={stagger(each)} initial="hidden" whileInView="visible" viewport={VIEWPORT} {...rest}>
      {children}
    </M>
  )
}

export function Item({ as = 'div', children, className, ...rest }) {
  const M = m[as]
  return (
    <M className={className} variants={fadeUp} {...rest}>
      {children}
    </M>
  )
}

// Splits a headline into words that rise out of a mask in sequence.
// `instant`: above-the-fold headings animate with pure CSS from first paint, without waiting
// for JavaScript, so the page's largest text isn't held back (and works with JS off).
// Pass labelled={false} when a parent element already carries the accessible name.
export function SplitWords({ text, className, as = 'span', delay = 0, labelled = true, instant = false }) {
  const words = text.split(' ')
  if (instant) {
    const T = as
    return (
      <T className={className} aria-label={labelled ? text : undefined} style={{ '--d': `${Math.round(delay * 1000)}ms` }}>
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="word-mask" aria-hidden="true">
              <span className="word word-rise" style={{ '--i': i }}>{w}</span>
            </span>{' '}
          </Fragment>
        ))}
      </T>
    )
  }
  const M = m[as]
  return (
    <M className={className} aria-label={labelled ? text : undefined} initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={stagger(0.04, delay)}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="word-mask" aria-hidden="true">
            <m.span className="word" variants={{ hidden: { y: '110%' }, visible: { y: 0, transition: { duration: 0.7, ease } } }}>
              {w}
            </m.span>
          </span>{' '}
        </Fragment>
      ))}
    </M>
  )
}

function ScrollWord({ progress, range, still, children }) {
  // 0.5 keeps unlit words above WCAG AA contrast (≈5:1 on the page background).
  const opacity = useTransform(progress, range, [0.5, 1])
  return (
    <>
      <m.span className="sw" style={{ opacity: still ? 1 : opacity }}>{children}</m.span>{' '}
    </>
  )
}

// A statement that brightens word by word as it scrolls into the reading zone.
// Fully opaque by the time it reaches the upper-middle of the screen, so it never rests faded;
// static for reduced-motion users and when animations are paused.
export function ScrollWords({ text, as: T = 'p', className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const paused = useMotionPaused()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90%', 'end 55%'] })
  const words = text.split(' ')
  return (
    <T ref={ref} className={`scroll-words ${className}`}>
      {words.map((w, i) => (
        <ScrollWord key={i} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 2) / words.length)]} still={reduce || paused}>
          {w}
        </ScrollWord>
      ))}
    </T>
  )
}

export function Counter({ value, decimals = 0, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [n, setN] = useState(value)
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, value, { duration: 1.6, ease: EASE.out, onUpdate: setN })
    return () => c.stop()
  }, [inView, value, reduce])
  return (
    <span ref={ref}>
      {n.toFixed(decimals)}
      {suffix}
    </span>
  )
}

// Magnetic hover: element drifts slightly toward the cursor, springs back on leave. Mouse/pen only.
export function Magnetic({ children, strength = 0.2, className }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 })
  const onMove = (e) => {
    if (e.pointerType === 'touch') return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <m.span ref={ref} className={className} style={{ x: sx, y: sy, display: 'inline-flex' }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </m.span>
  )
}

// Card with a soft light that follows the cursor across its surface and border (no 3D tilt).
// The glow is pure CSS driven by --mx/--my, so moving the mouse never re-renders React.
export function Spotlight({ children, className, ...rest }) {
  const onMove = (e) => {
    if (e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <m.div className={`spotlight ${className}`} onPointerMove={onMove} variants={fadeUp} {...rest}>
      {children}
    </m.div>
  )
}

// Pauses or resumes every looping animation on the site (marquees, hero word, floating chips).
export function MotionToggle({ className = '' }) {
  const paused = useMotionPaused()
  return (
    <button type="button" className={`motion-toggle ${className}`} onClick={() => setMotionPaused(!paused)}>
      {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      {paused ? 'Play animations' : 'Pause animations'}
    </button>
  )
}
