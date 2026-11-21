// Deterministic, local, fictional data. Source: China–GCC Customer Journey (concept v1, 15 Nov 2026).
export interface Specs {
  quantity: number | null
  thickness: number | null
  length: number | null
  colour: string | null
  destination: string | null
}

export const EXAMPLE_SPECS: Specs = { quantity: 500, thickness: 8, length: 2.8, colour: 'light wood', destination: 'Dubai' }

const num = (s: string) => parseFloat(s.replace(/,/g, ''))

/** Simple rule-based extraction. Deliberately NOT presented as AI. */
export function extractSpecs(text: string): Specs {
  const q = text.match(/([\d,]+(?:\.\d+)?)\s*(?:square\s*met(?:re|er)s?|sq\.?\s*m(?:etres?|eters?)?|sqm|m2|m²|متر\s*مربع|م²)/i)
  const th = text.match(/(\d+(?:\.\d+)?)\s*(?:mm|millimet(?:re|er)s?|مم)/i)
  const len = text.match(/(\d+(?:\.\d+)?)\s*(?:m|met(?:re|er)s?|م)\s*(?:long|length|طول)|(?:length|طول)\s*(?:of\s*)?(\d+(?:\.\d+)?)/i)
  const dest = text.match(/\b(dubai|abu dhabi|sharjah|riyadh|jeddah|doha|muscat|kuwait|manama)\b|(دبي|أبوظبي|الرياض|جدة|الدوحة)/i)
  const ar: Record<string, string> = { 'دبي': 'Dubai', 'أبوظبي': 'Abu Dhabi', 'الرياض': 'Riyadh', 'جدة': 'Jeddah', 'الدوحة': 'Doha' }
  const colour = text.match(/\b(light wood|dark wood|walnut|oak|white|grey|gray|black)\b|(خشبي فاتح)/i)
  return {
    quantity: q ? num(q[1]) : null,
    thickness: th ? num(th[1]) : null,
    length: len ? num(len[1] ?? len[2]) : null,
    colour: colour ? (colour[2] ? 'light wood' : colour[1].toLowerCase()) : null,
    destination: dest ? (dest[2] ? ar[dest[2]] : dest[1].replace(/\b\w/g, c => c.toUpperCase())) : null,
  }
}

export const isComplete = (s: Specs) => Object.values(s).every(v => v !== null)

export type Fit = 'match' | 'mismatch' | 'confirm'
export interface Supplier {
  id: 'A' | 'B' | 'C'
  thickness: number
  length: number
  moq: number
  unitPrice: number
  goods: number
  freight: number
  productionDays: number
  colourNeedsSample: boolean
}

export const SUPPLIERS: Supplier[] = [
  { id: 'A', thickness: 8, length: 2.8, moq: 300, unitPrice: 42, goods: 21000, freight: 3000, productionDays: 25, colourNeedsSample: true },
  { id: 'B', thickness: 6, length: 2.8, moq: 300, unitPrice: 38, goods: 19000, freight: 3200, productionDays: 30, colourNeedsSample: true },
  { id: 'C', thickness: 8, length: 2.8, moq: 1000, unitPrice: 0, goods: 0, freight: 0, productionDays: 0, colourNeedsSample: true },
]

/** Compare each supplier-declared attribute with the (possibly edited) request. */
export function fitFor(s: Supplier, spec: Specs) {
  return {
    thickness: (spec.thickness === s.thickness ? 'match' : 'mismatch') as Fit,
    length: (spec.length === s.length ? 'match' : 'mismatch') as Fit,
    moq: ((spec.quantity ?? 0) >= s.moq ? 'match' : 'mismatch') as Fit,
    colour: 'confirm' as Fit,
  }
}

export type Overall = 'full' | 'partial' | 'unsuitable'
export function overallFor(s: Supplier, spec: Specs): Overall {
  const f = fitFor(s, spec)
  if (f.moq === 'mismatch') return 'unsuitable'
  if (f.thickness === 'mismatch' || f.length === 'mismatch') return 'partial'
  return 'full'
}

export const fmt = (n: number) => n.toLocaleString('en-US')

export interface Extras { done: boolean; delivery: string | null; features: string[]; notes: string }
export const NO_EXTRAS: Extras = { done: false, delivery: null, features: [], notes: '' }
