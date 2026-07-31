import * as React from 'react'
import { clsx } from 'clsx'

// ============================================================
// Button
// ============================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children?: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled ?? loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
        // Sizes
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-6 py-3 text-sm',
        size === 'lg' && 'px-8 py-4 text-base',
        // Variants
        variant === 'primary' &&
          'bg-indigo-500 hover:bg-indigo-600 text-white hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5',
        variant === 'ghost' &&
          'border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:-translate-y-0.5',
        variant === 'danger' &&
          'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20',
        className,
      )}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

// ============================================================
// Card (Glass morphism)
// ============================================================

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  children?: React.ReactNode
}

export function Card({ glow = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-slate-800/60 backdrop-blur-sm border border-white/5 rounded-2xl',
        'shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_24px_rgba(0,0,0,0.4)]',
        glow && 'shadow-[0_0_40px_rgba(99,102,241,0.15)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================
// Badge
// ============================================================

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'accent' | 'teal' | 'muted'
  children?: React.ReactNode
}

export function Badge({ variant = 'accent', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variant === 'accent' && 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
        variant === 'teal' && 'bg-teal-400/10 text-teal-300 border-teal-400/20',
        variant === 'muted' && 'bg-slate-700/50 text-slate-400 border-slate-600/20',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// ============================================================
// Form Controls
// ============================================================

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={clsx('text-sm font-medium leading-none text-slate-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
      {...props}
    />
  )
)
Label.displayName = 'Label'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={clsx(
          'flex h-11 w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2 text-sm text-white transition-colors',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-slate-500',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={clsx(
          'flex min-h-[120px] w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-white transition-colors',
          'placeholder:text-slate-500',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={clsx(
          'h-5 w-5 shrink-0 rounded-md border border-white/10 bg-slate-900/50 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Checkbox.displayName = 'Checkbox'

// ============================================================
// Exports
// ============================================================

export { clsx }
