import { useState } from 'react'
import { useForge } from '../../App'
import {
  Package, Plus, ExternalLink, Users, DollarSign, BarChart2,
  Sparkles, RefreshCw, Check, ChevronRight, Radio, Edit3, Copy,
  Database, Code, Layers, FileText, Globe
} from 'lucide-react'

export default function Products({ dashboardData, refetch }) {
  const { creatorData } = useForge()
  const [activeSubTab, setActiveSubTab] = useState('landing-page') // 'landing-page' | 'api-scaffold'
  const [copiedText, setCopiedText] = useState(null)
  const [expandedPayload, setExpandedPayload] = useState(null) // endpoint path

  const selectedIdea = dashboardData?.selected_idea
  const productName = selectedIdea?.product_name || creatorData.productName || 'FitForge Academy'
  const category = selectedIdea?.product_category || 'course'
  const tagline = selectedIdea?.tagline || 'Branded coaching platforms'
  const description = selectedIdea?.description || 'Your own skill-building platform'

  // Extract outlines/scaffolds from selected idea
  const landingOutline = selectedIdea?.landing_page_outline
  const appScaffold = selectedIdea?.web_app_scaffold

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedText(id)
    setTimeout(() => setCopiedText(null), 2000)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 text-white">
      {/* Product Summary Header */}
      <div className="rounded-2xl border p-6 relative overflow-hidden"
        style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)` }} />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 inline-block"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
              {category.toUpperCase()}
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight mb-1">{productName}</h2>
            <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{tagline}</p>
            <p className="text-[13px] mt-2.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)', maxWidth: '550px' }}>
              {description}
            </p>
          </div>
          
          <div className="flex gap-2 flex-shrink-0">
            <button className="forge-btn-secondary text-[13px] py-2.5 px-4 gap-1.5">
              <ExternalLink size={13} />
              View site
            </button>
            <button className="forge-btn-primary text-[13px] py-2.5 px-4 gap-1.5">
              <Plus size={13} />
              Customize
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <button
          onClick={() => setActiveSubTab('landing-page')}
          className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all relative"
          style={{ color: activeSubTab === 'landing-page' ? 'white' : 'rgba(255,255,255,0.4)' }}
        >
          <FileText size={14} />
          Landing Page Design
          {activeSubTab === 'landing-page' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('api-scaffold')}
          className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all relative"
          style={{ color: activeSubTab === 'api-scaffold' ? 'white' : 'rgba(255,255,255,0.4)' }}
        >
          <Database size={14} />
          Database & API Scaffold
          {activeSubTab === 'api-scaffold' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
          )}
        </button>
      </div>

      {/* Sub-tab: Landing Page Outline */}
      {activeSubTab === 'landing-page' && (
        <div className="space-y-6">
          {landingOutline ? (
            <>
              {/* Theme Settings Card */}
              <div className="rounded-xl border p-5 space-y-4"
                style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Visual Identity</p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20"
                      style={{ background: landingOutline.theme?.primary_color || '#3b82f6' }} />
                    <div>
                      <p className="text-sm font-medium">Primary Accent Color</p>
                      <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {landingOutline.theme?.primary_color || '#3b82f6'}
                      </p>
                    </div>
                  </div>
                  <div className="h-8 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <div>
                    <p className="text-sm font-medium">Typography Family</p>
                    <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {landingOutline.theme?.font_family || 'Outfit'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sections Checklist Pipeline */}
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-1">Layout Sections</p>
                
                {landingOutline.sections?.map((section, idx) => (
                  <div key={section.id} className="rounded-xl border p-5 transition-all group relative"
                    style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
                    
                    <div className="absolute top-5 right-5 text-white/10 group-hover:text-white/20 transition-colors text-[24px] font-black pointer-events-none select-none">
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <span className="text-xs font-bold text-white/60 capitalize">{section.type?.charAt(0)}</span>
                      </div>

                      <div className="flex-1 min-w-0 pr-8">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white capitalize">{section.id} Section</span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded"
                            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
                            {section.type}
                          </span>
                        </div>

                        {/* Title Copy */}
                        {section.title && (
                          <h4 className="text-[16px] font-bold text-white/90 mb-1">{section.title}</h4>
                        )}
                        {/* Subtitle Copy */}
                        {section.subtitle && (
                          <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>{section.subtitle}</p>
                        )}
                        {/* CTA Text */}
                        {section.cta_text && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border text-[11px] font-semibold"
                            style={{ borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)' }}>
                            CTA: {section.cta_text}
                          </div>
                        )}

                        {/* List Items / Features */}
                        {section.items && (
                          <div className="grid sm:grid-cols-2 gap-3 mt-3">
                            {section.items.map((item, i) => (
                              <div key={i} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <p className="text-[12px] font-bold mb-0.5 text-white/80">{item.title}</p>
                                <p className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.description}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Pricing Tiers */}
                        {section.tiers && (
                          <div className="grid sm:grid-cols-2 gap-3 mt-3">
                            {section.tiers.map((tier, i) => (
                              <div key={i} className="rounded-lg p-3 border" 
                                style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                                <div className="flex justify-between items-baseline mb-2">
                                  <p className="text-[13px] font-bold text-white">{tier.name}</p>
                                  <p className="text-sm font-black text-white/90">{tier.price}</p>
                                </div>
                                <ul className="space-y-1">
                                  {tier.features?.map((f, fi) => (
                                    <li key={fi} className="text-[11px] flex items-center gap-1.5 text-white/50">
                                      <span style={{ color: landingOutline.theme?.primary_color || '#3b82f6' }}>✓</span> {f}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* FAQ Questions */}
                        {section.questions && (
                          <div className="space-y-2 mt-3">
                            {section.questions.map((faq, i) => (
                              <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <p className="text-[12px] font-bold text-white/80">Q: {faq.q}</p>
                                <p className="text-[11px] leading-snug mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>A: {faq.a}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 rounded-2xl border"
              style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#111' }}>
              <p className="text-sm text-white/40">Select an idea during onboarding to generate the landing page outline.</p>
            </div>
          )}
        </div>
      )}

      {/* Sub-tab: Database & API Scaffold */}
      {activeSubTab === 'api-scaffold' && (
        <div className="space-y-8">
          {appScaffold ? (
            <>
              {/* Database Schema Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Database size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
                  <p className="text-[12px] font-bold uppercase tracking-widest text-white/40">Database Schema</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {appScaffold.schema?.map(table => (
                    <div key={table.table_name} className="rounded-xl border p-4 space-y-3"
                      style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <span className="text-sm font-mono font-bold text-white">{table.table_name}</span>
                        <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>Table</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {table.columns?.map(col => (
                          <span key={col} className="text-[11px] font-mono px-2 py-0.5 rounded"
                            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}>
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Endpoints Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Code size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
                  <p className="text-[12px] font-bold uppercase tracking-widest text-white/40">REST API Endpoints</p>
                </div>

                <div className="space-y-3">
                  {appScaffold.endpoints?.map(ep => {
                    const methodColors = {
                      GET: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', text: '#10b981' },
                      POST: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', text: '#3b82f6' },
                      PUT: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', text: '#f59e0b' },
                      DELETE: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', text: '#ef4444' }
                    }
                    const style = methodColors[ep.method] || methodColors.GET
                    const isExpanded = expandedPayload === ep.path

                    return (
                      <div key={ep.path} className="rounded-xl border overflow-hidden"
                        style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center justify-between p-4 flex-wrap gap-3 cursor-pointer"
                          onClick={() => setExpandedPayload(isExpanded ? null : ep.path)}>
                          
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded border"
                              style={{ background: style.bg, borderColor: style.border, color: style.text }}>
                              {ep.method}
                            </span>
                            <span className="text-[13px] font-mono text-white/80 truncate font-semibold">{ep.path}</span>
                          </div>

                          <div className="flex items-center gap-4 ml-auto">
                            <span className="text-[12px] hidden sm:inline" style={{ color: 'rgba(255,255,255,0.4)' }}>
                              {ep.description}
                            </span>
                            <span className="text-white/20 text-xs">{isExpanded ? '▲' : '▼'}</span>
                          </div>
                        </div>

                        {/* Expanded Payload Viewer */}
                        {isExpanded && (
                          <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0a0a0a' }}>
                            <div className="grid sm:grid-cols-2 gap-4">
                              {/* Request Payload */}
                              <div>
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/35">Request Body</span>
                                  {ep.request_payload !== 'N/A' && (
                                    <button
                                      onClick={() => handleCopy(ep.request_payload, `${ep.path}-req`)}
                                      className="text-[10px] flex items-center gap-1 hover:text-white transition-colors"
                                      style={{ color: 'rgba(255,255,255,0.3)' }}
                                    >
                                      {copiedText === `${ep.path}-req` ? <Check size={8} /> : <Copy size={8} />}
                                      {copiedText === `${ep.path}-req` ? 'Copied' : 'Copy'}
                                    </button>
                                  )}
                                </div>
                                <pre className="text-[11px] font-mono p-3 rounded-lg overflow-x-auto border"
                                  style={{ background: '#070707', borderColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}>
                                  {ep.request_payload}
                                </pre>
                              </div>

                              {/* Response Payload */}
                              <div>
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/35">Response Payload</span>
                                  <button
                                    onClick={() => handleCopy(ep.response_payload, `${ep.path}-resp`)}
                                    className="text-[10px] flex items-center gap-1 hover:text-white transition-colors"
                                    style={{ color: 'rgba(255,255,255,0.3)' }}
                                  >
                                    {copiedText === `${ep.path}-resp` ? <Check size={8} /> : <Copy size={8} />}
                                    {copiedText === `${ep.path}-resp` ? 'Copied' : 'Copy'}
                                  </button>
                                </div>
                                <pre className="text-[11px] font-mono p-3 rounded-lg overflow-x-auto border"
                                  style={{ background: '#070707', borderColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}>
                                  {ep.response_payload}
                                </pre>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 rounded-2xl border"
              style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#111' }}>
              <p className="text-sm text-white/40">Select an idea during onboarding to generate the database and API scaffold.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
