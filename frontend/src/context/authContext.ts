import { createContext } from 'react'

export interface AuthContextType {
  user: unknown | null
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

export default AuthContext
