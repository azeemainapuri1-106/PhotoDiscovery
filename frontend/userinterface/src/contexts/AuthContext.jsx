import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AUTH_TOKEN_KEY } from '../config/env'
import { authService } from '../services'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authRequired, setAuthRequired] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    const controller = new AbortController()

    const handleUnauthorized = () => {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      setUser(null)
      setLoading(false)
      setAuthRequired(true)
    }

    window.addEventListener('photodiscovery:unauthorized', handleUnauthorized)

    if (!localStorage.getItem(AUTH_TOKEN_KEY)) {
      setLoading(false)
    } else {
      authService.getCurrentUser({ signal: controller.signal })
        .then((currentUser) => {
          if (active) setUser(currentUser)
        })
        .catch((requestError) => {
          if (active && requestError.name !== 'AbortError') {
            setError(requestError)
          }
        })
        .finally(() => {
          if (active) setLoading(false)
        })
    }

    return () => {
      active = false
      controller.abort()
      window.removeEventListener('photodiscovery:unauthorized', handleUnauthorized)
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const signedInUser = await authService.login(credentials)
    setUser(signedInUser)
    setError(null)
    setAuthRequired(false)
    return signedInUser
  }, [])

  const register = useCallback(async (details) => {
    const signedInUser = await authService.register(details)
    setUser(signedInUser)
    setError(null)
    setAuthRequired(false)
    return signedInUser
  }, [])

  const googleLogin = useCallback(async (idToken) => {
    const signedInUser = await authService.googleLogin(idToken)
    setUser(signedInUser)
    setError(null)
    setAuthRequired(false)
    return signedInUser
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setAuthRequired(false)
  }, [])

  const dismissAuthRequired = useCallback(() => setAuthRequired(false), [])

  const value = useMemo(() => ({
    user,
    loading,
    error,
    authRequired,
    login,
    register,
    googleLogin,
    logout,
    dismissAuthRequired,
  }), [user, loading, error, authRequired, login, register, googleLogin, logout, dismissAuthRequired])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider.')
  return context
}
