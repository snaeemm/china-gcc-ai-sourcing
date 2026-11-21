import { useState } from 'react'
import type { Lang } from '../data/i18n'
import { t } from '../data/i18n'
import type { Extras, Specs } from '../data/mock'
import { Button, CheckIcon, Modal, Pill } from './ui'

export default function SampleModal({ lang, spec, hasImage, extras, onClose, onRestart }: { lang: Lang; spec: Specs; hasImage: boolean; extras: Extras; onClose: () => void; onRestart: () => void }) {
  const [ack, setAck] = useState(false)
  const [done, setDone] = useState(false)
  const rows: [string, string][] = [
    [t(lang, 'sSupplier'), `${t(lang, 'supplier')} ${lang === 'en' ? 'A' : 'أ'} (${t(lang, 'fictional')})`],
    [t(lang, 'sProduct'), `${t(lang, 'productVal')} · ${spec.colour}`],
    [t(lang, 'sSpecs'), `${spec.thickness} ${t(lang, 'mm')} × ${spec.length} ${t(lang, 'm')} · ${spec.quantity} ${t(lang, 'sqm')}`],
    [t(lang, 'sSample'), t(lang, 'sSampleV')],
    [t(lang, 'sAddr'), `${spec.destination}`],
    [t(lang, 'sAsk'), t(lang, 'sAskV')],
    [t(lang, 'sAtt'), hasImage ? t(lang, 'sAttImg') : t(lang, 'sAttV')],
  ]
  const pref = [extras.delivery && `${lang === 'en' ? 'Needed by' : 'الموعد'}: ${extras.delivery}`, ...extras.features, extras.notes].filter(Boolean).join(' · ')
  if (pref) rows.splice(5, 0, [lang === 'en' ? 'Preferences' : 'التفضيلات', pref])
  if (done) return (
    <Modal title={t(lang, 'doneTitle')} onClose={onClose} closeLabel={t(lang, 'close')}>
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-ok-soft text-ok"><CheckIcon className="h-6 w-6" /></div>
      <p className="text-sm text-muted">{t(lang, 'doneBody')}</p>
      <div className="mt-6 flex flex-wrap gap-3"><Button onClick={onRestart}>{t(lang, 'startOver')}</Button><Button variant="ghost" onClick={onClose}>{t(lang, 'viewComparison')}</Button></div>
    </Modal>
  )
  return (
    <Modal title={t(lang, 'modalTitle')} onClose={onClose} closeLabel={t(lang, 'close')}>
      <Pill tone="warn">{t(lang, 'modalBadge')}</Pill>
      <h3 className="mt-4 text-sm font-semibold text-muted">{t(lang, 'willReach')}</h3>
      <dl className="mt-2 divide-y divide-line rounded-2xl border border-line text-sm">
        {rows.map(([k, v]) => <div key={k} className="grid grid-cols-[8rem_1fr] gap-3 px-4 py-2.5"><dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd></div>)}
      </dl>
      <h3 className="mt-4 text-sm font-semibold text-muted">{t(lang, 'verifyList')}</h3>
      <div className="mt-2 flex flex-wrap gap-2">{(['v1', 'v2', 'v3', 'v4'] as const).map(k => <Pill key={k} tone="neutral">{t(lang, k)}</Pill>)}</div>
      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-3.5 text-sm">
        <input type="checkbox" checked={ack} onChange={e => setAck(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1d5bff]" />
        <span>{t(lang, 'ack')}</span>
      </label>
      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>{t(lang, 'cancel')}</Button>
        <Button disabled={!ack} onClick={() => setDone(true)}>{t(lang, 'saveDraft')}</Button>
      </div>
    </Modal>
  )
}
