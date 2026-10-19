import { Fragment, useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useMotionPaused, setMotionPaused } from '../lib/motion.js'
import { m, useInView, useMotionValue, useSpring, animate, useReducedMotion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export const stagger = (each = 0.08, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: each, delayChildren: delay } },
})

export function Reveal({ as = 'div', children, delay = 0, y = 28, className, ...rest }) {
  const M = m[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease, delay }}
      {...rest}
    >
      {children}
    </M>
  )
}

export function Stagger({ as = 'div', children, className, each = 0.08, amount = 0.15, ...rest }) {
  const M = m[as]
  return (
    <M className={className} variants={stagger(each)} initial="hidden" whileInView="visible" viewport={{ once: true, amount }} {...rest}>
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

// Splits a headline into words that rise in sequence.
// Pass labelled={false} when a parent element already carries the accessible name.
export function SplitWords({ text, className, as = 'span', delay = 0, labelled = true }) {
  const M = m[as]
  return (
    <M className={className} aria-label={labelled ? text : undefined} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger(0.06, delay)}>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          <span className="word-mask" aria-hidden="true">
            <m.span
              className="word"
              variants={{ hidden: { y: '110%' }, visible: { y: 0, transition: { duration: 0.7, ease } } }}
            >
              {w}
            </m.span>
          </span>{' '}
        </Fragment>
      ))}
    </M>
  )
}

export function Counter({ value, decimals = 0, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [n, setN] = useState(value)
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, value, { duration: 1.6, ease: 'easeOut', onUpdate: setN })
    return () => c.stop()
  }, [inView, value, reduce])
  return (
    <span ref={ref}>
      {n.toFixed(decimals)}
      {suffix}
    </span>
  )
}

// Magnetic hover: element drifts toward the cursor, springs back on leave.
export function Magnetic({ children, strength = 0.3, className }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 15, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 250, damping: 15, mass: 0.4 })
  const onMove = (e) => {
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

// 3D tilt card following the pointer.
export function Tilt({ children, className, max = 6, ...rest }) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 200, damping: 20 })
  const sry = useSpring(ry, { stiffness: 200, damping: 20 })
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * max * 2)
    rx.set(-py * max * 2)
    e.currentTarget.style.setProperty('--mx', `${(px + 0.5) * 100}%`)
    e.currentTarget.style.setProperty('--my', `${(py + 0.5) * 100}%`)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }
  return (
    <m.div
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      variants={fadeUp}
      {...rest}
    >
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
