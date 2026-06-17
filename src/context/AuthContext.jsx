/**
 * AuthContext — Auth state manager.
 * Uses Supabase when configured, otherwise falls back to local auth.
 * Admin fixed password: admin12345
 */
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, supabaseConfigured, getSession, signIn as sbSignIn, signUp as sbSignUp, signOut as sbSignOut } from '../services/supabase'

const AuthContext = createContext(null)
const ADMIN_PASSWORD = 'admin12345'
const LOCAL_AUTH_KEY = 'forge_local_auth'

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const role = user?.user_metadata?.role || user?.role || 'creator'
  const isAdmin = role === 'admin'

  // ── On mount: restore session ────────────────────────────────────
  useEffect(() => {
    if (supabaseConfigured) {
      getSession().then(s => {
        setSession(s)
        setUser(s?.user || null)
        setLoading(false)
      }).catch(() => setLoading(false))

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, s) => { setSession(s); setUser(s?.user || null) }
      )
      return () => subscription.unsubscribe()
    } else {
      // Local fallback: restore from localStorage
      try {
        const saved = JSON.parse(localStorage.getItem(LOCAL_AUTH_KEY))
        if (saved?.email) setUser(saved)
      } catch {}
      setLoading(false)
    }
  }, [])

  // ── Sign Up ──────────────────────────────────────────────────────
  const handleSignUp = async (email, password, userRole = 'creator') => {
    if (supabaseConfigured) {
      const data = await sbSignUp(email, password)
      if (data?.user) {
        await supabase.auth.updateUser({ data: { role: userRole } })
      }
      return data
    }
    // Local fallback
    if (userRole === 'admin' && password !== ADMIN_PASSWORD) {
      throw new Error('Invalid admin password.')
    }
    const localUser = { email, role: userRole, user_metadata: { role: userRole } }
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localUser))
    setUser(localUser)
    return { user: localUser }
  }

  // ── Sign In ──────────────────────────────────────────────────────
  const handleSignIn = async (email, password, userRole = 'creator') => {
    if (supabaseConfigured) {
      return await sbSignIn(email, password)
    }
    // Local fallback
    if (userRole === 'admin') {
      if (password !== ADMIN_PASSWORD) throw new Error('Incorrect admin password.')
      const localUser = { email, role: 'admin', user_metadata: { role: 'admin' } }
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localUser))
      setUser(localUser)
      return { user: localUser }
    }
    // Creator sign in — accept any email + password
    const localUser = { email, role: 'creator', user_metadata: { role: 'creator' } }
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localUser))
    setUser(localUser)
    return { user: localUser }
  }

  // ── Sign Out ─────────────────────────────────────────────────────
  const handleSignOut = async () => {
    if (supabaseConfigured) await sbSignOut()
    localStorage.removeItem(LOCAL_AUTH_KEY)
    setUser(null)
    setSession(null)
  }

  const value = {
    user,
    session,
    loading,
    role,
    isAdmin,
    isAuthenticated: !!user,
    supabaseConfigured,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
