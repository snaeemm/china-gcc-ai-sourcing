import { useState } from 'react'
import type { Lang } from '../data/i18n'
import { t, tr } from '../data/i18n'
import { GlobeIcon, Logo, MenuIcon, UserIcon, Pill } from './ui'

export type Screen = 'home' | 'match' | 'decide' | 'passport' | 'rfq' | 'review'

export default function Header({ lang, setLang, screen, goHome, reachable, go }: {
  lang: Lang; setLang: (l: Lang) => void; screen: Screen; goHome: () => void
  reachable: Record<Screen, boolean>; go: (s: Screen) => void
}) {
  const [menu, setMenu] = useState(false)
  const cur: Screen = screen === 'passport' || screen === 'rfq' ? 'decide' : screen
  const steps: { id: Screen; k: 'stepRequest' | 'stepMatch' | 'stepDecide' }[] = [
    { id: 'home', k: 'stepRequest' }, { id: 'match', k: 'stepMatch' }, { id: 'decide', k: 'stepDecide' },
  ]
  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4">
        <button onClick={goHome} className="flex items-center gap-2.5 text-start" aria-label={t(lang, 'home')}>
          <Logo className="h-9 w-9" />
          <span className="leading-tight">
            <span className="block text-lg font-bold tracking-tight">{t(lang, 'brand')}</span>
            <span className="block text-xs text-muted">{t(lang, 'brandSub')}</span>
          </span>
        </button>

        {screen !== 'home' && screen !== 'review' && (
          <nav aria-label="Progress" className="fade hidden items-center gap-1 rounded-full bg-white/80 p-1 shadow-card ring-1 ring-line backdrop-blur md:flex">
            {steps.map((s, i) => {
              const active = s.id === cur
              return (
                <button key={s.id} disabled={!reachable[s.id]} onClick={() => go(s.id)} aria-current={active ? 'step' : undefined}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${active ? 'bg-gradient-to-r from-brand to-[#5b5cff] text-white shadow-md' : 'text-muted hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent'}`}>
                  <span className={`grid h-5 w-5 place-items-center rounded-full text-[11px] ${active ? 'bg-white/25' : 'bg-slate-200 text-slate-600'}`}>{i + 1}</span>
                  {t(lang, s.k)}
                </button>
              )
            })}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <span className="hidden lg:block"><Pill tone="warn">{t(lang, 'demoBadge')}</Pill></span>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} aria-label={t(lang, 'language')}
            className="flex items-center gap-1.5 rounded-full border border-line bg-white/80 px-3 py-2 text-sm font-semibold backdrop-blur hover:bg-white">
            <GlobeIcon className="h-4 w-4" />{lang === 'en' ? 'EN' : 'عربي'}
          </button>
          <button disabled title={t(lang, 'profile')} aria-label={t(lang, 'profile')} className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white/80 text-muted"><UserIcon className="h-[18px] w-[18px]" /></button>
          <div className="relative">
            <button onClick={() => setMenu(m => !m)} aria-expanded={menu} aria-label={t(lang, 'menu')} className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-white"><MenuIcon /></button>
            {menu && <div className="fixed inset-0 z-20" onClick={() => setMenu(false)} aria-hidden />}
            {menu && (
              <div className="pop absolute end-0 top-11 z-30 w-64 rounded-2xl bg-white p-2 text-start shadow-2xl ring-1 ring-line">
                <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted">{tr(lang, 'Concept screens', 'شاشات تصورية')}</div>
                {([['passport', 'Factory passport', 'جواز المصنع'], ['rfq', 'RFQ draft', 'مسودة طلب عرض سعر'], ['review', 'Reviewer dashboard', 'لوحة المراجعة']] as const).map(([id, en, ar]) => (
                  <button key={id} onClick={() => { setMenu(false); go(id) }} className="block w-full rounded-xl px-3 py-2.5 text-start text-sm font-semibold hover:bg-slate-50">{tr(lang, en, ar)}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
