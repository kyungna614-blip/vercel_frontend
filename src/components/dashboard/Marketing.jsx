import { useState, useEffect } from 'react'
import { useForge, getAccent } from '../../App'
import {
  Sparkles, Mail, Video, Share2, Users,
  RefreshCw, Copy, Check, X, Calendar, ChevronRight,
  AlertCircle, MessageSquare, Send, ArrowRight, Play, CheckCircle
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL || ''

// Pixel art coach component
function PixelCoach({ message, onChat }) {
  const [displayText, setDisplayText] = useState('')
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    setDisplayText('')
    setCharIdx(0)
  }, [message])

  useEffect(() => {
    if (charIdx >= message.length) return
    const t = setTimeout(() => {
      setDisplayText(prev => prev + message[charIdx])
      setCharIdx(i => i + 1)
    }, 12)
    return () => clearTimeout(t)
  }, [charIdx, message])

  return (
    <div className="flex items-end gap-3">
      <div className="flex-shrink-0" style={{ width: 44, height: 44 }}>
        <svg viewBox="0 0 16 16" width="44" height="44" style={{ imageRendering: 'pixelated' }}>
          <rect x="4" y="1" width="8" height="2" fill="#f0d0a0"/>
          <rect x="3" y="2" width="1" height="2" fill="#f0d0a0"/>
          <rect x="12" y="2" width="1" height="2" fill="#f0d0a0"/>
          <rect x="4" y="3" width="8" height="5" fill="#fde8c8"/>
          <rect x="5" y="5" width="2" height="2" fill="#2a2a2a"/>
          <rect x="9" y="5" width="2" height="2" fill="#2a2a2a"/>
          <rect x="5" y="5" width="1" height="1" fill="white"/>
          <rect x="9" y="5" width="1" height="1" fill="white"/>
          <rect x="6" y="7" width="1" height="1" fill="#c0806a"/>
          <rect x="7" y="8" width="2" height="1" fill="#c0806a"/>
          <rect x="9" y="7" width="1" height="1" fill="#c0806a"/>
          <rect x="5" y="9" width="6" height="4" fill="white"/>
          <rect x="7" y="9" width="2" height="1" fill="#e0e0e0"/>
          <rect x="3" y="9" width="2" height="3" fill="white"/>
          <rect x="11" y="9" width="2" height="3" fill="white"/>
          <rect x="3" y="12" width="2" height="1" fill="#fde8c8"/>
          <rect x="11" y="12" width="2" height="1" fill="#fde8c8"/>
          <rect x="5" y="13" width="2" height="3" fill="#4a4a6a"/>
          <rect x="9" y="13" width="2" height="3" fill="#4a4a6a"/>
        </svg>
      </div>

      <div className="flex-1 relative">
        <div className="rounded-2xl rounded-bl-sm px-4 py-3 relative"
          style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {displayText}
            {charIdx < message.length && (
              <span className="cursor-blink text-white/40">|</span>
            )}
          </p>
        </div>
        <div className="absolute -left-2 bottom-3 w-0 h-0"
          style={{ borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: '8px solid #1a1a1a' }} />
      </div>
    </div>
  )
}

function OutputPanel({ title, body, platforms, onClose, onCopy, accent }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(body)
    setCopied(true)
    onCopy?.()
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl border overflow-hidden mt-3"
      style={{ background: '#111', borderColor: 'rgba(255,255,255,0.1)' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: accent.color }}>
            <Sparkles size={11} className="text-black" />
          </div>
          <span className="text-[14px] font-semibold text-white">{title}</span>
          <div className="flex gap-1 ml-1">
            {platforms.map(p => (
              <span key={p} className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
                {p}
              </span>
            ))}
          </div>
        </div>
        <button onClick={onClose} className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
          <X size={12} />
        </button>
      </div>

      <div className="p-5 max-h-80 overflow-y-auto">
        <pre className="text-[13px] whitespace-pre-wrap leading-[1.7]"
          style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'inherit' }}>
          {body}
        </pre>
      </div>

      <div className="flex items-center gap-2 px-5 py-3 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <button onClick={handleCopy} className="forge-btn-secondary text-[12px] py-2 px-4 gap-1.5">
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

export default function Marketing({ dashboardData, refetch }) {
  const { creatorData } = useForge()
  const accent = getAccent(creatorData.platform)

  const creator = dashboardData?.creator
  const selectedIdea = dashboardData?.selected_idea
  const suggestions = dashboardData?.marketing_suggestions
  const outreachLogs = dashboardData?.outreach_messages || []

  // Outreach statuses
  const rawStatus = creator?.outreach_status || 'pending'
  const workflowStatus = rawStatus === 'in_review' ? 'emailed' : rawStatus

  const [activeIdeaId, setActiveIdeaId] = useState('')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [draftSubject, setDraftSubject] = useState('')
  const [draftBody, setDraftBody] = useState('')
  const [loadingDraft, setLoadingDraft] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [runningDrip, setRunningDrip] = useState(false)
  const [openOutputId, setOpenOutputId] = useState(null)
  const [coachMsg, setCoachMsg] = useState("We should pitch this creator to join us as a co-founder! Let's draft a personalized cold email outreach.")

  useEffect(() => {
    if (workflowStatus === 'emailed') {
      setCoachMsg("Outreach email sent successfully! We will check for replies and follow up in a few days.")
    } else if (workflowStatus.startsWith('followed-up')) {
      setCoachMsg("Follow-up email dispatched! Maintaining the lead relationship sequence.")
    } else if (workflowStatus === 'replied') {
      setCoachMsg("Awesome news! The creator replied. We can check their response in the admin dashboard.")
    }
  }, [workflowStatus])

  // Draft cold outreach email
  const handleLoadDraft = async () => {
    if (!creator?.id) return
    setLoadingDraft(true)
    setShowEmailModal(true)
    try {
      const res = await fetch(`${API}/api/cofounder/creators/${creator.id}/outreach/generate?tone=friendly`, {
        method: 'POST'
      })
      if (!res.ok) throw new Error('Failed to generate draft')
      const data = await res.json()
      setDraftSubject(data.subject)
      setDraftBody(data.body)
    } catch (err) {
      console.error(err)
      setDraftSubject(`Partnership Opportunity: ${selectedIdea?.product_name || 'Co-founder concept'}`)
      setDraftBody(`Hi ${creator?.display_name || 'there'},\n\nHope you are doing well. I came across your content and would love to co-found a brand with you.\n\nBest,\nCreator Cofounder Team`)
    } finally {
      setLoadingDraft(false)
    }
  }

  // Send outreach email
  const handleSendEmail = async () => {
    if (!creator?.id) return
    setSendingEmail(true)
    try {
      const res = await fetch(`${API}/api/cofounder/creators/${creator.id}/outreach/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: draftSubject, body: draftBody })
      })
      if (!res.ok) throw new Error('Failed to send outreach')
      setShowEmailModal(false)
      refetch()
    } catch (err) {
      alert('Error sending email: ' + err.message)
    } finally {
      setSendingEmail(false)
    }
  }

  // Run Drip Check
  const handleTriggerDrip = async () => {
    setRunningDrip(true)
    try {
      const res = await fetch('/api/cofounder/outreach/drip', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to process drip sequence')
      const data = await res.json()
      alert(`Drip scan processed. Sent ${data.sent_count} follow-up email(s).`)
      refetch()
    } catch (err) {
      alert('Error processing drip sequence: ' + err.message)
    } finally {
      setRunningDrip(false)
    }
  }

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto text-white">
      {/* ─── CREATOR PROFILE CARD ────────────────────────────────── */}
      <div className="rounded-2xl border p-5 relative overflow-hidden"
        style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 flex items-center justify-center"
            style={{ borderColor: `rgba(${accent.rgb},0.4)`, background: `rgba(${accent.rgb},0.15)` }}>
            {creator?.avatar_url ? (
              <img src={creator.avatar_url} alt={creator.display_name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-white/60">
                {(creator?.display_name || 'C').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold">{creator?.display_name || 'Creator'}</h3>
            <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {creator?.handle} · {creator?.platform}
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {creator?.niche?.join(', ')}
            </p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-lg font-bold">{(creator?.follower_count || 0).toLocaleString()}</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>followers</p>
            </div>
            {creator?.email && (
              <div>
                <p className="text-sm font-mono text-white/70">{creator.email}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>scraped email</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── OUTREACH LEAD STATUS TRACKING pipeline ──────────────── */}
      <section className="rounded-2xl border p-6 space-y-6"
        style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Lead Outreach Pipeline</p>
          <div className="flex gap-2">
            <button
              onClick={handleTriggerDrip}
              disabled={runningDrip}
              className="text-xs px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {runningDrip ? 'Checking...' : 'Check Drip (Step 2 & 3)'}
            </button>
          </div>
        </div>

        {/* Mapped Timeline */}
        <div className="grid grid-cols-4 gap-2 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
          
          {[
            { id: 'discovered', label: '1. Discovered', color: '#6b7280', active: workflowStatus === 'discovered' || workflowStatus === 'pending' },
            { id: 'emailed', label: '2. Cold Pitch', color: '#3b82f6', active: workflowStatus === 'emailed' || workflowStatus === 'in_review' },
            { id: 'followed-up', label: '3. Followed Up', color: '#f59e0b', active: workflowStatus.startsWith('followed-up') },
            { id: 'replied', label: '4. Replied', color: '#10b981', active: workflowStatus === 'replied' }
          ].map((step, idx) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                style={{
                  background: step.active ? step.color : '#161616',
                  borderColor: step.active ? 'white' : 'rgba(255,255,255,0.1)'
                }}
              >
                {step.active ? (
                  <Check size={14} className="text-white" strokeWidth={3} />
                ) : (
                  <span className="text-xs text-white/40">{idx + 1}</span>
                )}
              </div>
              <span className="text-[11px] font-semibold mt-2"
                style={{ color: step.active ? 'white' : 'rgba(255,255,255,0.3)' }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Outreach Details */}
        <div className="rounded-xl p-4 bg-white/5 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold">Current Status: <span className="capitalize text-white/80">{workflowStatus}</span></h4>
            {(workflowStatus === 'discovered' || workflowStatus === 'pending') && (
              <button onClick={handleLoadDraft} className="forge-btn-primary text-xs py-1.5 px-3">
                Send Cold Pitch Email
              </button>
            )}
          </div>

          {/* Email Logs history */}
          {outreachLogs.length > 0 ? (
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">Email Thread History</p>
              {outreachLogs.map(log => (
                <div key={log.id} className="rounded-lg p-3 border space-y-1 bg-black/20"
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-white/60">Subject: {log.subject}</span>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded"
                      style={{
                        background: log.status === 'sent' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: log.status === 'sent' ? '#10b981' : '#ef4444'
                      }}>
                      {log.status}
                    </span>
                  </div>
                  <pre className="text-[11px] leading-relaxed text-white/40 whitespace-pre-wrap font-sans mt-2">
                    {log.body}
                  </pre>
                  {log.sent_at && (
                    <p className="text-[9px] text-white/20 mt-1">Sent at: {new Date(log.sent_at).toLocaleString()}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/30">No outreach emails have been sent to this creator yet.</p>
          )}
        </div>
      </section>

      {/* ─── FORGE COACH BUBBLE ───────────────────────────────────── */}
      <PixelCoach message={coachMsg} />

      {/* ─── SOCIAL MEDIA MARKETING SUGGESTIONS ───────────────────── */}
      {selectedIdea ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">AI Marketing Content Generator</p>
            <span className="text-xs text-white/30">Edit assets before posting</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { id: 'teaser', label: '1. Launch Teaser Post', desc: 'Prime your followers 72h early', icon: Share2, plat: ['Instagram', 'TikTok'] },
              { id: 'email', label: '2. Launch Email Announcement', desc: 'Direct audience converted launch', icon: Mail, plat: ['Email List'] },
              { id: 'bts', label: '3. Behind the Scenes Post', desc: 'Aesthetic building updates', icon: Video, plat: ['IG Stories', 'X'] }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => openOutputId === item.id ? setOpenOutputId(null) : setOpenOutputId(item.id)}
                className="text-left p-4 rounded-xl border transition-all hover:bg-white/5"
                style={{
                  background: openOutputId === item.id ? 'rgba(255,255,255,0.06)' : '#111',
                  borderColor: openOutputId === item.id ? `rgba(${accent.rgb},0.3)` : 'rgba(255,255,255,0.06)'
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 mb-3">
                  <item.icon size={14} className="text-white/60" />
                </div>
                <h4 className="text-xs font-bold text-white mb-0.5">{item.label}</h4>
                <p className="text-[11px] text-white/30">{item.desc}</p>
              </button>
            ))}
          </div>

          {/* Marketing Output Panels */}
          {openOutputId === 'teaser' && (
            <OutputPanel
              title="Launch Teaser Post Copy"
              body={suggestions?.teaser_post || "Hey! We are dropping something big in 3 days. Get ready to forge your path."}
              platforms={['Instagram', 'TikTok', 'Twitter']}
              accent={accent}
              onClose={() => setOpenOutputId(null)}
            />
          )}

          {openOutputId === 'email' && (
            <OutputPanel
              title={suggestions?.launch_email?.subject ? `Subject: ${suggestions.launch_email.subject}` : 'Launch Email'}
              body={suggestions?.launch_email?.body || "Launch day has arrived! Register today."}
              platforms={['Email list']}
              accent={accent}
              onClose={() => setOpenOutputId(null)}
            />
          )}

          {openOutputId === 'bts' && (
            <OutputPanel
              title="Behind-The-Scenes Post Copy"
              body={suggestions?.bts_post || "POV: Coding the final features. Launching tomorrow."}
              platforms={['Instagram', 'TikTok']}
              accent={accent}
              onClose={() => setOpenOutputId(null)}
            />
          )}
        </section>
      ) : (
        <div className="text-center py-8 rounded-2xl border" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#111' }}>
          <AlertCircle size={24} className="mx-auto mb-2 text-white/20" />
          <p className="text-sm text-white/40">Launch a product idea first during onboarding to generate social marketing assets.</p>
        </div>
      )}

      {/* ─── EMAIL MODAL ────────────────────────────────────────── */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border bg-forge-bg overflow-hidden flex flex-col"
            style={{ borderColor: 'rgba(255,255,255,0.12)', maxHeight: '90vh' }}>
            
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="font-bold text-sm">Review Cold Outreach Pitch</h3>
              <button onClick={() => setShowEmailModal(false)} className="text-white/40 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {loadingDraft ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <RefreshCw className="animate-spin text-white/40" />
                  <p className="text-xs text-white/40">Drafting personalized pitch via AI...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">To Address</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg border bg-black/40 text-xs text-white/70 outline-none"
                      style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                      disabled
                      value={creator?.email || 'mock-creator@example.com'}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Subject Line</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg border bg-black/20 text-xs text-white outline-none focus:border-white/20"
                      style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                      value={draftSubject}
                      onChange={e => setDraftSubject(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Email Body</label>
                    <textarea
                      rows={8}
                      className="w-full px-3 py-2 rounded-lg border bg-black/20 text-xs text-white outline-none focus:border-white/20 font-sans"
                      style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                      value={draftBody}
                      onChange={e => setDraftBody(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {!loadingDraft && (
              <div className="p-4 border-t border-white/10 flex justify-end gap-2">
                <button onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded bg-white/5 border border-white/10 hover:bg-white/10">
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                  className="forge-btn-primary text-xs py-2 px-4 gap-1.5"
                >
                  {sendingEmail ? <RefreshCw size={11} className="animate-spin" /> : <Send size={11} />}
                  {sendingEmail ? 'Sending...' : 'Send Pitch via Resend'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
