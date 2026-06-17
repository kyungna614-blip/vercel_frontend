/**
 * AuthPage — Sign in / Sign up page.
 * Handles both admin and creator authentication.
 *
 * Props:
 *   defaultMode  — 'signin' | 'signup'
 *   redirectTo   — where to go after auth
 *   userRole     — 'admin' | 'creator'
 *   creatorId    — optional, for creator onboarding redirect
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Loader2, ArrowRight, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import WingLogo from '../ui/WingLogo'

export default function AuthPage({ defaultMode = 'signin', redirectTo = '/', userRole = 'creator', creatorId }) {
  const navigate = useNavigate()
  const { signIn, signUp } = useAuth()

  const [mode, setMode] = useState(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const isSignUp = mode === 'signup'
  const isAdmin = userRole === 'admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (isSignUp) {
        await signUp(email.trim(), password, userRole)
        setSuccess('Account created! You can now sign in.')
        setMode('signin')
      } else {
        await signIn(email.trim(), password, userRole)
        navigate(redirectTo, { replace: true })
      }
    } catch (err) {
      const msg = err?.message || String(err)
      if (msg.includes('already registered') || msg.includes('already been registered')) {
        setError('This email is already registered. Sign in instead.')
        setMode('signin')
      } else if (msg.includes('Invalid login')) {
        setError('Incorrect email or password.')
      } else if (msg.includes('Email not confirmed')) {
        setError('Please verify your email first. Check your inbox.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#060407', color: 'white' }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: isAdmin
            ? 'radial-gradient(ellipse 120% 50% at 50% -5%, rgba(110,5,5,0.45) 0%, transparent 60%)'
            : 'radial-gradient(ellipse 120% 50% at 50% -5%, rgba(34,197,94,0.25) 0%, transparent 60%)',
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <WingLogo size={26} />
          <span className="text-white font-semibold text-[15px] tracking-tight">Creator Forge</span>
        </div>
        {isAdmin && (
          <span className="text-[11px] px-2.5 py-1 rounded-full font-bold"
            style={{ background: 'rgba(192,57,43,0.15)', color: '#e87070' }}>Admin</span>
        )}
      </header>

      {/* Auth card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">

          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              style={{ background: isAdmin ? 'rgba(192,57,43,0.15)' : 'rgba(34,197,94,0.12)' }}>
              <WingLogo size={28} />
            </div>
            <h1 className="text-[26px] font-extrabold tracking-tight mb-2">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {isAdmin
                ? (isSignUp ? 'Set up your admin account' : 'Sign in to the admin dashboard')
                : creatorId
                  ? (isSignUp ? 'Sign up to view your custom product ideas' : 'Sign in to access your portal')
                  : (isSignUp ? 'Create an account to get started' : 'Sign in to your account')
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/30 mb-1.5 block">Email</label>
              <div className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-all focus-within:border-white/20"
                style={{ background: '#111', borderColor: 'rgba(255,255,255,0.08)' }}>
                <Mail size={15} className="text-white/25 flex-shrink-0" />
                <input
                  type="email"
                  className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder-white/20"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/30 mb-1.5 block">
                {isAdmin ? 'Admin Password' : 'Password'}
              </label>
              <div className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-all focus-within:border-white/20"
                style={{ background: '#111', borderColor: 'rgba(255,255,255,0.08)' }}>
                <Lock size={15} className="text-white/25 flex-shrink-0" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder-white/20"
                  placeholder={isAdmin ? 'Enter admin password' : (isSignUp ? 'Min 6 characters' : 'Your password')}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="text-white/25 hover:text-white/50 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-red-400 leading-relaxed">{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="p-3 rounded-xl"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <p className="text-[12px] text-green-400 leading-relaxed">{success}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full flex items-center justify-center gap-2.5 text-[15px] font-bold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: isAdmin
                  ? 'linear-gradient(135deg, #c0392b, #a93226)'
                  : 'linear-gradient(135deg, #059669, #047857)',
                color: 'white',
                boxShadow: isAdmin
                  ? '0 4px 20px rgba(192,57,43,0.4)'
                  : '0 4px 20px rgba(5,150,105,0.4)',
              }}
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> {isSignUp ? 'Creating account...' : 'Signing in...'}</>
              ) : (
                <>{isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="text-center mt-6">
            <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => { setMode(isSignUp ? 'signin' : 'signup'); setError(null); setSuccess(null) }}
                className="ml-1.5 font-semibold transition-colors"
                style={{ color: isAdmin ? '#e87070' : '#4ade80' }}
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
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
