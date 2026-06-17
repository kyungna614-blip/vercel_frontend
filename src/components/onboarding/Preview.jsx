import { useState, useEffect } from 'react'
import { useForge } from '../../App'
import { ArrowLeft, ArrowRight, RefreshCw, Send, Sparkles, Check, Layout, Users, BarChart2, Settings, Radio } from 'lucide-react'
import WingLogo from '../ui/WingLogo'

const QUICK_PROMPTS = [
  'Make it more premium',
  'Focus on community',
  'More minimalist',
  'For women 25–34',
  'Mobile-first',
  'Add a podcast section',
]

const FEATURES = [
  { icon: Layout, label: 'Course builder' },
  { icon: Users, label: 'Community forum' },
  { icon: Radio, label: 'Live events' },
  { icon: BarChart2, label: 'Creator analytics' },
  { icon: Settings, label: 'Member management' },
]

function AppMockup({ theme }) {
  const isDark = theme === 'dark' || !theme
  const bg = isDark ? '#0a0a0a' : '#f8f8f8'
  const cardBg = isDark ? '#141414' : '#ffffff'
  const textColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
  const mutedColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'

  return (
    <div
      className="w-full h-full rounded-xl overflow-hidden flex flex-col"
      style={{ background: bg }}
    >
      {/* Nav */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0"
        style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }}>
            <span style={{ fontSize: '9px', color: textColor, fontWeight: 700 }}>CA</span>
          </div>
          <div className="w-16 h-1.5 rounded-full" style={{ background: mutedColor }} />
        </div>
        <div className="flex gap-3">
          {['Courses', 'Community', 'Live'].map(l => (
            <div key={l} className="w-10 h-1.5 rounded-full" style={{ background: mutedColor }} />
          ))}
        </div>
        <div className="w-16 h-5 rounded-full" style={{ background: isDark ? 'white' : 'black', opacity: 0.85 }} />
      </div>

      {/* Hero */}
      <div className="px-5 py-6 flex-shrink-0">
        <div className="w-24 h-2.5 rounded-full mb-2" style={{ background: mutedColor }} />
        <div className="w-48 h-4 rounded-full mb-1" style={{ background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }} />
        <div className="w-36 h-4 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }} />
      </div>

      {/* Course grid */}
      <div className="px-5 flex-1 overflow-hidden">
        <div className="w-12 h-1.5 rounded-full mb-3" style={{ background: mutedColor }} />
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
              <div className="h-12" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }} />
              <div className="p-2 space-y-1">
                <div className="w-full h-1.5 rounded-full" style={{ background: mutedColor }} />
                <div className="w-2/3 h-1 rounded-full" style={{ background: mutedColor, opacity: 0.6 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Preview() {
  const { next, goTo, creatorData, updateCreator } = useForge()
  const [visible, setVisible] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [theme, setTheme] = useState('dark')
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [appliedPrompts, setAppliedPrompts] = useState([])

  const blueprint = creatorData.blueprint || { name: 'Creator Academy', type: 'Web App' }

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const handlePromptSend = () => {
    if (!prompt.trim()) return
    setIsRegenerating(true)
    setAppliedPrompts(prev => [...prev, prompt])
    setPrompt('')
    // Flip theme to simulate change
    if (prompt.toLowerCase().includes('minimal') || prompt.toLowerCase().includes('light')) {
      setTimeout(() => { setTheme('light'); setIsRegenerating(false) }, 1400)
    } else {
      setTimeout(() => { setIsRegenerating(false) }, 1400)
    }
  }

  const handleQuickPrompt = (p) => {
    setIsRegenerating(true)
    setAppliedPrompts(prev => [...prev, p])
    if (p.includes('minimalist')) {
      setTimeout(() => { setTheme('light'); setIsRegenerating(false) }, 1400)
    } else {
      setTimeout(() => { setTheme('dark'); setIsRegenerating(false) }, 1400)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <button onClick={() => goTo('blueprint')} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors mr-1">
            <ArrowLeft size={16} className="text-white/40" />
          </button>
          <WingLogo size={22} />
          <span className="text-white font-semibold text-[15px] tracking-tight">Creator Forge</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="rounded-full transition-all duration-300"
              style={{
                width: i === 5 ? '20px' : '6px',
                height: '6px',
                background: i === 5 ? 'white' : i < 5 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.12)',
              }}
            />
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Live Preview */}
        <div
          className="flex-1 p-6 flex flex-col"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.55s ease',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="forge-label mb-1">Live preview</p>
              <h2
                className="forge-heading"
                style={{ fontSize: '22px', letterSpacing: '-0.03em' }}
              >
                {blueprint.name}
              </h2>
            </div>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Generated</span>
            </div>
          </div>

          {/* Preview window */}
          <div
            className="flex-1 rounded-2xl border overflow-hidden relative"
            style={{
              borderColor: 'rgba(255,255,255,0.07)',
              background: '#0a0a0a',
              minHeight: '380px',
              maxHeight: '520px',
            }}
          >
            {/* Window chrome */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-b flex-shrink-0"
              style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
            >
              {[1,2,3].map(i => (
                <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
              ))}
              <div
                className="flex-1 mx-3 h-5 rounded-md flex items-center px-2"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  {blueprint.name.toLowerCase().replace(/\s+/g, '')}.forge.app
                </span>
              </div>
            </div>

            {/* Regenerating overlay */}
            {isRegenerating && (
              <div
                className="absolute inset-0 flex items-center justify-center z-10"
                style={{ background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(4px)' }}
              >
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Regenerating...</p>
                </div>
              </div>
            )}

            <div className="h-full" style={{ padding: '0' }}>
              <AppMockup theme={theme} />
            </div>
          </div>

          {/* Applied prompts */}
          {appliedPrompts.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {appliedPrompts.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}
                >
                  <Check size={10} />
                  {p}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div
          className="lg:w-[340px] border-l p-6 flex flex-col gap-6 overflow-y-auto"
          style={{
            borderColor: 'rgba(255,255,255,0.07)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(20px)',
            transition: 'all 0.55s cubic-bezier(0.16,1,0.3,1) 0.1s',
          }}
        >
          {/* What was built */}
          <div>
            <p className="forge-label mb-3">What's included</p>
            <div className="space-y-2">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.07)' }}
                  >
                    <Icon size={13} className="text-white/60" />
                  </div>
                  <span className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
                  <Check size={12} className="ml-auto text-white/30" />
                </div>
              ))}
            </div>
          </div>

          <div className="h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />

          {/* Prompt to refine */}
          <div>
            <p className="forge-label mb-3">Refine with Forge</p>

            {/* Quick prompts */}
            <div className="flex flex-wrap gap-2 mb-4">
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => handleQuickPrompt(p)}
                  className="px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-150"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.55)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = 'rgba(255,255,255,0.1)'
                    e.target.style.color = 'rgba(255,255,255,0.85)'
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = 'rgba(255,255,255,0.06)'
                    e.target.style.color = 'rgba(255,255,255,0.55)'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Custom prompt input */}
            <div
              className="flex items-center gap-2 rounded-xl border px-4 py-3 mb-3"
              style={{ background: '#111', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <Sparkles size={14} className="text-white/25 flex-shrink-0" />
              <input
                className="forge-input flex-1 text-[13px]"
                placeholder="Describe a change..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handlePromptSend()}
              />
              <button
                onClick={handlePromptSend}
                disabled={!prompt.trim()}
                className="text-white/30 hover:text-white/70 transition-colors disabled:opacity-30"
              >
                <Send size={14} />
              </button>
            </div>

            <button
              onClick={() => handleQuickPrompt('Regenerate')}
              className="forge-btn-secondary w-full text-[13px] py-2.5 gap-2"
            >
              <RefreshCw size={13} />
              Regenerate
            </button>
          </div>

          <div className="mt-auto pt-4">
            <button
              onClick={next}
              className="forge-btn-primary w-full text-[14px] py-3.5 group"
            >
              Looks good, build it
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
