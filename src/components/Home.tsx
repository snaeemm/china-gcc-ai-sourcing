import { useEffect, useRef, useState } from 'react'
import type { Lang } from '../data/i18n'
import { t } from '../data/i18n'
import { extractSpecs, NO_EXTRAS, type Extras, type Specs } from '../data/mock'
import { BotIcon, ChatIcon, ImageIcon, MicIcon, Modal, PreviewTag, SearchIcon, SparkIcon, TextIcon } from './ui'
import Skyline from './Skyline'
import Chat from './Chat'

type Phase = 'idle' | 'reading' | 'chat'

export default function Home({ lang, query, setQuery, specs, setSpecs, extras, setExtras, image, setImage, onContinue }: {
  lang: Lang; query: string; setQuery: (s: string) => void; specs: Specs | null; setSpecs: (s: Specs) => void; extras: Extras; setExtras: (e: Extras) => void
  image: { url: string; name: string } | null; setImage: (i: { url: string; name: string } | null) => void; onContinue: () => void
}) {
  const [phase, setPhase] = useState<Phase>(specs ? 'chat' : 'idle')
  const [toast, setToast] = useState<string | null>(null)
  const [panel, setPanel] = useState<null | 'messages' | 'ask'>(null)
  const [faq, setFaq] = useState<number | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const file = useRef<HTMLInputElement>(null)
  const timer = useRef<number>(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const flash = (m: string) => { setToast(m); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setToast(null), 3200) }

  const submit = (text = query) => {
    if (!text.trim()) { input.current?.focus(); return }
    setQuery(text); setExtras(NO_EXTRAS); setPhase('reading')
    window.setTimeout(() => { setSpecs(extractSpecs(text)); setPhase('chat') }, 1100)
  }
  const example = () => { const q = t(lang, 'exampleQuery'); setQuery(q); submit(q) }

  const onFile = (f?: File) => { if (f && f.type.startsWith('image/')) setImage({ url: URL.createObjectURL(f), name: f.name }) }

  const faqs = [1, 2, 3] as const

  return (
    <main className="relative flex-1 overflow-hidden bg-gradient-to-b from-[#eef3ff] via-[#f7f9ff] to-[#e6eeff]">
      <div className="blob -left-24 top-10 h-96 w-96 bg-[#9db8ff]" /><div className="blob -right-20 top-40 h-96 w-96 bg-[#c9b8ff]" style={{ animationDelay: '-6s' }} /><div className="blob left-1/3 top-[28rem] h-80 w-80 bg-[#a6e6f5]" style={{ animationDelay: '-11s' }} />
      <Skyline />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pb-28 pt-12 text-center sm:pt-20">
        <h1 className="rise grad-title text-4xl font-extrabold tracking-tight sm:text-6xl">{t(lang, 'heroTitle')}</h1>
        <p className="rise mt-3 text-sm font-medium text-muted sm:text-base" style={{ animationDelay: '.06s' }}>{t(lang, 'heroSub')}</p>

        {/* Search */}
        <form onSubmit={e => { e.preventDefault(); submit() }} className="rise mt-9 w-full" style={{ animationDelay: '.12s' }} role="search">
          <div className="glow rounded-full p-[2px]"><div className="flex items-center gap-2 rounded-full bg-white p-2 ps-5">
            <SparkIcon className="h-5 w-5 shrink-0 text-brand" />
            <input ref={input} value={query} onChange={e => { setQuery(e.target.value); if (phase === 'chat') setPhase('idle') }}
              placeholder={t(lang, 'placeholder')} aria-label={t(lang, 'placeholder')}
              className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-slate-400" />
            <button type="submit" aria-label={t(lang, 'search')} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-dark active:scale-95"><SearchIcon className="h-5 w-5" /></button>
          </div></div>
          {phase === 'idle' && !query && (
            <button type="button" onClick={example} className="fade mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-brand-dark ring-1 ring-brand/20 backdrop-blur hover:bg-white">
              <SparkIcon className="h-4 w-4" />{t(lang, 'tryExample')}
            </button>
          )}
        </form>

        {image && (
          <div className="pop mt-4 flex items-center gap-3 rounded-2xl bg-white p-2 pe-4 text-start shadow-card ring-1 ring-line">
            <img src={image.url} alt="" className="h-12 w-12 rounded-xl object-cover" />
            <div className="min-w-0 text-sm"><div className="truncate font-semibold">{t(lang, 'imageAttached')}</div><div className="text-xs text-muted">{t(lang, 'imageNote')}</div></div>
            <button onClick={() => { setImage(null); if (file.current) file.current.value = '' }} className="ms-2 text-xs font-semibold text-brand-dark hover:underline">{t(lang, 'remove')}</button>
          </div>
        )}

        {phase === 'idle' && (
          <>
            {/* Input modes */}
            <div className="rise mt-9 grid w-full max-w-xl grid-cols-3 gap-2 text-start" style={{ animationDelay: '.18s' }}>
              <input ref={file} type="file" accept="image/*" hidden onChange={e => onFile(e.target.files?.[0])} />
              {[
                { icon: <ImageIcon className="h-6 w-6" />, l: t(lang, 'image'), s: t(lang, 'imageSub'), on: () => file.current?.click(), tag: true },
                { icon: <TextIcon className="h-6 w-6" />, l: t(lang, 'text'), s: t(lang, 'textSub'), on: () => input.current?.focus() },
                { icon: <MicIcon className="h-6 w-6" />, l: t(lang, 'voice'), s: t(lang, 'voiceSub'), on: () => flash(t(lang, 'voiceToast')), tag: true, preview: true },
              ].map((m, i) => (
                <button key={i} onClick={m.on} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-center transition hover:bg-white/70">
                  <span className="text-brand">{m.icon}</span>
                  <span className="text-sm font-semibold">{m.l}</span>
                  <span className="text-[11px] text-muted">{m.s}</span>
                  {m.preview && <PreviewTag label={t(lang, 'preview')} />}
                </button>
              ))}
            </div>
            {/* Secondary entry points */}
            <div className="rise mt-6 flex gap-4" style={{ animationDelay: '.24s' }}>
              {[{ icon: <ChatIcon className="h-8 w-8" />, l: t(lang, 'messages'), s: t(lang, 'messagesSub'), on: () => setPanel('messages') },
                { icon: <BotIcon className="h-8 w-8" />, l: t(lang, 'askAi'), s: t(lang, 'askAiSub'), on: () => setPanel('ask') }].map((c, i) => (
                <button key={i} onClick={c.on} className="drift flex w-36 flex-col items-center gap-1 rounded-3xl bg-white/90 px-4 py-5 shadow-card ring-1 ring-white transition hover:-translate-y-0.5 hover:shadow-xl sm:w-44" style={{ animationDelay: `${i * 0.8}s` }}>
                  <span className="text-brand">{c.icon}</span><span className="text-sm font-bold">{c.l}</span><span className="text-[11px] text-muted">{c.s}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {phase === 'reading' && (
          <div className="fade mt-8 w-full max-w-xl rounded-3xl bg-white p-6 text-start shadow-card ring-1 ring-line" role="status">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-dark"><SparkIcon className="h-4 w-4 animate-pulse" />{t(lang, 'reading')}</div>
            <div className="space-y-2.5"><div className="skeleton h-4 w-3/4 rounded" /><div className="skeleton h-4 w-1/2 rounded" /><div className="skeleton h-4 w-2/3 rounded" /></div>
          </div>
        )}

        {phase === 'chat' && specs && (
          <Chat lang={lang} query={query} specs={specs} setSpecs={setSpecs} extras={extras} setExtras={setExtras} image={image}
            onContinue={onContinue} onRestart={() => submit(query)} />
        )}
      </div>

      <p className="absolute inset-x-0 bottom-4 z-10 px-5 text-center text-[11px] text-muted">{t(lang, 'footNote')}</p>

      {toast && <div role="status" className="pop fixed bottom-16 left-1/2 z-50 w-[min(92vw,26rem)] -translate-x-1/2 rounded-2xl bg-ink px-5 py-3 text-center text-sm text-white shadow-2xl">{toast}</div>}

      {panel === 'messages' && (
        <Modal title={t(lang, 'messagesTitle')} onClose={() => setPanel(null)} closeLabel={t(lang, 'close')}>
          <div className="mb-3"><PreviewTag label={t(lang, 'preview')} /></div>
          <p className="text-sm text-muted">{t(lang, 'messagesBody')}</p>
        </Modal>
      )}
      {panel === 'ask' && (
        <Modal title={t(lang, 'askTitle')} onClose={() => { setPanel(null); setFaq(null) }} closeLabel={t(lang, 'close')}>
          <div className="mb-3 flex items-center gap-2"><PreviewTag label={t(lang, 'preview')} /><span className="text-xs text-muted">{t(lang, 'askBody')}</span></div>
          <div className="space-y-2">
            {faqs.map(n => (
              <div key={n} className="rounded-2xl border border-line">
                <button onClick={() => setFaq(faq === n ? null : n)} aria-expanded={faq === n} className="w-full px-4 py-3 text-start text-sm font-semibold">{t(lang, `faq${n}q` as 'faq1q')}</button>
                {faq === n && <p className="fade px-4 pb-3 text-sm text-muted">{t(lang, `faq${n}a` as 'faq1a')}</p>}
              </div>
            ))}
          </div>
        </Modal>
      )}
    </main>
  )
}
