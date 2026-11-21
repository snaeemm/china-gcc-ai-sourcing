import { useState } from 'react'
import type { Lang } from '../data/i18n'
import { tr } from '../data/i18n'
import { Button, Pill } from './ui'

type Act = 'approve' | 'modify' | 'reject' | 'escalate'
interface Case { id: string; title: string; ar: string; state: string; scenario: string; suggestion: string; evidence: string[]; flags: string[]; gate: string }
const CASES: Case[] = [
  { id: 'INQ-0001', title: 'Wall panels, 500 m², Dubai', ar: 'ألواح جدران، 500 م²، دبي', state: 'Supplier Review', scenario: 'Unverified factory',
    suggestion: 'Proceed to a sample request with Supplier A. Hold any purchase order until factory verification and sample approval are complete.',
    evidence: ['Catalogue specs are supplier-declared', 'Colour unconfirmed: sample needed', 'No registry, licence or test evidence on file'], flags: ['Unverified, not a confirmed adverse finding'], gate: 'Reviewer handles onboarding, disputed evidence and exceptions.' },
  { id: 'INQ-0002', title: 'Photo of louvre cladding', ar: 'صورة كسوة شرائحية', state: 'Needs Clarification', scenario: 'Unclear image',
    suggestion: 'Ask for two more angles and the panel dimensions. Do not infer details that are not visible.',
    evidence: ['One low-resolution photo', 'No dimensions or material stated'], flags: ['Ambiguous request'], gate: 'Reviewer checks ambiguous or high-impact cases.' },
  { id: 'INQ-0003', title: 'Acoustic ceiling baffles, Riyadh', ar: 'ألواح عزل صوتي للأسقف، الرياض', state: 'Matching', scenario: 'No matching product',
    suggestion: 'Broaden multilingual search, show close alternatives and open a sourcing case. New supplier outreach needs approval.',
    evidence: ['No catalogue record within tolerance', 'Two partial alternatives found'], flags: ['Outreach would contact new suppliers'], gate: 'Reviewer approves new supplier outreach where required.' },
  { id: 'INQ-0004', title: 'Floor tile quotations', ar: 'عروض أسعار بلاط الأرضيات', state: 'Quotes Received', scenario: 'Incomparable quotations',
    suggestion: 'Request normalised terms (currency, Incoterm, MOQ, lead time) before ranking any quote.',
    evidence: ['Quotes in CNY and USD', 'One ex-works, one CIF'], flags: ['Terms not comparable'], gate: 'Reviewer approves exceptions or material commercial assumptions.' },
]
const ACT: Record<Act, [string, string, 'ok' | 'brand' | 'bad' | 'warn']> = { approve: ['Approve', 'اعتماد', 'ok'], modify: ['Modify', 'تعديل', 'brand'], reject: ['Reject', 'رفض', 'bad'], escalate: ['Escalate', 'تصعيد', 'warn'] }

// Fictional restricted fields. Only rendered in the "Authorized internal" view of this demo.
const RESTRICTED: Record<string, [string, string, string, string]> = {
  'INQ-0001': ['Sales contact (fictional, name and phone)', 'Introduced through a partner agent; commission terms on file', 'Catalogue scan matches declared specs; factory visit not yet arranged', 'Opened by operator 1 · supplier shortlist edited by operator 2'],
  'INQ-0002': ['None on file: no supplier identified yet', 'None', 'Image resolution too low to identify the material', 'Clarification request drafted · awaiting reviewer'],
  'INQ-0003': ['Two candidate suppliers (contacts withheld until outreach is approved)', 'No existing relationship', 'Partial alternatives only; no outreach made', 'Sourcing case opened · outreach approval pending'],
  'INQ-0004': ['Two sales contacts (fictional)', 'One repeat supplier; negotiated price tier on file', 'Terms differ (CNY ex-works vs USD CIF); not comparable yet', 'Quotes logged · normalisation requested'],
}

export default function Review({ lang, onBack }: { lang: Lang; onBack: () => void }) {
  const [view, setView] = useState<'customer' | 'internal'>('customer')
  const [sel, setSel] = useState(CASES[0].id)
  const [act, setAct] = useState<Act | null>(null)
  const [reason, setReason] = useState('')
  const [log, setLog] = useState<{ id: string; act: Act; reason: string; at: string }[]>([])
  const c = CASES.find(x => x.id === sel)!
  const done = (id: string) => log.find(l => l.id === id)
  const record = () => {
    if (!act) return
    setLog(l => [{ id: c.id, act, reason: reason.trim(), at: new Date().toLocaleTimeString(lang === 'en' ? 'en-GB' : 'ar-AE', { hour: '2-digit', minute: '2-digit' }) }, ...l])
    setAct(null); setReason('')
  }
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-16 pt-4">
      <div className="rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap gap-2"><Pill tone="brand">{tr(lang, 'Internal view', 'عرض داخلي')}</Pill><Pill tone="warn">{tr(lang, 'Fictional cases · simulated suggestions', 'حالات افتراضية · اقتراحات محاكاة')}</Pill></div>
          <h1 className="text-3xl font-extrabold tracking-tight">{tr(lang, 'Human review dashboard', 'لوحة المراجعة البشرية')}</h1>
          <p className="mt-1 text-muted">{tr(lang, 'Where an operator reviews the assistant’s suggestions, decides, and leaves a reason. Every decision is logged.', 'حيث يراجع المشغّل اقتراحات المساعد ويقرر ويدوّن السبب. يُسجَّل كل قرار.')}</p>
        </div>
        <Button variant="ghost" onClick={onBack}>{tr(lang, 'Back to customer view', 'العودة إلى عرض العميل')}</Button>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.6fr]">
        <section className="rise rounded-3xl bg-white p-3 shadow-card ring-1 ring-line" aria-label="Cases">
          {CASES.map(x => {
            const d = done(x.id)
            return (
              <button key={x.id} onClick={() => { setSel(x.id); setAct(null); setReason('') }} aria-current={sel === x.id} className={`mb-1 flex w-full flex-col gap-1.5 rounded-2xl p-3.5 text-start transition last:mb-0 ${sel === x.id ? 'bg-brand-soft ring-1 ring-brand/40' : 'hover:bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-muted">{x.id}</span>{d ? <Pill tone={ACT[d.act][2]}>{tr(lang, ACT[d.act][0], ACT[d.act][1])}</Pill> : <Pill>{x.state}</Pill>}</div>
                <div className="text-sm font-semibold">{tr(lang, x.title, x.ar)}</div>
                <div className="text-xs text-muted">{x.scenario}</div>
              </button>
            )
          })}
        </section>

        <section key={c.id} className="rise rounded-3xl bg-white p-6 shadow-card ring-1 ring-line">
          <div className="flex flex-wrap items-center gap-2"><span className="text-xs font-semibold text-muted">{c.id}</span><Pill tone="warn">{c.scenario}</Pill></div>
          <h2 className="mt-2 text-xl font-bold">{tr(lang, c.title, c.ar)}</h2>
          <div className="mt-4 rounded-2xl bg-brand-soft p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-dark">{tr(lang, 'Assistant suggestion (simulated)', 'اقتراح المساعد (محاكاة)')}</div>
            <p className="mt-1 text-sm">{c.suggestion}</p>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><h3 className="text-sm font-semibold text-muted">{tr(lang, 'Evidence', 'الأدلة')}</h3><ul className="mt-2 space-y-1.5 text-sm">{c.evidence.map(e => <li key={e}>• {e}</li>)}</ul></div>
            <div><h3 className="text-sm font-semibold text-muted">{tr(lang, 'Risk indicators', 'مؤشرات المخاطر')}</h3><ul className="mt-2 space-y-1.5 text-sm">{c.flags.map(e => <li key={e}>• {e}</li>)}</ul></div>
          </div>
          <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-muted"><b>{tr(lang, 'Human gate: ', 'بوابة بشرية: ')}</b>{c.gate}</p>

          <div className="mt-4 rounded-2xl p-4 ring-1 ring-line" aria-label="Information access">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">{tr(lang, 'Who can see what', 'من يرى ماذا')}</h3>
              <div className="flex gap-1 rounded-full bg-slate-50 p-1 ring-1 ring-line" role="group" aria-label="Access view">
                {(['customer', 'internal'] as const).map(v => (
                  <button key={v} onClick={() => setView(v)} aria-pressed={view === v} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${view === v ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}>
                    {v === 'customer' ? tr(lang, 'Customer view', 'عرض العميل') : tr(lang, 'Authorized internal', 'داخلي مصرّح')}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-2 rounded-xl bg-warn-soft p-2.5 text-xs text-amber-950">{tr(lang, 'Demo toggle only: this is not security. In a real build, access is enforced on the server by role, and restricted data is never sent to a customer’s browser.', 'مفتاح تجريبي فقط وليس أمانًا فعليًا. في النسخة الحقيقية تُفرض الصلاحيات على الخادم حسب الدور، ولا تُرسل البيانات المقيّدة إلى متصفح العميل.')}</p>
            <dl className="mt-3 divide-y divide-line text-sm">
              {([
                [tr(lang, 'Product specification', 'مواصفات المنتج'), tr(lang, c.title, c.ar), false],
                [tr(lang, 'Verification status', 'حالة التحقق'), tr(lang, 'Unverified (checks not done)', 'غير موثّق (لم تُجرَ الفحوص)'), false],
                [tr(lang, 'Supplier contact', 'جهة اتصال المورد'), RESTRICTED[c.id][0], true],
                [tr(lang, 'Sourcing relationship', 'علاقة التوريد'), RESTRICTED[c.id][1], true],
                [tr(lang, 'Internal verification notes', 'ملاحظات التحقق الداخلية'), RESTRICTED[c.id][2], true],
                [tr(lang, 'Approval and audit history', 'سجل الاعتماد والتدقيق'), RESTRICTED[c.id][3], true],
              ] as [string, string, boolean][]).map(([k, v, restricted]) => (
                <div key={k} className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 py-2">
                  <dt className="text-muted">{k}</dt>
                  <dd className="max-w-[60%] text-end font-semibold">
                    {restricted && view === 'customer' ? <Pill tone="neutral">{tr(lang, 'Restricted · authorized staff only', 'مقيّد · للموظفين المصرّح لهم فقط')}</Pill> : v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Decision">
            {(Object.keys(ACT) as Act[]).map(k => <button key={k} onClick={() => setAct(k)} aria-pressed={act === k} className={`rounded-xl px-4 py-2.5 text-sm font-semibold ring-1 transition ${act === k ? 'bg-ink text-white ring-ink' : 'bg-white ring-line hover:bg-slate-50'}`}>{tr(lang, ACT[k][0], ACT[k][1])}</button>)}
          </div>
          {act && (
            <div className="fade mt-3 flex flex-col gap-3 sm:flex-row">
              <input value={reason} onChange={e => setReason(e.target.value)} placeholder={tr(lang, 'Reason (recorded with the decision)', 'السبب (يُسجَّل مع القرار)')} aria-label="Reason" className="min-w-0 flex-1 rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/25" />
              <Button onClick={record}>{tr(lang, 'Record decision', 'سجّل القرار')}</Button>
            </div>
          )}
        </section>
      </div>

      <section className="rise mt-5 rounded-3xl bg-white p-6 shadow-card ring-1 ring-line" style={{ animationDelay: '.1s' }}>
        <h2 className="text-lg font-bold">{tr(lang, 'Decision log', 'سجل القرارات')}</h2>
        <p className="text-xs text-muted">{tr(lang, 'Kept in this browser tab only. In a production build, decisions would be stored with evidence, reviewer identity and outcome.', 'محفوظ في هذا التبويب فقط. في النسخة الإنتاجية تُخزَّن القرارات مع الأدلة وهوية المراجع والنتيجة.')}</p>
        {log.length === 0 ? <p className="mt-3 text-sm text-muted">{tr(lang, 'No decisions recorded yet.', 'لا توجد قرارات مسجّلة بعد.')}</p> : (
          <ul className="mt-3 divide-y divide-line text-sm">{log.map((l, i) => <li key={i} className="pop flex flex-wrap items-center gap-3 py-2.5"><span className="text-xs text-muted">{l.at}</span><span className="font-semibold">{l.id}</span><Pill tone={ACT[l.act][2]}>{tr(lang, ACT[l.act][0], ACT[l.act][1])}</Pill><span className="text-muted">{l.reason || '—'}</span></li>)}</ul>
        )}
      </section>
    </main>
  )
}
