import { useState, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import Welcome from './components/onboarding/Welcome'
import NicheDiscovery from './components/onboarding/NicheDiscovery'
import Blueprint from './components/onboarding/Blueprint'
import Preview from './components/onboarding/Preview'
import Building from './components/onboarding/Building'
import Celebration from './components/onboarding/Celebration'
import DashboardLayout from './components/dashboard/DashboardLayout'
import CreatorOnboard from './components/creator/CreatorOnboard'
import CreatorPortal from './components/creator/CreatorPortal'
import AuthPage from './components/auth/AuthPage'
import { AuthProvider, useAuth } from './context/AuthContext'

export const ForgeContext = createContext(null)
export function useForge() { return useContext(ForgeContext) }

const STEPS = [
  'welcome',       // landing page
  'discover',      // niche keyword + limit → pipeline
  'blueprint',     // AI product ideas for selected creator
  'preview',       // preview selected idea
  'building',      // build animation
  'celebration',   // done
  'dashboard',     // creator dashboard
]

const PLATFORM_ACCENTS = {
  youtube:   { color: '#ff3b30', rgb: '255,59,48'   },
  instagram: { color: '#e1306c', rgb: '225,48,108'  },
  twitter:   { color: '#60a5fa', rgb: '96,165,250'  },
  tiktok:    { color: '#00c8c8', rgb: '0,200,200'   },
  other:     { color: '#ffffff', rgb: '255,255,255' },
}

export function getAccent(platform) {
  return PLATFORM_ACCENTS[platform] || PLATFORM_ACCENTS.other
}

export default function App() {
  const [step, setStep] = useState('welcome')
  const [creatorData, setCreatorData] = useState({
    id: '',
    url: '',
    platform: 'youtube',
    handle: '',
    name: '',
    followers: 0,
    avatar: null,
    avatarUrl: null,
    niche: '',
    recentPosts: [],
    engagementRate: 0,
    productName: '',
    buildItems: [],
  })

  const next = () => {
    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1])
  }

  const goTo = (s) => setStep(s)

  const updateCreator = (data) => {
    setCreatorData(prev => ({ ...prev, ...data }))
  }

  const accent = getAccent(creatorData.platform)
  const ctx = { step, next, goTo, creatorData, updateCreator, accent }

  if (step === 'dashboard') {
    return (
      <ForgeContext.Provider value={ctx}>
        <DashboardLayout />
      </ForgeContext.Provider>
    )
  }

  const screens = {
    'welcome':     <Welcome />,
    'discover':    <NicheDiscovery />,
    'blueprint':   <Blueprint />,
    'preview':     <Preview />,
    'building':    <Building />,
    'celebration': <Celebration />,
  }

  // ── Admin flow (requires auth) ──────────────────────────────────────
  const AdminApp = () => {
    const auth = useAuth()
    if (auth.loading) return <LoadingScreen />
    if (!auth.isAuthenticated) return <Navigate to="/auth/admin" replace />
    if (step === 'dashboard') return <DashboardLayout />
    // Admin starts at discover, never at welcome (that's the public landing)
    const adminStep = step === 'welcome' ? 'discover' : step
    return (
      <div className="min-h-screen bg-forge-bg text-white overflow-hidden">
        {screens[adminStep] || <NicheDiscovery />}
      </div>
    )
  }

  // ── Creator onboard (requires auth, redirects if not logged in) ────
  const ProtectedCreatorOnboard = () => {
    const auth = useAuth()
    const { creatorId } = useParams()
    if (auth.loading) return <LoadingScreen />
    if (!auth.isAuthenticated) return <Navigate to={`/auth/creator?redirect=/onboard/${creatorId}`} replace />
    return <CreatorOnboard />
  }

  // ── Creator portal (requires auth) ───────────────────────────────
  const ProtectedCreatorPortal = () => {
    const auth = useAuth()
    const { creatorId } = useParams()
    if (auth.loading) return <LoadingScreen />
    if (!auth.isAuthenticated) return <Navigate to={`/auth/creator?redirect=/portal/${creatorId}`} replace />
    return <CreatorPortal />
  }

  // ── Auth pages with redirect support ──────────────────────────
  const AdminAuthPage = () => {
    const auth = useAuth()
    if (auth.loading) return <LoadingScreen />
    if (auth.isAuthenticated) return <Navigate to="/admin" replace />
    return <AuthPage userRole="admin" redirectTo="/admin" defaultMode="signin" />
  }

  const CreatorAuthPage = () => {
    const auth = useAuth()
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect') || '/'
    if (auth.loading) return <LoadingScreen />
    if (auth.isAuthenticated) return <Navigate to={redirect} replace />
    const creatorId = redirect.match(/\/(onboard|portal)\/(.+)/)?.[2] || null
    return <AuthPage userRole="creator" redirectTo={redirect} defaultMode="signup" creatorId={creatorId} />
  }

  return (
    <AuthProvider>
      <ForgeContext.Provider value={ctx}>
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route path="/auth/admin"    element={<AdminAuthPage />} />
            <Route path="/auth/creator"  element={<CreatorAuthPage />} />

            {/* Creator-facing routes (from outreach email links — require auth) */}
            <Route path="/onboard/:creatorId" element={<ProtectedCreatorOnboard />} />
            <Route path="/portal/:creatorId"  element={<ProtectedCreatorPortal />} />

            {/* Landing page (public) */}
            <Route path="/welcome" element={
              <div className="min-h-screen bg-forge-bg text-white overflow-hidden"><Welcome /></div>
            } />

            {/* Admin dashboard (requires auth) */}
            <Route path="/admin/*" element={<AdminApp />} />

            {/* Root → public landing page */}
            <Route path="/" element={
              <div className="min-h-screen bg-forge-bg text-white overflow-hidden"><Welcome /></div>
            } />

            {/* Catch-all → landing */}
            <Route path="/*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ForgeContext.Provider>
    </AuthProvider>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#060407' }}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[14px] text-white/40">Loading...</p>
      </div>
    </div>
  )
}
