import { Megaphone, Calendar, Layers, Package, DollarSign, Link, Settings, ChevronLeft, ChevronRight, Users, Youtube, Instagram, Globe, Twitter } from 'lucide-react'
import WingLogo from '../ui/WingLogo'

const NAV_ITEMS = [
  { id: 'marketing',  icon: Megaphone,  label: 'Marketing',         badge: null },
  { id: 'youtube_leads', icon: Youtube, label: 'YouTube Leads',     badge: null },
  { id: 'instagram_leads', icon: Instagram, label: 'Instagram Leads', badge: null },
  { id: 'tiktok_leads',  icon: Globe,      label: 'TikTok Leads',    badge: null },
  { id: 'twitter_leads', icon: Twitter,    label: 'Twitter Leads',   badge: null },
  { id: 'calendar',   icon: Calendar,   label: 'Content Calendar',  badge: null },
  { id: 'community',  icon: Users,      label: 'Community',         badge: null },
  { id: 'studio',     icon: Layers,     label: 'Studio',            badge: null },
  { id: 'products',   icon: Package,    label: 'Products',          badge: null },
  { id: 'revenue',    icon: DollarSign, label: 'Revenue',           badge: null },
  { id: 'accounts',   icon: Link,       label: 'Accounts',          badge: null },
  { id: 'settings',   icon: Settings,   label: 'Settings',          badge: null },
]

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className="relative z-30 flex flex-col border-r flex-shrink-0 transition-all duration-300"
        style={{
          width: isOpen ? '220px' : '60px',
          borderColor: 'rgba(255,255,255,0.06)',
          background: '#0c0c0c',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 border-b flex-shrink-0 overflow-hidden"
          style={{
            borderColor: 'rgba(255,255,255,0.06)',
            padding: isOpen ? '18px 16px' : '18px 0',
            justifyContent: isOpen ? 'flex-start' : 'center',
          }}
        >
          <button
            onClick={() => setIsOpen(o => !o)}
            className="w-7 h-7 flex items-center justify-center flex-shrink-0"
          >
            <WingLogo size={22} />
          </button>
          {isOpen && (
            <span
              className="text-white font-semibold text-[14px] tracking-tight whitespace-nowrap"
              style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.15s' }}
            >
              Creator Forge
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-hidden">
          <div className="space-y-0.5 px-2">
            {NAV_ITEMS.map(({ id, icon: Icon, label, badge }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  title={!isOpen ? label : undefined}
                  className="w-full flex items-center rounded-xl transition-all duration-150 group overflow-hidden"
                  style={{
                    padding: isOpen ? '9px 10px' : '9px 0',
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    gap: isOpen ? '10px' : '0',
                    background: isActive
                      ? 'rgba(255,255,255,0.09)'
                      : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <Icon
                    size={16}
                    className="flex-shrink-0 transition-colors"
                    style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.38)' }}
                  />

                  {isOpen && (
                    <>
                      <span
                        className="text-[13px] font-medium flex-1 text-left whitespace-nowrap"
                        style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.5)' }}
                      >
                        {label}
                      </span>
                      {badge && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: 'white', color: 'black' }}
                        >
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Collapse toggle */}
        <div
          className="px-2 py-3 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <button
            onClick={() => setIsOpen(o => !o)}
            className="w-full flex items-center justify-center py-2 rounded-xl transition-all duration-150"
            style={{ color: 'rgba(255,255,255,0.2)' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'rgba(255,255,255,0.2)'
            }}
          >
            {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>
      </aside>
    </>
  )
}
