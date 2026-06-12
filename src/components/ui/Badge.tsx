import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'member' | 'new' | 'sale' | 'status'
  children: ReactNode
}

const styles = {
  member: 'bg-gold/10 text-gold border border-gold/20',
  new: 'bg-white/10 text-white/80',
  sale: 'bg-red-500/10 text-red-400 border border-red-500/20',
  status: 'bg-white/5 text-white/50',
}

export function Badge({ variant = 'new', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${styles[variant]}`}>
      {variant === 'member' && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 1l2.39 4.84L18 7.11l-4 3.9.94 5.49L10 14.04l-4.94 2.46L6 10.01 2 7.11l5.61-.27L10 1z" />
        </svg>
      )}
      {children}
    </span>
  )
}
