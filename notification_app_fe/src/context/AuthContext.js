import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const mockToken = 'campus-connect-token'
const mockUser = {
  id: 'user-001',
  name: 'Campus Connect User',
  role: 'student',
}
const TOKEN_STORAGE_KEY = 'authToken'
const USER_STORAGE_KEY = 'userData'

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || mockToken
  })

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return mockUser
      }
    }
    return mockUser
  })

  useEffect(() => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  }, [token, user])

  const value = useMemo(
    () => ({ token, user, setToken, setUser }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth, mockToken, mockUser }
