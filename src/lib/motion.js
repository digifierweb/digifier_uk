import { useSyncExternalStore } from 'react'

// Site-wide "pause animations" switch (WCAG 2.2.2). Persisted per visitor; CSS reads the html class.
const KEY = 'digifier-motion-paused'
const subs = new Set()
let paused = false

if (typeof window !== 'undefined') {
  try {
    paused = localStorage.getItem(KEY) === '1'
  } catch {}
  document.documentElement.classList.toggle('motion-paused', paused)
}

export function setMotionPaused(v) {
  paused = v
  try {
    localStorage.setItem(KEY, v ? '1' : '0')
  } catch {}
  document.documentElement.classList.toggle('motion-paused', v)
  subs.forEach((fn) => fn())
}

const subscribe = (fn) => {
  subs.add(fn)
  return () => subs.delete(fn)
}

export function useMotionPaused() {
  return useSyncExternalStore(subscribe, () => paused, () => false)
}
