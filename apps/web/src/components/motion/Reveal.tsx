'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  /** Wrapper element — defaults to 'div'; use 'li' inside a <ul>/<ol> */
  as?: 'div' | 'li'
}

/** Fades + slides content up as it scrolls into view, once. No-ops under prefers-reduced-motion. */
export default function Reveal({ children, className, delay = 0, y = 24, as = 'div' }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()
  const MotionTag = as === 'li' ? motion.li : motion.div

  return (
    <MotionTag
      className={className}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
