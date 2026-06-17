import { useState, useEffect } from 'react'
import { X, ExternalLink, Check, Eye, EyeOff, ChevronDown, Loader2, AlertCircle, Sparkles, Zap } from 'lucide-react'
import WingLogo from './WingLogo'
import { loadKeys, saveKeys, testApifyToken } from '../../services/scraper'
import { loadAiKeys, saveAiKeys, hasGeminiKey, hasTogetherKey } from '../../services/ai'

export default function ApiKeysModal({ onClose, platform, defaultTab = 'scraping' }) {
  const [tab, setTab] = useState(defaultTab) // 'scraping' | 'ai'

  // ── Scraping keys ──────────────────────────────────────────────────────────
  const [apKey,      setApKey]      = useState('')
  const [ytKey,      setYtKey]      = useState('')
  const [showAp,     setShowAp]     = useState(false)
  const [showYt,     setShowYt]     = useState(false)
  const [showAdv,    setShowAdv]    = useState(false)
  const [testStatus, setTestStatus] = useState(null)
  const [testMsg,    setTestMsg]    = useState('')

  // ── AI keys ────────────────────────────────────────────────────────────────
  const [gemKey,      setGemKey]      = useState('')
  const [togetherKey, setTogetherKey] = useState('')
  const [showGem,     setShowGem]     = useState(false)
  const [showTogether,setShowTogether]= useState(false)

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const scrapeKeys = loadKeys()
    setApKey(scrapeKeys.apifyToken    || '')
    setYtKey(scrapeKeys.youtubeApiKey || '')
    const aiKeys = loadAiKeys()
    setGemKey(aiKeys.geminiKey      || '')
    setTogetherKey(aiKeys.togetherKey || '')
  }, [])

  const handleSave = () => {
    saveKeys({ apifyToken: apKey, youtubeApiKey: ytKey })
    saveAiKeys({ geminiKey: gemKey, togetherKey })
    setSaved(true)
    setTimeout(() => { setSaved(false); onClose?.() }, 800)
  }

  const handleTest = async () => {
    if (!apKey.trim()) return
    setTestStatus('testing')
    setTestMsg('')
    const result = await testApifyToken(apKey)
    if (result.ok) {
      setTestStatus('ok')
      setTestMsg(`Connected as ${result.username}`)
    } else {
      setTestStatus('error')
      setTestMsg(result.error || 'Invalid token')
    }
  }

  const apConnected      = !!apKey.trim()
  const ytConnected      = !!ytKey.trim()
  const gemConnected     = !!gemKey.trim()
  const togetherConnected= !!togetherKey.trim()
  const canSave          = !!(apKey.trim() || ytKey.trim() || gemKey.trim() || togetherKey.trim())

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(14px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose?.() }}
    >
      <div
        className="w-full max-w-md rounded-2xl border overflow-hidden"
        style={{ background: '#0e0e0e', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <WingLogo size={20} />
            <div>
              <p className="text-[15px] font-semibold text-white">API Keys</p>
              <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Stored locally — never sent to Forge servers
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/25 hover:text-white/60 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          {[
            { id: 'scraping', label: 'Scraping', icon: Zap,      desc: 'Profile data' },
            { id: 'ai',       label: 'AI',        icon: Sparkles, desc: 'Generate content' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 text-[13px] font-medium transition-colors relative"
              style={{ color: tab === t.id ? 'white' : 'rgba(255,255,255,0.35)' }}
            >
              <t.icon size={13} />
              {t.label}
              {/* Active indicator */}
              {tab === t.id && (
                <div className="absolute bottom-0 left-4 right-4 h-px bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-5 overflow-y-auto" style={{ maxHeight: '60vh' }}>

          {/* ── SCRAPING TAB ─────────────────────────────────────────── */}
          {tab === 'scraping' && (
            <>
              {/* Platform coverage badges */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'YouTube',   color: '#ff3b30' },
                  { label: 'Instagram', color: '#e1306c' },
                  { label: 'TikTok',    color: '#69c9d0' },
                  { label: 'X/Twitter', color: '#60a5fa' },
                ].map(p => (
                  <span key={p.label}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}28` }}>
                    {p.label}
                  </span>
                ))}
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {[
                  { n: 1, text: 'Go to', link: 'https://console.apify.com/account/integrations', label: 'apify.com → Account → Integrations' },
                  { n: 2, text: 'Sign up free — includes $5/mo credit (hundreds of lookups)' },
                  { n: 3, text: 'Copy your Personal API Token and paste it below' },
                ].map(s => (
                  <div key={s.n} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(255,255,255,0.07)', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.45)' }}>
                      {s.n}
                    </div>
                    <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {s.text}{' '}
                      {s.link && (
                        <a href={s.link} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 underline"
                          style={{ color: 'rgba(255,255,255,0.75)' }}>
                          {s.label} <ExternalLink size={9} />
                        </a>
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {/* Apify token */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Apify Personal API Token</p>
                  {testStatus === 'ok' && (
                    <div className="flex items-center gap-1 text-[11px]" style={{ color: 'rgba(100,220,100,0.85)' }}>
                      <Check size={10} /> {testMsg}
                    </div>
                  )}
                  {testStatus === 'error' && (
                    <div className="flex items-center gap-1 text-[11px]" style={{ color: 'rgba(255,90,90,0.85)' }}>
                      <AlertCircle size={10} /> Invalid
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 rounded-xl border px-4 py-3"
                  style={{
                    background: '#111',
                    borderColor: testStatus === 'ok' ? 'rgba(100,220,100,0.4)' : testStatus === 'error' ? 'rgba(255,90,90,0.35)' : apConnected ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)',
                  }}>
                  <input
                    type={showAp ? 'text' : 'password'}
                    className="flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/20 font-mono"
                    placeholder="apify_api_xxxxxxxxxxxxxxxx"
                    value={apKey}
                    onChange={e => { setApKey(e.target.value); setTestStatus(null); setTestMsg('') }}
                    autoFocus={tab === 'scraping'}
                  />
                  <button onClick={() => setShowAp(v => !v)} className="text-white/25 hover:text-white/60 transition-colors mr-1">
                    {showAp ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={handleTest}
                    disabled={!apKey.trim() || testStatus === 'testing'}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all disabled:opacity-30 flex-shrink-0"
                    style={{
                      background: testStatus === 'ok' ? 'rgba(100,220,100,0.12)' : 'rgba(255,255,255,0.08)',
                      color: testStatus === 'ok' ? 'rgba(100,220,100,0.9)' : 'rgba(255,255,255,0.5)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {testStatus === 'testing' ? <Loader2 size={11} className="animate-spin" /> : testStatus === 'ok' ? <Check size={11} /> : 'Test'}
                  </button>
                </div>
                {testStatus === 'error' && testMsg && (
                  <p className="text-[11px] mt-1.5" style={{ color: 'rgba(255,90,90,0.65)' }}>{testMsg}</p>
                )}
              </div>

              {/* YouTube Data API (advanced) */}
              <div>
                <button
                  onClick={() => setShowAdv(v => !v)}
                  className="flex items-center gap-1.5 text-[11px] transition-colors"
                  style={{ color: showAdv ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)' }}
                >
                  <ChevronDown size={12} style={{ transform: showAdv ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                  Advanced: YouTube Data API key (optional backup)
                  {ytConnected && <span className="ml-1 text-green-400">✓</span>}
                </button>
                {showAdv && (
                  <div className="mt-3 space-y-2">
                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Fallback if Apify YouTube actor is unavailable.{' '}
                      <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
                        target="_blank" rel="noopener noreferrer"
                        className="underline" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        Get a free key
                      </a>
                    </p>
                    <div className="flex items-center gap-2 rounded-xl border px-4 py-3"
                      style={{ background: '#111', borderColor: ytConnected ? 'rgba(100,220,100,0.25)' : 'rgba(255,255,255,0.08)' }}>
                      <input
                        type={showYt ? 'text' : 'password'}
                        className="flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/20 font-mono"
                        placeholder="AIzaSy..."
                        value={ytKey}
                        onChange={e => setYtKey(e.target.value)}
                      />
                      <button onClick={() => setShowYt(v => !v)} className="text-white/25 hover:text-white/60 transition-colors">
                        {showYt ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── AI TAB ───────────────────────────────────────────────── */}
          {tab === 'ai' && (
            <>
              {/* What each key does */}
              <div className="rounded-xl p-4 space-y-2.5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[11px] font-semibold text-white/50 mb-3 uppercase tracking-wider">What gets generated</p>
                {[
                  { icon: '✉', label: 'Launch email',          key: 'Gemini',    color: 'rgba(66,133,244,0.8)' },
                  { icon: '📸', label: 'Instagram + TikTok + X', key: 'Gemini',   color: 'rgba(66,133,244,0.8)' },
                  { icon: '📊', label: 'Pitch deck (5 slides)', key: 'Gemini',    color: 'rgba(66,133,244,0.8)' },
                  { icon: '🖼', label: 'Product mockup image',  key: 'Together.ai', color: 'rgba(130,100,255,0.8)' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[14px]">{item.icon}</span>
                      <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.55)' }}>{item.label}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(255,255,255,0.07)', color: item.color }}>
                      {item.key}
                    </span>
                  </div>
                ))}
              </div>

              {/* Gemini key */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-[12px] font-semibold text-white">Google Gemini API Key</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Free at{' '}
                      <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
                        className="underline" style={{ color: 'rgba(66,133,244,0.8)' }}>
                        aistudio.google.com/apikey <ExternalLink size={9} className="inline" />
                      </a>
                    </p>
                  </div>
                  {gemConnected && (
                    <div className="flex items-center gap-1 text-[11px]" style={{ color: 'rgba(100,220,100,0.8)' }}>
                      <Check size={10} /> Connected
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 rounded-xl border px-4 py-3"
                  style={{ background: '#111', borderColor: gemConnected ? 'rgba(100,220,100,0.3)' : 'rgba(255,255,255,0.1)' }}>
                  <input
                    type={showGem ? 'text' : 'password'}
                    className="flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/20 font-mono"
                    placeholder="AIzaSy..."
                    value={gemKey}
                    onChange={e => setGemKey(e.target.value)}
                    autoFocus={tab === 'ai'}
                  />
                  <button onClick={() => setShowGem(v => !v)} className="text-white/25 hover:text-white/60 transition-colors">
                    {showGem ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Together.ai key */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-[12px] font-semibold text-white">
                      Together.ai Key <span className="font-normal text-white/40">(optional — for images)</span>
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Free account at{' '}
                      <a href="https://api.together.ai" target="_blank" rel="noopener noreferrer"
                        className="underline" style={{ color: 'rgba(130,100,255,0.8)' }}>
                        api.together.ai <ExternalLink size={9} className="inline" />
                      </a>
                      {' '}— uses free FLUX model, no credit card
                    </p>
                  </div>
                  {togetherConnected && (
                    <div className="flex items-center gap-1 text-[11px]" style={{ color: 'rgba(100,220,100,0.8)' }}>
                      <Check size={10} /> Connected
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 rounded-xl border px-4 py-3"
                  style={{ background: '#111', borderColor: togetherConnected ? 'rgba(100,220,100,0.3)' : 'rgba(255,255,255,0.1)' }}>
                  <input
                    type={showTogether ? 'text' : 'password'}
                    className="flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/20 font-mono"
                    placeholder="together-api-..."
                    value={togetherKey}
                    onChange={e => setTogetherKey(e.target.value)}
                  />
                  <button onClick={() => setShowTogether(v => !v)} className="text-white/25 hover:text-white/60 transition-colors">
                    {showTogether ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-[11px] mt-1.5" style={{ color: 'rgba(255,255,255,0.18)' }}>
                  Skip this and product image is omitted — all copy still generates.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 pb-6 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="forge-btn-primary flex-1 text-[14px] py-3 gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {saved ? <><Check size={14} /> Saved!</> : 'Save keys'}
          </button>
          <button onClick={onClose} className="forge-btn-secondary text-[13px] py-3 px-4">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
