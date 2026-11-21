import { useEffect, useState, type ReactNode } from 'react'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M20 4l14 8v16l-14 8-14-8V12z" stroke="#1d5bff" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M6 12l14 8 14-8M20 20v16" stroke="#1d5bff" strokeWidth="2.6" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="3" fill="#1d5bff" />
    </svg>
  )
}

const I = (d: ReactNode) => ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{d}</svg>
)
export const SearchIcon = I(<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>)
export const SparkIcon = I(<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />)
export const ImageIcon = I(<><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="1.7" /><path d="M21 16l-5-5-8 8" /></>)
export const TextIcon = I(<path d="M5 6V4h14v2M12 4v16M9 20h6" />)
export const MicIcon = I(<><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v3" /></>)
export const ChatIcon = I(<><path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth="2.4" /></>)
export const BotIcon = I(<><rect x="4" y="8" width="16" height="11" rx="3.5" /><path d="M12 4v4M9 13h.01M15 13h.01M9.5 16.2c1.5 1 3.5 1 5 0" /></>)
export const CheckIcon = I(<path d="M5 12.5l4.5 4.5L19 7.5" />)
export const AlertIcon = I(<><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 17h.01" /></>)
export const CrossIcon = I(<path d="M6 6l12 12M18 6L6 18" />)
export const ClockIcon = I(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>)
export const GlobeIcon = I(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>)
export const UserIcon = I(<><circle cx="12" cy="9" r="3.5" /><path d="M5 20c1-4 4-5.5 7-5.5s6 1.5 7 5.5" /></>)
export const MenuIcon = I(<path d="M4 7h16M4 12h16M4 17h16" />)
export const ArrowIcon = I(<path d="M5 12h14M13 6l6 6-6 6" />)
export const ShieldIcon = I(<><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M12 8v4M12 15h.01" /></>)

type Tone = 'ok' | 'warn' | 'bad' | 'neutral' | 'brand'
const tones: Record<Tone, string> = {
  ok: 'bg-ok-soft text-ok', warn: 'bg-warn-soft text-warn', bad: 'bg-bad-soft text-bad',
  neutral: 'bg-slate-100 text-slate-600', brand: 'bg-brand-soft text-brand-dark',
}
export function Pill({ tone = 'neutral', children, icon }: { tone?: Tone; children: ReactNode; icon?: ReactNode }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{icon}{children}</span>
}

export function PreviewTag({ label }: { label: string }) {
  return <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">{label}</span>
}

export function Button({ variant = 'primary', className = '', ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'soft' }) {
  const v = {
    primary: 'bg-gradient-to-r from-brand to-[#5b5cff] text-white hover:brightness-110 shadow-[0_8px_20px_-8px_rgb(29_91_255/.7)] disabled:bg-slate-300 disabled:shadow-none',
    ghost: 'bg-white text-ink border border-line hover:bg-slate-50',
    soft: 'bg-brand-soft text-brand-dark hover:bg-[#dbe6ff]',
  }[variant]
  return <button {...p} className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition active:scale-[.98] disabled:cursor-not-allowed ${v} ${className}`} />
}

export function Modal({ title, onClose, children, closeLabel }: { title: string; onClose: () => void; children: ReactNode; closeLabel: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm fade sm:items-center sm:p-6" onMouseDown={e => e.target === e.currentTarget && onClose()}
      onKeyDown={e => e.key === 'Escape' && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="pop max-h-[92vh] w-full max-w-xl overflow-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button autoFocus onClick={onClose} aria-label={closeLabel} className="rounded-lg p-1.5 text-muted hover:bg-slate-100"><CrossIcon /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function CountUp({ to, format }: { to: number; format: (n: number) => string }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0; const t0 = performance.now()
    const tick = (t: number) => { const p = Math.min(1, (t - t0) / 1000); setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf)
  }, [to])
  return <>{format(v)}</>
}
