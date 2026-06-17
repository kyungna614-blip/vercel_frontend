import { useState, useEffect } from 'react'
import { useForge, getAccent } from '../../App'
import {
  Youtube, Instagram, Twitter, Globe, Search, Plus, Trash2, Mail, ExternalLink,
  CheckCircle, ArrowRight, Loader2, BarChart2, ShieldAlert, Sparkles
} from 'lucide-react'

const PLATFORM_INFOS = {
  youtube: {
    label: 'YouTube',
    icon: Youtube,
    color: '#ff3b30',
    placeholder: 'e.g. @mkbhd or channel URL',
    btnLabel: 'Scrape Channel'
  },
  instagram: {
    label: 'Instagram',
    icon: Instagram,
    color: '#e1306c',
    placeholder: 'e.g. @natgeo or profile URL',
    btnLabel: 'Scrape Profile'
  },
  tiktok: {
    label: 'TikTok',
    icon: Globe,
    color: '#00c8c8',
    placeholder: 'e.g. @khaby.lame or profile URL',
    btnLabel: 'Scrape Profile'
  },
  twitter: {
    label: 'X / Twitter',
    icon: Twitter,
    color: '#60a5fa',
    placeholder: 'e.g. @lexfridman or profile URL',
    btnLabel: 'Scrape Profile'
  }
}

export default function PlatformLeads({ platform }) {
  const { updateCreator, goTo } = useForge()
  const info = PLATFORM_INFOS[platform] || PLATFORM_INFOS.youtube
  const PlatformIcon = info.icon

  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Scraper inputs
  const [handleInput, setHandleInput] = useState('')
  const [scraping, setScraping] = useState(false)
  const [scrapeError, setScrapeError] = useState(null)

  const fetchLeads = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/cofounder/creators?platform=${platform}`)
      if (!res.ok) throw new Error(`Failed to load ${info.label} leads`)
      const data = await res.json()
      setLeads(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [platform])

  const handleScrape = async (e) => {
    e.preventDefault()
    if (!handleInput.trim()) return
    setScraping(true)
    setScrapeError(null)
    try {
      const res = await fetch('/api/cofounder/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: handleInput.trim(), platform })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Scraping failed')
      }
      setHandleInput('')
      await fetchLeads()
    } catch (err) {
      setScrapeError(err.message)
    } finally {
      setScraping(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this lead?')) return
    try {
      const res = await fetch(`/api/cofounder/creators/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to delete lead')
      setLeads(prev => prev.filter(lead => lead.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleSelectCreator = (lead) => {
    updateCreator({
      id: lead.id,
      handle: lead.handle,
      platform: lead.platform,
      name: lead.display_name,
      followers: lead.follower_count,
      avatar: lead.avatar_url,
      niche: Array.isArray(lead.niche) ? lead.niche.join(', ') : lead.niche || '',
      email: lead.email,
      status: lead.status
    })

    if (lead.status === 'approved') {
      // Already selected product, go to dashboard
      goTo('dashboard')
    } else {
      // Need to select product idea first, go to blueprint
      goTo('blueprint')
    }
  }

  const formatFollowers = (num) => {
    if (!num) return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  // Stats
  const totalLeads = leads.length
  const emailedLeads = leads.filter(l => l.outreach_status !== 'pending').length
  const repliedLeads = leads.filter(l => l.outreach_status === 'replied').length
  const totalFollowers = leads.reduce((acc, curr) => acc + (curr.follower_count || 0), 0)
  const avgFollowers = totalLeads ? Math.round(totalFollowers / totalLeads) : 0

  const getStatusColor = (status) => {
    switch (status) {
      case 'replied': return { bg: 'rgba(50,220,100,0.12)', text: '#4ade80', label: 'Replied' }
      case 'followed-up': return { bg: 'rgba(255,180,0,0.12)', text: '#facc15', label: 'Followed Up' }
      case 'emailed': return { bg: 'rgba(96,165,250,0.12)', text: '#60a5fa', label: 'Emailed' }
      default: return { bg: 'rgba(255,255,255,0.06)', text: 'rgba(255,255,255,0.5)', label: 'Pending' }
    }
  }

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto overflow-y-auto h-full pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${info.color}20`, color: info.color }}>
              <PlatformIcon size={16} />
            </div>
            <p className="forge-label uppercase tracking-widest">{info.label} Database</p>
          </div>
          <h2 className="forge-heading mb-1" style={{ fontSize: 'clamp(22px, 3vw, 28px)', letterSpacing: '-0.025em' }}>
            Lead Pipeline Management
          </h2>
          <p className="text-[13px] text-white/40">
            Scrape new creators from {info.label}, generate custom pitch ideas, and launch co-founder campaigns.
          </p>
        </div>

        {/* Scrape Input Form */}
        <form onSubmit={handleScrape} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
          <div className="flex-1 relative flex items-center">
            <Search size={14} className="absolute left-3.5 text-white/30" />
            <input
              type="text"
              placeholder={info.placeholder}
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              disabled={scraping}
              className="w-full bg-[#121212] border border-white/8 text-[13px] rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={scraping || !handleInput.trim()}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(135deg, ${info.color}, ${info.color}cc)`,
              color: 'white',
              boxShadow: `0 2px 14px ${info.color}33`,
            }}
          >
            {scraping ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Scraping...
              </>
            ) : (
              <>
                <Plus size={14} />
                {info.btnLabel}
              </>
            )}
          </button>
        </form>
      </div>

      {scrapeError && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl border border-red-950 bg-red-950/20 text-red-400 text-[12px]">
          <ShieldAlert size={14} className="flex-shrink-0" />
          <span>{scrapeError}</span>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', val: totalLeads, desc: 'Scraped profiles' },
          { label: 'Outreach Dispatched', val: emailedLeads, desc: `${totalLeads ? Math.round(emailedLeads/totalLeads*100) : 0}% of list` },
          { label: 'Replies Received', val: repliedLeads, desc: `${emailedLeads ? Math.round(repliedLeads/emailedLeads*100) : 0}% reply rate` },
          { label: 'Avg Followers', val: formatFollowers(avgFollowers), desc: `${info.label} followers` },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <p className="text-[11px] font-bold text-white/35 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-[20px] font-extrabold text-white mb-0.5 tracking-tight">{stat.val}</p>
            <p className="text-[10px] text-white/25">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Datagrid Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: '#0e0e0e', borderColor: 'rgba(255,255,255,0.07)' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={24} className="animate-spin text-white/35" />
            <p className="text-[13px] text-white/40">Loading platform records...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-400">
            <ShieldAlert size={28} />
            <p className="text-[13px]">{error}</p>
            <button onClick={fetchLeads} className="forge-btn-secondary text-[12px] py-1.5 px-3">Retry</button>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 text-white/20">
              <PlatformIcon size={22} />
            </div>
            <div>
              <p className="text-[14px] font-bold text-white/80">No {info.label} Leads Found</p>
              <p className="text-[12px] text-white/35 max-w-sm mt-1 mx-auto">
                Paste a link to a profile or channel above to scrape details and populate your custom outbound campaign.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                  <th className="px-5 py-4 text-[11px] font-bold text-white/40 uppercase tracking-widest">Creator</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-white/40 uppercase tracking-widest">Audience</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-white/40 uppercase tracking-widest">Niche & Focus</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-white/40 uppercase tracking-widest">Business Contact</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-white/40 uppercase tracking-widest">Outreach</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-white/40 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => {
                  const status = getStatusColor(lead.outreach_status)
                  const niches = Array.isArray(lead.niche) ? lead.niche : [lead.niche || 'Lifestyle']

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => handleSelectCreator(lead)}
                      className="border-b hover:bg-white/[0.02] cursor-pointer transition-colors duration-150"
                      style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                    >
                      {/* Profile info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden border flex-shrink-0 flex items-center justify-center font-bold text-[13px]"
                            style={{ background: '#1c1c1c', borderColor: 'rgba(255,255,255,0.1)' }}>
                            {lead.avatar_url ? (
                              <img src={lead.avatar_url} alt={lead.display_name} className="w-full h-full object-cover" />
                            ) : (
                              lead.display_name.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-bold text-white truncate max-w-[150px]">{lead.display_name}</div>
                            <div className="text-[11px] text-white/35 truncate max-w-[130px] flex items-center gap-1">
                              {lead.handle}
                              {lead.profile_url && (
                                <a href={lead.profile_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-white/20 hover:text-white/45">
                                  <ExternalLink size={10} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Audience */}
                      <td className="px-5 py-4">
                        <div className="text-[13px] font-semibold text-white">
                          {formatFollowers(lead.follower_count)}
                        </div>
                        {lead.platform_details?.engagement_rate && (
                          <div className="text-[10px]" style={{ color: info.color }}>
                            {lead.platform_details.engagement_rate}% engagement
                          </div>
                        )}
                      </td>

                      {/* Niche */}
                      <td className="px-5 py-4">
                        <div className="flex gap-1 flex-wrap max-w-[180px]">
                          {niches.map((n, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
                              {n}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Contact Email */}
                      <td className="px-5 py-4">
                        {lead.email ? (
                          <span className="text-[12px] font-medium text-white/75 flex items-center gap-1.5">
                            <Mail size={12} className="text-white/30" />
                            {lead.email}
                          </span>
                        ) : (
                          <span className="text-[11px] text-white/20 italic">No public email</span>
                        )}
                      </td>

                      {/* Status Pipeline */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                          style={{ background: status.bg, color: status.text }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.text }} />
                          {status.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title="Launch cofounder onboarding wizard"
                            onClick={(e) => { e.stopPropagation(); handleSelectCreator(lead) }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-white/50 hover:text-white transition-colors"
                          >
                            <Sparkles size={14} />
                          </button>
                          <button
                            title="Delete lead from list"
                            onClick={(e) => handleDelete(lead.id, e)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
