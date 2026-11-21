import type { Lang } from '../data/i18n'
import { t } from '../data/i18n'
import { fmt, SUPPLIERS } from '../data/mock'
import { AlertIcon, ArrowIcon, Button, CheckIcon, ClockIcon, CountUp, Pill, ShieldIcon } from './ui'

export default function Decision({ lang, onBack, onRequest, onPassport, onRfq }: { lang: Lang; onBack: () => void; onRequest: () => void; onPassport: () => void; onRfq: () => void }) {
  const [A, B] = [SUPPLIERS[0], SUPPLIERS[1]]
  const money = (n: number) => lang === 'en' ? `AED ${fmt(n)}` : `${fmt(n)} ${t(lang, 'aed')}`
  const subA = A.goods + A.freight, subB = B.goods + B.freight
  const rows: { l: string; a: React.ReactNode; b: React.ReactNode; bold?: boolean }[] = [
    { l: t(lang, 'thickness'), a: `${A.thickness} ${t(lang, 'mm')}`, b: `${B.thickness} ${t(lang, 'mm')}` },
    { l: t(lang, 'unitPrice'), a: money(A.unitPrice), b: money(B.unitPrice) },
    { l: t(lang, 'goods'), a: money(A.goods), b: money(B.goods) },
    { l: t(lang, 'freight'), a: money(A.freight), b: money(B.freight) },
    { l: t(lang, 'subtotal'), a: <CountUp to={subA} format={money} />, b: <CountUp to={subB} format={money} />, bold: true },
    { l: t(lang, 'production'), a: `${A.productionDays} ${t(lang, 'days')}`, b: `${B.productionDays} ${t(lang, 'days')}` },
  ]
  const pend = [['pFactory', 'pFactoryD'], ['pSample', 'pSampleD'], ['pQuote', 'pQuoteD'], ['pCosts', 'pCostsD']] as const
  const ev = [
    { k: 'ev1', s: 'ev1s', st: 'declared', tone: 'brand' }, { k: 'ev2', s: 'ev2s', st: 'illustrative', tone: 'neutral' },
    { k: 'ev3', s: 'ev3s', st: 'missingEv', tone: 'bad' }, { k: 'ev4', s: 'ev4s', st: 'unconf', tone: 'warn' },
  ] as const

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-16 pt-4">
      <div className="rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{t(lang, 'decisionTitle')}</h1>
          <p className="mt-1 text-muted">{t(lang, 'decisionSub')}</p>
        </div>
        <Button onClick={onRequest}>{t(lang, 'requestSample')}<ArrowIcon className="h-4 w-4 rtl:rotate-180" /></Button>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <div className="space-y-5">
          {/* comparison */}
          <section className="rise overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-line" style={{ animationDelay: '.05s' }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-start">
                  <th className="p-4 text-start font-medium text-muted">{t(lang, 'item')}</th>
                  <th className="bg-brand-soft p-4 text-start"><div className="flex items-center gap-2 font-bold">{t(lang, 'supplier')} {lang === 'en' ? 'A' : 'أ'}<span className="rounded-full bg-gradient-to-r from-brand to-[#5b5cff] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">{lang === 'en' ? 'Closest fit' : 'الأقرب'}</span></div><div className="text-xs font-medium text-brand-dark">{t(lang, 'fitA')}</div></th>
                  <th className="p-4 text-start"><div className="font-bold">{t(lang, 'supplier')} {lang === 'en' ? 'B' : 'ب'}</div><div className="text-xs font-medium text-warn">{t(lang, 'fitB')}</div></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.l} className="border-t border-line">
                    <td className="p-4 text-muted">{r.l}</td>
                    <td className={`bg-brand-soft/60 p-4 ${r.bold ? 'text-base font-bold' : 'font-semibold'}`}>{r.a}</td>
                    <td className={`p-4 ${r.bold ? 'text-base font-bold' : 'font-semibold'}`}>{r.b}</td>
                  </tr>
                ))}
                <tr className="border-t border-line bg-slate-50">
                  <td className="p-4 text-muted">{t(lang, 'diff')}</td>
                  <td colSpan={2} className="p-4 font-semibold">+{money(subA - subB)} ({lang === 'en' ? 'A vs B' : 'أ مقابل ب'})</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="rise rounded-3xl bg-white p-6 shadow-card ring-1 ring-line" style={{ animationDelay: '.08s' }} aria-label="Goods + freight">
            <h2 className="text-sm font-semibold text-muted">{t(lang, 'subtotal')}</h2>
            {[['A', subA, 'from-brand to-[#5b5cff]'], ['B', subB, 'from-slate-400 to-slate-300']].map(([k, v, g]) => (
              <div key={k as string} className="mt-3 flex items-center gap-3">
                <span className="w-5 text-sm font-bold">{lang === 'en' ? k : k === 'A' ? 'أ' : 'ب'}</span>
                <div className="h-3 flex-1 rounded-full bg-slate-100"><div className={`bar h-3 rounded-full bg-gradient-to-r ${g}`} style={{ width: `${((v as number) / subA) * 100}%` }} /></div>
                <span className="w-28 text-end text-sm font-semibold">{money(v as number)}</span>
              </div>
            ))}
          </section>

          {/* why */}
          <section className="rise rounded-3xl bg-white p-6 shadow-card ring-1 ring-line" style={{ animationDelay: '.1s' }}>
            <h2 className="text-lg font-bold">{t(lang, 'whyTitle')}</h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              {(['why1', 'why2', 'why3', 'why4'] as const).map(k => (
                <li key={k} className="flex gap-2.5"><CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" /><span>{t(lang, k)}</span></li>
              ))}
            </ul>
          </section>

          {/* pending */}
          <section className="rise rounded-3xl bg-white p-6 shadow-card ring-1 ring-line" style={{ animationDelay: '.15s' }}>
            <h2 className="text-lg font-bold">{t(lang, 'pendingTitle')}</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {pend.map(([a, b]) => (
                <li key={a} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-2"><span className="font-semibold">{t(lang, a)}</span><Pill tone="warn" icon={<ClockIcon className="h-3 w-3" />}>{t(lang, 'pending')}</Pill></div>
                  <p className="mt-1 text-xs text-muted">{t(lang, b)}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-4 lg:self-start">
          <section className="rise rounded-3xl bg-warn-soft p-5 ring-1 ring-amber-200" style={{ animationDelay: '.08s' }} role="note">
            <h2 className="flex items-center gap-2 font-bold text-warn"><AlertIcon className="h-5 w-5" />{t(lang, 'notIncluded')}</h2>
            <p className="mt-2 text-sm text-amber-950">{t(lang, 'notIncludedBody')}</p>
          </section>

          <section className="rise rounded-3xl bg-white p-5 shadow-card ring-1 ring-line" style={{ animationDelay: '.14s' }}>
            <h2 className="flex items-center gap-2 font-bold"><ShieldIcon className="h-5 w-5 text-brand" />{t(lang, 'evidenceTitle')}</h2>
            <ul className="mt-3 divide-y divide-line text-sm">
              {ev.map(e => (
                <li key={e.k} className="flex items-start justify-between gap-3 py-2.5">
                  <div><div className="font-semibold">{t(lang, e.k)}</div><div className="text-xs text-muted">{t(lang, 'evSrc')}: {t(lang, e.s)}</div></div>
                  <Pill tone={e.tone}>{t(lang, e.st)}</Pill>
                </li>
              ))}
            </ul>
            <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-muted">{t(lang, 'humanGate')}</p>
          </section>

          <section className="rise rounded-3xl bg-white p-5 shadow-card ring-1 ring-line" style={{ animationDelay: '.17s' }} aria-label="Approval chain">
            <h2 className="font-bold">{lang === 'en' ? 'Three separate approvals' : 'ثلاث موافقات منفصلة'}</h2>
            <ol className="mt-3 space-y-2.5 text-sm">
              {([
                ['Customer confirms', 'العميل يؤكد', 'Shown in this demo: sample request only', 'يظهر في العرض: طلب العينة فقط', true],
                ['Internal authorization', 'اعتماد داخلي', 'Authorized staff · not in this demo', 'موظفون مصرّح لهم · خارج العرض', false],
                ['Supplier accepts the PO', 'المورد يقبل أمر الشراء', 'Happens outside the platform · not in this demo', 'يتم خارج المنصة · خارج العرض', false],
              ] as [string, string, string, string, boolean][]).map(([en, ar, ne, na, on], i) => (
                <li key={en} className={`flex items-start gap-3 ${on ? '' : 'opacity-60'}`}>
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${on ? 'bg-brand text-white' : 'bg-slate-100 text-muted'}`}>{i + 1}</span>
                  <div><div className="font-semibold">{lang === 'en' ? en : ar}</div><div className="text-xs text-muted">{lang === 'en' ? ne : na}</div></div>
                </li>
              ))}
            </ol>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="soft" onClick={onPassport}>{lang === 'en' ? 'Factory passport' : 'جواز المصنع'}</Button>
            <Button variant="soft" onClick={onRfq}>{lang === 'en' ? 'RFQ draft' : 'مسودة طلب السعر'}</Button>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onBack} className="flex-1">{t(lang, 'backToMatches')}</Button>
            <Button onClick={onRequest} className="flex-1">{t(lang, 'requestSample')}</Button>
          </div>
        </aside>
      </div>
      <p className="mt-8 text-center text-xs text-muted">{t(lang, 'conceptNote')}</p>
    </main>
  )
}
