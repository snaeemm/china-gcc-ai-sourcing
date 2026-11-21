import { useEffect, useRef, useState } from 'react'
import type { Lang } from '../data/i18n'
import { t } from '../data/i18n'
import type { Extras, Specs } from '../data/mock'
import { ArrowIcon, BotIcon, Button, CheckIcon, PreviewTag } from './ui'

type L = [string, string]
const L = (lang: Lang, x: L) => x[lang === 'en' ? 0 : 1]
type Opt = { v: string; l: L; s?: L; sw?: string }
type Step = { id: 'quantity' | 'thickness' | 'length' | 'colour' | 'destination' | 'delivery' | 'features' | 'notes'; q: L; opts: Opt[]; multi?: boolean; custom?: { ph: L; numeric?: boolean; unit?: string } }

const STEPS: Record<Step['id'], Step> = {
  quantity: { id: 'quantity', q: ['How much do you need?', 'ما الكمية التي تحتاجها؟'], custom: { ph: ['Other quantity', 'كمية أخرى'], numeric: true, unit: 'm²' },
    opts: [{ v: '100', l: ['100 m²', '100 م²'], s: ['Small room set', 'غرفة صغيرة'] }, { v: '250', l: ['250 m²', '250 م²'], s: ['Apartment', 'شقة'] }, { v: '500', l: ['500 m²', '500 م²'], s: ['Villa / fit-out', 'فيلا / تجهيز'] }, { v: '1000', l: ['1,000 m²', '1,000 م²'], s: ['Large project', 'مشروع كبير'] }] },
  thickness: { id: 'thickness', q: ['Which panel thickness?', 'ما سماكة الألواح؟'], custom: { ph: ['Other thickness', 'سماكة أخرى'], numeric: true, unit: 'mm' },
    opts: [{ v: '6', l: ['6 mm', '6 مم'], s: ['Light-duty', 'استخدام خفيف'] }, { v: '8', l: ['8 mm', '8 مم'], s: ['Standard', 'قياسي'] }, { v: '10', l: ['10 mm', '10 مم'], s: ['Sturdier', 'أكثر متانة'] }, { v: '12', l: ['12 mm', '12 مم'], s: ['Heavy-duty', 'استخدام شاق'] }] },
  length: { id: 'length', q: ['What panel length suits the walls?', 'ما طول الألواح المناسب للجدران؟'], custom: { ph: ['Other length', 'طول آخر'], numeric: true, unit: 'm' },
    opts: [{ v: '2.4', l: ['2.4 m', '2.4 م'] }, { v: '2.8', l: ['2.8 m', '2.8 م'], s: ['Tall ceilings', 'أسقف مرتفعة'] }, { v: '3', l: ['3.0 m', '3.0 م'] }] },
  colour: { id: 'colour', q: ['Which colour or finish?', 'ما اللون أو التشطيب؟'], custom: { ph: ['Describe another finish', 'صف تشطيباً آخر'] },
    opts: [{ v: 'light wood', l: ['Light wood', 'خشبي فاتح'], sw: '#dcc096' }, { v: 'oak', l: ['Oak', 'سنديان'], sw: '#b98a52' }, { v: 'walnut', l: ['Walnut', 'جوز'], sw: '#6b4a32' }, { v: 'white', l: ['White', 'أبيض'], sw: '#f3f2ee' }, { v: 'grey', l: ['Grey', 'رمادي'], sw: '#9aa0a6' }] },
  destination: { id: 'destination', q: ['Where should it be delivered?', 'أين سيتم التسليم؟'], custom: { ph: ['Other city', 'مدينة أخرى'] },
    opts: ['Dubai:دبي', 'Abu Dhabi:أبوظبي', 'Sharjah:الشارقة', 'Riyadh:الرياض', 'Jeddah:جدة', 'Doha:الدوحة'].map(x => { const [e, a] = x.split(':'); return { v: e, l: [e, a] as L } }) },
  delivery: { id: 'delivery', q: ['When do you need it by?', 'متى تحتاجها؟'],
    opts: [{ v: '30 days', l: ['Within 30 days', 'خلال 30 يوماً'], s: ['Fastest', 'الأسرع'] }, { v: '45 days', l: ['Within 45 days', 'خلال 45 يوماً'] }, { v: '60 days', l: ['Within 60 days', 'خلال 60 يوماً'], s: ['After order confirmation', 'بعد تأكيد الطلب'] }, { v: 'flexible', l: ['Flexible', 'مرن'], s: ['No fixed date', 'دون موعد ثابت'] }] },
  features: { id: 'features', q: ['Anything the panels should have? Pick any that apply.', 'هل تريد خصائص معينة؟ اختر ما ينطبق.'], multi: true,
    opts: [{ v: 'Fire-rated', l: ['Fire-rated', 'مقاوم للحريق'] }, { v: 'Moisture-resistant', l: ['Moisture-resistant', 'مقاوم للرطوبة'] }, { v: 'Pre-finished', l: ['Pre-finished', 'جاهز التشطيب'], s: ['Ready to install', 'جاهز للتركيب'] }, { v: 'Installation accessories', l: ['Installation accessories', 'ملحقات التركيب'], s: ['Clips, trims', 'مشابك وحواف'] }, { v: 'Test certificates', l: ['Test certificates', 'شهادات اختبار'] }, { v: 'Sample first', l: ['Sample first', 'عينة أولاً'] }] },
  notes: { id: 'notes', q: ['Anything else you would like to add?', 'هل تريد إضافة أي شيء آخر؟'], opts: [], custom: { ph: ['e.g. matte finish, budget limit…', 'مثال: تشطيب مطفي، حد للميزانية…'] } },
}

function Bubble({ who, children }: { who: 'bot' | 'me'; children: React.ReactNode }) {
  return who === 'bot' ? (
    <div className="rise flex items-start gap-2.5">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"><BotIcon className="h-[18px] w-[18px]" /></span>
      <div className="max-w-[88%] rounded-2xl rounded-ss-md bg-slate-100 px-4 py-2.5 text-sm">{children}</div>
    </div>
  ) : <div className="pop ms-auto w-fit max-w-[85%] rounded-2xl rounded-ee-md bg-brand px-4 py-2.5 text-sm font-medium text-white">{children}</div>
}

const Typing = () => (
  <div className="flex items-center gap-2.5" role="status" aria-label="…">
    <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-brand"><BotIcon className="h-[18px] w-[18px]" /></span>
    <span className="flex gap-1 rounded-2xl bg-slate-100 px-4 py-3">{[0, 1, 2].map(i => <i key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${i * 0.15}s` }} />)}</span>
  </div>
)

export default function Chat({ lang, query, specs, setSpecs, extras, setExtras, image, onContinue, onRestart }: {
  lang: Lang; query: string; specs: Specs; setSpecs: (s: Specs) => void; extras: Extras; setExtras: (e: Extras) => void
  image: { url: string } | null; onContinue: () => void; onRestart: () => void
}) {
  const [steps] = useState<Step[]>(() => {
    const miss = (['quantity', 'thickness', 'length', 'colour', 'destination'] as const).filter(k => specs[k] === null).map(k => STEPS[k])
    return [...miss, STEPS.delivery, STEPS.features, STEPS.notes]
  })
  const [intro] = useState(() => (['quantity', 'thickness', 'length', 'colour', 'destination'] as const).map(k => ({ k, got: specs[k] !== null })))
  const [idx, setIdx] = useState(extras.done ? steps.length : 0)
  const [log, setLog] = useState<string[]>([])
  const [ready, setReady] = useState(extras.done)
  const [sel, setSel] = useState<string[]>([])
  const [custom, setCustom] = useState('')
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (extras.done) return
    setReady(false); setSel([]); setCustom('')
    const id = window.setTimeout(() => setReady(true), idx === 0 ? 900 : 650)
    return () => window.clearTimeout(id)
  }, [idx]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }, [idx, ready, log.length])

  const step = steps[idx]
  const advance = (label: string, ex?: Partial<Extras>) => {
    const last = idx + 1 >= steps.length
    if (ex || last) setExtras({ ...extras, ...ex, done: last })
    setLog(l => [...l, label]); setIdx(idx + 1)
  }
  const answer = (s: Step, v: string, label: string) => {
    if (s.id === 'delivery') return advance(label, { delivery: v })
    if (s.id === 'notes') return advance(label, { notes: v })
    if (s.id === 'features') return advance(label, { features: sel })
    const num = s.id === 'quantity' || s.id === 'thickness' || s.id === 'length'
    const val = num ? parseFloat(v) : v
    if (num && !Number.isFinite(val)) return
    setSpecs({ ...specs, [s.id]: val } as Specs)
    advance(label)
  }
  const toggle = (v: string) => setSel(x => x.includes(v) ? x.filter(i => i !== v) : [...x, v])
  const skip = () => advance(lang === 'en' ? 'Skip' : 'تخطي')

  const fieldName = { quantity: 'quantity', thickness: 'thickness', length: 'length', colour: 'colour', destination: 'destination' } as const
  const chip = (k: keyof typeof fieldName, v: string | number | null) => {
    const unit = k === 'quantity' ? ` ${t(lang, 'sqm')}` : k === 'thickness' ? ` ${t(lang, 'mm')}` : k === 'length' ? ` ${t(lang, 'm')}` : ''
    return v === null ? '—' : `${v}${unit}`
  }

  return (
    <section className="rise mt-6 w-full overflow-hidden rounded-3xl bg-white text-start shadow-card ring-1 ring-line" aria-label="Sourcing assistant" aria-live="polite">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-slate-50/70 px-5 py-3">
        <div className="flex items-center gap-2 text-sm font-bold"><BotIcon className="h-5 w-5 text-brand" />{lang === 'en' ? 'Sourcing assistant' : 'مساعد التوريد'}</div>
        <div className="flex items-center gap-2"><PreviewTag label={lang === 'en' ? 'Guided · simulated' : 'موجَّه · محاكاة'} /></div>
      </div>

      <div className="space-y-3.5 p-5">
        <Bubble who="me">{query}{image && <img src={image.url} alt="" className="mt-2 h-14 w-14 rounded-lg object-cover" />}</Bubble>
        <Bubble who="bot">
          <p className="font-semibold">{lang === 'en' ? 'Here is what I picked up from your request:' : 'هذا ما فهمته من طلبك:'}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {intro.map(({ k, got }) => (
              <span key={k} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${got ? 'bg-ok-soft text-ok' : 'bg-warn-soft text-warn'}`}>
                {t(lang, k === 'colour' ? 'colour' : k)}: {got ? chip(k, specs[k]) : t(lang, 'missing')}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">{t(lang, 'extractNote')}</p>
        </Bubble>

        {steps.slice(0, idx).map((s, i) => (
          <div key={s.id} className="space-y-3.5">
            <Bubble who="bot">{L(lang, s.q)}</Bubble>
            <Bubble who="me">{log[i]}</Bubble>
          </div>
        ))}

        {step && !ready && <Typing />}
        {step && ready && (
          <div className="space-y-3">
            <Bubble who="bot">{L(lang, step.q)}</Bubble>
            {step.opts.length > 0 && (
              <div className="fade grid grid-cols-2 gap-2.5 ps-10 sm:grid-cols-3">
                {step.opts.map(o => {
                  const on = sel.includes(o.v)
                  return (
                    <button key={o.v} onClick={() => step.multi ? toggle(o.v) : answer(step, o.v, L(lang, o.l))} aria-pressed={step.multi ? on : undefined}
                      className={`group relative flex min-h-[4.25rem] flex-col items-start justify-center gap-0.5 rounded-2xl border p-3 text-start transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md ${on ? 'border-brand bg-brand-soft' : 'border-line bg-white'}`}>
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        {o.sw && <i className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: o.sw }} />}{L(lang, o.l)}
                      </span>
                      {o.s && <span className="text-[11px] text-muted">{L(lang, o.s)}</span>}
                      {on && <CheckIcon className="absolute end-2 top-2 h-4 w-4 text-brand" />}
                    </button>
                  )
                })}
              </div>
            )}
            <div className="fade flex flex-wrap items-center gap-2 ps-10">
              {step.custom && (
                <form className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-sm" onSubmit={e => { e.preventDefault(); if (custom.trim()) answer(step, custom.trim(), custom.trim() + (step.custom?.unit ? ` ${step.custom.unit}` : '')) }}>
                  <input value={custom} onChange={e => setCustom(e.target.value)} placeholder={L(lang, step.custom.ph)} aria-label={L(lang, step.custom.ph)}
                    inputMode={step.custom.numeric ? 'decimal' : 'text'} className="min-w-0 flex-1 rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/25" />
                  <Button variant="soft" type="submit" disabled={!custom.trim()} className="!px-4 !py-2.5">{lang === 'en' ? 'Add' : 'إضافة'}</Button>
                </form>
              )}
              {step.multi && <Button onClick={() => answer(step, '', sel.length ? sel.map(v => L(lang, step.opts.find(o => o.v === v)!.l)).join(' · ') : (lang === 'en' ? 'None' : 'لا شيء'))} className="!py-2.5">{lang === 'en' ? 'Continue' : 'متابعة'}<ArrowIcon className="h-4 w-4 rtl:rotate-180" /></Button>}
              {!step.multi && <button onClick={skip} className="rounded-xl px-3 py-2.5 text-sm font-semibold text-muted hover:bg-slate-100">{step.id === 'notes' ? (lang === 'en' ? 'No, that’s all' : 'لا، هذا كل شيء') : (lang === 'en' ? 'Skip' : 'تخطي')}</button>}
            </div>
          </div>
        )}

        {!step && (
          <div className="space-y-3">
            <Bubble who="bot">
              <p className="font-semibold">{lang === 'en' ? 'Your sourcing request is ready.' : 'طلب التوريد جاهز.'}</p>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                {([['product', t(lang, 'productVal')], ['quantity', chip('quantity', specs.quantity)], ['thickness', chip('thickness', specs.thickness)], ['length', chip('length', specs.length)], ['colour', specs.colour ?? '—'], ['destination', specs.destination ?? '—']] as const).map(([k, v]) => (
                  <div key={k}><dt className="text-[11px] text-muted">{t(lang, k)}</dt><dd className="font-semibold">{v}</dd></div>
                ))}
                {extras.delivery && <div><dt className="text-[11px] text-muted">{lang === 'en' ? 'Needed by' : 'الموعد'}</dt><dd className="font-semibold">{extras.delivery}</dd></div>}
                {extras.features.length > 0 && <div className="col-span-2"><dt className="text-[11px] text-muted">{lang === 'en' ? 'Preferences' : 'التفضيلات'}</dt><dd className="font-semibold">{extras.features.join(' · ')}</dd></div>}
                {extras.notes && <div className="col-span-full"><dt className="text-[11px] text-muted">{lang === 'en' ? 'Notes' : 'ملاحظات'}</dt><dd className="font-semibold">{extras.notes}</dd></div>}
              </dl>
              <p className="mt-3 text-xs text-muted">{lang === 'en' ? 'Extra preferences are recorded for the request; the demo matching uses quantity, thickness, length and colour.' : 'تُسجَّل التفضيلات الإضافية في الطلب؛ تعتمد المطابقة التجريبية على الكمية والسماكة والطول واللون.'}</p>
            </Bubble>
            <div className="flex flex-wrap items-center justify-between gap-3 ps-10">
              <button onClick={onRestart} className="text-sm font-semibold text-brand-dark hover:underline">{lang === 'en' ? 'Answer again' : 'أعد الإجابة'}</button>
              <Button onClick={onContinue}>{t(lang, 'findSuppliers')}<ArrowIcon className="h-4 w-4 rtl:rotate-180" /></Button>
            </div>
          </div>
        )}
        <div ref={end} />
      </div>
    </section>
  )
}
