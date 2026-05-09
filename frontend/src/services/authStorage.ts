export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

const AUTH_STORAGE_KEY = 'portfolio.auth.tokens'
const AUTH_CHANGE_EVENT = 'portfolio-auth-change'

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const notifyAuthChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
  }
}

export const readAuthTokens = (): AuthTokens | null => {
  if (!canUseStorage()) {
    return null
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as AuthTokens
  } catch {
    return null
  }
}

export const saveAuthTokens = (tokens: AuthTokens) => {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(tokens))
  notifyAuthChange()
}

export const clearAuthTokens = () => {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
  notifyAuthChange()
}

export const getAccessToken = () => readAuthTokens()?.accessToken ?? null
export const getRefreshToken = () => readAuthTokens()?.refreshToken ?? null

export const AUTH_EVENTS = {
  change: AUTH_CHANGE_EVENT,
}
