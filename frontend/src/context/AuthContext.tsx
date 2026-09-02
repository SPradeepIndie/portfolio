import { useEffect, useState, useCallback, type ReactNode } from 'react'
import { apiService, type AuthSession, type AuthUser } from '../services/api'
import {
  AUTH_EVENTS,
  clearAuthTokens,
  getRefreshToken,
  readAuthTokens,
  saveAuthTokens,
} from '../services/authStorage'
import { AuthContext, type AuthContextType } from './authContext'

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

  const loadCurrentUser = useCallback(async () => {
    const currentUser = await apiService.getCurrentUser()
    setUser(currentUser)
  }, [])

  const refreshSession = useCallback(async () => {
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
  }, [loadCurrentUser])

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
  }, [refreshSession, loadCurrentUser])

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
  }, [loadCurrentUser])

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

  const updateProfile = async (payload: { full_name?: string; email?: string; password?: string; phone_number?: string; github_link?: string; linkedin_address?: string }) => {
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
