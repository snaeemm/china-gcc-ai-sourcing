import type { Lang } from '../data/i18n'
import { t } from '../data/i18n'
import { fitFor, overallFor, SUPPLIERS, type Fit, type Specs, type Supplier } from '../data/mock'
import { AlertIcon, ArrowIcon, Button, CheckIcon, CrossIcon, Pill, ShieldIcon } from './ui'

function Panel({ thickness, dim }: { thickness: number; dim?: boolean }) {
  const slats = 9
  return (
    <svg viewBox="0 0 120 120" className={`h-28 w-28 shrink-0 rounded-2xl bg-[#efe9e1] ${dim ? 'opacity-60' : ''}`} aria-hidden>
      {Array.from({ length: slats }).map((_, i) => {
        const w = 6 + thickness * 0.9
        const gap = (120 - 16 - slats * w) / (slats - 1)
        return <rect key={i} x={8 + i * (w + gap)} y="10" width={w} height="100" rx="1.5" fill={i % 2 ? '#c9a572' : '#d6b685'} />
      })}
    </svg>
  )
}

function Row({ lang, fit, children }: { lang: Lang; fit: Fit; children: React.ReactNode }) {
  const cfg = {
    match: { c: 'text-ok bg-ok-soft', i: <CheckIcon className="h-3.5 w-3.5" />, l: t(lang, 'match') },
    mismatch: { c: 'text-bad bg-bad-soft', i: <CrossIcon className="h-3.5 w-3.5" />, l: t(lang, 'mismatch') },
    confirm: { c: 'text-warn bg-warn-soft', i: <AlertIcon className="h-3.5 w-3.5" />, l: t(lang, 'confirm') },
  }[fit]
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${cfg.c}`} title={cfg.l}>{cfg.i}</span>
      <span className="flex-1">{children}<span className="sr-only"> — {cfg.l}</span></span>
    </li>
  )
}

function Card({ lang, s, spec, selected, toggle, i }: { lang: Lang; s: Supplier; spec: Specs; selected: boolean; toggle: () => void; i: number }) {
  const f = fitFor(s, spec)
  const o = overallFor(s, spec)
  const tone = o === 'full' ? 'ok' : o === 'partial' ? 'warn' : 'bad'
  const label = o === 'full' ? t(lang, 'fitA') : o === 'partial' ? t(lang, 'fitB') : t(lang, 'fitC')
  const blocked = o === 'unsuitable'
  return (
    <article className={`rise relative flex flex-col overflow-hidden rounded-3xl bg-white p-5 shadow-card ring-1 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${selected ? 'ring-2 ring-brand' : 'ring-line'}`} style={{ animationDelay: `${i * 0.09}s` }}>
      <div className={`absolute inset-x-0 top-0 h-1 ${o === 'full' ? 'bg-gradient-to-r from-ok to-[#37c9a0]' : o === 'partial' ? 'bg-gradient-to-r from-warn to-[#f0a640]' : 'bg-gradient-to-r from-bad to-[#e8707f]'}`} />
      <div className="flex items-start gap-4">
        <Panel thickness={s.thickness} dim={blocked} />
        <div className="min-w-0">
          <h3 className="text-lg font-bold">{t(lang, 'supplier')} {lang === 'en' ? s.id : { A: 'أ', B: 'ب', C: 'ج' }[s.id]}</h3>
          <p className="text-xs text-muted">{t(lang, 'fictional')}</p>
          <div className="mt-2.5"><Pill tone={tone}>{label}</Pill></div>
        </div>
      </div>
      <ul className="mb-5 mt-5 space-y-2.5">
        <Row lang={lang} fit={f.thickness}>
          {t(lang, 'thickness')}: <b>{s.thickness} {t(lang, 'mm')}</b>
          {f.thickness === 'mismatch' && <span className="text-muted"> ({spec.thickness} {t(lang, 'mm')} requested) — {t(lang, 'thicknessChange')}</span>}
        </Row>
        <Row lang={lang} fit={f.length}>{t(lang, 'length')}: <b>{s.length} {t(lang, 'm')}</b></Row>
        <Row lang={lang} fit={f.moq}>
          {t(lang, 'moq')}: <b>{s.moq.toLocaleString('en-US')} {t(lang, 'sqm')}</b>
          <span className="text-muted"> — {f.moq === 'match' ? t(lang, 'moqOk') : t(lang, 'exceedsRequest')}</span>
        </Row>
        <Row lang={lang} fit="confirm">{t(lang, 'sampleConfirm')}</Row>
      </ul>
      <div className="mb-5 mt-4 space-y-1 border-t border-line pt-3 text-xs text-muted">
        <div className="flex items-center gap-1.5 font-semibold text-slate-600"><ShieldIcon className="h-3.5 w-3.5" />{t(lang, 'unverified')}</div>
        <div>{t(lang, 'noEvidence')}</div>
      </div>
      <button onClick={toggle} disabled={blocked} aria-pressed={selected}
        className={`mt-auto rounded-xl px-4 py-2.5 text-sm font-semibold transition ${blocked ? 'cursor-not-allowed bg-slate-100 text-slate-400' : selected ? 'bg-brand text-white' : 'bg-brand-soft text-brand-dark hover:bg-[#dbe6ff]'}`}>
        {blocked ? t(lang, 'notSelectable') : selected ? <span className="inline-flex items-center gap-1.5"><CheckIcon className="h-4 w-4" />{t(lang, 'selected')}</span> : t(lang, 'select')}
      </button>
    </article>
  )
}

export default function Matching({ lang, spec, selected, setSelected, onCompare, onAdjust }: {
  lang: Lang; spec: Specs; selected: string[]; setSelected: (s: string[]) => void; onCompare: () => void; onAdjust: () => void
}) {
  const toggle = (id: string) => setSelected(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id])
  const ready = selected.length === 2 && selected.includes('A') && selected.includes('B')
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-16 pt-4">
      <div className="rise">
        <h1 className="text-3xl font-extrabold tracking-tight">{t(lang, 'matchTitle')}</h1>
        <p className="mt-1 text-muted">
          {t(lang, 'matchSub')}: <b className="text-ink">{spec.quantity} {t(lang, 'sqm')} · {spec.colour} · {spec.length} {t(lang, 'm')} · {spec.thickness} {t(lang, 'mm')} · {spec.destination}</b>
        </p>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {SUPPLIERS.map((s, i) => <Card key={s.id} lang={lang} s={s} spec={spec} i={i} selected={selected.includes(s.id)} toggle={() => toggle(s.id)} />)}
      </div>
      <p className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">{t(lang, 'catalogData')} {t(lang, 'matchedBy')}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button onClick={onCompare} disabled={!ready}>{ready ? t(lang, 'compareSel') + ' (A + B)' : t(lang, 'compareHint')}<ArrowIcon className="h-4 w-4 rtl:rotate-180" /></Button>
        <Button variant="ghost" onClick={onAdjust}>{t(lang, 'adjust')}</Button>
        {spec.quantity !== 500 && <span className="text-xs text-muted">{t(lang, 'qtyNote')}</span>}
      </div>
    </main>
  )
}
