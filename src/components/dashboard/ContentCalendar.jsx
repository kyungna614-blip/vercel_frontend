import { useState } from 'react'
import { useForge } from '../../App'
import { RefreshCw, Copy, Check, Plus, Sparkles, ChevronLeft, ChevronRight, Info, Calendar } from 'lucide-react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Content theme categories with colors and rationale
const THEMES = {
  launch: { label: 'Launch', color: 'rgba(255,255,255,0.9)', bg: 'rgba(255,255,255,0.12)', why: 'Drive urgency and conversions' },
  value: { label: 'Value', color: 'rgba(255,255,255,0.6)', bg: 'rgba(255,255,255,0.06)', why: 'Build trust and grow organic reach' },
  bts: { label: 'BTS', color: 'rgba(255,255,255,0.55)', bg: 'rgba(255,255,255,0.05)', why: 'Behind-the-scenes builds intimacy with your audience' },
  proof: { label: 'Proof', color: 'rgba(255,255,255,0.65)', bg: 'rgba(255,255,255,0.07)', why: 'Social proof reduces buying hesitation' },
  cta: { label: 'CTA', color: 'rgba(255,255,255,0.85)', bg: 'rgba(255,255,255,0.1)', why: 'Direct conversion push for ready buyers' },
  community: { label: 'Community', color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.05)', why: 'Engagement posts grow your organic algorithm reach' },
  story: { label: 'Story', color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.05)', why: 'Stories humanize you and increase follower loyalty' },
}

const STATUS_STYLES = {
  draft: { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', label: 'Draft' },
  scheduled: { bg: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', label: 'Scheduled' },
  posted: { bg: 'rgba(255,255,255,0.15)', color: 'white', label: 'Posted' },
  failed: { bg: 'rgba(255,0,0,0.12)', color: 'rgba(255,80,80,0.8)', label: 'Failed' },
}

const PLATFORM_ABBR = {
  Instagram: 'IG',
  Twitter: 'X',
  YouTube: 'YT',
  TikTok: 'TT',
  LinkedIn: 'LI',
  Email: '✉',
}

const INITIAL_CALENDAR = [
  {
    day: 'Mon',
    posts: [
      { id: 1, platform: 'Instagram', type: 'Reel', title: 'Launch teaser - something big is coming', theme: 'launch', status: 'draft' },
      { id: 2, platform: 'Twitter', type: 'Thread', title: '5 things most creators get wrong about monetization', theme: 'value', status: 'scheduled' },
    ],
  },
  {
    day: 'Tue',
    posts: [
      { id: 3, platform: 'Email', type: 'Email', title: 'Early access announcement to your list', theme: 'launch', status: 'scheduled' },
      { id: 4, platform: 'Instagram', type: 'Story', title: 'Behind-the-scenes day in my life', theme: 'bts', status: 'draft' },
    ],
  },
  {
    day: 'Wed',
    posts: [
      { id: 5, platform: 'YouTube', type: 'Community', title: 'Asking my audience what they struggle with', theme: 'community', status: 'draft' },
    ],
  },
  {
    day: 'Thu',
    posts: [
      { id: 6, platform: 'Instagram', type: 'Carousel', title: 'My journey - from 0 to [result]', theme: 'proof', status: 'scheduled' },
      { id: 7, platform: 'Twitter', type: 'Post', title: 'Your audience already wants to pay you', theme: 'value', status: 'posted' },
    ],
  },
  {
    day: 'Fri',
    posts: [
      { id: 8, platform: 'YouTube', type: 'Live', title: 'Launch day live - Q&A + product reveal', theme: 'launch', status: 'draft' },
      { id: 9, platform: 'Instagram', type: 'Post', title: '[Product] is live - link in bio', theme: 'cta', status: 'draft' },
    ],
  },
  {
    day: 'Sat',
    posts: [],
  },
  {
    day: 'Sun',
    posts: [
      { id: 10, platform: 'Instagram', type: 'Story', title: 'Week recap + what\'s coming next week', theme: 'story', status: 'draft' },
    ],
  },
]

function PostCard({ post, onCopy, onSchedule, copiedId }) {
  const [showWhy, setShowWhy] = useState(false)
  const theme = THEMES[post.theme]
  const status = STATUS_STYLES[post.status]

  return (
    <div
      className="rounded-xl border p-2.5 group cursor-pointer transition-all duration-150 relative"
      style={{ background: '#111', borderColor: 'rgba(255,255,255,0.07)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.background = '#161616' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#111' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
          >
            {PLATFORM_ABBR[post.platform]}
          </span>
          <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{post.type}</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Theme tag */}
          <span
            className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: theme.bg, color: theme.color }}
          >
            {theme.label}
          </span>
          {/* Why button */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowWhy(w => !w) }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            <Info size={9} />
          </button>
        </div>
      </div>

      {/* Title */}
      <p className="text-[11px] leading-tight mb-2" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: '1.4' }}>
        {post.title}
      </p>

      {/* Why tooltip */}
      {showWhy && (
        <div className="mb-2 px-2 py-1.5 rounded-lg text-[10px] leading-relaxed" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
          {theme.why}
        </div>
      )}

      {/* Status + actions */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide" style={status}>
          {status.label}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onCopy(post.id, post.title)}
            className="p-1 rounded transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => { e.target.style.color = 'white' }}
            onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.4)' }}
          >
            {copiedId === post.id ? <Check size={10} /> : <Copy size={10} />}
          </button>
          <button
            className="p-1 rounded transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => { e.target.style.color = 'white' }}
            onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.4)' }}
          >
            <RefreshCw size={10} />
          </button>
          <button
            onClick={() => onSchedule(post.id)}
            className="p-1 rounded transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => { e.target.style.color = 'white' }}
            onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.4)' }}
          >
            <Calendar size={10} />
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptySlot({ day, onGenerate, isGenerating }) {
  return (
    <button
      onClick={() => onGenerate(day)}
      className="w-full rounded-xl border flex flex-col items-center justify-center py-4 gap-1.5 transition-all duration-150"
      style={{
        borderStyle: 'dashed',
        borderColor: 'rgba(255,255,255,0.05)',
        background: 'transparent',
        minHeight: '72px',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'transparent' }}
    >
      {isGenerating ? (
        <RefreshCw size={14} className="text-white/30 animate-spin" />
      ) : (
        <>
          <Sparkles size={12} className="text-white/20" />
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>Generate post</span>
        </>
      )}
    </button>
  )
}

export default function ContentCalendar() {
  const { creatorData } = useForge()
  const [calendar, setCalendar] = useState(INITIAL_CALENDAR)
  const [copiedId, setCopiedId] = useState(null)
  const [regenerating, setRegenerating] = useState(false)
  const [generatingSlot, setGeneratingSlot] = useState(null)
  const [view, setView] = useState('week')
  const [activeGoal, setActiveGoal] = useState('launch')
  const [week, setWeek] = useState(0)

  const goals = ['launch', 'growth', 'engagement', 'community']

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSchedule = (id) => {
    setCalendar(prev => prev.map(day => ({
      ...day,
      posts: day.posts.map(p => p.id === id ? { ...p, status: 'scheduled' } : p),
    })))
  }

  const handleRegenerateWeek = () => {
    setRegenerating(true)
    setTimeout(() => setRegenerating(false), 1600)
  }

  const handleGenerateSlot = (day) => {
    setGeneratingSlot(day)
    const newPost = {
      id: Date.now(),
      platform: ['Instagram', 'Twitter', 'YouTube'][Math.floor(Math.random() * 3)],
      type: ['Post', 'Reel', 'Story'][Math.floor(Math.random() * 3)],
      title: 'Forge-generated post for ' + day,
      theme: goals[Math.floor(Math.random() * 2)] === 'launch' ? 'launch' : 'value',
      status: 'draft',
    }
    setTimeout(() => {
      setCalendar(prev => prev.map(d =>
        d.day === day ? { ...d, posts: [...d.posts, newPost] } : d
      ))
      setGeneratingSlot(null)
    }, 1200)
  }

  const totalPosts = calendar.reduce((s, d) => s + d.posts.length, 0)
  const scheduled = calendar.reduce((s, d) => s + d.posts.filter(p => p.status === 'scheduled').length, 0)
  const drafts = calendar.reduce((s, d) => s + d.posts.filter(p => p.status === 'draft').length, 0)

  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="forge-label mb-3">Content Calendar</p>
          <h2 className="forge-heading mb-1.5" style={{ fontSize: 'clamp(22px, 3vw, 30px)', letterSpacing: '-0.03em' }}>
            This week's content plan
          </h2>
          <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Forge built a full week around your launch goal. Click any slot to edit.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleRegenerateWeek}
            disabled={regenerating}
            className="forge-btn-secondary text-[13px] py-2.5 gap-2"
          >
            <RefreshCw size={13} className={regenerating ? 'animate-spin' : ''} />
            Regenerate
          </button>
          <button className="forge-btn-primary text-[13px] py-2.5 gap-2">
            <Plus size={13} />
            Add post
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        {/* Goal remix */}
        <div className="flex items-center gap-2">
          <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Goal:</span>
          <div className="flex gap-1">
            {goals.map(g => (
              <button key={g} onClick={() => setActiveGoal(g)}
                className="text-[11px] px-3 py-1 rounded-full capitalize transition-all duration-150"
                style={{
                  background: activeGoal === g ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
                  color: activeGoal === g ? 'white' : 'rgba(255,255,255,0.4)',
                  border: '1px solid',
                  borderColor: activeGoal === g ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Week nav */}
        <div className="flex items-center gap-2">
          <button onClick={() => setWeek(w => w - 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>
            <ChevronLeft size={13} />
          </button>
          <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {week === 0 ? 'This week' : week > 0 ? `+${week}w` : `${week}w`}
          </span>
          <button onClick={() => setWeek(w => w + 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Theme legend */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>Themes:</span>
        {Object.entries(THEMES).map(([key, t]) => (
          <div key={key} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: t.color, opacity: 0.6 }} />
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{t.label}</span>
          </div>
        ))}
      </div>

      {/* 7-day grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {DAYS.map((day, i) => (
          <div key={day} className="pb-2 border-b text-center" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <span className="text-[12px] font-semibold" style={{ color: i === 0 ? 'white' : 'rgba(255,255,255,0.3)' }}>{day}</span>
          </div>
        ))}

        {/* Day cells */}
        {calendar.map((dayData, dayIdx) => (
          <div key={dayData.day} className="space-y-2 pt-2">
            {dayData.posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onCopy={handleCopy}
                onSchedule={handleSchedule}
                copiedId={copiedId}
              />
            ))}
            <EmptySlot
              day={dayData.day}
              onGenerate={handleGenerateSlot}
              isGenerating={generatingSlot === dayData.day}
            />
          </div>
        ))}
      </div>

      {/* Stats bar */}
      <div className="mt-6 flex items-center gap-6 p-4 rounded-xl border" style={{ background: '#111', borderColor: 'rgba(255,255,255,0.07)' }}>
        {[
          { label: 'Total posts', value: totalPosts },
          { label: 'Scheduled', value: scheduled },
          { label: 'Drafts', value: drafts },
          { label: 'Posted', value: calendar.reduce((s, d) => s + d.posts.filter(p => p.status === 'posted').length, 0) },
        ].map(stat => (
          <div key={stat.label} className="flex items-center gap-2">
            <span className="text-[18px] font-semibold text-white">{stat.value}</span>
            <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{stat.label}</span>
          </div>
        ))}
        <div className="ml-auto">
          <button className="forge-btn-primary text-[12px] py-2 px-4 gap-1.5">
            <Calendar size={11} />
            Schedule all drafts
          </button>
        </div>
      </div>
    </div>
  )
}
