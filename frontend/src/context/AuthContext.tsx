import { createContext, useEffect, useState, type ReactNode } from 'react'
import { apiService, type AuthSession, type AuthUser } from '../services/api'
import {
  AUTH_EVENTS,
  clearAuthTokens,
  getRefreshToken,
  readAuthTokens,
  saveAuthTokens,
} from '../services/authStorage'

interface AuthContextType {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<boolean>
  updateProfile: (payload: { full_name?: string; email?: string; password?: string }) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const syncSession = (session: AuthSession | null, nextUser: AuthUser | null) => {
    if (!session) {
      setUser(nextUser)
      setAccessToken(null)
      setRefreshToken(null)
      return
    }

    saveAuthTokens({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    })
    setUser(nextUser)
    setAccessToken(session.accessToken)
    setRefreshToken(session.refreshToken)
  }

  const loadCurrentUser = async () => {
    const currentUser = await apiService.getCurrentUser()
    setUser(currentUser)
  }

  const refreshSession = async () => {
    const storedRefreshToken = getRefreshToken()
    if (!storedRefreshToken) {
      clearAuthTokens()
      setUser(null)
      setAccessToken(null)
      setRefreshToken(null)
      return false
    }

    try {
      const session = await apiService.refreshTokens(storedRefreshToken)
      syncSession(session, null)
      await loadCurrentUser()
      return true
    } catch {
      clearAuthTokens()
      setUser(null)
      setAccessToken(null)
      setRefreshToken(null)
      return false
    }
  }

  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedTokens = readAuthTokens()

      if (!storedTokens) {
        setIsLoading(false)
        return
      }

      setAccessToken(storedTokens.accessToken)
      setRefreshToken(storedTokens.refreshToken)

      try {
        await loadCurrentUser()
      } catch {
        await refreshSession()
      } finally {
        setIsLoading(false)
      }
    }

    bootstrapAuth()
  }, [])

  useEffect(() => {
    const handleAuthChange = async () => {
      const storedTokens = readAuthTokens()
      setAccessToken(storedTokens?.accessToken ?? null)
      setRefreshToken(storedTokens?.refreshToken ?? null)

      if (!storedTokens) {
        setUser(null)
        return
      }

      try {
        await loadCurrentUser()
      } catch {
        setUser(null)
      }
    }

    window.addEventListener(AUTH_EVENTS.change, handleAuthChange)
    return () => window.removeEventListener(AUTH_EVENTS.change, handleAuthChange)
  }, [])

  const login = async (email: string, password: string) => {
    const session = await apiService.login({ email, password })
    syncSession(session, session.user)
  }

  const register = async (fullName: string, email: string, password: string) => {
    await apiService.register({
      full_name: fullName,
      email,
      password,
    })
  }

  const logout = async () => {
    const storedRefreshToken = getRefreshToken()
    try {
      await apiService.logout(storedRefreshToken ?? undefined)
    } finally {
      clearAuthTokens()
      setUser(null)
      setAccessToken(null)
      setRefreshToken(null)
    }
  }

  const updateProfile = async (payload: { full_name?: string; email?: string; password?: string }) => {
    const updatedUser = await apiService.updateCurrentUser(payload)
    setUser(updatedUser)
  }

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: Boolean(user && accessToken),
    isLoading,
    login,
    register,
    logout,
    refreshSession,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
