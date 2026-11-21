import { useEffect, useState } from 'react'
import type { Lang } from './data/i18n'
import { EXAMPLE_SPECS, isComplete, NO_EXTRAS, type Extras, type Specs } from './data/mock'
import Header, { type Screen } from './components/Header'
import Home from './components/Home'
import Matching from './components/Matching'
import Decision from './components/Decision'
import Passport from './components/Passport'
import Rfq from './components/Rfq'
import Review from './components/Review'
import SampleModal from './components/SampleModal'

export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const [screen, setScreen] = useState<Screen>('home')
  const [query, setQuery] = useState('')
  const [specs, setSpecs] = useState<Specs | null>(null)
  const [extras, setExtras] = useState<Extras>(NO_EXTRAS)
  const [image, setImage] = useState<{ url: string; name: string } | null>(null)
  const [selected, setSelected] = useState<string[]>(['A', 'B'])
  const [sampleOpen, setSampleOpen] = useState(false)
  const [epoch, setEpoch] = useState(0)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const complete = !!specs && isComplete(specs)
  const go = (s: Screen) => { setScreen(s); window.scrollTo({ top: 0 }) }
  const restart = () => { setQuery(''); setSpecs(null); setExtras(NO_EXTRAS); setImage(null); setSelected(['A', 'B']); setSampleOpen(false); setEpoch(e => e + 1); go('home') }

  return (
    <div className="flex min-h-full flex-col">
      <div className={screen === 'home' ? 'absolute inset-x-0 top-0 z-20' : 'relative z-30 bg-white/60 backdrop-blur'}>
        <Header lang={lang} setLang={setLang} screen={screen} goHome={() => go('home')} go={go}
          reachable={{ home: true, match: complete, decide: complete && selected.length === 2, passport: true, rfq: true, review: true }} />
      </div>
      {screen === 'home' && (
        <Home key={epoch} lang={lang} query={query} setQuery={setQuery} specs={specs} setSpecs={setSpecs} extras={extras} setExtras={setExtras} image={image} setImage={setImage}
          onContinue={() => go('match')} />
      )}
      {screen === 'match' && specs && (
        <Matching lang={lang} spec={specs} selected={selected} setSelected={setSelected} onCompare={() => go('decide')} onAdjust={() => go('home')} />
      )}
      {screen === 'decide' && specs && (
        <Decision lang={lang} onBack={() => go('match')} onRequest={() => setSampleOpen(true)} onPassport={() => go('passport')} onRfq={() => go('rfq')} />
      )}
      {screen === 'passport' && <Passport lang={lang} onBack={() => go('decide')} onRfq={() => go('rfq')} />}
      {screen === 'rfq' && <Rfq lang={lang} spec={specs ?? EXAMPLE_SPECS} extras={extras} onBack={() => go('decide')} />}
      {screen === 'review' && <Review lang={lang} onBack={() => go(complete ? 'decide' : 'home')} />}
      {sampleOpen && specs && <SampleModal lang={lang} spec={specs} hasImage={!!image} extras={extras} onClose={() => setSampleOpen(false)} onRestart={restart} />}
    </div>
  )
}
