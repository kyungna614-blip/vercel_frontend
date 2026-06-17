/**
 * CreatorOnboard — The page a creator lands on when clicking
 * the unique link in their outreach email: /onboard/:creatorId
 *
 * Flow:
 *  1. Fetch creator profile + AI-generated product ideas from backend
 *  2. Creator reviews their personalized ideas
 *  3. Creator selects one → generates landing page + redirects to portal
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Sparkles, ArrowRight, Globe, Smartphone, Users, ShoppingBag,
  CheckCircle, Loader2, Youtube, AlertTriangle, Rocket,
} from 'lucide-react'
import WingLogo from '../ui/WingLogo'

const API = import.meta.env.VITE_API_URL || ''

const CATEGORY_META = {
  course:           { icon: Globe,       label: 'Online Course',      color: '#3b82f6' },
  community:        { icon: Users,       label: 'Premium Community',  color: '#8b5cf6' },
  app:              { icon: Smartphone,  label: 'Mobile App',         color: '#06b6d4' },
  physical_product: { icon: ShoppingBag, label: 'Physical Product',   color: '#f59e0b' },
  saas:             { icon: Globe,       label: 'SaaS Platform',      color: '#10b981' },
  coaching:         { icon: Users,       label: '1-on-1 Coaching',    color: '#ec4899' },
  newsletter:       { icon: Globe,       label: 'Premium Newsletter', color: '#6366f1' },
  other:            { icon: Globe,       label: 'Digital Product',    color: '#94a3b8' },
}

function fmt(n) {
  n = parseInt(n) || 0
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

export default function CreatorOnboard() {
  const { creatorId } = useParams()
  const navigate = useNavigate()

  const [creator, setCreator] = useState(null)
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [building, setBuilding] = useState(false)

  // Fetch creator + ideas on mount
  useEffect(() => {
    if (!creatorId) return
    setLoading(true)
    setError(null)

    fetch(`${API}/api/automation/onboard/${creatorId}`)
      .then(res => {
        if (!res.ok) throw new Error(res.status === 404 ? 'Creator not found' : `Error ${res.status}`)
        return res.json()
      })
      .then(data => {
        setCreator(data.creator)
        setIdeas(data.ideas || [])
        if (data.ideas?.length > 0) setSelectedId(data.ideas[0].id)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [creatorId])

  // Select idea and generate landing page
  const handleSelect = async () => {
    if (!selectedId) return
    setBuilding(true)
    try {
      const res = await fetch(`${API}/api/automation/onboard/${creatorId}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea_id: selectedId }),
      })
      if (!res.ok) throw new Error('Failed to build your product')
      navigate(`/portal/${creatorId}`)
    } catch (err) {
      alert(err.message)
      setBuilding(false)
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060407' }}>
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-white/40 mx-auto mb-4" />
          <p className="text-[14px] text-white/40">Loading your personalized portal...</p>
        </div>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060407' }}>
        <div className="text-center max-w-md px-6">
          <AlertTriangle size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-[22px] font-bold text-white mb-2">Link Not Found</h2>
          <p className="text-[14px] text-white/40 mb-6">{error}</p>
          <a href="/" className="forge-btn-primary">Go to Creator Forge</a>
        </div>
      </div>
    )
  }

  const selectedIdea = ideas.find(i => i.id === selectedId)

  // ── Main onboard page ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#060407', color: 'white' }}>

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 120% 50% at 50% -5%, rgba(110,5,5,0.45) 0%, transparent 60%)',
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <WingLogo size={26} />
          <span className="text-white font-semibold text-[15px] tracking-tight">Creator Forge</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[12px] font-medium text-green-400">Your Personalized Portal</span>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 px-4 sm:px-8 py-10 sm:py-16 max-w-4xl mx-auto w-full">

        {/* Welcome banner */}
        <div className="mb-12 text-center">
          {/* Creator profile card */}
          <div className="inline-flex items-center gap-4 mb-8 px-6 py-4 rounded-2xl border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
            {creator.avatar ? (
              <img src={creator.avatar} alt="" className="w-14 h-14 rounded-full object-cover border-2 flex-shrink-0"
                style={{ borderColor: 'rgba(192,57,43,0.4)' }} />
            ) : (
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-[20px] font-bold flex-shrink-0"
                style={{ background: 'rgba(192,57,43,0.15)', color: '#e87070' }}>
                {(creator.name || '?')[0]}
              </div>
            )}
            <div className="text-left">
              <p className="text-[17px] font-bold text-white mb-0.5">{creator.name}</p>
              <div className="flex items-center gap-3 text-[12px] text-white/40">
                <span className="flex items-center gap-1">
                  <Youtube size={12} className="text-red-500" />
                  {creator.handle ? `@${creator.handle.replace('@','')}` : ''}
                </span>
                {creator.follower_count > 0 && (
                  <span className="font-medium">{fmt(creator.follower_count)} followers</span>
                )}
              </div>
              {(creator.niche || []).length > 0 && (
                <div className="flex gap-1.5 mt-2">
                  {(creator.niche || []).map((n, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>{n}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 46px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            marginBottom: 16,
          }}>
            Welcome, {creator.name?.split(' ')[0] || 'Creator'}
          </h1>
          <p className="text-[15px] text-white/40 max-w-md mx-auto leading-relaxed">
            We've analyzed your audience and niche to create
            {' '}<span className="text-white/70 font-semibold">{ideas.length} custom product ideas</span>{' '}
            just for you. Pick one and we'll build it.
          </p>
        </div>

        {/* Ideas grid */}
        {ideas.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles size={36} className="text-white/15 mx-auto mb-5" />
            <p className="text-[15px] text-white/30 font-medium">No product ideas generated yet.</p>
            <p className="text-[13px] text-white/20 mt-1">Check back soon — we're working on it!</p>
          </div>
        ) : (
          <>
            <p className="text-[11px] font-bold uppercase tracking-widest text-center mb-6"
              style={{ color: 'rgba(192,57,43,0.6)' }}>Choose your product</p>
            <div className="grid md:grid-cols-2 gap-5 mb-10">
              {ideas.map((idea, idx) => {
                const meta = CATEGORY_META[idea.business_model] || CATEGORY_META.other
                const Icon = meta.icon
                const isSelected = selectedId === idea.id
                return (
                  <div
                    key={idea.id}
                    onClick={() => setSelectedId(idea.id)}
                    className="relative rounded-2xl border cursor-pointer transition-all duration-200"
                    style={{
                      padding: '28px 24px',
                      background: isSelected ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                      borderColor: isSelected ? 'rgba(192,57,43,0.5)' : 'rgba(255,255,255,0.07)',
                      boxShadow: isSelected ? '0 0 30px rgba(192,57,43,0.1)' : 'none',
                    }}
                  >
                    {/* Best match badge */}
                    {idx === 0 && (
                      <div className="absolute top-4 right-4">
                        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full"
                          style={{ background: 'rgba(192,57,43,0.15)', color: '#e87070', border: '1px solid rgba(192,57,43,0.25)' }}>
                          Best Match
                        </span>
                      </div>
                    )}

                    {/* Selected checkmark */}
                    {isSelected && (
                      <div className="absolute top-4 left-4">
                        <CheckCircle size={18} className="text-green-400" />
                      </div>
                    )}

                    {/* Icon + type */}
                    <div className="flex items-center gap-2.5 mb-4 mt-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${meta.color}22` }}>
                        <Icon size={18} style={{ color: meta.color }} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/30">
                        {meta.label}
                      </span>
                    </div>

                    {/* Name + description */}
                    <h3 className="text-[20px] font-bold text-white mb-1.5 tracking-tight">
                      {idea.product_name}
                    </h3>
                    <p className="text-[13px] text-white/45 leading-relaxed mb-4">
                      {idea.product_description}
                    </p>

                    {/* AI reasoning */}
                    {idea.ai_reasoning && (
                      <div className="rounded-xl p-3 mb-4"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-white/25 mb-1.5 flex items-center gap-1">
                          <Sparkles size={10} /> Why this fits you
                        </p>
                        <p className="text-[12px] text-white/40 leading-relaxed">
                          {idea.ai_reasoning}
                        </p>
                      </div>
                    )}

                    {/* Revenue model */}
                    {idea.business_model && (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                          {idea.business_model}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* CTA */}
            <div className="text-center pt-4">
              <button
                onClick={handleSelect}
                disabled={building || !selectedId}
                className="inline-flex items-center gap-3 text-[16px] font-bold px-12 py-4.5 rounded-2xl transition-all duration-200 disabled:opacity-40"
                style={{
                  background: 'linear-gradient(135deg, #c0392b, #a93226)',
                  color: 'white',
                  boxShadow: '0 6px 32px rgba(192,57,43,0.45)',
                  padding: '18px 48px',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 44px rgba(192,57,43,0.65)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 6px 32px rgba(192,57,43,0.45)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {building ? (
                  <><Loader2 size={18} className="animate-spin" /> Building your product...</>
                ) : (
                  <><Rocket size={18} /> Launch {selectedIdea?.product_name || 'this product'}</>
                )}
              </button>
              <p className="text-[12px] text-white/20 mt-4">
                We'll generate your landing page, marketing plan, and launch materials
              </p>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-8 border-t text-center"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-[12px] text-white/15">Powered by Creator Forge</p>
      </footer>
    </div>
  )
}
