import { useState } from 'react'
import type { Lang } from '../data/i18n'
import { t, tr } from '../data/i18n'
import type { Extras, Specs } from '../data/mock'
import { AlertIcon, Button, CheckIcon, Pill } from './ui'

const INCOTERMS: [string, string, string][] = [['FOB', 'Supplier delivers to the Chinese port', 'يسلّم المورد إلى الميناء الصيني'], ['CIF', 'Includes sea freight and insurance to port of arrival', 'يشمل الشحن البحري والتأمين حتى ميناء الوصول'], ['DDP', 'Supplier handles delivery, duties and taxes', 'يتولى المورد التسليم والرسوم والضرائب']]

export default function Rfq({ lang, spec, extras, onBack }: { lang: Lang; spec: Specs; extras: Extras; onBack: () => void }) {
  const [term, setTerm] = useState<string | null>(null)
  const [valid, setValid] = useState(14)
  const [to, setTo] = useState<string[]>(['A', 'B'])
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => { setSaved(false); setTo(x => x.includes(k) ? x.filter(i => i !== k) : [...x, k]) }
  const specs: [string, string][] = [
    [t(lang, 'product'), t(lang, 'productVal')], [t(lang, 'quantity'), `${spec.quantity} ${t(lang, 'sqm')}`], [t(lang, 'thickness'), `${spec.thickness} ${t(lang, 'mm')}`],
    [t(lang, 'length'), `${spec.length} ${t(lang, 'm')}`], [t(lang, 'colour'), `${spec.colour} — ${tr(lang, 'sample confirmation required', 'يلزم تأكيد بالعينة')}`], [t(lang, 'destination'), `${spec.destination ?? ''}`],
    ...(extras.delivery ? [[tr(lang, 'Needed by', 'الموعد'), extras.delivery] as [string, string]] : []),
    ...(extras.features.length ? [[tr(lang, 'Preferences', 'التفضيلات'), extras.features.join(' · ')] as [string, string]] : []),
  ]
  const asks = [['Price per m² in a single currency', 'سعر المتر المربع بعملة واحدة'], ['Minimum order quantity', 'الحد الأدنى للكمية'], ['Production and lead time', 'مدة الإنتاج والتسليم'], ['Incoterm and port', 'شروط التسليم والميناء'], ['Quote validity', 'مدة صلاحية العرض'], ['Sample price and timing', 'سعر العينة ومدتها']]
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-16 pt-4">
      <div className="rise">
        <h1 className="text-3xl font-extrabold tracking-tight">{tr(lang, 'RFQ draft', 'مسودة طلب عرض سعر')}</h1>
        <p className="mt-1 text-muted">{tr(lang, 'One standard request so quotes can be compared like for like. Preview only: nothing is sent.', 'طلب موحّد لتتم مقارنة العروض على أساس واحد. معاينة فقط: لا يُرسل شيء.')}</p>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <section className="rise rounded-3xl bg-white p-6 shadow-card ring-1 ring-line">
            <h2 className="text-lg font-bold">{tr(lang, 'Comparable specification', 'المواصفات القابلة للمقارنة')}</h2>
            <dl className="mt-3 grid gap-x-8 sm:grid-cols-2">{specs.map(([k, v]) => <div key={k} className="flex justify-between gap-3 border-b border-line py-2.5 text-sm"><dt className="text-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl>
          </section>
          <section className="rise rounded-3xl bg-white p-6 shadow-card ring-1 ring-line" style={{ animationDelay: '.06s' }}>
            <h2 className="text-lg font-bold">{tr(lang, 'Delivery terms (Incoterm)', 'شروط التسليم')}</h2>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
              {INCOTERMS.map(([k, en, ar]) => (
                <button key={k} onClick={() => { setTerm(k); setSaved(false) }} aria-pressed={term === k} className={`relative rounded-2xl border p-3.5 text-start transition hover:-translate-y-0.5 hover:border-brand ${term === k ? 'border-brand bg-brand-soft' : 'border-line'}`}>
                  <div className="font-bold">{k}</div><div className="mt-0.5 text-xs text-muted">{tr(lang, en, ar)}</div>
                  {term === k && <CheckIcon className="absolute end-2 top-2 h-4 w-4 text-brand" />}
                </button>
              ))}
            </div>
            <h3 className="mt-5 text-sm font-semibold text-muted">{tr(lang, 'Quote must remain valid for', 'يجب أن يظل العرض ساريًا لمدة')}</h3>
            <div className="mt-2 flex gap-2">{[14, 30].map(d => <button key={d} onClick={() => { setValid(d); setSaved(false) }} aria-pressed={valid === d} className={`rounded-xl px-4 py-2 text-sm font-semibold ${valid === d ? 'bg-brand text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{d} {t(lang, 'days')}</button>)}</div>
          </section>
          <section className="rise rounded-3xl bg-white p-6 shadow-card ring-1 ring-line" style={{ animationDelay: '.1s' }}>
            <h2 className="text-lg font-bold">{tr(lang, 'Suppliers must respond with', 'يجب أن يرد الموردون بـ')}</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">{asks.map(([en, ar]) => <li key={en} className="flex gap-2"><CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{tr(lang, en, ar)}</li>)}</ul>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-4 lg:self-start">
          <section className="rise rounded-3xl bg-white p-5 shadow-card ring-1 ring-line" style={{ animationDelay: '.05s' }}>
            <h2 className="font-bold">{tr(lang, 'Proposed recipients', 'الجهات المقترحة')}</h2>
            <ul className="mt-3 space-y-2">
              {(['A', 'B', 'C'] as const).map(k => {
                const off = k === 'C'
                return (
                  <li key={k}><label className={`flex items-center justify-between gap-3 rounded-2xl border border-line p-3 text-sm ${off ? 'opacity-50' : 'cursor-pointer hover:bg-slate-50'}`}>
                    <span className="flex items-center gap-2.5"><input type="checkbox" disabled={off} checked={to.includes(k)} onChange={() => toggle(k)} className="h-4 w-4 accent-[#1d5bff]" />
                      <span className="font-semibold">{t(lang, 'supplier')} {lang === 'en' ? k : { A: 'أ', B: 'ب', C: 'ج' }[k]}</span></span>
                    <Pill tone={off ? 'bad' : 'warn'}>{off ? t(lang, 'notSelectable') : tr(lang, 'Unverified', 'غير موثّق')}</Pill>
                  </label></li>
                )
              })}
            </ul>
          </section>
          <section className="rise rounded-3xl bg-warn-soft p-5 ring-1 ring-amber-200" style={{ animationDelay: '.1s' }}>
            <h2 className="flex items-center gap-2 font-bold text-warn"><AlertIcon className="h-5 w-5" />{tr(lang, 'Approval required', 'مطلوب اعتماد')}</h2>
            <p className="mt-2 text-sm text-amber-950">{tr(lang, 'Sending an RFQ to new suppliers needs your approval and, where policy requires, internal approval. A binding purchase order is a separate step.', 'إرسال طلب عرض سعر إلى موردين جدد يتطلب موافقتك، وموافقة داخلية عند اقتضاء السياسة. أمر الشراء الملزم خطوة منفصلة.')}</p>
          </section>
          {saved && <div role="status" className="pop rounded-2xl bg-ok-soft p-4 text-sm font-semibold text-ok">{tr(lang, 'Draft saved as a preview. No RFQ was sent to anyone.', 'حُفظت المسودة كمعاينة. لم يُرسل أي طلب لأي جهة.')}</div>}
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onBack} className="flex-1">{tr(lang, 'Back', 'رجوع')}</Button>
            <Button className="flex-1" disabled={!term || to.length === 0} onClick={() => setSaved(true)}>{tr(lang, 'Save draft preview', 'احفظ المسودة')}</Button>
          </div>
          {!term && <p className="text-center text-xs text-muted">{tr(lang, 'Choose an Incoterm to continue', 'اختر شرط التسليم للمتابعة')}</p>}
        </aside>
      </div>
    </main>
  )
}
