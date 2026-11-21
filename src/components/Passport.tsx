import { useState } from 'react'
import type { Lang } from '../data/i18n'
import { t, tr } from '../data/i18n'
import { AlertIcon, ArrowIcon, Button, Pill, ShieldIcon } from './ui'

type St = 'declared' | 'notStarted' | 'missing' | 'notChecked' | 'na'
const tone = { declared: 'brand', notStarted: 'neutral', missing: 'bad', notChecked: 'neutral', na: 'neutral' } as const

export default function Passport({ lang, onBack, onRfq }: { lang: Lang; onBack: () => void; onRfq: () => void }) {
  const [sup, setSup] = useState<'A' | 'B'>('A')
  const label = (s: St) => ({ declared: tr(lang, 'Declared', 'معلن'), notStarted: tr(lang, 'Not started', 'لم يبدأ'), missing: tr(lang, 'Not provided', 'غير متوفر'), notChecked: tr(lang, 'Not checked', 'لم يُفحص'), na: tr(lang, 'Nothing to track', 'لا شيء للمتابعة') }[s])
  const rows: [string, string, St, string, string][] = [
    ['Business registry lookup', 'بحث السجل التجاري', 'notStarted', 'Registry entry to be matched to the legal name', 'مطابقة السجل مع الاسم القانوني'],
    ['Business licence', 'رخصة النشاط', 'missing', 'No document uploaded', 'لم يُرفع أي مستند'],
    ['Product certificates', 'شهادات المنتج', 'missing', 'e.g. emissions or fire-performance, as relevant', 'مثل الانبعاثات أو مقاومة الحريق عند الحاجة'],
    ['Test reports', 'تقارير الاختبار', 'missing', 'Validity for this product not established', 'لم تتأكد صلاحيتها لهذا المنتج'],
    ['Bank-name consistency', 'اتساق اسم الحساب البنكي', 'notChecked', 'Account name vs. legal name', 'اسم الحساب مقابل الاسم القانوني'],
    ['Catalogue listing', 'قائمة الكتالوج', 'declared', 'Supplier-declared specifications; illustrative entry', 'مواصفات معلنة من المورد؛ بند توضيحي'],
    ['Document expiry', 'انتهاء المستندات', 'na', 'No documents on file yet', 'لا توجد مستندات بعد'],
  ]
  const A = sup === 'A'
  const declared: [string, string][] = [
    [tr(lang, 'Product line', 'خط المنتج'), tr(lang, 'Interior wall panels', 'ألواح جدران داخلية')],
    [tr(lang, 'Thickness / length', 'السماكة / الطول'), A ? `8 ${t(lang, 'mm')} / 2.8 ${t(lang, 'm')}` : `6 ${t(lang, 'mm')} / 2.8 ${t(lang, 'm')}`],
    [t(lang, 'moq'), `300 ${t(lang, 'sqm')}`],
    [t(lang, 'production'), `${A ? 25 : 30} ${t(lang, 'days')}`],
    [tr(lang, 'Legal name', 'الاسم القانوني'), tr(lang, 'Not provided', 'غير متوفر')],
    [tr(lang, 'Registration no.', 'رقم التسجيل'), tr(lang, 'Not provided', 'غير متوفر')],
    [tr(lang, 'Contact and sourcing relationship', 'جهة الاتصال وعلاقة التوريد'), tr(lang, 'Restricted', 'مقيّد')],
  ]
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-16 pt-4">
      <div className="rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{tr(lang, 'Factory passport', 'جواز المصنع')}</h1>
          <p className="mt-1 text-muted">{tr(lang, 'Evidence and verification status for one supplier. Concept layout with fictional data.', 'الأدلة وحالة التحقق لمورد واحد. تصميم تصوري ببيانات افتراضية.')}</p>
        </div>
        <div className="flex gap-1 rounded-full bg-white p-1 ring-1 ring-line shadow-card" role="tablist">
          {(['A', 'B'] as const).map(k => (
            <button key={k} role="tab" aria-selected={sup === k} onClick={() => setSup(k)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${sup === k ? 'bg-gradient-to-r from-brand to-[#5b5cff] text-white' : 'text-muted hover:bg-slate-100'}`}>
              {t(lang, 'supplier')} {lang === 'en' ? k : k === 'A' ? 'أ' : 'ب'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-5">
          <section className="rise rounded-3xl bg-white p-6 shadow-card ring-1 ring-line">
            <div className="flex items-start justify-between gap-3">
              <div><h2 className="text-lg font-bold">{t(lang, 'supplier')} {lang === 'en' ? sup : sup === 'A' ? 'أ' : 'ب'}</h2><p className="text-xs text-muted">{t(lang, 'fictional')}</p></div>
              <Pill tone="warn" icon={<ShieldIcon className="h-3.5 w-3.5" />}>{tr(lang, 'Unverified', 'غير موثّق')}</Pill>
            </div>
            <dl className="mt-4 divide-y divide-line text-sm">
              {declared.map(([k, v]) => <div key={k} className="flex justify-between gap-3 py-2.5"><dt className="text-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>)}
            </dl>
          </section>
          <section className="rise rounded-3xl bg-warn-soft p-5 ring-1 ring-amber-200" style={{ animationDelay: '.08s' }}>
            <h2 className="flex items-center gap-2 font-bold text-warn"><AlertIcon className="h-5 w-5" />{tr(lang, 'Risk flags', 'علامات المخاطر')}</h2>
            <p className="mt-2 text-sm text-amber-950">{tr(lang, 'No adverse findings are confirmed. This reflects checks not yet done, not clearance. Unverified is not the same as confirmed risk.', 'لا توجد نتائج سلبية مؤكدة. هذا يعكس فحوصاً لم تُنجز بعد وليس تبرئة. «غير موثّق» لا يعني «خطر مؤكد».')}</p>
          </section>
        </div>

        <section className="rise rounded-3xl bg-white p-6 shadow-card ring-1 ring-line" style={{ animationDelay: '.05s' }}>
          <h2 className="text-lg font-bold">{tr(lang, 'Evidence checklist', 'قائمة الأدلة')}</h2>
          <ul className="mt-3 divide-y divide-line">
            {rows.map(([en, ar, st, ne, na]) => (
              <li key={en} className="flex items-start justify-between gap-3 py-3">
                <div><div className="font-semibold">{tr(lang, en, ar)}</div><div className="text-xs text-muted">{tr(lang, ne, na)}</div></div>
                <Pill tone={tone[st]}>{label(st)}</Pill>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-muted">{tr(lang, 'Supplier verification is tracked separately from the inquiry status. Platform approval of a supplier and a customer’s quote acceptance are distinct events.', 'يُتتبَّع التحقق من المورد بشكل منفصل عن حالة الطلب. اعتماد المنصة للمورد وقبول العميل لعرض السعر حدثان مختلفان.')}</p>
        </section>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="ghost" onClick={onBack}>{tr(lang, 'Back to recommendation', 'العودة إلى التوصية')}</Button>
        <Button onClick={onRfq}>{tr(lang, 'Prepare RFQ draft', 'تجهيز مسودة طلب عرض سعر')}<ArrowIcon className="h-4 w-4 rtl:rotate-180" /></Button>
      </div>
    </main>
  )
}
