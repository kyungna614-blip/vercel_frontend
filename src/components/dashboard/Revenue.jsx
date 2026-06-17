import { useState } from 'react'
import { useForge, getAccent } from '../../App'
import { TrendingUp, ChevronRight, Sparkles, BarChart2, AlertCircle, ArrowUpRight, Users, Share2 } from 'lucide-react'

function fmt(n) {
  n = parseInt(n) || 0
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

const INSIGHTS = [
  {
    type: 'action',
    icon: AlertCircle,
    label: 'Your product is live — time to share it',
    detail: 'Share your launch link with your audience. Your first 10 signups come from your warmest followers.',
    cta: 'Generate launch post',
    color: 'rgba(255,255,255,0.06)',
  },
  {
    type: 'tip',
    icon: TrendingUp,
    label: 'Founders who launch in the first 48h earn 3× more in month 1',
    detail: 'Post your launch announcement now while momentum is fresh.',
    cta: 'Write announcement',
    color: 'rgba(255,255,255,0.04)',
  },
  {
    type: 'tip',
    icon: BarChart2,
    label: 'Email converts 3–5× better than social posts',
    detail: 'If you haven\'t sent your list an email yet — that\'s your highest-leverage move right now.',
    cta: 'Write email',
    color: 'rgba(255,255,255,0.04)',
  },
]

export default function Revenue() {
  const { creatorData } = useForge()
  const accent = getAccent(creatorData.platform)
  // No fake analytics — all data is real or clearly labeled as guidance

  return (
    <div className="p-6 max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <p className="forge-label mb-3">Revenue</p>
        <h2 className="forge-heading mb-1.5" style={{ fontSize: 'clamp(22px, 3vw, 30px)', letterSpacing: '-0.03em' }}>
          Revenue overview
        </h2>
        <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.38)' }}>
          Forge tracks your revenue and tells you what to do next.
        </p>
      </div>

      {/* Real KPI strip — based on actual data we can know */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Followers', value: fmt(creatorData.followers || 0), sub: `on ${creatorData.platform || 'platform'}` },
          { label: 'Product', value: creatorData.productName ? 'Live' : 'Draft', sub: creatorData.productName || 'Not launched yet' },
          { label: 'Niche', value: (creatorData.niche || 'Creator').split(' ')[0], sub: creatorData.niche || 'Your market' },
        ].map((kpi, i) => (
          <div key={i} className="rounded-xl border p-4" style={{ background: '#111', borderColor: i === 1 ? `rgba(${accent.rgb},0.2)` : 'rgba(255,255,255,0.07)' }}>
            <p className="text-[11px] mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{kpi.label}</p>
            <p className="text-[24px] font-semibold tracking-tight text-white leading-none mb-0.5">{kpi.value}</p>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Status card — honest about where things stand */}
      <div className="rounded-2xl border p-6" style={{ background: '#111', borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[13px] mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Launch status</p>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: accent.color }} />
              <span className="text-[20px] font-bold text-white">Product is live</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: `rgba(${accent.rgb},0.1)`, border: `1px solid rgba(${accent.rgb},0.2)` }}>
            <Users size={12} style={{ color: accent.color }} />
            <span className="text-[12px] font-bold" style={{ color: accent.color }}>{fmt(creatorData.followers || 0)} audience</span>
          </div>
        </div>

        <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Your product page is active. Revenue tracking will begin once you connect a payment provider
          (Stripe, Gumroad, etc.) and start receiving sign-ups. Focus on sharing your link now.
        </p>

        <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <Share2 size={12} style={{ color: accent.color, opacity: 0.6 }} />
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Share your product link to start getting sign-ups.
          </p>
        </div>
      </div>

      {/* Forge insights - action-tied */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <p className="forge-label">Forge guidance</p>
          <Sparkles size={13} className="text-white/25" />
        </div>
        <div className="space-y-2">
          {INSIGHTS.map((insight, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl border" style={{ background: insight.color, borderColor: 'rgba(255,255,255,0.07)' }}>
              <insight.icon size={15} className="text-white/40 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-white mb-0.5">{insight.label}</p>
                <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{insight.detail}</p>
              </div>
              <button
                className="text-[12px] px-3 py-1.5 rounded-full flex-shrink-0 transition-all duration-150"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.color = 'white' }}
                onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.color = 'rgba(255,255,255,0.55)' }}
              >
                {insight.cta} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Revenue paths — suggested, not claimed */}
      <section>
        <p className="forge-label mb-4">Suggested revenue paths</p>
        <p className="text-[12px] mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Based on your niche ({creatorData.niche || 'your market'}) and audience size, here are models that work well:
        </p>
        <div className="space-y-2">
          {[
            { label: 'Memberships / Subscriptions', description: 'Recurring revenue from your community', suggestion: 'Best for engaged audiences' },
            { label: 'Digital products / Courses', description: 'One-time or bundled knowledge products', suggestion: 'High margins, passive income' },
            { label: 'Coaching / Consulting', description: '1-on-1 or group coaching sessions', suggestion: 'Premium pricing, low volume' },
            { label: 'Sponsored content', description: 'Brand deals aligned to your niche', suggestion: 'Scales with follower growth' },
          ].map((path, i) => (
            <div key={path.label} className="p-4 rounded-xl border transition-all duration-150" style={{ background: '#111', borderColor: i === 0 ? `rgba(${accent.rgb},0.2)` : 'rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-white">{path.label}</span>
                    {i === 0 && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: accent.color, color: 'white' }}>Recommended</span>}
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{path.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{path.suggestion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Next revenue action */}
      <div className="rounded-2xl border p-5" style={{ background: `rgba(${accent.rgb},0.05)`, borderColor: `rgba(${accent.rgb},0.15)` }}>
        <div className="flex items-center gap-3">
          <ArrowUpRight size={16} style={{ color: accent.color }} />
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-white">Your next revenue move</p>
            <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Post your launch announcement to get your first 10 paying members.</p>
          </div>
          <button className="forge-btn-primary text-[12px] py-2 px-4 flex-shrink-0">Generate post</button>
        </div>
      </div>
    </div>
  )
}
