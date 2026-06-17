import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Marketing from './Marketing'
import ContentCalendar from './ContentCalendar'
import Studio from './Studio'
import Community from './Community'
import Products from './Products'
import Revenue from './Revenue'
import Accounts from './Accounts'
import Settings from './Settings'
import ForgeChat from './ForgeChat'
import PlatformLeads from './PlatformLeads'
import { useForge } from '../../App'
import { useAuth } from '../../context/AuthContext'
import { Sparkles, LogOut } from 'lucide-react'
import WingLogo from '../ui/WingLogo'

const TAB_COMPONENTS = {
  marketing: Marketing,
  youtube_leads: (props) => <PlatformLeads platform="youtube" {...props} />,
  instagram_leads: (props) => <PlatformLeads platform="instagram" {...props} />,
  tiktok_leads: (props) => <PlatformLeads platform="tiktok" {...props} />,
  twitter_leads: (props) => <PlatformLeads platform="twitter" {...props} />,
  calendar: ContentCalendar,
  studio: Studio,
  community: Community,
  products: Products,
  revenue: Revenue,
  accounts: Accounts,
  settings: Settings,
}

const TAB_LABELS = {
  marketing: 'Marketing',
  youtube_leads: 'YouTube Leads',
  instagram_leads: 'Instagram Leads',
  tiktok_leads: 'TikTok Leads',
  twitter_leads: 'Twitter Leads',
  calendar: 'Content Calendar',
  studio: 'Studio',
  community: 'Community',
  products: 'Products',
  revenue: 'Revenue',
  accounts: 'Accounts',
  settings: 'Settings',
}

export default function DashboardLayout() {
  const { creatorData } = useForge()
  const auth = useAuth()
  const [activeTab, setActiveTab] = useState('marketing')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = () => {
    if (!creatorData.id) {
      setLoading(false)
      return
    }
    fetch(`/api/cofounder/creators/${creatorData.id}/dashboard`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch dashboard data')
        return res.json()
      })
      .then(data => {
        setDashboardData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchDashboardData()
  }, [creatorData.id])

  const TabComponent = TAB_COMPONENTS[activeTab] || Marketing

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080808' }}>
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden" style={{ minWidth: 0 }}>
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{
            borderColor: 'rgba(255,255,255,0.06)',
            background: 'rgba(8,8,8,0.97)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              <div className="space-y-1">
                <div className="w-4 h-px bg-current" />
                <div className="w-3 h-px bg-current" />
                <div className="w-4 h-px bg-current" />
              </div>
            </button>
            <div>
              <h1 className="text-[15px] font-semibold text-white tracking-tight">
                {TAB_LABELS[activeTab]}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live status */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {creatorData.productName || 'Creator Academy'} live
              </span>
            </div>

            {/* Forge Chat toggle */}
            <button
              onClick={() => setChatOpen(o => !o)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-150"
              style={{
                background: chatOpen ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                border: '1px solid',
                borderColor: chatOpen ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
                color: chatOpen ? 'white' : 'rgba(255,255,255,0.5)',
              }}
            >
              <Sparkles size={13} />
              <span className="text-[12px] font-medium hidden sm:block">Ask Forge</span>
            </button>

            {/* User info + Sign out */}
            <div className="flex items-center gap-2">
              <span className="text-[12px] hidden sm:block" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {auth?.user?.email?.split('@')[0] || creatorData.name || ''}
              </span>
              <div
                className="w-8 h-8 rounded-full border overflow-hidden flex items-center justify-center font-semibold text-[13px] flex-shrink-0"
                style={{ background: '#1a1a1a', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
              >
                {creatorData.avatarUrl ? (
                  <img src={creatorData.avatarUrl} alt="" className="w-full h-full object-cover"
                    onError={e => { e.currentTarget.style.display = 'none' }} />
                ) : (
                  (auth?.user?.email || creatorData.name || 'A').charAt(0).toUpperCase()
                )}
              </div>
              <button
                onClick={() => { auth?.signOut(); window.location.href = '/welcome' }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] transition-all"
                style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                title="Sign out"
              >
                <LogOut size={11} /> Out
              </button>
            </div>
          </div>
        </div>

        {/* Content row */}
        <div className="flex-1 flex overflow-hidden">
          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              <TabComponent dashboardData={dashboardData} refetch={fetchDashboardData} />
            )}
          </div>

          {/* Forge Chat panel */}
          <ForgeChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
      </main>
    </div>
  )
}
