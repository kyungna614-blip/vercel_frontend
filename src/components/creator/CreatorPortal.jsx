/**
 * CreatorPortal — Post-launch dashboard for onboarded creators.
 * URL: /portal/:creatorId
 *
 * Shows: real creator profile, selected product details,
 *        AI promotional scripts, and actionable next steps.
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Loader2, AlertTriangle, Rocket, Play, FileText, ArrowRight,
  ExternalLink, Youtube, Users, Mail, Package, Copy, Check,
  Sparkles, Target, Globe, Share2,
} from 'lucide-react'
import WingLogo from '../ui/WingLogo'
import { useAuth } from '../../context/AuthContext'

const API = import.meta.env.VITE_API_URL || ''

function SignOutBtn() {
  const auth = useAuth()
  if (!auth?.isAuthenticated) return null
  return (
    <button
      onClick={() => { auth.signOut(); window.location.href = '/welcome' }}
      className="text-[11px] px-3 py-1.5 rounded-full transition-all"
      style={{ color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
      onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
    >
      Sign Out
    </button>
  )
}

function fmt(n) {
  n = parseInt(n) || 0
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

function StatBox({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="rounded-xl border p-5" style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white/30">{label}</span>
        <Icon size={14} style={{ color: color || 'rgba(255,255,255,0.2)' }} />
      </div>
      <p className="text-[28px] font-extrabold text-white tracking-tight">{value}</p>
      {sub && <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{sub}</p>}
    </div>
  )
}

export default function CreatorPortal() {
  const { creatorId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeScript, setActiveScript] = useState(0)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    if (!creatorId) return
    setLoading(true)
    fetch(`${API}/api/automation/dashboard/${creatorId}`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 400) throw new Error('no_product')
          throw new Error(res.status === 404 ? 'Creator not found' : `Error ${res.status}`)
        }
        return res.json()
      })
      .then(d => { setData(d); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [creatorId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060407' }}>
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-white/40 mx-auto mb-4" />
          <p className="text-[14px] text-white/40">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Creator hasn't selected a product yet — redirect to onboard
  if (error === 'no_product') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060407' }}>
        <div className="text-center max-w-md px-6">
          <Rocket size={40} className="text-yellow-400 mx-auto mb-4" />
          <h2 className="text-[22px] font-bold text-white mb-2">Select a Product First</h2>
          <p className="text-[14px] text-white/40 mb-6">
            You need to choose one of your custom product ideas before your dashboard is ready.
          </p>
          <Link to={`/onboard/${creatorId}`}
            className="inline-flex items-center gap-2 text-[14px] font-bold px-8 py-3.5 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #c0392b, #a93226)', color: 'white' }}>
            Choose a Product <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060407' }}>
        <div className="text-center max-w-md px-6">
          <AlertTriangle size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-[22px] font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-[14px] text-white/40">{error}</p>
        </div>
      </div>
    )
  }

  const { creator, product, promotional_scripts, outreach } = data
  const scripts = promotional_scripts || []

  const onboardLink = `${window.location.origin}/onboard/${creatorId}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(onboardLink)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#060407', color: 'white' }}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 100% 40% at 50% -5%, rgba(34,197,94,0.15) 0%, transparent 60%)' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <WingLogo size={26} />
          <span className="text-white font-semibold text-[15px] tracking-tight">Creator Forge</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[12px] font-bold text-green-400">{product?.status || 'LIVE'}</span>
          </div>
          <SignOutBtn />
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 py-10 max-w-5xl mx-auto w-full">

        {/* Creator profile + product hero */}
        <div className="flex items-start gap-6 mb-10">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {creator?.avatar_url ? (
              <img src={creator.avatar_url} alt="" className="w-20 h-20 rounded-2xl object-cover border-2"
                style={{ borderColor: 'rgba(34,197,94,0.3)' }} />
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-[28px] font-bold"
                style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>
                {(creator?.name || '?')[0]}
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2"
              style={{ color: 'rgba(34,197,94,0.7)' }}>Your Product is Live</p>
            <h1 className="text-[32px] font-extrabold tracking-tight mb-1">{product?.name}</h1>
            <p className="text-[14px] text-white/50 mb-3">
              {product?.tagline || product?.description}
            </p>
            <div className="flex items-center gap-4 text-[12px] text-white/40">
              <span className="flex items-center gap-1.5">
                <Users size={12} className="text-white/30" />
                {fmt(creator?.follower_count || 0)} followers
              </span>
              <span className="flex items-center gap-1.5">
                <Globe size={12} className="text-white/30" />
                {creator?.platform}
              </span>
              {creator?.niche?.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Target size={12} className="text-white/30" />
                  {creator.niche.join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Real stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <StatBox icon={Users}    label="Followers"      value={fmt(creator?.follower_count || 0)}   color="#3b82f6" sub={`on ${creator?.platform}`} />
          <StatBox icon={Package}  label="Product"        value={product?.category || 'Live'}         color="#22c55e" sub={product?.revenue_model || 'custom'} />
          <StatBox icon={Target}   label="Audience"       value={product?.target_audience?.split(' ')[0] || 'Niche'}  color="#8b5cf6" sub="target market" />
          <StatBox icon={Mail}     label="Outreach"       value={String(outreach?.sent || 0)}         color="#f59e0b" sub={`of ${outreach?.total || 0} total`} />
        </div>

        {/* Share your product link */}
        <div className="rounded-2xl border p-5 mb-10 flex items-center gap-4"
          style={{ background: 'rgba(34,197,94,0.04)', borderColor: 'rgba(34,197,94,0.15)' }}>
          <Share2 size={18} className="text-green-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-white mb-0.5">Share your product page</p>
            <p className="text-[12px] font-mono text-white/40 truncate">{onboardLink}</p>
          </div>
          <button onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-[12px] font-bold px-4 py-2 rounded-xl transition-all"
            style={{ background: copiedLink ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)', color: copiedLink ? '#4ade80' : 'white' }}>
            {copiedLink ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Link</>}
          </button>
        </div>

        {/* Promotional scripts */}
        <div className="mb-10">
          <h2 className="text-[20px] font-extrabold tracking-tight mb-1">Weekly Promotional Scripts</h2>
          <p className="text-[13px] text-white/35 mb-5">AI-generated video ideas and scripts to promote your product</p>

          {/* Script tabs */}
          <div className="flex gap-2 mb-4">
            {scripts.map((s, i) => (
              <button key={i} onClick={() => setActiveScript(i)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
                style={{
                  background: activeScript === i ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                  borderColor: activeScript === i ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                  border: '1px solid',
                  color: activeScript === i ? 'white' : 'rgba(255,255,255,0.4)',
                }}>
                <Play size={12} /> Week {s.week || i + 1}
              </button>
            ))}
          </div>

          {/* Active script */}
          {scripts[activeScript] && (
            <div className="rounded-2xl border p-6" style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(239,68,68,0.12)' }}>
                  <Youtube size={18} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-white mb-0.5">
                    {scripts[activeScript].video_title_idea}
                  </h3>
                  <p className="text-[12px] text-white/30">Week {scripts[activeScript].week || activeScript + 1} Content</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/25 mb-1.5">Hook</p>
                  <p className="text-[14px] text-white/60 leading-relaxed italic">
                    "{scripts[activeScript].hook}"
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/25 mb-1.5">Script Outline</p>
                  <p className="text-[13px] text-white/50 leading-relaxed">
                    {scripts[activeScript].script_outline}
                  </p>
                </div>

                <div className="rounded-xl p-3" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-green-400/60 mb-1">Call to Action</p>
                  <p className="text-[13px] text-green-400/80 font-medium">
                    {scripts[activeScript].call_to_action}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next steps - real actions */}
        <div className="mb-10">
          <h2 className="text-[20px] font-extrabold tracking-tight mb-1">Next Steps</h2>
          <p className="text-[13px] text-white/35 mb-5">Your launch checklist</p>
          <div className="space-y-2">
            {[
              { icon: Share2,     label: 'Share your product link with your audience', detail: 'Post on your main platform and pin it', done: false },
              { icon: Mail,       label: 'Send a launch email to your list', detail: 'Use the scripts above as starting points', done: false },
              { icon: Youtube,    label: 'Record a launch video', detail: 'Use the Week 1 script hook and outline', done: false },
              { icon: Sparkles,   label: 'Engage with early interest', detail: 'Reply to comments and DMs about your product', done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl border"
                style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <step.icon size={14} className="text-white/40" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">{step.label}</p>
                  <p className="text-[12px] text-white/35">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-3">
          <div className="rounded-xl border p-5 cursor-pointer transition-all hover:border-white/15"
            style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
            <FileText size={18} className="text-white/30 mb-3" />
            <h3 className="text-[14px] font-bold text-white mb-1">Marketing Calendar</h3>
            <p className="text-[12px] text-white/30">Plan your content schedule for maximum impact</p>
          </div>
          <div className="rounded-xl border p-5 cursor-pointer transition-all hover:border-white/15"
            style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
            <Package size={18} className="text-white/30 mb-3" />
            <h3 className="text-[14px] font-bold text-white mb-1">Product Details</h3>
            <p className="text-[12px] text-white/30">View your landing page and product configuration</p>
          </div>
          <div className="rounded-xl border p-5 cursor-pointer transition-all hover:border-white/15"
            style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
            <ExternalLink size={18} className="text-white/30 mb-3" />
            <h3 className="text-[14px] font-bold text-white mb-1">View Profile</h3>
            <p className="text-[12px] text-white/30">{creator?.handle ? `@${creator.handle.replace('@','')}` : 'Your creator profile'}</p>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-6 px-8 border-t text-center"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-[12px] text-white/15">Powered by Creator Forge</p>
      </footer>
    </div>
  )
}
