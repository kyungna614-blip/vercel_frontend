import { useState, useEffect, useCallback } from 'react'
import { useForge } from '../../App'
import {
  Search, ArrowRight, ArrowLeft, Loader2, Users, Mail, Sparkles,
  ChevronRight, Check, Zap, Youtube, BarChart2, Clock, Send,
  Database, Activity, AlertTriangle, RefreshCw, Eye
} from 'lucide-react'
import WingLogo from '../ui/WingLogo'

const API = import.meta.env.VITE_API_URL || ''

const NICHE_PRESETS = [
  { label: 'Tech Reviews', value: 'tech reviews', emoji: '💻' },
  { label: 'Fitness', value: 'fitness workout', emoji: '💪' },
  { label: 'Cooking', value: 'cooking recipes', emoji: '🍳' },
  { label: 'Finance', value: 'finance investing', emoji: '📈' },
  { label: 'Gaming', value: 'gaming', emoji: '🎮' },
  { label: 'Education', value: 'education tutorial', emoji: '📚' },
  { label: 'Beauty', value: 'beauty makeup', emoji: '💄' },
  { label: 'Business', value: 'business marketing', emoji: '🚀' },
]

const TABS = [
  { id: 'pipeline', label: 'Run Pipeline', icon: Zap },
  { id: 'history', label: 'Run History', icon: Clock },
  { id: 'creators', label: 'Creators', icon: Users },
  { id: 'emails', label: 'Email Tracker', icon: Mail },
  { id: 'scrapes', label: 'Scrape Logs', icon: Database },
]

const STATUS_COLORS = {
  completed: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', border: 'rgba(34,197,94,0.2)' },
  sent:      { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', border: 'rgba(34,197,94,0.2)' },
  running:   { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6', border: 'rgba(59,130,246,0.2)' },
  failed:    { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', border: 'rgba(239,68,68,0.2)' },
  bounced:   { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', border: 'rgba(239,68,68,0.2)' },
  skipped:   { bg: 'rgba(255,255,255,0.05)', text: '#888', border: 'rgba(255,255,255,0.1)' },
  pending:   { bg: 'rgba(255,255,255,0.05)', text: '#888', border: 'rgba(255,255,255,0.1)' },
  queued:    { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
}

function Badge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.pending
  return (
    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}>{status}</span>
  )
}

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="rounded-xl border p-4" style={{ background: '#111', borderColor: accent ? 'rgba(192,57,43,0.2)' : 'rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-white/35 uppercase tracking-wider font-bold">{label}</span>
        <Icon size={13} className="text-white/20" />
      </div>
      <p className="text-[26px] font-extrabold text-white tracking-tight">{value}</p>
    </div>
  )
}

export default function NicheDiscovery() {
  const { updateCreator, goTo } = useForge()
  const [tab, setTab] = useState('pipeline')
  const [keyword, setKeyword] = useState('')
  const [limit, setLimit] = useState(5)
  const [autoOutreach, setAutoOutreach] = useState(false)
  const [running, setRunning] = useState(false)
  const [pipelineResult, setPipelineResult] = useState(null)
  const [error, setError] = useState(null)

  // Admin data
  const [stats, setStats] = useState(null)
  const [runs, setRuns] = useState([])
  const [creators, setCreators] = useState([])
  const [emailLogs, setEmailLogs] = useState([])
  const [scrapeLogs, setScrapeLogs] = useState([])
  const [expandedRun, setExpandedRun] = useState(null)

  const loadStats = useCallback(async () => {
    try {
      const [s, r, c, e, sc] = await Promise.all([
        fetch(`${API}/api/admin/stats`).then(r => r.json()),
        fetch(`${API}/api/admin/pipeline-runs`).then(r => r.json()),
        fetch(`${API}/api/admin/creators`).then(r => r.json()),
        fetch(`${API}/api/admin/email-tracker`).then(r => r.json()),
        fetch(`${API}/api/admin/scrape-logs`).then(r => r.json()),
      ])
      setStats(s); setRuns(r); setCreators(c); setEmailLogs(e); setScrapeLogs(sc)
    } catch {}
  }, [])

  useEffect(() => { loadStats() }, [loadStats, tab])

  const runPipeline = async () => {
    if (!keyword.trim()) return
    setRunning(true); setError(null); setPipelineResult(null)
    try {
      const res = await fetch(`${API}/api/cofounder/pipeline/discover`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: keyword.trim(), max_results: limit, auto_generate_ideas: true, auto_send_outreach: autoOutreach }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setPipelineResult(data)
      loadStats()
    } catch (err) { setError(err.message) }
    finally { setRunning(false) }
  }

  const selectCreator = (c) => {
    updateCreator({ id: c.id, handle: c.handle || c.display_name, platform: 'youtube', name: c.display_name, followers: c.follower_count || c.followers, avatarUrl: c.avatar_url, niche: Array.isArray(c.niche) ? c.niche.join(', ') : '', email: c.email })
    goTo('blueprint')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#060407' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <button onClick={() => goTo('welcome')} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors mr-1">
            <ArrowLeft size={16} className="text-white/40" />
          </button>
          <WingLogo size={22} />
          <span className="text-white font-semibold text-[14px]">Creator Forge</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-bold ml-2" style={{ background: 'rgba(192,57,43,0.15)', color: '#e87070' }}>Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-green-400" />
          <span className="text-[11px] text-white/40">Pipeline Active</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar tabs */}
        <div className="w-48 border-r py-4 flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition-all"
              style={{ background: tab === t.id ? 'rgba(255,255,255,0.06)' : 'transparent', color: tab === t.id ? 'white' : 'rgba(255,255,255,0.4)', borderLeft: tab === t.id ? '2px solid #e87070' : '2px solid transparent' }}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats bar */}
          {stats && (
            <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
              <StatCard label="Runs" value={stats.total_pipeline_runs} icon={Zap} />
              <StatCard label="Creators" value={stats.total_creators} icon={Users} />
              <StatCard label="Emails Found" value={stats.total_with_email} icon={Mail} />
              <StatCard label="Ideas" value={stats.total_ideas} icon={Sparkles} />
              <StatCard label="Sent" value={stats.total_emails_sent} icon={Send} accent />
              <StatCard label="Failed" value={stats.total_emails_failed} icon={AlertTriangle} />
              <StatCard label="Scrapes" value={stats.total_scrapes} icon={Database} />
              <StatCard label="Outreach" value={stats.total_outreach} icon={BarChart2} />
            </div>
          )}

          {/* ═══ PIPELINE TAB ═══ */}
          {tab === 'pipeline' && (
            <div className="max-w-2xl">
              <h2 className="text-[20px] font-extrabold text-white mb-1 tracking-tight">Run Discovery Pipeline</h2>
              <p className="text-[13px] text-white/40 mb-6">YouTube search + Apify email scrape + AI ideas + outreach</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {NICHE_PRESETS.map(n => (
                  <button key={n.value} onClick={() => setKeyword(n.value)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] transition-all border"
                    style={{ background: keyword === n.value ? 'rgba(192,57,43,0.12)' : '#111', borderColor: keyword === n.value ? 'rgba(192,57,43,0.3)' : 'rgba(255,255,255,0.06)', color: keyword === n.value ? '#e87070' : 'rgba(255,255,255,0.5)' }}>
                    <span>{n.emoji}</span> {n.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mb-3">
                <div className="flex-1 flex items-center gap-3 rounded-xl border px-4 py-3" style={{ background: '#111', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <Search size={15} className="text-white/30" />
                  <input className="flex-1 bg-transparent text-white text-[14px] outline-none placeholder-white/25"
                    placeholder="Niche keyword..." value={keyword} onChange={e => setKeyword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && runPipeline()} disabled={running} />
                </div>
                <div className="flex items-center gap-2 rounded-xl border px-3" style={{ background: '#111', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <span className="text-[11px] text-white/30">Limit</span>
                  <select value={limit} onChange={e => setLimit(+e.target.value)} className="bg-transparent text-white text-[13px] outline-none font-bold" disabled={running}>
                    {[3,5,10,15,20].map(n => <option key={n} value={n} className="bg-black">{n}</option>)}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input type="checkbox" checked={autoOutreach} onChange={e => setAutoOutreach(e.target.checked)}
                  className="rounded" disabled={running} />
                <span className="text-[12px] text-white/50">Auto-send outreach emails to creators with emails</span>
              </label>

              <button onClick={runPipeline} disabled={running || !keyword.trim()}
                className="w-full flex items-center justify-center gap-2 text-[14px] font-bold py-3.5 rounded-xl transition-all disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #c0392b, #a93226)', color: 'white' }}>
                {running ? <><Loader2 size={15} className="animate-spin" /> Running...</> : <><Sparkles size={15} /> Run Pipeline</>}
              </button>

              {error && <div className="mt-4 p-3 rounded-xl bg-red-950/30 border border-red-900/40 text-red-400 text-[12px]">{error}</div>}

              {/* Pipeline results */}
              {pipelineResult && !running && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Check size={14} className="text-green-400" />
                    <span className="text-[13px] font-bold text-green-400">Pipeline complete</span>
                    <span className="text-[11px] text-white/30 ml-2">Run: {pipelineResult.run_id?.slice(0,8)}</span>
                  </div>

                  {(pipelineResult.step1_discovered || []).map(c => (
                    <div key={c.id} onClick={() => selectCreator(c)}
                      className="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:border-red-900/40 hover:bg-white/[0.02]"
                      style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 flex items-center justify-center flex-shrink-0">
                        {c.avatar_url ? <img src={c.avatar_url} className="w-full h-full object-cover" /> : <span className="text-white/30 font-bold">{(c.display_name||'?')[0]}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-white truncate">{c.display_name}</span>
                          <Youtube size={11} className="text-red-500" />
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-white/35">
                          <span>{(c.followers||0).toLocaleString()} subs</span>
                          {c.email && <span className="flex items-center gap-1"><Mail size={9} className="text-green-400" />{c.email}</span>}
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-white/20" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ HISTORY TAB ═══ */}
          {tab === 'history' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-extrabold text-white">Pipeline Run History</h2>
                <button onClick={loadStats} className="text-[11px] text-white/30 flex items-center gap-1 hover:text-white/60"><RefreshCw size={11} /> Refresh</button>
              </div>
              {runs.length === 0 ? <p className="text-[13px] text-white/30">No pipeline runs yet.</p> : (
                <div className="space-y-2">
                  {runs.map(run => (
                    <div key={run.id} className="rounded-xl border overflow-hidden" style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02]" onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}>
                        <Badge status={run.status} />
                        <span className="text-[13px] font-bold text-white flex-1">"{run.keyword}"</span>
                        <span className="text-[11px] text-white/30">{run.creators_found} found</span>
                        <span className="text-[11px] text-white/30">{run.emails_found} emails</span>
                        <span className="text-[11px] text-white/30">{run.ideas_generated || 0} ideas</span>
                        <span className="text-[11px] text-white/20">{run.duration_ms ? `${(run.duration_ms/1000).toFixed(1)}s` : ''}</span>
                        <span className="text-[10px] text-white/20">{run.started_at?.split('T')[0]}</span>
                        <ChevronRight size={12} className="text-white/20" style={{ transform: expandedRun === run.id ? 'rotate(90deg)' : '', transition: '0.2s' }} />
                      </div>
                      {expandedRun === run.id && (
                        <div className="border-t px-4 py-3 space-y-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                          {run.steps?.map((s,i) => (
                            <div key={i} className="flex items-center gap-3 text-[12px]">
                              <Badge status={s.status} />
                              <span className="text-white/60 font-mono">{s.step_name}</span>
                              <span className="text-white/25 flex-1">{JSON.stringify(s.detail)}</span>
                            </div>
                          ))}
                          {run.errors?.length > 0 && <div className="text-[11px] text-red-400/70 mt-2">{run.errors.join('; ')}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ CREATORS TAB ═══ */}
          {tab === 'creators' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-extrabold text-white">All Creators ({creators.length})</h2>
                <button onClick={loadStats} className="text-[11px] text-white/30 flex items-center gap-1 hover:text-white/60"><RefreshCw size={11} /> Refresh</button>
              </div>
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <table className="w-full text-[12px]">
                  <thead><tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <th className="text-left px-4 py-2.5 text-white/30 font-bold uppercase text-[10px]">Creator</th>
                    <th className="text-left px-3 py-2.5 text-white/30 font-bold uppercase text-[10px]">Subs</th>
                    <th className="text-left px-3 py-2.5 text-white/30 font-bold uppercase text-[10px]">Email</th>
                    <th className="text-left px-3 py-2.5 text-white/30 font-bold uppercase text-[10px]">Status</th>
                    <th className="text-left px-3 py-2.5 text-white/30 font-bold uppercase text-[10px]">Source</th>
                    <th className="px-3 py-2.5"></th>
                  </tr></thead>
                  <tbody>
                    {creators.map(c => (
                      <tr key={c.id} className="border-t hover:bg-white/[0.02] transition-colors" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-white/5 overflow-hidden flex items-center justify-center">
                              {c.avatar_url ? <img src={c.avatar_url} className="w-full h-full object-cover" /> : <span className="text-[10px] text-white/30">{(c.display_name||'?')[0]}</span>}
                            </div>
                            <div>
                              <p className="font-bold text-white text-[12px]">{c.display_name}</p>
                              <p className="text-white/25 text-[10px]">@{c.handle}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-white/50">{(c.follower_count||0).toLocaleString()}</td>
                        <td className="px-3 py-3 text-white/50 font-mono text-[11px]">{c.email || <span className="text-white/15">none</span>}</td>
                        <td className="px-3 py-3"><Badge status={c.outreach_status} /></td>
                        <td className="px-3 py-3 text-white/25 text-[10px]">{c.discovery_source || '-'}</td>
                        <td className="px-3 py-3">
                          <button onClick={() => selectCreator(c)} className="text-[10px] text-white/30 hover:text-white px-2 py-1 rounded border border-transparent hover:border-white/10 transition-all">
                            View →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══ EMAIL TRACKER TAB ═══ */}
          {tab === 'emails' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-extrabold text-white">Email Tracker ({emailLogs.length})</h2>
                <button onClick={loadStats} className="text-[11px] text-white/30 flex items-center gap-1 hover:text-white/60"><RefreshCw size={11} /> Refresh</button>
              </div>
              {emailLogs.length === 0 ? <p className="text-[13px] text-white/30">No emails tracked yet. Run a pipeline with auto-outreach enabled.</p> : (
                <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <table className="w-full text-[12px]">
                    <thead><tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <th className="text-left px-4 py-2.5 text-white/30 font-bold uppercase text-[10px]">Creator</th>
                      <th className="text-left px-3 py-2.5 text-white/30 font-bold uppercase text-[10px]">To</th>
                      <th className="text-left px-3 py-2.5 text-white/30 font-bold uppercase text-[10px]">Subject</th>
                      <th className="text-left px-3 py-2.5 text-white/30 font-bold uppercase text-[10px]">Status</th>
                      <th className="text-left px-3 py-2.5 text-white/30 font-bold uppercase text-[10px]">Sent</th>
                    </tr></thead>
                    <tbody>
                      {emailLogs.map(e => (
                        <tr key={e.id} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                          <td className="px-4 py-3 text-white font-medium">{e.creator_name || '-'}</td>
                          <td className="px-3 py-3 text-white/50 font-mono text-[11px]">{e.to_email}</td>
                          <td className="px-3 py-3 text-white/40 truncate max-w-[200px]">{e.subject || '-'}</td>
                          <td className="px-3 py-3"><Badge status={e.status} /></td>
                          <td className="px-3 py-3 text-white/25 text-[10px]">{e.sent_at?.split('T')[0] || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ═══ SCRAPE LOGS TAB ═══ */}
          {tab === 'scrapes' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-extrabold text-white">Scrape Logs ({scrapeLogs.length})</h2>
                <button onClick={loadStats} className="text-[11px] text-white/30 flex items-center gap-1 hover:text-white/60"><RefreshCw size={11} /> Refresh</button>
              </div>
              {scrapeLogs.length === 0 ? <p className="text-[13px] text-white/30">No scrapes logged yet.</p> : (
                <div className="space-y-2">
                  {scrapeLogs.map(l => (
                    <div key={l.id} className="flex items-center gap-4 p-4 rounded-xl border" style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
                      <Badge status={l.status} />
                      <span className="text-[12px] font-mono text-white/60 w-28">{l.source}</span>
                      <span className="text-[12px] text-white/40 flex-1">"{l.keyword}"</span>
                      <span className="text-[12px] text-white/50 font-bold">{l.results_count} results</span>
                      <span className="text-[11px] text-white/25">{l.duration_ms ? `${l.duration_ms}ms` : ''}</span>
                      <span className="text-[10px] text-white/20">{l.created_at?.split('T')[0]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
